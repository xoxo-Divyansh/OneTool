# Changelog

All notable changes to this project are documented in this file.

The format follows Keep a Changelog style and semantic-versioned checkpoints.

## [Unreleased]

### Added
- Complete JSON Formatter v1:
  - JSON validation
  - pretty format (2-space indentation)
  - minify output
  - parse error feedback with line/column when available
  - output copy action
  - clear + sample load actions
  - responsive two-panel input/output editor UI
  - Monaco Editor integration for syntax highlighting, line numbers, and indentation guides
  - inline error marker in editor with click-to-jump cursor behavior

## [0.1.0-foundation] - 2026-02-28

### Added
- App shell with sidebar, header, shared layout provider, and dashboard module.
- Landing page redesign and reusable UI primitives (`Button`, `Card`, `Input`, `ToolCard`).
- Tool route scaffolds for JSON Formatter and API Tester.
- MongoDB connection helper with Mongoose connection caching.
- Auth API routes for register/login/logout with bcrypt password hashing and JWT cookie setup.
- User and ToolHistory Mongoose models.
- Initial database health route at `/api/test-db`.
- Product-focused README describing problem, flow, features, and launch concerns.

### Changed
- Migrated App Router entry files from `.js` to `.jsx` where needed.
- Updated dependency set to include auth and DB packages.
- Updated path alias setup in `jsconfig.json`.

### Known Gaps
- JSON/API tools are currently scaffold-level and need full execution logic.
- Auth service/store integration on client side is not complete.
- Subscription/session/payment model files are planning notes, not executable schemas yet.
