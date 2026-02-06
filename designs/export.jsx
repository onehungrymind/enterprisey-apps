import { useState, useEffect } from "react";

const TK={dark:{"--bg-root":"#0a0b10","--bg-surface":"rgba(255,255,255,0.012)","--bg-surface-hover":"rgba(255,255,255,0.03)","--bg-input":"rgba(255,255,255,0.03)","--bg-code":"rgba(0,0,0,0.2)","--border-default":"rgba(255,255,255,0.05)","--border-subtle":"rgba(255,255,255,0.02)","--border-strong":"rgba(255,255,255,0.1)","--text-primary":"rgba(255,255,255,0.88)","--text-secondary":"rgba(255,255,255,0.6)","--text-tertiary":"rgba(255,255,255,0.3)","--text-quaternary":"rgba(255,255,255,0.15)","--text-ghost":"rgba(255,255,255,0.08)","--text-inverse":"#0a0b10","--color-success":"#34d399","--color-success-subtle":"rgba(52,211,153,0.08)","--color-warning":"#fbbf24","--color-danger":"#f87171","--color-danger-subtle":"rgba(248,113,113,0.08)","--color-info":"#818cf8","--accent":"#f472b6","--accent-subtle":"rgba(244,114,182,0.08)","--accent-strong":"#be185d","--shadow-sm":"0 1px 3px rgba(0,0,0,0.3)","--shadow-md":"0 4px 12px rgba(0,0,0,0.3)","--nav-bg":"rgba(255,255,255,0.01)","--scrollbar-thumb":"rgba(255,255,255,0.06)","--toggle-bg":"rgba(255,255,255,0.06)","--toggle-knob":"#f472b6","--fmt-csv":"#34d399","--fmt-json":"#fbbf24","--fmt-xlsx":"#60a5fa","--fmt-pdf":"#f472b6"},
light:{"--bg-root":"#f8f9fc","--bg-surface":"#ffffff","--bg-surface-hover":"#f3f4f8","--bg-input":"#f3f4f8","--bg-code":"#f0f1f5","--border-default":"rgba(0,0,0,0.08)","--border-subtle":"rgba(0,0,0,0.04)","--border-strong":"rgba(0,0,0,0.12)","--text-primary":"#1a1c23","--text-secondary":"#4a4d58","--text-tertiary":"#7c7f8e","--text-quaternary":"#a3a6b3","--text-ghost":"#d0d2da","--text-inverse":"#ffffff","--color-success":"#059669","--color-success-subtle":"rgba(5,150,105,0.08)","--color-warning":"#d97706","--color-danger":"#dc2626","--color-danger-subtle":"rgba(220,38,38,0.08)","--color-info":"#6366f1","--accent":"#db2777","--accent-subtle":"rgba(219,39,119,0.07)","--accent-strong":"#9d174d","--shadow-sm":"0 1px 3px rgba(0,0,0,0.06)","--shadow-md":"0 4px 12px rgba(0,0,0,0.06)","--nav-bg":"rgba(255,255,255,0.85)","--scrollbar-thumb":"rgba(0,0,0,0.08)","--toggle-bg":"rgba(0,0,0,0.08)","--toggle-knob":"#db2777","--fmt-csv":"#059669","--fmt-json":"#d97706","--fmt-xlsx":"#2563eb","--fmt-pdf":"#db2777"}};

