# Design — Public Comment Hearing Allocator

Locked implementation brief for the project UI. Future UI work must defer to
this file unless the product owner explicitly changes the product direction.

## Context

- Audience · hearing organizers, reviewers, commenters, and public observers.
- Primary job · identify the current lifecycle state, inspect its evidence, and
  perform the one valid next on-chain action without losing provenance.
- Tone · austere civic workbench; evidence-first, calm, legible, accountable.

## System

- Genre · editorial product utility.
- Macrostructure · Workbench, adapted to a live application rather than a
  marketing screenshot tour.
- Theme · Public docket: warm paper, near-black ink, civic blue action, amber
  pending, red failure, green finalized.
- Axes · light paper / roman-serif display / cool accent.
- Enrichment · typography, hairline rules, lifecycle rail, and a CSS-only
  cluster/slot diagram; no photography, fake browser chrome, or invented stats.

## Composition

- N9 edge-aligned masthead: product name, Studionet badge, network state, and
  one Wallet control. No generic marketing links.
- Lifecycle rail: Collecting → Locked → Clustered → Allocated → Challenge →
  Final, with the current state and permitted next action clearly identified.
- Main workbench: hearing summary and evidence list on the left; contextual
  action form or immutable allocation ledger on the right.
- Details use tables, definition lists, disclosure rows, and hairline sections;
  avoid repeated rounded card grids.
- Mobile order: masthead → hearing selector/state → primary action → evidence →
  ledger/challenges. The lifecycle rail becomes a horizontally scrollable
  labelled stepper inside its own region; the page itself never scrolls sideways.
- Footer Ft2: one inline provenance line with Studionet, contract address,
  Explorer link, and build revision when available.

## Tokens

All colors are OKLCH variables in `frontend/src/styles/tokens.css`; components
must never introduce raw color literals.

```css
:root {
  --color-paper: oklch(0.968 0.012 88);
  --color-paper-2: oklch(0.935 0.015 88);
  --color-ink: oklch(0.235 0.018 252);
  --color-ink-2: oklch(0.405 0.018 252);
  --color-rule: oklch(0.805 0.018 88);
  --color-accent: oklch(0.48 0.13 254);
  --color-accent-ink: oklch(0.985 0.005 88);
  --color-pending: oklch(0.67 0.14 72);
  --color-danger: oklch(0.53 0.18 28);
  --color-success: oklch(0.49 0.11 152);
  --color-focus: oklch(0.61 0.16 254);
}
```

- Display · `Newsreader`, Georgia, serif; upright only.
- Body · `IBM Plex Sans`, `Segoe UI`, sans-serif.
- Data · `IBM Plex Mono`, `Cascadia Mono`, monospace; tabular numerals.
- Spacing · named 4 px scale from 4 through 64 px.
- Radius · 2 px controls, 4 px panels; pills only for compact status labels.

## Interaction contract

- Explicit wallet chooser lists MetaMask, OKX Wallet, and Rabby only, from
  discovered EIP-6963 providers. Never silently select or reconnect a wallet.
- Reload always starts disconnected; no wallet/provider/account persistence.
- Missing contract configuration is an honest read-only "deployment pending"
  state, never a fake address.
- Every write shows preparation, wallet signature, submitted transaction,
  finality, execution result, and authoritative state readback as distinct steps.
- Buttons and forms implement default, hover, focus-visible, active, disabled,
  pending, success, and error states. Focus rings are immediate and visible.
- Use at most two motion primitives: opacity reveal and 2 px action feedback;
  transform/opacity only, with reduced-motion collapsing to ≤150 ms opacity.

## Copy and accessibility

- Use concrete verbs: Create hearing, Register comment, Lock batch, Cluster,
  Allocate, Open challenge, Resolve challenge, Finalize.
- Never call a submitted transaction successful until execution and readback
  confirm it. Error copy states what failed and the safe next step.
- Semantic landmarks, labelled controls, keyboard-operable dialogs/disclosures,
  status announcements, ≥44 px touch targets, and WCAG AA contrast are required.
- Support 320, 375, 414, 768, 1024, and 1440 px without clipped actions or
  page-level horizontal overflow.

## Hallmark guardrails

- Required CSS stamp: `Hallmark · macrostructure: Workbench · tone: austere
  civic · anchor hue: civic blue`.
- No gradients, glow/orbs, glassmorphism, oversized decorative headline,
  equal three-card feature rows, emojis as icons, fake metrics, or italic headers.
- Run the Hallmark slop test after implementation and record the result in the
  implementation report.
