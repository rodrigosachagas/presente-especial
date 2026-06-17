'use client';

import { useState } from 'react';
import { iniciais, dataFormatada, whatsappLink } from '@/lib/helpers';

interface Msg {
  id: number; nome: string; whatsapp?: string; mensagem: string;
  foto_path?: string; audio_path?: string; created_at: string;
}

function WppBtn({ m }: { m: Msg }) {
  if (!m.whatsapp) return null;
  return (
    <a href={whatsappLink(m.whatsapp)} target="_blank" rel="noopener"
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 600,
        color: '#25d366', background: 'rgba(37,211,102,.1)', padding: '5px 12px', borderRadius: 20,
        textDecoration: 'none', marginTop: 8,
      }}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="#25d366">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.126.553 4.12 1.52 5.856L.053 23.95l6.244-1.437A11.94 11.94 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75c-1.875 0-3.63-.516-5.13-1.414l-.367-.22-3.806.876.912-3.683-.24-.382A9.72 9.72 0 0 1 2.25 12c0-5.385 4.365-9.75 9.75-9.75S21.75 6.615 21.75 12s-4.365 9.75-9.75 9.75z" />
      </svg>
      WhatsApp
    </a>
  );
}

function AudioPlayer({ src, small }: { src?: string; small?: boolean }) {
  if (!src) return null;
  return (
    <div>
      <audio controls preload="metadata" style={{
        width: '100%', height: small ? 32 : 38, borderRadius: small ? 8 : 10, marginTop: small ? 6 : 10,
      }}
        onError={(e) => {
          const el = e.currentTarget;
          const fallback = el.nextElementSibling as HTMLElement;
          if (fallback) fallback.style.display = 'block';
          el.style.display = 'none';
        }}
      >
        <source src={src} />
      </audio>
      <div style={{ display: 'none', fontSize: 12, color: 'var(--muted)', marginTop: small ? 4 : 8 }}>
        <a href={src} target="_blank" rel="noopener noreferrer"
          style={{ color: 'var(--rose)', fontWeight: 600 }}>
          Ouvir áudio
        </a>
      </div>
    </div>
  );
}

const colors = ['#d6336c', '#b8860b', '#6b6470', '#2f9e44', '#d6336c'];

