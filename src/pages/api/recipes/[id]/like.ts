import type { APIRoute } from 'astro';
import { query } from '@/lib/db';
import { error, json } from '@/lib/http';
import { requireCsrfOrResponse, requireUserOrResponse } from '@/lib/guards';
import { isRateLimited } from '@/lib/rateLimit';

export const POST: APIRoute = async (context) => {
  const auth = await requireUserOrResponse(context);
  if ('response' in auth) return auth.response;
  if (isRateLimited(`social:${auth.user.id}`, 60, 60_000)) return error('Too many requests', 429);
  const csrf = requireCsrfOrResponse(context);
  if ('response' in csrf) return csrf.response;

  await query(
    `INSERT INTO social.recipe_likes (user_id, recipe_id)
     VALUES ($1, $2)
     ON CONFLICT (user_id, recipe_id) DO NOTHING`,
    [auth.user.id, context.params.id]
  );

  return json({ ok: true });
};

export const DELETE: APIRoute = async (context) => {
  const auth = await requireUserOrResponse(context);
  if ('response' in auth) return auth.response;
  if (isRateLimited(`social:${auth.user.id}`, 60, 60_000)) return error('Too many requests', 429);
  const csrf = requireCsrfOrResponse(context);
  if ('response' in csrf) return csrf.response;

  await query('DELETE FROM social.recipe_likes WHERE user_id = $1 AND recipe_id = $2', [auth.user.id, context.params.id]);
  return json({ ok: true });
};
