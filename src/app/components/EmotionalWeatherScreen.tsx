import { useEffect, useRef } from 'react';
import { motion } from 'motion/react';

// ─── Mood → emotion palette ───────────────────────────────────────────────────

const MOOD_PALETTES: Record<string, { name: string; percent: number; color: string; hex: string }[]> = {
  Drained:  [
    { name: 'Tired',    percent: 42, color: 'rgba(102,136,170,1)',  hex: '#6688aa' },
    { name: 'Hopeful',  percent: 28, color: 'rgba(212,175,120,1)',  hex: '#d4af78' },
    { name: 'Peaceful', percent: 18, color: 'rgba(136,200,168,1)',  hex: '#88c8a8' },
    { name: 'Anxious',  percent: 12, color: 'rgba(196,160,224,1)',  hex: '#c4a0e0' },
  ],
  Heavy:    [
    { name: 'Heavy',    percent: 40, color: 'rgba(122,106,170,1)',  hex: '#7a6aaa' },
    { name: 'Tired',    percent: 28, color: 'rgba(102,136,170,1)',  hex: '#6688aa' },
    { name: 'Hopeful',  percent: 20, color: 'rgba(212,175,120,1)',  hex: '#d4af78' },
    { name: 'Grateful', percent: 12, color: 'rgba(136,200,168,1)',  hex: '#88c8a8' },
  ],
  Anxious:  [
    { name: 'Anxious',  percent: 42, color: 'rgba(196,160,224,1)',  hex: '#c4a0e0' },
    { name: 'Hopeful',  percent: 28, color: 'rgba(212,175,120,1)',  hex: '#d4af78' },
    { name: 'Tired',    percent: 18, color: 'rgba(102,136,170,1)',  hex: '#6688aa' },
    { name: 'Grateful', percent: 12, color: 'rgba(136,200,168,1)',  hex: '#88c8a8' },
  ],
  Meh:      [
    { name: 'Meh',      percent: 38, color: 'rgba(136,136,160,1)',  hex: '#8888a0' },
    { name: 'Hopeful',  percent: 30, color: 'rgba(212,175,120,1)',  hex: '#d4af78' },
    { name: 'Tired',    percent: 20, color: 'rgba(102,136,170,1)',  hex: '#6688aa' },
    { name: 'Grateful', percent: 12, color: 'rgba(136,200,168,1)',  hex: '#88c8a8' },
  ],
  Neutral:  [
    { name: 'Neutral',  percent: 35, color: 'rgba(152,152,184,1)',  hex: '#9898b8' },
    { name: 'Hopeful',  percent: 32, color: 'rgba(212,175,120,1)',  hex: '#d4af78' },
    { name: 'Grateful', percent: 20, color: 'rgba(136,200,168,1)',  hex: '#88c8a8' },
    { name: 'Tired',    percent: 13, color: 'rgba(102,136,170,1)',  hex: '#6688aa' },
  ],
  'Okay-ish': [
    { name: 'Okay',     percent: 38, color: 'rgba(212,200,120,1)',  hex: '#d4c878' },
    { name: 'Hopeful',  percent: 32, color: 'rgba(212,175,120,1)',  hex: '#d4af78' },
    { name: 'Grateful', percent: 18, color: 'rgba(136,200,168,1)',  hex: '#88c8a8' },
    { name: 'Tired',    percent: 12, color: 'rgba(102,136,170,1)',  hex: '#6688aa' },
  ],
  Good:     [
    { name: 'Hopeful',  percent: 42, color: 'rgba(212,175,120,1)',  hex: '#d4af78' },
    { name: 'Grateful', percent: 28, color: 'rgba(136,200,168,1)',  hex: '#88c8a8' },
    { name: 'Anxious',  percent: 18, color: 'rgba(196,160,224,1)',  hex: '#c4a0e0' },
    { name: 'Tired',    percent: 12, color: 'rgba(102,136,170,1)',  hex: '#6688aa' },
  ],
  Grateful: [
    { name: 'Grateful', percent: 45, color: 'rgba(136,200,168,1)',  hex: '#88c8a8' },
    { name: 'Hopeful',  percent: 30, color: 'rgba(212,175,120,1)',  hex: '#d4af78' },
    { name: 'Joyful',   percent: 15, color: 'rgba(212,200,120,1)',  hex: '#d4c878' },
    { name: 'Anxious',  percent: 10, color: 'rgba(196,160,224,1)',  hex: '#c4a0e0' },
  ],
};

const DEFAULT_PALETTE = MOOD_PALETTES['Neutral'];

