
from fastapi import APIRouter,HTTPException ,Depends,status,Response,File,UploadFile,BackgroundTasks
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from app.database import get_db
from app.oauth2 import get_current_user  
import os
import uuid
import tempfile
from typing import List, Dict, Any, Optional
import logging



from app import models, schemas, oauth2
from app.database import get_db
from app.ranking_system import calculate_similarity, get_user_profile_text, get_job_description_text


from app.models import User, Skill, Language, WorkExperience, Project, Certification
from app.schemas import UserModel, UserResponseModel,InterviewSettings, QuestionAnswer, QuestionAnswerPairs
from .. import schemas
from ..oauth2 import create_access_token
from app.schemas import WorkExperienceModel, ProjectModel, CertificationModel

from app.job_recommendation import get_user_profile, get_all_jobs, compute_similarity

from pinecone import Pinecone
import numpy as np
from langchain_google_genai import GoogleGenerativeAIEmbeddings





import whisper
from langchain.chat_models import ChatOpenAI
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain



# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)



#setting up vector db
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")

# Ensure API key is not None
if not PINECONE_API_KEY:
    raise ValueError("PINECONE_API_KEY is not set!")

if not GEMINI_API_KEY:
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
embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001", google_api_key=GEMINI_API_KEY)
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



#-------------- jobs and apply for jobs ---------------------

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



#----- AI mock interview
# Get API credentials
API_KEY = os.environ.get("API_KEY")
BASE_URL = os.environ.get("BASE_URL")

if not API_KEY:
    logger.warning("OPENAI_API_KEY environment variable not set!")

# Load Whisper model
try:
    model = whisper.load_model("medium")
    logger.info("Whisper medium model loaded successfully")
except Exception as e:
    logger.error(f"Error loading Whisper model: {e}")
    model = None

# Initialize OpenAI model for LangChain
def get_llm():
    try:
        return ChatOpenAI(
            model="gpt-4o",
            api_key=API_KEY,
            base_url=BASE_URL,
            temperature=0.3
        )
    except Exception as e:
        logger.error(f"Error initializing ChatOpenAI: {e}")
        return None

# Question generation prompt template
QUESTION_PROMPT_TEMPLATE = """
You are an expert interviewer for {topic}. 
Create {question_count} {difficulty} level interview questions about {topic}.
The questions should be challenging but fair, and should test the candidate's knowledge and understanding of {topic}.
Return only the list of questions numbered from 1 to {question_count}, without any additional text.
"""

# Answer evaluation prompt template
ANSWER_EVALUATION_TEMPLATE = """
You are an expert interviewer evaluating a candidate's response to a technical interview question.

Question: {question}
Candidate's Answer: {answer}

Please evaluate the answer on a scale of 1-10 (with 10 being perfect) and provide constructive feedback.
Return your response in this JSON format:
{{
  "score": [score as a number between 1 and 10],
  "feedback": "[your detailed feedback with specific suggestions for improvement]"
}}
"""

# Report generation prompt template
REPORT_TEMPLATE = """
You are an expert interviewer generating a final report for a mock interview.

Questions and Answers:
{qa_pairs}

Please analyze the candidate's performance and generate a comprehensive feedback report.
Include an overall assessment, strengths, areas for improvement, and specific recommendations.
Calculate an overall score from 1-10 based on the individual answers.

Return your response in this JSON format:
{{
  "totalScore": [overall score as a number between 1 and 10],
  "answerFeedbacks": [array of individual feedback objects]
}}
"""

@router.post("/mock-interview")
async def mock_interview_endpoint(settings: InterviewSettings = None, audio: UploadFile = File(None)):
    """
    Main interview endpoint that can:
    1. Generate questions when settings are provided
    2. Transcribe audio when audio file is provided
    """
    # If audio file is provided, transcribe it
    if audio:
        return await transcribe_audio(audio)
    
    # If settings are provided, generate questions
    if settings:
        return await generate_questions(settings)
    
    # If neither, return an error
    raise HTTPException(status_code=400, detail="Either settings or audio file must be provided")

