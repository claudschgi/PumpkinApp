import type { APIRoute } from 'astro';
import { requireUser } from '@/lib/auth';
import { verifyCsrf } from '@/lib/csrf';
import { query } from '@/lib/db';
import { isRateLimited } from '@/lib/rateLimit';

export const POST: APIRoute = async (context) => {
  const user = await requireUser(context);
  if (isRateLimited(`social:${user.id}`, 60, 60_000)) return new Response(JSON.stringify({ error: 'Too many requests' }), { status: 429 });
  if (!verifyCsrf(context)) return new Response(JSON.stringify({ error: 'Invalid CSRF token' }), { status: 403 });
  await query(
    `INSERT INTO social.recipe_likes (user_id, recipe_id)
     VALUES ($1, $2)
     ON CONFLICT (user_id, recipe_id) DO NOTHING`,
    [user.id, context.params.id]
  );
  return new Response(JSON.stringify({ ok: true }));
};

export const DELETE: APIRoute = async (context) => {
  const user = await requireUser(context);
  if (isRateLimited(`social:${user.id}`, 60, 60_000)) return new Response(JSON.stringify({ error: 'Too many requests' }), { status: 429 });
  if (!verifyCsrf(context)) return new Response(JSON.stringify({ error: 'Invalid CSRF token' }), { status: 403 });
  await query('DELETE FROM social.recipe_likes WHERE user_id = $1 AND recipe_id = $2', [user.id, context.params.id]);
  return new Response(JSON.stringify({ ok: true }));
};
