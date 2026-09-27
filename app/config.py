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
        Checks PATH first, then project-local node_modules and .node22 standalone environment.
        """
        home = os.path.expanduser("~")
        project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

        node22_bin = os.path.join(project_root, ".node22", "bin")
        if os.path.isdir(node22_bin):
            if node22_bin not in os.environ.get("PATH", ""):
                os.environ["PATH"] = f"{node22_bin}:{os.environ.get('PATH', '')}"

        found = shutil.which("bob")
        if found:
            return found

        candidates = [
            # Project-local install (build.sh installs here)
            os.path.join(project_root, "node_modules", ".bin", "bob"),
            # Node 22 bin folder
            os.path.join(node22_bin, "bob"),
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

        # Fallback: invoke via node entrypoint directly using Node 22 if available
        node_bin = shutil.which("node") or os.path.join(node22_bin, "node")
        js_candidates = [
            os.path.join(project_root, "node_modules", "bobshell", "dist", "bob.js"),
            os.path.join(home, ".local", "node_modules", "bobshell", "dist", "bob.js"),
            "/tmp/node_modules/bobshell/dist/bob.js",
        ]
        if os.path.isfile(node_bin):
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
