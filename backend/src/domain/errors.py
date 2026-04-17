class DomainError(Exception):
    pass


class FileNotFoundError(DomainError):
    pass


class EmptyFileError(DomainError):
    pass


class StoredFileNotFoundError(DomainError):
    pass
