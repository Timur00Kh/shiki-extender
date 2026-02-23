/**
 * Базовый URL бэкенда (подставляется при сборке из VITE_API_BASE_URL).
 * Если не задан, расширение работает только с локальными данными (IndexedDB).
 */
export const apiBaseUrl: string | undefined = import.meta.env
  ?.VITE_API_BASE_URL;

export function hasApi(): boolean {
  return !!apiBaseUrl && apiBaseUrl.length > 0;
}
