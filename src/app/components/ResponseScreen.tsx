import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Starfield } from './CosmicElements';

// ─── Mood → emotion mapping ───────────────────────────────────────────────────

const MOOD_EMOTION: Record<string, string> = {
  '😔': 'tired',
  '😐': 'uncertain',
  '🙂': 'accepting',
  '😊': 'hopeful',
  '🌟': 'grateful',
};

const MOOD_CATEGORY: Record<string, string> = {
  '😔': 'Wellbeing',
  '😐': 'Life',
  '🙂': 'Growth',
  '😊': 'Growth',
  '🌟': 'Connection',
};

// ─── Share to board ───────────────────────────────────────────────────────────

type ShareState = 'idle' | 'locating' | 'submitting' | 'done' | 'denied' | 'error';

async function reverseGeocode(lat: number, lng: number): Promise<{ city: string; country: string }> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
      { headers: { 'Accept-Language': 'en' } }
    );
    const data = await res.json();
    const addr = data.address ?? {};
    const city =
      addr.city || addr.town || addr.village || addr.municipality ||
      addr.county || addr.state || 'Unknown';
    const country = (addr.country_code ?? '??').toUpperCase();
    return { city, country };
  } catch {
    return { city: 'Unknown', country: '??' };
  }
}

async function submitToBoard(payload: {
  text: string; emotion: string; category: string; mood: string;
  tags: string[]; city: string; country: string; lat: number; lng: number;
}): Promise<void> {
  const res = await fetch('/api/reflections', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Server error');
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ResponseScreen({ onNavigate, setReflections, reflections, isDesktop }: any) {
  const [activeTab, setActiveTab]     = useState<'reflect' | 'action' | 'share'>('reflect');
  const [reflectionText, setReflectionText] = useState('');
  const [selectedTags, setSelectedTags]     = useState<string[]>([]);
  const [selectedMood, setSelectedMood]     = useState<string | null>(null);

  // Share-to-board state
  const [shareEnabled, setShareEnabled] = useState(false);
  const [shareState, setShareState]     = useState<ShareState>('idle');
  const [sharedCity, setSharedCity]     = useState<string | null>(null);

  const tags  = ['#fear', '#courage', '#growth'];
  const moods = ['😔', '😐', '🙂', '😊', '🌟'];

  const handleSave = async () => {
    const newEntry = {
      text: reflectionText,
      tags: selectedTags,
      mood: selectedMood,
      date: new Date().toISOString(),
      type: activeTab,
    };
    setReflections([...reflections, newEntry]);

    // Share to board if toggle is on
    if (shareEnabled && reflectionText.trim()) {
      setShareState('locating');
      try {
        const pos = await new Promise<GeolocationPosition>((resolve, reject) =>
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            timeout: 10_000,
            enableHighAccuracy: false,
          })
        );
        const { latitude: lat, longitude: lng } = pos.coords;

        setShareState('submitting');
        const { city, country } = await reverseGeocode(lat, lng);
        await submitToBoard({
          text:     reflectionText,
          emotion:  MOOD_EMOTION[selectedMood ?? ''] ?? 'hopeful',
          category: MOOD_CATEGORY[selectedMood ?? ''] ?? 'Growth',
          mood:     selectedMood ?? '🙂',
          tags:     selectedTags,
          city, country, lat, lng,
        });
        setSharedCity(city);
        setShareState('done');
        // Wait a beat so user sees the confirmation, then navigate
        setTimeout(() => onNavigate('solidarity'), 1400);
      } catch (err: any) {
        if (err?.code === 1 /* PERMISSION_DENIED */) {
          setShareState('denied');
        } else {
          setShareState('error');
        }
        // Still navigate after a moment
        setTimeout(() => onNavigate('solidarity'), 2000);
      }
    } else {
      onNavigate('solidarity');
    }
  };

  const shareButtonLabel = () => {
    switch (shareState) {
      case 'locating':   return 'Finding your location…';
      case 'submitting': return 'Sending to board…';
      case 'done':       return `✓ Your star is live from ${sharedCity}`;
      case 'denied':     return 'Location denied — saving privately';
      case 'error':      return 'Could not reach board — saving privately';
      default:           return null;
    }
  };

  const isSharing = shareState === 'locating' || shareState === 'submitting';

  // ── Shared content blocks ─────────────────────────────────────────────────────

  const backButton = (
    <motion.button
      className="text-[#888888] text-[14px] cursor-pointer self-start"
      whileTap={{ scale: 0.95 }}
      onClick={() => onNavigate('today')}
    >
      ← Back
    </motion.button>
  );

  const promptRecap = (
    <div className="bg-[#0b0a18] border border-[#333333] rounded-[12px] px-[16px] py-[14px]">
      <p className="font-medium text-[#888888] text-[13px] leading-[1.4]">
        {`"What's one thing you've been putting off because of fear?"`}
      </p>
    </div>
  );

  const tabBar = (
    <div className="flex gap-0">
      {['reflect', 'action', 'share'].map((tab) => (
        <motion.button
          key={tab}
          className={`${activeTab === tab ? 'bg-[#d4af78]' : 'bg-[#0b0a18]'} border border-[#333333] h-[36px] flex-1 rounded-[8px] cursor-pointer`}
          style={{ boxShadow: activeTab === tab ? '0 0 16px rgba(212, 175, 120, 0.3)' : 'none' }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setActiveTab(tab as any)}
        >
          <p className={`text-[13px] ${activeTab === tab ? 'text-[#08080f] font-bold' : 'text-[#888888] font-normal'}`}>
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </p>
        </motion.button>
      ))}
    </div>
  );

  const textInput = (
    <div>
      <div className="bg-[#0b0a18] border border-[#333333] rounded-[12px] overflow-hidden" style={{ height: '200px' }}>
        <textarea
          className="w-full h-full p-[16px] bg-transparent outline-none resize-none text-[13px] text-[#f0e6cc] placeholder:text-[#8888a0]"
          placeholder="Write your reflection here..."
          value={reflectionText}
          onChange={(e) => setReflectionText(e.target.value)}
          maxLength={280}
          style={{ lineHeight: '1.6' }}
        />
      </div>
      <p className="font-normal text-[#8888a0] text-[11px] text-right mt-[6px]">
        {reflectionText.length} / 280
      </p>
    </div>
  );

  const tagsBlock = (
    <div>
      <p className="font-bold text-[#f0e6cc] text-[13px] mb-[10px]">Tag this moment:</p>
      <div className="flex gap-[8px] flex-wrap">
        {tags.map((tag) => (
          <motion.button
            key={tag}
            className={`${selectedTags.includes(tag) ? 'bg-[#d4af78] border-[#d4af78]' : 'bg-[#0b0a18] border-[#333333]'} border h-[28px] px-[10px] rounded-[14px] cursor-pointer flex items-center`}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedTags(
              selectedTags.includes(tag)
                ? selectedTags.filter((t) => t !== tag)
                : [...selectedTags, tag]
            )}
          >
            <p className={`text-[11px] ${selectedTags.includes(tag) ? 'text-[#08080f]' : 'text-[#888888]'}`}>{tag}</p>
          </motion.button>
        ))}
        <div className="bg-[#0b0a18] border border-[#333333] h-[28px] px-[10px] rounded-[14px] flex items-center">
          <p className="text-[#888888] text-[11px]">+ Add</p>
        </div>
      </div>
    </div>
  );

  const moodBlock = (
    <div>
      <p className="font-bold text-[#f0e6cc] text-[13px] mb-[10px]">How do you feel?</p>
      <div className="flex gap-[12px]">
        {moods.map((mood) => (
          <motion.button
            key={mood}
            className={`${selectedMood === mood ? 'bg-[#0b0a18] border-[#d4af78]' : 'bg-[#0b0a18] border-[#222222]'} border rounded-[12px] size-[54px] cursor-pointer flex items-center justify-center`}
            style={{ boxShadow: selectedMood === mood ? '0 0 16px rgba(212, 175, 120, 0.3)' : 'none' }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedMood(mood)}
          >
            <p className="text-[22px]">{mood}</p>
          </motion.button>
        ))}
      </div>
    </div>
  );

  const shareToggle = (
    <div
      className="rounded-[16px] px-[16px] py-[14px] flex items-center justify-between"
      style={{
        background: shareEnabled ? 'rgba(212,175,120,0.07)' : 'rgba(11,10,24,0.6)',
        border: `1px solid ${shareEnabled ? 'rgba(212,175,120,0.35)' : '#222222'}`,
        transition: 'all 0.3s ease',
      }}
    >
      <div>
        <p className="text-[#f0e6cc] text-[13px] font-medium mb-[2px]">✦ Share to Exhibition Board</p>
        <p className="text-[#8888a0] text-[10px]">Anonymous · your words appear on the world map</p>
      </div>
      <motion.button
        className="relative flex-shrink-0 ml-[10px]"
        onClick={() => { if (shareState === 'idle') setShareEnabled(!shareEnabled); }}
        whileTap={{ scale: 0.92 }}
      >
        <div
          className="w-[44px] h-[24px] rounded-[12px] relative"
          style={{
            background: shareEnabled ? '#d4af78' : '#1a1a1a',
            transition: 'background 0.25s ease',
            boxShadow: shareEnabled ? '0 0 14px rgba(212,175,120,0.45)' : 'none',
          }}
        >
          <motion.div
            className="absolute top-[2px] w-[20px] h-[20px] rounded-full bg-white"
            animate={{ left: shareEnabled ? 22 : 2 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          />
        </div>
      </motion.button>
    </div>
  );

  const shareStatus = (
    <AnimatePresence>
      {shareState !== 'idle' && shareButtonLabel() && (
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <p
            className="text-[12px] tracking-wide"
            style={{
              color:
                shareState === 'done'   ? '#88c8a8' :
                shareState === 'denied' || shareState === 'error' ? '#e0a888' :
                '#d4af78',
            }}
          >
            {shareState === 'locating' || shareState === 'submitting' ? (
              <span className="inline-flex items-center gap-[6px]">
                <motion.span animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.2, repeat: Infinity }}>
                  ✦
                </motion.span>
                {shareButtonLabel()}
              </span>
            ) : shareButtonLabel()}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );

  const saveButton = (
    <motion.button
      className="w-full h-[54px] rounded-[27px] cursor-pointer disabled:opacity-30"
      style={{
        background: '#d4af78',
        boxShadow: reflectionText ? '0 0 24px rgba(212, 175, 120, 0.4)' : 'none',
      }}
      whileHover={{ scale: reflectionText ? 1.02 : 1 }}
      whileTap={{ scale: reflectionText ? 0.98 : 1 }}
      onClick={handleSave}
      disabled={!reflectionText || isSharing}
    >
      <p className="font-bold text-[#08080f] text-[16px] text-center whitespace-pre">
        {isSharing ? '…' : `Save to Your Sky  ✦`}
      </p>
    </motion.button>
  );

  // ── Desktop layout ─────────────────────────────────────────────────────────
  if (isDesktop) {
    return (
      <div className="bg-[#08080f] relative size-full overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
        <Starfield density={25} />
        <div className="relative z-[1] min-h-full py-[40px]">
          <div className="w-full max-w-[520px] mx-auto px-[24px] flex flex-col gap-[16px]">
            {/* Back + Title row */}
            <div className="flex items-center gap-[16px]">
              {backButton}
              <p className="font-bold text-[#f0e6cc] text-[20px]">Respond</p>
            </div>
            <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#333333] to-transparent" />
            {promptRecap}
            {tabBar}
            {textInput}
            {tagsBlock}
            {moodBlock}
            {shareToggle}
            {shareStatus}
            {saveButton}
          </div>
        </div>
      </div>
    );
  }

  // ── Mobile layout ──────────────────────────────────────────────────────────
  return (
    <div className="bg-[#08080f] overflow-hidden relative rounded-[36px] size-full flex flex-col" style={{ scrollbarWidth: 'none' }}>
      <Starfield density={25} />

      {/* Header bar */}
      <div className="relative z-10 shrink-0 flex items-center justify-between px-[17px] pt-[56px] pb-[12px]">
        <motion.button
          className="text-[#888888] text-[14px] cursor-pointer"
          whileTap={{ scale: 0.95 }}
          onClick={() => onNavigate('today')}
        >
          ← Back
        </motion.button>
        <p className="font-bold text-[#f0e6cc] text-[18px]">Respond</p>
        <div className="w-[48px]" />
      </div>

      <div className="relative z-10 shrink-0 h-[1px] mx-[17px] bg-gradient-to-r from-transparent via-[#333333] to-transparent" />

      {/* Scrollable form content */}
      <div className="relative z-[1] flex-1 overflow-y-auto px-[17px] pt-[12px] pb-[16px] flex flex-col gap-[14px]" style={{ scrollbarWidth: 'none' }}>
        {promptRecap}
        {tabBar}
        {textInput}
        {tagsBlock}
        {moodBlock}
        {shareToggle}
        {shareStatus}
        {saveButton}
      </div>

      {/* Home indicator */}
      <div className="shrink-0 h-[24px] flex items-center justify-center">
        <div className="bg-[#333333] h-[4px] rounded-[2px] w-[100px]" />
      </div>
    </div>
  );
}
