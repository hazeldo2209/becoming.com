import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const supabaseUrl        = process.env.VITE_SUPABASE_URL        ?? '';
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? '';

  if (!supabaseUrl || !supabaseServiceKey) {
    return res.status(500).json({ error: 'Supabase env vars not configured' });
  }

  const sb = createClient(supabaseUrl, supabaseServiceKey);

  // ── GET /api/reflections ──────────────────────────────────────────────────
  if (req.method === 'GET') {
    const { data, error } = await sb
      .from('reflections')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(200);

    if (error) return res.status(500).json({ error: error.message });

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

    return res.status(200).json({ reflections });
  }

  // ── POST /api/reflections ─────────────────────────────────────────────────
  if (req.method === 'POST') {
    const body = req.body ?? {};
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

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ ok: true, id: data.id });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
