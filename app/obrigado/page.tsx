import Link from 'next/link';

export default async function ObrigadoPage({ searchParams }: { searchParams: Promise<{ c?: string }> }) {
  const { c: slug } = await searchParams;

  return (
    <div className="app">
      <div className="screen screen--center">
        <div style={{
          width: 72, height: 72, borderRadius: '50%', background: 'var(--blush)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, marginBottom: 24,
        }}>💌</div>

        <h1 className="h2" style={{ marginBottom: 8 }}>Mensagem enviada!</h1>
        <p className="lead" style={{ marginBottom: 28 }}>
          Obrigado por participar. Sua mensagem será revisada pelo organizador antes de aparecer no álbum.
        </p>

        {slug && (
          <Link className="btn btn-ghost" href={`/enviar?c=${encodeURIComponent(slug)}`} style={{ marginBottom: 12 }}>
            Enviar outra mensagem
          </Link>
        )}
      </div>
    </div>
  );
}
