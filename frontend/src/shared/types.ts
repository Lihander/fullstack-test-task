export enum ProcessingStatus {
  Uploaded = "uploaded",
  Processing = "processing",
  Processed = "processed",
  Failed = "failed",
}

export enum BadgeVariant {
  Secondary = "secondary",
  Warning = "warning",
  Success = "success",
  Danger = "danger",
  Info = "info",
}

export enum ApiErrorCode {
  FileNotFound = "FILE_NOT_FOUND",
  FileIsEmpty = "FILE_IS_EMPTY",
  StoredFileNotFound = "STORED_FILE_NOT_FOUND",
}

export enum AlertLevel {
  Critical = "critical",
  Warning = "warning",
  Info = "info",
}

export enum AlertMessageCode {
  FileProcessingFailed = "FILE_PROCESSING_FAILED",
  FileRequiresAttention = "FILE_REQUIRES_ATTENTION",
  FileProcessedSuccessfully = "FILE_PROCESSED_SUCCESSFULLY",
}

export enum ScanStatus {
  Pending = "pending",
  Clean = "clean",
  Suspicious = "suspicious",
  Failed = "failed",
}

export enum ScanReasonCode {
  SuspiciousExtension = "SUSPICIOUS_EXTENSION",
  FileTooLarge = "FILE_TOO_LARGE",
  PdfMimeTypeMismatch = "PDF_MIME_TYPE_MISMATCH",
  StoredFileNotFound = "STORED_FILE_NOT_FOUND",
}
