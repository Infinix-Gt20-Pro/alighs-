/**
 * githubDb.ts — Lightweight persistent store using GitHub Contents API
 * Data is stored in `data/aligsware_db.json` in the GitHub repo.
 * This persists across Vercel cold starts.
 */

const GITHUB_TOKEN = process.env.GITHUB_TOKEN || '';
const REPO = 'Infinix-Gt20-Pro/Aligh-s---Ware';
const DB_PATH = 'data/aligsware_db.json';
const API_BASE = 'https://api.github.com';

interface DbData {
  orders: Record<string, unknown>[];
  appointments: Record<string, unknown>[];
}

interface GithubFileResponse {
  sha: string;
  content: string;
}

async function getFileInfo(): Promise<{ sha: string; data: DbData } | null> {
  try {
    const res = await fetch(`${API_BASE}/repos/${REPO}/contents/${DB_PATH}`, {
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        Accept: 'application/vnd.github.v3+json',
        'User-Agent': 'alighs-ware',
      },
      cache: 'no-store',
    });

    if (!res.ok) return null;
    const file: GithubFileResponse = await res.json();
    // GitHub returns content as base64 with newlines
    const decoded = Buffer.from(file.content.replace(/\n/g, ''), 'base64').toString('utf-8');
    const data: DbData = JSON.parse(decoded);
    return { sha: file.sha, data };
  } catch {
    return null;
  }
}

async function writeFileContent(data: DbData, sha: string, message: string): Promise<boolean> {
  try {
    const encoded = Buffer.from(JSON.stringify(data, null, 2)).toString('base64');
    const res = await fetch(`${API_BASE}/repos/${REPO}/contents/${DB_PATH}`, {
      method: 'PUT',
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        Accept: 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
        'User-Agent': 'alighs-ware',
      },
      body: JSON.stringify({ message, content: encoded, sha }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

/** Read all orders from GitHub DB */
export async function dbGetOrders(): Promise<Record<string, unknown>[]> {
  const file = await getFileInfo();
  if (!file) return [];
  return file.data.orders || [];
}

/** Read all appointments from GitHub DB */
export async function dbGetAppointments(): Promise<Record<string, unknown>[]> {
  const file = await getFileInfo();
  if (!file) return [];
  return file.data.appointments || [];
}

/** Prepend a new order to the DB (up to 500 orders) */
export async function dbSaveOrder(order: Record<string, unknown>): Promise<boolean> {
  const file = await getFileInfo();
  if (!file) return false;
  const orders = [order, ...(file.data.orders || [])].slice(0, 500);
  const newData: DbData = { ...file.data, orders };
  return writeFileContent(newData, file.sha, `order: new order ${order.orderId}`);
}

/** Prepend a new appointment to the DB (up to 500 entries) */
export async function dbSaveAppointment(apt: Record<string, unknown>): Promise<boolean> {
  const file = await getFileInfo();
  if (!file) return false;
  const appointments = [apt, ...(file.data.appointments || [])].slice(0, 500);
  const newData: DbData = { ...file.data, appointments };
  return writeFileContent(newData, file.sha, `apt: new appointment ${apt.appointmentId}`);
}

/** Update order status */
export async function dbUpdateOrderStatus(orderId: string, orderStatus: string): Promise<boolean> {
  const file = await getFileInfo();
  if (!file) return false;
  const orders = (file.data.orders || []).map((o) =>
    (o as Record<string, unknown>).orderId === orderId ? { ...o, orderStatus } : o
  );
  const newData: DbData = { ...file.data, orders };
  return writeFileContent(newData, file.sha, `order: update status ${orderId} -> ${orderStatus}`);
}

/** Update appointment status */
export async function dbUpdateAppointmentStatus(appointmentId: string, status: string): Promise<boolean> {
  const file = await getFileInfo();
  if (!file) return false;
  const appointments = (file.data.appointments || []).map((a) =>
    (a as Record<string, unknown>).appointmentId === appointmentId ? { ...a, status } : a
  );
  const newData: DbData = { ...file.data, appointments };
  return writeFileContent(newData, file.sha, `apt: update status ${appointmentId} -> ${status}`);
}