// ─── Aurora canvas ────────────────────────────────────────────────────────────
// Draws a live animated canvas using the mood colours — much richer than CSS blobs

function AuroraOrb({ emotions }: { emotions: typeof DEFAULT_PALETTE }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef  = useRef<number>(0);
  const timeRef   = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const SIZE = 280;
    canvas.width  = SIZE;
    canvas.height = SIZE;
    const cx = SIZE / 2;
    const cy = SIZE / 2;
    const R  = SIZE / 2;

    // Pre-parse colours to rgb components
    const parsed = emotions.map(e => {
      const hex = e.hex.replace('#', '');
      return {
        r: parseInt(hex.slice(0, 2), 16),
        g: parseInt(hex.slice(2, 4), 16),
        b: parseInt(hex.slice(4, 6), 16),
        weight: e.percent / 100,
        speed:  0.18 + Math.random() * 0.22,   // unique drift speed per emotion
        phaseX: Math.random() * Math.PI * 2,
        phaseY: Math.random() * Math.PI * 2,
        orbitR: 55 + Math.random() * 45,        // how far each blob drifts
        size:   0.48 + e.percent / 100 * 0.42,  // blob radius as fraction of orb
      };
    });

    let start: number | null = null;

    const draw = (ts: number) => {
      if (!start) start = ts;
      const t = (ts - start) / 1000;
      timeRef.current = t;

      // Clip to circle
      ctx.clearRect(0, 0, SIZE, SIZE);
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.clip();

      // Deep space background
      ctx.fillStyle = '#06060f';
      ctx.fillRect(0, 0, SIZE, SIZE);

      // Draw each emotion blob as a soft radial gradient
      // Using globalCompositeOperation = 'screen' for aurora-like blending
      ctx.globalCompositeOperation = 'screen';

      for (let i = 0; i < parsed.length; i++) {
        const p = parsed[i];
        const bx = cx + Math.sin(t * p.speed + p.phaseX) * p.orbitR;
        const by = cy + Math.cos(t * p.speed * 0.73 + p.phaseY) * p.orbitR * 0.8;
        const br = R * p.size;

        // Pulsing opacity tied to weight
        const opacity = 0.55 + p.weight * 0.35 + Math.sin(t * p.speed * 0.5) * 0.08;

        const grad = ctx.createRadialGradient(bx, by, 0, bx, by, br);
        grad.addColorStop(0,   `rgba(${p.r},${p.g},${p.b},${opacity})`);
        grad.addColorStop(0.4, `rgba(${p.r},${p.g},${p.b},${opacity * 0.55})`);
        grad.addColorStop(1,   `rgba(${p.r},${p.g},${p.b},0)`);

        ctx.beginPath();
        ctx.arc(bx, by, br, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      }

      // Subtle rotating shimmer highlight (white screen blend)
      ctx.globalCompositeOperation = 'screen';
      const sx = cx + Math.sin(t * 0.3) * 30;
      const sy = cy + Math.cos(t * 0.2) * 25;
      const sg = ctx.createRadialGradient(sx, sy, 0, sx, sy, 70);
      sg.addColorStop(0,   'rgba(255,255,255,0.07)');
      sg.addColorStop(1,   'rgba(255,255,255,0)');
      ctx.beginPath();
      ctx.arc(sx, sy, 70, 0, Math.PI * 2);
      ctx.fillStyle = sg;
      ctx.fill();

      ctx.restore();

      // Soft vignette ring to feather the edge
      ctx.save();
      const vg = ctx.createRadialGradient(cx, cy, R * 0.68, cx, cy, R);
      vg.addColorStop(0, 'rgba(6,6,15,0)');
      vg.addColorStop(1, 'rgba(6,6,15,0.72)');
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.fillStyle = vg;
      ctx.fill();
      ctx.restore();

      frameRef.current = requestAnimationFrame(draw);
    };

    frameRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frameRef.current);
  }, [emotions]);

  return (
    <canvas
      ref={canvasRef}
      width={280}
      height={280}
      style={{ borderRadius: '50%', display: 'block' }}
    />
  );
}

// ─── Main screen ──────────────────────────────────────────────────────────────

