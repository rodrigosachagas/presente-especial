import { NextResponse } from 'next/server';
import { processarUploadFoto } from '@/lib/upload';

export async function POST(request: Request) {
  try {
    const fd = await request.formData();
    const file = fd.get('foto') as File | null;

    if (!file || file.size === 0) {
      return NextResponse.json({ error: 'Nenhuma foto enviada' }, { status: 400 });
    }

    const url = await processarUploadFoto(file);
    return NextResponse.json({ url });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Erro ao enviar foto';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
