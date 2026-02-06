import { useState, useEffect } from "react";

/* ═══════════════════════════════════════════════════
   THEME TOKEN SYSTEM
   All visual properties are driven by CSS custom 
   properties, swapped by toggling the token object.
   ═══════════════════════════════════════════════════ */

const THEME_TOKENS = {
  dark: {
    "--bg-root": "#08090d",
    "--bg-surface": "rgba(255,255,255,0.015)",
    "--bg-surface-hover": "rgba(255,255,255,0.03)",
    "--bg-surface-active": "rgba(255,255,255,0.05)",
    "--bg-elevated": "rgba(255,255,255,0.025)",
    "--bg-input": "rgba(255,255,255,0.03)",
    "--border-default": "rgba(255,255,255,0.05)",
    "--border-subtle": "rgba(255,255,255,0.03)",
    "--border-strong": "rgba(255,255,255,0.08)",
    "--text-primary": "rgba(255,255,255,0.92)",
    "--text-secondary": "rgba(255,255,255,0.6)",
    "--text-tertiary": "rgba(255,255,255,0.35)",
    "--text-quaternary": "rgba(255,255,255,0.2)",
    "--text-ghost": "rgba(255,255,255,0.1)",
    "--text-inverse": "#08090d",
    "--color-success": "#34d399",
    "--color-success-subtle": "rgba(52,211,153,0.08)",
    "--color-warning": "#fbbf24",
    "--color-warning-subtle": "rgba(251,191,36,0.08)",
    "--color-danger": "#f87171",
    "--color-danger-subtle": "rgba(248,113,113,0.08)",
    "--accent-dashboard": "#a78bfa",
    "--accent-dashboard-subtle": "rgba(167,139,250,0.1)",
    "--accent-ingress": "#34d399",
    "--accent-ingress-subtle": "rgba(52,211,153,0.1)",
    "--accent-transform": "#fbbf24",
    "--accent-transform-subtle": "rgba(251,191,36,0.1)",
    "--accent-reporting": "#60a5fa",
    "--accent-reporting-subtle": "rgba(96,165,250,0.1)",
    "--accent-export": "#f472b6",
    "--accent-export-subtle": "rgba(244,114,182,0.1)",
    "--accent-users": "#94a3b8",
    "--accent-users-subtle": "rgba(148,163,184,0.1)",
    "--shadow-sm": "0 1px 3px rgba(0,0,0,0.3)",
    "--shadow-md": "0 4px 12px rgba(0,0,0,0.3)",
    "--shadow-lg": "0 12px 40px rgba(0,0,0,0.3)",
    "--nav-bg": "rgba(255,255,255,0.008)",
    "--code-bg": "rgba(0,0,0,0.2)",
    "--scrollbar-thumb": "rgba(255,255,255,0.06)",
    "--toggle-bg": "rgba(255,255,255,0.06)",
    "--toggle-knob": "#a78bfa",
  },
  light: {
    "--bg-root": "#f8f9fc",
    "--bg-surface": "#ffffff",
    "--bg-surface-hover": "#f3f4f8",
    "--bg-surface-active": "#eceef3",
    "--bg-elevated": "#ffffff",
    "--bg-input": "#f3f4f8",
    "--border-default": "rgba(0,0,0,0.08)",
    "--border-subtle": "rgba(0,0,0,0.04)",
    "--border-strong": "rgba(0,0,0,0.12)",
    "--text-primary": "#1a1c23",
    "--text-secondary": "#4a4d58",
    "--text-tertiary": "#7c7f8e",
    "--text-quaternary": "#a3a6b3",
    "--text-ghost": "#d0d2da",
    "--text-inverse": "#ffffff",
    "--color-success": "#059669",
    "--color-success-subtle": "rgba(5,150,105,0.08)",
    "--color-warning": "#d97706",
    "--color-warning-subtle": "rgba(217,119,6,0.08)",
    "--color-danger": "#dc2626",
    "--color-danger-subtle": "rgba(220,38,38,0.08)",
    "--accent-dashboard": "#7c3aed",
    "--accent-dashboard-subtle": "rgba(124,58,237,0.07)",
    "--accent-ingress": "#059669",
    "--accent-ingress-subtle": "rgba(5,150,105,0.07)",
    "--accent-transform": "#d97706",
    "--accent-transform-subtle": "rgba(217,119,6,0.07)",
    "--accent-reporting": "#2563eb",
    "--accent-reporting-subtle": "rgba(37,99,235,0.07)",
    "--accent-export": "#db2777",
    "--accent-export-subtle": "rgba(219,39,119,0.07)",
    "--accent-users": "#475569",
    "--accent-users-subtle": "rgba(71,85,105,0.07)",
    "--shadow-sm": "0 1px 3px rgba(0,0,0,0.06)",
    "--shadow-md": "0 4px 12px rgba(0,0,0,0.06)",
    "--shadow-lg": "0 12px 40px rgba(0,0,0,0.08)",
    "--nav-bg": "rgba(255,255,255,0.85)",
    "--code-bg": "#f0f1f5",
    "--scrollbar-thumb": "rgba(0,0,0,0.08)",
    "--toggle-bg": "rgba(0,0,0,0.08)",
    "--toggle-knob": "#7c3aed",
  },
};

