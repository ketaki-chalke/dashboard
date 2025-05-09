from faker import Faker
from random import choice, uniform, randint
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from .database import SessionLocal
from . import models

fake = Faker()
db: Session = SessionLocal()

def create_servers(n=5):
    for _ in range(n):
        server = models.Server(
            name=fake.hostname(),
            ip_address=fake.ipv4(),
            location=fake.city(),  # Added location
            tag=choice(["Production", "Staging", "Test"]),
            provider=choice(["AWS", "Azure", "GCP"]),
        )
        db.add(server)
    db.commit()

def create_usage_stats():
    servers = db.query(models.Server).all()
    for server in servers:
        for i in range(10):  # 10 records per server
            stat = models.UsageStat(
                cpu_usage=round(uniform(10.0, 95.0), 2),
                ram_usage=round(uniform(10.0, 90.0), 2),
                disk_usage=round(uniform(30.0, 99.0), 2),
                app_usage=round(uniform(5.0, 85.0), 2),
                network_incoming=round(uniform(0.1, 1000.0), 2),
                timestamp=datetime.utcnow() - timedelta(hours=i),
                server_id=server.id,
            )
            db.add(stat)
    db.commit()

def create_alerts():
    servers = db.query(models.Server).all()
    for server in servers:
        for _ in range(randint(3, 7)):
            alert = models.Alert(
                severity=choice(["low", "medium", "critical"]),
                message=fake.sentence(),
                timestamp=datetime.utcnow() - timedelta(minutes=randint(1, 500)),
                server_id=server.id,
            )
            db.add(alert)
    db.commit()

if __name__ == "__main__":
    create_servers()
    create_usage_stats()
    create_alerts()
    print("✅ Mock data generated!")
