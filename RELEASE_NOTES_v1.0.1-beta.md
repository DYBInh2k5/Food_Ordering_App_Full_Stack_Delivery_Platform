# Release Notes - v1.0.1-beta

Date: 2026-03-25

## Highlights
- CI was split into dedicated backend and frontend workflows.
- GitHub Release creation is now automated on version tag push.
- Security automation added with CodeQL analysis.
- Dependency automation added with Dependabot.
- Project governance expanded with labels and setup documentation.

## CI and Automation
- backend-ci.yml runs backend install and tests with scoped path triggers.
- frontend-ci.yml runs frontend build and tests with scoped path triggers.
- release.yml publishes a GitHub Release for tags matching v*.

## Security and Maintenance
- codeql.yml analyzes JavaScript/TypeScript on push, pull requests, and weekly schedule.
- dependabot.yml checks backend, frontend, and GitHub Actions dependencies weekly.

## Documentation
- Added GITHUB_PROJECT_SETUP.md for operations setup.
- Updated README quick links and changelog entries.

## Upgrade Notes
- No runtime code changes required for application features.
- Repository maintainers should enable branch protection and required checks in GitHub settings.

## Acknowledgements
Thanks to all contributors improving release safety and long-term maintainability.