/* ═══════════════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════════════ */

const FEATURES = [
  {
    id: "ingress", name: "Ingress", subtitle: "Data Sources",
    description: "Connect and manage external data sources. Monitor connection health, discover schemas, and configure sync schedules.",
    accentVar: "--accent-ingress", subtleVar: "--accent-ingress-subtle",
    gradients: { dark: "linear-gradient(135deg, #059669, #34d399)", light: "linear-gradient(135deg, #059669, #10b981)" },
    icon: "↓", port: 4202,
    stats: { sources: 6, active: 4, records: "10.2M", lastSync: "12s ago" },
    status: "healthy",
  },
  {
    id: "transformation", name: "Transformation", subtitle: "Pipelines",
    description: "Build data processing pipelines with configurable transform steps. Visual node editor with real-time preview.",
    accentVar: "--accent-transform", subtleVar: "--accent-transform-subtle",
    gradients: { dark: "linear-gradient(135deg, #d97706, #fbbf24)", light: "linear-gradient(135deg, #b45309, #d97706)" },
    icon: "⟐", port: 4203,
    stats: { pipelines: 6, active: 3, runs: "2,847", success: "99.2%" },
    status: "healthy",
  },
  {
    id: "reporting", name: "Reporting", subtitle: "Dashboards",
    description: "Create interactive dashboards with charts, tables, and KPI metrics. Real-time data visualization with configurable widgets.",
    accentVar: "--accent-reporting", subtleVar: "--accent-reporting-subtle",
    gradients: { dark: "linear-gradient(135deg, #2563eb, #60a5fa)", light: "linear-gradient(135deg, #1d4ed8, #2563eb)" },
    icon: "◨", port: 4204,
    stats: { dashboards: 4, widgets: 23, queries: 18, refresh: "10s" },
    status: "healthy",
  },
  {
    id: "export", name: "Export", subtitle: "Jobs & Scheduling",
    description: "Export processed data in multiple formats. Schedule recurring jobs, track progress, and manage output files.",
    accentVar: "--accent-export", subtleVar: "--accent-export-subtle",
    gradients: { dark: "linear-gradient(135deg, #be185d, #f472b6)", light: "linear-gradient(135deg, #9d174d, #db2777)" },
    icon: "↗", port: 4205,
    stats: { jobs: 8, completed: 5, size: "12.9 MB", scheduled: 4 },
    status: "degraded",
  },
  {
    id: "users", name: "Users", subtitle: "Management",
    description: "Manage user accounts, role-based access controls, and company tenancy. JWT authentication with four permission tiers.",
    accentVar: "--accent-users", subtleVar: "--accent-users-subtle",
    gradients: { dark: "linear-gradient(135deg, #475569, #94a3b8)", light: "linear-gradient(135deg, #334155, #475569)" },
    icon: "◉", port: 4201,
    stats: { users: 12, active: 10, companies: 4, admins: 5 },
    status: "healthy",
  },
];

const HEALTH_DATA = [
  { service: "features-api", port: 3000, status: "healthy", latency: 12, uptime: "100%" },
  { service: "ingress-api", port: 3100, status: "healthy", latency: 18, uptime: "99.97%" },
  { service: "transform-api", port: 3200, status: "healthy", latency: 24, uptime: "99.99%" },
  { service: "reporting-api", port: 3300, status: "healthy", latency: 15, uptime: "100%" },
  { service: "export-api", port: 3400, status: "degraded", latency: 340, uptime: "98.2%" },
  { service: "users-api", port: 3500, status: "healthy", latency: 11, uptime: "99.95%" },
];

