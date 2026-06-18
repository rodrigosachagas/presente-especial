import { NextResponse } from 'next/server';
import { criarPresente } from '@/lib/db';
import { gerarSlug, gerarToken } from '@/lib/helpers';
import { processarUploadFoto } from '@/lib/upload';
import { getSession } from '@/lib/session';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const fd = await request.formData();
    const nome = (fd.get('nome') as string)?.trim();
    const tipo = (fd.get('tipo') as string) || 'aniversario';
    const data = (fd.get('data') as string) || null;
    const mensagem = (fd.get('mensagem') as string) || null;
    const senha = (fd.get('senha') as string)?.trim();
    const fotoFiles = fd.getAll('fotos') as File[];

    if (!nome) return NextResponse.json({ error: 'Nome é obrigatório' }, { status: 400 });
    if (!senha || senha.length < 4) return NextResponse.json({ error: 'Senha deve ter pelo menos 4 caracteres' }, { status: 400 });

    const codigoPublico = gerarSlug(nome);
    const codigoAdmin = gerarSlug('admin-' + nome);
    const tokenAdmin = gerarToken();
    const tokenAlbum = gerarToken();
    const senhaHash = await bcrypt.hash(senha, 10);

    let fotoCapa: string | null = null;
    const fotosValidas = fotoFiles.filter(f => f && f.size > 0);
    if (fotosValidas.length > 0) {
      const urls = await Promise.all(fotosValidas.map(f => processarUploadFoto(f)));
      const urlsFiltradas = urls.filter(Boolean) as string[];
      if (urlsFiltradas.length > 0) {
        fotoCapa = JSON.stringify(urlsFiltradas);
      }
    }

    const id = await criarPresente({
      codigo_publico: codigoPublico,
      codigo_admin: codigoAdmin,
      token_admin: tokenAdmin,
      token_album: tokenAlbum,
      senha_album: senhaHash,
      nome_homenageado: nome,
      tipo_evento: tipo,
      data_evento: data,
      foto_capa: fotoCapa,
      mensagem_inicial: mensagem,
    });

    const session = await getSession();
    session.presente_criado = {
      id,
      codigo_publico: codigoPublico,
      codigo_admin: codigoAdmin,
      token_admin: tokenAdmin,
      token_album: tokenAlbum,
      senha_plain: senha,
      nome_homenageado: nome,
    };
    await session.save();

    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Erro interno';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
