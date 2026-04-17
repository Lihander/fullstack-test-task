import { ScanStatus } from "@/shared/types";
import { scanReasonMap, UNKNOWN_CODE } from "@/shared/utils";

import type { FileItem } from "./types";

export const getScanReasonLabel = (file: FileItem) => {
  if (file.scan_reason_codes.length > 0) {
    return file.scan_reason_codes.map((code) => scanReasonMap[code] ?? UNKNOWN_CODE).join(", ");
  }

  return file.scan_status === ScanStatus.Clean ? "Угроз не обнаружено" : "Ожидает обработки";
};
