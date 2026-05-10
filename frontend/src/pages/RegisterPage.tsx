import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { MapPin, Eye, EyeOff, Sparkles, UserPlus, CheckCircle2 } from "lucide-react";

export function RegisterPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, email: form.email, password: form.password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Registration failed");
      login(data.access_token, data.user);
      // New users go straight to planning — no history to show yet
      navigate("/plan");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = () => {
    const p = form.password;
    if (!p) return null;
    if (p.length < 6) return { label: "Too short", color: "var(--accent-rose)", width: "20%" };
    if (p.length < 8) return { label: "Weak", color: "var(--accent-amber)", width: "45%" };
    if (!/[A-Z]/.test(p) || !/[0-9]/.test(p)) return { label: "Fair", color: "var(--accent-sky)", width: "65%" };
    return { label: "Strong", color: "var(--accent-emerald)", width: "100%" };
  };

  const strength = passwordStrength();

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8" style={{ background: "var(--bg-primary)" }}>
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: "var(--gradient-primary)" }}>
              <MapPin size={24} color="white" />
            </div>
            <div className="text-left">
              <h1 className="text-xl font-bold gradient-text">SmartLiving</h1>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>Urban Relocation Platform</p>
            </div>
          </div>
          <h2 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>Create your account</h2>
          <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
            Start your smart relocation journey — takes 2 minutes
          </p>
        </div>

        {/* What happens after registration */}
        <div className="glass-card p-4 mb-5 flex items-start gap-3"
          style={{ background: "linear-gradient(135deg, rgba(52,211,153,0.06), rgba(99,102,241,0.06))", borderColor: "rgba(52,211,153,0.2)" }}>
          <Sparkles size={18} className="mt-0.5 shrink-0" style={{ color: "var(--accent-emerald)" }} />
          <div>
            <p className="text-sm font-semibold" style={{ color: "var(--accent-emerald)" }}>What happens next?</p>
            <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
              After registering, we'll walk you through a 3-step planning wizard to find your perfect neighborhood, calculate your savings, and simulate your daily routine.
            </p>
          </div>
        </div>

        {/* Card */}
        <div className="glass-card p-8">
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Name */}
            <div>
              <label className="form-label">Full name</label>
              <input
                id="register-name"
                type="text"
                className="form-input"
                placeholder="Vijay Reddy"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="form-label">Email address</label>
              <input
                id="register-email"
                type="email"
                className="form-input"
                placeholder="you@example.com"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="form-label">Password</label>
              <div className="relative">
                <input
                  id="register-password"
                  type={showPwd ? "text" : "password"}
                  className="form-input"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  required
                  minLength={6}
                  style={{ paddingRight: "44px" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: "var(--text-muted)", background: "none", border: "none", cursor: "pointer" }}
                >
                  {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {/* Password strength */}
              {strength && (
                <div className="mt-2">
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--bg-input)" }}>
                    <div className="h-full rounded-full transition-all duration-300"
                      style={{ width: strength.width, background: strength.color }} />
                  </div>
                  <p className="text-xs mt-1" style={{ color: strength.color }}>{strength.label}</p>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="form-label">Confirm password</label>
              <div className="relative">
                <input
                  id="register-confirm"
                  type={showPwd ? "text" : "password"}
                  className="form-input"
                  placeholder="••••••••"
                  value={form.confirm}
                  onChange={e => setForm(f => ({ ...f, confirm: e.target.value }))}
                  required
                  style={{ paddingRight: "44px" }}
                />
                {form.confirm && form.password === form.confirm && (
                  <CheckCircle2 size={18} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: "var(--accent-emerald)" }} />
                )}
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="p-3 rounded-xl text-sm" style={{ background: "rgba(251,113,133,0.1)", color: "var(--accent-rose)", border: "1px solid rgba(251,113,133,0.2)" }}>
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              id="register-submit"
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center"
              style={{ width: "100%" }}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating account…
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <UserPlus size={17} /> Create Account & Start Planning
                </span>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              Already have an account?{" "}
              <Link to="/login" className="font-semibold" style={{ color: "var(--accent-indigo)" }}>
                Sign in
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center mt-4 text-xs flex items-center justify-center gap-1" style={{ color: "var(--text-muted)" }}>
          <Sparkles size={12} style={{ color: "var(--accent-violet)" }} />
          Powered by Groq & Gemini AI · Multi-City Data
        </p>
      </div>
    </div>
  );
}
