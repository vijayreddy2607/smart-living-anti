import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer,
  Tooltip, XAxis, YAxis, RadialBar, RadialBarChart, PolarAngleAxis,
} from "recharts";
import {
  ArrowRight, ChevronDown, Clock, Coffee, Dumbbell, Briefcase, MoonStar,
  TrainFront, Utensils, Sun, Sparkles, Leaf, Wallet, MapPin, ShieldCheck,
} from "lucide-react";
import { GlassCard } from "@/components/site/GlassCard";
import { ScoreRing } from "@/components/site/ScoreRing";
import { recommendedAreas, routineTimeline, reviewKeywords, type AreaRecommendation } from "@/lib/data";

export const Route = createFileRoute("/results")({
  head: () => ({
    meta: [
      { title: "Your lifestyle plan — Smart Living Ecosystem" },
      { name: "description", content: "Lifestyle sustainability score, recommended areas, financial health, daily routine and review intelligence — visualised." },
      { property: "og:title", content: "Your lifestyle plan" },
      { property: "og:description", content: "Recommendations, routine simulation and tradeoff intelligence." },
    ],
  }),
  component: ResultsPage,
});

function ResultsPage() {
  const [selectedId, setSelectedId] = useState(recommendedAreas[0].id);
  const selected = recommendedAreas.find((a) => a.id === selectedId)!;

  return (
    <div className="mx-auto max-w-7xl px-6 pb-24 space-y-8">
      {/* Hero summary */}
      <section>
        <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full glass px-3 py-1 text-xs text-muted-foreground">
              <Sparkles className="h-3 w-3 text-primary" /> Lifestyle simulation complete
            </span>
            <h1 className="mt-4 text-4xl md:text-5xl font-semibold tracking-tight">
              Your <span className="text-gradient">future-city plan</span>
            </h1>
            <p className="mt-2 text-muted-foreground">Three areas, modeled across finance, commute, calm and community.</p>
          </div>
          <Link to="/booking" className="inline-flex items-center gap-2 rounded-2xl bg-gradient-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow">
            Open Booking Assistant <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid lg:grid-cols-4 gap-5">
          <GlassCard strong className="lg:col-span-1 flex flex-col items-center text-center">
            <ScoreRing value={selected.sustainability} label="Sustainability" size={150} />
            <div className="mt-4 font-semibold">{selected.name}, {selected.city}</div>
            <div className="text-xs text-muted-foreground mt-1">{selected.vibe}</div>
          </GlassCard>

          <GlassCard className="lg:col-span-3 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Stat icon={Wallet} label="Predicted savings" value={`₹${selected.savingsRemaining.toLocaleString()}`} sub="per month" />
            <Stat icon={Clock} label="Avg commute" value={`${selected.commuteMinutes} min`} sub="one-way" />
            <Stat icon={Leaf} label="Stress index" value={`${selected.stressLevel}`} sub={selected.stressLevel < 35 ? "Low" : selected.stressLevel < 60 ? "Moderate" : "High"} />
            <Stat icon={ShieldCheck} label="Lifestyle match" value={`${selected.lifestyleMatch}%`} sub="vs your inputs" />
          </GlassCard>
        </div>
      </section>

      {/* Recommended areas */}
      <section>
        <SectionHeader title="Top recommended areas" hint="Tap a card to deep-dive" />
        <div className="grid md:grid-cols-3 gap-5">
          {recommendedAreas.map((a, i) => (
            <AreaCard key={a.id} a={a} active={a.id === selectedId} onSelect={() => setSelectedId(a.id)} delay={i * 0.05} />
          ))}
        </div>
      </section>

      {/* Financial + routine */}
      <section className="grid lg:grid-cols-5 gap-5">
        <GlassCard className="lg:col-span-3">
          <SectionHeader title="Financial health" hint={`${selected.name} · monthly breakdown`} small />
          <div className="h-64 mt-4">
            <ResponsiveContainer>
              <BarChart data={Object.entries(selected.monthlySpending).map(([k, v]) => ({ name: k, value: v }))}>
                <CartesianGrid stroke="oklch(1 0 0 / 0.05)" vertical={false} />
                <XAxis dataKey="name" stroke="oklch(0.70 0.03 250)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="oklch(0.70 0.03 250)" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  cursor={{ fill: "oklch(1 0 0 / 0.04)" }}
                  contentStyle={{ background: "oklch(0.20 0.03 260 / 0.95)", border: "1px solid oklch(1 0 0 / 0.1)", borderRadius: 12, fontSize: 12 }}
                />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {Object.keys(selected.monthlySpending).map((_, i) => (
                    <Cell key={i} fill={i % 2 === 0 ? "oklch(0.78 0.14 200)" : "oklch(0.72 0.18 305)"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard className="lg:col-span-2">
          <SectionHeader title="Stress prediction" hint="Across the day" small />
          <div className="h-64 mt-4">
            <ResponsiveContainer>
              <RadialBarChart innerRadius="50%" outerRadius="100%" data={[{ name: "stress", value: selected.stressLevel, fill: "url(#stressGrad)" }]} startAngle={210} endAngle={-30}>
                <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                <RadialBar background={{ fill: "oklch(1 0 0 / 0.06)" }} dataKey="value" cornerRadius={20} />
                <defs>
                  <linearGradient id="stressGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="oklch(0.78 0.14 200)" />
                    <stop offset="100%" stopColor="oklch(0.72 0.18 305)" />
                  </linearGradient>
                </defs>
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-muted-foreground text-center -mt-6">
            {selected.stressLevel < 35 ? "Calm. Sustainable long-term." : selected.stressLevel < 60 ? "Moderate. Watch peak hours." : "High. Consider closer alternatives."}
          </p>
        </GlassCard>
      </section>

      {/* Routine simulation */}
      <section>
        <SectionHeader title="Daily routine simulation" hint="A modeled day in your future neighborhood" />
        <GlassCard strong>
          <div className="relative">
            <div className="absolute left-6 top-2 bottom-2 w-px bg-gradient-to-b from-primary/60 via-accent/40 to-transparent" />
            <ul className="space-y-4">
              {routineTimeline.map((b, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.04 }}
                  className="relative pl-14"
                >
                  <span className="absolute left-2 top-1 inline-flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-primary/20 ring-1 ring-primary/30">
                    <RoutineIcon type={b.type} />
                  </span>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <div className="font-medium">{b.label}</div>
                      <div className="text-xs text-muted-foreground">{b.start} → {b.end}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">stress</span>
                      <div className="h-1.5 w-28 rounded-full bg-white/5 overflow-hidden">
                        <div className="h-full bg-gradient-primary" style={{ width: `${b.stress}%` }} />
                      </div>
                      <span className="text-xs tabular-nums w-8 text-right">{b.stress}</span>
                    </div>
                  </div>
                </motion.li>
              ))}
            </ul>
          </div>
          <div className="mt-6 grid sm:grid-cols-3 gap-3">
            <MiniInsight label="Work-life balance" value="Healthy" tone="good" />
            <MiniInsight label="Sleep window" value="7h 30m" tone="good" />
            <MiniInsight label="Sustainability" value="Long-term viable" tone="good" />
          </div>
        </GlassCard>
      </section>

      {/* NLP review intelligence */}
      <section className="grid lg:grid-cols-5 gap-5">
        <GlassCard className="lg:col-span-2">
          <SectionHeader title="Review sentiment" hint={`${selected.name} · NLP-distilled`} small />
          <div className="h-56 mt-4">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={[
                    { name: "Positive", value: selected.reviewSentiment.positive },
                    { name: "Neutral", value: selected.reviewSentiment.neutral },
                    { name: "Negative", value: selected.reviewSentiment.negative },
                  ]}
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                >
                  <Cell fill="oklch(0.78 0.14 200)" />
                  <Cell fill="oklch(0.55 0.04 260)" />
                  <Cell fill="oklch(0.68 0.22 25)" />
                </Pie>
                <Tooltip contentStyle={{ background: "oklch(0.20 0.03 260 / 0.95)", border: "1px solid oklch(1 0 0 / 0.1)", borderRadius: 12, fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-center gap-4 text-xs">
            <Legend dot="oklch(0.78 0.14 200)" label={`${selected.reviewSentiment.positive}% positive`} />
            <Legend dot="oklch(0.55 0.04 260)" label={`${selected.reviewSentiment.neutral}% neutral`} />
            <Legend dot="oklch(0.68 0.22 25)" label={`${selected.reviewSentiment.negative}% negative`} />
          </div>
        </GlassCard>

        <GlassCard className="lg:col-span-3">
          <SectionHeader title="Keyword intelligence" hint="What residents actually say" small />
          <div className="mt-4 flex flex-wrap gap-2">
            {reviewKeywords.map((k) => (
              <span
                key={k.word}
                className={`rounded-full px-3 py-1.5 text-sm ring-1 ${
                  k.sentiment === "positive"
                    ? "bg-primary/10 ring-primary/30 text-foreground"
                    : "bg-destructive/10 ring-destructive/30 text-foreground/90"
                }`}
                style={{ fontSize: `${0.78 + (k.weight / 100) * 0.5}rem` }}
              >
                {k.word}
              </span>
            ))}
          </div>
          <div className="mt-6 grid grid-cols-3 gap-3 text-center">
            <TrustChip label="Safety" value="High" />
            <TrustChip label="Cleanliness" value="Above avg" />
            <TrustChip label="Confidence" value="92%" />
          </div>
        </GlassCard>
      </section>

      {/* Tradeoff engine */}
      <section>
        <SectionHeader title="Smart tradeoff engine" hint="Honest comparisons across your shortlist" />
        <div className="grid md:grid-cols-3 gap-5">
          {recommendedAreas.map((a, i) => (
            <GlassCard key={a.id} transition={{ delay: i * 0.05, duration: 0.5 }}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold">{a.name}</div>
                  <div className="text-xs text-muted-foreground">{a.vibe}</div>
                </div>
                <span className="text-sm rounded-lg bg-primary/10 ring-1 ring-primary/30 px-2 py-0.5">{a.compatibility}%</span>
              </div>
              <div className="mt-4 space-y-3">
                {a.tradeoffs.map((t, idx) => (
                  <div key={idx} className="rounded-xl bg-white/[0.03] ring-1 ring-white/5 p-3 text-sm">
                    <div className="text-foreground">+ {t.pro}</div>
                    <div className="text-muted-foreground mt-1">− {t.con}</div>
                  </div>
                ))}
              </div>
            </GlassCard>
          ))}
        </div>
      </section>
    </div>
  );
}

function AreaCard({ a, active, onSelect, delay }: { a: AreaRecommendation; active: boolean; onSelect: () => void; delay: number }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      onClick={onSelect}
      className={`cursor-pointer rounded-3xl p-6 transition-all ${
        active ? "glass-strong ring-2 ring-primary/40 shadow-glow" : "glass hover:bg-white/[0.04]"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3 text-primary" /> {a.city}
          </div>
          <div className="mt-1 text-xl font-semibold">{a.name}</div>
          <div className="text-xs text-muted-foreground mt-0.5">{a.vibe}</div>
        </div>
        <ScoreRing value={a.compatibility} label="match" size={72} stroke={7} />
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
        <Mini label="Commute" value={`${a.commuteMinutes} min`} />
        <Mini label="Rent" value={`₹${(a.monthlyRent / 1000).toFixed(0)}k`} />
        <Mini label="Savings" value={`₹${(a.savingsRemaining / 1000).toFixed(1)}k`} />
        <Mini label="Stress" value={`${a.stressLevel}`} />
      </div>

      <button
        onClick={(e) => { e.stopPropagation(); setOpen((o) => !o); }}
        className="mt-4 flex items-center justify-between w-full text-xs text-muted-foreground hover:text-foreground"
      >
        <span>What residents say</span>
        <ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden mt-2 space-y-1.5 text-xs text-muted-foreground"
          >
            {a.highlights.map((h) => (
              <li key={h} className="flex gap-2"><span className="text-primary">·</span>{h}</li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function Stat({ icon: Icon, label, value, sub }: { icon: typeof Wallet; label: string; value: string; sub: string }) {
  return (
    <div className="rounded-2xl bg-white/[0.03] ring-1 ring-white/5 p-4">
      <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
        <Icon className="h-3.5 w-3.5 text-primary" /> {label}
      </div>
      <div className="mt-2 text-xl font-semibold">{value}</div>
      <div className="text-xs text-muted-foreground">{sub}</div>
    </div>
  );
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-white/[0.03] ring-1 ring-white/5 p-3">
      <div className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">{label}</div>
      <div className="mt-1 font-medium">{value}</div>
    </div>
  );
}

function SectionHeader({ title, hint, small }: { title: string; hint?: string; small?: boolean }) {
  return (
    <div className={`flex items-end justify-between mb-${small ? 0 : 5}`}>
      <h2 className={small ? "text-base font-semibold" : "text-2xl font-semibold tracking-tight"}>{title}</h2>
      {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
    </div>
  );
}

function RoutineIcon({ type }: { type: string }) {
  const cls = "h-4 w-4 text-primary";
  if (type === "rest") return <MoonStar className={cls} />;
  if (type === "commute") return <TrainFront className={cls} />;
  if (type === "work") return <Briefcase className={cls} />;
  if (type === "social") return <Utensils className={cls} />;
  return <Sun className={cls} />;
}

function MiniInsight({ label, value, tone }: { label: string; value: string; tone: "good" | "warn" }) {
  return (
    <div className="rounded-xl bg-white/[0.03] ring-1 ring-white/5 p-3">
      <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{label}</div>
      <div className={`mt-1 font-medium ${tone === "good" ? "text-foreground" : "text-destructive"}`}>{value}</div>
    </div>
  );
}

function Legend({ dot, label }: { dot: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-muted-foreground">
      <span className="h-2 w-2 rounded-full" style={{ background: dot }} />
      {label}
    </span>
  );
}

function TrustChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-white/[0.03] ring-1 ring-white/5 p-3">
      <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{label}</div>
      <div className="mt-1 font-semibold text-sm">{value}</div>
    </div>
  );
}
