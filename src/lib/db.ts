import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.warn('DATABASE_URL is not set; API routes will fail until configured.');
}

export const db = new Pool({
  connectionString
});

export async function query<T>(text: string, params: unknown[] = []): Promise<T[]> {
  const result = await db.query<T>(text, params);
  return result.rows;
}
