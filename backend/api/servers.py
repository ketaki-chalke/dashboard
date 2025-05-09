from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from db import models
from db.schemas import ServerOut
from db.database import SessionLocal
from fastapi import HTTPException

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/servers", response_model=list[ServerOut])
def get_servers(db: Session = Depends(get_db)):
    try:
        servers = db.query(models.Server).all()
        print(f"Fetched {len(servers)} servers")
        return servers
    except Exception as e:
        print(f"❌ Error fetching servers: {e}")
        raise HTTPException(status_code=500, detail=str(e))

