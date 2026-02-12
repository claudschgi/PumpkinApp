import type { APIRoute } from 'astro';
import { requireAdmin } from '@/lib/auth';
import { verifyCsrf } from '@/lib/csrf';
import { query } from '@/lib/db';

export const PUT: APIRoute = async (context) => {
  await requireAdmin(context);
  if (!verifyCsrf(context)) return new Response(JSON.stringify({ error: 'Invalid CSRF token' }), { status: 403 });
  const b = await context.request.json();
  const rows = await query(
    `UPDATE content.tags
     SET name = COALESCE($1, name),
         type = COALESCE($2, type)
     WHERE id = $3
     RETURNING *`,
    [b.name, b.type, context.params.id]
  );
  return new Response(JSON.stringify(rows[0] ?? null));
};

export const DELETE: APIRoute = async (context) => {
  await requireAdmin(context);
  if (!verifyCsrf(context)) return new Response(JSON.stringify({ error: 'Invalid CSRF token' }), { status: 403 });
  await query('DELETE FROM content.tags WHERE id = $1', [context.params.id]);
  return new Response(JSON.stringify({ ok: true }));
};
