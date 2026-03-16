import apiTester from "@/tools/api-tester/tool.config";
import imageCompressor from "@/tools/image-compressor/tool.config";
import jsonFormatter from "@/tools/json-formatter/tool.config";
import pdfStudio from "@/tools/pdf-studio/tool.config";
import studyTimer from "@/tools/study-timer/tool.config";

/**
 * Phase 0 (baseline): transitional loader.
 * Tools self-declare in their own folder via tool.config files.
 * This list can be replaced with filesystem auto-discovery later.
 * TODO(phase-2): Replace manual imports with registry-driven discovery.
 */
export function loadToolConfigs() {
  return [apiTester, imageCompressor, jsonFormatter, pdfStudio, studyTimer];
}

/**
 * Phase 1: registry-first loading.
 * This keeps backward compatibility by reusing the same tool config list.
 */
export function registerToolConfigs(registerTools) {
  const tools = loadToolConfigs();
  registerTools(tools);
}

