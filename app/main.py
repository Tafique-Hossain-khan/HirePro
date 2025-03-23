from fastapi import FastAPI
from app.routers import hr,job,users,auth
from app.database import engine
from . import models

app = FastAPI()
models.Base.metadata.create_all(engine)

app.include_router(hr.router)
app.include_router(job.router)
app.include_router(users.router)
# app.include_router(auth.router)

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change this to specific frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],  # Allows all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allows all headers
)
