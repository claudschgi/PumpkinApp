import crypto from 'node:crypto';
import type { APIContext } from 'astro';

const CSRF_COOKIE = 'pumpkin_csrf';

export function ensureCsrfToken(context: APIContext): string {
  const existing = context.cookies.get(CSRF_COOKIE)?.value;
  if (existing) return existing;

  const token = crypto.randomBytes(24).toString('hex');
  context.cookies.set(CSRF_COOKIE, token, {
    path: '/',
    httpOnly: false,
    secure: true,
    sameSite: 'lax'
  });

  return token;
}

export function verifyCsrf(context: APIContext): boolean {
  const cookie = context.cookies.get(CSRF_COOKIE)?.value;
  const header = context.request.headers.get('x-csrf-token');
  return Boolean(cookie && header && cookie === header);
}
