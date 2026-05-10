import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Check, Sparkles, ShieldCheck, ArrowRight, Loader2 } from "lucide-react";
import { GlassCard } from "@/components/site/GlassCard";
import { recommendedAreas } from "@/lib/data";

export const Route = createFileRoute("/booking")({
  head: () => ({
    meta: [
      { title: "Booking Assistant — Smart Living Ecosystem" },
      { name: "description", content: "An explainable, simulated booking workflow that validates affordability before you commit." },
      { property: "og:title", content: "Booking Assistant" },
      { property: "og:description", content: "Explainable, affordability-aware booking simulation." },
    ],
  }),
  component: BookingPage,
});

type Msg = { from: "agent" | "user"; text: string };

function BookingPage() {
  const top = recommendedAreas[0];
  const [areaId, setAreaId] = useState(top.id);
  const area = recommendedAreas.find((a) => a.id === areaId)!;
  const [stage, setStage] = useState<"chat" | "confirm" | "done">("chat");
  const [thinking, setThinking] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    { from: "agent", text: `Hey — I've reviewed your plan. Based on your salary, EMI and lifestyle, ${top.name} is the strongest fit.` },
    { from: "agent", text: "Want me to walk you through why, and prep a booking summary?" },
  ]);

  const send = (text: string) => {
    setMessages((m) => [...m, { from: "user", text }]);
    setThinking(true);
    setTimeout(() => {
      setMessages((m) => [
        ...m,
        {
          from: "agent",
          text:
            text.toLowerCase().includes("why")
              ? `${area.name} keeps your commute under ${area.commuteMinutes} min, leaves ₹${area.savingsRemaining.toLocaleString()} of monthly savings, and review sentiment is ${area.reviewSentiment.positive}% positive — strongest across your shortlist.`
              : `Affordability check: rent ₹${area.monthlyRent.toLocaleString()} fits inside 30% of your salary. Lifestyle match ${area.lifestyleMatch}%. Ready to generate a booking summary.`,
        },
      ]);
      setThinking(false);
    }, 900);
  };

  return (
    <div className="mx-auto max-w-6xl px-6 pb-24">
      <div className="text-center mb-10">
        <span className="inline-flex items-center gap-2 rounded-full glass px-3 py-1 text-xs text-muted-foreground">
          <Sparkles className="h-3 w-3 text-primary" /> Explainable booking workflow · simulated
        </span>
        <h1 className="mt-5 text-4xl md:text-5xl font-semibold tracking-tight">
          Your <span className="text-gradient">intelligent</span> booking assistant
        </h1>
        <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
          Not a listing site. An advisor that explains why, validates affordability, and only then prepares a summary.
        </p>
      </div>

      <div className="grid lg:grid-cols-5 gap-5">
        {/* Chat panel */}
        <GlassCard strong className="lg:col-span-3 flex flex-col min-h-[520px]">
          <div className="flex items-center gap-3 pb-4 border-b border-white/5">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-primary shadow-glow">
              <Bot className="h-4 w-4 text-primary-foreground" />
            </span>
            <div>
              <div className="font-semibold text-sm">Lifestyle Agent</div>
              <div className="text-xs text-muted-foreground">Reasoning over your plan in real time</div>
            </div>
          </div>

          <div className="flex-1 space-y-3 py-5 overflow-y-auto max-h-[420px]">
            <AnimatePresence initial={false}>
              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                      m.from === "user"
                        ? "bg-gradient-primary text-primary-foreground shadow-glow"
                        : "bg-white/[0.04] ring-1 ring-white/10"
                    }`}
                  >
                    {m.text}
                  </div>
                </motion.div>
              ))}
              {thinking && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                  <div className="rounded-2xl bg-white/[0.04] ring-1 ring-white/10 px-4 py-2.5 text-sm flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" /> reasoning…
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex flex-wrap gap-2 pt-3 border-t border-white/5">
            {["Why this area?", "Check affordability", "Prepare booking summary"].map((q) => (
              <button
                key={q}
                onClick={() => send(q)}
                className="rounded-xl glass px-3 py-1.5 text-xs hover:bg-white/5"
              >
                {q}
              </button>
            ))}
            <button
              onClick={() => setStage("confirm")}
              className="ml-auto inline-flex items-center gap-2 rounded-xl bg-gradient-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground shadow-glow"
            >
              Continue <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </GlassCard>

        {/* Side panel — area choice + summary */}
        <div className="lg:col-span-2 space-y-5">
          <GlassCard>
            <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Selected area</div>
            <div className="mt-3 space-y-2">
              {recommendedAreas.map((a) => (
                <button
                  key={a.id}
                  onClick={() => setAreaId(a.id)}
                  className={`w-full text-left rounded-xl p-3 transition-all ${
                    a.id === areaId ? "bg-gradient-primary/15 ring-1 ring-primary/40" : "bg-white/[0.03] ring-1 ring-white/5 hover:bg-white/[0.06]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="font-medium text-sm">{a.name}</div>
                    <div className="text-xs text-muted-foreground">{a.compatibility}%</div>
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">₹{a.monthlyRent.toLocaleString()}/mo · {a.commuteMinutes} min</div>
                </button>
              ))}
            </div>
          </GlassCard>

          <GlassCard strong>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-primary" />
              <div className="font-semibold text-sm">Booking summary</div>
            </div>
            <ul className="mt-4 space-y-2 text-sm">
              <SummaryRow label="Area" value={`${area.name}, ${area.city}`} />
              <SummaryRow label="Monthly rent" value={`₹${area.monthlyRent.toLocaleString()}`} />
              <SummaryRow label="Commute" value={`${area.commuteMinutes} min`} />
              <SummaryRow label="Savings remaining" value={`₹${area.savingsRemaining.toLocaleString()}/mo`} />
              <SummaryRow label="Lifestyle match" value={`${area.lifestyleMatch}%`} />
              <SummaryRow label="Sustainability" value={`${area.sustainability}/100`} />
            </ul>

            {stage !== "done" ? (
              <button
                onClick={() => setStage("done")}
                className="mt-6 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow"
              >
                Confirm simulated booking <Check className="h-4 w-4" />
              </button>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 rounded-xl bg-primary/10 ring-1 ring-primary/30 p-4 text-sm"
              >
                <div className="flex items-center gap-2 font-medium">
                  <Check className="h-4 w-4 text-primary" /> Plan locked in
                </div>
                <p className="text-muted-foreground mt-1 text-xs">
                  This is a simulated booking — no payment was processed. Your plan summary has been prepared for handoff.
                </p>
                <Link to="/" className="mt-3 inline-flex items-center gap-1 text-xs text-primary hover:underline">
                  Back to overview <ArrowRight className="h-3 w-3" />
                </Link>
              </motion.div>
            )}
          </GlassCard>
        </div>
      </div>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <li className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </li>
  );
}
