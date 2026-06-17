import { NextResponse } from 'next/server';
import { buscarPresentePorAlbumToken } from '@/lib/db';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const slug = url.searchParams.get('c');
  const token = url.searchParams.get('t');
  if (!slug || !token) return NextResponse.json({ error: 'Missing params' }, { status: 400 });

  const p = await buscarPresentePorAlbumToken(slug, token);
  if (!p) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  return NextResponse.json({ nome: p.nome_homenageado });
}
