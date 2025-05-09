from fastapi import FastAPI
from api import alerts, usage, servers
from db.database import engine
from db import models
from fastapi.middleware.cors import CORSMiddleware

# Create the FastAPI app instance
app = FastAPI()

# ✅ Apply CORS middleware right after app initialization
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For local dev only
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Then initialize DB and routers
models.Base.metadata.create_all(bind=engine)

app.include_router(alerts.router, prefix="/alerts", tags=["alerts"])
app.include_router(usage.router, prefix="/usage", tags=["usage"])
app.include_router(servers.router, prefix="/servers", tags=["servers"])
