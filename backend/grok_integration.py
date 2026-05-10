"""
Smart Living Ecosystem — Groq Integration (Llama 3.3-70b)
Uses Groq's ultra-fast inference for speed-critical tasks:

  1. compute_savings_goal()       — financial math, simple structured JSON
  2. generate_global_ai_insight() — single-sentence, latency-sensitive
  3. generate_travel_suggestions() — city-aware weekend trip planning

Called from recommend.py alongside gemini_integration.py.
"""

from __future__ import annotations
import os
import json
from openai import AsyncOpenAI

XAI_API_KEY = os.getenv("XAI_API_KEY", "")

_client: AsyncOpenAI | None = None


def _get_client() -> AsyncOpenAI:
    global _client
    if _client is None:
        _client = AsyncOpenAI(
            api_key=XAI_API_KEY,
            base_url="https://api.groq.com/openai/v1",
        )
    return _client


# ─── Task 1: AI Savings Goal Computation (Speed-Critical) ─────────────
async def compute_savings_goal(
    goal_description: str,
    goal_timeframe_months: int,
    monthly_salary: int,
    emi_commitments: int,
) -> dict:
    """Use Groq (Llama 3.3 — ultra-fast) to estimate goal cost and monthly savings."""
    if not XAI_API_KEY:
        return _savings_fallback(goal_description, goal_timeframe_months, monthly_salary, emi_commitments)

    client = _get_client()
    disposable = monthly_salary - emi_commitments

    prompt = f"""You are a financial advisor for someone relocating to an Indian city.

**User Context:**
- Monthly Salary: ₹{monthly_salary:,}
- EMI Commitments: ₹{emi_commitments:,}
- Disposable (after EMI): ₹{disposable:,}
- Goal: "{goal_description}"
- Timeframe: {goal_timeframe_months} months

Estimate the REALISTIC cost of this goal in Indian Rupees (₹).
Then calculate the monthly savings needed.

Return ONLY a valid JSON object (no markdown, no explanation):
{{
  "estimated_goal_cost": <integer in ₹>,
  "monthly_savings_needed": <integer in ₹>,
  "savings_plan_summary": "<1-2 sentences mentioning actual numbers>",
  "goal_feasibility": "<EASY | ACHIEVABLE | CHALLENGING | VERY_HARD>",
  "ai_tip": "<1 actionable sentence specific to this goal>"
}}"""

    try:
        response = await client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.4,
            max_tokens=400,
        )
        content = response.choices[0].message.content.strip()
        if content.startswith("```"):
            content = "\n".join(content.split("\n")[1:])
            content = content.rstrip("`").strip()

        result = json.loads(content)
        return {
            "estimated_goal_cost":    int(result.get("estimated_goal_cost", 0)),
            "monthly_savings_needed": int(result.get("monthly_savings_needed", 0)),
            "savings_plan_summary":   str(result.get("savings_plan_summary", "")),
            "goal_feasibility":       str(result.get("goal_feasibility", "ACHIEVABLE")),
            "ai_tip":                 str(result.get("ai_tip", "")),
        }

    except Exception as e:
        print(f"  ⚠️  Groq savings goal error: {e}")
        return _savings_fallback(goal_description, goal_timeframe_months, monthly_salary, emi_commitments)


def _savings_fallback(
    goal_description: str,
    goal_timeframe_months: int,
    monthly_salary: int,
    emi_commitments: int,
) -> dict:
    """Deterministic fallback when Groq is unavailable."""
    disposable = monthly_salary - emi_commitments
    estimated_monthly = max(1000, int(disposable * 0.20))
    estimated_total = estimated_monthly * goal_timeframe_months
    return {
        "estimated_goal_cost":    estimated_total,
        "monthly_savings_needed": estimated_monthly,
        "savings_plan_summary":   (
            f"To achieve '{goal_description}' in {goal_timeframe_months} months, "
            f"save ₹{estimated_monthly:,}/month (20% of disposable income)."
        ),
        "goal_feasibility":       "ACHIEVABLE" if estimated_monthly < disposable * 0.4 else "CHALLENGING",
        "ai_tip":                 "Start a recurring deposit to automate your savings each month.",
    }


