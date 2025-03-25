# This file will contain all the input and output responce model

from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime
import random


##-----------User Models------------##


class WorkExperienceModel(BaseModel):
    company: str
    position: str
    location: Optional[str] = None
    start_date: datetime
    end_date: Optional[datetime] = None
    currently_working: bool
    description: Optional[str] = None

class ProjectModel(BaseModel):
    project_name: str
    project_description: Optional[str] = None
    project_link: Optional[str] = None

class CertificationModel(BaseModel):
    certification_name: str
    certification_provider: str
    certificate_link: Optional[str] = None

class UserModel(BaseModel):
    email: EmailStr
    password: str
    name: str
    location: Optional[str] = None
    bio: Optional[str] = None
    skills: List[str]
    languages: List[str]
    experiences: List[WorkExperienceModel]
    projects: List[ProjectModel]
    certifications: List[CertificationModel]
    
class UserUpdateModel(BaseModel):
    email: EmailStr
    
    name: str
    location: Optional[str] = None
    bio: Optional[str] = None
    skills: List[str]
    languages: List[str]
    experiences: List[WorkExperienceModel]
    projects: List[ProjectModel]
    certifications: List[CertificationModel]
class UserResponseModel(BaseModel):
    id: int
    email: EmailStr
    name: str
    location: Optional[str]
    bio: Optional[str]
    skills: List[str]
    languages: List[str]
    experiences: List[WorkExperienceModel]
    projects: List[ProjectModel]
    certifications: List[CertificationModel]

    class Config:
        orm_mode = True

class UserLogin(BaseModel):
    email: str
    password: str


##-----------Hr Models------------##

class HrModel(BaseModel):
    name: str
    email: EmailStr
    password: str
    company: str

class HrResponseModel(BaseModel):
    id: int
    name: str
    email: EmailStr
    company: str
class HrLogin(BaseModel):
    email: str
    password: str




#-----------Job Models------------##
class JobCreate(BaseModel):
    title: str
    work_type: str
    location: str
    job_type: str
    
    description: str

##-----------Auth Models------------##

class Token(BaseModel):
    access_token: str
    token_type: str
    

class TokenData(BaseModel):
    id: Optional[int] = None


