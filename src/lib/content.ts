import { query } from './db';

export async function listPumpkins(filters: {
  q?: string;
  season?: number;
  taste?: string;
}) {
  const clauses: string[] = [];
  const params: unknown[] = [];

  if (filters.q) {
    params.push(`%${filters.q}%`);
    clauses.push(`(name ILIKE $${params.length} OR description ILIKE $${params.length})`);
  }
  if (filters.season) {
    params.push(filters.season);
    clauses.push(`season_start <= $${params.length} AND season_end >= $${params.length}`);
  }
  if (filters.taste) {
    params.push(filters.taste);
    clauses.push(`$${params.length} = ANY(taste_profile)`);
  }

  const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';

  return query(
    `SELECT id, slug, name, description, season_start, season_end, taste_profile, best_for
     FROM content.pumpkins
     ${where}
     ORDER BY name ASC`,
    params
  );
}

export async function listRecipes(filters: {
  q?: string;
  diet?: string;
  difficulty?: string;
  timeMax?: number;
}) {
  const clauses: string[] = [];
  const params: unknown[] = [];

  if (filters.q) {
    params.push(`%${filters.q}%`);
    clauses.push(`(title ILIKE $${params.length} OR description ILIKE $${params.length})`);
  }
  if (filters.diet) {
    params.push(filters.diet);
    clauses.push(`$${params.length} = ANY(diet)`);
  }
  if (filters.difficulty) {
    params.push(filters.difficulty);
    clauses.push(`difficulty = $${params.length}`);
  }
  if (filters.timeMax) {
    params.push(filters.timeMax);
    clauses.push(`total_time_minutes <= $${params.length}`);
  }

  const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';

  return query(
    `SELECT id, slug, title, description, total_time_minutes, difficulty, diet
     FROM content.recipes
     ${where}
     ORDER BY created_at DESC`,
    params
  );
}
