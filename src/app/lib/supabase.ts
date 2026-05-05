import { createClient } from '@supabase/supabase-js';

const supabaseUrl     = import.meta.env.VITE_SUPABASE_URL     as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

// Single shared client instance — import { supabase } from '@/app/lib/supabase'
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      ai_plans: {
        Row: {
          id: string;
          user_id: string;
          task: string;
          tasks: unknown;         // KanbanTask[] stored as JSON
          conversation: unknown;  // ChatMessage[] stored as JSON
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['ai_plans']['Row'], 'created_at'> & {
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['ai_plans']['Insert']>;
      };
      reflections: {
        Row: {
          id: string;
          user_id: string | null;
          text: string;
          emotion: string;
          category: string;
          mood: string;
          tags: string[];
          city: string;
          country: string;
          lat: number;
          lng: number;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['reflections']['Row'], 'id' | 'created_at'>;
      };
    };
  };
};
