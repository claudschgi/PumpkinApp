import type { APIContext } from 'astro';
import { getSessionUser } from './auth';
import { verifyCsrf } from './csrf';
import { error } from './http';

export async function requireUserOrResponse(context: APIContext) {
  const user = await getSessionUser(context);
  if (!user) return { response: error('Unauthorized', 401) };
  return { user };
}

export async function requireAdminOrResponse(context: APIContext) {
  const result = await requireUserOrResponse(context);
  if ('response' in result) return result;
  if (result.user.role !== 'admin') return { response: error('Forbidden', 403) };
  return result;
}

export function requireCsrfOrResponse(context: APIContext) {
  if (!verifyCsrf(context)) return { response: error('Invalid CSRF token', 403) };
  return { ok: true };
}
