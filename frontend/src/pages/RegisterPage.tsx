import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { MapPin, Eye, EyeOff, Sparkles, UserPlus } from "lucide-react";

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
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

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
              <h1 className="text-xl font-bold gradient-text">SmartEarn Living</h1>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>Urban Relocation Platform</p>
            </div>
          </div>
          <h2 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>Create your account</h2>
          <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>Start your smart relocation journey</p>
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
              <label className="form-label">Password <span style={{ color: "var(--text-muted)" }}>(min 6 chars)</span></label>
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
            </div>

            {/* Confirm Password */}
            <div>
              <label className="form-label">Confirm password</label>
              <input
                id="register-confirm"
                type={showPwd ? "text" : "password"}
                className="form-input"
                placeholder="••••••••"
                value={form.confirm}
                onChange={e => setForm(f => ({ ...f, confirm: e.target.value }))}
                required
              />
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
                  <UserPlus size={17} /> Create Account
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
