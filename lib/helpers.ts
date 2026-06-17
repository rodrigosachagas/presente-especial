import crypto from 'crypto';

export function gerarSlug(nome: string): string {
  const base = nome
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  const suffix = crypto.randomBytes(3).toString('hex');
  return `${base}-${suffix}`;
}

export function gerarToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

export function iniciais(nome: string): string {
  const parts = nome.trim().split(/\s+/);
  let ini = parts[0][0].toUpperCase();
  if (parts.length > 1) ini += parts[parts.length - 1][0].toUpperCase();
  return ini;
}

const meses = [
  'janeiro','fevereiro','março','abril','maio','junho',
  'julho','agosto','setembro','outubro','novembro','dezembro',
];

export function dataFormatada(data: string | null): string {
  if (!data) return '';
  const d = new Date(data);
  return `${d.getDate()} de ${meses[d.getMonth()]} de ${d.getFullYear()}`;
}

export function tempoAtras(datetime: string): string {
  const diff = Math.floor((Date.now() - new Date(datetime).getTime()) / 1000);
  if (diff < 60) return 'agora';
  if (diff < 3600) return `${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  return `${Math.floor(diff / 86400)}d`;
}

export function whatsappLink(telefone: string): string {
  let num = telefone.replace(/\D/g, '');
  if (num.length <= 11) num = '55' + num;
  return `https://wa.me/${num}`;
}
