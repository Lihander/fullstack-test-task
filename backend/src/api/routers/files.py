from fastapi import APIRouter, File, Form, Query, UploadFile
from fastapi.responses import FileResponse

from src.api.errors import raise_http_error
from src.api.schemas.files import FileItem, FilePage, FileUpdate
from src.application.files.commands import create_file, delete_file, update_file
from src.application.files.queries import get_file, get_file_download_path, list_files
from src.worker.tasks import scan_file_for_threats


router = APIRouter(tags=["files"])


@router.get("/files", response_model=FilePage)
async def list_files_view(
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
):
    result = await list_files(page=page, page_size=page_size)
    return FilePage(items=result.items, page=result.page, page_size=result.page_size, total=result.total, pages=result.pages)


@router.post("/files", response_model=FileItem, status_code=201)
async def create_file_view(
    title: str = Form(...),
    file: UploadFile = File(...),
):
    try:
        file_item = await create_file(
            title=title,
            original_name=file.filename,
            content=await file.read(),
            content_type=file.content_type,
        )
    except Exception as error:
        raise_http_error(error)

    scan_file_for_threats.delay(file_item.id)
    return file_item


@router.get("/files/{file_id}", response_model=FileItem)
async def get_file_view(file_id: str):
    try:
        return await get_file(file_id)
    except Exception as error:
        raise_http_error(error)


@router.patch("/files/{file_id}", response_model=FileItem)
async def update_file_view(
    file_id: str,
    payload: FileUpdate,
):
    try:
        return await update_file(file_id=file_id, title=payload.title)
    except Exception as error:
        raise_http_error(error)


@router.get("/files/{file_id}/download")
async def download_file(file_id: str):
    try:
        file_item, stored_path = await get_file_download_path(file_id)
    except Exception as error:
        raise_http_error(error)

    return FileResponse(
        path=stored_path,
        media_type=file_item.mime_type,
        filename=file_item.original_name,
    )


@router.delete("/files/{file_id}", status_code=204)
async def delete_file_view(file_id: str):
    try:
        await delete_file(file_id)
    except Exception as error:
        raise_http_error(error)
