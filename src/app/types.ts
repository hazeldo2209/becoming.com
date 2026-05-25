// ─── Core data schema for Becoming ───────────────────────────────────────────

export type Emotion =
  | 'hopeful' | 'grateful' | 'calm' | 'resilient'
  | 'accepting' | 'growing' | 'reflective'
  | 'anxious' | 'uncertain' | 'tired';

export type Category =
  | 'Career' | 'Creativity' | 'Connection'
  | 'Health' | 'Self-love' | 'Mindfulness'
  | 'Growth' | 'Courage' | 'Wellbeing' | 'Life';

export type Effort = 'low' | 'medium' | 'high';
export type KanbanColumn = 'do-now' | 'this-week' | 'plan-ahead';
export type Priority = 'p1' | 'p2' | 'p3';

/** A single journal / reflection entry from a user */
export interface UserReflection {
  id: string;
  text: string;
  emotion: Emotion;
  category: Category;
  mood: string;                // emoji
  tags: string[];
  createdAt: string;           // ISO date
  // Geographic — populated when user shares location
  location?: {
    city: string;
    country: string;
    lat: number;               // degrees
    lng: number;               // degrees
  };
}

/** A single actionable task inside an AI-generated plan */
export interface KanbanTask {
  id: string;
  text: string;
  details: string;
  effort: Effort;
  timeLabel: string;           // human-readable: "5 min", "30 min", "2 hrs"
  timeMinutes: number;         // for sorting & priority calc
  column: KanbanColumn;
  priority: Priority;
  completed: boolean;
  substeps?: string[];         // 3 short sub-steps for high-effort tasks
}

/** A single message in the AI companion conversation for a plan */
export interface ChatMessage {
  type: 'user' | 'ai';
  text: string;
  planReady?: boolean;        // true = "plan generated" message
  taskBreakdown?: {           // set when AI broke down a task
    originalTaskId: string;
    newTaskCount: number;
  };
}

/** An AI-generated action plan attached to a reflection theme */
export interface ActionPlan {
  id: string;
  task: string;                // original user request
  tasks: KanbanTask[];
  createdAt: string;
  conversation?: ChatMessage[]; // full chat history for this plan
}

// ─── Priority derivation ──────────────────────────────────────────────────────

export function derivePriority(effort: Effort, timeMinutes: number): Priority {
  if (effort === 'low' && timeMinutes <= 15) return 'p1';
  if (effort === 'high' || timeMinutes > 60) return 'p3';
  return 'p2';
}

export function deriveColumn(effort: Effort, timeMinutes: number): KanbanColumn {
  const p = derivePriority(effort, timeMinutes);
  if (p === 'p1') return 'do-now';
  if (p === 'p3') return 'plan-ahead';
  return 'this-week';
}

// ─── Emotion → colour mapping (used in both app & exhibition) ─────────────────

export const EMOTION_COLOR: Record<Emotion, string> = {
  hopeful:    '#d4af78',
  grateful:   '#d4af78',
  calm:       '#88c8a8',
  resilient:  '#88c8a8',
  accepting:  '#88c8a8',
  growing:    '#c4a0e0',
  reflective: '#c4a0e0',
  anxious:    '#a0b8e0',
  uncertain:  '#a0b8e0',
  tired:      '#888888',
};

export const EMOTION_GLOW: Record<Emotion, string> = {
  hopeful:    'rgba(212,175,120,0.7)',
  grateful:   'rgba(212,175,120,0.7)',
  calm:       'rgba(136,200,168,0.7)',
  resilient:  'rgba(136,200,168,0.7)',
  accepting:  'rgba(136,200,168,0.7)',
  growing:    'rgba(196,160,224,0.7)',
  reflective: 'rgba(196,160,224,0.7)',
  anxious:    'rgba(160,184,224,0.7)',
  uncertain:  'rgba(160,184,224,0.7)',
  tired:      'rgba(136,136,136,0.5)',
};
