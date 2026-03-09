import { run as runApiTester } from "@/tools/api-tester/run";
import { run as runJsonFormatter } from "@/tools/json-formatter/run";

const toolRunners = {
  "api-tester": runApiTester,
  "json-formatter": runJsonFormatter,
};

export function getToolRunner(toolId) {
  return toolRunners[toolId] ?? null;
}

