import { motion } from 'motion/react';
import { useTheme } from '../context/ThemeContext';

// ─── Cloud shape (light mode only) ───────────────────────────────────────────

interface CloudProps {
  left: string; top: string;
  width: number; opacity: number;
  driftDur: number; driftDelay: number;
}

function Cloud({ left, top, width, opacity, driftDur, driftDelay }: CloudProps) {
  const h = Math.round(width * 0.44);
  return (
    <motion.div
      className="absolute pointer-events-none select-none"
      style={{ left, top }}
      animate={{ x: [0, -18, 0] }}
      transition={{ duration: driftDur, repeat: Infinity, ease: 'easeInOut', delay: driftDelay }}
    >
      <svg width={width} height={h} viewBox="0 0 200 88" xmlns="http://www.w3.org/2000/svg">
        {/* Base layer — slightly softer, wider */}
        <ellipse cx="100" cy="76" rx="96" ry="16" fill="white" fillOpacity={opacity * 0.7} />
        {/* Puffs */}
        <circle cx="56"  cy="60" r="28" fill="white" fillOpacity={opacity} />
        <circle cx="100" cy="46" r="38" fill="white" fillOpacity={opacity} />
        <circle cx="148" cy="58" r="26" fill="white" fillOpacity={opacity} />
        {/* Small detail puffs */}
        <circle cx="30"  cy="68" r="16" fill="white" fillOpacity={opacity * 0.85} />
        <circle cx="172" cy="66" r="14" fill="white" fillOpacity={opacity * 0.85} />
      </svg>
    </motion.div>
  );
}

// ─── Sky clouds layer ─────────────────────────────────────────────────────────

const CLOUDS: CloudProps[] = [
  { left: '-5%',  top: '2%',  width: 340, opacity: 0.82, driftDur: 62,  driftDelay: 0   },
  { left: '55%',  top: '4%',  width: 260, opacity: 0.70, driftDur: 78,  driftDelay: -22 },
  { left: '10%',  top: '13%', width: 210, opacity: 0.58, driftDur: 90,  driftDelay: -35 },
  { left: '62%',  top: '20%', width: 290, opacity: 0.44, driftDur: 68,  driftDelay: -12 },
  { left: '-8%',  top: '30%', width: 200, opacity: 0.30, driftDur: 105, driftDelay: -48 },
  { left: '44%',  top: '38%', width: 170, opacity: 0.18, driftDur: 120, driftDelay: -60 },
];

// ─── Starfield / Cloud layer ──────────────────────────────────────────────────

export function Starfield({ density = 50, className = '' }: { density?: number; className?: string }) {
  const { isDark } = useTheme();

  if (!isDark) {
    // Light mode → animated cloud layer instead of stars
    return (
      <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
        {CLOUDS.map((cloud, i) => (
          <Cloud key={i} {...cloud} />
        ))}
      </div>
    );
  }

  // Dark mode → twinkling stars
  const stars = Array.from({ length: density }, (_, i) => {
    // Use a seeded-ish value so re-renders don't shift positions
    const seed = (i * 7919 + 1) % 1000;
    return {
      x:       ((seed * 137) % 1000) / 10,
      y:       ((seed * 251) % 1000) / 10,
      size:    1 + (seed % 3) * 0.7,
      opacity: 0.3 + (seed % 10) * 0.05,
      delay:   (seed % 30) / 10,
    };
  });

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      {stars.map((star, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-[#f0e6cc]"
          style={{
            left:      `${star.x}%`,
            top:       `${star.y}%`,
            width:     `${star.size}px`,
            height:    `${star.size}px`,
            opacity:    star.opacity,
            animation: `twinkle ${2 + star.delay}s ease-in-out ${star.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

// ─── Nebula glow ──────────────────────────────────────────────────────────────

export function NebulaGlow({ color = 'purple', className = '' }: { color?: 'purple' | 'gold'; className?: string }) {
  const { isDark } = useTheme();

  const darkColors  = { purple: '#c4a0e0', gold: '#d4af78' };
  const lightColors = { purple: '#a0c4f5', gold: '#f5d080' }; // soft sky tints in light mode

  return (
    <div className={`absolute pointer-events-none ${className}`}>
      <div
        className="w-full h-full blur-[90px] rounded-full"
        style={{
          backgroundColor: isDark ? darkColors[color] : lightColors[color],
          opacity: isDark ? 0.20 : 0.35,
        }}
      />
    </div>
  );
}

// ─── Constellation node ───────────────────────────────────────────────────────

export function ConstellationNode({ size = 8, glow = false, className = '' }: { size?: number; glow?: boolean; className?: string }) {
  return (
    <div className={`absolute ${className}`}>
      <div
        className="rounded-full bg-[#d4af78]"
        style={{
          width:     `${size}px`,
          height:    `${size}px`,
          boxShadow: glow ? '0 0 12px rgba(212,175,120,0.6), 0 0 24px rgba(212,175,120,0.3)' : 'none',
        }}
      />
    </div>
  );
}
