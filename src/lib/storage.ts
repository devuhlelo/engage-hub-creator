// Helpers de localStorage - será substituído por chamadas API ao seu backend PHP/MySQL

// Custom event for cross-component reactivity
const STORAGE_EVENT = "cms_data_changed";

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
  // Dispatch custom event so site pages can react in real-time
  window.dispatchEvent(new CustomEvent(STORAGE_EVENT, { detail: { key } }));
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

/**
 * Hook-friendly: subscribe to CMS data changes.
 * Returns a cleanup function.
 */
export function onDataChange(callback: (key?: string) => void): () => void {
  const handler = (e: Event) => {
    const detail = (e as CustomEvent).detail;
    callback(detail?.key);
  };
  window.addEventListener(STORAGE_EVENT, handler);
  return () => window.removeEventListener(STORAGE_EVENT, handler);
}
