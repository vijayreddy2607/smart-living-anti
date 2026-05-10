"""
POST /api/auth/register   — create a new user
POST /api/auth/login      — authenticate, get JWT
GET  /api/auth/me         — return current user info (protected)
"""
from __future__ import annotations

from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, EmailStr, Field
from datetime import datetime, timezone
import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from auth_utils import hash_password, verify_password, create_access_token, decode_token

router = APIRouter(prefix="/api/auth", tags=["auth"])
security = HTTPBearer()


# ─── Schemas ──────────────────────────────────────────────────────────
class RegisterRequest(BaseModel):
    name:     str   = Field(..., min_length=2, max_length=60)
    email:    str   = Field(..., description="Valid email address")
    password: str   = Field(..., min_length=6)


class LoginRequest(BaseModel):
    email:    str
    password: str


class AuthResponse(BaseModel):
    access_token: str
    token_type:   str = "bearer"
    user: dict


# ─── Helpers ──────────────────────────────────────────────────────────
async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    payload = decode_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    return payload


# ─── Routes ───────────────────────────────────────────────────────────
@router.post("/register", response_model=AuthResponse)
async def register(req: RegisterRequest):
    from main import db

    # Normalize email
    email = req.email.lower().strip()

    # Check duplicate
    existing = await db["users"].find_one({"email": email})
    if existing:
        raise HTTPException(status_code=400, detail="An account with this email already exists.")

    user_doc = {
        "name":          req.name,
        "email":         email,
        "password_hash": hash_password(req.password),
        "created_at":    datetime.now(timezone.utc).isoformat(),
    }
    result = await db["users"].insert_one(user_doc)
    user_id = str(result.inserted_id)

    token = create_access_token({"sub": user_id, "email": email, "name": req.name})
    return AuthResponse(
        access_token=token,
        user={"id": user_id, "name": req.name, "email": email},
    )


@router.post("/login", response_model=AuthResponse)
async def login(req: LoginRequest):
    from main import db

    email = req.email.lower().strip()
    user = await db["users"].find_one({"email": email})

    if not user or not verify_password(req.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password.")

    user_id = str(user["_id"])
    name    = user["name"]

    token = create_access_token({"sub": user_id, "email": email, "name": name})
    return AuthResponse(
        access_token=token,
        user={"id": user_id, "name": name, "email": email},
    )


@router.get("/me")
async def me(current_user: dict = Depends(get_current_user)):
    return {
        "id":    current_user.get("sub"),
        "email": current_user.get("email"),
        "name":  current_user.get("name"),
    }
