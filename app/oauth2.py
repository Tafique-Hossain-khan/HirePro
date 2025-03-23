import jwt
from datetime import datetime, timedelta, timezone

from . import models, schemas
from jwt.exceptions import PyJWTError
from jwt import ExpiredSignatureError, InvalidTokenError  # Add this
from fastapi import Depends, status, HTTPException, Request
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
#from .config import settings
from . import database
from app.config import settings
from app.schemas import TokenData 
from app.database import get_db

oauth2_scheme_user = OAuth2PasswordBearer(tokenUrl='/user/login')
oauth2_scheme_hr = OAuth2PasswordBearer(tokenUrl='/hr/login')

SECRET_KEY = settings.secret_key
ALGORITHM = settings.algorithm
ACCESS_TOKEN_EXPIRE_MINUTES = settings.access_token_expire_minutes 

def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def verify_access_token(token: str, credentials_exception):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])

        user_id = payload.get("user_id")
        hr_id = payload.get("hr_id")

        if user_id:
            return TokenData(id=user_id)
        elif hr_id:
            return TokenData(id=hr_id)
        else:
            raise credentials_exception

    except ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
    except PyJWTError:
        raise credentials_exception



def get_user_from_token(token: str, db: Session, role: str):
    credentials_exception = HTTPException(status_code=401, detail="Invalid token")
    token_data = verify_access_token(token, credentials_exception)

    if role == "user":
        user = db.query(models.User).filter(models.User.id == token_data.id).first()
        if not user:
            raise credentials_exception
        return user

    elif role == "hr":
        hr = db.query(models.HR).filter(models.HR.id == token_data.id).first()
        if not hr:
            raise credentials_exception
        return hr

    raise credentials_exception


def get_current_user(request: Request, db: Session = Depends(get_db)):
    token = request.cookies.get("access_token")
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    return get_user_from_token(token, db, "user")


def get_current_hr(request: Request, db: Session = Depends(get_db)):

    token = request.cookies.get("access_token")
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    return get_user_from_token(token, db, "hr")
