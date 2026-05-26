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
      <div className="bg-[#08080f] overflow-hidden relative size-full">
        <Starfield density={80} />
        <NebulaGlow color="gold" className="w-[400px] h-[400px] left-1/2 -translate-x-1/2 top-[180px]" />

        <motion.p
          className="absolute font-bold left-1/2 -translate-x-1/2 text-[#888888] text-[11px] tracking-[0.15em] top-[133px]"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 1 }}
        >
          IF TOMORROW ENDS
        </motion.p>

        {/* Constellation — constrained so it doesn't spill over the logo */}
        <div className="absolute left-1/2 -translate-x-1/2 top-[-30px] w-[480px] h-[480px] z-[1]">
          <ConstellationSVG className="w-full h-full" />
        </div>

        <motion.div
          className="absolute left-1/2 -translate-x-1/2 top-[390px] z-[2]"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2, duration: 1 }}
        >
          <BecomingLogo />
        </motion.div>

        <motion.p
          className="absolute left-1/2 -translate-x-1/2 top-[550px] text-[14px] italic text-[#888888] text-center w-[300px] z-[2]"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.5, duration: 1 }}
        >
          what would you regret not doing today?
        </motion.p>

        <motion.button
          className="absolute left-1/2 -translate-x-1/2 top-[606px] bg-[#d4af78] h-[54px] w-[280px] rounded-[27px] cursor-pointer z-[2]"
          style={{ boxShadow: '0 0 24px rgba(212, 175, 120, 0.3)' }}
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 3, duration: 0.8 }}
          whileHover={{ scale: 1.02, boxShadow: '0 0 32px rgba(212, 175, 120, 0.5)' }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onNavigate('signup')}
        >
          <p className="font-bold text-[#08080f] text-[16px]">Begin Becoming</p>
        </motion.button>

        <motion.button
          className="absolute left-1/2 -translate-x-1/2 top-[683px] cursor-pointer whitespace-nowrap font-normal text-[#9898a8] text-[12px] z-[2]"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3.5, duration: 1 }}
          onClick={() => onNavigate('login')}
        >
          Already have an account?{' '}<span className="text-[#888888]">Sign in →</span>
        </motion.button>
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
