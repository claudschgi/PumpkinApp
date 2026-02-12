import type { APIRoute } from 'astro';
import { getSessionUser } from '@/lib/auth';
import { ensureCsrfToken } from '@/lib/csrf';

export const GET: APIRoute = async (context) => {
  const user = await getSessionUser(context);
  const csrfToken = ensureCsrfToken(context);
  return new Response(JSON.stringify({ user, csrfToken }));
};
