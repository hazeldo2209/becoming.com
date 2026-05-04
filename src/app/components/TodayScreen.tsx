import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Starfield, NebulaGlow } from './CosmicElements';

function NavIcon({ type, active, onClick }: any) {
  const icons: any = {
    today: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <rect x="3" y="4" width="14" height="13" rx="2" stroke={active ? "#d4af78" : "#555555"} strokeWidth="1.5" />
        <path d="M3 8h14" stroke={active ? "#d4af78" : "#555555"} strokeWidth="1.5" />
        <path d="M7 2v3M13 2v3" stroke={active ? "#d4af78" : "#555555"} strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    sky: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M10 2l2.4 7.2h7.6l-6.2 4.5 2.4 7.3-6.2-4.5-6.2 4.5 2.4-7.3-6.2-4.5h7.6z" fill={active ? "#d4af78" : "#555555"} />
      </svg>
    ),
    ai: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="10" r="7" stroke={active ? "#c4a0e0" : "#555555"} strokeWidth="1.5" />
        <path d="M7 9h6M7 11h6M7 13h4" stroke={active ? "#c4a0e0" : "#555555"} strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    profile: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="7" r="3" stroke="#555555" strokeWidth="1.5" />
        <path d="M4 17c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="#555555" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    )
  };

  return (
    <motion.button
      className="flex flex-col gap-[6px] items-center w-[60px] cursor-pointer"
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
    >
      {icons[type]}
      <p className={`text-[12px] ${active ? 'text-[#d4af78] font-medium' : 'text-[#8888a0] font-normal'}`}>
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </p>
    </motion.button>
  );
}

