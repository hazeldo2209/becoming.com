import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Starfield, NebulaGlow } from './CosmicElements';
import StarDetailModal from './StarDetailModal';
import ConstellationDetailScreen from './ConstellationDetailScreen';
import SkyGrowthScreen from './SkyGrowthScreen';
import EmotionalWeatherScreen from './EmotionalWeatherScreen';
import ConstellationPlan from './ConstellationPlan';
import type { KanbanTask, KanbanColumn, ActionPlan } from '../types';

// ─── Column → visual mapping ──────────────────────────────────────────────────

const COL_COLORS: Record<string, string> = {
  'do-now':     '#88c8a8',
  'this-week':  '#d4af78',
  'plan-ahead': '#c4a0e0',
};
const COL_GLOWS: Record<string, string> = {
  'do-now':     'rgba(136,200,168,0.8)',
  'this-week':  'rgba(212,175,120,0.8)',
  'plan-ahead': 'rgba(196,160,224,0.8)',
};
const COL_LABELS: Record<string, string> = {
  'do-now': 'Now', 'this-week': 'Week', 'plan-ahead': 'Ahead',
};
const COL_PRIORITY: Record<string, string> = {
  'do-now': 'p1', 'this-week': 'p2', 'plan-ahead': 'p3',
};

const EFFORT_R: Record<string, number> = { low: 2.4, medium: 3.4, high: 5.0 };
const CLAIMED_COLOR = '#f0e6cc';
const CLAIMED_GLOW  = 'rgba(240,230,204,0.85)';

// ─── Constellation shapes ─────────────────────────────────────────────────────

interface ConstellationShape {
  name: string;
  offsets: { dx: number; dy: number }[];
  lines: number[][];
}

// Task-themed shapes — stars arranged to suggest the activity
const TASK_SHAPES: Record<string, ConstellationShape> = {
  // Guitar body + neck silhouette
  guitar: {
    name: 'The Musician',
    offsets: [{ dx: 0, dy: -26 }, { dx: 0, dy: -10 }, { dx: -18, dy: 4 }, { dx: 18, dy: 4 }, { dx: -14, dy: 20 }, { dx: 14, dy: 20 }],
    lines: [[0,1],[1,2],[1,3],[2,4],[3,5],[4,5]],
  },
  // Elongated pen / brush tip
  pen: {
    name: 'The Artist',
    offsets: [{ dx: 0, dy: 24 }, { dx: -5, dy: 12 }, { dx: 5, dy: 12 }, { dx: -7, dy: -10 }, { dx: 7, dy: -10 }, { dx: 0, dy: -24 }],
    lines: [[0,1],[0,2],[1,3],[2,4],[3,5],[4,5]],
  },
  // Stick-figure runner mid-stride
  runner: {
    name: 'The Stride',
    offsets: [{ dx: 4, dy: -26 }, { dx: -2, dy: -12 }, { dx: 16, dy: -16 }, { dx: -14, dy: 0 }, { dx: 14, dy: 18 }, { dx: -12, dy: 22 }],
    lines: [[0,1],[1,2],[1,3],[1,4],[1,5]],
  },
  // Open book — spine + two pages
  book: {
    name: 'The Scholar',
    offsets: [{ dx: 0, dy: -20 }, { dx: -18, dy: -16 }, { dx: -18, dy: 18 }, { dx: 0, dy: 20 }, { dx: 18, dy: -16 }, { dx: 18, dy: 18 }],
    lines: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,0],[0,3]],
  },
  // Twin mountain peaks
  mountain: {
    name: 'The Voyager',
    offsets: [{ dx: -18, dy: -20 }, { dx: 8, dy: -26 }, { dx: -28, dy: 18 }, { dx: -6, dy: 18 }, { dx: 12, dy: 18 }, { dx: 28, dy: 18 }],
    lines: [[0,2],[0,3],[1,3],[1,4],[4,5]],
  },
  // Angle-bracket  < > like code
  code: {
    name: 'The Builder',
    offsets: [{ dx: -20, dy: -18 }, { dx: -28, dy: 0 }, { dx: -20, dy: 18 }, { dx: 20, dy: -18 }, { dx: 28, dy: 0 }, { dx: 20, dy: 18 }],
    lines: [[0,1],[1,2],[3,4],[4,5]],
  },
  // Hexagon — lotus / mandala
  lotus: {
    name: 'The Stillness',
    offsets: [{ dx: 0, dy: -26 }, { dx: 22, dy: -13 }, { dx: 22, dy: 13 }, { dx: 0, dy: 26 }, { dx: -22, dy: 13 }, { dx: -22, dy: -13 }],
    lines: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,0]],
  },
  // Heart outline
  heart: {
    name: 'The Bond',
    offsets: [{ dx: -16, dy: -8 }, { dx: 0, dy: -18 }, { dx: 16, dy: -8 }, { dx: -22, dy: 6 }, { dx: 22, dy: 6 }, { dx: 0, dy: 22 }],
    lines: [[0,1],[1,2],[0,3],[2,4],[3,5],[4,5]],
  },
  // Cooking pot — round body + handle
  cooking: {
    name: 'The Hearth',
    offsets: [{ dx: 0, dy: -22 }, { dx: 0, dy: -8 }, { dx: -18, dy: -8 }, { dx: 18, dy: -8 }, { dx: -20, dy: 12 }, { dx: 20, dy: 12 }],
    lines: [[0,1],[1,2],[1,3],[2,4],[3,5],[4,5]],
  },
};

// Fallback generic shapes when no keyword matches
const GENERIC_SHAPES: ConstellationShape[] = [
  { name: 'The Wanderer', offsets: [{ dx: -30, dy: 4 }, { dx: -14, dy: -14 }, { dx: 2, dy: -6 }, { dx: 16, dy: -18 }, { dx: 28, dy: 0 }, { dx: 18, dy: 16 }], lines: [[0,1],[1,2],[2,3],[3,4],[4,5]] },
  { name: 'The Wave',     offsets: [{ dx: -26, dy: 12 }, { dx: -12, dy: -16 }, { dx: 0, dy: 6 }, { dx: 12, dy: -16 }, { dx: 26, dy: 12 }, { dx: 0, dy: 24 }], lines: [[0,1],[1,2],[2,3],[3,4],[2,5]] },
  { name: 'The Peaks',    offsets: [{ dx: 0, dy: -28 }, { dx: 22, dy: 14 }, { dx: -22, dy: 14 }, { dx: -8, dy: -8 }, { dx: 10, dy: -2 }, { dx: 0, dy: 24 }], lines: [[0,3],[0,4],[3,2],[4,1],[2,5],[1,5]] },
  { name: 'The Compass',  offsets: [{ dx: 0, dy: -28 }, { dx: 0, dy: 28 }, { dx: -26, dy: 0 }, { dx: 26, dy: 0 }, { dx: -14, dy: -14 }, { dx: 14, dy: 14 }], lines: [[0,4],[4,2],[2,5],[5,1],[1,3],[3,0]] },
  { name: 'The Hunter',   offsets: [{ dx: -22, dy: -18 }, { dx: 22, dy: -18 }, { dx: -28, dy: 8 }, { dx: -8, dy: 8 }, { dx: 8, dy: 8 }, { dx: 28, dy: 8 }], lines: [[0,1],[2,3],[3,4],[4,5],[0,2],[1,5]] },
  { name: 'The Arc',      offsets: [{ dx: -22, dy: -22 }, { dx: -4, dy: -30 }, { dx: 14, dy: -18 }, { dx: 22, dy: 0 }, { dx: 16, dy: 18 }, { dx: -2, dy: 26 }], lines: [[0,1],[1,2],[2,3],[3,4],[4,5]] },
];

