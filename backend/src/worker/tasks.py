from src.application.scanning.service import extract_file_metadata_async, scan_file_for_threats_async, send_file_alert_async
from src.worker.celery_app import celery_app, run_in_worker_loop


@celery_app.task
def scan_file_for_threats(file_id: str) -> None:
    run_in_worker_loop(scan_file_for_threats_async(file_id))
    extract_file_metadata.delay(file_id)


@celery_app.task
def extract_file_metadata(file_id: str) -> None:
    run_in_worker_loop(extract_file_metadata_async(file_id))
    send_file_alert.delay(file_id)


@celery_app.task
def send_file_alert(file_id: str) -> None:
    run_in_worker_loop(send_file_alert_async(file_id))
