import { useState } from "react";
import {
  ArrowLeft,
  BarChart3,
  Shield,
  AlertTriangle,
  TrendingUp,
  Sparkles,
  Target,
  PiggyBank,
  Calendar,
  Lightbulb,
  Pencil,
} from "lucide-react";
import { AreaCard, type AreaRecommendation } from "./AreaCard";
import { MapCard } from "./MapCard";
import { TravelCard, type TripSuggestion } from "./TravelCard";
import { SavingsChart } from "./SavingsChart";
import { EditProfilePanel } from "./EditProfilePanel";
import type { RecommendPayload } from "./InputForm";


/* ─── Types ──────────────────────────────────────────────────────── */
interface GlobalInsights {
  overall_sustainability: string;
  average_score: number;
  key_warning: string | null;
  ai_global_insight?: string | null;
}

interface SavingsPlan {
  goal_description: string;
  goal_timeframe_months: number;
  estimated_goal_cost: number;
  monthly_savings_needed: number;
  savings_plan_summary: string;
  goal_feasibility: string;
  ai_tip: string;
}

interface UserSummary {
  city: string;
  job_location: string;
  monthly_salary: number;
  emi_commitments: number;
  goal_description: string;
  goal_timeframe_months: number;
  computed_savings_goal: number;
  noise_tolerance: string;
  sleep_schedule: string;
  food_habit: string;
  commute_tolerance_minutes: number;
  timestamp: string;
}

export interface RecommendResponse {
  user_summary: UserSummary;
  savings_plan: SavingsPlan;
  top_areas: AreaRecommendation[];
  global_insights: GlobalInsights;
  weekend_trips?: TripSuggestion[];
}

interface Props {
  data: RecommendResponse;
  onBack: () => void;
  lastPayload?: RecommendPayload;
  onRerun?: (payload: RecommendPayload) => void;
}

/* ─── Helpers ────────────────────────────────────────────────────── */
const SUSTAINABILITY_STYLE: Record<string, { color: string; bg: string; label: string; icon: string }> = {
  HIGHLY_SUSTAINABLE: {
    color: "var(--accent-emerald)",
    bg: "rgba(52, 211, 153, 0.1)",
    label: "Highly Sustainable",
    icon: "🟢",
  },
  MARGINAL: {
    color: "var(--accent-amber)",
    bg: "rgba(251, 191, 36, 0.1)",
    label: "Marginal",
    icon: "🟡",
  },
  UNSUSTAINABLE: {
    color: "var(--accent-rose)",
    bg: "rgba(251, 113, 133, 0.1)",
    label: "Unsustainable",
    icon: "🔴",
  },
};

const FEASIBILITY_STYLE: Record<string, { color: string; bg: string; label: string }> = {
  EASY:        { color: "var(--accent-emerald)", bg: "rgba(52, 211, 153, 0.15)", label: "Easy" },
  ACHIEVABLE:  { color: "var(--accent-sky)",     bg: "rgba(56, 189, 248, 0.15)", label: "Achievable" },
  CHALLENGING: { color: "var(--accent-amber)",   bg: "rgba(251, 191, 36, 0.15)", label: "Challenging" },
  VERY_HARD:   { color: "var(--accent-rose)",    bg: "rgba(251, 113, 133, 0.15)", label: "Very Hard" },
};

const fmt = (n: number) => `₹${n.toLocaleString("en-IN")}`;

