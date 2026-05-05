import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Starfield, NebulaGlow } from './CosmicElements';
import type { ActionPlan } from '../types';
import { supabase } from '@/app/lib/supabase';
import type { User } from '@supabase/supabase-js';
import { useTheme } from '../context/ThemeContext';

// ─── Column metadata ──────────────────────────────────────────────────────────

const COL_META: Record<string, { label: string; color: string }> = {
  'do-now':     { label: 'Do Now',     color: '#88c8a8' },
  'this-week':  { label: 'This Week',  color: '#d4af78' },
  'plan-ahead': { label: 'Plan Ahead', color: '#c4a0e0' },
};

// ─── Mood display helpers ─────────────────────────────────────────────────────

const MOOD_EMOJI: Record<string, string> = {
  Drained: '😴', Heavy: '😔', Anxious: '😰', Meh: '😑',
  Neutral: '😐', 'Okay-ish': '😅', Good: '😊', Grateful: '✨',
};
const MOOD_COLOR: Record<string, string> = {
  Drained: '#8888a0', Heavy: '#8888a0', Anxious: '#a0b8e0',
  Meh: '#8888a0', Neutral: '#8888a0',
  'Okay-ish': '#d4af78', Good: '#88c8a8', Grateful: '#d4af78',
};

// ─── Nav icon ─────────────────────────────────────────────────────────────────

