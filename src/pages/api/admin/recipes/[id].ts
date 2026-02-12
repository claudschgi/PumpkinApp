import type { APIRoute } from 'astro';
import { requireAdmin } from '@/lib/auth';
import { verifyCsrf } from '@/lib/csrf';
import { query } from '@/lib/db';

export const PUT: APIRoute = async (context) => {
  await requireAdmin(context);
  if (!verifyCsrf(context)) return new Response(JSON.stringify({ error: 'Invalid CSRF token' }), { status: 403 });
  const b = await context.request.json();
  const rows = await query(
    `UPDATE content.recipes
     SET title = COALESCE($1, title),
         description = COALESCE($2, description),
         updated_at = NOW()
     WHERE id = $3
     RETURNING *`,
    [b.title, b.description, context.params.id]
  );
  return new Response(JSON.stringify(rows[0] ?? null));
};

export const DELETE: APIRoute = async (context) => {
  await requireAdmin(context);
  if (!verifyCsrf(context)) return new Response(JSON.stringify({ error: 'Invalid CSRF token' }), { status: 403 });
  await query('DELETE FROM content.recipes WHERE id = $1', [context.params.id]);
  return new Response(JSON.stringify({ ok: true }));
};
