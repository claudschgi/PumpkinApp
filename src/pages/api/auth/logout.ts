import type { APIRoute } from 'astro';
import { destroySession } from '@/lib/auth';
import { json } from '@/lib/http';

export const POST: APIRoute = async (context) => {
  await destroySession(context);
  return json({ ok: true });
};
