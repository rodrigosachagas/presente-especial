'use client';

import { useState, useEffect, useCallback } from 'react';

export function parseFotos(fotoCapa?: string | null): string[] {
  if (!fotoCapa) return [];
  try {
    const parsed = JSON.parse(fotoCapa);
    if (Array.isArray(parsed)) return parsed;
  } catch {}
  return [fotoCapa];
}

export default function Carousel({ fotos, height = 180, borderRadius = 12, autoPlay = true }: {
  fotos: string[]; height?: number; borderRadius?: number; autoPlay?: boolean;
}) {
  const [idx, setIdx] = useState(0);
  const len = fotos.length;

  const next = useCallback(() => setIdx(i => (i + 1) % len), [len]);

  useEffect(() => {
    if (!autoPlay || len <= 1) return;
    const timer = setInterval(next, 4000);
    return () => clearInterval(timer);
  }, [autoPlay, len, next]);

  if (len === 0) return null;
  if (len === 1) return (
    <img src={fotos[0]} alt="Capa" style={{ width: '100%', height, objectFit: 'cover', borderRadius }} />
  );

  return (
    <div style={{ position: 'relative', width: '100%', height, borderRadius, overflow: 'hidden' }}>
      {fotos.map((url, i) => (
        <img key={i} src={url} alt={`Foto ${i + 1}`} style={{
          position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover',
          opacity: i === idx ? 1 : 0, transition: 'opacity .6s ease',
        }} />
      ))}
      <div style={{ position: 'absolute', bottom: 8, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 6 }}>
        {fotos.map((_, i) => (
          <button key={i} onClick={() => setIdx(i)} style={{
            width: 8, height: 8, borderRadius: '50%', border: 'none', padding: 0, cursor: 'pointer',
            background: i === idx ? '#fff' : 'rgba(255,255,255,.5)',
            boxShadow: '0 1px 3px rgba(0,0,0,.3)', transition: 'background .2s',
          }} />
        ))}
      </div>
    </div>
  );
}