function NavIcon({ type, active, onClick }: any) {
  const icons: any = {
    today:   <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="3" y="4" width="14" height="13" rx="2" stroke={active ? '#d4af78' : '#8888a0'} strokeWidth="1.5"/><path d="M3 8h14" stroke={active ? '#d4af78' : '#8888a0'} strokeWidth="1.5"/><path d="M7 2v3M13 2v3" stroke={active ? '#d4af78' : '#8888a0'} strokeWidth="1.5" strokeLinecap="round"/></svg>,
    sky:     <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 2l2.4 7.2h7.6l-6.2 4.5 2.4 7.3-6.2-4.5-6.2 4.5 2.4-7.3-6.2-4.5h7.6z" fill={active ? '#d4af78' : '#8888a0'}/></svg>,
    ai:      <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="7" stroke={active ? '#c4a0e0' : '#8888a0'} strokeWidth="1.5"/><path d="M7 9h6M7 11h6M7 13h4" stroke={active ? '#c4a0e0' : '#8888a0'} strokeWidth="1.5" strokeLinecap="round"/></svg>,
    profile: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="7" r="3" stroke="#8888a0" strokeWidth="1.5"/><path d="M4 17c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="#8888a0" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  };
  return (
    <motion.button className="flex flex-col gap-[6px] items-center w-[60px] cursor-pointer" whileTap={{ scale: 0.9 }} onClick={onClick}>
      {icons[type]}
      <p className={`text-[12px] ${active ? 'text-[#d4af78] font-medium' : 'text-[#8888a0] font-normal'}`}>
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </p>
    </motion.button>
  );
}

// ─── Task row ─────────────────────────────────────────────────────────────────

function TaskRow({
  task,
  planName,
  onToggle,
  taskBg,
  taskBorder,
  taskBgDone,
  textPrimary,
  textMuted,
}: {
  task: { id: string; text: string; timeLabel: string; column: string; completed: boolean };
  planName: string;
  onToggle: () => void;
  taskBg: string;
  taskBorder: string;
  taskBgDone: string;
  textPrimary: string;
  textMuted: string;
}) {
  const col = COL_META[task.column] ?? COL_META['this-week'];
  const [leaving, setLeaving] = useState(false);

  const handleToggle = () => {
    if (task.completed) { onToggle(); return; }
    setLeaving(true);
    setTimeout(onToggle, 360);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: leaving ? 0 : 1, y: 0, scale: leaving ? 0.97 : 1 }}
      exit={{ opacity: 0, height: 0, marginBottom: 0 }}
      transition={{ duration: 0.26 }}
      className="flex items-center gap-[10px] px-[12px] py-[10px] rounded-[12px]"
      style={{
        background: task.completed ? taskBgDone : taskBg,
        border: `1px solid ${task.completed ? taskBgDone : taskBorder}`,
      }}
    >
      <motion.button
        className="shrink-0 size-[20px] rounded-full border-[1.5px] flex items-center justify-center cursor-pointer"
        style={{
          borderColor: task.completed ? col.color : '#3a3a4a',
          background:  task.completed ? col.color + '33' : 'transparent',
        }}
        whileTap={{ scale: 0.78 }}
        onClick={handleToggle}
      >
        <AnimatePresence>
          {task.completed && (
            <motion.span
              className="text-[10px] font-bold"
              style={{ color: col.color }}
              initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
              transition={{ duration: 0.16 }}
            >✓</motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      <div className="flex-1 min-w-0">
        <p
          className="text-[13px] font-medium leading-snug"
          style={{
            color: task.completed ? textMuted : textPrimary,
            textDecoration: task.completed ? 'line-through' : 'none',
          }}
        >
          {task.text}
        </p>
        <div className="flex items-center gap-[5px] mt-[2px]">
          <p className="text-[11px]" style={{ color: textMuted }}>⏱ {task.timeLabel}</p>
          <p className="text-[11px]" style={{ color: col.color + 'aa' }}>
            · {planName.length > 20 ? planName.slice(0, 20) + '…' : planName}
          </p>
        </div>
      </div>

      <div className="shrink-0 size-[6px] rounded-full" style={{ background: col.color, opacity: task.completed ? 0.3 : 0.75 }} />
    </motion.div>
  );
}

// ─── Main screen ──────────────────────────────────────────────────────────────

export default function TodayScreen({
  onNavigate,
  aiPlans,
  setAiPlans,
  userMood,
  userEnergy,
  user,
}: {
  onNavigate: (screen: string) => void;
  aiPlans?: ActionPlan[];
  setAiPlans?: React.Dispatch<React.SetStateAction<ActionPlan[]>>;
  userMood?: string | null;
  userEnergy?: number;
  user?: User | null;
}) {
  const { isDark } = useTheme();
  const [doneAnyway, setDoneAnyway] = useState(false);

  // ── Theme tokens ────────────────────────────────────────────────────────────
  const card      = isDark ? '#0b0a18'               : '#ffffff';
  const cardBorder= isDark ? '#333333'               : 'rgba(0,0,0,0.10)';
  const chipBg    = isDark ? '#0b0a18'               : '#f5f0e8';
  const chipBorder= isDark ? '#333333'               : 'rgba(0,0,0,0.10)';
  const calInactive= isDark ? '#0b0a18'              : '#f5f0e8';
  const calBorder = isDark ? '#222222'               : 'rgba(0,0,0,0.10)';
  const divider   = isDark ? '#333333'               : 'rgba(0,0,0,0.08)';
  const textPrimary= isDark ? '#f0e6cc'              : '#1a1a2e';
  const textMuted = isDark ? '#888888'               : '#6b6b80';
  const screenBg  = isDark ? '#08080f'               : '#f4f0e8';
  const taskBg    = isDark ? 'rgba(255,255,255,0.04)': 'rgba(0,0,0,0.04)';
  const taskBorder= isDark ? 'rgba(255,255,255,0.08)': 'rgba(0,0,0,0.08)';
  const taskBgDone= isDark ? 'rgba(255,255,255,0.02)': 'rgba(0,0,0,0.02)';
  const progressBg= isDark ? '#1a1a2a'               : 'rgba(0,0,0,0.08)';

  const plans: ActionPlan[] = Array.isArray(aiPlans) ? aiPlans : [];

  // Flat task list across all plans
  type FlatTask = {
    id: string; text: string; timeLabel: string;
    column: string; completed: boolean;
    planId: string; planName: string;
  };
  const allTasks: FlatTask[] = plans.flatMap(plan =>
    plan.tasks.map(t => ({
      id: t.id, text: t.text, timeLabel: t.timeLabel,
      column: t.column, completed: t.completed,
      planId: plan.id, planName: plan.task,
    }))
  );
  const doNowTasks     = allTasks.filter(t => t.column === 'do-now');
  const thisWeekTasks  = allTasks.filter(t => t.column === 'this-week');
  const planAheadTasks = allTasks.filter(t => t.column === 'plan-ahead');
  const totalTasks     = allTasks.length;
  const completedCount = allTasks.filter(t => t.completed).length;
  const pct            = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;

  const today   = new Date();
  const dateStr = today.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

  // Build this-week calendar days (Mon–Sun of current week, highlight today)
  const todayDate  = today.getDate();
  const dayOfWeek  = today.getDay(); // 0=Sun
  const startOfWeek = new Date(today);
  startOfWeek.setDate(todayDate - ((dayOfWeek + 6) % 7)); // Monday
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);
    return {
      day:    ['M','T','W','T','F','S','S'][i],
      date:   String(d.getDate()),
      active: d.toDateString() === today.toDateString(),
    };
  });

  const moodEmoji = userMood ? (MOOD_EMOJI[userMood] ?? null) : null;
  const moodColor = userMood ? (MOOD_COLOR[userMood] ?? '#8888a0') : '#8888a0';

  const handleDoneAnyway = () => {
    setDoneAnyway(true);
    setTimeout(() => onNavigate('sky'), 900);
  };

  const handleToggle = (planId: string, taskId: string) => {
    if (!setAiPlans) return;
    setAiPlans(prev => prev.map(plan => {
      if (plan.id !== planId) return plan;
      const updatedTasks = plan.tasks.map(t =>
        t.id === taskId ? { ...t, completed: !t.completed } : t
      );
      const updated = { ...plan, tasks: updatedTasks };
      if (user?.id) {
        supabase.from('ai_plans').upsert({
          id:           updated.id,
          user_id:      user.id,
          task:         updated.task,
          tasks:        updated.tasks        as unknown as object,
          conversation: updated.conversation ?? [] as unknown as object,
          created_at:   updated.createdAt,
        });
      }
      return updated;
    }));
  };

  return (
    <div className="overflow-hidden relative rounded-[36px] size-full" style={{ background: screenBg }}>
      <Starfield density={30} />

      {/* Status bar */}
      <div className="absolute h-[44px] left-0 top-0 w-full z-10 bg-gradient-to-b from-[#08080f] to-transparent pointer-events-none" />
      <p className="absolute font-bold left-[13px] text-[#f0e6cc] text-[13px] top-[10px] z-10">9:41</p>
      <p className="absolute font-normal left-[317px] text-[#888888] text-[11px] top-[11px] z-10">▶ ▶▶ ▊▊</p>

      {/* Header */}
      <p className="absolute font-bold left-[17px] text-[24px] top-[55px]" style={{ color: textPrimary }}>Today</p>
      <p className="absolute font-normal right-[17px] text-[13px] top-[62px]" style={{ color: textMuted }}>{dateStr}</p>
      <div className="absolute h-[1px] left-[17px] right-[17px] top-[95px]" style={{ background: `linear-gradient(to right, transparent, ${divider}, transparent)` }} />

      {/* ── Scrollable content ─────────────────────────────────────────────── */}
      <div
        className="absolute left-0 right-0 top-[103px] bottom-[90px] overflow-y-auto"
        style={{ scrollbarWidth: 'none' }}
      >
        <div className="px-[17px] pt-[8px] pb-[24px]">

          {/* Mood banner (only when check-in done) */}
          {moodEmoji && (
            <motion.div
              className="flex items-center gap-[10px] rounded-[14px] px-[13px] py-[9px] mb-[12px]"
              style={{ background: `${moodColor}10`, border: `1px solid ${moodColor}25` }}
              initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <p className="text-[18px] leading-none">{moodEmoji}</p>
              <p className="text-[13px] font-semibold flex-1" style={{ color: moodColor }}>
                Feeling {userMood}
              </p>
              {userEnergy !== undefined && (
                <div className="flex items-center gap-[5px]">
                  <div className="w-[48px] h-[3px] rounded-full bg-[#1a1a2a] overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: moodColor }}
                      initial={{ width: 0 }}
                      animate={{ width: `${userEnergy}%` }}
                      transition={{ duration: 0.7, ease: 'easeOut' }}
                    />
                  </div>
                  <p className="text-[10px] text-[#555568]">⚡{userEnergy}%</p>
                </div>
              )}
            </motion.div>
          )}

          {/* ── Daily Prompt Card ── */}
          <NebulaGlow color="gold" className="w-[250px] h-[200px] left-[70px] top-[100px] absolute pointer-events-none" />

          <motion.div
            className="rounded-[16px] mb-[16px] cursor-pointer overflow-hidden"
            style={{ height: 160, background: card, border: `1px solid ${cardBorder}`, boxShadow: '0 4px 24px rgba(0,0,0,0.15)' }}
            whileHover={{ scale: 1.01, borderColor: '#d4af78' }}
            whileTap={{ scale: 0.99 }}
            onClick={() => onNavigate('respond')}
          >
            <div className="absolute h-[4px] left-0 top-0 w-full bg-gradient-to-r from-[#d4af78] via-[#d4af78] to-transparent" />
            <div className="px-[16px] pt-[20px]">
              <p className="font-bold text-[12px] tracking-wider mb-[10px]" style={{ color: textMuted }}>DAILY PROMPT</p>
              <p className="font-medium text-[16px] leading-[1.4] mb-[14px]" style={{ color: textPrimary }}>
                {`"What's one thing you've been`}{'\n'}{`putting off because of fear?"`}
              </p>
              <div className="h-[1px] mb-[10px]" style={{ background: cardBorder }} />
              <div className="flex items-center justify-between">
                <p className="text-[11px]" style={{ color: textMuted }}>✦  Reflect  ·  Take action  ·  Share</p>
                <AnimatePresence mode="wait">
                  {!doneAnyway ? (
                    <motion.button
                      key="btn"
                      className="cursor-pointer"
                      whileTap={{ scale: 0.9 }}
                      onClick={e => { e.stopPropagation(); handleDoneAnyway(); }}
                      exit={{ opacity: 0, scale: 0.8 }}
                    >
                      <p className="text-[#555568] text-[11px]">I did it anyway ✦</p>
                    </motion.button>
                  ) : (
                    <motion.div
                      key="star"
                      className="flex items-center gap-[4px]"
                      initial={{ opacity: 0, scale: 0.6 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                    >
                      <motion.p
                        className="text-[#d4af78] text-[16px]"
                        animate={{ rotate: [0, 20, -20, 10, 0], scale: [1, 1.4, 1] }}
                        transition={{ duration: 0.6 }}
                      >✦</motion.p>
                      <p className="text-[#d4af78] text-[11px] font-medium">Star added!</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>

          {/* ── Focus Areas ── */}
          <p className="font-bold text-[14px] mb-[8px]" style={{ color: textPrimary }}>Your Focus Areas</p>
          <div className="flex gap-[8px] flex-wrap mb-[16px]">
            {['Career', 'Creativity', 'Connection', 'Health'].map(area => (
              <div key={area} className="px-[12px] h-[30px] rounded-[15px] flex items-center" style={{ background: chipBg, border: `1px solid ${chipBorder}` }}>
                <p className="text-[12px]" style={{ color: textMuted }}>{area}</p>
              </div>
            ))}
          </div>

          {/* ── This Week Calendar ── */}
          <p className="font-bold text-[14px] mb-[8px]" style={{ color: textPrimary }}>This Week</p>
          <div className="flex gap-[8px] mb-[12px]">
            {weekDays.map((item, idx) => (
              <div
                key={idx}
                className="flex-1 h-[52px] rounded-[10px] flex flex-col items-center justify-center border"
                style={{
                  background:  item.active ? '#d4af78' : calInactive,
                  borderColor: item.active ? '#d4af78' : calBorder,
                  boxShadow:   item.active ? '0 0 16px rgba(212,175,120,0.3)' : 'none',
                }}
              >
                <p className="text-[11px]" style={{ color: item.active ? '#08080f' : textMuted }}>{item.day}</p>
                <p className="text-[13px] font-bold mt-[2px]" style={{ color: item.active ? '#08080f' : textPrimary }}>{item.date}</p>
              </div>
            ))}
          </div>

          {/* ── Streak banner ── */}
          <div className="h-[44px] rounded-[10px] flex items-center px-[16px] mb-[16px]" style={{ background: card, border: `1px solid ${cardBorder}` }}>
            <p className="text-[13px]" style={{ color: textPrimary }}>
              🔥 <span className="text-[#d4af78]">7-day streak</span> · Keep it going!
            </p>
          </div>

          {/* ── AI Task List ── */}
          {totalTasks > 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>

              {/* Section heading + progress */}
              <div className="flex items-center justify-between mb-[10px]">
                <p className="font-bold text-[14px]" style={{ color: textPrimary }}>Your Action Tasks</p>
                <p className="text-[11px]" style={{ color: textMuted }}>{completedCount}/{totalTasks} done</p>
              </div>

              {/* Progress bar */}
              <div className="h-[3px] rounded-full overflow-hidden mb-[12px]" style={{ background: progressBg }}>
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: 'linear-gradient(to right, #88c8a8, #d4af78, #c4a0e0)' }}
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                />
              </div>

              {/* Do Now */}
              {doNowTasks.length > 0 && (
                <div className="mb-[12px]">
                  <div className="flex items-center gap-[6px] mb-[6px]">
                    <div className="size-[5px] rounded-full bg-[#88c8a8]" />
                    <p className="text-[10px] tracking-[0.12em] uppercase font-semibold text-[#88c8a8]">Do Now</p>
                    <div className="flex-1 h-[1px] bg-[#88c8a822]" />
                  </div>
                  <div className="space-y-[5px]">
                    <AnimatePresence>
                      {doNowTasks.map(t => (
                        <TaskRow key={`${t.planId}-${t.id}`} task={t} planName={t.planName} onToggle={() => handleToggle(t.planId, t.id)} taskBg={taskBg} taskBorder={taskBorder} taskBgDone={taskBgDone} textPrimary={textPrimary} textMuted={textMuted} />
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              )}

              {/* This Week */}
              {thisWeekTasks.length > 0 && (
                <div className="mb-[12px]">
                  <div className="flex items-center gap-[6px] mb-[6px]">
                    <div className="size-[5px] rounded-full bg-[#d4af78]" />
                    <p className="text-[10px] tracking-[0.12em] uppercase font-semibold text-[#d4af78]">This Week</p>
                    <div className="flex-1 h-[1px] bg-[#d4af7822]" />
                  </div>
                  <div className="space-y-[5px]">
                    <AnimatePresence>
                      {thisWeekTasks.map(t => (
                        <TaskRow key={`${t.planId}-${t.id}`} task={t} planName={t.planName} onToggle={() => handleToggle(t.planId, t.id)} taskBg={taskBg} taskBorder={taskBorder} taskBgDone={taskBgDone} textPrimary={textPrimary} textMuted={textMuted} />
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              )}

              {/* Plan Ahead */}
              {planAheadTasks.length > 0 && (
                <div className="mb-[12px]">
                  <div className="flex items-center gap-[6px] mb-[6px]">
                    <div className="size-[5px] rounded-full bg-[#c4a0e0]" />
                    <p className="text-[10px] tracking-[0.12em] uppercase font-semibold text-[#c4a0e0]">Plan Ahead</p>
                    <div className="flex-1 h-[1px] bg-[#c4a0e022]" />
                  </div>
                  <div className="space-y-[5px]">
                    <AnimatePresence>
                      {planAheadTasks.map(t => (
                        <TaskRow key={`${t.planId}-${t.id}`} task={t} planName={t.planName} onToggle={() => handleToggle(t.planId, t.id)} taskBg={taskBg} taskBorder={taskBorder} taskBgDone={taskBgDone} textPrimary={textPrimary} textMuted={textMuted} />
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* ── Quick actions ── */}
          <div className="flex gap-[10px] mt-[4px]">
            <motion.button
              className="px-[16px] h-[36px] rounded-[18px] flex items-center cursor-pointer"
              style={{ background: card, border: `1px solid ${chipBorder}` }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onNavigate('ai')}
            >
              <p className="text-[#c4a0e0] text-[12px]">✦ Ask AI</p>
            </motion.button>
            {totalTasks === 0 && (
              <motion.button
                className="px-[16px] h-[36px] rounded-[18px] flex items-center cursor-pointer"
                style={{ background: card, border: `1px solid ${chipBorder}` }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onNavigate('ai')}
              >
                <p className="text-[#d4af78] text-[12px]">✦ Create a plan</p>
              </motion.button>
            )}
          </div>

        </div>
      </div>

      {/* Bottom nav */}
      <div className="absolute flex gap-[31px] h-[90px] items-center justify-center left-0 bottom-0 w-full border-t" style={{ background: card, borderColor: cardBorder }}>
        <NavIcon type="today"   active={true}  onClick={() => onNavigate('today')}   />
        <NavIcon type="sky"     active={false} onClick={() => onNavigate('sky')}     />
        <NavIcon type="ai"      active={false} onClick={() => onNavigate('ai')}      />
        <NavIcon type="profile" active={false} onClick={() => onNavigate('profile')} />
      </div>
      <div className="absolute bg-[#333333] h-[4px] left-[142px] rounded-[2px] bottom-[8px] w-[100px]" />
    </div>
  );
}
