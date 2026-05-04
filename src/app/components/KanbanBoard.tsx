import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme } from '../context/ThemeContext';
import type { KanbanTask, KanbanColumn } from '../types';

// ─── Column config (dark / light) ─────────────────────────────────────────────

const COL_DARK = [
  { id: 'do-now'     as KanbanColumn, label: 'Do Now',     icon: '⚡', color: '#88c8a8', glow: 'rgba(136,200,168,0.25)' },
  { id: 'this-week'  as KanbanColumn, label: 'This Week',  icon: '📅', color: '#d4af78', glow: 'rgba(212,175,120,0.25)' },
  { id: 'plan-ahead' as KanbanColumn, label: 'Plan Ahead', icon: '🌱', color: '#c4a0e0', glow: 'rgba(196,160,224,0.25)' },
];
const COL_LIGHT_COLORS = [
  { color: '#2d8a68', glow: 'rgba(45,138,104,0.18)'  },
  { color: '#b07d18', glow: 'rgba(176,125,24,0.18)'   },
  { color: '#6b3a9a', glow: 'rgba(107,58,154,0.18)'   },
];

const EFFORT_LABEL: Record<string, string> = { low: 'Easy', medium: 'Moderate', high: 'Heavy' };
const EFFORT_COLOR_DARK:  Record<string, string> = { low: '#88c8a8', medium: '#d4af78', high: '#c4a0e0' };
const EFFORT_COLOR_LIGHT: Record<string, string> = { low: '#2d8a68', medium: '#b07d18', high: '#6b3a9a' };

// ─── Task card ────────────────────────────────────────────────────────────────

