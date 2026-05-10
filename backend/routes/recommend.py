"""
POST /api/recommend

Single endpoint that implements the full Smart Living Ecosystem output contract.
Returns: user_summary, top_areas (3 ranked recommendations), global_insights.
Errors:  VALIDATION_FAILED, MATHEMATICAL_DEFICIT, NO_VIABLE_AREAS_FOUND.
"""

from __future__ import annotations

from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel, Field
from typing import Literal, Optional
from datetime import datetime, timezone
import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from auth_utils import decode_token


from scoring import (
    select_accommodation_type,
    financial_score,
    commute_score,
    lifestyle_score,
    routine_feasibility_score,
    compatibility_score,
    savings_status,
    generate_daily_routine,
    lifestyle_fit_summary,
    generate_explanation,
    generate_trust_metrics,
)
# ── Dual AI Integration ────────────────────────────────────────────────
# Groq (Llama 3.3-70b): ultra-fast for financial math + global insight + travel
from grok_integration import compute_savings_goal, generate_global_ai_insight, generate_travel_suggestions
# Gemini (2.5-flash): knowledge-rich for area descriptions + lifestyle advice
from gemini_integration import enrich_recommendations, enrich_places
from places_integration import get_nearby_restaurants, get_nearby_gyms, _salary_budget_label, _salary_gym_budget
# NLP Review Analysis (Phase 2)
from nlp_engine import analyze_reviews

router = APIRouter()


# ─── Request Schema ────────────────────────────────────────────────────
class LifestylePreferences(BaseModel):
    noise_tolerance:           Literal["low", "medium", "high"]
    sleep_schedule:            str = Field(..., pattern=r"^\d{2}:\d{2}-\d{2}:\d{2}$",
                                          description="e.g. '23:00-07:00'")
    food_habit:                Literal["home", "outside", "mixed"]
    commute_tolerance_minutes: int = Field(..., ge=5, le=180)


class RecommendRequest(BaseModel):
    city:                  str = Field(..., description="One of: Pune, Bengaluru, Hyderabad, Chennai, Mumbai")
    job_location:          str = Field(..., description="A job hub within the selected city")
    monthly_salary:        int = Field(..., ge=1)
    emi_commitments:       int = Field(..., ge=0)
    goal_description:      str = Field(..., min_length=2, max_length=200,
                                       description="What the user wants to achieve, e.g. 'Buy a car', 'Emergency fund'")
    goal_timeframe_months: int = Field(..., ge=1, le=120,
                                       description="Months to achieve the goal")
    lifestyle_preferences: LifestylePreferences


# ─── Response Sub-Schemas ──────────────────────────────────────────────
class CostBreakdown(BaseModel):
    rent:          int
    food:          int
    transport:     int
    utilities:     int
    miscellaneous: int
    hidden_costs:  int


class StressIndicator(BaseModel):
    level:  Literal["LOW", "MODERATE", "HIGH", "VERY_HIGH"]
    score:  int
    reason: str


class DailyRoutine(BaseModel):
    wake_up_time:             str
    prep_time_minutes:        int
    commute_time:             str
    work_hours:               str
    home_arrival_time:        str
    free_time_hours:          float
    discretionary_time_hours: float
    stress_indicator:         StressIndicator


class DecisionExplanation(BaseModel):
    primary_reason:          str
    top_contributing_factors: list[str]
    key_tradeoffs:           list[str]


class TrustMetrics(BaseModel):
    review_sentiment_score: int
    data_confidence:        Literal["HIGH", "MEDIUM", "LOW"]
    uncertainty_flags:      list[str]


class ReviewAnalysis(BaseModel):
    sentiment_score:      int
    safety_rating:        Literal["HIGH", "MEDIUM", "LOW"]
    noise_complaints:     int
    food_quality_score:   int
    maintenance_issues:   list[str] = Field(default_factory=list)
    key_positive_themes:  list[str] = Field(default_factory=list)
    key_negative_themes:  list[str] = Field(default_factory=list)
    resident_summary:     str