function getConstellationForTask(taskText: string, planId: string): ConstellationShape {
  const lower = taskText.toLowerCase();
  const match = (kws: string[]) => kws.some((k) => lower.includes(k));

  if (match(['guitar', 'music', 'song', 'band', 'piano', 'drum', 'sing', 'instrument', 'melody', 'chord', 'bass', 'violin', 'ukulele', 'compose', 'concert', 'perform', 'lyric', 'musician']))
    return TASK_SHAPES.guitar;
  if (match(['draw', 'sketch', 'illustrat', 'paint', 'watercolor', 'portrait', 'doodle', 'sculpt', 'comic', 'manga', 'anime', 'figure drawing', 'life drawing', 'canvas', 'artwork']))
    return TASK_SHAPES.pen;
  if (match(['run', 'jog', 'exercise', 'fitness', 'gym', 'yoga', 'workout', 'train', 'marathon', 'swim', 'cycle', 'cardio', 'stretch', 'pilates', 'sport', 'hike', 'walk']))
    return TASK_SHAPES.runner;
  if (match(['read', 'study', 'learn', 'school', 'course', 'class', 'research', 'exam', 'test', 'degree', 'thesis', 'essay', 'academic', 'university', 'college', 'textbook', 'homework']))
    return TASK_SHAPES.book;
  if (match(['travel', 'trip', 'explor', 'adventure', 'journey', 'visit', 'abroad', 'vacation', 'holiday', 'backpack', 'camp', 'move', 'relocat', 'country']))
    return TASK_SHAPES.mountain;
  if (match(['code', 'program', 'develop', 'build', 'app', 'website', 'software', 'engineer', 'deploy', 'debug', 'script', 'api', 'database', 'tech', 'machine learning', 'data science']))
    return TASK_SHAPES.code;
  if (match(['meditat', 'mindful', 'calm', 'peace', 'breath', 'rest', 'relax', 'sleep', 'anxiety', 'mental health', 'therapy', 'gratitude', 'self care', 'self-care', 'journal']))
    return TASK_SHAPES.lotus;
  if (match(['friend', 'family', 'relationship', 'connect', 'social', 'network', 'date', 'love', 'partner', 'community', 'group', 'club', 'meet', 'volunteer']))
    return TASK_SHAPES.heart;
  if (match(['cook', 'food', 'recipe', 'meal', 'bake', 'kitchen', 'chef', 'dinner', 'lunch', 'breakfast', 'cuisine', 'diet', 'nutrition', 'eating']))
    return TASK_SHAPES.cooking;

  return GENERIC_SHAPES[hashStr(planId) % GENERIC_SHAPES.length];
}

function hashStr(s: string): number {
  return Math.abs(s.split('').reduce((h, c) => ((h * 31) + c.charCodeAt(0)) | 0, 0));
}

function dominantColor(tasks: KanbanTask[]): string {
  if (!tasks.length) return '#d4af78';
  const counts: Record<string, number> = {};
  tasks.forEach((t) => { counts[t.column] = (counts[t.column] ?? 0) + 1; });
  const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'this-week';
  return COL_COLORS[top] ?? '#d4af78';
}

const PLAN_CENTERS = [
  { cx: 88,  cy: 115 }, { cx: 265, cy: 92  }, { cx: 180, cy: 230 },
  { cx: 58,  cy: 278 }, { cx: 305, cy: 258 }, { cx: 170, cy: 162 },
];

// ─── MiniConstellation ────────────────────────────────────────────────────────

