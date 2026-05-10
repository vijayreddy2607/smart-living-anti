import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Briefcase, Wallet, Heart, Sun, MessageSquare, Check, Sparkles } from "lucide-react";
import { GlassCard } from "@/components/site/GlassCard";

export const Route = createFileRoute("/plan")({
  head: () => ({
    meta: [
      { title: "Plan your move — Smart Living Ecosystem" },
      { name: "description", content: "A guided, intelligent onboarding to model your future lifestyle: finances, habits, commute and review priorities." },
      { property: "og:title", content: "Plan your move — Smart Living" },
      { property: "og:description", content: "Six steps. One intelligent relocation plan." },
    ],
  }),
  component: PlanPage,
});

type FormState = {
  workplace: string;
  city: string;
  salary: number;
  emi: number;
  savingsGoal: number;
  outsideSpend: number;
  sleep: string;
  food: string;
  commuteTolerance: number;
  noiseTolerance: number;
  livingStyle: string;
  reviewPriority: string[];
};

const steps = [
  { id: "job", title: "Job & City", icon: Briefcase, hint: "Where will you work?" },
  { id: "finance", title: "Financial Profile", icon: Wallet, hint: "How does money flow?" },
  { id: "lifestyle", title: "Lifestyle Preferences", icon: Heart, hint: "What kind of life?" },
  { id: "habits", title: "Daily Habits", icon: Sun, hint: "Your daily rhythm" },
  { id: "reviews", title: "Review Priorities", icon: MessageSquare, hint: "What matters most?" },
  { id: "final", title: "Final Planning", icon: Sparkles, hint: "Ready to simulate" },
];

function PlanPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>({
    workplace: "EON IT Park",
    city: "Pune",
    salary: 95000,
    emi: 12000,
    savingsGoal: 25000,
    outsideSpend: 8000,
    sleep: "23:00 – 06:30",
    food: "Mostly home-cooked",
    commuteTolerance: 30,
    noiseTolerance: 40,
    livingStyle: "Quiet & walkable",
    reviewPriority: ["Safety", "Cleanliness"],
  });

  const progress = useMemo(() => ((step + 1) / steps.length) * 100, [step]);

  const update = <K extends keyof FormState>(k: K, v: FormState[K]) => setForm((s) => ({ ...s, [k]: v }));

  const next = () => (step < steps.length - 1 ? setStep(step + 1) : navigate({ to: "/results" }));
  const prev = () => step > 0 && setStep(step - 1);

  return (
    <div className="mx-auto max-w-4xl px-6 pb-24">
      <div className="text-center mb-10">
        <span className="inline-flex items-center gap-2 rounded-full glass px-3 py-1 text-xs text-muted-foreground">
          <Sparkles className="h-3 w-3 text-primary" /> Intelligent onboarding
        </span>
        <h1 className="mt-5 text-4xl md:text-5xl font-semibold tracking-tight">
          Tell the model <span className="text-gradient">about your life</span>
        </h1>
        <p className="mt-3 text-muted-foreground">
          Six short sections. Every answer sharpens your future-city simulation.
        </p>
      </div>

      {/* Stepper */}
      <div className="glass rounded-2xl p-4 mb-6">
        <div className="flex items-center justify-between gap-2 mb-3">
          {steps.map((s, i) => {
            const active = i === step;
            const done = i < step;
            return (
              <button
                key={s.id}
                onClick={() => setStep(i)}
                className="group flex flex-col items-center flex-1 min-w-0"
              >
                <span
                  className={`inline-flex h-8 w-8 items-center justify-center rounded-xl text-xs font-semibold transition-all ${
                    active
                      ? "bg-gradient-primary text-primary-foreground shadow-glow"
                      : done
                      ? "bg-primary/20 text-primary ring-1 ring-primary/40"
                      : "bg-white/5 text-muted-foreground"
                  }`}
                >
                  {done ? <Check className="h-4 w-4" /> : i + 1}
                </span>
                <span className={`mt-2 text-[10px] uppercase tracking-[0.16em] truncate ${active ? "text-foreground" : "text-muted-foreground"}`}>
                  {s.title}
                </span>
              </button>
            );
          })}
        </div>
        <div className="h-1 rounded-full bg-white/5 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-primary"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
      </div>

      <GlassCard strong className="min-h-[420px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.35 }}
          >
            <div className="flex items-center gap-3 mb-6">
              {(() => { const Icon = steps[step].icon; return <Icon className="h-5 w-5 text-primary" />; })()}
              <div>
                <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Step {step + 1} / {steps.length}</div>
                <h2 className="text-xl font-semibold">{steps[step].title}</h2>
              </div>
            </div>

            {step === 0 && (
              <div className="grid md:grid-cols-2 gap-4">
                <Field label="Workplace location" value={form.workplace} onChange={(v) => update("workplace", v)} placeholder="e.g. EON IT Park" />
                <Field label="Destination city" value={form.city} onChange={(v) => update("city", v)} placeholder="e.g. Pune" />
              </div>
            )}

            {step === 1 && (
              <div className="grid md:grid-cols-2 gap-4">
                <NumberField label="Monthly salary (₹)" value={form.salary} onChange={(v) => update("salary", v)} />
                <NumberField label="EMI commitments (₹)" value={form.emi} onChange={(v) => update("emi", v)} />
                <NumberField label="Monthly savings goal (₹)" value={form.savingsGoal} onChange={(v) => update("savingsGoal", v)} />
                <NumberField label="Outside / lifestyle spend (₹)" value={form.outsideSpend} onChange={(v) => update("outsideSpend", v)} />
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <ChipChoice
                  label="Preferred living style"
                  value={form.livingStyle}
                  options={["Quiet & walkable", "Social & central", "Spacious suburb", "Premium high-rise"]}
                  onChange={(v) => update("livingStyle", v)}
                />
                <SliderField label={`Noise tolerance · ${form.noiseTolerance}`} value={form.noiseTolerance} onChange={(v) => update("noiseTolerance", v)} />
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <Field label="Sleep schedule" value={form.sleep} onChange={(v) => update("sleep", v)} />
                <ChipChoice
                  label="Food preference"
                  value={form.food}
                  options={["Mostly home-cooked", "Eat-out friendly", "Mixed", "Vegetarian-only"]}
                  onChange={(v) => update("food", v)}
                />
                <SliderField label={`Commute tolerance · ${form.commuteTolerance} min`} value={form.commuteTolerance} max={90} onChange={(v) => update("commuteTolerance", v)} />
              </div>
            )}

            {step === 4 && (
              <div>
                <div className="text-sm text-muted-foreground mb-3">Pick what matters most in resident reviews</div>
                <div className="flex flex-wrap gap-2">
                  {["Safety", "Cleanliness", "Noise", "Water supply", "Cafés & food", "Walkability", "Greenery", "Community"].map((tag) => {
                    const on = form.reviewPriority.includes(tag);
                    return (
                      <button
                        key={tag}
                        onClick={() =>
                          update(
                            "reviewPriority",
                            on ? form.reviewPriority.filter((t) => t !== tag) : [...form.reviewPriority, tag],
                          )
                        }
                        className={`rounded-xl px-3 py-1.5 text-sm transition-all ${
                          on ? "bg-gradient-primary text-primary-foreground shadow-glow" : "glass text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {step === 5 && (
              <div className="space-y-5">
                <p className="text-muted-foreground">
                  We'll simulate your monthly finances, daily routine, commute stress and review intelligence across your candidate areas. Ready?
                </p>
                <div className="grid md:grid-cols-3 gap-3">
                  <Summary label="City" value={`${form.workplace}, ${form.city}`} />
                  <Summary label="Salary / EMI" value={`₹${form.salary.toLocaleString()} · ₹${form.emi.toLocaleString()}`} />
                  <Summary label="Savings goal" value={`₹${form.savingsGoal.toLocaleString()}/mo`} />
                  <Summary label="Living style" value={form.livingStyle} />
                  <Summary label="Commute tolerance" value={`${form.commuteTolerance} min`} />
                  <Summary label="Priorities" value={form.reviewPriority.join(", ") || "—"} />
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="mt-8 flex items-center justify-between">
          <button
            onClick={prev}
            disabled={step === 0}
            className="inline-flex items-center gap-2 rounded-xl glass px-4 py-2 text-sm disabled:opacity-30"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
          {step < steps.length - 1 ? (
            <button
              onClick={next}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow"
            >
              Continue <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <Link
              to="/results"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow"
            >
              Run simulation <Sparkles className="h-4 w-4" />
            </Link>
          )}
        </div>
      </GlassCard>
    </div>
  );
}

function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{label}</span>
      <input
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full rounded-xl bg-white/[0.04] ring-1 ring-white/10 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/50 transition-all"
      />
    </label>
  );
}

function NumberField({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{label}</span>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value) || 0)}
        className="mt-2 w-full rounded-xl bg-white/[0.04] ring-1 ring-white/10 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/50 transition-all"
      />
    </label>
  );
}

function SliderField({ label, value, onChange, max = 100 }: { label: string; value: number; onChange: (v: number) => void; max?: number }) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{label}</span>
      <input
        type="range"
        min={0}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-3 w-full accent-[oklch(0.78_0.14_200)]"
      />
    </label>
  );
}

function ChipChoice({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (v: string) => void }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{label}</div>
      <div className="mt-2 flex flex-wrap gap-2">
        {options.map((o) => (
          <button
            key={o}
            onClick={() => onChange(o)}
            className={`rounded-xl px-3 py-1.5 text-sm transition-all ${
              value === o ? "bg-gradient-primary text-primary-foreground shadow-glow" : "glass text-muted-foreground hover:text-foreground"
            }`}
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}

function Summary({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-white/[0.03] ring-1 ring-white/5 p-3">
      <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{label}</div>
      <div className="mt-1 text-sm font-medium truncate">{value}</div>
    </div>
  );
}
