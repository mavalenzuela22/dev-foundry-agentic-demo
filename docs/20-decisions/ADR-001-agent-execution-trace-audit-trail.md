# ADR-001: Agent Execution Trace Audit Trail

## Status

ACCEPTED

## Date

2026-06-10

## Decision Owner

Dev Foundry project owner

## Context

Dev Foundry uses source-of-truth artifacts, task documents, micro-task packs, validation records, and agent prompts to govern Alita-powered agentic execution.

Those artifacts are effective for human governance, review, and continuity. However, they are not sufficient as the only audit trail when execution data needs to be consumed programmatically by dashboards, trace visualizers, risk checks, metrics, or automated review tools.

Source-of-truth documents are intentionally narrative. They contain human explanations, evidence notes, constraints, and closure records. Parsing those documents to reconstruct agent behavior is fragile and creates the same operational risk Dev Foundry is designed to avoid: broad reading, inference-heavy reconstruction, and excessive context scanning.

The Orchestrator already owns the Flow Evidence Manifest during execution. It receives routing facts, governance decisions, child-agent evidence packets, validation outcomes, limitations, and final status. Therefore, the Orchestrator is the correct hub to consolidate a machine-readable execution trace at flow boundaries.

## Decision

Dev Foundry will treat Agent Execution Trace JSON as a formal system capability.

Every meaningful delegated or governed Dev Foundry flow must produce a machine-readable Agent Execution Trace JSON when enough flow data exists.

The Agent Execution Trace JSON is the programmatic audit trail of the flow.

The Orchestrator owns trace consolidation because it is the hub in the hub-and-spoke architecture and owns the Flow Evidence Manifest.

Child agents must not know about trace consumers such as Agent Trace Guard. Child agents continue returning their normal evidence packets. The Orchestrator consolidates the trace from the Flow Evidence Manifest, governance packet, child-agent evidence packets, validation outcome, and known limitations.

Source-of-truth documents remain the governed human-readable record. Agent Execution Trace JSON becomes the structured machine-readable audit record.

## Architectural Position

Dev Foundry evidence now has three layers:

1. Flow Evidence Manifest: in-memory operational state during a flow.
2. Agent Execution Trace JSON: machine-readable audit trail emitted at flow boundary.
3. Source-of-truth / MTP / validation documents: human-readable governed record and long-term traceability.

Summary:

- Runtime control: Flow Evidence Manifest.
- Programmatic audit: Agent Execution Trace JSON.
- Governed narrative: source-of-truth documents.

## Trace Emission Scope

Trace emission is required for meaningful delegated or governed flows, including:

- Context Analyst delegated repository inspection;
- bounded identifier search;
- source-of-truth creation or update;
- governance decision flow;
- scaffold execution;
- code implementation execution;
- validation execution;
- MTP closure flow;
- blocked flow;
- validation failure flow;
- scope expansion flow.

Trace emission is not required for casual or trivial conversation, such as:

- high-level explanation without repository inspection;
- informal planning where no delegated flow occurs;
- simple Q&A without child-agent routing;
- responses where no Flow Evidence Manifest exists and no meaningful audit event occurred.

The Orchestrator may emit a small trace for read-only smoke tests when explicitly requested.

## Trace Persistence

Agent Execution Trace JSON must be persisted under:

`.dev-foundry/traces/`

Trace persistence must not pollute product source-of-truth documents or validation documents.

The Orchestrator must not directly write trace files because it is coordination-only.

When persistence is required, the Orchestrator must route trace persistence to the appropriate write-capable owner according to Dev Foundry ownership rules. In the current system, Source-of-Truth Author may persist trace files when explicitly delegated by the Orchestrator under approved or allowed trace-persistence scope.

Trace files should use stable, flow-oriented names such as:

`FLOW-YYYYMMDD-NNN.json`

or, when tied to a micro-task:

`FLOW-YYYYMMDD-MTP-XXX-MT-YYY.json`

## Minimum Trace Contract

