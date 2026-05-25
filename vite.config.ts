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
            const userGoal: string = body.goal   ?? '';
            const mood: string     = body.mood   ?? '';
            const energy: number   = Number(body.energy ?? 50);

            // ── Determine energy tone from mood + energy level ────────────
            const lowMoods  = ['Drained', 'Heavy', 'Anxious'];
            const highMoods = ['Good', 'Grateful'];
            let tone: 'low' | 'medium' | 'full';
            if (energy < 25 || lowMoods.includes(mood)) {
              tone = 'low';
            } else if (energy > 70 || highMoods.includes(mood)) {
              tone = 'full';
            } else {
              tone = 'medium';
            }

            // ── Tone-specific instructions ────────────────────────────────
            const toneRules: Record<string, string> = {
              low: `
IMPORTANT — the user is having a tough day (mood: ${mood || 'low'}, energy: ${energy}%).
- Generate EXACTLY 4 tasks
- ALL tasks must be low-effort (≤15 min). You may include ONE medium task (≤30 min) at most.
- NO high-effort tasks — zero "high" effort entries, zero substeps
- Focus on immediate, mood-lifting micro-wins: tiny actions they can complete RIGHT NOW to feel a small sense of progress
- Task titles should feel gentle, kind, and encouraging — not demanding or overwhelming
- At least 2 tasks must be under 10 minutes
- Prioritise doing over planning`,

              medium: `
The user is in a moderate state (mood: ${mood || 'neutral'}, energy: ${energy}%).
- Generate exactly 5 tasks
- Mostly low and medium effort — at most 1 high-effort task (if included, it must have substeps)
- Include at least 2 quick wins (low effort, ≤15 min) to build momentum
- Keep the overall plan achievable in a few sessions`,

              full: `
The user is in great shape (mood: ${mood || 'good'}, energy: ${energy}%).
- Generate exactly 6 tasks spanning the full effort spectrum
- Include 1–2 high-effort tasks with substeps — be ambitious
- Mix immediate quick wins with meaningful longer-term milestones
- Match the user's energy: make the plan feel exciting and worthwhile`,
            };

            const systemPrompt = `You are a personal growth coach and productivity expert.
The user will share a goal or challenge. Break it down into concrete, actionable tasks.

${toneRules[tone]}

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

Base rules:
- effort "low" = ≤15 min quick win; "medium" = 20–60 min; "high" = >60 min
- timeMinutes must match timeLabel (5→"5 min", 30→"30 min", 60→"1 hr", 120→"2 hrs")
- Tasks should build on each other in a logical sequence
- Be specific and actionable for THIS exact goal, not generic advice
- For every high-effort task, include a "substeps" array of exactly 3 short action phrases (max 6 words each)
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

            // Include task IDs so AI can reference them for breakdowns
            const taskSummary = planTasks.map((t: any) =>
              `[id:${t.id}] [${t.completed ? '✓ done' : '○ todo'}] "${t.text}" — ${t.effort} effort, ${t.timeLabel}\n   ${t.details}`
            ).join('\n');

            const systemPrompt = `You are a warm, encouraging personal growth coach. The user is working on this goal:
"${planGoal}"

Their current action plan:
${taskSummary}

TASK BREAKDOWN CAPABILITY:
When the user asks you to break down a task, decompose it, split it into smaller steps, or make it more manageable, you MUST respond with ONLY this JSON (no markdown, no extra text):
{
  "type": "task_breakdown",
  "reply": "Friendly 1-2 sentence message confirming what you did",
  "originalTaskId": "<exact id from [id:X] above>",
  "newTasks": [
    {
      "text": "Short action title (max 8 words)",
      "details": "One sentence: exactly what to do",
      "effort": "low",
      "timeMinutes": 15,
      "timeLabel": "15 min",
      "column": "do-now"
    }
  ]
}
Rules for breakdown tasks:
- Generate 3–5 concrete sub-tasks that together complete the original task
- Prefer low and medium effort tasks (keep each under 45 min)
- column must be one of: "do-now", "this-week", "plan-ahead"
- effort must be "low" (≤15 min), "medium" (16–60 min), or "high" (>60 min)
- timeMinutes must match timeLabel exactly

For ALL other requests (questions, motivation, advice), reply with PLAIN TEXT only — no JSON.`;


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
              max_tokens: 1024,
              thinking: { type: 'adaptive' },
              system: systemPrompt,
              messages: claudeMessages as any,
            });

            const chatText = chatResponse.content.find((b: any) => b.type === 'text');
            const rawReply = (chatText as any)?.text ?? 'Let me think about that…';

            // Try to parse as structured task breakdown
            function derivePriorityFromEffort(effort: string, mins: number) {
              if (effort === 'low' && mins <= 15) return 'p1';
              if (effort === 'high' || mins > 60) return 'p3';
              return 'p2';
            }

            try {
              const trimmed = rawReply.trim();
              if (trimmed.startsWith('{')) {
                const parsed = JSON.parse(trimmed);
                if (parsed.type === 'task_breakdown' && parsed.originalTaskId && Array.isArray(parsed.newTasks)) {
                  const newTasks = parsed.newTasks.map((t: any, i: number) => ({
                    id: `${parsed.originalTaskId}-${i + 1}-${Date.now()}`,
                    text: t.text,
                    details: t.details ?? '',
                    effort: t.effort ?? 'medium',
                    timeLabel: t.timeLabel ?? '30 min',
                    timeMinutes: t.timeMinutes ?? 30,
                    column: t.column ?? 'this-week',
                    priority: derivePriorityFromEffort(t.effort ?? 'medium', t.timeMinutes ?? 30),
                    completed: false,
                  }));
                  res.writeHead(200, { 'Content-Type': 'application/json' });
                  res.end(JSON.stringify({
                    reply: parsed.reply ?? 'Here are your updated tasks!',
                    taskBreakdown: {
                      originalTaskId: parsed.originalTaskId,
                      newTasks,
                    },
                  }));
                  return;
                }
              }
            } catch (_) {
              // Not JSON — fall through to plain text reply
            }

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ reply: rawReply }));
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
