
from fastapi import APIRouter,HTTPException ,Depends,status,Response
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from app.database import get_db
from app.oauth2 import get_current_user  
import os

from app.models import User, Skill, Language, WorkExperience, Project, Certification
from app.schemas import UserModel, UserResponseModel,UserUpdateModel
from .. import schemas
from ..oauth2 import create_access_token
from app.schemas import WorkExperienceModel, ProjectModel, CertificationModel

from app.job_recommendation import get_user_profile, get_all_jobs, compute_similarity

from pinecone import Pinecone
import numpy as np
from langchain_google_genai import GoogleGenerativeAIEmbeddings


#setting up vector db
API_KEY = os.getenv("GEMINI_API_KEY")
PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")

# Ensure API key is not None
if not PINECONE_API_KEY:
    raise ValueError("PINECONE_API_KEY is not set!")

if not API_KEY:
    raise ValueError("GEMINI_API_KEY is not set!")


# Initialize Pinecone client
pc = Pinecone(api_key=PINECONE_API_KEY)
# Name of your Pinecone index
INDEX_NAME = "candidate-search"
index = pc.Index(name=INDEX_NAME)

# Check if the index exists; if not, create it
if INDEX_NAME not in [index_info.name for index_info in pc.list_indexes()]:  
    pc.create_index(name=INDEX_NAME, dimension=768, metric="cosine")


# Initialize Google Generative AI Embeddings
embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001", google_api_key=API_KEY)
print(f"Successfully connected to Pinecone index: {INDEX_NAME}")


router = APIRouter(
    prefix='/user'
)

# -------------------------- user regristration ------------------------------------------------
@router.post("/register",status_code=status.HTTP_201_CREATED)
def register_user(user: UserModel, db: Session = Depends(get_db)):
    
    # Check if user already exists
    """
    Register a new user

    Args:
        user (UserModel): User registration details

    Returns:
        UserResponseModel: Registered user details
    """
    try:


        existing_user = db.query(User).filter(User.email == user.email).first()
        if existing_user:
            raise HTTPException(status_code=400, detail="Email already registered")
        # hash_password = hash(user.password)
        # user.password = hash_password
        # Create new user
        new_user = User(
            email=user.email,
            name=user.name,
            password=user.password,  
            location=user.location,
            bio=user.bio
        )
        # Generate vector embedding of the bio
        bio_embedding = embeddings.embed_documents([user.bio])[0]  # Get the first embedding


        db.add(new_user)
        db.commit()
        db.refresh(new_user)

        # Store in Pinecone
        index.upsert([
        (str(new_user.id), bio_embedding, { "email": new_user.email, "name": new_user.name})
        ])

        # Add skills
        for skill in user.skills:
            skill_entry = db.query(Skill).filter(Skill.skill_name == skill).first()
            if not skill_entry:
                skill_entry = Skill(skill_name=skill)
                db.add(skill_entry)
                db.commit()
            new_user.skills.append(skill_entry)

        # Add languages
        for lang in user.languages:
            language_entry = db.query(Language).filter(Language.language_name == lang).first()
            if not language_entry:
                language_entry = Language(language_name=lang)
                db.add(language_entry)
                db.commit()
            new_user.languages.append(language_entry)

        # Add experiences
        for exp in user.experiences:
            experience = WorkExperience(
                user_id=new_user.id,
                company=exp.company,
                position=exp.position,
                location=exp.location,
                start_date=exp.start_date,
                end_date=exp.end_date,
                currently_working=exp.currently_working,
                description=exp.description
            )
            db.add(experience)

        # Add projects
        for proj in user.projects:
            project = Project(
                user_id=new_user.id,
                project_name=proj.project_name,
                project_description=proj.project_description,
                project_link=proj.project_link
            )
            db.add(project)

        # Add certifications
        for cert in user.certifications:
            certification = Certification(
                user_id=new_user.id,
                certification_name=cert.certification_name,
                certification_provider=cert.certification_provider,
                certificate_link=cert.certificate_link
            )
            db.add(certification)

        db.commit()

        print(new_user)
        print(user)
        skills=[skill.skill_name for skill in new_user.skills]
        languages=[language.language_name for language in new_user.languages]
        print(languages)
        print(skills)

        return {"message": "User registered successfully"}, status.HTTP_201_CREATED

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

#------------------------ Login -----------------------------------

@router.get("/login")
def login(user_credentials: schemas.UserLogin, response: Response, db: Session = Depends(get_db)):
    try:
        user = db.query(User).filter(
            User.email == user_credentials.email).first()  # Fetch user from database
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        

        if  user_credentials.password != user.password:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN, detail="Invalid Credentials")

        # Generate JWT token
        access_token = create_access_token(data={"user_id": user.id})

        # Store token in HTTP-only cookie
        response.set_cookie(
            key="access_token",
            value=access_token,
            httponly=True,  # Prevents JavaScript access (XSS protection)
            secure=True,  # Use only with HTTPS in production
            samesite="Lax"  # Helps prevent CSRF attacks
        )

        return {"message": "Login successful"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

#------------------------ view the full profile --------------------------------------------------
@router.get("/profile", response_model=UserResponseModel)
def view_user_profile(
    db: Session = Depends(get_db),  
    current_user: User = Depends(get_current_user)  # Authenticated user
):
    """
    - Allows a logged-in user to view their own profile.
    """
    user = db.query(User).filter(User.id == current_user.id).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return UserResponseModel(
        id=user.id,
        email=user.email,
        name=user.name,
        location=user.location,
        bio=user.bio,
        skills=[skill.skill_name for skill in user.skills],
        languages=[language.language_name for language in user.languages],
        experiences=[WorkExperienceModel(**exp.__dict__) for exp in user.experiences],  
    projects=[ProjectModel(**proj.__dict__) for proj in user.projects],
    certifications=[CertificationModel(**cert.__dict__) for cert in user.certifications]  # Convert to dict
    )

#------------Recommedation system -------------


@router.get("/jobs")
def recommend_jobs(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    user_profile = get_user_profile(user.id, db)
    
    # Ensure user profile exists
    if not user_profile:
        return JSONResponse(status_code=404, content={"message": "User profile not found"})

    # Ensure user profile has required fields
    if not any([user_profile.get("skills"), user_profile.get("experience"), user_profile.get("projects")]):
        return JSONResponse(status_code=400, content={"message": "User profile is incomplete for recommendations"})

    jobs = get_all_jobs(db)

    # Ensure job list is not empty
    if not jobs:
        return JSONResponse(status_code=404, content={"message": "No job postings found"})

    try:
        recommended_jobs = compute_similarity(user_profile, jobs)
        return {"recommended_jobs": recommended_jobs}  # Return top 10 jobs
    except Exception as e:
        return JSONResponse(status_code=500, content={"message": "Error computing recommendations", "error": str(e)})







    