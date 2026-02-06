import { useState, useEffect } from "react";

/* ═══ THEME TOKENS ═══ */
const THEME_TOKENS = {
  dark: {
    "--bg-root":"#0a0c10","--bg-surface":"rgba(255,255,255,0.015)","--bg-surface-hover":"rgba(255,255,255,0.03)",
    "--bg-surface-active":"rgba(255,255,255,0.05)","--bg-input":"rgba(255,255,255,0.03)","--bg-code":"rgba(0,0,0,0.2)",
    "--border-default":"rgba(255,255,255,0.06)","--border-subtle":"rgba(255,255,255,0.03)","--border-strong":"rgba(255,255,255,0.1)",
    "--text-primary":"rgba(255,255,255,0.92)","--text-secondary":"rgba(255,255,255,0.7)","--text-tertiary":"rgba(255,255,255,0.35)",
    "--text-quaternary":"rgba(255,255,255,0.2)","--text-ghost":"rgba(255,255,255,0.1)","--text-inverse":"#0a0c10",
    "--color-success":"#34d399","--color-success-subtle":"rgba(52,211,153,0.1)",
    "--color-warning":"#fbbf24","--color-warning-subtle":"rgba(251,191,36,0.1)",
    "--color-danger":"#f87171","--color-danger-subtle":"rgba(248,113,113,0.1)",
    "--color-info":"#818cf8","--color-info-subtle":"rgba(129,140,248,0.1)",
    "--accent":"#34d399","--accent-subtle":"rgba(52,211,153,0.1)","--accent-strong":"#059669",
    "--shadow-sm":"0 1px 3px rgba(0,0,0,0.3)","--shadow-md":"0 4px 12px rgba(0,0,0,0.3)",
    "--nav-bg":"rgba(255,255,255,0.01)","--scrollbar-thumb":"rgba(255,255,255,0.08)",
    "--toggle-bg":"rgba(255,255,255,0.06)","--toggle-knob":"#34d399",
    "--bar-from":"#059669","--bar-to":"#34d399",
  },
  light: {
    "--bg-root":"#f8f9fc","--bg-surface":"#ffffff","--bg-surface-hover":"#f3f4f8",
    "--bg-surface-active":"#eceef3","--bg-input":"#f3f4f8","--bg-code":"#f0f1f5",
    "--border-default":"rgba(0,0,0,0.08)","--border-subtle":"rgba(0,0,0,0.04)","--border-strong":"rgba(0,0,0,0.12)",
    "--text-primary":"#1a1c23","--text-secondary":"#4a4d58","--text-tertiary":"#7c7f8e",
    "--text-quaternary":"#a3a6b3","--text-ghost":"#d0d2da","--text-inverse":"#ffffff",
    "--color-success":"#059669","--color-success-subtle":"rgba(5,150,105,0.08)",
    "--color-warning":"#d97706","--color-warning-subtle":"rgba(217,119,6,0.08)",
    "--color-danger":"#dc2626","--color-danger-subtle":"rgba(220,38,38,0.08)",
    "--color-info":"#6366f1","--color-info-subtle":"rgba(99,102,241,0.08)",
    "--accent":"#059669","--accent-subtle":"rgba(5,150,105,0.07)","--accent-strong":"#047857",
    "--shadow-sm":"0 1px 3px rgba(0,0,0,0.06)","--shadow-md":"0 4px 12px rgba(0,0,0,0.06)",
    "--nav-bg":"rgba(255,255,255,0.85)","--scrollbar-thumb":"rgba(0,0,0,0.08)",
    "--toggle-bg":"rgba(0,0,0,0.08)","--toggle-knob":"#059669",
    "--bar-from":"#059669","--bar-to":"#34d399",
  },
};

function ThemeToggle({ theme, onToggle }) {
  return (
    <button onClick={onToggle} style={{
      width: 48, height: 26, borderRadius: 13, padding: 3,
      background: "var(--toggle-bg)", border: "1px solid var(--border-default)",
      cursor: "pointer", display: "flex", alignItems: "center", transition: "background 0.3s",
    }}>
      <div style={{
        width: 18, height: 18, borderRadius: 9, background: "var(--toggle-knob)",
        transform: theme === "dark" ? "translateX(0)" : "translateX(22px)",
        transition: "transform 0.3s cubic-bezier(0.34,1.56,0.64,1)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 9, color: "var(--text-inverse)", boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
      }}>{theme === "dark" ? "☽" : "☀"}</div>
    </button>
  );
}

