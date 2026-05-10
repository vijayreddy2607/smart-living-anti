import { useState } from "react";
import { useBookings } from "../context/BookingsContext";
import { ReviewForm } from "./DiscoveryModal";
import {
  MapPin,
  IndianRupee,
  Clock,
  Home,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  Shield,
  AlertTriangle,
  CheckCircle2,
  Star,
  Zap,
  Brain,
  Eye,
  Sparkles,
  Utensils,
  Dumbbell,
  MessageSquare,
  Volume2,
  ShieldCheck,
  UtensilsCrossed,
  BarChart3,
} from "lucide-react";

/* ─── Types (mirrors API contract) ───────────────────────────────── */
interface PlaceItem {
  name: string;
  address: string;
  rating: number;
  location: { latitude: number; longitude: number };
  ai_insight?: string;
}
interface CostBreakdown {
  rent: number;
  food: number;
  transport: number;
  utilities: number;
  miscellaneous: number;
  hidden_costs: number;
}

interface StressIndicator {
  level: string;
  score: number;
  reason: string;
}

interface DailyRoutine {
  wake_up_time: string;
  prep_time_minutes: number;
  commute_time: string;
  work_hours: string;
  home_arrival_time: string;
  free_time_hours: number;
  discretionary_time_hours: number;
  stress_indicator: StressIndicator;
}

interface DecisionExplanation {
  primary_reason: string;
  top_contributing_factors: string[];
  key_tradeoffs: string[];
}

interface TrustMetrics {
  review_sentiment_score: number;
  data_confidence: string;
  uncertainty_flags: string[];
}

export interface AreaRecommendation {
  area_name: string;
  city: string;
  rank: number;
  compatibility_score: number;
  monthly_total_cost: number;
  rent_estimate: number;
  accommodation_type: string;
  one_way_commute_minutes: number;
  round_trip_commute_minutes: number;
  projected_monthly_savings: number;
  savings_vs_goal_status: string;
  lifestyle_fit_summary: string;
  cost_breakdown: CostBreakdown;
  daily_routine: DailyRoutine;
  decision_explanation: DecisionExplanation;
  trust_metrics: TrustMetrics;
  // AI-enriched fields
  ai_area_description?: string;
  ai_market_insight?: string;
  ai_lifestyle_advice?: string;
  ai_decision_summary?: string;
  // Food & Gym (Phase 3)
  food_spots?: PlaceItem[];
  gym_options?: PlaceItem[];
  // NLP Review Analysis (Phase 2)
  review_analysis?: {
    sentiment_score: number;
    safety_rating: string;
    noise_complaints: number;
    food_quality_score: number;
    maintenance_issues: string[];
    key_positive_themes: string[];
    key_negative_themes: string[];
    resident_summary: string;
  };
  // Score Breakdown (Phase 3)
  score_breakdown?: {
    financial: number;
    commute: number;
    lifestyle: number;
    routine: number;
  };
}

interface Props {
  data: AreaRecommendation;
}

/* ─── Helpers ────────────────────────────────────────────────────── */
const STATUS_BADGE: Record<string, { cls: string; label: string }> = {
  EXCEEDS_GOAL: { cls: "badge-success", label: "Exceeds Goal" },
  MEETS_GOAL:   { cls: "badge-success", label: "Meets Goal" },
  SHORTFALL:    { cls: "badge-warning", label: "Shortfall" },
  DEFICIT:      { cls: "badge-danger",  label: "Deficit" },
};

const STRESS_COLOR: Record<string, string> = {
  LOW:       "var(--accent-emerald)",
  MODERATE:  "var(--accent-amber)",
  HIGH:      "var(--accent-orange)",
  VERY_HIGH: "var(--accent-rose)",
};

const CONFIDENCE_COLOR: Record<string, string> = {
  HIGH:   "var(--accent-emerald)",
  MEDIUM: "var(--accent-amber)",
  LOW:    "var(--accent-rose)",
};

