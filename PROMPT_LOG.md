# Becoming — Development Prompt Log

A chronological record of every feature request and the changes made to implement it.

---

## Session 1 — Foundation & Auth

### Fix: Sign-out clearing AI plans
**Request:** Fix `signOut` to explicitly clear `aiPlans` state before navigating.  
**Files changed:** `src/app/App.tsx`  
**What changed:** `signOut` now calls `setAiPlans([])` before `supabase.auth.signOut()` so the sidebar empties immediately rather than waiting for a re-render.

---

### Fix: Cannot type into AI Companion input on desktop
**Request:** Typing in the AI Companion chat input does nothing on desktop.  
**Root cause:** The `Starfield` component in dark mode rendered an `absolute inset-0` div **without** `pointer-events-none`, blocking all mouse/keyboard events across the entire screen.  
**Files changed:** `src/app/components/CosmicElements.tsx`  
**What changed:** Added `pointer-events-none` to the dark-mode branch of `Starfield`.

---

### Fix: Tasks disappear after Chrome refresh
**Request:** Plans and tasks created in the AI Companion vanish when the page is refreshed.  
**Root cause (multi-layer):**
1. Previous session had an auth race condition (fixed: switched `getUser()` → `getSession()`, used `user?.id` as effect dependency).
2. This session revealed the real cause: the `ai_plans` Supabase table **did not exist** — all `.upsert()` calls were silently failing.

**Files changed:** `src/app/components/AICompanionScreen.tsx`, `src/app/App.tsx`  
**SQL run in Supabase:**
```sql
CREATE TABLE ai_plans (
  id           TEXT PRIMARY KEY,
  user_id      UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  task         TEXT NOT NULL,
  tasks        JSONB NOT NULL DEFAULT '[]',
  conversation JSONB NOT NULL DEFAULT '[]',
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE ai_plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users_own_plans" ON ai_plans FOR ALL
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX ai_plans_user_id_idx ON ai_plans (user_id);
```

---

### Fix: Onboarding screen not showing after login
**Request:** After logging in, the onboarding screen never appears.  
**Root cause:** Stale closure bug — `onAuthStateChange` callback was registered in `useEffect([], [])` and captured `currentScreen = 'welcome'` at mount time. The guard `if (u && currentScreen === 'login')` was always `false`.  
**Files changed:** `src/app/App.tsx`  
**What changed:** Replaced the captured-state guard with Supabase's built-in event type: `if (event === 'SIGNED_IN') { setCurrentScreen('onboarding') }`.

---

## Session 2 — Desktop UI Polish

### Feature: Dark/Light mode segmented pill toggle
**Request:** Change the dark/light mode toggle in the desktop sidebar to a segmented pill style (like ChatGPT/Gemini).  
**Files changed:** `src/app/components/DesktopLayout.tsx`  
**What changed:** Replaced a single sliding-dot toggle with a two-option pill (`☀️ Light` / `🌙 Dark`) using `motion.button` per option. Active option shows a filled background; inactive is transparent.

---

### Fix: "You Are Not Alone" page broken on desktop
**Request:** Audit all screens for desktop responsiveness; specifically fix the You Are Not Alone page.  
**Root cause:** Entire layout used `position: absolute` with pixel values calibrated for a 390×844px phone (`left-[17px]`, `top-[140px]`, etc.).  
**Files changed:** `src/app/components/YoureNotAloneScreen.tsx`  
**What changed:** Complete rewrite. All content blocks (eyebrow, headline, subtext, stats, liveIndicator, reassurance, ctaButtons) extracted as shared JSX. Desktop uses `max-w-[480px] mx-auto` flex column. Mobile uses original absolute-positioned layout.

---

### Fix: Profile screen not centered on desktop
**Files changed:** `src/app/components/ProfileScreen.tsx`  
**What changed:** Wrapped scrollable content in `max-w-[560px] mx-auto` on desktop.

---

### Feature: ChatGPT/Gemini-style chat layout in AI Companion
**Request:** The AI chat messages are too far apart; make it look more like ChatGPT/Gemini.  
**Files changed:** `src/app/components/AICompanionScreen.tsx`  
**What changed:**
- Messages centered in a `max-w-[680px] mx-auto` column
- AI bubbles: `max-w-[88%]`, text `15px`
- User bubbles: `max-w-[72%]`
- Gap between messages reduced to `gap-[8px]`

---

### Fix: Respond screen broken on desktop
**Request:** Fix ResponseScreen for desktop (all content absolutely positioned with phone pixel values).  
**Files changed:** `src/app/components/ResponseScreen.tsx`  
**What changed:** Extracted all form elements (promptRecap, tabBar, textInput, tagsBlock, moodBlock, shareToggle, shareStatus, saveButton) as shared JSX blocks. Desktop: `max-w-[520px] mx-auto` scrollable column. Mobile: original absolute layout preserved.

