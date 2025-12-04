import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Database URL - reads from environment variable
# Why: Production (Render) will set DATABASE_URL automatically
# Fallback: Use local PostgreSQL for development
SQLALCHEMY_DATABASE_URL = os.getenv(
    "DATABASE_URL",
    # Local development database - port 5433
    "postgresql://coach_user:changeme@localhost:5433/mindset_coach_db"
)

# SQLAlchemy engine
# Why: create_engine connects to the database
engine = create_engine(SQLALCHEMY_DATABASE_URL)

# Session factory
# Why: SessionLocal() creates new database sessions for each request
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for our models
# Why: All database models (User, Conversation, Message) inherit from this
Base = declarative_base()
