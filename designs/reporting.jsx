import { useState, useEffect } from "react";

const TK={dark:{"--bg-root":"#090b10","--bg-surface":"rgba(255,255,255,0.015)","--bg-surface-hover":"rgba(255,255,255,0.03)","--bg-input":"rgba(255,255,255,0.03)","--border-default":"rgba(255,255,255,0.06)","--border-subtle":"rgba(255,255,255,0.03)","--border-strong":"rgba(255,255,255,0.08)","--text-primary":"rgba(255,255,255,0.92)","--text-secondary":"rgba(255,255,255,0.7)","--text-tertiary":"rgba(255,255,255,0.35)","--text-quaternary":"rgba(255,255,255,0.2)","--text-ghost":"rgba(255,255,255,0.1)","--text-inverse":"#090b10","--color-success":"#34d399","--color-success-subtle":"rgba(52,211,153,0.1)","--color-warning":"#fbbf24","--color-danger":"#f87171","--accent":"#60a5fa","--accent-subtle":"rgba(96,165,250,0.1)","--accent-strong":"#2563eb","--shadow-sm":"0 1px 3px rgba(0,0,0,0.3)","--shadow-md":"0 4px 12px rgba(0,0,0,0.3)","--nav-bg":"rgba(255,255,255,0.01)","--scrollbar-thumb":"rgba(255,255,255,0.06)","--toggle-bg":"rgba(255,255,255,0.06)","--toggle-knob":"#60a5fa","--chart-1":"#60a5fa","--chart-2":"#818cf8","--chart-3":"#c084fc","--chart-4":"#334155","--chart-bar-1":"#60a5fa","--chart-bar-2":"#818cf8","--chart-bar-3":"#34d399"},
light:{"--bg-root":"#f8f9fc","--bg-surface":"#ffffff","--bg-surface-hover":"#f3f4f8","--bg-input":"#f3f4f8","--border-default":"rgba(0,0,0,0.08)","--border-subtle":"rgba(0,0,0,0.04)","--border-strong":"rgba(0,0,0,0.12)","--text-primary":"#1a1c23","--text-secondary":"#4a4d58","--text-tertiary":"#7c7f8e","--text-quaternary":"#a3a6b3","--text-ghost":"#d0d2da","--text-inverse":"#ffffff","--color-success":"#059669","--color-success-subtle":"rgba(5,150,105,0.08)","--color-warning":"#d97706","--color-danger":"#dc2626","--accent":"#2563eb","--accent-subtle":"rgba(37,99,235,0.07)","--accent-strong":"#1d4ed8","--shadow-sm":"0 1px 3px rgba(0,0,0,0.06)","--shadow-md":"0 4px 12px rgba(0,0,0,0.06)","--nav-bg":"rgba(255,255,255,0.85)","--scrollbar-thumb":"rgba(0,0,0,0.08)","--toggle-bg":"rgba(0,0,0,0.08)","--toggle-knob":"#2563eb","--chart-1":"#2563eb","--chart-2":"#6366f1","--chart-3":"#7c3aed","--chart-4":"#cbd5e1","--chart-bar-1":"#2563eb","--chart-bar-2":"#6366f1","--chart-bar-3":"#059669"}};

