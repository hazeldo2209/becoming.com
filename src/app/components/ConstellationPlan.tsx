import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import type { KanbanTask, KanbanColumn } from '../types';
import { useTheme } from '../context/ThemeContext';

// ─── Column metadata ──────────────────────────────────────────────────────────

export const COL_META: Record<KanbanColumn, {
  color: string; glow: string; label: string;
  yCenter: number; xMin: number; xMax: number;
}> = {
  'do-now':     { color: '#88c8a8', glow: 'rgba(136,200,168,0.7)', label: '⚡ Do Now',     yCenter: 75, xMin: 14, xMax: 86 },
  'this-week':  { color: '#d4af78', glow: 'rgba(212,175,120,0.7)', label: '📅 This Week',  yCenter: 44, xMin: 20, xMax: 78 },
  'plan-ahead': { color: '#c4a0e0', glow: 'rgba(196,160,224,0.7)', label: '🌱 Plan Ahead', yCenter: 14, xMin: 28, xMax: 70 },
};

// Light-mode variants of each column color — vivid enough to read on sky bg
const COL_LIGHT: Record<KanbanColumn, { color: string; glow: string }> = {
  'do-now':     { color: '#2d8a68', glow: 'rgba(45,138,104,0.55)' },
  'this-week':  { color: '#b07d18', glow: 'rgba(176,125,24,0.55)'  },
  'plan-ahead': { color: '#6b3a9a', glow: 'rgba(107,58,154,0.55)'  },
};

export const COLS: KanbanColumn[] = ['do-now', 'this-week', 'plan-ahead'];

export const STAR_PATH = 'M12 0l2.9 8.6H24l-7.4 5.4 2.9 8.6L12 17.2l-7.4 5.4 2.9-8.6L0 8.6h9.1z';

// ─── Satellite offsets for high-effort sub-stars (% of canvas) ───────────────

const SAT_OFFSETS = [
  { dx: -7, dy: -11 },
  { dx:  7, dy: -11 },
  { dx:  0, dy: +11 },
];

// ─── Deterministic ambient stars ─────────────────────────────────────────────

export const ambientStars = Array.from({ length: 35 }, (_, i) => ({
  id: i,
  x: +((i * 137.5) % 100).toFixed(2),
  y: +((i * 97.3 + 13) % 100).toFixed(2),
  r: +(((i * 31) % 8) * 0.15 + 0.3).toFixed(2),
  opacity: +(((i * 17) % 10) * 0.015 + 0.04).toFixed(3),
  dur: 2 + (i % 5) * 0.7,
  del: (i % 8) * 0.6,
}));

// ─── Star layout ──────────────────────────────────────────────────────────────

export function getStarPositions(tasks: KanbanTask[]): Record<string, { x: number; y: number }> {
  const pos: Record<string, { x: number; y: number }> = {};
  COLS.forEach((col) => {
    const group = tasks
      .filter((t) => t.column === col)
      .sort((a, b) => a.timeMinutes - b.timeMinutes);
    const { yCenter, xMin, xMax } = COL_META[col];
    const n = group.length;
    group.forEach((task, i) => {
      const x = n === 1 ? 50 : xMin + (i / (n - 1)) * (xMax - xMin);
      const dy = n > 1 ? (i % 2 === 0 ? 0 : -8) : 0;
      pos[task.id] = { x, y: yCenter + dy };
    });
  });
  return pos;
}

// ─── ConstellationPlan ────────────────────────────────────────────────────────

