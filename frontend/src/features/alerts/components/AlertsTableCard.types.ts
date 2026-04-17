import type { PaginatedResponse } from "@/shared/api";

import type { AlertItem } from "../types";

export type AlertsTableCardProps = {
  data: PaginatedResponse<AlertItem> | null;
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
  onPageChange: (page: number) => void;
};
