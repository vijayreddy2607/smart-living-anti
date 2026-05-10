import { useState, type FormEvent } from "react";
import {
  MapPin,
  IndianRupee,
  Moon,
  Utensils,
  Clock,
  Volume2,
  ArrowRight,
  Loader2,
  Briefcase,
  Target,
  CreditCard,
  Calendar,
  Building2,
} from "lucide-react";

/* ─── Types ──────────────────────────────────────────────────────── */
export interface LifestylePreferences {
  noise_tolerance: "low" | "medium" | "high";
  sleep_schedule: string;
  food_habit: "home" | "outside" | "mixed";
  commute_tolerance_minutes: number;
}

export interface RecommendPayload {
  city: string;
  job_location: string;
  monthly_salary: number;
  emi_commitments: number;
  goal_description: string;
  goal_timeframe_months: number;
  lifestyle_preferences: LifestylePreferences;
}

interface Props {
  onSubmit: (data: RecommendPayload) => Promise<void>;
  loading: boolean;
}

/* ─── Constants ──────────────────────────────────────────────────── */
const CITIES: Record<string, { emoji: string; color: string; hubs: string[] }> = {
  Pune:      { emoji: "🏙️", color: "var(--accent-indigo)",  hubs: ["Kharadi", "Viman Nagar", "Hadapsar", "Hinjewadi", "Baner"] },
  Bengaluru: { emoji: "🌿", color: "var(--accent-emerald)", hubs: ["Whitefield", "Electronic City", "Koramangala", "Marathahalli", "Bellandur"] },
  Hyderabad: { emoji: "🕌", color: "var(--accent-violet)",  hubs: ["HITEC City", "Gachibowli", "Madhapur", "Uppal", "Nanakramguda"] },
  Chennai:   { emoji: "🌊", color: "var(--accent-sky)",     hubs: ["Sholinganallur", "Perungudi", "Guindy", "Ambattur", "OMR"] },
  Mumbai:    { emoji: "🏢", color: "var(--accent-amber)",   hubs: ["Powai", "BKC", "Andheri", "Vikhroli", "Lower Parel"] },
};

const GOAL_PRESETS = [
  { label: "Buy a Car",          icon: "🚗", value: "Buy a car" },
  { label: "Emergency Fund",     icon: "🛟", value: "Build an emergency fund" },
  { label: "Wedding",            icon: "💒", value: "Save for wedding expenses" },
  { label: "Vacation",           icon: "✈️", value: "International vacation trip" },
  { label: "Higher Education",   icon: "🎓", value: "Higher education or certification course" },
  { label: "Home Down Payment",  icon: "🏠", value: "Save for home down payment" },
  { label: "Gadgets & Setup",    icon: "💻", value: "Buy laptop and home office setup" },
  { label: "Invest & Grow",      icon: "📈", value: "Start investing in stocks and mutual funds" },
];

const TIMEFRAME_OPTIONS = [
  { label: "6 months", months: 6  },
  { label: "1 year",   months: 12 },
  { label: "2 years",  months: 24 },
  { label: "3 years",  months: 36 },
  { label: "5 years",  months: 60 },
];

const NOISE_OPTIONS: { value: "low" | "medium" | "high"; label: string; icon: string }[] = [
  { value: "low",    label: "Low — Need silence",    icon: "🤫" },
  { value: "medium", label: "Medium — Some noise OK", icon: "🔈" },
  { value: "high",   label: "High — City buzz is fine", icon: "🔊" },
];

const FOOD_OPTIONS: { value: "home" | "outside" | "mixed"; label: string; icon: string }[] = [
  { value: "home",    label: "Home cook", icon: "🏠" },
  { value: "outside", label: "Eat out",   icon: "🍽️" },
  { value: "mixed",   label: "Mixed",     icon: "🍳" },
];

const SLEEP_PRESETS = [
  { label: "Early Bird",  value: "22:00-06:00" },
  { label: "Standard",    value: "23:00-07:00" },
  { label: "Night Owl",   value: "00:00-08:00" },
  { label: "Late Night",  value: "01:00-09:00" },
];

