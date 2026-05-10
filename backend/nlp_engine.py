"""
Smart Living Ecosystem — NLP Review Analysis Engine (via Groq / Llama 3.3-70b)
Extracts structured insights from raw resident reviews:

  - sentiment_score (0–100, computed not hardcoded)
  - safety_rating (HIGH / MEDIUM / LOW)
  - noise_complaints count
  - food_quality_score
  - key_positive_themes + key_negative_themes
  - resident_summary (1–2 sentence digest)

Uses Groq for speed (free-tier friendly, ~200ms per call).
Falls back to rule-based extraction when API is unavailable.
"""

from __future__ import annotations
import os
import json
import re
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


# ─── Main Analysis Function ───────────────────────────────────────────
async def analyze_reviews(area_name: str, reviews: list[dict]) -> dict:
    """Analyze resident reviews using Groq LLM and return structured insights.

    Returns:
        {
            "sentiment_score": int (0-100),
            "safety_rating": "HIGH" | "MEDIUM" | "LOW",
            "noise_complaints": int,
            "food_quality_score": int (0-100),
            "maintenance_issues": list[str],
            "key_positive_themes": list[str],
            "key_negative_themes": list[str],
            "resident_summary": str
        }
    """
    if not reviews:
        return _empty_result(area_name)

    # Try AI-powered analysis
    if XAI_API_KEY:
        try:
            return await _analyze_with_groq(area_name, reviews)
        except Exception as e:
            print(f"  ⚠️  Groq NLP error for {area_name}: {e}")

    # Fallback: rule-based analysis
    return _rule_based_analysis(area_name, reviews)


async def _analyze_with_groq(area_name: str, reviews: list[dict]) -> dict:
    """Use Groq/Llama to extract structured insights from reviews."""
    client = _get_client()

    # Format reviews for the prompt
    reviews_text = "\n".join(
        f"- {r.get('author', 'Anon')} ({r.get('rating', '?')}/5): \"{r.get('text', '')}\""
        for r in reviews
    )

    prompt = f"""You are an NLP analyst for an urban relocation platform. Analyze these resident reviews for "{area_name}" and extract structured insights.

**Reviews:**
{reviews_text}

Analyze these reviews and return a JSON object with:
1. "sentiment_score": overall sentiment 0-100 (0=very negative, 100=very positive)
2. "safety_rating": "HIGH", "MEDIUM", or "LOW" based on safety mentions
3. "noise_complaints": count of noise-related negative mentions (0 if none)
4. "food_quality_score": food-related satisfaction 0-100 (50 if not mentioned)
5. "maintenance_issues": array of specific issues mentioned (empty if none)
6. "key_positive_themes": array of 2-3 positive themes (e.g. "good connectivity", "affordable rent")
7. "key_negative_themes": array of 1-2 negative themes (e.g. "traffic congestion", "noisy area")
8. "resident_summary": 1-2 sentence summary of what living here is actually like

Return ONLY valid JSON. No markdown, no explanation."""

    response = await client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.3,
        max_tokens=500,
        response_format={"type": "json_object"},
    )

    content = response.choices[0].message.content.strip()
    result = json.loads(content)

    # Validate and normalize
    return {
        "sentiment_score":      _clamp(int(result.get("sentiment_score", 50)), 0, 100),
        "safety_rating":        result.get("safety_rating", "MEDIUM").upper(),
        "noise_complaints":     max(0, int(result.get("noise_complaints", 0))),
        "food_quality_score":   _clamp(int(result.get("food_quality_score", 50)), 0, 100),
        "maintenance_issues":   result.get("maintenance_issues", [])[:3],
        "key_positive_themes":  result.get("key_positive_themes", [])[:3],
        "key_negative_themes":  result.get("key_negative_themes", [])[:2],
        "resident_summary":     str(result.get("resident_summary", f"A liveable area in the city.")),
    }


