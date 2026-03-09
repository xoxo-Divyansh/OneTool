#!/usr/bin/env node
/**
 * Updates .workflow-status with branch, stage, and latest commit hash.
 * Why: keeps automation and collaborators aligned on current workflow state.
 * Run: node scripts/updateWorkflowStatus.js
 */

const fs = require("node:fs");
const path = require("node:path");
const { getGitStatus } = require("./gitStatus");

function buildStatus() {
  const gitStatus = getGitStatus();
  return {
    stage: gitStatus.stage,
    branch: gitStatus.branch,
    last_commit: gitStatus.commit,
    updated_at: new Date().toISOString(),
  };
}

function formatStatus(status) {
  return [
    `stage: ${status.stage}`,
    `branch: ${status.branch}`,
    `last_commit: ${status.last_commit}`,
    `updated_at: ${status.updated_at}`,
  ].join("\n");
}

function main() {
  try {
    const status = buildStatus();
    const filePath = path.resolve(process.cwd(), ".workflow-status");
    fs.writeFileSync(filePath, `${formatStatus(status)}\n`, "utf8");
    console.log(`Updated ${filePath}`);
  } catch (error) {
    console.error("Failed to update .workflow-status");
    console.error(error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}
