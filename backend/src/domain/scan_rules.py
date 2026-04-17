KB = 1024
MB = 1024 * KB

MAX_SCAN_FILE_SIZE_MIB = 10
MAX_SCAN_FILE_SIZE_BYTES = MAX_SCAN_FILE_SIZE_MIB * MB

SUSPICIOUS_FILE_EXTENSIONS = frozenset({
    ".exe",
    ".bat",
    ".cmd",
    ".sh",
    ".js",
})

PDF_ALLOWED_MIME_TYPES = frozenset({
    "application/pdf",
    "application/octet-stream",
})
