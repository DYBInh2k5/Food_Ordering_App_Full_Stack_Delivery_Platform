# GitHub Project Setup Guide

This guide explains how to use the repository-level GitHub automation and governance assets.

## Included Files
- .github/workflows/backend-ci.yml
- .github/workflows/frontend-ci.yml
- .github/workflows/release.yml
- .github/workflows/codeql.yml
- .github/workflows/label-sync.yml
- .github/dependabot.yml
- .github/labels.yml
- scripts/sync-github-labels.ps1
- .github/ISSUE_TEMPLATE/*
- .github/PULL_REQUEST_TEMPLATE.md

## 1. CI Workflow
The CI pipeline is split into two dedicated workflows.

Checks:
- Backend dependency install and tests
- Frontend dependency install, build, and tests

You can view runs in the GitHub Actions tab.

## 2. Issue and PR Templates
Templates are auto-enabled by GitHub when files exist in .github.

Available templates:
- Bug report
- Feature request
- Pull request template

## 3. Default Labels
Label definitions are stored in .github/labels.yml.

Labels are applied automatically by label-sync.yml when labels.yml changes.

To run label sync manually from local machine:
1. Install GitHub CLI.
2. Authenticate: gh auth login
3. Run script:
   powershell -ExecutionPolicy Bypass -File scripts/sync-github-labels.ps1

Optional repo argument:
   powershell -ExecutionPolicy Bypass -File scripts/sync-github-labels.ps1 -Repo "owner/repo"

## 4. Release Process
Use RELEASE_PLAYBOOK.md for release lifecycle.
Use CHANGELOG.md to track notable updates.

Recommended release flow:
1. Update CHANGELOG.md
2. Tag release: git tag -a vX.Y.Z -m "Release vX.Y.Z"
3. Push tag: git push origin vX.Y.Z
4. release.yml creates the GitHub Release automatically

## 5. Security and Dependency Automation
- codeql.yml runs static security analysis on push, pull request, and weekly schedule.
- dependabot.yml checks npm and GitHub Actions dependencies weekly.

## 6. Governance Recommendations
- Protect main branch with required PR reviews.
- Require CI checks before merge.
- Enforce linear history or squash merge.
- Require signed commits for release managers if needed.

## Change Log
- 2026-03-25: Initial GitHub project setup guide created.
- 2026-03-25: Added split CI, auto-release workflow, CodeQL scan, and Dependabot.
- 2026-03-25: Added automatic GitHub label sync workflow.
