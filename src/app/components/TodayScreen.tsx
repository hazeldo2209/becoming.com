import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Starfield, NebulaGlow } from './CosmicElements';
import type { ActionPlan } from '../types';
import { supabase } from '@/app/lib/supabase';
import type { User } from '@supabase/supabase-js';

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
    today: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="3" y="4" width="14" height="13" rx="2" stroke={active ? '#d4af78' : '#8888a0'} strokeWidth="1.5"/><path d="M3 8h14" stroke={active ? '#d4af78' : '#8888a0'} strokeWidth="1.5"/><path d="M7 2v3M13 2v3" stroke={active ? '#d4af78' : '#8888a0'} strokeWidth="1.5" strokeLinecap="round"/></svg>,
    sky:   <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 2l2.4 7.2h7.6l-6.2 4.5 2.4 7.3-6.2-4.5-6.2 4.5 2.4-7.3-6.2-4.5h7.6z" fill={active ? '#d4af78' : '#8888a0'}/></svg>,
    ai:    <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="7" stroke={active ? '#c4a0e0' : '#8888a0'} strokeWidth="1.5"/><path d="M7 9h6M7 11h6M7 13h4" stroke={active ? '#c4a0e0' : '#8888a0'} strokeWidth="1.5" strokeLinecap="round"/></svg>,
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
}: {
  task: { id: string; text: string; timeLabel: string; column: string; completed: boolean };
  planName: string;
  onToggle: () => void;
}) {
  const col   = COL_META[task.column] ?? COL_META['this-week'];
  const [leaving, setLeaving] = useState(false);

  const handleToggle = () => {
    if (task.completed) { onToggle(); return; }
    // Tiny delay so the check appears before the row animates out
    setLeaving(true);
    setTimeout(onToggle, 380);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: leaving ? 0 : 1, y: 0, scale: leaving ? 0.97 : 1 }}
      exit={{ opacity: 0, height: 0, marginBottom: 0, paddingTop: 0, paddingBottom: 0 }}
      transition={{ duration: 0.28 }}
      className="flex items-center gap-[12px] px-[14px] py-[12px] rounded-[14px]"
      style={{
        background: task.completed ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.04)',
        border: `1px solid ${task.completed ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.08)'}`,
      }}
    >
      {/* Checkbox */}
      <motion.button
        className="shrink-0 size-[22px] rounded-full border-[1.5px] flex items-center justify-center cursor-pointer"
        style={{
          borderColor: task.completed ? col.color : '#3a3a4a',
          background:  task.completed ? col.color + '33' : 'transparent',
        }}
        whileTap={{ scale: 0.80 }}
        onClick={handleToggle}
      >
        <AnimatePresence>
          {task.completed && (
            <motion.span
              className="text-[11px] font-bold"
              style={{ color: col.color }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.18 }}
            >✓</motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <p
          className="text-[13px] font-medium leading-snug"
          style={{
            color: task.completed ? '#555568' : '#e8e0d0',
            textDecoration: task.completed ? 'line-through' : 'none',
          }}
        >
          {task.text}
        </p>
        <div className="flex items-center gap-[6px] mt-[3px]">
          <p className="text-[11px] text-[#555568]">⏱ {task.timeLabel}</p>
          <p className="text-[11px]" style={{ color: col.color + 'aa' }}>
            · {planName.length > 22 ? planName.slice(0, 22) + '…' : planName}
          </p>
        </div>
      </div>

      {/* Column dot */}
      <div
        className="shrink-0 size-[7px] rounded-full mt-[1px]"
        style={{ background: col.color, opacity: task.completed ? 0.3 : 0.8 }}
      />
    </motion.div>
  );
}

// ─── Section header ───────────────────────────────────────────────────────────

