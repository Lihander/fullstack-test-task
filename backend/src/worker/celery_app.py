import asyncio
import os

from celery import Celery

from src.infrastructure.config import get_settings


REDIS_URL = os.environ.get("REDIS_URL", get_settings().redis_url)
_worker_loop: asyncio.AbstractEventLoop | None = None


def run_in_worker_loop(coroutine):
    global _worker_loop
    if _worker_loop is None or _worker_loop.is_closed():
        _worker_loop = asyncio.new_event_loop()
        asyncio.set_event_loop(_worker_loop)
    return _worker_loop.run_until_complete(coroutine)


celery_app = Celery("file_tasks", broker=REDIS_URL, backend=REDIS_URL)
