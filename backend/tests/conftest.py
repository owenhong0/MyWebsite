import pytest
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from app.database import Base
from app.models import *  # All your models


@pytest.fixture(scope="session")
def engine():
    """In-memory SQLite for tests - FASTEST option."""
    engine = create_engine("sqlite:///:memory:", echo=False)
    Base.metadata.create_all(engine)
    yield engine
    Base.metadata.drop_all(engine)


@pytest.fixture(scope="function")
def db_session(engine):
    """Fresh DB session per test - auto rollback."""
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    session = SessionLocal()

    try:
        yield session
        session.rollback()
    finally:
        session.close()

@pytest.fixture(scope="function")
def fresh_db(db_session):
    """Guaranteed fresh DB per test"""
    db_session.execute(text("DELETE FROM dishes"))  # Clear table
    yield db_session