function Toggle({theme,onToggle}){return(<button onClick={onToggle} style={{width:48,height:26,borderRadius:13,padding:3,background:"var(--toggle-bg)",border:"1px solid var(--border-default)",cursor:"pointer",display:"flex",alignItems:"center",transition:"background 0.3s"}}><div style={{width:18,height:18,borderRadius:9,background:"var(--toggle-knob)",transform:theme==="dark"?"translateX(0)":"translateX(22px)",transition:"transform 0.3s cubic-bezier(0.34,1.56,0.64,1)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,color:"var(--text-inverse)",boxShadow:"0 1px 3px rgba(0,0,0,0.2)"}}>{theme==="dark"?"☽":"☀"}</div></button>);}

const DASHBOARDS=[{id:"db-001",name:"Revenue Overview",widgets:8,updatedAt:"2 min ago"},{id:"db-002",name:"Customer Health",widgets:6,updatedAt:"1 hour ago"},{id:"db-003",name:"Developer Activity",widgets:5,updatedAt:"15 min ago"},{id:"db-004",name:"Pipeline Performance",widgets:4,updatedAt:"30 min ago"}];
const REV=[{month:"Aug",value:284000},{month:"Sep",value:312000},{month:"Oct",value:298000},{month:"Nov",value:345000},{month:"Dec",value:378000},{month:"Jan",value:420000},{month:"Feb",value:395000},{month:"Mar",value:467000},{month:"Apr",value:510000},{month:"May",value:485000},{month:"Jun",value:542000},{month:"Jul",value:598000}];
const SEG=[{label:"Enterprise",value:42,cVar:"--chart-1"},{label:"Pro",value:31,cVar:"--chart-2"},{label:"Starter",value:18,cVar:"--chart-3"},{label:"Free",value:9,cVar:"--chart-4"}];
const ACT=[{day:"Mon",commits:142,prs:23,deploys:8},{day:"Tue",commits:198,prs:31,deploys:12},{day:"Wed",commits:167,prs:28,deploys:6},{day:"Thu",commits:224,prs:35,deploys:14},{day:"Fri",commits:189,prs:29,deploys:11},{day:"Sat",commits:45,prs:4,deploys:2},{day:"Sun",commits:32,prs:2,deploys:1}];
const CUST=[{name:"Acme Corp",arr:240000,health:92,growth:12.4},{name:"Globex Industries",arr:186000,health:88,growth:8.2},{name:"Initech",arr:156000,health:95,growth:22.1},{name:"Soylent Corp",arr:132000,health:71,growth:-3.4},{name:"Umbrella Corp",arr:118000,health:84,growth:5.7},{name:"Wayne Enterprises",arr:98000,health:96,growth:31.2},{name:"Stark Industries",arr:87000,health:79,growth:1.1}];
const PIPEPERF=[{name:"Customer 360",success:99.8,runs:48},{name:"Payment Recon",success:100,runs:96},{name:"Event Stream",success:99.9,runs:2847},{name:"Lead Scoring",success:0,runs:0},{name:"Warehouse Sync",success:75.0,runs:12}];

function AreaChart({data,height=160}){const max=Math.max(...data.map(d=>d.value))*1.1;const w=100,h=100;const pts=data.map((d,i)=>({x:(i/(data.length-1))*w,y:h-(d.value/max)*h}));const pathD=pts.map((p,i)=>`${i===0?"M":"L"} ${p.x} ${p.y}`).join(" ");const areaD=pathD+` L ${w} ${h} L 0 ${h} Z`;
  return(<div style={{position:"relative",height,padding:"0 0 24px 0"}}><svg viewBox={`-2 -4 ${w+4} ${h+8}`} style={{width:"100%",height:"100%"}} preserveAspectRatio="none">
    <defs><linearGradient id="ag" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--accent)" stopOpacity="0.2"/><stop offset="100%" stopColor="var(--accent)" stopOpacity="0"/></linearGradient></defs>
    {[0,0.25,0.5,0.75].map(p=><line key={p} x1="0" y1={h-p*h} x2={w} y2={h-p*h} stroke="var(--border-subtle)" strokeWidth="0.3"/>)}
    <path d={areaD} fill="url(#ag)"/><path d={pathD} fill="none" stroke="var(--accent)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke"/>
    <circle cx={pts[pts.length-1].x} cy={pts[pts.length-1].y} r="1.5" fill="var(--accent)"/>
  </svg><div style={{display:"flex",justifyContent:"space-between",padding:"0 2px",position:"absolute",bottom:0,left:0,right:0}}>{data.filter((_,i)=>i%2===0).map((d,i)=><span key={i} style={{fontSize:8,color:"var(--text-ghost)",fontFamily:"'JetBrains Mono', monospace"}}>{d.month}</span>)}</div></div>);}

function Donut({data,size=120}){const total=data.reduce((a,d)=>a+d.value,0);let cum=0;const r=42,circ=2*Math.PI*r;
  return(<div style={{display:"flex",alignItems:"center",gap:20}}><svg width={size} height={size} viewBox="0 0 120 120">{data.map((d,i)=>{const pct=d.value/total;const da=`${pct*circ} ${circ}`;const rot=cum*360-90;cum+=pct;return <circle key={i} cx="60" cy="60" r={r} fill="none" stroke={`var(${d.cVar})`} strokeWidth="14" strokeDasharray={da} transform={`rotate(${rot} 60 60)`} strokeLinecap="round"/>})}<text x="60" y="56" textAnchor="middle" style={{fontSize:18,fontWeight:700,fill:"var(--text-primary)",fontFamily:"'JetBrains Mono', monospace"}}>{total}%</text><text x="60" y="70" textAnchor="middle" style={{fontSize:8,fill:"var(--text-quaternary)",textTransform:"uppercase",letterSpacing:"0.08em"}}>Distribution</text></svg>
    <div style={{display:"flex",flexDirection:"column",gap:6}}>{data.map((d,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:8}}><div style={{width:8,height:8,borderRadius:2,background:`var(${d.cVar})`}}/><span style={{fontSize:11,color:"var(--text-tertiary)",minWidth:70}}>{d.label}</span><span style={{fontSize:11,fontWeight:600,color:"var(--text-secondary)",fontFamily:"'JetBrains Mono', monospace"}}>{d.value}%</span></div>)}</div></div>);}

function Bars({data,height=140}){const max=Math.max(...data.flatMap(d=>[d.commits,d.prs*5,d.deploys*10]));
  return(<div style={{height,display:"flex",alignItems:"flex-end",gap:8,padding:"0 0 20px"}}>{data.map((d,i)=><div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:2,position:"relative"}}><div style={{display:"flex",alignItems:"flex-end",gap:2,height:height-24}}>
    <div style={{width:8,background:"var(--chart-bar-1)",borderRadius:"2px 2px 0 0",height:`${(d.commits/max)*100}%`,opacity:0.8}}/>
    <div style={{width:8,background:"var(--chart-bar-2)",borderRadius:"2px 2px 0 0",height:`${(d.prs*5/max)*100}%`,opacity:0.8}}/>
    <div style={{width:8,background:"var(--chart-bar-3)",borderRadius:"2px 2px 0 0",height:`${(d.deploys*10/max)*100}%`,opacity:0.8}}/>
  </div><span style={{fontSize:8,color:"var(--text-ghost)",fontFamily:"'JetBrains Mono', monospace"}}>{d.day}</span></div>)}</div>);}

