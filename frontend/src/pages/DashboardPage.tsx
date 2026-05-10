import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  MapPin, Sparkles, TrendingUp, Clock, Target,
  Building2, ChevronRight, BarChart3, RefreshCw,
  IndianRupee, Star, LogOut, Zap, Home, Dumbbell,
  Utensils, Trash2, PiggyBank, Wallet, ArrowRight,
  Shield, Plus, CheckCircle2, Briefcase
} from "lucide-react";
import { useBookings, type BookedItem } from "../context/BookingsContext";
import { DiscoveryModal } from "../components/DiscoveryModal";

interface HistoryEntry {
  timestamp: string;
  job_location: string;
  monthly_salary: number;
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
          fetch("/api/dashboard/history", {
            headers: { Authorization: `Bearer ${token}` },
          }),
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
    } catch {
      return iso;
    }
  };

  const latestSalary = dashboard?.history?.[0]?.monthly_salary;
  const isNewUser = !loading && (!dashboard || dashboard.total_runs === 0);

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
            <button
              onClick={() => navigate("/plan")}
              className="btn-primary"
              style={{ padding: "8px 18px", fontSize: "0.82rem" }}
            >
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
                    : `You've run ${dashboard?.total_runs} recommendation${dashboard!.total_runs > 1 ? "s" : ""}. Your personalized history and spending tracker are below.`}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
                <button
                  onClick={() => navigate("/plan")}
                  className="btn-primary"
                >
                  <Zap size={16} />
                  {isNewUser ? "Start Planning" : "New Recommendation"}
                </button>
              </div>
            </div>

            {/* ── How It Works (shown only to new users) ── */}
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
                    { step: "4", icon: <Wallet size={22} />, title: "Track Your Spending", desc: "Book options and watch savings update in real time", color: "var(--accent-amber)" },
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
            <SpendingTrackerPanel salary={latestSalary} onStartPlanning={() => navigate("/plan")} />

            {/* ── City Stats ── */}
            {stats && (
              <div className="fade-in-up fade-in-up-2">
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: "var(--text-secondary)" }}>
                  <BarChart3 size={15} style={{ color: "var(--accent-indigo)" }} />
                  PLATFORM OVERVIEW
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <StatCard icon={<Building2 size={16} style={{ color: "var(--accent-indigo)" }} />} label="Areas Covered" value={`${stats.areas_covered} Neighborhoods`} />
                  <StatCard icon={<IndianRupee size={16} style={{ color: "var(--accent-emerald)" }} />} label="Avg Rent Range" value={stats.avg_rent_range} />
                  <StatCard icon={<Clock size={16} style={{ color: "var(--accent-amber)" }} />} label="Avg Commute" value={`${stats.avg_commute_mins} minutes`} />
                  <StatCard icon={<Zap size={16} style={{ color: "var(--accent-violet)" }} />} label="Top IT Hub" value={stats.top_it_hub} />
                  <StatCard icon={<Star size={16} style={{ color: "var(--accent-sky)" }} />} label="Top Lifestyle Area" value={stats.top_lifestyle} />
                  <StatCard icon={<TrendingUp size={16} style={{ color: "var(--accent-orange)" }} />} label="Best Budget Area" value={stats.top_budget_area} />
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
                          <div className="text-xs" style={{ color: "var(--text-muted)" }}>
                            Score: {entry.top_area_score}/100
                          </div>
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

      {/* Restaurant Discovery Modal */}
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

/* ─── Spending Tracker Panel ───────────────────────────────────────── */

const TYPE_CONFIG: Record<string, { icon: React.ReactNode; color: string; label: string }> = {
  accommodation: { icon: <Home size={14} />,     color: "var(--accent-indigo)",  label: "🏠 Accommodation" },
  gym:           { icon: <Dumbbell size={14} />, color: "var(--accent-emerald)", label: "🏋️ Gym" },
  food:          { icon: <Utensils size={14} />, color: "var(--accent-rose)",    label: "🍽️ Restaurant" },
};

