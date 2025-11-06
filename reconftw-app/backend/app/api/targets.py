"""
Targets API endpoints
"""
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.models.target import Target
from app.models.scan import Scan
from app.models.vulnerability import Vulnerability
from app.schemas.target import Target as TargetSchema, TargetCreate, TargetUpdate, TargetWithStats

router = APIRouter()


@router.get("/", response_model=List[TargetWithStats])
async def list_targets(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    List all targets for current user
    """
    # Get targets with statistics
    targets = db.query(Target).filter(Target.user_id == current_user.id).offset(skip).limit(limit).all()
    
    result = []
    for target in targets:
        # Get statistics
        total_scans = db.query(func.count(Scan.id)).filter(Scan.target_id == target.id).scalar()
        last_scan = db.query(Scan).filter(Scan.target_id == target.id).order_by(Scan.created_at.desc()).first()
        total_vulns = db.query(func.count(Vulnerability.id)).join(Scan).filter(Scan.target_id == target.id).scalar()
        total_subdomains = db.query(func.sum(Scan.subdomains_count)).filter(Scan.target_id == target.id).scalar() or 0
        
        target_dict = {
            **target.__dict__,
            "total_scans": total_scans,
            "last_scan_date": last_scan.created_at if last_scan else None,
            "total_vulnerabilities": total_vulns,
            "total_subdomains": total_subdomains
        }
        result.append(target_dict)
    
    return result


@router.post("/", response_model=TargetSchema, status_code=status.HTTP_201_CREATED)
async def create_target(
    target_in: TargetCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Create a new target
    """
    # Check if domain already exists for this user
    existing = db.query(Target).filter(
        Target.domain == target_in.domain,
        Target.user_id == current_user.id
    ).first()
    
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Target with this domain already exists"
        )
    
    target = Target(
        **target_in.dict(),
        user_id=current_user.id
    )
    
    db.add(target)
    db.commit()
    db.refresh(target)
    
    return target


@router.get("/{target_id}", response_model=TargetWithStats)
async def get_target(
    target_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get a specific target
    """
    target = db.query(Target).filter(
        Target.id == target_id,
        Target.user_id == current_user.id
    ).first()
    
    if not target:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Target not found"
        )
    
    # Get statistics
    total_scans = db.query(func.count(Scan.id)).filter(Scan.target_id == target.id).scalar()
    last_scan = db.query(Scan).filter(Scan.target_id == target.id).order_by(Scan.created_at.desc()).first()
    total_vulns = db.query(func.count(Vulnerability.id)).join(Scan).filter(Scan.target_id == target.id).scalar()
    total_subdomains = db.query(func.sum(Scan.subdomains_count)).filter(Scan.target_id == target.id).scalar() or 0
    
    return {
        **target.__dict__,
        "total_scans": total_scans,
        "last_scan_date": last_scan.created_at if last_scan else None,
        "total_vulnerabilities": total_vulns,
        "total_subdomains": total_subdomains
    }


@router.put("/{target_id}", response_model=TargetSchema)
async def update_target(
    target_id: int,
    target_in: TargetUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Update a target
    """
    target = db.query(Target).filter(
        Target.id == target_id,
        Target.user_id == current_user.id
    ).first()
    
    if not target:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Target not found"
        )
    
    # Update fields
    update_data = target_in.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(target, field, value)
    
    db.commit()
    db.refresh(target)
    
    return target


@router.delete("/{target_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_target(
    target_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Delete a target
    """
    target = db.query(Target).filter(
        Target.id == target_id,
        Target.user_id == current_user.id
    ).first()
    
    if not target:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Target not found"
        )
    
    db.delete(target)
    db.commit()
    
    return None
