"""
Scan Result schemas
"""
from typing import Optional, Dict, Any
from datetime import datetime
from pydantic import BaseModel, Field


class ScanResultBase(BaseModel):
    """Base scan result schema"""
    result_type: str
    value: str = Field(..., min_length=1, max_length=1000)
    details: Optional[Dict[str, Any]] = {}
    subdomain: Optional[str] = None
    ip_address: Optional[str] = None
    endpoint: Optional[str] = None
    http_status: Optional[int] = None
    content_length: Optional[int] = None
    port: Optional[int] = None
    service: Optional[str] = None
    technology: Optional[str] = None
    version: Optional[str] = None
    screenshot_path: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = {}


class ScanResultCreate(ScanResultBase):
    """Schema for creating a scan result"""
    scan_id: int


class ScanResult(ScanResultBase):
    """Schema for scan result response"""
    id: int
    scan_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True
