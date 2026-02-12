import type { APIRoute } from 'astro';
import { requireAdmin } from '@/lib/auth';
import { verifyCsrf } from '@/lib/csrf';
import { query } from '@/lib/db';

export const POST: APIRoute = async (context) => {
  await requireAdmin(context);
  if (!verifyCsrf(context)) return new Response(JSON.stringify({ error: 'Invalid CSRF token' }), { status: 403 });
  const b = await context.request.json();
  const rows = await query(
    `INSERT INTO content.pumpkins (slug, name, description, season_start, season_end, taste_profile, texture, best_for, nutrition)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
     RETURNING *`,
    [b.slug, b.name, b.description, b.season_start, b.season_end, b.taste_profile ?? [], b.texture ?? [], b.best_for ?? [], b.nutrition ?? {}]
  );
  return new Response(JSON.stringify(rows[0]), { status: 201 });
};
