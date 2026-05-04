import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Starfield } from './CosmicElements';

const PHASE_DURATIONS: Record<'inhale' | 'hold' | 'exhale', number> = {
  inhale: 4, hold: 4, exhale: 6,
};

export default function DailyCheckIn({ onNavigate, setUserMood }: any) {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [energy, setEnergy]             = useState(50);
  const [breathPhase, setBreathPhase]   = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [breathScale, setBreathScale]   = useState(1);
  const [breathCount, setBreathCount]   = useState(PHASE_DURATIONS.inhale);
  const [breathSkipped, setBreathSkipped] = useState(false);

  // ── Phase sequencer ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (breathSkipped) return;
    let phaseTimer: any;

    const runBreathCycle = () => {
      setBreathPhase('inhale');
      setBreathScale(1.3);

      phaseTimer = setTimeout(() => {
        setBreathPhase('hold');
        setBreathScale(1.3);

        phaseTimer = setTimeout(() => {
          setBreathPhase('exhale');
          setBreathScale(0.85);
          phaseTimer = setTimeout(runBreathCycle, 6000);
        }, 4000);
      }, 4000);
    };

    runBreathCycle();
    return () => clearTimeout(phaseTimer);
  }, [breathSkipped]);

  // ── Reset countdown when phase flips ─────────────────────────────────────────
  useEffect(() => {
    setBreathCount(PHASE_DURATIONS[breathPhase]);
  }, [breathPhase]);

  // ── Tick countdown every second ───────────────────────────────────────────────
  useEffect(() => {
    if (breathSkipped) return;
    const id = setInterval(() => {
      setBreathCount((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(id);
  }, [breathPhase, breathSkipped]);

  // ── Moods — expanded with Gen-Z nuance options ───────────────────────────────
  const moods = [
    { emoji: '😴', label: 'Drained'   },
    { emoji: '😔', label: 'Heavy'     },
    { emoji: '😰', label: 'Anxious'   },
    { emoji: '😑', label: 'Meh'       },
    { emoji: '😐', label: 'Neutral'   },
    { emoji: '😅', label: 'Okay-ish'  },
    { emoji: '😊', label: 'Good'      },
    { emoji: '✨', label: 'Grateful'  },
  ];

  const handleContinue = () => {
    if (selectedMood) {
      setUserMood(selectedMood);
      onNavigate('today');
    }
  };

  const transitionDuration = breathPhase === 'inhale' ? 4 : breathPhase === 'hold' ? 4 : 6;

  return (
    <div className="bg-[#08080f] overflow-hidden relative rounded-[36px] size-full">
      <Starfield density={40} />

      {/* Status bar */}
      <div className="absolute h-[44px] left-0 top-0 w-full z-10 bg-gradient-to-b from-[#08080f] to-transparent" />
      <p className="absolute font-bold left-[13px] text-[#f0e6cc] text-[13px] top-[10px] z-10">9:41</p>
      <p className="absolute font-normal left-[317px] text-[#888888] text-[11px] top-[11px] z-10">▶ ▶▶ ▊▊</p>

      {/* Title */}
      <p className="absolute left-1/2 -translate-x-1/2 top-[53px] text-[#f0e6cc] text-[20px] font-bold">
        Daily Check-in
      </p>

      <div className="absolute h-[1px] left-[20px] right-[20px] top-[87px] bg-gradient-to-r from-transparent via-[#333333] to-transparent" />

      {/* Greeting */}
      <p className="absolute font-semibold left-[27px] text-[#f0e6cc] text-[17px] top-[107px]">
        Good evening, Hazel.
      </p>
      <p className="absolute font-normal left-[27px] text-[#888888] text-[13px] top-[131px]">
        Take a breath before we begin.
      </p>

      {/* Breathing section — fades out when skipped */}
      <AnimatePresence>
        {!breathSkipped && (
          <motion.div
            key="breathing"
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ duration: 0.5 }}
          >
            {/* Breathing circle */}
            <div className="absolute left-1/2 -translate-x-1/2 top-[240px]">
              {[200, 160, 120].map((size, i) => (
                <motion.div
                  key={i}
                  className="absolute left-1/2 top-1/2 rounded-full border border-[#d4af78]"
                  style={{
                    width: size, height: size,
                    marginLeft: -size / 2, marginTop: -size / 2,
                    opacity: 0.15 - i * 0.03,
                  }}
                  animate={{
                    scale:   breathScale - i * 0.05,
                    opacity: (breathPhase === 'inhale' ? 0.2 : 0.1) - i * 0.03,
                  }}
                  transition={{ duration: transitionDuration, ease: 'easeInOut' }}
                />
              ))}

              {/* Centre circle with large countdown */}
              <motion.div
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#d4af78] flex flex-col items-center justify-center"
                style={{ width: 80, height: 80, boxShadow: '0 0 40px rgba(212, 175, 120, 0.4)' }}
                animate={{ scale: breathScale }}
                transition={{ duration: transitionDuration, ease: 'easeInOut' }}
              >
                <AnimatePresence mode="wait">
                  <motion.p
                    key={breathCount}
                    className="text-[#08080f] text-[28px] font-bold leading-none"
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {breathCount}
                  </motion.p>
                </AnimatePresence>
                <p className="text-[#08080f] text-[9px] font-semibold tracking-wider uppercase mt-[2px]">
                  {breathPhase}
                </p>
              </motion.div>
            </div>

            <p className="absolute left-1/2 -translate-x-1/2 text-[#888888] text-[12px] top-[390px] text-center">
              inhale 4 · hold 4 · exhale 6
            </p>

            {/* Skip link */}
            <motion.button
              className="absolute left-1/2 -translate-x-1/2 top-[412px] cursor-pointer"
              whileTap={{ scale: 0.95 }}
              onClick={() => setBreathSkipped(true)}
            >
              <p className="text-[#555568] text-[11px] underline underline-offset-2">Skip breathing →</p>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Skipped confirmation badge */}
      <AnimatePresence>
        {breathSkipped && (
          <motion.div
            className="absolute left-1/2 -translate-x-1/2 top-[158px] flex items-center gap-[6px]"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
          >
            <div className="bg-[#1a1a2e] border border-[#333344] rounded-[20px] px-[14px] py-[6px]">
              <p className="text-[#8888a0] text-[11px]">✓ breathing skipped</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Divider above mood */}
      <div
        className="absolute h-[1px] left-[77px] right-[77px] bg-gradient-to-r from-transparent via-[#222222] to-transparent"
        style={{ top: breathSkipped ? '202px' : '421px', transition: 'top 0.5s ease' }}
      />

      {/* Mood label */}
      <p
        className="absolute left-1/2 -translate-x-1/2 text-[#f0e6cc] text-[15px] font-bold text-center"
        style={{ top: breathSkipped ? '218px' : '437px', transition: 'top 0.5s ease' }}
      >
        How are you feeling right now?
      </p>

      {/* 4-column mood grid */}
      <div
        className="absolute left-[22px] grid grid-cols-4 gap-[8px]"
        style={{ top: breathSkipped ? '246px' : '465px', transition: 'top 0.5s ease' }}
      >
        {moods.map((mood) => (
          <motion.button
            key={mood.label}
            className={`bg-[#0b0a18] border border-solid h-[60px] rounded-[12px] w-[80px] cursor-pointer flex flex-col items-center justify-center ${
              selectedMood === mood.label ? 'border-[#d4af78]' : 'border-[#222222]'
            }`}
            style={{
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
      </div>

      {/* Energy slider */}
      <p
        className="absolute font-bold left-[27px] text-[#f0e6cc] text-[13px]"
        style={{ top: breathSkipped ? '384px' : '637px', transition: 'top 0.5s ease' }}
      >
        Energy level
      </p>
      <p
        className="absolute font-normal left-[27px] text-[#888888] text-[11px]"
        style={{ top: breathSkipped ? '406px' : '659px', transition: 'top 0.5s ease' }}
      >
        Low
      </p>
      <p
        className="absolute font-normal right-[27px] text-[#888888] text-[11px]"
        style={{ top: breathSkipped ? '406px' : '659px', transition: 'top 0.5s ease' }}
      >
        High
      </p>

      <div
        className="absolute bg-[#1a1a1a] h-[6px] left-[27px] rounded-[3px] w-[330px]"
        style={{ top: breathSkipped ? '426px' : '679px', transition: 'top 0.5s ease' }}
      />
      <div
        className="absolute bg-[#d4af78] h-[6px] left-[27px] rounded-[3px] transition-all duration-150"
        style={{
          top: breathSkipped ? '426px' : '679px',
          width: `${(energy / 100) * 330}px`,
          boxShadow: '0 0 12px rgba(212, 175, 120, 0.4)',
          transition: 'top 0.5s ease',
        }}
      />
      <input
        type="range" min="0" max="100" value={energy}
        onChange={(e) => setEnergy(Number(e.target.value))}
        className="absolute left-[27px] w-[330px] h-[20px] opacity-0 cursor-pointer"
        style={{ top: breathSkipped ? '420px' : '673px', transition: 'top 0.5s ease' }}
      />

      {/* Continue button */}
      <motion.button
        className="absolute bg-[#d4af78] h-[52px] left-[27px] rounded-[26px] w-[330px] cursor-pointer disabled:opacity-30"
        style={{
          top: breathSkipped ? '464px' : '717px',
          boxShadow: selectedMood ? '0 0 24px rgba(212, 175, 120, 0.3)' : 'none',
          transition: 'top 0.5s ease',
        }}
        whileHover={{ scale: selectedMood ? 1.02 : 1 }}
        whileTap={{ scale: selectedMood ? 0.98 : 1 }}
        onClick={handleContinue}
        disabled={!selectedMood}
      >
        <p className="font-bold text-[#08080f] text-[16px] text-center">{`I'm ready  →`}</p>
      </motion.button>

      {/* Home indicator */}
      <div className="absolute bg-[#333333] h-[4px] left-[142px] rounded-[2px] bottom-[8px] w-[100px]" />
    </div>
  );
}
