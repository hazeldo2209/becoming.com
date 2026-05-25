import type { VercelRequest, VercelResponse } from '@vercel/node';
import Anthropic from '@anthropic-ai/sdk';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'ANTHROPIC_API_KEY not configured' });
  }

  const {
    planGoal    = '',
    planTasks   = [],
    history     = [],
    message: userMessage = '',
  } = req.body ?? {};

  const taskSummary = (planTasks as any[]).map((t: any) =>
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

  const recentHistory = (history as any[]).slice(-14);
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

  const client = new Anthropic({ apiKey });
  const chatResponse = await client.messages.create({
    model:   'claude-opus-4-7',
    max_tokens: 1024,
    thinking: { type: 'adaptive' },
    system:  systemPrompt,
    messages: claudeMessages as any,
  });

  const chatText = chatResponse.content.find((b: any) => b.type === 'text');
  const rawReply = (chatText as any)?.text ?? 'Let me think about that…';

  function derivePriorityFromEffort(effort: string, mins: number) {
    if (effort === 'low' && mins <= 15) return 'p1';
    if (effort === 'high' || mins > 60)  return 'p3';
    return 'p2';
  }

  try {
    const trimmed = rawReply.trim();
    if (trimmed.startsWith('{')) {
      const parsed = JSON.parse(trimmed);
      if (parsed.type === 'task_breakdown' && parsed.originalTaskId && Array.isArray(parsed.newTasks)) {
        const newTasks = parsed.newTasks.map((t: any, i: number) => ({
          id:          `${parsed.originalTaskId}-${i + 1}-${Date.now()}`,
          text:        t.text,
          details:     t.details ?? '',
          effort:      t.effort  ?? 'medium',
          timeLabel:   t.timeLabel ?? '30 min',
          timeMinutes: t.timeMinutes ?? 30,
          column:      t.column   ?? 'this-week',
          priority:    derivePriorityFromEffort(t.effort ?? 'medium', t.timeMinutes ?? 30),
          completed:   false,
        }));
        return res.status(200).json({
          reply: parsed.reply ?? 'Here are your updated tasks!',
          taskBreakdown: { originalTaskId: parsed.originalTaskId, newTasks },
        });
      }
    }
  } catch (_) {
    // Not JSON — plain text reply
  }

  return res.status(200).json({ reply: rawReply });
}
