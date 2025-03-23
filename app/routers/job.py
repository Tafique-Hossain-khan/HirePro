from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app import models, schemas, oauth2
from app.database import get_db
from app.ranking_system import calculate_similarity, get_user_profile_text, get_job_description_text

router = APIRouter(prefix="/jobs", tags=["Jobs"])

# ✅ Public: View all jobs
@router.get("/")
def get_jobs(db: Session = Depends(get_db)):
    jobs = db.query(models.Job).all()
    return jobs

# Private: Apply for a job
@router.post("/apply/{job_id}")
def apply_for_job(job_id: int, user=Depends(oauth2.get_current_user), db: Session = Depends(get_db)):
    # Check if job exists
    job = db.query(models.Job).filter(models.Job.job_id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    # Check if user already applied
    existing_application = (
        db.query(models.JobApplication)
        .filter(models.JobApplication.user_id == user.id, models.JobApplication.job_id == job.job_id)
        .first()
    )
    if existing_application:
        raise HTTPException(status_code=400, detail="Already applied for this job")

    # Generate profile and job description text
    user_text = get_user_profile_text(user, db)
    job_text = get_job_description_text(job)

    # Compute similarity score
    similarity_score = float(calculate_similarity(user_text, job_text))  


    # Create new application with ranking score
    new_application = models.JobApplication(
        user_id=user.id,
        job_id=job.job_id,
        match_score=similarity_score  # Store similarity score in DB
    )

    db.add(new_application)
    db.commit()
    db.refresh(new_application)

    return {
        "message": "Job application submitted successfully",
        "matching_score": round(similarity_score * 100, 2)  # Convert to percentage
    }




