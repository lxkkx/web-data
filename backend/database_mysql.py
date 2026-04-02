"""
Database configuration and session management.
Now configured for MySQL (XAMPP).
"""
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

# MySQL database connection string for XAMPP (Localhost)
# Format: mysql+pymysql://user:password@host/dbname
DATABASE_URL = "mysql+pymysql://root:@localhost/taskmate_db"

# Create engine for MySQL
engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    """Dependency that provides a database session."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
