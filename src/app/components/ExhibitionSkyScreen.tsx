import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
// @ts-ignore – world-atlas ships TopoJSON without TS declarations
import worldData from 'world-atlas/countries-110m.json';
import type { UserReflection } from '../types';
import { EMOTION_COLOR, EMOTION_GLOW } from '../types';

// ─── Reflection type used throughout this file ────────────────────────────────

type AugReflection = UserReflection & {
  x: number; y: number; size: number;
  isLive?: boolean; isNew?: boolean;
};

// ─── Mock seed data ───────────────────────────────────────────────────────────

const MOCK_REFLECTIONS: AugReflection[] = [
  { id: '1',  text: "Today I realized I'm stronger than I thought. Small steps still count.",          emotion: 'hopeful',    category: 'Growth',      mood: '🙂', tags: ['#growth'],      createdAt: '', location: { city: 'New York',     country: 'US', lat: 40.7,  lng: -74.0  }, x: 8,  y: 22, size: 7 },
  { id: '2',  text: "Struggling with change but trying to stay open to what comes next.",              emotion: 'uncertain',  category: 'Life',        mood: '😐', tags: [],               createdAt: '', location: { city: 'London',       country: 'GB', lat: 51.5,  lng: -0.1   }, x: 18, y: 55, size: 6 },
  { id: '3',  text: "Found peace in just being present. Not every day needs to be perfect.",           emotion: 'calm',       category: 'Mindfulness', mood: '😊', tags: ['#calm'],        createdAt: '', location: { city: 'Tokyo',        country: 'JP', lat: 35.7,  lng: 139.7  }, x: 28, y: 15, size: 8 },
  { id: '4',  text: "Feeling grateful for the people who see me even when I can't see myself.",        emotion: 'grateful',   category: 'Connection',  mood: '🌟', tags: ['#gratitude'],   createdAt: '', location: { city: 'Sydney',       country: 'AU', lat: -33.9, lng: 151.2  }, x: 38, y: 68, size: 7 },
  { id: '5',  text: "Learning that it's okay to not have all the answers right now.",                  emotion: 'accepting',  category: 'Growth',      mood: '🙂', tags: [],               createdAt: '', location: { city: 'São Paulo',    country: 'BR', lat: -23.5, lng: -46.6  }, x: 50, y: 30, size: 9 },
  { id: '6',  text: "Today was hard but I showed up anyway. That matters.",                            emotion: 'resilient',  category: 'Courage',     mood: '😊', tags: ['#courage'],    createdAt: '', location: { city: 'Mumbai',       country: 'IN', lat: 19.1,  lng: 72.9   }, x: 62, y: 72, size: 7 },
  { id: '7',  text: "Scared about the future but choosing to focus on today.",                         emotion: 'anxious',    category: 'Life',        mood: '😐', tags: [],               createdAt: '', location: { city: 'Paris',        country: 'FR', lat: 48.9,  lng: 2.3    }, x: 72, y: 18, size: 6 },
  { id: '8',  text: "Finally starting to believe I deserve good things too.",                          emotion: 'hopeful',    category: 'Self-love',   mood: '🌟', tags: ['#growth'],      createdAt: '', location: { city: 'Nairobi',      country: 'KE', lat: -1.3,  lng: 36.8   }, x: 82, y: 55, size: 8 },
  { id: '9',  text: "Sometimes just surviving the day is enough. And that's okay.",                   emotion: 'tired',      category: 'Wellbeing',   mood: '😔', tags: [],               createdAt: '', location: { city: 'Seoul',        country: 'KR', lat: 37.6,  lng: 127.0  }, x: 91, y: 35, size: 6 },
  { id: '10', text: "Reminded myself that growth isn't linear. Bad days don't erase progress.",        emotion: 'reflective', category: 'Growth',      mood: '🙂', tags: ['#resilience'],  createdAt: '', location: { city: 'Toronto',      country: 'CA', lat: 43.7,  lng: -79.4  }, x: 15, y: 80, size: 7 },
  { id: '11', text: "Found beauty in something small today. It helped more than I expected.",          emotion: 'grateful',   category: 'Mindfulness', mood: '😊', tags: [],               createdAt: '', location: { city: 'Mexico City',  country: 'MX', lat: 19.4,  lng: -99.1  }, x: 45, y: 85, size: 6 },
  { id: '12', text: "Learning to trust my own voice again, even when it's quiet.",                     emotion: 'growing',    category: 'Self-love',   mood: '🌟', tags: ['#selflove'],    createdAt: '', location: { city: 'Cairo',        country: 'EG', lat: 30.0,  lng: 31.2   }, x: 75, y: 82, size: 8 },
  { id: '13', text: "I've been carrying so much. It feels good to finally put some of it down.",       emotion: 'calm',       category: 'Wellbeing',   mood: '🙂', tags: [],               createdAt: '', location: { city: 'Bangkok',      country: 'TH', lat: 13.8,  lng: 100.5  }, x: 22, y: 40, size: 7 },
  { id: '14', text: "Trying to let go of who I thought I'd be by now.",                               emotion: 'accepting',  category: 'Life',        mood: '😐', tags: ['#growth'],      createdAt: '', location: { city: 'Lagos',        country: 'NG', lat: 6.5,   lng: 3.4    }, x: 55, y: 58, size: 6 },
  { id: '15', text: "Every day I choose to get up is a kind of courage.",                             emotion: 'resilient',  category: 'Courage',     mood: '😊', tags: ['#courage'],    createdAt: '', location: { city: 'Berlin',       country: 'DE', lat: 52.5,  lng: 13.4   }, x: 88, y: 70, size: 9 },
  { id: '16', text: "Someone told me they noticed my effort today. I cried a little.",                emotion: 'grateful',   category: 'Connection',  mood: '🌟', tags: [],               createdAt: '', location: { city: 'Buenos Aires', country: 'AR', lat: -34.6, lng: -58.4  }, x: 34, y: 28, size: 7 },
  { id: '17', text: "Still figuring it out. Still here. That's something.",                           emotion: 'hopeful',    category: 'Growth',      mood: '🙂', tags: ['#hope'],        createdAt: '', location: { city: 'Singapore',    country: 'SG', lat: 1.4,   lng: 103.8  }, x: 65, y: 44, size: 8 },
  { id: '18', text: "Wrote down three things that went right. It's harder than it sounds.",           emotion: 'reflective', category: 'Mindfulness', mood: '🙂', tags: [],               createdAt: '', location: { city: 'Moscow',       country: 'RU', lat: 55.8,  lng: 37.6   }, x: 10, y: 60, size: 6 },
  { id: '19', text: "Asked for help today. It was terrifying and it worked.",                          emotion: 'growing',    category: 'Courage',     mood: '😊', tags: ['#courage'],    createdAt: '', location: { city: 'Cape Town',    country: 'ZA', lat: -33.9, lng: 18.4   }, x: 48, y: 12, size: 7 },
  { id: '20', text: "Felt connected to something bigger than my problems for a moment.",               emotion: 'calm',       category: 'Mindfulness', mood: '🌟', tags: [],               createdAt: '', location: { city: 'Beijing',      country: 'CN', lat: 39.9,  lng: 116.4  }, x: 80, y: 28, size: 6 },
  { id: '21', text: "Choosing myself doesn't make me selfish. I'm still learning that.",              emotion: 'growing',    category: 'Self-love',   mood: '😊', tags: ['#selflove'],    createdAt: '', location: { city: 'Amsterdam',    country: 'NL', lat: 52.4,  lng: 4.9    }, x: 5,  y: 44, size: 8 },
  { id: '22', text: "Tired of pretending things are fine. Also trying to believe they will be.",      emotion: 'tired',      category: 'Wellbeing',   mood: '😔', tags: [],               createdAt: '', location: { city: 'Osaka',        country: 'JP', lat: 34.7,  lng: 135.5  }, x: 94, y: 52, size: 6 },
  { id: '23', text: "Someone I lost would be proud of me today. I felt that.",                        emotion: 'grateful',   category: 'Connection',  mood: '🌟', tags: ['#gratitude'],   createdAt: '', location: { city: 'Lisbon',       country: 'PT', lat: 38.7,  lng: -9.1   }, x: 58, y: 88, size: 7 },
  { id: '24', text: "The hard part is already behind me. I keep forgetting to notice that.",          emotion: 'reflective', category: 'Growth',      mood: '🙂', tags: [],               createdAt: '', location: { city: 'Chicago',      country: 'US', lat: 41.9,  lng: -87.6  }, x: 25, y: 92, size: 6 },
  { id: '25', text: "I don't have to earn rest. I'm practicing believing that.",                      emotion: 'accepting',  category: 'Wellbeing',   mood: '😊', tags: ['#rest'],        createdAt: '', location: { city: 'Bangalore',    country: 'IN', lat: 12.9,  lng: 77.6   }, x: 70, y: 92, size: 8 },
];