/* ═══ DATA ═══ */
const SOURCES = [
  { id:"ds-001",name:"Production PostgreSQL",type:"database",host:"db-prod-us-east.rds.amazonaws.com",status:"connected",lastSync:"2 min ago",nextSync:"58 min",frequency:"Hourly",recordsIngested:2_847_392,tablesDiscovered:47,schemaVersion:3,errorRate:0.02,avgLatency:124,uptime:99.97,
    fields:[{name:"user_id",type:"UUID",nullable:false},{name:"email",type:"VARCHAR(255)",nullable:false},{name:"created_at",type:"TIMESTAMP",nullable:false},{name:"plan_tier",type:"ENUM",nullable:true},{name:"last_login",type:"TIMESTAMP",nullable:true}]},
  { id:"ds-002",name:"Stripe Payments API",type:"rest_api",host:"api.stripe.com/v1",status:"syncing",lastSync:"Running…",nextSync:"—",frequency:"Every 15 min",recordsIngested:589_120,tablesDiscovered:12,schemaVersion:1,errorRate:0.0,avgLatency:340,uptime:100.0,
    fields:[{name:"payment_id",type:"STRING",nullable:false},{name:"amount",type:"INTEGER",nullable:false},{name:"currency",type:"STRING",nullable:false},{name:"status",type:"ENUM",nullable:false},{name:"customer_id",type:"STRING",nullable:true}]},
  { id:"ds-003",name:"Salesforce CRM Export",type:"csv_file",host:"sftp.corp.internal/salesforce/",status:"connected",lastSync:"4 hours ago",nextSync:"20 hours",frequency:"Daily",recordsIngested:124_800,tablesDiscovered:3,schemaVersion:2,errorRate:1.2,avgLatency:890,uptime:98.1,
    fields:[{name:"account_id",type:"STRING",nullable:false},{name:"company_name",type:"STRING",nullable:false},{name:"deal_stage",type:"STRING",nullable:true},{name:"arr_value",type:"DECIMAL",nullable:true},{name:"close_date",type:"DATE",nullable:true}]},
  { id:"ds-004",name:"GitHub Webhook Events",type:"webhook",host:"hooks.enterprisey.dev/github",status:"connected",lastSync:"12 sec ago",nextSync:"On event",frequency:"Real-time",recordsIngested:1_203_847,tablesDiscovered:8,schemaVersion:5,errorRate:0.08,avgLatency:23,uptime:99.99,
    fields:[{name:"event_type",type:"STRING",nullable:false},{name:"repo_name",type:"STRING",nullable:false},{name:"actor",type:"STRING",nullable:false},{name:"payload",type:"JSONB",nullable:false},{name:"received_at",type:"TIMESTAMP",nullable:false}]},
  { id:"ds-005",name:"Snowflake Data Warehouse",type:"database",host:"acme.us-east-1.snowflakecomputing.com",status:"error",lastSync:"Failed 23 min ago",nextSync:"Retry in 7 min",frequency:"Every 30 min",recordsIngested:5_420_100,tablesDiscovered:92,schemaVersion:4,errorRate:14.3,avgLatency:2100,uptime:87.2,
    fields:[{name:"event_id",type:"BIGINT",nullable:false},{name:"session_id",type:"STRING",nullable:false},{name:"event_name",type:"STRING",nullable:false},{name:"properties",type:"VARIANT",nullable:true}],
    lastError:"Connection timeout after 30s — authentication token expired"},
  { id:"ds-006",name:"HubSpot Marketing",type:"rest_api",host:"api.hubapi.com/crm/v3",status:"disconnected",lastSync:"3 days ago",nextSync:"—",frequency:"Paused",recordsIngested:45_200,tablesDiscovered:6,schemaVersion:1,errorRate:0.0,avgLatency:0,uptime:0,
    fields:[{name:"contact_id",type:"STRING",nullable:false},{name:"email",type:"STRING",nullable:false},{name:"lifecycle_stage",type:"STRING",nullable:true}],
    lastError:"Integration paused by admin (jsmith@acme.co) on Jan 28"},
];

