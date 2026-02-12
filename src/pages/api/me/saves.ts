import type { APIRoute } from 'astro';
import { requireUser } from '@/lib/auth';
import { query } from '@/lib/db';

export const GET: APIRoute = async (context) => {
  const user = await requireUser(context);
  const rows = await query(
    `SELECT r.*
     FROM social.recipe_saves s
     JOIN content.recipes r ON r.id = s.recipe_id
     WHERE s.user_id = $1
     ORDER BY s.created_at DESC`,
    [user.id]
  );
  return new Response(JSON.stringify(rows));
};
