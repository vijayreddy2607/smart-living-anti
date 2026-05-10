import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  MapPin, Sparkles, TrendingUp, Clock, Target,
  Building2, ChevronRight, BarChart3, RefreshCw,
  IndianRupee, Star, LogOut, Zap, Home, Dumbbell,
  Utensils, Trash2, PiggyBank, Wallet
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

function SustainBadge({ s }: { s: string }) {
  const map: Record<string, { color: string; label: string }> = {
    HIGHLY_SUSTAINABLE: { color: "var(--accent-emerald)", label: "Highly Sustainable" },
    MARGINAL:           { color: "var(--accent-amber)",   label: "Marginal" },
    UNSUSTAINABLE:      { color: "var(--accent-rose)",    label: "Unsustainable" },
  };
  const v = map[s] ?? { color: "var(--text-muted)", label: s };
  return (
    <span className="badge text-xs" style={{ background: `${v.color}20`, color: v.color, border: `1px solid ${v.color}30` }}>
      {v.label}
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

  // Show restaurant discovery after first load if user has history
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

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-primary)" }}>

      {/* ── Navbar ── */}
      <nav style={{ position: "sticky", top: 0, zIndex: 50, padding: "16px 24px",
        background: "rgba(10,10,15,0.85)", backdropFilter: "blur(16px)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "var(--gradient-primary)" }}>
              <MapPin size={18} color="white" />
            </div>
            <div>
              <h1 className="text-base font-bold gradient-text leading-tight">SmartEarn Living</h1>
              <p className="text-[10px] font-medium tracking-wider uppercase" style={{ color: "var(--text-muted)" }}>Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>Hi, {user?.name?.split(" ")[0]} 👋</span>
            <button onClick={logout} title="Logout"
              style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}>
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </nav>

      <main style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px" }} className="space-y-8">

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
              style={{ background: "linear-gradient(135deg, rgba(129,140,248,0.08), rgba(167,139,250,0.08))", borderColor: "rgba(129,140,248,0.2)" }}>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles size={18} style={{ color: "var(--accent-violet)" }} />
                  <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--accent-violet)" }}>
                    Your Dashboard
                  </span>
                </div>
                <h2 className="text-2xl md:text-3xl font-extrabold" style={{ color: "var(--text-primary)" }}>
                  Welcome back, <span className="gradient-text">{user?.name?.split(" ")[0]}</span> 👋
                </h2>
                <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
                  {dashboard?.total_runs === 0
                    ? "You haven't run any recommendations yet. Start your smart relocation journey!"
                    : `You've run ${dashboard?.total_runs} recommendation${dashboard!.total_runs > 1 ? "s" : ""}. Your personalized history is below.`}
                </p>
              </div>
              <button
                id="new-recommendation-btn"
                onClick={() => navigate("/plan")}
                className="btn-primary flex-shrink-0"
              >
                <Zap size={16} /> New Recommendation
              </button>
            </div>

            {/* ── My Bookings & Savings ── */}
            <BookingsSavingsPanel salary={dashboard?.history?.[0]?.monthly_salary} />

            {/* ── City Stats ── */}
            {stats && (
              <div className="fade-in-up fade-in-up-1">
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: "var(--text-secondary)" }}>
                  <BarChart3 size={15} style={{ color: "var(--accent-indigo)" }} />
                  CITY OVERVIEW
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
            <div className="fade-in-up fade-in-up-2">
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: "var(--text-secondary)" }}>
                <Clock size={15} style={{ color: "var(--accent-indigo)" }} />
                YOUR RECOMMENDATION HISTORY
              </h3>

              {!dashboard || dashboard.history.length === 0 ? (
                <div className="glass-card p-10 text-center">
                  <div className="w-14 h-14 mx-auto rounded-2xl flex items-center justify-center mb-4"
                    style={{ background: "rgba(129,140,248,0.1)", border: "1px solid rgba(129,140,248,0.2)" }}>
                    <MapPin size={26} style={{ color: "var(--accent-indigo)" }} />
                  </div>
                  <p className="font-semibold mb-1" style={{ color: "var(--text-primary)" }}>No history yet</p>
                  <p className="text-sm mb-5" style={{ color: "var(--text-muted)" }}>
                    Run your first recommendation to see your personalized area matches here.
                  </p>
                  <button onClick={() => navigate("/plan")} className="btn-primary">
                    <Zap size={15} /> Get Started
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {dashboard.history.map((entry, i) => (
                    <div key={i} className="glass-card p-5 hover:cursor-pointer"
                      onClick={() => navigate("/plan")}>
                      <div className="flex flex-col md:flex-row md:items-center gap-4">

                        {/* Rank Badge */}
                        <div className="flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center"
                          style={{ background: "var(--gradient-primary)" }}>
                          <span className="text-white font-black text-sm">#{i + 1}</span>
                        </div>

                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <span className="font-bold text-sm" style={{ color: "var(--text-primary)" }}>
                              {entry.goal_description}
                            </span>
                            <SustainBadge s={entry.sustainability} />
                          </div>
                          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs" style={{ color: "var(--text-muted)" }}>
                            <span className="flex items-center gap-1">
                              <MapPin size={11} /> Job: {entry.job_location}
                            </span>
                            <span className="flex items-center gap-1">
                              <IndianRupee size={11} /> ₹{entry.monthly_salary.toLocaleString("en-IN")}/mo
                            </span>
                            <span className="flex items-center gap-1">
                              <Target size={11} /> {entry.goal_timeframe_months} months
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock size={11} /> {formatDate(entry.timestamp)}
                            </span>
                          </div>
                        </div>

                        {/* Top Area + Score */}
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
              )}
            </div>

            {/* ── CTA ── */}
            <div className="fade-in-up fade-in-up-3 glass-card p-6 text-center"
              style={{ background: "linear-gradient(135deg, rgba(52,211,153,0.06), rgba(129,140,248,0.06))", borderColor: "rgba(52,211,153,0.15)" }}>
              <RefreshCw size={22} style={{ color: "var(--accent-emerald)", margin: "0 auto 10px" }} />
              <h4 className="font-bold mb-1" style={{ color: "var(--text-primary)" }}>Run a new analysis</h4>
              <p className="text-sm mb-4" style={{ color: "var(--text-muted)" }}>
                Salaries change, goals evolve. Get a fresh recommendation anytime.
              </p>
              <button onClick={() => navigate("/plan")} className="btn-primary">
                <Zap size={15} /> Start New Recommendation
              </button>
            </div>
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

/* ─── Bookings & Savings Panel ─────────────────────────────────────── */
const fmt = (n: number) => `₹${n.toLocaleString("en-IN")}`;

const TYPE_CONFIG: Record<string, { icon: React.ReactNode; color: string; label: string }> = {
  accommodation: { icon: <Home size={14} />, color: "var(--accent-indigo)", label: "🏠 Accommodation" },
  gym:           { icon: <Dumbbell size={14} />, color: "var(--accent-emerald)", label: "🏋️ Gym" },
  food:          { icon: <Utensils size={14} />, color: "var(--accent-rose)", label: "🍽️ Restaurant" },
};

function BookingsSavingsPanel({ salary }: { salary?: number }) {
  const { bookings, removeBooking, totalMonthlySpend, getSavings, clearBookings } = useBookings();

  if (bookings.length === 0) return null;

  const monthlyIncome = salary || 0;
  const monthlySavings = getSavings(monthlyIncome, 0);
  const savingsPercent = monthlyIncome > 0 ? Math.round((monthlySavings / monthlyIncome) * 100) : 0;

  // Group bookings by type
  const grouped = bookings.reduce<Record<string, BookedItem[]>>((acc, b) => {
    (acc[b.type] = acc[b.type] || []).push(b);
    return acc;
  }, {});

  return (
    <div className="fade-in-up fade-in-up-1 glass-card overflow-hidden"
      style={{ borderColor: "rgba(129,140,248,0.25)" }}>

      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, var(--accent-indigo), var(--accent-violet))" }}>
              <Wallet size={16} color="white" />
            </div>
            <div>
              <h3 className="text-base font-bold" style={{ color: "var(--text-primary)" }}>
                My Bookings & Savings
              </h3>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                {bookings.length} item{bookings.length > 1 ? "s" : ""} booked
              </p>
            </div>
          </div>
          <button onClick={clearBookings} className="text-xs font-medium px-3 py-1.5 rounded-lg transition-all"
            style={{ background: "rgba(251,113,133,0.1)", color: "var(--accent-rose)", border: "1px solid rgba(251,113,133,0.2)" }}>
            Clear All
          </button>
        </div>

        {/* Savings Summary Cards */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          <div className="p-3 rounded-xl text-center" style={{ background: "rgba(129,140,248,0.08)", border: "1px solid rgba(129,140,248,0.15)" }}>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>Monthly Spend</p>
            <p className="text-lg font-extrabold mt-1" style={{ color: "var(--accent-indigo)" }}>{fmt(totalMonthlySpend)}</p>
          </div>
          {monthlyIncome > 0 && (
            <>
              <div className="p-3 rounded-xl text-center" style={{
                background: monthlySavings >= 0 ? "rgba(52,211,153,0.08)" : "rgba(251,113,133,0.08)",
                border: `1px solid ${monthlySavings >= 0 ? "rgba(52,211,153,0.15)" : "rgba(251,113,133,0.15)"}`,
              }}>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>Est. Savings</p>
                <p className="text-lg font-extrabold mt-1" style={{ color: monthlySavings >= 0 ? "var(--accent-emerald)" : "var(--accent-rose)" }}>
                  {fmt(Math.abs(monthlySavings))}
                </p>
              </div>
              <div className="p-3 rounded-xl text-center" style={{ background: "var(--bg-elevated)" }}>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>Savings Rate</p>
                <p className="text-lg font-extrabold mt-1" style={{ color: savingsPercent >= 20 ? "var(--accent-emerald)" : savingsPercent >= 10 ? "var(--accent-amber)" : "var(--accent-rose)" }}>
                  {savingsPercent}%
                </p>
              </div>
            </>
          )}
        </div>

        {/* Spend Bar */}
        {monthlyIncome > 0 && (
          <div className="mb-5">
            <div className="flex justify-between text-xs mb-1.5">
              <span style={{ color: "var(--text-muted)" }}>Budget allocation</span>
              <span style={{ color: "var(--text-secondary)" }}>{fmt(totalMonthlySpend)} of {fmt(monthlyIncome)}</span>
            </div>
            <div className="h-2.5 rounded-full overflow-hidden" style={{ background: "var(--bg-input)" }}>
              <div className="h-full rounded-full transition-all duration-700" style={{
                width: `${Math.min(100, (totalMonthlySpend / monthlyIncome) * 100)}%`,
                background: totalMonthlySpend <= monthlyIncome * 0.6
                  ? "linear-gradient(90deg, var(--accent-emerald), var(--accent-sky))"
                  : totalMonthlySpend <= monthlyIncome * 0.8
                  ? "linear-gradient(90deg, var(--accent-amber), var(--accent-orange))"
                  : "linear-gradient(90deg, var(--accent-rose), var(--accent-rose))",
              }} />
            </div>
          </div>
        )}

        {/* Booked Items by Type */}
        <div className="space-y-4">
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
                  <span className="text-xs font-semibold" style={{ color: cfg.color }}>{fmt(typeTotal)}/mo</span>
                </div>
                <div className="space-y-2">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 p-3 rounded-xl group"
                      style={{ background: "var(--bg-input)", border: "1px solid var(--border-default)" }}>
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                        style={{ background: `${cfg.color}18` }}>
                        {cfg.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate" style={{ color: "var(--text-primary)" }}>{item.name}</p>
                        <p className="text-xs truncate" style={{ color: "var(--text-muted)" }}>
                          {item.area}, {item.city} · {item.details}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-bold" style={{ color: cfg.color }}>{fmt(item.monthlyCost)}</p>
                        <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>per month</p>
                      </div>
                      <button onClick={() => removeBooking(item.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                        style={{ background: "none", border: "none", cursor: "pointer", color: "var(--accent-rose)" }}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* AI Savings Tip */}
        {monthlyIncome > 0 && (
          <div className="mt-4 p-3 rounded-xl flex items-start gap-2"
            style={{ background: "linear-gradient(135deg, rgba(52,211,153,0.06), rgba(56,189,248,0.06))", border: "1px solid rgba(52,211,153,0.15)" }}>
            <PiggyBank size={16} className="shrink-0 mt-0.5" style={{ color: "var(--accent-emerald)" }} />
            <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
              {monthlySavings >= monthlyIncome * 0.2
                ? `Great job! You're saving ${savingsPercent}% of your income. This is above the recommended 20% benchmark.`
                : monthlySavings > 0
                ? `You're saving ${savingsPercent}% of income. Consider reducing food costs or switching to a PG/shared flat to hit the 20% target.`
                : `Your expenses exceed your income by ${fmt(Math.abs(monthlySavings))}. Consider choosing a more affordable area or reducing bookings.`
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
