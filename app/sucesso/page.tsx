import { redirect } from 'next/navigation';
import { getSession } from '@/lib/session';
import Link from 'next/link';
import CopyButton from './copy-button';

export default async function SucessoPage() {
  const session = await getSession();
  const p = session.presente_criado;
  if (!p) redirect('/');

  const base = process.env.NEXT_PUBLIC_BASE_URL || '';
  const linkPublico = `${base}/presente?c=${encodeURIComponent(p.codigo_publico)}`;
  const linkPainel = `${base}/painel?c=${encodeURIComponent(p.codigo_admin)}&token=${encodeURIComponent(p.token_admin)}`;
  const linkAlbum = `${base}/album?c=${encodeURIComponent(p.codigo_publico)}&t=${encodeURIComponent(p.token_album)}`;
  const wppMsg = `💌 Escreva uma mensagem para ${p.nome_homenageado}!\n\n${linkPublico}`;
  const wppUrl = `https://wa.me/?text=${encodeURIComponent(wppMsg)}`;

  return (
    <div className="app">
      <div className="screen screen--center">
        <div style={{
          width: 72, height: 72, borderRadius: '50%', background: 'var(--blush)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, marginBottom: 24
        }}>🎉</div>

        <h1 className="h2" style={{ marginBottom: 8 }}>Presente criado!</h1>
        <p className="lead" style={{ marginBottom: 24 }}>
          Agora compartilhe o link para que todos enviem mensagens para <strong>{p.nome_homenageado}</strong>.
        </p>

        {/* Public link */}
        <div className="eyebrow mb-12">Link para compartilhar</div>
        <div style={{
          background: 'var(--surface-2)', border: '1px solid var(--line)',
          borderRadius: 14, padding: '14px 16px', fontSize: 13, wordBreak: 'break-all',
          color: 'var(--ink)', marginBottom: 10, width: '100%',
        }}>{linkPublico}</div>
        <CopyButton text={linkPublico} label="Copiar link" />

        <a className="btn btn-primary mb-12" href={wppUrl} target="_blank" rel="noopener"
          style={{ marginTop: 8, background: '#25d366' }}>
          Compartilhar no WhatsApp
        </a>

        {/* Password */}
        <div className="eyebrow mb-12" style={{ marginTop: 16 }}>Senha do álbum</div>
        <div style={{
          background: 'var(--surface-2)', border: '1px solid var(--line)',
          borderRadius: 14, padding: '14px 20px', fontSize: 22, fontWeight: 700,
          letterSpacing: 3, textAlign: 'center', width: '100%', marginBottom: 16,
          fontFamily: 'monospace', color: 'var(--ink)',
        }}>{p.senha_plain}</div>
        <p className="lead" style={{ fontSize: 12, marginBottom: 20 }}>
          Guarde essa senha — será necessária para abrir o álbum.
        </p>

        {/* Admin link */}
        <div className="eyebrow mb-12">Link do painel (só seu)</div>
        <div style={{
          background: 'var(--surface-2)', border: '1px solid var(--line)',
          borderRadius: 14, padding: '12px 16px', fontSize: 11, wordBreak: 'break-all',
          color: 'var(--neutro)', marginBottom: 10, width: '100%',
        }}>{linkPainel}</div>
        <CopyButton text={linkPainel} label="Copiar link do painel" />

        <Link className="btn btn-ghost" href={linkPainel} style={{ marginTop: 20 }}>
          Ir para o painel
        </Link>
      </div>
    </div>
  );
}
