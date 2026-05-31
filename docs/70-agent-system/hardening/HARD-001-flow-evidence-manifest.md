# HARD-001 - Flow Evidence Manifest and No-Diff Validation Mode

## Status

ACTIVE

## Purpose

Define the operating model for reducing repeated repository reads, avoiding false validation failures when no git diff is available, and separating implementation changes from source-of-truth closure changes.

This hardening belongs to the Dev Foundry Alita-powered agent system. It is not a Foundry Request Board product task and must not be tracked under the app `SPC/TSK/MTP` chain.

## Problem

During agentic demo runs, the workflow became slow and noisy because agents repeatedly re-read metadata, file contents, directory listings, and source-of-truth files.

Validator also had no reliable git diff or changed-files tool. It tried to infer changed files from repository state or file metadata, which caused confusion when Source-of-Truth Author legitimately updated the MTP for closure evidence after Code Author completed implementation.

## Decision

The Orchestrator owns a Flow Evidence Manifest for each selected MT execution.

The manifest is an in-memory operational packet maintained by the Orchestrator and passed to downstream child agents. It is not, by default, a repository artifact.

The manifest separates:

- implementation scope;
- source-of-truth closure scope;
- validation read scope;
- forbidden scope;
- child-agent evidence packets;
- validation limitations.

Validator must use evidence-based scope validation when git diff or changed-files tooling is unavailable.

## Flow Evidence Manifest

Minimum fields:

- flow id or selected MT reference;
- repository root;
- selected MTP path;
- selected MT id;
- selected MT owner;
- source-of-truth references;
- implementation scope;
- source-of-truth closure scope;
- validation read scope;
- forbidden scope;
- governance decision packet;
- child-agent evidence packets;
- validation mode;
- known limitations.

## Scope Layers

### Implementation scope

Files the execution agent may modify.

Examples:

- `src/requestClassifier.js`
- `tests/requestClassifier.test.js`

### Source-of-truth closure scope

Files Source-of-Truth Author may modify to record evidence, close an MT, or update traceability.

Examples:

- selected MTP file;
- source-of-truth map;
- validation summary or evidence document.

### Validation read scope

Files Validator may inspect to evaluate acceptance criteria and scope evidence.

### Forbidden scope

Files, directories, and operations that must not be touched.

## Child-Agent Evidence Packet

Every write-capable child agent must return:

- agent name;
- selected MT id;
- status;
- files read;
- files modified;
- files created;
- files deleted;
- forbidden operations performed;
- summary;
- risks or limitations.

If a category is empty, return `none` or an empty list.

## No-Diff Validation Mode

When git diff or changed-files tooling is unavailable, Validator must not attempt repo-wide modified-file discovery.

Validator must validate:

1. declared changed files from child-agent evidence;
2. source-of-truth closure files from Source-of-Truth Author evidence;
3. acceptance criteria by static inspection of target files.

Validator must report the limitation:

`Repo-wide diff proof unavailable; scope validation is evidence-based.`

Do not fail validation solely because repo-wide diff proof is unavailable.

## Timestamp Rule

File modification timestamps are advisory only.

Do not use timestamps as the primary source of truth for changed-file detection.

Do not fail validation solely because a timestamp appears newer than the selected MT start time.

## Read Budget Rule

Agents should avoid repeated reads.

Default expectations:

- Orchestrator reads only what is needed to resolve routing and maintain the manifest.
- Context Analyst is used for deeper ambiguity or broader inspection, not every routing lookup.
- Code Author reads the selected MTP and approved target files only.
- Source-of-Truth Author reads the selected MTP and evidence packet only when closing an MT.
- Validator reads the manifest and validation target files only.

Avoid `directory_tree` unless path discovery is genuinely ambiguous.

Do not repeatedly call metadata or file-read tools for the same file unless the file was changed by a prior child agent or a previous read failed.

## Expected Outcome

This hardening should reduce tool calls, reduce latency, and prevent Validator from rejecting legitimate MTP closure changes as implementation-scope violations.
