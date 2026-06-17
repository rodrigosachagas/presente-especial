'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { iniciais, tempoAtras } from '@/lib/helpers';

interface PainelClientProps {
  presente: any;
  contagem: any;
  pendentes: any[];
  aprovadas: any[];
  recusadas: any[];
  todas: any[];
  linkPublico: string;
}

export default function PainelClient({
  presente,
  contagem,
  pendentes,
  aprovadas,
  recusadas,
  todas,
  linkPublico,
}: PainelClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const c = searchParams.get('c') || '';
  const token = searchParams.get('token') || '';

  const [tab, setTab] = useState<'pendentes' | 'aprovadas' | 'recusadas' | 'todas'>('pendentes');
  const [loading, setLoading] = useState<number | null>(null);
  const [copiado, setCopiado] = useState(false);

  const base = process.env.NEXT_PUBLIC_BASE_URL || '';
  const linkAlbum = `${base}/album?c=${encodeURIComponent(presente.codigo_publico)}&t=${encodeURIComponent(presente.token_album)}`;
  const linkPersonalizar = `${base}/personalizar?c=${encodeURIComponent(c)}&token=${encodeURIComponent(token)}`;

  async function copiarLink() {
    try {
      await navigator.clipboard.writeText(linkPublico);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch {
      // fallback silencioso
    }
  }

  async function acao(tipo: 'aprovar' | 'recusar', msgId: number) {
    setLoading(msgId);
    try {
      await fetch('/api/painel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ acao: tipo, msg_id: msgId, c, token }),
      });
      router.refresh();
    } catch {
      // erro silencioso
    } finally {
      setLoading(null);
    }
  }

  function renderMensagem(msg: any, showActions: boolean, showStatus: boolean, showRestore: boolean = false) {
    return (
      <div key={msg.id} className="card" style={{ marginBottom: 12 }}>
        <div className="msg-head">
          <div className="avatar">{iniciais(msg.nome)}</div>
          <div style={{ flex: 1 }}>
            <div className="msg-name">{msg.nome}</div>
            <div className="msg-sub">
              {msg.whatsapp && (
                <span style={{ marginRight: 8 }}>{msg.whatsapp}</span>
              )}
              <span>{tempoAtras(msg.created_at)}</span>
            </div>
          </div>
          {showStatus && (
            <span className={
              msg.status === 'APPROVED' ? 'chip chip--approved' :
              msg.status === 'PENDING' ? 'chip chip--pending' :
              'chip chip--rejected'
            }>
              {msg.status === 'APPROVED' && <>{'✓'} Aprovada</>}
              {msg.status === 'PENDING' && <>{'●'} Pendente</>}
              {msg.status === 'REJECTED' && <>{'✗'} Recusada</>}
            </span>
          )}
          {!showStatus && !showActions && msg.status === 'APPROVED' && (
            <span className="chip chip--approved">{'✓'} Aprovada</span>
          )}
        </div>

        <p className="msg-body">{msg.mensagem}</p>

        {msg.foto_path && (
          <div className="photo" style={{ marginTop: 12 }}>
            <img src={msg.foto_path} alt="Foto da mensagem" />
          </div>
        )}

        {msg.audio_path && (
          <audio
            controls
            preload="metadata"
            src={msg.audio_path}
            style={{ width: '100%', marginTop: 12, height: 40, borderRadius: 10 }}
          />
        )}

        {showActions && (
          <div className="btn-row" style={{ marginTop: 14 }}>
            <button
              className="btn btn-sm btn-success grow"
              disabled={loading === msg.id}
              onClick={() => acao('aprovar', msg.id)}
            >
              {loading === msg.id ? '...' : 'Aprovar'}
            </button>
            <button
              className="btn btn-sm btn-ghost"
              disabled={loading === msg.id}
              onClick={() => acao('recusar', msg.id)}
            >
              Recusar
            </button>
          </div>
        )}

        {showRestore && (
          <div className="btn-row" style={{ marginTop: 14 }}>
            <button
              className="btn btn-sm btn-success grow"
              disabled={loading === msg.id}
              onClick={() => acao('aprovar', msg.id)}
            >
              {loading === msg.id ? '...' : 'Restaurar e aprovar'}
            </button>
          </div>
        )}
      </div>
    );
  }

  const tabs = [
    { key: 'pendentes' as const, label: 'Pendentes', count: Number(contagem.pendentes || 0) },
    { key: 'aprovadas' as const, label: 'Aprovadas', count: Number(contagem.aprovadas || 0) },
    { key: 'recusadas' as const, label: 'Recusadas', count: Number(contagem.recusadas || 0) },
    { key: 'todas' as const, label: 'Todas', count: Number(contagem.total || 0) },
  ];

  const listAtual =
    tab === 'pendentes' ? pendentes :
    tab === 'aprovadas' ? aprovadas :
    tab === 'recusadas' ? recusadas :
    todas;

  return (
    <div className="app">
      <div className="screen">
        {/* Header */}
        <div style={{ marginBottom: 4 }}>
          <div className="eyebrow" style={{ marginBottom: 6 }}>Painel</div>
          <h1 className="h2" style={{ marginBottom: 8 }}>{presente.nome_homenageado}</h1>
          <button
            className="btn btn-sm btn-secondary"
            onClick={copiarLink}
            style={{ width: 'auto' }}
          >
            {copiado ? 'Copiado!' : 'Compartilhar'}
          </button>
        </div>

        {/* Counters */}
        <div style={{
          display: 'flex', gap: 10, marginBottom: 4,
        }}>
          <div className="card" style={{ flex: 1, textAlign: 'center', padding: '14px 8px' }}>
            <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--ink)' }}>
              {Number(contagem.total || 0)}
            </div>
            <div style={{ fontSize: 11, color: 'var(--neutro)', fontWeight: 600 }}>Recebidas</div>
          </div>
          <div className="card" style={{ flex: 1, textAlign: 'center', padding: '14px 8px' }}>
            <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--gold)' }}>
              {Number(contagem.pendentes || 0)}
            </div>
            <div style={{ fontSize: 11, color: 'var(--neutro)', fontWeight: 600 }}>Pendentes</div>
          </div>
          <div className="card" style={{ flex: 1, textAlign: 'center', padding: '14px 8px' }}>
            <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--green)' }}>
              {Number(contagem.aprovadas || 0)}
            </div>
            <div style={{ fontSize: 11, color: 'var(--neutro)', fontWeight: 600 }}>Publicadas</div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex', gap: 0,
          borderBottom: '1.5px solid var(--line-soft)',
          marginBottom: 8,
        }}>
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              style={{
                flex: 1,
                padding: '10px 0',
                fontSize: 13,
                fontWeight: 600,
                color: tab === t.key ? 'var(--rose)' : 'var(--muted)',
                background: 'none',
                border: 'none',
                borderBottom: tab === t.key ? '2px solid var(--rose)' : '2px solid transparent',
                cursor: 'pointer',
                transition: 'color 0.15s ease, border-color 0.15s ease',
              }}
            >
              {t.label} ({t.count})
            </button>
          ))}
        </div>

        {/* Messages */}
        <div style={{ flex: 1 }}>
          {listAtual.length === 0 && (
            <div className="text-center" style={{ padding: '32px 0' }}>
              <p className="lead muted">
                {tab === 'pendentes' && 'Nenhuma mensagem pendente.'}
                {tab === 'aprovadas' && 'Nenhuma mensagem aprovada ainda.'}
                {tab === 'recusadas' && 'Nenhuma mensagem recusada.'}
                {tab === 'todas' && 'Nenhuma mensagem recebida ainda.'}
              </p>
            </div>
          )}
          {listAtual.map((msg) =>
            renderMensagem(
              msg,
              tab === 'pendentes',
              tab === 'todas',
              tab === 'recusadas',
            )
          )}
        </div>

        {/* Footer */}
        <div style={{
          display: 'flex', gap: 10, paddingTop: 8,
          borderTop: '1px solid var(--line-soft)',
          marginTop: 'auto',
        }}>
          <Link className="btn btn-sm btn-secondary grow" href={linkAlbum}>
            Ver álbum
          </Link>
          <Link className="btn btn-sm btn-ghost grow" href={linkPersonalizar}>
            Personalizar
          </Link>
        </div>
      </div>
    </div>
  );
}
