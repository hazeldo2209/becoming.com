import { motion } from 'motion/react';
import { Starfield, NebulaGlow } from './CosmicElements';
import { useTheme } from '../context/ThemeContext';

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
        <circle cx="10" cy="7" r="3" stroke={active ? "#d4af78" : "#555555"} strokeWidth="1.5" />
        <path d="M4 17c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke={active ? "#d4af78" : "#555555"} strokeWidth="1.5" strokeLinecap="round" />
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

export default function ProfileScreen({ onNavigate, reflections }: any) {
  const { isDark, toggle } = useTheme();

  return (
    <div className="bg-[#08080f] overflow-hidden relative rounded-[36px] size-full">
      <Starfield density={30} />
      <NebulaGlow color="gold" className="w-[280px] h-[280px] left-[55px] top-[140px]" />

      {/* Status bar */}
      <div className="absolute h-[44px] left-0 top-0 w-full z-20 bg-gradient-to-b from-[#08080f] to-transparent pointer-events-none" />
      <p className="absolute font-bold left-[13px] text-[#f0e6cc] text-[13px] top-[10px] z-20">9:41</p>
      <p className="absolute font-normal left-[317px] text-[#888888] text-[11px] top-[11px] z-20">▶ ▶▶ ▊▊</p>

      {/* Scrollable content — sits between status bar and nav */}
      <div
        className="absolute top-0 left-0 right-0 bottom-[90px] overflow-y-auto"
        style={{ scrollbarWidth: 'none' }}
      >
        {/* Header */}
        <div className="pt-[55px] px-[17px]">
          <p className="font-bold text-[#f0e6cc] text-[24px]">Profile</p>
        </div>

        <div className="h-[1px] mx-[17px] mt-[14px] bg-gradient-to-r from-transparent via-[#333333] to-transparent" />

        {/* Avatar */}
        <motion.div
          className="px-[17px] pt-[24px] flex flex-col items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="size-[80px] rounded-full bg-gradient-to-br from-[#d4af78] to-[#c4a0e0] flex items-center justify-center mb-[16px]"
            style={{ boxShadow: '0 0 24px rgba(212, 175, 120, 0.3)' }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="size-[76px] rounded-full bg-[#08080f] flex items-center justify-center">
              <p className="text-[32px] text-[#d4af78]">✦</p>
            </div>
          </motion.div>
          <p className="font-bold text-[#f0e6cc] text-[20px] mb-[4px]">Stargazer</p>
          <p className="text-[#888888] text-[12px]">Becoming since April 2026</p>
        </motion.div>

        {/* Journey Stats */}
        <motion.div
          className="px-[17px] pt-[20px] flex gap-[12px]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="flex-1 bg-[#0b0a18] border border-[#333333] rounded-[12px] px-[16px] py-[14px] flex flex-col items-center" style={{ boxShadow: '0 0 20px rgba(212, 175, 120, 0.1)' }}>
            <p className="text-[#d4af78] text-[24px] font-bold mb-[2px]">{reflections.length}</p>
            <p className="text-[#888888] text-[12px]">Stars</p>
          </div>
          <div className="flex-1 bg-[#0b0a18] border border-[#333333] rounded-[12px] px-[16px] py-[14px] flex flex-col items-center" style={{ boxShadow: '0 0 20px rgba(196, 160, 224, 0.1)' }}>
            <p className="text-[#c4a0e0] text-[24px] font-bold mb-[2px]">2</p>
            <p className="text-[#888888] text-[12px]">Constellations</p>
          </div>
          <div className="flex-1 bg-[#0b0a18] border border-[#333333] rounded-[12px] px-[16px] py-[14px] flex flex-col items-center" style={{ boxShadow: '0 0 20px rgba(212, 175, 120, 0.1)' }}>
            <p className="text-[#d4af78] text-[24px] font-bold mb-[2px]">5</p>
            <p className="text-[#888888] text-[12px]">Day Streak</p>
          </div>
        </motion.div>

        {/* Settings Section */}
        <motion.div
          className="px-[17px] pt-[20px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <p className="font-bold text-[#f0e6cc] text-[14px] mb-[12px]">Settings</p>
          <div className="bg-[#0b0a18] border border-[#333333] rounded-[12px] overflow-hidden">
            <SettingRow icon="👤" label="Edit Profile" onClick={() => {}} />
            <div className="h-[1px] bg-[#1a1a1a] mx-[14px]" />
            <SettingRow icon="🔔" label="Notifications" onClick={() => {}} />
            <div className="h-[1px] bg-[#1a1a1a] mx-[14px]" />
            <SettingRow icon="🌙" label="Reflection Reminders" onClick={() => {}} />
            <div className="h-[1px] bg-[#1a1a1a] mx-[14px]" />
            <ThemeToggleRow isDark={isDark} onToggle={toggle} />
            <div className="h-[1px] bg-[#1a1a1a] mx-[14px]" />
            <SettingRow icon="🔒" label="Privacy & Security" onClick={() => {}} />
          </div>
        </motion.div>

        {/* Account Section */}
        <motion.div
          className="px-[17px] pt-[20px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <p className="font-bold text-[#f0e6cc] text-[14px] mb-[12px]">Account</p>
          <div className="bg-[#0b0a18] border border-[#333333] rounded-[12px] overflow-hidden">
            <SettingRow icon="📧" label="Email & Password" onClick={() => {}} />
          </div>
        </motion.div>

        {/* Sign Out Button */}
        <motion.div
          className="px-[17px] pt-[12px] pb-[24px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <motion.button
            className="w-full bg-[#0b0a18] border border-[#d4af78] rounded-[12px] h-[48px] flex items-center justify-center"
            style={{ boxShadow: '0 0 20px rgba(212, 175, 120, 0.2)' }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onNavigate('welcome')}
          >
            <p className="text-[#d4af78] text-[14px] font-medium">Sign Out</p>
          </motion.button>
        </motion.div>
      </div>

      {/* Bottom nav — pinned */}
      <div className="absolute bg-[#0b0a18] border-t border-[#1a1a1a] flex gap-[31px] h-[90px] items-center justify-center left-0 bottom-0 w-full z-20">
        <NavIcon type="today" active={false} onClick={() => onNavigate('today')} />
        <NavIcon type="sky" active={false} onClick={() => onNavigate('sky')} />
        <NavIcon type="ai" active={false} onClick={() => onNavigate('ai')} />
        <NavIcon type="profile" active={true} onClick={() => {}} />
      </div>

      {/* Home indicator */}
      <div className="absolute bg-[#333333] h-[4px] left-[142px] rounded-[2px] bottom-[8px] w-[100px] z-20" />
    </div>
  );
}

function ThemeToggleRow({ isDark, onToggle }: { isDark: boolean; onToggle: () => void }) {
  return (
    <div className="w-full px-[14px] py-[14px] flex items-center justify-between">
      <div className="flex items-center gap-[12px]">
        <p className="text-[16px]">{isDark ? '🌙' : '☀️'}</p>
        <p className="text-[#f0e6cc] text-[13px]">Appearance</p>
      </div>
      <motion.button
        className="relative w-[44px] h-[26px] rounded-full flex-shrink-0"
        style={{
          backgroundColor: isDark ? '#333333' : '#d4af78',
          boxShadow: isDark ? 'none' : '0 0 12px rgba(212,175,120,0.4)',
        }}
        onClick={onToggle}
        whileTap={{ scale: 0.95 }}
        aria-label="Toggle light/dark mode"
      >
        <motion.div
          className="absolute top-[3px] size-[20px] rounded-full bg-[#f0e6cc]"
          animate={{ left: isDark ? 3 : 21 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          style={{ backgroundColor: isDark ? '#888888' : '#ffffff' }}
        />
      </motion.button>
    </div>
  );
}

function SettingRow({ icon, label, onClick }: any) {
  return (
    <motion.button
      className="w-full px-[14px] py-[14px] flex items-center justify-between cursor-pointer"
      whileHover={{ backgroundColor: 'rgba(212, 175, 120, 0.05)' }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
    >
      <div className="flex items-center gap-[12px]">
        <p className="text-[16px]">{icon}</p>
        <p className="text-[#f0e6cc] text-[13px]">{label}</p>
      </div>
      <p className="text-[#9898a8] text-[12px]">→</p>
    </motion.button>
  );
}
