"""Regression checks for the Studio schema-safe public ABI."""

import inspect

from contracts.public_comment_allocator import PublicCommentAllocator
from genlayer import u256


def test_public_abi_uses_only_studio_safe_types() -> None:
    numeric_parameters = {
        "create_hearing": {"slot_count", "registration_deadline", "challenge_deadline"},
        "register_comment": {"hearing_id"},
        "lock_batch": {"hearing_id"},
        "cluster_comments": {"hearing_id"},
        "allocate_slots": {"hearing_id"},
        "open_challenge": {"hearing_id"},
        "resolve_challenge": {"hearing_id", "challenge_id"},
        "finalize_hearing": {"hearing_id"},
        "get_hearing": {"hearing_id"},
        "get_comment_count": {"hearing_id"},
        "get_comment_by_index": {"hearing_id", "index"},
        "get_comment_by_id": {"hearing_id"},
        "get_all_comments": {"hearing_id"},
        "get_clusters": {"hearing_id"},
        "get_allocation_ledger": {"hearing_id"},
        "get_challenge": {"hearing_id", "challenge_id"},
        "get_all_challenges": {"hearing_id"},
        "get_state": {"hearing_id"},
        "get_manifest": {"hearing_id"},
    }
    json_results = {
        "cluster_comments",
        "allocate_slots",
        "resolve_challenge",
        "get_hearing",
        "get_comment_by_index",
        "get_comment_by_id",
        "get_all_comments",
        "get_clusters",
        "get_allocation_ledger",
        "get_challenge",
        "get_all_challenges",
    }

    for method_name, parameter_names in numeric_parameters.items():
        signature = inspect.signature(getattr(PublicCommentAllocator, method_name))
        for parameter_name in parameter_names:
            assert signature.parameters[parameter_name].annotation is u256
        if method_name in json_results:
            assert signature.return_annotation is str

    open_signature = inspect.signature(PublicCommentAllocator.open_challenge)
    assert open_signature.parameters["target_ids_json"].annotation is str


def test_contract_header_is_direct_dependency_magic_comment() -> None:
    first_line = open(
        PublicCommentAllocator.__module__.replace(".", "/") + ".py",
        encoding="utf-8",
    ).readline().strip()
    assert first_line.startswith('# { "Depends": "py-genlayer:')
    assert "Seq" not in first_line
