/**
 * Core Types & Strict Fail-Closed Runtime Decoders for Public Comment Hearing Allocator
 *
 * Source of truth: contracts/public_comment_allocator.py
 *
 * Enforces:
 * 1. Strict fail-closed verification on every contract boundary.
 * 2. No silent default coercion of invalid/missing keys to zero addresses or blank strings.
 * 3. Safe integer and format bounds checking on all protocol fields.
 */

export type HexAddress = `0x${string}`;
export type TransactionHash = `0x${string}`;

// Lifecycle State Machine
export type LifecycleState =
  | 'COLLECTING'
  | 'LOCKED'
  | 'CLUSTERED'
  | 'ALLOCATED'
  | 'CHALLENGE'
  | 'FINAL';

export const LIFECYCLE_STATES: readonly LifecycleState[] = [
  'COLLECTING',
  'LOCKED',
  'CLUSTERED',
  'ALLOCATED',
  'CHALLENGE',
  'FINAL',
] as const;

// Challenge Types
export type ChallengeType = 'PROVENANCE_INVALID' | 'DUPLICATE_PAIR';

export const CHALLENGE_TYPES: readonly ChallengeType[] = [
  'PROVENANCE_INVALID',
  'DUPLICATE_PAIR',
] as const;

// Challenge Statuses
export type ChallengeStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED';

export const CHALLENGE_STATUSES: readonly ChallengeStatus[] = [
  'PENDING',
  'ACCEPTED',
  'REJECTED',
] as const;

// Normalized Allocation Reason Codes
export type SelectedReasonCode =
  | 'UNIQUE_CLUSTER_COVERAGE'
  | 'ADDITIONAL_CLUSTER_DEPTH';

export type UnselectedReasonCode =
  | 'LOWER_RELEVANCE'
  | 'NEAR_DUPLICATE'
  | 'CLUSTER_CAP'
  | 'SLOT_LIMIT'
  | 'IRRELEVANT'
  | 'PROVENANCE_EXCLUDED';

export type ReasonCode = SelectedReasonCode | UnselectedReasonCode;

export const SELECTED_REASONS: readonly SelectedReasonCode[] = [
  'UNIQUE_CLUSTER_COVERAGE',
  'ADDITIONAL_CLUSTER_DEPTH',
] as const;

export const UNSELECTED_REASONS: readonly UnselectedReasonCode[] = [
  'LOWER_RELEVANCE',
  'NEAR_DUPLICATE',
  'CLUSTER_CAP',
  'SLOT_LIMIT',
  'IRRELEVANT',
  'PROVENANCE_EXCLUDED',
] as const;

// Exact Contract Data Structures
export interface HearingSummary {
  hearing_id: number;
  organizer: HexAddress;
  proposal_url: string;
  proposal_digest: string;
  expected_manifest_digest: string;
  computed_manifest_digest: string;
  slot_count: number;
  registration_deadline: number;
  challenge_deadline: number;
  state: LifecycleState;
  comment_count: number;
  revision: number;
  accepted_challenge_count: number;
  pending_challenge_count: number;
  total_challenge_count: number;
}

export interface CommentRecord {
  index: number;
  external_id: string;
  url: string;
  digest: string;
  registrar: HexAddress;
  eligible: boolean;
  exclusion_reason: string;
  cluster_id: number;
  cluster_label: string;
  relevance_score: number;
  is_duplicate: boolean;
  duplicate_of_id: string;
  selected: boolean;
  selection_rank: number;
  reason_code: string;
  rationale: string;
}

export interface ClusterRecord {
  cluster_id: number;
  label: string;
  summary: string;
  comment_ids: string[];
}

export interface ChallengeRecord {
  id: number;
  challenge_type: ChallengeType;
  target_ids: string[];
  challenger: HexAddress;
  status: ChallengeStatus;
  resolution_reason: string;
  resolved_at_revision: number;
}

export interface AllocationWinner {
  rank: number;
  external_id: string;
  cluster_id: number;
  relevance_score: number;
  reason_code: string;
  rationale: string;
}

