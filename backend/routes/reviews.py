"""
Reviews & Discovery API Routes
- POST /api/reviews — Submit a review for a place
- GET /api/reviews — Get reviews for a place
- GET /api/places/nearby — Discover nearby restaurants/gyms
"""

from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
import json
import os

router = APIRouter(prefix="/api", tags=["reviews"])

# Local storage file for reviews
REVIEWS_FILE = os.path.join(os.path.dirname(os.path.dirname(__file__)), "backend", "data", "user_reviews.json")


def _load_reviews() -> list[dict]:
    """Load reviews from local JSON file."""
    try:
        # Try relative path first
        path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "data", "user_reviews.json")
        if os.path.exists(path):
            with open(path, "r") as f:
                return json.load(f)
    except Exception:
        pass
    return []


def _save_reviews(reviews: list[dict]):
    """Save reviews to local JSON file."""
    try:
        path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "data", "user_reviews.json")
        os.makedirs(os.path.dirname(path), exist_ok=True)
        with open(path, "w") as f:
            json.dump(reviews, f, indent=2, default=str)
    except Exception as e:
        print(f"Warning: Could not save reviews: {e}")


class ReviewSubmit(BaseModel):
    place_name: str
    place_type: str  # "food", "gym", "accommodation"
    rating: int  # 1-5
    text: str


@router.post("/reviews")
async def submit_review(review: ReviewSubmit):
    """Submit a user review for a restaurant, gym, or accommodation."""
    reviews = _load_reviews()
    reviews.append({
        "place_name": review.place_name,
        "place_type": review.place_type,
        "rating": review.rating,
        "text": review.text,
        "timestamp": datetime.utcnow().isoformat(),
    })
    _save_reviews(reviews)
    return {"status": "ok", "message": "Review submitted successfully"}


@router.get("/reviews")
async def get_reviews(place_name: Optional[str] = None, place_type: Optional[str] = None):
    """Get reviews, optionally filtered by place name or type."""
    reviews = _load_reviews()
    if place_name:
        reviews = [r for r in reviews if r.get("place_name", "").lower() == place_name.lower()]
    if place_type:
        reviews = [r for r in reviews if r.get("place_type", "") == place_type]
    return {"reviews": reviews, "count": len(reviews)}


# ─── Nearby Places Discovery ──────────────────────────────────────────