function Toggle({theme,onToggle}){return(<button onClick={onToggle} style={{width:48,height:26,borderRadius:13,padding:3,background:"var(--toggle-bg)",border:"1px solid var(--border-default)",cursor:"pointer",display:"flex",alignItems:"center",transition:"background 0.3s"}}><div style={{width:18,height:18,borderRadius:9,background:"var(--toggle-knob)",transform:theme==="dark"?"translateX(0)":"translateX(22px)",transition:"transform 0.3s cubic-bezier(0.34,1.56,0.64,1)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,color:"var(--text-inverse)",boxShadow:"0 1px 3px rgba(0,0,0,0.2)"}}>{theme==="dark"?"☽":"☀"}</div></button>);}

const FMT={csv:{icon:"⊞",cVar:"--fmt-csv",label:"CSV"},json:{icon:"{ }",cVar:"--fmt-json",label:"JSON"},xlsx:{icon:"⊞",cVar:"--fmt-xlsx",label:"XLSX"},pdf:{icon:"▤",cVar:"--fmt-pdf",label:"PDF"}};
const ST={completed:{color:"var(--color-success)",label:"Completed",icon:"✓"},processing:{color:"var(--accent)",label:"Processing",icon:"◎"},queued:{color:"var(--color-info)",label:"Queued",icon:"◷"},failed:{color:"var(--color-danger)",label:"Failed",icon:"✗"},cancelled:{color:"var(--text-quaternary)",label:"Cancelled",icon:"⊘"}};

const JOBS=[
  {id:"exp-001",name:"Daily Revenue Report",query:"Revenue → Daily Totals",format:"xlsx",status:"completed",progress:100,schedule:"0 6 * * *",nextRun:"Tomorrow 6:00 AM",completedAt:"Today 6:00 AM",fileSize:"2.4 MB",recordCount:12403,createdBy:"Sarah Chen",duration:"4.2s"},
  {id:"exp-002",name:"Customer Segments Export",query:"Customer 360 → Enriched",format:"csv",status:"processing",progress:67,schedule:null,nextRun:null,completedAt:null,fileSize:null,recordCount:null,createdBy:"Lukas M.",duration:null,estimatedRecords:195200,estimatedTime:"~12s remaining"},
  {id:"exp-003",name:"Weekly Pipeline Report",query:"Pipeline Perf → All Metrics",format:"pdf",status:"completed",progress:100,schedule:"0 8 * * 1",nextRun:"Next Monday 8:00 AM",completedAt:"Monday 8:00 AM",fileSize:"890 KB",recordCount:2847,createdBy:"Emily Zhao",duration:"8.1s"},
  {id:"exp-004",name:"Raw Event Dump",query:"Event Stream → Push Events",format:"json",status:"queued",progress:0,schedule:null,nextRun:null,completedAt:null,fileSize:null,recordCount:null,createdBy:"Raj Patel",duration:null,estimatedRecords:845000,estimatedTime:"~45s estimated"},
  {id:"exp-005",name:"Monthly Compliance Data",query:"Customer 360 → Full Dataset",format:"xlsx",status:"failed",progress:34,schedule:"0 0 1 * *",nextRun:"Feb 1",completedAt:null,fileSize:null,recordCount:null,createdBy:"Sarah Chen",duration:"30.0s",error:"Memory limit exceeded — dataset too large."},
  {id:"exp-006",name:"Partner API Feed",query:"Payment Recon → Daily Totals",format:"json",status:"completed",progress:100,schedule:"0 */4 * * *",nextRun:"6:00 PM",completedAt:"Today 2:00 PM",fileSize:"156 KB",recordCount:365,createdBy:"Lukas M.",duration:"1.1s"},
  {id:"exp-007",name:"Snowflake Backup",query:"Warehouse Sync → Snapshot",format:"csv",status:"cancelled",progress:12,schedule:null,nextRun:null,completedAt:null,fileSize:null,recordCount:null,createdBy:"Raj Patel",duration:"—"},
  {id:"exp-008",name:"Marketing Contacts",query:"Lead Scoring → Qualified",format:"csv",status:"completed",progress:100,schedule:"0 9 * * *",nextRun:"Tomorrow 9:00 AM",completedAt:"Today 9:00 AM",fileSize:"4.1 MB",recordCount:45200,createdBy:"Emily Zhao",duration:"6.8s"},
];

const RECENT=[{time:"14:00",job:"Partner API Feed",format:"json",records:365,size:"156 KB"},{time:"09:02",job:"Marketing Contacts",format:"csv",records:45200,size:"4.1 MB"},{time:"08:01",job:"Weekly Pipeline Report",format:"pdf",records:2847,size:"890 KB"},{time:"06:04",job:"Daily Revenue Report",format:"xlsx",records:12403,size:"2.4 MB"},{time:"00:34",job:"Monthly Compliance",format:"xlsx",records:0,size:"—"}];
const SCHED=[{time:"6:00 PM",job:"Partner API Feed",format:"json"},{time:"10:00 PM",job:"Partner API Feed",format:"json"},{time:"6:00 AM",job:"Daily Revenue Report",format:"xlsx"},{time:"9:00 AM",job:"Marketing Contacts",format:"csv"},{time:"2:00 AM",job:"Partner API Feed",format:"json"}];

function ProgressBar({progress,status}){return(<div style={{height:3,background:"var(--border-subtle)",borderRadius:2,overflow:"hidden"}}><div style={{width:`${progress}%`,height:"100%",borderRadius:2,background:ST[status]?.color||"var(--accent)",transition:"width 0.6s ease"}}/></div>);}

function JobCard({job,isSelected,onClick}){const st=ST[job.status];const fmt=FMT[job.format];
  const[animP,setAnimP]=useState(job.progress);
  useEffect(()=>{if(job.status!=="processing")return;const iv=setInterval(()=>setAnimP(p=>Math.min(p+Math.random()*2,95)),1000);return()=>clearInterval(iv)},[job.status]);
  const dp=job.status==="processing"?animP:job.progress;
  return(<div onClick={onClick} className="job-card" style={{background:isSelected?"var(--accent-subtle)":"var(--bg-surface)",border:`1px solid ${isSelected?"var(--accent)":"var(--border-default)"}`,borderRadius:12,padding:"14px 16px",cursor:"pointer",transition:"all 0.2s",position:"relative",overflow:"hidden",boxShadow:isSelected?"var(--shadow-md)":"var(--shadow-sm)"}}>
    {isSelected&&<div style={{position:"absolute",top:0,left:0,width:3,height:"100%",background:"var(--accent)"}}/>}
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
      <div style={{flex:1,minWidth:0}}><div style={{fontSize:12,fontWeight:600,color:"var(--text-primary)",marginBottom:2}}>{job.name}</div><div style={{fontSize:10,color:"var(--text-quaternary)",fontFamily:"'JetBrains Mono',monospace",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{job.query}</div></div>
      <div style={{display:"flex",gap:4,flexShrink:0,marginLeft:8}}>
        <span style={{fontSize:9,fontWeight:700,color:`var(${fmt.cVar})`,background:"var(--bg-surface-hover)",border:"1px solid var(--border-default)",padding:"2px 6px",borderRadius:4,fontFamily:"'JetBrains Mono',monospace"}}>{fmt.label}</span>
        <span style={{fontSize:9,fontWeight:600,color:st.color,background:"var(--bg-surface-hover)",padding:"2px 6px",borderRadius:4}}>{st.icon} {st.label}</span>
      </div>
    </div>
    {(job.status==="processing"||job.status==="queued")&&<div style={{marginBottom:6}}><ProgressBar progress={dp} status={job.status}/><div style={{display:"flex",justifyContent:"space-between",marginTop:3}}><span style={{fontSize:9,color:"var(--text-quaternary)",fontFamily:"'JetBrains Mono',monospace"}}>{Math.round(dp)}%</span><span style={{fontSize:9,color:"var(--text-quaternary)"}}>{job.estimatedTime}</span></div></div>}
    <div style={{display:"flex",justifyContent:"space-between",fontSize:10,color:"var(--text-quaternary)"}}><span>{job.schedule?"⟳ Scheduled":"⊙ One-time"}</span><span>{job.completedAt||(job.status==="processing"?"In progress…":"—")}</span></div>
  </div>);}

function JobDetail({job}){if(!job)return <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100%",color:"var(--text-ghost)",fontSize:12}}>Select a job</div>;
  const st=ST[job.status];const fmt=FMT[job.format];
  return(<div style={{animation:"fadeSlide 0.25s ease"}}>
    <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
      <div style={{width:40,height:40,borderRadius:10,background:"var(--bg-surface-hover)",border:"1px solid var(--border-default)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,color:`var(${fmt.cVar})`,fontWeight:700,fontFamily:"'JetBrains Mono',monospace"}}>{fmt.label}</div>
      <div><h2 style={{fontSize:16,fontWeight:700,color:"var(--text-primary)",margin:0}}>{job.name}</h2><div style={{fontSize:10,color:"var(--text-quaternary)",fontFamily:"'JetBrains Mono',monospace",marginTop:2}}>{job.query}</div></div>
    </div>
    {job.status==="processing"&&<div style={{background:"var(--accent-subtle)",border:"1px solid var(--border-default)",borderRadius:10,padding:16,marginBottom:16,textAlign:"center"}}><div style={{fontSize:22,fontWeight:700,color:"var(--accent)",fontFamily:"'JetBrains Mono',monospace"}}>{job.progress}%</div><div style={{fontSize:11,color:"var(--text-tertiary)"}}>~{(job.estimatedRecords/1000).toFixed(0)}K records · {job.estimatedTime}</div></div>}
    {job.error&&<div style={{background:"var(--color-danger-subtle)",border:"1px solid var(--border-default)",borderRadius:8,padding:"10px 14px",marginBottom:16}}><div style={{fontSize:10,fontWeight:600,color:"var(--color-danger)",marginBottom:3}}>Export Failed</div><div style={{fontSize:10,color:"var(--text-tertiary)",fontFamily:"'JetBrains Mono',monospace"}}>{job.error}</div></div>}
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:16}}>
      {[{l:"Format",v:fmt.label,c:`var(${fmt.cVar})`},{l:"Status",v:st.label,c:st.color},{l:"File Size",v:job.fileSize||"—",c:"var(--text-secondary)"},{l:"Records",v:job.recordCount?job.recordCount.toLocaleString():"—",c:"var(--text-secondary)"},{l:"Duration",v:job.duration||"—",c:"var(--text-secondary)"},{l:"Created By",v:job.createdBy,c:"var(--text-secondary)"}].map(m=><div key={m.l} style={{background:"var(--bg-surface)",border:"1px solid var(--border-default)",borderRadius:8,padding:"8px 10px"}}><div style={{fontSize:8,color:"var(--text-quaternary)",textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:3}}>{m.l}</div><div style={{fontSize:13,fontWeight:600,color:m.c,fontFamily:"'JetBrains Mono',monospace"}}>{m.v}</div></div>)}
    </div>
    {job.schedule&&<div style={{marginBottom:16}}><div style={{fontSize:9,fontWeight:600,color:"var(--text-quaternary)",textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:6}}>Schedule</div><div style={{background:"var(--bg-code)",border:"1px solid var(--border-default)",borderRadius:8,padding:"10px 12px"}}><div style={{fontSize:12,color:"var(--text-tertiary)",fontFamily:"'JetBrains Mono',monospace",marginBottom:4}}>{job.schedule}</div><div style={{fontSize:10,color:"var(--text-quaternary)"}}>Next: {job.nextRun}</div></div></div>}
    <div style={{display:"flex",gap:6}}>
      {job.status==="completed"&&<button style={{flex:1,padding:"8px 0",borderRadius:6,background:"linear-gradient(135deg, var(--accent-strong), var(--accent))",border:"none",color:"#fff",fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>Download</button>}
      {job.status==="failed"&&<button style={{flex:1,padding:"8px 0",borderRadius:6,background:"var(--color-danger-subtle)",border:"1px solid var(--border-default)",color:"var(--color-danger)",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>Retry</button>}
      <button style={{flex:1,padding:"8px 0",borderRadius:6,background:"var(--bg-surface-hover)",border:"1px solid var(--border-default)",color:"var(--text-tertiary)",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>Configure</button>
    </div>
  </div>);}

export default function ExportFeature(){
  const[selectedId,setSelectedId]=useState("exp-002");const[filterStatus,setFilterStatus]=useState("all");const[filterFormat,setFilterFormat]=useState("all");const[viewMode,setViewMode]=useState("jobs");const[theme,setTheme]=useState("dark");
  const selected=JOBS.find(j=>j.id===selectedId);const filtered=JOBS.filter(j=>(filterStatus==="all"||j.status===filterStatus)&&(filterFormat==="all"||j.format===filterFormat));
  const tokens=TK[theme];const cssVars={};Object.entries(tokens).forEach(([k,v])=>{cssVars[k]=v});

  return(
    <div style={{minHeight:"100vh",background:"var(--bg-root)",color:"var(--text-primary)",fontFamily:"'DM Sans', -apple-system, sans-serif",transition:"background 0.4s, color 0.4s",...cssVars}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&family=JetBrains+Mono:wght@400;500;600&display=swap');
        @keyframes fadeSlide{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        .job-card:hover{border-color:var(--border-strong)!important;transform:translateY(-1px);box-shadow:var(--shadow-md)!important}
        .chip{transition:all 0.15s;cursor:pointer;font-family:'DM Sans',sans-serif}.chip:hover{filter:brightness(1.1)}
        .act-row{transition:background 0.15s}.act-row:hover{background:var(--bg-surface-hover)}
        *{box-sizing:border-box}::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:var(--scrollbar-thumb);border-radius:4px}`}</style>

      <div style={{borderBottom:"1px solid var(--border-default)",padding:"14px 28px",display:"flex",justifyContent:"space-between",alignItems:"center",background:"var(--nav-bg)",transition:"background 0.4s"}}>
        <div style={{display:"flex",alignItems:"center",gap:14}}><div style={{width:8,height:8,borderRadius:"50%",background:"var(--accent)"}}/><h1 style={{fontSize:16,fontWeight:700,margin:0}}><span style={{color:"var(--accent)"}}>Export</span><span style={{color:"var(--text-tertiary)",fontWeight:400,marginLeft:8}}>Jobs & Scheduling</span></h1></div>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          {["jobs","schedule"].map(m=><button key={m} className="chip" onClick={()=>setViewMode(m)} style={{padding:"5px 12px",borderRadius:6,fontSize:10,fontWeight:600,background:viewMode===m?"var(--accent-subtle)":"var(--bg-input)",border:`1px solid ${viewMode===m?"var(--border-strong)":"transparent"}`,color:viewMode===m?"var(--accent)":"var(--text-quaternary)",textTransform:"uppercase"}}>{m==="jobs"?"◎ Jobs":"⟳ Schedule"}</button>)}
          <div style={{width:1,height:20,background:"var(--border-default)",margin:"0 4px"}}/>
          <button style={{padding:"7px 16px",borderRadius:6,fontSize:11,fontWeight:700,cursor:"pointer",background:"linear-gradient(135deg, var(--accent-strong), var(--accent))",border:"none",color:"#fff",fontFamily:"'DM Sans',sans-serif"}}>+ New Export</button>
          <Toggle theme={theme} onToggle={()=>setTheme(t=>t==="dark"?"light":"dark")}/>
        </div>
      </div>

      <div style={{display:"flex",height:"calc(100vh - 53px)"}}>
        <div style={{width:400,borderRight:"1px solid var(--border-default)",display:"flex",flexDirection:"column",flexShrink:0}}>
          <div style={{padding:"14px 18px",borderBottom:"1px solid var(--border-subtle)",display:"flex",gap:20}}>
            {[{l:"Done",v:JOBS.filter(j=>j.status==="completed").length,c:"var(--color-success)"},{l:"Active",v:JOBS.filter(j=>j.status==="processing"||j.status==="queued").length,c:"var(--accent)"},{l:"Size",v:"12.9 MB",c:"var(--text-secondary)"}].map(s=><div key={s.l}><div style={{fontSize:8,color:"var(--text-quaternary)",textTransform:"uppercase",letterSpacing:"0.08em"}}>{s.l}</div><div style={{fontSize:17,fontWeight:700,color:s.c,fontFamily:"'JetBrains Mono',monospace"}}>{s.v}</div></div>)}
          </div>
          <div style={{padding:"8px 18px",borderBottom:"1px solid var(--border-subtle)",display:"flex",gap:4,flexWrap:"wrap"}}>
            {[{k:"all",l:"All"},{k:"completed",l:"✓ Done"},{k:"processing",l:"◎ Active"},{k:"failed",l:"✗ Failed"}].map(f=><button key={f.k} className="chip" onClick={()=>setFilterStatus(f.k)} style={{padding:"3px 8px",borderRadius:14,fontSize:9,fontWeight:600,background:filterStatus===f.k?"var(--accent-subtle)":"var(--bg-surface-hover)",border:`1px solid ${filterStatus===f.k?"var(--border-strong)":"transparent"}`,color:filterStatus===f.k?"var(--accent)":"var(--text-quaternary)"}}>{f.l}</button>)}
            <div style={{width:1,height:16,background:"var(--border-subtle)",margin:"0 2px",alignSelf:"center"}}/>
            {Object.entries(FMT).map(([k,v])=><button key={k} className="chip" onClick={()=>setFilterFormat(filterFormat===k?"all":k)} style={{padding:"3px 8px",borderRadius:14,fontSize:9,fontWeight:600,background:"var(--bg-surface-hover)",border:`1px solid ${filterFormat===k?"var(--border-strong)":"transparent"}`,color:filterFormat===k?`var(${v.cVar})`:"var(--text-quaternary)",fontFamily:"'JetBrains Mono',monospace"}}>{v.label}</button>)}
          </div>
          <div style={{flex:1,overflow:"auto",padding:"10px 12px",display:"flex",flexDirection:"column",gap:6}}>
            {filtered.map((job,i)=><div key={job.id} style={{animation:`fadeSlide 0.3s ease ${i*0.04}s both`}}><JobCard job={job} isSelected={selectedId===job.id} onClick={()=>setSelectedId(job.id)}/></div>)}
            {filtered.length===0&&<div style={{textAlign:"center",padding:40,color:"var(--text-ghost)",fontSize:12}}>No jobs match</div>}
          </div>
        </div>

        <div style={{flex:1,overflow:"auto",padding:"20px 28px"}}>
          {viewMode==="jobs"?<JobDetail job={selected}/>:(
            <div><div style={{fontSize:11,fontWeight:600,color:"var(--text-tertiary)",textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:16}}>Upcoming Scheduled Exports</div>
            <div style={{position:"relative",paddingLeft:20}}>
              <div style={{position:"absolute",left:6,top:0,bottom:0,width:1,background:"var(--border-default)"}}/>
              {SCHED.map((s,i)=><div key={i} style={{marginBottom:20,position:"relative",paddingLeft:24,animation:`fadeSlide 0.3s ease ${i*0.06}s both`}}>
                <div style={{position:"absolute",left:-1,top:4,width:14,height:14,borderRadius:"50%",background:"var(--bg-root)",border:`2px solid var(${FMT[s.format].cVar})`,display:"flex",alignItems:"center",justifyContent:"center"}}><div style={{width:5,height:5,borderRadius:"50%",background:`var(${FMT[s.format].cVar})`}}/></div>
                <div style={{background:"var(--bg-surface)",border:"1px solid var(--border-default)",borderRadius:10,padding:"12px 14px",boxShadow:"var(--shadow-sm)"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><span style={{fontSize:12,fontWeight:600,color:"var(--text-secondary)"}}>{s.job}</span><span style={{fontSize:9,fontWeight:700,color:`var(${FMT[s.format].cVar})`,background:"var(--bg-surface-hover)",padding:"2px 6px",borderRadius:4,fontFamily:"'JetBrains Mono',monospace"}}>{FMT[s.format].label}</span></div>
                  <div style={{fontSize:10,color:"var(--text-quaternary)",fontFamily:"'JetBrains Mono',monospace",marginTop:3}}>{s.time}</div>
                </div>
              </div>)}
            </div></div>
          )}
        </div>

        <div style={{width:300,borderLeft:"1px solid var(--border-default)",display:"flex",flexDirection:"column",flexShrink:0}}>
          <div style={{padding:"16px 18px",borderBottom:"1px solid var(--border-subtle)"}}>
            <div style={{fontSize:9,fontWeight:600,color:"var(--text-quaternary)",textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:10}}>Today's Output</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
              {Object.entries(FMT).map(([k,v])=>{const c=JOBS.filter(j=>j.format===k&&j.status==="completed").length;return <div key={k} style={{background:"var(--bg-surface)",border:"1px solid var(--border-default)",borderRadius:8,padding:"8px 10px",textAlign:"center"}}><div style={{fontSize:16,fontWeight:700,color:`var(${v.cVar})`,fontFamily:"'JetBrains Mono',monospace"}}>{c}</div><div style={{fontSize:8,color:"var(--text-quaternary)",textTransform:"uppercase"}}>{v.label}</div></div>})}
            </div>
          </div>
          <div style={{flex:1,overflow:"auto"}}>
            <div style={{padding:"12px 18px 6px",fontSize:9,fontWeight:600,color:"var(--text-quaternary)",textTransform:"uppercase",letterSpacing:"0.06em",position:"sticky",top:0,background:"var(--bg-root)",transition:"background 0.4s"}}>Recent</div>
            {RECENT.map((act,i)=><div key={i} className="act-row" style={{padding:"10px 18px",borderBottom:"1px solid var(--border-subtle)",animation:`fadeSlide 0.3s ease ${i*0.05}s both`}}>
              <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:3}}><span style={{width:5,height:5,borderRadius:"50%",background:act.records>0?"var(--color-success)":"var(--color-danger)"}}/><span style={{fontSize:10,color:"var(--text-quaternary)",fontFamily:"'JetBrains Mono',monospace"}}>{act.time}</span><span style={{fontSize:8,color:`var(${FMT[act.format].cVar})`,fontFamily:"'JetBrains Mono',monospace",fontWeight:600,marginLeft:"auto"}}>{FMT[act.format].label}</span></div>
              <div style={{fontSize:11,color:"var(--text-secondary)",paddingLeft:11}}>{act.job}</div>
              {act.records>0&&<div style={{fontSize:9,color:"var(--text-ghost)",paddingLeft:11,marginTop:2,fontFamily:"'JetBrains Mono',monospace"}}>{act.records.toLocaleString()} records · {act.size}</div>}
            </div>)}
          </div>
        </div>
      </div>
    </div>
  );
}