function SpendingTrackerPanel({
  salary,
  onStartPlanning,
}: {
  salary?: number;
  onStartPlanning: () => void;
}) {
  const { bookings, removeBooking, totalMonthlySpend, getSavings, clearBookings } = useBookings();
  const [showAll, setShowAll] = useState(false);

  const monthlyIncome = salary || 0;
  const monthlySavings = getSavings(monthlyIncome, 0);
  const savingsPercent = monthlyIncome > 0 ? Math.round((monthlySavings / monthlyIncome) * 100) : 0;

  // Group bookings by type
  const grouped = bookings.reduce<Record<string, BookedItem[]>>((acc, b) => {
    (acc[b.type] = acc[b.type] || []).push(b);
    return acc;
  }, {});

  const visibleBookings = showAll ? bookings : bookings.slice(0, 4);

  return (
    <div className="fade-in-up fade-in-up-1 glass-card overflow-hidden"
      style={{ borderColor: "rgba(129,140,248,0.2)" }}>

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
                My Spending Tracker
              </h3>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                {bookings.length === 0
                  ? "Book accommodations, gyms & restaurants from your plan results"
                  : `${bookings.length} item${bookings.length > 1 ? "s" : ""} booked — tracking monthly spend`}
              </p>
            </div>
          </div>
          {bookings.length > 0 && (
            <button onClick={clearBookings}
              className="text-xs font-medium px-3 py-1.5 rounded-lg transition-all"
              style={{ background: "rgba(251,113,133,0.1)", color: "var(--accent-rose)", border: "1px solid rgba(251,113,133,0.2)" }}>
              Clear All
            </button>
          )}
        </div>
      </div>

      {bookings.length === 0 ? (
        /* ── Empty State ── */
        <div className="p-8 text-center">
          <div className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-4"
            style={{ background: "rgba(129,140,248,0.08)", border: "1px solid rgba(129,140,248,0.15)" }}>
            <PiggyBank size={28} style={{ color: "var(--accent-indigo)" }} />
          </div>
          <h4 className="font-bold mb-2" style={{ color: "var(--text-primary)" }}>No bookings yet</h4>
          <p className="text-sm mb-2" style={{ color: "var(--text-muted)", maxWidth: 380, margin: "0 auto 12px" }}>
            After you run a plan, you can "book" accommodations, gyms, and restaurants. 
            Your spending will be tracked here in real time so you always know your monthly budget.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 mb-5 text-xs" style={{ color: "var(--text-muted)" }}>
            {["🏠 Choose a PG or flat", "🏋️ Book a gym", "🍽️ Save a restaurant", "💰 See live savings rate"].map((s) => (
              <span key={s} className="px-3 py-1.5 rounded-full flex items-center gap-1.5"
                style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-default)" }}>
                {s}
              </span>
            ))}
          </div>
          <button onClick={onStartPlanning} className="btn-primary">
            <Plus size={16} /> Start Planning
          </button>
        </div>
      ) : (
        <div className="p-6">
          {/* ── Summary Cards ── */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="p-4 rounded-xl text-center"
              style={{ background: "rgba(129,140,248,0.08)", border: "1px solid rgba(129,140,248,0.15)" }}>
              <p className="text-xs font-medium mb-1" style={{ color: "var(--text-muted)" }}>Monthly Spend</p>
              <p className="text-xl font-extrabold" style={{ color: "var(--accent-indigo)" }}>
                {fmt(totalMonthlySpend)}
              </p>
              <p className="text-[10px] mt-1" style={{ color: "var(--text-muted)" }}>across {bookings.length} items</p>
            </div>

            {monthlyIncome > 0 ? (
              <>
                <div className="p-4 rounded-xl text-center" style={{
                  background: monthlySavings >= 0 ? "rgba(52,211,153,0.08)" : "rgba(251,113,133,0.08)",
                  border: `1px solid ${monthlySavings >= 0 ? "rgba(52,211,153,0.2)" : "rgba(251,113,133,0.2)"}`,
                }}>
                  <p className="text-xs font-medium mb-1" style={{ color: "var(--text-muted)" }}>Est. Savings</p>
                  <p className="text-xl font-extrabold"
                    style={{ color: monthlySavings >= 0 ? "var(--accent-emerald)" : "var(--accent-rose)" }}>
                    {fmt(Math.abs(monthlySavings))}
                  </p>
                  <p className="text-[10px] mt-1" style={{ color: "var(--text-muted)" }}>
                    {monthlySavings >= 0 ? "monthly savings" : "over budget"}
                  </p>
                </div>
                <div className="p-4 rounded-xl text-center" style={{ background: "var(--bg-elevated)" }}>
                  <p className="text-xs font-medium mb-1" style={{ color: "var(--text-muted)" }}>Savings Rate</p>
                  <p className="text-xl font-extrabold"
                    style={{ color: savingsPercent >= 20 ? "var(--accent-emerald)" : savingsPercent >= 10 ? "var(--accent-amber)" : "var(--accent-rose)" }}>
                    {savingsPercent}%
                  </p>
                  <p className="text-[10px] mt-1" style={{ color: "var(--text-muted)" }}>
                    {savingsPercent >= 20 ? "👍 Healthy" : savingsPercent >= 10 ? "⚠️ Moderate" : "❗ Low"}
                  </p>
                </div>
              </>
            ) : (
              <div className="col-span-2 p-4 rounded-xl flex items-center justify-center gap-3"
                style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-default)" }}>
                <Shield size={16} style={{ color: "var(--text-muted)" }} />
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                  Run a plan with your salary to see live savings calculations
                </p>
              </div>
            )}
          </div>

          {/* Budget Allocation Bar */}
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

          {/* Booked Items by Category */}
          <div className="space-y-5">
            {Object.entries(grouped).map(([type, items]) => {
              const cfg = TYPE_CONFIG[type] || TYPE_CONFIG.accommodation;
              const typeTotal = items.reduce((s, i) => s + i.monthlyCost, 0);
              return (
                <div key={type}>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
                      style={{ color: cfg.color }}>
                      {cfg.label}
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
                            {item.area}, {item.city} · {item.details}
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

          {/* Show more / less toggle */}
          {bookings.length > 4 && (
            <button
              onClick={() => setShowAll((v) => !v)}
              className="w-full mt-3 py-2 text-xs font-medium rounded-xl transition-all"
              style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-default)", color: "var(--text-muted)" }}
            >
              {showAll ? "Show less" : `Show all ${bookings.length} items`}
            </button>
          )}

          {/* AI Savings Insight */}
          {monthlyIncome > 0 && (
            <div className="mt-5 p-4 rounded-xl flex items-start gap-3"
              style={{ background: "linear-gradient(135deg, rgba(52,211,153,0.05), rgba(56,189,248,0.05))", border: "1px solid rgba(52,211,153,0.15)" }}>
              <PiggyBank size={18} className="shrink-0 mt-0.5" style={{ color: "var(--accent-emerald)" }} />
              <div>
                <p className="text-xs font-semibold mb-1" style={{ color: "var(--accent-emerald)" }}>
                  Savings Insight
                </p>
                <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
                  {monthlySavings >= monthlyIncome * 0.25
                    ? `Excellent! You're saving ${savingsPercent}% of income — well above the 20% benchmark. You're on track for financial independence.`
                    : monthlySavings >= monthlyIncome * 0.15
                    ? `Good start! ${savingsPercent}% savings rate. Consider switching to a PG or reducing dining out to hit the 20% target.`
                    : monthlySavings > 0
                    ? `Your savings rate of ${savingsPercent}% is low. Consider a more affordable accommodation type or area to increase savings.`
                    : `⚠️ Your expenses exceed income by ${fmt(Math.abs(monthlySavings))}. Remove some bookings or choose a cheaper area.`}
                </p>
              </div>
            </div>
          )}

          {/* Add more button */}
          <div className="mt-4 flex justify-center">
            <button onClick={onStartPlanning}
              className="flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-xl transition-all"
              style={{ background: "rgba(99,102,241,0.08)", color: "var(--accent-indigo)", border: "1px solid rgba(99,102,241,0.2)" }}>
              <Plus size={14} /> Run new plan to add more items
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

