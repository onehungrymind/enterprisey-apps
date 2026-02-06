import { useState } from "react";

const TK={dark:{"--bg-root":"#0a0b0f","--bg-surface":"rgba(255,255,255,0.015)","--bg-surface-hover":"rgba(255,255,255,0.03)","--bg-input":"rgba(255,255,255,0.03)","--border-default":"rgba(255,255,255,0.05)","--border-subtle":"rgba(255,255,255,0.02)","--border-strong":"rgba(255,255,255,0.1)","--text-primary":"rgba(255,255,255,0.85)","--text-secondary":"rgba(255,255,255,0.6)","--text-tertiary":"rgba(255,255,255,0.3)","--text-quaternary":"rgba(255,255,255,0.15)","--text-ghost":"rgba(255,255,255,0.08)","--text-inverse":"#0a0b0f","--color-success":"#34d399","--color-warning":"#fbbf24","--color-danger":"#f87171","--color-info":"#818cf8","--accent":"#94a3b8","--accent-subtle":"rgba(148,163,184,0.08)","--accent-strong":"#475569","--shadow-sm":"0 1px 3px rgba(0,0,0,0.3)","--shadow-md":"0 4px 12px rgba(0,0,0,0.3)","--nav-bg":"rgba(255,255,255,0.01)","--scrollbar-thumb":"rgba(255,255,255,0.06)","--toggle-bg":"rgba(255,255,255,0.06)","--toggle-knob":"#94a3b8","--role-admin":"#f87171","--role-admin-bg":"rgba(248,113,113,0.08)","--role-mentor":"#c084fc","--role-mentor-bg":"rgba(192,132,252,0.08)","--role-apprentice":"#60a5fa","--role-apprentice-bg":"rgba(96,165,250,0.08)","--role-user":"#64748b","--role-user-bg":"rgba(100,116,139,0.08)","--status-active":"#34d399","--status-inactive":"#64748b","--status-invited":"#818cf8","--edit":"#fbbf24","--export":"#f472b6","--create":"#34d399","--invite":"#818cf8","--permission":"#f87171","--auth":"#64748b"},
light:{"--bg-root":"#f8f9fc","--bg-surface":"#ffffff","--bg-surface-hover":"#f3f4f8","--bg-input":"#f3f4f8","--border-default":"rgba(0,0,0,0.08)","--border-subtle":"rgba(0,0,0,0.04)","--border-strong":"rgba(0,0,0,0.12)","--text-primary":"#1a1c23","--text-secondary":"#4a4d58","--text-tertiary":"#7c7f8e","--text-quaternary":"#a3a6b3","--text-ghost":"#d0d2da","--text-inverse":"#ffffff","--color-success":"#059669","--color-warning":"#d97706","--color-danger":"#dc2626","--color-info":"#6366f1","--accent":"#475569","--accent-subtle":"rgba(71,85,105,0.07)","--accent-strong":"#334155","--shadow-sm":"0 1px 3px rgba(0,0,0,0.06)","--shadow-md":"0 4px 12px rgba(0,0,0,0.06)","--nav-bg":"rgba(255,255,255,0.85)","--scrollbar-thumb":"rgba(0,0,0,0.08)","--toggle-bg":"rgba(0,0,0,0.08)","--toggle-knob":"#475569","--role-admin":"#dc2626","--role-admin-bg":"rgba(220,38,38,0.06)","--role-mentor":"#7c3aed","--role-mentor-bg":"rgba(124,58,237,0.06)","--role-apprentice":"#2563eb","--role-apprentice-bg":"rgba(37,99,235,0.06)","--role-user":"#475569","--role-user-bg":"rgba(71,85,105,0.06)","--status-active":"#059669","--status-inactive":"#475569","--status-invited":"#6366f1","--edit":"#d97706","--export":"#db2777","--create":"#059669","--invite":"#6366f1","--permission":"#dc2626","--auth":"#475569"}};

