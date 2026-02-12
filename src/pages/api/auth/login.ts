import type { APIRoute } from 'astro';
import { createSession, verifyPassword } from '@/lib/auth';
import { query } from '@/lib/db';
import { isRateLimited } from '@/lib/rateLimit';

export const POST: APIRoute = async (context) => {
  const body = await context.request.json();
  const ip = context.clientAddress ?? 'unknown';
  if (isRateLimited(`login:${ip}`, 10, 60_000)) {
    return new Response(JSON.stringify({ error: 'Too many requests' }), { status: 429 });
  }
  const users = await query<{ id: string; password_hash: string }>(
    'SELECT id, password_hash FROM auth.users WHERE email = $1 LIMIT 1',
    [body.email]
  );

  const user = users[0];
  if (!user || !(await verifyPassword(body.password, user.password_hash))) {
    return new Response(JSON.stringify({ error: 'Invalid credentials' }), { status: 401 });
  }

  await createSession(context, user.id);
  return new Response(JSON.stringify({ ok: true }));
};