const ACTIVITY_FEED = [
  { time: "14:32", event: "Pipeline 'Customer 360' completed — 198K records", colorVar: "--accent-transform" },
  { time: "14:31", event: "Stripe sync batch 12/18 processing", colorVar: "--accent-ingress" },
  { time: "14:28", event: "Daily Revenue Report exported (2.4 MB)", colorVar: "--accent-export" },
  { time: "14:23", event: "Snowflake connection timeout — retry queued", colorVar: "--color-danger" },
  { time: "14:15", event: "Dashboard 'Revenue Overview' auto-refreshed", colorVar: "--accent-reporting" },
  { time: "14:02", event: "Schema v3 validated for PostgreSQL source", colorVar: "--accent-ingress" },
  { time: "13:58", event: "User marcus.j@globex.io invited by Emily Zhao", colorVar: "--accent-users" },
  { time: "13:45", event: "Event Stream Processor — 12.4K records/sec", colorVar: "--accent-transform" },
];

/* ═══════════════════════════════════════════════════
   THEME TOGGLE
   ═══════════════════════════════════════════════════ */

function ThemeToggle({ theme, onToggle }) {
  return (
    <button onClick={onToggle} aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      style={{
        width: 52, height: 28, borderRadius: 14, padding: 3,
        background: "var(--toggle-bg)", border: "1px solid var(--border-default)",
        cursor: "pointer", position: "relative",
        transition: "background 0.3s, border-color 0.3s",
        display: "flex", alignItems: "center",
      }}
    >
      <div style={{
        width: 20, height: 20, borderRadius: 10,
        background: "var(--toggle-knob)",
        transform: theme === "dark" ? "translateX(0)" : "translateX(24px)",
        transition: "transform 0.3s cubic-bezier(0.34,1.56,0.64,1)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 10, color: "var(--text-inverse)",
        boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
      }}>
        {theme === "dark" ? "☽" : "☀"}
      </div>
    </button>
  );
}

/* ═══════════════════════════════════════════════════
   FEATURE CARD
   ═══════════════════════════════════════════════════ */

