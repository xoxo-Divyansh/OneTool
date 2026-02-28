# Contributing Guide

This project follows a lightweight, trackable workflow designed for fast iteration with clean history.

## Branching Strategy

- `main`: stable production-ready branch
- `feature/<scope>-<short-name>`: new feature work
- `fix/<scope>-<short-name>`: bug fixes
- `chore/<scope>-<short-name>`: setup/refactor/tooling/docs

Example: `feature/tools-json-formatter`

## Commit Convention

Use Conventional Commits:

- `feat(scope): ...`
- `fix(scope): ...`
- `docs(scope): ...`
- `chore(scope): ...`
- `refactor(scope): ...`
- `test(scope): ...`

Examples:

- `feat(auth): add login route with bcrypt verification`
- `fix(user-model): correct role enum key`
- `docs(product): update launch positioning`

## PR/Merge Rules

1. Keep PRs focused on one logical concern.
2. Include a short "what changed" and "why" note.
3. Confirm local checks pass before merge:
   - `npm run lint`
   - `npm run build` (for release PRs)
4. Squash only if commit history in branch is noisy; otherwise preserve meaningful commits.

## Release Tagging

Use annotated tags for important checkpoints:

- `v0.1.0-foundation`
- `v0.2.0-feature-json-formatter`

Tag command:

```bash
git tag -a <tag-name> -m "<release note>"
git push origin <tag-name>
```

## Changelog Discipline

- Update `CHANGELOG.md` in the same branch where behavior changes are made.
- Keep entries short and factual:
  - Added
  - Changed
  - Fixed
  - Known Gaps
