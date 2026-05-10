"""
Smart Living Ecosystem Platform — FastAPI Entry Point
MongoDB-backed with auto-seeding on startup.
Falls back to local JSON files if MongoDB is unavailable.
"""

from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import certifi
import json
import os

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "")
BASE_DIR  = os.path.dirname(os.path.abspath(__file__))
DATA_DIR  = os.path.join(BASE_DIR, "data")

# ─── Module-level DB reference (imported by routes) ────────────────────
db = None
_client = None
USE_MONGO = False  # Flag for routes to check


def _load_json(filename: str) -> list[dict]:
    """Load a JSON file from the data directory."""
    filepath = os.path.join(DATA_DIR, filename)
    with open(filepath, "r") as f:
        return json.load(f)


class LocalJsonCollection:
    """Drop-in replacement for MongoDB collection using local JSON files.
    Supports find().to_list() and insert_one()."""

    def __init__(self, data: list[dict]):
        self._data = data

    def find(self, query: dict = {}):
        return self

    async def to_list(self, length: int = 100) -> list[dict]:
        return self._data[:length]

    async def find_one(self, query: dict = {}) -> dict | None:
        """Return first matching doc. Supports simple equality queries."""
        for doc in self._data:
            if all(doc.get(k) == v for k, v in query.items()):
                return doc
        return None

    async def count_documents(self, query: dict = {}) -> int:
        return len(self._data)

    async def insert_one(self, doc: dict):
        import uuid
        doc["_id"] = str(uuid.uuid4())
        self._data.append(doc)

        class InsertResult:
            def __init__(self, id): self.inserted_id = id
        return InsertResult(doc["_id"])

    async def insert_many(self, docs: list[dict]):
        self._data.extend(docs)


class LocalJsonDB:
    """Drop-in replacement for MongoDB database using local JSON files."""

    def __init__(self):
        self._collections: dict[str, LocalJsonCollection] = {}

    def __getitem__(self, name: str) -> LocalJsonCollection:
        if name not in self._collections:
            # Try to load from JSON file
            mapping = {
                "areas": "areas.json",
                "cost_estimates": "cost_estimates.json",
                "reviews": "reviews.json",
                "recommendation_logs": None,  # in-memory
                "users": None,                # in-memory (real data goes to MongoDB)
            }
            filename = mapping.get(name)
            if filename:
                try:
                    data = _load_json(filename)
                except FileNotFoundError:
                    data = []
            else:
                data = []
            self._collections[name] = LocalJsonCollection(data)
        return self._collections[name]


async def _seed_collection(collection_name: str, json_filename: str):
    """Seed a MongoDB collection from a local JSON file if empty."""
    global db
    count = await db[collection_name].count_documents({})
    if count == 0:
        data = _load_json(json_filename)
        if data:
            await db[collection_name].insert_many(data)
            print(f"  ✅ Seeded {collection_name}: {len(data)} documents")
    else:
        print(f"  ⏭️  {collection_name}: already has {count} documents")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Connect to MongoDB on startup, seed data, disconnect on shutdown.
    Falls back to local JSON files if MongoDB is unavailable."""
    global db, _client, USE_MONGO

    if MONGO_URI:
        print("\n🔗 Connecting to MongoDB Atlas...")
        try:
            _client = AsyncIOMotorClient(MONGO_URI, tlsCAFile=certifi.where(),
                                          serverSelectionTimeoutMS=5000)
            # Test connection
            await _client.admin.command("ping")
            db = _client.get_default_database()
            USE_MONGO = True
            print("  ✅ MongoDB connected successfully")

            # Seed data
            print("\n📦 Seeding collections...")
            await _seed_collection("areas", "areas.json")
            await _seed_collection("cost_estimates", "cost_estimates.json")
            await _seed_collection("reviews", "reviews.json")
            print()
        except Exception as e:
            print(f"  ⚠️  MongoDB connection failed: {e}")
            print("  📂 Falling back to local JSON files\n")
            db = LocalJsonDB()
            USE_MONGO = False
    else:
        print("\n📂 No MONGO_URI set — using local JSON files\n")
        db = LocalJsonDB()
        USE_MONGO = False

    yield

    # Shutdown
    if _client and USE_MONGO:
        _client.close()
        print("🔌 MongoDB disconnected")


# ─── App ───────────────────────────────────────────────────────────────
app = FastAPI(
    title="Smart Living Ecosystem API",
    description=(
        "Decision-support system for city relocation. "
        "Scores and ranks neighborhoods based on financial viability, "
        "commute, lifestyle, and daily routine feasibility."
    ),
    version="1.0.0",
    lifespan=lifespan,
)

# CORS — allow all common local dev ports
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://localhost:3000",
        "http://localhost:8080",
        "http://localhost:8081",
        "http://localhost:8082",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Routes ────────────────────────────────────────────────────────────
from routes.recommend  import router as recommend_router
from routes.auth       import router as auth_router
from routes.dashboard  import router as dashboard_router
app.include_router(recommend_router)
app.include_router(auth_router)
app.include_router(dashboard_router)


@app.get("/")
async def health():
    return {
        "status": "healthy",
        "service": "Smart Living Ecosystem API",
        "version": "1.0.0",
        "database": "MongoDB Atlas" if USE_MONGO else "Local JSON (fallback)",
    }
