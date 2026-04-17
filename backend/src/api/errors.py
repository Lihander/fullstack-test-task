from enum import StrEnum

from fastapi import HTTPException, status

from src.domain.errors import EmptyFileError, FileNotFoundError, StoredFileNotFoundError


class ApiErrorCode(StrEnum):
    FILE_NOT_FOUND = "FILE_NOT_FOUND"
    FILE_IS_EMPTY = "FILE_IS_EMPTY"
    STORED_FILE_NOT_FOUND = "STORED_FILE_NOT_FOUND"


def raise_http_error(error: Exception) -> None:
    if isinstance(error, FileNotFoundError):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=ApiErrorCode.FILE_NOT_FOUND) from error

    if isinstance(error, EmptyFileError):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=ApiErrorCode.FILE_IS_EMPTY) from error

    if isinstance(error, StoredFileNotFoundError):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=ApiErrorCode.STORED_FILE_NOT_FOUND) from error

    raise error
