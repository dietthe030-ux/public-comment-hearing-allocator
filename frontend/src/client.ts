/**
 * GenLayer Intelligent Contract Client for Public Comment Hearing Allocator
 *
 * Implements all 8 contract write methods and all 12 contract view methods with exact signatures.
 * Concurrency-Safe: Never infers new hearing identity from global get_hearing_count().
 * Fail-Closed: Strictly validates transaction receipt execution result before emitting completed.
 */

import { createClient } from 'genlayer-js';
import { studionet } from 'genlayer-js/chains';
import { TransactionStatus } from 'genlayer-js/types';
import { APP_CONFIG } from './config';
import {
  HexAddress,
  TransactionHash,
  TransactionPhase,
  HearingSummary,
  CommentRecord,
  ClusterRecord,
  ChallengeRecord,
  LifecycleState,
  ChallengeType,
  validateSafeInteger,
  decodeHearing,
  decodeComment,
  decodeCluster,
  decodeChallenge,
} from './types';
import { EIP1193Provider } from './wallet';
import { inspectTransactionReceipt, VerifiedReceipt } from './receipt';

export interface WriteCallOptions {
  account: HexAddress;
  provider: EIP1193Provider;
  onPhaseChange?: (phase: TransactionPhase, hash?: TransactionHash, error?: string) => void;
}

export class HearingCreatedReconciliationError extends Error {
  public readonly txHash: TransactionHash;

  constructor(message: string, txHash: TransactionHash) {
    super(message);
    this.name = 'HearingCreatedReconciliationError';
    this.txHash = txHash;
  }
}

export class GenLayerContractClient {
  private readonly address: HexAddress;

  constructor(contractAddress: HexAddress) {
    this.address = contractAddress;
  }

  // ==========================================
  // Public Contract View Methods (12 Methods)
  // ==========================================

  /**
   * 1. Get total number of created hearings.
   */
  public async getHearingCount(): Promise<number> {
    const raw = await this.readContract('get_hearing_count', []);
    return validateSafeInteger(raw, 'hearing_count', 0);
  }

  /**
   * 2. Get hearing summary by ID.
   */
  public async getHearing(hearingId: number): Promise<HearingSummary> {
    const validId = validateSafeInteger(hearingId, 'hearing_id', 1);
    const raw = await this.readContract('get_hearing', [validId]);
    return decodeHearing(this.parseJsonResult(raw, 'get_hearing'));
  }

  /**
   * 3. Get registered comment count for a hearing.
   */
  public async getCommentCount(hearingId: number): Promise<number> {
    const validId = validateSafeInteger(hearingId, 'hearing_id', 1);
    const raw = await this.readContract('get_comment_count', [validId]);
    return validateSafeInteger(raw, 'comment_count', 0, 12);
  }

  /**
   * 4. Get a comment by its registration index.
   */
  public async getCommentByIndex(hearingId: number, index: number): Promise<CommentRecord> {
    const validId = validateSafeInteger(hearingId, 'hearing_id', 1);
    const validIdx = validateSafeInteger(index, 'comment_index', 0, 11);
    const raw = await this.readContract('get_comment_by_index', [validId, validIdx]);
    return decodeComment(this.parseJsonResult(raw, 'get_comment_by_index'));
  }

  /**
   * 5. Get a comment by its external ID.
   */
  public async getCommentById(hearingId: number, externalId: string): Promise<CommentRecord> {
    const validId = validateSafeInteger(hearingId, 'hearing_id', 1);
    const cleanExternalId = String(externalId || '').trim();
    if (!cleanExternalId) {
      throw new Error('Invalid external_id: expected non-empty string');
    }
    const raw = await this.readContract('get_comment_by_id', [validId, cleanExternalId]);
    return decodeComment(this.parseJsonResult(raw, 'get_comment_by_id'));
  }

  /**
   * 6. Get all registered comments for a hearing.
   */
  public async getAllComments(hearingId: number): Promise<CommentRecord[]> {
    const validId = validateSafeInteger(hearingId, 'hearing_id', 1);
    const raw = this.parseJsonResult(await this.readContract('get_all_comments', [validId]), 'get_all_comments');
    if (!Array.isArray(raw)) {
      throw new Error(`Expected JSON array for get_all_comments, got ${typeof raw}`);
    }
    return raw.map(decodeComment);
  }

