"""Fill missing Atlas marks from publisher favicons or GitHub owner avatars."""

from io import BytesIO
from pathlib import Path
import re
from urllib.request import Request, urlopen

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
CATALOG = (ROOT / "src/data/servers.ts").read_text(encoding="utf-8")
BRANDS = ROOT / "public/brands"
ENTRIES = re.findall(r'slug: "([^"]+)"[\s\S]*?repository: "([^"]+)"', CATALOG)

DOMAINS = {
    "filesystem": "modelcontextprotocol.io", "memory": "modelcontextprotocol.io",
    "sequential-thinking": "modelcontextprotocol.io", "everything": "modelcontextprotocol.io",
    "postgres-reference": "modelcontextprotocol.io", "git": "modelcontextprotocol.io",
    "time": "modelcontextprotocol.io", "fetch": "modelcontextprotocol.io",
    "postgres": "postgresql.org", "exa": "exa.ai", "tavily": "tavily.com",
    "firecrawl": "firecrawl.dev", "context7": "context7.com",
    "arxiv": "arxiv.org", "pandoc": "pandoc.org", "huggingface": "huggingface.co",
    "obsidian-http": "obsidian.md", "ableton": "ableton.com", "minecraft": "minecraft.net",
    "qdrant": "qdrant.tech", "chroma": "trychroma.com", "browserbase": "browserbase.com",
    "semgrep": "semgrep.dev", "e2b": "e2b.dev",
}

sources = ["# Server marks", "", "Marks are used for identification. A publisher favicon represents a service; a GitHub avatar represents the listed repository owner, not an endorsement.", ""]
failures = []

for slug, repository in ENTRIES:
    target = BRANDS / f"{slug}.png"
    if target.exists():
        sources.append(f"- `{slug}`: existing publisher/favicon asset")
        continue
    owner = repository.split("/")[0]
    candidates = []
    if slug in DOMAINS:
        candidates.append((f"https://www.google.com/s2/favicons?domain={DOMAINS[slug]}&sz=128", f"{DOMAINS[slug]} favicon"))
    candidates.append((f"https://github.com/{owner}.png?size=128", f"GitHub owner avatar: {owner}"))
    for url, description in candidates:
        try:
            with urlopen(Request(url, headers={"User-Agent": "Atlas-MCP-Directory/1.0"}), timeout=15) as response:
                data = response.read()
            image = Image.open(BytesIO(data)).convert("RGBA")
            if image.width < 16 or image.height < 16:
                raise ValueError("image too small")
            image.thumbnail((128, 128), Image.Resampling.LANCZOS)
            image.save(target, "PNG", optimize=True)
            sources.append(f"- `{slug}`: {description} — {url}")
            print(f"{slug}: {description}")
            break
        except Exception as error:
            print(f"{slug}: failed {url}: {error}")
    else:
        failures.append(slug)

(BRANDS / "SOURCES.md").write_text("\n".join(sources) + "\n", encoding="utf-8")
if failures:
    raise SystemExit("Missing marks: " + ", ".join(failures))
print(f"Complete: {len(ENTRIES)} server marks")