function TaskCard({
  task,
  colColor,
  isDark,
  nextCol,
  prevCol,
  onToggle,
  onMove,
}: {
  task: KanbanTask;
  colColor: string;
  isDark: boolean;
  nextCol?: { label: string; color: string };
  prevCol?: { label: string };
  onToggle: () => void;
  onMove: (dir: 'left' | 'right') => void;
}) {
  const [expanded, setExpanded] = useState(false);

  /* ── per-theme tokens ── */
  const cardBg        = isDark
    ? (task.completed ? 'rgba(11,10,24,0.40)' : 'rgba(11,10,24,0.90)')
    : (task.completed ? 'rgba(230,242,252,0.70)' : 'rgba(255,255,255,0.95)');
  const cardBorder    = isDark
    ? `1px solid ${task.completed ? '#222' : colColor + '55'}`
    : `1px solid ${task.completed ? 'rgba(28,58,92,0.10)' : colColor + '55'}`;
  const cardShadow    = isDark
    ? (task.completed ? 'none' : `0 0 12px ${colColor}22`)
    : (task.completed ? 'none' : `0 2px 8px ${colColor}28`);
  const titleColor    = isDark
    ? (task.completed ? '#8888a0' : '#f0e6cc')
    : (task.completed ? '#6a8aa0' : '#1c3a5c');
  const subtleColor   = isDark ? '#8888a0' : '#4a6a82';
  const dividerColor  = isDark ? '#1a1a1a' : 'rgba(92,58,122,0.12)';
  const timeBadgeBg   = isDark ? 'rgba(26,26,26,1)' : 'rgba(168,212,240,0.30)';
  const chkBorder     = isDark
    ? (task.completed ? colColor : '#444')
    : (task.completed ? colColor : 'rgba(28,58,92,0.30)');
  const effortColor   = isDark ? EFFORT_COLOR_DARK[task.effort] : EFFORT_COLOR_LIGHT[task.effort];
  const moveBkBorder  = isDark ? '#333' : 'rgba(28,58,92,0.22)';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="rounded-[14px] p-[12px] mb-[10px]"
      style={{
        background: cardBg,
        border:     cardBorder,
        boxShadow:  cardShadow,
        opacity:    task.completed ? (isDark ? 0.55 : 0.70) : 1,
      }}
    >
      {/* Header row */}
      <div className="flex items-start gap-[8px]">
        {/* Done checkbox */}
        <motion.button
          className="mt-[1px] shrink-0 size-[18px] rounded-full border flex items-center justify-center"
          style={{
            borderColor:     chkBorder,
            backgroundColor: task.completed ? colColor : 'transparent',
          }}
          whileTap={{ scale: 0.85 }}
          onClick={onToggle}
        >
          {task.completed && <p className="text-[#08080f] text-[12px] font-bold">✓</p>}
        </motion.button>

        {/* Title */}
        <button className="flex-1 text-left" onClick={() => setExpanded(!expanded)}>
          <p className="text-[12px] font-medium leading-[1.4] line-clamp-2" style={{ color: titleColor }}>
            {task.text}
          </p>
        </button>

        {/* Expand chevron */}
        <motion.span
          className="text-[12px] shrink-0 mt-[2px]"
          style={{ color: subtleColor }}
          animate={{ rotate: expanded ? 180 : 0 }}
        >▾</motion.span>
      </div>

      {/* Badges */}
      <div className="flex gap-[6px] mt-[8px] flex-wrap">
        <span
          className="text-[12px] px-[7px] py-[2px] rounded-full"
          style={{ background: effortColor + '28', color: effortColor }}
        >
          {EFFORT_LABEL[task.effort]}
        </span>
        <span
          className="text-[12px] px-[7px] py-[2px] rounded-full"
          style={{ background: timeBadgeBg, color: subtleColor }}
        >
          ⏱ {task.timeLabel}
        </span>
      </div>

      {/* Expanded details */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <p
              className="text-[11px] leading-[1.5] mt-[10px] border-t pt-[10px]"
              style={{ color: subtleColor, borderColor: dividerColor }}
            >
              {task.details}
            </p>

            {/* Move buttons */}
            <div className="flex gap-[6px] mt-[10px]">
              {prevCol && (
                <motion.button
                  className="flex-1 h-[26px] rounded-[8px] border text-[12px]"
                  style={{ borderColor: moveBkBorder, color: subtleColor }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onMove('left')}
                >
                  ← {prevCol.label}
                </motion.button>
              )}
              {nextCol && (
                <motion.button
                  className="flex-1 h-[26px] rounded-[8px] border text-[12px] font-medium"
                  style={{ borderColor: nextCol.color, color: nextCol.color }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onMove('right')}
                >
                  {nextCol.label} →
                </motion.button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Main Kanban board ────────────────────────────────────────────────────────

export default function KanbanBoard({
  tasks,
  onTasksChange,
}: {
  tasks: KanbanTask[];
  onTasksChange: (tasks: KanbanTask[]) => void;
}) {
  const { isDark } = useTheme();
  const [activeCol, setActiveCol] = useState<KanbanColumn>('do-now');

  /* merge base config with theme-aware colours */
  const COLUMNS = COL_DARK.map((c, i) => ({
    ...c,
    ...(isDark ? {} : COL_LIGHT_COLORS[i]),
  }));

  const colTasks = (col: KanbanColumn) =>
    tasks.filter((t) => t.column === col).sort((a, b) => a.timeMinutes - b.timeMinutes);

  const doneCount = tasks.filter((t) => t.completed).length;

  const toggleTask = (id: string) => {
    onTasksChange(tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  };

  const moveTask = (id: string, dir: 'left' | 'right') => {
    const cols: KanbanColumn[] = ['do-now', 'this-week', 'plan-ahead'];
    onTasksChange(
      tasks.map((t) => {
        if (t.id !== id) return t;
        const idx = cols.indexOf(t.column);
        const next = cols[idx + (dir === 'right' ? 1 : -1)];
        return next ? { ...t, column: next } : t;
      })
    );
  };

  const activeConf  = COLUMNS.find((c) => c.id === activeCol)!;
  const activeTasks = colTasks(activeCol);
  const colIdx      = COLUMNS.findIndex((c) => c.id === activeCol);

  /* theme tokens for board chrome */
  const progressBg    = isDark ? '#1a1a1a' : 'rgba(168,212,240,0.35)';
  const doneCountCol  = isDark ? '#888888' : '#3d5a72';
  const tabInactiveBd = isDark ? '#222222' : 'rgba(28,58,92,0.15)';
  const tabInactiveC  = isDark ? '#555555' : '#3d5a72';
  const sortedByCol   = isDark ? '#8888a0' : '#4a6a82';
  const emptyTextCol  = isDark ? '#888888' : '#3d5a72';

  return (
    <div className="mt-[12px]">
      {/* Progress bar */}
      <div className="flex items-center gap-[8px] mb-[10px]">
        <div
          className="flex-1 h-[4px] rounded-full overflow-hidden"
          style={{ background: progressBg }}
        >
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'linear-gradient(to right, #88c8a8, #d4af78, #c4a0e0)' }}
            animate={{ width: tasks.length ? `${(doneCount / tasks.length) * 100}%` : '0%' }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <p className="text-[12px] shrink-0" style={{ color: doneCountCol }}>
          {doneCount}/{tasks.length} done
        </p>
      </div>

      {/* Column tabs */}
      <div className="flex gap-[6px] mb-[10px]">
        {COLUMNS.map((col) => {
          const count    = colTasks(col.id).length;
          const isActive = activeCol === col.id;
          return (
            <motion.button
              key={col.id}
              className="flex-1 rounded-[10px] py-[7px] flex flex-col items-center gap-[2px]"
              style={{
                background: isActive ? col.color + '22' : 'transparent',
                border:     `1px solid ${isActive ? col.color + '66' : tabInactiveBd}`,
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveCol(col.id)}
            >
              <p className="text-[13px]">{col.icon}</p>
              <p
                className="text-[12px] font-medium"
                style={{ color: isActive ? col.color : tabInactiveC }}
              >
                {col.label}
              </p>
              {count > 0 && (
                <div
                  className="size-[14px] rounded-full flex items-center justify-center"
                  style={{ background: col.color }}
                >
                  <p className="text-[11px] font-bold text-[#08080f]">{count}</p>
                </div>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Column header */}
      <div className="flex items-center gap-[6px] mb-[8px]">
        <p className="text-[14px]">{activeConf.icon}</p>
        <p className="text-[12px] font-bold" style={{ color: activeConf.color }}>
          {activeConf.label}
        </p>
        <p className="text-[11px] ml-auto" style={{ color: sortedByCol }}>sorted by time</p>
      </div>

      {/* Task cards */}
      <AnimatePresence mode="popLayout">
        {activeTasks.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-[24px]"
          >
            <p className="text-[12px]" style={{ color: emptyTextCol }}>No tasks here yet</p>
            <p className="text-[11px] mt-[4px]" style={{ color: emptyTextCol }}>Move tasks from other columns</p>
          </motion.div>
        ) : (
          activeTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              colColor={activeConf.color}
              isDark={isDark}
              prevCol={colIdx > 0 ? { label: COLUMNS[colIdx - 1].label } : undefined}
              nextCol={colIdx < 2 ? { label: COLUMNS[colIdx + 1].label, color: COLUMNS[colIdx + 1].color } : undefined}
              onToggle={() => toggleTask(task.id)}
              onMove={(dir) => moveTask(task.id, dir)}
            />
          ))
        )}
      </AnimatePresence>
    </div>
  );
}