const fmt = (n: number) => `₹${n.toLocaleString("en-IN")}`;

/* ─── Component ──────────────────────────────────────────────────── */
export function AreaCard({ data }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<"housing" | "food" | "fitness">("housing");
  const sb = STATUS_BADGE[data.savings_vs_goal_status] ?? { cls: "badge-info", label: data.savings_vs_goal_status };

  return (
    <div className={`glass-card overflow-hidden fade-in-up fade-in-up-${data.rank}`}>
      {/* ── Header ── */}
      <div className="p-6 pb-4">
        <div className="flex items-start gap-4 mb-4">
          <div className={`rank-badge rank-${data.rank}`}>
            #{data.rank}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>
                {data.area_name}
              </h3>
              <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                <MapPin size={12} className="inline" /> {data.city}
              </span>
            </div>
            <p className="text-sm mt-0.5" style={{ color: "var(--text-secondary)" }}>
              {data.lifestyle_fit_summary}
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-extrabold gradient-text">
              {data.compatibility_score}
            </div>
            <div className="text-xs" style={{ color: "var(--text-muted)" }}>/ 100</div>
          </div>
        </div>

        {/* Score bar */}
        <div className="score-bar mb-4">
          <div className="score-bar-fill" style={{ width: `${data.compatibility_score}%` }} />
        </div>

        {/* Quick stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatTile
            icon={<Home size={14} />}
            label={data.accommodation_type.replace("_", " ")}
            value={fmt(data.rent_estimate)}
            sublabel="rent/mo"
          />
          <StatTile
            icon={<Clock size={14} />}
            label="Commute"
            value={`${data.one_way_commute_minutes} min`}
            sublabel={`${data.round_trip_commute_minutes} min round`}
          />
          <StatTile
            icon={<IndianRupee size={14} />}
            label="Total Cost"
            value={fmt(data.monthly_total_cost)}
            sublabel="all expenses"
          />
          <StatTile
            icon={<TrendingUp size={14} />}
            label="Savings"
            value={fmt(data.projected_monthly_savings)}
            sublabel={sb.label}
            badge={sb.cls}
          />
        </div>

        {/* ── Book This Area Button ── */}
        <BookAreaButton data={data} />
      </div>

      {/* ── Expand Toggle ── */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full py-3 px-6 flex items-center justify-center gap-2 text-sm font-medium transition-all"
        style={{
          background: "var(--bg-elevated)",
          color: "var(--accent-indigo)",
          borderTop: "1px solid var(--border-default)",
        }}
      >
        {expanded ? (
          <><ChevronUp size={16} /> Hide Details</>
        ) : (
          <><ChevronDown size={16} /> View Full Analysis</>
        )}
      </button>

      {/* ── Expanded Details ── */}
      {expanded && (
        <div className="px-6 pb-6 space-y-5" style={{ borderTop: "1px solid var(--border-default)" }}>
          
          {/* ── Tabs ── */}
          <div className="flex items-center gap-2 pt-4 border-b pb-2 mb-4" style={{ borderColor: "var(--border-default)" }}>
            <button
              onClick={() => setActiveTab("housing")}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-t-lg border-b-2 transition-colors ${activeTab === "housing" ? "border-indigo-500 text-indigo-400" : "border-transparent text-gray-500 hover:text-gray-300"}`}
              style={{ color: activeTab === "housing" ? "var(--accent-indigo)" : "var(--text-muted)", borderColor: activeTab === "housing" ? "var(--accent-indigo)" : "transparent" }}
            >
              <Home size={15} /> Housing
            </button>
            <button
              onClick={() => setActiveTab("food")}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-t-lg border-b-2 transition-colors ${activeTab === "food" ? "border-rose-500 text-rose-400" : "border-transparent text-gray-500 hover:text-gray-300"}`}
              style={{ color: activeTab === "food" ? "var(--accent-rose)" : "var(--text-muted)", borderColor: activeTab === "food" ? "var(--accent-rose)" : "transparent" }}
            >
              <Utensils size={15} /> Food
            </button>
            <button
              onClick={() => setActiveTab("fitness")}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-t-lg border-b-2 transition-colors ${activeTab === "fitness" ? "border-emerald-500 text-emerald-400" : "border-transparent text-gray-500 hover:text-gray-300"}`}
              style={{ color: activeTab === "fitness" ? "var(--accent-emerald)" : "var(--text-muted)", borderColor: activeTab === "fitness" ? "var(--accent-emerald)" : "transparent" }}
            >
              <Dumbbell size={15} /> Fitness
            </button>
          </div>

          {activeTab === "housing" && (
            <div className="space-y-5 fade-in-up">
          {/* AI Insights (from Grok) */}
          {(data.ai_area_description || data.ai_market_insight || data.ai_lifestyle_advice || data.ai_decision_summary) && (
            <div className="pt-4">
              <h4 className="flex items-center gap-2 text-sm font-semibold mb-3" style={{ color: "var(--accent-violet)" }}>
                <Sparkles size={16} /> AI-Powered Insights
              </h4>
              <div
                className="rounded-xl p-4 space-y-3"
                style={{
                  background: "linear-gradient(135deg, rgba(129,140,248,0.06), rgba(167,139,250,0.06))",
                  border: "1px solid rgba(129,140,248,0.15)",
                }}
              >
                {data.ai_decision_summary && (
                  <p className="text-sm font-semibold" style={{ color: "var(--accent-indigo)" }}>
                    🎯 {data.ai_decision_summary}
                  </p>
                )}
                {data.ai_area_description && (
                  <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                    🏙️ {data.ai_area_description}
                  </p>
                )}
                {data.ai_market_insight && (
                  <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                    📊 {data.ai_market_insight}
                  </p>
                )}
                {data.ai_lifestyle_advice && (
                  <p className="text-sm" style={{ color: "var(--accent-emerald)" }}>
                    💡 {data.ai_lifestyle_advice}
                  </p>
                )}
              </div>
            </div>
          )}
          {/* Cost Breakdown */}
          <Section icon={<IndianRupee size={16} />} title="Cost Breakdown">
            <div className="space-y-2">
              {Object.entries(data.cost_breakdown).map(([key, val]) => (
                <CostRow key={key} label={key.replace(/_/g, " ")} amount={val as number} total={data.monthly_total_cost} />
              ))}
              <div className="flex justify-between font-bold pt-2" style={{ borderTop: "1px solid var(--border-default)", color: "var(--text-primary)" }}>
                <span>Monthly Total</span>
                <span>{fmt(data.monthly_total_cost)}</span>
              </div>
            </div>
          </Section>

          {/* Daily Routine */}
          <Section icon={<Clock size={16} />} title="Daily Routine">
            <div className="space-y-2 text-sm">
              <RoutineRow emoji="🌅" label="Wake Up" value={data.daily_routine.wake_up_time} />
              <RoutineRow emoji="🚿" label="Prep" value={`${data.daily_routine.prep_time_minutes} min`} />
              <RoutineRow emoji="🚗" label="Commute" value={data.daily_routine.commute_time} />
              <RoutineRow emoji="💼" label="Work" value={data.daily_routine.work_hours} />
              <RoutineRow emoji="🏠" label="Home by" value={data.daily_routine.home_arrival_time} />
              <RoutineRow emoji="⏰" label="Free Time" value={`${data.daily_routine.free_time_hours} hrs`} />
              <RoutineRow emoji="🎯" label="Leisure" value={`${data.daily_routine.discretionary_time_hours} hrs`} />
            </div>

            {/* Stress Indicator */}
            <div className="mt-3 p-3 rounded-xl" style={{ background: "var(--bg-input)" }}>
              <div className="flex items-center gap-2 mb-1">
                <Brain size={14} style={{ color: STRESS_COLOR[data.daily_routine.stress_indicator.level] }} />
                <span className="text-sm font-semibold" style={{ color: STRESS_COLOR[data.daily_routine.stress_indicator.level] }}>
                  Stress: {data.daily_routine.stress_indicator.level}
                </span>
                <span className="text-xs ml-auto" style={{ color: "var(--text-muted)" }}>
                  {data.daily_routine.stress_indicator.score}/100
                </span>
              </div>
              <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
                {data.daily_routine.stress_indicator.reason}
              </p>
            </div>
          </Section>

          {/* Decision Explanation */}
          <Section icon={<Zap size={16} />} title="Why This Area?">
            <p className="text-sm mb-3" style={{ color: "var(--text-secondary)" }}>
              {data.decision_explanation.primary_reason}
            </p>
            <div className="mb-3">
              <p className="text-xs font-semibold mb-1.5" style={{ color: "var(--accent-emerald)" }}>
                ✅ Contributing Factors
              </p>
              <ul className="space-y-1">
                {data.decision_explanation.top_contributing_factors.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs" style={{ color: "var(--text-secondary)" }}>
                    <CheckCircle2 size={12} className="mt-0.5 shrink-0" style={{ color: "var(--accent-emerald)" }} />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold mb-1.5" style={{ color: "var(--accent-amber)" }}>
                ⚡ Tradeoffs
              </p>
              <ul className="space-y-1">
                {data.decision_explanation.key_tradeoffs.map((t, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs" style={{ color: "var(--text-secondary)" }}>
                    <AlertTriangle size={12} className="mt-0.5 shrink-0" style={{ color: "var(--accent-amber)" }} />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </Section>

          {/* Trust Metrics */}
          <Section icon={<Shield size={16} />} title="Data Confidence">
            <div className="flex items-center gap-4 mb-2">
              <div className="flex items-center gap-2">
                <Star size={14} style={{ color: "var(--accent-amber)" }} />
                <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
                  Sentiment: <strong style={{ color: "var(--text-primary)" }}>{data.trust_metrics.review_sentiment_score}/100</strong>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Eye size={14} style={{ color: CONFIDENCE_COLOR[data.trust_metrics.data_confidence] }} />
                <span className="text-sm" style={{ color: CONFIDENCE_COLOR[data.trust_metrics.data_confidence] }}>
                  {data.trust_metrics.data_confidence}
                </span>
              </div>
            </div>
            {data.trust_metrics.uncertainty_flags.length > 0 && (
              <div className="space-y-1">
                {data.trust_metrics.uncertainty_flags.map((flag, i) => (
                  <p key={i} className="flex items-start gap-2 text-xs" style={{ color: "var(--text-muted)" }}>
                    <AlertTriangle size={12} className="mt-0.5 shrink-0" style={{ color: "var(--accent-amber)" }} />
                    {flag}
                  </p>
                ))}
              </div>
            )}
          </Section>

          {/* Score Breakdown (Phase 3) */}
          {data.score_breakdown && (
            <Section icon={<BarChart3 size={16} />} title="Score Breakdown">
              <div className="space-y-2.5">
                <ScoreRow label="Financial (40%)" score={data.score_breakdown.financial} color="var(--accent-emerald)" />
                <ScoreRow label="Commute (30%)" score={data.score_breakdown.commute} color="var(--accent-sky)" />
                <ScoreRow label="Lifestyle (20%)" score={data.score_breakdown.lifestyle} color="var(--accent-violet)" />
                <ScoreRow label="Routine (10%)" score={data.score_breakdown.routine} color="var(--accent-amber)" />
              </div>
              <div className="flex justify-between items-center mt-3 pt-3" style={{ borderTop: "1px solid var(--border-default)" }}>
                <span className="text-xs font-semibold" style={{ color: "var(--text-muted)" }}>Weighted Total</span>
                <span className="text-base font-extrabold gradient-text">{data.compatibility_score}/100</span>
              </div>
            </Section>
          )}

          {/* NLP Review Analysis (Phase 2) */}
          {data.review_analysis && (
            <Section icon={<MessageSquare size={16} />} title="Resident Review Insights">
              {/* Summary */}
              <div className="p-3 rounded-xl mb-3" style={{ background: "linear-gradient(135deg, rgba(56,189,248,0.06), rgba(129,140,248,0.06))", border: "1px solid rgba(56,189,248,0.15)" }}>
                <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                  <Sparkles size={14} className="inline mr-1" style={{ color: "var(--accent-sky)" }} />
                  {data.review_analysis.resident_summary}
                </p>
              </div>

              {/* Quick Metrics */}
              <div className="grid grid-cols-3 gap-2 mb-3">
                <div className="p-2.5 rounded-xl text-center" style={{ background: "var(--bg-input)" }}>
                  <ShieldCheck size={16} style={{ color: data.review_analysis.safety_rating === "HIGH" ? "var(--accent-emerald)" : data.review_analysis.safety_rating === "MEDIUM" ? "var(--accent-amber)" : "var(--accent-rose)", margin: "0 auto 4px" }} />
                  <p className="text-xs font-bold" style={{ color: data.review_analysis.safety_rating === "HIGH" ? "var(--accent-emerald)" : data.review_analysis.safety_rating === "MEDIUM" ? "var(--accent-amber)" : "var(--accent-rose)" }}>{data.review_analysis.safety_rating}</p>
                  <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>Safety</p>
                </div>
                <div className="p-2.5 rounded-xl text-center" style={{ background: "var(--bg-input)" }}>
                  <Volume2 size={16} style={{ color: data.review_analysis.noise_complaints > 0 ? "var(--accent-amber)" : "var(--accent-emerald)", margin: "0 auto 4px" }} />
                  <p className="text-xs font-bold" style={{ color: data.review_analysis.noise_complaints > 0 ? "var(--accent-amber)" : "var(--accent-emerald)" }}>{data.review_analysis.noise_complaints > 0 ? `${data.review_analysis.noise_complaints} Issue${data.review_analysis.noise_complaints > 1 ? 's' : ''}` : 'Clean'}</p>
                  <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>Noise</p>
                </div>
                <div className="p-2.5 rounded-xl text-center" style={{ background: "var(--bg-input)" }}>
                  <UtensilsCrossed size={16} style={{ color: data.review_analysis.food_quality_score >= 70 ? "var(--accent-emerald)" : "var(--accent-amber)", margin: "0 auto 4px" }} />
                  <p className="text-xs font-bold" style={{ color: data.review_analysis.food_quality_score >= 70 ? "var(--accent-emerald)" : "var(--accent-amber)" }}>{data.review_analysis.food_quality_score}/100</p>
                  <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>Food</p>
                </div>
              </div>

              {/* Themes */}
              <div className="flex flex-wrap gap-1.5">
                {data.review_analysis.key_positive_themes.map((t, i) => (
                  <span key={`pos-${i}`} className="text-[11px] font-medium px-2 py-1 rounded-full" style={{ background: "rgba(52,211,153,0.1)", color: "var(--accent-emerald)", border: "1px solid rgba(52,211,153,0.2)" }}>
                    ✓ {t}
                  </span>
                ))}
                {data.review_analysis.key_negative_themes.map((t, i) => (
                  <span key={`neg-${i}`} className="text-[11px] font-medium px-2 py-1 rounded-full" style={{ background: "rgba(251,191,36,0.1)", color: "var(--accent-amber)", border: "1px solid rgba(251,191,36,0.2)" }}>
                    ⚠ {t}
                  </span>
                ))}
              </div>

              {/* Maintenance Issues */}
              {data.review_analysis.maintenance_issues.length > 0 && (
                <div className="mt-2">
                  {data.review_analysis.maintenance_issues.map((issue, i) => (
                    <p key={i} className="text-xs flex items-center gap-1.5 mt-1" style={{ color: "var(--text-muted)" }}>
                      <AlertTriangle size={11} style={{ color: "var(--accent-amber)" }} /> {issue}
                    </p>
                  ))}
                </div>
              )}
            </Section>
          )}
          </div>
          )}

          {activeTab === "food" && (
            <div className="space-y-3 fade-in-up">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold flex items-center gap-2" style={{ color: "var(--accent-rose)" }}>
                  <Utensils size={16} /> Top Nearby Dining
                </h4>
                {data.food_spots && data.food_spots.length > 0 && (
                  <span className="text-xs px-2 py-1 rounded-full font-medium"
                    style={{ background: "rgba(251,113,133,0.1)", color: "var(--accent-rose)", border: "1px solid rgba(251,113,133,0.2)" }}>
                    {data.food_spots.length} options · click to book
                  </span>
                )}
              </div>
              {(!data.food_spots || data.food_spots.length === 0) ? (
                <div className="py-8 text-center">
                  <Utensils size={28} className="mx-auto mb-3" style={{ color: "var(--text-muted)", opacity: 0.4 }} />
                  <p className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>Loading food options...</p>
                  <p className="text-xs mt-1" style={{ color: "var(--text-muted)", opacity: 0.6 }}>Run a fresh recommendation to see nearby dining</p>
                </div>
              ) : (
                <>
                  <div className="p-3 rounded-xl mb-3 flex items-center gap-3"
                    style={{ background: "rgba(251,113,133,0.06)", border: "1px solid rgba(251,113,133,0.15)" }}>
                    <Sparkles size={14} style={{ color: "var(--accent-rose)", flexShrink: 0 }} />
                    <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
                      Book a restaurant below to add it to your <strong style={{ color: "var(--accent-rose)" }}>monthly spending tracker</strong>. We estimate ₹200–400/meal × 25 meals.
                    </p>
                  </div>
                  {data.food_spots.map((f, i) => <PlaceRow key={i} place={f} areaName={data.area_name} city={data.city} placeType="food" />)}
                </>
              )}
            </div>
          )}

          {activeTab === "fitness" && (
            <div className="space-y-3 fade-in-up">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold flex items-center gap-2" style={{ color: "var(--accent-emerald)" }}>
                  <Dumbbell size={16} /> Top Nearby Gyms
                </h4>
                {data.gym_options && data.gym_options.length > 0 && (
                  <span className="text-xs px-2 py-1 rounded-full font-medium"
                    style={{ background: "rgba(52,211,153,0.1)", color: "var(--accent-emerald)", border: "1px solid rgba(52,211,153,0.2)" }}>
                    {data.gym_options.length} gyms · click to book
                  </span>
                )}
              </div>
              {(!data.gym_options || data.gym_options.length === 0) ? (
                <div className="py-8 text-center">
                  <Dumbbell size={28} className="mx-auto mb-3" style={{ color: "var(--text-muted)", opacity: 0.4 }} />
                  <p className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>Loading gym options...</p>
                  <p className="text-xs mt-1" style={{ color: "var(--text-muted)", opacity: 0.6 }}>Run a fresh recommendation to see nearby gyms</p>
                </div>
              ) : (
                <>
                  <div className="p-3 rounded-xl mb-3 flex items-center gap-3"
                    style={{ background: "rgba(52,211,153,0.06)", border: "1px solid rgba(52,211,153,0.15)" }}>
                    <Sparkles size={14} style={{ color: "var(--accent-emerald)", flexShrink: 0 }} />
                    <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
                      Book a gym to add its <strong style={{ color: "var(--accent-emerald)" }}>monthly membership cost</strong> directly to your spending tracker.
                    </p>
                  </div>
                  {data.gym_options.map((g, i) => <PlaceRow key={i} place={g} areaName={data.area_name} city={data.city} placeType="gym" />)}
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}


/* ─── Book Area Button ───────────────────────────────────────────── */
function BookAreaButton({ data }: { data: AreaRecommendation }) {
  const { addBooking, isBooked, removeBooking, bookings } = useBookings();
  const booked = isBooked(data.area_name, "accommodation");

  const handleBook = () => {
    if (booked) {
      const item = bookings.find((b) => b.name === data.area_name && b.type === "accommodation");
      if (item) removeBooking(item.id);
    } else {
      addBooking({
        type: "accommodation",
        name: data.area_name,
        area: data.area_name,
        city: data.city,
        monthlyCost: data.rent_estimate,
        details: `${data.accommodation_type.replace("_", " ")} · ${data.one_way_commute_minutes} min commute`,
      });
    }
  };

  return (
    <div className="mt-4">
      <button
        onClick={handleBook}
        className="w-full py-3 px-4 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2"
        style={{
          background: booked
            ? "linear-gradient(135deg, rgba(52,211,153,0.15), rgba(52,211,153,0.08))"
            : "linear-gradient(135deg, rgba(129,140,248,0.15), rgba(167,139,250,0.08))",
          color: booked ? "var(--accent-emerald)" : "var(--accent-indigo)",
          border: `1px solid ${booked ? "rgba(52,211,153,0.35)" : "rgba(129,140,248,0.35)"}`,
        }}
      >
        {booked ? (
          <>✓ Booked — {fmt(data.rent_estimate)}/mo</>
        ) : (
          <>🏠 Book {data.accommodation_type.replace("_", " ")} in {data.area_name} — {fmt(data.rent_estimate)}/mo</>
        )}
      </button>
      {!booked && (
        <p className="text-center text-[10px] mt-1.5" style={{ color: "var(--text-muted)" }}>
          Click to add to your savings calculation
        </p>
      )}
    </div>
  );
}

/* ─── Sub-Components ─────────────────────────────────────────────── */
function StatTile({ icon, label, value, sublabel, badge }: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sublabel: string;
  badge?: string;
}) {
  return (
    <div className="p-3 rounded-xl" style={{ background: "var(--bg-elevated)" }}>
      <div className="flex items-center gap-1.5 mb-1" style={{ color: "var(--text-muted)" }}>
        {icon}
        <span className="text-xs">{label}</span>
      </div>
      <div className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>{value}</div>
      {badge ? (
        <span className={`badge ${badge} mt-1`}>{sublabel}</span>
      ) : (
        <span className="text-xs" style={{ color: "var(--text-muted)" }}>{sublabel}</span>
      )}
    </div>
  );
}

function Section({ icon, title, children }: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="pt-4">
      <h4 className="flex items-center gap-2 text-sm font-semibold mb-3" style={{ color: "var(--accent-indigo)" }}>
        {icon} {title}
      </h4>
      {children}
    </div>
  );
}

function CostRow({ label, amount, total }: { label: string; amount: number; total: number }) {
  const pct = total > 0 ? (amount / total) * 100 : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs capitalize w-24 shrink-0" style={{ color: "var(--text-secondary)" }}>
        {label}
      </span>
      <div className="flex-1 h-1.5 rounded-full" style={{ background: "var(--bg-primary)" }}>
        <div
          className="h-full rounded-full"
          style={{ width: `${pct}%`, background: "var(--gradient-primary)", transition: "width 0.8s ease" }}
        />
      </div>
      <span className="text-xs font-medium w-16 text-right" style={{ color: "var(--text-primary)" }}>
        {fmt(amount)}
      </span>
    </div>
  );
}

function RoutineRow({ emoji, label, value }: { emoji: string; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-base w-6 text-center">{emoji}</span>
      <span className="w-20 shrink-0" style={{ color: "var(--text-muted)" }}>{label}</span>
      <span className="font-medium" style={{ color: "var(--text-primary)" }}>{value}</span>
    </div>
  );
}

function PlaceRow({ place, areaName, city, placeType }: { place: PlaceItem; areaName?: string; city?: string; placeType?: "food" | "gym" }) {
  const { addBooking, isBooked, removeBooking, bookings } = useBookings();
  const [showReview, setShowReview] = useState(false);
  const type = placeType === "gym" ? "gym" : "food";
  const booked = isBooked(place.name, type);

  // Realistic pricing based on rating & type
  const gymPrice = place.rating >= 4.5 ? 3500 : place.rating >= 4 ? 2500 : 1500;
  const mealPrice = place.rating >= 4.5 ? 400 : place.rating >= 4 ? 300 : 200;
  const foodMonthly = mealPrice * 25; // ~25 meals/month
  const estimatedMonthlyCost = placeType === "gym" ? gymPrice : foodMonthly;
  const perUnitLabel = placeType === "gym" ? `₹${gymPrice.toLocaleString("en-IN")}/mo` : `₹${mealPrice}/meal · ₹${foodMonthly.toLocaleString("en-IN")}/mo`;

  const handleBook = () => {
    if (booked) {
      const item = bookings.find((b) => b.name === place.name && b.type === type);
      if (item) removeBooking(item.id);
    } else {
      addBooking({
        type,
        name: place.name,
        area: areaName || "",
        city: city || "",
        monthlyCost: estimatedMonthlyCost,
        details: place.ai_insight || place.address,
      });
    }
  };

  return (
    <div className="p-3 rounded-xl" style={{ background: "var(--bg-input)" }}>
      <div className="flex items-start justify-between gap-3 mb-1">
        <h5 className="text-sm font-bold text-white">{place.name}</h5>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-gray-800 px-2 py-0.5 rounded text-xs text-amber-400">
            <Star size={10} className="fill-current" /> {place.rating}
          </div>
        </div>
      </div>
      <p className="text-xs text-gray-400 mb-1 truncate">{place.address}</p>
      <p className="text-xs mb-2 font-medium" style={{ color: "var(--accent-indigo)" }}>
        <span className="price-tag">{perUnitLabel}</span>
      </p>
      {place.ai_insight && (
        <p className="text-xs text-emerald-400 flex items-start gap-1.5 mb-2">
          <Sparkles size={12} className="shrink-0 mt-0.5" />
          {place.ai_insight}
        </p>
      )}
      <button
        onClick={handleBook}
        className="w-full py-1.5 rounded-lg text-xs font-semibold transition-all"
        style={{
          background: booked ? "rgba(52,211,153,0.15)" : "rgba(129,140,248,0.12)",
          color: booked ? "var(--accent-emerald)" : "var(--accent-indigo)",
          border: `1px solid ${booked ? "rgba(52,211,153,0.3)" : "rgba(129,140,248,0.25)"}`,
        }}
      >
        {booked ? "✓ Booked" : placeType === "gym" ? "🏋️ Book Gym" : "🍽️ Book Restaurant"}
      </button>
      <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
        <button
          onClick={() => setShowReview(!showReview)}
          style={{
            flex: 1, padding: "6px 12px", borderRadius: 8, fontSize: "0.75rem", fontWeight: 600, cursor: "pointer",
            background: "rgba(251,191,36,0.08)", color: "var(--accent-amber)", border: "1px solid rgba(251,191,36,0.15)",
          }}
        >
          {showReview ? "Cancel" : "✍️ Write Review"}
        </button>
      </div>
      {showReview && (
        <ReviewForm placeName={place.name} placeType={type} onSubmit={() => setShowReview(false)} />
      )}
    </div>
  );
}

function ScoreRow({ label, score, color }: { label: string; score: number; color: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs w-28 shrink-0" style={{ color: "var(--text-secondary)" }}>
        {label}
      </span>
      <div className="flex-1 h-2 rounded-full" style={{ background: "var(--bg-primary)" }}>
        <div
          className="h-full rounded-full"
          style={{ width: `${score}%`, background: color, transition: "width 1s ease" }}
        />
      </div>
      <span className="text-xs font-bold w-8 text-right" style={{ color }}>
        {score}
      </span>
    </div>
  );
}

