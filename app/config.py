"""Settings loaded from .env — no pydantic-settings required."""

import os
import shutil
from dotenv import load_dotenv

load_dotenv()


class Settings:
    # IBM Bob Shell — authenticated via API key, invoked as a subprocess.
    # Install: curl -fsSL https://bob.ibm.com/download/bobshell.sh | bash --pm npm
    bob_api_key: str = os.getenv("BOB_API_KEY", "")

    # GitHub token — required to allow arbitrary public repo cloning.
    # Without this, only sample repos (pre-approved list) are accepted.
    github_token: str = os.getenv("GITHUB_TOKEN", "")

    port: int = int(os.getenv("PORT", "8000"))

    @property
    def bob_enabled(self) -> bool:
        return bool(self.bob_api_key) and bool(self.bob_bin)

    @property
    def bob_bin(self) -> str | None:
        """
        Locate the `bob` binary.
        Checks PATH first, then common user-local install locations.
        """
        found = shutil.which("bob")
        if found:
            return found

        # Bob Shell is often installed to ~/.local/node_modules/.bin (user npm prefix)
        home = os.path.expanduser("~")
        candidates = [
            os.path.join(home, ".local", "node_modules", ".bin", "bob"),
            os.path.join(home, ".local", "bin", "bob"),
            os.path.join(home, ".npm-global", "bin", "bob"),
            "/usr/local/bin/bob",
        ]
        for path in candidates:
            if os.path.isfile(path) and os.access(path, os.X_OK):
                return path

        node_bin = shutil.which("node")
        js_candidates = [
            os.path.join(home, ".local", "node_modules", "bobshell", "dist", "bob.js"),
            "/tmp/node_modules/bobshell/dist/bob.js",
        ]
        if node_bin:
            for jsc in js_candidates:
                if os.path.isfile(jsc):
                    return f"{node_bin} {jsc}"

        # Auto-install bobshell if npm is available in production environment
        npm_bin = shutil.which("npm")
        if npm_bin:
            for target_dir in [os.path.join(home, ".local"), "/tmp"]:
                try:
                    import subprocess
                    subprocess.run(
                        [npm_bin, "install", "--prefix", target_dir, "bobshell"],
                        capture_output=True,
                        timeout=90,
                    )
                    target = os.path.join(target_dir, "node_modules", ".bin", "bob")
                    if os.path.isfile(target) and os.access(target, os.X_OK):
                        return target
                    js_target = os.path.join(target_dir, "node_modules", "bobshell", "dist", "bob.js")
                    if node_bin and os.path.isfile(js_target):
                        return f"{node_bin} {js_target}"
                except Exception:
                    pass

        return None

    @property
    def url_input_enabled(self) -> bool:
        return bool(self.github_token)


settings = Settings()
