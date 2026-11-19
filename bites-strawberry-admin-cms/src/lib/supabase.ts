const SUPABASE_URL = (import.meta.env.VITE_SUPABASE_URL || 'https://fytsueuehzfplicjqcvx.supabase.co').replace(/\/+$/, '');
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_BjRhaMUJjWEe4nyFbwDC3w_P27njsI6';
const SESSION_KEY = 'bites_admin_session_v1';
export type Session = { access_token: string; refresh_token: string; expires_at?: number; user: { id: string; email?: string; app_metadata?: Record<string, unknown>; user_metadata?: Record<string, unknown> } };
let session: Session | null = null;
try { session = JSON.parse(localStorage.getItem(SESSION_KEY) || 'null'); } catch { session = null; }
export const supabaseConfig = { url: SUPABASE_URL, key: SUPABASE_KEY };
function saveSession(value: Session | null) { session = value; if (value) localStorage.setItem(SESSION_KEY, JSON.stringify(value)); else localStorage.removeItem(SESSION_KEY); }
async function request(path: string, init: RequestInit = {}, token?: string) {
  const headers = new Headers(init.headers || {}); headers.set('apikey', SUPABASE_KEY);
  if (token) headers.set('Authorization', `Bearer ${token}`);
  const response = await fetch(`${SUPABASE_URL}${path}`, { ...init, headers });
  if (!response.ok) { const body = await response.text(); throw new Error(body.slice(0, 500) || `Supabase error ${response.status}`); }
  if (response.status === 204) return null;
  const type = response.headers.get('content-type') || ''; return type.includes('application/json') ? response.json() : response.text();
}
export async function signIn(email: string, password: string): Promise<Session> {
  const data = await request('/auth/v1/token?grant_type=password', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) }) as any;
  const next: Session = { access_token: data.access_token, refresh_token: data.refresh_token, expires_at: Math.floor(Date.now()/1000) + (data.expires_in || 3600), user: data.user };
  if (next.user?.app_metadata?.role !== 'admin') { await request('/auth/v1/logout', { method: 'POST' }, next.access_token).catch(() => undefined); throw new Error('Akun ini belum diberi hak akses admin BITE’S.'); }
  saveSession(next); return next;
}
export async function getSession(): Promise<Session | null> {
  if (!session) return null;
  if (session.expires_at && session.expires_at > Math.floor(Date.now()/1000) + 90) return session;
  try {
    const data = await request('/auth/v1/token?grant_type=refresh_token', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ refresh_token: session.refresh_token }) }) as any;
    const next: Session = { access_token: data.access_token, refresh_token: data.refresh_token, expires_at: Math.floor(Date.now()/1000) + (data.expires_in || 3600), user: data.user || session.user };
    saveSession(next); return next;
  } catch { saveSession(null); return null; }
}
export async function signOut() { const current = await getSession(); if (current) await request('/auth/v1/logout', { method: 'POST' }, current.access_token).catch(() => undefined); saveSession(null); }
export async function updatePassword(password: string) { const current = await getSession(); if (!current) throw new Error('Sesi admin berakhir. Silakan login kembali.'); return request('/auth/v1/user', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password }) }, current.access_token); }
export async function db<T = any>(table: string, query = '', options: { method?: string; body?: unknown; prefer?: string } = {}): Promise<T> {
  const current = options.method === 'GET' || !options.method ? await getSession() : await getSession();
  const headers: Record<string,string> = { 'Content-Type': 'application/json' };
  if (options.prefer) headers.Prefer = options.prefer;
  return request(`/rest/v1/${table}${query ? `?${query}` : ''}`, { method: options.method || 'GET', headers, body: options.body === undefined ? undefined : JSON.stringify(options.body) }, current?.access_token) as Promise<T>;
}
export async function uploadImage(file: File, folder: string): Promise<string> {
  const current = await getSession(); if (!current) throw new Error('Silakan login kembali.');
  if (!file.type.startsWith('image/')) throw new Error('File harus berupa gambar.');
  if (file.size > 8 * 1024 * 1024) throw new Error('Ukuran gambar maksimal 8 MB.');
  const ext = (file.name.split('.').pop() || 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg';
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;
  await request(`/storage/v1/object/bites-media/${path}`, { method: 'POST', headers: { 'Content-Type': file.type, 'x-upsert': 'false' }, body: file }, current.access_token);
  return `${SUPABASE_URL}/storage/v1/object/public/bites-media/${path}`;
}
export async function logActivity(action: string, entity: string, entityId?: string, entityName?: string) {
  const current = await getSession(); if (!current) return;
  await db('admin_activity_logs', '', { method: 'POST', body: { admin_id: current.user.id, action, entity, entity_id: entityId || null, entity_name: entityName || null }, prefer: 'return=minimal' });
}
export async function getPublicRows<T>(table: string): Promise<T[]> {
  return request(`/rest/v1/${table}?select=*&order=created_at.asc`, {}) as Promise<T[]>;
}
export async function deleteImage(publicUrl: string) {
  const marker = '/storage/v1/object/public/bites-media/';
  const index = publicUrl.indexOf(marker);
  if (index < 0) return;
  const current = await getSession(); if (!current) throw new Error('Silakan login kembali untuk menghapus foto.');
  const objectPath = publicUrl.slice(index + marker.length).split('/').map(encodeURIComponent).join('/');
  await request(`/storage/v1/object/bites-media/${objectPath}`, { method: 'DELETE' }, current.access_token);
}
export interface OrderInsert {
  product_id: string; product_name: string; quantity: number; unit: string; unit_price: number; subtotal: number;
  fulfillment_method: 'pickup'|'delivery'; pickup_outlet: string|null; delivery_address: string|null; customer_name: string|null; notes: string|null;
}
export async function saveOrder(order: OrderInsert): Promise<void> {
  await request('/rest/v1/orders', { method:'POST', headers:{'Content-Type':'application/json',Prefer:'return=minimal'}, body:JSON.stringify(order) });
}
