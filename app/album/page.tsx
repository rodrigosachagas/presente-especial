import { redirect, notFound } from 'next/navigation';
import { buscarPresentePorAlbumToken, listarMensagens } from '@/lib/db';
import { getSession } from '@/lib/session';
import AlbumClient from './album-client';

export default async function AlbumPage({ searchParams }: { searchParams: Promise<{ c?: string; t?: string }> }) {
  const { c: slug, t: token } = await searchParams;
  if (!slug || !token) notFound();

  const p = await buscarPresentePorAlbumToken(slug, token);
  if (!p) notFound();

  const session = await getSession();
  if (!session.album_auth?.[String(p.id)]) {
    redirect(`/album-senha?c=${encodeURIComponent(slug)}&t=${encodeURIComponent(token)}`);
  }

  const mensagens = await listarMensagens(p.id, 'APPROVED');

  return (
    <AlbumClient
      nome={p.nome_homenageado}
      layout={p.layout_album || 'livro'}
      tema={p.tema_cor || 'romantico'}
      fotoCapa={p.foto_capa || null}
      mensagens={JSON.parse(JSON.stringify(mensagens))}
    />
  );
}
