import { buscarPresentePorAdmin, contarMensagens, listarMensagens } from '@/lib/db';
import PainelClient from './painel-client';

interface PageProps {
  searchParams: Promise<{ c?: string; token?: string }>;
}

export default async function PainelPage({ searchParams }: PageProps) {
  const { c, token } = await searchParams;

  if (!c || !token) {
    return (
      <div className="app">
        <div className="screen screen--center">
          <p className="lead">Link inválido.</p>
        </div>
      </div>
    );
  }

  const presente = await buscarPresentePorAdmin(c, token);

  if (!presente) {
    return (
      <div className="app">
        <div className="screen screen--center">
          <div style={{
            width: 56, height: 56, borderRadius: '50%', background: 'var(--blush)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 24, marginBottom: 16,
          }}>🔒</div>
          <h1 className="h2" style={{ marginBottom: 8 }}>Acesso negado</h1>
          <p className="lead">Este link não é válido ou expirou.</p>
        </div>
      </div>
    );
  }

  const [contagem, pendentes, aprovadas, todas] = await Promise.all([
    contarMensagens(presente.id),
    listarMensagens(presente.id, 'PENDING'),
    listarMensagens(presente.id, 'APPROVED'),
    listarMensagens(presente.id),
  ]);

  const base = process.env.NEXT_PUBLIC_BASE_URL || '';
  const linkPublico = `${base}/presente?c=${encodeURIComponent(presente.codigo_publico)}`;

  return (
    <PainelClient
      presente={presente}
      contagem={contagem}
      pendentes={pendentes}
      aprovadas={aprovadas}
      todas={todas}
      linkPublico={linkPublico}
    />
  );
}
