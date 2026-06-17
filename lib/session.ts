import { getIronSession, IronSession } from 'iron-session';
import { cookies } from 'next/headers';

export interface SessionData {
  presente_criado?: {
    id: number;
    codigo_publico: string;
    codigo_admin: string;
    token_admin: string;
    token_album: string;
    senha_plain: string;
    nome_homenageado: string;
  };
  album_auth?: Record<string, boolean>;
  is_master_admin?: boolean;
}

export async function getSession(): Promise<IronSession<SessionData>> {
  const cookieStore = await cookies();
  return getIronSession<SessionData>(cookieStore, {
    password: process.env.SESSION_SECRET || 'presente-especial-default-secret-key-min-32-chars',
    cookieName: 'presente_session',
    cookieOptions: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      sameSite: 'lax',
    },
  });
}
