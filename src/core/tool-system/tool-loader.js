import apiTester from "@/tools/api-tester/tool.config";
import imageCompressor from "@/tools/image-compressor/tool.config";
import jsonFormatter from "@/tools/json-formatter/tool.config";
import pdfGenerator from "@/tools/pdf-generator/tool.config";
import studyTimer from "@/tools/study-timer/tool.config";

/**
 * Transitional loader.
 * Tools self-declare in their own folder via tool.config files.
 * This list can be replaced with filesystem auto-discovery later.
 */
export function loadToolConfigs() {
  return [apiTester, imageCompressor, jsonFormatter, pdfGenerator, studyTimer];
}

