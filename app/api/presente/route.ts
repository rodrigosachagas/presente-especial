import { NextResponse } from 'next/server';
import { buscarPresentePorSlug } from '@/lib/db';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const slug = url.searchParams.get('c');
  if (!slug) return NextResponse.json({ error: 'Missing slug' }, { status: 400 });

  const p = await buscarPresentePorSlug(slug);
  if (!p) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  return NextResponse.json({
    nome_homenageado: p.nome_homenageado,
    tipo_evento: p.tipo_evento,
    foto_capa: p.foto_capa,
    mensagem_inicial: p.mensagem_inicial,
  });
}
