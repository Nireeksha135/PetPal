from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from server.config import get_settings
from server.database.base import Base
import server.models.init as models  # noqa: F401

settings = get_settings()

connect_args = {}
if settings.DATABASE_URL.startswith("sqlite"):
    connect_args["check_same_thread"] = False

engine = create_engine(
    settings.DATABASE_URL,
    pool_pre_ping=True,
    future=True,
    connect_args=connect_args,
)

# Ensure tables exist for local development and simple dev startup.
Base.metadata.create_all(bind=engine)

SessionLocal = sessionmaker(
    autocommit=False, autoflush=False, bind=engine, future=True
)


def get_db() -> Session:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
