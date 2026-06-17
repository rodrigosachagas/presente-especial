import { notFound, redirect } from 'next/navigation';
import { buscarPresentePorAdmin, listarMensagens } from '@/lib/db';
import PersonalizarClient from './personalizar-client';

export default async function PersonalizarPage({ searchParams }: { searchParams: Promise<{ c?: string; token?: string }> }) {
  const { c: codigo, token } = await searchParams;
  if (!codigo || !token) notFound();

  const p = await buscarPresentePorAdmin(codigo, token);
  if (!p) {
    return (
      <div className="app"><div className="screen screen--center">
        <h1 className="h2">Acesso negado</h1>
        <a className="btn btn-ghost" href="/" style={{ marginTop: 16, width: 'auto', padding: '0 28px' }}>Voltar</a>
      </div></div>
    );
  }

  const mensagens = await listarMensagens(p.id, 'APPROVED');

  return (
    <PersonalizarClient
      codigo={codigo}
      token={token}
      nome={p.nome_homenageado}
      layoutAtual={p.layout_album || 'livro'}
      temaAtual={p.tema_cor || 'romantico'}
      mensagens={JSON.parse(JSON.stringify(mensagens.slice(0, 3)))}
      totalMsg={mensagens.length}
    />
  );
}
