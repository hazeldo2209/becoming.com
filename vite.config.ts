import { defineConfig, loadEnv } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import type { Plugin } from 'vite'
import type { IncomingMessage, ServerResponse } from 'http'

// ─── In-memory fallback (used when Supabase env vars are absent) ──────────────

interface LiveReflection {
  id: string;
  text: string;
  emotion: string;
  category: string;
  mood: string;
  tags: string[];
  city: string;
  country: string;
  lat: number;
  lng: number;
  createdAt: string;
}

const _liveReflections: LiveReflection[] = [];

// ─── Anthropic API middleware ─────────────────────────────────────────────────

function claudeApiPlugin(apiKey: string, supabaseUrl: string, supabaseServiceKey: string): Plugin {
  return {
    name: 'claude-api',
    configureServer(server) {
      server.middlewares.use(async (req: IncomingMessage, res: ServerResponse, next) => {
        const url = req.url ?? '';

        // ── GET /api/reflections ──────────────────────────────────────────
        if (req.method === 'GET' && url === '/api/reflections') {
          if (supabaseUrl && supabaseServiceKey) {
            try {
              const { createClient } = await import('@supabase/supabase-js');
              const sb = createClient(supabaseUrl, supabaseServiceKey);
              const { data, error } = await sb
                .from('reflections')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(200);
              if (error) throw error;
              // Normalize column names to match what the frontend expects
              const reflections = (data ?? []).map((r: any) => ({
                id:        r.id,
                text:      r.text,
                emotion:   r.emotion,
                category:  r.category,
                mood:      r.mood,
                tags:      r.tags ?? [],
                city:      r.city,
                country:   r.country,
                lat:       r.lat,
                lng:       r.lng,
                createdAt: r.created_at,
              }));
              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ reflections }));
              return;
            } catch (err: any) {
              console.error('[reflections GET]', err.message);
              // Fall through to in-memory fallback
            }
          }
          // In-memory fallback
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ reflections: _liveReflections }));
          return;
        }

        const isApiRoute =
          req.method === 'POST' &&
          (url === '/api/plan' || url === '/api/chat' || url === '/api/reflections');
        if (!isApiRoute) return next();

        // Read body
        const chunks: Buffer[] = [];
        for await (const chunk of req) chunks.push(chunk as Buffer);
        const body = JSON.parse(Buffer.concat(chunks).toString());

        // ── POST /api/reflections ─────────────────────────────────────────
        if (url === '/api/reflections') {
          if (supabaseUrl && supabaseServiceKey) {
            try {
              const { createClient } = await import('@supabase/supabase-js');
              const sb = createClient(supabaseUrl, supabaseServiceKey);
              const { data, error } = await sb
                .from('reflections')
                .insert({
                  text:      body.text      ?? '',
                  emotion:   body.emotion   ?? 'hopeful',
                  category:  body.category  ?? 'Growth',
                  mood:      body.mood      ?? '🙂',
                  tags:      body.tags      ?? [],
                  city:      body.city      ?? 'Unknown',
                  country:   body.country   ?? '??',
                  lat:       body.lat       ?? 0,
                  lng:       body.lng       ?? 0,
                  user_id:   body.user_id   ?? null,
                })
                .select('id')
                .single();
              if (error) throw error;
              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ ok: true, id: data.id }));
              return;
            } catch (err: any) {
              console.error('[reflections POST]', err.message);
              // Fall through to in-memory fallback
            }
          }
          // In-memory fallback
          const id = `live-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
          const entry: LiveReflection = {
            id,
            text:      body.text      ?? '',
            emotion:   body.emotion   ?? 'hopeful',
            category:  body.category  ?? 'Growth',
            mood:      body.mood      ?? '🙂',
            tags:      body.tags      ?? [],
            city:      body.city      ?? 'Unknown',
            country:   body.country   ?? '??',
            lat:       body.lat       ?? 0,
            lng:       body.lng       ?? 0,
            createdAt: new Date().toISOString(),
          };
          _liveReflections.push(entry);
          if (_liveReflections.length > 200) _liveReflections.shift();
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ ok: true, id }));
          return;
        }

        if (!apiKey) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'ANTHROPIC_API_KEY not set in environment.' }));
          return;
        }

        try {
          const { default: Anthropic } = await import('@anthropic-ai/sdk');
          const client = new Anthropic({ apiKey });

          // ── /api/plan ────────────────────────────────────────────────────
          if (url === '/api/plan') {
            const userGoal: string = body.goal ?? '';

            const systemPrompt = `You are a personal growth coach and productivity expert.
The user will share a goal or challenge. Break it down into exactly 6 concrete, actionable tasks.

Return ONLY valid JSON — no markdown, no explanation — matching this schema:
[
  {
    "text": "Short task title (max 10 words)",
    "details": "One-sentence explanation of exactly what to do",
    "effort": "low" | "medium" | "high",
    "timeMinutes": number,
    "timeLabel": "e.g. 5 min, 30 min, 1 hr, 2 hrs",
    "substeps": ["step 1", "step 2", "step 3"]  // ONLY include for high-effort tasks
  }
]

