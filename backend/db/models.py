from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from .database import Base
import datetime
from pydantic import BaseModel

class Server(Base):
    __tablename__ = "servers"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    ip_address = Column(String, unique=True)
    location = Column(String)
    tag = Column(String)           
    provider = Column(String)
    usage_stats = relationship("UsageStat", back_populates="server")
    alerts = relationship("Alert", back_populates="server")


class UsageStat(Base):
    __tablename__ = "usage_stats"
    id = Column(Integer, primary_key=True, index=True)
    server_id = Column(Integer, ForeignKey("servers.id"))
    cpu_usage = Column(Float)
    ram_usage = Column(Float)
    disk_usage = Column(Float)
    app_usage = Column(Float)
    network_incoming = Column(Float)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)

    server = relationship("Server", back_populates="usage_stats")


class Alert(Base):
    __tablename__ = "alerts"
    id = Column(Integer, primary_key=True, index=True)
    server_id = Column(Integer, ForeignKey("servers.id"))
    severity = Column(String)  # critical, medium, low
    message = Column(String)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)

    server = relationship("Server", back_populates="alerts")
