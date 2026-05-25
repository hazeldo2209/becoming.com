import { motion } from 'motion/react';
import { Starfield, NebulaGlow } from './CosmicElements';
import { useTheme } from '../context/ThemeContext';
import type { User } from '@supabase/supabase-js';

// ─── Nav icon (shared with other screens) ─────────────────────────────────────

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

// ─── Helpers ───────────────────────────────────────────────────────────────────

/** Derive a friendly display name from the user object */
function getDisplayName(user: User | null): string {
  if (!user) return 'Stargazer';
  const meta = user.user_metadata as Record<string, string> | undefined;
  if (meta?.full_name) return meta.full_name;
  if (meta?.name)      return meta.name;
  // fall back to the part before @ in their email
  if (user.email) return user.email.split('@')[0];
  return 'Stargazer';
}

/** Get first letter(s) for the avatar */
function getInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');
}

/** Format an ISO date as "Month YYYY" */
function formatJoinDate(isoDate: string | undefined): string {
  if (!isoDate) return '';
  const d = new Date(isoDate);
  return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

// ─── Sub-components ────────────────────────────────────────────────────────────

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
          className="absolute top-[3px] size-[20px] rounded-full"
          animate={{ left: isDark ? 3 : 21 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          style={{ backgroundColor: isDark ? '#888888' : '#ffffff' }}
        />
      </motion.button>
    </div>
  );
}

function SettingRow({ icon, label, sublabel, onClick }: { icon: string; label: string; sublabel?: string; onClick: () => void }) {
  return (
    <motion.button
      className="w-full px-[14px] py-[14px] flex items-center justify-between cursor-pointer"
      whileHover={{ backgroundColor: 'rgba(212, 175, 120, 0.05)' }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
    >
      <div className="flex items-center gap-[12px]">
        <p className="text-[16px]">{icon}</p>
        <div className="flex flex-col items-start">
          <p className="text-[#f0e6cc] text-[13px]">{label}</p>
          {sublabel && <p className="text-[#666680] text-[11px] mt-[1px]">{sublabel}</p>}
        </div>
      </div>
      <p className="text-[#9898a8] text-[12px]">→</p>
    </motion.button>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────

export default function ProfileScreen({ onNavigate, reflections, aiPlans, user, signOut, isDesktop }: {
  onNavigate: (screen: string) => void;
  reflections: any[];
  aiPlans: any[];
  user: User | null;
  signOut: () => Promise<void>;
  isDesktop?: boolean;
}) {
  const { isDark, toggle } = useTheme();

  const displayName  = getDisplayName(user);
  const initials     = getInitials(displayName);
  const joinDate     = formatJoinDate(user?.created_at);
  const email        = user?.email ?? '';
  const constellations = aiPlans.length;

  return (
    <div
      className={isDesktop ? 'relative size-full' : 'overflow-hidden relative rounded-[36px] size-full'}
      style={{ backgroundColor: isDark ? '#08080f' : '#f4f0e8' }}
    >
      <Starfield density={isDark ? 30 : 10} />
      <NebulaGlow color="gold" className="w-[280px] h-[280px] left-[55px] top-[140px]" />

      {/* Status bar (mobile only) */}
      {!isDesktop && (
        <>
          <div
            className="absolute h-[44px] left-0 top-0 w-full z-20 pointer-events-none"
            style={{
              background: isDark
                ? 'linear-gradient(to bottom, #08080f, transparent)'
                : 'linear-gradient(to bottom, #f4f0e8, transparent)',
            }}
          />
          <p className="absolute font-bold left-[13px] text-[#f0e6cc] text-[13px] top-[10px] z-20"
             style={{ color: isDark ? '#f0e6cc' : '#1c3a5c' }}>9:41</p>
          <p className="absolute font-normal left-[317px] text-[11px] top-[11px] z-20"
             style={{ color: isDark ? '#888888' : '#7a8fa0' }}>▶ ▶▶ ▊▊</p>
        </>
      )}

      {/* Scrollable content */}
      <div
        className={isDesktop ? 'absolute top-0 left-0 right-0 bottom-0 overflow-y-auto' : 'absolute top-0 left-0 right-0 bottom-[90px] overflow-y-auto'}
        style={{ scrollbarWidth: 'none' }}
      >
        {/* Centering wrapper on desktop */}
        <div className={isDesktop ? 'max-w-[560px] mx-auto' : ''}>
        {/* Header */}
        <div className={isDesktop ? 'pt-[28px] px-[24px]' : 'pt-[55px] px-[17px]'}>
          <p className="font-bold text-[24px]" style={{ color: isDark ? '#f0e6cc' : '#1c3a5c' }}>
            Profile
          </p>
        </div>

        <div
          className="h-[1px] mx-[17px] mt-[14px]"
          style={{
            background: isDark
              ? 'linear-gradient(to right, transparent, #333333, transparent)'
              : 'linear-gradient(to right, transparent, #c8d4de, transparent)',
          }}
        />

        {/* Avatar + name */}
        <motion.div
          className="px-[17px] pt-[24px] flex flex-col items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Avatar circle — initials if name exists, star icon if not */}
          <motion.div
            className="size-[80px] rounded-full flex items-center justify-center mb-[16px]"
            style={{
              background: 'linear-gradient(135deg, #d4af78, #c4a0e0)',
              boxShadow: '0 0 24px rgba(212, 175, 120, 0.3)',
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div
              className="size-[74px] rounded-full flex items-center justify-center"
              style={{ backgroundColor: isDark ? '#08080f' : '#f4f0e8' }}
            >
              {initials ? (
                <p className="text-[26px] font-bold" style={{ color: '#d4af78' }}>
                  {initials}
                </p>
              ) : (
                <p className="text-[32px]" style={{ color: '#d4af78' }}>✦</p>
              )}
            </div>
          </motion.div>

          {/* Name */}
          <p className="font-bold text-[20px] mb-[4px]" style={{ color: isDark ? '#f0e6cc' : '#1c3a5c' }}>
            {displayName}
          </p>

          {/* Join date */}
          {joinDate && (
            <p className="text-[12px]" style={{ color: isDark ? '#888888' : '#7a8fa0' }}>
              Becoming since {joinDate}
            </p>
          )}

          {/* Email badge */}
          {email && (
            <div
              className="mt-[8px] px-[12px] py-[4px] rounded-[12px] border"
              style={{
                backgroundColor: isDark ? 'rgba(212,175,120,0.06)' : 'rgba(176,125,24,0.08)',
                borderColor: isDark ? '#2a2a1a' : '#d4af78',
              }}
            >
              <p className="text-[11px]" style={{ color: isDark ? '#a88a58' : '#b07d18' }}>
                {email}
              </p>
            </div>
          )}
        </motion.div>

        {/* Journey Stats */}
        <motion.div
          className="px-[17px] pt-[20px] flex gap-[12px]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {/* Stars (= reflections) */}
          <div
            className="flex-1 border rounded-[12px] px-[16px] py-[14px] flex flex-col items-center"
            style={{
              backgroundColor: isDark ? '#0b0a18' : '#ffffff',
              borderColor: isDark ? '#333333' : '#d4c8b0',
              boxShadow: isDark ? '0 0 20px rgba(212, 175, 120, 0.1)' : '0 2px 8px rgba(212,175,120,0.12)',
            }}
          >
            <p className="text-[24px] font-bold mb-[2px]" style={{ color: '#d4af78' }}>
              {reflections.length}
            </p>
            <p className="text-[12px]" style={{ color: isDark ? '#888888' : '#7a8fa0' }}>Stars</p>
          </div>

          {/* Constellations (= aiPlans) */}
          <div
            className="flex-1 border rounded-[12px] px-[16px] py-[14px] flex flex-col items-center"
            style={{
              backgroundColor: isDark ? '#0b0a18' : '#ffffff',
              borderColor: isDark ? '#333333' : '#d4c8b0',
              boxShadow: isDark ? '0 0 20px rgba(196, 160, 224, 0.1)' : '0 2px 8px rgba(196,160,224,0.12)',
            }}
          >
            <p className="text-[24px] font-bold mb-[2px]" style={{ color: '#c4a0e0' }}>
              {constellations}
            </p>
            <p className="text-[12px]" style={{ color: isDark ? '#888888' : '#7a8fa0' }}>Plans</p>
          </div>

          {/* Check-ins (= reflections as proxy for streak placeholder) */}
          <div
            className="flex-1 border rounded-[12px] px-[16px] py-[14px] flex flex-col items-center"
            style={{
              backgroundColor: isDark ? '#0b0a18' : '#ffffff',
              borderColor: isDark ? '#333333' : '#d4c8b0',
              boxShadow: isDark ? '0 0 20px rgba(212, 175, 120, 0.1)' : '0 2px 8px rgba(212,175,120,0.12)',
            }}
          >
            <p className="text-[24px] font-bold mb-[2px]" style={{ color: '#d4af78' }}>
              {reflections.length > 0 ? Math.min(reflections.length, 30) : 0}
            </p>
            <p className="text-[12px]" style={{ color: isDark ? '#888888' : '#7a8fa0' }}>Check-ins</p>
          </div>
        </motion.div>

        {/* Settings */}
        <motion.div
          className="px-[17px] pt-[20px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <p className="font-bold text-[14px] mb-[12px]" style={{ color: isDark ? '#f0e6cc' : '#1c3a5c' }}>
            Settings
          </p>
          <div
            className="border rounded-[12px] overflow-hidden"
            style={{
              backgroundColor: isDark ? '#0b0a18' : '#ffffff',
              borderColor: isDark ? '#333333' : '#d4c8b0',
            }}
          >
            <SettingRow icon="🔔" label="Notifications" onClick={() => {}} />
            <div className="h-[1px] mx-[14px]" style={{ backgroundColor: isDark ? '#1a1a1a' : '#ede8de' }} />
            <SettingRow icon="🌙" label="Reflection Reminders" onClick={() => {}} />
            <div className="h-[1px] mx-[14px]" style={{ backgroundColor: isDark ? '#1a1a1a' : '#ede8de' }} />
            <ThemeToggleRow isDark={isDark} onToggle={toggle} />
            <div className="h-[1px] mx-[14px]" style={{ backgroundColor: isDark ? '#1a1a1a' : '#ede8de' }} />
            <SettingRow icon="🔒" label="Privacy & Security" onClick={() => {}} />
          </div>
        </motion.div>

        {/* Account */}
        <motion.div
          className="px-[17px] pt-[20px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <p className="font-bold text-[14px] mb-[12px]" style={{ color: isDark ? '#f0e6cc' : '#1c3a5c' }}>
            Account
          </p>
          <div
            className="border rounded-[12px] overflow-hidden"
            style={{
              backgroundColor: isDark ? '#0b0a18' : '#ffffff',
              borderColor: isDark ? '#333333' : '#d4c8b0',
            }}
          >
            <SettingRow
              icon="📧"
              label="Email"
              sublabel={email || 'Not set'}
              onClick={() => {}}
            />
            <div className="h-[1px] mx-[14px]" style={{ backgroundColor: isDark ? '#1a1a1a' : '#ede8de' }} />
            <SettingRow icon="🔑" label="Change Password" onClick={() => {}} />
          </div>
        </motion.div>

        {/* Sign Out */}
        <motion.div
          className="px-[17px] pt-[12px] pb-[24px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <motion.button
            className="w-full border rounded-[12px] h-[48px] flex items-center justify-center"
            style={{
              backgroundColor: isDark ? '#0b0a18' : '#ffffff',
              borderColor: '#d4af78',
              boxShadow: '0 0 20px rgba(212, 175, 120, 0.2)',
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={async () => {
              await signOut();
            }}
          >
            <p className="text-[#d4af78] text-[14px] font-medium">Sign Out</p>
          </motion.button>
        </motion.div>
        </div>{/* end centering wrapper */}
      </div>

      {/* Bottom nav (mobile only) */}
      {!isDesktop && (
        <>
          <div
            className="absolute flex gap-[31px] h-[90px] items-center justify-center left-0 bottom-0 w-full z-20 border-t"
            style={{
              backgroundColor: isDark ? '#0b0a18' : '#f4f0e8',
              borderColor: isDark ? '#1a1a1a' : '#d4c8b0',
            }}
          >
            <NavIcon type="today" active={false} onClick={() => onNavigate('today')} />
            <NavIcon type="sky"   active={false} onClick={() => onNavigate('sky')} />
            <NavIcon type="ai"    active={false} onClick={() => onNavigate('ai')} />
            <NavIcon type="profile" active={true} onClick={() => {}} />
          </div>
          <div
            className="absolute h-[4px] left-[142px] rounded-[2px] bottom-[8px] w-[100px] z-20"
            style={{ backgroundColor: isDark ? '#333333' : '#c8d4de' }}
          />
        </>
      )}
    </div>
  );
}
