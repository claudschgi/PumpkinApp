import type { APIRoute } from 'astro';
import { requireUser } from '@/lib/auth';
import { query } from '@/lib/db';

export const GET: APIRoute = async (context) => {
  const user = await requireUser(context);
  const rows = await query(
    `SELECT r.*
     FROM social.recipe_likes l
     JOIN content.recipes r ON r.id = l.recipe_id
     WHERE l.user_id = $1
     ORDER BY l.created_at DESC`,
    [user.id]
  );
  return new Response(JSON.stringify(rows));
};
