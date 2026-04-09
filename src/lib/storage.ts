// Helpers de localStorage - será substituído por chamadas API ao seu backend PHP/MySQL

export function getData<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(`cms_${key}`);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function setData<T>(key: string, data: T): void {
  localStorage.setItem(`cms_${key}`, JSON.stringify(data));
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}
