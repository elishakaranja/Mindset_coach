from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Database URL - Note the port is 5433
SQLALCHEMY_DATABASE_URL = "postgresql://coach_user:changeme@localhost:5433/mindset_coach_db"

# SQLAlchemy engine
engine = create_engine(SQLALCHEMY_DATABASE_URL)

# Session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for our models
Base = declarative_base()