/* ─── Component ──────────────────────────────────────────────────── */
export function InputForm({ onSubmit, loading }: Props) {
  const [city, setCity] = useState("");
  const [jobLocation, setJobLocation] = useState("");
  const [salary, setSalary] = useState("");
  const [emi, setEmi] = useState("");
  const [goalDescription, setGoalDescription] = useState("");
  const [goalCustom, setGoalCustom] = useState("");
  const [goalTimeframe, setGoalTimeframe] = useState(12);
  const [noiseTolerance, setNoiseTolerance] = useState<"low" | "medium" | "high">("medium");
  const [sleepSchedule, setSleepSchedule] = useState("23:00-07:00");
  const [foodHabit, setFoodHabit] = useState<"home" | "outside" | "mixed">("mixed");
  const [commuteTolerance, setCommuteTolerance] = useState(45);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const effectiveGoal = goalDescription === "__custom__" ? goalCustom : goalDescription;
  const cityConfig = city ? CITIES[city] : null;

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!city)        e.city        = "Select your target city";
    if (!jobLocation) e.jobLocation = "Select your work location";
    if (!salary || Number(salary) < 1) e.salary = "Enter a valid salary";
    if (emi === "")   e.emi         = "Enter EMI amount (0 if none)";
    if (!effectiveGoal || effectiveGoal.length < 2) e.goal = "Tell us what you're saving for";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (ev: FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    onSubmit({
      city,
      job_location: jobLocation,
      monthly_salary: Number(salary),
      emi_commitments: Number(emi),
      goal_description: effectiveGoal,
      goal_timeframe_months: goalTimeframe,
      lifestyle_preferences: {
        noise_tolerance: noiseTolerance,
        sleep_schedule: sleepSchedule,
        food_habit: foodHabit,
        commute_tolerance_minutes: commuteTolerance,
      },
    });
  };

  // Live budget preview
  const salaryNum = Number(salary) || 0;
  const emiNum    = Number(emi) || 0;
  const disposable = salaryNum - emiNum;

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* ── Budget Preview Bar ── */}
      {salaryNum > 0 && (
        <div className="glass-card p-5 fade-in-up animate-glow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
              Disposable Income (after EMI)
            </span>
            <span
              className="text-lg font-bold"
              style={{ color: disposable > 0 ? "var(--accent-emerald)" : "var(--accent-rose)" }}
            >
              ₹{disposable.toLocaleString("en-IN")}
            </span>
          </div>
          <div className="score-bar">
            <div
              className="score-bar-fill"
              style={{
                width: `${Math.max(0, Math.min(100, (disposable / salaryNum) * 100))}%`,
                background: disposable > 0 ? "var(--gradient-success)" : "var(--gradient-danger)",
              }}
            />
          </div>
          <div className="flex justify-between mt-2 text-xs" style={{ color: "var(--text-muted)" }}>
            <span>Salary: ₹{salaryNum.toLocaleString("en-IN")}</span>
            <span>EMI: ₹{emiNum.toLocaleString("en-IN")}</span>
          </div>
        </div>
      )}

      {/* ── Section 1: Work & Finance ── */}
      <div className="glass-card p-6 fade-in-up fade-in-up-1">
        <h3 className="flex items-center gap-2 text-base font-semibold mb-5" style={{ color: "var(--text-primary)" }}>
          <Briefcase size={18} style={{ color: "var(--accent-indigo)" }} />
          Work & Finance
        </h3>

        {/* Step 1 — City Selector */}
        <div className="mb-5">
          <label className="form-label">
            <Building2 size={14} className="inline mr-1" />
            Which IT city are you moving to?
          </label>
          <div className="grid grid-cols-5 gap-2">
            {Object.entries(CITIES).map(([c, cfg]) => (
              <button
                key={c}
                type="button"
                onClick={() => {
                  setCity(c);
                  setJobLocation("");
                  setErrors((p) => ({ ...p, city: "", jobLocation: "" }));
                }}
                className="flex flex-col items-center py-3 px-1 rounded-xl text-xs font-semibold transition-all duration-200"
                style={{
                  background: city === c ? `${cfg.color}22` : "var(--bg-input)",
                  border: `1px solid ${city === c ? cfg.color : "var(--border-default)"}`,
                  color: city === c ? cfg.color : "var(--text-secondary)",
                }}
              >
                <span className="text-2xl mb-1">{cfg.emoji}</span>
                {c}
              </button>
            ))}
          </div>
          {errors.city && <p className="text-xs mt-1" style={{ color: "var(--accent-rose)" }}>{errors.city}</p>}
        </div>

        {/* Step 2 — Job Hub (appears after city is chosen) */}
        {city && cityConfig && (
          <div className="mb-5">
            <label className="form-label">
              <MapPin size={14} className="inline mr-1" />
              Where's your office in {city}?
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {cityConfig.hubs.map((hub) => (
                <button
                  key={hub}
                  type="button"
                  onClick={() => { setJobLocation(hub); setErrors((p) => ({ ...p, jobLocation: "" })); }}
                  className="py-2 px-2 rounded-xl text-xs font-medium transition-all duration-200 text-center"
                  style={{
                    background: jobLocation === hub ? `${cityConfig.color}22` : "var(--bg-input)",
                    border: `1px solid ${jobLocation === hub ? cityConfig.color : "var(--border-default)"}`,
                    color: jobLocation === hub ? cityConfig.color : "var(--text-secondary)",
                  }}
                >
                  {hub}
                </button>
              ))}
            </div>
            {errors.jobLocation && <p className="text-xs mt-1" style={{ color: "var(--accent-rose)" }}>{errors.jobLocation}</p>}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Monthly Salary */}
          <div>
            <label htmlFor="salary" className="form-label">
              <IndianRupee size={14} className="inline mr-1" />
              Monthly Salary (₹)
            </label>
            <input
              id="salary"
              type="number"
              className="form-input"
              placeholder="e.g. 50000"
              value={salary}
              onChange={(e) => { setSalary(e.target.value); setErrors((p) => ({ ...p, salary: "" })); }}
              min={1}
            />
            {errors.salary && <p className="text-xs mt-1" style={{ color: "var(--accent-rose)" }}>{errors.salary}</p>}
          </div>

          {/* EMI */}
          <div>
            <label htmlFor="emi" className="form-label">
              <CreditCard size={14} className="inline mr-1" />
              EMI Commitments (₹)
            </label>
            <input
              id="emi"
              type="number"
              className="form-input"
              placeholder="0 if none"
              value={emi}
              onChange={(e) => { setEmi(e.target.value); setErrors((p) => ({ ...p, emi: "" })); }}
              min={0}
            />
            {errors.emi && <p className="text-xs mt-1" style={{ color: "var(--accent-rose)" }}>{errors.emi}</p>}
          </div>
        </div>
      </div>


      {/* ── Section 2: Future Goal ── */}
      <div className="glass-card p-6 fade-in-up fade-in-up-2">
        <h3 className="flex items-center gap-2 text-base font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
          <Target size={18} style={{ color: "var(--accent-emerald)" }} />
          What's Your Goal?
        </h3>
        <p className="text-sm mb-5" style={{ color: "var(--text-muted)" }}>
          Tell us what you're saving for — our AI will calculate how much you need to set aside each month.
        </p>

        {/* Goal Presets */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          {GOAL_PRESETS.map((g) => (
            <button
              key={g.value}
              type="button"
              onClick={() => { setGoalDescription(g.value); setErrors((p) => ({ ...p, goal: "" })); }}
              className="p-3 rounded-xl text-sm font-medium transition-all duration-200 text-center"
              style={{
                background: goalDescription === g.value ? "var(--gradient-glow)" : "var(--bg-input)",
                border: `1px solid ${goalDescription === g.value ? "var(--accent-emerald)" : "var(--border-default)"}`,
                color: goalDescription === g.value ? "var(--accent-emerald)" : "var(--text-secondary)",
              }}
            >
              <span className="text-lg block mb-1">{g.icon}</span>
              {g.label}
            </button>
          ))}
        </div>

        {/* Custom Goal */}
        <button
          type="button"
          onClick={() => setGoalDescription("__custom__")}
          className="w-full p-2 mb-3 rounded-xl text-sm font-medium transition-all text-center"
          style={{
            background: goalDescription === "__custom__" ? "var(--gradient-glow)" : "var(--bg-input)",
            border: `1px solid ${goalDescription === "__custom__" ? "var(--accent-violet)" : "var(--border-default)"}`,
            color: goalDescription === "__custom__" ? "var(--accent-violet)" : "var(--text-muted)",
          }}
        >
          ✏️ Or describe your own goal...
        </button>

        {goalDescription === "__custom__" && (
          <input
            id="custom-goal"
            type="text"
            className="form-input mb-4"
            placeholder="e.g. Start a small business, Buy a bike, Build an investment portfolio..."
            value={goalCustom}
            onChange={(e) => { setGoalCustom(e.target.value); setErrors((p) => ({ ...p, goal: "" })); }}
            maxLength={200}
            autoFocus
          />
        )}

        {errors.goal && <p className="text-xs mb-3" style={{ color: "var(--accent-rose)" }}>{errors.goal}</p>}

        {/* Timeframe */}
        <div>
          <label className="form-label">
            <Calendar size={14} className="inline mr-1" />
            In how much time?
          </label>
          <div className="grid grid-cols-5 gap-3">
            {TIMEFRAME_OPTIONS.map((t) => (
              <button
                key={t.months}
                type="button"
                onClick={() => setGoalTimeframe(t.months)}
                className="p-3 rounded-xl text-sm font-medium transition-all duration-200 text-center"
                style={{
                  background: goalTimeframe === t.months ? "var(--gradient-glow)" : "var(--bg-input)",
                  border: `1px solid ${goalTimeframe === t.months ? "var(--accent-indigo)" : "var(--border-default)"}`,
                  color: goalTimeframe === t.months ? "var(--accent-indigo)" : "var(--text-secondary)",
                }}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Section 3: Lifestyle ── */}
      <div className="glass-card p-6 fade-in-up fade-in-up-3">
        <h3 className="flex items-center gap-2 text-base font-semibold mb-5" style={{ color: "var(--text-primary)" }}>
          <Volume2 size={18} style={{ color: "var(--accent-violet)" }} />
          Lifestyle Preferences
        </h3>

        {/* Noise Tolerance */}
        <div className="mb-5">
          <label className="form-label">Noise Tolerance</label>
          <div className="grid grid-cols-3 gap-3">
            {NOISE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setNoiseTolerance(opt.value)}
                className="p-3 rounded-xl text-sm font-medium transition-all duration-200 text-center"
                style={{
                  background: noiseTolerance === opt.value ? "var(--gradient-glow)" : "var(--bg-input)",
                  border: `1px solid ${noiseTolerance === opt.value ? "var(--accent-indigo)" : "var(--border-default)"}`,
                  color: noiseTolerance === opt.value ? "var(--accent-indigo)" : "var(--text-secondary)",
                }}
              >
                <span className="text-lg block mb-1">{opt.icon}</span>
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Food Habit */}
        <div className="mb-5">
          <label className="form-label">
            <Utensils size={14} className="inline mr-1" />
            Food Habit
          </label>
          <div className="grid grid-cols-3 gap-3">
            {FOOD_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setFoodHabit(opt.value)}
                className="p-3 rounded-xl text-sm font-medium transition-all duration-200 text-center"
                style={{
                  background: foodHabit === opt.value ? "var(--gradient-glow)" : "var(--bg-input)",
                  border: `1px solid ${foodHabit === opt.value ? "var(--accent-indigo)" : "var(--border-default)"}`,
                  color: foodHabit === opt.value ? "var(--accent-indigo)" : "var(--text-secondary)",
                }}
              >
                <span className="text-lg block mb-1">{opt.icon}</span>
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Sleep Schedule */}
        <div className="mb-5">
          <label className="form-label">
            <Moon size={14} className="inline mr-1" />
            Sleep Schedule
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {SLEEP_PRESETS.map((p) => (
              <button
                key={p.value}
                type="button"
                onClick={() => setSleepSchedule(p.value)}
                className="p-3 rounded-xl text-sm font-medium transition-all duration-200 text-center"
                style={{
                  background: sleepSchedule === p.value ? "var(--gradient-glow)" : "var(--bg-input)",
                  border: `1px solid ${sleepSchedule === p.value ? "var(--accent-indigo)" : "var(--border-default)"}`,
                  color: sleepSchedule === p.value ? "var(--accent-indigo)" : "var(--text-secondary)",
                }}
              >
                <span className="block text-xs mb-0.5" style={{ color: "var(--text-muted)" }}>{p.value}</span>
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Commute Tolerance */}
        <div>
          <label htmlFor="commute" className="form-label">
            <Clock size={14} className="inline mr-1" />
            Max Commute Tolerance: <strong style={{ color: "var(--accent-indigo)" }}>{commuteTolerance} min</strong>
          </label>
          <input
            id="commute"
            type="range"
            min={5}
            max={120}
            step={5}
            value={commuteTolerance}
            onChange={(e) => setCommuteTolerance(Number(e.target.value))}
            className="w-full h-2 rounded-full appearance-none cursor-pointer"
            style={{ background: "var(--bg-elevated)", accentColor: "var(--accent-indigo)" }}
          />
          <div className="flex justify-between text-xs mt-1" style={{ color: "var(--text-muted)" }}>
            <span>5 min</span>
            <span>60 min</span>
            <span>120 min</span>
          </div>
        </div>
      </div>

      {/* ── Submit ── */}
      <button type="submit" className="btn-primary w-full justify-center text-base" disabled={loading}>
        {loading ? (
          <>
            <Loader2 size={20} className="animate-spin-slow" />
            AI is analysing your goal & scoring 8 areas…
          </>
        ) : (
          <>
            Find My Perfect Area
            <ArrowRight size={18} />
          </>
        )}
      </button>
    </form>
  );
}
