from pinecone import Pinecone
import os
from langchain_google_genai import GoogleGenerativeAIEmbeddings

# Load API keys
PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
API_KEY = os.getenv("GEMINI_API_KEY")

# Ensure API key is not None
if not PINECONE_API_KEY:
    raise ValueError("PINECONE_API_KEY is not set!")

if not API_KEY:
    raise ValueError("GEMINI_API_KEY is not set!")

# Initialize Pinecone client
pc = Pinecone(api_key=PINECONE_API_KEY)

# Name of your Pinecone index
INDEX_NAME = "candidate-search"

# Connect to the Pinecone index
index = pc.Index(name=INDEX_NAME)  # ✅ Correct way

# Initialize Google Generative AI Embeddings
embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001", google_api_key=API_KEY)

print(f"Successfully connected to Pinecone index: {INDEX_NAME}")
