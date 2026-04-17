import { fetchJson, type PaginatedResponse } from "@/shared/api";

import type { AlertItem } from "./types";

export async function getAlertsPage(page: number, pageSize: number) {
  return fetchJson<PaginatedResponse<AlertItem>>("/alerts", undefined, {
    page,
    page_size: pageSize,
  });
}
