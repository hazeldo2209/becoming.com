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

  const { goal = '', mood = '', energy = 50 } = req.body ?? {};

  const lowMoods  = ['Drained', 'Heavy', 'Anxious'];
  const highMoods = ['Good', 'Grateful'];
  let tone: 'low' | 'medium' | 'full';
  if (Number(energy) < 25 || lowMoods.includes(mood)) {
    tone = 'low';
  } else if (Number(energy) > 70 || highMoods.includes(mood)) {
    tone = 'full';
  } else {
    tone = 'medium';
  }

  const toneRules: Record<string, string> = {
    low: `
IMPORTANT — the user is having a tough day (mood: ${mood || 'low'}, energy: ${energy}%).
- Generate EXACTLY 4 tasks
- ALL tasks must be low-effort (≤15 min). You may include ONE medium task (≤30 min) at most.
- NO high-effort tasks
- Focus on immediate, mood-lifting micro-wins
- Task titles should feel gentle and encouraging
- At least 2 tasks must be under 10 minutes`,

    medium: `
The user is in a moderate state (mood: ${mood || 'neutral'}, energy: ${energy}%).
- Generate exactly 5 tasks
- Mostly low and medium effort — at most 1 high-effort task (if included, it must have substeps)
- Include at least 2 quick wins to build momentum`,

    full: `
The user is in great shape (mood: ${mood || 'good'}, energy: ${energy}%).
- Generate exactly 6 tasks spanning the full effort spectrum
- Include 1–2 high-effort tasks with substeps
- Mix immediate quick wins with meaningful longer-term milestones`,
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
    "substeps": ["step 1", "step 2", "step 3"]
  }
]

Base rules:
- effort "low" = ≤15 min; "medium" = 20–60 min; "high" = >60 min
- timeMinutes must match timeLabel
- Tasks should build on each other in a logical sequence
- For every high-effort task, include a "substeps" array of exactly 3 short action phrases
- Low and medium effort tasks must NOT have a "substeps" field`;

  const client = new Anthropic({ apiKey });
  const message = await client.messages.create({
    model: 'claude-opus-4-7',
    max_tokens: 1024,
    thinking: { type: 'adaptive' },
    system: systemPrompt,
    messages: [{ role: 'user', content: goal }],
  });

  const textBlock = message.content.find((b: any) => b.type === 'text');
  const rawJson   = (textBlock as any)?.text ?? '[]';
  const parsed    = JSON.parse(rawJson);

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
    id:          String(i + 1),
    text:        t.text,
    details:     t.details,
    effort:      t.effort,
    timeLabel:   t.timeLabel,
    timeMinutes: t.timeMinutes,
    column:      deriveColumn(t.effort, t.timeMinutes),
    priority:    derivePriority(t.effort, t.timeMinutes),
    completed:   false,
    ...(t.substeps?.length ? { substeps: t.substeps.slice(0, 3) } : {}),
  }));

  return res.status(200).json({ tasks });
}
