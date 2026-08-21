# Public Comment Hearing Allocator — PRE_DEPLOY Re-review R3

- Revision: `PCHA-PREDEPLOY-ED01D0BF2D2B1952`
- Manifest SHA-256: `ED01D0BF2D2B19526B05FC7E0CF0817081D8DF5AF9C35DC54499AD70F9E21EE9`
- Contract SHA-256: `30B299CF280D4D320FFCFA48171601333A23AC541C42251DBBC8740977579AF1`
- Locked deployer: `0xBf90Af1bc61314775d57B641b89c1f702a93b40D`
- Network/classification: Studionet / `INTENTIONALLY FROZEN`

## Studio schema blocker and correction

The user performed a pre-signature Studio schema probe. Studio returned
`invalid_contract`; GenVM log stated `runner comment does not start with version,
using default v0.1.0`. The first line used a profiling-style `Seq` wrapper.
Current official contract documentation requires the direct first-line magic
comment `# { "Depends": "py-genlayer:<pin>" }`. The source now uses that exact
official form. No signature, deployment, or write occurred.

## Verification

- Canonical manifest generate/verify: PASS, exact hash above.
- `genvm-lint check`: PASS, 20 methods.
- Contract SHA-256: exact hash above.
- pytest: 48 PASS; runtime smoke PASS; compileall PASS; 55 dependencies compatible.
- Frontend lint/typecheck PASS; 93 tests PASS; production build PASS with the
  previously disclosed non-blocking 798.80 kB chunk warning.

Primary verdict: `APPROVED FOR ANONYMOUS PRE_DEPLOY RE-REVIEW` for this exact
revision only. A new Studio schema probe/deployment remains blocked until the
anonymous reviewer approves this revision.
