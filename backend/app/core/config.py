from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    app_name: str = "MVP ERP"
    env: str = "dev"
    database_url: str = "sqlite:///./mvp.db"  # default fallback

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = Settings()