function FeatureCard({ feature, isHovered, onHover, onLeave, theme }) {
  const gradient = feature.gradients[theme];
  const statusColor = feature.status === "healthy" ? "var(--color-success)" : "var(--color-warning)";
  return (
    <div onMouseEnter={onHover} onMouseLeave={onLeave} className="feature-card"
      style={{
        background: "var(--bg-surface)", border: `1px solid ${isHovered ? "var(--border-strong)" : "var(--border-default)"}`,
        borderRadius: 16, padding: "22px 20px", cursor: "pointer",
        transition: "all 0.35s cubic-bezier(0.22,1,0.36,1)",
        position: "relative", overflow: "hidden",
        transform: isHovered ? "translateY(-4px)" : "none",
        boxShadow: isHovered ? "var(--shadow-lg)" : "var(--shadow-sm)",
      }}
    >
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: gradient, opacity: isHovered ? 1 : 0.4, transition: "opacity 0.35s" }} />

      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14, position: "relative" }}>
        <div style={{
          width: 42, height: 42, borderRadius: 12,
          background: `var(${feature.subtleVar})`, border: "1.5px solid var(--border-default)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 20, color: `var(${feature.accentVar})`, fontWeight: 700,
          transition: "transform 0.35s", transform: isHovered ? "scale(1.08)" : "none",
        }}>{feature.icon}</div>
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.01em" }}>{feature.name}</div>
          <div style={{ fontSize: 10, color: `var(${feature.accentVar})`, fontWeight: 600, opacity: 0.8, textTransform: "uppercase", letterSpacing: "0.05em" }}>{feature.subtitle}</div>
        </div>
        <div style={{ marginLeft: "auto" }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: statusColor }} />
        </div>
      </div>

      <p style={{ fontSize: 11, color: "var(--text-tertiary)", lineHeight: 1.55, margin: "0 0 16px", minHeight: 34 }}>{feature.description}</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6, borderTop: "1px solid var(--border-subtle)", paddingTop: 14 }}>
        {Object.entries(feature.stats).map(([key, val]) => (
          <div key={key}>
            <div style={{ fontSize: 7, color: "var(--text-ghost)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 2 }}>{key}</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-secondary)", fontFamily: "'JetBrains Mono', monospace" }}>{val}</div>
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", bottom: 8, right: 12, fontSize: 9, color: "var(--text-ghost)", fontFamily: "'JetBrains Mono', monospace" }}>:{feature.port}</div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   MAIN DASHBOARD SHELL
   ═══════════════════════════════════════════════════ */

export default function DashboardShell() {
  const [theme, setTheme] = useState("dark");
  const [hoveredFeature, setHoveredFeature] = useState(null);
  const [time, setTime] = useState(new Date());
  const [activeView, setActiveView] = useState("home");

  useEffect(() => {
    const iv = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(iv);
  }, []);

  const toggleTheme = () => setTheme(t => t === "dark" ? "light" : "dark");
  const tokens = THEME_TOKENS[theme];
  const allHealthy = HEALTH_DATA.every(h => h.status === "healthy");

  /* Build inline CSS variable string */
  const cssVarStyle = {};
  Object.entries(tokens).forEach(([k, v]) => { cssVarStyle[k] = v; });

  return (
    <div style={{ minHeight: "100vh", fontFamily: "'DM Sans', -apple-system, sans-serif", background: "var(--bg-root)", color: "var(--text-primary)", transition: "background 0.4s ease, color 0.4s ease", ...cssVarStyle }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&family=JetBrains+Mono:wght@400;500;600&family=Instrument+Serif:ital@0;1&display=swap');
        @keyframes fadeUp { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
        @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
        @keyframes gradientShift { 0% { background-position:0% 50%; } 50% { background-position:100% 50%; } 100% { background-position:0% 50%; } }
        .feature-card:active { transform: scale(0.98) !important; }
        .nav-item { transition: all 0.15s; cursor: pointer; font-family: 'DM Sans', sans-serif; border: none; }
        .nav-item:hover { opacity: 0.85; }
        .act-row { transition: background 0.12s; border-radius: 6px; }
        .act-row:hover { background: var(--bg-surface-hover); }
        .health-row:hover { background: var(--bg-surface-hover) !important; }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: var(--scrollbar-thumb); border-radius: 4px; }
      `}</style>

      {/* NAV */}
      <nav style={{
        borderBottom: "1px solid var(--border-default)", padding: "0 28px", height: 54,
        display: "flex", justifyContent: "space-between", alignItems: "center",
        background: "var(--nav-bg)", backdropFilter: "blur(20px)",
        position: "sticky", top: 0, zIndex: 50, transition: "background 0.4s, border-color 0.4s",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: "var(--accent-dashboard)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: "#fff" }}>E</div>
            <span style={{ fontSize: 15, fontWeight: 700, letterSpacing: "-0.02em" }}>
              <span style={{ color: "var(--accent-dashboard)" }}>Enterprisey</span>
              <span style={{ color: "var(--text-tertiary)", fontWeight: 400 }}> Apps</span>
            </span>
          </div>
          <div style={{ display: "flex", gap: 4 }}>
            {[{ id: "home", label: "Home", accentVar: "--accent-dashboard", subtleVar: "--accent-dashboard-subtle" }, ...FEATURES].map(item => (
              <button key={item.id} className="nav-item"
                onClick={() => setActiveView(item.id === activeView ? "home" : item.id)}
                style={{
                  padding: "6px 12px", borderRadius: 6, fontSize: 11, fontWeight: 500,
                  background: activeView === item.id ? `var(${item.subtleVar})` : "transparent",
                  color: activeView === item.id ? `var(${item.accentVar})` : "var(--text-quaternary)",
                }}
              >{item.label || item.name}</button>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: allHealthy ? "var(--color-success)" : "var(--color-warning)" }} />
            <span style={{ fontSize: 10, color: "var(--text-quaternary)", fontFamily: "'JetBrains Mono', monospace" }}>{time.toLocaleTimeString("en-US", { hour12: false })}</span>
          </div>
          <button className="nav-item" onClick={() => setActiveView(activeView === "health" ? "home" : "health")}
            style={{
              padding: "5px 10px", borderRadius: 6, fontSize: 10, fontWeight: 600,
              background: activeView === "health" ? "var(--color-success-subtle)" : "var(--bg-input)",
              border: `1px solid ${activeView === "health" ? "var(--border-strong)" : "var(--border-default)"}`,
              color: activeView === "health" ? "var(--color-success)" : "var(--text-quaternary)",
            }}
          >◉ Health</button>
          <ThemeToggle theme={theme} onToggle={toggleTheme} />
        </div>
      </nav>

      {/* CONTENT */}
      <main style={{ maxWidth: 1200, margin: "0 auto", padding: "28px 28px 60px" }}>
        {activeView === "health" ? (
          <div style={{ animation: "fadeUp 0.4s ease" }}>
            <div style={{ textAlign: "center", marginBottom: 32 }}>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 10, padding: "8px 20px", borderRadius: 24,
                background: allHealthy ? "var(--color-success-subtle)" : "var(--color-warning-subtle)",
                border: "1px solid var(--border-default)", marginBottom: 12,
              }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: allHealthy ? "var(--color-success)" : "var(--color-warning)" }} />
                <span style={{ fontSize: 12, fontWeight: 600, color: allHealthy ? "var(--color-success)" : "var(--color-warning)" }}>
                  {allHealthy ? "All Systems Operational" : "Partial Degradation Detected"}
                </span>
              </div>
              <h2 style={{ fontSize: 24, fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>Service Health Monitor</h2>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
              {HEALTH_DATA.map((h, i) => (
                <div key={h.service} className="health-row" style={{
                  background: "var(--bg-surface)", border: "1px solid var(--border-default)",
                  borderRadius: 12, padding: "16px 18px", boxShadow: "var(--shadow-sm)",
                  animation: `fadeUp 0.4s ease ${i * 0.06}s both`, transition: "background 0.4s, border-color 0.4s",
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)" }}>{h.service}</span>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <div style={{ width: 7, height: 7, borderRadius: "50%", background: h.status === "healthy" ? "var(--color-success)" : "var(--color-warning)" }} />
                      <span style={{ fontSize: 9, fontWeight: 600, color: h.status === "healthy" ? "var(--color-success)" : "var(--color-warning)", textTransform: "uppercase" }}>{h.status}</span>
                    </div>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <div>
                      <div style={{ fontSize: 8, color: "var(--text-quaternary)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Latency</div>
                      <div style={{ fontSize: 16, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", color: h.latency < 50 ? "var(--color-success)" : h.latency < 200 ? "var(--color-warning)" : "var(--color-danger)" }}>{h.latency}ms</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 8, color: "var(--text-quaternary)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Uptime</div>
                      <div style={{ fontSize: 16, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", color: "var(--text-secondary)" }}>{h.uptime}</div>
                    </div>
                  </div>
                  <div style={{ fontSize: 9, color: "var(--text-ghost)", fontFamily: "'JetBrains Mono', monospace", marginTop: 6 }}>:{h.port}</div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <>
            {/* HERO */}
            <div style={{ textAlign: "center", marginBottom: 40, animation: "fadeUp 0.5s ease" }}>
              <div style={{
                display: "inline-block", padding: "4px 14px", borderRadius: 20,
                background: "var(--accent-dashboard-subtle)", border: "1px solid var(--border-default)",
                fontSize: 10, fontWeight: 600, color: "var(--accent-dashboard)",
                textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 16,
              }}>Workshop · Enterprise Architecture Patterns</div>
              <h1 style={{ fontSize: 36, fontWeight: 300, lineHeight: 1.2, marginBottom: 10, color: "var(--text-primary)", letterSpacing: "-0.03em" }}>
                Build Better Apps.{" "}
                <span style={{
                  fontFamily: "'Instrument Serif', serif", fontStyle: "italic", fontWeight: 400,
                  color: "var(--accent-dashboard)",
                }}>Build Enterprise Apps.</span>
              </h1>
              <p style={{ fontSize: 13, color: "var(--text-tertiary)", maxWidth: 520, margin: "0 auto", lineHeight: 1.6 }}>
                Micro-frontends, Module Federation, service discovery, and NestJS microservices — all wired together in an Nx monorepo with Angular 19 and NgRx Signal Store.
              </p>
            </div>

            {/* FEATURE CARDS */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 14 }}>
              {FEATURES.slice(0, 3).map((f, i) => (
                <div key={f.id} style={{ animation: `fadeUp 0.5s ease ${0.1 + i * 0.08}s both` }}>
                  <FeatureCard feature={f} theme={theme} isHovered={hoveredFeature === f.id} onHover={() => setHoveredFeature(f.id)} onLeave={() => setHoveredFeature(null)} />
                </div>
              ))}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14, maxWidth: 796, margin: "0 auto 40px" }}>
              {FEATURES.slice(3).map((f, i) => (
                <div key={f.id} style={{ animation: `fadeUp 0.5s ease ${0.35 + i * 0.08}s both` }}>
                  <FeatureCard feature={f} theme={theme} isHovered={hoveredFeature === f.id} onHover={() => setHoveredFeature(f.id)} onLeave={() => setHoveredFeature(null)} />
                </div>
              ))}
            </div>

            {/* ARCHITECTURE + ACTIVITY */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 14, animation: "fadeUp 0.5s ease 0.5s both" }}>
              <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border-default)", borderRadius: 16, padding: "20px 22px", boxShadow: "var(--shadow-sm)", transition: "background 0.4s, border-color 0.4s" }}>
                <div style={{ fontSize: 10, fontWeight: 600, color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 16 }}>Platform Architecture</div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0, padding: "16px 0" }}>
                  {[
                    { label: "Ingress", cVar: "--accent-ingress", sub: "Ingest" }, null,
                    { label: "Transform", cVar: "--accent-transform", sub: "Process" }, null,
                    { label: "Reporting", cVar: "--accent-reporting", sub: "Visualize" }, null,
                    { label: "Export", cVar: "--accent-export", sub: "Output" },
                  ].map((item, i) =>
                    item === null ? (
                      <div key={`a${i}`} style={{ width: 40, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <svg width="30" height="12"><path d="M0 6 L24 6 M20 2 L26 6 L20 10" fill="none" stroke="var(--border-strong)" strokeWidth="1.5" /></svg>
                      </div>
                    ) : (
                      <div key={item.label} style={{ textAlign: "center" }}>
                        <div style={{ width: 56, height: 56, borderRadius: 14, margin: "0 auto 8px", background: `var(${item.cVar}-subtle)`, border: "1.5px solid var(--border-default)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: `var(${item.cVar})`, fontFamily: "'JetBrains Mono', monospace" }}>{item.label.slice(0,3).toUpperCase()}</div>
                        <div style={{ fontSize: 10, fontWeight: 600, color: "var(--text-secondary)" }}>{item.label}</div>
                        <div style={{ fontSize: 8, color: "var(--text-quaternary)" }}>{item.sub}</div>
                      </div>
                    )
                  )}
                </div>
                <div style={{ textAlign: "center", marginTop: 10, fontSize: 9, color: "var(--text-ghost)", fontFamily: "'JetBrains Mono', monospace" }}>features-api :3000 · Module Federation · Nx Monorepo</div>
              </div>

              <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border-default)", borderRadius: 16, padding: "16px 0", display: "flex", flexDirection: "column", maxHeight: 320, overflow: "hidden", boxShadow: "var(--shadow-sm)", transition: "background 0.4s, border-color 0.4s" }}>
                <div style={{ padding: "0 18px 10px", fontSize: 10, fontWeight: 600, color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Live Activity</div>
                <div style={{ flex: 1, overflow: "auto" }}>
                  {ACTIVITY_FEED.map((act, i) => (
                    <div key={i} className="act-row" style={{ padding: "8px 18px", display: "flex", gap: 10, alignItems: "flex-start", animation: `fadeUp 0.3s ease ${i*0.04}s both` }}>
                      <span style={{ width: 5, height: 5, borderRadius: "50%", background: `var(${act.colorVar})`, flexShrink: 0, marginTop: 5 }} />
                      <div style={{ flex: 1 }}><div style={{ fontSize: 11, color: "var(--text-secondary)", lineHeight: 1.4 }}>{act.event}</div></div>
                      <span style={{ fontSize: 9, color: "var(--text-ghost)", fontFamily: "'JetBrains Mono', monospace", flexShrink: 0 }}>{act.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* TECH STACK */}
            <div style={{ marginTop: 32, textAlign: "center", padding: "20px 0", borderTop: "1px solid var(--border-subtle)", animation: "fadeIn 0.5s ease 0.7s both" }}>
              <div style={{ display: "flex", gap: 20, justifyContent: "center", flexWrap: "wrap" }}>
                {["Angular 19","NestJS","Nx Monorepo","Module Federation","NgRx Signal Store","TypeORM","SQLite"].map(t => (
                  <span key={t} style={{ fontSize: 10, color: "var(--text-quaternary)", fontFamily: "'JetBrains Mono', monospace", padding: "4px 10px", borderRadius: 4, background: "var(--bg-surface)", border: "1px solid var(--border-subtle)", transition: "all 0.4s" }}>{t}</span>
                ))}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