export default function EmotionalWeatherScreen({
  onBack, onNavigate, userMood,
}: {
  onBack: () => void;
  onNavigate: (screen: string) => void;
  userMood?: string | null;
}) {
  const emotions = MOOD_PALETTES[userMood ?? ''] ?? DEFAULT_PALETTE;
  const dominantEmotion = emotions[0];
  const dominantHex     = dominantEmotion.hex;

  // Today's date
  const dateStr = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <div className="bg-[#06060f] overflow-y-auto relative rounded-[36px] size-full" style={{ scrollbarWidth: 'none' }}>

      {/* Status bar */}
      <div className="absolute h-[44px] left-0 top-0 w-full z-10 bg-gradient-to-b from-[#06060f] to-transparent pointer-events-none" />
      <p className="absolute font-bold left-[13px] text-[#f0e6cc] text-[13px] top-[10px] z-10">9:41</p>

      {/* Back */}
      <motion.button
        className="absolute left-[17px] top-[55px] z-10 cursor-pointer flex items-center gap-[6px]"
        whileTap={{ scale: 0.9 }}
        onClick={onBack}
      >
        <p className="text-[20px]" style={{ color: dominantHex }}>←</p>
        <p className="text-[#f0e6cc] text-[14px] font-medium">Emotional Weather</p>
      </motion.button>

      {/* Header */}
      <div className="pt-[100px] px-[24px] pb-[4px] text-center">
        <p className="font-bold text-[#f0e6cc] text-[22px] mb-[4px]">
          How the world feels today
        </p>
        <p className="text-[#888888] text-[12px]">{dateStr}</p>
        {userMood && (
          <motion.div
            className="inline-flex items-center gap-[6px] mt-[10px] px-[12px] py-[5px] rounded-full"
            style={{
              background: `${dominantHex}18`,
              border: `1px solid ${dominantHex}50`,
            }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <p className="text-[11px] font-medium" style={{ color: dominantHex }}>
              Your mood today: {userMood}
            </p>
          </motion.div>
        )}
      </div>

      {/* Aurora orb */}
      <motion.div
        className="mx-auto mt-[20px] relative"
        style={{ width: 280, height: 280 }}
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
      >
        {/* Outer glow ring — colour of dominant mood */}
        <div
          className="absolute inset-[-12px] rounded-full pointer-events-none"
          style={{
            boxShadow: `0 0 60px 12px ${dominantHex}28, 0 0 120px 24px ${dominantHex}10`,
          }}
        />
        {/* Subtle rotating border */}
        <motion.div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            border: `1px solid ${dominantHex}35`,
          }}
          animate={{ opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />

        <AuroraOrb emotions={emotions} />
      </motion.div>

      {/* Legend */}
      <motion.div
        className="mx-[24px] mt-[24px] grid grid-cols-2 gap-x-[16px] gap-y-[10px]"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        {emotions.map((e, i) => (
          <motion.div
            key={e.name}
            className="flex items-center gap-[8px]"
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 + i * 0.08 }}
          >
            <div
              className="size-[10px] rounded-full shrink-0"
              style={{ backgroundColor: e.hex, boxShadow: `0 0 6px ${e.hex}80` }}
            />
            <p className="text-[#f0e6cc] text-[12px] font-medium">{e.name}</p>
            <p className="text-[#888888] text-[12px] ml-auto">{e.percent}%</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Delta comparison */}
      <motion.div
        className="mx-[24px] mt-[16px] rounded-[14px] px-[16px] py-[13px]"
        style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)',
        }}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
      >
        <p className="text-[#888888] text-[11px] mb-[8px]">Compared to yesterday</p>
        <div className="flex gap-[16px]">
          <div className="flex items-center gap-[6px]">
            <span className="text-[#88c8a8] text-[16px]">↑</span>
            <p className="text-[#f0e6cc] text-[12px]">Hope +6%</p>
          </div>
          <div className="flex items-center gap-[6px]">
            <span className="text-[#c4a0e0] text-[16px]">↓</span>
            <p className="text-[#f0e6cc] text-[12px]">Anxiety −3%</p>
          </div>
        </div>
      </motion.div>

      {/* Message card */}
      <motion.div
        className="mx-[24px] mt-[12px] mb-[8px] rounded-[14px] px-[18px] py-[16px]"
        style={{
          background: `linear-gradient(135deg, ${dominantHex}12, rgba(255,255,255,0.03))`,
          border: `1px solid ${dominantHex}30`,
        }}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1 }}
      >
        <p className="text-[#f0e6cc] text-[14px] leading-relaxed text-center mb-[10px]">
          More people feel hopeful today than any day this week. You are not alone in whatever you're carrying.
        </p>
        <motion.button
          className="text-[13px] underline underline-offset-2 mx-auto block font-medium"
          style={{ color: dominantHex }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onNavigate('sharedReflections')}
        >
          See what people are saying →
        </motion.button>
      </motion.div>

      {/* Footnote */}
      <p className="text-center text-[#555555] text-[10px] pb-[24px]">
        Based on 8,432 anonymous check-ins today
      </p>
    </div>
  );
}
