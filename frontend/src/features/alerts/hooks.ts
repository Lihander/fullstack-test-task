import { usePaginatedResource } from "@/shared/usePaginatedResource";

import { getAlertsPage } from "./api";
export function useAlerts(initialPageSize = 5) {
  return usePaginatedResource({
    fetchPage: getAlertsPage,
    fallbackErrorMessage: "Не удалось загрузить сообщения",
    initialPageSize,
  });
}
