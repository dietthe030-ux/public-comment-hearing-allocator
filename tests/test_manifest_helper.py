# pyright: reportMissingImports=false, reportUnusedImport=false, reportGeneralTypeIssues=false
"""Unit tests for Canonical Comment Manifest format and helper functions."""

import hashlib
import json
from pathlib import Path
import subprocess
import sys
import pytest
from scripts.manifest_helper import (
    build_canonical_manifest,
    compute_manifest_digest,
    compute_text_sha256,
    format_manifest_line,
    validate_manifest_field,
)

_PROJECT_ROOT = Path(__file__).resolve().parent.parent


def test_validate_manifest_field():
    """Verify validation helper catches illegal characters and padding."""
    assert validate_manifest_field("test_field", "valid_string_123") == "valid_string_123"

    with pytest.raises(ValueError, match="ERR_INVALID_TEST_FIELD"):
        validate_manifest_field("test_field", "")

    with pytest.raises(ValueError, match="ERR_INVALID_TEST_FIELD"):
        validate_manifest_field("test_field", "invalid|pipe")

    with pytest.raises(ValueError, match="ERR_INVALID_TEST_FIELD"):
        validate_manifest_field("test_field", "  padded  ")


def test_format_manifest_line_exact_fields():
    """Verify single line formatting with exact pipe delimiters and lowercase digest."""
    idx = 0
    ext_id = "comment-alpha"
    url = "https://example.gov/comments/1"
    digest = "E3B0C44298FC1C149AFBF4C8996FB92427AE41E4649B934CA495991B7852B855"

    line = format_manifest_line(idx, ext_id, url, digest)
    expected = "0|comment-alpha|https://example.gov/comments/1|e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855\n"
    assert line == expected


def test_format_manifest_line_rejection_of_padding_and_delimiters():
    """Verify surrounding whitespace or pipe delimiters in external_id, url, or digest are rejected."""
    valid_digest = "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"

    # Leading/trailing whitespace in external_id
    with pytest.raises(ValueError, match="ERR_INVALID_EXTERNAL_ID"):
        format_manifest_line(0, "  id-padded  ", "https://site.org/c3", valid_digest)

    # Pipe delimiter in external_id
    with pytest.raises(ValueError, match="ERR_INVALID_EXTERNAL_ID"):
        format_manifest_line(0, "id|evil", "https://site.org/c3", valid_digest)

    # Control char in url
    with pytest.raises(ValueError, match="ERR_INVALID_URL"):
        format_manifest_line(0, "id-1", "https://site.org/c3\n", valid_digest)

    # Invalid digest format
    with pytest.raises(ValueError, match="ERR_INVALID_DIGEST"):
        format_manifest_line(0, "id-1", "https://site.org/c3", "not-a-sha256")


def test_build_canonical_manifest_ordered_concatenation():
    """Verify multiline manifest builds in sequential index order."""
    comments = [
        {"external_id": "c1", "url": "https://gov.org/1", "digest": "aaaa" * 16},
        {"external_id": "c2", "url": "https://gov.org/2", "digest": "bbbb" * 16},
        {"id": "c3", "url": "https://gov.org/3", "digest": "cccc" * 16},
    ]
    manifest = build_canonical_manifest(comments)
    expected = (
        f"0|c1|https://gov.org/1|{'aaaa' * 16}\n"
        f"1|c2|https://gov.org/2|{'bbbb' * 16}\n"
        f"2|c3|https://gov.org/3|{'cccc' * 16}\n"
    )
    assert manifest == expected


def test_compute_manifest_digest_deterministic():
    """Verify SHA-256 digest is strictly deterministic."""
    comments = [
        {"external_id": "c1", "url": "https://gov.org/1", "digest": "aaaa" * 16},
        {"external_id": "c2", "url": "https://gov.org/2", "digest": "bbbb" * 16},
    ]
    digest1 = compute_manifest_digest(comments)
    digest2 = compute_manifest_digest(comments)

    assert digest1 == digest2
    assert len(digest1) == 64
    assert all(c in "0123456789abcdef" for c in digest1)

    # Verify matching standard hashlib on encoded string
    manifest_str = build_canonical_manifest(comments)
    expected_hash = hashlib.sha256(manifest_str.encode("utf-8")).hexdigest().lower()
    assert digest1 == expected_hash


def test_manifest_order_sensitivity():
    """Verify swapping comment order produces completely different manifest hashes."""
    c1 = {"external_id": "c1", "url": "https://gov.org/1", "digest": "aaaa" * 16}
    c2 = {"external_id": "c2", "url": "https://gov.org/2", "digest": "bbbb" * 16}

    digest_normal = compute_manifest_digest([c1, c2])
    digest_swapped = compute_manifest_digest([c2, c1])

    assert digest_normal != digest_swapped


def test_compute_text_sha256():
    """Verify standard text SHA-256 computation."""
    sample_text = "This is a public policy proposal."
    expected = hashlib.sha256(sample_text.encode("utf-8")).hexdigest()
    assert compute_text_sha256(sample_text) == expected


def test_manifest_helper_cli_json_file(tmp_path):
    """Verify manifest helper CLI reads JSON file and writes canonical output."""
    comments_file = tmp_path / "comments.json"
    comments_data = [
        {"external_id": "com-1", "url": "https://pub.gov/1", "digest": "1111" * 16},
        {"external_id": "com-2", "url": "https://pub.gov/2", "digest": "2222" * 16},
    ]
    comments_file.write_text(json.dumps(comments_data), encoding="utf-8")

    script_path = str(_PROJECT_ROOT / "scripts" / "manifest_helper.py")
    res = subprocess.run(
        [sys.executable, script_path, str(comments_file)],
        capture_output=True,
        text=True,
        check=True,
    )
    assert "--- Canonical Manifest ---" in res.stdout
    assert "0|com-1|https://pub.gov/1|" in res.stdout
    assert "1|com-2|https://pub.gov/2|" in res.stdout
    assert "--- SHA-256 Digest ---" in res.stdout
