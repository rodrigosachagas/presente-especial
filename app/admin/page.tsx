'use client';

import { useState, useEffect } from 'react';
import { iniciais, dataFormatada, tempoAtras } from '@/lib/helpers';

interface Evento {
  id: number; codigo_publico: string; codigo_admin: string; token_admin: string;
  token_album: string; nome_homenageado: string; tipo_evento: string; data_evento: string;
  layout_album: string; tema_cor: string; created_at: string;
  total_msgs: number; pendentes: number; aprovadas: number;
}

export default function AdminPage() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [eventos, setEventos] = useState<Evento[]>([]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setErro('');
    const res = await fetch('/api/admin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'login', senha }),
    });
    if (res.ok) {
      setLoggedIn(true);
      loadEventos();
    } else {
      setErro('Senha incorreta.');
    }
  }

  async function loadEventos() {
    const res = await fetch('/api/admin');
    if (res.ok) {
      const data = await res.json();
      setEventos(data.eventos || []);
      setLoggedIn(true);
    }
  }

  useEffect(() => { loadEventos(); }, []);

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
  }

  if (!loggedIn) {
    return (
      <div className="app" style={{ background: 'linear-gradient(165deg,#3a2f42 0%,#2b2330 55%,#22192b 100%)' }}>
        <form className="screen screen--center" onSubmit={handleLogin}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(255,255,255,.08)', border: '1px solid rgba(214,51,108,.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, marginBottom: 24 }}>⚙️</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700, color: '#fff', margin: '0 0 8px' }}>Área do Admin</h1>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,.6)', margin: '0 0 28px' }}>Acesso restrito ao dono do sistema.</p>
          {erro && <div style={{ background: 'rgba(214,51,108,.2)', border: '1px solid rgba(214,51,108,.5)', borderRadius: 12, padding: '10px 16px', fontSize: 14, color: '#ff8ab0', marginBottom: 16, width: '100%' }}>{erro}</div>}
          <input type="password" value={senha} onChange={e => setSenha(e.target.value)} placeholder="Senha master" required autoComplete="off"
            style={{ width: '100%', background: 'rgba(255,255,255,.08)', border: '1.5px solid rgba(214,51,108,.4)', borderRadius: 16, padding: 16, color: '#fff', fontSize: 16, textAlign: 'center', marginBottom: 16, fontFamily: 'inherit' }} />
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Entrar</button>
        </form>
      </div>
    );
  }

  return (
    <div className="app">
      <div className="screen">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 20 }}>⚙️</span>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18 }}>Admin</span>
          </div>
          <a href="#" onClick={() => { fetch('/api/admin', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'logout' }) }); setLoggedIn(false); }}
            style={{ fontSize: 13, color: 'var(--rose)', fontWeight: 600, textDecoration: 'none' }}>Sair</a>
        </div>
        <p className="muted" style={{ fontSize: 13, margin: '0 0 20px' }}>
          {eventos.length} evento{eventos.length !== 1 ? 's' : ''} criado{eventos.length !== 1 ? 's' : ''}
        </p>

        {eventos.length === 0 && (
          <div className="text-center" style={{ padding: '48px 0' }}>
            <p className="lead">Nenhum evento criado ainda.</p>
            <a className="btn btn-primary" href="/criar" style={{ marginTop: 16, display: 'inline-flex', width: 'auto', padding: '14px 28px' }}>Criar primeiro presente</a>
          </div>
        )}

        {eventos.map(ev => {
          const linkPublico = `/presente?c=${encodeURIComponent(ev.codigo_publico)}`;
          const linkPainel = `/painel?c=${encodeURIComponent(ev.codigo_admin)}&token=${encodeURIComponent(ev.token_admin)}`;
          const linkAlbum = `/album?c=${encodeURIComponent(ev.codigo_publico)}&t=${encodeURIComponent(ev.token_album)}`;

          return (
            <div key={ev.id} className="card" style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                <div className="avatar" style={{ width: 44, height: 44, fontSize: 16 }}>{iniciais(ev.nome_homenageado)}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700 }}>{ev.nome_homenageado}</div>
                  <div style={{ fontSize: 12, color: 'var(--muted)' }}>
                    {ev.tipo_evento.charAt(0).toUpperCase() + ev.tipo_evento.slice(1)}
                    {ev.data_evento && <> &middot; {dataFormatada(ev.data_evento)}</>}
                    &nbsp;&middot; criado {tempoAtras(ev.created_at)}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 12, fontWeight: 600, padding: '4px 10px', borderRadius: 10, background: 'var(--blush)', color: 'var(--rose)' }}>{ev.total_msgs} msg</span>
                {Number(ev.pendentes) > 0 && (
                  <span style={{ fontSize: 12, fontWeight: 600, padding: '4px 10px', borderRadius: 10, background: '#fff4d6', color: 'var(--gold)' }}>{ev.pendentes} pend.</span>
                )}
                <span style={{ fontSize: 12, fontWeight: 600, padding: '4px 10px', borderRadius: 10, background: '#e3f4e7', color: 'var(--green)' }}>{ev.aprovadas} aprov.</span>
                <span style={{ fontSize: 12, fontWeight: 600, padding: '4px 10px', borderRadius: 10, background: 'var(--surface-2)', color: 'var(--neutro)' }}>{ev.layout_album} &middot; {ev.tema_cor}</span>
              </div>

              {[
                { label: 'Público', url: linkPublico },
                { label: 'Painel', url: linkPainel },
                { label: 'Álbum', url: linkAlbum },
              ].map(link => (
                <div key={link.label} style={{ background: 'var(--surface-2)', border: '1px solid var(--line-soft)', borderRadius: 10, padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--neutro)', textTransform: 'uppercase', letterSpacing: .5, minWidth: 52 }}>{link.label}</span>
                  <span style={{ fontSize: 12, color: 'var(--ink)', flex: 1, minWidth: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontFamily: 'monospace' }}>{link.url}</span>
                  <button className="btn btn-sm" style={{ background: 'var(--blush)', color: 'var(--rose)', boxShadow: 'none', padding: '6px 10px', fontSize: 11 }}
                    onClick={() => copyToClipboard(window.location.origin + link.url)}>Copiar</button>
                </div>
              ))}

              <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                <a className="btn btn-sm grow" href={linkPainel} style={{ background: 'var(--rose)', color: '#fff', boxShadow: 'none', justifyContent: 'center', textDecoration: 'none' }}>Abrir painel</a>
                <a className="btn btn-sm grow" href={linkPublico} style={{ background: 'transparent', border: '1.5px solid var(--line)', color: 'var(--neutro)', boxShadow: 'none', justifyContent: 'center', textDecoration: 'none' }}>Ver página</a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
