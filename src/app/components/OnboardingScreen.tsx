import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Starfield } from './CosmicElements';

// ─── localStorage key ─────────────────────────────────────────────────────────
export const LS_ONBOARDING = 'becoming_onboarding_seen';

// ─── Slide illustrations ──────────────────────────────────────────────────────

function IllustrationWelcome() {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Outer glow rings */}
      {[160, 120, 84].map((size, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border border-[#d4af78]"
          style={{ width: size, height: size, opacity: 0.12 - i * 0.03 }}
          animate={{ scale: [1, 1.06, 1], opacity: [0.12 - i * 0.03, 0.22 - i * 0.03, 0.12 - i * 0.03] }}
          transition={{ duration: 3 + i * 0.6, repeat: Infinity, ease: 'easeInOut', delay: i * 0.4 }}
        />
      ))}
      {/* Centre star */}
      <motion.p
        className="text-[#d4af78] text-[64px] relative z-10 select-none"
        animate={{ scale: [1, 1.08, 1], opacity: [0.9, 1, 0.9] }}
        transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
        style={{ filter: 'drop-shadow(0 0 28px rgba(212,175,120,0.6))' }}
      >
        ✦
      </motion.p>
    </div>
  );
}

function IllustrationCheckin() {
  const moods = ['😴','😔','😰','😑','😐','😅','😊','✨'];
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div className="grid grid-cols-4 gap-[10px]">
        {moods.map((emoji, i) => (
          <motion.div
            key={i}
            className="size-[52px] rounded-[14px] flex items-center justify-center"
            style={{
              background: i === 6
                ? 'rgba(212,175,120,0.25)'
                : 'rgba(255,255,255,0.05)',
              border: `1px solid ${i === 6 ? 'rgba(212,175,120,0.6)' : 'rgba(255,255,255,0.08)'}`,
              boxShadow: i === 6 ? '0 0 20px rgba(212,175,120,0.25)' : 'none',
            }}
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 + i * 0.06, duration: 0.35, type: 'spring', stiffness: 260, damping: 20 }}
          >
            <p className="text-[22px] select-none">{emoji}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function IllustrationSky() {
  // Mini constellation — 5 stars connected by lines
  const stars = [
    { x: 100, y: 40  },
    { x: 168, y: 70  },
    { x: 200, y: 130 },
    { x: 120, y: 155 },
    { x: 60,  y: 110 },
  ];
  const lines = [[0,1],[1,2],[2,3],[3,4],[4,0],[0,2]];

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <svg width="260" height="200" viewBox="0 0 260 200" overflow="visible">
        {/* Connection lines */}
        {lines.map(([a, b], i) => (
          <motion.line
            key={i}
            x1={stars[a].x} y1={stars[a].y}
            x2={stars[b].x} y2={stars[b].y}
            stroke="#d4af78" strokeWidth="0.8" strokeDasharray="4 6"
            initial={{ opacity: 0 }} animate={{ opacity: 0.3 }}
            transition={{ delay: 0.3 + i * 0.1 }}
          />
        ))}
        {/* Stars */}
        {stars.map((s, i) => (
          <g key={i}>
            <motion.circle
              cx={s.x} cy={s.y} r={i === 0 ? 9 : 6}
              fill={i === 0 ? '#d4af78' : '#c4a0e0'}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.15 + i * 0.12, type: 'spring', stiffness: 300, damping: 18 }}
              style={{ filter: `drop-shadow(0 0 ${i === 0 ? 10 : 6}px ${i === 0 ? 'rgba(212,175,120,0.8)' : 'rgba(196,160,224,0.7)'})` }}
            />
            {/* Pulse ring on first star */}
            {i === 0 && (
              <motion.circle
                cx={s.x} cy={s.y} r={9}
                fill="none" stroke="#d4af78" strokeWidth="1"
                animate={{ r: [9, 22], opacity: [0.6, 0] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: 'easeOut' }}
              />
            )}
          </g>
        ))}
      </svg>
    </div>
  );
}

