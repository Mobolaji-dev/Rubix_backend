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
        Checks PATH first, then common install locations including project-local node_modules.
        """
        found = shutil.which("bob")
        if found:
            return found

        home = os.path.expanduser("~")
        # Resolve project root (one level up from app/) for local node_modules installed by build.sh
        project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

        candidates = [
            # Project-local install (build.sh installs here: npm install --prefix <project_root>)
            os.path.join(project_root, "node_modules", ".bin", "bob"),
            # User-local prefix installs
            os.path.join(home, ".local", "node_modules", ".bin", "bob"),
            os.path.join(home, ".local", "bin", "bob"),
            os.path.join(home, ".npm-global", "bin", "bob"),
            # Global installs
            "/usr/local/bin/bob",
            "/usr/bin/bob",
        ]
        for path in candidates:
            if os.path.isfile(path) and os.access(path, os.X_OK):
                return path

        # Fallback: invoke via node entrypoint directly
        node_bin = shutil.which("node")
        js_candidates = [
            os.path.join(project_root, "node_modules", "bobshell", "dist", "bob.js"),
            os.path.join(home, ".local", "node_modules", "bobshell", "dist", "bob.js"),
            "/tmp/node_modules/bobshell/dist/bob.js",
        ]
        if node_bin:
            for jsc in js_candidates:
                if os.path.isfile(jsc):
                    return f"{node_bin} {jsc}"

        # Last resort: runtime auto-install from IBM S3
        npm_bin = shutil.which("npm")
        if npm_bin:
            for target_dir in [project_root, os.path.join(home, ".local"), "/tmp"]:
                try:
                    import subprocess
                    import urllib.request
                    bob_version_url = "https://s3.us-south.cloud-object-storage.appdomain.cloud/bob-shell/bobshell2-version.txt"
                    with urllib.request.urlopen(bob_version_url, timeout=10) as r:
                        version = r.read().decode().strip()
                    tgz_url = f"https://s3.us-south.cloud-object-storage.appdomain.cloud/bob-shell/bobshell-{version}.tgz"
                    tgz_path = "/tmp/bobshell-runtime.tgz"
                    urllib.request.urlretrieve(tgz_url, tgz_path)
                    subprocess.run(
                        [npm_bin, "install", "--registry=https://registry.npmjs.org/",
                         "--allow-scripts=@officecli/officecli",
                         "--progress=false", "--loglevel=error",
                         "--prefix", target_dir, tgz_path],
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
