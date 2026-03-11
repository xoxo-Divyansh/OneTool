import { run as runApiTester } from "@/tools/api-tester/run";
import { run as runJsonFormatter } from "@/tools/json-formatter/run";

/**
 * Phase 0 (baseline): explicit runner map for server-side execution.
 * TODO(phase-2): Generate tool runner map from registry metadata.
 */
const toolRunners = {
  "api-tester": runApiTester,
  "json-formatter": runJsonFormatter,
};

export function getToolRunner(toolId) {
  return toolRunners[toolId] ?? null;
}