export default function TodayScreen({ onNavigate }: any) {
  const [doneAnyway, setDoneAnyway] = useState(false);

  const handleDoneAnyway = () => {
    setDoneAnyway(true);
    setTimeout(() => onNavigate('sky'), 900);
  };

  return (
    <div className="bg-[#08080f] overflow-hidden relative rounded-[36px] size-full">
      <Starfield density={30} />

      {/* Status bar */}
      <div className="absolute h-[44px] left-0 top-0 w-full z-10 bg-gradient-to-b from-[#08080f] to-transparent" />
      <p className="absolute font-bold left-[13px] text-[#f0e6cc] text-[13px] top-[10px] z-10">9:41</p>
      <p className="absolute font-normal left-[317px] text-[#888888] text-[11px] top-[11px] z-10">▶ ▶▶ ▊▊</p>

      {/* Header */}
      <p className="absolute font-bold left-[17px] text-[#f0e6cc] text-[24px] top-[55px]">Today</p>
      <p className="absolute font-normal right-[17px] text-[#888888] text-[13px] top-[62px]">Sun, Apr 5</p>

      <div className="absolute h-[1px] left-[17px] right-[17px] top-[95px] bg-gradient-to-r from-transparent via-[#333333] to-transparent" />

      {/* Daily Prompt Card */}
      <NebulaGlow color="gold" className="w-[250px] h-[200px] left-[70px] top-[100px]" />

      <motion.div
        className="absolute bg-[#0b0a18] border border-[#333333] h-[160px] left-[17px] rounded-[16px] top-[111px] w-[350px] cursor-pointer overflow-hidden"
        style={{
          boxShadow: '0 4px 24px rgba(0, 0, 0, 0.4)'
        }}
        whileHover={{ scale: 1.01, borderColor: '#d4af78' }}
        whileTap={{ scale: 0.99 }}
        onClick={() => onNavigate('respond')}
      >
        {/* Gold accent bar */}
        <div className="absolute h-[4px] left-0 top-0 w-full bg-gradient-to-r from-[#d4af78] via-[#d4af78] to-transparent" />

        <p className="absolute font-bold left-[16px] text-[#888888] text-[12px] tracking-wider top-[20px]">
          DAILY PROMPT
        </p>

        <div className="absolute font-medium left-[16px] text-[#f0e6cc] text-[16px] top-[42px] w-[310px] leading-[1.4]">
          <p className="mb-0">{`"What's one thing you've been`}</p>
          <p>{`putting off because of fear?"`}</p>
        </div>

        <div className="absolute h-[1px] left-[16px] right-[16px] top-[105px] bg-[#222222]" />

        <p className="absolute font-normal left-[16px] text-[#888888] text-[11px] top-[118px] whitespace-pre">
          ✦  Reflect  ·  Take action  ·  Share
        </p>

        {/* "I did it anyway" — past-tense secondary action */}
        <AnimatePresence>
          {!doneAnyway ? (
            <motion.button
              key="btn"
              className="absolute right-[14px] bottom-[14px] cursor-pointer"
              whileTap={{ scale: 0.9 }}
              onClick={(e) => { e.stopPropagation(); handleDoneAnyway(); }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <p className="text-[#555568] text-[11px]">I did it anyway ✦</p>
            </motion.button>
          ) : (
            <motion.div
              key="star"
              className="absolute right-[14px] bottom-[14px] flex items-center gap-[4px]"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 18 }}
            >
              <motion.p
                className="text-[#d4af78] text-[16px]"
                animate={{ rotate: [0, 20, -20, 10, 0], scale: [1, 1.4, 1] }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              >✦</motion.p>
              <p className="text-[#d4af78] text-[11px] font-medium">Star added!</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Focus Areas */}
      <p className="absolute font-bold left-[17px] text-[#f0e6cc] text-[14px] top-[289px]">
        Your Focus Areas
      </p>

      <div className="absolute left-[17px] top-[311px] flex gap-[8px] flex-wrap">
        {['Career', 'Creativity', 'Connection', 'Health'].map((area) => (
          <div
            key={area}
            className="bg-[#0b0a18] border border-[#333333] px-[12px] h-[30px] rounded-[15px] flex items-center"
          >
            <p className="font-normal text-[#888888] text-[12px]">{area}</p>
          </div>
        ))}
      </div>

      {/* This Week Calendar */}
      <p className="absolute font-bold left-[17px] text-[#f0e6cc] text-[14px] top-[359px]">This Week</p>

      <div className="absolute left-[17px] top-[383px] flex gap-[14px]">
        {[
          { day: 'M', date: '30' },
          { day: 'T', date: '31' },
          { day: 'W', date: '1' },
          { day: 'T', date: '2' },
          { day: 'F', date: '3' },
          { day: 'S', date: '4' },
          { day: 'S', date: '5', active: true }
        ].map((item, idx) => (
          <div
            key={idx}
            className={`${
              item.active ? 'bg-[#d4af78] border-[#d4af78]' : 'bg-[#0b0a18] border-[#222222]'
            } border border-solid h-[52px] rounded-[10px] w-[36px] flex flex-col items-center justify-center`}
            style={{
              boxShadow: item.active ? '0 0 16px rgba(212, 175, 120, 0.3)' : 'none'
            }}
          >
            <p className={`text-[12px] ${item.active ? 'text-[#08080f]' : 'text-[#888888]'}`}>
              {item.day}
            </p>
            <p className={`text-[14px] font-bold mt-1 ${item.active ? 'text-[#08080f]' : 'text-[#f0e6cc]'}`}>
              {item.date}
            </p>
          </div>
        ))}
      </div>

      {/* Streak banner */}
      <div className="absolute bg-[#0b0a18] border border-[#333333] h-[44px] left-[17px] rounded-[10px] top-[451px] w-[350px] flex items-center px-[16px]">
        <p className="font-normal text-[#f0e6cc] text-[13px]">
          🔥 <span className="text-[#d4af78]">7-day streak</span> · Keep it going!
        </p>
      </div>

      {/* Quick actions */}
      <div className="absolute left-[17px] top-[515px] flex gap-[10px]">
        <motion.button
          className="bg-[#0b0a18] border border-[#333333] px-[16px] h-[36px] rounded-[18px] flex items-center cursor-pointer"
          whileHover={{ scale: 1.02, borderColor: '#c4a0e0' }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onNavigate('ai')}
        >
          <p className="font-normal text-[#c4a0e0] text-[12px]">✦ Ask AI</p>
        </motion.button>
      </div>

      {/* Bottom nav */}
      <div className="absolute bg-[#0b0a18] border-t border-[#1a1a1a] flex gap-[31px] h-[90px] items-center justify-center left-0 bottom-0 w-full">
        <NavIcon type="today" active={true} onClick={() => onNavigate('today')} />
        <NavIcon type="sky" active={false} onClick={() => onNavigate('sky')} />
        <NavIcon type="ai" active={false} onClick={() => onNavigate('ai')} />
        <NavIcon type="profile" active={false} onClick={() => onNavigate('profile')} />
      </div>

      {/* Home indicator */}
      <div className="absolute bg-[#333333] h-[4px] left-[142px] rounded-[2px] bottom-[8px] w-[100px]" />
    </div>
  );
}