# ─── Rule-Based Fallback ──────────────────────────────────────────────
def _rule_based_analysis(area_name: str, reviews: list[dict]) -> dict:
    """Extract insights using keyword matching when API is unavailable."""
    all_text = " ".join(r.get("text", "").lower() for r in reviews)
    ratings = [r.get("rating", 3.5) for r in reviews]
    avg_rating = sum(ratings) / len(ratings) if ratings else 3.5

    # Sentiment from ratings (0–100 scale)
    sentiment = int((avg_rating / 5.0) * 100)

    # Safety detection
    safety_positive = len(re.findall(r'\b(safe|secure|well-maintained|peaceful|clean)\b', all_text))
    safety_negative = len(re.findall(r'\b(unsafe|crime|theft|danger|risky|sketchy)\b', all_text))
    if safety_positive >= 2 and safety_negative == 0:
        safety = "HIGH"
    elif safety_negative >= 1:
        safety = "LOW"
    else:
        safety = "MEDIUM"

    # Noise detection
    noise_complaints = len(re.findall(r'\b(nois[ey]|loud|traffic|honking|congested|flight|airport)\b', all_text))

    # Food detection
    food_positive = len(re.findall(r'\b(food|restaurant|cafe|dining|eatery|cuisine|meal)\b', all_text))
    food_negative = len(re.findall(r'\b(no food|limited food|bad food|poor food)\b', all_text))
    food_score = min(100, 50 + food_positive * 12 - food_negative * 20)

    # Theme extraction
    positive_themes = []
    theme_map = {
        r'\b(connect|metro|transport|accessible|railway|bus)\b': "Good connectivity",
        r'\b(afford|cheap|budget|reasonable|value|low rent)\b': "Affordable living",
        r'\b(food|restaurant|cafe|dining)\b': "Good food options",
        r'\b(gym|park|green|lake|garden)\b': "Fitness & recreation",
        r'\b(safe|secure|peaceful|clean)\b': "Safe neighborhood",
        r'\b(it park|tech|startup|malls?|shop)\b': "Good infrastructure",
        r'\b(vibrant|nightlife|social|lively|happening)\b': "Vibrant lifestyle",
    }
    for pattern, theme in theme_map.items():
        if re.search(pattern, all_text):
            positive_themes.append(theme)
    positive_themes = positive_themes[:3]

    negative_themes = []
    neg_map = {
        r'\b(nois[ey]|loud|honking)\b': "Noise pollution",
        r'\b(traffic|congested|jam)\b': "Traffic congestion",
        r'\b(expensive|costly|high rent|pricey)\b': "High cost of living",
        r'\b(far|distant|remote|long commute)\b': "Remote location",
        r'\b(old|dated|infrastructure)\b': "Aging infrastructure",
    }
    for pattern, theme in neg_map.items():
        if re.search(pattern, all_text):
            negative_themes.append(theme)
    negative_themes = negative_themes[:2]

    # Maintenance issues
    issues = []
    issue_map = {
        r'\b(water supply|water issue)\b': "Water supply issues",
        r'\b(power cut|electricity)\b': "Power supply inconsistency",
        r'\b(road|pothole)\b': "Road quality",
    }
    for pattern, issue in issue_map.items():
        if re.search(pattern, all_text):
            issues.append(issue)

    # Summary
    sentiment_word = "positive" if sentiment >= 70 else "mixed" if sentiment >= 50 else "cautious"
    summary = (
        f"Residents have a {sentiment_word} outlook on {area_name}. "
        f"{positive_themes[0] if positive_themes else 'Decent amenities'} "
        f"{'stands out as a key advantage' if positive_themes else 'is noted'}."
    )

    return {
        "sentiment_score":      sentiment,
        "safety_rating":        safety,
        "noise_complaints":     noise_complaints,
        "food_quality_score":   food_score,
        "maintenance_issues":   issues,
        "key_positive_themes":  positive_themes or ["General livability"],
        "key_negative_themes":  negative_themes or ["No major concerns"],
        "resident_summary":     summary,
    }


def _empty_result(area_name: str) -> dict:
    """Return empty analysis when no reviews exist."""
    return {
        "sentiment_score":      50,
        "safety_rating":        "MEDIUM",
        "noise_complaints":     0,
        "food_quality_score":   50,
        "maintenance_issues":   [],
        "key_positive_themes":  ["Insufficient data"],
        "key_negative_themes":  ["No reviews available"],
        "resident_summary":     f"No resident reviews available for {area_name} yet.",
    }


def _clamp(value: int, lo: int, hi: int) -> int:
    return max(lo, min(hi, value))
