"""
Target schemas
"""
from typing import Optional, List, Dict, Any
from datetime import datetime
from pydantic import BaseModel, Field, validator
import re


class TargetBase(BaseModel):
    """Base target schema"""
    name: str = Field(..., min_length=1, max_length=255)
    domain: str = Field(..., min_length=3, max_length=255)
    description: Optional[str] = None
    tags: Optional[List[str]] = []
    metadata: Optional[Dict[str, Any]] = {}
    
    @validator('domain')
    def validate_domain(cls, v):
        """Validate domain format"""
        # Basic domain validation
        domain_pattern = r'^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$'
        if not re.match(domain_pattern, v):
            raise ValueError('Invalid domain format')
        return v.lower()


class TargetCreate(TargetBase):
    """Schema for creating a target"""
    pass


class TargetUpdate(BaseModel):
    """Schema for updating a target"""
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    tags: Optional[List[str]] = None
    metadata: Optional[Dict[str, Any]] = None


class Target(TargetBase):
    """Schema for target response"""
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class TargetWithStats(Target):
    """Target with scan statistics"""
    total_scans: int = 0
    last_scan_date: Optional[datetime] = None
    total_vulnerabilities: int = 0
    total_subdomains: int = 0
