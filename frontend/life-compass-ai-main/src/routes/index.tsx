import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ArrowRight, Sparkles, Brain, Wallet, Clock4, MessageSquareHeart,
  Compass, ShieldCheck, LineChart, Leaf,
} from "lucide-react";
import { GlassCard } from "@/components/site/GlassCard";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Smart Living Ecosystem — Move Smarter. Live Better." },
      { name: "description", content: "An AI-powered lifestyle planning platform for professionals relocating to new cities. Plan finances, commute, routine and reviews before you move." },
      { property: "og:title", content: "Smart Living Ecosystem" },
      { property: "og:description", content: "Move smarter. Live better. AI relocation intelligence for professionals." },
    ],
  }),
  component: Landing,
});

const features = [
  { icon: Brain, title: "Lifestyle Intelligence", desc: "An adaptive model scores how sustainable each neighborhood is for your real life — not just rent." },
  { icon: Wallet, title: "Financial Planning", desc: "Salary, EMI, savings goals and discretionary spending — modeled into a livable monthly plan." },
  { icon: Clock4, title: "Daily Routine Simulation", desc: "Your future day mapped minute-by-minute, with stress and recovery built in." },
  { icon: MessageSquareHeart, title: "NLP Review Insights", desc: "Thousands of resident reviews distilled into trust signals you can actually use." },
  { icon: Compass, title: "Tradeoff Engine", desc: "Compare areas across commute, cost, calm and community — visually and honestly." },
  { icon: ShieldCheck, title: "Booking Assistant", desc: "A guided, explainable workflow that validates affordability before you ever sign." },
];

function Landing() {
  return (
    <div className="relative">
      {/* HERO */}
      <section className="relative mx-auto max-w-6xl px-6 pt-12 pb-28">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full glass px-3 py-1 text-xs text-muted-foreground">
            <Sparkles className="h-3 w-3 text-primary" />
            AI-powered urban relocation intelligence
          </span>
          <h1 className="mt-6 text-5xl md:text-7xl font-semibold tracking-tight leading-[1.05]">
            <span className="text-gradient">Move Smarter.</span>
            <br />
            <span className="text-foreground/95">Live Better.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base md:text-lg text-muted-foreground leading-relaxed">
            An AI-powered lifestyle planning platform for professionals relocating to new cities.
            Plan your finances, commute, routine and review intelligence — before you move.
          </p>

          <div className="mt-10 flex items-center justify-center gap-3 flex-wrap">
            <Link
              to="/plan"
              className="group inline-flex items-center gap-2 rounded-2xl bg-gradient-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-glow transition-transform hover:scale-[1.03]"
            >
              Start Planning <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              to="/results"
              className="inline-flex items-center gap-2 rounded-2xl glass px-6 py-3 text-sm font-medium hover:bg-white/5 transition-colors"
            >
              Explore Demo
            </Link>
          </div>
        </motion.div>

        {/* Hero preview card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="relative mt-20"
        >
          <div className="glass-strong rounded-3xl p-6 md:p-8">
            <div className="grid md:grid-cols-3 gap-5">
              <PreviewStat icon={LineChart} label="Sustainability score" value="86" tag="Kharadi · Pune" />
              <PreviewStat icon={Wallet} label="Predicted savings" value="₹23,000/mo" tag="After EMI & lifestyle" />
              <PreviewStat icon={Leaf} label="Stress index" value="Low · 28" tag="Commute 18 min" />
            </div>
            <div className="mt-6 grid grid-cols-7 gap-1.5">
              {Array.from({ length: 7 }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scaleY: 0.3, opacity: 0.5 }}
                  animate={{ scaleY: [0.3, 1, 0.6, 0.9, 0.5][i % 5], opacity: 1 }}
                  transition={{ duration: 2, delay: i * 0.08, repeat: Infinity, repeatType: "reverse" }}
                  className="h-16 origin-bottom rounded-md bg-gradient-primary/70"
                />
              ))}
            </div>
            <p className="mt-4 text-xs text-muted-foreground">Live preview · simulated daily energy curve</p>
          </div>
        </motion.div>
      </section>

      {/* FEATURE GRID */}
      <section className="mx-auto max-w-6xl px-6 pb-28">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">A lifestyle operating system</h2>
          <p className="mt-3 text-muted-foreground">
            Six intelligent modules working together — so the city you choose actually fits the life you want.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <GlassCard key={f.title} transition={{ delay: i * 0.06, duration: 0.6 }} className="group hover:bg-white/5 transition-colors">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-primary/15 ring-1 ring-primary/30">
                  <f.icon className="h-5 w-5 text-primary" />
                </span>
                <h3 className="font-semibold">{f.title}</h3>
              </div>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* CTA STRIP */}
      <section className="mx-auto max-w-5xl px-6 pb-32">
        <GlassCard strong className="text-center p-10 md:p-14">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
            <span className="text-gradient">Design your future lifestyle</span> — intelligently.
          </h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
            Six minutes. One intelligent plan. A clearer answer to the most expensive decision you'll make this year.
          </p>
          <div className="mt-8 flex justify-center gap-3 flex-wrap">
            <Link to="/plan" className="rounded-2xl bg-gradient-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-glow">
              Start your plan
            </Link>
            <Link to="/results" className="rounded-2xl glass px-6 py-3 text-sm font-medium">See a sample plan</Link>
          </div>
        </GlassCard>
      </section>
    </div>
  );
}

function PreviewStat({ icon: Icon, label, value, tag }: { icon: typeof LineChart; label: string; value: string; tag: string }) {
  return (
    <div className="rounded-2xl bg-white/[0.03] ring-1 ring-white/5 p-5">
      <div className="flex items-center gap-2 text-muted-foreground text-xs uppercase tracking-[0.18em]">
        <Icon className="h-3.5 w-3.5 text-primary" />
        {label}
      </div>
      <div className="mt-3 text-2xl font-semibold">{value}</div>
      <div className="mt-1 text-xs text-muted-foreground">{tag}</div>
    </div>
  );
}