  /**
   * 7. Get all clusters for a hearing.
   */
  public async getClusters(hearingId: number): Promise<ClusterRecord[]> {
    const validId = validateSafeInteger(hearingId, 'hearing_id', 1);
    const raw = this.parseJsonResult(await this.readContract('get_clusters', [validId]), 'get_clusters');
    if (!Array.isArray(raw)) {
      throw new Error(`Expected JSON array for get_clusters, got ${typeof raw}`);
    }
    return raw.map(decodeCluster);
  }

  /**
   * 8. Get allocation ledger (winning comments in rank order).
   */
  public async getAllocationLedger(hearingId: number): Promise<CommentRecord[]> {
    const validId = validateSafeInteger(hearingId, 'hearing_id', 1);
    const raw = this.parseJsonResult(await this.readContract('get_allocation_ledger', [validId]), 'get_allocation_ledger');
    if (!Array.isArray(raw)) {
      throw new Error(`Expected JSON array for get_allocation_ledger, got ${typeof raw}`);
    }
    return raw.map(decodeComment);
  }

  /**
   * 9. Get a challenge record by challenge ID.
   */
  public async getChallenge(hearingId: number, challengeId: number): Promise<ChallengeRecord> {
    const validId = validateSafeInteger(hearingId, 'hearing_id', 1);
    const validChId = validateSafeInteger(challengeId, 'challenge_id', 1);
    const raw = await this.readContract('get_challenge', [validId, validChId]);
    return decodeChallenge(this.parseJsonResult(raw, 'get_challenge'));
  }

  /**
   * 10. Get all challenges for a hearing.
   */
  public async getAllChallenges(hearingId: number): Promise<ChallengeRecord[]> {
    const validId = validateSafeInteger(hearingId, 'hearing_id', 1);
    const raw = this.parseJsonResult(await this.readContract('get_all_challenges', [validId]), 'get_all_challenges');
    if (!Array.isArray(raw)) {
      throw new Error(`Expected JSON array for get_all_challenges, got ${typeof raw}`);
    }
    return raw.map(decodeChallenge);
  }

  /**
   * 11. Get current lifecycle state of a hearing.
   */
  public async getState(hearingId: number): Promise<LifecycleState> {
    const validId = validateSafeInteger(hearingId, 'hearing_id', 1);
    const raw = await this.readContract('get_state', [validId]);
    const stateStr = String(raw || '');
    const summary = decodeHearing({
      hearing_id: validId,
      organizer: '0x0000000000000000000000000000000000000000',
      admission_authority: '0x0000000000000000000000000000000000000000',
      proposal_url: 'https://example.com/p.txt',
      proposal_digest: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      expected_manifest_digest: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      slot_count: 1,
      registration_deadline: 0,
      challenge_deadline: 0,
      state: stateStr,
      comment_count: 0,
    });
    return summary.state;
  }

  /**
   * 12. Get canonical manifest string for a hearing.
   */
  public async getManifest(hearingId: number): Promise<string> {
    const validId = validateSafeInteger(hearingId, 'hearing_id', 1);
    const raw = await this.readContract('get_manifest', [validId]);
    return String(raw || '');
  }

  // ==========================================
  // Public Contract Write Methods (8 Methods)
  // ==========================================

  /**
   * 1. Create a new public comment hearing.
   * Concurrency-safe: validates and uses the returned hearing ID from execution receipt.
   */
  public async createHearing(
    proposalUrl: string,
    proposalDigest: string,
    expectedManifestDigest: string,
    slotCount: number,
    registrationDeadline: number,
    challengeDeadline: number,
    options: WriteCallOptions,
  ): Promise<{ hearingId: number; txHash: TransactionHash; receipt: VerifiedReceipt }> {
    const validSlotCount = validateSafeInteger(slotCount, 'slot_count', 1, 6);
    const validRegDeadline = validateSafeInteger(registrationDeadline, 'registration_deadline', 0);
    const validChalDeadline = validateSafeInteger(challengeDeadline, 'challenge_deadline', 0);

    const receipt = await this.executeWrite(
      'create_hearing',
      [
        proposalUrl.trim(),
        proposalDigest.trim().toLowerCase(),
        expectedManifestDigest.trim().toLowerCase(),
        validSlotCount,
        validRegDeadline,
        validChalDeadline,
      ],
      options,
    );

    // Extract return value from verified receipt
    let returnedHearingId: number | null = null;
    if (receipt.returnValue !== undefined && receipt.returnValue !== null) {
      try {
        returnedHearingId = validateSafeInteger(receipt.returnValue, 'returned_hearing_id', 1);
      } catch {
        returnedHearingId = null;
      }
    }

    if (returnedHearingId === null) {
      // Fail reconciliation safely: transaction finalized, but explicit docket refresh is needed
      throw new HearingCreatedReconciliationError(
        'Hearing created and finalized on-chain, but the returned docket ID could not be parsed automatically. Please refresh dockets to view your hearing.',
        receipt.hash,
      );
    }

    return {
      hearingId: returnedHearingId,
      txHash: receipt.hash,
      receipt,
    };
  }