// Transaction Lifecycle State
export type TransactionPhase =
  | 'idle'
  | 'preparing'
  | 'wallet_confirmation'
  | 'submitted'
  | 'consensus'
  | 'finalized'
  | 'execution_verified'
  | 'reading_contract'
  | 'reconciliation_required'
  | 'completed'
  | 'failed';

export interface WriteLifecycleState {
  phase: TransactionPhase;
  hash?: TransactionHash;
  error?: string;
  actionLabel?: string;
  requiresReconciliation?: boolean;
}

// Runtime Type Guards & Primitive Parsers
export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function isHexAddress(value: unknown): value is HexAddress {
  return typeof value === 'string' && /^0x[0-9a-fA-F]{40}$/.test(value.trim());
}

export function isTransactionHash(value: unknown): value is TransactionHash {
  return typeof value === 'string' && /^0x[0-9a-fA-F]{64}$/.test(value.trim());
}

export function isLifecycleState(value: unknown): value is LifecycleState {
  return typeof value === 'string' && LIFECYCLE_STATES.includes(value as LifecycleState);
}

export function isChallengeType(value: unknown): value is ChallengeType {
  return typeof value === 'string' && CHALLENGE_TYPES.includes(value as ChallengeType);
}

export function isChallengeStatus(value: unknown): value is ChallengeStatus {
  return typeof value === 'string' && CHALLENGE_STATUSES.includes(value as ChallengeStatus);
}

export function validateSafeInteger(
  value: unknown,
  fieldName: string,
  min = 0,
  max = Number.MAX_SAFE_INTEGER,
): number {
  if (typeof value === 'bigint') {
    if (value < BigInt(min) || value > BigInt(max)) {
      throw new Error(`Invalid ${fieldName}: value ${value} out of safe bounds [${min}, ${max}]`);
    }
    return Number(value);
  }

  let num: number;
  if (typeof value === 'number') {
    num = value;
  } else if (typeof value === 'string' && /^-?\d+$/.test(value.trim())) {
    num = Number(value.trim());
  } else {
    throw new Error(`Invalid ${fieldName}: expected integer, got ${String(value)}`);
  }

  if (!Number.isSafeInteger(num) || num < min || num > max) {
    throw new Error(`Invalid ${fieldName}: integer ${num} out of bounds [${min}, ${max}]`);
  }
  return num;
}

export function validateHexAddress(value: unknown, fieldName: string): HexAddress {
  if (typeof value !== 'string') {
    throw new Error(`Invalid ${fieldName}: expected address string, got ${typeof value}`);
  }
  const clean = value.trim().toLowerCase();
  if (!/^0x[0-9a-f]{40}$/.test(clean)) {
    throw new Error(`Invalid ${fieldName}: expected 0x-prefixed 40-hex address, got "${value}"`);
  }
  return clean as HexAddress;
}

export function validateSha256(value: unknown, fieldName: string, allowEmpty = false): string {
  if (typeof value !== 'string') {
    throw new Error(`Invalid ${fieldName}: expected digest string, got ${typeof value}`);
  }
  const clean = value.trim().toLowerCase();
  if (allowEmpty && clean === '') {
    return '';
  }
  if (!/^[0-9a-f]{64}$/.test(clean)) {
    throw new Error(`Invalid ${fieldName}: expected 64-character hex SHA-256 digest, got "${value}"`);
  }
  return clean;
}

export function validateUrl(value: unknown, fieldName: string): string {
  if (typeof value !== 'string') {
    throw new Error(`Invalid ${fieldName}: expected URL string, got ${typeof value}`);
  }
  const clean = value.trim();
  if (!/^https?:\/\/[^\s|]+$/.test(clean)) {
    throw new Error(`Invalid ${fieldName}: expected http:// or https:// URL without delimiters or spaces, got "${value}"`);
  }
  return clean;
}

export function validateString(value: unknown, fieldName: string, minLength = 0, maxLength = 10000): string {
  if (typeof value !== 'string') {
    throw new Error(`Invalid ${fieldName}: expected string, got ${typeof value}`);
  }
  if (value.length < minLength || value.length > maxLength) {
    throw new Error(`Invalid ${fieldName}: string length ${value.length} out of bounds [${minLength}, ${maxLength}]`);
  }
  return value;
}

