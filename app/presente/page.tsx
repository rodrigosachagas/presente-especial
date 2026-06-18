import { buscarPresentePorSlug, contarMensagens } from '@/lib/db';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { parseFotos } from '@/lib/helpers';
import Carousel from '@/components/carousel';

export default async function PresentePage({ searchParams }: { searchParams: Promise<{ c?: string }> }) {
  const { c: slug } = await searchParams;
  if (!slug) notFound();
  const p = await buscarPresentePorSlug(slug);
  if (!p) notFound();

  const contagem = await contarMensagens(p.id);

  return (
    <div className="app app--warm">
      <div className="screen screen--center">
        <div className="brand mb-20">
          <span className="mark">❤</span>
          <span className="name">Presente Especial</span>
        </div>

        {parseFotos(p.foto_capa).length > 0 ? (
          <div style={{ marginBottom: 16 }}>
            <Carousel fotos={parseFotos(p.foto_capa)} height={200} borderRadius={22} />
          </div>
        ) : (
          <div className="photo" style={{
            height: 160, borderRadius: 22, marginBottom: 16,
            background: 'repeating-linear-gradient(135deg,#f6d9e4,#f6d9e4 11px,#f2cdda 11px,#f2cdda 22px)',
          }} />
        )}

        <div className="eyebrow eyebrow--rose" style={{ marginBottom: 8, letterSpacing: 3 }}>
          Um presente para
        </div>
        <h1 className="h1" style={{ fontSize: 34, marginBottom: 12 }}>{p.nome_homenageado}</h1>

        {p.mensagem_inicial && (
          <p className="lead" style={{ marginBottom: 16 }}>{p.mensagem_inicial}</p>
        )}

        {Number(contagem.total) > 0 && (
          <div style={{
            background: 'var(--blush)', borderRadius: 20, padding: '8px 18px',
            fontSize: 13, fontWeight: 600, color: 'var(--rose)', marginBottom: 20,
          }}>
            {contagem.total} mensage{Number(contagem.total) === 1 ? 'm' : 'ns'} já enviada{Number(contagem.total) === 1 ? '' : 's'}
          </div>
        )}

        <Link className="btn btn-primary mb-12" href={`/enviar?c=${encodeURIComponent(slug)}`}>
          Enviar minha mensagem
        </Link>
      </div>
    </div>
  );
}
