# Contributing Guide

## Purpose
This guide defines how contributors plan, implement, test, and merge changes safely.

## Branching Strategy
- Main branch: stable, releasable code only.
- Feature branches: feature/<short-name>
- Bugfix branches: fix/<short-name>
- Hotfix branches: hotfix/<short-name>

Examples:
- feature/driver-dispatch-score
- fix/payment-timeout-retry

## Commit Convention
Use conventional style:
- feat: new feature
- fix: bug fix
- docs: documentation changes
- refactor: internal code change without behavior change
- test: test updates
- chore: tooling or maintenance

Examples:
- feat: add stripe webhook signature verification
- fix: prevent duplicate order submission on checkout

## Pull Request Checklist
Before opening PR:
- Pull latest main and rebase your branch.
- Ensure lint passes.
- Ensure tests pass locally.
- Confirm no secrets are committed.
- Update docs if behavior changed.

PR description must include:
- Problem statement.
- Scope and approach.
- Risk assessment.
- Test evidence.
- Rollback plan.

## Code Standards

### General
- Keep functions focused and small.
- Avoid hidden side effects.
- Prefer explicit naming over short abbreviations.
- Do not mix formatting-only changes with behavior changes in one PR.

### Backend
- Keep route -> controller -> service separation.
- Validate request payloads at route boundary.
- Return consistent response shape.
- Do not expose raw internal errors to clients.

### Frontend
- Keep pages thin; move reusable logic to hooks/services.
- Store API calls in service layer only.
- Keep Redux slices scoped and predictable.
- Handle loading, empty, and error states explicitly.

## Testing Requirements by Change Type
- Bug fix: add or update at least one regression test.
- New endpoint: add positive and negative path tests.
- UI change: verify main user journey is not broken.
- Refactor: ensure behavior parity through existing tests.

## Documentation Requirements
Update at least one of these when relevant:
- README.md
- API documentation
- Deployment or runbook docs
- Feature-specific guide

## Security Rules
- Never commit .env or credentials.
- Rotate exposed keys immediately if leaked.
- Use least privilege for tokens and service accounts.
- Validate all untrusted input.

## Review Rules
- At least one approval required.
- Block merge if critical comments unresolved.
- Block merge if CI fails.
- Prefer squash merge for clean history.

## Merge and Release
- Merge to main only after checklist passes.
- Tag releases with semantic versioning.
- Record key changes in release notes.

## Contributor Workflow
1. Pick issue from backlog.
2. Create branch.
3. Implement minimal complete change.
4. Add tests and docs.
5. Open PR with checklist.
6. Address review comments.
7. Merge and monitor.

## Change Log
- 2026-03-25: Initial contributing guide created.