function Toggle({theme,onToggle}){return(<button onClick={onToggle} style={{width:48,height:26,borderRadius:13,padding:3,background:"var(--toggle-bg)",border:"1px solid var(--border-default)",cursor:"pointer",display:"flex",alignItems:"center",transition:"background 0.3s"}}><div style={{width:18,height:18,borderRadius:9,background:"var(--toggle-knob)",transform:theme==="dark"?"translateX(0)":"translateX(22px)",transition:"transform 0.3s cubic-bezier(0.34,1.56,0.64,1)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,color:"var(--text-inverse)",boxShadow:"0 1px 3px rgba(0,0,0,0.2)"}}>{theme==="dark"?"☽":"☀"}</div></button>);}

const USERS=[
  {id:"u-001",firstName:"Sarah",lastName:"Chen",email:"sarah.chen@acme.co",role:"admin",company:"Acme Corp",status:"active",lastLogin:"2 min ago",sessions:847,avatarColor:"#60a5fa"},
  {id:"u-002",firstName:"Lukas",lastName:"Mathis",email:"lukas@acme.co",role:"admin",company:"Acme Corp",status:"active",lastLogin:"14 min ago",sessions:1203,avatarColor:"#34d399"},
  {id:"u-003",firstName:"Raj",lastName:"Patel",email:"raj.patel@acme.co",role:"mentor",company:"Acme Corp",status:"active",lastLogin:"1 hour ago",sessions:524,avatarColor:"#fbbf24"},
  {id:"u-004",firstName:"Emily",lastName:"Zhao",email:"emily.zhao@acme.co",role:"mentor",company:"Acme Corp",status:"active",lastLogin:"3 hours ago",sessions:312,avatarColor:"#c084fc"},
  {id:"u-005",firstName:"James",lastName:"Kim",email:"james@globex.io",role:"admin",company:"Globex Industries",status:"active",lastLogin:"30 min ago",sessions:678,avatarColor:"#f472b6"},
  {id:"u-006",firstName:"Ana",lastName:"Rivera",email:"ana.r@globex.io",role:"user",company:"Globex Industries",status:"active",lastLogin:"2 hours ago",sessions:189,avatarColor:"#fb923c"},
  {id:"u-007",firstName:"David",lastName:"Okonkwo",email:"david.o@initech.com",role:"admin",company:"Initech",status:"active",lastLogin:"45 min ago",sessions:456,avatarColor:"#818cf8"},
  {id:"u-008",firstName:"Priya",lastName:"Sharma",email:"priya@initech.com",role:"apprentice",company:"Initech",status:"active",lastLogin:"5 hours ago",sessions:87,avatarColor:"#34d399"},
  {id:"u-009",firstName:"Tom",lastName:"Wilson",email:"tom.w@soylent.co",role:"admin",company:"Soylent Corp",status:"active",lastLogin:"1 day ago",sessions:234,avatarColor:"#f87171"},
  {id:"u-010",firstName:"Lisa",lastName:"Park",email:"lisa.park@acme.co",role:"apprentice",company:"Acme Corp",status:"inactive",lastLogin:"2 weeks ago",sessions:42,avatarColor:"#64748b"},
  {id:"u-011",firstName:"Marcus",lastName:"Johnson",email:"marcus.j@globex.io",role:"user",company:"Globex Industries",status:"invited",lastLogin:"Never",sessions:0,avatarColor:"#94a3b8"},
  {id:"u-012",firstName:"Yuki",lastName:"Tanaka",email:"yuki@acme.co",role:"user",company:"Acme Corp",status:"active",lastLogin:"20 min ago",sessions:156,avatarColor:"#fbbf24"},
];

const ROLE_CFG={admin:{cVar:"--role-admin",bgVar:"--role-admin-bg",label:"Admin",icon:"⬡",permissions:["Full access","User management","System config","All features"]},mentor:{cVar:"--role-mentor",bgVar:"--role-mentor-bg",label:"Mentor",icon:"◈",permissions:["Create pipelines","Edit dashboards","Export data","View users"]},apprentice:{cVar:"--role-apprentice",bgVar:"--role-apprentice-bg",label:"Apprentice",icon:"◇",permissions:["View dashboards","Run exports","View pipelines"]},user:{cVar:"--role-user",bgVar:"--role-user-bg",label:"User",icon:"○",permissions:["View dashboards","Download exports"]}};
const STATUS_CFG={active:{cVar:"--status-active",label:"Active"},inactive:{cVar:"--status-inactive",label:"Inactive"},invited:{cVar:"--status-invited",label:"Invited"}};

const AUDIT=[
  {time:"14:32",user:"Sarah Chen",action:"Updated pipeline 'Customer 360'",type:"edit"},
  {time:"14:28",user:"Lukas Mathis",action:"Exported 'Customer Segments' as CSV",type:"export"},
  {time:"14:15",user:"Raj Patel",action:"Created dashboard 'Q1 Review'",type:"create"},
  {time:"13:58",user:"Emily Zhao",action:"Invited marcus.j@globex.io",type:"invite"},
  {time:"13:45",user:"James Kim",action:"Modified role for Ana Rivera → User",type:"permission"},
  {time:"13:22",user:"Sarah Chen",action:"Connected data source 'Snowflake'",type:"create"},
  {time:"12:50",user:"David Okonkwo",action:"Disabled export job 'Monthly Report'",type:"edit"},
  {time:"12:30",user:"Lukas Mathis",action:"Logged in from 192.168.1.42",type:"auth"},
];

function Avatar({firstName,lastName,color,size=36}){return(<div style={{width:size,height:size,borderRadius:size*0.28,background:`${color}18`,border:`1.5px solid ${color}30`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:size*0.36,fontWeight:700,color,flexShrink:0}}>{firstName[0]}{lastName[0]}</div>);}

function UserRow({user,isSelected,onClick}){const role=ROLE_CFG[user.role];const status=STATUS_CFG[user.status];return(
  <div onClick={onClick} className="user-row" style={{display:"grid",gridTemplateColumns:"44px 1fr 100px 80px 100px",alignItems:"center",gap:12,padding:"10px 16px",cursor:"pointer",borderBottom:"1px solid var(--border-subtle)",background:isSelected?"var(--accent-subtle)":"transparent",borderLeft:isSelected?"2px solid var(--accent)":"2px solid transparent",transition:"all 0.15s"}}>
    <Avatar firstName={user.firstName} lastName={user.lastName} color={user.avatarColor} size={34}/>
    <div><div style={{fontSize:12,fontWeight:600,color:"var(--text-primary)"}}>{user.firstName} {user.lastName}</div><div style={{fontSize:10,color:"var(--text-quaternary)",fontFamily:"'JetBrains Mono',monospace"}}>{user.email}</div></div>
    <span style={{fontSize:9,fontWeight:600,color:`var(${role.cVar})`,background:`var(${role.bgVar})`,padding:"3px 8px",borderRadius:10,textTransform:"uppercase",letterSpacing:"0.04em",textAlign:"center",display:"inline-block",width:"fit-content"}}>{role.icon} {role.label}</span>
    <span style={{fontSize:10,color:`var(${status.cVar})`,fontWeight:500}}>{status.label}</span>
    <span style={{fontSize:10,color:"var(--text-quaternary)",fontFamily:"'JetBrains Mono',monospace",textAlign:"right"}}>{user.lastLogin}</span>
  </div>);}

export default function UsersFeature(){
  const[selectedId,setSelectedId]=useState("u-002");const[filterRole,setFilterRole]=useState("all");const[filterCompany,setFilterCompany]=useState("all");const[searchQuery,setSearchQuery]=useState("");const[activeTab,setActiveTab]=useState("users");const[theme,setTheme]=useState("dark");
  const selected=USERS.find(u=>u.id===selectedId);const companies=[...new Set(USERS.map(u=>u.company))];
  const filtered=USERS.filter(u=>(filterRole==="all"||u.role===filterRole)&&(filterCompany==="all"||u.company===filterCompany)&&(searchQuery===""||`${u.firstName} ${u.lastName} ${u.email}`.toLowerCase().includes(searchQuery.toLowerCase())));
  const tokens=TK[theme];const cssVars={};Object.entries(tokens).forEach(([k,v])=>{cssVars[k]=v});

  return(
    <div style={{minHeight:"100vh",background:"var(--bg-root)",color:"var(--text-primary)",fontFamily:"'DM Sans', -apple-system, sans-serif",transition:"background 0.4s, color 0.4s",...cssVars}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&family=JetBrains+Mono:wght@400;500;600&display=swap');
        @keyframes fadeSlide{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        .user-row{transition:all 0.12s}.user-row:hover{background:var(--bg-surface-hover)!important}
        .tab-btn{transition:all 0.15s;cursor:pointer;font-family:'DM Sans',sans-serif}.tab-btn:hover{color:var(--text-secondary)!important}
        .chip{transition:all 0.15s;cursor:pointer;font-family:'DM Sans',sans-serif}.chip:hover{filter:brightness(1.15)}
        .act-row{transition:background 0.15s}.act-row:hover{background:var(--bg-surface-hover)}
        *{box-sizing:border-box}::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:var(--scrollbar-thumb);border-radius:4px}`}</style>

      <div style={{borderBottom:"1px solid var(--border-default)",padding:"14px 28px",display:"flex",justifyContent:"space-between",alignItems:"center",background:"var(--nav-bg)",transition:"background 0.4s"}}>
        <div style={{display:"flex",alignItems:"center",gap:14}}><div style={{width:8,height:8,borderRadius:"50%",background:"var(--accent)"}}/><h1 style={{fontSize:16,fontWeight:700,margin:0}}><span style={{color:"var(--accent)"}}>Users</span><span style={{color:"var(--text-tertiary)",fontWeight:400,marginLeft:8}}>Management</span></h1></div>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          {["users","roles","audit"].map(tab=><button key={tab} className="tab-btn" onClick={()=>setActiveTab(tab)} style={{padding:"6px 14px",borderRadius:6,fontSize:11,fontWeight:600,background:activeTab===tab?"var(--accent-subtle)":"transparent",border:`1px solid ${activeTab===tab?"var(--border-strong)":"transparent"}`,color:activeTab===tab?"var(--accent)":"var(--text-quaternary)",textTransform:"capitalize"}}>{tab}</button>)}
          <div style={{width:1,height:20,background:"var(--border-default)",margin:"0 4px"}}/>
          <button style={{padding:"7px 16px",borderRadius:6,fontSize:11,fontWeight:700,cursor:"pointer",background:"linear-gradient(135deg, var(--accent-strong), var(--accent))",border:"none",color:"var(--text-inverse)",fontFamily:"'DM Sans',sans-serif"}}>+ Invite User</button>
          <Toggle theme={theme} onToggle={()=>setTheme(t=>t==="dark"?"light":"dark")}/>
        </div>
      </div>

      {activeTab==="audit"?(
        <div style={{maxWidth:800,margin:"0 auto",padding:24}}><div style={{fontSize:11,fontWeight:600,color:"var(--text-tertiary)",textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:16}}>Activity Audit Log</div>
          {AUDIT.map((log,i)=><div key={i} className="act-row" style={{display:"flex",gap:14,padding:"12px 16px",borderBottom:"1px solid var(--border-subtle)",animation:`fadeSlide 0.3s ease ${i*0.04}s both`,borderRadius:6}}>
            <span style={{width:5,height:5,borderRadius:"50%",background:`var(--${log.type})`,flexShrink:0,marginTop:6}}/>
            <div style={{flex:1}}><div style={{fontSize:12,color:"var(--text-secondary)"}}><strong style={{color:"var(--text-primary)"}}>{log.user}</strong> {log.action}</div></div>
            <span style={{fontSize:10,color:"var(--text-ghost)",fontFamily:"'JetBrains Mono',monospace",flexShrink:0}}>{log.time}</span>
          </div>)}</div>
      ):activeTab==="roles"?(
        <div style={{maxWidth:900,margin:"0 auto",padding:24}}><div style={{fontSize:11,fontWeight:600,color:"var(--text-tertiary)",textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:16}}>Role Definitions</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4, 1fr)",gap:12}}>
            {Object.entries(ROLE_CFG).map(([key,role],i)=>{const count=USERS.filter(u=>u.role===key).length;return(
              <div key={key} style={{background:"var(--bg-surface)",border:"1px solid var(--border-default)",borderRadius:12,padding:"20px 16px",textAlign:"center",animation:`fadeSlide 0.4s ease ${i*0.08}s both`,boxShadow:"var(--shadow-sm)"}}>
                <div style={{width:48,height:48,borderRadius:12,margin:"0 auto 12px",background:`var(${role.bgVar})`,border:"1px solid var(--border-default)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,color:`var(${role.cVar})`}}>{role.icon}</div>
                <div style={{fontSize:14,fontWeight:700,color:`var(${role.cVar})`,marginBottom:2}}>{role.label}</div>
                <div style={{fontSize:10,color:"var(--text-quaternary)",marginBottom:14,fontFamily:"'JetBrains Mono',monospace"}}>{count} users</div>
                <div style={{borderTop:"1px solid var(--border-subtle)",paddingTop:12}}>{role.permissions.map((p,j)=><div key={j} style={{fontSize:10,color:"var(--text-tertiary)",padding:"3px 0",display:"flex",alignItems:"center",gap:6}}><span style={{color:`var(${role.cVar})`,fontSize:8}}>✓</span> {p}</div>)}</div>
              </div>)})}
          </div></div>
      ):(
        <div style={{display:"flex",height:"calc(100vh - 53px)"}}>
          <div style={{flex:1,display:"flex",flexDirection:"column"}}>
            <div style={{padding:"12px 20px",borderBottom:"1px solid var(--border-subtle)",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div style={{display:"flex",gap:16}}>
                {[{l:"Total",v:USERS.length,c:"var(--text-secondary)"},{l:"Active",v:USERS.filter(u=>u.status==="active").length,c:"var(--color-success)"},{l:"Admins",v:USERS.filter(u=>u.role==="admin").length,c:"var(--color-danger)"},{l:"Companies",v:companies.length,c:"var(--color-info)"}].map(s=><div key={s.l}><div style={{fontSize:8,color:"var(--text-quaternary)",textTransform:"uppercase",letterSpacing:"0.06em"}}>{s.l}</div><div style={{fontSize:17,fontWeight:700,color:s.c,fontFamily:"'JetBrains Mono',monospace"}}>{s.v}</div></div>)}
              </div>
              <div style={{display:"flex",gap:6}}>
                <input value={searchQuery} onChange={e=>setSearchQuery(e.target.value)} placeholder="Search users…" style={{padding:"6px 10px",borderRadius:6,fontSize:11,width:160,background:"var(--bg-input)",border:"1px solid var(--border-default)",color:"var(--text-secondary)",outline:"none",fontFamily:"'DM Sans',sans-serif"}}/>
                <select value={filterCompany} onChange={e=>setFilterCompany(e.target.value)} style={{padding:"6px 8px",borderRadius:6,fontSize:10,fontWeight:500,background:"var(--bg-input)",border:"1px solid var(--border-default)",color:"var(--text-quaternary)",outline:"none",fontFamily:"'DM Sans',sans-serif",cursor:"pointer"}}><option value="all">All Companies</option>{companies.map(c=><option key={c} value={c}>{c}</option>)}</select>
              </div>
            </div>
            <div style={{padding:"8px 20px",borderBottom:"1px solid var(--border-subtle)",display:"flex",gap:4}}>
              {[{k:"all",l:"All"},...Object.entries(ROLE_CFG).map(([k,v])=>({k,l:`${v.icon} ${v.label}`}))].map(f=><button key={f.k} className="chip" onClick={()=>setFilterRole(f.k)} style={{padding:"3px 10px",borderRadius:14,fontSize:9,fontWeight:600,background:filterRole===f.k?"var(--accent-subtle)":"var(--bg-surface-hover)",border:`1px solid ${filterRole===f.k?"var(--border-strong)":"transparent"}`,color:filterRole===f.k?"var(--accent)":"var(--text-quaternary)"}}>{f.l}</button>)}
            </div>
            <div style={{display:"grid",gridTemplateColumns:"44px 1fr 100px 80px 100px",gap:12,padding:"8px 16px",fontSize:9,color:"var(--text-quaternary)",textTransform:"uppercase",letterSpacing:"0.06em",borderBottom:"1px solid var(--border-subtle)"}}><span/><span>User</span><span>Role</span><span>Status</span><span style={{textAlign:"right"}}>Last Login</span></div>
            <div style={{flex:1,overflow:"auto"}}>{filtered.map((user,i)=><div key={user.id} style={{animation:`fadeSlide 0.25s ease ${i*0.03}s both`}}><UserRow user={user} isSelected={selectedId===user.id} onClick={()=>setSelectedId(user.id)}/></div>)}</div>
          </div>

          <div style={{width:300,borderLeft:"1px solid var(--border-default)",padding:"16px 18px",overflow:"auto",flexShrink:0}}>
            {selected?(<div style={{animation:"fadeSlide 0.25s ease"}}>
              <div style={{textAlign:"center",marginBottom:20}}>
                <Avatar firstName={selected.firstName} lastName={selected.lastName} color={selected.avatarColor} size={56}/>
                <h2 style={{fontSize:16,fontWeight:700,color:"var(--text-primary)",margin:"10px 0 2px"}}>{selected.firstName} {selected.lastName}</h2>
                <div style={{fontSize:11,color:"var(--text-quaternary)",fontFamily:"'JetBrains Mono',monospace"}}>{selected.email}</div>
                <div style={{display:"flex",gap:8,justifyContent:"center",marginTop:10}}>
                  <span style={{fontSize:9,fontWeight:600,color:`var(${ROLE_CFG[selected.role].cVar})`,background:`var(${ROLE_CFG[selected.role].bgVar})`,padding:"3px 10px",borderRadius:10}}>{ROLE_CFG[selected.role].icon} {ROLE_CFG[selected.role].label}</span>
                  <span style={{fontSize:9,fontWeight:600,color:`var(${STATUS_CFG[selected.status].cVar})`,background:"var(--bg-surface-hover)",padding:"3px 10px",borderRadius:10}}>● {STATUS_CFG[selected.status].label}</span>
                </div>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:20}}>
                {[{l:"Sessions",v:selected.sessions.toLocaleString()},{l:"Company",v:selected.company.split(" ")[0]},{l:"Last Login",v:selected.lastLogin},{l:"Role",v:ROLE_CFG[selected.role].label}].map(s=><div key={s.l} style={{background:"var(--bg-surface)",border:"1px solid var(--border-default)",borderRadius:8,padding:"8px 10px",textAlign:"center"}}><div style={{fontSize:8,color:"var(--text-quaternary)",textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:3}}>{s.l}</div><div style={{fontSize:12,fontWeight:600,color:"var(--text-secondary)",fontFamily:"'JetBrains Mono',monospace"}}>{s.v}</div></div>)}
              </div>
              <div style={{marginBottom:20}}><div style={{fontSize:9,fontWeight:600,color:"var(--text-quaternary)",textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:8}}>Permissions</div>
                {ROLE_CFG[selected.role].permissions.map((p,i)=><div key={i} style={{padding:"6px 10px",fontSize:11,color:"var(--text-tertiary)",borderBottom:"1px solid var(--border-subtle)",display:"flex",alignItems:"center",gap:8}}><span style={{color:`var(${ROLE_CFG[selected.role].cVar})`,fontSize:10}}>✓</span> {p}</div>)}
              </div>
              <div style={{display:"flex",gap:6}}>
                <button style={{flex:1,padding:"7px 0",borderRadius:6,background:"var(--bg-surface-hover)",border:"1px solid var(--border-default)",color:"var(--text-tertiary)",fontSize:10,fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>Edit Role</button>
                <button style={{flex:1,padding:"7px 0",borderRadius:6,background:"var(--color-danger-subtle, rgba(248,113,113,0.06))",border:"1px solid var(--border-default)",color:"var(--color-danger)",fontSize:10,fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>Deactivate</button>
              </div>
            </div>):(<div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100%",color:"var(--text-ghost)",fontSize:12}}>Select a user</div>)}
          </div>
        </div>
      )}
    </div>
  );
}
