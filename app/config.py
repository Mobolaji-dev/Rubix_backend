"""Settings loaded from .env — no pydantic-settings required."""

import os
from dotenv import load_dotenv

load_dotenv()


class Settings:
    # IBM Bob — filled in on hackathon day
    bob_api_key: str = os.getenv("BOB_API_KEY", "")
    bob_api_url: str = os.getenv("BOB_API_URL", "https://api.ibm.com/bob/v1")

    # GitHub token — required to allow arbitrary public repo cloning.
    # Without this, only sample repos (pre-approved list) are accepted.
    github_token: str = os.getenv("GITHUB_TOKEN", "")

    port: int = int(os.getenv("PORT", "8000"))

    @property
    def bob_enabled(self) -> bool:
        return bool(self.bob_api_key)

    @property
    def url_input_enabled(self) -> bool:
        return bool(self.github_token)


settings = Settings()