/* ─── Component ──────────────────────────────────────────────────── */
export function ResultsDashboard({ data, onBack, lastPayload, onRerun }: Props) {
  const gi = data.global_insights;
  const sp = data.savings_plan;
  const sus = SUSTAINABILITY_STYLE[gi.overall_sustainability] ?? SUSTAINABILITY_STYLE.MARGINAL;
  const feas = FEASIBILITY_STYLE[sp.goal_feasibility] ?? FEASIBILITY_STYLE.ACHIEVABLE;
  const [showEdit, setShowEdit] = useState(false);


  // Can the best area's savings cover the goal?
  const bestSavings = data.top_areas[0]?.projected_monthly_savings ?? 0;
  const canMeetGoal = bestSavings >= sp.monthly_savings_needed;

  return (
    <div className="space-y-6 fade-in-up">
      {/* ── Back + Edit Row ── */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm font-medium transition-colors"
          style={{ color: "var(--text-secondary)" }}
        >
          <ArrowLeft size={16} />
          Modify Inputs
        </button>
        {lastPayload && onRerun && (
          <button
            id="edit-profile-btn"
            onClick={() => setShowEdit(true)}
            className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all"
            style={{
              background: "rgba(129,140,248,0.1)",
              color: "var(--accent-indigo)",
              border: "1px solid rgba(129,140,248,0.25)",
            }}
          >
            <Pencil size={13} /> Edit Profile &amp; Re-run
          </button>
        )}
      </div>

      {/* ── AI Savings Plan Card ── */}
      <div
        className="glass-card p-6 fade-in-up animate-glow"
        style={{
          borderColor: canMeetGoal ? "rgba(52, 211, 153, 0.25)" : "rgba(251, 191, 36, 0.25)",
        }}
      >
        <div className="flex items-center gap-2 mb-4">
          <Target size={20} style={{ color: "var(--accent-emerald)" }} />
          <h3 className="text-base font-bold" style={{ color: "var(--text-primary)" }}>
            Your AI-Computed Savings Plan
          </h3>
          <span
            className="ml-auto px-3 py-1 rounded-full text-xs font-bold"
            style={{ background: feas.bg, color: feas.color }}
          >
            {feas.label}
          </span>
        </div>

        {/* Goal Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          <div className="p-3 rounded-xl" style={{ background: "var(--bg-elevated)" }}>
            <p className="text-xs flex items-center gap-1" style={{ color: "var(--text-muted)" }}>
              <Target size={12} /> Your Goal
            </p>
            <p className="text-sm font-bold mt-1" style={{ color: "var(--text-primary)" }}>
              {sp.goal_description}
            </p>
          </div>
          <div className="p-3 rounded-xl" style={{ background: "var(--bg-elevated)" }}>
            <p className="text-xs flex items-center gap-1" style={{ color: "var(--text-muted)" }}>
              <Calendar size={12} /> Timeframe
            </p>
            <p className="text-sm font-bold mt-1" style={{ color: "var(--text-primary)" }}>
              {sp.goal_timeframe_months} months
            </p>
          </div>
          <div className="p-3 rounded-xl" style={{ background: "var(--bg-elevated)" }}>
            <p className="text-xs flex items-center gap-1" style={{ color: "var(--text-muted)" }}>
              <PiggyBank size={12} /> Estimated Cost
            </p>
            <p className="text-sm font-bold mt-1 gradient-text">
              {fmt(sp.estimated_goal_cost)}
            </p>
          </div>
          <div className="p-3 rounded-xl" style={{ background: "var(--bg-elevated)" }}>
            <p className="text-xs flex items-center gap-1" style={{ color: "var(--text-muted)" }}>
              <TrendingUp size={12} /> Save/Month
            </p>
            <p
              className="text-sm font-bold mt-1"
              style={{ color: canMeetGoal ? "var(--accent-emerald)" : "var(--accent-amber)" }}
            >
              {fmt(sp.monthly_savings_needed)}
            </p>
          </div>
        </div>

        {/* AI Summary */}
        <div
          className="p-3 rounded-xl mb-3"
          style={{
            background: "linear-gradient(135deg, rgba(52,211,153,0.06), rgba(56,189,248,0.06))",
            border: "1px solid rgba(52,211,153,0.15)",
          }}
        >
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            <Sparkles size={14} className="inline mr-1" style={{ color: "var(--accent-emerald)" }} />
            {sp.savings_plan_summary}
          </p>
        </div>

        {/* Can you meet the goal? */}
        <div
          className="p-3 rounded-xl mb-3"
          style={{
            background: canMeetGoal ? "rgba(52, 211, 153, 0.08)" : "rgba(251, 191, 36, 0.08)",
            border: `1px solid ${canMeetGoal ? "rgba(52,211,153,0.2)" : "rgba(251,191,36,0.2)"}`,
          }}
        >
          <p className="text-sm font-medium" style={{ color: canMeetGoal ? "var(--accent-emerald)" : "var(--accent-amber)" }}>
            {canMeetGoal
              ? `✅ Great news! Living in ${data.top_areas[0]?.area_name ?? "your top area"}, you can save ${fmt(bestSavings)}/month — that's ${fmt(bestSavings - sp.monthly_savings_needed)} more than you need!`
              : `⚠️ In ${data.top_areas[0]?.area_name ?? "your top area"}, you can save ${fmt(bestSavings)}/month but need ${fmt(sp.monthly_savings_needed)}/month. Consider adjusting your timeframe or goal.`
            }
          </p>
        </div>

        {/* AI Tip */}
        {sp.ai_tip && (
          <div className="flex items-start gap-2">
            <Lightbulb size={14} className="mt-0.5 shrink-0" style={{ color: "var(--accent-amber)" }} />
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              {sp.ai_tip}
            </p>
          </div>
        )}
      </div>

      {/* ── Savings Chart (Phase 5) ── */}
      <SavingsChart
        areas={data.top_areas.map((a) => ({
          area_name: a.area_name,
          projected_monthly_savings: a.projected_monthly_savings,
          rank: a.rank,
        }))}
        goalAmount={sp.monthly_savings_needed}
        goalMonths={sp.goal_timeframe_months}
      />

      {/* ── Global Insights Banner ── */}
      <div className="glass-card p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          {/* Sustainability */}
          <div
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl flex-1"
            style={{ background: sus.bg, border: `1px solid ${sus.color}30` }}
          >
            <span className="text-2xl">{sus.icon}</span>
            <div>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>Overall Sustainability</p>
              <p className="text-base font-bold" style={{ color: sus.color }}>{sus.label}</p>
            </div>
          </div>

          {/* Average Score */}
          <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl" style={{ background: "var(--bg-elevated)" }}>
            <BarChart3 size={20} style={{ color: "var(--accent-indigo)" }} />
            <div>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>Average Score</p>
              <p className="text-base font-bold gradient-text">{gi.average_score}/100</p>
            </div>
          </div>

          {/* User Context */}
          <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl" style={{ background: "var(--bg-elevated)" }}>
            <TrendingUp size={20} style={{ color: "var(--accent-emerald)" }} />
            <div>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>Working in</p>
              <p className="text-base font-bold" style={{ color: "var(--text-primary)" }}>
                {data.user_summary.job_location}
              </p>
            </div>
          </div>
        </div>

        {/* Warning */}
        {gi.key_warning && (
          <div
            className="flex items-start gap-3 mt-4 p-3 rounded-xl"
            style={{ background: "rgba(251, 191, 36, 0.08)", border: "1px solid rgba(251, 191, 36, 0.2)" }}
          >
            <AlertTriangle size={16} className="mt-0.5 shrink-0" style={{ color: "var(--accent-amber)" }} />
            <p className="text-sm" style={{ color: "var(--accent-amber)" }}>
              {gi.key_warning}
            </p>
          </div>
        )}

        {/* AI Global Insight */}
        {gi.ai_global_insight && (
          <div
            className="flex items-start gap-3 mt-4 p-3 rounded-xl"
            style={{
              background: "linear-gradient(135deg, rgba(129,140,248,0.08), rgba(167,139,250,0.08))",
              border: "1px solid rgba(129,140,248,0.2)",
            }}
          >
            <Sparkles size={16} className="mt-0.5 shrink-0" style={{ color: "var(--accent-violet)" }} />
            <p className="text-sm" style={{ color: "var(--accent-violet)" }}>
              {gi.ai_global_insight}
            </p>
          </div>
        )}
      </div>

      {/* ── Input Summary Chips ── */}
      <div className="flex flex-wrap gap-2">
        <Chip label="Salary" value={fmt(data.user_summary.monthly_salary)} />
        <Chip label="EMI" value={fmt(data.user_summary.emi_commitments)} />
        <Chip label="AI Savings" value={fmt(data.user_summary.computed_savings_goal)} />
        <Chip label="Commute" value={`≤ ${data.user_summary.commute_tolerance_minutes} min`} />
        <Chip label="Noise" value={data.user_summary.noise_tolerance} />
        <Chip label="Food" value={data.user_summary.food_habit} />
        <Chip label="Sleep" value={data.user_summary.sleep_schedule} />
      </div>

      {/* ── Heading ── */}
      <div>
        <h2 className="text-xl font-bold mb-1" style={{ color: "var(--text-primary)" }}>
          Top 3 Recommendations
        </h2>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          Ranked by compatibility score (40% financial · 30% commute · 20% lifestyle · 10% routine)
        </p>
      </div>

      {/* ── Map View ── */}
      <MapCard areas={data.top_areas} />

      {/* ── Travel Suggestions (Phase 4) ── */}
      {data.weekend_trips && data.weekend_trips.length > 0 && (
        <TravelCard trips={data.weekend_trips} city={data.user_summary.city} />
      )}

      {/* ── Area Cards ── */}
      <div className="space-y-5">
        {data.top_areas.map((area) => (
          <AreaCard key={area.rank} data={area} />
        ))}
      </div>

      {/* ── Footer ── */}
      <div className="glass-card p-5 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Shield size={16} style={{ color: "var(--accent-indigo)" }} />
          <span className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
            Data sourced from local market surveys &amp; resident reviews
          </span>
        </div>
        <p className="text-xs" style={{ color: "var(--text-muted)" }}>
          Generated at {new Date(data.user_summary.timestamp).toLocaleString("en-IN")}
        </p>
      </div>

      {/* ── Edit Profile Panel (Phase 6) ── */}
      {showEdit && lastPayload && onRerun && (
        <EditProfilePanel
          currentPayload={lastPayload}
          onClose={() => setShowEdit(false)}
          onRerun={(updated) => {
            setShowEdit(false);
            onRerun(updated);
          }}
        />
      )}
    </div>
  );
}


function Chip({ label, value }: { label: string; value: string }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
      style={{
        background: "var(--bg-elevated)",
        border: "1px solid var(--border-default)",
        color: "var(--text-secondary)",
      }}
    >
      <span style={{ color: "var(--text-muted)" }}>{label}:</span>
      <span style={{ color: "var(--text-primary)" }}>{value}</span>
    </span>
  );
}
