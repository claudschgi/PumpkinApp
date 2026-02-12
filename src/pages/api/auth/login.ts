import type { APIRoute } from 'astro';
import { createSession, verifyPassword } from '@/lib/auth';
import { query } from '@/lib/db';
import { error, json, parseJson } from '@/lib/http';
import { isRateLimited } from '@/lib/rateLimit';
import { loginSchema } from '@/lib/validators';

export const POST: APIRoute = async (context) => {
  try {
    const body = await parseJson(context.request, loginSchema);
    const ip = context.clientAddress ?? 'unknown';
    if (isRateLimited(`login:${ip}`, 10, 60_000)) {
      return error('Too many requests', 429);
    }

    const users = await query<{ id: string; password_hash: string }>(
      'SELECT id, password_hash FROM auth.users WHERE email = $1 LIMIT 1',
      [body.email]
    );

    const user = users[0];
    if (!user || !(await verifyPassword(body.password, user.password_hash))) {
      return error('Invalid credentials', 401);
    }

    await createSession(context, user.id);
    return json({ ok: true });
  } catch (err) {
    if (err instanceof Response) return err;
    return error('Login failed', 500);
  }
};
