#!/usr/bin/env node
/**
 * Suggests and optionally creates a conventional commit from staged changes.
 * Why: enforces consistent commit style (feat/fix/chore/docs) in OneTool workflow.
 * Run:
 *   node scripts/commitHelper.js
 *   node scripts/commitHelper.js --apply
 *   node scripts/commitHelper.js --type fix --scope auth --summary "handle token expiry" --apply
 */

const { execSync } = require("node:child_process");

function runGit(args, options = {}) {
  try {
    const quoted = args.map((arg) => `"${String(arg).replace(/"/g, '\\"')}"`).join(" ");
    return execSync(`git ${quoted}`, { encoding: "utf8", ...options }).trim();
  } catch (error) {
    const reason = error && error.message ? error.message : String(error);
    throw new Error(
      `Unable to run Git command. Ensure Git is installed and subprocess execution is allowed. Details: ${reason}`
    );
  }
}

function stagedFiles() {
  const output = runGit(["diff", "--cached", "--name-only"]);
  return output ? output.split(/\r?\n/).filter(Boolean) : [];
}

function inferType(files) {
  if (files.length === 0) return "chore";
  const docsOnly = files.every((file) =>
    /(^docs\/|\.md$|^README)/i.test(file)
  );
  if (docsOnly) return "docs";

  const diff = runGit(["diff", "--cached"]);
  if (/\b(fix|bug|error|regress|hotfix)\b/i.test(diff)) return "fix";

  const configOnly = files.every((file) =>
    /(^\.github\/|^\.vscode\/|(^|\/)(eslint|prettier|tsconfig|jsconfig|tailwind|postcss|next)\.|package(-lock)?\.json)/i.test(
      file
    )
  );
  if (configOnly) return "chore";

  return "feat";
}

function inferScope(files) {
  if (files.length === 0) return "repo";
  const topLevel = files[0].split("/")[0];
  if (!topLevel || topLevel.endsWith(".json")) return "repo";
  return topLevel;
}

function inferSummary(files) {
  if (files.length === 0) return "update project";
  if (files.length === 1) return `update ${files[0]}`;
  return `update ${files.length} files`;
}

function parseArg(name) {
  const index = process.argv.indexOf(`--${name}`);
  if (index === -1) return "";
  return process.argv[index + 1] || "";
}

function buildMessage() {
  const files = stagedFiles();
  if (files.length === 0) {
    throw new Error("No staged files found. Stage changes before running commitHelper.");
  }

  const type = parseArg("type") || inferType(files);
  const scope = parseArg("scope") || inferScope(files);
  const summary = parseArg("summary") || inferSummary(files);

  if (!/^(feat|fix|chore|docs)$/.test(type)) {
    throw new Error(`Invalid type "${type}". Use one of feat, fix, chore, docs.`);
  }

  return `${type}(${scope}): ${summary}`;
}

function main() {
  try {
    const message = buildMessage();
    const apply = process.argv.includes("--apply");

    console.log(`Suggested commit message:\n${message}`);

    if (apply) {
      runGit(["commit", "-m", message], { stdio: "inherit" });
    } else {
      console.log('\nUse "--apply" to create the commit automatically.');
    }
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}
