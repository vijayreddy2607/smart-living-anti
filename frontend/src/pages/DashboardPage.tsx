import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  MapPin, Sparkles, TrendingUp, Clock, Target,
  Building2, ChevronRight, BarChart3, RefreshCw,
  IndianRupee, Star, LogOut, Zap, Home, Dumbbell,
  Utensils, Trash2, PiggyBank, Wallet, ArrowRight,
  Shield, Plus, CheckCircle2, Briefcase, Bus, ShoppingCart,
  Lightbulb, MoreHorizontal, X, ChevronDown, ChevronUp,
  Coffee, Camera, Mountain, Music, Bike, Sunset, Trees, Waves
} from "lucide-react";
import { useBookings, type BookedItem, type BookingType } from "../context/BookingsContext";
import { DiscoveryModal } from "../components/DiscoveryModal";

interface HistoryEntry {
  timestamp: string;
  job_location: string;
  monthly_salary: number;
  emi_commitments: number;
  goal_description: string;
  goal_timeframe_months: number;
  estimated_goal_cost: number;
  computed_savings_goal: number;
  sustainability: string;
  average_score: number;
  top_area: string;
  top_area_score: number;
  all_top_areas: string[];
}

interface DashboardData {
  user_name: string;
  total_runs: number;
  history: HistoryEntry[];
}

interface CityStats {
  areas_covered: number;
  avg_rent_range: string;
  top_it_hub: string;
  top_lifestyle: string;
  top_budget_area: string;
  avg_commute_mins: number;
  city: string;
}

const fmt = (n: number) => `₹${n.toLocaleString("en-IN")}`;

/* ── Weekend tip data per city ──────────────────────────────────── */
const WEEKEND_TIPS: Record<string, { emoji: string; title: string; desc: string; cost: string; icon: React.ReactNode }[]> = {
  Pune: [
    { emoji: "⛰️", title: "Trek to Sinhagad Fort", desc: "Early morning 2-hour trek with stunning valley views. Carry your own snacks.", cost: "Free", icon: <Mountain size={16} /> },
    { emoji: "🌿", title: "Osho Meditation Garden", desc: "Serene evening walk in lush greenery near Koregaon Park. Great for unwinding.", cost: "₹200 entry", icon: <Trees size={16} /> },
    { emoji: "☕", title: "Café Hopping in FC Road", desc: "Explore indie cafés along Fergusson College Road — breakfast for under ₹150.", cost: "₹100–200", icon: <Coffee size={16} /> },
    { emoji: "🎶", title: "Pune Music Festival", desc: "Check local event listings — weekend concerts & open mics are free or cheap.", cost: "₹0–300", icon: <Music size={16} /> },
  ],
  Bengaluru: [
    { emoji: "🚴", title: "Nandi Hills Bike Ride", desc: "70 km from the city — sunrise ride at 1478 m altitude. Start at 4 AM.", cost: "₹50 entry", icon: <Bike size={16} /> },
    { emoji: "🌳", title: "Morning in Cubbon Park", desc: "Walk, jog or read under century-old trees in the heart of the city.", cost: "Free", icon: <Trees size={16} /> },
    { emoji: "📸", title: "Heritage Walk — Pete Area", desc: "Old Bengaluru's colourful markets, temples & architecture guided walk.", cost: "₹0–300", icon: <Camera size={16} /> },
    { emoji: "🌅", title: "Lalbagh Glass House", desc: "Beautiful botanical garden & glass house — ideal for a quiet evening.", cost: "₹25 entry", icon: <Sunset size={16} /> },
  ],
  Hyderabad: [
    { emoji: "🚣", title: "Hussain Sagar Boat Ride", desc: "Boat ride to the Buddha statue island on the lake. Magical at dusk.", cost: "₹60–100", icon: <Waves size={16} /> },
    { emoji: "🍖", title: "Old City Food Walk", desc: "Haleem, Irani chai & Osmania biscuits trail through Laad Bazaar.", cost: "₹200–400", icon: <Utensils size={16} /> },
    { emoji: "⛰️", title: "Mrugavani National Park", desc: "Trekking & wildlife on the outskirts — perfect for a nature day off.", cost: "₹30 entry", icon: <Mountain size={16} /> },
    { emoji: "🌅", title: "Golconda Fort Sunset", desc: "Explore the fort and stay for the Sound & Light show in the evenings.", cost: "₹30–130", icon: <Sunset size={16} /> },
  ],
  Chennai: [
    { emoji: "🌅", title: "Marina Beach Sunrise Run", desc: "World's second-longest beach — a peaceful 5 AM run before the crowds arrive.", cost: "Free", icon: <Waves size={16} /> },
    { emoji: "🛺", title: "Mylapore Temple Trail", desc: "Visit Kapaleeshwarar Temple, eat street dosai, explore old-town streets.", cost: "₹50–150", icon: <Camera size={16} /> },
    { emoji: "🚗", title: "ECR Road Trip", desc: "Drive down East Coast Road to Mahabalipuram — beaches, temples, seafood.", cost: "₹300–500", icon: <Mountain size={16} /> },
    { emoji: "☕", title: "Filter Coffee Tour", desc: "Hop between Murugan Idli Shop, Saravana Bhavan and Ratna Café on a lazy Sunday.", cost: "₹100–200", icon: <Coffee size={16} /> },
  ],
  Mumbai: [
    { emoji: "🥾", title: "Sanjay Gandhi NP Trek", desc: "Kanheri Caves hike inside the city limits — cool and shaded forest walk.", cost: "₹50 entry", icon: <Mountain size={16} /> },
    { emoji: "🌊", title: "Elephanta Caves Ferry", desc: "1-hour ferry from Gateway of India to rock-cut caves — UNESCO World Heritage Site.", cost: "₹200 round trip", icon: <Waves size={16} /> },
    { emoji: "📸", title: "Bandra Bandstand Walk", desc: "Sea-facing promenade, street art & sea forts. Best at sunset with vada pav.", cost: "Free", icon: <Sunset size={16} /> },
    { emoji: "🎨", title: "Dharavi Art Room", desc: "Free community art spaces and craft workshops every weekend morning.", cost: "Free", icon: <Camera size={16} /> },
  ],
};

