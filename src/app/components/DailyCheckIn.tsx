import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Starfield } from './CosmicElements';

export default function DailyCheckIn({ onNavigate, setUserMood }: any) {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [energy, setEnergy] = useState(50);
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [breathScale, setBreathScale] = useState(1);

  useEffect(() => {
    let phaseTimer: any;

    const runBreathCycle = () => {
      // Inhale - 4 seconds
      setBreathPhase('inhale');
      setBreathScale(1.3);

      phaseTimer = setTimeout(() => {
        // Hold - 4 seconds
        setBreathPhase('hold');
        setBreathScale(1.3);

        phaseTimer = setTimeout(() => {
          // Exhale - 6 seconds
          setBreathPhase('exhale');
          setBreathScale(0.85);

          phaseTimer = setTimeout(runBreathCycle, 6000);
        }, 4000);
      }, 4000);
    };

    runBreathCycle();

    return () => clearTimeout(phaseTimer);
  }, []);

  const moods = [
    { emoji: '😔', label: 'Heavy' },
    { emoji: '😰', label: 'Anxious' },
    { emoji: '😐', label: 'Neutral' },
    { emoji: '🙂', label: 'Okay' },
    { emoji: '😊', label: 'Good' },
    { emoji: '✨', label: 'Grateful' }
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

      {/* Breathing circle */}
      <div className="absolute left-1/2 -translate-x-1/2 top-[240px]">
        {/* Outer rings */}
        {[200, 160, 120].map((size, i) => (
          <motion.div
            key={i}
            className="absolute left-1/2 top-1/2 rounded-full border border-[#d4af78]"
            style={{
              width: size,
              height: size,
              marginLeft: -size / 2,
              marginTop: -size / 2,
              opacity: 0.15 - i * 0.03
            }}
            animate={{
              scale: breathScale - i * 0.05,
              opacity: (breathPhase === 'inhale' ? 0.2 : 0.1) - i * 0.03
            }}
            transition={{ duration: transitionDuration, ease: 'easeInOut' }}
          />
        ))}

        {/* Center circle */}
        <motion.div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#d4af78] flex items-center justify-center"
          style={{
            width: 80,
            height: 80,
            boxShadow: '0 0 40px rgba(212, 175, 120, 0.4)'
          }}
          animate={{ scale: breathScale }}
          transition={{ duration: transitionDuration, ease: 'easeInOut' }}
        >
          <p className="text-[#08080f] text-[12px] font-bold">{breathPhase}</p>
        </motion.div>
      </div>

      <p className="absolute left-1/2 -translate-x-1/2 text-[#888888] text-[12px] top-[390px] text-center">
        inhale 4 · hold 4 · exhale 6
      </p>

      <div className="absolute h-[1px] left-[77px] right-[77px] top-[421px] bg-gradient-to-r from-transparent via-[#222222] to-transparent" />

      {/* Mood selection */}
      <p className="absolute left-1/2 -translate-x-1/2 text-[#f0e6cc] text-[15px] font-bold top-[437px] text-center">
        How are you feeling right now?
      </p>

      <div className="absolute left-[27px] top-[465px] grid grid-cols-3 gap-[12px]">
        {moods.map((mood) => (
          <motion.button
            key={mood.label}
            className={`bg-[#0b0a18] border border-solid h-[64px] rounded-[12px] w-[96px] cursor-pointer flex flex-col items-center justify-center ${
              selectedMood === mood.label ? 'border-[#d4af78]' : 'border-[#222222]'
            }`}
            style={{
              boxShadow: selectedMood === mood.label ? '0 0 16px rgba(212, 175, 120, 0.3)' : 'none'
            }}
            whileHover={{ scale: 1.05, borderColor: '#d4af78' }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedMood(mood.label)}
          >
            <p className="text-[22px] mb-1">{mood.emoji}</p>
            <p className="text-[#888888] text-[11px]">{mood.label}</p>
          </motion.button>
        ))}
      </div>

      {/* Energy slider */}
      <p className="absolute font-bold left-[27px] text-[#f0e6cc] text-[13px] top-[637px]">
        Energy level
      </p>
      <p className="absolute font-normal left-[27px] text-[#888888] text-[11px] top-[659px]">Low</p>
      <p className="absolute font-normal right-[27px] text-[#888888] text-[11px] top-[659px]">High</p>

      <div className="absolute bg-[#1a1a1a] h-[6px] left-[27px] rounded-[3px] top-[679px] w-[330px]" />
      <div
        className="absolute bg-[#d4af78] h-[6px] left-[27px] rounded-[3px] top-[679px] transition-all duration-150"
        style={{
          width: `${(energy / 100) * 330}px`,
          boxShadow: '0 0 12px rgba(212, 175, 120, 0.4)'
        }}
      />
      <input
        type="range"
        min="0"
        max="100"
        value={energy}
        onChange={(e) => setEnergy(Number(e.target.value))}
        className="absolute left-[27px] top-[673px] w-[330px] h-[20px] opacity-0 cursor-pointer"
      />

      {/* Continue button */}
      <motion.button
        className="absolute bg-[#d4af78] h-[52px] left-[27px] rounded-[26px] top-[717px] w-[330px] cursor-pointer disabled:opacity-30"
        style={{
          boxShadow: selectedMood ? '0 0 24px rgba(212, 175, 120, 0.3)' : 'none'
        }}
        whileHover={{ scale: selectedMood ? 1.02 : 1 }}
        whileTap={{ scale: selectedMood ? 0.98 : 1 }}
        onClick={handleContinue}
        disabled={!selectedMood}
      >
        <p className="font-bold text-[#08080f] text-[16px] text-center">
          {`I'm ready  →`}
        </p>
      </motion.button>

      {/* Home indicator */}
      <div className="absolute bg-[#333333] h-[4px] left-[142px] rounded-[2px] bottom-[8px] w-[100px]" />
    </div>
  );
}
