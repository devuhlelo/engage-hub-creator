const API_URL = import.meta.env.VITE_API_URL || 'http://localhost/sisgen_api/api';

// ─── Auth helpers ────────────────────────────────────────────
export const setAuthData = (token: string, user: any, siteId: number) => {
  localStorage.setItem('@Sisgen:token', token);
  localStorage.setItem('@Sisgen:user', JSON.stringify(user));
  localStorage.setItem('@Sisgen:siteId', String(siteId));
};

export const clearAuthData = () => {
  localStorage.removeItem('@Sisgen:token');
  localStorage.removeItem('@Sisgen:user');
  localStorage.removeItem('@Sisgen:siteId');
};

export const getSavedUser = () => {
  const user = localStorage.getItem('@Sisgen:user');
  if (!user || user === 'undefined') return null;
  try { return JSON.parse(user); } catch { localStorage.removeItem('@Sisgen:user'); return null; }
};

export const getToken = () => localStorage.getItem('@Sisgen:token');
export const getSiteId = (): number => {
  const id = localStorage.getItem('@Sisgen:siteId');
  return id ? parseInt(id) : 1;
};

// ─── Login ───────────────────────────────────────────────────
export const apiLogin = async (email: string, senha: string) => {
  const response = await fetch(`${API_URL}/login.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, senha }),
  });
  if (!response.ok) throw new Error('Erro ao fazer login');
  return response.json();
};

// ─── Settings (via backend configuracoes.php) ───────────────
export const getSetting = async (key: string, fallback: any = null, siteId?: number): Promise<any> => {
  const sid = siteId ?? getSiteId();
  try {
    const response = await fetch(`${API_URL}/configuracoes.php?site_id=${sid}&chave=${encodeURIComponent(key)}`);
    if (!response.ok) throw new Error('Erro ao buscar configuração');
    const data = await response.json();
    if (data && data.valor) {
      try { return JSON.parse(data.valor); } catch { return data.valor; }
    }
    return fallback;
  } catch {
    // Fallback to localStorage if backend not available
    const raw = localStorage.getItem(`@Sisgen:setting:${sid}:${key}`);
    if (!raw) return fallback;
    try { return JSON.parse(raw); } catch { return fallback; }
  }
};

export const saveSetting = async (key: string, value: any, siteId?: number) => {
  const sid = siteId ?? getSiteId();
  try {
    const response = await fetch(`${API_URL}/configuracoes.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ site_id: sid, chave: key, valor: JSON.stringify(value) }),
    });
    if (!response.ok) throw new Error('Erro ao salvar configuração');
    // Also save to localStorage as cache
    localStorage.setItem(`@Sisgen:setting:${sid}:${key}`, JSON.stringify(value));
    return response.json();
  } catch {
    // Fallback to localStorage if backend not available
    localStorage.setItem(`@Sisgen:setting:${sid}:${key}`, JSON.stringify(value));
    return { success: true };
  }
};

// ─── Resolve site_id by domain (for production) ─────────────
export const resolveSiteByDomain = async (domain: string): Promise<number | null> => {
  try {
    const response = await fetch(`${API_URL}/resolve.php?domain=${encodeURIComponent(domain)}`);
    if (!response.ok) return null;
    const data = await response.json();
    return data?.site_id ?? null;
  } catch {
    return null;
  }
};

// ─── Public API helpers (accept siteId param) ───────────────
export const getPublicPropostas = async (siteId: number) => {
  const response = await fetch(`${API_URL}/propostas.php?site_id=${siteId}`);
  if (!response.ok) throw new Error('Erro ao buscar propostas');
  const data = await response.json();
  return Array.isArray(data) ? data : [];
};

export const getPublicCategories = async (siteId: number) => {
  const response = await fetch(`${API_URL}/categorias.php?site_id=${siteId}`);
  if (!response.ok) throw new Error('Erro ao buscar categorias');
  const data = await response.json();
  return Array.isArray(data) ? data : [];
};

export const getPublicNoticias = async (siteId: number) => {
  const response = await fetch(`${API_URL}/noticias.php?site_id=${siteId}`);
  if (!response.ok) throw new Error('Erro ao buscar notícias');
  const data = await response.json();
  return Array.isArray(data) ? data : [];
};

