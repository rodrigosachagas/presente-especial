import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');
const FOTO_DIR = path.join(UPLOAD_DIR, 'fotos');
const AUDIO_DIR = path.join(UPLOAD_DIR, 'audios');

const ALLOWED_IMAGE = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const ALLOWED_AUDIO = [
  'audio/webm', 'video/webm', 'audio/ogg', 'audio/mp4', 'audio/mpeg',
  'audio/wav', 'audio/x-m4a', 'audio/mp3', 'audio/aac', 'audio/x-wav',
  'audio/m4a', 'application/octet-stream',
];

const MAX_IMAGE = 5 * 1024 * 1024;
const MAX_AUDIO = 10 * 1024 * 1024;

async function ensureDir(dir: string) {
  await mkdir(dir, { recursive: true });
}

function extFromMime(mime: string, filename: string): string {
  if (mime.includes('webm')) return 'webm';
  if (mime.includes('ogg')) return 'ogg';
  if (mime.includes('mp4') || mime.includes('m4a')) return 'm4a';
  if (mime.includes('mpeg') || mime.includes('mp3')) return 'mp3';
  if (mime.includes('wav')) return 'wav';
  if (mime.includes('aac')) return 'aac';
  if (mime.includes('jpeg') || mime.includes('jpg')) return 'jpg';
  if (mime.includes('png')) return 'png';
  if (mime.includes('webp')) return 'webp';
  if (mime.includes('gif')) return 'gif';
  const ext = filename.split('.').pop()?.toLowerCase();
  if (ext && ['webm','m4a','mp3','wav','jpg','png','webp'].includes(ext)) return ext;
  return 'bin';
}

export async function processarUploadFoto(file: File): Promise<string | null> {
  if (!file || file.size === 0) return null;
  if (file.size > MAX_IMAGE) throw new Error('Foto muito grande (máx. 5 MB).');
  if (!ALLOWED_IMAGE.includes(file.type)) throw new Error('Formato de foto não permitido.');

  await ensureDir(FOTO_DIR);
  const ext = extFromMime(file.type, file.name);
  const nome = crypto.randomBytes(16).toString('hex') + '.' + ext;
  const destino = path.join(FOTO_DIR, nome);
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(destino, buffer);
  return `/uploads/fotos/${nome}`;
}

export async function processarUploadAudio(file: File): Promise<string | null> {
  if (!file || file.size === 0) return null;
  if (file.size > MAX_AUDIO) throw new Error('Áudio muito grande (máx. 10 MB).');
  if (!ALLOWED_AUDIO.includes(file.type)) throw new Error('Formato de áudio não permitido.');

  await ensureDir(AUDIO_DIR);
  const ext = extFromMime(file.type, file.name);
  const nome = crypto.randomBytes(16).toString('hex') + '.' + ext;
  const destino = path.join(AUDIO_DIR, nome);
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(destino, buffer);
  return `/uploads/audios/${nome}`;
}
