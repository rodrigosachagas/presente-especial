import { Suspense } from 'react';
import EnviarClient from './enviar-client';

export default function EnviarPage() {
  return (
    <Suspense fallback={<div className="app"><div className="screen screen--center"><p className="lead">Carregando...</p></div></div>}>
      <EnviarClient />
    </Suspense>
  );
}
