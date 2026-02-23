import os

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Only load .env for app runtime, not Alembic
if "ALEMBIC_CONFIG" not in os.environ:
    from dotenv import load_dotenv
    load_dotenv()

DATABASE_URL = "postgresql+psycopg2://user:password@localhost:5432/myWebsiteDB"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()