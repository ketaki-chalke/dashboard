from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from db import models
from db.schemas import UsageStatOut
from db.database import SessionLocal

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/usage", response_model=list[UsageStatOut])  # Response model is UsageStatOut
def get_usage_stats(db: Session = Depends(get_db)):
    usage_stats = db.query(models.UsageStat).all()  # Query all usage stats
    return usage_stats
