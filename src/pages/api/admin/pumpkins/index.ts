import type { APIRoute } from 'astro';
import { query } from '@/lib/db';
import { json, parseJson } from '@/lib/http';
import { requireAdminOrResponse, requireCsrfOrResponse } from '@/lib/guards';
import { pumpkinCreateSchema } from '@/lib/validators';

export const POST: APIRoute = async (context) => {
  try {
    const auth = await requireAdminOrResponse(context);
    if ('response' in auth) return auth.response;
    const csrf = requireCsrfOrResponse(context);
    if ('response' in csrf) return csrf.response;

    const b = await parseJson(context.request, pumpkinCreateSchema);
    const rows = await query(
      `INSERT INTO content.pumpkins (slug, name, description, season_start, season_end, taste_profile, texture, best_for, nutrition)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
       RETURNING *`,
      [b.slug, b.name, b.description, b.season_start ?? null, b.season_end ?? null, b.taste_profile, b.texture, b.best_for, b.nutrition]
    );

    return json(rows[0], 201);
  } catch (err) {
    if (err instanceof Response) return err;
    return json({ error: 'Could not create pumpkin' }, 500);
  }
};