# Helper function to generate questions
async def generate_questions(settings: InterviewSettings):
    try:
        llm = get_llm()
        if not llm:
            # Fallback questions based on topic if OpenAI not available
            topic = settings.topic.lower()
            
            topic_questions = {
                "javascript": [
                    "Explain the concept of closures in JavaScript.",
                    "What are the differences between var, let, and const?",
                    "How does prototypal inheritance work in JavaScript?",
                    "Describe the event loop in JavaScript.",
                    "What are promises and how do they work?"
                ],
                "python": [
                    "Explain Python's GIL (Global Interpreter Lock) and its implications.",
                    "What are decorators in Python and how do they work?",
                    "Describe list comprehensions and their advantages.",
                    "How does memory management work in Python?",
                    "What are generators and how do they differ from lists?"
                ],
                "data science": [
                    "Explain the difference between supervised and unsupervised learning.",
                    "What is overfitting and how can it be prevented?",
                    "Describe the process of feature selection in machine learning.",
                    "What is the curse of dimensionality?",
                    "Explain the bias-variance tradeoff in machine learning models."
                ],
                "react": [
                    "Explain the concept of virtual DOM in React.",
                    "What are React hooks and why were they introduced?",
                    "Describe the component lifecycle in React.",
                    "What is the difference between state and props?",
                    "How do you handle side effects in React components?"
                ]
            }
            
            # Get questions for the requested topic or use general questions
            questions = topic_questions.get(topic, [
                "Explain the concept of variables in programming.",
                "What are functions and how do they work?",
                "Describe object-oriented programming principles.",
                "What is version control and why is it important?",
                "Explain the concept of APIs in software development."
            ])
            
            if settings.questionCount < len(questions):
                questions = questions[:settings.questionCount]
            
            return {"questions": questions}
        
        prompt = PromptTemplate(
            input_variables=["topic", "difficulty", "question_count"],
            template=QUESTION_PROMPT_TEMPLATE
        )
        
        chain = LLMChain(llm=llm, prompt=prompt)
        
        result = chain.run({
            "topic": settings.topic,
            "difficulty": settings.difficulty,
            "question_count": settings.questionCount
        })
        
        # Parse result to get questions (assuming numbered format)
        questions = []
        lines = result.strip().split('\n')
        for line in lines:
            if line and any(line.startswith(f"{i}.") for i in range(1, settings.questionCount + 1)):
                questions.append(line[line.find(" ") + 1:].strip())
        
        # Ensure we have the right number of questions
        if len(questions) != settings.questionCount:
            # Try an alternative parsing strategy
            questions = [line.strip() for line in lines if line.strip()]
            if len(questions) > settings.questionCount:
                questions = questions[:settings.questionCount]
            elif len(questions) < settings.questionCount:
                # Fill with default questions if we couldn't parse enough
                default_questions = [
                    f"Tell me about your experience with {settings.topic}.",
                    f"What are the key concepts in {settings.topic}?",
                    f"How would you explain {settings.topic} to a beginner?"
                ]
                while len(questions) < settings.questionCount and default_questions:
                    questions.append(default_questions.pop(0))
        
        return {"questions": questions}
        
    except Exception as e:
        logger.error(f"Error generating questions: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Helper function to transcribe audio
async def transcribe_audio(audio: UploadFile = File(...)):
    try:
        if not model:
            raise HTTPException(status_code=500, detail="Whisper model not loaded")
        
        # Save uploaded file temporarily
        temp_dir = tempfile.mkdtemp()
        temp_file_path = os.path.join(temp_dir, f"{uuid.uuid4()}.webm")
        
        with open(temp_file_path, "wb") as buffer:
            content = await audio.read()
            buffer.write(content)
        
        try:
            # Transcribe the audio file
            logger.info(f"Starting transcription of file: {temp_file_path}")
            result = model.transcribe(temp_file_path)
            transcription = result["text"].strip()
            logger.info(f"Transcription completed successfully, length: {len(transcription)}")
        except Exception as e:
            logger.error(f"Error during transcription: {e}")
            raise HTTPException(status_code=500, detail=f"Transcription error: {str(e)}")
        finally:
            # Clean up the temporary file
            try:
                if os.path.exists(temp_file_path):
                    os.remove(temp_file_path)
                if os.path.exists(temp_dir):
                    os.rmdir(temp_dir)
            except Exception as e:
                logger.error(f"Error cleaning up temp files: {e}")

        if not transcription:
            return {"transcription": "The audio couldn't be transcribed clearly. Please try speaking more clearly or check your microphone."}
            
        return {"transcription": transcription}
        
    except Exception as e:
        logger.error(f"Error transcribing audio: {e}")
        return {"transcription": f"Sorry, there was an error transcribing your audio: {str(e)}. Please try again."}

# Endpoint to evaluate a single answer
@router.post("/mock-interview/evaluate")
async def evaluate_answer(question_answer: QuestionAnswer):
    try:
        llm = get_llm()
        if not llm:
            return {
                "score": 7,
                "feedback": "AI evaluation is currently unavailable. This is a fallback response."
            }
        
        prompt = PromptTemplate(
            input_variables=["question", "answer"],
            template=ANSWER_EVALUATION_TEMPLATE
        )
        
        chain = LLMChain(llm=llm, prompt=prompt)
        
        result = chain.run({
            "question": question_answer.question,
            "answer": question_answer.answer
        })
        
        # Parse the JSON result
        import json
        try:
            feedback = json.loads(result)
            return feedback
        except:
            # If JSON parsing fails, return a default response
            return {
                "score": 7,
                "feedback": "The answer provides a basic understanding but could be more comprehensive. Consider adding specific examples and explaining the underlying concepts in more detail."
            }
    
    except Exception as e:
        logger.error(f"Error evaluating answer: {e}")
        return {
            "score": 5,
            "feedback": "Error in evaluation process. Please try again."
        }

# Endpoint to generate the final interview report
@router.post("/mock-interview/report")
async def generate_report(qa_pairs: QuestionAnswerPairs):
    try:
        llm = get_llm()
        if not llm:
            # Generate a fallback report
            feedbacks = []
            total_score = 0
            
            for i, qa in enumerate(qa_pairs.questionAnswerPairs):
                score = 6 + (i % 3)  # Scores between 6-8
                feedbacks.append({
                    "score": score,
                    "feedback": f"This answer demonstrates adequate knowledge but could be improved with more specific examples."
                })
                total_score += score
            
            if len(qa_pairs.questionAnswerPairs) > 0:
                total_score /= len(qa_pairs.questionAnswerPairs)
            
            return {
                "totalScore": round(total_score, 1),
                "answerFeedbacks": feedbacks
            }
        
        # Format the QA pairs for the prompt
        formatted_qa = ""
        for i, qa in enumerate(qa_pairs.questionAnswerPairs):
            formatted_qa += f"Question {i+1}: {qa.question}\nAnswer {i+1}: {qa.answer}\n\n"
        
        prompt = PromptTemplate(
            input_variables=["qa_pairs"],
            template=REPORT_TEMPLATE
        )
        
        chain = LLMChain(llm=llm, prompt=prompt)
        
        result = chain.run({
            "qa_pairs": formatted_qa
        })
        
        # Parse the JSON result
        import json
        try:
            report = json.loads(result)
            return report
        except:
            # If JSON parsing fails, return a default report
            feedbacks = []
            for i, qa in enumerate(qa_pairs.questionAnswerPairs):
                feedbacks.append({
                    "score": 7,
                    "feedback": f"Good attempt on question {i+1}. Your answer covers the main points but could use more specific examples."
                })
            
            return {
                "totalScore": 7.0,
                "answerFeedbacks": feedbacks
            }
    
    except Exception as e:
        logger.error(f"Error generating report: {e}")
        return {
            "totalScore": 6.0,
            "answerFeedbacks": [
                {
                    "score": 6,
                    "feedback": "Error generating detailed feedback."
                }
            ]
        }

# Keep compatibility with previous routes
@router.post("/mock-interview/questions")
async def questions_endpoint(settings: InterviewSettings):
    return await generate_questions(settings)

@router.post("/mock-interview/transcribe")
async def transcribe_endpoint(audio: UploadFile = File(...)):
    return await transcribe_audio(audio)