const DEFAULT_TIPS = [
  { emoji: "🌿", title: "Explore Local Parks", desc: "Most Indian cities have beautiful green spaces that are free or nearly free.", cost: "Free", icon: <Trees size={16} /> },
  { emoji: "☕", title: "Try a Local Café", desc: "Find a neighbourhood café and spend a slow morning reading or catching up.", cost: "₹100–200", icon: <Coffee size={16} /> },
  { emoji: "📸", title: "Heritage Walk", desc: "Every city has a heritage area worth exploring — discover your new neighbourhood.", cost: "Free–₹200", icon: <Camera size={16} /> },
];

/* ─── Manual Expense Form ────────────────────────────────────────── */
const MANUAL_CATEGORIES: { type: BookingType; label: string; icon: React.ReactNode; color: string; placeholder: string }[] = [
  { type: "travel",    label: "Travel / Commute",  icon: <Bus size={15} />,          color: "var(--accent-sky)",     placeholder: "e.g. Metro pass, Ola/Uber, Petrol" },
  { type: "grocery",  label: "Groceries",          icon: <ShoppingCart size={15} />, color: "var(--accent-amber)",   placeholder: "e.g. Big Bazaar, D-Mart weekly shop" },
  { type: "utilities",label: "Utilities & Bills",  icon: <Lightbulb size={15} />,    color: "var(--accent-orange)",  placeholder: "e.g. Electricity, WiFi, Mobile recharge" },
  { type: "misc",     label: "Other / Misc",       icon: <MoreHorizontal size={15} />, color: "var(--text-secondary)", placeholder: "e.g. Subscriptions, Personal care, etc." },
];

