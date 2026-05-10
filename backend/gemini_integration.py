"""
Smart Living Ecosystem — Gemini Integration (gemini-2.5-flash)
Uses Google's Gemini for knowledge-rich, context-heavy tasks:

  1. enrich_recommendations() — deep area descriptions, market insights,
                                 personalized lifestyle advice (needs strong India knowledge)

Called from recommend.py alongside grok_integration.py.
"""

from __future__ import annotations
import os
import json
import google.generativeai as genai

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")

_model = None


def _get_model():
    global _model
    if _model is None and GEMINI_API_KEY:
        genai.configure(api_key=GEMINI_API_KEY)
        _model = genai.GenerativeModel("gemini-2.5-flash")
    return _model


def _clean_json_response(text: str) -> str:
    """Strip markdown fences from LLM JSON responses."""
    text = text.strip()
    if text.startswith("```"):
        lines = text.split("\n")
        lines = lines[1:]   # drop opening ```json / ```
        if lines and lines[-1].startswith("```"):
            lines = lines[:-1]
        text = "\n".join(lines).strip()
    return text


# ─── Task: Rich Area Enrichment (Knowledge-Heavy) ─────────────────────
async def enrich_recommendations(
    user_profile: dict,
    recommendations: list[dict],
) -> list[dict]:
    """Enrich scored recommendations with Gemini-generated city-specific insights.

    Adds per-area fields:
      - ai_area_description:  2-3 sentences on real vibe (landmarks, roads)
      - ai_market_insight:    rental market context with price ranges
      - ai_lifestyle_advice:  personalised tip based on food/noise/schedule
      - ai_decision_summary:  1 crisp sentence — why this area for this user
    """
    model = _get_model()
    if not model:
        return _fallback(recommendations)

    areas_summary = [
        {
            "rank":                   r.get("rank"),
            "area_name":              r.get("area_name"),
            "city":                   r.get("city"),
            "compatibility_score":    r.get("compatibility_score"),
            "accommodation_type":     r.get("accommodation_type"),
            "rent_estimate":          r.get("rent_estimate"),
            "one_way_commute_minutes":    r.get("one_way_commute_minutes"),
            "projected_monthly_savings":  r.get("projected_monthly_savings"),
            "savings_vs_goal_status":     r.get("savings_vs_goal_status"),
            "lifestyle_fit_summary":      r.get("lifestyle_fit_summary"),
        }
        for r in recommendations
    ]

    city = user_profile.get('city', 'the city')
    prompt = f"""You are a {city} city relocation expert with deep, current knowledge of every neighborhood.
You provide SPECIFIC, PRACTICAL advice — never generic. Mention real landmarks, roads, and current market conditions.

A user relocating to {city} needs enriched insights for their top 3 area recommendations.

**User Profile:**
- Job Location: {user_profile.get('job_location')}
- Monthly Salary: ₹{user_profile.get('monthly_salary', 0):,}
- EMI: ₹{user_profile.get('emi_commitments', 0):,}
- Monthly Savings Target: ₹{user_profile.get('savings_goal', 0):,}
- Noise Tolerance: {user_profile.get('noise_tolerance')}
- Food Habit: {user_profile.get('food_habit')}
- Sleep Schedule: {user_profile.get('sleep_schedule')}
- Max Commute Tolerance: {user_profile.get('commute_tolerance_minutes')} minutes

**Top 3 Recommendations (already scored by algorithm):**
{json.dumps(areas_summary, indent=2)}

For EACH of the 3 areas return a JSON array of 3 objects:
[
  {{
    "area_name": "<exact area name from above>",
    "ai_area_description": "<2-3 sentences: real character of the area — mention specific roads, landmarks, vibe — SPECIFIC to {city}>",
    "ai_market_insight": "<1-2 sentences: current rental market context — actual price ranges, trends, negotiation tips>",
    "ai_lifestyle_advice": "<1-2 sentences: PERSONALISED tip for THIS user based on their food_habit, noise_tolerance, sleep_schedule>",
    "ai_decision_summary": "<ONE sentence: why this area works for this user — mention their savings or commute number>"
  }}
]

Return ONLY the JSON array. No markdown, no explanation, no extra text."""

    try:
        response = await model.generate_content_async(
            prompt,
            generation_config=genai.types.GenerationConfig(temperature=0.65),
        )
        content = _clean_json_response(response.text)
        insights = json.loads(content)

        insights_map = {i["area_name"]: i for i in insights}
        return [
            {
                **r,
                "ai_area_description": insights_map.get(r.get("area_name", ""), {}).get("ai_area_description", ""),
                "ai_market_insight":   insights_map.get(r.get("area_name", ""), {}).get("ai_market_insight", ""),
                "ai_lifestyle_advice": insights_map.get(r.get("area_name", ""), {}).get("ai_lifestyle_advice", ""),
                "ai_decision_summary": insights_map.get(r.get("area_name", ""), {}).get("ai_decision_summary", ""),
            }
            for r in recommendations
        ]

    except Exception as e:
        print(f"  ⚠️  Gemini enrichment error: {e}")
        return _fallback(recommendations)


def _fallback(recommendations: list[dict]) -> list[dict]:
    """Empty AI fields when Gemini is unavailable."""
    return [
        {
            **r,
            "ai_area_description": "",
            "ai_market_insight":   "",
            "ai_lifestyle_advice": "",
            "ai_decision_summary": "",
        }
        for r in recommendations
    ]


# ─── Task: Places Enrichment (Knowledge-Heavy) ─────────────────────────
async def enrich_places(
    area_name: str,
    restaurants: list[dict],
    gyms: list[dict],
    user_profile: dict,
    city: str = "Pune",
) -> dict:
    """Enrich Google Places results with Gemini-generated context.

    Filters the best ones and adds why it fits the user.
    """
    model = _get_model()
    if not model:
        return {"food_spots": restaurants, "gym_options": gyms}

    prompt = f"""You are a local lifestyle expert in {city}, reviewing places in {area_name}.

**User Profile:**
- Monthly Salary: ₹{user_profile.get('monthly_salary', 0):,}
- Food Habit: {user_profile.get('food_habit')}
- Lifestyle Preference: Noise tolerance is {user_profile.get('noise_tolerance')}

**Raw Restaurants from Google Places:**
{json.dumps(restaurants, indent=2)}

**Raw Gyms from Google Places:**
{json.dumps(gyms, indent=2)}

Your task is to return a JSON object with two arrays: "food_spots" and "gym_options".
For each place you include, keep the original "name", "address", "rating", and "location".
Add a new field "ai_insight" (1 sentence explaining why it fits this user's budget and lifestyle).
If a place is very low rated or doesn't fit the budget, you can exclude it.

Return ONLY valid JSON in this format:
{{
  "food_spots": [
    {{
      "name": "...",
      "address": "...",
      "rating": 4.5,
      "location": {{"latitude": ..., "longitude": ...}},
      "ai_insight": "..."
    }}
  ],
  "gym_options": [
    {{
      "name": "...",
      "address": "...",
      "rating": 4.5,
      "location": {{"latitude": ..., "longitude": ...}},
      "ai_insight": "..."
    }}
  ]
}}
"""
    try:
        response = await model.generate_content_async(
            prompt,
            generation_config=genai.types.GenerationConfig(temperature=0.6),
        )
        content = _clean_json_response(response.text)
        return json.loads(content)
    except Exception as e:
        print(f"  ⚠️  Gemini places enrichment error: {e}")
        return {"food_spots": restaurants, "gym_options": gyms}

