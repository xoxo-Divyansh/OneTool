# OneTool Development Workflow

This document explains the branch strategy and helper scripts created for workflow automation.

## Branching Model
- `main`: production branch.
- `develop`: staging/integration branch.
- `feature/<name>`: new feature work.
- `fix/<name>`: bug fixes.

## Workflow Status Tracking
The file `.workflow-status` is the single source of current workflow context for local automation.

### Update Status
```bash
node scripts/updateWorkflowStatus.js
```

This writes:
- `stage`
- `branch`
- `last_commit`
- `updated_at`

## Script Reference

### 1) `scripts/gitStatus.js`
What it does:
- Reads current Git branch.
- Maps branch to stage (`production`, `staging`, `feature`, `fix`, `unknown`).

How to run:
```bash
node scripts/gitStatus.js
node scripts/gitStatus.js --json
```

Why it exists:
- Gives a reliable stage signal used by other scripts and CI helper tasks.

### 2) `scripts/updateWorkflowStatus.js`
What it does:
- Collects branch, stage, and latest commit hash.
- Updates `.workflow-status`.

How to run:
```bash
node scripts/updateWorkflowStatus.js
```

Why it exists:
- Keeps team and tooling synchronized on the repository state.

### 3) `scripts/commitHelper.js`
What it does:
- Inspects staged changes.
- Suggests a conventional commit message.
- Can auto-commit with `--apply`.

How to run:
```bash
node scripts/commitHelper.js
node scripts/commitHelper.js --apply
node scripts/commitHelper.js --type fix --scope auth --summary "handle token expiry" --apply
```

Why it exists:
- Standardizes commit quality and keeps history readable.

### 4) `scripts/prHelper.js`
What it does:
- Builds a PR title and markdown description from current branch and diff.
- Optionally writes a draft markdown file.

How to run:
```bash
node scripts/prHelper.js
node scripts/prHelper.js --write .github/PR_DRAFT.md
```

Why it exists:
- Reduces PR noise and ensures reviewers always get clear context.

## Pull Request Standardization
- `pull_request_template.md` defines the default PR checklist.
- `scripts/prHelper.js` can prefill content before opening a PR on GitHub.

## VS Code Tasks
Task shortcuts are available in:
- `.vscode/tasks.json` (primary VS Code location)
- `tasks.json` (repository root copy for portability)

Included tasks:
- `Run Tests`
- `Update Workflow Status`
- `Create Feature Branch`

## Copilot Guidance
`.github/copilot-instructions.md` explains:
- branch naming rules
- commit format expectations
- required workflow scripts and command usage

