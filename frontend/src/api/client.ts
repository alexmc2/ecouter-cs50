
const localApiBaseUrl = "http://127.0.0.1:3001";

function getApiBaseUrl(): string {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  if (apiBaseUrl) {
    return apiBaseUrl.replace(/\/$/, "");
  }

  if (import.meta.env.DEV) {
    return localApiBaseUrl;
  }

  throw new Error("Missing required VITE_API_BASE_URL environment variable.");
}

export const API_BASE_URL = getApiBaseUrl();

export async function apiGet<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`);

  if (!response.ok) {
    throw new Error(`GET ${path} failed with status ${response.status}`);
  }

  return (await response.json()) as T;
}
