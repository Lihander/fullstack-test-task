export function formatDate(value: string) {
  return new Intl.DateTimeFormat("ru-RU", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}

export function formatSize(size: number) {
  if (size < 1024) {
    return `${size} B`;
  }

  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(1)} KB`;
  }

  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

const mimeTypeLabelMap: Record<string, string> = {
  "application/json": "JSON",
  "application/msword": "Word (.doc)",
  "application/pdf": "PDF",
  "application/rtf": "RTF",
  "application/vnd.ms-excel": "Excel (.xls)",
  "application/vnd.ms-powerpoint": "PowerPoint (.ppt)",
  "application/vnd.oasis.opendocument.spreadsheet": "ODS",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": "PowerPoint (.pptx)",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "Excel (.xlsx)",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "Word (.docx)",
  "application/zip": "ZIP",
  "image/gif": "GIF",
  "image/jpeg": "JPEG",
  "image/png": "PNG",
  "image/svg+xml": "SVG",
  "text/csv": "CSV",
  "text/html": "HTML",
  "text/plain": "TXT",
};

export function formatMimeType(mimeType: string) {
  return mimeTypeLabelMap[mimeType] ?? mimeType;
}

export function truncateText(value: string, maxLength = 50) {
  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, Math.max(0, maxLength - 3))}...`;
}