function AddExpenseInline({ onAdd, city, area }: { onAdd: (item: Omit<BookedItem, "id" | "bookedAt">) => void; city: string; area: string }) {
  const [open, setOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<BookingType>("travel");
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");

  const cat = MANUAL_CATEGORIES.find(c => c.type === selectedType)!;

  const handleAdd = () => {
    if (!name.trim()) { setError("Please enter a name."); return; }
    const val = Number(amount);
    if (!val || val <= 0) { setError("Please enter a valid monthly amount."); return; }
    onAdd({ type: selectedType, name: name.trim(), area: area || "—", city: city || "—", monthlyCost: val, details: cat.label });
    setName(""); setAmount(""); setError(""); setOpen(false);
  };

  return (
    <div className="mt-5">
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="w-full py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all"
          style={{ background: "rgba(99,102,241,0.07)", border: "1.5px dashed rgba(99,102,241,0.3)", color: "var(--accent-indigo)" }}
        >
          <Plus size={16} /> Add Expense (travel, grocery, bills, misc…)
        </button>
      ) : (
        <div className="p-5 rounded-2xl" style={{ background: "var(--bg-input)", border: "1px solid rgba(99,102,241,0.2)" }}>
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>Add Monthly Expense</span>
            <button onClick={() => { setOpen(false); setError(""); }} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}>
              <X size={16} />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 mb-4">
            {MANUAL_CATEGORIES.map(c => (
              <button key={c.type} onClick={() => setSelectedType(c.type)}
                className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all text-left"
                style={{
                  background: selectedType === c.type ? `${c.color}18` : "var(--bg-elevated)",
                  border: `1.5px solid ${selectedType === c.type ? c.color : "var(--border-default)"}`,
                  color: selectedType === c.type ? c.color : "var(--text-muted)",
                }}>
                <span style={{ color: c.color }}>{c.icon}</span> {c.label}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium mb-1.5 block" style={{ color: "var(--text-muted)" }}>Expense name</label>
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder={cat.placeholder}
                className="w-full px-3 py-2.5 rounded-xl text-sm"
                style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-default)", color: "var(--text-primary)", outline: "none" }}
                onKeyDown={e => e.key === "Enter" && handleAdd()}
              />
            </div>
            <div>
              <label className="text-xs font-medium mb-1.5 block" style={{ color: "var(--text-muted)" }}>Monthly amount (₹)</label>
              <input
                type="number"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                placeholder="e.g. 2500"
                min={1}
                className="w-full px-3 py-2.5 rounded-xl text-sm"
                style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-default)", color: "var(--text-primary)", outline: "none" }}
                onKeyDown={e => e.key === "Enter" && handleAdd()}
              />
            </div>
          </div>

          {error && <p className="text-xs mt-2" style={{ color: "var(--accent-rose)" }}>{error}</p>}

          <div className="flex gap-2 mt-4">
            <button onClick={handleAdd} className="btn-primary flex-1 justify-center" style={{ padding: "10px" }}>
              <Plus size={14} /> Add to Tracker
            </button>
            <button onClick={() => { setOpen(false); setError(""); }}
              className="px-4 py-2.5 rounded-xl text-sm font-medium"
              style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-default)", color: "var(--text-muted)", cursor: "pointer" }}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Weekend Tips Panel ─────────────────────────────────────────── */
function WeekendTipsPanel({ city }: { city: string }) {
  const tips = WEEKEND_TIPS[city] || DEFAULT_TIPS;
  return (
    <div className="fade-in-up glass-card overflow-hidden" style={{ borderColor: "rgba(251,191,36,0.2)" }}>
      <div className="p-5 pb-4" style={{ borderBottom: "1px solid var(--border-default)" }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, rgba(251,191,36,0.2), rgba(251,146,60,0.15))", border: "1px solid rgba(251,191,36,0.25)" }}>
            <Sunset size={18} style={{ color: "var(--accent-amber)" }} />
          </div>
          <div>
            <h3 className="text-base font-bold" style={{ color: "var(--text-primary)" }}>
              Weekend Picks 🎉
            </h3>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              {city ? `Budget-friendly things to do in ${city} this weekend` : "Fun things to do near you"}
            </p>
          </div>
        </div>
      </div>

      <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-3">
        {tips.map((tip, i) => (
          <div key={i} className="p-4 rounded-2xl flex items-start gap-3 group transition-all"
            style={{ background: "var(--bg-input)", border: "1px solid var(--border-default)" }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(251,191,36,0.3)")}
            onMouseLeave={e => (e.currentTarget.style.borderColor = "var(--border-default)")}
          >
            <div className="text-2xl mt-0.5 flex-shrink-0">{tip.emoji}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-1">
                <h4 className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>{tip.title}</h4>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full flex-shrink-0"
                  style={{ background: "rgba(52,211,153,0.12)", color: "var(--accent-emerald)" }}>
                  {tip.cost}
                </span>
              </div>
              <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>{tip.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="px-5 pb-5">
        <div className="p-3 rounded-xl flex items-center gap-3"
          style={{ background: "rgba(251,191,36,0.05)", border: "1px solid rgba(251,191,36,0.12)" }}>
          <PiggyBank size={15} style={{ color: "var(--accent-amber)", flexShrink: 0 }} />
          <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
            <strong style={{ color: "var(--accent-amber)" }}>Weekend budget tip:</strong> Cap weekend spending at{" "}
            <strong>₹500–1,000</strong> — that's just ₹2,000–4,000/month and leaves your savings intact.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ─── Smart Money Tips Panel ─────────────────────────────────────── */
function MoneyTipsPanel({ salary, emi = 0, spend, bookings }: {
  salary: number;
  emi?: number;
  spend: number;
  bookings: BookedItem[];
}) {
  const [expanded, setExpanded] = useState(false);
  const savingsRate = salary > 0 ? Math.round(((salary - emi - spend) / salary) * 100) : 0;

  const foodSpend    = bookings.filter(b => b.type === "food").reduce((s, b) => s + b.monthlyCost, 0);
  const gymSpend     = bookings.filter(b => b.type === "gym").reduce((s, b) => s + b.monthlyCost, 0);
  const travelSpend  = bookings.filter(b => b.type === "travel").reduce((s, b) => s + b.monthlyCost, 0);
  const rentSpend    = bookings.filter(b => b.type === "accommodation").reduce((s, b) => s + b.monthlyCost, 0);

  const tips: { icon: React.ReactNode; color: string; tip: string; saving: string }[] = [];

  if (emi > 0 && salary > 0 && (emi / salary) > 0.35) {
    tips.push({
      icon: <IndianRupee size={15} />, color: "var(--accent-rose)",
      tip: `Your EMI (${fmt(emi)}/mo) is ${Math.round((emi / salary) * 100)}% of your salary — above the safe 30% limit. Consider a prepayment strategy or refinancing to reduce this burden.`,
      saving: "Reduce debt pressure",
    });
  }

  if (savingsRate < 20 && salary > 0) {
    const needed = Math.round(salary * 0.2 - (salary - emi - spend));
    tips.push({
      icon: <Target size={15} />, color: "var(--accent-indigo)",
      tip: `You're saving ${savingsRate}% of income. The 20% rule means saving ${fmt(Math.round(salary * 0.2))}/month. You need to free up ${fmt(needed > 0 ? needed : 0)} more.`,
      saving: `Need ${fmt(needed > 0 ? needed : 0)} more/mo`,
    });
  }

  if (foodSpend > salary * 0.15) {
    tips.push({
      icon: <Utensils size={15} />, color: "var(--accent-rose)",
      tip: `Your food spending (${fmt(foodSpend)}/mo) is above 15% of salary. Cooking at home 3 days a week can cut this by ₹1,500–3,000 a month.`,
      saving: "Save ₹1,500–3,000/mo",
    });
  }

  if (gymSpend > 2500) {
    tips.push({
      icon: <Dumbbell size={15} />, color: "var(--accent-emerald)",
      tip: `Your gym costs ${fmt(gymSpend)}/mo. Look for flat-level gyms or society gyms (₹500–800/mo) — or try free parks & YouTube workouts.`,
      saving: `Save up to ${fmt(gymSpend - 700)}/mo`,
    });
  }

  if (travelSpend > salary * 0.12) {
    tips.push({
      icon: <Bus size={15} />, color: "var(--accent-sky)",
      tip: `Travel costs ${fmt(travelSpend)}/mo. Consider a monthly metro/bus pass, or carpooling with colleagues — can cut costs by 30–50%.`,
      saving: "Save 30–50% on commute",
    });
  }

  if (rentSpend > salary * 0.35) {
    tips.push({
      icon: <Home size={15} />, color: "var(--accent-violet)",
      tip: `Your rent (${fmt(rentSpend)}/mo) is above 35% of income. Sharing a flat with one roommate could halve this cost and free up significant savings.`,
      saving: `Save ${fmt(Math.round(rentSpend * 0.35))}/mo`,
    });
  }

  if (tips.length === 0) {
    tips.push(
      {
        icon: <CheckCircle2 size={15} />, color: "var(--accent-emerald)",
        tip: "Great job! Your spending looks well-balanced. Keep stacking savings and consider putting the surplus into a recurring deposit or mutual fund SIP.",
        saving: "On track 🎯",
      },
      {
        icon: <PiggyBank size={15} />, color: "var(--accent-amber)",
        tip: "Emergency fund tip: Aim to save 3–6 months of expenses as a liquid safety net before committing to long-term investments.",
        saving: "Financial security",
      }
    );
  }

  const visibleTips = expanded ? tips : tips.slice(0, 3);

  return (
    <div className="fade-in-up glass-card overflow-hidden" style={{ borderColor: "rgba(99,102,241,0.2)" }}>
      <div className="p-5 pb-4" style={{ borderBottom: "1px solid var(--border-default)" }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.15), rgba(167,139,250,0.1))", border: "1px solid rgba(99,102,241,0.2)" }}>
            <Sparkles size={18} style={{ color: "var(--accent-violet)" }} />
          </div>
          <div>
            <h3 className="text-base font-bold" style={{ color: "var(--text-primary)" }}>
              Smart Money Tips 💡
            </h3>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              Personalised advice based on your current spending breakdown
            </p>
          </div>
        </div>
      </div>

      <div className="p-5 space-y-3">
        {visibleTips.map((t, i) => (
          <div key={i} className="p-4 rounded-2xl flex items-start gap-3"
            style={{ background: "var(--bg-input)", border: "1px solid var(--border-default)" }}>
            <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: `${t.color}15`, border: `1px solid ${t.color}25` }}>
              <span style={{ color: t.color }}>{t.icon}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>{t.tip}</p>
              <span className="inline-flex mt-2 text-[11px] font-bold px-2 py-0.5 rounded-full"
                style={{ background: `${t.color}12`, color: t.color }}>
                {t.saving}
              </span>
            </div>
          </div>
        ))}

        {tips.length > 3 && (
          <button
            onClick={() => setExpanded(v => !v)}
            className="w-full py-2 text-xs font-medium rounded-xl flex items-center justify-center gap-1 transition-all"
            style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-default)", color: "var(--text-muted)", cursor: "pointer" }}>
            {expanded ? <><ChevronUp size={13} /> Show less</> : <><ChevronDown size={13} /> Show {tips.length - 3} more tips</>}
          </button>
        )}
      </div>
    </div>
  );
}

/* ─── Spending Breakdown Bar ─────────────────────────────────────── */
const TYPE_CONFIG: Record<string, { icon: React.ReactNode; color: string; label: string; emoji: string }> = {
  accommodation: { icon: <Home size={14} />,          color: "var(--accent-indigo)",  label: "Accommodation", emoji: "🏠" },
  food:          { icon: <Utensils size={14} />,      color: "var(--accent-rose)",    label: "Dining Out",    emoji: "🍽️" },
  gym:           { icon: <Dumbbell size={14} />,      color: "var(--accent-emerald)", label: "Gym",           emoji: "🏋️" },
  travel:        { icon: <Bus size={14} />,           color: "var(--accent-sky)",     label: "Travel",        emoji: "🚌" },
  grocery:       { icon: <ShoppingCart size={14} />,  color: "var(--accent-amber)",   label: "Groceries",     emoji: "🛒" },
  utilities:     { icon: <Lightbulb size={14} />,     color: "var(--accent-orange)",  label: "Utilities",     emoji: "💡" },
  misc:          { icon: <MoreHorizontal size={14} />, color: "var(--text-secondary)", label: "Misc",         emoji: "✨" },
};

/* ─── Other small helpers ─────────────────────────────────────────── */
function SustainBadge({ s }: { s: string }) {
  const map: Record<string, { color: string; label: string; icon: string }> = {
    HIGHLY_SUSTAINABLE: { color: "var(--accent-emerald)", label: "Highly Sustainable", icon: "🟢" },
    MARGINAL:           { color: "var(--accent-amber)",   label: "Marginal", icon: "🟡" },
    UNSUSTAINABLE:      { color: "var(--accent-rose)",    label: "Unsustainable", icon: "🔴" },
  };
  const v = map[s] ?? { color: "var(--text-muted)", label: s, icon: "⚪" };
  return (
    <span className="badge text-xs" style={{ background: `${v.color}20`, color: v.color, border: `1px solid ${v.color}30` }}>
      {v.icon} {v.label}
    </span>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) {
  return (
    <div className="glass-card p-4 flex items-center gap-3">
      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: "rgba(129,140,248,0.1)", border: "1px solid rgba(129,140,248,0.2)" }}>
        {icon}
      </div>
      <div>
        <p className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>{label}</p>
        <p className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>{value}</p>
      </div>
    </div>
  );
}

/* ─── Main Page ──────────────────────────────────────────────────── */
export function DashboardPage() {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();

  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [stats, setStats] = useState<CityStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDiscovery, setShowDiscovery] = useState(false);

  useEffect(() => {
    if (!loading && dashboard && dashboard.total_runs > 0) {
      const dismissed = sessionStorage.getItem("sl_discovery_dismissed");
      if (!dismissed) {
        const timer = setTimeout(() => setShowDiscovery(true), 1500);
        return () => clearTimeout(timer);
      }
    }
  }, [loading, dashboard]);

  useEffect(() => {
    const load = async () => {
      try {
        const [histRes, statsRes] = await Promise.all([
          fetch("/api/dashboard/history", { headers: { Authorization: `Bearer ${token}` } }),
          fetch("/api/dashboard/stats"),
        ]);
        if (histRes.ok) setDashboard(await histRes.json());
        if (statsRes.ok) setStats(await statsRes.json());
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [token]);

  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleDateString("en-IN", {
        day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
      });
    } catch { return iso; }
  };

  const latestSalary = dashboard?.history?.[0]?.monthly_salary;
  const latestEmi    = dashboard?.history?.[0]?.emi_commitments ?? 0;
  const latestCity   = dashboard?.history?.[0]?.job_location?.split(",").pop()?.trim() || "";
  const latestArea   = dashboard?.history?.[0]?.top_area || "";
  const isNewUser    = !loading && (!dashboard || dashboard.total_runs === 0);

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-primary)" }}>
      {/* ── Navbar ── */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 50, padding: "14px 24px",
        background: "rgba(10,10,15,0.9)", backdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)"
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "var(--gradient-primary)" }}>
              <MapPin size={18} color="white" />
            </div>
            <div>
              <h1 className="text-base font-bold gradient-text leading-tight">SmartLiving</h1>
              <p className="text-[10px] font-medium tracking-wider uppercase" style={{ color: "var(--text-muted)" }}>Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/plan")} className="btn-primary" style={{ padding: "8px 18px", fontSize: "0.82rem" }}>
              <Zap size={14} /> New Plan
            </button>
            <span className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
              {user?.name?.split(" ")[0]} 👋
            </span>
            <button onClick={logout} title="Logout"
              style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}>
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </nav>

      <main style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px" }} className="space-y-7">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="w-12 h-12 rounded-full animate-spin-slow"
              style={{ border: "3px solid var(--border-default)", borderTopColor: "var(--accent-indigo)" }} />
            <p className="mt-4 text-sm" style={{ color: "var(--text-muted)" }}>Loading your dashboard…</p>
          </div>
        ) : (
          <>
            {/* ── Welcome Hero ── */}
            <div className="fade-in-up glass-card p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.08), rgba(167,139,250,0.06))", borderColor: "rgba(99,102,241,0.2)" }}>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles size={18} style={{ color: "var(--accent-violet)" }} />
                  <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--accent-violet)" }}>
                    Your Dashboard
                  </span>
                </div>
                <h2 className="text-2xl md:text-3xl font-extrabold" style={{ color: "var(--text-primary)" }}>
                  Welcome{isNewUser ? "" : " back"},{" "}
                  <span className="gradient-text">{user?.name?.split(" ")[0]}</span> 👋
                </h2>
                <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
                  {isNewUser
                    ? "You're all set! Start your first relocation plan to discover the best neighborhood for your lifestyle and budget."
                    : `You've run ${dashboard?.total_runs} recommendation${dashboard!.total_runs > 1 ? "s" : ""}. Track all your monthly expenses below and keep more of your money.`}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
                <button onClick={() => navigate("/plan")} className="btn-primary">
                  <Zap size={16} /> {isNewUser ? "Start Planning" : "New Recommendation"}
                </button>
              </div>
            </div>

            {/* ── How It Works (new users only) ── */}
            {isNewUser && (
              <div className="fade-in-up fade-in-up-1">
                <h3 className="text-sm font-semibold mb-4 flex items-center gap-2" style={{ color: "var(--text-secondary)" }}>
                  <Sparkles size={15} style={{ color: "var(--accent-violet)" }} />
                  HOW IT WORKS
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {[
                    { step: "1", icon: <Briefcase size={22} />, title: "Enter Work & City", desc: "Tell us your office location and target city", color: "var(--accent-indigo)" },
                    { step: "2", icon: <IndianRupee size={22} />, title: "Set Your Budget", desc: "Salary, EMI, and savings goal — we calculate the rest", color: "var(--accent-emerald)" },
                    { step: "3", icon: <Sparkles size={22} />, title: "AI Finds Your Areas", desc: "Ranked neighborhoods matched to your lifestyle", color: "var(--accent-violet)" },
                    { step: "4", icon: <Wallet size={22} />, title: "Track Everything", desc: "Food, gym, travel, rent — all tracked here", color: "var(--accent-amber)" },
                  ].map((item) => (
                    <div key={item.step} className="glass-card p-5 text-center relative overflow-hidden">
                      <div className="absolute top-3 right-3 text-xs font-black opacity-20 text-5xl"
                        style={{ color: item.color, lineHeight: 1 }}>
                        {item.step}
                      </div>
                      <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3 mx-auto"
                        style={{ background: `${item.color}18`, border: `1px solid ${item.color}30` }}>
                        <span style={{ color: item.color }}>{item.icon}</span>
                      </div>
                      <h4 className="text-sm font-bold mb-1" style={{ color: "var(--text-primary)" }}>{item.title}</h4>
                      <p className="text-xs" style={{ color: "var(--text-muted)" }}>{item.desc}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-5 text-center">
                  <button onClick={() => navigate("/plan")} className="btn-primary">
                    <ArrowRight size={16} /> Start My First Plan
                  </button>
                </div>
              </div>
            )}

            {/* ── Spending Tracker ── */}
            <SpendingTrackerPanel
              salary={latestSalary}
              emi={latestEmi}
              city={latestCity}
              area={latestArea}
              onStartPlanning={() => navigate("/plan")}
            />

            {/* ── Weekend Tips ── */}
            <WeekendTipsPanel city={latestCity || "Bengaluru"} />

            {/* ── Money Tips (reads live bookings + EMI from context) ── */}
            <_MoneyTipsBridge salary={latestSalary || 0} emi={latestEmi} />

            {/* ── City Stats ── */}
            {stats && (
              <div className="fade-in-up fade-in-up-2">
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: "var(--text-secondary)" }}>
                  <BarChart3 size={15} style={{ color: "var(--accent-indigo)" }} />
                  PLATFORM OVERVIEW
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <StatCard icon={<Building2 size={16} style={{ color: "var(--accent-indigo)" }} />}   label="Areas Covered"     value={`${stats.areas_covered} Neighborhoods`} />
                  <StatCard icon={<IndianRupee size={16} style={{ color: "var(--accent-emerald)" }} />} label="Avg Rent Range"     value={stats.avg_rent_range} />
                  <StatCard icon={<Clock size={16} style={{ color: "var(--accent-amber)" }} />}        label="Avg Commute"       value={`${stats.avg_commute_mins} minutes`} />
                  <StatCard icon={<Zap size={16} style={{ color: "var(--accent-violet)" }} />}         label="Top IT Hub"        value={stats.top_it_hub} />
                  <StatCard icon={<Star size={16} style={{ color: "var(--accent-sky)" }} />}           label="Top Lifestyle Area" value={stats.top_lifestyle} />
                  <StatCard icon={<TrendingUp size={16} style={{ color: "var(--accent-orange)" }} />}  label="Best Budget Area"  value={stats.top_budget_area} />
                </div>
              </div>
            )}

            {/* ── History ── */}
            {!isNewUser && (
              <div className="fade-in-up fade-in-up-3">
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: "var(--text-secondary)" }}>
                  <Clock size={15} style={{ color: "var(--accent-indigo)" }} />
                  YOUR RECOMMENDATION HISTORY
                </h3>
                <div className="space-y-3">
                  {dashboard!.history.map((entry, i) => (
                    <div key={i} className="glass-card p-5 hover:cursor-pointer"
                      style={{ transition: "all 0.2s ease" }}
                      onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(129,140,248,0.3)")}
                      onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)")}
                      onClick={() => navigate("/plan")}>
                      <div className="flex flex-col md:flex-row md:items-center gap-4">
                        <div className="flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center"
                          style={{ background: "var(--gradient-primary)" }}>
                          <span className="text-white font-black text-sm">#{i + 1}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <span className="font-bold text-sm" style={{ color: "var(--text-primary)" }}>
                              {entry.goal_description}
                            </span>
                            <SustainBadge s={entry.sustainability} />
                          </div>
                          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs" style={{ color: "var(--text-muted)" }}>
                            <span className="flex items-center gap-1"><MapPin size={11} /> {entry.job_location}</span>
                            <span className="flex items-center gap-1"><IndianRupee size={11} /> {fmt(entry.monthly_salary)}/mo</span>
                            <span className="flex items-center gap-1"><Target size={11} /> {entry.goal_timeframe_months} months</span>
                            <span className="flex items-center gap-1"><Clock size={11} /> {formatDate(entry.timestamp)}</span>
                          </div>
                        </div>
                        <div className="flex-shrink-0 text-right">
                          <div className="text-base font-bold" style={{ color: "var(--accent-emerald)" }}>
                            {entry.top_area}
                          </div>
                          <div className="text-xs" style={{ color: "var(--text-muted)" }}>Score: {entry.top_area_score}/100</div>
                          <div className="flex gap-1 mt-1 justify-end">
                            {entry.all_top_areas.map((a, j) => (
                              <span key={j} className="text-[10px] px-1.5 py-0.5 rounded-md font-medium"
                                style={{ background: "rgba(129,140,248,0.12)", color: "var(--accent-indigo)" }}>
                                {a}
                              </span>
                            ))}
                          </div>
                        </div>
                        <ChevronRight size={18} style={{ color: "var(--text-muted)" }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── Run New Analysis CTA ── */}
            {!isNewUser && (
              <div className="fade-in-up glass-card p-6 flex flex-col md:flex-row items-center justify-between gap-4"
                style={{ background: "linear-gradient(135deg, rgba(52,211,153,0.05), rgba(99,102,241,0.05))", borderColor: "rgba(52,211,153,0.15)" }}>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: "rgba(52,211,153,0.12)", border: "1px solid rgba(52,211,153,0.2)" }}>
                    <RefreshCw size={18} style={{ color: "var(--accent-emerald)" }} />
                  </div>
                  <div>
                    <h4 className="font-bold" style={{ color: "var(--text-primary)" }}>Run a fresh analysis</h4>
                    <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                      Salaries change, goals evolve. Get updated recommendations anytime.
                    </p>
                  </div>
                </div>
                <button onClick={() => navigate("/plan")} className="btn-primary flex-shrink-0">
                  <Zap size={15} /> Start New Plan
                </button>
              </div>
            )}
          </>
        )}
      </main>

      <DiscoveryModal
        show={showDiscovery}
        onClose={() => {
          setShowDiscovery(false);
          sessionStorage.setItem("sl_discovery_dismissed", "true");
        }}
        city={dashboard?.history?.[0]?.job_location?.split(",")[1]?.trim() || "Bengaluru"}
        area={dashboard?.history?.[0]?.top_area || dashboard?.history?.[0]?.job_location}
      />
    </div>
  );
}

