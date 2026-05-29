# Demo Guardrails

The demo must remain small, safe, and repeatable.

## Allowed for the first implementation slice

- Small JavaScript files.
- Small test files.
- Product documentation.
- Bounded code generation.
- Validation report.

## Not allowed for the first implementation slice

- Authentication.
- Databases.
- Backend services.
- Deployment.
- Secrets.
- Automatic commits or pushes during the demo.
- Large framework setup.
- Package installation during the live demo.

## Execution Rule

The system must not modify files until the request has clear scope, allowed files, forbidden files, and acceptance criteria.

## Demo Rule

The demo should show a visible before and after result without relying on complex infrastructure.
