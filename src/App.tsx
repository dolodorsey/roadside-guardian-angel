import React, { useState, useEffect, useCallback } from 'react';

/* ─── palette ─── */
const C = {
  bg: '#080c14', card: '#0f1520', card2: '#151d2e', red: '#ef4444', redDark: '#b91c1c',
  green: '#22c55e', greenDark: '#16a34a', blue: '#3b82f6', orange: '#f59e0b',
  white: '#ffffff', gray: '#94a3b8', grayDark: '#475569', grayDarker: '#1e293b',
  border: '#1e293b', text: '#e2e8f0', muted: '#64748b', yellow: '#facc15',
};

/* ─── shared inline helpers ─── */
const flex = (dir='row',align='center',justify='center',gap=0):React.CSSProperties=>({display:'flex',flexDirection:dir as any,alignItems:align,justifyContent:justify,gap});
const btn = (bg:string,color='#fff',extra?:React.CSSProperties):React.CSSProperties=>({background:bg,color,border:'none',borderRadius:12,padding:'14px 28px',fontSize:16,fontWeight:700,cursor:'pointer',transition:'all .2s',...extra});
const cardStyle:React.CSSProperties={background:C.card,borderRadius:16,padding:20,border:`1px solid ${C.border}`};
const inputStyle:React.CSSProperties={width:'100%',padding:'14px 16px',background:C.card2,border:`1px solid ${C.border}`,borderRadius:12,color:C.white,fontSize:14,outline:'none',boxSizing:'border-box'};
const errText:React.CSSProperties={fontSize:12,color:C.red,marginTop:4};

/* ─── types ─── */
type Screen = 'landing'|'auth-citizen'|'auth-hero'|'citizen'|'hero';
type CitizenTab = 'home'|'history'|'wallet'|'profile';
type HeroTab = 'dashboard'|'jobs'|'earnings'|'profile';
type RequestStep = 'confirm'|'finding'|'found'|'tracking';

const SERVICES = [
  {name:'Flat Tire',emoji:'🛞',price:45,eta:'12 min'},
  {name:'Jump Start',emoji:'⚡',price:35,eta:'10 min'},
  {name:'Fuel Delivery',emoji:'⛽',price:40,eta:'15 min'},
  {name:'Lockout',emoji:'🔑',price:55,eta:'12 min'},
  {name:'Tow Service',emoji:'🚛',price:95,eta:'20 min'},
  {name:'Battery Replace',emoji:'🔋',price:85,eta:'18 min'},
];

const PLANS = [
  {name:'Shield Free',price:'$0',period:'forever',features:['Pay-as-you-go pricing','Standard response time','Basic GPS tracking','Email support'],popular:false},
  {name:'Shield',price:'$7.99',period:'/month',features:['15% off all services','Priority response','Live GPS tracking','24/7 Command Center','Free tow under 10mi'],popular:true},
  {name:'Shield Pro',price:'$14.99',period:'/month',features:['25% off all services','VIP priority response','Live GPS + ETA alerts','24/7 Command Center','Free tow under 25mi','Family coverage (up to 4)','Rental car assistance'],popular:false},
];

const REVIEWS = [
  {text:'S.O.S saved me when I was stranded with a flat tire at 2 AM. The Hero arrived in 6 minutes and had me back on the road quickly.',name:'Sarah M.',plan:'Shield Member',stars:5},
  {text:'As a rideshare driver, S.O.S keeps me earning. The family plan covers my whole fleet at an amazing price.',name:'Mike R.',plan:'Family Plan',stars:5},
  {text:'The Hero was professional, fast, and kind. Best roadside experience I\'ve ever had.',name:'Jessica L.',plan:'Shield Pro',stars:5},
];

const MISSIONS_HISTORY = [
  {customer:'Alex T.',service:'Jump Start',earned:35,time:'2:15 PM',rating:5},
  {customer:'Maria S.',service:'Flat Tire',earned:45,time:'11:30 AM',rating:5},
  {customer:'David K.',service:'Lockout',earned:55,time:'9:45 AM',rating:4},
  {customer:'Linda P.',service:'Fuel Delivery',earned:40,time:'Yesterday',rating:5},
];

const CITIZEN_HISTORY = [
  {service:'Jump Start',hero:'Marcus J.',date:'Today, 2:15 PM',cost:35,status:'Completed'},
  {service:'Flat Tire',hero:'Diana K.',date:'Jan 15, 9:30 AM',cost:45,status:'Completed'},
  {service:'Lockout',hero:'Carlos R.',date:'Dec 28, 7:45 PM',cost:55,status:'Completed'},
];

