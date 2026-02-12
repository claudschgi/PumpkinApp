import type { APIRoute } from 'astro';
import { requireAdmin } from '@/lib/auth';
import { verifyCsrf } from '@/lib/csrf';
import { query } from '@/lib/db';

export const POST: APIRoute = async (context) => {
  await requireAdmin(context);
  if (!verifyCsrf(context)) return new Response(JSON.stringify({ error: 'Invalid CSRF token' }), { status: 403 });
  const b = await context.request.json();
  const rows = await query(
    `INSERT INTO content.tags (name, slug, type)
     VALUES ($1,$2,$3)
     RETURNING *`,
    [b.name, b.slug, b.type]
  );
  return new Response(JSON.stringify(rows[0]), { status: 201 });
};