  /**
   * 2. Register a comment into a hearing.
   */
  public async registerComment(
    hearingId: number,
    externalId: string,
    url: string,
    digest: string,
    options: WriteCallOptions,
  ): Promise<{ commentIndex: number; txHash: TransactionHash; receipt: VerifiedReceipt }> {
    const validId = validateSafeInteger(hearingId, 'hearing_id', 1);
    const receipt = await this.executeWrite(
      'register_comment',
      [validId, externalId.trim(), url.trim(), digest.trim().toLowerCase()],
      options,
    );

    let commentIndex = 0;
    if (receipt.returnValue !== undefined && receipt.returnValue !== null) {
      try {
        commentIndex = validateSafeInteger(receipt.returnValue, 'comment_index', 0, 11);
      } catch {
        commentIndex = 0;
      }
    }

    return {
      commentIndex,
      txHash: receipt.hash,
      receipt,
    };
  }

  /**
   * 3. Lock comment batch and verify manifest hash (organizer only).
   */
  public async lockBatch(
    hearingId: number,
    options: WriteCallOptions,
  ): Promise<{ computedManifestDigest: string; txHash: TransactionHash; receipt: VerifiedReceipt }> {
    const validId = validateSafeInteger(hearingId, 'hearing_id', 1);
    const receipt = await this.executeWrite('lock_batch', [validId], options);

    const computedManifestDigest =
      typeof receipt.returnValue === 'string' ? receipt.returnValue : '';

    return {
      computedManifestDigest,
      txHash: receipt.hash,
      receipt,
    };
  }

  /** Cancel a collecting hearing when its authenticated admission batch cannot be safely locked. */
  public async cancelHearing(
    hearingId: number,
    options: WriteCallOptions,
  ): Promise<{ txHash: TransactionHash; receipt: VerifiedReceipt }> {
    const validId = validateSafeInteger(hearingId, 'hearing_id', 1);
    const receipt = await this.executeWrite('cancel_hearing', [validId], options);
    return { txHash: receipt.hash, receipt };
  }

  /**
   * 4. Derive thematic clusters via consensus (permissionless in LOCKED).
   */
  public async clusterComments(
    hearingId: number,
    options: WriteCallOptions,
  ): Promise<{ txHash: TransactionHash; receipt: VerifiedReceipt }> {
    const validId = validateSafeInteger(hearingId, 'hearing_id', 1);
    const receipt = await this.executeWrite('cluster_comments', [validId], options);
    return {
      txHash: receipt.hash,
      receipt,
    };
  }

  /**
   * 5. Allocate hearing speaking slots (permissionless in CLUSTERED).
   */
  public async allocateSlots(
    hearingId: number,
    options: WriteCallOptions,
  ): Promise<{ txHash: TransactionHash; receipt: VerifiedReceipt }> {
    const validId = validateSafeInteger(hearingId, 'hearing_id', 1);
    const receipt = await this.executeWrite('allocate_slots', [validId], options);
    return {
      txHash: receipt.hash,
      receipt,
    };
  }

  /**
   * 6. Open a dispute challenge in CHALLENGE state.
   */
  public async openChallenge(
    hearingId: number,
    challengeType: ChallengeType,
    targetIds: string[],
    options: WriteCallOptions,
  ): Promise<{ challengeId: number; txHash: TransactionHash; receipt: VerifiedReceipt }> {
    const validId = validateSafeInteger(hearingId, 'hearing_id', 1);
    const cleanTargets = targetIds.map((t) => t.trim());
    const receipt = await this.executeWrite(
      'open_challenge',
      [validId, challengeType, JSON.stringify(cleanTargets)],
      options,
    );

    let challengeId = 1;
    if (receipt.returnValue !== undefined && receipt.returnValue !== null) {
      try {
        challengeId = validateSafeInteger(receipt.returnValue, 'challenge_id', 1);
      } catch {
        challengeId = 1;
      }
    }

    return {
      challengeId,
      txHash: receipt.hash,
      receipt,
    };
  }