const TYPE_CONFIG = { database:{icon:"⛁",label:"Database"}, rest_api:{icon:"⇄",label:"REST API"}, csv_file:{icon:"▤",label:"CSV File"}, webhook:{icon:"⚡",label:"Webhook"} };

const STATUS_CONFIG = {
  connected:{color:"var(--color-success)",label:"Connected",pulse:false},
  syncing:{color:"var(--color-warning)",label:"Syncing",pulse:true},
  error:{color:"var(--color-danger)",label:"Error",pulse:true},
  disconnected:{color:"var(--text-quaternary)",label:"Disconnected",pulse:false},
  testing:{color:"var(--color-info)",label:"Testing",pulse:true},
};

const ACTIVITY_LOG = [
  {time:"14:32:01",source:"GitHub Webhook Events",event:"Received 847 push events",status:"success"},
  {time:"14:31:45",source:"Stripe Payments API",event:"Sync batch 12/18 — 4,200 records",status:"running"},
  {time:"14:28:12",source:"Production PostgreSQL",event:"Sync completed — 12,403 new records",status:"success"},
  {time:"14:23:44",source:"Snowflake Data Warehouse",event:"Connection timeout — retrying in 7 min",status:"error"},
  {time:"14:15:00",source:"Salesforce CRM Export",event:"Schema drift detected — new field 'lead_score'",status:"warning"},
  {time:"14:02:33",source:"Production PostgreSQL",event:"Schema version 3 validated",status:"success"},
  {time:"13:58:10",source:"Stripe Payments API",event:"Sync started — estimated 75,000 records",status:"running"},
  {time:"13:45:22",source:"GitHub Webhook Events",event:"Received 1,203 workflow_run events",status:"success"},
];

const THROUGHPUT_DATA = [
  {time:"12:00",value:4200},{time:"12:15",value:5100},{time:"12:30",value:3800},
  {time:"12:45",value:6200},{time:"13:00",value:7800},{time:"13:15",value:8100},
  {time:"13:30",value:6900},{time:"13:45",value:9200},{time:"14:00",value:11400},
  {time:"14:15",value:8700},{time:"14:30",value:10200},
];

/* ═══ COMPONENTS ═══ */
function StatusDot({ status }) {
  const c = STATUS_CONFIG[status];
  return (
    <span style={{ position:"relative", display:"inline-flex", alignItems:"center", gap:6 }}>
      <span style={{ width:8, height:8, borderRadius:"50%", backgroundColor:c.color, display:"inline-block" }} />
      {c.pulse && <span style={{ position:"absolute", left:0, top:"50%", transform:"translateY(-50%)", width:8, height:8, borderRadius:"50%", border:`1.5px solid ${c.color}`, animation:"pulseRing 2s ease-out infinite" }} />}
      <span style={{ fontSize:11, fontWeight:600, color:c.color, letterSpacing:"0.04em", textTransform:"uppercase" }}>{c.label}</span>
    </span>
  );
}

