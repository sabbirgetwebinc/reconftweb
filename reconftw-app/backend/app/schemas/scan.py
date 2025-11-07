"""
Scan schemas
"""
from typing import Optional, List, Dict, Any
from datetime import datetime
from pydantic import BaseModel, Field


class ScanBase(BaseModel):
    """Base scan schema"""
    name: str = Field(..., min_length=1, max_length=255)
    mode: str = Field(default="full", pattern="^(passive|active|full|osint|custom)$")
    config: Optional[Dict[str, Any]] = {}
    tools_enabled: Optional[List[str]] = []


class ScanCreate(ScanBase):
    """Schema for creating a scan"""
    target_id: int


class ScanUpdate(BaseModel):
    """Schema for updating a scan"""
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    status: Optional[str] = None


class ScanProgress(BaseModel):
    """Schema for scan progress updates"""
    progress: float = Field(..., ge=0, le=100)
    current_step: Optional[str] = None
    status: str


class Scan(ScanBase):
    """Schema for scan response"""
    id: int
    target_id: int
    user_id: int
    status: str
    progress: float
    current_step: Optional[str] = None
    subdomains_count: int
    endpoints_count: int
    vulnerabilities_count: int
    celery_task_id: Optional[str] = None
    error_message: Optional[str] = None
    output_path: Optional[str] = None
    created_at: datetime
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    updated_at: datetime
    
    class Config:
        from_attributes = True


class ScanWithDetails(Scan):
    """Scan with related target information"""
    target_domain: Optional[str] = None
    target_name: Optional[str] = None
    duration: Optional[float] = None
