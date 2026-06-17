import mysql, { PoolOptions, RowDataPacket, ResultSetHeader } from 'mysql2/promise';

const poolConfig: PoolOptions = {
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  charset: 'utf8mb4',
  waitForConnections: true,
  connectionLimit: 5,
  connectTimeout: 10000,
};

const globalPool = globalThis as unknown as { _pool?: mysql.Pool };
function getPool() {
  if (!globalPool._pool) {
    globalPool._pool = mysql.createPool(poolConfig);
  }
  return globalPool._pool;
}

export function db() {
  return getPool();
}

// ── Presentes ──

export async function criarPresente(d: {
  codigo_publico: string;
  codigo_admin: string;
  token_admin: string;
  token_album: string;
  senha_album: string;
  nome_homenageado: string;
  tipo_evento: string;
  data_evento: string | null;
  foto_capa: string | null;
  mensagem_inicial: string | null;
  layout_album?: string;
  tema_cor?: string;
}): Promise<number> {
  const [result] = await db().execute<ResultSetHeader>(
    `INSERT INTO presentes
      (codigo_publico, codigo_admin, token_admin, token_album, senha_album,
       nome_homenageado, tipo_evento, data_evento, foto_capa, mensagem_inicial,
       layout_album, tema_cor)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      d.codigo_publico, d.codigo_admin, d.token_admin, d.token_album, d.senha_album,
      d.nome_homenageado, d.tipo_evento, d.data_evento || null,
      d.foto_capa || null, d.mensagem_inicial || null,
      d.layout_album || 'livro', d.tema_cor || 'romantico',
    ]
  );
  return result.insertId;
}

export async function buscarPresentePorSlug(slug: string) {
  const [rows] = await db().execute<RowDataPacket[]>(
    'SELECT * FROM presentes WHERE codigo_publico = ? LIMIT 1', [slug]
  );
  return rows[0] || null;
}

export async function buscarPresentePorAdmin(codigo: string, token: string) {
  const [rows] = await db().execute<RowDataPacket[]>(
    'SELECT * FROM presentes WHERE codigo_admin = ? AND token_admin = ? LIMIT 1',
    [codigo, token]
  );
  return rows[0] || null;
}

export async function buscarPresentePorAlbumToken(slug: string, token: string) {
  const [rows] = await db().execute<RowDataPacket[]>(
    'SELECT * FROM presentes WHERE codigo_publico = ? AND token_album = ? LIMIT 1',
    [slug, token]
  );
  return rows[0] || null;
}

export async function atualizarPersonalizacao(id: number, layout: string, tema: string) {
  await db().execute(
    'UPDATE presentes SET layout_album = ?, tema_cor = ? WHERE id = ?',
    [layout, tema, id]
  );
}

// ── Mensagens ──

export async function criarMensagem(d: {
  presente_id: number;
  nome: string;
  whatsapp: string | null;
  mensagem: string;
  foto_path: string | null;
  audio_path: string | null;
}): Promise<number> {
  const [result] = await db().execute<ResultSetHeader>(
    `INSERT INTO mensagens (presente_id, nome, whatsapp, mensagem, foto_path, audio_path)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [d.presente_id, d.nome, d.whatsapp || null, d.mensagem, d.foto_path || null, d.audio_path || null]
  );
  return result.insertId;
}

export async function listarMensagens(presenteId: number, status?: string) {
  let sql = 'SELECT * FROM mensagens WHERE presente_id = ?';
  const params: (number | string)[] = [presenteId];
  if (status) {
    sql += ' AND status = ?';
    params.push(status);
  }
  sql += ' ORDER BY created_at DESC';
  const [rows] = await db().execute<RowDataPacket[]>(sql, params);
  return rows;
}

export async function contarMensagens(presenteId: number) {
  const [rows] = await db().execute<RowDataPacket[]>(
    `SELECT
       COUNT(*) as total,
       SUM(status = 'PENDING') as pendentes,
       SUM(status = 'APPROVED') as aprovadas,
       SUM(status = 'REJECTED') as recusadas
     FROM mensagens WHERE presente_id = ?`,
    [presenteId]
  );
  return rows[0];
}

export async function aprovarMensagem(id: number) {
  await db().execute(
    "UPDATE mensagens SET status = 'APPROVED', approved_at = NOW() WHERE id = ?", [id]
  );
}

export async function recusarMensagem(id: number) {
  await db().execute("UPDATE mensagens SET status = 'REJECTED' WHERE id = ?", [id]);
}

export async function buscarMensagem(id: number) {
  const [rows] = await db().execute<RowDataPacket[]>(
    'SELECT * FROM mensagens WHERE id = ? LIMIT 1', [id]
  );
  return rows[0] || null;
}

export async function listarTodosPresentes() {
  const [rows] = await db().execute<RowDataPacket[]>(`
    SELECT p.*,
      (SELECT COUNT(*) FROM mensagens WHERE presente_id = p.id) as total_msgs,
      (SELECT COUNT(*) FROM mensagens WHERE presente_id = p.id AND status = 'PENDING') as pendentes,
      (SELECT COUNT(*) FROM mensagens WHERE presente_id = p.id AND status = 'APPROVED') as aprovadas
    FROM presentes p ORDER BY p.created_at DESC
  `);
  return rows;
}
