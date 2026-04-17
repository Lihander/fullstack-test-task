from enum import StrEnum


class ProcessingStatus(StrEnum):
    UPLOADED = "uploaded"
    PROCESSING = "processing"
    PROCESSED = "processed"
    FAILED = "failed"


class ScanStatus(StrEnum):
    PENDING = "pending"
    CLEAN = "clean"
    SUSPICIOUS = "suspicious"
    FAILED = "failed"


class AlertLevel(StrEnum):
    CRITICAL = "critical"
    WARNING = "warning"
    INFO = "info"


class AlertMessageCode(StrEnum):
    FILE_PROCESSING_FAILED = "FILE_PROCESSING_FAILED"
    FILE_REQUIRES_ATTENTION = "FILE_REQUIRES_ATTENTION"
    FILE_PROCESSED_SUCCESSFULLY = "FILE_PROCESSED_SUCCESSFULLY"


class ScanReasonCode(StrEnum):
    SUSPICIOUS_EXTENSION = "SUSPICIOUS_EXTENSION"
    FILE_TOO_LARGE = "FILE_TOO_LARGE"
    PDF_MIME_TYPE_MISMATCH = "PDF_MIME_TYPE_MISMATCH"
    STORED_FILE_NOT_FOUND = "STORED_FILE_NOT_FOUND"
