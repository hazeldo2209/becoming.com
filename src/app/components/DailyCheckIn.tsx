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

export default function DailyCheckIn({ onNavigate, setUserMood, setUserEnergy, isDesktop }: any) {
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

  // ── Desktop layout ─────────────────────────────────────────────────────────

  if (isDesktop) {
    return (
      <div className="relative size-full overflow-y-auto bg-[#08080f]" style={{ scrollbarWidth: 'none' }}>
        <Starfield density={40} />
        <div className="relative z-[1] max-w-[600px] mx-auto px-[32px] pt-[32px] pb-[48px] flex flex-col gap-[20px]">

          {/* Title */}
          <div className="text-center mb-[4px]">
            <p className="text-[#f0e6cc] text-[22px] font-bold">Daily Check-in</p>
            <div className="h-[1px] mt-[16px] bg-gradient-to-r from-transparent via-[#333333] to-transparent" />
          </div>

          {/* Greeting */}
          <div>
            <p className="font-semibold text-[#f0e6cc] text-[17px]">Good morning ✦</p>
            <p className="font-normal text-[#888888] text-[13px] mt-[4px]">Here's what's happening in your universe.</p>
          </div>

          {/* Social proof card */}
          <motion.div
            className="rounded-[20px] overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(212,175,120,0.10) 0%, rgba(196,160,224,0.08) 100%)',
              border: '1px solid rgba(212,175,120,0.22)',
              boxShadow: '0 0 32px rgba(212,175,120,0.08)',
            }}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <div className="h-[3px] w-full" style={{ background: 'linear-gradient(to right, #d4af78, #c4a0e0, #d4af78)' }} />
            <div className="px-[20px] pt-[16px] pb-[18px]">
              <div className="flex items-end gap-[8px] mb-[6px]">
                <motion.p className="font-bold text-[#d4af78] leading-none text-[42px]"
                  initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5, delay: 0.3 }}>
                  {formattedCount}
                </motion.p>
                <p className="text-[#888888] text-[13px] pb-[6px]">people</p>
              </div>
              <p className="text-[#f0e6cc] text-[15px] font-semibold mb-[2px]">took action today</p>
              <p className="text-[#8888a0] text-[12px] leading-relaxed">Every star in your sky is someone choosing to show up. You're not doing this alone.</p>
              <div className="flex gap-[5px] mt-[12px]">
                {Array.from({ length: 12 }).map((_, i) => (
                  <motion.p key={i} className="text-[10px]"
                    style={{ color: i < 9 ? '#d4af78' : '#2a2a3a', opacity: i < 9 ? 0.7 : 0.4 }}
                    initial={{ opacity: 0 }} animate={{ opacity: i < 9 ? 0.7 : 0.4 }}
                    transition={{ delay: 0.5 + i * 0.05 }}>✦</motion.p>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Sky choice */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.45 }}>
            <p className="text-[#f0e6cc] text-[13px] font-medium mb-[10px]">Want to see your sky before we continue?</p>
            <div className="flex gap-[10px]">
              <motion.button
                className="flex-1 h-[42px] rounded-[14px] flex items-center justify-center gap-[6px]"
                style={{ background: 'rgba(212,175,120,0.15)', border: '1px solid rgba(212,175,120,0.45)', boxShadow: '0 0 16px rgba(212,175,120,0.12)' }}
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                onClick={() => onNavigate('sky')}
              >
                <p className="text-[#d4af78] text-[13px] font-semibold">View My Sky</p>
                <p className="text-[#d4af78] text-[12px]">✦</p>
              </motion.button>
              <motion.button
                className="flex-1 h-[42px] rounded-[14px] flex items-center justify-center"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {}}
              >
                <p className="text-[#8888a0] text-[13px]">Not now</p>
              </motion.button>
            </div>
          </motion.div>

          <div className="h-[1px] bg-gradient-to-r from-transparent via-[#222222] to-transparent" />

          {/* Mood */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}>
            <p className="text-[#f0e6cc] text-[15px] font-bold text-center mb-[14px]">How are you feeling right now?</p>
            <div className="grid grid-cols-4 gap-[8px]">
              {MOODS.map((mood) => (
                <motion.button
                  key={mood.label}
                  className="bg-[#0b0a18] border border-solid h-[64px] rounded-[12px] cursor-pointer flex flex-col items-center justify-center"
                  style={{
                    borderColor: selectedMood === mood.label ? '#d4af78' : '#222222',
                    boxShadow: selectedMood === mood.label ? '0 0 16px rgba(212,175,120,0.3)' : 'none',
                  }}
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedMood(mood.label)}
                >
                  <p className="text-[22px] mb-[2px]">{mood.emoji}</p>
                  <p className="text-[#888888] text-[11px]">{mood.label}</p>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Energy slider */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
            <div className="flex justify-between items-center mb-[8px]">
              <p className="font-bold text-[#f0e6cc] text-[13px]">Energy level</p>
              <p className="text-[#888888] text-[11px]">{energy}%</p>
            </div>
            <div className="flex items-center gap-[8px]">
              <p className="text-[#888888] text-[11px] shrink-0">Low</p>
              <div className="relative flex-1 h-[8px]">
                <div className="absolute inset-0 bg-[#1a1a1a] rounded-[4px]" />
                <div
                  className="absolute top-0 left-0 h-full bg-[#d4af78] rounded-[4px] transition-all duration-150"
                  style={{ width: `${energy}%`, boxShadow: '0 0 12px rgba(212,175,120,0.4)' }}
                />
                <input type="range" min="0" max="100" value={energy}
                  onChange={(e) => setEnergy(Number(e.target.value))}
                  className="absolute inset-0 w-full opacity-0 cursor-pointer" />
              </div>
              <p className="text-[#888888] text-[11px] shrink-0">High</p>
            </div>
          </motion.div>

          {/* Continue button */}
          <AnimatePresence>
            {selectedMood && (
              <motion.button
                className="w-full bg-[#d4af78] h-[54px] rounded-[27px] cursor-pointer"
                style={{ boxShadow: '0 0 24px rgba(212,175,120,0.3)' }}
                initial={{ opacity: 0, y: 8, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0 }} transition={{ duration: 0.25 }}
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={handleContinue}
              >
                <p className="font-bold text-[#08080f] text-[16px] text-center">I'm ready  →</p>
              </motion.button>
            )}
          </AnimatePresence>

        </div>
      </div>
    );
  }

  // ── Mobile layout ───────────────────────────────────────────────────────────

  return (
    <div className="bg-[#08080f] overflow-hidden relative size-full flex flex-col">
      <Starfield density={40} />

      {/* Scrollable content */}
      <div className="relative z-[1] flex-1 overflow-y-auto px-[24px] pt-[56px] pb-[16px] flex flex-col gap-[16px]" style={{ scrollbarWidth: 'none' }}>

        {/* Title */}
        <div>
          <p className="text-[#f0e6cc] text-[20px] font-bold text-center">Daily Check-in</p>
          <div className="h-[1px] mt-[12px] bg-gradient-to-r from-transparent via-[#333333] to-transparent" />
        </div>

        {/* Greeting */}
        <div>
          <p className="font-semibold text-[#f0e6cc] text-[17px]">Good morning ✦</p>
          <p className="font-normal text-[#888888] text-[13px] mt-[4px]">Here's what's happening in your universe.</p>
        </div>

        {/* Social proof card */}
        <motion.div
          className="rounded-[20px] overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(212,175,120,0.10) 0%, rgba(196,160,224,0.08) 100%)',
            border: '1px solid rgba(212,175,120,0.22)',
            boxShadow: '0 0 32px rgba(212,175,120,0.08)',
          }}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          <div className="h-[3px] w-full" style={{ background: 'linear-gradient(to right, #d4af78, #c4a0e0, #d4af78)' }} />
          <div className="px-[20px] pt-[18px] pb-[20px]">
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
            <p className="text-[#f0e6cc] text-[15px] font-semibold mb-[2px]">took action today</p>
            <p className="text-[#8888a0] text-[12px] leading-relaxed">
              Every star in your sky is someone choosing to show up. You're not doing this alone.
            </p>
            <div className="flex gap-[5px] mt-[12px]">
              {Array.from({ length: 12 }).map((_, i) => (
                <motion.p key={i} className="text-[10px]"
                  style={{ color: i < 9 ? '#d4af78' : '#2a2a3a', opacity: i < 9 ? 0.7 : 0.4 }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: i < 9 ? 0.7 : 0.4 }}
                  transition={{ delay: 0.5 + i * 0.05 }}>✦</motion.p>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Sky choice prompt */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.45 }}
        >
          <p className="text-[#f0e6cc] text-[13px] font-medium mb-[10px]">
            Want to see your sky before we continue?
          </p>
          <div className="flex gap-[10px]">
            <motion.button
              className="flex-1 h-[42px] rounded-[14px] flex items-center justify-center gap-[6px]"
              style={{ background: 'rgba(212,175,120,0.15)', border: '1px solid rgba(212,175,120,0.45)', boxShadow: '0 0 16px rgba(212,175,120,0.12)' }}
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              onClick={() => onNavigate('sky')}
            >
              <p className="text-[#d4af78] text-[13px] font-semibold">View My Sky</p>
              <p className="text-[#d4af78] text-[12px]">✦</p>
            </motion.button>
            <motion.button
              className="flex-1 h-[42px] rounded-[14px] flex items-center justify-center"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {}}
            >
              <p className="text-[#8888a0] text-[13px]">Not now</p>
            </motion.button>
          </div>
        </motion.div>

        <div className="h-[1px] bg-gradient-to-r from-transparent via-[#222222] to-transparent" />

        {/* Mood label */}
        <motion.p
          className="text-[#f0e6cc] text-[15px] font-bold text-center"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}
        >
          How are you feeling right now?
        </motion.p>

        {/* 4-column mood grid */}
        <motion.div
          className="grid grid-cols-4 gap-[8px]"
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
        >
          {MOODS.map((mood) => (
            <motion.button
              key={mood.label}
              className="bg-[#0b0a18] border border-solid h-[64px] rounded-[12px] cursor-pointer flex flex-col items-center justify-center"
              style={{
                borderColor: selectedMood === mood.label ? '#d4af78' : '#222222',
                boxShadow: selectedMood === mood.label ? '0 0 16px rgba(212, 175, 120, 0.3)' : 'none',
              }}
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedMood(mood.label)}
            >
              <p className="text-[20px] mb-[2px]">{mood.emoji}</p>
              <p className="text-[#888888] text-[10px]">{mood.label}</p>
            </motion.button>
          ))}
        </motion.div>

        {/* Energy slider */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
          <div className="flex justify-between items-center mb-[8px]">
            <p className="font-bold text-[#f0e6cc] text-[13px]">Energy level</p>
            <p className="text-[#888888] text-[11px]">{energy}%</p>
          </div>
          <div className="flex items-center gap-[8px]">
            <p className="text-[#888888] text-[11px] shrink-0">Low</p>
            <div className="relative flex-1 h-[8px]">
              <div className="absolute inset-0 bg-[#1a1a1a] rounded-[4px]" />
              <div
                className="absolute top-0 left-0 h-full bg-[#d4af78] rounded-[4px] transition-all duration-150"
                style={{ width: `${energy}%`, boxShadow: '0 0 12px rgba(212,175,120,0.4)' }}
              />
              <input type="range" min="0" max="100" value={energy}
                onChange={(e) => setEnergy(Number(e.target.value))}
                className="absolute inset-0 w-full opacity-0 cursor-pointer" />
            </div>
            <p className="text-[#888888] text-[11px] shrink-0">High</p>
          </div>
        </motion.div>

        {/* Continue button */}
        <AnimatePresence>
          {selectedMood && (
            <motion.button
              className="w-full bg-[#d4af78] h-[52px] rounded-[26px] cursor-pointer"
              style={{ boxShadow: '0 0 24px rgba(212, 175, 120, 0.3)' }}
              initial={{ opacity: 0, y: 8, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0 }} transition={{ duration: 0.25 }}
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              onClick={handleContinue}
            >
              <p className="font-bold text-[#08080f] text-[16px] text-center">I'm ready  →</p>
            </motion.button>
          )}
        </AnimatePresence>

      </div>

      {/* Home indicator */}
      <div className="shrink-0 h-[24px] flex items-center justify-center">
        <div className="bg-[#333333] h-[4px] rounded-[2px] w-[100px]" />
      </div>
    </div>
  );
}