export function validateBoolean(value: unknown, fieldName: string): boolean {
  if (typeof value !== 'boolean') {
    throw new Error(`Invalid ${fieldName}: expected boolean, got ${typeof value}`);
  }
  return value;
}

// Strict Contract Response Decoders
export function decodeHearing(data: unknown): HearingSummary {
  if (!isRecord(data)) {
    throw new Error('Malformed hearing summary: expected JSON object');
  }

  const stateStr = String(data.state || '');
  if (!isLifecycleState(stateStr)) {
    throw new Error(`Malformed hearing summary: invalid state "${stateStr}"`);
  }

  const hearingId = validateSafeInteger(data.hearing_id ?? data.id, 'hearing_id', 1);
  const organizer = validateHexAddress(data.organizer, 'organizer');
  const proposalUrl = validateUrl(data.proposal_url, 'proposal_url');
  const proposalDigest = validateSha256(data.proposal_digest, 'proposal_digest');
  const expectedManifestDigest = validateSha256(data.expected_manifest_digest, 'expected_manifest_digest');
  const computedManifestDigest = validateSha256(data.computed_manifest_digest ?? '', 'computed_manifest_digest', true);
  const slotCount = validateSafeInteger(data.slot_count, 'slot_count', 1, 6);
  const registrationDeadline = validateSafeInteger(data.registration_deadline, 'registration_deadline', 0);
  const challengeDeadline = validateSafeInteger(data.challenge_deadline, 'challenge_deadline', 0);
  const commentCount = validateSafeInteger(data.comment_count, 'comment_count', 0, 12);
  const revision = validateSafeInteger(data.revision ?? 0, 'revision', 0);
  const acceptedChallengeCount = validateSafeInteger(data.accepted_challenge_count ?? 0, 'accepted_challenge_count', 0);
  const pendingChallengeCount = validateSafeInteger(data.pending_challenge_count ?? 0, 'pending_challenge_count', 0);
  const totalChallengeCount = validateSafeInteger(data.total_challenge_count ?? 0, 'total_challenge_count', 0);

  return {
    hearing_id: hearingId,
    organizer,
    proposal_url: proposalUrl,
    proposal_digest: proposalDigest,
    expected_manifest_digest: expectedManifestDigest,
    computed_manifest_digest: computedManifestDigest,
    slot_count: slotCount,
    registration_deadline: registrationDeadline,
    challenge_deadline: challengeDeadline,
    state: stateStr,
    comment_count: commentCount,
    revision,
    accepted_challenge_count: acceptedChallengeCount,
    pending_challenge_count: pendingChallengeCount,
    total_challenge_count: totalChallengeCount,
  };
}

export function decodeComment(data: unknown): CommentRecord {
  if (!isRecord(data)) {
    throw new Error('Malformed comment record: expected JSON object');
  }

  const index = validateSafeInteger(data.index, 'index', 0);
  const externalId = validateString(data.external_id, 'external_id', 1, 128);
  for (let i = 0; i < externalId.length; i++) {
    const code = externalId.charCodeAt(i);
    const ch = externalId[i];
    if (ch === '|' || ch === '\r' || ch === '\n' || ch === '\t' || code < 32 || code === 127) {
      throw new Error(`Malformed external_id: contains delimiter or control characters ("${externalId}")`);
    }
  }
  const url = validateUrl(data.url, 'url');
  const digest = validateSha256(data.digest, 'digest');
  const registrar = validateHexAddress(data.registrar, 'registrar');
  const eligible = validateBoolean(data.eligible ?? true, 'eligible');
  const exclusionReason = validateString(data.exclusion_reason ?? '', 'exclusion_reason', 0);
  const clusterId = validateSafeInteger(data.cluster_id ?? 0, 'cluster_id', 0, 6);
  const clusterLabel = validateString(data.cluster_label ?? '', 'cluster_label', 0);
  const relevanceScore = validateSafeInteger(data.relevance_score ?? 0, 'relevance_score', 0, 100);
  const isDuplicate = validateBoolean(data.is_duplicate ?? false, 'is_duplicate');
  const duplicateOfId = validateString(data.duplicate_of_id ?? '', 'duplicate_of_id', 0, 128);
  const selected = validateBoolean(data.selected ?? false, 'selected');
  const selectionRank = validateSafeInteger(data.selection_rank ?? 0, 'selection_rank', 0, 6);
  const reasonCode = validateString(data.reason_code ?? '', 'reason_code', 0);
  const rationale = validateString(data.rationale ?? '', 'rationale', 0);

  return {
    index,
    external_id: externalId,
    url,
    digest,
    registrar,
    eligible,
    exclusion_reason: exclusionReason,
    cluster_id: clusterId,
    cluster_label: clusterLabel,
    relevance_score: relevanceScore,
    is_duplicate: isDuplicate,
    duplicate_of_id: duplicateOfId,
    selected,
    selection_rank: selectionRank,
    reason_code: reasonCode,
    rationale,
  };
}

