"""
Scan model
"""
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Enum, JSON, Float
from sqlalchemy.orm import relationship
from datetime import datetime
import enum

from app.core.database import Base


class ScanStatus(str, enum.Enum):
    """Scan status enumeration"""
    PENDING = "pending"
    QUEUED = "queued"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"
    CANCELLED = "cancelled"


class ScanMode(str, enum.Enum):
    """Scan mode enumeration"""
    PASSIVE = "passive"
    ACTIVE = "active"
    FULL = "full"
    OSINT = "osint"
    CUSTOM = "custom"


class Scan(Base):
    """Scan model for reconnaissance scans"""
    __tablename__ = "scans"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    
    # Scan configuration
    mode = Column(Enum(ScanMode), default=ScanMode.FULL, nullable=False)
    status = Column(Enum(ScanStatus), default=ScanStatus.PENDING, nullable=False, index=True)
    
    # Configuration options
    config = Column(JSON, default=dict)  # Custom scan configuration
    tools_enabled = Column(JSON, default=list)  # List of enabled tools
    
    # Progress tracking
    progress = Column(Float, default=0.0)  # 0-100
    current_step = Column(String(255))
    
    # Results summary
    subdomains_count = Column(Integer, default=0)
    endpoints_count = Column(Integer, default=0)
    vulnerabilities_count = Column(Integer, default=0)
    
    # Execution details
    celery_task_id = Column(String(255), unique=True, index=True)
    error_message = Column(Text)
    output_path = Column(String(500))
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    started_at = Column(DateTime)
    completed_at = Column(DateTime)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    # Foreign keys
    target_id = Column(Integer, ForeignKey("targets.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Relationships
    target = relationship("Target", back_populates="scans")
    user = relationship("User", back_populates="scans")
    vulnerabilities = relationship("Vulnerability", back_populates="scan", cascade="all, delete-orphan")
    results = relationship("ScanResult", back_populates="scan", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<Scan {self.id} - {self.status}>"
    
    @property
    def duration(self):
        """Calculate scan duration"""
        if self.started_at and self.completed_at:
            return (self.completed_at - self.started_at).total_seconds()
        elif self.started_at:
            return (datetime.utcnow() - self.started_at).total_seconds()
        return None
