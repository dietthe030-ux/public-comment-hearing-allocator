"""Runtime-parity smoke checks using the installed genlayer-test direct VM."""

from datetime import datetime, timezone
import hashlib
import json
from pathlib import Path

from gltest.direct import VMContext, create_address, deploy_contract


CONTRACT = Path(__file__).parents[1] / "contracts" / "public_comment_allocator.py"


def main() -> None:
    organizer = create_address("organizer")
    registrar = organizer
    vm = VMContext()
    vm.sender = organizer
    vm.warp("2026-08-22T00:00:00Z")

    now = int(datetime(2026, 8, 22, tzinfo=timezone.utc).timestamp())
    proposal_url = "https://example.gov/proposal"
    comment_url = "https://example.gov/comment-1"
    proposal_text = "Proposal text"
    comment_text = "A relevant public comment"
    proposal_digest = hashlib.sha256(proposal_text.encode()).hexdigest()
    comment_digest = hashlib.sha256(comment_text.encode()).hexdigest()
    manifest = f"0|comment-1|{comment_url}|{comment_digest}\n"
    manifest_digest = hashlib.sha256(manifest.encode()).hexdigest()
    with vm.activate():
        contract = deploy_contract(CONTRACT, vm)
        assert int(contract.get_hearing_count()) == 0

        hearing_id = contract.create_hearing(
            proposal_url,
            proposal_digest,
            manifest_digest,
            1,
            now + 60,
            now + 120,
        )
        assert int(hearing_id) == 1
        assert int(contract.get_hearing_count()) == 1

        vm.sender = registrar
        index = contract.register_comment(
            1,
            "comment-1",
            comment_url,
            comment_digest,
        )
        assert int(index) == 0
        assert int(contract.get_comment_count(1)) == 1

        hearing = json.loads(contract.get_hearing(1))
        assert hearing["organizer"].lower() == "0x" + bytes(organizer).hex()
        assert hearing["state"] == "COLLECTING"

        vm.sender = organizer
        assert contract.lock_batch(1) == manifest_digest

        llm_result = json.dumps(
            {
                "clusters": [
                    {"cluster_id": 1, "label": "Access", "summary": "Access"}
                ],
                "evaluations": [
                    {
                        "external_id": "comment-1",
                        "cluster_id": 1,
                        "relevance_score": 90,
                        "is_duplicate": False,
                        "duplicate_of_id": "",
                        "is_irrelevant": False,
                    }
                ],
            }
        )
        vm.mock_web(proposal_url, {"method": "GET", "status": 200, "body": proposal_text})
        vm.mock_web(comment_url, {"method": "GET", "status": 200, "body": comment_text})
        vm.mock_llm("impartial regulatory hearing analyst", llm_result)

        clustered = json.loads(contract.cluster_comments(1))
        assert clustered["state"] == "CLUSTERED"
        selected = json.loads(contract.allocate_slots(1))
        assert selected[0]["external_id"] == "comment-1"
        assert contract.get_state(1) == "CHALLENGE"

    print("RUNTIME_SMOKE_PASS")


if __name__ == "__main__":
    main()
