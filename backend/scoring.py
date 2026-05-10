"""
Smart Living Ecosystem — Scoring Engine
Pure computation, no HTTP or database logic.

Compatibility Score Formula (0–100):
  40% Financial Viability  (savings goal vs actual savings)
  30% Commute Optimization (actual commute vs tolerance)
  20% Lifestyle Alignment  (noise tolerance + food availability)
  10% Daily Routine Feasibility (free time + sleep adequacy)
"""

from __future__ import annotations
from typing import Literal
import math


# ─── Accommodation Type Auto-Selection ─────────────────────────────────
def select_accommodation_type(
    budget: int,
    rent_estimates: dict[str, int],
) -> tuple[Literal["PG", "SHARED_FLAT", "1BHK", "2BHK"], int]:
    """Pick the best accommodation type the user can afford.
    Returns (type, rent).  Prefers larger space if affordable."""
    order = ["2BHK", "1BHK", "SHARED_FLAT", "PG"]
    for acc_type in order:
        rent = rent_estimates.get(acc_type, 0)
        if rent <= budget * 0.55:          # rent should not exceed 55 % of disposable income
            return acc_type, rent  # type: ignore[return-value]
    # fallback: cheapest option
    cheapest = min(rent_estimates.items(), key=lambda x: x[1])
    return cheapest[0], cheapest[1]  # type: ignore[return-value]


# ─── Sub-Scores ────────────────────────────────────────────────────────
def financial_score(
    monthly_salary: int,
    emi: int,
    savings_goal: int,
    rent: int,
    living_costs: int,
) -> int:
    """0–100.  How well the user meets their savings goal after all costs."""
    total_expenses = emi + rent + living_costs
    actual_savings = monthly_salary - total_expenses
    if actual_savings <= 0:
        return 0
    if savings_goal <= 0:
        return 100
    ratio = actual_savings / savings_goal
    return min(100, int(ratio * 100))


def commute_score(actual_minutes: int, tolerance_minutes: int) -> int:
    """0–100.  Penalises linearly beyond tolerance, bonus for under-tolerance."""
    if actual_minutes <= 0:
        return 100
    if tolerance_minutes <= 0:
        return 0
    ratio = actual_minutes / tolerance_minutes
    if ratio <= 0.5:
        return 100
    if ratio <= 1.0:
        return int(100 - (ratio - 0.5) * 40)   # 100 → 80 range
    # over tolerance: steep penalty
    return max(0, int(80 - (ratio - 1.0) * 80))


def lifestyle_score(
    area_noise: str,
    user_noise_tolerance: str,
    area_food_options: list[str],
    user_food_habit: str,
) -> int:
    """0–100.  Noise match + food availability."""
    noise_map = {"low": 1, "medium": 2, "high": 3}
    area_n = noise_map.get(area_noise, 2)
    user_n = noise_map.get(user_noise_tolerance, 2)

    if user_n >= area_n:
        noise_pts = 50
    elif area_n - user_n == 1:
        noise_pts = 30
    else:
        noise_pts = 10

    food_pts = 50 if user_food_habit in area_food_options else 20
    return noise_pts + food_pts


def routine_feasibility_score(
    free_time_hours: float,
    sleep_deficit_minutes: int,
) -> int:
    """0–100.  Based on free time and sleep adequacy."""
    # Free time component (0–60)
    if free_time_hours >= 5:
        ft_pts = 60
    elif free_time_hours >= 3:
        ft_pts = 40
    elif free_time_hours >= 1.5:
        ft_pts = 25
    else:
        ft_pts = 10

    # Sleep deficit component (0–40)
    if sleep_deficit_minutes <= 0:
        sl_pts = 40
    elif sleep_deficit_minutes <= 30:
        sl_pts = 25
    elif sleep_deficit_minutes <= 60:
        sl_pts = 15
    else:
        sl_pts = 0

    return ft_pts + sl_pts


# ─── Composite Score ───────────────────────────────────────────────────
def compatibility_score(
    fin: int, com: int, lif: int, rout: int,
) -> int:
    """Weighted composite: 40/30/20/10."""
    raw = 0.40 * fin + 0.30 * com + 0.20 * lif + 0.10 * rout
    return min(100, max(0, int(round(raw))))