// ─── Background stars ─────────────────────────────────────────────────────────

const bgStars = Array.from({ length: 500 }, (_, i) => ({
  id: i,
  x: ((i * 137.508 + i * 0.41) % 100),
  y: ((i * 97.32  + i * 0.27 + 13) % 100),
  r: 0.15 + ((i * 31) % 20) * 0.055,
  opacity: 0.06 + ((i * 17) % 12) * 0.022,
  duration: 1.8 + (i % 7) * 0.75,
  delay:    (i % 13) * 0.38,
}));

// ─── Projection helpers ───────────────────────────────────────────────────────

function lngLatToXY(lat: number, lng: number) {
  return { x: ((lng + 180) / 360) * 100, y: ((90 - lat) / 180) * 100 };
}

function regionOf(lat: number, lng: number): string {
  if (lng < -30) return 'Americas';
  if (lng < 60)  return lat > 20 ? 'Europe & Middle East' : 'Africa';
  return lat < -10 ? 'Oceania' : 'Asia-Pacific';
}

// ─── Shared background ────────────────────────────────────────────────────────

function BgStarfield() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {bgStars.map((s) => (
        <motion.div key={s.id} className="absolute rounded-full bg-white"
          style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.r * 2, height: s.r * 2 }}
          animate={{ opacity: [s.opacity * 0.35, s.opacity, s.opacity * 0.35] }}
          transition={{ duration: s.duration, delay: s.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}

function NebulaLayer() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {[
        { color: '#c4a0e0', w: 700, h: 700, left: '5%',  top: '-20%', dur: 12, del: 0,  min: 0.05, max: 0.10 },
        { color: '#d4af78', w: 600, h: 600, left: '60%', top: '30%',  dur: 15, del: 3,  min: 0.04, max: 0.09 },
        { color: '#88c8a8', w: 500, h: 500, left: '35%', top: '70%',  dur: 18, del: 6,  min: 0.03, max: 0.08 },
      ].map((n, i) => (
        <motion.div key={i} className="absolute rounded-full"
          style={{ background: n.color, width: n.w, height: n.h, left: n.left, top: n.top, filter: 'blur(140px)' }}
          animate={{ opacity: [n.min, n.max, n.min] }}
          transition={{ duration: n.dur, repeat: Infinity, ease: 'easeInOut', delay: n.del }}
        />
      ))}
    </div>
  );
}

