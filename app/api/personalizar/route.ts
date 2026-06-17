import { NextResponse } from 'next/server';
import { buscarPresentePorAdmin, atualizarPersonalizacao } from '@/lib/db';

const LAYOUTS = ['livro', 'mural', 'tempo', 'polaroid', 'cinema', 'minimo'];
const TEMAS = ['romantico', 'festa', 'elegante', 'suave'];

export async function POST(request: Request) {
  const { c, token, layout, tema } = await request.json();

  const p = await buscarPresentePorAdmin(c, token);
  if (!p) return NextResponse.json({ error: 'Denied' }, { status: 403 });

  const safeLayout = LAYOUTS.includes(layout) ? layout : 'livro';
  const safeTema = TEMAS.includes(tema) ? tema : 'romantico';

  await atualizarPersonalizacao(p.id, safeLayout, safeTema);

  return NextResponse.json({ ok: true });
}