# ─── Savings vs Goal Status ───────────────────────────────────────────
def savings_status(projected: int, goal: int) -> str:
    if goal <= 0:
        return "EXCEEDS_GOAL" if projected > 0 else "DEFICIT"
    if projected >= goal * 1.1:
        return "EXCEEDS_GOAL"
    if projected >= goal:
        return "MEETS_GOAL"
    if projected > 0:
        return "SHORTFALL"
    return "DEFICIT"


# ─── Daily Routine Generator ──────────────────────────────────────────
def parse_time_range(sleep_schedule: str) -> tuple[int, int]:
    """Parse '22:00-06:00' → (22, 6).  Returns (sleep_hour, wake_hour)."""
    try:
        parts = sleep_schedule.replace(" ", "").split("-")
        sleep_h = int(parts[0].split(":")[0])
        wake_h  = int(parts[1].split(":")[0])
        return sleep_h, wake_h
    except Exception:
        return 23, 7  # safe default


def generate_daily_routine(
    sleep_schedule: str,
    one_way_commute: int,
    food_habit: str,
) -> dict:
    """Build the full daily_routine object per the contract."""
    sleep_hour, wake_hour = parse_time_range(sleep_schedule)

    prep_time = 45 if food_habit == "home" else 30
    wake_up_minutes = wake_hour * 60
    depart_minutes = wake_up_minutes + prep_time

    # commute window
    commute_start = depart_minutes
    commute_end   = commute_start + one_way_commute
    work_start    = commute_end
    work_end      = work_start + 9 * 60     # 9-hour workday

    # return commute
    home_arrival_minutes = work_end + one_way_commute

    # free time until sleep
    sleep_minutes = sleep_hour * 60 if sleep_hour > 12 else (sleep_hour + 24) * 60
    free_time_minutes = max(0, sleep_minutes - home_arrival_minutes)
    free_time_hours = round(free_time_minutes / 60, 1)

    # discretionary = free_time minus chores (cooking/eating ≈ 60min)
    chore_minutes = 60 if food_habit == "home" else 30
    discretionary = round(max(0, free_time_minutes - chore_minutes) / 60, 1)

    # sleep deficit: ideal 8 hours vs actual
    if sleep_hour > 12:
        actual_sleep = (24 - sleep_hour + wake_hour) * 60
    else:
        actual_sleep = (wake_hour - sleep_hour) * 60
    sleep_deficit = max(0, 480 - actual_sleep)   # 480 = 8 hours in minutes

    # stress indicator
    stress_score, stress_level, stress_reason = _compute_stress(
        one_way_commute * 2, free_time_hours, sleep_deficit,
    )

    def fmt(minutes: int) -> str:
        h, m = divmod(minutes % 1440, 60)
        return f"{h:02d}:{m:02d}"

    return {
        "wake_up_time":            fmt(wake_up_minutes),
        "prep_time_minutes":       prep_time,
        "commute_time":            f"{fmt(commute_start)}-{fmt(commute_end)}",
        "work_hours":              f"{fmt(work_start)}-{fmt(work_end)}",
        "home_arrival_time":       fmt(home_arrival_minutes),
        "free_time_hours":         free_time_hours,
        "discretionary_time_hours": discretionary,
        "stress_indicator": {
            "level":  stress_level,
            "score":  stress_score,
            "reason": stress_reason,
        },
    }


def _compute_stress(
    round_trip: int,
    free_hours: float,
    sleep_deficit: int,
) -> tuple[int, str, str]:
    """Returns (score 0-100, level enum, reason string)."""
    # commute stress (0–40)
    if round_trip <= 30:
        c = 0
    elif round_trip <= 60:
        c = 15
    elif round_trip <= 90:
        c = 25
    elif round_trip <= 120:
        c = 35
    else:
        c = 40

    # free time stress (0–30)
    if free_hours >= 5:
        f = 0
    elif free_hours >= 3:
        f = 10
    elif free_hours >= 1.5:
        f = 20
    else:
        f = 30

    # sleep deficit stress (0–30)
    if sleep_deficit <= 0:
        s = 0
    elif sleep_deficit <= 30:
        s = 10
    elif sleep_deficit <= 60:
        s = 20
    else:
        s = 30

    score = c + f + s

    if score <= 25:
        level = "LOW"
    elif score <= 50:
        level = "MODERATE"
    elif score <= 75:
        level = "HIGH"
    else:
        level = "VERY_HIGH"

    # pick dominant reason
    components = [
        (c, f"Round-trip commute of {round_trip} minutes adds transit fatigue"),
        (f, f"Only {free_hours} hours of personal time after work"),
        (s, f"Sleep deficit of {sleep_deficit} minutes below recommended 8 hours"),
    ]
    components.sort(key=lambda x: x[0], reverse=True)
    reason = components[0][1]

    return score, level, reason


