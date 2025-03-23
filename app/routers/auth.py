from fastapi import APIRouter,Depends,HTTPException,status
from fastapi.security.oauth2 import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session 
from typing import Annotated
from ..database import get_db

from app.models import User
from ..utils import verify
from ..oauth2 import create_access_token
from .. import schemas

router = APIRouter(tags=['Authentication'])

@router.get("/login", response_model=schemas.Token)
def login(user_credentials: schemas.UserLogin, db: Session = Depends(get_db)):

    user = db.query(User).filter(
        User.email == user_credentials.email).first() #from database
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail=f"Invalid Credentials")

    # if not verify(user_credentials.password, user.password):
    #     raise HTTPException(
    #         status_code=status.HTTP_403_FORBIDDEN, detail=f"Invalid Credentials")
    #skip the hashing for now 
    if not user_credentials.password == user.password:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail=f"Invalid Credentials")

    access_token = create_access_token(data={"user_id": user.id})

    return {"access_token": access_token, "token_type": "bearer"}
