"""
Audit Log model for compliance and tracking
"""
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from datetime import datetime

from app.core.database import Base


class AuditLog(Base):
    """Audit log for tracking user actions"""
    __tablename__ = "audit_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    
    # Action details
    action = Column(String(100), nullable=False, index=True)  # e.g., "scan_created", "user_login"
    resource_type = Column(String(50))  # e.g., "scan", "target", "user"
    resource_id = Column(Integer)
    
    # Request details
    ip_address = Column(String(45))
    user_agent = Column(String(500))
    
    # Additional context
    details = Column(JSON, default=dict)
    description = Column(Text)
    
    # Status
    success = Column(Integer, default=1)  # 1=success, 0=failure
    error_message = Column(Text)
    
    # Timestamp
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)
    
    # Foreign key
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)  # Nullable for system actions
    
    # Relationships
    user = relationship("User", back_populates="audit_logs")
    
    def __repr__(self):
        return f"<AuditLog {self.action} by User {self.user_id}>"
