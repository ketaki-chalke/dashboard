from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from db import models
from db.schemas import AlertOut
from db.database import SessionLocal

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/alerts", response_model=list[AlertOut])
def get_alerts(db: Session = Depends(get_db)):
    try:
        print("Running query...")
        alerts = db.query(models.Alert).all()
        print("Query done.")
        return alerts
    except Exception as e:
        print("Exception:", e)
        return []