function MiniConstellation({ plan, cx, cy, index, onClick, pulse = false }: {
  plan: ActionPlan; cx: number; cy: number; index: number; onClick: () => void; pulse?: boolean;
}) {
  const tasks     = plan.tasks ?? [];
  const shape     = getConstellationForTask(plan.task, plan.id);
  const mainColor = dominantColor(tasks);
  const completed = tasks.filter((t) => t.completed).length;
  const total     = tasks.length;
  const allDone   = completed === total && total > 0;
  const label     = plan.task.length > 20 ? plan.task.slice(0, 20) + '…' : plan.task;

  const starPos = tasks.slice(0, 6).map((task, i) => ({
    x: cx + shape.offsets[i % shape.offsets.length].dx,
    y: cy + shape.offsets[i % shape.offsets.length].dy,
    task,
    color:  task.completed ? CLAIMED_COLOR : (COL_COLORS[task.column] ?? '#d4af78'),
    glow:   task.completed ? CLAIMED_GLOW  : (COL_GLOWS[task.column]  ?? 'rgba(212,175,120,0.8)'),
    radius: (EFFORT_R[task.effort] ?? 3) + (task.completed ? 1.6 : 0),
    opacity: task.completed ? 0.95 : 0.48,
  }));

  return (
    <motion.g onClick={onClick} style={{ cursor: 'pointer' }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      transition={{ delay: index * 0.14, duration: 0.6 }}>
      <circle cx={cx} cy={cy} r="44" fill="transparent" />
      {shape.lines.map(([from, to], i) => {
        if (from >= starPos.length || to >= starPos.length) return null;
        const a = starPos[from], b = starPos[to];
        const bothDone = a.task.completed && b.task.completed;
        return (
          <motion.line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y}
            stroke={bothDone ? CLAIMED_COLOR : a.color}
            strokeWidth={bothDone ? 1.3 : 0.65}
            opacity={bothDone ? 0.52 : 0.2}
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
            transition={{ delay: index * 0.14 + 0.2 + i * 0.07, duration: 0.55 }} />
        );
      })}
      {starPos.map((pos, i) => (
        <motion.circle key={i} cx={pos.x} cy={pos.y} r={pos.radius}
          fill={pos.color} opacity={pos.opacity}
          initial={{ scale: 0 }} animate={{ scale: 1 }}
          transition={{ delay: index * 0.14 + 0.1 + i * 0.06, type: 'spring', stiffness: 200 }}
          style={{ filter: pos.task.completed ? `drop-shadow(0 0 5px ${pos.glow})` : `drop-shadow(0 0 2px ${pos.glow})` }} />
      ))}
      {/* Pulsing ring on brightest star to hint interactivity */}
      {pulse && starPos.length > 0 && (
        <motion.circle
          cx={starPos[0].x} cy={starPos[0].y}
          r={starPos[0].radius + 4}
          fill="none"
          stroke={mainColor}
          strokeWidth="1.2"
          animate={{
            r:       [starPos[0].radius + 3, starPos[0].radius + 9, starPos[0].radius + 3],
            opacity: [0.55, 0, 0.55],
          }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut', delay: index * 0.35 }}
        />
      )}
      {allDone && (
        <motion.circle cx={cx} cy={cy} r={36} fill="none"
          stroke={CLAIMED_COLOR} strokeWidth="0.7" opacity={0.2}
          animate={{ r: [33, 40, 33] }}
          transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut' }} />
      )}
      <text x={cx} y={cy + 40} textAnchor="middle" fill={mainColor} fontSize="10" fontFamily="sans-serif" fontWeight="600" opacity={0.9}>{shape.name}</text>
      <text x={cx} y={cy + 53} textAnchor="middle" fill="#9898a8" fontSize="9" fontFamily="sans-serif">{label}</text>
      <text x={cx} y={cy + 64} textAnchor="middle" fill="#8888a0" fontSize="8.5" fontFamily="sans-serif">{completed}/{total}</text>
    </motion.g>
  );
}

// ─── ManageSheet ──────────────────────────────────────────────────────────────

function ManageSheet({ plans, onClose, onUpdatePlan, onDeletePlan, onUpdateTask, onDeleteTask, onOpenPlan }: {
  plans: ActionPlan[];
  onClose: () => void;
  onUpdatePlan: (id: string, changes: Partial<ActionPlan>) => void;
  onDeletePlan: (id: string) => void;
  onUpdateTask: (planId: string, taskId: string, changes: Partial<KanbanTask>) => void;
  onDeleteTask: (planId: string, taskId: string) => void;
  onOpenPlan: (planId: string) => void;
}) {
  const [subView, setSubView]             = useState<'plans' | 'tasks'>('plans');
  const [activePlanId, setActivePlanId]   = useState<string | null>(null);

  // Plan-level state
  const [renamingId, setRenamingId]       = useState<string | null>(null);
  const [renameText, setRenameText]       = useState('');
  const [confirmDelPlan, setConfirmDelPlan] = useState<string | null>(null);

  // Task-level state
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editTaskText, setEditTaskText]   = useState('');
  const [confirmDelTask, setConfirmDelTask] = useState<string | null>(null);

  const activePlan = plans.find(p => p.id === activePlanId) ?? null;

  // ── Plan actions ────────────────────────────────────────────────────────────

  const startRename = (plan: ActionPlan) => {
    setRenamingId(plan.id);
    setRenameText(plan.task);
    setConfirmDelPlan(null);
  };
  const commitRename = () => {
    if (renamingId && renameText.trim()) onUpdatePlan(renamingId, { task: renameText.trim() });
    setRenamingId(null);
  };

  const doDeletePlan = (id: string) => {
    onDeletePlan(id);
    setConfirmDelPlan(null);
    if (activePlanId === id) { setActivePlanId(null); setSubView('plans'); }
  };

  const openTasks = (plan: ActionPlan) => {
    setActivePlanId(plan.id);
    setSubView('tasks');
    setRenamingId(null);
    setConfirmDelPlan(null);
    setEditingTaskId(null);
    setConfirmDelTask(null);
  };

  // ── Task actions ────────────────────────────────────────────────────────────

  const startEditTask = (task: KanbanTask) => {
    setEditingTaskId(task.id);
    setEditTaskText(task.text);
    setConfirmDelTask(null);
  };
  const commitEditTask = () => {
    if (activePlanId && editingTaskId && editTaskText.trim())
      onUpdateTask(activePlanId, editingTaskId, { text: editTaskText.trim() });
    setEditingTaskId(null);
  };

  const moveTask = (task: KanbanTask, col: KanbanColumn) => {
    if (!activePlanId) return;
    onUpdateTask(activePlanId, task.id, {
      column:   col,
      priority: COL_PRIORITY[col] as any,
    });
  };

  const doDeleteTask = (taskId: string) => {
    if (activePlanId) onDeleteTask(activePlanId, taskId);
    setConfirmDelTask(null);
  };

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <motion.div
      className="absolute inset-0 z-50 flex flex-col justify-end"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    >
      {/* Scrim */}
      <motion.div
        className="absolute inset-0 bg-[#000]"
        initial={{ opacity: 0 }} animate={{ opacity: 0.55 }} exit={{ opacity: 0 }}
        onClick={onClose}
      />

      {/* Sheet */}
      <motion.div
        className="relative bg-[#0e0d1a] rounded-t-[28px] z-10 flex flex-col"
        style={{ maxHeight: '76%', border: '1px solid #1e1b30', borderBottom: 'none' }}
        initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 340, damping: 38 }}
      >
        {/* Handle */}
        <div className="w-[40px] h-[4px] rounded-[2px] bg-[#333] mx-auto mt-[10px] mb-[2px] flex-shrink-0" />

        {/* Header */}
        <div className="flex items-center px-[20px] py-[14px] flex-shrink-0">
          {subView === 'tasks' && (
            <motion.button
              className="mr-[10px] text-[#888] text-[18px] leading-none"
              whileTap={{ scale: 0.9 }}
              onClick={() => { setSubView('plans'); setActivePlanId(null); setEditingTaskId(null); setConfirmDelTask(null); }}
            >←</motion.button>
          )}
          <div className="flex-1 min-w-0">
            {subView === 'plans' ? (
              <p className="text-[#f0e6cc] font-bold text-[16px]">Manage Constellations</p>
            ) : activePlan ? (
              <>
                <p className="text-[12px] text-[#8888a0] uppercase tracking-widest mb-[1px]">Tasks in</p>
                <p className="text-[#f0e6cc] font-bold text-[14px] truncate">
                  {getConstellationForTask(activePlan.task, activePlan.id).name}
                </p>
              </>
            ) : null}
          </div>
          <motion.button
            className="w-[28px] h-[28px] rounded-full bg-[#1a1a2a] flex items-center justify-center text-[#8888a0] text-[14px] flex-shrink-0"
            whileTap={{ scale: 0.88 }}
            onClick={onClose}
          >✕</motion.button>
        </div>

        <div className="h-[1px] bg-[#1a1a2a] mx-[20px] flex-shrink-0" />

        {/* ── Plan list ─────────────────────────────────────────────────── */}
        {subView === 'plans' && (
          <div className="overflow-y-auto flex-1 px-[16px] py-[8px]" style={{ scrollbarWidth: 'none' }}>
            {plans.length === 0 && (
              <p className="text-[#888] text-[13px] text-center py-[32px]">No constellations yet</p>
            )}
            {plans.map((plan) => {
              const pColor  = dominantColor(plan.tasks);
              const shape   = getConstellationForTask(plan.task, plan.id);
              const done    = plan.tasks.filter(t => t.completed).length;
              const total   = plan.tasks.length;
              const isRenaming = renamingId === plan.id;
              const isConfirm  = confirmDelPlan === plan.id;

              // Small SVG preview
              const prevStars = plan.tasks.slice(0, 6).map((task, i) => ({
                x: 24 + shape.offsets[i % shape.offsets.length].dx * 0.42,
                y: 22 + shape.offsets[i % shape.offsets.length].dy * 0.42,
                color: task.completed ? CLAIMED_COLOR : (COL_COLORS[task.column] ?? pColor),
                r: (EFFORT_R[task.effort] ?? 3) * 0.38 + (task.completed ? 0.5 : 0),
              }));

              return (
                <div key={plan.id} className="mb-[6px]">
                  <div
                    className="rounded-[14px] px-[12px] py-[10px]"
                    style={{
                      background: `linear-gradient(135deg, ${pColor}12, ${pColor}06)`,
                      border: `1px solid ${pColor}30`,
                    }}
                  >
                    {/* Top row: preview + name + progress */}
                    <div className="flex items-center gap-[10px] mb-[8px]">
                      <svg width="48" height="44" className="flex-shrink-0">
                        {shape.lines.map(([from, to], li) => {
                          if (from >= prevStars.length || to >= prevStars.length) return null;
                          const a = prevStars[from], b = prevStars[to];
                          return (
                            <line key={li} x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                              stroke={pColor} strokeWidth="0.5" opacity="0.25" />
                          );
                        })}
                        {prevStars.map((s, si) => (
                          <circle key={si} cx={s.x} cy={s.y} r={s.r} fill={s.color} opacity="0.7" />
                        ))}
                      </svg>

                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-bold mb-[1px]" style={{ color: pColor }}>
                          {shape.name}
                        </p>
                        {isRenaming ? (
                          <input
                            autoFocus
                            value={renameText}
                            onChange={e => setRenameText(e.target.value)}
                            onKeyDown={e => { if (e.key === 'Enter') commitRename(); if (e.key === 'Escape') setRenamingId(null); }}
                            className="w-full bg-[#111120] border border-[#d4af7866] rounded-[6px] px-[8px] py-[4px] text-[#f0e6cc] text-[11px] outline-none"
                            style={{ caretColor: '#d4af78' }}
                          />
                        ) : (
                          <p className="text-[12px] text-[#9898a8] truncate">{plan.task}</p>
                        )}
                      </div>

                      {/* Progress badge */}
                      <div className="flex-shrink-0 text-right">
                        <p className="text-[12px] font-medium" style={{ color: done === total && total > 0 ? CLAIMED_COLOR : pColor }}>
                          {done}/{total}
                        </p>
                        <p className="text-[12px] text-[#888]">tasks</p>
                      </div>
                    </div>

                    {/* Confirm delete */}
                    {isConfirm ? (
                      <div className="flex items-center gap-[8px]">
                        <p className="text-[#e08888] text-[11px] flex-1">Delete this constellation?</p>
                        <motion.button
                          className="px-[10px] py-[4px] rounded-[6px] text-[12px] text-[#888] bg-[#1a1a2a]"
                          whileTap={{ scale: 0.92 }}
                          onClick={() => setConfirmDelPlan(null)}
                        >Cancel</motion.button>
                        <motion.button
                          className="px-[10px] py-[4px] rounded-[6px] text-[12px] text-[#e08888] bg-[#2a1010]"
                          style={{ border: '1px solid #e0888830' }}
                          whileTap={{ scale: 0.92 }}
                          onClick={() => doDeletePlan(plan.id)}
                        >Delete</motion.button>
                      </div>
                    ) : isRenaming ? (
                      /* Rename actions */
                      <div className="flex gap-[8px] justify-end">
                        <motion.button
                          className="px-[12px] py-[4px] rounded-[6px] text-[12px] text-[#888] bg-[#1a1a2a]"
                          whileTap={{ scale: 0.92 }}
                          onClick={() => setRenamingId(null)}
                        >Cancel</motion.button>
                        <motion.button
                          className="px-[12px] py-[4px] rounded-[6px] text-[12px] font-medium"
                          style={{ background: pColor + '22', color: pColor, border: `1px solid ${pColor}44` }}
                          whileTap={{ scale: 0.92 }}
                          onClick={commitRename}
                        >Save</motion.button>
                      </div>
                    ) : (
                      /* Action row */
                      <div className="flex gap-[6px]">
                        {/* Open */}
                        <motion.button
                          className="flex-1 h-[28px] rounded-[7px] flex items-center justify-center gap-[4px] text-[12px]"
                          style={{ background: '#1a1a2a', color: '#888', border: '1px solid #222' }}
                          whileTap={{ scale: 0.92 }}
                          onClick={() => { onClose(); onOpenPlan(plan.id); }}
                        >
                          <span>Open</span><span className="text-[12px]">↗</span>
                        </motion.button>
                        {/* Rename */}
                        <motion.button
                          className="flex-1 h-[28px] rounded-[7px] flex items-center justify-center gap-[4px] text-[12px]"
                          style={{ background: pColor + '14', color: pColor, border: `1px solid ${pColor}30` }}
                          whileTap={{ scale: 0.92 }}
                          onClick={() => startRename(plan)}
                        >
                          <span>✎</span><span>Rename</span>
                        </motion.button>
                        {/* Tasks */}
                        <motion.button
                          className="flex-1 h-[28px] rounded-[7px] flex items-center justify-center gap-[4px] text-[12px]"
                          style={{ background: '#c4a0e014', color: '#c4a0e0', border: '1px solid #c4a0e030' }}
                          whileTap={{ scale: 0.92 }}
                          onClick={() => openTasks(plan)}
                        >
                          <span>⊞</span><span>Tasks</span>
                        </motion.button>
                        {/* Delete */}
                        <motion.button
                          className="w-[28px] h-[28px] rounded-[7px] flex items-center justify-center text-[13px]"
                          style={{ background: '#2a1010', color: '#e08888', border: '1px solid #e0888820' }}
                          whileTap={{ scale: 0.92 }}
                          onClick={() => { setConfirmDelPlan(plan.id); setRenamingId(null); }}
                        >×</motion.button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            <div className="h-[16px]" />
          </div>
        )}

        {/* ── Task list ──────────────────────────────────────────────────── */}
        {subView === 'tasks' && activePlan && (
          <div className="overflow-y-auto flex-1 px-[16px] py-[8px]" style={{ scrollbarWidth: 'none' }}>
            {/* Plan goal label */}
            <p className="text-[#888] text-[12px] italic px-[2px] mb-[8px] leading-relaxed">
              "{activePlan.task}"
            </p>

            {activePlan.tasks.length === 0 && (
              <p className="text-[#888] text-[12px] text-center py-[24px]">No tasks in this plan</p>
            )}

            {activePlan.tasks.map((task) => {
              const tColor     = COL_COLORS[task.column] ?? '#d4af78';
              const isEditing  = editingTaskId === task.id;
              const isConfirm  = confirmDelTask === task.id;

              return (
                <div key={task.id} className="mb-[6px]">
                  <div
                    className="rounded-[12px] px-[12px] py-[10px]"
                    style={{
                      background: task.completed ? 'rgba(240,230,204,0.05)' : `${tColor}0e`,
                      border: `1px solid ${task.completed ? CLAIMED_COLOR + '22' : tColor + '28'}`,
                    }}
                  >
                    {/* Task text + edit */}
                    {isEditing ? (
                      <input
                        autoFocus
                        value={editTaskText}
                        onChange={e => setEditTaskText(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter') commitEditTask(); if (e.key === 'Escape') setEditingTaskId(null); }}
                        className="w-full bg-[#111120] border border-[#d4af7866] rounded-[6px] px-[8px] py-[5px] text-[#f0e6cc] text-[12px] outline-none mb-[8px]"
                        style={{ caretColor: '#d4af78' }}
                      />
                    ) : (
                      <div className="flex items-start gap-[8px] mb-[8px]">
                        {/* Completion dot */}
                        <div
                          className="w-[7px] h-[7px] rounded-full flex-shrink-0 mt-[3px]"
                          style={{
                            background: task.completed ? CLAIMED_COLOR : tColor,
                            boxShadow: task.completed ? `0 0 5px ${CLAIMED_GLOW}` : `0 0 4px ${tColor}66`,
                          }}
                        />
                        <p className="text-[12px] leading-snug flex-1"
                          style={{ color: task.completed ? '#888' : '#d4d0c8', textDecoration: task.completed ? 'line-through' : 'none' }}>
                          {task.text}
                        </p>
                        {/* Edit pencil */}
                        {!isConfirm && (
                          <motion.button
                            className="text-[12px] text-[#888] flex-shrink-0 hover:text-[#888]"
                            whileTap={{ scale: 0.88 }}
                            onClick={() => { startEditTask(task); setConfirmDelTask(null); }}
                          >✎</motion.button>
                        )}
                      </div>
                    )}

                    {/* Confirm delete */}
                    {isConfirm ? (
                      <div className="flex items-center gap-[8px]">
                        <p className="text-[#e08888] text-[12px] flex-1">Delete this task?</p>
                        <motion.button
                          className="px-[10px] py-[3px] rounded-[5px] text-[12px] text-[#888] bg-[#1a1a2a]"
                          whileTap={{ scale: 0.92 }}
                          onClick={() => setConfirmDelTask(null)}
                        >Cancel</motion.button>
                        <motion.button
                          className="px-[10px] py-[3px] rounded-[5px] text-[12px] text-[#e08888] bg-[#2a1010]"
                          style={{ border: '1px solid #e0888830' }}
                          whileTap={{ scale: 0.92 }}
                          onClick={() => doDeleteTask(task.id)}
                        >Delete</motion.button>
                      </div>
                    ) : isEditing ? (
                      /* Edit task save/cancel */
                      <div className="flex gap-[8px] justify-end">
                        <motion.button
                          className="px-[10px] py-[3px] rounded-[5px] text-[12px] text-[#888] bg-[#1a1a2a]"
                          whileTap={{ scale: 0.92 }}
                          onClick={() => setEditingTaskId(null)}
                        >Cancel</motion.button>
                        <motion.button
                          className="px-[10px] py-[3px] rounded-[5px] text-[12px] font-medium"
                          style={{ background: '#d4af7822', color: '#d4af78', border: '1px solid #d4af7844' }}
                          whileTap={{ scale: 0.92 }}
                          onClick={commitEditTask}
                        >Save</motion.button>
                      </div>
                    ) : (
                      /* Column move + delete row */
                      <div className="flex items-center gap-[5px]">
                        {(['do-now', 'this-week', 'plan-ahead'] as KanbanColumn[]).map((col) => {
                          const active = task.column === col;
                          return (
                            <motion.button
                              key={col}
                              className="px-[7px] py-[2px] rounded-[5px] text-[12px] font-medium flex-shrink-0"
                              style={{
                                background: active ? COL_COLORS[col] + '28' : 'transparent',
                                color: active ? COL_COLORS[col] : '#333',
                                border: `1px solid ${active ? COL_COLORS[col] + '55' : '#1e1e2a'}`,
                              }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => { if (!active) moveTask(task, col); }}
                            >
                              {COL_LABELS[col]}
                            </motion.button>
                          );
                        })}
                        {/* Effort badge */}
                        <span className="text-[8px] text-[#2a2a3a] ml-[2px] capitalize">{task.effort}</span>
                        {/* Spacer */}
                        <span className="flex-1" />
                        {/* Delete */}
                        <motion.button
                          className="w-[22px] h-[22px] rounded-[5px] flex items-center justify-center text-[12px]"
                          style={{ background: '#2a1010', color: '#e08888' }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => { setConfirmDelTask(task.id); setEditingTaskId(null); }}
                        >×</motion.button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            <div className="h-[16px]" />
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

// ─── Nav icon ─────────────────────────────────────────────────────────────────

function NavIcon({ type, active, onClick }: any) {
  const icons: any = {
    today: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <rect x="3" y="4" width="14" height="13" rx="2" stroke={active ? '#d4af78' : '#555555'} strokeWidth="1.5" />
        <path d="M3 8h14" stroke={active ? '#d4af78' : '#555555'} strokeWidth="1.5" />
        <path d="M7 2v3M13 2v3" stroke={active ? '#d4af78' : '#555555'} strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    sky: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M10 2l2.4 7.2h7.6l-6.2 4.5 2.4 7.3-6.2-4.5-6.2 4.5 2.4-7.3-6.2-4.5h7.6z" fill={active ? '#d4af78' : '#555555'} />
      </svg>
    ),
    ai: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="10" r="7" stroke={active ? '#c4a0e0' : '#555555'} strokeWidth="1.5" />
        <path d="M7 9h6M7 11h6M7 13h4" stroke={active ? '#c4a0e0' : '#555555'} strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    profile: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="7" r="3" stroke="#555555" strokeWidth="1.5" />
        <path d="M4 17c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="#555555" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  };
  return (
    <motion.button className="flex flex-col gap-[6px] items-center w-[60px] cursor-pointer"
      whileTap={{ scale: 0.9 }} onClick={onClick}>
      {icons[type]}
      <p className={`text-[12px] ${active ? 'text-[#d4af78] font-medium' : 'text-[#8888a0] font-normal'}`}>
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </p>
    </motion.button>
  );
}

// ─── Main screen ──────────────────────────────────────────────────────────────

export default function SkyScreen({ onNavigate, reflections, aiPlans, setAiPlans, userMood, isDesktop }: any) {
  const plans: ActionPlan[] = Array.isArray(aiPlans) ? aiPlans : [];

  const [selectedStar, setSelectedStar]     = useState<number | null>(null);
  const [view, setView]                     = useState<'main' | 'constellation' | 'growth' | 'weather' | 'aiTask'>('main');
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [manageOpen, setManageOpen]         = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(() =>
    typeof localStorage !== 'undefined' && !localStorage.getItem('sky_onboarding_seen')
  );

  const dismissOnboarding = () => {
    localStorage.setItem('sky_onboarding_seen', '1');
    setShowOnboarding(false);
  };

  // ── Plan mutation helpers ──────────────────────────────────────────────────

  const handleUpdatePlan = (id: string, changes: Partial<ActionPlan>) => {
    setAiPlans((prev: ActionPlan[]) =>
      prev.map(p => p.id === id ? { ...p, ...changes } : p)
    );
  };

  const handleDeletePlan = (id: string) => {
    setAiPlans((prev: ActionPlan[]) => prev.filter(p => p.id !== id));
  };

  const handleUpdateTask = (planId: string, taskId: string, changes: Partial<KanbanTask>) => {
    setAiPlans((prev: ActionPlan[]) =>
      prev.map(p => p.id !== planId ? p : {
        ...p,
        tasks: p.tasks.map(t => t.id === taskId ? { ...t, ...changes } : t),
      })
    );
  };

  const handleDeleteTask = (planId: string, taskId: string) => {
    setAiPlans((prev: ActionPlan[]) =>
      prev.map(p => p.id !== planId ? p : {
        ...p,
        tasks: p.tasks.filter(t => t.id !== taskId),
      })
    );
  };

  // ── Mock data ──────────────────────────────────────────────────────────────

  const starData = [
    { date: 'Apr 5', category: 'Career', mood: 'Anxious', prompt: "What's one thing you've been putting off because of fear?", reflection: "I've been avoiding asking for a promotion. The fear of rejection feels paralyzing.", tags: ['#fear', '#courage', '#growth'], daysAgo: 4 },
    { date: 'Apr 3', category: 'Creativity', mood: 'Good', prompt: 'When was the last time you created something just for you?', reflection: "Started sketching again this morning. No pressure, no perfection.", tags: ['#art', '#selflove', '#creativity'], daysAgo: 6 },
  ];

  const constellationData = {
    name: 'The Brave Steps', unlockDate: 'April 2025', entryCount: 7, category: 'Career',
    insight: "You've been consistently facing career fears.",
    stars: [{ x: 80, y: 100, size: 6 }, { x: 120, y: 80, size: 8 }, { x: 160, y: 95, size: 7 }, { x: 200, y: 110, size: 9 }, { x: 240, y: 90, size: 7 }, { x: 280, y: 105, size: 8 }, { x: 320, y: 115, size: 10 }],
    entries: [
      { date: 'Apr 5', excerpt: 'Avoiding asking for promotion...', emoji: '😰' },
      { date: 'Apr 2', excerpt: 'Spoke up in the meeting today', emoji: '😊' },
      { date: 'Mar 28', excerpt: 'Fear of being seen as pushy', emoji: '😔' },
      { date: 'Mar 24', excerpt: 'Small win: shared my idea', emoji: '🙂' },
      { date: 'Mar 20', excerpt: 'Feeling stuck in comfort zone', emoji: '😐' },
      { date: 'Mar 15', excerpt: 'What if I fail publicly?', emoji: '😰' },
      { date: 'Mar 10', excerpt: 'Researched career growth paths', emoji: '✨' },
    ],
  };

  // ── Sub-views ──────────────────────────────────────────────────────────────

  if (view === 'constellation') return <ConstellationDetailScreen constellation={constellationData} onBack={() => setView('main')} />;
  if (view === 'growth')        return <SkyGrowthScreen onBack={() => setView('main')} />;
  if (view === 'weather')       return <EmotionalWeatherScreen onBack={() => setView('main')} onNavigate={onNavigate} userMood={userMood} />;

  if (view === 'aiTask') {
    const currentPlan = plans.find((p) => p.id === selectedPlanId) ?? plans[plans.length - 1];
    const handleTasksChange = (updated: KanbanTask[]) => {
      if (!currentPlan) return;
      setAiPlans((prev: ActionPlan[]) => prev.map(p => p.id === currentPlan.id ? { ...p, tasks: updated } : p));
    };
    if (!currentPlan) {
      return (
        <div className={`bg-[#08080f] relative size-full flex items-center justify-center ${isDesktop ? '' : 'overflow-hidden'}`}>
          <div className="text-center">
            <p className="text-[#8888a0] text-[14px] mb-[12px]">No plan selected.</p>
            <button className="text-[#c4a0e0] text-[12px]" onClick={() => setView('main')}>← Back</button>
          </div>
        </div>
      );
    }
    const planColor = dominantColor(currentPlan.tasks);

    if (isDesktop) {
      return (
        <div className="bg-[#08080f] relative size-full overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
          <Starfield density={50} />
          <NebulaGlow color="purple" className="w-[350px] h-[350px] left-[20px] top-[100px]" />
          <div className="relative z-[1] max-w-[600px] mx-auto px-[24px] py-[32px]">
            <motion.button className="flex items-center gap-[8px] mb-[16px] cursor-pointer" whileTap={{ scale: 0.95 }} onClick={() => setView('main')}>
              <p className="text-[20px]" style={{ color: planColor }}>←</p>
              <p className="font-bold text-[#f0e6cc] text-[20px]">AI Action Plan</p>
            </motion.button>
            <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#333333] to-transparent mb-[16px]" />
            <p className="text-[#8888a0] text-[12px] mb-[8px] italic">"{currentPlan.task}"</p>
            {currentPlan.tasks.length > 0
              ? <ConstellationPlan tasks={currentPlan.tasks} onTasksChange={handleTasksChange} compact />
              : <p className="text-[#8888a0] text-[12px] text-center mt-[40px]">No plan data.</p>
            }
          </div>
        </div>
      );
    }

    return (
      <div className="bg-[#08080f] overflow-hidden relative size-full">
        <Starfield density={50} />
        <NebulaGlow color="purple" className="w-[350px] h-[350px] left-[20px] top-[150px]" />
        <div className="absolute h-[44px] left-0 top-0 w-full z-10 bg-gradient-to-b from-[#08080f] to-transparent" />
        <motion.button className="absolute left-[17px] top-[55px] cursor-pointer flex items-center gap-[8px] z-10" whileTap={{ scale: 0.95 }} onClick={() => setView('main')}>
          <p className="text-[20px]" style={{ color: planColor }}>←</p>
          <p className="font-bold text-[#f0e6cc] text-[20px]">AI Action Plan</p>
        </motion.button>
        <div className="absolute h-[1px] left-[17px] right-[17px] top-[95px] bg-gradient-to-r from-transparent via-[#333333] to-transparent z-10" />
        <div className="absolute left-0 right-0 top-[100px] bottom-[24px] overflow-y-auto px-[17px]" style={{ scrollbarWidth: 'none' }}>
          <p className="text-[#8888a0] text-[12px] mb-[4px] italic">"{currentPlan.task}"</p>
          {currentPlan.tasks.length > 0
            ? <ConstellationPlan tasks={currentPlan.tasks} onTasksChange={handleTasksChange} compact />
            : <p className="text-[#8888a0] text-[12px] text-center mt-[40px]">No plan data.</p>
          }
          <div className="h-[16px]" />
        </div>
      </div>
    );
  }

  // ── Shared content ─────────────────────────────────────────────────────────

  const focusColors: any = { Career: '#d4af78', Creativity: '#c4a0e0', Connection: '#88c8a8', Health: '#f0e6cc' };
  const totalCompleted = plans.reduce((acc, p) => acc + p.tasks.filter((t) => t.completed).length, 0);

  const skyCanvas = (
    <div className="bg-[#0b0a18] border border-[#333333] rounded-[16px] overflow-hidden relative" style={{ height: '340px' }}>
      <svg className="absolute inset-0 w-full h-full opacity-8">
        <defs>
          <pattern id="skygrid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#d4af78" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#skygrid)" />
      </svg>
      <svg className="absolute top-[8px] right-[8px]" width="86" height="50">
        <circle cx="6" cy="9"  r="3.5" fill="#88c8a8" opacity="0.85" />
        <text x="14" y="13"  fill="#9898a8" fontSize="9.5" fontFamily="sans-serif">do-now</text>
        <circle cx="6" cy="26" r="3.5" fill="#d4af78" opacity="0.85" />
        <text x="14" y="30"  fill="#9898a8" fontSize="9.5" fontFamily="sans-serif">week</text>
        <circle cx="6" cy="43" r="3.5" fill="#c4a0e0" opacity="0.85" />
        <text x="14" y="47"  fill="#9898a8" fontSize="9.5" fontFamily="sans-serif">ahead</text>
      </svg>
      <svg className="absolute inset-0 w-full h-full">
        {plans.length === 0 ? (
          <>
            {[{ x: 80, y: 150 }, { x: 140, y: 120 }, { x: 200, y: 170 }, { x: 270, y: 140 }, { x: 310, y: 190 }, { x: 100, y: 230 }, { x: 160, y: 270 }, { x: 230, y: 250 }].map((s, i) => (
              <motion.circle key={i} cx={s.x} cy={s.y} r="2.2" fill="#d4af78" opacity={0.2}
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                transition={{ delay: 0.3 + i * 0.07, duration: 0.4 }} />
            ))}
            <text x="175" y="178" textAnchor="middle" fill="#2a2a3a" fontSize="9.5" fontFamily="sans-serif">Create a plan to light your sky</text>
          </>
        ) : (
          plans.slice(0, 6).map((plan, i) => {
            const pos = PLAN_CENTERS[i % PLAN_CENTERS.length];
            return (
              <MiniConstellation key={plan.id} plan={plan} cx={pos.cx} cy={pos.cy} index={i}
                pulse={showOnboarding}
                onClick={() => { dismissOnboarding(); setSelectedPlanId(plan.id); setView('aiTask'); }} />
            );
          })
        )}
      </svg>
      <AnimatePresence>
        {showOnboarding && plans.length > 0 && (
          <motion.div
            className="absolute left-[12px] bottom-[14px] z-10"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ delay: 1.0, duration: 0.45 }}
          >
            <div
              className="rounded-[12px] px-[12px] py-[9px] flex items-start gap-[8px] max-w-[230px]"
              style={{ background: 'rgba(14,13,26,0.92)', border: '1px solid rgba(196,160,224,0.35)', boxShadow: '0 4px 18px rgba(196,160,224,0.18)' }}
            >
              <p className="text-[11px] leading-[1.5]" style={{ color: '#c4a0e0' }}>✦</p>
              <div className="flex-1">
                <p className="text-[#f0e6cc] text-[11px] font-medium leading-[1.4]">Tap a constellation to explore your actions</p>
                <p className="text-[#8888a0] text-[10px] mt-[2px]">Each star is a task in your plan</p>
              </div>
              <motion.button className="text-[#555568] text-[12px] shrink-0 mt-[-1px]" whileTap={{ scale: 0.88 }} onClick={dismissOnboarding}>✕</motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  const subViewButtons = (
    <div className="flex gap-[10px]">
      <motion.button
        className="flex-1 h-[46px] rounded-[14px] flex items-center justify-center gap-[7px]"
        style={{ background: 'rgba(196,160,224,0.13)', border: '1px solid rgba(196,160,224,0.40)', boxShadow: '0 0 18px rgba(196,160,224,0.10)' }}
        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
        onClick={() => setView('weather')}
      >
        <p className="text-[16px] leading-none">⛅</p>
        <p className="text-[#c4a0e0] text-[13px] font-semibold">Emotional Weather</p>
      </motion.button>
      <motion.button
        className="flex-1 h-[46px] rounded-[14px] flex items-center justify-center gap-[7px]"
        style={{ background: 'rgba(212,175,120,0.10)', border: '1px solid rgba(212,175,120,0.35)', boxShadow: '0 0 18px rgba(212,175,120,0.08)' }}
        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
        onClick={() => setView('growth')}
      >
        <p className="text-[16px] leading-none">✦</p>
        <p className="text-[#d4af78] text-[13px] font-semibold">My Journey</p>
      </motion.button>
    </div>
  );

  const filterBar = (
    <div>
      <p className="font-bold text-[#f0e6cc] text-[14px] mb-[10px]">Filter by Focus</p>
      <div className="flex gap-[8px] overflow-x-auto pb-[4px]" style={{ scrollbarWidth: 'none' }}>
        {['All', 'Career', 'Creativity', 'Connection', 'Health'].map((area) => (
          <motion.button key={area}
            className={`${selectedFilter === area ? 'bg-[#d4af78] border-[#d4af78]' : 'bg-[#0b0a18] border-[#333333]'} border px-[12px] h-[28px] rounded-[14px] flex items-center gap-[6px] whitespace-nowrap`}
            whileTap={{ scale: 0.95 }} onClick={() => setSelectedFilter(area)}>
            {area !== 'All' && <div className="size-[6px] rounded-full" style={{ backgroundColor: selectedFilter === area ? '#08080f' : focusColors[area] }} />}
            <p className={`text-[12px] font-medium ${selectedFilter === area ? 'text-[#08080f]' : 'text-[#888888]'}`}>{area}</p>
          </motion.button>
        ))}
      </div>
    </div>
  );

  const constellationsSection = (
    <div>
      <div className="flex items-center justify-between mb-[10px]">
        <p className="font-bold text-[#f0e6cc] text-[14px]">Your Constellations</p>
        {plans.length > 0 && (
          <motion.button
            className="flex items-center gap-[5px] px-[10px] h-[24px] rounded-[12px] text-[12px] font-medium"
            style={{ background: 'rgba(196,160,224,0.12)', color: '#c4a0e0', border: '1px solid rgba(196,160,224,0.25)' }}
            whileTap={{ scale: 0.92 }} onClick={() => setManageOpen(true)}
          ><span>⊞</span><span>Manage</span></motion.button>
        )}
      </div>
      <div className="flex gap-[12px] pb-[4px] -mx-[17px] px-[17px]" style={{ overflowX: 'scroll', scrollbarWidth: 'none' }}>
        {plans.map((plan) => {
          const done    = plan.tasks.filter((t) => t.completed).length;
          const total   = plan.tasks.length;
          const allDone = done === total && total > 0;
          const pColor  = dominantColor(plan.tasks);
          const shape   = getConstellationForTask(plan.task, plan.id);
          const previewStars = plan.tasks.slice(0, 6).map((task, i) => ({
            x: 40 + shape.offsets[i % shape.offsets.length].dx * 0.65,
            y: 34 + shape.offsets[i % shape.offsets.length].dy * 0.65,
            color: task.completed ? CLAIMED_COLOR : (COL_COLORS[task.column] ?? pColor),
            r: (EFFORT_R[task.effort] ?? 3) * 0.55 + (task.completed ? 0.8 : 0),
            op: task.completed ? 0.9 : 0.4,
          }));
          return (
            <motion.button key={plan.id}
              className="rounded-[12px] px-[10px] py-[10px] min-w-[170px] text-left shrink-0"
              style={{
                background: allDone ? 'linear-gradient(135deg, #1e1a0a, #14110a)' : `linear-gradient(135deg, ${pColor}18, ${pColor}08)`,
                border: `1.5px solid ${allDone ? CLAIMED_COLOR + '55' : pColor + '44'}`,
                boxShadow: allDone ? `0 0 18px rgba(240,230,204,0.15)` : `0 0 14px ${pColor}22`,
              }}
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              onClick={() => { setSelectedPlanId(plan.id); setView('aiTask'); }}
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}>
              <svg width="80" height="68" className="mb-[4px]">
                {shape.lines.map(([from, to], li) => {
                  if (from >= previewStars.length || to >= previewStars.length) return null;
                  const a = previewStars[from], b = previewStars[to];
                  const bothD = plan.tasks[from]?.completed && plan.tasks[to]?.completed;
                  return <line key={li} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={bothD ? CLAIMED_COLOR : pColor} strokeWidth={bothD ? 1 : 0.6} opacity={bothD ? 0.45 : 0.2} />;
                })}
                {previewStars.map((s, si) => (
                  <circle key={si} cx={s.x} cy={s.y} r={s.r} fill={s.color} opacity={s.op}
                    style={plan.tasks[si]?.completed ? { filter: `drop-shadow(0 0 3px ${CLAIMED_GLOW})` } : {}} />
                ))}
              </svg>
              <p className="text-[11px] font-bold mb-[1px]" style={{ color: allDone ? CLAIMED_COLOR : pColor }}>{shape.name}</p>
              <p className="text-[12px] mb-[3px]" style={{ color: allDone ? '#a09060' : pColor + 'aa' }}>{done}/{total} stars lit {allDone ? '✓' : ''}</p>
              <p className="text-[12px] italic truncate max-w-[148px]" style={{ color: '#8888a0' }}>{plan.task}</p>
            </motion.button>
          );
        })}
        {[{ name: 'Brave Steps', count: 7, color: '#d4af78' }, { name: 'Creative Sparks', count: 5, color: '#c4a0e0' }].map((c, i) => (
          <motion.button key={i}
            className="bg-[#0b0a18] border border-[#333333] rounded-[12px] px-[14px] py-[12px] min-w-[150px] shrink-0"
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={() => setView('constellation')}>
            <p className="text-[20px] mb-[6px]">✦</p>
            <p className="text-[13px] font-bold mb-[2px]" style={{ color: c.color }}>{c.name}</p>
            <p className="text-[#888888] text-[12px]">{c.count} entries</p>
          </motion.button>
        ))}
        {plans.length === 0 && (
          <motion.button
            className="bg-[#0b0a18] border border-dashed border-[#252525] rounded-[12px] px-[14px] py-[12px] min-w-[170px] shrink-0"
            whileTap={{ scale: 0.97 }} onClick={() => onNavigate('ai')}>
            <p className="text-[20px] mb-[6px]">✦</p>
            <p className="text-[#8888a0] text-[12px] font-medium mb-[2px]">No plans yet</p>
            <p className="text-[#888] text-[12px]">Go to AI Companion →</p>
          </motion.button>
        )}
      </div>
    </div>
  );

  const progressCard = (
    <div className="bg-[#0b0a18] border border-[#333333] rounded-[12px] px-[12px] py-[12px]">
      <p className="font-bold text-[#f0e6cc] text-[12px] mb-[6px]">Progress This Month</p>
      <p className="text-[#888888] text-[11px] mb-[8px]">{`${reflections.length} reflections  ·  ${totalCompleted} actions done  ·  ${plans.length} plans`}</p>
      <div className="bg-[#1a1a1a] h-[10px] rounded-[5px] w-full relative overflow-hidden">
        <motion.div className="bg-gradient-to-r from-[#d4af78] to-[#c4a0e0] h-[10px] rounded-[5px] absolute left-0 top-0"
          initial={{ width: 0 }} animate={{ width: `${Math.min((reflections.length / 12) * 100, 65)}%` }}
          transition={{ duration: 1, delay: 0.5 }} style={{ boxShadow: '0 0 12px rgba(212,175,120,0.5)' }} />
      </div>
    </div>
  );

  const hintCard = (
    <motion.div className="bg-[#0b0a18] border border-[#d4af78] rounded-[12px] px-[14px] py-[12px]"
      style={{ boxShadow: '0 0 20px rgba(212,175,120,0.2)' }} whileHover={{ scale: 1.01 }}>
      <p className="font-bold text-[#d4af78] text-[13px] mb-[4px]">✦ New constellation forming…</p>
      <p className="text-[#888888] text-[11px]">3 more entries to unlock "Brave Steps"</p>
    </motion.div>
  );

  const modals = (
    <>
      <AnimatePresence>
        {selectedStar !== null && (
          <StarDetailModal star={starData[selectedStar] || starData[0]} onClose={() => setSelectedStar(null)} />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {manageOpen && (
          <ManageSheet
            plans={plans}
            onClose={() => setManageOpen(false)}
            onUpdatePlan={handleUpdatePlan}
            onDeletePlan={handleDeletePlan}
            onUpdateTask={handleUpdateTask}
            onDeleteTask={handleDeleteTask}
            onOpenPlan={(id) => { setSelectedPlanId(id); setView('aiTask'); }}
          />
        )}
      </AnimatePresence>
    </>
  );

  // ── Desktop layout ─────────────────────────────────────────────────────────

  if (isDesktop) {
    return (
      <div className="bg-[#08080f] relative size-full overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
        <Starfield density={40} />
        <NebulaGlow color="purple" className="w-[300px] h-[300px] left-[45px] top-[80px]" />
        <div className="relative z-[1] max-w-[640px] mx-auto px-[24px] py-[32px] flex flex-col gap-[20px]">
          {/* Header */}
          <div className="flex items-baseline gap-[12px]">
            <p className="font-bold text-[#f0e6cc] text-[28px]">Your Sky</p>
            <p className="text-[#888888] text-[12px]">
              {`${reflections.length} stars  ·  ${plans.length} constellation${plans.length !== 1 ? 's' : ''}`}
            </p>
          </div>
          <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#333333] to-transparent" />
          {skyCanvas}
          {subViewButtons}
          {filterBar}
          {constellationsSection}
          {progressCard}
          {hintCard}
        </div>
        {modals}
      </div>
    );
  }

  // ── Mobile layout ──────────────────────────────────────────────────────────

  return (
    <div className="bg-[#08080f] overflow-hidden relative size-full">
      <Starfield density={40} />

      {/* Status bar */}
      <div className="absolute h-[44px] left-0 top-0 w-full z-10 bg-gradient-to-b from-[#08080f] to-transparent" />

      {/* Header */}
      <p className="absolute font-bold left-[17px] text-[#f0e6cc] text-[24px] top-[55px]">Your Sky</p>
      <p className="absolute font-normal left-[197px] text-[#888888] text-[11px] top-[63px]">
        {`${reflections.length} stars  ·  ${plans.length} constellation${plans.length !== 1 ? 's' : ''}`}
      </p>

      <div className="absolute h-[1px] left-[17px] right-[17px] top-[95px] bg-gradient-to-r from-transparent via-[#333333] to-transparent" />

      <NebulaGlow color="purple" className="w-[300px] h-[300px] left-[45px] top-[110px]" />

      {/* Sky canvas — mobile absolute position */}
      <div className="absolute left-[17px] top-[111px] w-[350px]">
        {skyCanvas}
      </div>

      {/* Scrollable section below canvas */}
      <div className="absolute left-0 right-0 top-[458px] bottom-[90px] overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
        <div className="px-[17px] pt-[12px] pb-[24px] flex flex-col gap-[16px]">
          {subViewButtons}
          {filterBar}
          {constellationsSection}
          {progressCard}
          {hintCard}
        </div>
      </div>

      {/* Bottom nav */}
      <div className="absolute bg-[#0b0a18] border-t border-[#1a1a1a] flex gap-[31px] h-[90px] items-center justify-center left-0 bottom-0 w-full">
        <NavIcon type="today"   active={false} onClick={() => onNavigate('today')}   />
        <NavIcon type="sky"     active={true}  onClick={() => onNavigate('sky')}     />
        <NavIcon type="ai"      active={false} onClick={() => onNavigate('ai')}      />
        <NavIcon type="profile" active={false} onClick={() => onNavigate('profile')} />
      </div>

      {modals}
    </div>
  );
}
