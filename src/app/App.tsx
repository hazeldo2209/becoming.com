import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import ExhibitionSkyScreen from './components/ExhibitionSkyScreen';
import WelcomeScreen from './components/WelcomeScreen';
import LoginScreen from './components/LoginScreen';
import DailyCheckIn from './components/DailyCheckIn';
import TodayScreen from './components/TodayScreen';
import ResponseScreen from './components/ResponseScreen';
import SkyScreen from './components/SkyScreen';
import AICompanionScreen from './components/AICompanionScreen';
import SolidarityScreen from './components/YoureNotAloneScreen';
import ProfileScreen from './components/ProfileScreen';
import SharedReflectionsScreen from './components/SharedReflectionsScreen';
import OnboardingScreen from './components/OnboardingScreen';
import DesktopLayout from './components/DesktopLayout';
import type { ActionPlan, KanbanTask, ChatMessage } from './types';
import { supabase } from '@/app/lib/supabase';
import type { User } from '@supabase/supabase-js';

// ─── Breakpoint hook ──────────────────────────────────────────────────────────

function useIsDesktop(breakpoint = 1024): boolean {
  const [isDesktop, setIsDesktop] = useState(() => window.innerWidth >= breakpoint);
  useEffect(() => {
    const mq = window.matchMedia(`(min-width: ${breakpoint}px)`);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [breakpoint]);
  return isDesktop;
}

// ─── Screen registry ──────────────────────────────────────────────────────────

const screens = {
  welcome:    WelcomeScreen,
  login:      LoginScreen,
  signup:     LoginScreen,   // same component, opens in signup mode
  onboarding: OnboardingScreen,
  checkin:    DailyCheckIn,
  today:      TodayScreen,
  respond:    ResponseScreen,
  sky:        SkyScreen,
  ai:         AICompanionScreen,
  solidarity: SolidarityScreen,
  profile:    ProfileScreen,
  sharedReflections: SharedReflectionsScreen,
};

// ─── Screens where the tasks sidebar is hidden (pre-auth / intro) ────────────

const PRE_AUTH_SCREENS = new Set(['welcome', 'login', 'signup']);

// ─── App content ──────────────────────────────────────────────────────────────

function AppContent() {
  const { isDark } = useTheme();
  const isDesktop = useIsDesktop();

  const [currentScreen, setCurrentScreen] = useState('welcome');
  const [userMood, setUserMood]           = useState<string | null>(null);
  const [userEnergy, setUserEnergy]       = useState<number>(50);
  const [reflections, setReflections]     = useState<any[]>([]);
  const [aiTaskBreakdown, setAiTaskBreakdown] = useState<any>(null);
  const [aiPlans, setAiPlans]             = useState<ActionPlan[]>([]);
  const [user, setUser]                   = useState<User | null>(null);
  const [authChecked, setAuthChecked]     = useState(false);

  // ── Load AI plans when user ID becomes available ─────────────────────────────
  // Watch user?.id (not the whole user object) so token refreshes don't re-run this
  useEffect(() => {
    if (!user?.id) return; // don't clear on null — signOut handles that explicitly
    supabase
      .from('ai_plans')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true })
      .then(({ data, error }) => {
        if (error) {
          console.error('[ai_plans load]', error.message, error);
          return; // Don't wipe local plans on a query error
        }
        // data is [] when the user has no plans — that's valid, set it
        if (data !== null) {
          setAiPlans(
            data.map(row => ({
              id:           row.id,
              task:         row.task,
              tasks:        row.tasks        as KanbanTask[],
              conversation: row.conversation as ChatMessage[],
              createdAt:    row.created_at,
            }))
          );
        }
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  // ── Auth: check session on mount; listen for changes ────────────────────────
  useEffect(() => {
    // getSession() reads from localStorage — no network call, no race with onAuthStateChange
    supabase.auth.getSession().then(({ data: { session } }) => {
      const u = session?.user ?? null;
      setUser(u);
      if (u) {
        // Always show onboarding on entry (user testing mode)
        setCurrentScreen('onboarding');
      }
      setAuthChecked(true);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      const u = session?.user ?? null;
      setUser(u);
      if (event === 'SIGNED_IN') {
        // Always show onboarding on login (user testing mode)
        setCurrentScreen('onboarding');
      } else if (event === 'SIGNED_OUT') {
        setCurrentScreen('welcome');
      }
      // INITIAL_SESSION / TOKEN_REFRESHED / USER_UPDATED: only update user state, no navigation
    });
    return () => listener.subscription.unsubscribe();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!authChecked) return null;

  const CurrentScreenComponent = screens[currentScreen as keyof typeof screens];

  const signOut = async () => {
    setAiPlans([]);          // clear immediately so sidebar empties at once
    await supabase.auth.signOut(); // fires SIGNED_OUT → onAuthStateChange handles navigation
  };

  // Shared props for every screen component
  const screenProps = {
    onNavigate:         setCurrentScreen,
    initialMode:        currentScreen === 'signup' ? 'signup' : 'signin',
    isDesktop,
    userMood,           setUserMood,
    userEnergy,         setUserEnergy,
    reflections,        setReflections,
    aiTaskBreakdown,    setAiTaskBreakdown,
    aiPlans,            setAiPlans,
    user,               signOut,
  };

  // ── Phone screen (with animated crossfade) ─────────────────────────────────
  const phoneContent = (
    <AnimatePresence mode="sync">
      <motion.div
        key={currentScreen}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25, ease: 'easeInOut' }}
        className="absolute inset-0"
      >
        <CurrentScreenComponent {...screenProps} />
      </motion.div>
    </AnimatePresence>
  );

  // ── Desktop layout ────────────────────────────────────────────────────────
  if (isDesktop) {
    // Pre-auth screens: full-screen, no sidebar
    if (PRE_AUTH_SCREENS.has(currentScreen)) {
      return (
        <div className="size-full" data-theme={isDark ? 'dark' : 'light'}>
          <div className="relative w-full h-full">
            {phoneContent}
          </div>
        </div>
      );
    }
    // Authenticated screens: full desktop layout with sidebar
    return (
      <div className="size-full" data-theme={isDark ? 'dark' : 'light'}>
        <DesktopLayout
          currentScreen={currentScreen}
          onNavigate={setCurrentScreen}
          aiPlans={aiPlans}
          setAiPlans={setAiPlans}
          user={user}
          signOut={signOut}
        >
          <div className="relative w-full h-full">
            {phoneContent}
          </div>
        </DesktopLayout>
      </div>
    );
  }

  // ── Mobile layout ─────────────────────────────────────────────────────────
  return (
    <div
      className="size-full flex items-center justify-center bg-[#08080f]"
      data-theme={isDark ? 'dark' : 'light'}
    >
      <div className="relative w-full max-w-[390px] h-[844px] overflow-hidden rounded-[36px]">
        {phoneContent}
      </div>
    </div>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export default function App() {
  const isExhibition =
    new URLSearchParams(window.location.search).has('exhibition') ||
    window.location.hash === '#exhibition';

  useEffect(() => {
    if (isExhibition) document.title = 'Becoming — Exhibition';
  }, [isExhibition]);

  if (isExhibition) {
    return (
      <div className="w-screen h-screen bg-[#08080f]">
        <ExhibitionSkyScreen />
      </div>
    );
  }

  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
