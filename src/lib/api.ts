const API_URL = import.meta.env.VITE_API_URL || 'http://localhost/sisgen_api';

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
  
  if (!user || user === 'undefined') {
    return null;
  }
  
  try {
    return JSON.parse(user);
  } catch (error) {
    localStorage.removeItem('@Sisgen:user');
    return null;
  }
};

export const getToken = () => {
  return localStorage.getItem('@Sisgen:token');
};

export const apiLogin = async (email: string, password: string) => {
  const response = await fetch(`${API_URL}/login.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) throw new Error('Erro ao fazer login');
  return response.json();
};

export const getSettings = async () => {
  const response = await fetch(`${API_URL}/settings.php`);
  if (!response.ok) throw new Error('Erro ao buscar configurações');
  return response.json();
};

export const getSetting = async (key: string) => {
  const settings = await getSettings();
  const setting = settings.find((s: any) => s.setting_key === key);
  if (setting) {
    try {
      return JSON.parse(setting.setting_value);
    } catch (e) {
      return setting.setting_value;
    }
  }
  return null;
};

export const saveSetting = async (key: string, value: any) => {
  const response = await fetch(`${API_URL}/settings.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ key, value }),
  });
  if (!response.ok) throw new Error('Erro ao salvar configurações');
  return response.json();
};

export const getCategories = async () => {
  const response = await fetch(`${API_URL}/categories.php`);
  if (!response.ok) throw new Error('Erro ao buscar categorias');
  return response.json();
};

export const createCategory = async (data: any) => {
  const response = await fetch(`${API_URL}/categories.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Erro ao criar categoria');
  return response.json();
};

export const updateCategory = async (id: number, data: any) => {
  const response = await fetch(`${API_URL}/categories.php?id=${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Erro ao atualizar categoria');
  return response.json();
};

export const deleteCategory = async (id: number) => {
  const response = await fetch(`${API_URL}/categories.php?id=${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Erro ao excluir categoria');
  return response.json();
};

export const getPages = async () => {
  const response = await fetch(`${API_URL}/pages.php`);
  if (!response.ok) throw new Error('Erro ao buscar páginas');
  return response.json();
};

export const updatePage = async (id: number, data: any) => {
  const response = await fetch(`${API_URL}/pages.php?id=${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Erro ao atualizar página');
  return response.json();
};

export const getPosts = async (siteId: number, type?: string) => {
  const url = type 
    ? `${API_URL}/posts.php?site_id=${siteId}&type=${type}`
    : `${API_URL}/posts.php?site_id=${siteId}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error('Erro ao buscar posts');
  return response.json();
};

export const createPost = async (data: any) => {
  const response = await fetch(`${API_URL}/posts.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Erro ao criar post');
  return response.json();
};

export const deletePost = async (id: number) => {
  const response = await fetch(`${API_URL}/posts.php?id=${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Erro ao excluir post');
  return response.json();
};

export const uploadMedia = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await fetch(`${API_URL}/media.php`, {
    method: 'POST',
    body: formData,
  });
  if (!response.ok) throw new Error('Erro ao fazer upload da imagem');
  return response.json();
};

export const api = {
  getPosts,
  createPost,
  deletePost,
  uploadMedia,
  updateSettings: async (data: { key: string, value: any }) => saveSetting(data.key, data.value)
};