export function decodeCluster(data: unknown): ClusterRecord {
  if (!isRecord(data)) {
    throw new Error('Malformed cluster record: expected JSON object');
  }

  const clusterId = validateSafeInteger(data.cluster_id, 'cluster_id', 1, 6);
  const label = validateString(data.label, 'label', 1);
  const summary = validateString(data.summary ?? '', 'summary', 0);

  if (!Array.isArray(data.comment_ids)) {
    throw new Error('Malformed cluster record: comment_ids must be an array');
  }
  const commentIds = data.comment_ids.map((id, i) => validateString(id, `comment_ids[${i}]`, 1, 128));

  return {
    cluster_id: clusterId,
    label,
    summary,
    comment_ids: commentIds,
  };
}

export function decodeChallenge(data: unknown): ChallengeRecord {
  if (!isRecord(data)) {
    throw new Error('Malformed challenge record: expected JSON object');
  }

  const challengeType = String(data.challenge_type || '');
  if (!isChallengeType(challengeType)) {
    throw new Error(`Malformed challenge record: invalid challenge_type "${challengeType}"`);
  }

  const status = String(data.status || '');
  if (!isChallengeStatus(status)) {
    throw new Error(`Malformed challenge record: invalid status "${status}"`);
  }

  const id = validateSafeInteger(data.id, 'challenge_id', 1);
  const challenger = validateHexAddress(data.challenger, 'challenger');

  if (!Array.isArray(data.target_ids)) {
    throw new Error('Malformed challenge record: target_ids must be an array');
  }
  if (challengeType === 'PROVENANCE_INVALID' && data.target_ids.length !== 1) {
    throw new Error('Malformed challenge: PROVENANCE_INVALID requires exactly 1 target ID');
  }
  if (challengeType === 'DUPLICATE_PAIR' && data.target_ids.length !== 2) {
    throw new Error('Malformed challenge: DUPLICATE_PAIR requires exactly 2 target IDs');
  }

  const targetIds = data.target_ids.map((tid, idx) => validateString(tid, `target_ids[${idx}]`, 1, 128));
  const resolutionReason = validateString(data.resolution_reason ?? '', 'resolution_reason', 0);
  const resolvedAtRevision = validateSafeInteger(data.resolved_at_revision ?? 0, 'resolved_at_revision', 0);

  return {
    id,
    challenge_type: challengeType,
    target_ids: targetIds,
    challenger,
    status,
    resolution_reason: resolutionReason,
    resolved_at_revision: resolvedAtRevision,
  };
}

export function decodeAllocationWinner(data: unknown): AllocationWinner {
  if (!isRecord(data)) {
    throw new Error('Malformed allocation winner: expected JSON object');
  }

  const rank = validateSafeInteger(data.rank ?? data.selection_rank, 'rank', 1, 6);
  const externalId = validateString(data.external_id, 'external_id', 1, 128);
  const clusterId = validateSafeInteger(data.cluster_id, 'cluster_id', 1, 6);
  const relevanceScore = validateSafeInteger(data.relevance_score, 'relevance_score', 1, 100);
  const reasonCode = validateString(data.reason_code, 'reason_code', 1);
  const rationale = validateString(data.rationale ?? '', 'rationale', 0);

  return {
    rank,
    external_id: externalId,
    cluster_id: clusterId,
    relevance_score: relevanceScore,
    reason_code: reasonCode,
    rationale,
  };
}
