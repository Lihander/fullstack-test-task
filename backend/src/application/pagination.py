from dataclasses import dataclass

from src.infrastructure.persistence.models import Alert, StoredFile


@dataclass(frozen=True)
class PageResult:
    items: list[StoredFile] | list[Alert]
    total: int
    page: int
    page_size: int

    @property
    def pages(self) -> int:
        if self.total == 0:
            return 0
        return (self.total + self.page_size - 1) // self.page_size


def build_page_result(*, items: list[StoredFile] | list[Alert], total: int, page: int, page_size: int) -> PageResult:
    return PageResult(items=items, total=total, page=page, page_size=page_size)
