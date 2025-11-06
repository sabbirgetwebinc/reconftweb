"""
Scan Result model for storing detailed scan outputs
"""
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, JSON, Enum
from sqlalchemy.orm import relationship
from datetime import datetime
import enum

from app.core.database import Base


class ResultType(str, enum.Enum):
    """Types of scan results"""
    SUBDOMAIN = "subdomain"
    ENDPOINT = "endpoint"
    PORT = "port"
    TECHNOLOGY = "technology"
    IP_ADDRESS = "ip_address"
    DNS_RECORD = "dns_record"
    SCREENSHOT = "screenshot"
    EMAIL = "email"
    API_KEY = "api_key"
    OTHER = "other"


class ScanResult(Base):
    """Detailed scan results"""
    __tablename__ = "scan_results"
    
    id = Column(Integer, primary_key=True, index=True)
    
    # Result type and data
    result_type = Column(Enum(ResultType), nullable=False, index=True)
    value = Column(String(1000), nullable=False, index=True)
    
    # Additional details
    details = Column(JSON, default=dict)  # Flexible storage for type-specific data
    
    # For subdomains
    subdomain = Column(String(500), index=True)
    ip_address = Column(String(45))  # IPv4 or IPv6
    
    # For endpoints
    endpoint = Column(String(1000))
    http_status = Column(Integer)
    content_length = Column(Integer)
    
    # For ports
    port = Column(Integer)
    service = Column(String(100))
    
    # For technologies
    technology = Column(String(255))
    version = Column(String(100))
    
    # Screenshot path
    screenshot_path = Column(String(500))
    
    # Metadata
    metadata = Column(JSON, default=dict)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    
    # Foreign key
    scan_id = Column(Integer, ForeignKey("scans.id"), nullable=False)
    
    # Relationships
    scan = relationship("Scan", back_populates="results")
    
    def __repr__(self):
        return f"<ScanResult {self.result_type}: {self.value}>"
