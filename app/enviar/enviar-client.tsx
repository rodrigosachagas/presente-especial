'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function EnviarClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const slug = searchParams.get('c') || '';
  const [nome, setNome] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [foto, setFoto] = useState<File | null>(null);
  const [fotoName, setFotoName] = useState('');
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioName, setAudioName] = useState('');
  const [audioUrl, setAudioUrl] = useState('');
  const [recording, setRecording] = useState(false);
  const [recSeconds, setRecSeconds] = useState(0);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState('');
  const [preview, setPreview] = useState(false);
  const [fotoPreviewUrl, setFotoPreviewUrl] = useState('');
  const [presente, setPresente] = useState<{ nome_homenageado: string } | null>(null);

  const mediaRecRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (slug) {
      fetch(`/api/presente?c=${encodeURIComponent(slug)}`)
        .then(r => r.json())
        .then(d => { if (d.nome_homenageado) setPresente(d); })
        .catch(() => {});
    }
  }, [slug]);

  function pad(n: number) { return n < 10 ? '0' + n : '' + n; }

  function startRec() {
    if (!navigator.mediaDevices?.getUserMedia) return;
    navigator.mediaDevices.getUserMedia({ audio: true }).then(s => {
      streamRef.current = s;
      chunksRef.current = [];
      let mimeType = 'audio/webm';
      if (!MediaRecorder.isTypeSupported(mimeType)) mimeType = 'audio/mp4';
      if (!MediaRecorder.isTypeSupported(mimeType)) mimeType = '';
      const mr = new MediaRecorder(s, mimeType ? { mimeType } : {});
      mediaRecRef.current = mr;
      mr.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      mr.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mr.mimeType || 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        const ext = mr.mimeType?.includes('mp4') ? 'm4a' : 'webm';
        const file = new File([blob], `audio.${ext}`, { type: mr.mimeType || 'audio/webm' });
        setAudioFile(file);
        setAudioName(file.name);
      };
      mr.start();
      setRecording(true);
      setRecSeconds(0);
      timerRef.current = setInterval(() => {
        setRecSeconds(prev => {
          if (prev >= 119) { stopRec(); return prev; }
          return prev + 1;
        });
      }, 1000);
    }).catch(() => {});
  }

  function stopRec() {
    if (mediaRecRef.current?.state === 'recording') mediaRecRef.current.stop();
    streamRef.current?.getTracks().forEach(t => t.stop());
    if (timerRef.current) clearInterval(timerRef.current);
    setRecording(false);
  }

  function discardAudio() {
    setAudioFile(null);
    setAudioName('');
    setAudioUrl('');
    setRecSeconds(0);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!nome.trim() || !mensagem.trim()) return;
    if (foto) {
      setFotoPreviewUrl(URL.createObjectURL(foto));
    }
    setPreview(true);
    window.scrollTo(0, 0);
  }

  function handleEdit() {
    setPreview(false);
  }

  async function handleConfirm() {
    setErro('');
    setEnviando(true);
    try {
      const fd = new FormData();
      fd.append('c', slug);
      fd.append('nome', nome);
      fd.append('whatsapp', whatsapp);
      fd.append('mensagem', mensagem);
      if (foto) fd.append('foto', foto);
      if (audioFile) fd.append('audio', audioFile);

      const res = await fetch('/api/enviar', { method: 'POST', body: fd });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Erro ao enviar');
      router.push(`/obrigado?c=${encodeURIComponent(slug)}`);
    } catch (err: unknown) {
      setErro(err instanceof Error ? err.message : 'Erro ao enviar');
      setEnviando(false);
    }
  }

  if (!presente) {
    return <div className="app"><div className="screen screen--center"><p className="lead">Carregando...</p></div></div>;
  }

  if (preview) {
    return (
      <div className="app">
        <div className="screen">
          <div className="eyebrow eyebrow--rose" style={{ marginBottom: 5 }}>Confirme sua mensagem</div>
          <h1 className="h2 mb-20">Ficou do seu jeito?</h1>

          {erro && (
            <div style={{ background: '#fce4ec', border: '1px solid var(--rose)', borderRadius: 12, padding: '12px 16px', fontSize: 14, color: 'var(--rose)', marginBottom: 14 }}>{erro}</div>
          )}

          <div style={{ background: 'var(--surface)', border: '1.5px solid var(--line)', borderRadius: 'var(--radius-sm)', padding: 20, marginBottom: 16 }}>
            <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 4 }}>De:</div>
            <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>{nome}</div>

            <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 4 }}>Mensagem:</div>
            <div style={{ fontSize: 15, lineHeight: 1.6, marginBottom: 16, whiteSpace: 'pre-wrap' }}>{mensagem}</div>

            {fotoPreviewUrl && (
              <>
                <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 4 }}>Foto:</div>
                <img src={fotoPreviewUrl} alt="Preview" style={{ width: '100%', borderRadius: 12, marginBottom: 16, objectFit: 'cover', maxHeight: 300 }} />
              </>
            )}

            {audioUrl && (
              <>
                <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 4 }}>Áudio:</div>
                <audio controls preload="metadata" src={audioUrl} style={{ width: '100%', height: 40, borderRadius: 10 }} />
              </>
            )}
          </div>

          <div style={{ display: 'flex', gap: 12, marginTop: 'auto' }}>
            <button type="button" className="btn" onClick={handleEdit} disabled={enviando}
              style={{ flex: 1, background: 'transparent', border: '1.5px solid var(--line)', color: 'var(--neutro)', boxShadow: 'none' }}>
              Editar
            </button>
            <button type="button" className="btn btn-primary" onClick={handleConfirm} disabled={enviando}
              style={{ flex: 1 }}>
              {enviando ? 'Enviando…' : 'Confirmar'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <form className="screen" onSubmit={handleSubmit}>
        <div className="eyebrow eyebrow--rose" style={{ marginBottom: 5 }}>Para {presente.nome_homenageado}</div>
        <h1 className="h2 mb-20">Deixe sua mensagem</h1>

        {erro && (
          <div style={{ background: '#fce4ec', border: '1px solid var(--rose)', borderRadius: 12, padding: '12px 16px', fontSize: 14, color: 'var(--rose)', marginBottom: 14 }}>{erro}</div>
        )}

        <div className="field">
          <label className="label" htmlFor="gn">Seu nome</label>
          <input className="input" id="gn" value={nome} onChange={e => setNome(e.target.value)}
            placeholder="Como você quer ser identificado(a)?" required />
        </div>

        <div className="field">
          <label className="label" htmlFor="gw">WhatsApp <span className="opt">(opcional)</span></label>
          <input className="input" id="gw" type="tel" value={whatsapp} onChange={e => setWhatsapp(e.target.value)}
            placeholder="(11) 9 ____-____" />
        </div>

        <div className="field">
          <label className="label" htmlFor="gm">Sua mensagem</label>
          <textarea className="textarea" id="gm" rows={4} value={mensagem} onChange={e => setMensagem(e.target.value)}
            placeholder="Escreva algo carinhoso…" required />
        </div>

        <div className="field">
          <label className="label">Foto <span className="opt">(opcional)</span></label>
          <label className="upload" style={{ cursor: 'pointer' }}>
            <span className="ico">📷</span>
            <div style={{ flex: 1 }}>
              <div className="upl-title">{fotoName || 'Enviar foto'}</div>
              <div className="upl-sub">Câmera ou galeria · máx. 5 MB</div>
            </div>
            <input type="file" accept="image/*" style={{ display: 'none' }}
              onChange={e => { const f = e.target.files?.[0]; if (f) { setFoto(f); setFotoName(f.name); } }} />
          </label>
        </div>

        <div className="field">
          <label className="label">Áudio <span className="opt">(opcional)</span></label>
          <div style={{
            background: 'var(--surface)', border: `1.5px solid ${recording ? 'var(--rose)' : audioUrl ? 'var(--green)' : 'var(--line)'}`,
            borderRadius: 'var(--radius-sm)', padding: 16, textAlign: 'center', transition: 'border-color .2s',
            ...(recording ? { background: 'var(--blush)' } : {}),
          }}>
            <button type="button" onClick={() => recording ? stopRec() : audioUrl ? undefined : startRec()}
              style={{
                width: 56, height: 56, borderRadius: '50%', border: 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px',
                cursor: 'pointer',
                background: recording ? 'var(--rose)' : audioUrl ? 'var(--green)' : 'var(--blush)',
                color: recording ? '#fff' : audioUrl ? '#fff' : 'var(--rose)',
                animation: recording ? 'pulse 1.2s infinite' : 'none',
              }}>
              {recording ? (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><rect x="4" y="4" width="16" height="16" rx="3" /></svg>
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                  <line x1="12" y1="19" x2="12" y2="23" /><line x1="8" y1="23" x2="16" y2="23" />
                </svg>
              )}
            </button>
            {recording && (
              <div style={{ fontSize: 20, fontWeight: 700, fontFamily: 'monospace', marginBottom: 6 }}>
                {pad(Math.floor(recSeconds / 60))}:{pad(recSeconds % 60)}
              </div>
            )}
            <div style={{ fontSize: 13, color: 'var(--muted)' }}>
              {recording ? 'Gravando…' : audioUrl ? '' : 'Toque para gravar uma mensagem de voz'}
            </div>
            {audioUrl && !recording && (
              <div style={{ marginTop: 12 }}>
                <audio controls preload="metadata" src={audioUrl} style={{ width: '100%', height: 40, borderRadius: 10 }} />
                <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 10 }}>
                  <button type="button" className="btn btn-sm"
                    style={{ background: 'transparent', border: '1.5px solid var(--line)', color: 'var(--neutro)', boxShadow: 'none' }}
                    onClick={discardAudio}>Descartar</button>
                  <span style={{ fontSize: 12, color: 'var(--green)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>✓ Gravado</span>
                </div>
              </div>
            )}
          </div>
          <label className="upload" style={{ cursor: 'pointer', marginTop: 8 }}>
            <span className="ico">📎</span>
            <div style={{ flex: 1 }}>
              <div className="upl-title">{audioName && !audioUrl ? audioName : 'Ou envie um arquivo de áudio'}</div>
              <div className="upl-sub">MP3, M4A, WAV · máx. 10 MB</div>
            </div>
            <input type="file" accept="audio/*" style={{ display: 'none' }}
              onChange={e => { const f = e.target.files?.[0]; if (f) { setAudioFile(f); setAudioName(f.name); discardAudio(); setAudioFile(f); setAudioName(f.name); } }} />
          </label>
        </div>

        <button type="submit" className="btn btn-primary mt-auto" disabled={enviando}>
          {enviando ? 'Enviando…' : 'Enviar'}
        </button>
      </form>
      <style>{`@keyframes pulse{0%,100%{box-shadow:0 0 0 0 rgba(214,51,108,.4)}50%{box-shadow:0 0 0 12px rgba(214,51,108,0)}}`}</style>
    </div>
  );
}
