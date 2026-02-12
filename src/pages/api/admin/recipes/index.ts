import type { APIRoute } from 'astro';
import { query } from '@/lib/db';
import { json, parseJson } from '@/lib/http';
import { requireAdminOrResponse, requireCsrfOrResponse } from '@/lib/guards';
import { recipeCreateSchema } from '@/lib/validators';

export const POST: APIRoute = async (context) => {
  try {
    const auth = await requireAdminOrResponse(context);
    if ('response' in auth) return auth.response;
    const csrf = requireCsrfOrResponse(context);
    if ('response' in csrf) return csrf.response;

    const b = await parseJson(context.request, recipeCreateSchema);
    const rows = await query(
      `INSERT INTO content.recipes (slug, title, description, difficulty, instructions)
       VALUES ($1,$2,$3,$4,$5)
       RETURNING *`,
      [b.slug, b.title, b.description, b.difficulty, b.instructions]
    );

    return json(rows[0], 201);
  } catch (err) {
    if (err instanceof Response) return err;
    return json({ error: 'Could not create recipe' }, 500);
  }
};
