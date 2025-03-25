from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app import models, schemas, oauth2
from app.database import get_db
from app.ranking_system import calculate_similarity, get_user_profile_text, get_job_description_text

router = APIRouter(prefix="/jobs", tags=["Jobs"])