/* ─── Spending Tracker Panel ────────────────────────────────────── */
function SpendingTrackerPanel({
  salary,
  emi = 0,
  city,
  area,
  onStartPlanning,
}: {
  salary?: number;
  emi?: number;
  city: string;
  area: string;
  onStartPlanning: () => void;
}) {
  const { bookings, addBooking, removeBooking, totalMonthlySpend, getSavings, clearBookings } = useBookings();
  const [showAll, setShowAll] = useState(false);

  const monthlyIncome   = salary || 0;
  const monthlySavings  = getSavings(monthlyIncome, emi);   // salary - emi - expenses
  const savingsPercent  = monthlyIncome > 0 ? Math.round((monthlySavings / monthlyIncome) * 100) : 0;

  const grouped = bookings.reduce<Record<string, BookedItem[]>>((acc, b) => {
    (acc[b.type] = acc[b.type] || []).push(b);
    return acc;
  }, {});

  return (
    <div className="fade-in-up fade-in-up-1 glass-card overflow-hidden" style={{ borderColor: "rgba(129,140,248,0.2)" }}>

      {/* Header */}
      <div className="p-6 pb-5" style={{ borderBottom: "1px solid var(--border-default)" }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, var(--accent-indigo), var(--accent-violet))" }}>
              <Wallet size={18} color="white" />
            </div>
            <div>
              <h3 className="text-base font-bold" style={{ color: "var(--text-primary)" }}>
                My Monthly Expense Tracker
              </h3>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                {bookings.length === 0
                  ? "Track rent, food, gym, travel, groceries & more"
                  : `${bookings.length} expense${bookings.length > 1 ? "s" : ""} tracked · ${Object.keys(grouped).length} categories`}
              </p>
            </div>
          </div>
          {bookings.length > 0 && (
            <button onClick={clearBookings}
              className="text-xs font-medium px-3 py-1.5 rounded-lg transition-all"
              style={{ background: "rgba(251,113,133,0.1)", color: "var(--accent-rose)", border: "1px solid rgba(251,113,133,0.2)", cursor: "pointer" }}>
              Clear All
            </button>
          )}
        </div>
      </div>

      {bookings.length === 0 ? (
        /* ── Empty State ── */
        <div className="p-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-4"
              style={{ background: "rgba(129,140,248,0.08)", border: "1px solid rgba(129,140,248,0.15)" }}>
              <PiggyBank size={28} style={{ color: "var(--accent-indigo)" }} />
            </div>
            <h4 className="font-bold mb-2" style={{ color: "var(--text-primary)" }}>Start tracking your monthly budget</h4>
            <p className="text-sm mb-4" style={{ color: "var(--text-muted)", maxWidth: 400, margin: "0 auto 16px" }}>
              Book accommodations, restaurants & gyms from your plan — or manually add travel, grocery, and utility expenses below.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2 mb-6 text-xs" style={{ color: "var(--text-muted)" }}>
              {["🏠 Rent / PG", "🍽️ Dining out", "🏋️ Gym membership", "🚌 Daily commute", "🛒 Groceries", "💡 Bills"].map((s) => (
                <span key={s} className="px-3 py-1.5 rounded-full"
                  style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-default)" }}>
                  {s}
                </span>
              ))}
            </div>
            <button onClick={onStartPlanning} className="btn-primary">
              <Plus size={16} /> Start Planning to Add Expenses
            </button>
          </div>
          <AddExpenseInline onAdd={addBooking} city={city} area={area} />
        </div>
      ) : (
        <div className="p-6">
          {/* ── Salary Flow Breakdown (only when salary known) ── */}
          {monthlyIncome > 0 && (
            <div className="mb-6 p-4 rounded-2xl" style={{ background: "var(--bg-input)", border: "1px solid var(--border-default)" }}>
              <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: "var(--text-muted)" }}>
                Monthly Money Flow
              </p>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-1">
                {/* Salary */}
                <div className="flex-1 p-3 rounded-xl text-center"
                  style={{ background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)" }}>
                  <p className="text-[10px] font-medium mb-0.5" style={{ color: "var(--accent-indigo)" }}>Salary</p>
                  <p className="text-base font-extrabold" style={{ color: "var(--accent-indigo)" }}>{fmt(monthlyIncome)}</p>
                </div>
                {/* Arrow */}
                <div className="text-center px-1 self-center text-xs font-bold" style={{ color: "var(--text-muted)" }}>−</div>
                {/* EMI */}
                <div className="flex-1 p-3 rounded-xl text-center"
                  style={{ background: emi > 0 ? "rgba(251,113,133,0.08)" : "var(--bg-elevated)", border: `1px solid ${emi > 0 ? "rgba(251,113,133,0.2)" : "var(--border-default)"}` }}>
                  <p className="text-[10px] font-medium mb-0.5" style={{ color: emi > 0 ? "var(--accent-rose)" : "var(--text-muted)" }}>EMI / Loans</p>
                  <p className="text-base font-extrabold" style={{ color: emi > 0 ? "var(--accent-rose)" : "var(--text-muted)" }}>
                    {emi > 0 ? fmt(emi) : "₹0"}
                  </p>
                </div>
                <div className="text-center px-1 self-center text-xs font-bold" style={{ color: "var(--text-muted)" }}>−</div>
                {/* Expenses */}
                <div className="flex-1 p-3 rounded-xl text-center"
                  style={{ background: "rgba(251,146,60,0.08)", border: "1px solid rgba(251,146,60,0.2)" }}>
                  <p className="text-[10px] font-medium mb-0.5" style={{ color: "var(--accent-orange)" }}>Expenses</p>
                  <p className="text-base font-extrabold" style={{ color: "var(--accent-orange)" }}>{fmt(totalMonthlySpend)}</p>
                  <p className="text-[9px]" style={{ color: "var(--text-muted)" }}>{bookings.length} items</p>
                </div>
                <div className="text-center px-1 self-center text-xs font-bold" style={{ color: "var(--text-muted)" }}>=</div>
                {/* You Keep */}
                <div className="flex-1 p-3 rounded-xl text-center"
                  style={{
                    background: monthlySavings >= 0 ? "rgba(52,211,153,0.1)" : "rgba(251,113,133,0.08)",
                    border: `1.5px solid ${monthlySavings >= 0 ? "rgba(52,211,153,0.3)" : "rgba(251,113,133,0.2)"}`,
                  }}>
                  <p className="text-[10px] font-bold mb-0.5" style={{ color: monthlySavings >= 0 ? "var(--accent-emerald)" : "var(--accent-rose)" }}>
                    You Keep 💰
                  </p>
                  <p className="text-base font-extrabold" style={{ color: monthlySavings >= 0 ? "var(--accent-emerald)" : "var(--accent-rose)" }}>
                    {monthlySavings >= 0 ? fmt(monthlySavings) : `−${fmt(Math.abs(monthlySavings))}`}
                  </p>
                  <p className="text-[9px]" style={{ color: "var(--text-muted)" }}>
                    {savingsPercent >= 20 ? "👍 Healthy" : savingsPercent >= 10 ? "⚠️ Moderate" : monthlySavings < 0 ? "❗ Over budget" : "❗ Low"}
                  </p>
                </div>
              </div>
              {/* Savings rate bar */}
              {monthlySavings > 0 && (
                <div className="mt-3">
                  <div className="flex justify-between text-[10px] mb-1" style={{ color: "var(--text-muted)" }}>
                    <span>Savings rate: <strong style={{ color: savingsPercent >= 20 ? "var(--accent-emerald)" : "var(--accent-amber)" }}>{savingsPercent}% of salary</strong></span>
                    <span>Goal: 20%+</span>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{ background: "var(--bg-elevated)" }}>
                    <div className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${Math.min(100, savingsPercent)}%`,
                        background: savingsPercent >= 20
                          ? "linear-gradient(90deg, var(--accent-emerald), var(--accent-sky))"
                          : savingsPercent >= 10
                          ? "linear-gradient(90deg, var(--accent-amber), var(--accent-orange))"
                          : "var(--accent-rose)",
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── No salary prompt ── */}
          {monthlyIncome === 0 && (
            <div className="mb-6 p-4 rounded-xl flex items-center gap-3"
              style={{ background: "var(--bg-input)", border: "1px solid var(--border-default)" }}>
              <Shield size={16} style={{ color: "var(--text-muted)" }} />
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                Run a plan with your salary to see the full money flow — Salary − EMI − Expenses = What You Keep
              </p>
            </div>
          )}

          {/* ── Summary Cards ── */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="p-4 rounded-xl text-center"
              style={{ background: "rgba(251,146,60,0.08)", border: "1px solid rgba(251,146,60,0.15)" }}>
              <p className="text-xs font-medium mb-1" style={{ color: "var(--text-muted)" }}>Total Expenses</p>
              <p className="text-xl font-extrabold" style={{ color: "var(--accent-orange)" }}>
                {fmt(totalMonthlySpend)}
              </p>
              <p className="text-[10px] mt-1" style={{ color: "var(--text-muted)" }}>
                {bookings.length} item{bookings.length > 1 ? "s" : ""} · {Object.keys(grouped).length} categories
              </p>
            </div>

            {emi > 0 ? (
              <div className="p-4 rounded-xl text-center"
                style={{ background: "rgba(251,113,133,0.08)", border: "1px solid rgba(251,113,133,0.15)" }}>
                <p className="text-xs font-medium mb-1" style={{ color: "var(--text-muted)" }}>EMI / Loans</p>
                <p className="text-xl font-extrabold" style={{ color: "var(--accent-rose)" }}>{fmt(emi)}</p>
                <p className="text-[10px] mt-1" style={{ color: "var(--text-muted)" }}>
                  {monthlyIncome > 0 ? `${Math.round((emi / monthlyIncome) * 100)}% of salary` : "fixed monthly"}
                </p>
              </div>
            ) : (
              <div className="p-4 rounded-xl text-center" style={{ background: "var(--bg-elevated)" }}>
                <p className="text-xs font-medium mb-1" style={{ color: "var(--text-muted)" }}>EMI / Loans</p>
                <p className="text-xl font-extrabold" style={{ color: "var(--text-muted)" }}>₹0</p>
                <p className="text-[10px] mt-1" style={{ color: "var(--text-muted)" }}>no loans</p>
              </div>
            )}

            <div className="p-4 rounded-xl text-center" style={{
              background: monthlySavings >= 0 ? "rgba(52,211,153,0.08)" : "rgba(251,113,133,0.08)",
              border: `1px solid ${monthlySavings >= 0 ? "rgba(52,211,153,0.2)" : "rgba(251,113,133,0.2)"}`,
            }}>
              <p className="text-xs font-medium mb-1" style={{ color: "var(--text-muted)" }}>You Keep</p>
              <p className="text-xl font-extrabold"
                style={{ color: monthlySavings >= 0 ? "var(--accent-emerald)" : "var(--accent-rose)" }}>
                {monthlySavings >= 0 ? fmt(monthlySavings) : `−${fmt(Math.abs(monthlySavings))}`}
              </p>
              <p className="text-[10px] mt-1" style={{ color: "var(--text-muted)" }}>
                {monthlySavings >= 0 ? `${savingsPercent}% savings rate` : "over budget ⚠️"}
              </p>
            </div>
          </div>

          {/* ── Category Breakdown ── */}
          {Object.keys(grouped).length > 1 && (
            <div className="mb-6">
              <p className="text-xs font-semibold mb-3" style={{ color: "var(--text-muted)" }}>SPEND BY CATEGORY</p>
              <div className="space-y-2">
                {Object.entries(grouped).map(([type, items]) => {
                  const cfg = TYPE_CONFIG[type] || TYPE_CONFIG.misc;
                  const typeTotal = items.reduce((s, i) => s + i.monthlyCost, 0);
                  const pct = totalMonthlySpend > 0 ? Math.round((typeTotal / totalMonthlySpend) * 100) : 0;
                  return (
                    <div key={type} className="flex items-center gap-3">
                      <span className="text-sm w-5 text-center">{cfg.emoji}</span>
                      <span className="text-xs w-28 font-medium" style={{ color: "var(--text-secondary)" }}>{cfg.label}</span>
                      <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: "var(--bg-input)" }}>
                        <div className="h-full rounded-full transition-all duration-700"
                          style={{ width: `${pct}%`, background: cfg.color }} />
                      </div>
                      <span className="text-xs font-bold w-16 text-right" style={{ color: cfg.color }}>{fmt(typeTotal)}</span>
                      <span className="text-[10px] w-8 text-right" style={{ color: "var(--text-muted)" }}>{pct}%</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── Budget Progress Bar ── */}
          {monthlyIncome > 0 && (
            <div className="mb-6">
              <div className="flex justify-between text-xs mb-2">
                <span style={{ color: "var(--text-muted)" }}>Budget used</span>
                <span style={{ color: "var(--text-secondary)" }}>
                  {fmt(totalMonthlySpend)} of {fmt(monthlyIncome)}
                </span>
              </div>
              <div className="h-3 rounded-full overflow-hidden" style={{ background: "var(--bg-input)" }}>
                <div className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${Math.min(100, (totalMonthlySpend / monthlyIncome) * 100)}%`,
                    background: totalMonthlySpend <= monthlyIncome * 0.6
                      ? "linear-gradient(90deg, var(--accent-emerald), var(--accent-sky))"
                      : totalMonthlySpend <= monthlyIncome * 0.8
                      ? "linear-gradient(90deg, var(--accent-amber), var(--accent-orange))"
                      : "linear-gradient(90deg, var(--accent-rose), var(--accent-rose))",
                  }}
                />
              </div>
              <div className="flex justify-between text-[10px] mt-1.5" style={{ color: "var(--text-muted)" }}>
                <span>₹0</span>
                <span>{Math.round((totalMonthlySpend / monthlyIncome) * 100)}% of salary</span>
                <span>{fmt(monthlyIncome)}</span>
              </div>
            </div>
          )}

          {/* ── Booked Items ── */}
          <div className="space-y-5 mb-4">
            {Object.entries(grouped).map(([type, items]) => {
              const cfg = TYPE_CONFIG[type] || TYPE_CONFIG.misc;
              const typeTotal = items.reduce((s, i) => s + i.monthlyCost, 0);
              return (
                <div key={type}>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
                      style={{ color: cfg.color }}>
                      {cfg.emoji} {cfg.label}
                    </h4>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full"
                      style={{ background: `${cfg.color}15`, color: cfg.color }}>
                      {fmt(typeTotal)}/mo
                    </span>
                  </div>
                  <div className="space-y-2">
                    {items.map((item) => (
                      <div key={item.id} className="flex items-center gap-3 p-3 rounded-xl group"
                        style={{ background: "var(--bg-input)", border: "1px solid var(--border-default)" }}>
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                          style={{ background: `${cfg.color}15` }}>
                          <span style={{ color: cfg.color }}>{cfg.icon}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold truncate" style={{ color: "var(--text-primary)" }}>
                            {item.name}
                          </p>
                          <p className="text-xs truncate" style={{ color: "var(--text-muted)" }}>
                            {item.area}{item.city && item.area ? `, ${item.city}` : item.city} · {item.details}
                          </p>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <div className="text-right">
                            <p className="text-sm font-bold" style={{ color: cfg.color }}>{fmt(item.monthlyCost)}</p>
                            <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>per month</p>
                          </div>
                          <button onClick={() => removeBooking(item.id)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg"
                            style={{ background: "none", border: "none", cursor: "pointer", color: "var(--accent-rose)" }}>
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {bookings.length > 5 && (
            <button
              onClick={() => setShowAll((v) => !v)}
              className="w-full mb-4 py-2 text-xs font-medium rounded-xl transition-all"
              style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-default)", color: "var(--text-muted)", cursor: "pointer" }}>
              {showAll ? "Show less" : `Show all ${bookings.length} items`}
            </button>
          )}

          {/* ── Savings Insight ── */}
          {monthlyIncome > 0 && (
            <div className="mb-4 p-4 rounded-xl flex items-start gap-3"
              style={{ background: "linear-gradient(135deg, rgba(52,211,153,0.05), rgba(56,189,248,0.05))", border: "1px solid rgba(52,211,153,0.15)" }}>
              <PiggyBank size={18} className="shrink-0 mt-0.5" style={{ color: "var(--accent-emerald)" }} />
              <div>
                <p className="text-xs font-semibold mb-1" style={{ color: "var(--accent-emerald)" }}>
                  {monthlySavings >= 0
                    ? `💰 You keep ${fmt(monthlySavings)} this month`
                    : `⚠️ You are ${fmt(Math.abs(monthlySavings))} over budget`}
                </p>
                <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
                  {emi > 0
                    ? `${fmt(monthlyIncome)} salary − ${fmt(emi)} EMI − ${fmt(totalMonthlySpend)} expenses = `
                    : `${fmt(monthlyIncome)} salary − ${fmt(totalMonthlySpend)} expenses = `}
                  <strong style={{ color: monthlySavings >= 0 ? "var(--accent-emerald)" : "var(--accent-rose)" }}>
                    {fmt(monthlySavings)} remaining
                  </strong>
                  {monthlySavings >= monthlyIncome * 0.25
                    ? " · Excellent! Consider putting the surplus into an SIP or RD."
                    : monthlySavings >= monthlyIncome * 0.15
                    ? " · Good. Trim dining by 20% to hit the 20% savings target."
                    : monthlySavings > 0
                    ? " · Low savings rate. A cheaper area or accommodation type can help."
                    : " · Remove some expenses or consider a more affordable neighbourhood."}
                </p>
              </div>
            </div>
          )}

          {/* ── Add More Expenses ── */}
          <AddExpenseInline onAdd={addBooking} city={city} area={area} />
        </div>
      )}
    </div>
  );
}

/* ─── Connect Money Tips to live bookings + EMI ───────────────────
   Pulls live bookings from context and forwards all data down.        */
function _MoneyTipsBridge({ salary, emi }: { salary: number; emi: number }) {
  const { bookings, totalMonthlySpend } = useBookings();
  return <MoneyTipsPanel salary={salary} emi={emi} spend={totalMonthlySpend} bookings={bookings} />;
}
