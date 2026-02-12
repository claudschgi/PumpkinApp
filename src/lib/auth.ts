import bcrypt from 'bcryptjs';
import crypto from 'node:crypto';
import { query } from './db';

const SESSION_COOKIE = 'pumpkin_session';

export type SessionUser = {
  id: string;
  email: string;
  role: 'admin' | 'user';
};

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

function sha(input: string) {
  return crypto.createHash('sha256').update(input).digest('hex');
}

type SessionContext = { cookies: { set: Function; get: Function; delete: Function } };
type RequestContext = SessionContext;

export async function createSession(context: SessionContext, userId: string) {
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 14);

  await query(
    `INSERT INTO auth.sessions (user_id, token_hash, expires_at)
     VALUES ($1, $2, $3)`,
    [userId, sha(token), expiresAt]
  );

  context.cookies.set(SESSION_COOKIE, token, {
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: expiresAt
  });
}

export async function destroySession(context: SessionContext) {
  const token = context.cookies.get(SESSION_COOKIE)?.value;
  if (token) {
    await query('DELETE FROM auth.sessions WHERE token_hash = $1', [sha(token)]);
  }

  context.cookies.delete(SESSION_COOKIE, { path: '/' });
}

export async function getSessionUser(context: RequestContext): Promise<SessionUser | null> {
  const token = context.cookies.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const users = await query<SessionUser>(
    `SELECT u.id, u.email, u.role
     FROM auth.sessions s
     JOIN auth.users u ON u.id = s.user_id
     WHERE s.token_hash = $1
       AND s.expires_at > NOW()
     LIMIT 1`,
    [sha(token)]
  );

  return users[0] ?? null;
}


export async function requireUser(context: RequestContext): Promise<SessionUser> {
  const user = await getSessionUser(context);
  if (!user) {
    throw new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }
  return user;
}

export async function requireAdmin(context: RequestContext): Promise<SessionUser> {
  const user = await requireUser(context);
  if (user.role !== 'admin') {
    throw new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403 });
  }
  return user;
}
