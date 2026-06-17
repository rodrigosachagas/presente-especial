'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function AlbumSenhaClient() {
  const router = useRouter();
  const params = useSearchParams();
  const slug = params.get('c') || '';
  const token = params.get('t') || '';
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);
  const [nome, setNome] = useState('');

  useState(() => {
    if (slug && token) {
      fetch(`/api/album-check?c=${encodeURIComponent(slug)}&t=${encodeURIComponent(token)}`)
        .then(r => r.json())
        .then(d => { if (d.nome) setNome(d.nome); });
    }
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro('');
    setLoading(true);
    try {
      const res = await fetch('/api/album-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ c: slug, t: token, senha }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Senha incorreta');
      router.push(`/album?c=${encodeURIComponent(slug)}&t=${encodeURIComponent(token)}`);
    } catch (err: unknown) {
      setErro(err instanceof Error ? err.message : 'Erro');
      setLoading(false);
    }
  }

  return (
    <div className="app" style={{ background: 'linear-gradient(165deg,#3a2f42 0%,#2b2330 55%,#22192b 100%)' }}>
      <div style={{ position: 'absolute', top: -60, left: '50%', transform: 'translateX(-50%)', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle,rgba(184,134,11,.28),transparent 70%)' }} />

      <form className="screen screen--center" onSubmit={handleSubmit} style={{ position: 'relative', zIndex: 2 }}>
        <div style={{
          width: 72, height: 72, borderRadius: '50%', background: 'rgba(255,255,255,.08)',
          border: '1px solid rgba(184,134,11,.4)', display: 'flex', alignItems: 'center',
          justifyContent: 'center', fontSize: 30, marginBottom: 28,
        }}>🔒</div>

        <div className="eyebrow" style={{ color: 'var(--gold)', letterSpacing: 2.5, marginBottom: 14 }}>Presente Especial</div>
        <h1 style={{
          fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 700, color: '#fff',
          margin: '0 0 12px', lineHeight: 1.1,
        }}>Um presente espera<br />por você</h1>
        <p style={{ fontSize: 14, lineHeight: 1.6, color: 'rgba(255,255,255,.7)', margin: '0 0 28px', maxWidth: 270 }}>
          Digite a senha para abrir o álbum{nome ? <> de <strong style={{ color: '#fff', fontWeight: 600 }}>{nome}</strong></> : ''}.
        </p>

        {erro && (
          <div style={{
            background: 'rgba(214,51,108,.2)', border: '1px solid rgba(214,51,108,.5)',
            borderRadius: 12, padding: '10px 16px', fontSize: 14, color: '#ff8ab0', marginBottom: 16, width: '100%',
          }}>{erro}</div>
        )}

        <input type="password" value={senha} onChange={e => setSenha(e.target.value)}
          placeholder="Senha do álbum" required autoComplete="off"
          style={{
            width: '100%', background: 'rgba(255,255,255,.08)', border: '1.5px solid rgba(184,134,11,.5)',
            borderRadius: 16, padding: 17, color: '#fff', fontSize: 16, textAlign: 'center',
            letterSpacing: 3, boxShadow: '0 0 0 4px rgba(184,134,11,.12)', marginBottom: 16,
            fontFamily: 'inherit',
          }} />

        <button type="submit" className="btn btn-gold" style={{ width: '100%', marginBottom: 18 }} disabled={loading}>
          {loading ? 'Verificando…' : 'Abrir álbum'}
        </button>
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,.55)' }}>
          Não tem a senha? <span style={{ color: 'var(--gold)', fontWeight: 600 }}>Peça ao organizador</span>
        </div>
      </form>
    </div>
  );
}
