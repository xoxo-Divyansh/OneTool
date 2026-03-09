#!/usr/bin/env node
/**
 * Detects the current Git branch and maps it to OneTool workflow stage.
 * Why: central visibility for automation and developer checks.
 * Run: node scripts/gitStatus.js [--json]
 */

const fs = require("node:fs");
const path = require("node:path");

function findGitDir(startDir) {
  let current = path.resolve(startDir);

  while (true) {
    const gitPath = path.join(current, ".git");
    if (fs.existsSync(gitPath)) {
      const stat = fs.statSync(gitPath);
      if (stat.isDirectory()) return gitPath;
      if (stat.isFile()) {
        const content = fs.readFileSync(gitPath, "utf8").trim();
        const match = content.match(/^gitdir:\s*(.+)$/i);
        if (match) return path.resolve(current, match[1].trim());
      }
    }

    const parent = path.dirname(current);
    if (parent === current) break;
    current = parent;
  }

  throw new Error("No .git directory found from current working directory.");
}

function readPackedRef(gitDir, refName) {
  const packedRefsPath = path.join(gitDir, "packed-refs");
  if (!fs.existsSync(packedRefsPath)) return "";

  const lines = fs.readFileSync(packedRefsPath, "utf8").split(/\r?\n/);
  for (const line of lines) {
    if (!line || line.startsWith("#") || line.startsWith("^")) continue;
    const [hash, name] = line.trim().split(/\s+/);
    if (name === refName) return hash;
  }
  return "";
}

function resolveHead(gitDir) {
  const headPath = path.join(gitDir, "HEAD");
  if (!fs.existsSync(headPath)) {
    throw new Error("Missing HEAD file in .git directory.");
  }

  const headValue = fs.readFileSync(headPath, "utf8").trim();
  if (!headValue) throw new Error("HEAD is empty.");

  if (!headValue.startsWith("ref: ")) {
    return { branch: "DETACHED", commit: headValue };
  }

  const refName = headValue.slice(5).trim();
  const branch = refName.replace(/^refs\/heads\//, "");
  const refPath = path.join(gitDir, ...refName.split("/"));
  let commit = "";

  if (fs.existsSync(refPath)) {
    commit = fs.readFileSync(refPath, "utf8").trim();
  } else {
    commit = readPackedRef(gitDir, refName);
  }

  if (!commit) {
    throw new Error(`Unable to resolve commit for ref "${refName}".`);
  }

  return { branch, commit };
}

function mapStage(branch) {
  if (branch === "main") return "production";
  if (branch === "develop") return "staging";
  if (branch.startsWith("feature/")) return "feature";
  if (branch.startsWith("fix/")) return "fix";
  return "unknown";
}

function getGitStatus() {
  const gitDir = findGitDir(process.cwd());
  const { branch, commit } = resolveHead(gitDir);
  return { branch, stage: mapStage(branch), commit };
}

function main() {
  try {
    const status = getGitStatus();
    if (process.argv.includes("--json")) {
      console.log(JSON.stringify(status, null, 2));
      return;
    }
    console.log(`branch: ${status.branch}`);
    console.log(`stage: ${status.stage}`);
  } catch (error) {
    console.error(
      "Failed to detect branch/stage. Ensure this command runs inside a Git repository."
    );
    console.error(error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { getGitStatus, mapStage };