function Widget({title,span=1,children}){return(<div className="widget-card" style={{gridColumn:`span ${span}`,background:"var(--bg-surface)",border:"1px solid var(--border-default)",borderRadius:14,padding:"16px 18px",display:"flex",flexDirection:"column",transition:"border-color 0.2s, box-shadow 0.2s, background 0.4s",overflow:"hidden",boxShadow:"var(--shadow-sm)"}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}><span style={{fontSize:11,fontWeight:600,color:"var(--text-tertiary)",textTransform:"uppercase",letterSpacing:"0.05em"}}>{title}</span><button style={{background:"none",border:"none",color:"var(--text-ghost)",cursor:"pointer",fontSize:14,padding:0}}>⋯</button></div><div style={{flex:1}}>{children}</div></div>);}

export default function ReportingFeature(){
  const[activeDash,setActiveDash]=useState("db-001");const[dateRange,setDateRange]=useState("12m");const[theme,setTheme]=useState("dark");
  const tokens=TK[theme];const cssVars={};Object.entries(tokens).forEach(([k,v])=>{cssVars[k]=v});
  const metrics=[{label:"Monthly Revenue",value:"$598K",change:"+10.3%",pos:true,spark:[284,312,298,345,378,420,395,467,510,485,542,598]},{label:"Active Customers",value:"2,847",change:"+142",pos:true,spark:[2200,2340,2510,2650,2780,2847]},{label:"Avg. Deal Size",value:"$18.4K",change:"-2.1%",pos:false,spark:[21000,20200,19400,18800,18500,18400]},{label:"Churn Rate",value:"1.8%",change:"-0.4%",pos:true,spark:[3.2,2.7,2.3,2.0,1.9,1.8]}];

  return(
    <div style={{minHeight:"100vh",background:"var(--bg-root)",color:"var(--text-primary)",fontFamily:"'DM Sans', -apple-system, sans-serif",transition:"background 0.4s, color 0.4s",...cssVars}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&family=JetBrains+Mono:wght@400;500;600&display=swap');
        @keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        .widget-card:hover{border-color:var(--border-strong) !important;box-shadow:var(--shadow-md) !important}
        .dash-tab{transition:all 0.15s;cursor:pointer}.dash-tab:hover{background:var(--bg-surface-hover) !important}
        .metric-card{transition:all 0.2s}.metric-card:hover{border-color:var(--border-strong) !important;transform:translateY(-1px)}
        .fb{transition:all 0.15s;cursor:pointer;font-family:'DM Sans',sans-serif}.fb:hover{filter:brightness(1.1)}
        *{box-sizing:border-box}::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:var(--scrollbar-thumb);border-radius:4px}`}</style>

      <div style={{borderBottom:"1px solid var(--border-default)",padding:"14px 28px",display:"flex",justifyContent:"space-between",alignItems:"center",background:"var(--nav-bg)",transition:"background 0.4s"}}>
        <div style={{display:"flex",alignItems:"center",gap:14}}><div style={{width:8,height:8,borderRadius:"50%",background:"var(--accent)"}}/><h1 style={{fontSize:16,fontWeight:700,margin:0}}><span style={{color:"var(--accent)"}}>Reporting</span><span style={{color:"var(--text-tertiary)",fontWeight:400,marginLeft:8}}>Dashboards</span></h1></div>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          {["7d","30d","90d","12m"].map(r=><button key={r} className="fb" onClick={()=>setDateRange(r)} style={{padding:"5px 10px",borderRadius:6,fontSize:10,fontWeight:600,background:dateRange===r?"var(--accent-subtle)":"var(--bg-input)",border:`1px solid ${dateRange===r?"var(--border-strong)":"transparent"}`,color:dateRange===r?"var(--accent)":"var(--text-quaternary)",textTransform:"uppercase",letterSpacing:"0.04em"}}>{r}</button>)}
          <div style={{width:1,height:20,background:"var(--border-default)",margin:"0 4px"}}/>
          <button style={{padding:"7px 16px",borderRadius:6,fontSize:11,fontWeight:700,cursor:"pointer",background:"linear-gradient(135deg, var(--accent-strong), var(--accent))",border:"none",color:"var(--text-inverse)",fontFamily:"'DM Sans',sans-serif"}}>+ New Dashboard</button>
          <Toggle theme={theme} onToggle={()=>setTheme(t=>t==="dark"?"light":"dark")}/>
        </div>
      </div>

      <div style={{display:"flex",height:"calc(100vh - 53px)"}}>
        <div style={{width:220,borderRight:"1px solid var(--border-default)",padding:"12px 8px",flexShrink:0}}>
          <div style={{fontSize:9,fontWeight:600,color:"var(--text-quaternary)",textTransform:"uppercase",letterSpacing:"0.06em",padding:"4px 10px",marginBottom:6}}>Dashboards</div>
          {DASHBOARDS.map(db=><div key={db.id} className="dash-tab" onClick={()=>setActiveDash(db.id)} style={{padding:"10px 12px",borderRadius:8,marginBottom:2,background:activeDash===db.id?"var(--accent-subtle)":"transparent",borderLeft:activeDash===db.id?"2px solid var(--accent)":"2px solid transparent"}}><div style={{fontSize:12,fontWeight:600,color:activeDash===db.id?"var(--text-primary)":"var(--text-tertiary)"}}>{db.name}</div><div style={{fontSize:9,color:"var(--text-quaternary)",marginTop:2}}>{db.widgets} widgets · {db.updatedAt}</div></div>)}
        </div>

        <div style={{flex:1,overflow:"auto",padding:"20px 24px"}}>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4, 1fr)",gap:12,marginBottom:16}}>
            {metrics.map((m,i)=><div key={i} className="metric-card" style={{background:"var(--bg-surface)",border:"1px solid var(--border-default)",borderRadius:12,padding:"14px 16px",boxShadow:"var(--shadow-sm)",animation:`fadeUp 0.4s ease ${i*0.08}s both`,transition:"all 0.4s"}}>
              <div style={{fontSize:9,color:"var(--text-quaternary)",textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:8,fontWeight:600}}>{m.label}</div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end"}}>
                <div><div style={{fontSize:22,fontWeight:700,color:"var(--text-primary)",fontFamily:"'JetBrains Mono', monospace",lineHeight:1}}>{m.value}</div><span style={{fontSize:10,fontWeight:600,marginTop:4,display:"inline-block",color:m.pos?"var(--color-success)":"var(--color-danger)"}}>{m.change}</span></div>
                <svg width="60" height="24" style={{overflow:"visible"}}>{(()=>{const d=m.spark;const mx=Math.max(...d),mn=Math.min(...d),rng=mx-mn||1;const p=d.map((v,j)=>`${(j/(d.length-1))*60},${24-((v-mn)/rng)*20-2}`).join(" ");return <polyline points={p} fill="none" stroke={m.pos?"var(--color-success)":"var(--color-danger)"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.6"/>})()}</svg>
              </div>
            </div>)}
          </div>

          <div style={{display:"grid",gridTemplateColumns:"repeat(3, 1fr)",gap:12,gridAutoRows:"minmax(200px, auto)"}}>
            <Widget title="Revenue Trend" span={2}><AreaChart data={REV} height={180}/></Widget>
            <Widget title="Customer Segments"><div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100%"}}><Donut data={SEG}/></div></Widget>
            <Widget title="Top Customers by ARR" span={2}>
              <div><div style={{display:"grid",gridTemplateColumns:"1fr 90px 90px 80px",padding:"6px 0",fontSize:9,color:"var(--text-quaternary)",textTransform:"uppercase",letterSpacing:"0.06em",borderBottom:"1px solid var(--border-subtle)",marginBottom:4}}><span>Customer</span><span>ARR</span><span>Health</span><span style={{textAlign:"right"}}>Growth</span></div>
              {CUST.map((c,i)=><div key={i} style={{display:"grid",gridTemplateColumns:"1fr 90px 90px 80px",padding:"7px 0",alignItems:"center",borderBottom:"1px solid var(--border-subtle)",animation:`fadeUp 0.3s ease ${i*0.04}s both`}}>
                <span style={{fontSize:11,fontWeight:500,color:"var(--text-secondary)"}}>{c.name}</span>
                <span style={{fontSize:11,color:"var(--text-tertiary)",fontFamily:"'JetBrains Mono', monospace"}}>${(c.arr/1000).toFixed(0)}K</span>
                <div style={{display:"flex",alignItems:"center",gap:8}}><div style={{flex:1,height:3,background:"var(--border-subtle)",borderRadius:2,overflow:"hidden"}}><div style={{width:`${c.health}%`,height:"100%",background:c.health>=90?"var(--color-success)":c.health>=70?"var(--color-warning)":"var(--color-danger)",borderRadius:2}}/></div><span style={{fontSize:10,fontWeight:600,color:c.health>=90?"var(--color-success)":c.health>=70?"var(--color-warning)":"var(--color-danger)",fontFamily:"'JetBrains Mono', monospace",minWidth:28,textAlign:"right"}}>{c.health}</span></div>
                <span style={{fontSize:10,fontWeight:600,textAlign:"right",color:c.growth>=0?"var(--color-success)":"var(--color-danger)",fontFamily:"'JetBrains Mono', monospace"}}>{c.growth>=0?"+":""}{c.growth}%</span>
              </div>)}</div>
            </Widget>
            <Widget title="Developer Activity"><Bars data={ACT}/><div style={{display:"flex",gap:12,justifyContent:"center",marginTop:4}}>{[{l:"Commits",c:"--chart-bar-1"},{l:"PRs",c:"--chart-bar-2"},{l:"Deploys",c:"--chart-bar-3"}].map(l=><div key={l.l} style={{display:"flex",alignItems:"center",gap:4}}><div style={{width:6,height:6,borderRadius:1,background:`var(${l.c})`}}/><span style={{fontSize:9,color:"var(--text-quaternary)"}}>{l.l}</span></div>)}</div></Widget>
            <Widget title="Pipeline Performance" span={2}>
              <div>{PIPEPERF.map((p,i)=><div key={i} style={{display:"grid",gridTemplateColumns:"140px 1fr 60px 70px",padding:"8px 0",alignItems:"center",borderBottom:"1px solid var(--border-subtle)"}}>
                <span style={{fontSize:11,fontWeight:500,color:"var(--text-secondary)"}}>{p.name}</span>
                <div style={{height:4,background:"var(--border-subtle)",borderRadius:2,overflow:"hidden"}}><div style={{width:`${p.success}%`,height:"100%",borderRadius:2,background:p.success>=99?"var(--color-success)":p.success>=80?"var(--color-warning)":p.success>0?"var(--color-danger)":"var(--border-subtle)"}}/></div>
                <span style={{fontSize:10,fontFamily:"'JetBrains Mono', monospace",color:"var(--text-tertiary)",textAlign:"right"}}>{p.success}%</span>
                <span style={{fontSize:10,fontFamily:"'JetBrains Mono', monospace",color:"var(--text-quaternary)",textAlign:"right"}}>{p.runs} runs</span>
              </div>)}</div>
            </Widget>
            <Widget title="System Health">
              <div style={{display:"flex",flexDirection:"column",gap:10}}>{[{l:"Ingress",s:"Healthy",c:"var(--color-success)",u:"99.97%"},{l:"Transform",s:"Healthy",c:"var(--color-success)",u:"99.99%"},{l:"Reporting",s:"Healthy",c:"var(--color-success)",u:"100%"},{l:"Export",s:"Degraded",c:"var(--color-warning)",u:"98.2%"},{l:"Users API",s:"Healthy",c:"var(--color-success)",u:"99.95%"}].map((s,i)=><div key={i} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"6px 0",borderBottom:"1px solid var(--border-subtle)"}}>
                <div style={{display:"flex",alignItems:"center",gap:8}}><div style={{width:6,height:6,borderRadius:"50%",background:s.c}}/><span style={{fontSize:11,color:"var(--text-secondary)"}}>{s.l}</span></div>
                <span style={{fontSize:10,fontFamily:"'JetBrains Mono', monospace",color:"var(--text-quaternary)"}}>{s.u}</span>
              </div>)}</div>
            </Widget>
          </div>
        </div>
      </div>
    </div>
  );
}
