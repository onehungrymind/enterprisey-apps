import { useState, useEffect, useRef } from "react";

const THEME_TOKENS = {
  dark: {
    "--bg-root":"#0b0d12","--bg-surface":"rgba(255,255,255,0.015)","--bg-surface-hover":"rgba(255,255,255,0.03)",
    "--bg-input":"rgba(255,255,255,0.03)","--bg-code":"rgba(0,0,0,0.3)","--bg-canvas":"#0b0d12",
    "--border-default":"rgba(255,255,255,0.06)","--border-subtle":"rgba(255,255,255,0.03)","--border-strong":"rgba(255,255,255,0.1)",
    "--text-primary":"rgba(255,255,255,0.92)","--text-secondary":"rgba(255,255,255,0.7)","--text-tertiary":"rgba(255,255,255,0.35)",
    "--text-quaternary":"rgba(255,255,255,0.2)","--text-ghost":"rgba(255,255,255,0.1)","--text-inverse":"#0b0d12",
    "--color-success":"#34d399","--color-success-subtle":"rgba(52,211,153,0.1)",
    "--color-warning":"#fbbf24","--color-warning-subtle":"rgba(251,191,36,0.1)",
    "--color-danger":"#f87171","--color-danger-subtle":"rgba(248,113,113,0.1)",
    "--color-info":"#818cf8","--color-info-subtle":"rgba(129,140,248,0.1)",
    "--accent":"#fbbf24","--accent-subtle":"rgba(251,191,36,0.1)","--accent-strong":"#d97706",
    "--shadow-sm":"0 1px 3px rgba(0,0,0,0.3)","--shadow-md":"0 4px 12px rgba(0,0,0,0.3)",
    "--nav-bg":"rgba(255,255,255,0.01)","--scrollbar-thumb":"rgba(255,255,255,0.06)",
    "--toggle-bg":"rgba(255,255,255,0.06)","--toggle-knob":"#fbbf24",
    "--node-bg":"rgba(15,17,23,0.9)","--grid-line":"rgba(255,255,255,0.015)","--edge-color":"rgba(251,191,36,0.3)","--particle-color":"#fbbf24",
    "--node-filter":"#60a5fa","--node-map":"#60a5fa","--node-agg":"#c084fc","--node-join":"#f472b6","--node-sort":"#818cf8","--node-dedup":"#fb923c","--node-source":"#34d399","--node-output":"#34d399",
  },
  light: {
    "--bg-root":"#f8f9fc","--bg-surface":"#ffffff","--bg-surface-hover":"#f3f4f8",
    "--bg-input":"#f3f4f8","--bg-code":"#f0f1f5","--bg-canvas":"#f3f4f8",
    "--border-default":"rgba(0,0,0,0.08)","--border-subtle":"rgba(0,0,0,0.04)","--border-strong":"rgba(0,0,0,0.12)",
    "--text-primary":"#1a1c23","--text-secondary":"#4a4d58","--text-tertiary":"#7c7f8e",
    "--text-quaternary":"#a3a6b3","--text-ghost":"#d0d2da","--text-inverse":"#ffffff",
    "--color-success":"#059669","--color-success-subtle":"rgba(5,150,105,0.08)",
    "--color-warning":"#d97706","--color-warning-subtle":"rgba(217,119,6,0.08)",
    "--color-danger":"#dc2626","--color-danger-subtle":"rgba(220,38,38,0.08)",
    "--color-info":"#6366f1","--color-info-subtle":"rgba(99,102,241,0.08)",
    "--accent":"#d97706","--accent-subtle":"rgba(217,119,6,0.07)","--accent-strong":"#b45309",
    "--shadow-sm":"0 1px 3px rgba(0,0,0,0.06)","--shadow-md":"0 4px 12px rgba(0,0,0,0.08)",
    "--nav-bg":"rgba(255,255,255,0.85)","--scrollbar-thumb":"rgba(0,0,0,0.08)",
    "--toggle-bg":"rgba(0,0,0,0.08)","--toggle-knob":"#d97706",
    "--node-bg":"rgba(255,255,255,0.95)","--grid-line":"rgba(0,0,0,0.04)","--edge-color":"rgba(217,119,6,0.3)","--particle-color":"#d97706",
    "--node-filter":"#2563eb","--node-map":"#2563eb","--node-agg":"#7c3aed","--node-join":"#db2777","--node-sort":"#6366f1","--node-dedup":"#ea580c","--node-source":"#059669","--node-output":"#059669",
  },
};

