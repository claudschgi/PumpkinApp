import type { APIRoute } from 'astro';
import { query } from '@/lib/db';

export const GET: APIRoute = async ({ params }) => {
  const rows = await query('SELECT * FROM content.pumpkins WHERE slug = $1 LIMIT 1', [params.slug]);
  if (!rows[0]) return new Response(JSON.stringify({ error: 'Not found' }), { status: 404 });
  return new Response(JSON.stringify(rows[0]));
};