# ─── Task 2: Global AI Insight (Speed-Critical — 1 sentence) ──────────
async def generate_global_ai_insight(
    user_profile: dict,
    recommendations: list[dict],
    sustainability: str,
) -> str | None:
    """Use Groq for a single fast insight sentence about the user's overall prospects."""
    if not XAI_API_KEY:
        return None

    client = _get_client()
    city = user_profile.get("city", "the city")
    areas = ", ".join(r.get("area_name", "") for r in recommendations)
    avg_savings = sum(r.get("projected_monthly_savings", 0) for r in recommendations) // max(len(recommendations), 1)

    prompt = (
        f"In ONE sentence (max 30 words), give a sharp, personalized insight for someone "
        f"earning ₹{user_profile.get('monthly_salary', 0):,}/month relocating to {city}. "
        f"Top areas: {areas}. Avg projected savings: ₹{avg_savings:,}/month. "
        f"Sustainability: {sustainability}. Be specific. No generic advice."
    )

    try:
        response = await client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7,
            max_tokens=80,
        )
        return response.choices[0].message.content.strip().strip('"')
    except Exception as e:
        print(f"  ⚠️  Groq global insight error: {e}")
        return None


# ─── Task 3: Weekend Travel Suggestions ──────────────────────────────
async def generate_travel_suggestions(
    monthly_salary: int,
    city: str = "Pune",
) -> list[dict]:
    """Generate 3 weekend getaway suggestions from the given city based on salary bracket."""
    CITY_FALLBACKS = {
        "Pune":      [{"destination": "Lonavala",     "distance_km": 65,  "travel_time_hours": "1.5 hours", "vibe": "Scenic hills",          "estimated_cost_inr": 3000, "why_it_fits": "Classic budget escape from Pune."}],
        "Bengaluru": [{"destination": "Coorg",        "distance_km": 250, "travel_time_hours": "5 hours",   "vibe": "Coffee estates",        "estimated_cost_inr": 5000, "why_it_fits": "Bengaluru's favourite hill retreat."}],
        "Hyderabad": [{"destination": "Warangal",     "distance_km": 148, "travel_time_hours": "3 hours",   "vibe": "Historical forts",      "estimated_cost_inr": 2500, "why_it_fits": "Budget heritage escape from Hyderabad."}],
        "Chennai":   [{"destination": "Pondicherry",  "distance_km": 160, "travel_time_hours": "3 hours",   "vibe": "French quarter beaches", "estimated_cost_inr": 4000, "why_it_fits": "Chennai's top weekend destination."}],
        "Mumbai":    [{"destination": "Alibaug",      "distance_km": 95,  "travel_time_hours": "2 hours",   "vibe": "Coastal getaway",       "estimated_cost_inr": 4500, "why_it_fits": "Mumbai's closest beach escape."}],
    }
    fallback = CITY_FALLBACKS.get(city, CITY_FALLBACKS["Pune"])

    if not XAI_API_KEY:
        return fallback

    client = _get_client()

    budget_profile = "Budget (under ₹4k)"
    if monthly_salary > 60000:
        budget_profile = "Mid-range (₹4k - ₹10k)"
    if monthly_salary > 150000:
        budget_profile = "Premium (₹10k+)"

    prompt = f"""You are a travel expert for {city}, India.
A user with a monthly salary of ₹{monthly_salary:,} wants 3 weekend getaways from {city}.
Suggest trips fitting this budget profile: {budget_profile}.

Return a JSON object with key "trips" containing an array of 3 trip objects:
{{
  "trips": [
    {{
      "destination": "Name of the place",
      "distance_km": 120,
      "travel_time_hours": "2.5 hours",
      "vibe": "Short 3-4 word description",
      "estimated_cost_inr": 5000,
      "why_it_fits": "1 sentence on why it is perfect for this budget."
    }}
  ]
}}

All destinations must be reachable as a weekend trip FROM {city} specifically. Return ONLY valid JSON."""

    try:
        response = await client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7,
            max_tokens=800,
            response_format={"type": "json_object"},
        )
        content = response.choices[0].message.content.strip()
        data = json.loads(content)
        return data.get("trips", [])
    except Exception as e:
        print(f"  ⚠️  Groq travel error: {e}")
        return fallback
