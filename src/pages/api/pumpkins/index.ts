import type { APIRoute } from 'astro';
import { listPumpkins } from '@/lib/content';

export const GET: APIRoute = async ({ url }) => {
  const data = await listPumpkins({
    q: url.searchParams.get('q') ?? undefined,
    season: url.searchParams.get('season') ? Number(url.searchParams.get('season')) : undefined,
    taste: url.searchParams.get('taste') ?? undefined
  });
  return new Response(JSON.stringify(data));
};
