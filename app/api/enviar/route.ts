import { NextResponse } from 'next/server';
import { buscarPresentePorSlug, criarMensagem } from '@/lib/db';
import { processarUploadFoto, processarUploadAudio } from '@/lib/upload';

export async function POST(request: Request) {
  try {
    const fd = await request.formData();
    const slug = (fd.get('c') as string)?.trim();
    const nome = (fd.get('nome') as string)?.trim();
    const mensagem = (fd.get('mensagem') as string)?.trim();
    const whatsapp = (fd.get('whatsapp') as string)?.trim() || null;
    const fotoFile = fd.get('foto') as File | null;
    const audioFile = fd.get('audio') as File | null;

    if (!slug) return NextResponse.json({ error: 'Link inválido' }, { status: 400 });
    if (!nome) return NextResponse.json({ error: 'Nome é obrigatório' }, { status: 400 });
    if (!mensagem) return NextResponse.json({ error: 'Mensagem é obrigatória' }, { status: 400 });

    const presente = await buscarPresentePorSlug(slug);
    if (!presente) return NextResponse.json({ error: 'Presente não encontrado' }, { status: 404 });

    let foto: string | null = null;
    if (fotoFile && fotoFile.size > 0) {
      foto = await processarUploadFoto(fotoFile);
    }

    let audio: string | null = null;
    if (audioFile && audioFile.size > 0) {
      audio = await processarUploadAudio(audioFile);
    }

    await criarMensagem({
      presente_id: presente.id,
      nome,
      whatsapp,
      mensagem,
      foto_path: foto,
      audio_path: audio,
    });

    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Erro interno';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