class ScoreBreakdown(BaseModel):
    financial:  int
    commute:    int
    lifestyle:  int
    routine:    int


class PlaceItem(BaseModel):
    name: str
    address: str
    rating: float
    location: dict
    ai_insight: Optional[str] = None


class AreaRecommendation(BaseModel):
    area_name:                str
    city:                     str
    rank:                     int
    compatibility_score:      int
    monthly_total_cost:       int
    rent_estimate:            int
    accommodation_type:       Literal["PG", "SHARED_FLAT", "1BHK", "2BHK"]
    one_way_commute_minutes:  int
    round_trip_commute_minutes: int
    projected_monthly_savings: int
    savings_vs_goal_status:   Literal["EXCEEDS_GOAL", "MEETS_GOAL", "SHORTFALL", "DEFICIT"]
    lifestyle_fit_summary:    str
    cost_breakdown:           CostBreakdown
    daily_routine:            DailyRoutine
    decision_explanation:     DecisionExplanation
    trust_metrics:            TrustMetrics
    
    # Food & Gym (Phase 3)
    food_spots:               list[PlaceItem] = Field(default_factory=list)
    gym_options:              list[PlaceItem] = Field(default_factory=list)
    
    # AI-enriched fields (from Grok/Gemini)
    ai_area_description:      str = ""
    ai_market_insight:        str = ""
    ai_lifestyle_advice:      str = ""
    ai_decision_summary:      str = ""
    
    # NLP Review Analysis (Phase 2)
    review_analysis:          Optional[ReviewAnalysis] = None
    
    # Score Breakdown (Phase 3)
    score_breakdown:          Optional[ScoreBreakdown] = None


class GlobalInsights(BaseModel):
    overall_sustainability: Literal["HIGHLY_SUSTAINABLE", "MARGINAL", "UNSUSTAINABLE"]
    average_score:          int
    key_warning:            Optional[str]
    ai_global_insight:      Optional[str] = None


class SavingsPlan(BaseModel):
    goal_description:       str
    goal_timeframe_months:  int
    estimated_goal_cost:    int
    monthly_savings_needed: int
    savings_plan_summary:   str
    goal_feasibility:       str
    ai_tip:                 str


class UserSummary(BaseModel):
    city:                      str
    job_location:              str
    monthly_salary:            int
    emi_commitments:           int
    goal_description:          str
    goal_timeframe_months:     int
    computed_savings_goal:     int
    noise_tolerance:           str
    sleep_schedule:            str
    food_habit:                str
    commute_tolerance_minutes: int
    timestamp:                 str


class TripSuggestion(BaseModel):
    destination:        str
    distance_km:        int
    travel_time_hours:  str
    vibe:               str
    estimated_cost_inr: int
    why_it_fits:        str


class RecommendResponse(BaseModel):
    user_summary:    UserSummary
    savings_plan:    SavingsPlan
    top_areas:       list[AreaRecommendation]
    global_insights: GlobalInsights
    weekend_trips:   list[TripSuggestion] = Field(default_factory=list)


class ErrorResponse(BaseModel):
    error_code:      str
    message:         str
    resolution_hint: str
    invalid_fields:  list[str] = []


