import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Starfield, NebulaGlow } from './CosmicElements';
import KanbanBoard from './KanbanBoard';
import ConstellationPlan, { COL_META, STAR_PATH } from './ConstellationPlan';
import type { KanbanTask, ActionPlan, ChatMessage } from '../types';
import { useTheme } from '../context/ThemeContext';
import { supabase } from '@/app/lib/supabase';
import type { User } from '@supabase/supabase-js';

// ─── Constants ────────────────────────────────────────────────────────────────

const CLAIMED_COLOR = '#f0e6cc';
const CLAIMED_GLOW  = 'rgba(240,230,204,0.95)';

// Mood-aware welcome message
function getMoodWelcome(mood?: string | null): ChatMessage {
  const lowMoods = ['Drained', 'Heavy', 'Anxious'];
  const midMoods = ['Meh', 'Neutral', 'Okay-ish'];
  if (mood && lowMoods.includes(mood)) {
    return { type: 'ai', text: "Hey — today sounds heavy, and that's okay. Let's start really small. What's one tiny thing you'd like to nudge forward?" };
  }
  if (mood && midMoods.includes(mood)) {
    return { type: 'ai', text: "Hi! Sometimes just a little progress is all we need. What's something you'd like to move forward on today?" };
  }
  return { type: 'ai', text: "Hi! I'm here to help you take action on what matters to you. What's something you'd like to work on?" };
}

// ─── Satellite positions (fullscreen zoom canvas, 300×300) ───────────────────

const FULL_SAT = [
  { x: 75,  y: 55  },
  { x: 225, y: 55  },
  { x: 150, y: 255 },
];

// ─── API helpers ──────────────────────────────────────────────────────────────

async function buildPlanFromAI(userGoal: string, mood?: string | null, energy?: number): Promise<KanbanTask[]> {
  const res = await fetch('/api/plan', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ goal: userGoal, mood: mood ?? '', energy: energy ?? 50 }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(err.error ?? 'Failed to get plan');
  }
  return (await res.json()).tasks as KanbanTask[];
}

async function chatWithAI(
  planGoal: string,
  planTasks: KanbanTask[],
  history: ChatMessage[],
  message: string,
): Promise<string> {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ planGoal, planTasks, history, message }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(err.error ?? 'Failed to chat');
  }
  return (await res.json()).reply as string;
}

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
      <p className={`text-[12px] ${active ? 'text-[#c4a0e0] font-medium' : 'text-[#8888a0] font-normal'}`}>
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </p>
    </motion.button>
  );
}

// ─── Column accent colours for history items ──────────────────────────────────

const COL_CHIP: Record<string, string> = {
  'do-now': '#88c8a8', 'this-week': '#d4af78', 'plan-ahead': '#c4a0e0',
};
function planDominantColor(plan: ActionPlan): string {
  if (!plan.tasks.length) return '#d4af78';
  const cnt: Record<string, number> = {};
  plan.tasks.forEach(t => { cnt[t.column] = (cnt[t.column] ?? 0) + 1; });
  const top = Object.entries(cnt).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'this-week';
  return COL_CHIP[top] ?? '#d4af78';
}

// ─── Trash icon SVG ───────────────────────────────────────────────────────────

