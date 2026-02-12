import type { APIRoute } from 'astro';
import { listRecipes } from '@/lib/content';

export const GET: APIRoute = async ({ url }) => {
  const data = await listRecipes({
    q: url.searchParams.get('q') ?? undefined,
    diet: url.searchParams.get('diet') ?? undefined,
    difficulty: url.searchParams.get('difficulty') ?? undefined,
    timeMax: url.searchParams.get('timeMax') ? Number(url.searchParams.get('timeMax')) : undefined
  });
  return new Response(JSON.stringify(data));
};
