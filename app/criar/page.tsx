'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function CriarPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [nome, setNome] = useState('');
  const [tipo, setTipo] = useState('aniversario');
  const [data, setData] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [senha, setSenha] = useState('');
  const [fotos, setFotos] = useState<File[]>([]);
  const [fotoPreviews, setFotoPreviews] = useState<string[]>([]);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const tipos = [
    { v: 'aniversario', l: '🎂 Aniversário' },
    { v: 'casamento', l: '💒 Casamento' },
    { v: 'homenagem', l: '🏆 Homenagem' },
    { v: 'outro', l: '🎁 Outro' },
  ];

  function handleFotos(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files) return;
    const novas = Array.from(files).slice(0, 10 - fotos.length);
    setFotos(prev => [...prev, ...novas]);
    setFotoPreviews(prev => [...prev, ...novas.map(f => URL.createObjectURL(f))]);
  }

  function removerFoto(idx: number) {
    setFotos(prev => prev.filter((_, i) => i !== idx));
    setFotoPreviews(prev => prev.filter((_, i) => i !== idx));
  }

  async function handleSubmit() {
    setErro('');
    setEnviando(true);
    try {
      const fotoUrls: string[] = [];
      for (const f of fotos) {
        const fd = new FormData();
        fd.append('foto', f);
        const upRes = await fetch('/api/upload-foto', { method: 'POST', body: fd });
        const upJson = await upRes.json();
        if (!upRes.ok) throw new Error(upJson.error || 'Erro ao enviar foto');
        if (upJson.url) fotoUrls.push(upJson.url);
      }

      const res = await fetch('/api/criar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, tipo, data, mensagem, senha, fotoUrls }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Erro ao criar');
      router.push('/sucesso');
    } catch (err: unknown) {
      setErro(err instanceof Error ? err.message : 'Erro ao criar presente');
      setEnviando(false);
    }
  }

  const canNext = [
    () => nome.trim().length > 0,
    () => true,
    () => true,
    () => senha.trim().length >= 4,
  ];

  return (
    <div className="app">
      <div className="screen">
        <div className="appbar">
          {step > 0 ? (
            <a className="back" onClick={() => setStep(step - 1)} style={{ cursor: 'pointer' }}>&lsaquo;</a>
          ) : (
            <a className="back" href="/" style={{ textDecoration: 'none' }}>&lsaquo;</a>
          )}
          <h1>Criar presente</h1>
        </div>

        {/* Progress */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 20 }}>
          {[0, 1, 2, 3].map(i => (
            <div key={i} style={{
              flex: 1, height: 4, borderRadius: 2,
              background: i <= step ? 'var(--rose)' : 'var(--line)',
              transition: '.2s'
            }} />
          ))}
        </div>

        {erro && (
          <div style={{
            background: '#fce4ec', border: '1px solid var(--rose)',
            borderRadius: 12, padding: '12px 16px', fontSize: 14, color: 'var(--rose)', marginBottom: 14
          }}>{erro}</div>
        )}

        {/* Step 0: Nome */}
        {step === 0 && (
          <>
            <div className="eyebrow eyebrow--rose" style={{ marginBottom: 5 }}>Passo 1 de 4</div>
            <h2 className="h2 mb-20">Quem vai receber?</h2>
            <div className="field">
              <label className="label" htmlFor="nome">Nome do homenageado</label>
              <input className="input" id="nome" value={nome}
                onChange={e => setNome(e.target.value)}
                placeholder="Ex: Maria, João, Vovó…" autoFocus />
            </div>
            <div className="field">
              <label className="label">Tipo de evento</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {tipos.map(t => (
                  <button key={t.v} type="button"
                    className={`chip ${tipo === t.v ? 'chip--approved' : ''}`}
                    style={{
                      padding: '10px 16px', fontSize: 14, cursor: 'pointer', border: 'none',
                      background: tipo === t.v ? 'var(--rose)' : 'var(--surface-2)',
                      color: tipo === t.v ? '#fff' : 'var(--ink)',
                      borderRadius: 12, fontWeight: 600,
                    }}
                    onClick={() => setTipo(t.v)}
                  >{t.l}</button>
                ))}
              </div>
            </div>
            <div className="field">
              <label className="label" htmlFor="data">Data do evento <span className="opt">(opcional)</span></label>
              <input className="input" id="data" type="date" value={data}
                onChange={e => setData(e.target.value)} />
            </div>
          </>
        )}

        {/* Step 1: Cover */}
        {step === 1 && (
          <>
            <div className="eyebrow eyebrow--rose" style={{ marginBottom: 5 }}>Passo 2 de 4</div>
            <h2 className="h2 mb-20">Fotos de capa</h2>
            {fotoPreviews.length > 0 && (
              <div style={{ display: 'flex', gap: 8, overflowX: 'auto', marginBottom: 14, paddingBottom: 4 }}>
                {fotoPreviews.map((url, i) => (
                  <div key={i} style={{ position: 'relative', flexShrink: 0, width: 120, height: 120, borderRadius: 14, overflow: 'hidden' }}>
                    <img src={url} alt={`Foto ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <button type="button" onClick={() => removerFoto(i)}
                      style={{
                        position: 'absolute', top: 4, right: 4, width: 24, height: 24,
                        borderRadius: '50%', background: 'rgba(0,0,0,.6)', color: '#fff',
                        border: 'none', fontSize: 14, cursor: 'pointer', display: 'flex',
                        alignItems: 'center', justifyContent: 'center', lineHeight: 1,
                      }}>&times;</button>
                  </div>
                ))}
              </div>
            )}
            {fotos.length < 10 && (
              <label className="upload" style={{ cursor: 'pointer', marginBottom: 16 }}>
                <span className="ico">📷</span>
                <div style={{ flex: 1 }}>
                  <div className="upl-title">{fotos.length === 0 ? 'Escolher fotos de capa' : 'Adicionar mais fotos'}</div>
                  <div className="upl-sub">Até 10 fotos · máx. 5 MB cada</div>
                </div>
                <input type="file" accept="image/*" multiple ref={fileRef} style={{ display: 'none' }}
                  onChange={handleFotos} />
              </label>
            )}
            <p className="lead" style={{ fontSize: 13 }}>As fotos aparecerão em carrossel na página pública e no álbum.</p>
          </>
        )}

        {/* Step 2: Message */}
        {step === 2 && (
          <>
            <div className="eyebrow eyebrow--rose" style={{ marginBottom: 5 }}>Passo 3 de 4</div>
            <h2 className="h2 mb-20">Mensagem inicial</h2>
            <div className="field">
              <label className="label" htmlFor="msg">Sua mensagem para {nome || 'o homenageado'} <span className="opt">(opcional)</span></label>
              <textarea className="textarea" id="msg" rows={4} value={mensagem}
                onChange={e => setMensagem(e.target.value)}
                placeholder="Escreva algo especial que aparecerá na página…" />
            </div>
            {/* Preview */}
            <div className="eyebrow mb-12">Prévia da página</div>
            <div style={{
              borderRadius: 16, overflow: 'hidden', height: 100, position: 'relative',
              background: 'var(--grad-warm)', border: '1px solid rgba(214,51,108,.15)',
              boxShadow: '0 8px 20px rgba(43,35,48,.06)',
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              justifyContent: 'center', textAlign: 'center',
            }}>
              <div style={{ color: 'var(--gold)', letterSpacing: 4, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', marginBottom: 4 }}>Um presente para</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700, color: 'var(--ink)' }}>{nome || '...'} ❤</div>
            </div>
          </>
        )}

        {/* Step 3: Password */}
        {step === 3 && (
          <>
            <div className="eyebrow eyebrow--rose" style={{ marginBottom: 5 }}>Passo 4 de 4</div>
            <h2 className="h2 mb-20">Proteja o álbum</h2>
            <div className="field">
              <label className="label" htmlFor="senha">Senha do álbum</label>
              <input className="input" id="senha" type="text" value={senha}
                onChange={e => setSenha(e.target.value)}
                placeholder="Mín. 4 caracteres" autoComplete="off" />
            </div>
            <p className="lead" style={{ fontSize: 13 }}>
              Somente quem tiver essa senha poderá abrir o álbum final.
              Você receberá essa senha na página de sucesso.
            </p>
          </>
        )}

        {/* Navigation */}
        <div style={{ marginTop: 'auto', paddingTop: 16 }}>
          {step < 3 ? (
            <button className="btn btn-primary" onClick={() => setStep(step + 1)}
              disabled={!canNext[step]?.()}>
              Próximo
            </button>
          ) : (
            <button className="btn btn-primary" onClick={handleSubmit}
              disabled={enviando || !canNext[3]?.()}>
              {enviando ? 'Criando…' : 'Criar presente'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