function ThroughputChart({ data }) {
  const max = Math.max(...data.map(d => d.value));
  const h = 120;
  return (
    <div style={{ position:"relative", height:h, padding:"0 0 20px 40px" }}>
      {[0,0.25,0.5,0.75,1].map(pct => (
        <div key={pct} style={{ position:"absolute", left:40, right:0, top:(1-pct)*(h-20), borderBottom:"1px solid var(--border-subtle)" }}>
          <span style={{ position:"absolute", left:-40, top:-6, fontSize:9, color:"var(--text-quaternary)", fontFamily:"'JetBrains Mono', monospace", width:36, textAlign:"right" }}>{Math.round(max*pct/1000)}k</span>
        </div>
      ))}
      <div style={{ display:"flex", alignItems:"flex-end", height:h-20, gap:3 }}>
        {data.map((d,i) => {
          const barH = (d.value/max)*(h-20);
          return (
            <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
              <div className="bar-hover" style={{ width:"100%", maxWidth:28, height:barH, borderRadius:"3px 3px 0 0", background:"linear-gradient(to top, var(--bar-from), var(--bar-to))", opacity:0.85, transition:"height 0.6s cubic-bezier(0.22,1,0.36,1)", position:"relative" }} />
              <span style={{ fontSize:8, color:"var(--text-ghost)", fontFamily:"'JetBrains Mono', monospace", position:"absolute", bottom:0 }}>{d.time.split(":")[1]==="00"?d.time:""}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SourceCard({ source, isSelected, onClick }) {
  const config = TYPE_CONFIG[source.type];
  return (
    <div onClick={onClick} className="source-card" style={{
      background: isSelected ? "var(--accent-subtle)" : "var(--bg-surface)",
      border: `1px solid ${isSelected ? "var(--accent)" : "var(--border-default)"}`,
      borderRadius:12, padding:"16px 18px", cursor:"pointer",
      transition:"all 0.25s cubic-bezier(0.22,1,0.36,1)", position:"relative", overflow:"hidden",
      boxShadow: isSelected ? "var(--shadow-md)" : "var(--shadow-sm)",
    }}>
      {isSelected && <div style={{ position:"absolute", top:0, left:0, width:3, height:"100%", background:"linear-gradient(to bottom, var(--accent), var(--accent-strong))", borderRadius:"3px 0 0 3px" }} />}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:34, height:34, borderRadius:8, background:"var(--bg-surface-hover)", border:"1px solid var(--border-default)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}>{config.icon}</div>
          <div>
            <div style={{ fontSize:13, fontWeight:600, color:"var(--text-primary)", lineHeight:1.2 }}>{source.name}</div>
            <div style={{ fontSize:10, color:"var(--text-quaternary)", fontFamily:"'JetBrains Mono', monospace", marginTop:2 }}>{config.label} · {source.host.length>32?source.host.slice(0,32)+"…":source.host}</div>
          </div>
        </div>
        <StatusDot status={source.status} />
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8 }}>
        {[{l:"Records",v:source.recordsIngested>=1e6?(source.recordsIngested/1e6).toFixed(1)+"M":source.recordsIngested>=1e3?(source.recordsIngested/1e3).toFixed(0)+"K":source.recordsIngested},{l:"Tables",v:source.tablesDiscovered},{l:"Latency",v:source.avgLatency+"ms"}].map(m=>(
          <div key={m.l}>
            <div style={{ fontSize:9, color:"var(--text-quaternary)", textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:2 }}>{m.l}</div>
            <div style={{ fontSize:14, fontWeight:600, color:"var(--text-secondary)", fontFamily:"'JetBrains Mono', monospace" }}>{m.v}</div>
          </div>
        ))}
      </div>
      <div style={{ marginTop:12, paddingTop:10, borderTop:"1px solid var(--border-subtle)", display:"flex", justifyContent:"space-between", fontSize:10, color:"var(--text-quaternary)" }}>
        <span>Last: {source.lastSync}</span><span>Next: {source.nextSync}</span>
      </div>
    </div>
  );
}

function DetailPanel({ source }) {
  if (!source) return <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:"100%", color:"var(--text-quaternary)", fontSize:13 }}>Select a data source to view details</div>;
  return (
    <div style={{ animation:"fadeIn 0.3s ease" }}>
      <div style={{ marginBottom:24 }}>
        <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:8 }}>
          <div style={{ width:42, height:42, borderRadius:10, background:"var(--accent-subtle)", border:"1px solid var(--border-default)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>{TYPE_CONFIG[source.type].icon}</div>
          <div>
            <h2 style={{ fontSize:18, fontWeight:700, color:"var(--text-primary)", margin:0, lineHeight:1.2 }}>{source.name}</h2>
            <div style={{ fontSize:11, color:"var(--text-quaternary)", fontFamily:"'JetBrains Mono', monospace", marginTop:3 }}>{source.host}</div>
          </div>
        </div>
        <div style={{ display:"flex", gap:8, marginTop:14 }}>
          {source.status !== "syncing" && <button className="action-btn" style={{ background:"var(--accent-subtle)", color:"var(--accent)", border:"1px solid var(--border-default)" }}>▶ Sync Now</button>}
          <button className="action-btn" style={{ background:"var(--bg-surface-hover)", color:"var(--text-tertiary)", border:"1px solid var(--border-default)" }}>⚙ Configure</button>
          <button className="action-btn" style={{ background:"var(--bg-surface-hover)", color:"var(--text-tertiary)", border:"1px solid var(--border-default)" }}>↻ Test Connection</button>
        </div>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr", gap:10, marginBottom:24 }}>
        {[{l:"Uptime",v:source.uptime+"%",c:source.uptime>99?"var(--color-success)":source.uptime>95?"var(--color-warning)":"var(--color-danger)"},{l:"Error Rate",v:source.errorRate+"%",c:source.errorRate<1?"var(--color-success)":source.errorRate<5?"var(--color-warning)":"var(--color-danger)"},{l:"Schema v.",v:"v"+source.schemaVersion,c:"var(--color-info)"},{l:"Frequency",v:source.frequency,c:"var(--text-secondary)"}].map(m=>(
          <div key={m.l} style={{ background:"var(--bg-surface)", border:"1px solid var(--border-default)", borderRadius:8, padding:"10px 12px" }}>
            <div style={{ fontSize:9, color:"var(--text-quaternary)", textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:4 }}>{m.l}</div>
            <div style={{ fontSize:16, fontWeight:700, color:m.c, fontFamily:"'JetBrains Mono', monospace" }}>{m.v}</div>
          </div>
        ))}
      </div>
      {source.lastError && (
        <div style={{ background:"var(--color-danger-subtle)", border:"1px solid var(--border-default)", borderRadius:8, padding:"10px 14px", marginBottom:20, display:"flex", gap:10, alignItems:"flex-start" }}>
          <span style={{ color:"var(--color-danger)", fontSize:14, lineHeight:1 }}>⚠</span>
          <div>
            <div style={{ fontSize:11, fontWeight:600, color:"var(--color-danger)", marginBottom:2 }}>Latest Error</div>
            <div style={{ fontSize:11, color:"var(--text-tertiary)", fontFamily:"'JetBrains Mono', monospace", lineHeight:1.5 }}>{source.lastError}</div>
          </div>
        </div>
      )}
      <div style={{ marginBottom:20 }}>
        <div style={{ fontSize:11, fontWeight:600, color:"var(--text-tertiary)", textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:10 }}>Discovered Schema</div>
        <div style={{ background:"var(--bg-code)", border:"1px solid var(--border-default)", borderRadius:8, overflow:"hidden" }}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 100px 60px", padding:"8px 14px", fontSize:9, color:"var(--text-quaternary)", textTransform:"uppercase", letterSpacing:"0.06em", borderBottom:"1px solid var(--border-subtle)" }}>
            <span>Field</span><span>Type</span><span>Nullable</span>
          </div>
          {source.fields.map((f,i)=>(
            <div key={f.name} style={{ display:"grid", gridTemplateColumns:"1fr 100px 60px", padding:"7px 14px", fontSize:11, borderBottom:i<source.fields.length-1?"1px solid var(--border-subtle)":"none", fontFamily:"'JetBrains Mono', monospace" }}>
              <span style={{ color:"var(--text-secondary)" }}>{f.name}</span>
              <span style={{ color:"var(--color-info)" }}>{f.type}</span>
              <span style={{ color:f.nullable?"var(--color-warning)":"var(--text-quaternary)" }}>{f.nullable?"yes":"no"}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══ MAIN ═══ */
export default function IngressFeature() {
  const [selectedId, setSelectedId] = useState("ds-001");
  const [filterType, setFilterType] = useState("all");
  const [theme, setTheme] = useState("dark");
  const [time, setTime] = useState(new Date());

  useEffect(() => { const iv = setInterval(() => setTime(new Date()), 1000); return () => clearInterval(iv); }, []);

  const tokens = THEME_TOKENS[theme];
  const cssVars = {};
  Object.entries(tokens).forEach(([k,v]) => { cssVars[k] = v; });

  const selected = SOURCES.find(s => s.id === selectedId);
  const filtered = SOURCES.filter(s => filterType === "all" || s.type === filterType);
  const totalRecords = SOURCES.reduce((a,s) => a + s.recordsIngested, 0);
  const activeCount = SOURCES.filter(s => s.status==="connected"||s.status==="syncing").length;
  const errorCount = SOURCES.filter(s => s.status==="error").length;

  return (
    <div style={{ minHeight:"100vh", background:"var(--bg-root)", color:"var(--text-primary)", fontFamily:"'DM Sans', -apple-system, sans-serif", transition:"background 0.4s, color 0.4s", ...cssVars }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&family=JetBrains+Mono:wght@400;500;600&display=swap');
        @keyframes pulseRing { 0%{transform:translateY(-50%) scale(1);opacity:1} 100%{transform:translateY(-50%) scale(3);opacity:0} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        .source-card:hover { border-color:var(--border-strong) !important; transform:translateY(-1px); box-shadow:var(--shadow-md) !important; }
        .action-btn { padding:6px 12px; border-radius:6px; font-size:11px; font-weight:500; cursor:pointer; transition:all 0.2s; font-family:'DM Sans',sans-serif; }
        .action-btn:hover { filter:brightness(1.1); transform:translateY(-1px); }
        .filter-chip { padding:4px 10px; border-radius:20px; font-size:10px; font-weight:600; cursor:pointer; transition:all 0.2s; font-family:'DM Sans',sans-serif; }
        .bar-hover:hover { opacity:1 !important; filter:brightness(1.1); }
        .activity-row { transition:background 0.15s; }
        .activity-row:hover { background:var(--bg-surface-hover); }
        * { box-sizing:border-box; }
        ::-webkit-scrollbar { width:4px; }
        ::-webkit-scrollbar-track { background:transparent; }
        ::-webkit-scrollbar-thumb { background:var(--scrollbar-thumb); border-radius:4px; }
      `}</style>

      {/* Top Bar */}
      <div style={{ borderBottom:"1px solid var(--border-default)", padding:"14px 28px", display:"flex", justifyContent:"space-between", alignItems:"center", background:"var(--nav-bg)", backdropFilter:"blur(20px)", transition:"background 0.4s, border-color 0.4s" }}>
        <div style={{ display:"flex", alignItems:"center", gap:14 }}>
          <div style={{ width:8, height:8, borderRadius:"50%", background:"var(--accent)" }} />
          <h1 style={{ fontSize:16, fontWeight:700, margin:0, letterSpacing:"-0.02em" }}>
            <span style={{ color:"var(--accent)" }}>Ingress</span>
            <span style={{ color:"var(--text-tertiary)", fontWeight:400, marginLeft:8 }}>Data Sources</span>
          </h1>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:16 }}>
          <span style={{ fontSize:11, color:"var(--text-quaternary)", fontFamily:"'JetBrains Mono', monospace" }}>{time.toLocaleTimeString("en-US",{hour12:false})}</span>
          <button className="action-btn" style={{ background:"linear-gradient(135deg, var(--accent-strong), var(--accent))", color:"var(--text-inverse)", border:"none", fontWeight:700, padding:"7px 16px" }}>+ New Source</button>
          <ThemeToggle theme={theme} onToggle={() => setTheme(t => t==="dark"?"light":"dark")} />
        </div>
      </div>

      <div style={{ display:"flex", height:"calc(100vh - 53px)" }}>
        {/* Left Panel */}
        <div style={{ width:380, borderRight:"1px solid var(--border-default)", display:"flex", flexDirection:"column", flexShrink:0 }}>
          <div style={{ padding:"14px 18px", borderBottom:"1px solid var(--border-subtle)", display:"flex", gap:16 }}>
            {[{l:"Total Records",v:(totalRecords/1e6).toFixed(1)+"M",c:"var(--accent)"},{l:"Active",v:activeCount,c:"var(--color-success)"},{l:"Errors",v:errorCount,c:errorCount>0?"var(--color-danger)":"var(--text-quaternary)"},{l:"Sources",v:SOURCES.length,c:"var(--text-secondary)"}].map(s=>(
              <div key={s.l}>
                <div style={{ fontSize:8, color:"var(--text-quaternary)", textTransform:"uppercase", letterSpacing:"0.08em" }}>{s.l}</div>
                <div style={{ fontSize:16, fontWeight:700, color:s.c, fontFamily:"'JetBrains Mono', monospace" }}>{s.v}</div>
              </div>
            ))}
          </div>
          <div style={{ padding:"10px 18px", borderBottom:"1px solid var(--border-subtle)", display:"flex", gap:5, flexWrap:"wrap" }}>
            {[{key:"all",label:"All"},{key:"database",label:"⛁ DB"},{key:"rest_api",label:"⇄ API"},{key:"csv_file",label:"▤ CSV"},{key:"webhook",label:"⚡ Hook"}].map(f=>(
              <button key={f.key} className="filter-chip" onClick={()=>setFilterType(f.key)} style={{
                background:filterType===f.key?"var(--accent-subtle)":"var(--bg-surface-hover)",
                color:filterType===f.key?"var(--accent)":"var(--text-tertiary)",
                border:`1px solid ${filterType===f.key?"var(--border-strong)":"transparent"}`,
              }}>{f.label}</button>
            ))}
          </div>
          <div style={{ flex:1, overflow:"auto", padding:"12px 14px", display:"flex", flexDirection:"column", gap:8 }}>
            {filtered.map((source,i) => (
              <div key={source.id} style={{ animation:`slideUp 0.4s ease ${i*0.05}s both` }}>
                <SourceCard source={source} isSelected={selectedId===source.id} onClick={()=>setSelectedId(source.id)} />
              </div>
            ))}
          </div>
        </div>

        {/* Center */}
        <div style={{ flex:1, overflow:"auto", padding:"20px 28px" }}>
          <DetailPanel source={selected} />
        </div>

        {/* Right Panel */}
        <div style={{ width:320, borderLeft:"1px solid var(--border-default)", display:"flex", flexDirection:"column", flexShrink:0 }}>
          <div style={{ padding:"16px 18px", borderBottom:"1px solid var(--border-subtle)" }}>
            <div style={{ fontSize:10, fontWeight:600, color:"var(--text-tertiary)", textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:14, display:"flex", justifyContent:"space-between" }}>
              <span>Throughput</span>
              <span style={{ color:"var(--accent)", fontFamily:"'JetBrains Mono', monospace" }}>{(THROUGHPUT_DATA[THROUGHPUT_DATA.length-1].value/1000).toFixed(1)}k rec/min</span>
            </div>
            <ThroughputChart data={THROUGHPUT_DATA} />
          </div>
          <div style={{ flex:1, overflow:"auto" }}>
            <div style={{ padding:"14px 18px 8px", fontSize:10, fontWeight:600, color:"var(--text-tertiary)", textTransform:"uppercase", letterSpacing:"0.06em", position:"sticky", top:0, background:"var(--bg-root)", zIndex:1, transition:"background 0.4s" }}>Activity Log</div>
            {ACTIVITY_LOG.map((log,i) => {
              const sc = log.status==="success"?"var(--color-success)":log.status==="error"?"var(--color-danger)":log.status==="warning"?"var(--color-warning)":"var(--color-info)";
              return (
                <div key={i} className="activity-row" style={{ padding:"9px 18px", borderBottom:"1px solid var(--border-subtle)", animation:`fadeIn 0.3s ease ${i*0.04}s both` }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:2 }}>
                    <span style={{ width:5, height:5, borderRadius:"50%", background:sc, flexShrink:0 }} />
                    <span style={{ fontSize:10, color:"var(--text-quaternary)", fontFamily:"'JetBrains Mono', monospace" }}>{log.time}</span>
                    <span style={{ fontSize:10, color:"var(--text-tertiary)", fontWeight:500, marginLeft:"auto" }}>{log.source.split(" ")[0]}</span>
                  </div>
                  <div style={{ fontSize:11, color:"var(--text-secondary)", paddingLeft:13, lineHeight:1.4 }}>{log.event}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
