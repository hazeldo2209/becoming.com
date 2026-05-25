import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme } from '../context/ThemeContext';
import type { ActionPlan, KanbanTask, KanbanColumn } from '../types';
import type { User } from '@supabase/supabase-js';
import { supabase } from '@/app/lib/supabase';

// ─── Constants ────────────────────────────────────────────────────────────────

const COL_COLOR: Record<KanbanColumn, string> = {
  'do-now':     '#88c8a8',
  'this-week':  '#d4af78',
  'plan-ahead': '#c4a0e0',
};
const COL_LABEL: Record<KanbanColumn, string> = {
  'do-now':     'Do Now',
  'this-week':  'This Week',
  'plan-ahead': 'Plan Ahead',
};

// ─── Nav items ─────────────────────────────────────────────────────────────────

const NAV = [
  { id: 'today',   label: 'Today',         icon: '📅' },
  { id: 'sky',     label: 'My Sky',        icon: '🌌' },
  { id: 'ai',      label: 'AI Companion',  icon: '✦'  },
  { id: 'solidarity', label: 'Community',  icon: '🤝' },
  { id: 'profile', label: 'Profile',       icon: '👤' },
];

// ─── Helpers ───────────────────────────────────────────────────────────────────

function getDisplayName(user: User | null): string {
  if (!user) return 'Stargazer';
  const meta = user.user_metadata as Record<string, string> | undefined;
  if (meta?.full_name) return meta.full_name;
  if (meta?.name) return meta.name;
  if (user.email) return user.email.split('@')[0];
  return 'Stargazer';
}

function getInitial(name: string): string {
  return name.trim()[0]?.toUpperCase() ?? '✦';
}

// ─── Task row ──────────────────────────────────────────────────────────────────

