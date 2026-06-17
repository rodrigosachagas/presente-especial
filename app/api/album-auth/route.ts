import { NextResponse } from 'next/server';
import { buscarPresentePorAlbumToken } from '@/lib/db';
import { getSession } from '@/lib/session';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  const { c: slug, t: token, senha } = await request.json();
  if (!slug || !token || !senha) {
    return NextResponse.json({ error: 'Dados incompletos' }, { status: 400 });
  }

  const p = await buscarPresentePorAlbumToken(slug, token);
  if (!p) return NextResponse.json({ error: 'Álbum não encontrado' }, { status: 404 });

  const ok = await bcrypt.compare(senha, p.senha_album);
  if (!ok) return NextResponse.json({ error: 'Senha incorreta. Tente novamente.' }, { status: 401 });

  const session = await getSession();
  if (!session.album_auth) session.album_auth = {};
  session.album_auth[String(p.id)] = true;
  await session.save();

  return NextResponse.json({ ok: true });
}