# Curated restaurant data per area for demo purposes
NEARBY_RESTAURANTS = {
    "Whitefield": [
        {"name": "Meghana Foods Whitefield", "address": "ITPL Main Rd, Whitefield, Bengaluru 560066", "rating": 4.5, "type": "restaurant", "avg_meal": 350},
        {"name": "Empire Restaurant", "address": "Varthur Main Rd, Whitefield, Bengaluru 560066", "rating": 4.2, "type": "restaurant", "avg_meal": 280},
        {"name": "Truffles Whitefield", "address": "Forum Value Mall, Whitefield, Bengaluru 560066", "rating": 4.4, "type": "restaurant", "avg_meal": 400},
        {"name": "Nandhana Palace", "address": "EPIP Zone, Whitefield, Bengaluru 560066", "rating": 4.1, "type": "restaurant", "avg_meal": 250},
        {"name": "A2B Veg Restaurant", "address": "Whitefield Main Rd, Bengaluru 560066", "rating": 4.0, "type": "restaurant", "avg_meal": 180},
    ],
    "HSR Layout": [
        {"name": "Meghana Foods HSR", "address": "27th Main, HSR Layout, Bengaluru 560102", "rating": 4.5, "type": "restaurant", "avg_meal": 350},
        {"name": "Toit Brewpub", "address": "HSR Layout, Bengaluru 560102", "rating": 4.6, "type": "restaurant", "avg_meal": 500},
        {"name": "Third Wave Coffee", "address": "Sector 1, HSR Layout, Bengaluru 560102", "rating": 4.3, "type": "cafe", "avg_meal": 250},
        {"name": "Rameshwaram Cafe", "address": "HSR Layout, Bengaluru 560102", "rating": 4.4, "type": "restaurant", "avg_meal": 200},
        {"name": "Bowl Company", "address": "HSR Layout, Bengaluru 560102", "rating": 4.1, "type": "restaurant", "avg_meal": 220},
    ],
    "Koramangala": [
        {"name": "Meghana Foods Koramangala", "address": "4th Block, Koramangala, Bengaluru 560034", "rating": 4.5, "type": "restaurant", "avg_meal": 350},
        {"name": "Truffles Koramangala", "address": "St Marks Rd, Koramangala, Bengaluru 560034", "rating": 4.5, "type": "restaurant", "avg_meal": 400},
        {"name": "Cafe Azzure", "address": "5th Block, Koramangala, Bengaluru 560034", "rating": 4.2, "type": "cafe", "avg_meal": 300},
        {"name": "Chinita Real Mexican Food", "address": "6th Block, Koramangala, Bengaluru 560034", "rating": 4.3, "type": "restaurant", "avg_meal": 450},
    ],
    "Indiranagar": [
        {"name": "Toit Indiranagar", "address": "100 Feet Rd, Indiranagar, Bengaluru 560038", "rating": 4.6, "type": "restaurant", "avg_meal": 500},
        {"name": "The Permit Room", "address": "12th Main, Indiranagar, Bengaluru 560038", "rating": 4.4, "type": "restaurant", "avg_meal": 450},
        {"name": "Glen's Bakehouse", "address": "12th Main, Indiranagar, Bengaluru 560038", "rating": 4.3, "type": "cafe", "avg_meal": 280},
        {"name": "Brahmin's Coffee Bar", "address": "Near CMH Rd, Indiranagar, Bengaluru 560038", "rating": 4.5, "type": "restaurant", "avg_meal": 100},
    ],
    "Kharadi": [
        {"name": "Vaishali Restaurant", "address": "FC Road, Kharadi, Pune 411014", "rating": 4.3, "type": "restaurant", "avg_meal": 220},
        {"name": "Panchami", "address": "EON Free Zone, Kharadi, Pune 411014", "rating": 4.1, "type": "restaurant", "avg_meal": 250},
        {"name": "The Starter Pune", "address": "Kharadi, Pune 411014", "rating": 4.0, "type": "restaurant", "avg_meal": 300},
    ],
    "Hinjewadi": [
        {"name": "Hotel Rajwada", "address": "Phase 1, Hinjewadi, Pune 411057", "rating": 4.2, "type": "restaurant", "avg_meal": 250},
        {"name": "McDonald's Hinjewadi", "address": "Phase 2, Hinjewadi, Pune 411057", "rating": 3.8, "type": "restaurant", "avg_meal": 200},
        {"name": "Domino's Pizza", "address": "Phase 1, Hinjewadi, Pune 411057", "rating": 3.9, "type": "restaurant", "avg_meal": 250},
    ],
}

# Default fallback
DEFAULT_RESTAURANTS = [
    {"name": "Local Dining Hub", "address": "Near IT Hub", "rating": 4.0, "type": "restaurant", "avg_meal": 200},
    {"name": "Street Food Corner", "address": "Main Road", "rating": 4.3, "type": "restaurant", "avg_meal": 100},
    {"name": "South Indian Meals", "address": "Junction Area", "rating": 4.1, "type": "restaurant", "avg_meal": 150},
    {"name": "North Indian Thali", "address": "Market Area", "rating": 4.0, "type": "restaurant", "avg_meal": 200},
    {"name": "Café & Bakery", "address": "High Street", "rating": 3.9, "type": "cafe", "avg_meal": 250},
]


@router.get("/places/nearby")
async def discover_nearby(area: str = "", city: str = "", type: str = "restaurant"):
    """Discover nearby restaurants/cafes in a given area."""
    # Try exact match first, then partial
    places = NEARBY_RESTAURANTS.get(area, [])
    if not places:
        # Try partial match
        for key, vals in NEARBY_RESTAURANTS.items():
            if key.lower() in area.lower() or area.lower() in key.lower():
                places = vals
                break

    if not places:
        # Generate fallback with city/area context
        places = [
            {**p, "address": f"{p['address']}, {area}, {city}" if area else f"{p['address']}, {city}"}
            for p in DEFAULT_RESTAURANTS
        ]

    return {"places": places, "area": area, "city": city, "count": len(places)}
