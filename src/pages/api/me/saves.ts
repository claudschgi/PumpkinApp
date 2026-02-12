import type { APIRoute } from 'astro';
import { query } from '@/lib/db';
import { json } from '@/lib/http';
import { requireUserOrResponse } from '@/lib/guards';

export const GET: APIRoute = async (context) => {
  const auth = await requireUserOrResponse(context);
  if ('response' in auth) return auth.response;
  const rows = await query(
    `SELECT r.*
     FROM social.recipe_saves s
     JOIN content.recipes r ON r.id = s.recipe_id
     WHERE s.user_id = $1
     ORDER BY s.created_at DESC`,
    [auth.user.id]
  );
  return json(rows);
};
