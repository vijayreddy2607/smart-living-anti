"""
Google Places API integration for fetching real-world restaurants and gyms.
Uses the newer Places API (New) endpoints.
Supports salary-based filtering to recommend budget-appropriate places.
"""
from __future__ import annotations
import os
import httpx

PLACES_API_KEY = os.getenv("GOOGLE_PLACES_API_KEY")


# ─── Salary → Price Level Mapping ──────────────────────────────────────
def _salary_to_price_levels(monthly_salary: int) -> list[str]:
    """Map monthly salary to appropriate Google Places price levels.
    Returns a list of acceptable price levels for the user's budget.

    Google Places price levels:
      PRICE_LEVEL_FREE, PRICE_LEVEL_INEXPENSIVE,
      PRICE_LEVEL_MODERATE, PRICE_LEVEL_EXPENSIVE,
      PRICE_LEVEL_VERY_EXPENSIVE
    """
    if monthly_salary <= 25000:
        return ["PRICE_LEVEL_FREE", "PRICE_LEVEL_INEXPENSIVE"]
    elif monthly_salary <= 50000:
        return ["PRICE_LEVEL_FREE", "PRICE_LEVEL_INEXPENSIVE", "PRICE_LEVEL_MODERATE"]
    elif monthly_salary <= 100000:
        return ["PRICE_LEVEL_INEXPENSIVE", "PRICE_LEVEL_MODERATE", "PRICE_LEVEL_EXPENSIVE"]
    else:
        return ["PRICE_LEVEL_MODERATE", "PRICE_LEVEL_EXPENSIVE", "PRICE_LEVEL_VERY_EXPENSIVE"]


def _salary_budget_label(monthly_salary: int) -> str:
    """Human-readable budget tier for AI prompts."""
    if monthly_salary <= 25000:
        return "budget-friendly (under ₹200/meal)"
    elif monthly_salary <= 50000:
        return "mid-range (₹200-₹500/meal)"
    elif monthly_salary <= 100000:
        return "upper mid-range (₹400-₹800/meal)"
    else:
        return "premium (₹800+/meal)"


def _salary_gym_budget(monthly_salary: int) -> str:
    """Monthly gym budget based on salary."""
    if monthly_salary <= 25000:
        return "budget gym (₹500-₹1,500/month)"
    elif monthly_salary <= 50000:
        return "standard gym (₹1,500-₹3,000/month)"
    elif monthly_salary <= 100000:
        return "premium gym (₹3,000-₹6,000/month)"
    else:
        return "luxury gym or crossfit (₹5,000+/month)"


async def fetch_places_for_area(
    area_name: str,
    city: str,
    place_type: str,
    max_results: int = 5,
    monthly_salary: int = 50000,
) -> list[dict]:
    """
    Search for places using Google Places API Text Search (New).
    `place_type` examples: "restaurant", "gym"
    Filters results based on the user's salary bracket.
    """
    if not PLACES_API_KEY:
        return []

    url = "https://places.googleapis.com/v1/places:searchText"
    headers = {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": PLACES_API_KEY,
        "X-Goog-FieldMask": "places.displayName.text,places.formattedAddress,places.rating,places.location,places.priceLevel",
    }

    # Build a salary-aware search query
    if place_type == "restaurant":
        budget_label = _salary_budget_label(monthly_salary)
        query = f"best {budget_label} restaurants in {area_name}, {city}"
    elif place_type == "gym":
        gym_label = _salary_gym_budget(monthly_salary)
        query = f"best {gym_label} in {area_name}, {city}"
    else:
        query = f"best {place_type} in {area_name}, {city}"

    payload = {
        "textQuery": query,
        "pageSize": max_results + 3,  # Fetch extra to filter
    }

    # Add price level filter for restaurants
    acceptable_levels = _salary_to_price_levels(monthly_salary)

    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            resp = await client.post(url, headers=headers, json=payload)
            resp.raise_for_status()
            data = resp.json()

            results = []
            for p in data.get("places", []):
                price_level = p.get("priceLevel", "PRICE_LEVEL_UNSPECIFIED")

                # Filter: keep places matching the user's budget
                if place_type == "restaurant" and price_level != "PRICE_LEVEL_UNSPECIFIED":
                    if price_level not in acceptable_levels:
                        continue

                results.append({
                    "name": p.get("displayName", {}).get("text", "Unknown"),
                    "address": p.get("formattedAddress", f"{area_name}, {city}"),
                    "rating": p.get("rating", 4.0),
                    "price_level": price_level,
                    "location": p.get("location", {"latitude": 0, "longitude": 0}),
                })

            # Return up to max_results
            return results[:max_results]
    except Exception as e:
        print(f"Places API Error ({area_name} / {place_type}): {e}")
        return []


async def get_nearby_restaurants(area_name: str, city: str = "Pune", monthly_salary: int = 50000) -> list[dict]:
    """Fetch salary-appropriate restaurants near the given area."""
    return await fetch_places_for_area(area_name, city, "restaurant", max_results=5, monthly_salary=monthly_salary)


async def get_nearby_gyms(area_name: str, city: str = "Pune", monthly_salary: int = 50000) -> list[dict]:
    """Fetch salary-appropriate gyms near the given area."""
    return await fetch_places_for_area(area_name, city, "gym", max_results=3, monthly_salary=monthly_salary)
