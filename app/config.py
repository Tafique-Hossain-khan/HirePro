from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    database_hostname: str
    database_port: str
    database_password: str
    database_name: str
    database_username: str
    secret_key: str
    algorithm: str
    access_token_expire_minutes: int
    api_key: str
    gemini_api_key: str
    base_url: str
    pinecone_api_key:str

    class Config:
        env_file = ".env" # this is to load the variable for the .env file


settings = Settings()