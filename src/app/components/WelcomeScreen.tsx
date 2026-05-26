import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Starfield, NebulaGlow } from './CosmicElements';
import { BecomingLogo, ConstellationSVG } from './BrandAssets';

// Returns the true visible viewport height — fixes the iOS/Chrome vh bug
// where 100vh includes the browser address bar, pushing bottom-anchored
// elements off-screen.
function useViewportHeight() {
  const [h, setH] = useState(() => window.innerHeight);
  useEffect(() => {
    const update = () => setH(window.innerHeight);
    window.addEventListener('resize', update);
    window.addEventListener('orientationchange', update);
    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('orientationchange', update);
    };
  }, []);
  return h;
}

export default function WelcomeScreen({ onNavigate, isDesktop }: any) {
  const vph = useViewportHeight();
  // Convert a percentage to pixels based on actual viewport height
  const vh = (pct: number) => `${(vph * pct) / 100}px`;

  // ── Desktop layout ─────────────────────────────────────────────────────────
  if (isDesktop) {
    return (
      <div className="bg-[#08080f] relative size-full flex items-center justify-center overflow-hidden">
        <Starfield density={80} />

        {/* ── Split card ──────────────────────────────────────────────────────── */}
        <motion.div
          className="relative z-10 flex w-full mx-8 rounded-[28px] overflow-hidden"
          style={{
            maxWidth: 940,
            minHeight: 560,
            maxHeight: 'calc(100vh - 80px)',
            boxShadow: '0 0 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.06)',
          }}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          {/* ── Left panel — constellation + logo ──────────────────────────── */}
          <div
            className="relative flex-[0_0_42%] flex flex-col items-center justify-center px-10 py-12 overflow-hidden"
            style={{ background: '#090910' }}
          >
            <NebulaGlow color="gold" className="w-[340px] h-[340px] left-1/2 -translate-x-1/2 top-[50px]" />

            {/* Constellation */}
            <div className="w-[270px] h-[270px] mb-4 relative z-[1]">
              <ConstellationSVG className="w-full h-full" />
            </div>

            {/* Logo */}
            <motion.div
              className="relative z-[1]"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.8, duration: 0.9 }}
            >
              <BecomingLogo width="min(200px, 45%)" />
            </motion.div>
          </div>

          {/* ── Right panel — tagline + CTAs ───────────────────────────────── */}
          <div
            className="flex-1 flex flex-col px-12 py-10 overflow-hidden"
            style={{ background: '#0e0e1a' }}
          >
            {/* Top row: Already have an account? [Sign In] */}
            <motion.div
              className="flex items-center justify-end gap-3 mb-auto"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
            >
              <span className="text-[#666677] text-[13px]">Already have an account?</span>
              <motion.button
                className="px-4 h-[30px] rounded-full border border-[#444455] text-[#d4af78] text-[12px] font-medium cursor-pointer"
                whileHover={{ borderColor: '#d4af78', background: 'rgba(212,175,120,0.06)' }}
                onClick={() => onNavigate('login')}
              >
                Sign In
              </motion.button>
            </motion.div>

            {/* Centre content — vertically centred in remaining space */}
            <div className="flex flex-col justify-center flex-1 gap-0">
              {/* Eyebrow */}
              <motion.p
                className="font-bold text-[11px] tracking-[0.18em] text-[#555566] uppercase mb-6"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
              >
                IF TOMORROW ENDS
              </motion.p>

              {/* Headline */}
              <motion.p
                className="font-bold text-[#f0e6cc] leading-tight mb-4"
                style={{ fontSize: 'clamp(28px, 3vw, 42px)' }}
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.8 }}
              >
                What would you regret<br />not doing today?
              </motion.p>

              {/* Subtext */}
              <motion.p
                className="text-[#666677] text-[15px] leading-relaxed mb-10"
                style={{ maxWidth: 340 }}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: 1.1, duration: 0.8 }}
              >
                A daily companion that helps you live with intention — before tomorrow ends.
              </motion.p>

              {/* CTA button */}
              <motion.button
                className="h-[54px] rounded-[27px] cursor-pointer flex items-center justify-center"
                style={{
                  maxWidth: 320,
                  background: '#d4af78',
                  boxShadow: '0 0 28px rgba(212,175,120,0.3)',
                }}
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4, duration: 0.7 }}
                whileHover={{ scale: 1.02, boxShadow: '0 0 40px rgba(212,175,120,0.45)' }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onNavigate('signup')}
              >
                <p className="font-bold text-[#08080f] text-[16px]">Begin Becoming →</p>
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // ── Mobile layout ──────────────────────────────────────────────────────────
  return (
    <div className="bg-[#08080f] overflow-hidden relative size-full">
      {/* Background */}
      <Starfield density={80} />
      <NebulaGlow color="gold" className="w-[300px] h-[300px] left-1/2 -translate-x-1/2 top-[8vh]" />

      {/* Eyebrow — fixed near top */}
      <motion.p
        className="absolute left-1/2 -translate-x-1/2 font-bold text-[#888888] text-[11px] tracking-[0.15em] whitespace-nowrap z-[1]"
        style={{ top: vh(12) }}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        IF TOMORROW ENDS
      </motion.p>

      {/* Constellation — upper 55% of screen */}
      <div className="absolute left-0 right-0 z-[1]" style={{ top: vh(3), height: vh(55) }}>
        <ConstellationSVG className="w-full h-full" />
      </div>

      {/* ── Bottom panel: logo → tagline → [flex gap] → button → sign-in ──
           Starts just below constellation, ends at screen bottom.
           Flex column ensures elements never overlap regardless of screen size. */}
      <div
        className="absolute left-0 right-0 bottom-0 z-[1] flex flex-col items-center px-6"
        style={{ top: vh(56) }}
      >
        {/* Logo — padding-top gives glow room above the panel edge */}
        <motion.div
          className="shrink-0 pt-2"
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6, duration: 0.8 }}
        >
          <BecomingLogo />
        </motion.div>

        {/* Tagline */}
        <motion.p
          className="shrink-0 text-[14px] italic text-[#888888] text-center mt-3"
          style={{ maxWidth: 'min(280px, 80vw)' }}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 0.8 }}
        >
          what would you regret not doing today?
        </motion.p>

        {/* Elastic spacer — pushes buttons to bottom */}
        <div className="flex-1" style={{ minHeight: 12 }} />

        {/* CTA button */}
        <motion.button
          className="shrink-0 bg-[#d4af78] h-[54px] rounded-[27px] cursor-pointer w-full"
          style={{ maxWidth: 'min(320px, calc(100vw - 48px))', boxShadow: '0 0 24px rgba(212,175,120,0.3)' }}
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.4, duration: 0.7 }}
          whileHover={{ scale: 1.02, boxShadow: '0 0 32px rgba(212,175,120,0.5)' }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onNavigate('signup')}
        >
          <p className="font-bold text-[#08080f] text-[16px]">Begin Becoming</p>
        </motion.button>

        {/* Sign in link */}
        <motion.button
          className="shrink-0 cursor-pointer font-normal text-[#9898a8] text-[13px] whitespace-nowrap mt-3"
          style={{ marginBottom: vh(4) }}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 2.8, duration: 0.8 }}
          onClick={() => onNavigate('login')}
        >
          Already have an account?{' '}<span className="text-[#d4af78]">Sign in →</span>
        </motion.button>
      </div>
    </div>
  );
}
