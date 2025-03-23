from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime, Table,Text,Float
from sqlalchemy.orm import relationship
from app.database import Base
from datetime import datetime
from app.utils import generate_unique_job_id
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()


#------------user registration schema------------#

user_skills = Table(
    'user_skills', Base.metadata,
    Column('user_id', Integer, ForeignKey('users.id', ondelete="CASCADE"), primary_key=True),
    Column('skill_id', Integer, ForeignKey('skills.id', ondelete="CASCADE"), primary_key=True)
)


user_languages = Table(
    "user_languages",
    Base.metadata,
    Column("user_id", Integer, ForeignKey("users.id", ondelete="CASCADE"), primary_key=True),
    Column("language_id", Integer, ForeignKey("languages.id", ondelete="CASCADE"), primary_key=True)
)

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, autoincrement=True)
    email = Column(String, unique=True, nullable=False)
    password = Column(String, nullable=False)
    name = Column(String, nullable=False)
    location = Column(String, nullable=True)
    bio = Column(String, nullable=True)
    

    # Relationships
    skills = relationship("Skill", secondary=user_skills, back_populates="users")
    languages = relationship("Language", secondary=user_languages, back_populates="users")
    experiences = relationship("WorkExperience", back_populates="user")
    projects = relationship("Project", back_populates="user")
    certifications = relationship("Certification", back_populates="user")
    applications = relationship("JobApplication", back_populates="user")

class Skill(Base):
    __tablename__ = "skills"
    id = Column(Integer, primary_key=True, autoincrement=True)
    skill_name = Column(String, nullable=False)
    # Many-to-Many Relationship
    users = relationship("User", secondary=user_skills, back_populates="skills")

class Language(Base):
    __tablename__ = "languages"
    id = Column(Integer, primary_key=True, autoincrement=True)
    language_name = Column(String, nullable=False)
    # Many-to-Many Relationship
    users = relationship("User", secondary=user_languages, back_populates="languages")

class WorkExperience(Base):
    __tablename__ = "work_experience"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    company = Column(String, nullable=False)
    position = Column(String, nullable=False)
    location = Column(String, nullable=True)
    start_date = Column(DateTime, nullable=False)
    end_date = Column(DateTime, nullable=True)
    currently_working = Column(Boolean, default=False)
    description = Column(String, nullable=True)

    user = relationship("User", back_populates="experiences")

class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    project_name = Column(String, nullable=False)
    project_description = Column(String, nullable=True)
    project_link = Column(String, nullable=True)

    user = relationship("User", back_populates="projects")

class Certification(Base):
    __tablename__ = "certifications"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    certification_name = Column(String, nullable=False)
    certification_provider = Column(String, nullable=False)
    certificate_link = Column(String, nullable=True)

    user = relationship("User", back_populates="certifications")


#------------------Hr Schema---------------------#

class HR(Base):
    __tablename__ = "hr"

    id = Column(Integer, primary_key=True, autoincrement=True)
    email = Column(String, unique=True, nullable=False)
    name = Column(String, nullable=False)
    password = Column(String, nullable=False)
    company = Column(String, nullable=False)

    # Relationship with Job table
    jobs = relationship("Job", back_populates="hr", cascade="all, delete")

#------------------Job Schema---------------------#

class Job(Base):
    __tablename__ = "jobs"

    id = Column(Integer, primary_key=True, autoincrement=True)
    job_id = Column(Integer, unique=True, nullable=False, default=generate_unique_job_id)
    title = Column(String, nullable=False)
    company_name = Column(String, nullable=False)
    work_type = Column(String, nullable=False)
    location = Column(String, nullable=False)
    job_type = Column(String, nullable=False)
    description = Column(Text, nullable=False)

    hr_id = Column(Integer, ForeignKey("hr.id", ondelete="CASCADE"), nullable=False)
    
    hr = relationship("HR", back_populates="jobs")
    applications = relationship("JobApplication", back_populates="job")


#------------------Job Application Schema---------------------#

class JobApplication(Base):
    __tablename__ = "job_applications"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)  # Who applied
    job_id = Column(Integer, ForeignKey("jobs.job_id"), nullable=False)  # Which job
    
    applied_at = Column(DateTime, default=datetime.utcnow)  # When applied
    match_score = Column(Float, nullable=False)
    # Relationships
    user = relationship("User", back_populates="applications")
    job = relationship("Job", back_populates="applications")
