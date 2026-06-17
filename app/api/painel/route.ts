import { NextResponse } from 'next/server';
import { buscarPresentePorAdmin, buscarMensagem, aprovarMensagem, recusarMensagem } from '@/lib/db';

export async function POST(request: Request) {
  const body = await request.json();
  const { acao, msg_id, c, token } = body;

  const presente = await buscarPresentePorAdmin(c, token);
  if (!presente) return NextResponse.json({ error: 'Denied' }, { status: 403 });

  const msg = await buscarMensagem(msg_id);
  if (!msg || msg.presente_id !== presente.id) return NextResponse.json({ error: 'Invalid' }, { status: 400 });

  if (acao === 'aprovar') await aprovarMensagem(msg_id);
  else if (acao === 'recusar') await recusarMensagem(msg_id);

  return NextResponse.json({ ok: true });
}
