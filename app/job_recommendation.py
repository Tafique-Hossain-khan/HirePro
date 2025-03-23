from app.database import get_db
from sqlalchemy.orm import Session
from fastapi import Depends
from app.models import User, Job


def get_user_profile(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        return None

    profile = {
        "skills": [skill.skill_name for skill in user.skills],
        "languages": [language.language_name for language in user.languages],
        "experience": [exp.position for exp in user.experiences],
        "projects": [project.project_name for project in user.projects],
        "certifications": [cert.certification_name for cert in user.certifications],
        "location": user.location,
        "work_type": "Hybrid"  # Default work type
    }
    return profile

def get_all_jobs( db: Session = Depends(get_db)):
    jobs = db.query(Job).all()
    job_list = [
        {
            "id": job.id,
            "title": job.title,
            "description": job.description,
            "company_name": job.company_name,
            "location": job.location,
            "job_type": job.job_type,
            "work_type": job.work_type,
        }
        for job in jobs
    ]
    return job_list


from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

def compute_similarity(user_profile, job_list):
    # Combine user skills, experience, and projects into one text
    user_text = " ".join(user_profile["skills"] + user_profile["experience"] + user_profile["projects"])

    # Extract job descriptions
    job_texts = [job["description"] + " " + job["title"] for job in job_list]

    # TF-IDF Vectorization
    vectorizer = TfidfVectorizer()
    vectors = vectorizer.fit_transform([user_text] + job_texts)

    # Compute Cosine Similarity (user vs all jobs)
    similarities = cosine_similarity(vectors[0], vectors[1:])[0]

    # Assign scores to jobs
    for i, job in enumerate(job_list):
        job["score"] = similarities[i]

    # Sort jobs by highest similarity score
    job_list.sort(key=lambda x: x["score"], reverse=True)

    return job_list
