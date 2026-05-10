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
import { Sparkles, MapPin, LogOut, LayoutDashboard } from "lucide-react";
import { BookingsProvider } from "./context/BookingsContext";

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
          resolution_hint: "Start the backend with: python3 -m uvicorn main:app --reload --port 8000",
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
          position: "sticky", top: 0, zIndex: 50, padding: "16px 24px",
          background: "rgba(10, 10, 15, 0.85)",
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
              <h1 className="text-base font-bold gradient-text leading-tight">SmartEarn Living</h1>
              <p className="text-[10px] font-medium tracking-wider uppercase" style={{ color: "var(--text-muted)" }}>
                Ecosystem Platform
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
                  Hi, {user.name.split(" ")[0]} 👋
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
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-extrabold mb-3" style={{ color: "var(--text-primary)" }}>
                Where should you <span className="gradient-text">live & thrive</span>?
              </h2>
              <p className="text-base max-w-xl mx-auto" style={{ color: "var(--text-secondary)" }}>
                Tell us about your work, finances, and lifestyle — we'll find the perfect
                neighborhood with a full financial breakdown and daily routine projection.
              </p>
            </div>
            <InputForm onSubmit={handleSubmit} loading={false} />
          </div>
        )}

        {view.kind === "loading" && (
          <div className="flex flex-col items-center justify-center py-24 fade-in-up">
            <div className="relative">
              <div className="w-20 h-20 rounded-full animate-spin-slow" style={{ border: "3px solid var(--border-default)", borderTopColor: "var(--accent-indigo)" }} />
            </div>
            <p className="mt-6 text-lg font-semibold gradient-text">AI is computing your plan…</p>
            <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>
               Fetching places · Estimating savings · Scoring neighborhoods · Generating insights
            </p>
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
          SmartEarn Living Ecosystem · Multi-City Intelligence · {new Date().getFullYear()}
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

