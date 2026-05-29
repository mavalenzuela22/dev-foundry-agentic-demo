# Alita Agent Blueprint

## Purpose

This file sketches the first Dev Foundry agent system to model in Alita / EliteA.

The goal is not to build a full platform yet.

The goal is to create a small agentic workflow that can be tested against Foundry Request Board, the controlled test application in this repository.

## Recommended Alita Shape

Use one main orchestrator agent and several specialist agents.

The first version may be implemented as either:

- one Alita pipeline that calls specialist agents, or
- one orchestrator agent that has specialist agents attached as callable resources.

The pipeline option is preferred once the flow is stable because it makes the demo easier to explain visually.

## Agent 1: Dev Foundry Orchestrator

### Responsibility

Controls the workflow from request to final answer.

### Main Duties

- Receive the engineer request.
- Classify the request intent.
- Decide whether the request belongs in Understanding Mode or Execution Mode.
- Delegate repository inspection to Context Analyst.
- Delegate readiness review to Governance Agent.
- Delegate code changes only after approval.
- Delegate validation after changes.
- Return a final human-readable report.

### Must Not

- Modify files directly.
- Skip governance review.
- Invent project decisions.
- Continue execution when scope is unclear.

### Output Contract

- Request summary.
- Current mode.
- Delegation steps performed.
- Governance result.
- Execution result if any.
- Final recommendation.

## Agent 2: Context Analyst

### Responsibility

Reads repository context and summarizes what matters for the request.

### Main Duties

- Inspect allowed repository files.
- Identify relevant source files, tests, and documentation.
- Explain the current behavior of Foundry Request Board.
- Identify possible files to modify.

### Must Not

- Modify files.
- Run destructive operations.
- Assume missing behavior.

### Output Contract

- Files inspected.
- Relevant findings.
- Candidate modification targets.
- Uncertainties.

## Agent 3: Governance Agent

### Responsibility

Decides whether the request is ready for bounded execution.

### Main Duties

- Check clarity.
- Check scope.
- Check allowed files.
- Check forbidden files.
- Check acceptance criteria.
- Decide APPROVED, BLOCKED, or NEEDS_CLARITY.

### Must Not

- Write code.
- Modify files.
- Approve broad or unclear execution.

### Output Contract

- Decision.
- Reason.
- Approved files if any.
- Forbidden files.
- Required acceptance criteria.
- Safe next step.

## Agent 4: Code Author

### Responsibility

Applies bounded code, test, or documentation changes after governance approval.

### Main Duties

- Modify only approved files.
- Keep changes minimal.
- Preserve existing behavior unless explicitly approved.
- Add or update tests when required.
- Report exact file changes.

### Must Not

- Modify files outside the approved list.
- Add dependencies unless explicitly approved.
- Touch secrets.
- Commit, push, deploy, or install packages during the demo.

### Output Contract

- Files modified.
- Summary of changes.
- Assumptions used.
- Anything intentionally not changed.

## Agent 5: Validator

### Responsibility

Checks whether the result satisfies the acceptance criteria.

### Main Duties

- Review changed files.
- Compare result against acceptance criteria.
- Identify risks or gaps.
- Confirm that forbidden areas were not changed.

### Must Not

- Modify files unless a future task explicitly allows validator repair.
- Approve results without evidence.

### Output Contract

- Validation result.
- Criteria checked.
- Evidence summary.
- Risks.
- Recommended next step.

## First Test Scenario

Request:

Add support for classifying documentation-only requests as low risk and ready for bounded execution.

Expected target app:

Foundry Request Board.

Expected target files:

- source classifier file,
- classifier test file,
- product context documentation.

Expected result:

The app can classify documentation-only requests separately from high-risk feature requests.

## Demo Boundary

Foundry Request Board is the guinea pig application.

The real experiment is whether the Alita / EliteA agents can inspect, decide, modify, validate, and report under Dev Foundry rules.
