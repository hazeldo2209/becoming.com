import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Starfield } from './CosmicElements';

// ─── Social proof count — stable random in range, animated on mount ───────────

function useAnimatedCount(target: number, duration = 1400) {
  const [display, setDisplay] = useState(0);
  const startTime = useRef<number | null>(null);
  const raf = useRef<number>(0);

  useEffect(() => {
    const animate = (ts: number) => {
      if (startTime.current === null) startTime.current = ts;
      const elapsed = ts - startTime.current;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * target));
      if (progress < 1) raf.current = requestAnimationFrame(animate);
    };
    raf.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf.current);
  }, [target, duration]);

  return display;
}

// ─── Moods ────────────────────────────────────────────────────────────────────

const MOODS = [
  { emoji: '😴', label: 'Drained'  },
  { emoji: '😔', label: 'Heavy'    },
  { emoji: '😰', label: 'Anxious'  },
  { emoji: '😑', label: 'Meh'      },
  { emoji: '😐', label: 'Neutral'  },
  { emoji: '😅', label: 'Okay-ish' },
  { emoji: '😊', label: 'Good'     },
  { emoji: '✨', label: 'Grateful' },
];

// ─── Main component ───────────────────────────────────────────────────────────

export default function DailyCheckIn({ onNavigate, setUserMood, setUserEnergy }: any) {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [energy, setEnergy]             = useState(50);

  // Stable random count per session (800–2 400)
  const [actionCount] = useState(() => 800 + Math.floor(Math.random() * 1601));
  const displayCount = useAnimatedCount(actionCount);

  // Format with comma separator
  const formattedCount = displayCount.toLocaleString('en-US');

  const handleContinue = () => {
    if (selectedMood) {
      setUserMood(selectedMood);
      setUserEnergy?.(energy);
      onNavigate('today');
    }
  };

  return (
    <div className="bg-[#08080f] overflow-hidden relative rounded-[36px] size-full">
      <Starfield density={40} />

      {/* Status bar */}
      <div className="absolute h-[44px] left-0 top-0 w-full z-10 bg-gradient-to-b from-[#08080f] to-transparent" />
      <p className="absolute font-bold left-[13px] text-[#f0e6cc] text-[13px] top-[10px] z-10">9:41</p>
      <p className="absolute font-normal left-[317px] text-[#888888] text-[11px] top-[11px] z-10">▶ ▶▶ ▊▊</p>

      {/* Title */}
      <p className="absolute left-1/2 -translate-x-1/2 top-[53px] text-[#f0e6cc] text-[20px] font-bold whitespace-nowrap">
        Daily Check-in
      </p>

      <div className="absolute h-[1px] left-[20px] right-[20px] top-[87px] bg-gradient-to-r from-transparent via-[#333333] to-transparent" />

      {/* Greeting */}
      <p className="absolute font-semibold left-[27px] text-[#f0e6cc] text-[17px] top-[107px]">
        Good morning ✦
      </p>
      <p className="absolute font-normal left-[27px] text-[#888888] text-[13px] top-[131px]">
        Here's what's happening in your universe.
      </p>

      {/* ── Social proof card ─────────────────────────────────────────────── */}
      <motion.div
        className="absolute left-[17px] right-[17px] rounded-[20px] overflow-hidden"
        style={{
          top: 166,
          background: 'linear-gradient(135deg, rgba(212,175,120,0.10) 0%, rgba(196,160,224,0.08) 100%)',
          border: '1px solid rgba(212,175,120,0.22)',
          boxShadow: '0 0 32px rgba(212,175,120,0.08)',
        }}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15 }}
      >
        {/* Top shimmer bar */}
        <div
          className="h-[3px] w-full"
          style={{ background: 'linear-gradient(to right, #d4af78, #c4a0e0, #d4af78)' }}
        />

        <div className="px-[20px] pt-[18px] pb-[20px]">
          {/* Big animated number */}
          <div className="flex items-end gap-[8px] mb-[6px]">
            <motion.p
              className="font-bold text-[#d4af78] leading-none"
              style={{ fontSize: 42 }}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              {formattedCount}
            </motion.p>
            <p className="text-[#888888] text-[13px] pb-[6px]">people</p>
          </div>

          <p className="text-[#f0e6cc] text-[15px] font-semibold mb-[2px]">
            took action today
          </p>
          <p className="text-[#8888a0] text-[12px] leading-relaxed">
            Every star in your sky is someone choosing to show up. You're not doing this alone.
          </p>

          {/* Tiny star row — decorative */}
          <div className="flex gap-[5px] mt-[12px]">
            {Array.from({ length: 12 }).map((_, i) => (
              <motion.p
                key={i}
                className="text-[10px]"
                style={{ color: i < 9 ? '#d4af78' : '#2a2a3a', opacity: i < 9 ? 0.7 : 0.4 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: i < 9 ? 0.7 : 0.4 }}
                transition={{ delay: 0.5 + i * 0.05 }}
              >
                ✦
              </motion.p>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ── Sky choice prompt ─────────────────────────────────────────────── */}
      <motion.div
        className="absolute left-[17px] right-[17px]"
        style={{ top: 370 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.45 }}
      >
        <p className="text-[#f0e6cc] text-[13px] font-medium mb-[10px]">
          Want to see your sky before we continue?
        </p>

        <div className="flex gap-[10px]">
          {/* View sky — primary */}
          <motion.button
            className="flex-1 h-[42px] rounded-[14px] flex items-center justify-center gap-[6px]"
            style={{
              background: 'rgba(212,175,120,0.15)',
              border: '1px solid rgba(212,175,120,0.45)',
              boxShadow: '0 0 16px rgba(212,175,120,0.12)',
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onNavigate('sky')}
          >
            <p className="text-[#d4af78] text-[13px] font-semibold">View My Sky</p>
            <p className="text-[#d4af78] text-[12px]">✦</p>
          </motion.button>

          {/* Not now — secondary */}
          <motion.button
            className="flex-1 h-[42px] rounded-[14px] flex items-center justify-center"
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
            whileTap={{ scale: 0.97 }}
            onClick={() => {}}  // just stays on check-in, user scrolls to mood
          >
            <p className="text-[#8888a0] text-[13px]">Not now</p>
          </motion.button>
        </div>
      </motion.div>

      {/* ── Divider above mood ─────────────────────────────────────────────── */}
      <div className="absolute h-[1px] left-[40px] right-[40px] top-[432px] bg-gradient-to-r from-transparent via-[#222222] to-transparent" />

      {/* ── Mood label ────────────────────────────────────────────────────── */}
      <motion.p
        className="absolute left-1/2 -translate-x-1/2 text-[#f0e6cc] text-[15px] font-bold text-center whitespace-nowrap"
        style={{ top: 448 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.55 }}
      >
        How are you feeling right now?
      </motion.p>

      {/* ── 4-column mood grid ────────────────────────────────────────────── */}
      <motion.div
        className="absolute left-[22px] grid grid-cols-4 gap-[8px]"
        style={{ top: 474 }}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        {MOODS.map((mood) => (
          <motion.button
            key={mood.label}
            className="bg-[#0b0a18] border border-solid h-[60px] rounded-[12px] w-[80px] cursor-pointer flex flex-col items-center justify-center"
            style={{
              borderColor: selectedMood === mood.label ? '#d4af78' : '#222222',
              boxShadow: selectedMood === mood.label ? '0 0 16px rgba(212, 175, 120, 0.3)' : 'none',
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedMood(mood.label)}
          >
            <p className="text-[20px] mb-[2px]">{mood.emoji}</p>
            <p className="text-[#888888] text-[10px]">{mood.label}</p>
          </motion.button>
        ))}
      </motion.div>

      {/* ── Energy slider ─────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        <p className="absolute font-bold left-[27px] text-[#f0e6cc] text-[13px]" style={{ top: 612 }}>
          Energy level
        </p>
        <p className="absolute font-normal left-[27px] text-[#888888] text-[11px]" style={{ top: 634 }}>Low</p>
        <p className="absolute font-normal right-[27px] text-[#888888] text-[11px]" style={{ top: 634 }}>High</p>

        <div className="absolute bg-[#1a1a1a] h-[6px] left-[27px] rounded-[3px] w-[330px]" style={{ top: 654 }} />
        <div
          className="absolute bg-[#d4af78] h-[6px] left-[27px] rounded-[3px] transition-all duration-150"
          style={{
            top: 654,
            width: `${(energy / 100) * 330}px`,
            boxShadow: '0 0 12px rgba(212, 175, 120, 0.4)',
          }}
        />
        <input
          type="range" min="0" max="100" value={energy}
          onChange={(e) => setEnergy(Number(e.target.value))}
          className="absolute left-[27px] w-[330px] h-[20px] opacity-0 cursor-pointer"
          style={{ top: 648 }}
        />
      </motion.div>

      {/* ── Continue button ───────────────────────────────────────────────── */}
      <AnimatePresence>
        {selectedMood && (
          <motion.button
            className="absolute bg-[#d4af78] h-[52px] left-[27px] rounded-[26px] w-[330px] cursor-pointer"
            style={{
              top: 694,
              boxShadow: '0 0 24px rgba(212, 175, 120, 0.3)',
            }}
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleContinue}
          >
            <p className="font-bold text-[#08080f] text-[16px] text-center">I'm ready  →</p>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Home indicator */}
      <div className="absolute bg-[#333333] h-[4px] left-[142px] rounded-[2px] bottom-[8px] w-[100px]" />
    </div>
  );
}