function IllustrationAI() {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center gap-[14px] px-[24px]">
      {/* AI bubble */}
      <motion.div
        className="self-start max-w-[220px] rounded-[18px] rounded-tl-[4px] px-[14px] py-[10px]"
        style={{
          background: 'rgba(196,160,224,0.16)',
          border: '1px solid rgba(196,160,224,0.30)',
        }}
        initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        <p className="text-[#f0e6cc] text-[13px] leading-relaxed">
          What's one thing you want to tackle this week? ✦
        </p>
      </motion.div>

      {/* User bubble */}
      <motion.div
        className="self-end max-w-[200px] rounded-[18px] rounded-tr-[4px] px-[14px] py-[10px]"
        style={{
          background: 'rgba(255,255,255,0.07)',
          border: '1px solid rgba(255,255,255,0.12)',
        }}
        initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5, duration: 0.4 }}
      >
        <p className="text-[#f0e6cc] text-[13px] leading-relaxed">
          Launch my portfolio site
        </p>
      </motion.div>

      {/* AI response */}
      <motion.div
        className="self-start max-w-[230px] rounded-[18px] rounded-tl-[4px] px-[14px] py-[10px]"
        style={{
          background: 'rgba(196,160,224,0.16)',
          border: '1px solid rgba(196,160,224,0.30)',
        }}
        initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.85, duration: 0.4 }}
      >
        <p className="text-[#f0e6cc] text-[13px] leading-relaxed">
          Let's map that into steps you can actually do ✦
        </p>
      </motion.div>
    </div>
  );
}

// ─── Slide data ───────────────────────────────────────────────────────────────

const SLIDES = [
  {
    key: 'welcome',
    eyebrow: 'WELCOME TO',
    headline: 'Becoming.',
    headlineAccent: 'Becoming.',
    body: "Becoming is your space to reflect on where you are, plan where you're going, and take real action — one star at a time.",
    cta: 'Show me around',
    illustration: IllustrationWelcome,
    accentColor: '#d4af78',
    glowColor: 'rgba(212,175,120,0.15)',
  },
  {
    key: 'checkin',
    eyebrow: '01 / DAILY CHECK-IN',
    headline: 'Start each day\nwith intention.',
    headlineAccent: 'with intention.',
    body: 'A quick check-in grounds you in how you feel and how much energy you have. Your mood shapes the prompts and plans that follow.',
    cta: 'Next',
    illustration: IllustrationCheckin,
    accentColor: '#d4af78',
    glowColor: 'rgba(212,175,120,0.12)',
  },
  {
    key: 'sky',
    eyebrow: '02 / YOUR SKY',
    headline: 'Your growth,\nmapped in stars.',
    headlineAccent: 'mapped in stars.',
    body: 'Every reflection becomes a star. Every plan becomes a constellation. Watch your night sky fill up as you show up for yourself.',
    cta: 'Next',
    illustration: IllustrationSky,
    accentColor: '#c4a0e0',
    glowColor: 'rgba(196,160,224,0.12)',
  },
  {
    key: 'ai',
    eyebrow: '03 / AI COMPANION',
    headline: 'A guide that\nhelps you act.',
    headlineAccent: 'helps you act.',
    body: 'Talk to your AI companion to break any goal into clear, real steps. No judgment — just action, mapped out and ready to go.',
    cta: "I'm ready →",
    illustration: IllustrationAI,
    accentColor: '#c4a0e0',
    glowColor: 'rgba(196,160,224,0.12)',
  },
];

// ─── Main component ───────────────────────────────────────────────────────────

