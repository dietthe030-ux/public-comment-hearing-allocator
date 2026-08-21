"""Build and verify the canonical source-revision manifest."""

from __future__ import annotations

import argparse
import hashlib
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / ".task" / "REVISION_MANIFEST.txt"
TOP_LEVEL = {"pyproject.toml", "uv.lock"}
TASK_FILES = {".task/SPECIFICATION.md"}
SOURCE_ROOTS = ("contracts/", "docs/", "scripts/", "tests/", "frontend/")
EXCLUDED_PARTS = {"node_modules", "dist", ".pytest_cache", "__pycache__"}
EXCLUDED_SUFFIXES = {".pyc", ".log"}
REQUIRED = {
    ".task/SPECIFICATION.md",
    "contracts/public_comment_allocator.py",
    "frontend/package-lock.json",
    "frontend/src/App.tsx",
    "scripts/revision_manifest.py",
    "tests/test_public_comment_allocator.py",
}


def source_files() -> list[Path]:
    files = []
    for path in ROOT.rglob("*"):
        if not path.is_file():
            continue
        rel = path.relative_to(ROOT).as_posix()
        if any(part in EXCLUDED_PARTS for part in path.parts) or path.suffix in EXCLUDED_SUFFIXES:
            continue
        if rel in TOP_LEVEL or rel in TASK_FILES or rel.startswith(SOURCE_ROOTS):
            files.append(path)
    rels = {path.relative_to(ROOT).as_posix() for path in files}
    missing = REQUIRED - rels
    if missing:
        raise RuntimeError(f"required revision files missing: {sorted(missing)}")
    return sorted(files, key=lambda path: path.relative_to(ROOT).as_posix())


def canonical_bytes() -> bytes:
    lines = []
    for path in source_files():
        rel = path.relative_to(ROOT).as_posix()
        digest = hashlib.sha256(path.read_bytes()).hexdigest().upper()
        lines.append(f"{digest}|{rel}\n")
    return "".join(lines).encode("utf-8")


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--verify", action="store_true")
    args = parser.parse_args()
    data = canonical_bytes()
    if args.verify:
        if not OUTPUT.exists() or OUTPUT.read_bytes() != data:
            raise SystemExit("revision manifest mismatch; regenerate it")
    else:
        OUTPUT.write_bytes(data)
    print(hashlib.sha256(data).hexdigest().upper())
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