export const getPublicVideos = async (siteId: number) => {
  const response = await fetch(`${API_URL}/videos.php?site_id=${siteId}`);
  if (!response.ok) throw new Error('Erro ao buscar vídeos');
  const data = await response.json();
  return Array.isArray(data) ? data : [];
};

export const getPublicLivros = async (siteId: number) => {
  const response = await fetch(`${API_URL}/livros.php?site_id=${siteId}`);
  if (!response.ok) throw new Error('Erro ao buscar livros');
  const data = await response.json();
  return Array.isArray(data) ? data : [];
};

export const getPublicBanners = async (siteId: number) => {
  const response = await fetch(`${API_URL}/banners.php?site_id=${siteId}`);
  if (!response.ok) throw new Error('Erro ao buscar banners');
  const data = await response.json();
  return Array.isArray(data) ? data : [];
};

export const getPublicBiografia = async (siteId: number) => {
  const response = await fetch(`${API_URL}/biografia.php?site_id=${siteId}`);
  if (!response.ok) throw new Error('Erro ao buscar biografia');
  return response.json();
};

// ─── Categorias ──────────────────────────────────────────────
export const getCategories = async () => {
  const siteId = getSiteId();
  const response = await fetch(`${API_URL}/categorias.php?site_id=${siteId}`);
  if (!response.ok) throw new Error('Erro ao buscar categorias');
  const data = await response.json();
  return Array.isArray(data) ? data : [];
};