function TaskRow({
  task,
  onToggle,
  T,
}: {
  task: KanbanTask;
  onToggle: () => void;
  T: Record<string, string>;
}) {
  const color = COL_COLOR[task.column];
  return (
    <motion.div
      className="flex items-start gap-[9px] rounded-[10px] px-[11px] py-[9px] cursor-pointer"
      style={{ background: T.taskBg, border: `1px solid ${T.cardBorder}` }}
      whileHover={{ scale: 1.01, background: T.taskHover }}
      whileTap={{ scale: 0.98 }}
      onClick={onToggle}
    >
      {/* Checkbox */}
      <motion.div
        className="size-[15px] rounded-full border flex items-center justify-center shrink-0 mt-[1px]"
        style={{
          borderColor: task.completed ? color : T.checkBorder,
          backgroundColor: task.completed ? color : 'transparent',
        }}
        whileTap={{ scale: 0.8 }}
      >
        {task.completed && (
          <p className="text-[9px] font-bold" style={{ color: '#08080f' }}>✓</p>
        )}
      </motion.div>

      <div className="flex-1 min-w-0">
        <p
          className="text-[12px] leading-snug"
          style={{
            color:          task.completed ? T.muted : T.text,
            textDecoration: task.completed ? 'line-through' : 'none',
          }}
        >
          {task.text}
        </p>
        <div className="flex items-center gap-[5px] mt-[3px]">
          <span className="text-[9px] px-[5px] py-[1px] rounded-full"
            style={{ background: color + '18', color }}>
            {task.effort === 'low' ? 'easy' : task.effort}
          </span>
          <span className="text-[10px]" style={{ color: T.muted }}>⏱ {task.timeLabel}</span>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Desktop Layout ────────────────────────────────────────────────────────────

export default function DesktopLayout({
  currentScreen,
  onNavigate,
  children,
  aiPlans,
  setAiPlans,
  user,
  signOut,
}: {
  currentScreen: string;
  onNavigate: (s: string) => void;
  children: React.ReactNode;
  aiPlans: ActionPlan[];
  setAiPlans: React.Dispatch<React.SetStateAction<ActionPlan[]>>;
  user: User | null;
  signOut: () => Promise<void>;
}) {
  const { isDark, toggle } = useTheme();
  const plans = Array.isArray(aiPlans) ? aiPlans : [];

  const [activePlanId, setActivePlanId] = useState<string | null>(
    plans.length > 0 ? plans[plans.length - 1].id : null,
  );
  const [planPickerOpen, setPlanPickerOpen] = useState(false);

  // Keep activePlanId in sync when plans change
  useEffect(() => {
    if (plans.length > 0 && !plans.find(p => p.id === activePlanId)) {
      setActivePlanId(plans[plans.length - 1].id);
    }
    if (plans.length === 0) setActivePlanId(null);
  }, [plans, activePlanId]);

  const activePlan = plans.find(p => p.id === activePlanId) ?? null;

  const displayName = getDisplayName(user);
  const initial     = getInitial(displayName);

  // ── Theme tokens ──────────────────────────────────────────────────────────
  const T = isDark ? {
    pageBg:      '#06060e',
    sidebarBg:   '#0a0918',
    border:      'rgba(255,255,255,0.07)',
    text:        '#f0e6cc',
    subtext:     '#c8c8d8',
    muted:       '#8888a0',
    accent:      '#c4a0e0',
    accentGold:  '#d4af78',
    activeNavBg: 'rgba(196,160,224,0.13)',
    navHover:    'rgba(255,255,255,0.04)',
    cardBg:      '#0b0a18',
    cardBorder:  'rgba(255,255,255,0.07)',
    taskBg:      'rgba(255,255,255,0.03)',
    taskHover:   'rgba(255,255,255,0.06)',
    checkBorder: '#2a2a3a',
    progressBg:  '#1a1a2e',
    statsBorder: 'rgba(255,255,255,0.06)',
    statsIcon:   '🌙',
  } : {
    pageBg:      '#f0ece2',
    sidebarBg:   '#faf8f4',
    border:      'rgba(0,0,0,0.08)',
    text:        '#1c3a5c',
    subtext:     '#334466',
    muted:       '#7a8fa0',
    accent:      '#5c3a7a',
    accentGold:  '#a07010',
    activeNavBg: 'rgba(92,58,122,0.10)',
    navHover:    'rgba(0,0,0,0.04)',
    cardBg:      '#ffffff',
    cardBorder:  'rgba(0,0,0,0.07)',
    taskBg:      '#f5f1ea',
    taskHover:   '#ede8de',
    checkBorder: '#c8c8d0',
    progressBg:  '#e0d8cc',
    statsBorder: 'rgba(0,0,0,0.06)',
    statsIcon:   '☀️',
  };

  // ── Task toggle ───────────────────────────────────────────────────────────

  const handleToggle = async (taskId: string) => {
    if (!activePlan) return;
    const updatedTasks = activePlan.tasks.map(t =>
      t.id === taskId ? { ...t, completed: !t.completed } : t,
    );
    const updatedPlan = { ...activePlan, tasks: updatedTasks };
    setAiPlans(prev => prev.map(p => p.id === activePlan.id ? updatedPlan : p));
    if (user?.id) {
      await supabase.from('ai_plans').upsert({
        id:           activePlan.id,
        user_id:      user.id,
        task:         activePlan.task,
        tasks:        updatedTasks as unknown as object,
        conversation: activePlan.conversation ?? [] as unknown as object,
        created_at:   activePlan.createdAt,
      });
    }
  };

  // ── Task grouping ─────────────────────────────────────────────────────────

  const tasksByCol = (['do-now', 'this-week', 'plan-ahead'] as KanbanColumn[]).map(col => ({
    col,
    tasks: activePlan?.tasks.filter(t => t.column === col) ?? [],
  })).filter(g => g.tasks.length > 0);

  const done  = activePlan?.tasks.filter(t => t.completed).length ?? 0;
  const total = activePlan?.tasks.length ?? 0;
  const pct   = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <div
      className="flex h-screen w-screen overflow-hidden"
      style={{ backgroundColor: T.pageBg }}
    >
      {/* ── Left sidebar ─────────────────────────────────────────────────── */}
      <aside
        className="w-[216px] h-full flex flex-col shrink-0"
        style={{ backgroundColor: T.sidebarBg, borderRight: `1px solid ${T.border}` }}
      >
        {/* Brand */}
        <div className="px-[20px] pt-[28px] pb-[22px]">
          <div className="flex items-center gap-[9px] mb-[2px]">
            <motion.div
              className="text-[20px] select-none"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              ✦
            </motion.div>
            <p className="font-bold text-[18px] tracking-tight" style={{ color: T.text }}>Becoming</p>
          </div>
          <p className="text-[11px] pl-[29px]" style={{ color: T.muted }}>Your journey, mapped</p>
        </div>

        <div className="h-[1px] mx-[16px] mb-[10px]" style={{ backgroundColor: T.border }} />

        {/* Nav */}
        <nav className="flex-1 px-[10px] space-y-[2px]">
          {NAV.map(item => {
            const isActive = currentScreen === item.id ||
              (item.id === 'today' && currentScreen === 'checkin');
            return (
              <motion.button
                key={item.id}
                className="w-full flex items-center gap-[10px] px-[12px] h-[40px] rounded-[10px] text-left"
                style={{
                  background: isActive ? T.activeNavBg : 'transparent',
                  color:      isActive ? T.accent      : T.muted,
                  fontWeight: isActive ? 600 : 400,
                }}
                whileHover={{ background: isActive ? T.activeNavBg : T.navHover }}
                whileTap={{ scale: 0.96 }}
                onClick={() => onNavigate(item.id)}
              >
                <span
                  className="shrink-0"
                  style={{ fontSize: item.icon === '✦' ? 11 : 15, opacity: isActive ? 1 : 0.7 }}
                >
                  {item.icon}
                </span>
                <p className="text-[13px]">{item.label}</p>
                {isActive && (
                  <motion.div
                    className="ml-auto w-[5px] h-[5px] rounded-full shrink-0"
                    style={{ backgroundColor: T.accent }}
                    layoutId="nav-dot"
                  />
                )}
              </motion.button>
            );
          })}
        </nav>

        {/* Bottom section */}
        <div className="px-[10px] pb-[18px] space-y-[4px]">
          <div className="h-[1px] mb-[6px] mx-[6px]" style={{ backgroundColor: T.border }} />

          {/* Theme toggle — segmented pill */}
          <div
            className="flex items-center mx-[6px] p-[3px] rounded-[10px]"
            style={{ backgroundColor: isDark ? '#16152a' : '#e4e0d8' }}
          >
            {(['light', 'dark'] as const).map(mode => {
              const isActive = isDark ? mode === 'dark' : mode === 'light';
              return (
                <motion.button
                  key={mode}
                  className="flex-1 flex items-center justify-center gap-[5px] h-[30px] rounded-[8px] cursor-pointer"
                  style={{
                    background: isActive
                      ? isDark ? '#2a2844' : '#ffffff'
                      : 'transparent',
                    boxShadow: isActive
                      ? isDark
                        ? '0 1px 4px rgba(0,0,0,0.4)'
                        : '0 1px 4px rgba(0,0,0,0.12)'
                      : 'none',
                  }}
                  animate={{ background: isActive ? (isDark ? '#2a2844' : '#ffffff') : 'transparent' }}
                  transition={{ duration: 0.2 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => { if (!isActive) toggle(); }}
                >
                  <span className="text-[12px]">
                    {mode === 'light' ? '☀️' : '🌙'}
                  </span>
                  <p
                    className="text-[12px] font-medium"
                    style={{ color: isActive ? (isDark ? '#c4a0e0' : '#1c3a5c') : T.muted }}
                  >
                    {mode === 'light' ? 'Light' : 'Dark'}
                  </p>
                </motion.button>
              );
            })}
          </div>

          {/* Sign out */}
          <motion.button
            className="w-full flex items-center gap-[10px] px-[12px] h-[38px] rounded-[10px]"
            style={{ color: T.muted }}
            whileHover={{ background: T.navHover }}
            whileTap={{ scale: 0.96 }}
            onClick={signOut}
          >
            <span className="text-[13px]">↩</span>
            <p className="text-[13px]">Sign out</p>
          </motion.button>

          <div className="h-[1px] my-[4px] mx-[6px]" style={{ backgroundColor: T.border }} />

          {/* User pill */}
          <div className="flex items-center gap-[8px] px-[10px] py-[7px] rounded-[10px]"
            style={{ background: T.activeNavBg }}>
            <div
              className="size-[28px] rounded-full flex items-center justify-center shrink-0 text-[11px] font-bold"
              style={{ background: 'linear-gradient(135deg,#d4af78,#c4a0e0)', color: '#08080f' }}
            >
              {initial}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[12px] font-medium truncate" style={{ color: T.subtext }}>
                {displayName}
              </p>
              {user?.email && (
                <p className="text-[10px] truncate" style={{ color: T.muted }}>{user.email}</p>
              )}
            </div>
          </div>
        </div>
      </aside>

      {/* ── Center: full-width content area ──────────────────────────────── */}
      <main
        className="flex-1 h-full relative overflow-hidden"
        style={{ backgroundColor: T.pageBg }}
      >
        {/* Subtle dot-grid background */}
        <div className="absolute inset-0 pointer-events-none" style={{ opacity: isDark ? 0.025 : 0.04 }}>
          <svg width="100%" height="100%">
            <defs>
              <pattern id="dtgrid" width="28" height="28" patternUnits="userSpaceOnUse">
                <circle cx="0.5" cy="0.5" r="0.5" fill={isDark ? '#ffffff' : '#000000'} />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dtgrid)" />
          </svg>
        </div>

        {/* Screen content fills the center column directly */}
        <div className="relative w-full h-full overflow-hidden">
          {children}
        </div>
      </main>

      {/* ── Right: Tasks panel ────────────────────────────────────────────── */}
      <aside
        className="w-[288px] h-full flex flex-col shrink-0"
        style={{ backgroundColor: T.sidebarBg, borderLeft: `1px solid ${T.border}` }}
      >
        {/* Header */}
        <div className="px-[18px] pt-[28px] pb-[14px]">
          <p className="font-bold text-[15px] mb-[2px]" style={{ color: T.text }}>Your Tasks</p>
          <p className="text-[11px]" style={{ color: T.muted }}>
            {activePlan ? `${done}/${total} completed` : 'No active plan'}
          </p>
        </div>

        <div className="h-[1px] mx-[18px]" style={{ backgroundColor: T.border }} />

        {/* Plan selector */}
        {plans.length > 0 && (
          <div className="px-[14px] py-[10px]">
            <motion.button
              className="w-full flex items-center gap-[8px] px-[10px] py-[8px] rounded-[10px] text-left"
              style={{ background: T.taskBg, border: `1px solid ${T.cardBorder}` }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setPlanPickerOpen(o => !o)}
            >
              <div
                className="size-[8px] rounded-full shrink-0"
                style={{ backgroundColor: T.accent }}
              />
              <p className="flex-1 text-[12px] truncate" style={{ color: T.subtext }}>
                {activePlan
                  ? (activePlan.task.length > 24 ? activePlan.task.slice(0, 24) + '…' : activePlan.task)
                  : 'Select a plan'}
              </p>
              <motion.span
                className="text-[10px] shrink-0"
                style={{ color: T.muted }}
                animate={{ rotate: planPickerOpen ? 180 : 0 }}
              >
                ▾
              </motion.span>
            </motion.button>

            <AnimatePresence>
              {planPickerOpen && (
                <motion.div
                  className="mt-[4px] rounded-[10px] overflow-hidden"
                  style={{ background: T.cardBg, border: `1px solid ${T.cardBorder}` }}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {[...plans].reverse().map(plan => (
                    <motion.button
                      key={plan.id}
                      className="w-full text-left px-[12px] py-[8px] text-[12px] truncate"
                      style={{
                        color:      activePlanId === plan.id ? T.accent : T.muted,
                        fontWeight: activePlanId === plan.id ? 600 : 400,
                        background: activePlanId === plan.id ? T.activeNavBg : 'transparent',
                      }}
                      whileHover={{ background: T.navHover }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => { setActivePlanId(plan.id); setPlanPickerOpen(false); }}
                    >
                      {plan.task.length > 28 ? plan.task.slice(0, 28) + '…' : plan.task}
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Task list */}
        <div
          className="flex-1 overflow-y-auto px-[14px] pb-[12px]"
          style={{ scrollbarWidth: 'none' }}
        >
          {!activePlan ? (
            <div className="flex flex-col items-center justify-center h-full gap-[10px] px-[8px]">
              <motion.div
                className="text-[36px] opacity-20"
                animate={{ opacity: [0.15, 0.28, 0.15] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              >
                ✦
              </motion.div>
              <p className="text-[12px] text-center leading-relaxed" style={{ color: T.muted }}>
                Create a plan in AI Companion to see your tasks here
              </p>
              <motion.button
                className="px-[14px] py-[7px] rounded-[20px] text-[12px] font-semibold mt-[4px]"
                style={{
                  background: T.activeNavBg,
                  color:      T.accent,
                  border:     `1px solid ${T.accent}33`,
                }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => onNavigate('ai')}
              >
                Open AI Companion →
              </motion.button>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={activePlanId ?? 'none'}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22 }}
                className="space-y-[14px] pt-[2px]"
              >
                {tasksByCol.map(({ col, tasks }) => (
                  <div key={col}>
                    {/* Column header */}
                    <div className="flex items-center gap-[6px] mb-[6px]">
                      <div
                        className="size-[6px] rounded-full shrink-0"
                        style={{ backgroundColor: COL_COLOR[col] }}
                      />
                      <p
                        className="text-[10px] tracking-widest uppercase font-semibold"
                        style={{ color: T.muted }}
                      >
                        {COL_LABEL[col]}
                      </p>
                      <p className="text-[10px] ml-auto shrink-0" style={{ color: T.muted }}>
                        {tasks.filter(t => t.completed).length}/{tasks.length}
                      </p>
                    </div>

                    {/* Tasks */}
                    <div className="space-y-[4px]">
                      <AnimatePresence>
                        {tasks.map(task => (
                          <motion.div
                            key={task.id}
                            layout
                            initial={{ opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.18 }}
                          >
                            <TaskRow task={task} onToggle={() => handleToggle(task.id)} T={T} />
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          )}
        </div>

        {/* Progress footer */}
        {activePlan && total > 0 && (
          <div
            className="px-[18px] py-[14px] shrink-0"
            style={{ borderTop: `1px solid ${T.border}` }}
          >
            <div className="flex justify-between items-center mb-[7px]">
              <p className="text-[11px]" style={{ color: T.muted }}>Overall progress</p>
              <p className="text-[11px] font-semibold" style={{ color: T.accentGold }}>{pct}%</p>
            </div>
            <div className="h-[5px] rounded-full overflow-hidden" style={{ backgroundColor: T.progressBg }}>
              <motion.div
                className="h-full rounded-full"
                style={{ background: 'linear-gradient(to right, #d4af78, #c4a0e0)' }}
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              />
            </div>

            {/* Mini stats row */}
            <div className="flex gap-[8px] mt-[10px]">
              {(['do-now', 'this-week', 'plan-ahead'] as KanbanColumn[]).map(col => {
                const colTasks = activePlan.tasks.filter(t => t.column === col);
                const colDone  = colTasks.filter(t => t.completed).length;
                if (colTasks.length === 0) return null;
                return (
                  <div
                    key={col}
                    className="flex-1 rounded-[8px] px-[8px] py-[6px] text-center"
                    style={{ background: COL_COLOR[col] + '14', border: `1px solid ${COL_COLOR[col]}28` }}
                  >
                    <p className="text-[13px] font-bold" style={{ color: COL_COLOR[col] }}>
                      {colDone}/{colTasks.length}
                    </p>
                    <p className="text-[9px] mt-[1px]" style={{ color: T.muted }}>
                      {col === 'do-now' ? 'Now' : col === 'this-week' ? 'Week' : 'Ahead'}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}