---

### Fix: Sky screen broken on desktop
**Request:** Fix SkyScreen for desktop.  
**Files changed:** `src/app/components/SkyScreen.tsx`  
**What changed:**
- Extracted skyCanvas, subViewButtons, filterBar, constellationsSection, progressCard, hintCard, modals into shared JSX.
- Desktop main view: `max-w-[640px] mx-auto` scrollable column; sky canvas takes full column width.
- aiTask sub-view was wrapped in `rounded-[36px] overflow-hidden` on desktop — now uses `max-w-[600px] mx-auto` full-screen layout on desktop, phone styling only on mobile.

---

### Fix: Shared Reflections screen stars clustered on desktop
**Request:** Fix SharedReflectionsScreen for desktop.  
**Files changed:** `src/app/components/SharedReflectionsScreen.tsx`  
**What changed:** Stars were at fixed pixel positions calibrated for phone width. Desktop: star field wrapped in a centered `400px`-wide relative container so stars appear in the middle of the screen. Mobile: unchanged.

---

## Session 3 — Onboarding Tour

### Feature: Desktop interactive onboarding tour
**Request:** Make the onboarding on desktop show an interactive tour that highlights parts of the real UI.  
**Files changed:** `src/app/components/OnboardingScreen.tsx`

**What changed:** When `isDesktop` is true, `OnboardingScreen` now returns a `DesktopTour` component — a `position: fixed inset-0 z-[100]` overlay that covers the entire viewport (breaking out of its parent `DesktopLayout` content area).

**Tour steps (6 total):**

| # | Spotlight | Tooltip position | Accent |
|---|-----------|-----------------|--------|
| 1 | None — Welcome | Center of main area | Gold |
| 2 | Full left sidebar | Right of sidebar | Gold |
| 3 | AI Companion nav item (single row) | Right of sidebar, aligned to item | Purple |
| 4 | Full right tasks panel | Left of tasks panel | Green |
| 5 | My Sky nav item (single row) | Right of sidebar, aligned to item | Purple |
| 6 | None — "You're all set" | Center of main area | Gold |

**Implementation details:**
- SVG `<mask>` creates a dark overlay (`rgba(4,3,16,0.82)`) with a rectangular cutout revealing real UI underneath
- `motion.div` with `key={s.id + '-ring'}` renders a pulsing glow border around each spotlight; no `AnimatePresence` so it unmounts instantly on step change (avoids infinite-repeat blinking bug)
- Directional SVG arrows on the tooltip card: `←` for sidebar steps, `→` for tasks panel step
- Progress dots + `X of N` counter in each tooltip
- "Skip tour" link on all steps except the last
- Mobile: original 4-slide illustrated slideshow unchanged

---

### Fix: Onboarding glow ring blinks after advancing steps
**Request:** The spotlight highlight keeps blinking even after moving to a new step.  
**Root cause:** `AnimatePresence` wrapping a `repeat: Infinity` animation — when the step changed, AnimatePresence tried to run `exit` on the old ring, but the infinite repeat kept interrupting it.  
**Files changed:** `src/app/components/OnboardingScreen.tsx`  
**What changed:** Removed `AnimatePresence` from the ring. Now changing `key` causes React to immediately unmount the old ring and mount a fresh one.

---

### Config: Onboarding shows every login (user testing mode)
**Request:** Force the onboarding to show every time for user testing.  
**Files changed:** `src/app/App.tsx`  
**What changed:** Removed `localStorage.getItem('becoming_onboarding_seen')` checks. Both `getSession()` on mount and `SIGNED_IN` event now always navigate to `'onboarding'`.

> **To restore "show once" behaviour after user testing**, re-add the localStorage gate:
> ```ts
> const seenOnboarding = localStorage.getItem('becoming_onboarding_seen');
> setCurrentScreen(seenOnboarding ? 'today' : 'onboarding');
> ```

---

## Key Architecture Notes

| Concern | Pattern used |
|---------|-------------|
| Desktop vs mobile layout | `isDesktop` boolean prop passed via `screenProps` from `App.tsx` to every screen |
| Auth navigation | `supabase.auth.onAuthStateChange` event types (`SIGNED_IN`, `SIGNED_OUT`) — never reads captured state |
| Plan persistence | Supabase `ai_plans` table with JSONB columns; `upsert` on every change |
| Stale closure prevention | Effects that set screen use event params, not captured state variables |
| Pointer event blocking | All decorative absolute-positioned elements use `pointer-events-none` |
| Desktop screen layout pattern | `size-full overflow-y-auto` outer + `max-w-[Npx] mx-auto px-[24px] py-[32px]` inner |