export const createCategory = async (data: any) => {
  const siteId = getSiteId();
  const response = await fetch(`${API_URL}/categorias.php?site_id=${siteId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nome: data.nome || data.name }),
  });
  if (!response.ok) throw new Error('Erro ao criar categoria');
  return response.json();
};

export const deleteCategory = async (id: number) => {
  const siteId = getSiteId();
  const response = await fetch(`${API_URL}/categorias.php?site_id=${siteId}&id=${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Erro ao excluir categoria');
  return response.json();
};

// ─── Notícias ────────────────────────────────────────────────
export const getNoticias = async () => {
  const siteId = getSiteId();
  const response = await fetch(`${API_URL}/noticias.php?site_id=${siteId}`);
  if (!response.ok) throw new Error('Erro ao buscar notícias');
  const data = await response.json();
  return Array.isArray(data) ? data : [];
};

export const createNoticia = async (data: { titulo: string; conteudo: string; status: string; imagem?: File }) => {
  const siteId = getSiteId();
  const formData = new FormData();
  formData.append('site_id', String(siteId));
  formData.append('titulo', data.titulo);
  formData.append('conteudo', data.conteudo);
  formData.append('status', data.status);
  if (data.imagem) formData.append('imagem', data.imagem);
  const response = await fetch(`${API_URL}/noticias.php`, { method: 'POST', body: formData });
  if (!response.ok) throw new Error('Erro ao criar notícia');
  return response.json();
};

export const deleteNoticia = async (id: number) => {
  const siteId = getSiteId();
  const response = await fetch(`${API_URL}/noticias.php?site_id=${siteId}&id=${id}`, { method: 'DELETE' });
  if (!response.ok) throw new Error('Erro ao excluir notícia');
  return response.json();
};

// ─── Biografia ───────────────────────────────────────────────
export const getBiografia = async () => {
  const siteId = getSiteId();
  const response = await fetch(`${API_URL}/biografia.php?site_id=${siteId}`);
  if (!response.ok) throw new Error('Erro ao buscar biografia');
  return response.json();
};

export const saveBiografia = async (data: { titulo: string; texto_biografia: string; imagem?: File; foto_atual?: string }) => {
  const siteId = getSiteId();
  const formData = new FormData();
  formData.append('site_id', String(siteId));
  formData.append('titulo', data.titulo);
  formData.append('texto_biografia', data.texto_biografia);
  if (data.imagem) {
    formData.append('imagem', data.imagem);
  } else if (data.foto_atual) {
    formData.append('foto_atual', data.foto_atual);
  }
  const response = await fetch(`${API_URL}/biografia.php`, { method: 'POST', body: formData });
  if (!response.ok) throw new Error('Erro ao salvar biografia');
  return response.json();
};

// ─── Propostas ───────────────────────────────────────────────
export const getPropostas = async () => {
  const siteId = getSiteId();
  const response = await fetch(`${API_URL}/propostas.php?site_id=${siteId}`);
  if (!response.ok) throw new Error('Erro ao buscar propostas');
  const data = await response.json();
  return Array.isArray(data) ? data : [];
};

export const createProposta = async (data: { titulo: string; descricao: string; categoria_id: number; icone?: string }) => {
  const siteId = getSiteId();
  const response = await fetch(`${API_URL}/propostas.php?site_id=${siteId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Erro ao criar proposta');
  return response.json();
};

export const deleteProposta = async (id: number) => {
  const siteId = getSiteId();
  const response = await fetch(`${API_URL}/propostas.php?site_id=${siteId}&id=${id}`, { method: 'DELETE' });
  if (!response.ok) throw new Error('Erro ao excluir proposta');
  return response.json();
};

// ─── Banners ─────────────────────────────────────────────────
export const getBanners = async () => {
  const siteId = getSiteId();
  const response = await fetch(`${API_URL}/banners.php?site_id=${siteId}`);
  if (!response.ok) throw new Error('Erro ao buscar banners');
  const data = await response.json();
  return Array.isArray(data) ? data : [];
};

export const createBanner = async (data: { titulo: string; link: string; imagem: File }) => {
  const siteId = getSiteId();
  const formData = new FormData();
  formData.append('site_id', String(siteId));
  formData.append('titulo', data.titulo);
  formData.append('link', data.link);
  formData.append('imagem', data.imagem);
  const response = await fetch(`${API_URL}/banners.php`, { method: 'POST', body: formData });
  if (!response.ok) throw new Error('Erro ao criar banner');
  return response.json();
};

export const deleteBanner = async (id: number) => {
  const siteId = getSiteId();
  const response = await fetch(`${API_URL}/banners.php?site_id=${siteId}&id=${id}`, { method: 'DELETE' });
  if (!response.ok) throw new Error('Erro ao excluir banner');
  return response.json();
};

// ─── Vídeos ──────────────────────────────────────────────────
export const getVideos = async () => {
  const siteId = getSiteId();
  const response = await fetch(`${API_URL}/videos.php?site_id=${siteId}`);
  if (!response.ok) throw new Error('Erro ao buscar vídeos');
  const data = await response.json();
  return Array.isArray(data) ? data : [];
};

export const createVideo = async (data: { titulo: string; url_video: string; descricao?: string }) => {
  const siteId = getSiteId();
  const response = await fetch(`${API_URL}/videos.php?site_id=${siteId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Erro ao criar vídeo');
  return response.json();
};

export const deleteVideo = async (id: number) => {
  const siteId = getSiteId();
  const response = await fetch(`${API_URL}/videos.php?site_id=${siteId}&id=${id}`, { method: 'DELETE' });
  if (!response.ok) throw new Error('Erro ao excluir vídeo');
  return response.json();
};

// ─── Livros ──────────────────────────────────────────────────
export const getLivros = async () => {
  const siteId = getSiteId();
  const response = await fetch(`${API_URL}/livros.php?site_id=${siteId}`);
  if (!response.ok) throw new Error('Erro ao buscar livros');
  const data = await response.json();
  return Array.isArray(data) ? data : [];
};

export const createLivro = async (data: { titulo: string; autor: string; resumo: string; imagem?: File }) => {
  const siteId = getSiteId();
  const formData = new FormData();
  formData.append('site_id', String(siteId));
  formData.append('titulo', data.titulo);
  formData.append('autor', data.autor);
  formData.append('resumo', data.resumo);
  if (data.imagem) formData.append('imagem', data.imagem);
  const response = await fetch(`${API_URL}/livros.php`, { method: 'POST', body: formData });
  if (!response.ok) throw new Error('Erro ao criar livro');
  return response.json();
};

export const deleteLivro = async (id: number) => {
  const siteId = getSiteId();
  const response = await fetch(`${API_URL}/livros.php?site_id=${siteId}&id=${id}`, { method: 'DELETE' });
  if (!response.ok) throw new Error('Erro ao excluir livro');
  return response.json();
};

// ─── Upload de Mídia (genérico) ─────────────────────────────
export const uploadMedia = async (file: File) => {
  const siteId = getSiteId();
  const formData = new FormData();
  formData.append('file', file);
  formData.append('site_id', String(siteId));
  const response = await fetch(`${API_URL}/media.php`, { method: 'POST', body: formData });
  if (!response.ok) throw new Error('Erro ao fazer upload');
  return response.json();
};