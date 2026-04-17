import { apiErrorMap, UNKNOWN_CODE } from "@/shared/utils";

export type PaginatedResponse<T> = {
  items: T[];
  page: number;
  page_size: number;
  total: number;
  pages: number;
};

const DEFAULT_API_BASE_URL = "http://localhost:8000";

function normalizeBaseUrl(value: string) {
  return value.replace(/\/+$/, "");
}

export const API_BASE_URL = normalizeBaseUrl(
  process.env.NEXT_PUBLIC_API_BASE_URL || DEFAULT_API_BASE_URL,
);

export function buildApiUrl(path: string, searchParams?: Record<string, string | number | undefined>) {
  const url = new URL(`${API_BASE_URL}${path}`);

  if (searchParams) {
    for (const [key, value] of Object.entries(searchParams)) {
      if (value !== undefined) {
        url.searchParams.set(key, String(value));
      }
    }
  }

  return url.toString();
}

export async function fetchJson<T>(
  path: string,
  init?: RequestInit,
  searchParams?: Record<string, string | number | undefined>,
): Promise<T> {
  let response: Response;

  try {
    response = await fetch(buildApiUrl(path, searchParams), {
      ...init,
      cache: "no-store",
    });
  } catch {
    throw new Error("Не удалось подключиться к серверу");
  }

  if (!response.ok) {
    let errorMessage = "Не удалось выполнить запрос";

    try {
      const payload = (await response.json()) as { detail?: string };
      errorMessage = payload.detail ? (apiErrorMap[payload.detail] ?? UNKNOWN_CODE) : errorMessage;
    } catch {
      // ignore invalid JSON error bodies
    }

    throw new Error(errorMessage);
  }

  return (await response.json()) as T;
}
