import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Eye, EyeOff, Shield, Clock, Zap } from 'lucide-react';

const previewServices = [
  { icon: '🚛', label: 'Towing' },
  { icon: '⚡', label: 'Jump Start' },
  { icon: '🔧', label: 'Flat Tire' },
  { icon: '🔑', label: 'Lockout' },
  { icon: '⛽', label: 'Fuel' },
  { icon: '✨', label: 'Detailing' },
  { icon: '🛢️', label: 'Oil Change' },
  { icon: '🔋', label: 'Battery' },
];

const AuthScreen: React.FC = () => {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { error: err } = mode === 'signup'
        ? await signUp(email, password, fullName, phone)
        : await signIn(email, password);
      if (err) throw err;
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const inputCls = "w-full h-[52px] px-5 rounded-xl text-[15px] text-white placeholder-white/25 outline-none transition-all focus:ring-1 focus:ring-orange-500/30";
  const inputStyle: React.CSSProperties = { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' };

  return (
    <div className="min-h-[100dvh] flex flex-col relative overflow-hidden" style={{ background: '#08080f' }}>
      {/* Ambient */}
      <div className="absolute top-[-20%] right-[-20%] w-[500px] h-[500px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(249,115,22,0.06) 0%, transparent 60%)' }} />
      <div className="absolute bottom-[-15%] left-[-15%] w-[400px] h-[400px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(249,115,22,0.04) 0%, transparent 60%)' }} />

      <div className="h-1 hazard-stripe" />

      {/* Logo */}
      <div className="flex flex-col items-center pt-safe px-8" style={{ paddingTop: 'max(env(safe-area-inset-top), 40px)' }}>
        <div className="relative mb-4">
          <div className="absolute inset-[-18px] rounded-[28px] animate-sos-ring" style={{ background: 'rgba(249,115,22,0.08)' }} />
          <div className="relative w-[68px] h-[68px] rounded-[18px] flex items-center justify-center animate-sos-pulse" style={{ background: 'linear-gradient(135deg, #ea580c, #d97706)', boxShadow: '0 0 40px rgba(249,115,22,0.25)' }}>
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
        </div>
        <h1 className="text-[32px] font-extrabold text-white tracking-[-0.03em]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>S.O.S</h1>
        <p className="text-[12px] text-orange-400/55 mt-0.5 font-medium tracking-[0.1em] uppercase">Superheros On Standby</p>

        {/* Road animation */}
        <div className="mt-4 mb-2 w-[160px] h-[36px] relative overflow-hidden">
          <div className="absolute bottom-0 left-0 right-0 h-[5px] rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
            <div className="absolute inset-0 flex gap-3 animate-road-scroll" style={{ width: '200%' }}>
              {Array.from({ length: 20 }).map((_, i) => <div key={i} className="w-4 h-[2px] rounded-full mt-[1.5px] flex-shrink-0" style={{ background: 'rgba(249,115,22,0.4)' }} />)}
            </div>
          </div>
          <div className="absolute bottom-[3px] left-[30%] animate-truck-bounce"><span className="text-[22px]">🚛</span></div>
        </div>
      </div>

      {/* Pre-login service grid */}
      <div className="px-6 mt-2 mb-3">
        <p className="text-[9px] font-bold text-white/15 uppercase tracking-[0.2em] text-center mb-2">Popular Services</p>
        <div className="grid grid-cols-4 gap-1.5">
          {previewServices.map(svc => (
            <div key={svc.label} className="flex flex-col items-center gap-1 py-2.5 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.03)' }}>
              <span className="text-[18px]">{svc.icon}</span>
              <span className="text-[9px] text-white/30 font-medium">{svc.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Form */}
      <div className="mt-auto px-6 pb-6 pb-safe">
        {/* Toggle */}
        <div className="flex mb-4 p-1 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.04)' }}>
          {(['signin', 'signup'] as const).map(m => (
            <button key={m} onClick={() => { setMode(m); setError(''); }}
              className={`flex-1 py-2.5 rounded-lg text-[13px] font-semibold transition-all duration-300 ${
                mode === m ? 'text-white' : 'text-white/30'
              }`}
              style={mode === m ? { background: 'rgba(249,115,22,0.15)', boxShadow: '0 2px 12px rgba(249,115,22,0.1)' } : {}}>
              {m === 'signin' ? 'Sign In' : 'Create Account'}
            </button>
          ))}
        </div>

        <form onSubmit={submit} className="space-y-2.5">
          {mode === 'signup' && (
            <>
              <input type="text" placeholder="Full Name" value={fullName} onChange={e => setFullName(e.target.value)} required className={inputCls} style={inputStyle} />
              <input type="tel" placeholder="Phone (optional)" value={phone} onChange={e => setPhone(e.target.value)} className={inputCls} style={inputStyle} />
            </>
          )}
          <input type="email" placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)} required className={inputCls} style={inputStyle} />
          <div className="relative">
            <input type={showPw ? 'text' : 'password'} placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} className={`${inputCls} pr-14`} style={inputStyle} />
            <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/50 p-1">
              {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {error && (
            <div className="px-4 py-2.5 rounded-lg" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)' }}>
              <p className="text-red-400 text-[13px]">{error}</p>
            </div>
          )}

          <button type="submit" disabled={loading}
            className="w-full h-[52px] text-white text-[15px] font-bold rounded-xl active:scale-[0.98] transition-all disabled:opacity-50 relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #ea580c, #d97706)', boxShadow: '0 4px 24px rgba(249,115,22,0.25)' }}>
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-0 left-[-100%] w-[200%] h-full bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" style={{ animation: 'shimmer 3s infinite linear' }} />
            </div>
            {loading ? (
              <span className="flex items-center justify-center gap-2 relative z-10">
                <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                {mode === 'signin' ? 'Signing in...' : 'Creating account...'}
              </span>
            ) : <span className="relative z-10">{mode === 'signin' ? 'Sign In' : 'Create Account'}</span>}
          </button>
        </form>

        {mode === 'signin' && (
          <p className="text-center text-white/25 text-[13px] mt-3">
            Forgot password? <button className="text-orange-400/70 font-medium">Reset</button>
          </p>
        )}

        {/* Trust bar */}
        <div className="flex items-center justify-center gap-4 mt-5 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
          {[
            { icon: Shield, label: 'Verified Pros' },
            { icon: Clock, label: '24/7 Ready' },
            { icon: Zap, label: '8 Min Avg' },
          ].map(item => (
            <span key={item.label} className="flex items-center gap-1 text-[10px] text-white/20 font-medium">
              <item.icon className="w-3 h-3 text-orange-400/40" />
              {item.label}
            </span>
          ))}
        </div>
      </div>

      <style>{`@keyframes shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }`}</style>
    </div>
  );
};

export default AuthScreen;
