import type { APIRoute } from 'astro';
import { requireAdmin } from '@/lib/auth';
import { verifyCsrf } from '@/lib/csrf';
import { query } from '@/lib/db';

export const POST: APIRoute = async (context) => {
  await requireAdmin(context);
  if (!verifyCsrf(context)) return new Response(JSON.stringify({ error: 'Invalid CSRF token' }), { status: 403 });
  const b = await context.request.json();
  const rows = await query(
    `INSERT INTO content.recipes (slug, title, description, difficulty, instructions)
     VALUES ($1,$2,$3,$4,$5)
     RETURNING *`,
    [b.slug, b.title, b.description, b.difficulty ?? 'easy', b.instructions ?? []]
  );
  return new Response(JSON.stringify(rows[0]), { status: 201 });
};
