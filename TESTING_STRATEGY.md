# Testing Strategy

## Objective
Build confidence that changes do not break ordering, payment, delivery, and review flows.

## Test Pyramid
- Unit tests: fast validation of business logic.
- Integration tests: API + DB behavior with realistic scenarios.
- End-to-end tests: critical user journeys from UI to backend.

Target ratio:
- 60% unit
- 30% integration
- 10% end-to-end

## Critical Flows to Protect
- User registration and login.
- Restaurant listing and menu retrieval.
- Cart updates and checkout.
- Order creation and status transitions.
- Payment flow success and failure handling.
- Driver accept and complete delivery flow.
- Review create and update flow.

## Backend Testing Plan

### Unit
- Service functions for order and payment calculations.
- Validation helpers and error formatters.
- Role authorization utilities.

### Integration
- Auth endpoints with valid and invalid tokens.
- Order lifecycle transitions and permissions.
- Review permissions and duplicate review prevention.
- Driver assignment and active delivery constraints.

### Data
- Use isolated test database.
- Seed minimum fixtures for roles and base entities.
- Reset data between test runs.

## Frontend Testing Plan

### Component
- Form validation states.
- Loading, error, and empty states.
- Conditional rendering based on role.

### Page
- Checkout page with success/failure API responses.
- Dashboard tabs and action buttons.
- Review submission and feedback messages.

### End-to-End
- Customer order journey.
- Driver order handling journey.
- Restaurant order management journey.

## CI Quality Gates
A pull request passes only when:
- Lint succeeds.
- Unit tests succeed.
- Integration tests succeed.
- Build succeeds for frontend and backend.

## Test Data Management
- Keep deterministic seed scripts.
- Avoid shared mutable test fixtures.
- Document fixture assumptions per test suite.

## Non-Functional Testing
- Basic load testing on key endpoints.
- Security scanning for dependency vulnerabilities.
- API contract checks for backward compatibility.

## Bug-to-Test Rule
Every production bug fix must include:
- One regression test reproducing old failure.
- One assertion that confirms fixed behavior.

## Suggested Future Tooling
- Unit/integration: Jest + Supertest.
- E2E: Playwright.
- Coverage reporting: c8 or nyc.

## Exit Criteria for Release
- No failing critical tests.
- No high severity open bugs in release scope.
- Performance baseline unchanged or improved.

## Change Log
- 2026-03-25: Initial testing strategy created.