# ─── Lifestyle Fit Summary ─────────────────────────────────────────────
def lifestyle_fit_summary(
    noise_level: str,
    food_options: list[str],
    lifestyle_tags: list[str],
) -> str:
    """Generate a 5-7 word phrase."""
    noise_adj = {
        "low":    "Quiet residential",
        "medium": "Moderately active",
        "high":   "Vibrant urban",
    }.get(noise_level, "Mixed")

    if "outside" in food_options and "home" in food_options:
        food_desc = "mixed dining"
    elif "outside" in food_options:
        food_desc = "restaurant-rich dining"
    else:
        food_desc = "home-cooking friendly"

    return f"{noise_adj} with {food_desc}"


# ─── Decision Explanation ──────────────────────────────────────────────
def generate_explanation(
    area_name: str,
    fin_score: int,
    com_score: int,
    lif_score: int,
    rent: int,
    commute_min: int,
    tolerance_min: int,
    projected_savings: int,
    savings_goal: int,
    noise_level: str,
    user_noise: str,
) -> dict:
    """Build the decision_explanation object."""
    # primary reason
    if fin_score >= 80 and com_score >= 80:
        primary = (
            f"{area_name} balances financial sustainability and commute "
            f"efficiency within your specified constraints."
        )
    elif fin_score >= 80:
        primary = (
            f"{area_name} maximises your savings potential at ₹{projected_savings:,}/month, "
            f"though commute is a consideration."
        )
    elif com_score >= 80:
        primary = (
            f"{area_name} offers a {commute_min}-minute commute well within your "
            f"{tolerance_min}-minute tolerance, with acceptable financial margins."
        )
    else:
        primary = (
            f"{area_name} provides the most balanced combination of affordability "
            f"and accessibility given your constraints."
        )

    # contributing factors
    factors = []
    if commute_min <= tolerance_min:
        factors.append(
            f"Commute of {commute_min} minutes is within your {tolerance_min}-minute tolerance"
        )
    if projected_savings >= savings_goal:
        factors.append(
            f"Projected savings of ₹{projected_savings:,} meets your ₹{savings_goal:,} goal"
        )
    if rent <= 15000:
        factors.append(f"Rent of ₹{rent:,} is below the city median for this accommodation type")
    if lif_score >= 70:
        factors.append("Strong lifestyle alignment with noise and food preferences")
    if not factors:
        factors.append(f"Rent at ₹{rent:,} keeps total expenses manageable")

    # tradeoffs
    tradeoffs = []
    if commute_min > tolerance_min:
        tradeoffs.append(
            f"Commute of {commute_min} min exceeds your {tolerance_min}-min tolerance by "
            f"{commute_min - tolerance_min} minutes"
        )
    if projected_savings < savings_goal and projected_savings > 0:
        shortfall = savings_goal - projected_savings
        tradeoffs.append(
            f"Monthly savings fall short of goal by ₹{shortfall:,}"
        )
    noise_map = {"low": 1, "medium": 2, "high": 3}
    if noise_map.get(noise_level, 2) > noise_map.get(user_noise, 2):
        tradeoffs.append(
            f"Area noise level ({noise_level}) exceeds your preference ({user_noise})"
        )
    if not tradeoffs:
        tradeoffs.append("No significant tradeoffs identified for this recommendation")

    return {
        "primary_reason":          primary,
        "top_contributing_factors": factors[:3],
        "key_tradeoffs":           tradeoffs[:2],
    }


# ─── Trust Metrics ─────────────────────────────────────────────────────
def generate_trust_metrics(
    sentiment_score: int,
    area_name: str,
    rent: int,
) -> dict:
    """Build the trust_metrics object."""
    # data confidence heuristic
    if sentiment_score >= 75:
        confidence = "HIGH"
    elif sentiment_score >= 55:
        confidence = "MEDIUM"
    else:
        confidence = "LOW"

    flags: list[str] = []
    if confidence == "LOW":
        flags.append(f"Limited resident review data available for {area_name}")
    if rent >= 20000:
        flags.append(
            f"Premium rental segment (₹{rent:,}) — prices may fluctuate seasonally"
        )

    return {
        "review_sentiment_score": sentiment_score,
        "data_confidence":        confidence,
        "uncertainty_flags":      flags,
    }