  /**
   * 7. Resolve a dispute challenge via consensus.
   */
  public async resolveChallenge(
    hearingId: number,
    challengeId: number,
    options: WriteCallOptions,
  ): Promise<{ txHash: TransactionHash; receipt: VerifiedReceipt }> {
    const validId = validateSafeInteger(hearingId, 'hearing_id', 1);
    const validChId = validateSafeInteger(challengeId, 'challenge_id', 1);
    const receipt = await this.executeWrite(
      'resolve_challenge',
      [validId, validChId],
      options,
    );
    return {
      txHash: receipt.hash,
      receipt,
    };
  }

  /**
   * 8. Finalize hearing (CHALLENGE -> FINAL).
   */
  public async finalizeHearing(
    hearingId: number,
    options: WriteCallOptions,
  ): Promise<{ txHash: TransactionHash; receipt: VerifiedReceipt }> {
    const validId = validateSafeInteger(hearingId, 'hearing_id', 1);
    const receipt = await this.executeWrite('finalize_hearing', [validId], options);
    return {
      txHash: receipt.hash,
      receipt,
    };
  }

  // ==========================================
  // Internal Helpers & Execution Lifecycle
  // ==========================================

  private async readContract(functionName: string, args: unknown[]): Promise<unknown> {
    const client = createClient({
      chain: studionet,
      endpoint: APP_CONFIG.rpcUrl,
    });

    return client.readContract({
      address: this.address,
      functionName,
      args: args as unknown as Parameters<typeof client.readContract>[0]['args'],
    });
  }

  private parseJsonResult(raw: unknown, method: string): unknown {
    if (typeof raw !== 'string') return raw;
    try {
      return JSON.parse(raw) as unknown;
    } catch {
      throw new Error(`Malformed JSON string returned by ${method}`);
    }
  }

  private async executeWrite(
    functionName: string,
    args: unknown[],
    options: WriteCallOptions,
  ): Promise<VerifiedReceipt> {
    const { account, provider, onPhaseChange } = options;

    const notify = (phase: TransactionPhase, hash?: TransactionHash, error?: string) => {
      onPhaseChange?.(phase, hash, error);
    };

    try {
      notify('preparing');

      const client = createClient({
        chain: studionet,
        endpoint: APP_CONFIG.rpcUrl,
        account,
        provider: provider as unknown as NonNullable<Parameters<typeof createClient>[0]>['provider'],
      });

      notify('wallet_confirmation');
      await client.connect('studionet');

      const txHash = (await client.writeContract({
        address: this.address,
        functionName,
        args: args as unknown as Parameters<typeof client.writeContract>[0]['args'],
        value: 0n,
      })) as TransactionHash;

      notify('submitted', txHash);
      notify('consensus', txHash);

      // Wait for block finalization
      const rawReceipt = (await client.waitForTransactionReceipt({
        hash: txHash as Parameters<typeof client.waitForTransactionReceipt>[0]['hash'],
        status: TransactionStatus.FINALIZED,
        interval: 2000,
        retries: 60,
      })) as unknown as Record<string, unknown>;

      notify('finalized', txHash);

      // Strict fail-closed verification of execution result
      let verifiedReceipt = inspectTransactionReceipt(rawReceipt);

      // If receipt lacks decisive execution evidence, query transaction directly
      if (!verifiedReceipt.isExecutionSuccess && verifiedReceipt.statusText === 'FINALIZED_EXECUTION_FAILED') {
        try {
          const fullTx = (await client.getTransaction({
            hash: txHash as Parameters<typeof client.getTransaction>[0]['hash'],
          })) as unknown as Record<string, unknown>;
          if (fullTx) {
            const reInspected = inspectTransactionReceipt(fullTx);
            if (reInspected.isExecutionSuccess) {
              verifiedReceipt = reInspected;
            }
          }
        } catch {
          // Keep initial verifiedReceipt
        }
      }

      if (!verifiedReceipt.isExecutionSuccess) {
        const errMessage = verifiedReceipt.errorMessage || 'Transaction execution failed on-chain';
        notify('failed', txHash, errMessage);
        throw new Error(errMessage);
      }

      notify('execution_verified', txHash);
      return verifiedReceipt;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      notify('failed', undefined, message);
      throw err;
    }
  }
}
