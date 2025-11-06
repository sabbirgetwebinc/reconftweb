"""
Scans API endpoints
"""
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import desc

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.models.target import Target
from app.models.scan import Scan, ScanStatus
from app.models.vulnerability import Vulnerability
from app.models.scan_result import ScanResult
from app.schemas.scan import Scan as ScanSchema, ScanCreate, ScanUpdate, ScanWithDetails
from app.schemas.vulnerability import Vulnerability as VulnSchema
from app.schemas.scan_result import ScanResult as ResultSchema
from app.tasks.scan_tasks import execute_scan

router = APIRouter()


@router.get("/", response_model=List[ScanWithDetails])
async def list_scans(
    skip: int = 0,
    limit: int = 100,
    status_filter: Optional[str] = Query(None, alias="status"),
    target_id: Optional[int] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    List all scans for current user
    """
    query = db.query(Scan).filter(Scan.user_id == current_user.id)
    
    if status_filter:
        query = query.filter(Scan.status == status_filter)
    
    if target_id:
        query = query.filter(Scan.target_id == target_id)
    
    scans = query.order_by(desc(Scan.created_at)).offset(skip).limit(limit).all()
    
    # Add target information
    result = []
    for scan in scans:
        target = db.query(Target).filter(Target.id == scan.target_id).first()
        scan_dict = {
            **scan.__dict__,
            "target_domain": target.domain if target else None,
            "target_name": target.name if target else None,
            "duration": scan.duration
        }
        result.append(scan_dict)
    
    return result


@router.post("/", response_model=ScanSchema, status_code=status.HTTP_201_CREATED)
async def create_scan(
    scan_in: ScanCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Create and start a new scan
    """
    # Verify target exists and belongs to user
    target = db.query(Target).filter(
        Target.id == scan_in.target_id,
        Target.user_id == current_user.id
    ).first()
    
    if not target:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Target not found"
        )
    
    # Create scan
    scan = Scan(
        name=scan_in.name,
        mode=scan_in.mode,
        config=scan_in.config,
        tools_enabled=scan_in.tools_enabled,
        target_id=scan_in.target_id,
        user_id=current_user.id,
        status=ScanStatus.QUEUED
    )
    
    db.add(scan)
    db.commit()
    db.refresh(scan)
    
    # Queue the scan task
    task = execute_scan.delay(scan.id)
    scan.celery_task_id = task.id
    db.commit()
    db.refresh(scan)
    
    return scan


@router.get("/{scan_id}", response_model=ScanWithDetails)
async def get_scan(
    scan_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get a specific scan
    """
    scan = db.query(Scan).filter(
        Scan.id == scan_id,
        Scan.user_id == current_user.id
    ).first()
    
    if not scan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Scan not found"
        )
    
    target = db.query(Target).filter(Target.id == scan.target_id).first()
    
    return {
        **scan.__dict__,
        "target_domain": target.domain if target else None,
        "target_name": target.name if target else None,
        "duration": scan.duration
    }


@router.put("/{scan_id}", response_model=ScanSchema)
async def update_scan(
    scan_id: int,
    scan_in: ScanUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Update a scan
    """
    scan = db.query(Scan).filter(
        Scan.id == scan_id,
        Scan.user_id == current_user.id
    ).first()
    
    if not scan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Scan not found"
        )
    
    # Update fields
    update_data = scan_in.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(scan, field, value)
    
    db.commit()
    db.refresh(scan)
    
    return scan


@router.delete("/{scan_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_scan(
    scan_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Delete a scan
    """
    scan = db.query(Scan).filter(
        Scan.id == scan_id,
        Scan.user_id == current_user.id
    ).first()
    
    if not scan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Scan not found"
        )
    
    # Cancel if running
    if scan.status in [ScanStatus.QUEUED, ScanStatus.RUNNING]:
        # TODO: Cancel Celery task
        pass
    
    db.delete(scan)
    db.commit()
    
    return None


@router.get("/{scan_id}/vulnerabilities", response_model=List[VulnSchema])
async def get_scan_vulnerabilities(
    scan_id: int,
    skip: int = 0,
    limit: int = 100,
    severity: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get vulnerabilities for a scan
    """
    # Verify scan belongs to user
    scan = db.query(Scan).filter(
        Scan.id == scan_id,
        Scan.user_id == current_user.id
    ).first()
    
    if not scan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Scan not found"
        )
    
    query = db.query(Vulnerability).filter(Vulnerability.scan_id == scan_id)
    
    if severity:
        query = query.filter(Vulnerability.severity == severity)
    
    vulnerabilities = query.offset(skip).limit(limit).all()
    
    return vulnerabilities


@router.get("/{scan_id}/results", response_model=List[ResultSchema])
async def get_scan_results(
    scan_id: int,
    skip: int = 0,
    limit: int = 100,
    result_type: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get results for a scan
    """
    # Verify scan belongs to user
    scan = db.query(Scan).filter(
        Scan.id == scan_id,
        Scan.user_id == current_user.id
    ).first()
    
    if not scan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Scan not found"
        )
    
    query = db.query(ScanResult).filter(ScanResult.scan_id == scan_id)
    
    if result_type:
        query = query.filter(ScanResult.result_type == result_type)
    
    results = query.offset(skip).limit(limit).all()
    
    return results


@router.post("/{scan_id}/cancel")
async def cancel_scan(
    scan_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Cancel a running scan
    """
    scan = db.query(Scan).filter(
        Scan.id == scan_id,
        Scan.user_id == current_user.id
    ).first()
    
    if not scan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Scan not found"
        )
    
    if scan.status not in [ScanStatus.QUEUED, ScanStatus.RUNNING]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Scan is not running"
        )
    
    # TODO: Cancel Celery task
    # from app.tasks.celery_app import celery_app
    # celery_app.control.revoke(scan.celery_task_id, terminate=True)
    
    scan.status = ScanStatus.CANCELLED
    db.commit()
    
    return {"message": "Scan cancelled successfully"}
