import { ZodError } from 'zod';

export function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' }
  });
}

export function error(message: string, status = 400): Response {
  return json({ error: message }, status);
}

export async function parseJson<T>(request: Request, parser: { parse: (input: unknown) => T }): Promise<T> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    throw error('Invalid JSON payload', 400);
  }

  try {
    return parser.parse(body);
  } catch (err) {
    if (err instanceof ZodError) {
      throw error(err.issues.map((issue) => issue.message).join(', '), 422);
    }
    throw err;
  }
}