export default function ConstellationPlan({
  tasks,
  onTasksChange,
  onStarTap,
  compact = false,
}: {
  tasks: KanbanTask[];
  onTasksChange: (tasks: KanbanTask[]) => void;
  onStarTap?: (task: KanbanTask) => void;
  compact?: boolean;
}) {
  const { isDark } = useTheme();
  const [activeId, setActiveId] = useState<string | null>(null);

  // ── Canvas theme tokens ────────────────────────────────────────────────────
  const C = isDark ? {
    canvasBg:      'radial-gradient(ellipse at 50% 80%, rgba(11,10,24,1) 0%, rgba(5,5,12,1) 100%)',
    canvasBorder:  '#0e0e1a',
    ambientColor:  '#f0e6cc',
    ambientOpacity: 1,       // use star's own opacity
    bandTintOp:    '07',     // hex suffix for rgba
    bandLabelOp:   0.35,
    bandLabelCol:  (col: KanbanColumn) => COL_META[col].color,
    dividerColor:  '#1a1a2a',
    bridgeColor:   '#3a3a4a',
    progressBg:    '#1a1a1a',
    timeLabel:     '#555555',
    claimedColor:  '#f0e6cc',
    claimedGlow:   'rgba(240,230,204,0.95)',
    claimedRing:   'rgba(240,230,204,0.12)',
    claimedBorder: 'rgba(240,230,204,0.35)',
    cardBg:        'rgba(6,6,14,0.97)',
    cardText:      '#f0e6cc',
    cardTextDone:  '#888888',
    tagBg:         '#111111',
    tagText:       '#8888a0',
    legendText:    (col: KanbanColumn) => COL_META[col].color,
    hintText:      '#888888',
    starColor:     (col: KanbanColumn, done: boolean) =>
                    done ? '#f0e6cc' : COL_META[col].color,
    starGlow:      (col: KanbanColumn, done: boolean) =>
                    done ? 'rgba(240,230,204,0.95)' : COL_META[col].glow,
  } : {
    canvasBg:      'linear-gradient(180deg, #c8e6f8 0%, #d8eef9 30%, #eaf5fc 60%, #f3eeea 100%)',
    canvasBorder:  'rgba(168,212,240,0.55)',
    ambientColor:  '#a8cce0',
    ambientOpacity: 0.5,     // softer in daylight
    bandTintOp:    '18',
    bandLabelOp:   0.75,
    bandLabelCol:  (col: KanbanColumn) => COL_LIGHT[col].color,
    dividerColor:  'rgba(168,212,240,0.45)',
    bridgeColor:   'rgba(80,130,180,0.30)',
    progressBg:    'rgba(168,212,240,0.35)',
    timeLabel:     '#3d5a72',
    claimedColor:  '#1c3a5c',
    claimedGlow:   'rgba(28,58,92,0.60)',
    claimedRing:   'rgba(28,58,92,0.10)',
    claimedBorder: 'rgba(28,58,92,0.30)',
    cardBg:        'rgba(255,255,255,0.97)',
    cardText:      '#1c3a5c',
    cardTextDone:  '#3d5a72',
    tagBg:         'rgba(232,244,252,0.9)',
    tagText:       '#3d5a72',
    legendText:    (col: KanbanColumn) => COL_LIGHT[col].color,
    hintText:      '#4a6a82',
    starColor:     (col: KanbanColumn, done: boolean) =>
                    done ? '#1c3a5c' : COL_LIGHT[col].color,
    starGlow:      (col: KanbanColumn, done: boolean) =>
                    done ? 'rgba(28,58,92,0.60)' : COL_LIGHT[col].glow,
  };

  const positions     = getStarPositions(tasks);
  const completedList = tasks.filter((t) => t.completed).sort((a, b) => Number(a.id) - Number(b.id));
  const doneCount     = completedList.length;
  const activeTask    = tasks.find((t) => t.id === activeId);
  const canvasH       = compact ? 300 : 340;

  // ── Constellation lines ────────────────────────────────────────────────────
  const lines: {
    x1: number; y1: number; x2: number; y2: number;
    color: string; bridge: boolean; satellite: boolean; claimed: boolean; key: string;
  }[] = [];

  COLS.forEach((col) => {
    const group = tasks
      .filter((t) => t.column === col)
      .sort((a, b) => a.timeMinutes - b.timeMinutes);
    const lineColor = isDark ? COL_META[col].color : COL_LIGHT[col].color;
    for (let i = 0; i < group.length - 1; i++) {
      const p1 = positions[group[i].id];
      const p2 = positions[group[i + 1].id];
      if (p1 && p2)
        lines.push({ x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y, color: lineColor, bridge: false, satellite: false, claimed: false, key: `${group[i].id}-${group[i + 1].id}` });
    }
  });

  const doNowSorted     = tasks.filter((t) => t.column === 'do-now').sort((a, b) => a.timeMinutes - b.timeMinutes);
  const thisWeekSorted  = tasks.filter((t) => t.column === 'this-week').sort((a, b) => a.timeMinutes - b.timeMinutes);
  const planAheadSorted = tasks.filter((t) => t.column === 'plan-ahead').sort((a, b) => a.timeMinutes - b.timeMinutes);

  if (doNowSorted.length && thisWeekSorted.length) {
    const mid = doNowSorted[Math.floor(doNowSorted.length / 2)];
    const p1 = positions[mid.id]; const p2 = positions[thisWeekSorted[0].id];
    if (p1 && p2) lines.push({ x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y, color: C.bridgeColor, bridge: true, satellite: false, claimed: false, key: 'bridge-1' });
  }
  if (thisWeekSorted.length && planAheadSorted.length) {
    const last = thisWeekSorted[thisWeekSorted.length - 1];
    const p1 = positions[last.id]; const p2 = positions[planAheadSorted[0].id];
    if (p1 && p2) lines.push({ x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y, color: C.bridgeColor, bridge: true, satellite: false, claimed: false, key: 'bridge-2' });
  }

  tasks.forEach((task) => {
    if (task.effort !== 'high' || !task.substeps?.length) return;
    const pos = positions[task.id];
    if (!pos) return;
    const lineColor = isDark ? COL_META[task.column].color : COL_LIGHT[task.column].color;
    SAT_OFFSETS.slice(0, task.substeps.length).forEach((off, i) => {
      lines.push({
        x1: pos.x, y1: pos.y,
        x2: pos.x + off.dx, y2: pos.y + off.dy,
        color: lineColor,
        bridge: false, satellite: true, claimed: false,
        key: `sat-line-${task.id}-${i}`,
      });
    });
  });

  // Claimed constellation lines
  for (let i = 0; i < completedList.length - 1; i++) {
    const p1 = positions[completedList[i].id];
    const p2 = positions[completedList[i + 1].id];
    if (p1 && p2)
      lines.push({
        x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y,
        color: C.claimedColor, bridge: false, satellite: false, claimed: true,
        key: `claimed-${completedList[i].id}-${completedList[i + 1].id}`,
      });
  }

  const toggleComplete = (id: string) => {
    onTasksChange(tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  };

  const handleStarClick = (task: KanbanTask) => {
    if (onStarTap) {
      onStarTap(task);
    } else {
      setActiveId((prev) => (prev === task.id ? null : task.id));
    }
  };

  // Helper: column color for current theme
  const colColor = (col: KanbanColumn) => isDark ? COL_META[col].color : COL_LIGHT[col].color;
  const colGlow  = (col: KanbanColumn) => isDark ? COL_META[col].glow  : COL_LIGHT[col].glow;

  return (
    <div className="mt-[10px]">
      {/* Progress bar */}
      <div className="flex items-center gap-[8px] mb-[12px]">
        <div className="flex-1 h-[3px] rounded-full overflow-hidden"
          style={{ background: C.progressBg }}>
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'linear-gradient(to right, #88c8a8, #d4af78, #c4a0e0)' }}
            animate={{ width: tasks.length ? `${(doneCount / tasks.length) * 100}%` : '0%' }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <p className="text-[#9898a8] text-[12px] shrink-0">{doneCount}/{tasks.length} stars claimed</p>
      </div>

      {/* ── Constellation canvas ──────────────────────────────────────────── */}
      <div
        className="relative rounded-[18px] overflow-hidden"
        style={{
          height: canvasH,
          background: C.canvasBg,
          border: `1px solid ${C.canvasBorder}`,
        }}
      >
        {/* Ambient background stars (twinkling in dark, soft dots in light) */}
        {ambientStars.map((s) => (
          <motion.div
            key={s.id}
            className="absolute rounded-full"
            style={{
              left: `${s.x}%`, top: `${s.y}%`,
              width: s.r * 2, height: s.r * 2,
              background: C.ambientColor,
              opacity: s.opacity * C.ambientOpacity,
            }}
            animate={{ opacity: [s.opacity * C.ambientOpacity * 0.4, s.opacity * C.ambientOpacity, s.opacity * C.ambientOpacity * 0.4] }}
            transition={{ duration: s.dur, delay: s.del, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}

        {/* Altitude band tints */}
        {COLS.map((col, i) => {
          const tops    = ['62%', '33%', '0%'];
          const heights = ['38%', '29%', '33%'];
          const bandColor = colColor(col);
          return (
            <div key={col} className="absolute left-0 right-0 pointer-events-none"
              style={{ top: tops[i], height: heights[i] }}>
              <div className="absolute inset-0"
                style={{ background: `radial-gradient(ellipse at 50% 50%, ${bandColor}${C.bandTintOp} 0%, transparent 70%)` }} />
              <p className="absolute right-[10px] top-1/2 -translate-y-1/2 text-[7px] tracking-[0.22em] uppercase"
                style={{ color: C.bandLabelCol(col), opacity: C.bandLabelOp }}>
                {col === 'do-now' ? 'Do Now' : col === 'this-week' ? 'This Week' : 'Plan Ahead'}
              </p>
            </div>
          );
        })}

        {/* Band dividers */}
        <div className="absolute left-[10px] right-[10px] h-[1px] pointer-events-none"
          style={{ top: '33%', background: `linear-gradient(to right, transparent, ${C.dividerColor}, transparent)` }} />
        <div className="absolute left-[10px] right-[10px] h-[1px] pointer-events-none"
          style={{ top: '62%', background: `linear-gradient(to right, transparent, ${C.dividerColor}, transparent)` }} />

        {/* SVG constellation lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ overflow: 'visible' }}>
          {lines.map((ln, idx) => (
            <motion.line
              key={ln.key}
              x1={`${ln.x1}%`} y1={`${ln.y1}%`}
              x2={`${ln.x2}%`} y2={`${ln.y2}%`}
              stroke={ln.color}
              strokeWidth={ln.claimed ? 1.4 : ln.bridge ? 0.6 : ln.satellite ? 0.7 : 1}
              strokeDasharray={ln.bridge ? '3 8' : ln.satellite ? '2 5' : undefined}
              style={ln.claimed ? { filter: `drop-shadow(0 0 3px ${C.claimedGlow})` } : undefined}
              initial={{ opacity: 0 }}
              animate={{ opacity: ln.claimed ? 0.75 : ln.bridge ? (isDark ? 0.18 : 0.28) : ln.satellite ? 0.3 : (isDark ? 0.38 : 0.55) }}
              transition={{ duration: ln.claimed ? 0.9 : 0.7, delay: ln.claimed ? 0.1 : 0.25 + idx * 0.07 }}
            />
          ))}
        </svg>

        {/* Satellite sub-stars for high-effort tasks */}
        {tasks.filter((t) => t.effort === 'high' && t.substeps?.length).map((task) => {
          const pos = positions[task.id];
          if (!pos) return null;
          const starC = colColor(task.column);
          const starG = colGlow(task.column);
          return task.substeps!.slice(0, 3).map((_, i) => {
            const off = SAT_OFFSETS[i];
            return (
              <motion.div
                key={`sat-${task.id}-${i}`}
                className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                style={{ left: `${pos.x + off.dx}%`, top: `${pos.y + off.dy}%`, zIndex: 8 }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 0.55 }}
                transition={{ duration: 0.4, delay: Number(task.id) * 0.07 + i * 0.1 + 0.35 }}
              >
                <svg width="6" height="6" viewBox="0 0 24 24" fill={starC}
                  style={{ filter: `drop-shadow(0 0 2px ${starG})` }}>
                  <path d={STAR_PATH} />
                </svg>
              </motion.div>
            );
          });
        })}

        {/* Task stars */}
        {tasks.map((task) => {
          const pos      = positions[task.id];
          if (!pos) return null;
          const isActive = activeId === task.id;
          const isDone   = task.completed;
          const baseSize = task.effort === 'high' ? 22 : task.effort === 'medium' ? 18 : 14;
          const size     = isDone ? baseSize + 4 : baseSize;
          const starFill = C.starColor(task.column, isDone);
          const starGlowV = C.starGlow(task.column, isDone);
          const ringColor = isDone ? C.claimedColor : colColor(task.column);

          return (
            <motion.button
              key={task.id}
              className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
              style={{ left: `${pos.x}%`, top: `${pos.y}%`, zIndex: isDone ? 12 : 10 }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.55, delay: Number(task.id) * 0.07, ease: [0.4, 0, 0.2, 1] }}
              onClick={() => handleStarClick(task)}
              whileHover={{ scale: 1.3 }}
              whileTap={{ scale: 0.88 }}
            >
              {/* Pulse rings for active (unclaimed) stars */}
              {isActive && !isDone && (
                <>
                  <motion.div className="absolute rounded-full pointer-events-none"
                    style={{ inset: -8, border: `1px solid ${ringColor}` }}
                    initial={{ scale: 0.5, opacity: 0.9 }} animate={{ scale: 3, opacity: 0 }}
                    transition={{ duration: 2.4, repeat: Infinity, ease: 'easeOut' }} />
                  <motion.div className="absolute rounded-full pointer-events-none"
                    style={{ inset: -8, border: `1px solid ${ringColor}` }}
                    initial={{ scale: 0.5, opacity: 0.7 }} animate={{ scale: 3, opacity: 0 }}
                    transition={{ duration: 2.4, repeat: Infinity, ease: 'easeOut', delay: 0.9 }} />
                </>
              )}

              {/* Claimed stars — steady outer glow ring */}
              {isDone && (
                <motion.div
                  className="absolute rounded-full pointer-events-none"
                  style={{ inset: -6, background: C.claimedRing, border: `1px solid ${C.claimedBorder}` }}
                  animate={{ opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                />
              )}

              <motion.div
                animate={{
                  opacity: isDone ? [0.88, 1, 0.88] : [0.6, 0.95, 0.6],
                }}
                transition={{
                  duration: isDone ? 3.5 : 2.5 + Number(task.id) * 0.35,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: Number(task.id) * 0.2,
                }}
              >
                <svg
                  width={size} height={size} viewBox="0 0 24 24"
                  fill={starFill}
                  style={{
                    filter: `drop-shadow(0 0 ${isDone ? 10 : task.effort === 'high' ? 6 : 3}px ${starGlowV})`,
                    transition: 'width 0.4s ease, height 0.4s ease, fill 0.4s ease',
                  }}
                >
                  <path d={STAR_PATH} />
                </svg>
              </motion.div>

              <p
                style={{
                  fontSize: 6,
                  color: C.timeLabel,
                  marginTop: 2,
                  transition: 'color 0.4s ease',
                }}
                className="whitespace-nowrap leading-none"
              >
                {task.timeLabel}
              </p>
            </motion.button>
          );
        })}

        {/* In-canvas detail card */}
        {!onStarTap && (
          <AnimatePresence>
            {activeTask && (
              <motion.div
                className="absolute left-[8px] right-[8px] z-30 rounded-[13px] p-[10px]"
                style={{
                  top: (positions[activeTask.id]?.y ?? 50) > 50 ? '5%' : 'auto',
                  bottom: (positions[activeTask.id]?.y ?? 50) <= 50 ? '5%' : 'auto',
                  background: C.cardBg,
                  border: `1px solid ${colColor(activeTask.column)}40`,
                  boxShadow: `0 0 24px ${colGlow(activeTask.column).replace('0.7', '0.14')}`,
                }}
                initial={{ opacity: 0, scale: 0.94, y: 6 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.94, y: 6 }}
                transition={{ duration: 0.22 }}
              >
                <div className="flex items-start gap-[8px]">
                  <motion.button
                    className="mt-[1px] shrink-0 size-[16px] rounded-full border flex items-center justify-center"
                    style={{
                      borderColor: activeTask.completed ? colColor(activeTask.column) : (isDark ? '#3a3a3a' : '#b0ccde'),
                      backgroundColor: activeTask.completed ? colColor(activeTask.column) : 'transparent',
                    }}
                    whileTap={{ scale: 0.82 }}
                    onClick={(e) => { e.stopPropagation(); toggleComplete(activeTask.id); }}
                  >
                    {activeTask.completed && <p className="text-[#ffffff] text-[11px] font-bold">✓</p>}
                  </motion.button>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-medium leading-tight mb-[4px]"
                      style={{
                        color: activeTask.completed ? C.cardTextDone : C.cardText,
                        textDecoration: activeTask.completed ? 'line-through' : 'none',
                      }}>
                      {activeTask.text}
                    </p>
                    <p className="text-[12px] leading-snug" style={{ color: C.tagText }}>{activeTask.details}</p>
                    <div className="flex gap-[5px] mt-[6px] flex-wrap">
                      <span className="text-[12px] px-[6px] py-[1px] rounded-full"
                        style={{ background: colColor(activeTask.column) + '1e', color: colColor(activeTask.column) }}>
                        {activeTask.effort === 'low' ? 'Easy' : activeTask.effort === 'medium' ? 'Moderate' : 'Heavy'}
                      </span>
                      <span className="text-[12px] px-[6px] py-[1px] rounded-full"
                        style={{ background: C.tagBg, color: C.tagText }}>⏱ {activeTask.timeLabel}</span>
                      <span className="text-[12px] px-[6px] py-[1px] rounded-full"
                        style={{ background: C.tagBg, color: C.tagText }}>{COL_META[activeTask.column].label}</span>
                    </div>
                  </div>
                  <button className="shrink-0 text-[12px] leading-none mt-[-2px]"
                    style={{ color: C.tagText }}
                    onClick={(e) => { e.stopPropagation(); setActiveId(null); }}>✕</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-[18px] mt-[10px]">
        {COLS.map((col) => (
          <div key={col} className="flex items-center gap-[5px]">
            <svg width="8" height="8" viewBox="0 0 24 24" fill={colColor(col)}
              style={{ filter: `drop-shadow(0 0 3px ${colGlow(col)})` }}>
              <path d={STAR_PATH} />
            </svg>
            <p className="text-[12px] tracking-wide" style={{ color: C.legendText(col) }}>
              {col === 'do-now' ? 'Do Now' : col === 'this-week' ? 'This Week' : 'Plan Ahead'}
            </p>
          </div>
        ))}
      </div>

      <p className="text-center text-[12px] mt-[6px] tracking-wide" style={{ color: C.hintText }}>
        tap any star to explore it
      </p>
    </div>
  );
}
