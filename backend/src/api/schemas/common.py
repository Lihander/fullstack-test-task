from pydantic import BaseModel


class PageParams(BaseModel):
    page: int
    page_size: int
    total: int
    pages: int
