"""
Configurações centrais do projeto Xavier Agent.
Carrega variáveis do .env na raiz do projeto via python-dotenv.
"""
from pathlib import Path
from dotenv import load_dotenv
from pydantic_settings import BaseSettings

# Localiza o .env na raiz do projeto (dois níveis acima de backend/app/core/)
_ROOT_DIR = Path(__file__).resolve().parents[3]
load_dotenv(_ROOT_DIR / ".env")


class Settings(BaseSettings):
    # LLM providers
    HUGGINGFACE_API_KEY: str = ""
    GROQ_API_KEY: str = ""

    # Google integrations
    GOOGLE_APPLICATION_CREDENTIALS: str = "google_credentials.json"
    CALENDAR_EMAIL: str = ""

    class Config:
        env_file = str(_ROOT_DIR / ".env")
        env_file_encoding = "utf-8"
        extra = "ignore"


settings = Settings()
