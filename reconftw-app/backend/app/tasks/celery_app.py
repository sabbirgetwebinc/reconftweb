"""
Celery application configuration
"""
from celery import Celery
from app.core.config import settings

celery_app = Celery(
    "reconftw_worker",
    broker=settings.CELERY_BROKER_URL,
    backend=settings.CELERY_RESULT_BACKEND,
    include=["app.tasks.scan_tasks"]
)

# Celery configuration
celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
    task_track_started=True,
    task_time_limit=settings.SCAN_TIMEOUT_HOURS * 3600,
    task_soft_time_limit=settings.SCAN_TIMEOUT_HOURS * 3600 - 300,
    worker_prefetch_multiplier=1,
    worker_max_tasks_per_child=10,
)
