from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from dotenv import load_dotenv
load_dotenv()
import os


from app.config import settings

DATABASE_URL = f"postgresql://{settings.database_username}:{settings.database_password}@{settings.database_hostname}:{settings.database_port}/{settings.database_name}"

#DATABASE_URL = os.getenv("DATABASE_URL")


engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False,autoflush=False,bind=engine) #responsible for talking to the database  
Base = declarative_base()

# Function to create tables (only once, or you can use Alembic for migrations)
# def create_tables():
#     Base.metadata.create_all(bind=engine)
def get_db():
    """ 
    This function allow to access the database when the url hit and then close
    """
    db = SessionLocal() 
    try:
        yield db
    finally:
        db.close()