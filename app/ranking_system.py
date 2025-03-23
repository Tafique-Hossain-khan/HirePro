from app.database import get_db
from sqlalchemy.orm import Session
from fastapi import Depends
from app.models import User, Job


# user profile
def get_user_profile_text(user: User, db: Session = Depends(get_db)) -> str:
    """Generate a text representation of the user's profile."""
    
    # Fetch user details
    skills = ", ".join([skill.skill_name for skill in user.skills]) if user.skills else ""
    experiences = ". ".join([exp.description for exp in user.experiences if exp.description]) if user.experiences else ""
    projects = ". ".join([f"{proj.project_name}: {proj.project_description}" for proj in user.projects if proj.project_description]) if user.projects else ""
    certifications = ", ".join([cert.certification_name for cert in user.certifications]) if user.certifications else ""

    # Combine all information
    user_text = f"Skills: {skills}. Experience: {experiences}. Projects: {projects}. Certifications: {certifications}."

    return user_text

def get_job_description_text(job: Job) -> str:
    """Generate a text representation of the job description."""
    
    return f"Title: {job.title}. Description: {job.description}"


from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

def calculate_similarity(user_text: str, job_text: str) -> float:
    """Calculate the similarity score between user profile and job description."""
    
    vectorizer = TfidfVectorizer()
    
    # Transform both texts into vectors
    tfidf_matrix = vectorizer.fit_transform([user_text, job_text])
    
    # Compute cosine similarity
    similarity = cosine_similarity(tfidf_matrix[0], tfidf_matrix[1])
    
    return similarity[0][0]  # Extract the similarity score


# @router.post("/apply/{job_id}")
# def apply_for_job(job_id: int, user=Depends(oauth2.get_current_user), db: Session = Depends(get_db)):
#     # Check if job exists
#     job = db.query(models.Job).filter(models.Job.job_id == job_id).first()
#     if not job:
#         raise HTTPException(status_code=404, detail="Job not found")

#     # Check if user already applied
#     existing_application = (
#         db.query(models.JobApplication)
#         .filter(models.JobApplication.user_id == user.id, models.JobApplication.job_id == job.id)
#         .first()
#     )
#     if existing_application:
#         raise HTTPException(status_code=400, detail="Already applied for this job")

#     # Generate profile and job description text
#     user_text = get_user_profile_text(user, db)
#     job_text = get_job_description_text(job)

#     # Compute similarity score
#     similarity_score = calculate_similarity(user_text, job_text)

#     # Create new application with ranking score
#     new_application = models.JobApplication(user_id=user.id, job_id=job.id)
#     db.add(new_application)
#     db.commit()
#     db.refresh(new_application)

#     return {
#         "message": "Job application submitted successfully",
#         "matching_score": round(similarity_score * 100, 2)  # Convert to percentage
#     }


if __name__ == "__main__":
    get_user_profile_text(User)