Each persisted or emitted trace must use a compact JSON object.

Minimum fields:

- `schemaVersion`
- `flowId`
- `architecture`
- `userRequest`
- `status`
- `mode`
- `selectedMtp`
- `selectedMt`
- `events`
- `artifacts`
- `checks`
- `limitations`

Required value:

- `architecture` must be `hub-and-spoke`.

`status` should use one of:

- `COMPLETED`
- `BLOCKED`
- `NEEDS_CLARITY`
- `NEEDS_SCOPE_EXPANSION`
- `VALIDATION_FAILED`
- `UNKNOWN`

Unknown values must be represented as `null`, `unknown`, or omitted when appropriate.

## Event Contract

Each event should include, when available:

- `agent`
- `action`
- `result`
- `scope`
- `filesInspected`
- `filesTouched`
- `evidence`
- `warnings`

Events must summarize behavior. They must not contain full file contents or large repository dumps.

## Checks Contract

The `checks` object should include booleans or `unknown` / `not_applicable` for:

- `hubAndSpokeRespected`
- `sourceOfTruthFirst`
- `governanceBeforeExecution`
- `boundedScope`
- `evidenceRecorded`
- `repoWideFallbackAttempted`
- `needsScopeExpansion`

Additional checks may be added later if backward compatibility is preserved.

## Privacy and Safety Rules

Agent Execution Trace JSON must not contain:

- secrets;
- credentials;
- environment variable values;
- `.env` contents;
- full file contents;
- private local absolute paths;
- unnecessary repository dumps;
- private chain-of-thought;
- unsupported claims about runtime execution;
- fabricated evidence.

User-run runtime evidence must be labeled as user-run evidence.

Agent-run runtime evidence must only be claimed when the agent actually had runtime capability and executed the command.

## Consumer Model

Agent Trace Guard and future tools may consume Agent Execution Trace JSON.

Consumers must treat trace JSON as structured audit input, not as a reason to scan source-of-truth documents or repository contents.

Source-of-truth artifacts may be linked as metadata in the trace, but they are not the primary input for programmatic trace evaluation.

## Consequences

Positive consequences:

- Enables programmatic audit trails.
- Enables visual dashboards and trace tooling.
- Reduces the need to parse Markdown governance documents.
- Supports metrics around scope expansion, validation failures, evidence discipline, read budget, and routing behavior.
- Makes Hub-and-Spoke execution visible and inspectable.
- Supports future Agent Trace Guard demo and real operational diagnostics.

Tradeoffs:

- The Orchestrator output becomes more structured for meaningful flows.
- Trace persistence adds files under `.dev-foundry/traces/`.
- Trace schema must be kept stable enough for tooling.
- Trace emission must avoid leaking sensitive data.

Rejected alternatives:

1. Parse source-of-truth Markdown as the primary audit source.
   - Rejected because it is fragile, inference-heavy, and encourages broad reading.

2. Let each child agent emit a separate consumer-specific trace.
   - Rejected because it couples child agents to visualization tools and fragments hub-and-spoke observability.

3. Store traces under `docs/30-validation/`.
   - Rejected because not every trace is validation evidence; some traces represent blocked flows, search expansion, routing, or planning.

4. Do not persist traces.
   - Rejected because the trace is now a formal programmatic audit capability, not only a demo convenience.

## Implementation Notes

The Orchestrator prompt must require Agent Execution Trace JSON for meaningful delegated or governed flows.

The Orchestrator must include trace persistence intent in the Flow Evidence Manifest when persistence is required.

Source-of-Truth Author must be allowed to persist trace JSON under `.dev-foundry/traces/` when explicitly delegated by the Orchestrator.

Agent Trace Guard should consume pasted or persisted Agent Execution Trace JSON and must not infer flow behavior by scanning the repository.

## References

- Flow Evidence Manifest operating model.
- Hub-and-spoke Orchestrator / child-agent architecture.
- Context Analyst bounded search hardening.
- No repo-wide fallback read rule.
