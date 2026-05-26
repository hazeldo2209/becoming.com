import { useState, useEffect } from 'react';
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
    eyebrow: '',
    headline: 'Welcome to\nBecoming.',
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

// ─── Desktop interactive tour ─────────────────────────────────────────────────

const SIDEBAR_W = 216; // matches DesktopLayout w-[216px]
const TASK_W    = 288; // matches DesktopLayout w-[288px]

// NAV_START: brand block ~90px + divider+mb ~11px = ~101px
// Each nav item: h-[40px] + space-y-[2px] = 42px
const NAV_START    = 101;
const NAV_ITEM_H   = 40;
const NAV_GAP      = 2;

interface Spot { x: number; y: number; w: number; h: number; r: number }

interface DesktopStep {
  id: string;
  title: string;
  body: string;
  cta: string;
  accent: string;
  spotlight: Spot | null;
  side: 'center' | 'right-of-sidebar' | 'left-of-tasks';
}

function buildDesktopSteps(vw: number, vh: number): DesktopStep[] {
  const aiY = NAV_START + 2 * (NAV_ITEM_H + NAV_GAP); // AI Companion is 3rd nav item (index 2)
  return [
    {
      id: 'welcome',
      title: 'Welcome to Becoming',
      body: "You're on the desktop app. Let's take a quick tour so you know exactly where everything lives — it'll take 30 seconds.",
      cta: 'Take the tour →',
      accent: '#d4af78',
      spotlight: null,
      side: 'center',
    },
    {
      id: 'nav',
      title: 'Your navigation',
      body: 'Everything is in this sidebar. Switch between Today, My Sky, AI Companion, Community, and your Profile anytime you like.',
      cta: 'Next',
      accent: '#d4af78',
      spotlight: { x: 0, y: 0, w: SIDEBAR_W, h: vh, r: 0 },
      side: 'right-of-sidebar',
    },
    {
      id: 'ai',
      title: '✦ AI Companion',
      body: 'This is your most powerful tool. Chat with your AI to break any goal into a clear, real action plan — steps you can actually take.',
      cta: 'Next',
      accent: '#c4a0e0',
      spotlight: { x: 8, y: aiY, w: SIDEBAR_W - 16, h: NAV_ITEM_H, r: 10 },
      side: 'right-of-sidebar',
    },
    {
      id: 'tasks',
      title: 'Your tasks panel',
      body: 'Every plan you create with the AI companion appears here automatically. Check off tasks as you go — progress saves to your account.',
      cta: 'Next',
      accent: '#88c8a8',
      spotlight: { x: vw - TASK_W, y: 0, w: TASK_W, h: vh, r: 0 },
      side: 'left-of-tasks',
    },
    {
      id: 'sky',
      title: '🌌 My Sky',
      body: 'Every reflection you write becomes a star. Every plan becomes a constellation. Watch your night sky fill up as you show up for yourself.',
      cta: 'Next',
      accent: '#c4a0e0',
      spotlight: { x: 8, y: NAV_START + 1 * (NAV_ITEM_H + NAV_GAP), w: SIDEBAR_W - 16, h: NAV_ITEM_H, r: 10 },
      side: 'right-of-sidebar',
    },
    {
      id: 'ready',
      title: "You're all set ✦",
      body: "Start with a quick daily check-in to ground yourself for today. It takes under a minute and shapes everything that follows.",
      cta: "Start my first check-in →",
      accent: '#d4af78',
      spotlight: null,
      side: 'center',
    },
  ];
}