export default function AlbumClient({ nome, layout, tema, mensagens }: {
  nome: string; layout: string; tema: string; mensagens: Msg[];
}) {
  const total = mensagens.length;
  const [livroIdx, setLivroIdx] = useState(0);
  const [cinemaIdx, setCinemaIdx] = useState(0);
  const [minimoIdx, setMinimoIdx] = useState(0);

  const backBtn = (
    <a onClick={() => history.back()} href="/"
      style={{
        position: 'fixed', top: 12, left: 12, zIndex: 50, width: 38, height: 38, borderRadius: '50%',
        background: layout === 'cinema' ? 'rgba(255,255,255,.15)' : 'rgba(255,255,255,.85)',
        backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)',
        border: `1px solid ${layout === 'cinema' ? 'rgba(255,255,255,.1)' : 'rgba(0,0,0,.08)'}`,
        boxShadow: '0 2px 10px rgba(0,0,0,.12)', display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 20, color: layout === 'cinema' ? '#fff' : 'var(--ink)', textDecoration: 'none', cursor: 'pointer',
      }}>&lsaquo;</a>
  );

  if (total === 0) {
    return (
      <div className="app" {...(tema !== 'romantico' ? { 'data-theme': tema } : {})}>
        {backBtn}
        <div className="screen screen--center">
          <p className="lead">Nenhuma mensagem aprovada ainda.<br />Volte quando o organizador liberar o álbum.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app" {...(tema !== 'romantico' ? { 'data-theme': tema } : {})} id="album-app">
      {backBtn}

      {layout === 'livro' && (
        <div className="screen" style={{ background: '#fdf8ee' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 600 }}>&#10084; {nome}</span>
            <span style={{ fontSize: 12, color: 'var(--muted)' }}>Pág. {livroIdx + 1} / {total}</span>
          </div>
          {mensagens.map((m, i) => (
            <div key={m.id} style={{
              display: i === livroIdx ? 'flex' : 'none', flexDirection: 'column', alignItems: 'center',
              justifyContent: 'center', textAlign: 'center', flex: 1, padding: '0 18px',
            }}>
              <div style={{
                background: '#fffdf7', border: '1px solid rgba(184,134,11,.18)', borderRadius: 6,
                boxShadow: '0 14px 34px rgba(43,35,48,.1),inset 0 0 0 1px rgba(255,255,255,.6)',
                padding: '34px 28px', display: 'flex', flexDirection: 'column', alignItems: 'center',
                textAlign: 'center', position: 'relative', flex: 1, width: '100%',
              }}>
                <div style={{ position: 'absolute', top: 0, left: 18, bottom: 0, width: 1, background: 'rgba(184,134,11,.12)' }} />
                <div style={{ color: 'var(--gold)', fontSize: 18, letterSpacing: 6, marginBottom: 24 }}>&middot; &middot; &middot;</div>
                {m.foto_path && (
                  <img src={m.foto_path} alt="Foto" style={{ height: 120, width: 150, borderRadius: 4, objectFit: 'cover', boxShadow: '0 6px 16px rgba(43,35,48,.12)', marginBottom: 28 }} />
                )}
                <p style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 21, lineHeight: 1.5, margin: '0 0 22px' }}>{m.mensagem}</p>
                <div style={{ fontSize: 13, letterSpacing: 1, color: 'var(--gold)', fontWeight: 600 }}>&mdash; {m.nome.toUpperCase()}</div>
                <AudioPlayer src={m.audio_path} />
                <WppBtn m={m} />
              </div>
            </div>
          ))}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 18 }}>
            <button onClick={() => setLivroIdx(Math.max(0, livroIdx - 1))} style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--surface)', border: '1px solid var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, cursor: 'pointer' }}>&lsaquo;</button>
            <button onClick={() => setLivroIdx(Math.min(total - 1, livroIdx + 1))} style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--rose)', color: '#fff', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, boxShadow: '0 8px 18px rgba(214,51,108,.3)', cursor: 'pointer' }}>&rsaquo;</button>
          </div>
        </div>
      )}

      {layout === 'mural' && (
        <div className="screen" style={{ background: 'var(--bg)' }}>
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700 }}>Mural de carinho</div>
            <div style={{ fontSize: 12, color: 'var(--muted)' }}>{total} mensagens para {nome}</div>
          </div>
          <div style={{ display: 'flex', gap: 11, flex: 1 }}>
            {[0, 1].map(col => (
              <div key={col} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 11 }}>
                {mensagens.filter((_, i) => i % 2 === col).map(m => (
                  <div key={m.id} style={{ background: 'var(--surface)', borderRadius: 14, overflow: 'hidden', boxShadow: 'var(--shadow-card)', padding: 14 }}>
                    {m.foto_path && <img src={m.foto_path} alt="Foto" style={{ width: '100%', height: 120, objectFit: 'cover', borderRadius: 10, marginBottom: 10 }} />}
                    <p style={{ fontSize: 13, lineHeight: 1.45, margin: '0 0 8px' }}>{m.mensagem}</p>
                    <div style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 600 }}>{m.nome}</div>
                    <AudioPlayer src={m.audio_path} small />
                    <WppBtn m={m} />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {layout === 'tempo' && (
        <div className="screen" style={{ background: 'var(--bg)' }}>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700 }}>Linha do tempo</div>
            <div style={{ fontSize: 12, color: 'var(--muted)' }}>na ordem em que chegaram</div>
          </div>
          <div style={{ position: 'relative', flex: 1 }}>
            <div style={{ position: 'absolute', left: 9, top: 4, bottom: 0, width: 2, background: 'linear-gradient(var(--rose),var(--gold))' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {mensagens.map((m, i) => (
                <div key={m.id} style={{ display: 'flex', gap: 18, position: 'relative' }}>
                  <div style={{ width: 18, height: 18, borderRadius: '50%', border: '3px solid var(--bg)', flexShrink: 0, background: colors[i % colors.length], boxShadow: `0 0 0 1px ${colors[i % colors.length]}` }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 4, color: 'var(--muted)' }}>{dataFormatada(m.created_at)} &middot; {m.nome}</div>
                    <div className="card" style={{ padding: 13, fontSize: 13, lineHeight: 1.45 }}>
                      {m.foto_path && <img src={m.foto_path} alt="Foto" style={{ width: '100%', height: 90, objectFit: 'cover', borderRadius: 8, marginBottom: 8 }} />}
                      {m.mensagem}
                      <AudioPlayer src={m.audio_path} small />
                      <WppBtn m={m} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {layout === 'polaroid' && (
        <div className="screen" style={{ background: '#f1e9da', position: 'relative', overflow: 'auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 16 }}>
            <div style={{ fontFamily: 'var(--font-hand)', fontSize: 34, fontWeight: 700, color: 'var(--gold)' }}>Recordações de {nome}</div>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, justifyContent: 'center' }}>
            {mensagens.map((m, i) => {
              const rot = (i % 2 === 0 ? -1 : 1) * (2 + (i % 6));
              return (
                <div key={m.id} style={{ background: '#fff', padding: '12px 12px 18px', boxShadow: '0 12px 24px rgba(43,35,48,.2)', transform: `rotate(${rot}deg)`, maxWidth: 180 }}>
                  {m.foto_path ? (
                    <img src={m.foto_path} alt="Foto" style={{ width: '100%', height: 130, objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '100%', height: 130, background: 'repeating-linear-gradient(135deg,#e3d4d9,#e3d4d9 8px,#dcc9cf 8px,#dcc9cf 16px)' }} />
                  )}
                  <div style={{ fontFamily: 'var(--font-hand)', fontSize: 18, textAlign: 'center', marginTop: 6, color: 'var(--ink)' }}>
                    {m.mensagem.length > 50 ? m.mensagem.substring(0, 50) + '…' : m.mensagem}
                  </div>
                  <div style={{ fontFamily: 'var(--font-hand)', fontSize: 14, textAlign: 'center', color: 'var(--muted)' }}>&mdash; {m.nome}</div>
                  <AudioPlayer src={m.audio_path} small />
                  <div style={{ textAlign: 'center' }}><WppBtn m={m} /></div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {layout === 'cinema' && (
        <div className="screen" style={{ padding: 0, position: 'relative', background: '#2b2330' }}
          onClick={(e) => { if (!(e.target as HTMLElement).closest('button,a,audio')) setCinemaIdx((cinemaIdx + 1) % total); }}>
          <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(135deg,#4a3a52,#4a3a52 14px,#3f3147 14px,#3f3147 28px)' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,rgba(20,14,24,.92),rgba(20,14,24,.15) 45%,rgba(20,14,24,.55))' }} />
          <div style={{ position: 'relative', zIndex: 3, flex: 1, display: 'flex', flexDirection: 'column', padding: '18px 22px 32px' }}>
            <div style={{ display: 'flex', gap: 5, marginBottom: 20 }}>
              {Array.from({ length: total }).map((_, i) => (
                <span key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i <= cinemaIdx ? '#fff' : 'rgba(255,255,255,.35)' }} />
              ))}
            </div>
            {mensagens.map((m, i) => (
              <div key={m.id} style={{
                display: i === cinemaIdx ? 'flex' : 'none', flex: 1,
                flexDirection: 'column', justifyContent: 'flex-end',
              }}>
                <div style={{ flex: 1 }} />
                <div className="eyebrow" style={{ color: 'var(--gold)', marginBottom: 16 }}>
                  Mensagem {String(i + 1).padStart(2, '0')} de {total}
                </div>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontStyle: 'italic', lineHeight: 1.35, color: '#fff', margin: '0 0 22px' }}>
                  &ldquo;{m.mensagem}&rdquo;
                </p>
                {m.audio_path && <audio controls preload="metadata" style={{ width: '100%', height: 36, borderRadius: 10, marginBottom: 14 }}><source src={m.audio_path} /></audio>}
                <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
                  <div className="avatar">{iniciais(m.nome)}</div>
                  <div>
                    <div style={{ color: '#fff', fontWeight: 600, fontSize: 14 }}>{m.nome}</div>
                    <WppBtn m={m} />
                  </div>
                </div>
              </div>
            ))}
            <div style={{ textAlign: 'center', color: 'rgba(255,255,255,.55)', fontSize: 12, marginTop: 26, cursor: 'pointer' }}
              onClick={() => setCinemaIdx((cinemaIdx + 1) % total)}>
              toque para a próxima &rsaquo;
            </div>
          </div>
        </div>
      )}

      {layout === 'minimo' && (
        <div className="screen" style={{ background: '#fffdfb' }}>
          <div style={{ padding: '14px 0', textAlign: 'center' }}>
            <div style={{ fontSize: 11, letterSpacing: 5, textTransform: 'uppercase', color: 'var(--muted)', fontWeight: 600 }}>{nome}</div>
          </div>
          {mensagens.map((m, i) => (
            <div key={m.id} style={{
              display: i === minimoIdx ? 'flex' : 'none', flexDirection: 'column', alignItems: 'center',
              justifyContent: 'center', textAlign: 'center', flex: 1, padding: '0 18px',
            }}>
              <div style={{ width: 44, height: 1, background: 'var(--gold)', marginBottom: 40 }} />
              <p style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 27, lineHeight: 1.55, margin: '0 0 36px' }}>{m.mensagem}</p>
              <div style={{ fontSize: 12, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--neutro)', fontWeight: 600 }}>{m.nome}</div>
              <WppBtn m={m} />
              <AudioPlayer src={m.audio_path} />
              <div style={{ width: 44, height: 1, background: 'var(--gold)', marginTop: 40 }} />
            </div>
          ))}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 16 }}>
            <span style={{ fontSize: 12, color: 'var(--muted)', letterSpacing: 1 }}>
              {String(minimoIdx + 1).padStart(2, '0')} &mdash; {String(total).padStart(2, '0')}
            </span>
            <span style={{ fontSize: 18, cursor: 'pointer' }} onClick={() => setMinimoIdx(Math.min(total - 1, minimoIdx + 1))}>&rsaquo;</span>
          </div>
        </div>
      )}
    </div>
  );
}
