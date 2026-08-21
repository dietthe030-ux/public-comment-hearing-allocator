#!/usr/bin/env python3
"""Canonical comment manifest generator and hasher for Public Comment Hearing Allocator."""

import hashlib
import json
import sys
from typing import Any, Dict, List


def _has_control_or_delimiter_chars(s: str) -> bool:
    """Check if string contains pipe delimiter, CR, LF, tab, or ASCII control characters."""
    for ch in s:
        code = ord(ch)
        if ch in ("|", "\r", "\n", "\t") or code < 32 or code == 127:
            return True
    return False


def validate_manifest_field(field_name: str, value: str) -> str:
    """Validate that a field contains no forbidden delimiters, control chars, or leading/trailing whitespace."""
    if not isinstance(value, str) or not value:
        raise ValueError(f"ERR_INVALID_{field_name.upper()}: Value must be a non-empty string")
    if _has_control_or_delimiter_chars(value):
        raise ValueError(f"ERR_INVALID_{field_name.upper()}: Contains forbidden delimiter '|', CR, LF, tab, or control characters")
    if value.strip() != value:
        raise ValueError(f"ERR_INVALID_{field_name.upper()}: Leading or trailing whitespace is forbidden")
    return value


def format_manifest_line(index: int, external_id: str, url: str, digest: str) -> str:
    """Format a single comment record into a canonical manifest line with strict validation."""
    if not isinstance(index, int) or index < 0:
        raise ValueError(f"ERR_INVALID_INDEX: Index must be a non-negative integer, got {index}")

    clean_id = validate_manifest_field("external_id", external_id)
    if len(clean_id) > 128:
        raise ValueError(f"ERR_INVALID_EXTERNAL_ID: Length ({len(clean_id)}) exceeds maximum 128 chars")

    clean_url = validate_manifest_field("url", url)
    if not (clean_url.startswith("http://") or clean_url.startswith("https://")) or " " in clean_url:
        raise ValueError(f"ERR_INVALID_URL: Must start with http:// or https:// and contain no whitespace, got '{clean_url}'")

    clean_digest = validate_manifest_field("digest", digest)
    clean_digest_lower = clean_digest.lower()
    if len(clean_digest_lower) != 64 or not all(c in "0123456789abcdef" for c in clean_digest_lower):
        raise ValueError(f"ERR_INVALID_DIGEST: Must be 64-character hexadecimal SHA-256 digest, got '{clean_digest}'")

    return f"{index}|{clean_id}|{clean_url}|{clean_digest_lower}\n"


def build_canonical_manifest(comments: List[Dict[str, Any]]) -> str:
    """Build the full canonical manifest string from an ordered list of comment dicts.

    Each dict must contain:
      - 'external_id' (or 'id')
      - 'url'
      - 'digest'
    """
    lines: List[str] = []
    for idx, comment in enumerate(comments):
        ext_id = str(comment.get("external_id") or comment.get("id") or "")
        url = str(comment.get("url") or "")
        digest = str(comment.get("digest") or "")
        lines.append(format_manifest_line(idx, ext_id, url, digest))
    return "".join(lines)


def compute_manifest_digest(comments: List[Dict[str, Any]]) -> str:
    """Compute the 64-char lowercase hex SHA-256 digest of the canonical manifest."""
    manifest_str = build_canonical_manifest(comments)
    return hashlib.sha256(manifest_str.encode("utf-8")).hexdigest().lower()


def compute_text_sha256(text: str) -> str:
    """Compute 64-char lowercase hex SHA-256 digest of UTF-8 text."""
    return hashlib.sha256(text.encode("utf-8")).hexdigest().lower()


def main() -> None:
    """CLI interface for manifest generation from stdin/file."""
    if len(sys.argv) > 1 and sys.argv[1] in ("-h", "--help"):
        print("Usage: python manifest_helper.py [input_json_file]")
        print("Reads JSON list of comments and outputs canonical manifest and SHA-256 digest.")
        sys.exit(0)

    if len(sys.argv) > 1:
        with open(sys.argv[1], "r", encoding="utf-8") as f:
            data = json.load(f)
    else:
        data = json.load(sys.stdin)

    if not isinstance(data, list):
        print("Error: Input JSON must be a list of comment objects.", file=sys.stderr)
        sys.exit(1)

    try:
        manifest = build_canonical_manifest(data)
        digest = compute_manifest_digest(data)
    except ValueError as e:
        print(f"Validation Error: {e}", file=sys.stderr)
        sys.exit(1)

    print("--- Canonical Manifest ---")
    print(manifest, end="")
    print("--- SHA-256 Digest ---")
    print(digest)


if __name__ == "__main__":
    main()