function DesktopTour({ onFinish }: { onFinish: () => void }) {
  const [stepIdx, setStepIdx] = useState(0);
  const [vw, setVw] = useState(() => window.innerWidth);
  const [vh, setVh] = useState(() => window.innerHeight);

  useEffect(() => {
    const handle = () => { setVw(window.innerWidth); setVh(window.innerHeight); };
    window.addEventListener('resize', handle);
    return () => window.removeEventListener('resize', handle);
  }, []);

  const steps = buildDesktopSteps(vw, vh);
  const s     = steps[stepIdx];
  const isLast = stepIdx === steps.length - 1;

  const advance = () => {
    if (isLast) { onFinish(); return; }
    setStepIdx(i => i + 1);
  };

  // ── Tooltip card positioning ───────────────────────────────────────────────
  const CARD_W        = 304;
  const CARD_H_EST    = 210;
  const mainCX        = SIDEBAR_W + (vw - SIDEBAR_W - TASK_W) / 2;

  let cardLeft = mainCX - CARD_W / 2;
  let cardTop  = vh / 2 - CARD_H_EST / 2;

  if (s.side === 'right-of-sidebar') {
    cardLeft = SIDEBAR_W + 32;
    // For a small spotlight (single nav item), center card on that item
    if (s.spotlight && s.spotlight.h < vh / 3) {
      cardTop = Math.max(24, s.spotlight.y + s.spotlight.h / 2 - CARD_H_EST / 2);
    }
  } else if (s.side === 'left-of-tasks') {
    cardLeft = vw - TASK_W - 36 - CARD_W;
  }

  // Clamp so card stays in the main content column
  cardLeft = Math.max(SIDEBAR_W + 16, Math.min(vw - TASK_W - CARD_W - 16, cardLeft));
  cardTop  = Math.max(24, Math.min(vh - CARD_H_EST - 24, cardTop));

  return (
    <div className="fixed inset-0 z-[100]">
      {/* ── SVG dim overlay with spotlight cutout ───────────────────────── */}
      <svg
        className="absolute inset-0 pointer-events-none"
        style={{ width: '100%', height: '100%' }}
        viewBox={`0 0 ${vw} ${vh}`}
        preserveAspectRatio="none"
      >
        <defs>
          <mask id="tour-spotlight-mask">
            <rect width="100%" height="100%" fill="white" />
            {s.spotlight && (
              <rect
                x={s.spotlight.x}
                y={s.spotlight.y}
                width={s.spotlight.w}
                height={s.spotlight.h}
                rx={s.spotlight.r}
                ry={s.spotlight.r}
                fill="black"
              />
            )}
          </mask>
        </defs>
        <rect
          width="100%"
          height="100%"
          fill="rgba(4,3,16,0.82)"
          mask="url(#tour-spotlight-mask)"
        />
      </svg>

      {/* ── Animated glow border around spotlight ───────────────────────── */}
      {s.spotlight && (
        <motion.div
          key={s.id + '-ring'}
          className="absolute pointer-events-none"
          style={{
            left:         s.spotlight.x,
            top:          s.spotlight.y,
            width:        s.spotlight.w,
            height:       s.spotlight.h,
            borderRadius: s.spotlight.r,
            border:       `1.5px solid ${s.accent}`,
            boxShadow:    `0 0 20px ${s.accent}55, inset 0 0 12px ${s.accent}18`,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0.55, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}

      {/* ── Tooltip card ─────────────────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={s.id}
          className="absolute"
          style={{ left: cardLeft, top: cardTop, width: CARD_W }}
          initial={{ opacity: 0, y: 14, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.96 }}
          transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
        >
          <div
            className="rounded-[20px] p-[22px] flex flex-col gap-[16px]"
            style={{
              background:  'rgba(8,7,22,0.98)',
              border:      `1px solid ${s.accent}3a`,
              boxShadow:   `0 0 52px ${s.accent}1a, 0 28px 72px rgba(0,0,0,0.75)`,
            }}
          >
            {/* Progress dots + counter */}
            <div className="flex items-center gap-[5px]">
              {steps.map((_, i) => (
                <motion.div
                  key={i}
                  className="h-[3px] rounded-full"
                  animate={{
                    width:           i === stepIdx ? 20 : 5,
                    backgroundColor: i === stepIdx
                      ? s.accent
                      : i < stepIdx
                        ? 'rgba(255,255,255,0.3)'
                        : 'rgba(255,255,255,0.1)',
                  }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                />
              ))}
              <p className="text-[10px] ml-auto shrink-0 tabular-nums" style={{ color: '#44445a' }}>
                {stepIdx + 1} / {steps.length}
              </p>
            </div>

            {/* Title + body */}
            <div>
              <p className="font-bold text-[#f0e6cc] text-[17px] leading-[1.25] mb-[8px]">
                {s.title}
              </p>
              <p className="text-[#8888a0] text-[13px] leading-[1.65]">
                {s.body}
              </p>
            </div>

            {/* CTA button */}
            <motion.button
              className="w-full h-[46px] rounded-[23px] font-bold text-[14px] text-[#08080f] cursor-pointer"
              style={{
                background:  s.accent,
                boxShadow:   `0 0 24px ${s.accent}44`,
              }}
              whileHover={{ scale: 1.02, boxShadow: `0 0 32px ${s.accent}66` }}
              whileTap={{ scale: 0.97 }}
              onClick={advance}
            >
              {s.cta}
            </motion.button>

            {/* Skip link */}
            {!isLast && (
              <motion.button
                className="text-center text-[11px] cursor-pointer"
                style={{ color: '#3a3a50' }}
                whileHover={{ color: '#666680' }}
                whileTap={{ scale: 0.95 }}
                onClick={onFinish}
              >
                Skip tour
              </motion.button>
            )}
          </div>

          {/* Arrow pointer toward spotlight (right-of-sidebar steps only) */}
          {s.side === 'right-of-sidebar' && s.spotlight && (
            <motion.div
              className="absolute top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ right: '100%', marginRight: 10 }}
              initial={{ opacity: 0, x: 6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.3 }}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M14 10L4 4v12l10-6z" fill={s.accent} opacity="0.7" />
              </svg>
            </motion.div>
          )}

          {/* Arrow pointer toward tasks panel */}
          {s.side === 'left-of-tasks' && s.spotlight && (
            <motion.div
              className="absolute top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ left: '100%', marginLeft: 10 }}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.3 }}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M6 10l10-6v12L6 10z" fill={s.accent} opacity="0.7" />
              </svg>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function OnboardingScreen({ onNavigate, isDesktop }: { onNavigate: (screen: string) => void; isDesktop?: boolean }) {
  const [slideIndex, setSlideIndex] = useState(0);
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = back

  const slide = SLIDES[slideIndex];
  const isLast = slideIndex === SLIDES.length - 1;

  const handleFinish = () => {
    localStorage.setItem(LS_ONBOARDING, 'true');
    onNavigate('checkin');
  };

  // ── Desktop: full-screen interactive tour overlay ──────────────────────────
  if (isDesktop) {
    return <DesktopTour onFinish={handleFinish} />;
  }

  // ── Mobile: swipeable slideshow ───────────────────────────────────────────

  const advance = () => {
    if (isLast) {
      handleFinish();
    } else {
      setDirection(1);
      setSlideIndex(i => i + 1);
    }
  };

  const skip = handleFinish;

  const Illustration = slide.illustration;

  return (
    <div className="bg-[#08080f] overflow-hidden relative rounded-[36px] size-full flex flex-col">
      <Starfield density={50} />

      {/* Ambient glow behind illustration */}
      <motion.div
        key={slide.key + '-glow'}
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 320, height: 320,
          left: '50%', top: 80,
          transform: 'translateX(-50%)',
          background: `radial-gradient(ellipse at center, ${slide.glowColor} 0%, transparent 70%)`,
        }}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      />

      {/* Top bar: progress dots + skip button */}
      <div className="relative z-10 shrink-0 flex items-center justify-between px-[24px] pt-[56px] pb-[8px]">
        <div className="flex gap-[6px]">
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
        {!isLast && (
          <motion.button
            className="cursor-pointer"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
            onClick={skip}
          >
            <p className="text-[#555568] text-[13px]">Skip</p>
          </motion.button>
        )}
      </div>

      {/* Illustration area */}
      <div className="relative z-[1] shrink-0 h-[240px]">
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
          className="relative z-[1] flex-1 px-[28px] pt-[8px] overflow-y-auto"
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

          {/* Headline */}
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

      {/* CTA + secondary skip */}
      <div className="relative z-[1] shrink-0 px-[28px] pb-[8px] flex flex-col items-center gap-[8px]">
        <motion.button
          className="w-full h-[54px] rounded-[27px] flex items-center justify-center cursor-pointer"
          style={{
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

        {!isLast && (
          <motion.button
            className="cursor-pointer py-[4px]"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
            onClick={skip}
          >
            <p className="text-[#555568] text-[12px] underline underline-offset-2">I'll explore on my own</p>
          </motion.button>
        )}
      </div>

      {/* Home indicator */}
      <div className="shrink-0 h-[24px] flex items-center justify-center">
        <div className="bg-[#333333] h-[4px] rounded-[2px] w-[100px]" />
      </div>
    </div>
  );
}
