import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { listarTodosPresentes } from '@/lib/db';

export async function GET() {
  const session = await getSession();
  if (!session.is_master_admin) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }
  const eventos = await listarTodosPresentes();
  return NextResponse.json({ eventos });
}

export async function POST(request: Request) {
  const { action, senha } = await request.json();
  const session = await getSession();

  if (action === 'logout') {
    session.is_master_admin = false;
    await session.save();
    return NextResponse.json({ ok: true });
  }

  if (action === 'login') {
    if (senha === process.env.ADMIN_MASTER_PASS) {
      session.is_master_admin = true;
      await session.save();
      return NextResponse.json({ ok: true });
    }
    return NextResponse.json({ error: 'Senha incorreta' }, { status: 401 });
  }

  return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
}