Rules:
- effort "low" = ≤15 min quick win; "medium" = 20–60 min; "high" = >60 min
- timeMinutes must match timeLabel (5→"5 min", 30→"30 min", 60→"1 hr", 120→"2 hrs")
- Include 2–3 low-effort tasks, 2 medium, 1–2 high
- Tasks should build on each other in a logical sequence
- Be specific and actionable for THIS exact goal, not generic advice
- For every high-effort task, include a "substeps" array of exactly 3 short action phrases (max 6 words each) that break the task into smaller milestones
- Low and medium effort tasks must NOT have a "substeps" field`;

            const message = await client.messages.create({
              model: 'claude-opus-4-7',
              max_tokens: 1024,
              thinking: { type: 'adaptive' },
              system: systemPrompt,
              messages: [{ role: 'user', content: userGoal }],
            });

            const textBlock = message.content.find((b: any) => b.type === 'text');
            const rawJson = (textBlock as any)?.text ?? '[]';
            const parsed = JSON.parse(rawJson);

            function derivePriority(effort: string, mins: number) {
              if (effort === 'low' && mins <= 15) return 'p1';
              if (effort === 'high' || mins > 60) return 'p3';
              return 'p2';
            }
            function deriveColumn(effort: string, mins: number) {
              const p = derivePriority(effort, mins);
              if (p === 'p1') return 'do-now';
              if (p === 'p3') return 'plan-ahead';
              return 'this-week';
            }

            const tasks = parsed.map((t: any, i: number) => ({
              id: String(i + 1),
              text: t.text,
              details: t.details,
              effort: t.effort,
              timeLabel: t.timeLabel,
              timeMinutes: t.timeMinutes,
              column: deriveColumn(t.effort, t.timeMinutes),
              priority: derivePriority(t.effort, t.timeMinutes),
              completed: false,
              ...(t.substeps?.length ? { substeps: t.substeps.slice(0, 3) } : {}),
            }));

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ tasks }));
            return;
          }

          // ── /api/chat ─────────────────────────────────────────────────────
          if (url === '/api/chat') {
            const planGoal: string    = body.planGoal  ?? '';
            const planTasks: any[]    = body.planTasks ?? [];
            const history: any[]      = body.history   ?? [];
            const userMessage: string = body.message   ?? '';

            const taskSummary = planTasks.map((t: any, i: number) =>
              `${i + 1}. [${t.completed ? '✓ done' : '○ todo'}] "${t.text}" — ${t.effort} effort, ${t.timeLabel}\n   ${t.details}`
            ).join('\n');

            const systemPrompt = `You are a warm, encouraging personal growth coach. The user is working on this goal:
"${planGoal}"

Their current action plan:
${taskSummary}

Help them with questions about tasks, what to prioritise next, how to approach something, or motivation. Be concise (2–4 sentences) and specific — reference the actual task names when helpful. Never regenerate the full plan unless explicitly asked.`;

            const recentHistory = history.slice(-14);
            const claudeMessages: { role: string; content: string }[] = [];
            for (const msg of recentHistory) {
              const role = msg.type === 'user' ? 'user' : 'assistant';
              if (claudeMessages.length > 0 && claudeMessages[claudeMessages.length - 1].role === role) continue;
              claudeMessages.push({ role, content: msg.text });
            }
            if (claudeMessages.length === 0 || claudeMessages[claudeMessages.length - 1].role !== 'user') {
              claudeMessages.push({ role: 'user', content: userMessage });
            } else {
              claudeMessages[claudeMessages.length - 1].content += '\n\n' + userMessage;
            }
            while (claudeMessages.length > 0 && claudeMessages[0].role !== 'user') {
              claudeMessages.shift();
            }

            const chatResponse = await client.messages.create({
              model: 'claude-opus-4-7',
              max_tokens: 512,
              thinking: { type: 'adaptive' },
              system: systemPrompt,
              messages: claudeMessages as any,
            });

            const chatText = chatResponse.content.find((b: any) => b.type === 'text');
            const reply = (chatText as any)?.text ?? 'Let me think about that…';

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ reply }));
            return;
          }

        } catch (err: any) {
          console.error('[claude-api]', err);
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: err.message ?? 'Claude API error' }));
        }
      });
    },
  };
}

// ─── Figma asset resolver ─────────────────────────────────────────────────────

function figmaAssetResolver() {
  return {
    name: 'figma-asset-resolver',
    resolveId(id) {
      if (id.startsWith('figma:asset/')) {
        const filename = id.replace('figma:asset/', '')
        return path.resolve(__dirname, 'src/assets', filename)
      }
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
  plugins: [
    claudeApiPlugin(
      env.ANTHROPIC_API_KEY        ?? '',
      env.VITE_SUPABASE_URL        ?? '',
      env.SUPABASE_SERVICE_ROLE_KEY ?? '',
    ),
    figmaAssetResolver(),
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  assetsInclude: ['**/*.svg', '**/*.csv'],
  }
})
