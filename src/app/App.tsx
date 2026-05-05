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
import OnboardingScreen, { LS_ONBOARDING } from './components/OnboardingScreen';
import type { ActionPlan, KanbanTask, ChatMessage } from './types';
import { supabase } from '@/app/lib/supabase';
import type { User } from '@supabase/supabase-js';

const screens = {
  welcome:    WelcomeScreen,
  login:      LoginScreen,
  signup:     LoginScreen,   // same component, opens in signup mode
  onboarding: OnboardingScreen,
  checkin:    DailyCheckIn,
  today: TodayScreen,
  respond: ResponseScreen,
  sky: SkyScreen,
  ai: AICompanionScreen,
  solidarity: SolidarityScreen,
  profile: ProfileScreen,
  sharedReflections: SharedReflectionsScreen,
};

function AppContent() {
  const { isDark } = useTheme();
  const [currentScreen, setCurrentScreen] = useState('welcome')
  const [userMood, setUserMood]       = useState<string | null>(null);
  const [userEnergy, setUserEnergy]   = useState<number>(50);
  const [reflections, setReflections] = useState<any[]>([]);
  const [aiTaskBreakdown, setAiTaskBreakdown] = useState<any>(null);
  const [aiPlans, setAiPlans] = useState<ActionPlan[]>([]);
  const [user, setUser]         = useState<User | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  // ── Load AI plans from Supabase whenever the logged-in user changes ──────────
  useEffect(() => {
    if (!user) {
      setAiPlans([]);
      return;
    }
    supabase
      .from('ai_plans')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true })
      .then(({ data }) => {
        if (data) {
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
  }, [user]);

  // ── Check existing session on mount; listen for auth changes ────────────────
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      if (data.user) {
        // Always show onboarding (skip button available for returning users)
        setCurrentScreen('onboarding');
      }
      setAuthChecked(true);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user ?? null;
      setUser(u);
      // Always show onboarding after sign-in (skip button available)
      if (u && currentScreen === 'login') {
        setCurrentScreen('onboarding');
      }
      // Sign-out from any protected screen → back to welcome
      if (!u && currentScreen !== 'welcome' && currentScreen !== 'login' && currentScreen !== 'signup') {
        setCurrentScreen('welcome');
      }
    });

    return () => listener.subscription.unsubscribe();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Don't render until we know auth state (avoids welcome → checkin flash)
  if (!authChecked) return null;

  const CurrentScreenComponent = screens[currentScreen as keyof typeof screens];

  return (
    <div
      className="size-full flex items-center justify-center bg-[#08080f]"
      data-theme={isDark ? 'dark' : 'light'}
    >
      <div className="relative w-full max-w-[390px] h-[844px]">
        <AnimatePresence mode="sync">
          <motion.div
            key={currentScreen}
            initial={{ opacity: 0, scale: 0.99 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.005 }}
            transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
            className="size-full absolute inset-0"
          >
            <CurrentScreenComponent
              onNavigate={setCurrentScreen}
              initialMode={currentScreen === 'signup' ? 'signup' : 'signin'}
              userMood={userMood}
              setUserMood={setUserMood}
              userEnergy={userEnergy}
              setUserEnergy={setUserEnergy}
              reflections={reflections}
              setReflections={setReflections}
              aiTaskBreakdown={aiTaskBreakdown}
              setAiTaskBreakdown={setAiTaskBreakdown}
              aiPlans={aiPlans}
              setAiPlans={setAiPlans}
              user={user}
              signOut={async () => {
                await supabase.auth.signOut();
                setUser(null);
                setCurrentScreen('welcome');
              }}
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

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
