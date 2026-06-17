import { Suspense } from 'react';
import AlbumSenhaClient from './album-senha-client';

export default function AlbumSenhaPage() {
  return (
    <Suspense fallback={<div className="app"><div className="screen screen--center"><p className="lead">Carregando...</p></div></div>}>
      <AlbumSenhaClient />
    </Suspense>
  );
}
