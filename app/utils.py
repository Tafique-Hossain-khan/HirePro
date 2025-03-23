
import random
from app.database import SessionLocal

#Hahsing the password
from passlib.context import CryptContext
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash(password:str):
    hash_password = pwd_context.hash(password)
    return hash_password

def verify(plain_password,hash_password):
    return pwd_context.verify(plain_password,hash_password)


def generate_unique_job_id():
    from app.models import Job
    session = SessionLocal()
    while True:
        job_id = random.randint(100000, 999999)
        if not session.query(Job).filter_by(job_id=job_id).first():
            return job_id