# ─── Endpoint ──────────────────────────────────────────────────────────
@router.post(
    "/api/recommend",
    response_model=RecommendResponse,
    responses={
        400: {"model": ErrorResponse},
        422: {"model": ErrorResponse},
    },
)
async def recommend(req: RecommendRequest, request: Request):
    # Import here to access the DB reference set in main.py
    from main import db

    # ── Validate city + job location ──────────────────────────────
    CITY_JOB_HUBS: dict[str, set[str]] = {
        "Pune":      {"Kharadi", "Viman Nagar", "Hadapsar", "Hinjewadi", "Baner"},
        "Bengaluru": {"Whitefield", "Electronic City", "Koramangala", "Marathahalli", "Bellandur"},
        "Hyderabad": {"HITEC City", "Gachibowli", "Madhapur", "Uppal", "Nanakramguda"},
        "Chennai":   {"Sholinganallur", "Perungudi", "Guindy", "Ambattur", "OMR"},
        "Mumbai":    {"Powai", "BKC", "Andheri", "Vikhroli", "Lower Parel"},
    }
    valid_cities = set(CITY_JOB_HUBS.keys())
    if req.city not in valid_cities:
        raise HTTPException(status_code=400, detail=ErrorResponse(
            error_code="VALIDATION_FAILED",
            message=f"'{req.city}' is not a supported city.",
            resolution_hint=f"Supported cities: {', '.join(sorted(valid_cities))}",
            invalid_fields=["city"],
        ).model_dump())
    valid_locations = CITY_JOB_HUBS[req.city]
    if req.job_location not in valid_locations:
        raise HTTPException(status_code=400, detail=ErrorResponse(
            error_code="VALIDATION_FAILED",
            message=f"'{req.job_location}' is not a valid job hub in {req.city}.",
            resolution_hint=f"For {req.city}, use one of: {', '.join(sorted(valid_locations))}",
            invalid_fields=["job_location"],
        ).model_dump())

    # ── AI: Compute savings goal from user's goal description ──────
    savings_plan_data = await compute_savings_goal(
        goal_description=req.goal_description,
        goal_timeframe_months=req.goal_timeframe_months,
        monthly_salary=req.monthly_salary,
        emi_commitments=req.emi_commitments,
    )
    savings_goal = savings_plan_data["monthly_savings_needed"]

    # ── Load data from MongoDB, filtered by city ───────────────────
    all_areas_data   = await db["areas"].find({}).to_list(length=200)
    all_costs_data   = await db["cost_estimates"].find({}).to_list(length=200)
    reviews_data_all = await db["reviews"].find({}).to_list(length=200)

    # Filter to selected city only
    areas_data   = [a for a in all_areas_data   if a.get("city") == req.city]
    costs_data   = [c for c in all_costs_data   if c.get("city") == req.city]
    reviews_data = [r for r in reviews_data_all
                    if any(a["area_id"] == r["area_id"] for a in areas_data)]

    costs_map   = {c["area_id"]: c for c in costs_data}
    reviews_map = {r["area_id"]: r for r in reviews_data}

    lp = req.lifestyle_preferences
    disposable = req.monthly_salary - req.emi_commitments

    # ── Check mathematical viability ───────────────────────────────
    if not areas_data:
        raise HTTPException(status_code=400, detail=ErrorResponse(
            error_code="NO_VIABLE_AREAS_FOUND",
            message=f"No area data found for city '{req.city}'.",
            resolution_hint="Please contact support or try a different city.",
        ).model_dump())
    cheapest_rent = min(a["rent_estimates"]["PG"] for a in areas_data)
    cheapest_food = min(c["food"].get(lp.food_habit, c["food"]["mixed"]) for c in costs_data)
    minimum_survival = cheapest_rent + cheapest_food + 1500  # rent + food + bare min utilities
    if disposable < minimum_survival:
        raise HTTPException(status_code=400, detail=ErrorResponse(
            error_code="MATHEMATICAL_DEFICIT",
            message=(
                f"Your monthly salary minus EMI commitments (₹{disposable:,}) is lower than "
                f"the absolute minimum required for rent and food in {req.city} (₹{minimum_survival:,})."
            ),
            resolution_hint=(
                "You must either increase your salary expectations, reduce your EMI, "
                "or opt for a PG/Shared accommodation to survive in this location."
            ),
        ).model_dump())

    # ── Score all areas ────────────────────────────────────────────
    scored: list[dict] = []

    for area in areas_data:
        aid = area["area_id"]
        commute_map = area.get("commute_minutes", {})
        one_way = commute_map.get(req.job_location, 60)

        # Cost data
        cost = costs_map.get(aid)
        if not cost:
            continue

        food_cost  = cost["food"].get(lp.food_habit, cost["food"]["mixed"])
        transport  = cost["transport"]
        utilities  = cost["utilities"]
        misc       = cost["miscellaneous"]
        hidden     = cost["hidden_costs"]
        living_costs = food_cost + transport + utilities + misc + hidden

        # Accommodation selection based on disposable budget
        acc_budget = disposable - savings_goal - living_costs
        acc_type, rent = select_accommodation_type(
            max(0, acc_budget), area["rent_estimates"],
        )

        total_cost = rent + living_costs
        projected_savings = req.monthly_salary - req.emi_commitments - total_cost

        # Sub-scores
        fin_s  = financial_score(req.monthly_salary, req.emi_commitments,
                                 savings_goal, rent, living_costs)
        com_s  = commute_score(one_way, lp.commute_tolerance_minutes)
        lif_s  = lifestyle_score(
            area.get("noise_level", "medium"),
            lp.noise_tolerance,
            area.get("food_options", []),
            lp.food_habit,
        )

        # Daily routine for feasibility score
        routine = generate_daily_routine(lp.sleep_schedule, one_way, lp.food_habit)
        rout_s = routine_feasibility_score(
            routine["free_time_hours"],
            max(0, 480 - _sleep_minutes(lp.sleep_schedule)),
        )

        comp = compatibility_score(fin_s, com_s, lif_s, rout_s)

        # Review data
        review = reviews_map.get(aid, {})
        raw_reviews = review.get("reviews", [])

        scored.append({
            "area":       area,
            "comp":       comp,
            "fin_s":      fin_s,
            "com_s":      com_s,
            "lif_s":      lif_s,
            "rout_s":     rout_s,
            "acc_type":   acc_type,
            "rent":       rent,
            "food_cost":  food_cost,
            "transport":  transport,
            "utilities":  utilities,
            "misc":       misc,
            "hidden":     hidden,
            "total_cost": total_cost,
            "projected":  projected_savings,
            "one_way":    one_way,
            "routine":    routine,
            "raw_reviews": raw_reviews,
        })

    # ── Filter and rank ────────────────────────────────────────────
    # Remove areas where projected savings is deeply negative (>50% salary deficit)
    viable = [s for s in scored if s["projected"] > -(req.monthly_salary * 0.5)]
    viable.sort(key=lambda x: x["comp"], reverse=True)

    if not viable:
        raise HTTPException(status_code=400, detail=ErrorResponse(
            error_code="NO_VIABLE_AREAS_FOUND",
            message=(
                "Zero neighborhoods match the strict combination of your maximum commute "
                "tolerance and lifestyle preferences."
            ),
            resolution_hint=(
                "Increase your 'commute_tolerance_minutes' by at least 15 minutes "
                "to unlock nearby residential sectors."
            ),
        ).model_dump())

    top3 = viable[:3]

    # ── Build response ─────────────────────────────────────────────
    recommendations: list[AreaRecommendation] = []

    for rank_idx, s in enumerate(top3, start=1):
        area = s["area"]
        
        # NLP: Analyze reviews for this area
        nlp_result = await analyze_reviews(area["name"], s.get("raw_reviews", []))
        sentiment = nlp_result["sentiment_score"]
        
        recommendations.append(AreaRecommendation(
            area_name=area["name"],
            city=area["city"],
            rank=rank_idx,
            compatibility_score=s["comp"],
            monthly_total_cost=s["total_cost"],
            rent_estimate=s["rent"],
            accommodation_type=s["acc_type"],
            one_way_commute_minutes=s["one_way"],
            round_trip_commute_minutes=s["one_way"] * 2,
            projected_monthly_savings=s["projected"],
            savings_vs_goal_status=savings_status(s["projected"], savings_goal),
            lifestyle_fit_summary=lifestyle_fit_summary(
                area.get("noise_level", "medium"),
                area.get("food_options", []),
                area.get("lifestyle_tags", []),
            ),
            cost_breakdown=CostBreakdown(
                rent=s["rent"],
                food=s["food_cost"],
                transport=s["transport"],
                utilities=s["utilities"],
                miscellaneous=s["misc"],
                hidden_costs=s["hidden"],
            ),
            daily_routine=DailyRoutine(**s["routine"]),
            decision_explanation=generate_explanation(
                area_name=area["name"],
                fin_score=s["fin_s"],
                com_score=s["com_s"],
                lif_score=s["lif_s"],
                rent=s["rent"],
                commute_min=s["one_way"],
                tolerance_min=lp.commute_tolerance_minutes,
                projected_savings=s["projected"],
                savings_goal=savings_goal,
                noise_level=area.get("noise_level", "medium"),
                user_noise=lp.noise_tolerance,
            ),
            trust_metrics=generate_trust_metrics(
                sentiment_score=sentiment,
                area_name=area["name"],
                rent=s["rent"],
            ),
            review_analysis=ReviewAnalysis(**nlp_result),
            score_breakdown=ScoreBreakdown(
                financial=s["fin_s"],
                commute=s["com_s"],
                lifestyle=s["lif_s"],
                routine=s["rout_s"],
            ),
        ))

    # ── Global insights ────────────────────────────────────────────
    avg_score = int(sum(s["comp"] for s in top3) / len(top3)) if top3 else 0
    avg_savings = int(sum(s["projected"] for s in top3) / len(top3)) if top3 else 0

    if avg_savings >= savings_goal:
        sustainability = "HIGHLY_SUSTAINABLE"
    elif avg_savings > 0:
        sustainability = "MARGINAL"
    else:
        sustainability = "UNSUSTAINABLE"

    emi_pct = (req.emi_commitments / req.monthly_salary * 100) if req.monthly_salary > 0 else 0
    warning = None
    if emi_pct >= 40:
        warning = (
            f"Your EMI commitments consume {emi_pct:.0f}% of your salary, "
            f"severely limiting housing options."
        )
    elif sustainability == "UNSUSTAINABLE":
        warning = (
            f"Your financial constraints make sustainable living difficult in {req.city}. "
            "Consider increasing income or reducing commitments."
        )

    # ── Enrich with Grok AI ────────────────────────────────────────
    user_profile_dict = {
        "city":                      req.city,
        "job_location":              req.job_location,
        "monthly_salary":            req.monthly_salary,
        "emi_commitments":           req.emi_commitments,
        "savings_goal":              savings_goal,
        "goal_description":          req.goal_description,
        "goal_timeframe_months":     req.goal_timeframe_months,
        "noise_tolerance":           lp.noise_tolerance,
        "sleep_schedule":            lp.sleep_schedule,
        "food_habit":                lp.food_habit,
        "commute_tolerance_minutes": lp.commute_tolerance_minutes,
    }
    recs_as_dicts = [r.model_dump() for r in recommendations]
    enriched = await enrich_recommendations(user_profile_dict, recs_as_dicts)

    # Rebuild recommendations with AI fields
    final_recommendations: list[AreaRecommendation] = []
    for orig, ai_data in zip(recommendations, enriched):
        # Phase 3: Fetch salary-based places
        raw_food = await get_nearby_restaurants(orig.area_name, city=req.city, monthly_salary=req.monthly_salary)
        raw_gyms = await get_nearby_gyms(orig.area_name, city=req.city, monthly_salary=req.monthly_salary)

        # AI enriches the places with salary context
        enriched_places = await enrich_places(orig.area_name, raw_food, raw_gyms, user_profile_dict, city=req.city)

        final_recommendations.append(orig.model_copy(update={
            "ai_area_description": ai_data.get("ai_area_description", ""),
            "ai_market_insight":   ai_data.get("ai_market_insight", ""),
            "ai_lifestyle_advice": ai_data.get("ai_lifestyle_advice", ""),
            "ai_decision_summary": ai_data.get("ai_decision_summary", ""),
            "food_spots":          enriched_places.get("food_spots", raw_food),
            "gym_options":         enriched_places.get("gym_options", raw_gyms),
        }))

    # AI global insight
    ai_global = await generate_global_ai_insight(
        user_profile_dict, recs_as_dicts, sustainability,
    )

    # ── Phase 4: Generate Weekend Travel Suggestions ───────────────
    travel_suggestions = await generate_travel_suggestions(req.monthly_salary, req.city)

    # ── Save request to MongoDB ────────────────────────────────────
    # Extract user_id from Bearer token if present (optional auth)
    user_id = None
    auth_header = request.headers.get("Authorization", "")
    if auth_header.startswith("Bearer "):
        payload = decode_token(auth_header[7:])
        if payload:
            user_id = payload.get("sub")

    log_entry = {
        "user_id":          user_id,
        "city":             req.city,
        "job_location":     req.job_location,
        "monthly_salary":   req.monthly_salary,
        "emi_commitments":  req.emi_commitments,
        "goal_description": req.goal_description,
        "goal_timeframe_months": req.goal_timeframe_months,
        "computed_savings_goal": savings_goal,
        "lifestyle_preferences": lp.model_dump(),
        "top_area_names":   [r.area_name for r in final_recommendations],
        "top_area_scores":  [r.compatibility_score for r in final_recommendations],
        "average_score":    avg_score,
        "sustainability":   sustainability,
        "estimated_goal_cost": savings_plan_data["estimated_goal_cost"],
        "timestamp":        datetime.now(timezone.utc).isoformat(),
    }
    try:
        await db["recommendation_logs"].insert_one(log_entry)
    except Exception:
        pass  # non-critical — don't fail the request

    return RecommendResponse(
        user_summary=UserSummary(
            city=req.city,
            job_location=req.job_location,
            monthly_salary=req.monthly_salary,
            emi_commitments=req.emi_commitments,
            goal_description=req.goal_description,
            goal_timeframe_months=req.goal_timeframe_months,
            computed_savings_goal=savings_goal,
            noise_tolerance=lp.noise_tolerance,
            sleep_schedule=lp.sleep_schedule,
            food_habit=lp.food_habit,
            commute_tolerance_minutes=lp.commute_tolerance_minutes,
            timestamp=datetime.now(timezone.utc).isoformat(),
        ),
        savings_plan=SavingsPlan(
            goal_description=req.goal_description,
            goal_timeframe_months=req.goal_timeframe_months,
            estimated_goal_cost=savings_plan_data["estimated_goal_cost"],
            monthly_savings_needed=savings_plan_data["monthly_savings_needed"],
            savings_plan_summary=savings_plan_data["savings_plan_summary"],
            goal_feasibility=savings_plan_data["goal_feasibility"],
            ai_tip=savings_plan_data["ai_tip"],
        ),
        top_areas=final_recommendations,
        global_insights=GlobalInsights(
            overall_sustainability=sustainability,
            average_score=avg_score,
            key_warning=warning,
            ai_global_insight=ai_global,
        ),
        weekend_trips=travel_suggestions,
    )


def _sleep_minutes(schedule: str) -> int:
    """Calculate actual sleep duration in minutes from schedule string."""
    try:
        parts = schedule.replace(" ", "").split("-")
        sleep_h = int(parts[0].split(":")[0])
        wake_h  = int(parts[1].split(":")[0])
        if sleep_h > wake_h:
            return (24 - sleep_h + wake_h) * 60
        return (wake_h - sleep_h) * 60
    except Exception:
        return 480
