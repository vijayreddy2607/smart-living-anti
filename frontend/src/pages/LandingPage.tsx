import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  ArrowRight, Sparkles, Brain, Wallet, Clock4, MessageSquareHeart,
  Compass, ShieldCheck, LineChart, Leaf, MapPin, LogIn, UserPlus,
  LayoutDashboard, ChevronRight, Building2, TrendingUp, Zap,
} from "lucide-react";

const features = [
  { icon: Brain, title: "Lifestyle Intelligence", desc: "Scores how sustainable each neighborhood is for your real life — not just rent." },
  { icon: Wallet, title: "Financial Planning", desc: "Salary, EMI, savings goals modeled into a livable monthly plan with projected savings." },
  { icon: Clock4, title: "Daily Routine Simulation", desc: "Your future day mapped minute-by-minute, with stress and recovery built in." },
  { icon: MessageSquareHeart, title: "NLP Review Insights", desc: "Resident reviews distilled by AI into safety, noise, food quality trust signals." },
  { icon: Compass, title: "Tradeoff Engine", desc: "Compare areas across commute, cost, calm and community — visually and honestly." },
  { icon: ShieldCheck, title: "Multi-City Coverage", desc: "Pune, Bengaluru, Hyderabad, Chennai, Mumbai — 28 neighborhoods across 5 cities." },
];

const cities = [
  { name: "Pune", emoji: "🏙️", areas: 8 },
  { name: "Bengaluru", emoji: "💻", areas: 5 },
  { name: "Hyderabad", emoji: "🕌", areas: 5 },
  { name: "Chennai", emoji: "🌊", areas: 5 },
  { name: "Mumbai", emoji: "🌆", areas: 5 },
];

