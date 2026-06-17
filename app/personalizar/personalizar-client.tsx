'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { iniciais } from '@/lib/helpers';

interface Msg { nome: string; mensagem: string; foto_path?: string }

const layoutsInfo: Record<string, { label: string; icon: string }> = {
  livro: { label: 'Livro', icon: '📖' },
  mural: { label: 'Mural', icon: '🖼' },
  tempo: { label: 'Tempo', icon: '⏳' },
  polaroid: { label: 'Polaroid', icon: '📸' },
  cinema: { label: 'Cinema', icon: '🎬' },
  minimo: { label: 'Mínimo', icon: '✨' },
};

const temasInfo: Record<string, { label: string; grad: string }> = {
  romantico: { label: 'Romântico', grad: 'linear-gradient(135deg,#d6336c,#fce4ec)' },
  festa: { label: 'Festa', grad: 'linear-gradient(135deg,#ff3d81,#ffd23f)' },
  elegante: { label: 'Elegante', grad: 'linear-gradient(135deg,#14110f,#c9a24a)' },
  suave: { label: 'Suave', grad: 'linear-gradient(135deg,#c9b8e8,#ffd9c0)' },
};

export default function PersonalizarClient({ codigo, token, nome, layoutAtual, temaAtual, mensagens, totalMsg }: {
  codigo: string; token: string; nome: string; layoutAtual: string; temaAtual: string; mensagens: Msg[]; totalMsg: number;
}) {
  const router = useRouter();
  const [layout, setLayout] = useState(layoutAtual);
  const [tema, setTema] = useState(temaAtual);
  const [saving, setSaving] = useState(false);

  const preview = mensagens.length > 0 ? mensagens : [
    { nome: 'Maria', mensagem: 'Você é uma pessoa incrível, merece tudo de melhor!' },
    { nome: 'João', mensagem: 'Muitas felicidades! Que este dia seja especial.' },
    { nome: 'Ana', mensagem: 'Te desejo tudo de mais lindo nessa vida!' },
  ] as Msg[];
  const isExample = mensagens.length === 0;
  const pvColors = ['#d6336c', '#b8860b', '#2f9e44'];

  async function handleSave() {
    setSaving(true);
    await fetch('/api/personalizar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ c: codigo, token, layout, tema }),
    });
    router.push(`/painel?c=${encodeURIComponent(codigo)}&token=${encodeURIComponent(token)}`);
  }

  return (
    <div className="app" {...(tema !== 'romantico' ? { 'data-theme': tema } : {})}>
      <div className="screen" style={{ gap: 0 }}>
        <div className="appbar">
          <a className="back" href={`/painel?c=${encodeURIComponent(codigo)}&token=${encodeURIComponent(token)}`}
            style={{ textDecoration: 'none' }}>&lsaquo;</a>
          <h1>Personalizar álbum</h1>
        </div>

        {/* Preview */}
        <div className="eyebrow mb-12">
          Prévia do álbum{isExample && <span style={{ fontWeight: 400, color: 'var(--muted)' }}> (dados de exemplo)</span>}
        </div>
        <div style={{ borderRadius: 16, overflow: 'hidden', position: 'relative', border: '1px solid var(--line-soft)', boxShadow: '0 10px 30px rgba(43,35,48,.1)', marginBottom: 20 }}>

          {/* Livro preview */}
          {layout === 'livro' && (
            <div style={{ background: '#fdf8ee', padding: '24px 20px', textAlign: 'center', minHeight: 280, position: 'relative' }}>
              <div style={{ position: 'absolute', top: 0, left: 16, bottom: 0, width: 1, background: 'rgba(184,134,11,.12)' }} />
              <div style={{ color: 'var(--gold)', fontSize: 14, letterSpacing: 6, marginBottom: 16 }}>&middot; &middot; &middot;</div>
              <div style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 16, lineHeight: 1.5, marginBottom: 14 }}>
                &ldquo;{preview[0].mensagem}&rdquo;
              </div>
              <div style={{ fontSize: 11, letterSpacing: 1.5, color: 'var(--gold)', fontWeight: 600 }}>&mdash; {preview[0].nome.toUpperCase()}</div>
              <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 18 }}>Pág. 1 / {isExample ? 3 : totalMsg}</div>
            </div>
          )}

          {/* Mural preview */}
          {layout === 'mural' && (
            <div style={{ background: 'var(--bg)', padding: 16, minHeight: 280 }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700, marginBottom: 10 }}>Mural de carinho</div>
              <div style={{ display: 'flex', gap: 8 }}>
                {[0, 1].map(col => (
                  <div key={col} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {preview.filter((_, i) => i % 2 === col).map((m, i) => (
                      <div key={i} style={{ background: 'var(--surface)', borderRadius: 10, padding: 10, boxShadow: '0 2px 8px rgba(0,0,0,.06)' }}>
                        <p style={{ fontSize: 11, lineHeight: 1.4, margin: '0 0 6px' }}>{m.mensagem.substring(0, 50)}{m.mensagem.length > 50 ? '…' : ''}</p>
                        <div style={{ fontSize: 10, color: 'var(--muted)', fontWeight: 600 }}>{m.nome}</div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tempo preview */}
          {layout === 'tempo' && (
            <div style={{ background: 'var(--bg)', padding: '16px 16px 16px 36px', position: 'relative', minHeight: 280 }}>
              <div style={{ position: 'absolute', left: 20, top: 16, bottom: 16, width: 2, background: 'linear-gradient(var(--rose),var(--gold))' }} />
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700, marginBottom: 12 }}>Linha do tempo</div>
              {preview.map((m, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 14, position: 'relative' }}>
                  <div style={{ width: 12, height: 12, borderRadius: '50%', flexShrink: 0, marginTop: 2, background: pvColors[i % 3] }} />
                  <div style={{ background: 'var(--surface)', borderRadius: 10, padding: 10, boxShadow: '0 2px 6px rgba(0,0,0,.05)', flex: 1 }}>
                    <div style={{ fontSize: 9, color: 'var(--muted)', fontWeight: 600, marginBottom: 3 }}>{m.nome}</div>
                    <p style={{ fontSize: 11, lineHeight: 1.4, margin: 0 }}>{m.mensagem.substring(0, 60)}{m.mensagem.length > 60 ? '…' : ''}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Polaroid preview */}
          {layout === 'polaroid' && (
            <div style={{ background: '#f1e9da', padding: 20, display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center', minHeight: 280 }}>
              <div style={{ width: '100%', textAlign: 'center', marginBottom: 8, fontFamily: 'var(--font-hand)', fontSize: 20, fontWeight: 700, color: 'var(--gold)' }}>Recordações</div>
              {preview.map((m, i) => (
                <div key={i} style={{ background: '#fff', padding: '8px 8px 14px', boxShadow: '0 6px 16px rgba(43,35,48,.15)', maxWidth: 110, transform: `rotate(${(i % 2 === 0 ? -1 : 1) * (2 + i)}deg)` }}>
                  <div style={{ width: 94, height: 70, background: 'repeating-linear-gradient(135deg,#e3d4d9,#e3d4d9 6px,#dcc9cf 6px,#dcc9cf 12px)' }} />
                  <div style={{ fontFamily: 'var(--font-hand)', fontSize: 12, textAlign: 'center', marginTop: 4, color: 'var(--ink)' }}>{m.mensagem.substring(0, 30)}{m.mensagem.length > 30 ? '…' : ''}</div>
                  <div style={{ fontFamily: 'var(--font-hand)', fontSize: 10, textAlign: 'center', color: 'var(--muted)' }}>&mdash; {m.nome}</div>
                </div>
              ))}
            </div>
          )}

          {/* Cinema preview */}
          {layout === 'cinema' && (
            <div style={{ background: '#2b2330', padding: 20, position: 'relative', minHeight: 280, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,rgba(20,14,24,.9),rgba(20,14,24,.1) 50%,rgba(20,14,24,.5))' }} />
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ display: 'flex', gap: 4, marginBottom: 'auto' }}>
                  {[0, 1, 2].map(i => <span key={i} style={{ flex: 1, height: 2, borderRadius: 1, background: i === 0 ? '#fff' : 'rgba(255,255,255,.3)' }} />)}
                </div>
                <div style={{ fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 10, marginTop: 'auto' }}>Mensagem 01 de {isExample ? 3 : totalMsg}</div>
                <div style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 17, lineHeight: 1.35, color: '#fff', marginBottom: 14 }}>
                  &ldquo;{preview[0].mensagem.substring(0, 70)}&rdquo;
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div className="avatar" style={{ width: 28, height: 28, fontSize: 10 }}>{iniciais(preview[0].nome)}</div>
                  <span style={{ color: '#fff', fontWeight: 600, fontSize: 12 }}>{preview[0].nome}</span>
                </div>
              </div>
            </div>
          )}

          {/* Minimo preview */}
          {layout === 'minimo' && (
            <div style={{ background: '#fffdfb', padding: '30px 20px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 280 }}>
              <div style={{ fontSize: 9, letterSpacing: 4, textTransform: 'uppercase', color: 'var(--muted)', fontWeight: 600, marginBottom: 20 }}>{nome}</div>
              <div style={{ width: 36, height: 1, background: 'var(--gold)', marginBottom: 28 }} />
              <div style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 18, lineHeight: 1.55, marginBottom: 22 }}>
                &ldquo;{preview[0].mensagem.substring(0, 70)}&rdquo;
              </div>
              <div style={{ fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--neutro)', fontWeight: 600 }}>{preview[0].nome}</div>
              <div style={{ width: 36, height: 1, background: 'var(--gold)', marginTop: 28 }} />
              <div style={{ fontSize: 10, color: 'var(--muted)', letterSpacing: 1, marginTop: 16 }}>01 &mdash; {String(isExample ? 3 : totalMsg).padStart(2, '0')}</div>
            </div>
          )}
        </div>

        {/* Layout picker */}
        <div className="eyebrow mb-12">Layout</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 9, marginBottom: 20 }}>
          {Object.entries(layoutsInfo).map(([k, v]) => (
            <div key={k} onClick={() => setLayout(k)} style={{
              background: k === layout ? 'var(--rose)' : 'var(--surface)',
              border: `1.5px solid ${k === layout ? 'var(--rose)' : 'var(--line)'}`,
              borderRadius: 14, padding: '10px 8px', textAlign: 'center', cursor: 'pointer',
              boxShadow: k === layout ? '0 6px 14px rgba(214,51,108,.28)' : 'none', transition: '.2s',
            }}>
              <div style={{ fontSize: 22, marginBottom: 4, filter: k === layout ? 'brightness(10)' : 'none' }}>{v.icon}</div>
              <div style={{ fontSize: 11, fontWeight: 600, color: k === layout ? '#fff' : 'var(--neutro)' }}>{v.label}</div>
            </div>
          ))}
        </div>

        {/* Theme picker */}
        <div className="eyebrow mb-12">Tema de cor</div>
        <div style={{ display: 'flex', gap: 14, marginBottom: 22 }}>
          {Object.entries(temasInfo).map(([k, v]) => (
            <div key={k} onClick={() => setTema(k)} style={{ textAlign: 'center', cursor: 'pointer' }}>
              <div style={{
                width: 44, height: 44, borderRadius: '50%', margin: '0 auto', background: v.grad,
                border: `2px solid ${k === tema ? 'var(--rose)' : 'transparent'}`,
                boxShadow: k === tema ? '0 0 0 3px rgba(214,51,108,.25)' : 'none', transition: '.2s',
              }} />
              <div style={{ fontSize: 10, color: k === tema ? 'var(--ink)' : 'var(--neutro)', marginTop: 5, fontWeight: k === tema ? 700 : 400 }}>{v.label}</div>
            </div>
          ))}
        </div>

        <button className="btn btn-primary" style={{ marginTop: 'auto' }} onClick={handleSave} disabled={saving}>
          {saving ? 'Salvando…' : 'Salvar'}
        </button>
      </div>
    </div>
  );
}
