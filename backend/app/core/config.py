from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    PROJECT_NAME: str = "LegalAI Studio"
    VERSION: str = "0.1.0"
    DEBUG: bool = False

    DATABASE_URL: str = "postgresql+asyncpg://postgres:postgres@localhost:5432/legalai"

    JWT_SECRET: str
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 15
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    CORS_ORIGINS: str = "http://localhost:3004,http://localhost:3005"

    CLAUDE_API_KEY: str = ""
    SUPABASE_URL: str = ""
    SUPABASE_KEY: str = ""

    @property
    def cors_origins_list(self) -> list[str]:
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",")]

    class Config:
        env_file = ".env"
        extra = "allow"


settings = Settings()
