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
    <div className="min-h-[100dvh] bg-[#FFFBF5] flex flex-col relative overflow-hidden">
      {/* Warm ambient blobs */}
      <div className="absolute top-[-15%] right-[-15%] w-[500px] h-[500px] rounded-full bg-orange-100/60 blur-[80px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] rounded-full bg-amber-100/50 blur-[80px] pointer-events-none" />

      {/* Hazard stripe accent bar */}
      <div className="h-1.5 hazard-stripe" />

      {/* Logo + Illustration */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 pt-safe">
        {/* Animated SOS beacon */}
        <div className="relative mb-6">
          <div className="absolute inset-[-16px] rounded-[32px] bg-orange-500/10 animate-sos-ring" />
          <div className="relative w-20 h-20 rounded-[24px] bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-sos-lg animate-sos-pulse">
            <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
        </div>

        <h1 className="font-display text-[36px] font-extrabold text-gray-900 tracking-[-0.03em]">S.O.S</h1>
        <p className="text-[14px] text-orange-600/80 mt-1 font-medium tracking-[0.08em] uppercase">Superheros On Standby</p>

        {/* Mini roadside animation */}
        <div className="mt-6 mb-2 w-[200px] h-[50px] relative overflow-hidden">
          {/* Road */}
          <div className="absolute bottom-0 left-0 right-0 h-[8px] bg-gray-300 rounded-full overflow-hidden">
            <div className="absolute inset-0 flex gap-4 animate-road-scroll" style={{ width: '200%' }}>
              {Array.from({ length: 20 }).map((_, i) => (
                <div key={i} className="w-6 h-[2px] bg-amber-400 rounded-full mt-[3px] flex-shrink-0" />
              ))}
            </div>
          </div>
          {/* Tow truck */}
          <div className="absolute bottom-[6px] left-[30%] animate-truck-bounce">
            <span className="text-[28px]">🚛</span>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="px-6 pb-8 pb-safe">
        {/* Toggle */}
        <div className="flex mb-5 bg-orange-50 rounded-2xl p-1 border border-orange-100">
          {(['signin', 'signup'] as const).map(m => (
            <button
              key={m}
              onClick={() => { setMode(m); setError(''); }}
              className={`flex-1 py-3 rounded-xl text-[14px] font-semibold transition-all duration-300 ${
                mode === m
                  ? 'bg-white text-orange-600 shadow-card'
                  : 'text-gray-400'
              }`}
            >
              {m === 'signin' ? 'Sign In' : 'Create Account'}
            </button>
          ))}
        </div>

        <form onSubmit={submit} className="space-y-3">
          {mode === 'signup' && (
            <>
              <input
                type="text" placeholder="Full Name" value={fullName}
                onChange={e => setFullName(e.target.value)} required
                className="w-full h-[56px] px-5 bg-white border border-gray-200 rounded-2xl text-gray-900 text-[16px] placeholder-gray-400 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all"
              />
              <input
                type="tel" placeholder="Phone (optional)" value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full h-[56px] px-5 bg-white border border-gray-200 rounded-2xl text-gray-900 text-[16px] placeholder-gray-400 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all"
              />
            </>
          )}

          <input
            type="email" placeholder="Email address" value={email}
            onChange={e => setEmail(e.target.value)} required
            className="w-full h-[56px] px-5 bg-white border border-gray-200 rounded-2xl text-gray-900 text-[16px] placeholder-gray-400 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all"
          />

          <div className="relative">
            <input
              type={showPw ? 'text' : 'password'} placeholder="Password" value={password}
              onChange={e => setPassword(e.target.value)} required minLength={6}
              className="w-full h-[56px] px-5 pr-14 bg-white border border-gray-200 rounded-2xl text-gray-900 text-[16px] placeholder-gray-400 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all"
            />
            <button type="button" onClick={() => setShowPw(!showPw)}
              className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1">
              {showPw ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {error && (
            <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-red-600 text-[14px]">{error}</p>
            </div>
          )}

          <button type="submit" disabled={loading}
            className="w-full h-[58px] bg-gradient-to-r from-orange-500 to-amber-500 text-white text-[16px] font-bold rounded-2xl shadow-sos hover:shadow-sos-lg active:scale-[0.98] transition-all disabled:opacity-50">
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                {mode === 'signin' ? 'Signing in...' : 'Creating account...'}
              </span>
            ) : mode === 'signin' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        {mode === 'signin' && (
          <p className="text-center text-gray-400 text-[14px] mt-4">
            Forgot password? <button className="text-orange-500 font-medium">Reset</button>
          </p>
        )}

        {/* Trust bar */}
        <div className="flex items-center justify-center gap-4 mt-8 pt-5 border-t border-gray-100">
          {[
            ['Verified Pros', 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z'],
            ['24/7 Ready', 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'],
            ['8 Min Avg', 'M13 10V3L4 14h7v7l9-11h-7z'],
          ].map(([label, path]) => (
            <span key={label as string} className="flex items-center gap-1 text-[11px] text-gray-400 font-medium">
              <svg className="w-3.5 h-3.5 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
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
