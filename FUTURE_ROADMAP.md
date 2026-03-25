# Future Roadmap

## Purpose
This document defines the product and technical direction for the next 12 months.
Use it to prioritize work, align scope, and track delivery outcomes.

## Roadmap Principles
- Build in small, reversible increments.
- Protect core ordering flow above all else.
- Ship measurable improvements every sprint.
- Prioritize reliability and observability before adding complexity.

## Timeline Overview

### Quarter 2 2026 - Stabilization and Production Hardening
Goals:
- Increase backend reliability and reduce runtime errors.
- Improve developer workflow and CI quality gates.
- Prepare for first public release.

Initiatives:
- Add robust input validation and schema-level constraints for all write endpoints.
- Add request tracing and structured logs.
- Add health and readiness endpoints.
- Add backup and restore runbook for database.
- Add CI checks for lint, test, and build.

Success metrics:
- API error rate < 1.5% weekly average.
- P95 API latency < 500ms on key endpoints.
- Zero production incidents caused by missing env vars.

### Quarter 3 2026 - Payment and Notification Maturity
Goals:
- Move from mock payment flow to real provider integration.
- Improve user communication quality.

Initiatives:
- Integrate Stripe Payment Intent with webhook validation.
- Add email notifications for order lifecycle events.
- Add in-app notification center.
- Add idempotency keys for payment-sensitive operations.

Success metrics:
- Payment success ratio > 97%.
- Webhook processing reliability > 99.5%.
- Notification delivery latency < 30s.

### Quarter 4 2026 - Marketplace Optimization
Goals:
- Improve conversion and retention.
- Help restaurant and driver roles operate more efficiently.

Initiatives:
- Add recommendation module (popular items, personalized ordering history).
- Add promotion engine (campaigns, coupon rules, schedule windows).
- Add richer driver dispatch scoring (distance, load, acceptance history).
- Add restaurant SLA dashboard.

Success metrics:
- Checkout conversion +8% over baseline.
- Repeat order rate +12% over baseline.
- Late delivery ratio reduced by 20%.

### Quarter 1 2027 - Scale and Governance
Goals:
- Support growth and multi-tenant readiness.
- Strengthen governance and internal standards.

Initiatives:
- Add API versioning strategy and deprecation process.
- Add data retention and PII handling policies.
- Introduce ADR workflow for architecture changes.
- Add performance testing pipeline.

Success metrics:
- No breaking API changes without version bump.
- 100% major architecture changes documented by ADR.
- Successful load test at 5x current baseline traffic.

## Backlog Buckets

### Product
- Loyalty points and rewards.
- Saved payment methods.
- Advanced search filters.
- Pre-order and scheduled delivery windows.

### Engineering
- Caching strategy for high-read endpoints.
- Database query optimization and index review.
- Background jobs for non-critical async tasks.
- Better feature flag controls.

### Security
- Secrets rotation process.
- Dependency vulnerability SLA.
- Audit trail for sensitive operations.
- Optional 2FA for restaurant and admin roles.

## Prioritization Framework
Use this score:
- Business impact: 1 to 5
- Technical effort: 1 to 5
- Risk reduction: 1 to 5

Priority score = (Business impact + Risk reduction) - Technical effort

## Review Cadence
- Weekly: sprint progress check.
- Monthly: roadmap health review.
- Quarterly: reset goals and milestones.

## Owners
- Product owner: feature value and scope.
- Tech lead: architecture and delivery quality.
- QA owner: release confidence and regression coverage.

## Change Log
- 2026-03-25: Initial roadmap created.
