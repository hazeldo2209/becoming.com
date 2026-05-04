import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Starfield, NebulaGlow } from './CosmicElements';
import KanbanBoard from './KanbanBoard';
import ConstellationPlan, { COL_META, STAR_PATH } from './ConstellationPlan';
import type { KanbanTask, ActionPlan, ChatMessage } from '../types';
import { useTheme } from '../context/ThemeContext';

// ─── Constants ────────────────────────────────────────────────────────────────

const CLAIMED_COLOR = '#f0e6cc';
const CLAIMED_GLOW  = 'rgba(240,230,204,0.95)';

const WELCOME: ChatMessage = {
  type: 'ai',
  text: "Hi! I'm here to help you take action on what matters to you. What's something you'd like to work on?",
};

// ─── Satellite positions (fullscreen zoom canvas, 300×300) ───────────────────

const FULL_SAT = [
  { x: 75,  y: 55  },
  { x: 225, y: 55  },
  { x: 150, y: 255 },
];

// ─── API helpers ──────────────────────────────────────────────────────────────

async function buildPlanFromAI(userGoal: string): Promise<KanbanTask[]> {
  const res = await fetch('/api/plan', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ goal: userGoal }),
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

// ─── Plan switcher chip ───────────────────────────────────────────────────────

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

function PlanChip({ plan, active, onClick }: { plan: ActionPlan; active: boolean; onClick: () => void }) {
  const color    = planDominantColor(plan);
  const done     = plan.tasks.filter(t => t.completed).length;
  const total    = plan.tasks.length;
  const allDone  = done === total && total > 0;
  const label    = plan.task.length > 18 ? plan.task.slice(0, 18) + '…' : plan.task;

  return (
    <motion.button
      className="flex items-center gap-[6px] px-[10px] h-[28px] rounded-full border shrink-0"
      style={{
        borderColor: active ? color : '#252535',
        background:  active ? `${color}22` : 'transparent',
      }}
      whileTap={{ scale: 0.94 }}
      onClick={onClick}
    >
      {/* Progress dots */}
      <div className="flex gap-[2px] items-center">
        {plan.tasks.slice(0, 6).map((t, i) => (
          <div key={i} className="rounded-full"
            style={{
              width: 4, height: 4,
              backgroundColor: t.completed ? (active ? color : CLAIMED_COLOR) : '#2a2a3a',
            }}
          />
        ))}
      </div>
      <p className="text-[12px] font-medium" style={{ color: active ? color : '#8888a0' }}>{label}</p>
      {allDone && <span style={{ fontSize: 11, color }}>✓</span>}
    </motion.button>
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

type ViewMode = 'chat' | 'constellation' | 'board';

export default function AICompanionScreen({ onNavigate, aiPlans, setAiPlans }: any) {
  const { isDark } = useTheme();
  const plans: ActionPlan[] = Array.isArray(aiPlans) ? aiPlans : [];

  // ── Theme tokens — swap every purple/gold inline colour by mode ─────────────
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
    newPlanBg:        'rgba(196,160,224,0.15)',
    newPlanBorder:    '#c4a0e0',
    newPlanColor:     '#c4a0e0',
    sendBg:           '#c4a0e0',
    sendShadow:       '0 0 20px rgba(196,160,224,0.30)',
    bubbleText:       '#f0e6cc',
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
    newPlanBg:        'rgba(92,58,122,0.08)',
    newPlanBorder:    '#5c3a7a',
    newPlanColor:     '#5c3a7a',
    sendBg:           '#5c3a7a',
    sendShadow:       '0 0 12px rgba(92,58,122,0.25)',
    bubbleText:       '#1c3a5c',
  };

  // activePlanId === null → "new plan" mode
  const [activePlanId, setActivePlanId] = useState<string | null>(
    plans.length > 0 ? plans[plans.length - 1].id : null
  );
  // Conversation shown when in "new plan" mode (before any plan is created)
  const [newModeMessages, setNewModeMessages] = useState<ChatMessage[]>([WELCOME]);
  const [userInput, setUserInput]   = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [view, setView]             = useState<ViewMode>('chat');
  const [zoomedTask, setZoomedTask] = useState<KanbanTask | null>(null);
  const scrollRef                   = useRef<HTMLDivElement>(null);

  const localPlan   = plans.find(p => p.id === activePlanId) ?? null;
  const isNewMode   = activePlanId === null;
  const displayMessages: ChatMessage[] = isNewMode
    ? newModeMessages
    : (localPlan?.conversation ?? [WELCOME]);

  // Auto-scroll chat
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [displayMessages.length, isProcessing, view]);

  const updatePlan = useCallback((updated: ActionPlan) => {
    setAiPlans((prev: ActionPlan[]) => prev.map(p => p.id === updated.id ? updated : p));
  }, [setAiPlans]);

  const handleNewPlan = () => {
    setActivePlanId(null);
    setNewModeMessages([{
      type: 'ai',
      text: "Sure! What's your new goal? Tell me what you'd like to work on next.",
    }]);
    setView('chat');
  };

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
      // ── Generate new plan ──────────────────────────────────────────────
      setNewModeMessages(prev => [
        ...prev,
        { type: 'user', text: msg },
        { type: 'ai', text: 'Mapping your constellation…' },
      ]);
      try {
        const tasks = await buildPlanFromAI(msg);
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
        setAiPlans((prev: ActionPlan[]) => [...prev, plan]);
        setActivePlanId(plan.id);
        setView('constellation');
      } catch (err: any) {
        setNewModeMessages(prev => [
          ...prev.slice(0, -1), // remove "Mapping…" placeholder
          { type: 'ai', text: `Sorry, couldn't generate your plan: ${err.message}` },
        ]);
      } finally {
        setIsProcessing(false);
      }

    } else {
      // ── Continue conversation about existing plan ──────────────────────
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

  const inputPlaceholder = isNewMode
    ? 'What would you like to work on?'
    : 'Ask about this plan…';

  return (
    <div className="bg-[#08080f] overflow-hidden relative rounded-[36px] size-full">
      <Starfield density={30} />
      <NebulaGlow color="purple" className="w-[300px] h-[300px] left-[45px] top-[100px]" />

      {/* Status bar */}
      <div className="absolute h-[44px] left-0 top-0 w-full z-10 bg-gradient-to-b from-[#08080f] to-transparent" />
      <p className="absolute font-bold left-[13px] text-[#f0e6cc] text-[13px] top-[10px] z-10">9:41</p>

      {/* ── Plan switcher strip ──────────────────────────────────────────── */}
      {/* Always reserve space so layout doesn't jump */}
      <div
        className="absolute left-0 right-0 top-[48px] h-[34px] flex items-center gap-[8px] overflow-x-auto z-10 px-[17px]"
        style={{ scrollbarWidth: 'none' }}
      >
        {/* New plan button */}
        <motion.button
          className="flex items-center gap-[4px] px-[10px] h-[26px] rounded-full border shrink-0"
          style={{
            borderColor: isNewMode ? T.newPlanBorder : '#252535',
            background:  isNewMode ? T.newPlanBg : 'transparent',
          }}
          whileTap={{ scale: 0.93 }}
          onClick={handleNewPlan}
        >
          <span className="text-[13px]" style={{ color: isNewMode ? T.newPlanColor : T.tabInactiveColor }}>+ New</span>
        </motion.button>

        {/* Divider */}
        {plans.length > 0 && (
          <div className="w-[1px] h-[16px] bg-[#252535] shrink-0" />
        )}

        {/* Per-plan chips */}
        {plans.map(plan => (
          <PlanChip
            key={plan.id}
            plan={plan}
            active={activePlanId === plan.id}
            onClick={() => handleSelectPlan(plan.id)}
          />
        ))}
      </div>

      {/* ── Header row ─────────────────────────────────────────────────── */}
      <div className="absolute left-[17px] right-[17px] top-[86px] flex items-center justify-between z-10">
        <div className="flex items-center gap-[8px]">
          <p className="font-bold text-[#f0e6cc] text-[18px]">✦ AI Companion</p>
          {localPlan && !isNewMode && (
            <p className="text-[#8888a0] text-[12px] truncate max-w-[140px]">
              · {localPlan.task.length > 20 ? localPlan.task.slice(0, 20) + '…' : localPlan.task}
            </p>
          )}
        </div>
        {/* View tabs (when plan active) */}
        {localPlan && (
          <div className="flex gap-[4px]">
            {tabs.map(tab => (
              <motion.button
                key={tab.id}
                className="flex items-center gap-[3px] px-[8px] h-[28px] rounded-[12px] border text-[11px] font-medium"
                style={{
                  borderColor: view === tab.id ? T.tabActiveBorder  : '#252535',
                  background:  view === tab.id ? T.tabActiveBg      : 'transparent',
                  color:       view === tab.id ? T.tabActiveColor    : T.tabInactiveColor,
                }}
                whileTap={{ scale: 0.93 }}
                onClick={() => setView(tab.id)}
              >
                <span style={{ fontSize: tab.icon === '✦' ? 10 : 12 }}>{tab.icon}</span>
                <span>{tab.label}</span>
              </motion.button>
            ))}
          </div>
        )}
      </div>

      <div className="absolute h-[1px] left-[17px] right-[17px] top-[114px] bg-gradient-to-r from-transparent via-[#333333] to-transparent z-10" />

      {/* ── Content area ─────────────────────────────────────────────────── */}
      <div
        ref={scrollRef}
        className="absolute left-0 right-0 top-[122px] bottom-[170px] overflow-y-auto px-[17px]"
        style={{ scrollbarWidth: 'none' }}
      >
        <AnimatePresence mode="wait">

          {/* CHAT VIEW */}
          {view === 'chat' && (
            <motion.div key="chat" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="space-y-[12px] py-[8px]">

              {/* Plan context header (when in existing plan) */}
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

      {/* ── Input ─────────────────────────────────────────────────────────── */}
      <div className="absolute left-[17px] bottom-[106px] flex gap-[6px]">
        <div className="bg-[#0b0a18] border border-[#333333] h-[48px] rounded-[24px] w-[295px] flex items-center px-[18px]">
          <input
            type="text"
            placeholder={inputPlaceholder}
            value={userInput}
            onChange={e => setUserInput(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && handleSend()}
            className="w-full bg-transparent outline-none text-[13px] text-[#f0e6cc] placeholder:text-[#8888a0]"
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

      {/* Bottom nav */}
      <div className="absolute bg-[#0b0a18] border-t border-[#1a1a1a] flex gap-[31px] h-[90px] items-center justify-center left-0 bottom-0 w-full">
        <NavIcon type="today"   active={false} onClick={() => onNavigate('today')}   />
        <NavIcon type="sky"     active={false} onClick={() => onNavigate('sky')}     />
        <NavIcon type="ai"      active={true}  onClick={() => onNavigate('ai')}      />
        <NavIcon type="profile" active={false} onClick={() => onNavigate('profile')} />
      </div>
      <div className="absolute bg-[#333333] h-[4px] left-[142px] rounded-[2px] bottom-[8px] w-[100px]" />

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
