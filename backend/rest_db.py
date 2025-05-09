from db.database import engine
from db import models

# Drop all existing tables
models.Base.metadata.drop_all(bind=engine)

# Recreate all tables with updated schema
models.Base.metadata.create_all(bind=engine)

print("✅ Database reset: All tables dropped and recreated.")
