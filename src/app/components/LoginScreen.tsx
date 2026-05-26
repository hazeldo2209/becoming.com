import { motion, AnimatePresence } from 'motion/react';
import { Starfield, NebulaGlow } from './CosmicElements';
import { BecomingLogo, ConstellationSVG } from './BrandAssets';
import { useState } from 'react';
import { supabase } from '@/app/lib/supabase';

// ─── Types ────────────────────────────────────────────────────────────────────

type Mode = 'signin' | 'signup' | 'confirm';

// ─── localStorage keys ────────────────────────────────────────────────────────

const LS_REMEMBER = 'becoming_remember_email';
const LS_EMAIL    = 'becoming_saved_email';

// ─── Sub-component: small spinner ─────────────────────────────────────────────

function Spinner() {
  return (
    <motion.span
      className="inline-block w-[16px] h-[16px] border-2 border-[#08080f] border-t-transparent rounded-full"
      animate={{ rotate: 360 }}
      transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
    />
  );
}

// ─── Sub-component: custom checkbox ───────────────────────────────────────────

function StarCheckbox({ checked, onToggle, label }: { checked: boolean; onToggle: () => void; label: string }) {
  return (
    <button
      type="button"
      className="flex items-center gap-[8px] cursor-pointer group"
      onClick={onToggle}
    >
      {/* Box */}
      <motion.div
        className="w-[18px] h-[18px] rounded-[5px] border flex items-center justify-center flex-shrink-0"
        animate={{
          background:   checked ? '#d4af78'    : 'rgba(26,26,26,0.8)',
          borderColor:  checked ? '#d4af78'    : '#444444',
          boxShadow:    checked ? '0 0 8px rgba(212,175,120,0.4)' : 'none',
        }}
        transition={{ duration: 0.18 }}
      >
        <AnimatePresence>
          {checked && (
            <motion.span
              className="text-[#08080f] font-bold leading-none select-none"
              style={{ fontSize: 11 }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.15, type: 'spring', stiffness: 400 }}
            >
              ✓
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Label */}
      <p
        className="text-[12px] transition-colors select-none"
        style={{ color: checked ? '#d4af78' : '#888888' }}
      >
        {label}
      </p>
    </button>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────

export default function LoginScreen({ onNavigate, initialMode, isDesktop }: any) {
  const [mode, setMode] = useState<Mode>(initialMode ?? 'signin');

  // ── Remember-username state: initialise once from localStorage ──────────────
  const [rememberEmail, setRememberEmail] = useState<boolean>(
    () => localStorage.getItem(LS_REMEMBER) === 'true',
  );
  const [email, setEmail] = useState<string>(() => {
    const hasRemember = localStorage.getItem(LS_REMEMBER) === 'true';
    return hasRemember ? (localStorage.getItem(LS_EMAIL) ?? '') : '';
  });
  // Track whether the pre-filled value is still "as remembered"
  const savedEmail = localStorage.getItem(LS_EMAIL) ?? '';

  const [name, setName]         = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState<string | null>(null);
  const [resent, setResent]     = useState(false);

  // ── Toggle remember checkbox ────────────────────────────────────────────────
  const handleRememberToggle = () => {
    const next = !rememberEmail;
    setRememberEmail(next);
    if (!next) {
      // Unchecking → wipe saved email immediately
      localStorage.removeItem(LS_REMEMBER);
      localStorage.removeItem(LS_EMAIL);
    }
  };

  // ── Handle sign-in ──────────────────────────────────────────────────────────
  const handleSignIn = async () => {
    if (!email || !password) { setError('Please fill in both fields.'); return; }
    setLoading(true); setError(null);
    const { error: err } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (err) {
      if (err.message.includes('Email not confirmed')) {
        setMode('confirm');
      } else {
        setError(err.message);
      }
      return;
    }
    // Persist (or clear) username based on checkbox
    if (rememberEmail) {
      localStorage.setItem(LS_REMEMBER, 'true');
      localStorage.setItem(LS_EMAIL, email.trim());
    } else {
      localStorage.removeItem(LS_REMEMBER);
      localStorage.removeItem(LS_EMAIL);
    }
    // Navigation is handled by onAuthStateChange in App.tsx (SIGNED_IN → onboarding)
  };

  // ── Handle sign-up ──────────────────────────────────────────────────────────
  const handleSignUp = async () => {
    if (!name.trim())          { setError('Please enter your name.'); return; }
    if (!email || !password) { setError('Please fill in all fields.'); return; }
    if (password.length < 6)  { setError('Password must be at least 6 characters.'); return; }
    setLoading(true); setError(null);
    const { error: err } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin,
        data: { full_name: name.trim() },
      },
    });
    setLoading(false);
    if (err) { setError(err.message); return; }
    setMode('confirm');
  };

  // ── Resend confirmation ─────────────────────────────────────────────────────
  const handleResend = async () => {
    setResent(false);
    const { error: err } = await supabase.auth.resend({ type: 'signup', email });
    if (!err) setResent(true);
  };

  // ── Shared input styles ─────────────────────────────────────────────────────
  const inputClass =
    'w-full h-[48px] bg-[#1a1a1a] border border-[#333333] rounded-[12px] px-[16px] text-[#f0e6cc] text-[14px] focus:outline-none focus:border-[#d4af78] transition-colors';
  const glowFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.boxShadow = '0 0 12px rgba(212, 175, 120, 0.2)';
  };
  const glowBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.boxShadow = 'none';
  };

  if (isDesktop) {
    return (
      <div className="bg-[#08080f] relative size-full flex items-center justify-center overflow-hidden">
        <Starfield density={60} />

        {/* Back button — top-left of screen */}
        <motion.button
          className="absolute left-6 top-6 cursor-pointer z-20 flex items-center gap-1"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
          onClick={() => onNavigate('welcome')}
        >
          <span className="text-[#d4af78] text-[14px]">←</span>
          <span className="font-normal text-[#d4af78] text-[14px]">Back</span>
        </motion.button>

        {/* ── Split card ──────────────────────────────────────────────────────── */}
        <motion.div
          className="relative z-10 flex w-full mx-8 rounded-[28px] overflow-hidden"
          style={{
            maxWidth: 940,
            minHeight: 560,
            maxHeight: 'calc(100vh - 80px)',
            boxShadow: '0 0 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.06)',
          }}
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          {/* ── Left panel — branding ──────────────────────────────────────── */}
          <div
            className="relative flex-[0_0_42%] flex flex-col items-center justify-center px-10 py-12 overflow-hidden"
            style={{ background: '#090910' }}
          >
            {/* Ambient glow */}
            <NebulaGlow color="gold" className="w-[320px] h-[320px] left-1/2 -translate-x-1/2 top-[60px]" />

            {/* Constellation */}
            <div className="w-[260px] h-[260px] mb-4 relative z-[1]">
              <ConstellationSVG className="w-full h-full" />
            </div>

            {/* Logo */}
            <div className="relative z-[1]">
              <BecomingLogo width="min(200px, 45%)" />
            </div>

            {/* Eyebrow */}
            <p className="relative z-[1] text-[11px] font-bold tracking-[0.15em] text-[#555566] mt-5 uppercase">
              IF TOMORROW ENDS
            </p>
            <p className="relative z-[1] text-[13px] italic text-[#666677] text-center mt-2" style={{ maxWidth: 200 }}>
              what would you regret not doing today?
            </p>
          </div>

          {/* ── Right panel — form ─────────────────────────────────────────── */}
          <div
            className="flex-1 flex flex-col overflow-y-auto"
            style={{ background: '#0e0e1a' }}
          >
            <AnimatePresence mode="wait">

              {/* ── Confirm email view ─────────────────────────────────────── */}
              {mode === 'confirm' && (
                <motion.div
                  key="confirm"
                  className="flex-1 flex flex-col items-center justify-center px-12 py-10"
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }} transition={{ duration: 0.4 }}
                >
                  <motion.p className="text-[48px] mb-5"
                    animate={{ scale: [1, 1.08, 1] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}>✦</motion.p>
                  <p className="font-bold text-[#f0e6cc] text-[22px] text-center mb-3">Check your email</p>
                  <p className="text-[#888888] text-[14px] text-center leading-relaxed mb-2">We sent a confirmation link to</p>
                  <p className="text-[#d4af78] text-[14px] text-center font-medium mb-8">{email}</p>
                  <p className="text-[#8888a0] text-[12px] text-center leading-relaxed mb-10 max-w-[280px]">
                    Click the link in that email to activate your account, then come back here and sign in.
                  </p>
                  <motion.button className="text-[#888888] text-[13px] mb-6" whileTap={{ scale: 0.95 }} onClick={handleResend}>
                    {resent ? <span className="text-[#88c8a8]">✓ Email resent!</span> : 'Resend confirmation email'}
                  </motion.button>
                  <motion.button
                    className="h-[50px] w-[280px] rounded-[25px] cursor-pointer flex items-center justify-center"
                    style={{ background: '#d4af78', boxShadow: '0 0 20px rgba(212,175,120,0.25)' }}
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    onClick={() => { setMode('signin'); setError(null); }}
                  >
                    <p className="font-bold text-[#08080f] text-[15px]">Back to Sign In</p>
                  </motion.button>
                </motion.div>
              )}

              {/* ── Sign in / Sign up view ─────────────────────────────────── */}
              {(mode === 'signin' || mode === 'signup') && (
                <motion.div
                  key={mode}
                  className="flex-1 flex flex-col px-12 py-10"
                  initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }} transition={{ duration: 0.3 }}
                >
                  {/* Top row: spacer + switch-mode pill */}
                  <div className="flex items-center justify-between mb-8">
                    <div />
                    <div className="flex items-center gap-3">
                      <span className="text-[#666677] text-[13px]">
                        {mode === 'signin' ? "Don't have an account?" : 'Already have an account?'}
                      </span>
                      <motion.button
                        className="px-4 h-[30px] rounded-full border border-[#444455] text-[#d4af78] text-[12px] font-medium cursor-pointer"
                        whileHover={{ borderColor: '#d4af78', background: 'rgba(212,175,120,0.06)' }}
                        onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setError(null); setName(''); }}
                      >
                        {mode === 'signin' ? 'Sign Up' : 'Sign In'}
                      </motion.button>
                    </div>
                  </div>

                  {/* Title */}
                  <motion.p
                    className="font-bold text-[#f0e6cc] text-[26px] mb-1"
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                  >
                    {mode === 'signin' ? 'Welcome Back ✦' : 'Begin Your Journey ✦'}
                  </motion.p>
                  <motion.p
                    className="text-[#666677] text-[13px] mb-8"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.18 }}
                  >
                    {mode === 'signin' ? 'Sign in to continue your journey' : 'Create your account to get started'}
                  </motion.p>

                  {/* Fields */}
                  <div className="flex flex-col gap-5">
                    {/* Name (signup only) */}
                    <AnimatePresence>
                      {mode === 'signup' && (
                        <motion.div key="name-field"
                          initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.25 }}
                        >
                          <p className="text-[#888899] text-[12px] mb-2">Your Name</p>
                          <input type="text" value={name} onChange={(e) => { setName(e.target.value); setError(null); }}
                            placeholder="What should we call you?" className={inputClass} onFocus={glowFocus} onBlur={glowBlur} />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Email */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-[#888899] text-[12px]">Email</p>
                        <AnimatePresence>
                          {mode === 'signin' && rememberEmail && email === savedEmail && savedEmail && (
                            <motion.p className="text-[11px] text-[#d4af78]"
                              initial={{ opacity: 0, x: 6 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
                              ✦ remembered
                            </motion.p>
                          )}
                        </AnimatePresence>
                      </div>
                      <input type="email" value={email} onChange={(e) => { setEmail(e.target.value); setError(null); }}
                        placeholder="your@email.com" className={inputClass} onFocus={glowFocus} onBlur={glowBlur} />
                    </div>

                    {/* Password */}
                    <div>
                      <p className="text-[#888899] text-[12px] mb-2">Password</p>
                      <input type="password" value={password} onChange={(e) => { setPassword(e.target.value); setError(null); }}
                        placeholder="••••••••" className={inputClass} onFocus={glowFocus} onBlur={glowBlur}
                        onKeyDown={(e) => { if (e.key === 'Enter') mode === 'signin' ? handleSignIn() : handleSignUp(); }} />
                      {mode === 'signup' && <p className="text-[#666677] text-[11px] mt-1.5 pl-1">Minimum 6 characters</p>}
                    </div>
                  </div>

                  {/* Remember + Forgot (sign-in only) */}
                  {mode === 'signin' && (
                    <motion.div className="flex items-center justify-between mt-4"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                      <StarCheckbox checked={rememberEmail} onToggle={handleRememberToggle} label="Remember me" />
                      <motion.button className="cursor-pointer" whileTap={{ scale: 0.95 }}
                        onClick={async () => {
                          if (!email) { setError('Enter your email above first.'); return; }
                          await supabase.auth.resetPasswordForEmail(email, { redirectTo: window.location.origin });
                          setError(null); setMode('confirm');
                        }}>
                        <p className="text-[#888899] text-[12px] hover:text-[#d4af78] transition-colors">Forgot password?</p>
                      </motion.button>
                    </motion.div>
                  )}

                  {/* Error */}
                  <AnimatePresence>
                    {error && (
                      <motion.p className="text-[#e0a888] text-[12px] mt-3"
                        initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                        {error}
                      </motion.p>
                    )}
                  </AnimatePresence>

                  {/* Spacer */}
                  <div className="flex-1" style={{ minHeight: 20 }} />

                  {/* CTA button */}
                  <motion.button
                    className="h-[52px] w-full rounded-[26px] cursor-pointer flex items-center justify-center gap-2 mt-4"
                    style={{ background: '#d4af78', boxShadow: '0 0 24px rgba(212,175,120,0.25)' }}
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: loading ? 0.8 : 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    whileHover={{ scale: loading ? 1 : 1.02, boxShadow: '0 0 32px rgba(212,175,120,0.4)' }}
                    whileTap={{ scale: loading ? 1 : 0.98 }}
                    onClick={mode === 'signin' ? handleSignIn : handleSignUp}
                    disabled={loading}
                  >
                    {loading
                      ? <Spinner />
                      : <p className="font-bold text-[#08080f] text-[15px]">{mode === 'signin' ? 'Sign In' : 'Create Account'}</p>
                    }
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    );
  }

  // ── Mobile layout ──────────────────────────────────────────────────────────
  return (
    <div className="bg-[#08080f] overflow-hidden relative size-full flex flex-col">
      <Starfield density={60} />
      <NebulaGlow color="gold" className="w-[280px] h-[280px] left-[55px] top-[160px]" />

      {/* Back button */}
      <motion.button
        className="absolute left-[20px] top-[60px] cursor-pointer z-10"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
        onClick={() => onNavigate('welcome')}
      >
        <p className="font-normal text-[#d4af78] text-[16px]">← Back</p>
      </motion.button>

      {/* ── CONFIRM EMAIL VIEW ──────────────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        {mode === 'confirm' && (
          <motion.div
            key="confirm"
            className="relative z-[1] flex-1 flex flex-col items-center justify-center px-[35px]"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }} transition={{ duration: 0.4 }}
          >
            <motion.p
              className="text-[56px] mb-[20px]"
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              ✦
            </motion.p>

            <p className="font-bold text-[#f0e6cc] text-[24px] text-center mb-[12px]">
              Check your email
            </p>
            <p className="text-[#888888] text-[14px] text-center leading-[1.6] mb-[8px]">
              We sent a confirmation link to
            </p>
            <p className="text-[#d4af78] text-[14px] text-center font-medium mb-[32px]">
              {email}
            </p>
            <p className="text-[#8888a0] text-[12px] text-center leading-[1.5] mb-[40px]">
              Click the link in that email to activate your account, then come back here and sign in.
            </p>

            <motion.button
              className="text-[#888888] text-[13px] mb-[24px]"
              whileTap={{ scale: 0.95 }}
              onClick={handleResend}
            >
              {resent
                ? <span className="text-[#88c8a8]">✓ Email resent!</span>
                : 'Resend confirmation email'}
            </motion.button>

            <motion.button
              className="w-[280px] h-[54px] rounded-[27px] cursor-pointer"
              style={{ background: '#d4af78', boxShadow: '0 0 24px rgba(212,175,120,0.3)' }}
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              onClick={() => { setMode('signin'); setError(null); }}
            >
              <p className="font-bold text-[#08080f] text-[16px]">Back to Sign In</p>
            </motion.button>
          </motion.div>
        )}

        {/* ── SIGN IN / SIGN UP VIEW ─────────────────────────────────────────── */}
        {(mode === 'signin' || mode === 'signup') && (
          <motion.div
            key={mode}
            className="relative z-[1] flex-1 overflow-y-auto px-[24px] pt-[100px] pb-[40px] flex flex-col gap-[16px]"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }} transition={{ duration: 0.35 }}
          >
            {/* Title */}
            <motion.p
              className="font-bold text-[#f0e6cc] text-[28px] text-center"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              {mode === 'signin' ? 'Welcome Back' : 'Begin Your Journey'}
            </motion.p>

            <motion.p
              className="text-[14px] text-[#888888] text-center"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}
            >
              {mode === 'signin' ? 'Sign in to continue your journey' : 'Create your account'}
            </motion.p>

            {/* Name (signup only) */}
            <AnimatePresence>
              {mode === 'signup' && (
                <motion.div
                  key="name-field"
                  initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }}
                >
                  <p className="font-normal text-[#888888] text-[12px] mb-[8px]">Your Name</p>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => { setName(e.target.value); setError(null); }}
                    placeholder="What should we call you?"
                    className={inputClass}
                    onFocus={glowFocus}
                    onBlur={glowBlur}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Email */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
            >
              <div className="flex items-center justify-between mb-[8px]">
                <p className="font-normal text-[#888888] text-[12px]">Email</p>
                <AnimatePresence>
                  {mode === 'signin' && rememberEmail && email === savedEmail && savedEmail && (
                    <motion.p
                      className="text-[11px]"
                      style={{ color: '#d4af78' }}
                      initial={{ opacity: 0, x: 6 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                    >
                      ✦ remembered
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(null); }}
                placeholder="your@email.com"
                className={inputClass}
                onFocus={glowFocus}
                onBlur={glowBlur}
              />
            </motion.div>

            {/* Password */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
            >
              <p className="font-normal text-[#888888] text-[12px] mb-[8px]">Password</p>
              <input
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(null); }}
                placeholder="••••••••"
                className={inputClass}
                onFocus={glowFocus}
                onBlur={glowBlur}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') mode === 'signin' ? handleSignIn() : handleSignUp();
                }}
              />
              {mode === 'signup' && (
                <p className="text-[#8888a0] text-[11px] mt-[6px] pl-[4px]">Minimum 6 characters</p>
              )}
            </motion.div>

            {/* ── Remember username + Forgot password row (sign-in only) ──────── */}
            {mode === 'signin' && (
              <motion.div
                className="flex items-center justify-between"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.52 }}
              >
                <StarCheckbox
                  checked={rememberEmail}
                  onToggle={handleRememberToggle}
                  label="Remember username"
                />

                <motion.button
                  className="cursor-pointer"
                  whileTap={{ scale: 0.95 }}
                  onClick={async () => {
                    if (!email) { setError('Enter your email above first.'); return; }
                    await supabase.auth.resetPasswordForEmail(email, {
                      redirectTo: window.location.origin,
                    });
                    setError(null);
                    setMode('confirm');
                  }}
                >
                  <p className="font-normal text-[#888888] text-[12px]">Forgot password?</p>
                </motion.button>
              </motion.div>
            )}

            {/* Error message */}
            <AnimatePresence>
              {error && (
                <motion.p
                  className="text-[#e0a888] text-[12px] text-center"
                  initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            {/* Primary button */}
            <motion.button
              className="h-[54px] w-full rounded-[27px] cursor-pointer flex items-center justify-center gap-[8px]"
              style={{
                background: '#d4af78',
                boxShadow: '0 0 24px rgba(212, 175, 120, 0.3)',
              }}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: loading ? 0.8 : 1, y: 0 }}
              transition={{ delay: 0.65 }}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              onClick={mode === 'signin' ? handleSignIn : handleSignUp}
              disabled={loading}
            >
              {loading
                ? <Spinner />
                : <p className="font-bold text-[#08080f] text-[16px]">
                    {mode === 'signin' ? 'Sign In' : 'Create Account'}
                  </p>
              }
            </motion.button>

            {/* Divider */}
            <motion.div
              className="flex items-center"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.75 }}
            >
              <div className="h-[1px] bg-[#333333] flex-1" />
              <p className="font-normal text-[#8888a0] text-[12px] mx-[16px]">or</p>
              <div className="h-[1px] bg-[#333333] flex-1" />
            </motion.div>

            {/* Toggle mode */}
            <motion.button
              className="cursor-pointer text-center font-normal text-[#9898a8] text-[12px]"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.85 }}
              onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setError(null); setName(''); }}
            >
              {mode === 'signin'
                ? <>Don't have an account?{' '}<span className="text-[#d4af78]">Sign up →</span></>
                : <>Already have an account?{' '}<span className="text-[#d4af78]">Sign in →</span></>
              }
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Home indicator */}
      <div className="shrink-0 h-[24px] flex items-center justify-center">
        <div className="bg-[#333333] h-[4px] rounded-[2px] w-[100px]" />
      </div>
    </div>
  );
}
