"""
Main FastAPI application
"""
import logging
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.database import get_db, init_db
from app.core.security import get_password_hash
from app.models.user import User, UserRole
from app.api import auth, targets, scans

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description=settings.DESCRIPTION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup_event():
    """Initialize database and create default admin user"""
    logger.info("Starting up application...")
    
    # Initialize database
    init_db()
    
    # Create default admin user if not exists
    from app.core.database import SessionLocal
    db = SessionLocal()
    try:
        admin_user = db.query(User).filter(User.username == settings.FIRST_SUPERUSER_USERNAME).first()
        if not admin_user:
            admin_user = User(
                username=settings.FIRST_SUPERUSER_USERNAME,
                email=settings.FIRST_SUPERUSER_EMAIL,
                hashed_password=get_password_hash(settings.FIRST_SUPERUSER_PASSWORD),
                full_name="Administrator",
                role=UserRole.ADMIN,
                is_superuser=True,
                is_active=True
            )
            db.add(admin_user)
            db.commit()
            logger.info(f"Created default admin user: {settings.FIRST_SUPERUSER_USERNAME}")
        else:
            logger.info("Admin user already exists")
    except Exception as e:
        logger.error(f"Error creating admin user: {str(e)}")
    finally:
        db.close()
    
    logger.info("Application started successfully")


@app.on_event("shutdown")
async def shutdown_event():
    """Cleanup on shutdown"""
    logger.info("Shutting down application...")


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "name": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "description": settings.DESCRIPTION,
        "docs": f"{settings.API_V1_STR}/docs"
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}


@app.get(f"{settings.API_V1_STR}/health")
async def api_health_check(db: Session = Depends(get_db)):
    """API health check with database connectivity"""
    try:
        # Test database connection
        db.execute("SELECT 1")
        return {
            "status": "healthy",
            "database": "connected"
        }
    except Exception as e:
        return JSONResponse(
            status_code=503,
            content={
                "status": "unhealthy",
                "database": "disconnected",
                "error": str(e)
            }
        )


# Include API routers
app.include_router(
    auth.router,
    prefix=f"{settings.API_V1_STR}/auth",
    tags=["authentication"]
)

app.include_router(
    targets.router,
    prefix=f"{settings.API_V1_STR}/targets",
    tags=["targets"]
)

app.include_router(
    scans.router,
    prefix=f"{settings.API_V1_STR}/scans",
    tags=["scans"]
)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
