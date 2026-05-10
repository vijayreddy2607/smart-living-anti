import { useState, type FormEvent } from "react";
import {
  MapPin,
  IndianRupee,
  Moon,
  Utensils,
  Clock,
  Volume2,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Briefcase,
  Target,
  CreditCard,
  Calendar,
  Building2,
  CheckCircle2,
  Sparkles,
  Heart,
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

const NOISE_OPTIONS: { value: "low" | "medium" | "high"; label: string; icon: string; desc: string }[] = [
  { value: "low",    label: "Quiet",    icon: "🤫", desc: "Need silence to focus & sleep" },
  { value: "medium", label: "Balanced", icon: "🔈", desc: "Some background noise is fine" },
  { value: "high",   label: "Lively",   icon: "🔊", desc: "City buzz energizes me" },
];

const FOOD_OPTIONS: { value: "home" | "outside" | "mixed"; label: string; icon: string; desc: string }[] = [
  { value: "home",    label: "Cook at Home", icon: "👨‍🍳", desc: "I prefer homecooked meals" },
  { value: "outside", label: "Eat Out",      icon: "🍽️", desc: "I love dining out daily" },
  { value: "mixed",   label: "Mix of Both",  icon: "🍱", desc: "Sometimes cook, sometimes out" },
];

const SLEEP_PRESETS = [
  { label: "Early Bird",  value: "22:00-06:00", icon: "🌅" },
  { label: "Standard",    value: "23:00-07:00", icon: "😴" },
  { label: "Night Owl",   value: "00:00-08:00", icon: "🦉" },
  { label: "Late Night",  value: "01:00-09:00", icon: "🌙" },
];

const STEPS = [
  { id: 1, label: "Work",     icon: <Briefcase size={16} />, color: "var(--accent-indigo)" },
  { id: 2, label: "Finance",  icon: <IndianRupee size={16} />, color: "var(--accent-emerald)" },
  { id: 3, label: "Lifestyle",icon: <Heart size={16} />, color: "var(--accent-violet)" },
];

/* ─── Component ──────────────────────────────────────────────────── */
export function InputForm({ onSubmit, loading }: Props) {
  const [step, setStep] = useState(1);

  // Step 1
  const [city, setCity] = useState("");
  const [jobLocation, setJobLocation] = useState("");

  // Step 2
  const [salary, setSalary] = useState("");
  const [emi, setEmi] = useState("");
  const [goalDescription, setGoalDescription] = useState("");
  const [goalCustom, setGoalCustom] = useState("");
  const [goalTimeframe, setGoalTimeframe] = useState(12);

  // Step 3
  const [noiseTolerance, setNoiseTolerance] = useState<"low" | "medium" | "high">("medium");
  const [sleepSchedule, setSleepSchedule] = useState("23:00-07:00");
  const [foodHabit, setFoodHabit] = useState<"home" | "outside" | "mixed">("mixed");
  const [commuteTolerance, setCommuteTolerance] = useState(45);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const effectiveGoal = goalDescription === "__custom__" ? goalCustom : goalDescription;
  const cityConfig = city ? CITIES[city] : null;
  const salaryNum = Number(salary) || 0;
  const emiNum = Number(emi) || 0;
  const disposable = salaryNum - emiNum;

  const validateStep = (s: number): boolean => {
    const e: Record<string, string> = {};
    if (s === 1) {
      if (!city) e.city = "Select your target city";
      if (!jobLocation) e.jobLocation = "Select your work location";
    }
    if (s === 2) {
      if (!salary || Number(salary) < 1) e.salary = "Enter a valid salary";
      if (emi === "") e.emi = "Enter EMI amount (0 if none)";
      if (!effectiveGoal || effectiveGoal.length < 2) e.goal = "Tell us what you're saving for";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const nextStep = () => {
    if (validateStep(step)) setStep((s) => s + 1);
  };

  const prevStep = () => {
    setErrors({});
    setStep((s) => s - 1);
  };

  const handleSubmit = (ev: FormEvent) => {
    ev.preventDefault();
    if (!validateStep(3)) return;
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* ── Step Progress Indicator ── */}
      <div className="glass-card p-5">
        <div className="flex items-center justify-between relative">
          {/* Progress line */}
          <div
            className="absolute top-5 left-0 h-0.5 transition-all duration-500"
            style={{
              background: "var(--gradient-primary)",
              width: `${((step - 1) / (STEPS.length - 1)) * 100}%`,
              zIndex: 0,
              marginLeft: "10%",
              marginRight: "10%",
              maxWidth: "80%",
            }}
          />
          <div
            className="absolute top-5 left-0 h-0.5"
            style={{
              background: "var(--border-default)",
              width: "80%",
              marginLeft: "10%",
              zIndex: -1,
            }}
          />

          {STEPS.map((s) => {
            const isActive = step === s.id;
            const isDone = step > s.id;
            return (
              <div key={s.id} className="flex flex-col items-center gap-2 z-10">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300"
                  style={{
                    background: isDone
                      ? "var(--gradient-success)"
                      : isActive
                      ? "var(--gradient-primary)"
                      : "var(--bg-elevated)",
                    border: `2px solid ${isActive ? "transparent" : isDone ? "transparent" : "var(--border-default)"}`,
                    color: isDone || isActive ? "white" : "var(--text-muted)",
                    boxShadow: isActive ? "0 0 20px rgba(99,102,241,0.4)" : "none",
                  }}
                >
                  {isDone ? <CheckCircle2 size={18} /> : s.icon}
                </div>
                <span
                  className="text-xs font-semibold"
                  style={{ color: isActive ? s.color : isDone ? "var(--accent-emerald)" : "var(--text-muted)" }}
                >
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Step subtitle */}
        <p className="text-center mt-4 text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
          {step === 1 && "Tell us where you'll work — we'll find neighborhoods nearby"}
          {step === 2 && "Your financial profile helps us calculate real savings"}
          {step === 3 && "Your lifestyle DNA shapes our final recommendations"}
        </p>
      </div>

      {/* ── Step 1: Work & City ── */}
      {step === 1 && (
        <div className="glass-card p-6 fade-in-up">
          <h3 className="flex items-center gap-2 text-base font-semibold mb-6" style={{ color: "var(--text-primary)" }}>
            <Briefcase size={18} style={{ color: "var(--accent-indigo)" }} />
            Work Location
          </h3>

          {/* City */}
          <div className="mb-6">
            <label className="form-label mb-3 block">
              <Building2 size={14} className="inline mr-1" />
              Which city are you moving to?
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
                  className="flex flex-col items-center py-4 px-1 rounded-xl text-xs font-semibold transition-all duration-200"
                  style={{
                    background: city === c ? `${cfg.color}22` : "var(--bg-input)",
                    border: `2px solid ${city === c ? cfg.color : "var(--border-default)"}`,
                    color: city === c ? cfg.color : "var(--text-secondary)",
                    transform: city === c ? "translateY(-2px)" : "none",
                    boxShadow: city === c ? `0 8px 24px ${cfg.color}30` : "none",
                  }}
                >
                  <span className="text-2xl mb-2">{cfg.emoji}</span>
                  {c}
                </button>
              ))}
            </div>
            {errors.city && <p className="text-xs mt-2" style={{ color: "var(--accent-rose)" }}>{errors.city}</p>}
          </div>

          {/* Job Hub */}
          {city && cityConfig && (
            <div className="fade-in-up">
              <label className="form-label mb-3 block">
                <MapPin size={14} className="inline mr-1" />
                Where's your office in {city}?
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {cityConfig.hubs.map((hub) => (
                  <button
                    key={hub}
                    type="button"
                    onClick={() => { setJobLocation(hub); setErrors((p) => ({ ...p, jobLocation: "" })); }}
                    className="py-3 px-2 rounded-xl text-xs font-medium transition-all duration-200 text-center"
                    style={{
                      background: jobLocation === hub ? `${cityConfig.color}22` : "var(--bg-input)",
                      border: `2px solid ${jobLocation === hub ? cityConfig.color : "var(--border-default)"}`,
                      color: jobLocation === hub ? cityConfig.color : "var(--text-secondary)",
                      transform: jobLocation === hub ? "translateY(-2px)" : "none",
                    }}
                  >
                    {hub}
                  </button>
                ))}
              </div>
              {errors.jobLocation && <p className="text-xs mt-2" style={{ color: "var(--accent-rose)" }}>{errors.jobLocation}</p>}
            </div>
          )}

          {/* Summary if selected */}
          {city && jobLocation && (
            <div className="mt-5 p-4 rounded-xl flex items-center gap-3 fade-in-up"
              style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.08), rgba(139,92,246,0.06))", border: "1px solid rgba(99,102,241,0.2)" }}>
              <Sparkles size={18} style={{ color: "var(--accent-indigo)" }} />
              <p className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                Great! We'll find neighborhoods near <strong style={{ color: "var(--accent-indigo)" }}>{jobLocation}</strong> in{" "}
                <strong style={{ color: cityConfig?.color }}>{city} {cityConfig?.emoji}</strong>
              </p>
            </div>
          )}
        </div>
      )}

      {/* ── Step 2: Financial Profile ── */}
      {step === 2 && (
        <div className="space-y-5 fade-in-up">
          {/* Salary & EMI */}
          <div className="glass-card p-6">
            <h3 className="flex items-center gap-2 text-base font-semibold mb-5" style={{ color: "var(--text-primary)" }}>
              <IndianRupee size={18} style={{ color: "var(--accent-emerald)" }} />
              Monthly Income & Commitments
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
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

            {/* Live budget preview */}
            {salaryNum > 0 && (
              <div className="p-4 rounded-xl fade-in-up"
                style={{ background: disposable > 0 ? "rgba(52,211,153,0.06)" : "rgba(251,113,133,0.06)", border: `1px solid ${disposable > 0 ? "rgba(52,211,153,0.2)" : "rgba(251,113,133,0.2)"}` }}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                    Available after EMI
                  </span>
                  <span className="text-xl font-black"
                    style={{ color: disposable > 0 ? "var(--accent-emerald)" : "var(--accent-rose)" }}>
                    ₹{disposable.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ background: "var(--bg-input)" }}>
                  <div className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${Math.max(0, Math.min(100, (disposable / salaryNum) * 100))}%`,
                      background: disposable > 0 ? "var(--gradient-success)" : "var(--gradient-danger)",
                    }}
                  />
                </div>
                <div className="flex justify-between mt-1.5 text-xs" style={{ color: "var(--text-muted)" }}>
                  <span>Salary ₹{salaryNum.toLocaleString("en-IN")}</span>
                  <span>EMI ₹{emiNum.toLocaleString("en-IN")}</span>
                </div>
              </div>
            )}
          </div>

          {/* Savings Goal */}
          <div className="glass-card p-6">
            <h3 className="flex items-center gap-2 text-base font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
              <Target size={18} style={{ color: "var(--accent-amber)" }} />
              What Are You Saving For?
            </h3>
            <p className="text-sm mb-5" style={{ color: "var(--text-muted)" }}>
              Our AI will calculate exactly how much to set aside each month to reach your goal.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              {GOAL_PRESETS.map((g) => (
                <button
                  key={g.value}
                  type="button"
                  onClick={() => { setGoalDescription(g.value); setErrors((p) => ({ ...p, goal: "" })); }}
                  className="p-3 rounded-xl text-sm font-medium transition-all duration-200 text-center"
                  style={{
                    background: goalDescription === g.value ? "var(--gradient-glow)" : "var(--bg-input)",
                    border: `2px solid ${goalDescription === g.value ? "var(--accent-amber)" : "var(--border-default)"}`,
                    color: goalDescription === g.value ? "var(--accent-amber)" : "var(--text-secondary)",
                    transform: goalDescription === g.value ? "translateY(-2px)" : "none",
                  }}
                >
                  <span className="text-lg block mb-1">{g.icon}</span>
                  {g.label}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setGoalDescription("__custom__")}
              className="w-full p-2.5 mb-3 rounded-xl text-sm font-medium transition-all text-center"
              style={{
                background: goalDescription === "__custom__" ? "var(--gradient-glow)" : "var(--bg-input)",
                border: `2px solid ${goalDescription === "__custom__" ? "var(--accent-violet)" : "var(--border-default)"}`,
                color: goalDescription === "__custom__" ? "var(--accent-violet)" : "var(--text-muted)",
              }}
            >
              ✏️ Describe your own goal...
            </button>

            {goalDescription === "__custom__" && (
              <input
                type="text"
                className="form-input mb-4"
                placeholder="e.g. Start a business, Buy a bike, Build investment portfolio..."
                value={goalCustom}
                onChange={(e) => { setGoalCustom(e.target.value); setErrors((p) => ({ ...p, goal: "" })); }}
                maxLength={200}
                autoFocus
              />
            )}

            {errors.goal && <p className="text-xs mb-3" style={{ color: "var(--accent-rose)" }}>{errors.goal}</p>}

            {/* Timeframe */}
            <div>
              <label className="form-label mb-3 block">
                <Calendar size={14} className="inline mr-1" />
                In how much time?
              </label>
              <div className="grid grid-cols-5 gap-2">
                {TIMEFRAME_OPTIONS.map((t) => (
                  <button
                    key={t.months}
                    type="button"
                    onClick={() => setGoalTimeframe(t.months)}
                    className="p-3 rounded-xl text-sm font-medium transition-all duration-200 text-center"
                    style={{
                      background: goalTimeframe === t.months ? "var(--gradient-glow)" : "var(--bg-input)",
                      border: `2px solid ${goalTimeframe === t.months ? "var(--accent-indigo)" : "var(--border-default)"}`,
                      color: goalTimeframe === t.months ? "var(--accent-indigo)" : "var(--text-secondary)",
                      transform: goalTimeframe === t.months ? "translateY(-2px)" : "none",
                    }}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Step 3: Lifestyle DNA ── */}
      {step === 3 && (
        <div className="space-y-5 fade-in-up">
          <div className="glass-card p-6">
            <h3 className="flex items-center gap-2 text-base font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
              <Heart size={18} style={{ color: "var(--accent-violet)" }} />
              Your Lifestyle DNA
            </h3>
            <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>
              This shapes how we match neighborhoods to your daily life and stress tolerance.
            </p>

            {/* Noise Tolerance */}
            <div className="mb-6">
              <label className="form-label mb-3 block">
                <Volume2 size={14} className="inline mr-1" />
                How much noise can you handle?
              </label>
              <div className="grid grid-cols-3 gap-3">
                {NOISE_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setNoiseTolerance(opt.value)}
                    className="p-4 rounded-xl text-sm font-medium transition-all duration-200 text-center"
                    style={{
                      background: noiseTolerance === opt.value ? "var(--gradient-glow)" : "var(--bg-input)",
                      border: `2px solid ${noiseTolerance === opt.value ? "var(--accent-indigo)" : "var(--border-default)"}`,
                      color: noiseTolerance === opt.value ? "var(--accent-indigo)" : "var(--text-secondary)",
                      transform: noiseTolerance === opt.value ? "translateY(-2px)" : "none",
                    }}
                  >
                    <span className="text-2xl block mb-2">{opt.icon}</span>
                    <span className="font-bold block mb-1">{opt.label}</span>
                    <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>{opt.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Food Habit */}
            <div className="mb-6">
              <label className="form-label mb-3 block">
                <Utensils size={14} className="inline mr-1" />
                Food habits
              </label>
              <div className="grid grid-cols-3 gap-3">
                {FOOD_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setFoodHabit(opt.value)}
                    className="p-4 rounded-xl text-sm font-medium transition-all duration-200 text-center"
                    style={{
                      background: foodHabit === opt.value ? "var(--gradient-glow)" : "var(--bg-input)",
                      border: `2px solid ${foodHabit === opt.value ? "var(--accent-emerald)" : "var(--border-default)"}`,
                      color: foodHabit === opt.value ? "var(--accent-emerald)" : "var(--text-secondary)",
                      transform: foodHabit === opt.value ? "translateY(-2px)" : "none",
                    }}
                  >
                    <span className="text-2xl block mb-2">{opt.icon}</span>
                    <span className="font-bold block mb-1">{opt.label}</span>
                    <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>{opt.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Sleep Schedule */}
            <div className="mb-6">
              <label className="form-label mb-3 block">
                <Moon size={14} className="inline mr-1" />
                Sleep schedule
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {SLEEP_PRESETS.map((p) => (
                  <button
                    key={p.value}
                    type="button"
                    onClick={() => setSleepSchedule(p.value)}
                    className="p-4 rounded-xl text-sm font-medium transition-all duration-200 text-center"
                    style={{
                      background: sleepSchedule === p.value ? "var(--gradient-glow)" : "var(--bg-input)",
                      border: `2px solid ${sleepSchedule === p.value ? "var(--accent-violet)" : "var(--border-default)"}`,
                      color: sleepSchedule === p.value ? "var(--accent-violet)" : "var(--text-secondary)",
                      transform: sleepSchedule === p.value ? "translateY(-2px)" : "none",
                    }}
                  >
                    <span className="text-2xl block mb-1">{p.icon}</span>
                    <span className="font-bold block text-xs mb-0.5">{p.label}</span>
                    <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>{p.value}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Commute Tolerance */}
            <div>
              <label htmlFor="commute" className="form-label mb-3 block">
                <Clock size={14} className="inline mr-1" />
                Max commute tolerance:{" "}
                <strong style={{ color: "var(--accent-amber)", fontSize: "1rem" }}>
                  {commuteTolerance} min
                </strong>
              </label>
              <div className="px-1">
                <input
                  id="commute"
                  type="range"
                  min={5}
                  max={120}
                  step={5}
                  value={commuteTolerance}
                  onChange={(e) => setCommuteTolerance(Number(e.target.value))}
                  className="w-full h-2 rounded-full appearance-none cursor-pointer"
                  style={{ background: "var(--bg-elevated)", accentColor: "var(--accent-amber)" }}
                />
                <div className="flex justify-between text-xs mt-2" style={{ color: "var(--text-muted)" }}>
                  <span>5 min (walking)</span>
                  <span>60 min</span>
                  <span>120 min</span>
                </div>
              </div>

              {/* Commute insight */}
              <div className="mt-3 p-3 rounded-xl flex items-center gap-2"
                style={{ background: "var(--bg-input)", border: "1px solid var(--border-default)" }}>
                <span className="text-lg">
                  {commuteTolerance <= 20 ? "⚡" : commuteTolerance <= 45 ? "🚗" : commuteTolerance <= 75 ? "🚌" : "🛤️"}
                </span>
                <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
                  {commuteTolerance <= 20 && "You prefer very close neighborhoods — walkable distance from work"}
                  {commuteTolerance > 20 && commuteTolerance <= 45 && "Good balance — most premium neighborhoods within range"}
                  {commuteTolerance > 45 && commuteTolerance <= 75 && "Flexible — opens up more affordable options with good savings"}
                  {commuteTolerance > 75 && "Long commute tolerance — maximum budget options available"}
                </p>
              </div>
            </div>
          </div>

          {/* Summary card before submit */}
          <div className="glass-card p-5"
            style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.06), rgba(167,139,250,0.06))", borderColor: "rgba(99,102,241,0.2)" }}>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles size={16} style={{ color: "var(--accent-violet)" }} />
              <span className="text-sm font-bold" style={{ color: "var(--accent-violet)" }}>Your Profile Summary</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {[
                { label: "City", value: `${city} ${cityConfig?.emoji || ""}` },
                { label: "Office", value: jobLocation },
                { label: "Salary", value: salary ? `₹${Number(salary).toLocaleString("en-IN")}` : "—" },
                { label: "EMI", value: emi ? `₹${Number(emi).toLocaleString("en-IN")}` : "₹0" },
                { label: "Goal", value: effectiveGoal || "—" },
                { label: "Timeline", value: `${goalTimeframe} months` },
              ].map(({ label, value }) => (
                <div key={label} className="px-3 py-2 rounded-xl" style={{ background: "var(--bg-elevated)" }}>
                  <p className="text-[10px] uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>{label}</p>
                  <p className="text-xs font-bold truncate mt-0.5" style={{ color: "var(--text-primary)" }}>{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Navigation Buttons ── */}
      <div className="flex gap-3">
        {step > 1 && (
          <button
            type="button"
            onClick={prevStep}
            className="btn-secondary flex-1 justify-center"
            style={{ flex: "0 0 auto", padding: "13px 24px" }}
          >
            <ArrowLeft size={16} /> Back
          </button>
        )}

        {step < 3 ? (
          <button
            type="button"
            onClick={nextStep}
            className="btn-primary"
            style={{ flex: 1, justifyContent: "center" }}
          >
            Continue
            <ArrowRight size={18} />
          </button>
        ) : (
          <button
            type="submit"
            className="btn-primary"
            style={{ flex: 1, justifyContent: "center" }}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 size={20} className="animate-spin-slow" />
                AI is scoring neighborhoods…
              </>
            ) : (
              <>
                Find My Perfect Area
                <ArrowRight size={18} />
              </>
            )}
          </button>
        )}
      </div>
    </form>
  );
}
