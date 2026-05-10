"""
GET /api/dashboard/history   — returns the logged-in user's recommendation history
GET /api/dashboard/stats     — returns city summary stats for the dashboard
"""
from __future__ import annotations

from fastapi import APIRouter, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi import HTTPException

import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from auth_utils import decode_token

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])
security = HTTPBearer()


async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    payload = decode_token(credentials.credentials)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    return payload


@router.get("/history")
async def get_history(current_user: dict = Depends(get_current_user)):
    from main import db

    user_id = current_user.get("sub")
    all_logs = await db["recommendation_logs"].find({}).to_list(length=500)

    # Filter to logs belonging to this user
    user_logs = [log for log in all_logs if log.get("user_id") == user_id]

    # Sort newest-first
    user_logs.sort(key=lambda x: x.get("timestamp", ""), reverse=True)

    # Shape into clean history cards (latest 10)
    history = []
    for log in user_logs[:10]:
        top_areas = log.get("top_area_names", [])
        top_scores = log.get("top_area_scores", [])
        history.append({
            "timestamp":          log.get("timestamp"),
            "job_location":       log.get("job_location"),
            "monthly_salary":     log.get("monthly_salary"),
            "emi_commitments":    log.get("emi_commitments", 0),
            "goal_description":   log.get("goal_description"),
            "goal_timeframe_months": log.get("goal_timeframe_months"),
            "estimated_goal_cost": log.get("estimated_goal_cost"),
            "computed_savings_goal": log.get("computed_savings_goal"),
            "sustainability":     log.get("sustainability"),
            "average_score":      log.get("average_score"),
            "top_area":           top_areas[0] if top_areas else "—",
            "top_area_score":     top_scores[0] if top_scores else 0,
            "all_top_areas":      top_areas,
        })

    return {
        "user_id":    user_id,
        "user_name":  current_user.get("name"),
        "total_runs": len(user_logs),
        "history":    history,
    }


@router.get("/stats")
async def get_stats():
    """Public endpoint — aggregated city stats for the dashboard header."""
    from main import db

    all_areas = await db["areas"].find({}).to_list(length=200)
    total_areas = len(all_areas)

    # Compute rent range across all cities
    all_pg_rents = [a["rent_estimates"]["PG"] for a in all_areas if "rent_estimates" in a]
    all_1bhk_rents = [a["rent_estimates"]["1BHK"] for a in all_areas if "rent_estimates" in a]
    min_rent = min(all_pg_rents) if all_pg_rents else 5000
    max_rent = max(all_1bhk_rents) if all_1bhk_rents else 30000

    # Count cities
    cities = list(set(a.get("city", "") for a in all_areas))

    return {
        "areas_covered":    total_areas,
        "avg_rent_range":   f"₹{min_rent:,} – ₹{max_rent:,}",
        "top_it_hub":       "Multi-City",
        "top_lifestyle":    "Koramangala",
        "top_budget_area":  "Shivajinagar",
        "avg_commute_mins": 18,
        "city":             f"{len(cities)} Cities Covered",
        "data_updated":     "2026",
    }