function ThemeToggle({theme,onToggle}){return(<button onClick={onToggle} style={{width:48,height:26,borderRadius:13,padding:3,background:"var(--toggle-bg)",border:"1px solid var(--border-default)",cursor:"pointer",display:"flex",alignItems:"center",transition:"background 0.3s"}}><div style={{width:18,height:18,borderRadius:9,background:"var(--toggle-knob)",transform:theme==="dark"?"translateX(0)":"translateX(22px)",transition:"transform 0.3s cubic-bezier(0.34,1.56,0.64,1)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,color:"var(--text-inverse)",boxShadow:"0 1px 3px rgba(0,0,0,0.2)"}}>{theme==="dark"?"☽":"☀"}</div></button>);}

const PIPELINES = [
  {id:"pl-001",name:"Customer 360 Enrichment",source:"Production PostgreSQL",status:"active",lastRun:"2 min ago",runsToday:48,successRate:99.8,recordsProcessed:284000},
  {id:"pl-002",name:"Payment Reconciliation",source:"Stripe Payments API",status:"active",lastRun:"14 min ago",runsToday:96,successRate:100,recordsProcessed:1240000},
  {id:"pl-003",name:"Lead Scoring Pipeline",source:"Salesforce CRM Export",status:"draft",lastRun:"Never",runsToday:0,successRate:0,recordsProcessed:0},
  {id:"pl-004",name:"Event Stream Processor",source:"GitHub Webhook Events",status:"active",lastRun:"12 sec ago",runsToday:2847,successRate:99.92,recordsProcessed:3450000},
  {id:"pl-005",name:"Warehouse Sync",source:"Snowflake Data Warehouse",status:"error",lastRun:"Failed 23 min ago",runsToday:12,successRate:75.0,recordsProcessed:890000},
  {id:"pl-006",name:"Marketing Attribution",source:"HubSpot Marketing",status:"paused",lastRun:"3 days ago",runsToday:0,successRate:97.2,recordsProcessed:45200},
];

const STEP_TYPES = {source:{icon:"◉",label:"Source",cVar:"--node-source"},filter:{icon:"⊘",label:"Filter",cVar:"--node-filter"},map:{icon:"⇢",label:"Map",cVar:"--node-map"},aggregate:{icon:"Σ",label:"Aggregate",cVar:"--node-agg"},join:{icon:"⋈",label:"Join",cVar:"--node-join"},sort:{icon:"↕",label:"Sort",cVar:"--node-sort"},deduplicate:{icon:"⊜",label:"Dedupe",cVar:"--node-dedup"},output:{icon:"◎",label:"Output",cVar:"--node-output"}};

const PIPELINE_STEPS = {
  "pl-001":[{id:"s1",type:"source",name:"PostgreSQL Users",config:"SELECT * FROM users WHERE active = true",records:284000,x:60,y:160},{id:"s2",type:"filter",name:"Active Last 90d",config:"last_login >= NOW() - INTERVAL '90 days'",records:198400,x:280,y:100},{id:"s3",type:"map",name:"Enrich Fields",config:"full_name = first_name + ' ' + last_name\ntier_label = CASE plan_tier ...",records:198400,x:500,y:100},{id:"s4",type:"aggregate",name:"Segment Counts",config:"GROUP BY plan_tier\nCOUNT(*), AVG(lifetime_value)",records:4,x:500,y:260},{id:"s5",type:"deduplicate",name:"Dedup by Email",config:"DISTINCT ON (email)\nORDER BY updated_at DESC",records:195200,x:720,y:100},{id:"s6",type:"sort",name:"By LTV Desc",config:"ORDER BY lifetime_value DESC",records:195200,x:940,y:100},{id:"s7",type:"output",name:"Enriched Customers",config:"→ reporting.customer_360\n→ export.customer_segments",records:195200,x:1160,y:160}],
  "pl-002":[{id:"s1",type:"source",name:"Stripe Events",config:"payment_intent.* events",records:1240000,x:60,y:160},{id:"s2",type:"filter",name:"Succeeded Only",config:"status = 'succeeded'",records:1178000,x:280,y:120},{id:"s3",type:"map",name:"Normalize Currency",config:"amount_usd = convert(amount, currency, 'USD')",records:1178000,x:500,y:120},{id:"s4",type:"aggregate",name:"Daily Totals",config:"GROUP BY DATE(created)\nSUM(amount_usd)",records:365,x:720,y:120},{id:"s5",type:"output",name:"Revenue Table",config:"→ reporting.daily_revenue",records:365,x:940,y:160}],
  "pl-004":[{id:"s1",type:"source",name:"GitHub Events",config:"All webhook event types",records:3450000,x:60,y:160},{id:"s2",type:"filter",name:"Push + PR Only",config:"event_type IN ('push','pull_request')",records:2070000,x:280,y:80},{id:"s3",type:"filter",name:"Main Branch",config:"ref = 'refs/heads/main'",records:890000,x:500,y:80},{id:"s4",type:"map",name:"Extract Metadata",config:"author = payload.head_commit.author\nfiles_changed = ...",records:890000,x:720,y:80},{id:"s5",type:"aggregate",name:"Dev Activity",config:"GROUP BY author, DATE(received_at)\nCOUNT(*)",records:12400,x:720,y:240},{id:"s6",type:"deduplicate",name:"Unique Commits",config:"DISTINCT ON (payload.head_commit.id)",records:845000,x:940,y:80},{id:"s7",type:"output",name:"Commit Stream",config:"→ reporting.dev_dashboard\n→ export.commits",records:845000,x:1160,y:160}],
};
const EDGES={"pl-001":[["s1","s2"],["s1","s4"],["s2","s3"],["s3","s5"],["s5","s6"],["s6","s7"],["s4","s7"]],"pl-002":[["s1","s2"],["s2","s3"],["s3","s4"],["s4","s5"]],"pl-004":[["s1","s2"],["s2","s3"],["s3","s4"],["s4","s6"],["s3","s5"],["s6","s7"],["s5","s7"]]};
const STATUS_MAP={active:{color:"var(--accent)",label:"Active"},draft:{color:"var(--text-quaternary)",label:"Draft"},paused:{color:"var(--color-info)",label:"Paused"},error:{color:"var(--color-danger)",label:"Error"}};

const RUN_HISTORY=[{id:"r1",pipeline:"Customer 360 Enrichment",status:"completed",duration:"4.2s",records:198400,timestamp:"14:32:01",startedBy:"Scheduler"},{id:"r2",pipeline:"Event Stream Processor",status:"completed",duration:"0.8s",records:12403,timestamp:"14:31:48",startedBy:"Webhook"},{id:"r3",pipeline:"Payment Reconciliation",status:"completed",duration:"12.1s",records:4200,timestamp:"14:28:00",startedBy:"Scheduler"},{id:"r4",pipeline:"Warehouse Sync",status:"failed",duration:"30.0s",records:0,timestamp:"14:23:44",startedBy:"Scheduler",error:"Connection timeout"},{id:"r5",pipeline:"Event Stream Processor",status:"completed",duration:"0.6s",records:8921,timestamp:"14:21:12",startedBy:"Webhook"},{id:"r6",pipeline:"Customer 360 Enrichment",status:"completed",duration:"3.9s",records:197800,timestamp:"14:02:01",startedBy:"Scheduler"}];

function PipelineCanvas({steps,edges,selectedStep,onSelectStep}){
  const[offset,setOffset]=useState({x:0,y:0});const[dragging,setDragging]=useState(false);const[dragStart,setDragStart]=useState({x:0,y:0});
  const nodeW=180,nodeH=72;const stepsById={};steps.forEach(s=>stepsById[s.id]=s);
  const handleMouseDown=e=>{if(e.target.closest('.node-card'))return;setDragging(true);setDragStart({x:e.clientX-offset.x,y:e.clientY-offset.y})};
  const handleMouseMove=e=>{if(!dragging)return;setOffset({x:e.clientX-dragStart.x,y:e.clientY-dragStart.y})};
  const handleMouseUp=()=>setDragging(false);
  return(
    <div onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}
      style={{flex:1,position:"relative",overflow:"hidden",cursor:dragging?"grabbing":"grab",
        background:`radial-gradient(circle at 50% 50%, var(--accent-subtle) 0%, transparent 70%), linear-gradient(var(--grid-line) 1px, transparent 1px), linear-gradient(90deg, var(--grid-line) 1px, transparent 1px)`,
        backgroundSize:"100% 100%, 24px 24px, 24px 24px",
        backgroundPosition:`0 0, ${offset.x%24}px ${offset.y%24}px, ${offset.x%24}px ${offset.y%24}px`,transition:"background 0.4s"}}>
      <svg style={{position:"absolute",top:0,left:0,width:"100%",height:"100%",pointerEvents:"none"}}>
        <defs><marker id="ah" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><polygon points="0 0, 8 3, 0 6" fill="var(--edge-color)"/></marker></defs>
        {edges.map(([fId,tId],i)=>{const f=stepsById[fId],t=stepsById[tId];if(!f||!t)return null;const x1=f.x+nodeW+offset.x,y1=f.y+nodeH/2+offset.y,x2=t.x+offset.x,y2=t.y+nodeH/2+offset.y;const dx=x2-x1;const path=`M ${x1} ${y1} C ${x1+dx*0.4} ${y1}, ${x2-dx*0.4} ${y2}, ${x2} ${y2}`;
          return(<g key={i}><path d={path} fill="none" stroke="var(--edge-color)" strokeWidth="2" markerEnd="url(#ah)"/><circle r="3" fill="var(--particle-color)" opacity="0.6"><animateMotion dur={`${2+i*0.3}s`} repeatCount="indefinite" path={path}/></circle></g>)})}
      </svg>
      {steps.map(step=>{const tc=STEP_TYPES[step.type];const isSel=selectedStep===step.id;return(
        <div key={step.id} className="node-card" onClick={e=>{e.stopPropagation();onSelectStep(step.id)}}
          style={{position:"absolute",left:step.x+offset.x,top:step.y+offset.y,width:nodeW,background:"var(--node-bg)",border:`1.5px solid ${isSel?"var(--accent)":"var(--border-default)"}`,borderRadius:12,padding:"10px 12px",cursor:"pointer",transition:"border-color 0.2s, background 0.2s, box-shadow 0.2s",backdropFilter:"blur(12px)",boxShadow:isSel?"var(--shadow-md)":"var(--shadow-sm)",zIndex:isSel?10:1}}>
          {step.type!=="source"&&<div style={{position:"absolute",left:-5,top:"50%",transform:"translateY(-50%)",width:10,height:10,borderRadius:"50%",background:"var(--bg-root)",border:"2px solid var(--border-default)",zIndex:2}}/>}
          {step.type!=="output"&&<div style={{position:"absolute",right:-5,top:"50%",transform:"translateY(-50%)",width:10,height:10,borderRadius:"50%",background:"var(--bg-root)",border:"2px solid var(--border-default)",zIndex:2}}/>}
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
            <div style={{width:26,height:26,borderRadius:6,background:"var(--bg-surface-hover)",border:"1px solid var(--border-default)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,color:`var(${tc.cVar})`,fontWeight:700}}>{tc.icon}</div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:11,fontWeight:600,color:"var(--text-primary)",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{step.name}</div>
              <div style={{fontSize:9,color:`var(${tc.cVar})`,fontWeight:500,opacity:0.8,textTransform:"uppercase",letterSpacing:"0.04em"}}>{tc.label}</div>
            </div>
          </div>
          <div style={{fontSize:10,color:"var(--text-quaternary)",fontFamily:"'JetBrains Mono', monospace",display:"flex",justifyContent:"space-between"}}><span>{step.records>=1e6?(step.records/1e6).toFixed(1)+"M":step.records>=1e3?(step.records/1e3).toFixed(0)+"K":step.records} rec</span><span style={{color:"var(--text-ghost)"}}>→</span></div>
        </div>)})}
      <div style={{position:"absolute",bottom:16,right:16,display:"flex",gap:4}}>
        {["⊖","⊕","⌖"].map((icon,i)=>(<button key={i} onClick={()=>i===2&&setOffset({x:0,y:0})} style={{width:32,height:32,borderRadius:8,background:"var(--bg-surface)",border:"1px solid var(--border-default)",color:"var(--text-tertiary)",cursor:"pointer",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center"}}>{icon}</button>))}
      </div>
    </div>
  );
}

function StepDetail({step}){
  if(!step)return <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100%",color:"var(--text-ghost)",fontSize:12,textAlign:"center",padding:20}}>Click a node to<br/>inspect configuration</div>;
  const tc=STEP_TYPES[step.type];
  return(<div style={{animation:"fadeSlide 0.25s ease"}}>
    <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
      <div style={{width:36,height:36,borderRadius:8,background:"var(--bg-surface-hover)",border:"1px solid var(--border-default)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:17,color:`var(${tc.cVar})`}}>{tc.icon}</div>
      <div><div style={{fontSize:14,fontWeight:700,color:"var(--text-primary)"}}>{step.name}</div><div style={{fontSize:10,color:`var(${tc.cVar})`,textTransform:"uppercase",letterSpacing:"0.05em",fontWeight:600,opacity:0.8}}>{tc.label} Step</div></div>
    </div>
    <div style={{fontSize:9,color:"var(--text-quaternary)",textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:6,fontWeight:600}}>Configuration</div>
    <div style={{background:"var(--bg-code)",borderRadius:8,border:"1px solid var(--border-default)",padding:"10px 12px",marginBottom:16,fontFamily:"'JetBrains Mono', monospace",fontSize:10.5,color:"var(--text-secondary)",lineHeight:1.7,whiteSpace:"pre-wrap"}}>{step.config}</div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:16}}>
      {[{l:"Input Records",v:step.records>=1e6?(step.records/1e6).toFixed(1)+"M":step.records>=1e3?(step.records/1e3).toFixed(1)+"K":step.records},{l:"Avg Duration",v:step.type==="source"?"—":Math.round(Math.random()*800+100)+"ms"}].map(m=>(
        <div key={m.l} style={{background:"var(--bg-surface)",border:"1px solid var(--border-default)",borderRadius:8,padding:"8px 10px"}}>
          <div style={{fontSize:8,color:"var(--text-quaternary)",textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:3}}>{m.l}</div>
          <div style={{fontSize:15,fontWeight:700,color:"var(--text-secondary)",fontFamily:"'JetBrains Mono', monospace"}}>{m.v}</div>
        </div>))}
    </div>
    <div style={{display:"flex",gap:6}}>
      <button style={{flex:1,padding:"7px 0",borderRadius:6,background:"var(--accent-subtle)",border:"1px solid var(--border-default)",color:"var(--accent)",fontSize:10,fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>Edit Step</button>
      <button style={{flex:1,padding:"7px 0",borderRadius:6,background:"var(--bg-surface-hover)",border:"1px solid var(--border-default)",color:"var(--text-tertiary)",fontSize:10,fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>Preview Data</button>
    </div>
  </div>);
}

export default function TransformationFeature(){
  const[selectedPipeline,setSelectedPipeline]=useState("pl-001");const[selectedStep,setSelectedStep]=useState(null);const[showRunHistory,setShowRunHistory]=useState(false);const[theme,setTheme]=useState("dark");
  const currentSteps=PIPELINE_STEPS[selectedPipeline]||[];const currentEdges=EDGES[selectedPipeline]||[];const currentPipeline=PIPELINES.find(p=>p.id===selectedPipeline);const selectedStepData=currentSteps.find(s=>s.id===selectedStep);
  const tokens=THEME_TOKENS[theme];const cssVars={};Object.entries(tokens).forEach(([k,v])=>{cssVars[k]=v});

  return(
    <div style={{minHeight:"100vh",background:"var(--bg-root)",color:"var(--text-primary)",fontFamily:"'DM Sans', -apple-system, sans-serif",transition:"background 0.4s, color 0.4s",...cssVars}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&family=JetBrains+Mono:wght@400;500;600&display=swap');
        @keyframes fadeSlide{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        .pipe-item{transition:all 0.15s;cursor:pointer}.pipe-item:hover{background:var(--bg-surface-hover) !important}
        .node-card:hover{border-color:var(--accent) !important;box-shadow:var(--shadow-md) !important}
        .run-row{transition:background 0.15s}.run-row:hover{background:var(--bg-surface-hover)}
        *{box-sizing:border-box}::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:var(--scrollbar-thumb);border-radius:4px}
      `}</style>

      <div style={{borderBottom:"1px solid var(--border-default)",padding:"14px 24px",display:"flex",justifyContent:"space-between",alignItems:"center",background:"var(--nav-bg)",transition:"background 0.4s"}}>
        <div style={{display:"flex",alignItems:"center",gap:14}}>
          <div style={{width:8,height:8,borderRadius:"50%",background:"var(--accent)"}}/>
          <h1 style={{fontSize:16,fontWeight:700,margin:0,letterSpacing:"-0.02em"}}><span style={{color:"var(--accent)"}}>Transformation</span><span style={{color:"var(--text-tertiary)",fontWeight:400,marginLeft:8}}>Pipelines</span></h1>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <button onClick={()=>setShowRunHistory(!showRunHistory)} style={{padding:"7px 14px",borderRadius:6,fontSize:11,fontWeight:500,cursor:"pointer",background:showRunHistory?"var(--accent-subtle)":"var(--bg-input)",border:`1px solid ${showRunHistory?"var(--border-strong)":"var(--border-default)"}`,color:showRunHistory?"var(--accent)":"var(--text-tertiary)",fontFamily:"'DM Sans',sans-serif"}}>◷ Run History</button>
          <button style={{padding:"7px 16px",borderRadius:6,fontSize:11,fontWeight:700,cursor:"pointer",background:"linear-gradient(135deg, var(--accent-strong), var(--accent))",border:"none",color:"var(--text-inverse)",fontFamily:"'DM Sans',sans-serif"}}>+ New Pipeline</button>
          <ThemeToggle theme={theme} onToggle={()=>setTheme(t=>t==="dark"?"light":"dark")}/>
        </div>
      </div>

      <div style={{display:"flex",height:"calc(100vh - 53px)"}}>
        <div style={{width:280,borderRight:"1px solid var(--border-default)",display:"flex",flexDirection:"column",flexShrink:0}}>
          <div style={{padding:"12px 14px",borderBottom:"1px solid var(--border-subtle)"}}>
            <input placeholder="Search pipelines…" style={{width:"100%",padding:"7px 10px",borderRadius:6,background:"var(--bg-input)",border:"1px solid var(--border-default)",color:"var(--text-secondary)",fontSize:11,outline:"none",fontFamily:"'DM Sans',sans-serif"}}/>
          </div>
          <div style={{flex:1,overflow:"auto",padding:"6px 8px"}}>
            {PIPELINES.map(p=>{const st=STATUS_MAP[p.status];const isActive=p.id===selectedPipeline;return(
              <div key={p.id} className="pipe-item" onClick={()=>{setSelectedPipeline(p.id);setSelectedStep(null)}} style={{padding:"10px 12px",borderRadius:8,marginBottom:2,background:isActive?"var(--accent-subtle)":"transparent",border:`1px solid ${isActive?"var(--border-strong)":"transparent"}`}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                  <span style={{fontSize:12,fontWeight:600,color:"var(--text-primary)"}}>{p.name}</span>
                  <span style={{fontSize:9,fontWeight:600,color:st.color,background:"var(--bg-surface-hover)",padding:"2px 6px",borderRadius:10,textTransform:"uppercase",letterSpacing:"0.04em"}}>{st.label}</span>
                </div>
                <div style={{fontSize:10,color:"var(--text-quaternary)",display:"flex",justifyContent:"space-between"}}><span>{p.source.split(" ")[0]}</span><span>{p.runsToday} runs today</span></div>
              </div>)})}
          </div>
        </div>

        {showRunHistory?(
          <div style={{flex:1,overflow:"auto",padding:"20px 24px"}}>
            <div style={{fontSize:11,fontWeight:600,color:"var(--text-tertiary)",textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:12}}>Recent Pipeline Runs</div>
            {RUN_HISTORY.map(run=>(<div key={run.id} className="run-row" style={{padding:"12px 16px",borderBottom:"1px solid var(--border-subtle)",display:"grid",gridTemplateColumns:"1fr 80px 80px 80px 100px",alignItems:"center",gap:12}}>
              <div><div style={{fontSize:12,fontWeight:600,color:"var(--text-secondary)"}}>{run.pipeline}</div><div style={{fontSize:10,color:"var(--text-quaternary)",fontFamily:"'JetBrains Mono', monospace",marginTop:2}}>{run.timestamp} · {run.startedBy}</div></div>
              <span style={{fontSize:10,fontWeight:600,textAlign:"center",color:run.status==="completed"?"var(--color-success)":"var(--color-danger)",background:run.status==="completed"?"var(--color-success-subtle)":"var(--color-danger-subtle)",padding:"3px 8px",borderRadius:10,textTransform:"uppercase"}}>{run.status==="completed"?"✓ Done":"✗ Failed"}</span>
              <span style={{fontSize:11,color:"var(--text-tertiary)",fontFamily:"'JetBrains Mono', monospace",textAlign:"center"}}>{run.duration}</span>
              <span style={{fontSize:11,color:"var(--text-tertiary)",fontFamily:"'JetBrains Mono', monospace",textAlign:"center"}}>{run.records.toLocaleString()}</span>
              <span style={{fontSize:10,color:"var(--text-quaternary)",textAlign:"right"}}>{run.error||""}</span>
            </div>))}
          </div>
        ):(
          <div style={{flex:1,display:"flex",flexDirection:"column"}}>
            {currentPipeline&&<div style={{padding:"10px 20px",borderBottom:"1px solid var(--border-subtle)",display:"flex",justifyContent:"space-between",alignItems:"center",background:"var(--nav-bg)",transition:"background 0.4s"}}>
              <div style={{display:"flex",alignItems:"center",gap:16}}><span style={{fontSize:14,fontWeight:700,color:"var(--text-primary)"}}>{currentPipeline.name}</span><span style={{fontSize:9,fontWeight:600,color:STATUS_MAP[currentPipeline.status].color,background:"var(--bg-surface-hover)",padding:"2px 8px",borderRadius:10,textTransform:"uppercase"}}>{STATUS_MAP[currentPipeline.status].label}</span></div>
              <div style={{display:"flex",gap:16,fontSize:10,color:"var(--text-quaternary)",fontFamily:"'JetBrains Mono', monospace"}}><span>Last: {currentPipeline.lastRun}</span><span>{currentPipeline.successRate}% success</span><span>{currentSteps.length} steps</span></div>
            </div>}
            {currentSteps.length>0?<PipelineCanvas steps={currentSteps} edges={currentEdges} selectedStep={selectedStep} onSelectStep={setSelectedStep}/>:
              <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",color:"var(--text-ghost)",fontSize:12}}>{currentPipeline?.status==="draft"?"This pipeline has no steps yet.":"No visual data available."}</div>}
          </div>
        )}

        {!showRunHistory&&<div style={{width:260,borderLeft:"1px solid var(--border-default)",padding:"16px 14px",flexShrink:0,overflow:"auto"}}>
          <div style={{fontSize:10,fontWeight:600,color:"var(--text-quaternary)",textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:14}}>Step Inspector</div>
          <StepDetail step={selectedStepData}/>
          <div style={{marginTop:24,paddingTop:16,borderTop:"1px solid var(--border-subtle)"}}>
            <div style={{fontSize:10,fontWeight:600,color:"var(--text-quaternary)",textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:10}}>Add Step</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
              {Object.entries(STEP_TYPES).filter(([k])=>k!=="source"&&k!=="output").map(([key,conf])=>(
                <div key={key} className="pipe-item" style={{padding:"8px 10px",borderRadius:8,background:"var(--bg-surface)",border:"1px solid var(--border-default)",display:"flex",alignItems:"center",gap:6,cursor:"pointer"}}>
                  <span style={{fontSize:13,color:`var(${conf.cVar})`}}>{conf.icon}</span>
                  <span style={{fontSize:10,color:"var(--text-tertiary)",fontWeight:500}}>{conf.label}</span>
                </div>))}
            </div>
          </div>
        </div>}
      </div>
    </div>
  );
}
