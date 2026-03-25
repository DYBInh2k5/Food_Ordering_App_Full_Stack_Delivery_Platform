# Release Playbook

## Purpose
Define a repeatable process to release safely with clear rollback steps.

## Release Types
- Patch: bug fixes, no breaking changes.
- Minor: backward-compatible features.
- Major: breaking API or behavior changes.

Versioning:
Use semantic versioning MAJOR.MINOR.PATCH.

## Release Roles
- Release manager: drives checklist and timing.
- Tech lead: confirms technical readiness.
- QA owner: confirms validation coverage.
- On-call owner: monitors post-release health.

## Pre-Release Checklist
- All release PRs merged to main.
- CI green for latest main commit.
- Migration scripts reviewed and tested.
- Environment variables validated in target environment.
- Release notes drafted.
- Rollback plan prepared.

## Release Steps
1. Freeze merge window for release scope.
2. Create release branch from main.
3. Run full verification suite.
4. Tag release version.
5. Deploy backend.
6. Deploy frontend.
7. Run smoke tests.
8. Monitor logs and metrics.

## Smoke Test Checklist
- Login works for all roles.
- Restaurant list and details load.
- Cart and checkout work.
- Order creation succeeds.
- Driver dashboard actions respond.
- Restaurant dashboard actions respond.
- Review submission works.

## Rollback Strategy
When rollback is needed:
1. Stop rollout.
2. Revert deployment to previous stable version.
3. Confirm smoke tests on previous version.
4. Open incident summary and root cause tracking issue.

## Hotfix Process
- Branch from latest release tag.
- Implement minimal fix.
- Run targeted tests plus smoke tests.
- Deploy and tag new patch version.

## Post-Release Activities
- Review monitoring dashboards for 24 hours.
- Track user-facing errors and performance.
- Publish final release notes.
- Record lessons learned.

## Release Note Template
- Version:
- Date:
- Highlights:
- Breaking changes:
- Migration notes:
- Rollback notes:

## Operational Metrics
Track at least:
- Error rate.
- P95 response time.
- Checkout success rate.
- Payment success rate.
- Order completion rate.

## Change Log
- 2026-03-25: Initial release playbook created.
