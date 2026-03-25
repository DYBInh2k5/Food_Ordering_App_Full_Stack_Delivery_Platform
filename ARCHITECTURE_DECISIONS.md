# Architecture Decisions (ADR Lite)

## Purpose
Track important architecture choices, why they were made, and how to revisit them.

## How to Use
- Add a new decision record for each major architectural change.
- Do not overwrite old decisions; append a superseding record if needed.

## Record Template
- ID: ADR-XXX
- Date:
- Status: proposed | accepted | superseded | deprecated
- Context:
- Decision:
- Consequences:
- Alternatives considered:
- Migration plan:

---

## ADR-001
Date: 2026-03-25
Status: accepted

Context:
The application requires clear separation of concerns and maintainable API evolution.

Decision:
Use layered backend structure: routes -> controllers -> services -> models.

Consequences:
- Easier testing and refactoring.
- Slightly more boilerplate in simple endpoints.

Alternatives considered:
- Route handlers directly calling models.
- Monolithic controller-only pattern.

Migration plan:
Keep current pattern as the baseline for all future modules.

---

## ADR-002
Date: 2026-03-25
Status: accepted

Context:
Authentication is required across customer, driver, and restaurant roles.

Decision:
Use JWT-based auth with role checks in middleware.

Consequences:
- Stateless auth and easy scaling.
- Requires careful token expiration and secret management.

Alternatives considered:
- Server-side session store.
- Third-party auth provider at initial stage.

Migration plan:
Review token refresh flow before production hard launch.

---

## ADR-003
Date: 2026-03-25
Status: accepted

Context:
Project needs fast iteration with straightforward deployment.

Decision:
Keep frontend and backend as separate deployable units in one repository.

Consequences:
- Clear ownership boundaries.
- Requires coordination for API contract changes.

Alternatives considered:
- Single server-rendered monolith.
- Multi-repo split from day one.

Migration plan:
Introduce contract testing if deployment frequency increases.

---

## ADR-004
Date: 2026-03-25
Status: proposed

Context:
Current order tracking uses polling and periodic updates.

Decision:
Evaluate migration path to event-driven updates for core tracking flow.

Consequences:
- Better user experience and lower unnecessary requests.
- Additional complexity in infrastructure and monitoring.

Alternatives considered:
- Keep polling only.
- Hybrid polling with adaptive intervals.

Migration plan:
Prototype in one route group first, measure stability and cost.

---

## ADR Review Cadence
- Review proposed ADRs every sprint planning.
- Revisit accepted ADRs quarterly.
- Mark deprecated or superseded ADRs explicitly.

## Change Log
- 2026-03-25: Initial ADR file created.
