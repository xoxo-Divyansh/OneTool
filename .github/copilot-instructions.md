# OneTool Copilot Instructions

This file guides Copilot/Codex to preserve the Git workflow automation in this repository.

## Workflow Rules
- Branches:
  - `main` = production
  - `develop` = staging
  - `feature/<name>` = feature work
  - `fix/<name>` = bug fix work
- Commit style must use: `feat:`, `fix:`, `chore:`, `docs:` (scope is encouraged).
- Keep `.workflow-status` current by running:
  - `node scripts/updateWorkflowStatus.js`

## Automation Files
- `scripts/gitStatus.js`: branch + stage detection.
- `scripts/updateWorkflowStatus.js`: writes `.workflow-status`.
- `scripts/commitHelper.js`: suggests/applies conventional commits from staged changes.
- `scripts/prHelper.js`: generates PR title + description from branch + diff.
- `pull_request_template.md`: standardized PR checklist/template.

## Preferred Commands
- Detect stage: `node scripts/gitStatus.js --json`
- Update status: `node scripts/updateWorkflowStatus.js`
- Suggest commit: `node scripts/commitHelper.js`
- Auto-commit staged changes: `node scripts/commitHelper.js --apply`
- Build PR draft: `node scripts/prHelper.js --write .github/PR_DRAFT.md`

## Guardrails
- Do not bypass branch naming rules.
- Do not generate non-conventional commit subjects.
- Update documentation if workflow scripts or policies change.