// ─── Sky view ─────────────────────────────────────────────────────────────────

function ReflectionStar({
  r, active, onClick,
}: { r: AugReflection; active: boolean; onClick: () => void }) {
  const color = EMOTION_COLOR[r.emotion];
  const glow  = EMOTION_GLOW[r.emotion];
  const sz    = r.size * 1.5;
  return (
    <motion.button
      className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer"
      style={{ left: `${r.x}%`, top: `${r.y}%` }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: r.isNew ? 0.5 : 1.2, delay: r.isNew ? 0 : Number(r.id) * 0.06, ease: [0.4, 0, 0.2, 1] }}
      onClick={onClick}
      whileHover={{ scale: 1.8 }}
    >
      {/* New-arrival burst ring */}
      {r.isNew && (
        <motion.div
          className="absolute rounded-full pointer-events-none"
          style={{ inset: -20, border: `2px solid ${color}` }}
          initial={{ scale: 0.3, opacity: 1 }}
          animate={{ scale: 3.5, opacity: 0 }}
          transition={{ duration: 1.8, ease: 'easeOut' }}
        />
      )}
      <AnimatePresence>
        {active && (
          <motion.div className="absolute inset-0 rounded-full" style={{ border: `1px solid ${color}` }}
            initial={{ scale: 1, opacity: 0.8 }} animate={{ scale: 3.5, opacity: 0 }} exit={{ opacity: 0 }}
            transition={{ duration: 2, repeat: Infinity }} />
        )}
      </AnimatePresence>
      <motion.div
        animate={{ opacity: active ? [0.7, 1, 0.7] : r.isNew ? [0.8, 1, 0.8] : [0.45, 0.85, 0.45] }}
        transition={{ duration: 2.5 + Number(r.id) * 0.3, repeat: Infinity, ease: 'easeInOut' }}
      >
        <svg width={r.isNew ? sz * 1.4 : sz} height={r.isNew ? sz * 1.4 : sz} viewBox="0 0 24 24" fill={color}
          style={{ filter: `drop-shadow(0 0 ${active || r.isNew ? 8 : 3}px ${glow})` }}>
          <path d="M12 0l2.9 8.6H24l-7.4 5.4 2.9 8.6L12 17.2l-7.4 5.4 2.9-8.6L0 8.6h9.1z" />
        </svg>
      </motion.div>
    </motion.button>
  );
}

function FloatingLabel({ r, onDone }: { r: AugReflection; onDone: () => void }) {
  const color    = EMOTION_COLOR[r.emotion];
  const isBottom = r.y > 75;
  useEffect(() => { const t = setTimeout(onDone, r.isNew ? 7000 : 4500); return () => clearTimeout(t); }, [onDone, r.isNew]);
  return (
    <motion.div
      className="absolute pointer-events-none z-30 max-w-[340px]"
      style={{
        left: `${Math.min(Math.max(r.x, 8), 72)}%`,
        [isBottom ? 'bottom' : 'top']: `${isBottom ? 100 - r.y + 2 : r.y + 2}%`,
      }}
      initial={{ opacity: 0, y: isBottom ? 10 : -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: isBottom ? 10 : -10 }}
      transition={{ duration: 0.6 }}
    >
      <div className="rounded-2xl px-5 py-3 backdrop-blur-md"
        style={{
          background: 'rgba(11,10,24,0.82)',
          border: `1px solid ${color}${r.isNew ? '88' : '44'}`,
          boxShadow: `0 0 24px ${EMOTION_GLOW[r.emotion].replace('0.7', r.isNew ? '0.45' : '0.25')}`,
        }}>
        {r.isNew && (
          <p className="text-[10px] uppercase tracking-[0.25em] mb-1" style={{ color }}>
            ✦ Just arrived from {r.location?.city}
          </p>
        )}
        <p className="text-[#f0e6cc] text-lg leading-snug font-light">{r.text}</p>
        <div className="flex items-center gap-3 mt-2">
          <p className="text-xs uppercase tracking-widest" style={{ color }}>{r.category}</p>
          {r.location && <p className="text-xs text-[#444]">· {r.location.city}, {r.location.country}</p>}
        </div>
      </div>
    </motion.div>
  );
}