export default function OnboardingScreen({ onNavigate }: { onNavigate: (screen: string) => void }) {
  const [slideIndex, setSlideIndex] = useState(0);
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = back

  const slide = SLIDES[slideIndex];
  const isLast = slideIndex === SLIDES.length - 1;

  const advance = () => {
    if (isLast) {
      localStorage.setItem(LS_ONBOARDING, 'true');
      onNavigate('checkin');
    } else {
      setDirection(1);
      setSlideIndex(i => i + 1);
    }
  };

  const skip = () => {
    localStorage.setItem(LS_ONBOARDING, 'true');
    onNavigate('checkin');
  };

  const Illustration = slide.illustration;

  return (
    <div className="bg-[#08080f] overflow-hidden relative rounded-[36px] size-full">
      <Starfield density={50} />

      {/* Ambient glow behind illustration */}
      <motion.div
        key={slide.key + '-glow'}
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 320, height: 320,
          left: '50%', top: 160,
          transform: 'translateX(-50%)',
          background: `radial-gradient(ellipse at center, ${slide.glowColor} 0%, transparent 70%)`,
        }}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      />

      {/* Status bar */}
      <div className="absolute h-[44px] left-0 top-0 w-full z-10 bg-gradient-to-b from-[#08080f] to-transparent pointer-events-none" />
      <p className="absolute font-bold left-[13px] text-[#f0e6cc] text-[13px] top-[10px] z-10">9:41</p>
      <p className="absolute font-normal right-[20px] text-[#888888] text-[11px] top-[11px] z-10">▶ ▶▶ ▊▊</p>

      {/* Skip button (top-right, hidden on last slide) */}
      {!isLast && (
        <motion.button
          className="absolute right-[20px] top-[56px] z-10 cursor-pointer"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
          onClick={skip}
        >
          <p className="text-[#555568] text-[13px]">Skip</p>
        </motion.button>
      )}

      {/* Progress dots */}
      <div className="absolute left-1/2 -translate-x-1/2 top-[60px] flex gap-[6px] z-10">
        {SLIDES.map((_, i) => (
          <motion.div
            key={i}
            className="h-[4px] rounded-full"
            animate={{
              width: i === slideIndex ? 24 : 6,
              backgroundColor: i === slideIndex
                ? slide.accentColor
                : i < slideIndex ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.15)',
            }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          />
        ))}
      </div>

      {/* Illustration area */}
      <div className="absolute left-0 right-0 top-[88px] h-[260px]">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={slide.key}
            className="absolute inset-0"
            custom={direction}
            initial={{ opacity: 0, x: direction * 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -40 }}
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
          >
            <Illustration />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Text content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.key + '-text'}
          className="absolute left-[28px] right-[28px] top-[364px]"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
        >
          {/* Eyebrow */}
          {slide.eyebrow ? (
            <p className="text-[11px] tracking-[0.14em] uppercase mb-[12px]"
               style={{ color: slide.accentColor, opacity: 0.7 }}>
              {slide.eyebrow}
            </p>
          ) : (
            <div className="mb-[12px] h-[16px]" />
          )}

          {/* Headline — split so accent word glows */}
          <p className="font-bold text-[#f0e6cc] text-[30px] leading-[1.2] mb-[14px] whitespace-pre-line">
            {slide.headline.replace(slide.headlineAccent, '').trim()}
            {'\n'}
            <span style={{ color: slide.accentColor }}>{slide.headlineAccent}</span>
          </p>

          {/* Body */}
          <p className="text-[#8888a0] text-[14px] leading-[1.65]">
            {slide.body}
          </p>
        </motion.div>
      </AnimatePresence>

      {/* CTA button */}
      <motion.button
        className="absolute left-[28px] right-[28px] h-[54px] rounded-[27px] flex items-center justify-center cursor-pointer"
        style={{
          bottom: 100,
          background: slide.accentColor,
          boxShadow: `0 0 28px ${slide.glowColor.replace('0.15', '0.4').replace('0.12', '0.35')}`,
        }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={advance}
        key={slide.key + '-cta'}
        layout
      >
        <p className="font-bold text-[#08080f] text-[16px]">{slide.cta}</p>
      </motion.button>

      {/* Secondary skip / "I'll explore later" (last slide only shows nothing extra) */}
      {!isLast && (
        <motion.button
          className="absolute left-1/2 -translate-x-1/2 cursor-pointer whitespace-nowrap"
          style={{ bottom: 68 }}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          onClick={skip}
        >
          <p className="text-[#555568] text-[12px] underline underline-offset-2">I'll explore on my own</p>
        </motion.button>
      )}

      {/* Home indicator */}
      <div className="absolute bg-[#333333] h-[4px] left-[142px] rounded-[2px] bottom-[8px] w-[100px]" />
    </div>
  );
}
