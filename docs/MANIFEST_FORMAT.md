# Canonical Comment Manifest Format

This document defines the canonical manifest representation and hashing algorithm for public comment batches in the Public Comment Hearing Allocator Intelligent Contract.

## 1. Specification

When a hearing is created, the organizer commits an expected manifest SHA-256 digest (`expected_manifest_digest`) representing the exact batch of public comments to be locked.

During registration, comments are recorded in exact append-only registration order (`index` from `0` to `count - 1`).

### Line Format

For each comment registered in the batch, a single UTF-8 line is generated using the literal pipe delimiter `|`:

```text
<index>|<external_id>|<url>|<digest>\n
```

Where:
- `<index>`: Zero-based integer index of registration (`0`, `1`, `2`, ...).
- `<external_id>`: Exact external identifier string (1-128 characters, strictly no pipe `|`, CR `\r`, LF `\n`, tab `\t`, ASCII control characters, or leading/trailing whitespace).
- `<url>`: Exact public HTTP/HTTPS URL string (`http://` or `https://`, strictly no pipe `|`, whitespace, CR, LF, tab, or ASCII control characters).
- `<digest>`: 64-character lowercase hexadecimal SHA-256 digest of the canonical UTF-8 comment text.
- `\n`: Literal Unix newline character (`0x0A`).

### Delimiter Defense & Validation Rules

To prevent delimiter collision, ambiguous splitting, and parser evasion:
1. **Forbidden Characters**: Any presence of the pipe delimiter (`|`), carriage return (`\r`), line feed (`\n`), horizontal tab (`\t`), or ASCII control characters (`ord < 32` or `ord == 127`) in `external_id`, `url`, or `digest` causes immediate validation rejection with `ERR_INVALID_*`.
2. **Whitespace Rules**: Leading or trailing whitespace is strictly disallowed. URLs cannot contain any internal spaces.
3. **Hex Digest Normalization**: Digest strings must be strictly 64 hexadecimal characters and are normalized to lowercase before hashing.

### Manifest String and Digest

The full canonical manifest is the exact concatenation of all comment lines in ascending index order:

```text
0|id-1|https://example.gov/c1|e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855\n1|id-2|https://example.gov/c2|ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb\n
```

The canonical manifest digest is the SHA-256 hash of the UTF-8 bytes of this concatenated string, formatted as 64 lowercase hexadecimal characters:

$$\text{manifest\_digest} = \text{SHA256}(\text{canonical\_manifest\_string.encode('utf-8')}).\text{hexdigest}()$$

## 2. Invariants & Lifecycle Defenses

1. **Deterministic Ordering**: Lines must strictly follow sequential registration index (`0`, `1`, ..., `N-1`).
2. **Field Encoding**: All fields are encoded in standard UTF-8 without byte-order marks (BOM).
3. **Exact Hash Match**: `lock_batch` computes this canonical manifest string across all registered comments and verifies:
   $$\text{computed\_manifest\_digest} == \text{expected\_manifest\_digest}$$
   If there is any mismatch, `lock_batch` reverts with `ERR_MANIFEST_MISMATCH`.
4. **Immutability Post-Lock**: Once locked, comments cannot be appended or modified; only consensus clustering and challenge resolution can update eligibility or allocations.
