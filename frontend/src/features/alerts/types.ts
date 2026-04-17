import type { AlertLevel, AlertMessageCode } from "@/shared/types";

export type AlertItem = {
  id: number;
  file_id: string;
  level: AlertLevel;
  message: AlertMessageCode;
  created_at: string;
};