/* ─── validation helpers ─── */
const isValidEmail = (e:string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
const passwordStrength = (p:string):{label:string;color:string;pct:number} => {
  if(p.length<8) return {label:'Too short',color:C.red,pct:20};
  let score=0;
  if(/[a-z]/.test(p)) score++;
  if(/[A-Z]/.test(p)) score++;
  if(/[0-9]/.test(p)) score++;
  if(/[^a-zA-Z0-9]/.test(p)) score++;
  if(score<=1) return {label:'Weak',color:C.orange,pct:40};
  if(score===2) return {label:'Fair',color:C.yellow,pct:60};
  if(score===3) return {label:'Good',color:C.blue,pct:80};
  return {label:'Strong',color:C.green,pct:100};
};

/* ════════════════════════════════════════ */
/*               MAIN APP                  */
/* ════════════════════════════════════════ */
const App: React.FC = () => {
  const [screen, setScreen] = useState<Screen>('landing');
  const [fade, setFade] = useState(true);
  const [userName, setUserName] = useState('');

  const navigate = useCallback((s:Screen)=>{
    setFade(false);
    setTimeout(()=>{setScreen(s);setFade(true);window.scrollTo(0,0);},200);
  },[]);

  const wrapper:React.CSSProperties = {
    maxWidth:430,margin:'0 auto',minHeight:'100dvh',background:C.bg,
    fontFamily:'-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif',
    color:C.text,position:'relative',overflow:'hidden',
    opacity:fade?1:0,transition:'opacity .2s',
  };

  return (
    <div style={wrapper}>
      {screen==='landing' && <Landing onGetHelp={()=>navigate('auth-citizen')} onHeroPortal={()=>navigate('auth-hero')}/>}
      {screen==='auth-citizen' && <AuthScreen role="citizen" onBack={()=>navigate('landing')} onLogin={(n)=>{setUserName(n);navigate('citizen');}}/>}
      {screen==='auth-hero' && <AuthScreen role="hero" onBack={()=>navigate('landing')} onLogin={(n)=>{setUserName(n);navigate('hero');}}/>}
      {screen==='citizen' && <CitizenApp userName={userName} onBack={()=>navigate('landing')}/>}
      {screen==='hero' && <HeroDashboard userName={userName} onBack={()=>navigate('landing')}/>}
    </div>
  );
};

/* ════════════════════════════════════════ */
/*             AUTH SCREEN                 */
/* ════════════════════════════════════════ */
const AuthScreen:React.FC<{role:'citizen'|'hero';onBack:()=>void;onLogin:(name:string)=>void}> = ({role,onBack,onLogin}) => {
  const [mode,setMode]=useState<'signin'|'signup'>('signin');
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [name,setName]=useState('');
  const [touched,setTouched]=useState<{email?:boolean;password?:boolean;name?:boolean}>({});

  const isCitizen=role==='citizen';
  const accent=isCitizen?C.red:C.green;
  const title=isCitizen?'Citizen Account':'Hero Portal';
  const subtitle=isCitizen?'Get rescue assistance anytime':'Join the Hero Network';
  const icon=isCitizen?'🚨':'🦸';

  const emailErr = touched.email && !isValidEmail(email) ? 'Please enter a valid email address' : '';
  const pwErr = touched.password && password.length>0 && password.length<8 ? 'Password must be at least 8 characters' : '';
  const nameErr = touched.name && mode==='signup' && name.trim().length<2 ? 'Name must be at least 2 characters' : '';
  const pwInfo = password.length>0 ? passwordStrength(password) : null;

  const isValid = isValidEmail(email) && password.length>=8 && (mode==='signin' || name.trim().length>=2);

  const handleSubmit = () => {
    if(!isValid) return;
    const displayName = mode==='signup' ? name.trim() : email.split('@')[0];
    onLogin(displayName);
  };

  return (
    <div style={{minHeight:'100dvh',background:C.bg,...flex('column','stretch','flex-start')}}>
      <div style={{padding:'16px 20px',...flex('row','center','space-between')}}>
        <button onClick={onBack} style={{background:'transparent',border:'none',color:C.gray,fontSize:14,cursor:'pointer',fontWeight:600}}>← Back</button>
        <div style={{fontWeight:800,fontSize:16,color:C.white,letterSpacing:1}}>S.O.S</div>
        <div style={{width:50}}/>
      </div>

      <div style={{flex:1,...flex('column','center','center'),padding:'40px 24px'}}>
        <div style={{width:80,height:80,borderRadius:'50%',background:`${accent}20`,...flex('row','center','center'),fontSize:40,marginBottom:20}}>{icon}</div>
        <h1 style={{fontSize:24,fontWeight:800,color:C.white,margin:'0 0 4px'}}>{title}</h1>
        <p style={{fontSize:14,color:C.muted,margin:'0 0 32px'}}>{subtitle}</p>

        {/* Tabs */}
        <div style={{...flex('row','center','center',0),width:'100%',marginBottom:28,background:C.card,borderRadius:12,padding:4,border:`1px solid ${C.border}`}}>
          <button onClick={()=>{setMode('signin');setTouched({});}} style={{flex:1,padding:'10px 0',borderRadius:10,border:'none',cursor:'pointer',fontSize:14,fontWeight:700,background:mode==='signin'?accent:'transparent',color:mode==='signin'?C.white:C.muted,transition:'all .2s'}}>Sign In</button>
          <button onClick={()=>{setMode('signup');setTouched({});}} style={{flex:1,padding:'10px 0',borderRadius:10,border:'none',cursor:'pointer',fontSize:14,fontWeight:700,background:mode==='signup'?accent:'transparent',color:mode==='signup'?C.white:C.muted,transition:'all .2s'}}>Create Account</button>
        </div>

        {/* Form */}
        <div style={{width:'100%',maxWidth:360}}>
          {mode==='signup'&&(
            <div style={{marginBottom:16}}>
              <label style={{fontSize:12,color:C.muted,fontWeight:600,marginBottom:6,display:'block'}}>Full Name</label>
              <input value={name} onChange={e=>setName(e.target.value)} onBlur={()=>setTouched(t=>({...t,name:true}))} placeholder="Enter your full name" style={{...inputStyle,borderColor:nameErr?C.red:C.border}}/>
              {nameErr && <div style={errText}>{nameErr}</div>}
            </div>
          )}
          <div style={{marginBottom:16}}>
            <label style={{fontSize:12,color:C.muted,fontWeight:600,marginBottom:6,display:'block'}}>Email</label>
            <input type="email" value={email} onChange={e=>setEmail(e.target.value)} onBlur={()=>setTouched(t=>({...t,email:true}))} placeholder="you@example.com" style={{...inputStyle,borderColor:emailErr?C.red:C.border}}/>
            {emailErr && <div style={errText}>{emailErr}</div>}
          </div>
          <div style={{marginBottom:8}}>
            <label style={{fontSize:12,color:C.muted,fontWeight:600,marginBottom:6,display:'block'}}>Password</label>
            <input type="password" value={password} onChange={e=>setPassword(e.target.value)} onBlur={()=>setTouched(t=>({...t,password:true}))} placeholder="••••••••" style={{...inputStyle,borderColor:pwErr?C.red:C.border}}/>
            {pwErr && <div style={errText}>{pwErr}</div>}
          </div>
          {/* Password strength */}
          {pwInfo && (
            <div style={{marginBottom:20}}>
              <div style={{height:4,background:C.grayDarker,borderRadius:2,overflow:'hidden',marginBottom:4}}>
                <div style={{height:'100%',width:`${pwInfo.pct}%`,background:pwInfo.color,borderRadius:2,transition:'all .3s'}}/>
              </div>
              <div style={{fontSize:11,color:pwInfo.color,fontWeight:600}}>{pwInfo.label}</div>
            </div>
          )}
          {!pwInfo && <div style={{height:16,marginBottom:8}}/>}

          <button onClick={handleSubmit} disabled={!isValid} style={{...btn(accent),width:'100%',fontSize:16,marginBottom:16,opacity:isValid?1:0.4,cursor:isValid?'pointer':'not-allowed'}}>
            {mode==='signin'?'Sign In':'Create Account'}
          </button>

          {mode==='signin'&&(
            <button style={{background:'none',border:'none',color:accent,fontSize:13,cursor:'pointer',width:'100%',textAlign:'center',fontWeight:600}}>Forgot Password?</button>
          )}
        </div>

        <div style={{...flex('row','center','center',12),width:'100%',maxWidth:360,margin:'24px 0'}}>
          <div style={{flex:1,height:1,background:C.border}}/>
          <span style={{fontSize:12,color:C.muted}}>or continue with</span>
          <div style={{flex:1,height:1,background:C.border}}/>
        </div>
        <div style={{...flex('row','center','center',12),width:'100%',maxWidth:360}}>
          {['Google','Apple'].map(provider=>(
            <button key={provider} onClick={()=>onLogin(provider+' User')} style={{flex:1,padding:'12px 0',background:C.card,border:`1px solid ${C.border}`,borderRadius:12,color:C.white,fontSize:14,fontWeight:600,cursor:'pointer'}}>
              {provider==='Google'?'🔵':'🍎'} {provider}
            </button>
          ))}
        </div>
        <p style={{fontSize:11,color:C.grayDark,marginTop:32,textAlign:'center',maxWidth:300}}>
          By continuing, you agree to S.O.S Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
};

/* ════════════════════════════════════════ */
/*            LANDING PAGE                 */
/* ════════════════════════════════════════ */
const Landing:React.FC<{onGetHelp:()=>void;onHeroPortal:()=>void}> = ({onGetHelp,onHeroPortal}) => {
  const [scrollY,setScrollY]=useState(0);
  useEffect(()=>{const h=()=>setScrollY(window.scrollY);window.addEventListener('scroll',h);return()=>window.removeEventListener('scroll',h);},[]);

  return (
    <div>
      {/* NAV */}
      <nav style={{position:'sticky',top:0,zIndex:50,background:scrollY>50?'rgba(8,12,20,0.95)':C.bg,backdropFilter:scrollY>50?'blur(12px)':'none',borderBottom:`1px solid ${scrollY>50?C.border:'transparent'}`,padding:'12px 20px',transition:'all .3s',...flex('row','center','space-between')}}>
        <div style={flex('row','center','flex-start',8)}>
          <div style={{width:36,height:36,borderRadius:'50%',background:C.red,...flex('row','center','center'),fontWeight:900,fontSize:14,color:C.white}}>SOS</div>
          <div>
            <div style={{fontWeight:800,fontSize:16,color:C.white,letterSpacing:1}}>S.O.S</div>
            <div style={{fontSize:9,color:C.muted,letterSpacing:0.5}}>Superheros On Standby</div>
          </div>
        </div>
        <div style={flex('row','center','flex-end',8)}>
          <button onClick={onGetHelp} style={{background:'transparent',border:`1px solid ${C.border}`,color:C.gray,borderRadius:8,padding:'8px 14px',fontSize:12,cursor:'pointer',fontWeight:600}}>Sign In</button>
          <button onClick={onHeroPortal} style={{background:C.card,border:`1px solid ${C.border}`,color:C.green,borderRadius:8,padding:'8px 14px',fontSize:12,cursor:'pointer',fontWeight:600}}>Hero Portal</button>
        </div>
      </nav>

      {/* HERO */}
      <section style={{padding:'60px 24px 40px',textAlign:'center',background:`radial-gradient(ellipse at 50% 0%,rgba(239,68,68,0.12) 0%,transparent 60%)`}}>
        <div style={{fontSize:10,color:C.red,fontWeight:700,letterSpacing:3,textTransform:'uppercase',marginBottom:12}}>Emergency Rescue Network</div>
        <h1 style={{fontSize:48,fontWeight:900,color:C.white,margin:'0 0 8px',letterSpacing:2}}>S.O.S</h1>
        <p style={{fontSize:18,color:C.gray,margin:'0 0 4px',fontWeight:500}}>Superheros On Standby</p>
        <p style={{fontSize:14,color:C.muted,margin:'0 0 32px',fontStyle:'italic'}}>There's Always a Superhero On Standby!</p>
        <div style={flex('column','center','center',12)}>
          <button onClick={onGetHelp} style={{...btn(C.red),width:'100%',maxWidth:280,fontSize:18,padding:'16px 32px',boxShadow:`0 0 30px ${C.red}40`}}>🚨 Get Help Now</button>
          <button onClick={onHeroPortal} style={{...btn('transparent',C.white,{border:`2px solid ${C.border}`,width:'100%',maxWidth:280})}}>🦸 Become a Hero</button>
        </div>
        <div style={{...flex('row','center','center',20),marginTop:32,flexWrap:'wrap'}}>
          {[['✓','Verified Heroes'],['⚡','Avg 8min Response'],['⭐','4.9/5 Rating']].map(([ic,label])=>(
            <div key={label} style={{...flex('row','center','center',6),fontSize:12,color:C.gray}}>
              <span style={{color:C.green}}>{ic}</span>{label}
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{padding:'48px 24px',borderTop:`1px solid ${C.border}`}}>
        <h2 style={{fontSize:24,fontWeight:800,textAlign:'center',color:C.white,margin:'0 0 8px'}}>How S.O.S Works</h2>
        <p style={{textAlign:'center',color:C.muted,fontSize:14,margin:'0 0 32px'}}>Help in three simple steps</p>
        {[
          {step:'1',title:'Send Your Signal',desc:'Tap SOS NOW and describe your situation. We instantly locate verified Heroes near you.',icon:'📡',color:C.red},
          {step:'2',title:'Hero Dispatched',desc:'We match you with the closest qualified Hero. Track their arrival in real-time with GPS.',icon:'🦸',color:C.blue},
          {step:'3',title:'Mission Complete',desc:'Professional service with transparent pricing. Pay securely through the app when the job is complete.',icon:'✅',color:C.green},
        ].map(s=>(
          <div key={s.step} style={{...cardStyle,...flex('row','flex-start','flex-start',16),marginBottom:16}}>
            <div style={{width:48,height:48,borderRadius:12,background:`${s.color}20`,...flex('row','center','center'),fontSize:24,flexShrink:0}}>{s.icon}</div>
            <div>
              <div style={{fontSize:12,color:s.color,fontWeight:700,marginBottom:4}}>STEP {s.step}</div>
              <div style={{fontSize:16,fontWeight:700,color:C.white,marginBottom:6}}>{s.title}</div>
              <div style={{fontSize:13,color:C.gray,lineHeight:1.5}}>{s.desc}</div>
            </div>
          </div>
        ))}
      </section>

      {/* SERVICES */}
      <section style={{padding:'48px 24px',borderTop:`1px solid ${C.border}`}}>
        <h2 style={{fontSize:24,fontWeight:800,textAlign:'center',color:C.white,margin:'0 0 8px'}}>Our Services</h2>
        <p style={{textAlign:'center',color:C.muted,fontSize:14,margin:'0 0 32px'}}>Professional rescue for every situation</p>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
          {SERVICES.map(s=>(
            <div key={s.name} style={{...cardStyle,textAlign:'center',padding:20}}>
              <div style={{fontSize:32,marginBottom:8}}>{s.emoji}</div>
              <div style={{fontSize:14,fontWeight:700,color:C.white,marginBottom:4}}>{s.name}</div>
              <div style={{fontSize:18,fontWeight:800,color:C.green}}>${s.price}</div>
              <div style={{fontSize:11,color:C.muted,marginTop:4}}>~{s.eta}</div>
            </div>
          ))}
        </div>
      </section>

      {/* SAFETY */}
      <section style={{padding:'48px 24px',borderTop:`1px solid ${C.border}`}}>
        <h2 style={{fontSize:24,fontWeight:800,textAlign:'center',color:C.white,margin:'0 0 8px'}}>Your Safety is Our Mission</h2>
        <p style={{textAlign:'center',color:C.muted,fontSize:14,margin:'0 0 32px'}}>Every Hero is thoroughly vetted and verified</p>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
          {[
            {icon:'🛡️',title:'Background Checked',desc:'Comprehensive verification for all Heroes'},
            {icon:'⭐',title:'Highly Rated',desc:'Only top-rated professionals'},
            {icon:'📍',title:'GPS Tracked',desc:'Real-time location sharing'},
            {icon:'🏢',title:'24/7 Command Center',desc:'Always available support'},
          ].map(c=>(
            <div key={c.title} style={{...cardStyle,textAlign:'center',padding:20}}>
              <div style={{fontSize:28,marginBottom:8}}>{c.icon}</div>
              <div style={{fontSize:13,fontWeight:700,color:C.white,marginBottom:6}}>{c.title}</div>
              <div style={{fontSize:11,color:C.gray,lineHeight:1.4}}>{c.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* SHIELD PLANS */}
      <section style={{padding:'48px 24px',borderTop:`1px solid ${C.border}`}}>
        <h2 style={{fontSize:24,fontWeight:800,textAlign:'center',color:C.white,margin:'0 0 8px'}}>Choose Your Shield</h2>
        <p style={{textAlign:'center',color:C.muted,fontSize:14,margin:'0 0 32px'}}>Protection for every lifestyle</p>
        {PLANS.map(p=>(
          <div key={p.name} style={{...cardStyle,marginBottom:16,border:`1px solid ${p.popular?C.red:C.border}`,position:'relative',overflow:'hidden'}}>
            {p.popular&&<div style={{position:'absolute',top:12,right:-30,background:C.red,color:C.white,fontSize:10,fontWeight:800,padding:'4px 36px',transform:'rotate(45deg)',letterSpacing:1}}>POPULAR</div>}
            <div style={{fontSize:18,fontWeight:800,color:C.white,marginBottom:4}}>{p.name}</div>
            <div style={{...flex('row','baseline','flex-start',4),marginBottom:12}}>
              <span style={{fontSize:32,fontWeight:900,color:p.popular?C.red:C.white}}>{p.price}</span>
              <span style={{fontSize:13,color:C.muted}}>{p.period}</span>
            </div>
            {p.features.map(f=>(
              <div key={f} style={{...flex('row','center','flex-start',8),marginBottom:8}}>
                <span style={{color:C.green,fontSize:14}}>✓</span>
                <span style={{fontSize:13,color:C.gray}}>{f}</span>
              </div>
            ))}
            <button style={{...btn(p.popular?C.red:C.card2,C.white,{width:'100%',marginTop:12,border:p.popular?'none':`1px solid ${C.border}`})}}>
              {p.price==='$0'?'Get Started Free':'Subscribe Now'}
            </button>
          </div>
        ))}
      </section>

      {/* TESTIMONIALS */}
      <section style={{padding:'48px 24px',borderTop:`1px solid ${C.border}`}}>
        <h2 style={{fontSize:24,fontWeight:800,textAlign:'center',color:C.white,margin:'0 0 8px'}}>What Citizens Say</h2>
        <p style={{textAlign:'center',color:C.muted,fontSize:14,margin:'0 0 32px'}}>Real stories from real people</p>
        {REVIEWS.map((r,i)=>(
          <div key={i} style={{...cardStyle,marginBottom:16}}>
            <div style={{marginBottom:8}}>{Array(r.stars).fill('⭐').join('')}</div>
            <p style={{fontSize:14,color:C.gray,lineHeight:1.6,margin:'0 0 12px',fontStyle:'italic'}}>"{r.text}"</p>
            <div style={{fontSize:13,fontWeight:700,color:C.white}}>{r.name}</div>
            <div style={{fontSize:11,color:C.muted}}>{r.plan}</div>
          </div>
        ))}
      </section>

      {/* BECOME A HERO */}
      <section style={{padding:'48px 24px',borderTop:`1px solid ${C.border}`,textAlign:'center',background:`radial-gradient(ellipse at 50% 100%,rgba(34,197,94,0.08) 0%,transparent 60%)`}}>
        <div style={{fontSize:48,marginBottom:16}}>🦸</div>
        <h2 style={{fontSize:24,fontWeight:800,color:C.white,margin:'0 0 8px'}}>Join the Hero Network</h2>
        <p style={{fontSize:14,color:C.gray,margin:'0 0 24px',maxWidth:320,marginLeft:'auto',marginRight:'auto',lineHeight:1.6}}>Earn on your schedule helping Citizens in need. Flexible hours, competitive pay, and the satisfaction of being someone's hero.</p>
        <button onClick={onHeroPortal} style={{...btn(C.green),fontSize:16,padding:'14px 40px'}}>Apply to Be a Hero</button>
      </section>

      {/* TRUST METRICS */}
      <section style={{padding:'40px 24px',borderTop:`1px solid ${C.border}`}}>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
          {[['2.5M','Citizens Protected'],['4.9','App Rating'],['8 min','Avg Response'],['98%','Missions Completed']].map(([val,label])=>(
            <div key={label} style={{textAlign:'center'}}>
              <div style={{fontSize:24,fontWeight:900,color:C.white}}>{val}</div>
              <div style={{fontSize:11,color:C.muted}}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{padding:'32px 24px',borderTop:`1px solid ${C.border}`,textAlign:'center'}}>
        <div style={{fontWeight:800,fontSize:18,color:C.white,marginBottom:4}}>S.O.S</div>
        <div style={{fontSize:12,color:C.muted,marginBottom:16}}>Help. Here. Now.</div>
        <div style={{fontSize:11,color:C.grayDark}}>© 2026 S.O.S. All rights reserved.</div>
      </footer>
    </div>
  );
};

/* ════════════════════════════════════════ */
/*             CITIZEN APP                 */
/* ════════════════════════════════════════ */
const CitizenApp:React.FC<{userName:string;onBack:()=>void}> = ({userName,onBack}) => {
  const [tab,setTab]=useState<CitizenTab>('home');
  const [selectedService,setSelectedService]=useState<typeof SERVICES[0]|null>(null);
  const [reqStep,setReqStep]=useState<RequestStep|null>(null);
  const [eta,setEta]=useState(480);
  const [notifOpen,setNotifOpen]=useState(false);

  useEffect(()=>{
    if(reqStep!=='tracking') return;
    const t=setInterval(()=>setEta(p=>Math.max(0,p-1)),1000);
    return()=>clearInterval(t);
  },[reqStep]);

  const startRequest=(svc:typeof SERVICES[0])=>{
    setSelectedService(svc);
    setReqStep('confirm');
  };

  const dispatchHero=()=>{
    setReqStep('finding');
    setTimeout(()=>setReqStep('found'),3000);
  };

  const startTracking=()=>{
    setEta(480);
    setReqStep('tracking');
  };

  const cancelRequest=()=>{
    setReqStep(null);
    setSelectedService(null);
  };

  const formatEta=(s:number)=>`${Math.floor(s/60)}:${(s%60).toString().padStart(2,'0')}`;

  /* ── Service Request Flow overlays ── */
  if(reqStep==='confirm' && selectedService) return (
    <div style={{minHeight:'100dvh',background:C.bg,...flex('column','stretch','flex-start')}}>
      <div style={{padding:'16px 20px',...flex('row','center','space-between')}}>
        <button onClick={cancelRequest} style={{background:'transparent',border:'none',color:C.gray,fontSize:14,cursor:'pointer',fontWeight:600}}>← Cancel</button>
        <div style={{fontSize:14,fontWeight:700,color:C.white}}>Confirm Service</div>
        <div style={{width:50}}/>
      </div>
      <div style={{flex:1,...flex('column','center','center'),padding:'40px 24px'}}>
        <div style={{fontSize:64,marginBottom:20}}>{selectedService.emoji}</div>
        <h2 style={{fontSize:28,fontWeight:900,color:C.white,margin:'0 0 8px'}}>{selectedService.name}</h2>
        <div style={{...cardStyle,width:'100%',marginTop:24,marginBottom:24}}>
          <div style={{...flex('row','center','space-between'),marginBottom:12}}>
            <span style={{fontSize:14,color:C.gray}}>Service Price</span>
            <span style={{fontSize:20,fontWeight:900,color:C.green}}>${selectedService.price}</span>
          </div>
          <div style={{...flex('row','center','space-between'),marginBottom:12}}>
            <span style={{fontSize:14,color:C.gray}}>Estimated ETA</span>
            <span style={{fontSize:16,fontWeight:700,color:C.white}}>~{selectedService.eta}</span>
          </div>
          <div style={{...flex('row','center','space-between')}}>
            <span style={{fontSize:14,color:C.gray}}>Service Fee</span>
            <span style={{fontSize:14,fontWeight:600,color:C.muted}}>$0.00</span>
          </div>
        </div>
        <div style={{width:'100%',padding:'16px 20px',background:`${C.blue}15`,borderRadius:12,marginBottom:24,...flex('row','center','flex-start',10)}}>
          <span style={{fontSize:18}}>📍</span>
          <div>
            <div style={{fontSize:13,fontWeight:600,color:C.white}}>Your current location</div>
            <div style={{fontSize:11,color:C.muted}}>GPS detected automatically</div>
          </div>
        </div>
        <button onClick={dispatchHero} style={{...btn(C.red),width:'100%',fontSize:18,padding:'18px 32px',boxShadow:`0 0 30px ${C.red}40`}}>🚨 Dispatch Hero</button>
      </div>
    </div>
  );

  if(reqStep==='finding') return (
    <div style={{minHeight:'100dvh',background:C.bg,...flex('column','center','center'),padding:40}}>
      <div style={{position:'relative',width:160,height:160,marginBottom:40}}>
        <div style={{position:'absolute',inset:0,borderRadius:'50%',border:`2px solid ${C.red}30`,animation:'pulse-ring 2s ease-out infinite'}}/>
        <div style={{position:'absolute',inset:20,borderRadius:'50%',border:`2px solid ${C.red}50`,animation:'pulse-ring 2s ease-out infinite .5s'}}/>
        <div style={{position:'absolute',inset:40,borderRadius:'50%',border:`2px solid ${C.red}80`,animation:'pulse-ring 2s ease-out infinite 1s'}}/>
        <div style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',width:40,height:40,borderRadius:'50%',background:C.red,boxShadow:`0 0 30px ${C.red}`,...flex('row','center','center')}}>
          <span style={{fontSize:20}}>📡</span>
        </div>
      </div>
      <div style={{fontSize:22,fontWeight:800,color:C.white,marginBottom:8}}>Finding Your Hero...</div>
      <div style={{fontSize:14,color:C.gray,textAlign:'center'}}>Searching for the closest verified Hero near you</div>
      <style>{`@keyframes pulse-ring{0%{transform:scale(1);opacity:1}100%{transform:scale(1.5);opacity:0}}`}</style>
    </div>
  );

  if(reqStep==='found') return (
    <div style={{minHeight:'100dvh',background:C.bg,...flex('column','center','center'),padding:24}}>
      <div style={{fontSize:48,marginBottom:16,animation:'bounce-in .5s ease'}}>🎉</div>
      <h2 style={{fontSize:24,fontWeight:900,color:C.white,margin:'0 0 8px'}}>Hero Found!</h2>
      <p style={{fontSize:14,color:C.gray,margin:'0 0 24px'}}>Your Hero is on the way</p>
      <div style={{...cardStyle,width:'100%',maxWidth:360}}>
        <div style={{...flex('row','center','flex-start',16),marginBottom:20}}>
          <div style={{width:64,height:64,borderRadius:'50%',background:`${C.green}20`,...flex('row','center','center'),fontSize:32}}>🦸</div>
          <div>
            <div style={{fontSize:20,fontWeight:800,color:C.white}}>Marcus J.</div>
            <div style={{fontSize:13,color:C.yellow}}>⭐ 4.9 • 847 missions</div>
          </div>
        </div>
        <div style={{...flex('row','center','space-between'),padding:'12px 0',borderTop:`1px solid ${C.border}`}}>
          <span style={{fontSize:13,color:C.gray}}>ETA</span>
          <span style={{fontSize:16,fontWeight:700,color:C.white}}>~8 min</span>
        </div>
        <div style={{...flex('row','center','space-between'),padding:'12px 0',borderTop:`1px solid ${C.border}`}}>
          <span style={{fontSize:13,color:C.gray}}>Vehicle</span>
          <span style={{fontSize:13,fontWeight:600,color:C.white}}>2022 Ford F-150</span>
        </div>
        <div style={{...flex('row','center','space-between'),padding:'12px 0',borderTop:`1px solid ${C.border}`}}>
          <span style={{fontSize:13,color:C.gray}}>Service</span>
          <span style={{fontSize:13,fontWeight:600,color:C.white}}>{selectedService?.name}</span>
        </div>
      </div>
      <button onClick={startTracking} style={{...btn(C.green),width:'100%',maxWidth:360,fontSize:16,marginTop:24}}>Track My Hero →</button>
      <style>{`@keyframes bounce-in{0%{transform:scale(0)}50%{transform:scale(1.2)}100%{transform:scale(1)}}`}</style>
    </div>
  );

  if(reqStep==='tracking') return (
    <div style={{minHeight:'100dvh',background:C.bg,...flex('column','stretch','flex-start')}}>
      <div style={{padding:'16px 20px',...flex('row','center','space-between')}}>
        <button onClick={cancelRequest} style={{background:'transparent',border:'none',color:C.gray,fontSize:14,cursor:'pointer'}}>✕ Close</button>
        <div style={{fontSize:14,fontWeight:700,color:C.green}}>Hero En Route</div>
        <div style={{width:40}}/>
      </div>
      <div style={{flex:1,minHeight:300,background:C.card,margin:'0 20px',borderRadius:16,position:'relative',overflow:'hidden',...flex('column','center','center')}}>
        <div style={{width:200,height:200,borderRadius:'50%',border:`2px dashed ${C.border}`,position:'absolute',...flex('column','center','center')}}>
          <div style={{width:120,height:120,borderRadius:'50%',border:`2px dashed ${C.border}`,position:'absolute',...flex('column','center','center')}}>
            <div style={{width:16,height:16,borderRadius:'50%',background:C.red,boxShadow:`0 0 20px ${C.red}`}}/>
          </div>
        </div>
        <div style={{position:'absolute',top:20,right:20,width:12,height:12,borderRadius:'50%',background:C.green,boxShadow:`0 0 12px ${C.green}`}}/>
        <div style={{position:'absolute',bottom:16,left:16,background:'rgba(0,0,0,0.7)',borderRadius:8,padding:'8px 12px',fontSize:11,color:C.gray}}>📍 Live GPS Tracking</div>
      </div>
      <div style={{padding:20}}>
        <div style={{...cardStyle,...flex('row','center','space-between'),marginBottom:16}}>
          <div style={flex('row','center','flex-start',12)}>
            <div style={{width:48,height:48,borderRadius:'50%',background:`${C.green}20`,...flex('row','center','center'),fontSize:24}}>🦸</div>
            <div>
              <div style={{fontSize:16,fontWeight:700,color:C.white}}>Marcus J.</div>
              <div style={{fontSize:12,color:C.muted}}>⭐ 4.9 • 2022 Ford F-150</div>
            </div>
          </div>
          <div style={{textAlign:'right'}}>
            <div style={{fontSize:24,fontWeight:900,color:C.red,fontVariantNumeric:'tabular-nums'}}>{formatEta(eta)}</div>
            <div style={{fontSize:10,color:C.muted}}>ETA</div>
          </div>
        </div>
        <div style={flex('row','center','center',12)}>
          <button style={{...btn(C.card2,C.white,{flex:1,border:`1px solid ${C.border}`})}}>📞 Call</button>
          <button style={{...btn(C.card2,C.white,{flex:1,border:`1px solid ${C.border}`})}}>💬 Message</button>
          <button onClick={cancelRequest} style={{...btn(C.card2,C.red,{flex:1,border:`1px solid ${C.red}40`})}}>Cancel</button>
        </div>
      </div>
    </div>
  );

  /* ── Main Citizen Tabs ── */
  return (
    <div style={{minHeight:'100dvh',background:C.bg,paddingBottom:80}}>
      {/* Header */}
      <div style={{padding:'16px 20px',...flex('row','center','space-between')}}>
        <div style={flex('row','center','flex-start',10)}>
          <div style={{width:32,height:32,borderRadius:'50%',background:C.red,...flex('row','center','center'),fontWeight:900,fontSize:10,color:C.white}}>SOS</div>
          <div>
            <div style={{fontSize:14,fontWeight:700,color:C.white}}>Hi, {userName || 'Citizen'} 👋</div>
            <div style={{fontSize:11,color:C.muted}}>Shield Free Member</div>
          </div>
        </div>
        <button onClick={()=>setNotifOpen(!notifOpen)} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,width:40,height:40,cursor:'pointer',...flex('row','center','center'),position:'relative'}}>
          <span style={{fontSize:18}}>🔔</span>
          <div style={{position:'absolute',top:6,right:6,width:8,height:8,borderRadius:'50%',background:C.red}}/>
        </button>
      </div>

      {/* Notification dropdown */}
      {notifOpen && (
        <div style={{margin:'0 20px 16px',padding:16,background:C.card,borderRadius:12,border:`1px solid ${C.border}`}}>
          <div style={{fontSize:13,fontWeight:700,color:C.white,marginBottom:12}}>Notifications</div>
          {['🎉 Welcome to S.O.S! Your account is ready.','🛡️ Upgrade to Shield for priority response.'].map((n,i)=>(
            <div key={i} style={{padding:'10px 0',borderBottom:i===0?`1px solid ${C.border}`:'none',fontSize:13,color:C.gray}}>{n}</div>
          ))}
        </div>
      )}

      {tab==='home'&&(
        <>
          {/* Map area */}
          <div style={{margin:'0 20px',height:200,background:C.card,borderRadius:20,position:'relative',overflow:'hidden',...flex('column','center','center')}}>
            <div style={{position:'absolute',inset:0,background:`radial-gradient(circle at 50% 50%,${C.card2} 0%,${C.bg} 100%)`}}/>
            <div style={{position:'absolute',inset:0,backgroundImage:`linear-gradient(${C.border} 1px,transparent 1px),linear-gradient(90deg,${C.border} 1px,transparent 1px)`,backgroundSize:'40px 40px',opacity:0.3}}/>
            <div style={{position:'relative',width:16,height:16,borderRadius:'50%',background:C.blue,boxShadow:`0 0 20px ${C.blue}80`}}/>
            <div style={{position:'absolute',bottom:12,left:12,background:'rgba(0,0,0,0.6)',borderRadius:8,padding:'6px 10px',fontSize:11,color:C.gray}}>📍 Your location</div>
          </div>

          {/* SOS Button */}
          <div style={{...flex('column','center','center'),padding:'20px 20px 12px'}}>
            <button onClick={()=>startRequest(SERVICES[0])} style={{width:140,height:140,borderRadius:'50%',background:`radial-gradient(circle,${C.red},${C.redDark})`,border:'none',color:C.white,fontSize:16,fontWeight:900,cursor:'pointer',boxShadow:`0 0 50px ${C.red}50`,letterSpacing:1,animation:'sos-pulse 2s ease-in-out infinite'}}>
              🚨<br/>SOS<br/><span style={{fontSize:11,fontWeight:600}}>Get Help Now</span>
            </button>
          </div>
          <style>{`@keyframes sos-pulse{0%,100%{box-shadow:0 0 30px #ef444450}50%{box-shadow:0 0 60px #ef444480}}`}</style>

          {/* Service cards grid */}
          <div style={{padding:'8px 20px'}}>
            <div style={{fontSize:15,fontWeight:700,color:C.white,marginBottom:12}}>Services</div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:10}}>
              {SERVICES.map(s=>(
                <button key={s.name} onClick={()=>startRequest(s)} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:14,padding:'14px 8px',cursor:'pointer',textAlign:'center'}}>
                  <div style={{fontSize:28,marginBottom:4}}>{s.emoji}</div>
                  <div style={{fontSize:11,color:C.white,fontWeight:600}}>{s.name}</div>
                  <div style={{fontSize:12,color:C.green,fontWeight:800}}>${s.price}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Recent history preview */}
          <div style={{padding:'20px 20px 0'}}>
            <div style={{fontSize:15,fontWeight:700,color:C.white,marginBottom:12}}>Recent Rescues</div>
            {CITIZEN_HISTORY.map((h,i)=>(
              <div key={i} style={{...flex('row','center','space-between'),padding:'12px 0',borderBottom:i<CITIZEN_HISTORY.length-1?`1px solid ${C.border}`:'none'}}>
                <div>
                  <div style={{fontSize:14,fontWeight:600,color:C.white}}>{h.service}</div>
                  <div style={{fontSize:11,color:C.muted}}>{h.hero} • {h.date}</div>
                </div>
                <div style={{fontSize:14,fontWeight:700,color:C.white}}>${h.cost}</div>
              </div>
            ))}
          </div>
        </>
      )}

      {tab==='history'&&(
        <div style={{padding:20}}>
          <h2 style={{fontSize:20,fontWeight:800,color:C.white,marginBottom:16}}>Mission History</h2>
          {CITIZEN_HISTORY.map((h,i)=>(
            <div key={i} style={{...cardStyle,...flex('row','center','space-between'),marginBottom:12}}>
              <div>
                <div style={{fontSize:15,fontWeight:700,color:C.white}}>{h.service}</div>
                <div style={{fontSize:12,color:C.muted}}>{h.hero} • {h.date}</div>
                <div style={{fontSize:11,color:C.green,marginTop:4}}>✓ {h.status}</div>
              </div>
              <div style={{fontSize:18,fontWeight:800,color:C.white}}>${h.cost}</div>
            </div>
          ))}
        </div>
      )}

      {tab==='wallet'&&(
        <div style={{padding:20}}>
          <h2 style={{fontSize:20,fontWeight:800,color:C.white,marginBottom:16}}>Wallet</h2>
          <div style={{...cardStyle,textAlign:'center',marginBottom:20}}>
            <div style={{fontSize:11,color:C.muted,marginBottom:4}}>S.O.S Balance</div>
            <div style={{fontSize:36,fontWeight:900,color:C.green}}>$0.00</div>
          </div>
          <div style={{...cardStyle,marginBottom:12}}>
            <div style={{fontSize:14,fontWeight:700,color:C.white,marginBottom:12}}>Payment Methods</div>
            <div style={{...flex('row','center','space-between'),padding:'12px 0',borderBottom:`1px solid ${C.border}`}}>
              <span style={{fontSize:14,color:C.gray}}>💳 •••• 4242</span>
              <span style={{fontSize:12,color:C.green}}>Default</span>
            </div>
            <button style={{...btn('transparent',C.blue,{border:'none',padding:'12px 0',fontSize:13,fontWeight:600})}}>+ Add Payment Method</button>
          </div>
          <div style={cardStyle}>
            <div style={{fontSize:14,fontWeight:700,color:C.white,marginBottom:12}}>Recent Charges</div>
            {CITIZEN_HISTORY.map((h,i)=>(
              <div key={i} style={{...flex('row','center','space-between'),padding:'10px 0',borderBottom:i<CITIZEN_HISTORY.length-1?`1px solid ${C.border}`:'none'}}>
                <span style={{fontSize:13,color:C.gray}}>{h.service} • {h.date}</span>
                <span style={{fontSize:13,fontWeight:700,color:C.white}}>${h.cost}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab==='profile'&&(
        <div style={{padding:20,...flex('column','center','center'),minHeight:'60vh'}}>
          <div style={{width:80,height:80,borderRadius:'50%',background:C.card2,...flex('row','center','center'),fontSize:36,marginBottom:16}}>👤</div>
          <div style={{fontSize:18,fontWeight:700,color:C.white,marginBottom:4}}>{userName || 'Citizen'}</div>
          <div style={{fontSize:13,color:C.muted,marginBottom:24}}>Shield Free Member</div>
          {['My Profile','Shield Plans','Payment Methods','Safety Settings','Help & Support'].map(item=>(
            <div key={item} style={{...cardStyle,width:'100%',marginBottom:8,...flex('row','center','space-between'),padding:'16px 20px',cursor:'pointer'}}>
              <span style={{fontSize:14,color:C.white}}>{item}</span>
              <span style={{color:C.muted}}>→</span>
            </div>
          ))}
          <button onClick={onBack} style={{...btn('transparent',C.red,{border:'none',marginTop:16})}}>Sign Out</button>
        </div>
      )}

      {/* Bottom Nav */}
      <div style={{position:'fixed',bottom:0,left:'50%',transform:'translateX(-50%)',width:'100%',maxWidth:430,background:C.card,borderTop:`1px solid ${C.border}`,padding:'8px 0 env(safe-area-inset-bottom,8px)',...flex('row','center','space-around'),zIndex:40}}>
        {([['home','🏠','Home'],['history','📋','History'],['wallet','💳','Wallet'],['profile','👤','Profile']] as [CitizenTab,string,string][]).map(([id,ic,label])=>(
          <button key={id} onClick={()=>setTab(id)} style={{background:'none',border:'none',cursor:'pointer',...flex('column','center','center',2),padding:'6px 12px'}}>
            <span style={{fontSize:20}}>{ic}</span>
            <span style={{fontSize:10,color:tab===id?C.red:C.muted,fontWeight:tab===id?700:500}}>{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

/* ════════════════════════════════════════ */
/*           HERO DASHBOARD                */
/* ════════════════════════════════════════ */
const HeroDashboard:React.FC<{userName:string;onBack:()=>void}> = ({userName,onBack}) => {
  const [tab,setTab]=useState<HeroTab>('dashboard');
  const [onDuty,setOnDuty]=useState(false);
  const [showAlert,setShowAlert]=useState(false);
  const [alertTimer,setAlertTimer]=useState(15);

  useEffect(()=>{
    if(!onDuty)return;
    const t=setTimeout(()=>setShowAlert(true),3000);
    return()=>clearTimeout(t);
  },[onDuty]);

  useEffect(()=>{
    if(!showAlert)return;
    setAlertTimer(15);
    const t=setInterval(()=>setAlertTimer(p=>{if(p<=1){setShowAlert(false);return 0;}return p-1;}),1000);
    return()=>clearInterval(t);
  },[showAlert]);

  const todayEarnings=175;
  const weekEarnings=840;

  return (
    <div style={{minHeight:'100dvh',background:C.bg,paddingBottom:80}}>
      {/* Header */}
      <div style={{padding:'16px 20px',...flex('row','center','space-between')}}>
        <div style={flex('row','center','flex-start',10)}>
          <div style={{width:32,height:32,borderRadius:'50%',background:C.green,...flex('row','center','center'),fontWeight:900,fontSize:10,color:C.white}}>SOS</div>
          <div>
            <div style={{fontSize:14,fontWeight:700,color:C.white}}>{userName || 'Hero'} 🦸</div>
            <div style={{fontSize:11,color:onDuty?C.green:C.muted}}>{onDuty?'● Online':'○ Offline'}</div>
          </div>
        </div>
        {/* Online/Offline toggle */}
        <button onClick={()=>{setOnDuty(!onDuty);if(onDuty)setShowAlert(false);}} style={{...flex('row','center','center',8),background:onDuty?`${C.green}15`:`${C.grayDarker}`,border:`1px solid ${onDuty?C.green:C.border}`,borderRadius:20,padding:'8px 16px',cursor:'pointer'}}>
          <div style={{width:10,height:10,borderRadius:'50%',background:onDuty?C.green:C.gray}}/>
          <span style={{fontSize:12,fontWeight:700,color:onDuty?C.green:C.gray}}>{onDuty?'ON DUTY':'OFF DUTY'}</span>
        </button>
      </div>

      {/* Mission Alert */}
      {showAlert&&(
        <div style={{position:'fixed',inset:0,zIndex:60,background:'rgba(0,0,0,0.85)',backdropFilter:'blur(8px)',...flex('column','center','center'),padding:20}}>
          <div style={{...cardStyle,width:'100%',maxWidth:380,border:`1px solid ${C.red}60`,position:'relative'}}>
            <div style={{position:'absolute',top:12,right:12}}>
              <div style={{width:44,height:44,borderRadius:'50%',border:`3px solid ${alertTimer<=5?C.red:C.green}`,...flex('row','center','center')}}>
                <span style={{fontSize:18,fontWeight:900,color:alertTimer<=5?C.red:C.green}}>{alertTimer}</span>
              </div>
            </div>
            <div style={{fontSize:12,color:C.red,fontWeight:700,letterSpacing:2,marginBottom:8}}>🚨 INCOMING MISSION</div>
            <div style={{fontSize:20,fontWeight:800,color:C.white,marginBottom:4}}>Jump Start</div>
            <div style={{fontSize:13,color:C.gray,marginBottom:16}}>Sarah Johnson • 2020 Honda Civic</div>
            <div style={{...flex('row','center','flex-start',8),marginBottom:8}}>
              <span style={{color:C.red}}>📍</span>
              <span style={{fontSize:13,color:C.gray}}>1234 Oak Street • 2.3 mi away</span>
            </div>
            <div style={{...flex('row','center','flex-start',8),marginBottom:16}}>
              <span style={{color:C.green}}>💰</span>
              <span style={{fontSize:20,fontWeight:900,color:C.green}}>$45.00</span>
            </div>
            <div style={flex('row','center','center',12)}>
              <button onClick={()=>setShowAlert(false)} style={{...btn(C.card2,C.gray,{flex:1,border:`1px solid ${C.border}`})}}>Decline</button>
              <button onClick={()=>{setShowAlert(false);setTab('jobs');}} style={{...btn(C.red,C.white,{flex:2})}}>Accept Mission</button>
            </div>
          </div>
        </div>
      )}

      {tab==='dashboard'&&(
        <div style={{padding:20}}>
          {/* Earnings card */}
          <div style={{...cardStyle,marginBottom:16}}>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:12,textAlign:'center'}}>
              <div>
                <div style={{fontSize:11,color:C.muted}}>Today</div>
                <div style={{fontSize:24,fontWeight:900,color:C.green}}>${todayEarnings}</div>
              </div>
              <div>
                <div style={{fontSize:11,color:C.muted}}>This Week</div>
                <div style={{fontSize:24,fontWeight:900,color:C.white}}>${weekEarnings}</div>
              </div>
              <div>
                <div style={{fontSize:11,color:C.muted}}>Rating</div>
                <div style={{fontSize:24,fontWeight:900,color:C.yellow}}>⭐ 5.0</div>
              </div>
            </div>
          </div>

          {/* Availability */}
          <div style={{...cardStyle,...flex('row','center','space-between'),marginBottom:16,border:`1px solid ${onDuty?C.green:C.border}40`}}>
            <div>
              <div style={{fontSize:16,fontWeight:700,color:C.white}}>Availability</div>
              <div style={{fontSize:12,color:onDuty?C.green:C.muted}}>{onDuty?'Receiving job alerts':'Go online to receive jobs'}</div>
            </div>
            <button onClick={()=>{setOnDuty(!onDuty);if(onDuty)setShowAlert(false);}} style={{width:56,height:32,borderRadius:16,background:onDuty?C.green:C.grayDarker,border:'none',cursor:'pointer',position:'relative',transition:'all .3s'}}>
              <div style={{width:26,height:26,borderRadius:'50%',background:C.white,position:'absolute',top:3,left:onDuty?27:3,transition:'left .3s',boxShadow:'0 2px 4px rgba(0,0,0,0.3)'}}/>
            </button>
          </div>

          {/* Map */}
          <div style={{height:200,background:C.card,borderRadius:16,marginBottom:16,position:'relative',overflow:'hidden',...flex('column','center','center')}}>
            <div style={{position:'absolute',inset:0,backgroundImage:`linear-gradient(${C.border} 1px,transparent 1px),linear-gradient(90deg,${C.border} 1px,transparent 1px)`,backgroundSize:'40px 40px',opacity:0.3}}/>
            <div style={{position:'relative',width:14,height:14,borderRadius:'50%',background:onDuty?C.green:C.gray,boxShadow:onDuty?`0 0 20px ${C.green}80`:'none'}}/>
            <div style={{position:'absolute',bottom:12,left:12,background:'rgba(0,0,0,0.6)',borderRadius:8,padding:'6px 10px',fontSize:11,color:C.gray}}>{onDuty?'🟢 Live':'⚫ Offline'}</div>
          </div>

          {/* Job alerts section */}
          <div style={cardStyle}>
            <div style={{fontSize:14,fontWeight:700,color:C.white,marginBottom:12}}>Incoming Jobs</div>
            {!onDuty ? (
              <div style={{textAlign:'center',padding:'20px 0'}}>
                <div style={{fontSize:28,marginBottom:8}}>💤</div>
                <div style={{fontSize:13,color:C.muted}}>Go online to receive jobs</div>
              </div>
            ) : (
              <div style={{textAlign:'center',padding:'20px 0'}}>
                <div style={{fontSize:28,marginBottom:8}}>📡</div>
                <div style={{fontSize:13,color:C.green}}>Listening for missions...</div>
              </div>
            )}
          </div>
        </div>
      )}

      {tab==='jobs'&&(
        <div style={{padding:20}}>
          <h2 style={{fontSize:20,fontWeight:800,color:C.white,marginBottom:16}}>Recent Jobs</h2>
          {MISSIONS_HISTORY.map((m,i)=>(
            <div key={i} style={{...cardStyle,...flex('row','center','space-between'),marginBottom:12}}>
              <div>
                <div style={{fontSize:15,fontWeight:700,color:C.white}}>{m.service}</div>
                <div style={{fontSize:12,color:C.muted}}>{m.customer} • {m.time}</div>
                <div style={{fontSize:11,color:C.yellow}}>{'⭐'.repeat(m.rating)}</div>
              </div>
              <div style={{fontSize:20,fontWeight:800,color:C.green}}>+${m.earned}</div>
            </div>
          ))}
        </div>
      )}

      {tab==='earnings'&&(
        <div style={{padding:20}}>
          <h2 style={{fontSize:20,fontWeight:800,color:C.white,marginBottom:16}}>Earnings</h2>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:24}}>
            <div style={{...cardStyle,textAlign:'center'}}>
              <div style={{fontSize:11,color:C.muted}}>Today</div>
              <div style={{fontSize:32,fontWeight:900,color:C.green}}>${todayEarnings}</div>
            </div>
            <div style={{...cardStyle,textAlign:'center'}}>
              <div style={{fontSize:11,color:C.muted}}>This Week</div>
              <div style={{fontSize:32,fontWeight:900,color:C.white}}>${weekEarnings}</div>
            </div>
          </div>
          <h3 style={{fontSize:16,fontWeight:700,color:C.white,marginBottom:12}}>Payout Breakdown</h3>
          <div style={cardStyle}>
            {[['Base earnings','$720.00'],['Tips','$85.00'],['Bonuses','$35.00'],['Platform fee','-$72.00']].map(([label,val])=>(
              <div key={label} style={{...flex('row','center','space-between'),padding:'10px 0',borderBottom:`1px solid ${C.border}`}}>
                <span style={{fontSize:14,color:C.gray}}>{label}</span>
                <span style={{fontSize:14,fontWeight:700,color:(val as string).startsWith('-')?C.red:C.white}}>{val}</span>
              </div>
            ))}
            <div style={{...flex('row','center','space-between'),padding:'12px 0 0'}}>
              <span style={{fontSize:16,fontWeight:800,color:C.white}}>Net Payout</span>
              <span style={{fontSize:20,fontWeight:900,color:C.green}}>$768.00</span>
            </div>
          </div>
        </div>
      )}

      {tab==='profile'&&(
        <div style={{padding:20,...flex('column','center','center'),minHeight:'60vh'}}>
          <div style={{width:80,height:80,borderRadius:'50%',background:C.green,...flex('row','center','center'),fontSize:36,marginBottom:16}}>🦸</div>
          <div style={{fontSize:18,fontWeight:700,color:C.white,marginBottom:4}}>{userName || 'Hero'}</div>
          <div style={{fontSize:13,color:C.green,marginBottom:24}}>⭐ 4.9 Rating • 847 Missions</div>
          {['My Profile','Vehicle Info','Documents','Payout Settings','Help & Support'].map(item=>(
            <div key={item} style={{...cardStyle,width:'100%',marginBottom:8,...flex('row','center','space-between'),padding:'16px 20px',cursor:'pointer'}}>
              <span style={{fontSize:14,color:C.white}}>{item}</span>
              <span style={{color:C.muted}}>→</span>
            </div>
          ))}
          <button onClick={onBack} style={{...btn('transparent',C.red,{border:'none',marginTop:16})}}>Sign Out</button>
        </div>
      )}

      {/* Bottom Nav */}
      <div style={{position:'fixed',bottom:0,left:'50%',transform:'translateX(-50%)',width:'100%',maxWidth:430,background:C.card,borderTop:`1px solid ${C.border}`,padding:'8px 0 env(safe-area-inset-bottom,8px)',...flex('row','center','space-around'),zIndex:40}}>
        {([['dashboard','📊','Dashboard'],['jobs','🎯','Jobs'],['earnings','💰','Earnings'],['profile','👤','Profile']] as [HeroTab,string,string][]).map(([id,ic,label])=>(
          <button key={id} onClick={()=>setTab(id)} style={{background:'none',border:'none',cursor:'pointer',...flex('column','center','center',2),padding:'6px 12px'}}>
            <span style={{fontSize:20}}>{ic}</span>
            <span style={{fontSize:10,color:tab===id?C.green:C.muted,fontWeight:tab===id?700:500}}>{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default App;
