
from fastapi import APIRouter,HTTPException ,Depends,Response,status
from app.models import HR,Job,JobApplication,User
from sqlalchemy.orm import Session
from app.schemas import HrModel,HrLogin,HrResponseModel,JobCreate
from app.database import get_db
from app.oauth2 import create_access_token,get_current_hr
from pinecone import Pinecone


from app.models import User
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from sklearn.metrics.pairwise import cosine_similarity
import os
from dotenv import load_dotenv

# Load API key from .env file
load_dotenv()
API_KEY = os.getenv("GEMINI_API_KEY")
PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")


router = APIRouter(
    prefix='/hr'
)


@router.post("/register", status_code=status.HTTP_201_CREATED)
def register_hr(hr: HrModel, db: Session = Depends(get_db)):

    try:
        existing_hr = db.query(HR).filter(HR.email == hr.email).first()
        if existing_hr:
            raise HTTPException(status_code=400, detail="Email already registered")
        
        #hash_password = hash(hr.password)  # Ensure proper hashing
        
        new_hr = HR(
            email=hr.email,
            name=hr.name,
            password=hr.password,
            company=hr.company,
            
        )

        db.add(new_hr)
        db.commit()
        db.refresh(new_hr)

        return {"message": "HR registered successfully"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"An error occurred: {str(e)}")

@router.get("/login")
def hr_login(hr_credentials: HrLogin, response: Response, db: Session = Depends(get_db)):
    try:
        # Fetch HR from the database
        hr = db.query(HR).filter(HR.email == hr_credentials.email).first()
        
        # Check if HR exists
        if not hr:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="HR not found"
            )

        # Verify password
        if hr_credentials.password != hr.password:  # Consider hashing passwords before storing!
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Invalid credentials"
            )

        # Generate JWT token
        access_token = create_access_token(data={"hr_id": hr.id})

        # Store token in HTTP-only cookie
        response.set_cookie(
            key="access_token",
            value=access_token,
            httponly=True,  # Prevents JavaScript access (XSS protection)
            secure=True,  # Use only with HTTPS in production
            samesite="Lax"  # Helps prevent CSRF attacks
        )

        return {"message": "HR login successful"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/profile", response_model=HrResponseModel)
def view_hr_profile(
    db: Session = Depends(get_db),
    current_hr: HR = Depends(get_current_hr)  # Authenticated HR
):
    """
    - Allows a logged-in HR to view their own profile.
    """
    hr = db.query(HR).filter(HR.id == current_hr.id).first()

    if not hr:
        raise HTTPException(status_code=404, detail="HR not found")

    return HrResponseModel(
        id=hr.id,
        name=hr.name,
        email=hr.email,
        company=hr.company
    )


@router.post("/post-job", status_code=status.HTTP_201_CREATED)
def post_job(job_data: JobCreate, db: Session = Depends(get_db), current_hr: HR = Depends(get_current_hr)):
    """
    - Allows authenticated HRs to post jobs.
    - Requires a valid access token.
    """

    # Create a new job entry
    new_job = Job(
        title=job_data.title,
        company_name=current_hr.company,  # Auto-fill from HR details
        work_type=job_data.work_type,
        location=job_data.location,
        job_type=job_data.job_type,
        description=job_data.description,
        hr_id=current_hr.id  # Link job to the logged-in HR
    )

    db.add(new_job)
    db.commit()
    db.refresh(new_job)

    return {"message": "Job posted successfully"}


@router.get("/dashboard")
def get_hr_jobs(current_hr: HR = Depends(get_current_hr), db: Session = Depends(get_db)):
    """
    Fetch all job listings posted by the authenticated HR.
    """
    jobs = db.query(Job).filter(Job.hr_id == current_hr.id).all()

    if not jobs:
        raise HTTPException(status_code=404, detail="No jobs found for this HR")

    return {"hr_email": current_hr.email, "jobs": jobs}


# view the job applications for individual jobs
@router.get("/jobs/{job_id}/applicants")
def get_job_applicants(
    job_id: int,
    hr=Depends(get_current_hr),  # Ensure only HRs can access this
    db: Session = Depends(get_db)
):
    # Fetch job using `job_id` (not `id`) to check ownership
    job = db.query(Job).filter(Job.job_id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    # Ensure the HR owns this job
    if job.hr_id != hr.id:
        raise HTTPException(status_code=403, detail="You are not authorized to view applicants for this job")

    # Fetch applicants for this job
    applications = (
    db.query(JobApplication)
    .join(User, JobApplication.user_id == User.id)
    .filter(JobApplication.job_id == job.job_id)  # Use job.job_id instead of job.id
    .all()
    )


    
    # Format response
    return [
        {
            "user_id": app.user.id,
            "name": app.user.name,
            "email": app.user.email,
            "applied_at": app.applied_at
        }
        for app in applications
        
    ]


# view user profile from hr side

@router.get("/user-profile/{user_id}")
def get_user_profile(user_id: int, db: Session = Depends(get_db)):
    """
    Fetch the complete profile of a user by their user_id.
    """
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return {
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "location": user.location,
        "bio": user.bio,
        "skills": [skill.skill_name for skill in user.skills],
        "languages": [lang.language_name for lang in user.languages],
        "experiences": [
            {
                "company": exp.company,
                "position": exp.position,
                "location": exp.location,
                "start_date": exp.start_date,
                "end_date": exp.end_date,
                "currently_working": exp.currently_working,
                "description": exp.description,
            }
            for exp in user.experiences
        ],
        "projects": [
            {
                "name": proj.project_name,
                "description": proj.project_description,
                "link": proj.project_link,
            }
            for proj in user.projects
        ],
        "certifications": [
            {
                "name": cert.certification_name,
                "provider": cert.certification_provider,
                "certificate_link": cert.certificate_link,
            }
            for cert in user.certifications
        ],
    }





# Initialize Google Generative AI Embeddings
embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001", google_api_key=API_KEY)
pc = Pinecone(api_key=PINECONE_API_KEY)
index = pc.Index("candidate-search")

@router.get("/search")
def search_users(query: str):
    """
    Search users based on HR's query using similarity search from Pinecone.
    Returns all matching users.
    """
    try:
        # Generate embedding for the query
        query_embedding = embeddings.embed_query(query)

        # Query Pinecone for all relevant users (no limit)
        search_results = index.query(
            vector=query_embedding,
            top_k=10000,  # Set a very high number to return all matches
            include_metadata=True
        )

        if not search_results["matches"]:
            raise HTTPException(status_code=404, detail="No matching users found.")

        # Format response
        all_matches = [
            {
                "user_id": match["id"],
                "email": match["metadata"]["email"],
                "name": match["metadata"]["name"],
                "score": round(match["score"], 4),
            }
            for match in search_results["matches"]
        ]

        return {"query": query, "matches": all_matches}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