function TrashIcon({ color = '#e07070' }: { color?: string }) {
  return (
    <svg width="15" height="15" viewBox="0 0 20 20" fill="none">
      <path d="M8 2h4M3 5h14M6 5l1 12h6l1-12" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function PencilIcon({ color = '#c4a0e0' }: { color?: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
      <path d="M14.5 2.5a2.121 2.121 0 013 3L6 17H3v-3L14.5 2.5z"
        stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

// ─── History drawer ───────────────────────────────────────────────────────────

function HistoryDrawer({
  plans,
  activePlanId,
  onNewChat,
  onSelectPlan,
  onClose,
  onDeletePlan,
  onRenamePlan,
}: {
  plans: ActionPlan[];
  activePlanId: string | null;
  onNewChat: () => void;
  onSelectPlan: (id: string) => void;
  onClose: () => void;
  onDeletePlan: (id: string) => void;
  onRenamePlan: (id: string, newName: string) => void;
}) {
  const [isManaging, setIsManaging]         = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [editingId, setEditingId]           = useState<string | null>(null);
  const [editName, setEditName]             = useState('');

  const startEdit = (plan: ActionPlan) => {
    setEditingId(plan.id);
    setEditName(plan.task);
    setConfirmDeleteId(null);
  };
  const commitEdit = (id: string) => {
    const trimmed = editName.trim();
    if (trimmed) onRenamePlan(id, trimmed);
    setEditingId(null);
  };
  const exitManage = () => {
    setIsManaging(false);
    setConfirmDeleteId(null);
    setEditingId(null);
  };

  return (
    <>
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 z-[40]"
        style={{ background: 'rgba(4,4,12,0.65)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.22 }}
        onClick={onClose}
      />

      {/* Drawer panel */}
      <motion.div
        className="absolute top-0 left-0 bottom-0 z-[50] flex flex-col rounded-l-[36px] rounded-r-[24px] overflow-hidden"
        style={{
          width: 288,
          background: 'linear-gradient(160deg, #0d0b1e 0%, #09091a 100%)',
          borderRight: '1px solid rgba(196,160,224,0.14)',
          boxShadow: '6px 0 40px rgba(4,4,12,0.7)',
        }}
        initial={{ x: -288 }}
        animate={{ x: 0 }}
        exit={{ x: -288 }}
        transition={{ type: 'spring', stiffness: 380, damping: 36 }}
      >
        {/* ── Drawer header ── */}
        <div className="flex items-center justify-between px-[20px] pt-[56px] pb-[16px]">
          {isManaging ? (
            <motion.button
              className="flex items-center gap-[6px]"
              initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
              whileTap={{ scale: 0.92 }}
              onClick={exitManage}
            >
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                <path d="M13 4l-7 6 7 6" stroke="#c4a0e0" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <p className="text-[#c4a0e0] text-[14px] font-semibold">Done</p>
            </motion.button>
          ) : (
            <div className="flex items-center gap-[8px]">
              <p className="text-[18px]">✦</p>
              <p className="font-bold text-[#f0e6cc] text-[16px] tracking-tight">Becoming AI</p>
            </div>
          )}

          <motion.button
            className="size-[32px] rounded-full flex items-center justify-center"
            style={{ background: 'rgba(255,255,255,0.06)' }}
            whileTap={{ scale: 0.88 }}
            onClick={onClose}
          >
            <p className="text-[#8888a0] text-[16px] leading-none">✕</p>
          </motion.button>
        </div>

        {/* ── New Chat button (hidden in manage mode) ── */}
        <AnimatePresence>
          {!isManaging && (
            <motion.div
              className="px-[16px] pb-[16px]"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <motion.button
                className="w-full h-[44px] rounded-[14px] flex items-center gap-[10px] px-[14px]"
                style={{
                  background: 'rgba(196,160,224,0.13)',
                  border: '1px solid rgba(196,160,224,0.35)',
                }}
                whileHover={{ background: 'rgba(196,160,224,0.20)' }}
                whileTap={{ scale: 0.97 }}
                onClick={() => { onNewChat(); onClose(); }}
              >
                <PencilIcon />
                <p className="text-[#c4a0e0] text-[14px] font-semibold">New Chat</p>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Divider */}
        <div className="mx-[16px] h-[1px] bg-[#1e1e32] mb-[12px]" />

        {/* ── History list ── */}
        <div className="flex-1 overflow-y-auto px-[16px] pb-[20px]" style={{ scrollbarWidth: 'none' }}>
          {plans.length === 0 ? (
            <div className="flex flex-col items-center justify-center pt-[40px] gap-[10px]">
              <p className="text-[32px] opacity-30">✦</p>
              <p className="text-[#8888a0] text-[13px] text-center leading-relaxed">
                Your constellations will{'\n'}appear here
              </p>
            </div>
          ) : (
            <>
              {/* Section label + Manage toggle */}
              <div className="flex items-center justify-between mb-[10px] pl-[2px]">
                <p className="text-[11px] tracking-widest uppercase text-[#555568]">
                  {isManaging ? 'Manage Constellations' : 'My Constellations'}
                </p>
                {!isManaging && (
                  <motion.button
                    className="px-[8px] py-[3px] rounded-[8px]"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                    whileTap={{ scale: 0.92 }}
                    onClick={() => setIsManaging(true)}
                  >
                    <p className="text-[11px] text-[#8888a0]">Manage</p>
                  </motion.button>
                )}
              </div>

              <div className="space-y-[6px]">
                <AnimatePresence>
                  {[...plans].reverse().map(plan => {
                    const color    = planDominantColor(plan);
                    const done     = plan.tasks.filter(t => t.completed).length;
                    const total    = plan.tasks.length;
                    const pct      = total > 0 ? Math.round((done / total) * 100) : 0;
                    const isActive = plan.id === activePlanId;
                    const date     = new Date(plan.createdAt).toLocaleDateString('en-US', {
                      month: 'short', day: 'numeric',
                    });
                    const isConfirmingDelete = confirmDeleteId === plan.id;
                    const isEditing          = editingId === plan.id;

                    if (isManaging) {
                      // ── Manage row ──────────────────────────────────────────
                      return (
                        <motion.div
                          key={plan.id}
                          layout
                          initial={{ opacity: 0, x: -12 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -24, height: 0, marginBottom: 0 }}
                          transition={{ duration: 0.22 }}
                          className="rounded-[14px] px-[10px] py-[10px]"
                          style={{
                            background: isActive ? `${color}12` : 'rgba(255,255,255,0.03)',
                            border: `1px solid ${isActive ? color + '30' : 'rgba(255,255,255,0.06)'}`,
                          }}
                        >
                          {isConfirmingDelete ? (
                            /* Delete confirmation row */
                            <motion.div
                              className="flex flex-col gap-[8px]"
                              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                            >
                              <p className="text-[12px] text-[#e07070] leading-snug">
                                Remove "{plan.task.length > 28 ? plan.task.slice(0, 28) + '…' : plan.task}"?
                              </p>
                              <div className="flex gap-[8px]">
                                <motion.button
                                  className="flex-1 h-[30px] rounded-[8px] flex items-center justify-center"
                                  style={{ background: 'rgba(224,112,112,0.18)', border: '1px solid rgba(224,112,112,0.45)' }}
                                  whileTap={{ scale: 0.96 }}
                                  onClick={() => {
                                    onDeletePlan(plan.id);
                                    setConfirmDeleteId(null);
                                  }}
                                >
                                  <p className="text-[#e07070] text-[12px] font-semibold">Remove</p>
                                </motion.button>
                                <motion.button
                                  className="flex-1 h-[30px] rounded-[8px] flex items-center justify-center"
                                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.10)' }}
                                  whileTap={{ scale: 0.96 }}
                                  onClick={() => setConfirmDeleteId(null)}
                                >
                                  <p className="text-[#8888a0] text-[12px]">Cancel</p>
                                </motion.button>
                              </div>
                            </motion.div>
                          ) : (
                            /* Normal manage row */
                            <div className="flex items-center gap-[8px]">
                              {/* Rename pencil */}
                              <motion.button
                                className="shrink-0 size-[28px] rounded-[8px] flex items-center justify-center"
                                style={{ background: 'rgba(196,160,224,0.10)', border: '1px solid rgba(196,160,224,0.20)' }}
                                whileTap={{ scale: 0.88 }}
                                onClick={() => startEdit(plan)}
                              >
                                <PencilIcon />
                              </motion.button>

                              {/* Name / editable input */}
                              {isEditing ? (
                                <input
                                  autoFocus
                                  className="flex-1 bg-transparent outline-none text-[13px] text-[#f0e6cc] border-b border-[#c4a0e0] pb-[2px]"
                                  value={editName}
                                  onChange={e => setEditName(e.target.value)}
                                  onBlur={() => commitEdit(plan.id)}
                                  onKeyDown={e => {
                                    if (e.key === 'Enter') commitEdit(plan.id);
                                    if (e.key === 'Escape') setEditingId(null);
                                  }}
                                />
                              ) : (
                                <p
                                  className="flex-1 text-[13px] leading-snug"
                                  style={{
                                    color: isActive ? color : '#c8c8d8',
                                    display: '-webkit-box',
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden',
                                  }}
                                >
                                  {plan.task}
                                </p>
                              )}

                              {/* Delete trash */}
                              <motion.button
                                className="shrink-0 size-[28px] rounded-[8px] flex items-center justify-center"
                                style={{ background: 'rgba(224,112,112,0.08)', border: '1px solid rgba(224,112,112,0.18)' }}
                                whileTap={{ scale: 0.88 }}
                                onClick={() => { setConfirmDeleteId(plan.id); setEditingId(null); }}
                              >
                                <TrashIcon />
                              </motion.button>
                            </div>
                          )}

                          {/* Progress bar (compact) — hidden during confirm */}
                          {!isConfirmingDelete && !isEditing && (
                            <div className="flex items-center gap-[6px] mt-[6px]">
                              <div className="flex-1 h-[2px] rounded-full bg-[#1e1e32] overflow-hidden">
                                <div
                                  className="h-full rounded-full"
                                  style={{ backgroundColor: color, width: `${pct}%` }}
                                />
                              </div>
                              <p className="text-[10px] shrink-0 text-[#555568]">{done}/{total} · {date}</p>
                            </div>
                          )}
                        </motion.div>
                      );
                    }

                    // ── Normal (non-manage) plan row ──────────────────────────
                    return (
                      <motion.button
                        key={plan.id}
                        layout
                        className="w-full text-left rounded-[14px] px-[12px] py-[10px] flex flex-col gap-[6px]"
                        style={{
                          background: isActive ? `${color}14` : 'rgba(255,255,255,0.03)',
                          border: `1px solid ${isActive ? color + '40' : 'rgba(255,255,255,0.06)'}`,
                        }}
                        whileHover={{ background: isActive ? `${color}1e` : 'rgba(255,255,255,0.06)' }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => { onSelectPlan(plan.id); onClose(); }}
                      >
                        <p
                          className="text-[13px] font-medium leading-snug"
                          style={{
                            color: isActive ? color : '#c8c8d8',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                          }}
                        >
                          {plan.task}
                        </p>

                        <div className="flex items-center justify-between gap-[8px]">
                          <div className="flex-1 h-[3px] rounded-full bg-[#1e1e32] overflow-hidden">
                            <motion.div
                              className="h-full rounded-full"
                              style={{ backgroundColor: color, width: `${pct}%` }}
                              initial={{ width: 0 }}
                              animate={{ width: `${pct}%` }}
                              transition={{ duration: 0.6, ease: 'easeOut' }}
                            />
                          </div>
                          <p className="text-[11px] shrink-0" style={{ color: '#666680' }}>
                            {done}/{total} · {date}
                          </p>
                        </div>
                      </motion.button>
                    );
                  })}
                </AnimatePresence>
              </div>
            </>
          )}
        </div>

        {/* ── Manage footer hint (non-manage mode only) ── */}
        {!isManaging && plans.length > 0 && (
          <div className="px-[16px] pb-[20px]">
            <div className="h-[1px] bg-[#1e1e32] mb-[12px]" />
            <p className="text-[11px] text-[#444458] text-center">
              Constellations are saved to your account
            </p>
          </div>
        )}
      </motion.div>
    </>
  );
}

// ─── Fullscreen star zoom overlay ─────────────────────────────────────────────

function ZoomedStarOverlay({
  task, onClose, onToggleComplete,
}: {
  task: KanbanTask; onClose: () => void; onToggleComplete: () => void;
}) {
  const meta    = COL_META[task.column];
  const hasSats = task.effort === 'high' && !!task.substeps?.length;
  const sats    = task.substeps?.slice(0, 3) ?? [];

  return (
    <motion.div
      className="absolute inset-0 z-[60] overflow-hidden"
      style={{ background: 'radial-gradient(ellipse at 50% 38%, rgba(12,10,26,1) 0%, rgba(4,4,12,1) 100%)' }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onClose}
    >
      <Starfield density={22} />

      {/* Top bar */}
      <div className="absolute top-[55px] left-[17px] right-[17px] flex items-center justify-between z-10">
        <motion.button
          className="flex items-center gap-[5px] px-[12px] h-[30px] rounded-full"
          style={{ background: 'rgba(6,6,14,0.9)', border: '1px solid #2a2a3a' }}
          onClick={e => { e.stopPropagation(); onClose(); }}
          initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}
        >
          <span className="text-[#aaa] text-[13px]">← back</span>
        </motion.button>
        <motion.p className="text-[12px] tracking-widest uppercase"
          style={{ color: meta.color, opacity: 0.65 }}
          initial={{ opacity: 0 }} animate={{ opacity: 0.65 }} transition={{ delay: 0.2 }}>
          {meta.label}
        </motion.p>
      </div>

      {/* Star cluster */}
      <div
        className="absolute"
        style={{ width: 300, height: 300, left: '50%', top: '36%', transform: 'translate(-50%, -50%)' }}
        onClick={e => e.stopPropagation()}
      >
        {hasSats && (
          <svg width="300" height="300" className="absolute inset-0 pointer-events-none" style={{ overflow: 'visible' }}>
            {FULL_SAT.slice(0, sats.length).map((sat, i) => (
              <motion.line key={i} x1="150" y1="150" x2={sat.x} y2={sat.y}
                stroke={meta.color} strokeWidth="0.9" strokeDasharray="4 7"
                initial={{ opacity: 0 }} animate={{ opacity: 0.32 }}
                transition={{ delay: 0.25 + i * 0.08 }} />
            ))}
          </svg>
        )}
        {hasSats && sats.map((step, i) => {
          const sat = FULL_SAT[i];
          return (
            <motion.div key={i} className="absolute flex flex-col items-center"
              style={{ left: sat.x, top: sat.y, transform: 'translate(-50%, -50%)' }}
              initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 + i * 0.1, duration: 0.4 }}>
              <motion.svg width="18" height="18" viewBox="0 0 24 24" fill={meta.color}
                style={{ filter: `drop-shadow(0 0 6px ${meta.glow})`, opacity: 0.85 }}
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut', delay: i * 0.4 }}>
                <path d={STAR_PATH} />
              </motion.svg>
              <motion.p className="text-center mt-[5px] leading-snug"
                style={{ fontSize: 12, color: meta.color, maxWidth: 80, opacity: 0.9 }}
                initial={{ opacity: 0, y: 4 }} animate={{ opacity: 0.8, y: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}>
                {step}
              </motion.p>
            </motion.div>
          );
        })}
        <motion.div className="absolute flex flex-col items-center"
          style={{ left: 150, top: 150, transform: 'translate(-50%, -50%)' }}
          initial={{ scale: 0 }} animate={{ scale: 1 }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}>
          {[0, 1].map(d => (
            <motion.div key={d} className="absolute rounded-full pointer-events-none"
              style={{ inset: -16, border: `1px solid ${task.completed ? CLAIMED_COLOR : meta.color}` }}
              initial={{ scale: 0.5, opacity: 0.9 }} animate={{ scale: 2.6, opacity: 0 }}
              transition={{ duration: 2.6, repeat: Infinity, ease: 'easeOut', delay: d * 1.0 }} />
          ))}
          <motion.svg width="64" height="64" viewBox="0 0 24 24"
            fill={task.completed ? CLAIMED_COLOR : meta.color}
            style={{
              filter: `drop-shadow(0 0 ${task.completed ? 28 : 22}px ${task.completed ? CLAIMED_GLOW : meta.glow})`,
              transition: 'fill 0.5s ease',
            }}
            animate={{ opacity: [0.85, 1, 0.85] }}
            transition={{ duration: task.completed ? 3.5 : 2.5, repeat: Infinity, ease: 'easeInOut' }}>
            <path d={STAR_PATH} />
          </motion.svg>
        </motion.div>
      </div>

      {/* Detail card */}
      <motion.div
        className="absolute left-[17px] right-[17px] rounded-[18px] p-[16px]"
        style={{
          bottom: 108,
          background: 'rgba(8,8,18,0.97)',
          border: `1px solid ${meta.color}45`,
          boxShadow: `0 0 48px ${meta.glow.replace('0.7', '0.15')}`,
        }}
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }} transition={{ delay: 0.2, duration: 0.3 }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-start gap-[12px]">
          <motion.button
            className="mt-[3px] shrink-0 size-[22px] rounded-full border flex items-center justify-center"
            style={{ borderColor: task.completed ? meta.color : '#3a3a3a', backgroundColor: task.completed ? meta.color : 'transparent' }}
            whileTap={{ scale: 0.82 }} onClick={onToggleComplete}>
            {task.completed && <span className="text-[#08080f] text-[12px] font-bold">✓</span>}
          </motion.button>
          <div className="flex-1 min-w-0">
            <p className={`font-semibold leading-tight mb-[6px] ${task.completed ? 'text-[#8888a0] line-through' : 'text-[#f0e6cc]'}`} style={{ fontSize: 16 }}>
              {task.text}
            </p>
            <p className="text-[#aaa] leading-snug mb-[10px]" style={{ fontSize: 14 }}>{task.details}</p>
            {task.substeps?.length ? (
              <div className="mb-[10px] space-y-[6px]">
                <p className="tracking-widest uppercase mb-[5px]" style={{ fontSize: 11, color: meta.color }}>✦ Steps</p>
                {task.substeps.map((step, i) => (
                  <div key={i} className="flex items-start gap-[8px]">
                    <svg width="8" height="8" viewBox="0 0 24 24" fill={meta.color} className="shrink-0 mt-[4px]"
                      style={{ filter: `drop-shadow(0 0 3px ${meta.glow})` }}>
                      <path d={STAR_PATH} />
                    </svg>
                    <p className="text-[#ccc] leading-snug" style={{ fontSize: 13 }}>{step}</p>
                  </div>
                ))}
              </div>
            ) : null}
            <div className="flex gap-[6px] flex-wrap">
              <span className="px-[8px] py-[3px] rounded-full" style={{ fontSize: 12, background: meta.color + '22', color: meta.color }}>
                {task.effort === 'low' ? 'Easy' : task.effort === 'medium' ? 'Moderate' : 'Heavy'}
              </span>
              <span className="px-[8px] py-[3px] rounded-full bg-[#1a1a2e] text-[#aaa]" style={{ fontSize: 12 }}>⏱ {task.timeLabel}</span>
              <span className="px-[8px] py-[3px] rounded-full bg-[#1a1a2e] text-[#aaa]" style={{ fontSize: 12 }}>{meta.label}</span>
            </div>
          </div>
          <button className="shrink-0 text-[#aaa] leading-none text-[18px]" onClick={onClose}>✕</button>
        </div>
      </motion.div>

      <div className="absolute bg-[#333333] h-[4px] left-[142px] rounded-[2px] bottom-[8px] w-[100px]" />
    </motion.div>
  );
}

// ─── Main screen ──────────────────────────────────────────────────────────────

type ViewMode = 'chat' | 'constellation' | 'board' | 'manual';

// ─── Manual plan builder ───────────────────────────────────────────────────────

type ManualDraft = {
  id: string;
  text: string;
  column: 'do-now' | 'this-week' | 'plan-ahead';
  timeLabel: string;
  timeMinutes: number;
};

const TIME_CHIPS = [
  { label: '5 min',  minutes: 5   },
  { label: '15 min', minutes: 15  },
  { label: '30 min', minutes: 30  },
  { label: '1 hr',   minutes: 60  },
  { label: '2 hr+',  minutes: 120 },
];
const COL_CHIPS: { label: string; id: ManualDraft['column']; color: string }[] = [
  { label: 'Do Now',     id: 'do-now',     color: '#88c8a8' },
  { label: 'This Week',  id: 'this-week',  color: '#d4af78' },
  { label: 'Plan Ahead', id: 'plan-ahead', color: '#c4a0e0' },
];

function newDraft(): ManualDraft {
  return { id: Date.now().toString() + Math.random(), text: '', column: 'this-week', timeLabel: '30 min', timeMinutes: 30 };
}

function ManualBuilder({ onSave, onBack }: {
  onSave: (goalName: string, tasks: KanbanTask[]) => void;
  onBack: () => void;
}) {
  const [goalName, setGoalName] = useState('');
  const [drafts, setDrafts]     = useState<ManualDraft[]>([newDraft()]);

  const updateDraft = (id: string, patch: Partial<ManualDraft>) =>
    setDrafts(prev => prev.map(d => d.id === id ? { ...d, ...patch } : d));

  const removeDraft = (id: string) =>
    setDrafts(prev => prev.filter(d => d.id !== id));

  const handleSave = () => {
    const name = goalName.trim();
    if (!name) return;
    const valid = drafts.filter(d => d.text.trim());
    if (!valid.length) return;

    function deriveEffort(mins: number): 'low' | 'medium' | 'high' {
      if (mins <= 15) return 'low';
      if (mins <= 60) return 'medium';
      return 'high';
    }
    function derivePriority(mins: number): 'p1' | 'p2' | 'p3' {
      if (mins <= 15) return 'p1';
      if (mins <= 60) return 'p2';
      return 'p3';
    }

    const tasks: KanbanTask[] = valid.map((d, i) => ({
      id: String(i + 1),
      text: d.text.trim(),
      details: '',
      effort: deriveEffort(d.timeMinutes),
      timeLabel: d.timeLabel,
      timeMinutes: d.timeMinutes,
      column: d.column,
      priority: derivePriority(d.timeMinutes),
      completed: false,
    }));
    onSave(name, tasks);
  };

  const canSave = goalName.trim().length > 0 && drafts.some(d => d.text.trim());

  return (
    <motion.div
      key="manual"
      className="py-[8px] space-y-[14px]"
      initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }}
      transition={{ duration: 0.28 }}
    >
      {/* Back link */}
      <motion.button
        className="flex items-center gap-[5px] mb-[4px]"
        whileTap={{ scale: 0.92 }}
        onClick={onBack}
      >
        <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
          <path d="M13 4l-7 6 7 6" stroke="#8888a0" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <p className="text-[#8888a0] text-[13px]">Use AI instead</p>
      </motion.button>

      {/* Plan name */}
      <div>
        <p className="text-[11px] tracking-[0.12em] uppercase text-[#555568] mb-[6px]">Plan name</p>
        <input
          autoFocus
          className="w-full bg-transparent outline-none text-[#f0e6cc] text-[16px] font-semibold placeholder:text-[#3a3a4a] border-b border-[#2a2a3a] pb-[8px] focus:border-[#c4a0e0] transition-colors"
          placeholder="e.g. Launch my portfolio"
          value={goalName}
          onChange={e => setGoalName(e.target.value)}
        />
      </div>

      {/* Tasks */}
      <div>
        <div className="flex items-center justify-between mb-[8px]">
          <p className="text-[11px] tracking-[0.12em] uppercase text-[#555568]">
            Tasks ({drafts.filter(d => d.text.trim()).length})
          </p>
          <motion.button
            className="flex items-center gap-[4px] px-[10px] h-[26px] rounded-[8px]"
            style={{ background: 'rgba(196,160,224,0.13)', border: '1px solid rgba(196,160,224,0.30)' }}
            whileTap={{ scale: 0.93 }}
            onClick={() => setDrafts(prev => [...prev, newDraft()])}
          >
            <p className="text-[#c4a0e0] text-[12px] font-medium">+ Add</p>
          </motion.button>
        </div>

        <div className="space-y-[10px]">
          <AnimatePresence>
            {drafts.map(d => (
              <motion.div
                key={d.id}
                layout
                initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                transition={{ duration: 0.22 }}
                className="rounded-[14px] px-[12px] py-[10px]"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                {/* Task name row */}
                <div className="flex items-center gap-[8px] mb-[8px]">
                  <input
                    className="flex-1 bg-transparent outline-none text-[#f0e6cc] text-[13px] placeholder:text-[#444458]"
                    placeholder="What needs to be done?"
                    value={d.text}
                    onChange={e => updateDraft(d.id, { text: e.target.value })}
                  />
                  {drafts.length > 1 && (
                    <motion.button whileTap={{ scale: 0.85 }} onClick={() => removeDraft(d.id)}>
                      <p className="text-[#444458] text-[16px] leading-none">×</p>
                    </motion.button>
                  )}
                </div>

                {/* Column chips */}
                <div className="flex gap-[5px] mb-[6px] flex-wrap">
                  {COL_CHIPS.map(c => (
                    <motion.button
                      key={c.id}
                      className="px-[8px] h-[22px] rounded-full text-[11px] font-medium"
                      style={{
                        background: d.column === c.id ? c.color + '22' : 'rgba(255,255,255,0.04)',
                        border:     `1px solid ${d.column === c.id ? c.color + '66' : 'rgba(255,255,255,0.08)'}`,
                        color:      d.column === c.id ? c.color : '#666680',
                      }}
                      whileTap={{ scale: 0.93 }}
                      onClick={() => updateDraft(d.id, { column: c.id })}
                    >
                      {c.label}
                    </motion.button>
                  ))}
                </div>

                {/* Time chips */}
                <div className="flex gap-[5px] flex-wrap">
                  {TIME_CHIPS.map(t => (
                    <motion.button
                      key={t.label}
                      className="px-[8px] h-[22px] rounded-full text-[11px]"
                      style={{
                        background: d.timeMinutes === t.minutes ? 'rgba(212,175,120,0.18)' : 'rgba(255,255,255,0.04)',
                        border:     `1px solid ${d.timeMinutes === t.minutes ? 'rgba(212,175,120,0.50)' : 'rgba(255,255,255,0.08)'}`,
                        color:      d.timeMinutes === t.minutes ? '#d4af78' : '#666680',
                      }}
                      whileTap={{ scale: 0.93 }}
                      onClick={() => updateDraft(d.id, { timeLabel: t.label, timeMinutes: t.minutes })}
                    >
                      {t.label}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Save button */}
      <motion.button
        className="w-full h-[48px] rounded-[24px] flex items-center justify-center gap-[8px]"
        style={{
          background:  canSave ? '#c4a0e0' : 'rgba(255,255,255,0.06)',
          boxShadow:   canSave ? '0 0 24px rgba(196,160,224,0.30)' : 'none',
          border:      canSave ? 'none' : '1px solid rgba(255,255,255,0.08)',
          cursor:      canSave ? 'pointer' : 'default',
        }}
        whileTap={canSave ? { scale: 0.97 } : {}}
        onClick={canSave ? handleSave : undefined}
      >
        <p className="font-bold text-[14px]" style={{ color: canSave ? '#08080f' : '#444458' }}>
          Save Constellation ✦
        </p>
      </motion.button>
    </motion.div>
  );
}

export default function AICompanionScreen({ onNavigate, aiPlans, setAiPlans, user, userMood, userEnergy }: {
  onNavigate: (screen: string) => void;
  aiPlans: ActionPlan[];
  setAiPlans: React.Dispatch<React.SetStateAction<ActionPlan[]>>;
  user?: User | null;
  userMood?: string | null;
  userEnergy?: number;
}) {
  const { isDark } = useTheme();
  const plans: ActionPlan[] = Array.isArray(aiPlans) ? aiPlans : [];

  const T = isDark ? {
    aiBubbleBg:       'rgba(196,160,224,0.14)',
    aiBubbleBorder:   '1px solid rgba(196,160,224,0.25)',
    aiBubbleShadow:   '0 0 16px rgba(196,160,224,0.08)',
    userBubbleBg:     '#0b0a18',
    userBubbleBorder: '#2a2a3a',
    processBg:        'rgba(196,160,224,0.14)',
    processBorder:    '1px solid rgba(196,160,224,0.25)',
    processColor:     '#c4a0e0',
    dotBg:            '#c4a0e0',
    tabActiveBg:      'rgba(196,160,224,0.14)',
    tabActiveBorder:  '#c4a0e0',
    tabActiveColor:   '#c4a0e0',
    tabInactiveColor: '#8888a0',
    accentBtnBg:      'rgba(196,160,224,0.18)',
    accentBtnBorder:  '1px solid rgba(196,160,224,0.50)',
    accentBg2:        'rgba(196,160,224,0.12)',
    accentBorder2:    '1px solid rgba(196,160,224,0.28)',
    contextBg:        'rgba(196,160,224,0.06)',
    contextBorder:    '#1e1e2e',
    sendBg:           '#c4a0e0',
    sendShadow:       '0 0 20px rgba(196,160,224,0.30)',
    bubbleText:       '#f0e6cc',
    screenBg:         '#08080f',
    headerBorder:     'rgba(255,255,255,0.06)',
    burgerColor:      '#c4a0e0',
  } : {
    aiBubbleBg:       'rgba(255,255,255,0.92)',
    aiBubbleBorder:   '1px solid rgba(92,58,122,0.20)',
    aiBubbleShadow:   '0 2px 10px rgba(92,58,122,0.07)',
    userBubbleBg:     'rgba(214,234,250,0.88)',
    userBubbleBorder: 'rgba(28,58,92,0.20)',
    processBg:        'rgba(255,255,255,0.92)',
    processBorder:    '1px solid rgba(92,58,122,0.20)',
    processColor:     '#5c3a7a',
    dotBg:            '#5c3a7a',
    tabActiveBg:      'rgba(92,58,122,0.10)',
    tabActiveBorder:  '#5c3a7a',
    tabActiveColor:   '#5c3a7a',
    tabInactiveColor: '#3d5a72',
    accentBtnBg:      'rgba(92,58,122,0.10)',
    accentBtnBorder:  '1px solid rgba(92,58,122,0.35)',
    accentBg2:        'rgba(92,58,122,0.08)',
    accentBorder2:    '1px solid rgba(92,58,122,0.25)',
    contextBg:        'rgba(255,255,255,0.75)',
    contextBorder:    'rgba(92,58,122,0.15)',
    sendBg:           '#5c3a7a',
    sendShadow:       '0 0 12px rgba(92,58,122,0.25)',
    bubbleText:       '#1c3a5c',
    screenBg:         '#f4f0e8',
    headerBorder:     'rgba(92,58,122,0.12)',
    burgerColor:      '#5c3a7a',
  };

  const [activePlanId, setActivePlanId] = useState<string | null>(
    plans.length > 0 ? plans[plans.length - 1].id : null
  );
  const [newModeMessages, setNewModeMessages] = useState<ChatMessage[]>(() => [getMoodWelcome(userMood)]);
  const [userInput, setUserInput]   = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [view, setView]             = useState<ViewMode>('chat');
  const [zoomedTask, setZoomedTask] = useState<KanbanTask | null>(null);
  const [showDrawer, setShowDrawer] = useState(false);
  const scrollRef                   = useRef<HTMLDivElement>(null);

  const localPlan   = plans.find(p => p.id === activePlanId) ?? null;
  const isNewMode   = activePlanId === null;
  const displayMessages: ChatMessage[] = isNewMode
    ? newModeMessages
    : (localPlan?.conversation ?? [WELCOME]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [displayMessages.length, isProcessing, view]);

  // ── Supabase persistence helpers ───────────────────────────────────────────

  const savePlanToDb = useCallback(async (plan: ActionPlan) => {
    if (!user?.id) return;
    await supabase.from('ai_plans').upsert({
      id:           plan.id,
      user_id:      user.id,
      task:         plan.task,
      tasks:        plan.tasks        as unknown as object,
      conversation: plan.conversation ?? [] as unknown as object,
      created_at:   plan.createdAt,
    });
  }, [user]);

  const deletePlanFromDb = useCallback(async (planId: string) => {
    if (!user?.id) return;
    await supabase.from('ai_plans').delete().eq('id', planId).eq('user_id', user.id);
  }, [user]);

  // ── Plan mutation helpers ──────────────────────────────────────────────────

  const updatePlan = useCallback((updated: ActionPlan) => {
    setAiPlans(prev => prev.map(p => p.id === updated.id ? updated : p));
    savePlanToDb(updated);
  }, [setAiPlans, savePlanToDb]);

  const handleDeletePlan = useCallback((planId: string) => {
    setAiPlans(prev => prev.filter(p => p.id !== planId));
    deletePlanFromDb(planId);
    if (activePlanId === planId) {
      setActivePlanId(null);
      setView('chat');
    }
  }, [setAiPlans, deletePlanFromDb, activePlanId]);

  const handleRenamePlan = useCallback((planId: string, newName: string) => {
    setAiPlans(prev => prev.map(p =>
      p.id === planId ? { ...p, task: newName } : p
    ));
    const plan = plans.find(p => p.id === planId);
    if (plan) savePlanToDb({ ...plan, task: newName });
  }, [setAiPlans, plans, savePlanToDb]);

  const handleNewPlan = () => {
    setActivePlanId(null);
    setNewModeMessages([{
      type: 'ai',
      text: "Sure! What's your new goal? Tell me what you'd like to work on next.",
    }]);
    setView('chat');
  };

  const handleSaveManual = useCallback((goalName: string, tasks: KanbanTask[]) => {
    const plan: ActionPlan = {
      id: Date.now().toString(),
      task: goalName,
      tasks,
      createdAt: new Date().toISOString(),
      conversation: [],
    };
    setAiPlans(prev => [...prev, plan]);
    savePlanToDb(plan);
    setActivePlanId(plan.id);
    setView('constellation');
  }, [setAiPlans, savePlanToDb]);

  const handleSelectPlan = (planId: string) => {
    setActivePlanId(planId);
    setView('chat');
  };

  const handleTasksChange = (tasks: KanbanTask[]) => {
    if (!localPlan) return;
    updatePlan({ ...localPlan, tasks });
  };

  const handleZoomedToggle = () => {
    if (!zoomedTask || !localPlan) return;
    const updatedTasks = localPlan.tasks.map(t =>
      t.id === zoomedTask.id ? { ...t, completed: !t.completed } : t
    );
    updatePlan({ ...localPlan, tasks: updatedTasks });
    setZoomedTask(prev => prev ? { ...prev, completed: !prev.completed } : null);
  };

  const handleSend = async () => {
    if (!userInput.trim() || isProcessing) return;
    const msg = userInput.trim();
    setUserInput('');
    setIsProcessing(true);

    if (isNewMode) {
      setNewModeMessages(prev => [
        ...prev,
        { type: 'user', text: msg },
        { type: 'ai', text: 'Mapping your constellation…' },
      ]);
      try {
        const tasks = await buildPlanFromAI(msg, userMood, userEnergy);
        const initConv: ChatMessage[] = [
          { type: 'user', text: msg },
          {
            type: 'ai',
            text: `Your constellation is ready — ${tasks.length} stars mapped by effort and time. Tap any star to explore it ✦`,
            planReady: true,
          },
        ];
        const plan: ActionPlan = {
          id: Date.now().toString(),
          task: msg,
          tasks,
          createdAt: new Date().toISOString(),
          conversation: initConv,
        };
        setAiPlans(prev => [...prev, plan]);
        savePlanToDb(plan);            // persist to Supabase
        setActivePlanId(plan.id);
        setView('constellation');
      } catch (err: any) {
        setNewModeMessages(prev => [
          ...prev.slice(0, -1),
          { type: 'ai', text: `Sorry, couldn't generate your plan: ${err.message}` },
        ]);
      } finally {
        setIsProcessing(false);
      }

    } else {
      if (!localPlan) { setIsProcessing(false); return; }
      const prevConv = localPlan.conversation ?? [];
      const withUser: ChatMessage[] = [...prevConv, { type: 'user', text: msg }];
      updatePlan({ ...localPlan, conversation: withUser });

      try {
        const reply = await chatWithAI(localPlan.task, localPlan.tasks, prevConv, msg);
        updatePlan({
          ...localPlan,
          conversation: [...withUser, { type: 'ai', text: reply }],
        });
      } catch (err: any) {
        updatePlan({
          ...localPlan,
          conversation: [...withUser, { type: 'ai', text: `Sorry: ${err.message}` }],
        });
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const tabs: { id: ViewMode; icon: string; label: string }[] = [
    { id: 'chat',          icon: '💬', label: 'Chat'  },
    { id: 'constellation', icon: '✦',  label: 'Stars' },
    { id: 'board',         icon: '⬛',  label: 'Board' },
  ];

  // Active plan title for header — truncated
  const planTitle = localPlan
    ? (localPlan.task.length > 22 ? localPlan.task.slice(0, 22) + '…' : localPlan.task)
    : view === 'manual' ? 'Build Your Plan' : 'New Chat';

  return (
    <div
      className="overflow-hidden relative rounded-[36px] size-full"
      style={{ backgroundColor: T.screenBg }}
    >
      <Starfield density={30} />
      <NebulaGlow color="purple" className="w-[300px] h-[300px] left-[45px] top-[100px]" />

      {/* Status bar */}
      <div className="absolute h-[44px] left-0 top-0 w-full z-10 bg-gradient-to-b from-[#08080f] to-transparent" />
      <p className="absolute font-bold left-[13px] text-[#f0e6cc] text-[13px] top-[10px] z-10">9:41</p>

      {/* ── Header bar ────────────────────────────────────────────────────── */}
      <div className="absolute left-0 right-0 top-[44px] h-[44px] flex items-center justify-between px-[14px] z-10">

        {/* Hamburger button */}
        <motion.button
          className="size-[36px] flex flex-col items-center justify-center gap-[5px] rounded-[10px]"
          style={{ background: 'rgba(255,255,255,0.05)' }}
          whileTap={{ scale: 0.88 }}
          onClick={() => setShowDrawer(true)}
        >
          {[0, 1, 2].map(i => (
            <motion.div
              key={i}
              className="rounded-full"
              style={{
                width: i === 2 ? 12 : 18,
                height: 2,
                backgroundColor: T.burgerColor,
              }}
            />
          ))}
        </motion.button>

        {/* Center: title */}
        <div className="flex-1 flex flex-col items-center px-[8px]">
          <p className="font-bold text-[#f0e6cc] text-[14px] leading-tight truncate max-w-[180px]">
            {isNewMode ? '✦ AI Companion' : planTitle}
          </p>
          {!isNewMode && localPlan && (
            <p className="text-[10px] tracking-wide" style={{ color: T.tabInactiveColor }}>
              {localPlan.tasks.filter(t => t.completed).length}/{localPlan.tasks.length} tasks
            </p>
          )}
        </div>

        {/* Right: view tabs (when plan active) or compose icon (new mode) */}
        {localPlan ? (
          <div className="flex gap-[3px]">
            {tabs.map(tab => (
              <motion.button
                key={tab.id}
                className="flex items-center gap-[2px] px-[7px] h-[28px] rounded-[10px] border text-[11px] font-medium"
                style={{
                  borderColor: view === tab.id ? T.tabActiveBorder  : 'rgba(255,255,255,0.08)',
                  background:  view === tab.id ? T.tabActiveBg      : 'transparent',
                  color:       view === tab.id ? T.tabActiveColor    : T.tabInactiveColor,
                }}
                whileTap={{ scale: 0.91 }}
                onClick={() => setView(tab.id)}
              >
                <span style={{ fontSize: tab.icon === '✦' ? 9 : 11 }}>{tab.icon}</span>
                <span>{tab.label}</span>
              </motion.button>
            ))}
          </div>
        ) : (
          /* Compose / pencil button for quick new chat */
          <motion.button
            className="size-[36px] flex items-center justify-center rounded-[10px]"
            style={{ background: 'rgba(196,160,224,0.12)', border: '1px solid rgba(196,160,224,0.25)' }}
            whileTap={{ scale: 0.88 }}
            onClick={handleNewPlan}
          >
            <PencilIcon />
          </motion.button>
        )}
      </div>

      <div
        className="absolute h-[1px] left-[17px] right-[17px] top-[88px] z-10"
        style={{ background: `linear-gradient(to right, transparent, ${T.headerBorder}, transparent)` }}
      />

      {/* ── Content area ─────────────────────────────────────────────────── */}
      <div
        ref={scrollRef}
        className="absolute left-0 right-0 top-[96px] bottom-[170px] overflow-y-auto px-[17px]"
        style={{ scrollbarWidth: 'none' }}
      >
        <AnimatePresence mode="wait">

          {/* MANUAL BUILDER VIEW */}
          {view === 'manual' && isNewMode && (
            <ManualBuilder
              onSave={handleSaveManual}
              onBack={() => setView('chat')}
            />
          )}

          {/* CHAT VIEW */}
          {view === 'chat' && (
            <motion.div key="chat" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="space-y-[12px] py-[8px]">

              {localPlan && !isNewMode && (
                <motion.div
                  className="rounded-[12px] px-[12px] py-[8px] mb-[4px]"
                  style={{ background: T.contextBg, border: `1px solid ${T.contextBorder}` }}
                  initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
                >
                  <p className="text-[11px] tracking-widest uppercase text-[#8888a0] mb-[2px]">Active plan</p>
                  <p className="text-[#c4a0e0] text-[13px] font-medium">{localPlan.task}</p>
                  <p className="text-[#8888a0] text-[11px] mt-[1px]">
                    {localPlan.tasks.filter(t => t.completed).length}/{localPlan.tasks.length} tasks completed
                    · {new Date(localPlan.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </p>
                </motion.div>
              )}

              {/* Choice cards — shown in new mode before any user message */}
              {isNewMode && newModeMessages.length === 1 && (
                <motion.div
                  className="flex flex-col gap-[8px] pt-[4px]"
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                >
                  {/* AI option */}
                  <motion.button
                    className="w-full rounded-[16px] px-[14px] py-[12px] flex items-center gap-[12px] text-left"
                    style={{
                      background: 'rgba(196,160,224,0.10)',
                      border: '1px solid rgba(196,160,224,0.30)',
                    }}
                    whileHover={{ background: 'rgba(196,160,224,0.16)' }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => {
                      const input = document.querySelector('input[type="text"]') as HTMLInputElement;
                      input?.focus();
                    }}
                  >
                    <div className="size-[36px] rounded-[10px] flex items-center justify-center shrink-0"
                      style={{ background: 'rgba(196,160,224,0.18)', border: '1px solid rgba(196,160,224,0.35)' }}>
                      <p className="text-[16px]">✦</p>
                    </div>
                    <div>
                      <p className="text-[#c4a0e0] text-[13px] font-semibold">Let AI map it out</p>
                      <p className="text-[#666680] text-[11px] mt-[1px]">Describe your goal — AI builds the plan</p>
                    </div>
                  </motion.button>

                  {/* Manual option */}
                  <motion.button
                    className="w-full rounded-[16px] px-[14px] py-[12px] flex items-center gap-[12px] text-left"
                    style={{
                      background: 'rgba(212,175,120,0.08)',
                      border: '1px solid rgba(212,175,120,0.25)',
                    }}
                    whileHover={{ background: 'rgba(212,175,120,0.14)' }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setView('manual')}
                  >
                    <div className="size-[36px] rounded-[10px] flex items-center justify-center shrink-0"
                      style={{ background: 'rgba(212,175,120,0.15)', border: '1px solid rgba(212,175,120,0.30)' }}>
                      <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                        <path d="M14.5 2.5a2.121 2.121 0 013 3L6 17H3v-3L14.5 2.5z"
                          stroke="#d4af78" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-[#d4af78] text-[13px] font-semibold">Build it myself</p>
                      <p className="text-[#666680] text-[11px] mt-[1px]">Add your own tasks, columns & time</p>
                    </div>
                  </motion.button>
                </motion.div>
              )}

              {displayMessages.map((msg, idx) => (
                <motion.div key={idx}
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}>
                  {msg.type === 'ai' ? (
                    <div>
                      <div
                        className="rounded-[18px] max-w-[300px] p-[12px]"
                        style={{
                          background: T.aiBubbleBg,
                          border:     T.aiBubbleBorder,
                          boxShadow:  T.aiBubbleShadow,
                        }}>
                        <p className="text-[14px] leading-[1.6]" style={{ color: T.bubbleText }}>{msg.text}</p>
                      </div>
                      {msg.planReady && (
                        <motion.button
                          className="mt-[8px] flex items-center gap-[8px] px-[14px] h-[34px] rounded-[17px]"
                          style={{ background: T.accentBtnBg, border: T.accentBtnBorder }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => setView('constellation')}
                          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.25 }}>
                          <span className="text-[12px]">✦</span>
                          <p className="text-[#c4a0e0] text-[13px] font-bold">Open Constellation</p>
                        </motion.button>
                      )}
                    </div>
                  ) : (
                    <div className="flex justify-end">
                      <div className="rounded-[18px] max-w-[270px] p-[12px]"
                        style={{ background: T.userBubbleBg, border: `1px solid ${T.userBubbleBorder}` }}>
                        <p className="text-[14px] leading-[1.6]" style={{ color: T.bubbleText }}>{msg.text}</p>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}

              {isProcessing && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="rounded-[18px] max-w-[220px] p-[12px]"
                  style={{ background: T.processBg, border: T.processBorder }}>
                  <div className="flex gap-[6px] items-center">
                    {[0, 0.2, 0.4].map((d, i) => (
                      <motion.div key={i} className="size-[5px] rounded-full"
                        style={{ background: T.dotBg }}
                        animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.5, repeat: Infinity, delay: d }} />
                    ))}
                    <p className="text-[13px] ml-[6px]" style={{ color: T.processColor }}>
                      {isNewMode ? 'mapping your stars…' : 'thinking…'}
                    </p>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* CONSTELLATION VIEW */}
          {view === 'constellation' && localPlan && (
            <motion.div key="constellation"
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <p className="text-[#8888a0] text-[12px] mb-[4px] italic">"{localPlan.task}"</p>
              <ConstellationPlan
                tasks={localPlan.tasks}
                onTasksChange={handleTasksChange}
                onStarTap={setZoomedTask}
              />
              <motion.button
                className="w-full mt-[12px] mb-[4px] rounded-[12px] h-[36px] flex items-center justify-center"
                style={{ background: T.accentBg2, border: T.accentBorder2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onNavigate('sky')}
              >
                <p className="text-[#c4a0e0] text-[14px] font-bold">View in Your Sky →</p>
              </motion.button>
            </motion.div>
          )}

          {/* BOARD VIEW */}
          {view === 'board' && localPlan && (
            <motion.div key="board"
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <p className="text-[#8888a0] text-[10px] mb-[4px] italic">"{localPlan.task}"</p>
              <KanbanBoard tasks={localPlan.tasks} onTasksChange={handleTasksChange} />
              <motion.button
                className="w-full mt-[12px] mb-[4px] rounded-[12px] h-[36px] flex items-center justify-center"
                style={{ background: T.accentBg2, border: T.accentBorder2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onNavigate('sky')}
              >
                <p className="text-[#c4a0e0] text-[14px] font-bold">View in Your Sky →</p>
              </motion.button>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* Privacy label */}
      {view !== 'manual' && (
        <div className="absolute left-[17px] bottom-[160px] flex items-center gap-[5px]">
          <p className="text-[10px]" style={{ color: isDark ? '#444458' : '#7a8fa0' }}>
            🔒 Your reflections are private and never shared
          </p>
        </div>
      )}

      {/* Input row */}
      {view !== 'manual' && (
      <div className="absolute left-[17px] bottom-[106px] flex gap-[6px]">
        <div
          className="h-[48px] rounded-[24px] w-[295px] flex items-center px-[18px]"
          style={{ background: isDark ? '#0b0a18' : '#ffffff', border: `1px solid ${isDark ? '#333333' : 'rgba(92,58,122,0.2)'}` }}
        >
          <input
            type="text"
            placeholder={isNewMode ? 'What would you like to work on?' : 'Ask about this plan…'}
            value={userInput}
            onChange={e => setUserInput(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && handleSend()}
            className="w-full bg-transparent outline-none text-[13px] placeholder:text-[#8888a0]"
            style={{ color: T.bubbleText }}
          />
        </div>
        <motion.button
          className="rounded-[24px] size-[48px] flex items-center justify-center cursor-pointer"
          style={{ background: T.sendBg, boxShadow: T.sendShadow }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSend}
        >
          <p className="font-bold text-[18px] text-[#08080f]">↑</p>
        </motion.button>
      </div>
      )}

      {/* Bottom nav */}
      <div
        className="absolute flex gap-[31px] h-[90px] items-center justify-center left-0 bottom-0 w-full border-t"
        style={{ backgroundColor: isDark ? '#0b0a18' : '#f4f0e8', borderColor: isDark ? '#1a1a1a' : 'rgba(92,58,122,0.12)' }}
      >
        <NavIcon type="today"   active={false} onClick={() => onNavigate('today')}   />
        <NavIcon type="sky"     active={false} onClick={() => onNavigate('sky')}     />
        <NavIcon type="ai"      active={true}  onClick={() => onNavigate('ai')}      />
        <NavIcon type="profile" active={false} onClick={() => onNavigate('profile')} />
      </div>
      <div className="absolute bg-[#333333] h-[4px] left-[142px] rounded-[2px] bottom-[8px] w-[100px]" />

      {/* History drawer (slides in over everything) */}
      <AnimatePresence>
        {showDrawer && (
          <HistoryDrawer
            plans={plans}
            activePlanId={activePlanId}
            onNewChat={handleNewPlan}
            onSelectPlan={handleSelectPlan}
            onClose={() => setShowDrawer(false)}
            onDeletePlan={handleDeletePlan}
            onRenamePlan={handleRenamePlan}
          />
        )}
      </AnimatePresence>

      {/* Fullscreen star zoom */}
      <AnimatePresence>
        {zoomedTask && (
          <ZoomedStarOverlay
            task={zoomedTask}
            onClose={() => setZoomedTask(null)}
            onToggleComplete={handleZoomedToggle}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
