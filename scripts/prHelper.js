#!/usr/bin/env node
/**
 * Builds a consistent PR title + description from branch and local Git history.
 * Why: standardizes PR metadata across feature/fix/develop/main flows.
 * Run:
 *   node scripts/prHelper.js
 *   node scripts/prHelper.js --write .github/PR_DRAFT.md
 */

const fs = require("node:fs");
const { execSync } = require("node:child_process");
const { mapStage } = require("./gitStatus");

function runGit(args) {
  try {
    const quoted = args.map((arg) => `"${String(arg).replace(/"/g, '\\"')}"`).join(" ");
    return execSync(`git ${quoted}`, { encoding: "utf8" }).trim();
  } catch (error) {
    const reason = error && error.message ? error.message : String(error);
    throw new Error(
      `Unable to run Git command. Ensure Git is installed and subprocess execution is allowed. Details: ${reason}`
    );
  }
}

function parseArg(name) {
  const index = process.argv.indexOf(`--${name}`);
  if (index === -1) return "";
  return process.argv[index + 1] || "";
}

function getBranch() {
  return runGit(["rev-parse", "--abbrev-ref", "HEAD"]);
}

function getBaseBranch(stage) {
  if (stage === "feature" || stage === "fix") return "develop";
  if (stage === "staging") return "main";
  return "main";
}

function getChangeSummary(baseBranch) {
  const changedFilesRaw = runGit(["diff", "--name-only", `${baseBranch}...HEAD`]);
  const commitLinesRaw = runGit([
    "log",
    "--pretty=format:%h %s",
    `${baseBranch}..HEAD`,
  ]);

  const files = changedFilesRaw ? changedFilesRaw.split(/\r?\n/).filter(Boolean) : [];
  const commits = commitLinesRaw ? commitLinesRaw.split(/\r?\n/).filter(Boolean) : [];
  return { files, commits };
}

function branchTopic(branch, stage) {
  if (stage === "feature" || stage === "fix") return branch.replace(/^[^/]+\//, "");
  return branch;
}

function titleFromBranch(branch, stage) {
  const topic = branchTopic(branch, stage).replace(/[-_]+/g, " ").trim();
  const type = stage === "fix" ? "fix" : stage === "feature" ? "feat" : "chore";
  return `${type}: ${topic || "update workflow"}`;
}

function buildMarkdown(baseBranch, files, commits) {
  const topFiles = files.slice(0, 10).map((f) => `- ${f}`).join("\n") || "- No file changes detected";
  const topCommits =
    commits.slice(0, 10).map((c) => `- ${c}`).join("\n") || "- No commits detected";

  return `## Summary
Changes prepared for merge into \`${baseBranch}\`.

## What Changed
${topFiles}

## Commits
${topCommits}

## Checklist
- [ ] Tested locally
- [ ] Updated docs (if needed)
- [ ] Linked issue / ticket
`;
}

function main() {
  try {
    const branch = getBranch();
    const stage = mapStage(branch);
    const baseBranch = getBaseBranch(stage);
    const title = titleFromBranch(branch, stage);
    const { files, commits } = getChangeSummary(baseBranch);
    const description = buildMarkdown(baseBranch, files, commits);

    console.log(`PR Title:\n${title}\n`);
    console.log("PR Description:");
    console.log(description);

    const writePath = parseArg("write");
    if (writePath) {
      const output = `# ${title}\n\n${description}`;
      fs.writeFileSync(writePath, output, "utf8");
      console.log(`Saved PR draft to ${writePath}`);
    }
  } catch (error) {
    console.error("Failed to build PR details.");
    console.error(error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}