function SkyView({ reflections }: { reflections: AugReflection[] }) {
  const [activeId, setActiveId]   = useState<string | null>(null);
  const [labelIds, setLabelIds]   = useState<string[]>([]);
  const [pan, setPan]             = useState({ x: 0, y: 0 });
  const [dragging, setDragging]   = useState(false);
  const cycleRef    = useRef<ReturnType<typeof setInterval> | null>(null);
  const draggingRef = useRef(false);
  const dragStart   = useRef({ sx: 0, sy: 0, ox: 0, oy: 0, moved: false });
  // Track which live IDs have been shown so we auto-show their label on arrival
  const shownLiveRef = useRef<Set<string>>(new Set());

  const startCycle = useCallback(() => {
    if (cycleRef.current) clearInterval(cycleRef.current);
    const pick = () => {
      const r = reflections[Math.floor(Math.random() * reflections.length)];
      setActiveId(r.id);
      setLabelIds(prev => [...prev.slice(-2), r.id]);
    };
    pick();
    cycleRef.current = setInterval(pick, 5000);
  }, [reflections]);

  useEffect(() => {
    startCycle();
    return () => { if (cycleRef.current) clearInterval(cycleRef.current); };
  }, [startCycle]);

  // Auto-show label for newly arrived live reflections
  useEffect(() => {
    reflections.forEach(r => {
      if (r.isNew && !shownLiveRef.current.has(r.id)) {
        shownLiveRef.current.add(r.id);
        setActiveId(r.id);
        setLabelIds(prev => [...prev.slice(-2), r.id]);
      }
    });
  }, [reflections]);

  const removeLabel = (id: string) => setLabelIds(prev => prev.filter(x => x !== id));

  const handleClick = (r: AugReflection) => {
    if (dragStart.current.moved) return;
    setActiveId(r.id);
    setLabelIds(prev => [...prev.slice(-2), r.id]);
    if (cycleRef.current) clearInterval(cycleRef.current);
    cycleRef.current = setInterval(() => {
      const rr = reflections[Math.floor(Math.random() * reflections.length)];
      setActiveId(rr.id);
      setLabelIds(pp => [...pp.slice(-2), rr.id]);
    }, 5000);
  };

  const onPointerDown = (e: React.PointerEvent) => {
    draggingRef.current = true;
    dragStart.current   = { sx: e.clientX, sy: e.clientY, ox: pan.x, oy: pan.y, moved: false };
    setDragging(true);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!draggingRef.current) return;
    const dx = e.clientX - dragStart.current.sx;
    const dy = e.clientY - dragStart.current.sy;
    if (Math.abs(dx) + Math.abs(dy) > 4) dragStart.current.moved = true;
    if (!dragStart.current.moved) return;
    setPan({
      x: Math.max(-180, Math.min(180, dragStart.current.ox + dx)),
      y: Math.max(-180, Math.min(180, dragStart.current.oy + dy)),
    });
  };
  const onPointerUp = () => { draggingRef.current = false; setDragging(false); };

  const legend: [string, string][] = [
    ['hopeful · grateful', '#d4af78'], ['calm · resilient', '#88c8a8'],
    ['growing · reflective', '#c4a0e0'], ['uncertain · anxious', '#a0b8e0'],
  ];

  const liveCount = reflections.filter(r => r.isLive).length;

  return (
    <motion.div
      key="sky"
      className="absolute inset-0"
      style={{ cursor: dragging ? 'grabbing' : 'grab', touchAction: 'none' }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
    >
      {/* Panning layer */}
      <div
        className="absolute inset-0"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px)`,
          transition: dragging ? 'none' : 'transform 0.45s cubic-bezier(0.25,0.46,0.45,0.94)',
          willChange: 'transform',
        }}
      >
        {reflections.map(r => (
          <div key={r.id} className="absolute" style={{ left: `${r.x}%`, top: `${r.y}%` }}>
            <ReflectionStar r={r} active={activeId === r.id} onClick={() => handleClick(r)} />
            <AnimatePresence>
              {labelIds.includes(r.id) && (
                <FloatingLabel key={`lbl-${r.id}`} r={r} onDone={() => removeLabel(r.id)} />
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* Legend */}
      <motion.div
        className="absolute bottom-20 left-10 z-20 flex flex-col gap-2 pointer-events-none"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}
      >
        {legend.map(([label, color]) => (
          <div key={label} className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: color, boxShadow: `0 0 5px ${color}` }} />
            <span className="text-[#444] text-xs tracking-wide">{label}</span>
          </div>
        ))}
      </motion.div>

      {/* Live badge */}
      <AnimatePresence>
        {liveCount > 0 && (
          <motion.div
            className="absolute top-14 left-10 z-20 flex items-center gap-2 pointer-events-none"
            initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="w-2 h-2 rounded-full"
              style={{ background: '#88c8a8', boxShadow: '0 0 8px rgba(136,200,168,0.8)' }}
              animate={{ scale: [1, 1.4, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="text-[#88c8a8] text-xs tracking-widest uppercase">
              {liveCount} live {liveCount === 1 ? 'thought' : 'thoughts'}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Drag hint */}
      <motion.p
        className="absolute top-14 right-10 z-20 pointer-events-none text-[#252535] text-[10px] tracking-widest uppercase"
        animate={{ opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 4, repeat: Infinity }}
      >
        drag to explore
      </motion.p>
    </motion.div>
  );
}

// ─── World Map view ───────────────────────────────────────────────────────────

const TOUR_MS = 6500;
const ZOOM    = 3.0;
const EQ_SCALE = 180 / Math.PI;

function WorldMapView({ reflections }: { reflections: AugReflection[] }) {
  const [idx, setIdx]               = useState(0);
  const [elapsed, setElapsed]       = useState(0);
  const [zoomed, setZoomed]         = useState<AugReflection | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging]     = useState(false);
  const idxRef       = useRef(0);
  const startRef     = useRef(Date.now());
  const draggingRef  = useRef(false);
  const dragStart    = useRef({ sx: 0, sy: 0, ox: 0, oy: 0, moved: false });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => { idxRef.current = idx; }, [idx]);

  // Keep idx in range if reflections shrinks (shouldn't happen, but defensive)
  useEffect(() => {
    if (idx >= reflections.length && reflections.length > 0) setIdx(0);
  }, [reflections.length, idx]);

  const goTo = useCallback((newIdx: number) => {
    idxRef.current   = newIdx;
    startRef.current = Date.now();
    setIdx(newIdx);
    setElapsed(0);
    setDragOffset({ x: 0, y: 0 });
  }, []);

  useEffect(() => {
    const tick = setInterval(() => {
      const e = (Date.now() - startRef.current) / TOUR_MS;
      if (e >= 1) {
        goTo((idxRef.current + 1) % reflections.length);
      } else {
        setElapsed(e);
      }
    }, 50);
    return () => clearInterval(tick);
  }, [goTo, reflections.length]);

  const r     = reflections[Math.min(idx, reflections.length - 1)];
  if (!r) return null;

  const color = EMOTION_COLOR[r.emotion];
  const glow  = EMOTION_GLOW[r.emotion];
  const { x: pinX, y: pinY } = r.location
    ? lngLatToXY(r.location.lat, r.location.lng)
    : { x: 50, y: 50 };

  const region       = r.location ? regionOf(r.location.lat, r.location.lng) : '';
  const mapTransform = `scale(${ZOOM}) translate(${(50 - pinX + dragOffset.x).toFixed(2)}%, ${(50 - pinY + dragOffset.y).toFixed(2)}%)`;

  const handleStarClick = (pin: AugReflection) => {
    if (dragStart.current.moved) return;
    const i = reflections.findIndex(rr => rr.id === pin.id);
    if (i >= 0) goTo(i);
    setZoomed(pin);
  };

  const onPointerDown = (e: React.PointerEvent) => {
    draggingRef.current = true;
    dragStart.current   = { sx: e.clientX, sy: e.clientY, ox: dragOffset.x, oy: dragOffset.y, moved: false };
    setDragging(true);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!draggingRef.current) return;
    const dx = e.clientX - dragStart.current.sx;
    const dy = e.clientY - dragStart.current.sy;
    if (Math.abs(dx) + Math.abs(dy) > 4) dragStart.current.moved = true;
    if (!dragStart.current.moved) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setDragOffset({
      x: dragStart.current.ox + (dx / ZOOM / rect.width)  * 100,
      y: dragStart.current.oy + (dy / ZOOM / rect.height) * 100,
    });
  };
  const onPointerUp = () => { draggingRef.current = false; setDragging(false); };

  const liveCount = reflections.filter(rr => rr.isLive).length;

  return (
    <motion.div key="map" className="absolute inset-0 flex flex-col"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>

      {/* ── Map frame ──────────────────────────────────────────────────── */}
      <div
        ref={containerRef}
        className="absolute left-[30px] right-[30px] top-[72px] bottom-[196px] rounded-2xl overflow-hidden"
        style={{
          border: '1px solid #181825',
          background: '#05050f',
          cursor: dragging ? 'grabbing' : 'grab',
          touchAction: 'none',
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
      >
        {/* Zoom + pan container */}
        <div
          className="absolute inset-0"
          style={{
            transform: mapTransform,
            transformOrigin: 'center center',
            transition: dragging ? 'none' : 'transform 1.5s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          <ComposableMap
            width={360} height={180}
            projection="geoEquirectangular"
            projectionConfig={{ scale: EQ_SCALE, center: [0, 0] }}
            {...({ preserveAspectRatio: 'none' } as any)}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
          >
            <Geographies geography={worldData as any}>
              {({ geographies }) =>
                geographies.map((geo) => (
                  <Geography key={geo.rsmKey} geography={geo}
                    fill="#0d0c1e" stroke="#1e1b30" strokeWidth={0.35}
                    style={{
                      default: { outline: 'none' },
                      hover:   { outline: 'none', fill: '#111028' },
                      pressed: { outline: 'none' },
                    }} />
                ))
              }
            </Geographies>
          </ComposableMap>

          {/* Equator / meridian guides */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.12 }}>
            <line x1="0" y1="50%" x2="100%" y2="50%" stroke="#d4af78" strokeWidth="0.6" strokeDasharray="4 10" />
            <line x1="50%" y1="0" x2="50%" y2="100%" stroke="#d4af78" strokeWidth="0.6" strokeDasharray="4 10" />
          </svg>

          {/* Reflection stars */}
          {reflections.map((pin) => {
            const { x, y } = lngLatToXY(pin.location!.lat, pin.location!.lng);
            const isActive = pin.id === r.id;
            const pColor   = EMOTION_COLOR[pin.emotion];
            const pGlow    = EMOTION_GLOW[pin.emotion];

            return (
              <button
                key={pin.id}
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: `${x}%`, top: `${y}%`,
                  cursor: dragging ? 'grabbing' : 'pointer',
                  pointerEvents: dragging ? 'none' : 'auto',
                }}
                onClick={() => handleStarClick(pin)}
              >
                {/* New-arrival burst */}
                {pin.isNew && (
                  <motion.div
                    className="absolute rounded-full pointer-events-none"
                    style={{ inset: -10, border: `2px solid ${pColor}` }}
                    initial={{ scale: 0.3, opacity: 1 }}
                    animate={{ scale: 4, opacity: 0 }}
                    transition={{ duration: 2, ease: 'easeOut' }}
                  />
                )}

                {/* Pulse rings for active */}
                {isActive && [0, 0.9].map((delay, i) => (
                  <motion.div key={i}
                    className="absolute rounded-full pointer-events-none"
                    style={{ inset: -6, border: `1px solid ${pColor}` }}
                    initial={{ scale: 0.5, opacity: 0.9 }}
                    animate={{ scale: 2.6, opacity: 0 }}
                    transition={{ duration: 2.2, repeat: Infinity, ease: 'easeOut', delay }}
                  />
                ))}

                <motion.div
                  animate={{ scale: isActive ? 1.4 : 1, opacity: isActive ? 1 : pin.isNew ? 0.9 : 0.35 }}
                  transition={{ duration: 0.5 }}
                >
                  <svg
                    width={isActive ? 11 : pin.isNew ? 10 : 7}
                    height={isActive ? 11 : pin.isNew ? 10 : 7}
                    viewBox="0 0 24 24" fill={pColor}
                    style={{ filter: `drop-shadow(0 0 ${isActive || pin.isNew ? 8 : 3}px ${pGlow})` }}
                  >
                    <path d="M12 0l2.9 8.6H24l-7.4 5.4 2.9 8.6L12 17.2l-7.4 5.4 2.9-8.6L0 8.6h9.1z" />
                  </svg>
                </motion.div>
              </button>
            );
          })}
        </div>

        {/* Fixed overlays */}
        <AnimatePresence mode="wait">
          <motion.div key={`city-${r.id}`}
            className="absolute top-5 left-6 z-20 pointer-events-none"
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.5 }}>
            {r.isLive && (
              <p className="text-[9px] tracking-[0.3em] uppercase mb-0.5 text-[#88c8a8]">✦ live</p>
            )}
            <p className="text-[10px] tracking-[0.35em] uppercase mb-1" style={{ color }}>{region}</p>
            <p className="text-white font-light tracking-wide leading-none"
              style={{ fontSize: 'clamp(18px, 2.5vw, 28px)' }}>{r.location?.city}</p>
            <p className="text-[#444] text-xs tracking-widest mt-0.5 uppercase">{r.location?.country}</p>
          </motion.div>
        </AnimatePresence>

        <div className="absolute top-5 right-6 z-20 pointer-events-none flex flex-col items-end gap-1">
          <p className="text-[#2a2a3a] text-xs tracking-[0.2em] uppercase">
            <span style={{ color }}>{idx + 1}</span>
            <span className="text-[#1a1a2a]"> / {reflections.length}</span>
          </p>
          {liveCount > 0 && (
            <div className="flex items-center gap-1.5">
              <motion.div className="w-1.5 h-1.5 rounded-full"
                style={{ background: '#88c8a8', boxShadow: '0 0 6px rgba(136,200,168,0.8)' }}
                animate={{ scale: [1, 1.4, 1] }} transition={{ duration: 2, repeat: Infinity }} />
              <span className="text-[#88c8a8] text-[9px] tracking-widest uppercase">{liveCount} live</span>
            </div>
          )}
        </div>

        <motion.p
          className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 pointer-events-none text-[#2a2a3a] text-[10px] tracking-widest uppercase"
          animate={{ opacity: [0.4, 0.9, 0.4] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          drag to explore · tap star to read
        </motion.p>

        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#0a0a12] z-20 pointer-events-none">
          <div className="h-full rounded-full"
            style={{ background: color, width: `${elapsed * 100}%`, transition: 'none' }} />
        </div>
      </div>

      {/* Quote card */}
      <div className="absolute left-[30px] right-[30px] bottom-[60px]">
        <AnimatePresence mode="wait">
          <motion.div key={`card-${r.id}`}
            className="rounded-2xl px-6 py-5"
            style={{
              background: 'rgba(8,8,15,0.92)',
              border: `1px solid ${color}${r.isNew ? '55' : '2e'}`,
              boxShadow: `0 0 50px ${glow.replace('0.7', r.isNew ? '0.18' : '0.08')}, inset 0 0 30px rgba(0,0,0,0.3)`,
            }}
            initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{ background: color, boxShadow: `0 0 6px ${glow}` }} />
              <p className="text-[10px] tracking-[0.3em] uppercase" style={{ color }}>{r.category}</p>
              {r.isLive && (
                <span className="ml-1 text-[9px] tracking-[0.25em] uppercase text-[#88c8a8]">✦ live</span>
              )}
              <p className="text-[#252535] text-[10px] ml-auto tracking-widest uppercase">{r.emotion}</p>
            </div>
            <p className="text-[#e8dcc8] font-light leading-relaxed"
              style={{ fontSize: 'clamp(13px, 1.6vw, 17px)' }}>
              "{r.text}"
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Nav */}
      <div className="absolute bottom-0 left-0 right-0 h-[56px] flex items-center justify-center gap-4 z-30">
        <motion.button className="w-8 h-8 rounded-full flex items-center justify-center text-sm"
          style={{ border: '1px solid #1c1c2a', color: '#333' }}
          whileHover={{ borderColor: '#333', color: '#888' }} whileTap={{ scale: 0.88 }}
          onClick={() => goTo((idx - 1 + reflections.length) % reflections.length)}>←</motion.button>
        <div className="flex gap-[5px] items-center">
          {reflections.map((_, i) => (
            <motion.button key={i} onClick={() => goTo(i)}
              animate={{ width: i === idx ? 18 : 5, opacity: i === idx ? 1 : 0.3 }}
              transition={{ duration: 0.35 }}
              className="h-[5px] rounded-full"
              style={{ background: i === idx ? color : '#d4af78', minWidth: 5 }} />
          ))}
        </div>
        <motion.button className="w-8 h-8 rounded-full flex items-center justify-center text-sm"
          style={{ border: `1px solid ${color}55`, color }}
          whileHover={{ borderColor: color }} whileTap={{ scale: 0.88 }}
          onClick={() => goTo((idx + 1) % reflections.length)}>→</motion.button>
      </div>

      {/* Click-to-read overlay */}
      <AnimatePresence>
        {zoomed && (
          <motion.div
            className="absolute inset-0 z-[100] flex items-center justify-center"
            style={{ background: 'rgba(4,4,12,0.82)', backdropFilter: 'blur(12px)' }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            onClick={() => setZoomed(null)}
          >
            <motion.div
              className="relative mx-10 rounded-3xl px-10 py-9 max-w-2xl w-full"
              style={{
                background: 'rgba(6,6,16,0.98)',
                border: `1px solid ${EMOTION_COLOR[zoomed.emotion]}33`,
                boxShadow: `0 0 100px ${EMOTION_GLOW[zoomed.emotion].replace('0.7', '0.22')}, inset 0 0 60px rgba(0,0,0,0.5)`,
              }}
              initial={{ scale: 0.82, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.82, opacity: 0, y: 20 }}
              transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
              onClick={e => e.stopPropagation()}
            >
              <button
                className="absolute top-5 right-6 text-[#333] hover:text-[#666] transition-colors text-lg leading-none"
                onClick={() => setZoomed(null)}
              >✕</button>

              {zoomed.isLive && (
                <div className="flex items-center gap-2 mb-4">
                  <motion.div className="w-1.5 h-1.5 rounded-full"
                    style={{ background: '#88c8a8', boxShadow: '0 0 8px rgba(136,200,168,0.8)' }}
                    animate={{ scale: [1, 1.4, 1] }} transition={{ duration: 2, repeat: Infinity }} />
                  <span className="text-[#88c8a8] text-xs tracking-[0.3em] uppercase">Live from the app</span>
                </div>
              )}

              <div className="flex items-center gap-3 mb-6">
                <motion.div className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ background: EMOTION_COLOR[zoomed.emotion], boxShadow: `0 0 10px ${EMOTION_GLOW[zoomed.emotion]}` }}
                  animate={{ scale: [1, 1.4, 1] }} transition={{ duration: 2, repeat: Infinity }} />
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] mb-0.5" style={{ color: EMOTION_COLOR[zoomed.emotion] }}>
                    {zoomed.category} · {regionOf(zoomed.location!.lat, zoomed.location!.lng)}
                  </p>
                  <p className="text-white font-light tracking-wide" style={{ fontSize: 'clamp(18px, 2.2vw, 28px)' }}>
                    {zoomed.location?.city}
                    <span className="text-[#333] text-sm ml-2 uppercase tracking-widest">{zoomed.location?.country}</span>
                  </p>
                </div>
              </div>

              <p className="text-[#f0e6cc] font-light leading-relaxed mb-7"
                style={{ fontSize: 'clamp(16px, 2vw, 24px)', lineHeight: 1.65 }}>
                "{zoomed.text}"
              </p>

              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full text-xs uppercase tracking-widest"
                  style={{
                    background: `${EMOTION_COLOR[zoomed.emotion]}18`,
                    color: EMOTION_COLOR[zoomed.emotion],
                    border: `1px solid ${EMOTION_COLOR[zoomed.emotion]}30`,
                  }}>
                  {zoomed.emotion}
                </span>
                {zoomed.tags.map(tag => (
                  <span key={tag} className="text-[#2a2a3a] text-xs">{tag}</span>
                ))}
                <span className="ml-auto text-[#1a1a2a] text-xs">anonymous · becoming</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Main exhibition screen ───────────────────────────────────────────────────

const NEW_THRESHOLD_MS = 3 * 60 * 1000; // 3 min = "just arrived"

export default function ExhibitionSkyScreen() {
  const [view, setView]               = useState<'sky' | 'map'>('sky');
  const [count, setCount]             = useState(2847);
  const [liveReflections, setLive]    = useState<AugReflection[]>([]);
  const knownIdsRef                   = useRef<Set<string>>(new Set());

  // Fake counter
  useEffect(() => {
    const t = setInterval(() => setCount(c => c + Math.floor(Math.random() * 3)), 8000);
    return () => clearInterval(t);
  }, []);

  // Poll for live reflections every 5 s
  useEffect(() => {
    const fetchLive = async () => {
      try {
        const res  = await fetch('/api/reflections');
        const data = await res.json();
        const now  = Date.now();

        const mapped: AugReflection[] = (data.reflections ?? []).map((r: any) => {
          const { x, y } = lngLatToXY(r.lat ?? r.location?.lat ?? 0, r.lng ?? r.location?.lng ?? 0);
          const isNew    = (now - new Date(r.createdAt).getTime()) < NEW_THRESHOLD_MS &&
                           !knownIdsRef.current.has(r.id);
          return {
            id:        r.id,
            text:      r.text,
            emotion:   r.emotion,
            category:  r.category,
            mood:      r.mood,
            tags:      r.tags ?? [],
            createdAt: r.createdAt,
            location:  { city: r.city, country: r.country, lat: r.lat, lng: r.lng },
            x, y,
            size: 8,
            isLive: true,
            isNew,
          } satisfies AugReflection;
        });

        // Mark all current IDs as known after first load
        mapped.forEach(r => knownIdsRef.current.add(r.id));
        setLive(mapped);
        setCount(c => c + mapped.filter(r => r.isNew).length);
      } catch {
        // server might not be running; silently ignore
      }
    };

    fetchLive();
    const interval = setInterval(fetchLive, 5000);
    return () => clearInterval(interval);
  }, []);

  // Merge: live first (so tour visits them early), then mock
  const allReflections: AugReflection[] = [
    ...liveReflections,
    ...MOCK_REFLECTIONS,
  ];

  const liveCount = liveReflections.length;

  return (
    <div className="relative w-full h-full bg-[#08080f] overflow-hidden select-none">
      <BgStarfield />
      <NebulaLayer />

      {/* Wordmark */}
      <motion.div className="absolute top-[18px] left-10 z-20"
        initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, delay: 0.2 }}>
        <p className="text-[#d4af78] font-light tracking-[0.25em] uppercase"
          style={{ fontSize: 'clamp(20px, 2.5vw, 34px)' }}>Becoming</p>
        <p className="text-[#333] text-xs tracking-widest mt-0.5">you are not alone in this</p>
      </motion.div>

      {/* View toggle */}
      <motion.div className="absolute top-[18px] right-10 z-20 flex gap-[6px]"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
        {(['sky', 'map'] as const).map(v => (
          <motion.button key={v}
            className="px-4 py-1.5 rounded-full text-xs font-light tracking-widest uppercase"
            style={{
              background: view === v ? 'rgba(212,175,120,0.12)' : 'transparent',
              border: `1px solid ${view === v ? '#d4af7877' : '#1e1e2a'}`,
              color: view === v ? '#d4af78' : '#333',
            }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setView(v)}
          >
            {v === 'sky' ? '✦ Sky' : '🌍 Map'}
          </motion.button>
        ))}
      </motion.div>

      {/* Hint */}
      <motion.p className="absolute top-[22px] left-1/2 -translate-x-1/2 z-20 text-[#252535] text-xs tracking-wide"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}>
        {view === 'sky' ? 'drag to explore · tap a star to read' : 'drag to explore · tap star · auto-tours'}
      </motion.p>

      {/* Views */}
      <AnimatePresence mode="wait">
        {view === 'sky'
          ? <SkyView key="sky" reflections={allReflections} />
          : <WorldMapView key="map" reflections={allReflections} />
        }
      </AnimatePresence>

      {/* Bottom bar */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-14 z-20 flex items-center justify-center gap-10"
        style={{ background: 'linear-gradient(to top, #08080f 70%, transparent)' }}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
        <span className="text-[#252535] text-xs tracking-widest uppercase">
          <span className="text-[#d4af78] font-medium">{(count + liveCount).toLocaleString()}</span>{'  '}thoughts shared
        </span>
        <span className="text-[#1a1a1a]">·</span>
        <span className="text-[#252535] text-xs tracking-widest uppercase">each star is someone trying</span>
        <span className="text-[#1a1a1a]">·</span>
        <span className="text-[#252535] text-xs tracking-widest uppercase">all anonymous</span>
      </motion.div>
    </div>
  );
}
