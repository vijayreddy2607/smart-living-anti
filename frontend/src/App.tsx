import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { LoginPage }    from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { DashboardPage } from "./pages/DashboardPage";
import { LandingPage }  from "./pages/LandingPage";
import { InputForm, type RecommendPayload } from "./components/InputForm";
import { ResultsDashboard, type RecommendResponse } from "./components/ResultsDashboard";
import { ErrorDisplay } from "./components/ErrorDisplay";
import { Sparkles, MapPin, LogOut, LayoutDashboard, Wallet } from "lucide-react";
import { BookingsProvider, useBookings } from "./context/BookingsContext";

// ─── Protected Route Wrapper ───────────────────────────────────────────
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

// ─── View state for the main planner ──────────────────────────────────
type ViewState =
  | { kind: "form" }
  | { kind: "loading" }
  | { kind: "results"; data: RecommendResponse; payload: RecommendPayload }
  | { kind: "error"; error: any };

// ─── Spending Badge (mini widget in navbar) ───────────────────────────
function SpendingBadge() {
  const { bookings, totalMonthlySpend } = useBookings();
  const navigate = useNavigate();

  if (bookings.length === 0) return null;

  return (
    <button
      onClick={() => navigate("/dashboard")}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all"
      title="View my spending tracker"
      style={{
        background: "rgba(52,211,153,0.1)",
        border: "1px solid rgba(52,211,153,0.25)",
        color: "var(--accent-emerald)",
      }}
    >
      <Wallet size={13} />
      ₹{totalMonthlySpend.toLocaleString("en-IN")}/mo
    </button>
  );
}

// ─── Main Planner App ─────────────────────────────────────────────────
function PlannerApp() {
  const { user, logout, token } = useAuth();
  const navigate = useNavigate();
  const [view, setView] = useState<ViewState>({ kind: "form" });

  const handleSubmit = async (payload: RecommendPayload) => {
    setView({ kind: "loading" });
    try {
      const res = await fetch("/api/recommend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { "Authorization": `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        setView({ kind: "error", error: errData?.detail ?? `Server error: ${res.status}` });
        return;
      }

      const data: RecommendResponse = await res.json();
      setView({ kind: "results", data, payload });
    } catch {
      setView({
        kind: "error",
        error: {
          error_code: "NETWORK_ERROR",
          message: "Could not connect to the server. Please ensure the backend is running.",
          resolution_hint: "Start the backend with: cd backend && uvicorn main:app --reload --port 8000",
        },
      });
    }
  };

  const handleBack = () => {
    setView({ kind: "form" });
  };

  const handleRerun = async (updatedPayload: RecommendPayload) => {
    await handleSubmit(updatedPayload);
  };

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-primary)" }}>
      {/* ── Navbar ── */}
      <nav
        style={{
          position: "sticky", top: 0, zIndex: 50, padding: "14px 24px",
          background: "rgba(10, 10, 15, 0.9)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "var(--gradient-primary)" }}>
              <MapPin size={18} color="white" />
            </div>
            <div>
              <h1 className="text-base font-bold gradient-text leading-tight">SmartLiving</h1>
              <p className="text-[10px] font-medium tracking-wider uppercase" style={{ color: "var(--text-muted)" }}>
                Relocation Planner
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <Sparkles size={14} style={{ color: "var(--accent-violet)" }} />
              <span className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>
                AI Analysis
              </span>
            </div>

            {/* Spending tracker badge */}
            <SpendingBadge />

            {user && (
              <div className="flex items-center gap-3 ml-2 pl-3" style={{ borderLeft: "1px solid var(--border-default)" }}>
                <button
                  onClick={() => navigate("/dashboard")}
                  title="Dashboard"
                  className="flex items-center gap-1.5 text-xs font-medium"
                  style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-secondary)" }}
                >
                  <LayoutDashboard size={15} /> Dashboard
                </button>
                <span className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                  {user.name.split(" ")[0]} 👋
                </span>
                <button
                  onClick={logout}
                  title="Sign out"
                  style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}
                >
                  <LogOut size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* ── Main Content ── */}
      <main style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px" }}>
        {view.kind === "form" && (
          <div className="fade-in-up">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4 text-xs font-semibold"
                style={{ background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)", color: "var(--accent-indigo)" }}>
                <Sparkles size={12} /> AI-Powered Neighborhood Matching
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold mb-3" style={{ color: "var(--text-primary)" }}>
                Where should you <span className="gradient-text">live & thrive</span>?
              </h2>
              <p className="text-base max-w-xl mx-auto" style={{ color: "var(--text-secondary)" }}>
                Answer 3 quick questions about your work, finances, and lifestyle.
                We'll find your perfect neighborhood with a full financial breakdown and daily routine simulation.
              </p>
            </div>
            <InputForm onSubmit={handleSubmit} loading={false} />
          </div>
        )}

        {view.kind === "loading" && (
          <div className="flex flex-col items-center justify-center py-24 fade-in-up">
            <div className="relative mb-6">
              <div className="w-24 h-24 rounded-full animate-spin-slow"
                style={{ border: "3px solid var(--border-default)", borderTopColor: "var(--accent-indigo)" }} />
              <div className="absolute inset-0 flex items-center justify-center">
                <MapPin size={28} style={{ color: "var(--accent-indigo)" }} />
              </div>
            </div>
            <p className="text-xl font-bold gradient-text mb-2">AI is building your plan…</p>
            <div className="space-y-1 text-center">
              {[
                "Analyzing neighborhoods near your office",
                "Calculating rent vs savings potential",
                "Simulating your daily routine",
                "Generating AI insights & tradeoffs",
              ].map((step, i) => (
                <p key={i} className="text-sm" style={{ color: "var(--text-muted)", animationDelay: `${i * 0.3}s` }}>
                  ✦ {step}
                </p>
              ))}
            </div>
          </div>
        )}

        {view.kind === "results" && (
          <ResultsDashboard
            data={view.data}
            onBack={() => handleBack()}
            lastPayload={view.payload}
            onRerun={handleRerun}
          />
        )}

        {view.kind === "error" && (
          <ErrorDisplay error={view.error} onRetry={() => setView({ kind: "form" })} />
        )}
      </main>

      {/* ── Footer ── */}
      <footer className="py-6 text-center" style={{ borderTop: "1px solid var(--border-default)" }}>
        <p className="text-xs" style={{ color: "var(--text-muted)" }}>
          SmartLiving Ecosystem · Multi-City Intelligence · {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
}

// ─── Root with Router ─────────────────────────────────────────────────
export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <BookingsProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/"         element={<LandingPage />} />
            <Route path="/login"    element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            {/* Protected routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/plan"
              element={
                <ProtectedRoute>
                  <PlannerApp />
                </ProtectedRoute>
              }
            />
            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BookingsProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
