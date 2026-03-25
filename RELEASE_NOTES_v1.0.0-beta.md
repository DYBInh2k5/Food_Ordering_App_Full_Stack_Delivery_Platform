# Release Notes - v1.0.0-beta

Date: 2026-03-25

## Highlights
- Full-stack food delivery platform is now production-ready baseline.
- Customer ordering flow implemented end-to-end.
- Restaurant dashboard for order and menu management implemented.
- Driver dashboard with assignment and delivery flow implemented.
- Reviews and ratings for restaurants and drivers implemented.

## Backend
- Layered architecture with routes, controllers, services, and models.
- Role-based authorization and JWT authentication.
- 50+ API endpoints across auth, restaurant, order, driver, payment, review.

## Frontend
- React app with role-aware routing.
- Redux Toolkit state management.
- Customer, restaurant, and driver experiences integrated.

## Documentation
- Setup and deployment guides.
- Contributing and testing strategy.
- ADR and release playbook.

## Known Notes
- Payment flow currently uses mock setup and is prepared for provider integration.
- Local MongoDB is required for persistent local development data.

## Upgrade Notes
- Fresh install recommended for first run.
- Use .env.example files to configure environment variables.

## Acknowledgements
Thanks to all contributors for delivering the baseline release.