function SectionHeader({ label, color, count }: { label: string; color: string; count: number }) {
  return (
    <div className="flex items-center gap-[8px] mb-[8px] mt-[4px]">
      <div className="size-[6px] rounded-full" style={{ background: color }} />
      <p className="text-[11px] tracking-[0.12em] uppercase font-semibold" style={{ color }}>
        {label}
      </p>
      <p className="text-[11px] text-[#444458]">({count})</p>
      <div className="flex-1 h-[1px]" style={{ background: color + '22' }} />
    </div>
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
  const plans: ActionPlan[] = Array.isArray(aiPlans) ? aiPlans : [];

  // ── Build flat task list from all plans ──────────────────────────────────
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

  const doNowTasks    = allTasks.filter(t => t.column === 'do-now');
  const thisWeekTasks = allTasks.filter(t => t.column === 'this-week');
  const planAheadTasks = allTasks.filter(t => t.column === 'plan-ahead');

  const totalTasks     = allTasks.length;
  const completedCount = allTasks.filter(t => t.completed).length;
  const pct            = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;

  const today = new Date();
  const dateStr = today.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

  // ── Toggle task completion ───────────────────────────────────────────────
  const handleToggle = (planId: string, taskId: string) => {
    if (!setAiPlans) return;
    setAiPlans(prev => prev.map(plan => {
      if (plan.id !== planId) return plan;
      const updatedTasks = plan.tasks.map(t =>
        t.id === taskId ? { ...t, completed: !t.completed } : t
      );
      const updated = { ...plan, tasks: updatedTasks };
      // Sync to Supabase in background
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

  const moodEmoji = userMood ? (MOOD_EMOJI[userMood] ?? '✦') : null;
  const moodColor = userMood ? (MOOD_COLOR[userMood] ?? '#8888a0') : '#8888a0';

  return (
    <div className="bg-[#08080f] overflow-hidden relative rounded-[36px] size-full">
      <Starfield density={28} />
      <NebulaGlow color="gold" className="w-[260px] h-[200px] left-[60px] top-[80px]" />

      {/* Status bar */}
      <div className="absolute h-[44px] left-0 top-0 w-full z-10 bg-gradient-to-b from-[#08080f] to-transparent pointer-events-none" />
      <p className="absolute font-bold left-[13px] text-[#f0e6cc] text-[13px] top-[10px] z-10">9:41</p>

      {/* Header */}
      <div className="absolute left-[17px] right-[17px] top-[50px] flex items-center justify-between z-10">
        <p className="font-bold text-[#f0e6cc] text-[26px] leading-tight">Today</p>
        <p className="text-[#555568] text-[13px]">{dateStr}</p>
      </div>

      <div className="absolute h-[1px] left-[17px] right-[17px] top-[92px] bg-gradient-to-r from-transparent via-[#2a2a3a] to-transparent z-10" />

      {/* ── Scrollable content ──────────────────────────────────────────────── */}
      <div
        className="absolute left-0 right-0 top-[100px] bottom-[90px] overflow-y-auto px-[17px] pt-[12px] pb-[24px]"
        style={{ scrollbarWidth: 'none' }}
      >

        {/* Mood / energy banner */}
        {moodEmoji && (
          <motion.div
            className="flex items-center gap-[10px] rounded-[14px] px-[14px] py-[10px] mb-[16px]"
            style={{
              background: `${moodColor}12`,
              border: `1px solid ${moodColor}28`,
            }}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <p className="text-[20px] leading-none">{moodEmoji}</p>
            <div className="flex-1">
              <p className="text-[13px] font-semibold" style={{ color: moodColor }}>
                Feeling {userMood}
              </p>
              {userEnergy !== undefined && (
                <div className="flex items-center gap-[6px] mt-[4px]">
                  <div className="flex-1 h-[3px] rounded-full bg-[#1a1a2a] overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: moodColor }}
                      initial={{ width: 0 }}
                      animate={{ width: `${userEnergy}%` }}
                      transition={{ duration: 0.7, ease: 'easeOut' }}
                    />
                  </div>
                  <p className="text-[10px] text-[#555568] shrink-0">⚡ {userEnergy}%</p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* ── Empty state ── */}
        {totalTasks === 0 && (
          <motion.div
            className="flex flex-col items-center justify-center pt-[40px] gap-[12px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <motion.p
              className="text-[48px] text-[#d4af78]"
              animate={{ opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              style={{ filter: 'drop-shadow(0 0 18px rgba(212,175,120,0.5))' }}
            >✦</motion.p>
            <p className="font-bold text-[#f0e6cc] text-[18px] text-center leading-snug">
              No action plan yet
            </p>
            <p className="text-[#8888a0] text-[13px] text-center leading-relaxed max-w-[240px]">
              Ask AI to map out a goal and your tasks will appear here as stars.
            </p>
            <motion.button
              className="mt-[8px] h-[46px] px-[24px] rounded-[23px] flex items-center gap-[8px]"
              style={{
                background: 'rgba(196,160,224,0.15)',
                border: '1px solid rgba(196,160,224,0.40)',
                boxShadow: '0 0 20px rgba(196,160,224,0.12)',
              }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onNavigate('ai')}
            >
              <p className="text-[#c4a0e0] text-[14px] font-semibold">✦ Create a Constellation</p>
            </motion.button>
          </motion.div>
        )}

        {/* ── Task sections ── */}
        <AnimatePresence>
          {doNowTasks.length > 0 && (
            <motion.div
              key="do-now"
              className="mb-[20px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.05 }}
            >
              <SectionHeader label="Do Now" color={COL_META['do-now'].color} count={doNowTasks.filter(t => !t.completed).length} />
              <div className="space-y-[6px]">
                <AnimatePresence>
                  {doNowTasks.map(task => (
                    <TaskRow
                      key={`${task.planId}-${task.id}`}
                      task={task}
                      planName={task.planName}
                      onToggle={() => handleToggle(task.planId, task.id)}
                    />
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>
          )}

          {thisWeekTasks.length > 0 && (
            <motion.div
              key="this-week"
              className="mb-[20px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <SectionHeader label="This Week" color={COL_META['this-week'].color} count={thisWeekTasks.filter(t => !t.completed).length} />
              <div className="space-y-[6px]">
                <AnimatePresence>
                  {thisWeekTasks.map(task => (
                    <TaskRow
                      key={`${task.planId}-${task.id}`}
                      task={task}
                      planName={task.planName}
                      onToggle={() => handleToggle(task.planId, task.id)}
                    />
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>
          )}

          {planAheadTasks.length > 0 && (
            <motion.div
              key="plan-ahead"
              className="mb-[20px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15 }}
            >
              <SectionHeader label="Plan Ahead" color={COL_META['plan-ahead'].color} count={planAheadTasks.filter(t => !t.completed).length} />
              <div className="space-y-[6px]">
                <AnimatePresence>
                  {planAheadTasks.map(task => (
                    <TaskRow
                      key={`${task.planId}-${task.id}`}
                      task={task}
                      planName={task.planName}
                      onToggle={() => handleToggle(task.planId, task.id)}
                    />
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Progress summary ── */}
        {totalTasks > 0 && (
          <motion.div
            className="rounded-[16px] px-[16px] py-[14px] mb-[16px]"
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.07)',
            }}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center justify-between mb-[8px]">
              <p className="text-[12px] font-semibold text-[#f0e6cc]">
                Overall Progress
              </p>
              <p className="text-[12px] text-[#555568]">
                {completedCount}/{totalTasks} · {pct}%
              </p>
            </div>
            <div className="h-[4px] rounded-full bg-[#1a1a2a] overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ background: 'linear-gradient(to right, #88c8a8, #d4af78, #c4a0e0)' }}
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
              />
            </div>
            <p className="text-[11px] text-[#444458] mt-[6px]">
              across {plans.length} constellation{plans.length !== 1 ? 's' : ''}
            </p>
          </motion.div>
        )}

        {/* ── Quick actions ── */}
        {totalTasks > 0 && (
          <div className="flex gap-[10px]">
            <motion.button
              className="flex-1 h-[40px] rounded-[14px] flex items-center justify-center gap-[6px]"
              style={{
                background: 'rgba(196,160,224,0.10)',
                border: '1px solid rgba(196,160,224,0.28)',
              }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onNavigate('ai')}
            >
              <p className="text-[#c4a0e0] text-[13px] font-medium">✦ Ask AI</p>
            </motion.button>
            <motion.button
              className="flex-1 h-[40px] rounded-[14px] flex items-center justify-center gap-[6px]"
              style={{
                background: 'rgba(212,175,120,0.10)',
                border: '1px solid rgba(212,175,120,0.28)',
              }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onNavigate('sky')}
            >
              <p className="text-[#d4af78] text-[13px] font-medium">✦ View Sky</p>
            </motion.button>
          </div>
        )}
      </div>

      {/* Bottom nav */}
      <div className="absolute bg-[#0b0a18] border-t border-[#1a1a1a] flex gap-[31px] h-[90px] items-center justify-center left-0 bottom-0 w-full">
        <NavIcon type="today"   active={true}  onClick={() => onNavigate('today')}   />
        <NavIcon type="sky"     active={false} onClick={() => onNavigate('sky')}     />
        <NavIcon type="ai"      active={false} onClick={() => onNavigate('ai')}      />
        <NavIcon type="profile" active={false} onClick={() => onNavigate('profile')} />
      </div>
      <div className="absolute bg-[#333333] h-[4px] left-[142px] rounded-[2px] bottom-[8px] w-[100px]" />
    </div>
  );
}