export function LandingPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen relative bg-noise" style={{ background: "var(--bg-primary)" }}>
      {/* Aurora blobs */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <motion.div className="absolute -top-40 -left-32 rounded-full blur-3xl"
          style={{ width: "50vw", height: "50vw", maxWidth: "700px", maxHeight: "700px", background: "radial-gradient(circle, rgba(99,102,241,0.18), transparent 60%)" }}
          animate={{ x: [0, 40, 0], y: [0, 30, 0] }} transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }} />
        <motion.div className="absolute top-20 -right-20 rounded-full blur-3xl"
          style={{ width: "45vw", height: "45vw", maxWidth: "650px", maxHeight: "650px", background: "radial-gradient(circle, rgba(167,139,250,0.14), transparent 60%)" }}
          animate={{ x: [0, -30, 0], y: [0, 40, 0] }} transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }} />
        <motion.div className="absolute -bottom-32 left-1/3 rounded-full blur-3xl"
          style={{ width: "40vw", height: "40vw", maxWidth: "600px", maxHeight: "600px", background: "radial-gradient(circle, rgba(52,211,153,0.1), transparent 60%)" }}
          animate={{ x: [0, 30, 0], y: [0, -20, 0] }} transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }} />
      </div>

      {/* ── Navbar ── */}
      <nav style={{ position: "sticky", top: 0, zIndex: 50, padding: "16px 24px" }}>
        <div style={{
          maxWidth: 1320, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between",
          borderRadius: 16, padding: "12px 24px",
          background: "rgba(12,12,20,0.7)", border: "1px solid rgba(255,255,255,0.06)", backdropFilter: "blur(24px) saturate(140%)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ display: "inline-flex", width: 34, height: 34, alignItems: "center", justifyContent: "center", borderRadius: 10, background: "var(--gradient-primary)", boxShadow: "0 0 20px rgba(99,102,241,0.3)" }}>
              <MapPin size={16} color="white" />
            </span>
            <span style={{ fontWeight: 700, fontSize: "1.05rem", color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
              Smart<span className="gradient-text">Living</span>
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 28, fontSize: "0.85rem", color: "var(--text-muted)" }} className="hidden md:flex">
            <a href="#features" style={{ textDecoration: "none", color: "inherit", transition: "color 0.2s" }}>Features</a>
            <a href="#cities" style={{ textDecoration: "none", color: "inherit" }}>Cities</a>
            <a href="#how" style={{ textDecoration: "none", color: "inherit" }}>How It Works</a>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {isAuthenticated ? (
              <>
                <button onClick={() => navigate("/dashboard")} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: 6, fontSize: "0.85rem", fontWeight: 500 }}>
                  <LayoutDashboard size={15} /> Dashboard
                </button>
                <button onClick={() => navigate("/plan")} className="btn-primary" style={{ padding: "9px 20px", fontSize: "0.85rem" }}>
                  Start Planning
                </button>
              </>
            ) : (
              <>
                <button onClick={() => navigate("/login")} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: 6, fontSize: "0.85rem", fontWeight: 500 }}>
                  <LogIn size={15} /> Sign In
                </button>
                <button onClick={() => navigate("/register")} className="btn-primary" style={{ padding: "9px 20px", fontSize: "0.85rem" }}>
                  <UserPlus size={14} /> Get Started
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section style={{ maxWidth: 1320, margin: "0 auto", padding: "60px 32px 80px", textAlign: "center" }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 8, borderRadius: 9999, padding: "6px 14px", fontSize: "0.75rem",
            background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.15)", color: "var(--text-muted)",
          }}>
            <Sparkles size={12} style={{ color: "var(--accent-indigo)" }} />
            AI-powered urban relocation intelligence
          </span>

          <h1 style={{ marginTop: 32, fontSize: "clamp(2.8rem, 5vw, 4.5rem)", fontWeight: 700, lineHeight: 1.1, letterSpacing: "-0.03em" }}>
            <span className="gradient-text">Move Smarter.</span>
            <br />
            <span style={{ color: "rgba(255,255,255,0.95)" }}>Live Better.</span>
          </h1>

          <p style={{ maxWidth: 640, margin: "24px auto 0", fontSize: "1.05rem", lineHeight: 1.7, color: "var(--text-secondary)" }}>
            An AI-powered lifestyle planning platform for professionals relocating to new cities.
            Plan your finances, commute, routine and review intelligence — <strong style={{ color: "var(--text-primary)" }}>before you move</strong>.
          </p>

          <div style={{ marginTop: 40, display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
            <button onClick={() => navigate(isAuthenticated ? "/plan" : "/register")} className="btn-primary" style={{ padding: "14px 32px" }}>
              Start Planning <ArrowRight size={16} />
            </button>
            <button onClick={() => navigate(isAuthenticated ? "/plan" : "/login")} className="btn-secondary" style={{ padding: "14px 32px" }}>
              {isAuthenticated ? "Go to Planner" : "Sign In"}
            </button>
          </div>
        </motion.div>

        {/* Hero preview card */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.3 }}
          style={{ marginTop: 64 }}>
          <div style={{
            borderRadius: 24, padding: 28,
            background: "rgba(14,14,22,0.8)", border: "1px solid rgba(255,255,255,0.06)", backdropFilter: "blur(24px)",
            boxShadow: "0 30px 80px -20px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.04) inset",
          }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
              {[
                { icon: LineChart, label: "SUSTAINABILITY SCORE", value: "86", tag: "Whitefield · Bengaluru" },
                { icon: Wallet, label: "PREDICTED SAVINGS", value: "₹23,000/mo", tag: "After EMI & lifestyle" },
                { icon: Leaf, label: "STRESS INDEX", value: "Low · 28", tag: "Commute 18 min" },
              ].map((s, i) => (
                <div key={i} style={{ borderRadius: 16, padding: 20, background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.04)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" as const, color: "var(--text-muted)" }}>
                    <s.icon size={14} style={{ color: "var(--accent-indigo)" }} /> {s.label}
                  </div>
                  <div style={{ marginTop: 12, fontSize: "1.6rem", fontWeight: 700, color: "var(--text-primary)" }}>{s.value}</div>
                  <div style={{ marginTop: 4, fontSize: "0.75rem", color: "var(--text-muted)" }}>{s.tag}</div>
                </div>
              ))}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 8, marginTop: 20 }}>
              {Array.from({ length: 7 }).map((_, i) => (
                <motion.div key={i}
                  initial={{ scaleY: 0.3, opacity: 0.5 }}
                  animate={{ scaleY: [0.3, 1, 0.6, 0.9, 0.5][i % 5], opacity: 1 }}
                  transition={{ duration: 2, delay: i * 0.08, repeat: Infinity, repeatType: "reverse" }}
                  style={{ height: 48, borderRadius: 8, background: "var(--gradient-primary)", opacity: 0.6, transformOrigin: "bottom" }}
                />
              ))}
            </div>
            <p style={{ marginTop: 12, fontSize: "0.72rem", color: "var(--text-muted)", textAlign: "center" }}>Live preview · simulated daily energy curve</p>
          </div>
        </motion.div>
      </section>

      {/* ── Features ── */}
      <section id="features" style={{ maxWidth: 1320, margin: "0 auto", padding: "0 32px 80px" }}>
        <div style={{ textAlign: "center", maxWidth: 600, margin: "0 auto 48px" }}>
          <motion.h2 initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            style={{ fontSize: "clamp(1.8rem, 3vw, 2.4rem)", fontWeight: 700, letterSpacing: "-0.02em", color: "var(--text-primary)" }}>
            A lifestyle operating system
          </motion.h2>
          <p style={{ marginTop: 12, color: "var(--text-secondary)", fontSize: "0.95rem" }}>
            Six intelligent modules working together — so the city you choose actually fits the life you want.
          </p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          {features.map((f, i) => (
            <motion.div key={f.title} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.06, duration: 0.5 }}
              style={{
                borderRadius: 20, padding: 24,
                background: "rgba(18,18,28,0.7)", border: "1px solid rgba(255,255,255,0.06)", backdropFilter: "blur(16px)",
                transition: "border-color 0.3s",
              }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ display: "inline-flex", width: 42, height: 42, alignItems: "center", justifyContent: "center", borderRadius: 12, background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.15)" }}>
                  <f.icon size={20} style={{ color: "var(--accent-indigo)" }} />
                </span>
                <h3 style={{ fontWeight: 600, fontSize: "0.95rem", color: "var(--text-primary)" }}>{f.title}</h3>
              </div>
              <p style={{ marginTop: 12, fontSize: "0.85rem", lineHeight: 1.6, color: "var(--text-secondary)" }}>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Cities ── */}
      <section id="cities" style={{ maxWidth: 1320, margin: "0 auto", padding: "0 32px 80px" }}>
        <div style={{ textAlign: "center", maxWidth: 600, margin: "0 auto 48px" }}>
          <motion.h2 initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            style={{ fontSize: "clamp(1.8rem, 3vw, 2.4rem)", fontWeight: 700, letterSpacing: "-0.02em", color: "var(--text-primary)" }}>
            5 Cities. 28 Neighborhoods.
          </motion.h2>
          <p style={{ marginTop: 12, color: "var(--text-secondary)", fontSize: "0.95rem" }}>
            Real data. Real rent estimates. Real commute times. Not scraped listings — curated intelligence.
          </p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 16 }}>
          {cities.map((city, i) => (
            <motion.div key={city.name} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.5 }}
              style={{
                borderRadius: 20, padding: 24, textAlign: "center", cursor: "pointer",
                background: "rgba(18,18,28,0.7)", border: "1px solid rgba(255,255,255,0.06)", backdropFilter: "blur(16px)",
                transition: "border-color 0.3s, transform 0.3s",
              }}
              className="glass-card-interactive"
            >
              <div style={{ fontSize: "2.2rem", marginBottom: 8 }}>{city.emoji}</div>
              <h4 style={{ fontWeight: 600, color: "var(--text-primary)" }}>{city.name}</h4>
              <p style={{ fontSize: "0.75rem", marginTop: 4, color: "var(--text-muted)" }}>{city.areas} neighborhoods</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── How It Works ── */}
      <section id="how" style={{ maxWidth: 1320, margin: "0 auto", padding: "0 32px 80px" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <motion.h2 initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            style={{ fontSize: "clamp(1.8rem, 3vw, 2.4rem)", fontWeight: 700, letterSpacing: "-0.02em", color: "var(--text-primary)" }}>
            How it works
          </motion.h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
          {[
            { step: "01", icon: Building2, title: "Choose your city", desc: "Pick from 5 major Indian metros" },
            { step: "02", icon: Wallet, title: "Enter your profile", desc: "Salary, EMIs, goals, lifestyle" },
            { step: "03", icon: Zap, title: "AI analyzes", desc: "Groq + Gemini compute your fit" },
            { step: "04", icon: TrendingUp, title: "Get your plan", desc: "Ranked areas with daily routine" },
          ].map((item, i) => (
            <motion.div key={item.step} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.5 }}
              style={{
                borderRadius: 20, padding: 28, textAlign: "center",
                background: "rgba(18,18,28,0.7)", border: "1px solid rgba(255,255,255,0.06)", backdropFilter: "blur(16px)",
              }}>
              <div style={{ display: "inline-flex", width: 48, height: 48, alignItems: "center", justifyContent: "center", borderRadius: 16, marginBottom: 12, background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.15)" }}>
                <item.icon size={22} style={{ color: "var(--accent-indigo)" }} />
              </div>
              <div style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const, marginBottom: 8, color: "var(--accent-violet)" }}>Step {item.step}</div>
              <h4 style={{ fontWeight: 600, marginBottom: 4, color: "var(--text-primary)" }}>{item.title}</h4>
              <p style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ maxWidth: 1320, margin: "0 auto", padding: "0 32px 100px" }}>
        <div style={{
          borderRadius: 28, padding: "56px 40px", textAlign: "center",
          background: "rgba(14,14,22,0.85)", border: "1px solid rgba(255,255,255,0.06)", backdropFilter: "blur(24px)",
          boxShadow: "0 30px 80px -20px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.04) inset",
        }}>
          <h2 style={{ fontSize: "clamp(1.8rem, 3vw, 2.4rem)", fontWeight: 700, letterSpacing: "-0.02em", color: "var(--text-primary)" }}>
            <span className="gradient-text">Design your future lifestyle</span> — intelligently.
          </h2>
          <p style={{ maxWidth: 520, margin: "16px auto 0", color: "var(--text-secondary)" }}>
            Six minutes. One intelligent plan. A clearer answer to the most expensive decision you'll make this year.
          </p>
          <div style={{ marginTop: 32 }}>
            <button onClick={() => navigate(isAuthenticated ? "/plan" : "/register")} className="btn-primary" style={{ padding: "14px 32px" }}>
              Start your plan <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ padding: "32px 0", textAlign: "center", fontSize: "0.75rem", borderTop: "1px solid rgba(255,255,255,0.04)", color: "var(--text-muted)" }}>
        Smart Living Ecosystem · Plan your life before you move · Multi-City Intelligence · {new Date().getFullYear()}
      </footer>
    </div>
  );
}
