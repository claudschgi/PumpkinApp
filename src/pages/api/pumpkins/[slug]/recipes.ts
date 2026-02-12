import type { APIRoute } from 'astro';
import { query } from '@/lib/db';

export const GET: APIRoute = async ({ params }) => {
  const rows = await query(
    `SELECT r.*
     FROM content.recipes r
     JOIN content.recipe_pumpkins rp ON rp.recipe_id = r.id
     JOIN content.pumpkins p ON p.id = rp.pumpkin_id
     WHERE p.slug = $1`,
    [params.slug]
  );
  return new Response(JSON.stringify(rows));
};
