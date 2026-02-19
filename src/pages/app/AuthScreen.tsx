import { LOGO } from "@/lib/assets";
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Eye, EyeOff } from 'lucide-react';

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

  return (
    <div className="min-h-[100dvh] bg-[#0a0a0a] flex flex-col relative overflow-hidden">
      {/* Red signal arcs ambient glow (matching logo) */}
      <div className="absolute top-[10%] left-[50%] -translate-x-1/2 w-[500px] h-[300px] rounded-full bg-red-600/[0.08] blur-[100px] pointer-events-none" />

      {/* Logo Section */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 pt-safe">
        <div className="relative mb-2">
          {/* Pulsing signal ring behind logo */}
          <div className="absolute inset-[-20px] rounded-full bg-red-500/5 animate-sos-ring" />
          <img
            src={LOGO}
            alt="S.O.S — Superheros On Standby"
            className="w-[200px] h-[200px] object-contain relative z-10 drop-shadow-[0_0_40px_rgba(220,38,38,0.3)]"
          />
        </div>

        {/* Mini rescue animation */}
        <div className="mt-4 mb-2 w-[180px] h-[40px] relative overflow-hidden opacity-40">
          <div className="absolute bottom-0 left-0 right-0 h-[6px] bg-zinc-800 rounded-full overflow-hidden">
            <div className="absolute inset-0 flex gap-4 animate-road-scroll" style={{ width: '200%' }}>
              {Array.from({ length: 20 }).map((_, i) => (
                <div key={i} className="w-5 h-[2px] bg-red-500/60 rounded-full mt-[2px] flex-shrink-0" />
              ))}
            </div>
          </div>
          <div className="absolute bottom-[4px] left-[35%] animate-truck-bounce">
            <span className="text-[22px]">🚛</span>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="px-6 pb-8 pb-safe">
        {/* Toggle */}
        <div className="flex mb-5 bg-zinc-900 rounded-2xl p-1 border border-zinc-800/50">
          {(['signin', 'signup'] as const).map(m => (
            <button
              key={m}
              onClick={() => { setMode(m); setError(''); }}
              className={`flex-1 py-3 rounded-xl text-[14px] font-semibold transition-all duration-300 ${
                mode === m
                  ? 'bg-red-600 text-white shadow-[0_2px_12px_rgba(220,38,38,0.3)]'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {m === 'signin' ? 'Sign In' : 'Create Account'}
            </button>
          ))}
        </div>

        <form onSubmit={submit} className="space-y-3">
          {mode === 'signup' && (
            <>
              <input type="text" placeholder="Full Name" value={fullName}
                onChange={e => setFullName(e.target.value)} required
                className="w-full h-[56px] px-5 bg-zinc-900/60 border border-zinc-800 rounded-2xl text-white text-[16px] placeholder-zinc-600 focus:outline-none focus:border-red-500/60 focus:ring-1 focus:ring-red-500/20 transition-all" />
              <input type="tel" placeholder="Phone (optional)" value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full h-[56px] px-5 bg-zinc-900/60 border border-zinc-800 rounded-2xl text-white text-[16px] placeholder-zinc-600 focus:outline-none focus:border-red-500/60 focus:ring-1 focus:ring-red-500/20 transition-all" />
            </>
          )}
          <input type="email" placeholder="Email address" value={email}
            onChange={e => setEmail(e.target.value)} required
            className="w-full h-[56px] px-5 bg-zinc-900/60 border border-zinc-800 rounded-2xl text-white text-[16px] placeholder-zinc-600 focus:outline-none focus:border-red-500/60 focus:ring-1 focus:ring-red-500/20 transition-all" />
          <div className="relative">
            <input type={showPw ? 'text' : 'password'} placeholder="Password" value={password}
              onChange={e => setPassword(e.target.value)} required minLength={6}
              className="w-full h-[56px] px-5 pr-14 bg-zinc-900/60 border border-zinc-800 rounded-2xl text-white text-[16px] placeholder-zinc-600 focus:outline-none focus:border-red-500/60 focus:ring-1 focus:ring-red-500/20 transition-all" />
            <button type="button" onClick={() => setShowPw(!showPw)}
              className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-400 p-1">
              {showPw ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {error && <div className="px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl"><p className="text-red-400 text-[14px]">{error}</p></div>}
          <button type="submit" disabled={loading}
            className="w-full h-[58px] bg-gradient-to-r from-red-600 to-red-700 text-white text-[16px] font-bold rounded-2xl shadow-[0_4px_24px_rgba(220,38,38,0.3)] hover:shadow-[0_4px_32px_rgba(220,38,38,0.45)] active:scale-[0.98] transition-all disabled:opacity-50">
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                {mode === 'signin' ? 'Signing in...' : 'Creating account...'}
              </span>
            ) : mode === 'signin' ? 'Sign In' : 'Create Account'}
          </button>
        </form>
        {mode === 'signin' && (
          <p className="text-center text-zinc-600 text-[14px] mt-4">
            Forgot password? <button className="text-red-500 font-medium">Reset</button>
          </p>
        )}
        {/* Trust bar */}
        <div className="flex items-center justify-center gap-4 mt-8 pt-5 border-t border-zinc-800/30">
          {[['Verified Pros', 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z'],
            ['24/7 Ready', 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'],
            ['8 Min Avg', 'M13 10V3L4 14h7v7l9-11h-7z']].map(([label, path]) => (
            <span key={label as string} className="flex items-center gap-1 text-[11px] text-zinc-600 font-medium">
              <svg className="w-3.5 h-3.5 text-red-500/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d={path as string} />
              </svg>
              {label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;
