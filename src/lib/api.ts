// Camada de comunicação com a API PHP/MySQL
// Configure VITE_API_URL no .env ou use o padrão

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost/sisgen_api";

// ─── Auth helpers ───────────────────────────────────────────────
function getToken(): string | null {
  return localStorage.getItem("sisgen_token");
}

function getSiteId(): number {
  return Number(localStorage.getItem("sisgen_site_id")) || 1;
}

export function setAuthData(token: string, siteId: number, user: any) {
  localStorage.setItem("sisgen_token", token);
  localStorage.setItem("sisgen_site_id", String(siteId));
  localStorage.setItem("sisgen_user", JSON.stringify(user));
}

export function clearAuthData() {
  localStorage.removeItem("sisgen_token");
  localStorage.removeItem("sisgen_site_id");
  localStorage.removeItem("sisgen_user");
}

export function getSavedUser() {
  try {
    const raw = localStorage.getItem("sisgen_user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

// ─── Fetch wrapper ──────────────────────────────────────────────
async function apiFetch<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers as Record<string, string> || {}),
  };

  const res = await fetch(`${API_BASE}/${endpoint}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const errorBody = await res.text();
    throw new Error(`API Error ${res.status}: ${errorBody}`);
  }

  return res.json();
}

// ─── LOGIN ──────────────────────────────────────────────────────
export async function apiLogin(email: string, password: string) {
  const data = await apiFetch("login.php", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  return data; // Espera: { token, user: { id, email, name }, site_id }
}

// ─── SETTINGS (aparência, home, contato) ────────────────────────
export async function getSettings(): Promise<Record<string, any>> {
  const siteId = getSiteId();
  const data = await apiFetch(`settings.php?site_id=${siteId}`);
  // Converte array de {key, value} para objeto
  if (Array.isArray(data)) {
    const obj: Record<string, any> = {};
    data.forEach((item: any) => {
      try {
        obj[item.key] = JSON.parse(item.value);
      } catch {
        obj[item.key] = item.value;
      }
    });
    return obj;
  }
  return data;
}

export async function getSetting<T>(key: string, fallback: T): Promise<T> {
  try {
    const all = await getSettings();
    return all[key] !== undefined ? all[key] : fallback;
  } catch {
    return fallback;
  }
}

export async function saveSetting(key: string, value: any): Promise<void> {
  const siteId = getSiteId();
  const stringValue = typeof value === "string" ? value : JSON.stringify(value);
  
  // Tenta PUT primeiro, se falhar faz POST
  try {
    await apiFetch("settings.php", {
      method: "PUT",
      body: JSON.stringify({ site_id: siteId, key, value: stringValue }),
    });
  } catch {
    await apiFetch("settings.php", {
      method: "POST",
      body: JSON.stringify({ site_id: siteId, key, value: stringValue }),
    });
  }
}

// ─── CATEGORIAS ─────────────────────────────────────────────────
export async function getCategories(): Promise<any[]> {
  const siteId = getSiteId();
  const data = await apiFetch(`categories.php?site_id=${siteId}`);
  return Array.isArray(data) ? data : [];
}

export async function createCategory(cat: { name: string; color?: string; description?: string }): Promise<any> {
  const siteId = getSiteId();
  return apiFetch("categories.php", {
    method: "POST",
    body: JSON.stringify({ site_id: siteId, ...cat }),
  });
}

export async function updateCategory(id: number, cat: { name?: string; color?: string; description?: string }): Promise<any> {
  const siteId = getSiteId();
  return apiFetch("categories.php", {
    method: "PUT",
    body: JSON.stringify({ site_id: siteId, id, ...cat }),
  });
}

export async function deleteCategory(id: number): Promise<void> {
  const siteId = getSiteId();
  await apiFetch(`categories.php?site_id=${siteId}&id=${id}`, { method: "DELETE" });
}

// ─── POSTS (propostas, noticias, livros, videos) ────────────────
// IMPORTANTE: Seu posts.php precisa aceitar o campo "type" para filtrar
// GET: /posts.php?site_id=1&type=proposta
// POST body: { ..., type: "proposta" }

export type PostType = "proposta" | "noticia" | "livro" | "video";

export async function getPosts(type?: PostType): Promise<any[]> {
  const siteId = getSiteId();
  let url = `posts.php?site_id=${siteId}`;
  if (type) url += `&type=${type}`;
  const data = await apiFetch(url);
  return Array.isArray(data) ? data : [];
}

export async function getPost(id: number): Promise<any> {
  const siteId = getSiteId();
  return apiFetch(`posts.php?site_id=${siteId}&id=${id}`);
}

export async function createPost(post: Record<string, any>): Promise<any> {
  const siteId = getSiteId();
  return apiFetch("posts.php", {
    method: "POST",
    body: JSON.stringify({ site_id: siteId, ...post }),
  });
}

export async function updatePost(id: number, post: Record<string, any>): Promise<any> {
  const siteId = getSiteId();
  return apiFetch("posts.php", {
    method: "PUT",
    body: JSON.stringify({ site_id: siteId, id, ...post }),
  });
}

export async function deletePost(id: number): Promise<void> {
  const siteId = getSiteId();
  await apiFetch(`posts.php?site_id=${siteId}&id=${id}`, { method: "DELETE" });
}

// ─── PAGES (biografia) ─────────────────────────────────────────
export async function getPages(): Promise<any[]> {
  const siteId = getSiteId();
  const data = await apiFetch(`pages.php?site_id=${siteId}`);
  return Array.isArray(data) ? data : [];
}

export async function getPage(id: number): Promise<any> {
  const siteId = getSiteId();
  return apiFetch(`pages.php?site_id=${siteId}&id=${id}`);
}

export async function savePage(page: Record<string, any>): Promise<any> {
  const siteId = getSiteId();
  if (page.id) {
    return apiFetch("pages.php", {
      method: "PUT",
      body: JSON.stringify({ site_id: siteId, ...page }),
    });
  }
  return apiFetch("pages.php", {
    method: "POST",
    body: JSON.stringify({ site_id: siteId, ...page }),
  });
}

export async function deletePage(id: number): Promise<void> {
  const siteId = getSiteId();
  await apiFetch(`pages.php?site_id=${siteId}&id=${id}`, { method: "DELETE" });
}

// ─── MEDIA ──────────────────────────────────────────────────────
export async function getMedia(): Promise<any[]> {
  const siteId = getSiteId();
  const data = await apiFetch(`media.php?site_id=${siteId}`);
  return Array.isArray(data) ? data : [];
}

export async function uploadMedia(file: File): Promise<any> {
  const siteId = getSiteId();
  const user = getSavedUser();
  const formData = new FormData();
  formData.append("file", file);
  formData.append("site_id", String(siteId));
  formData.append("user_id", String(user?.id || 1));

  const token = getToken();
  const res = await fetch(`${API_BASE}/media.php`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });

  if (!res.ok) throw new Error(`Upload failed: ${res.status}`);
  return res.json();
}

export async function deleteMedia(id: number): Promise<void> {
  const siteId = getSiteId();
  await apiFetch(`media.php?site_id=${siteId}&id=${id}`, { method: "DELETE" });
}
