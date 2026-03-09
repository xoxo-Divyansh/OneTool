import { minifyJson, parseJson, prettifyJson } from "@/modules/tools/jsonFormatter/json.logic";

export function run(input, options = {}) {
  const text = typeof input === "string" ? input : "";
  const mode = options.mode ?? "format";
  const parsed = parseJson(text);

  if (!parsed.ok) {
    return {
      ok: false,
      error: parsed.error,
      line: parsed.line,
      column: parsed.column,
    };
  }

  if (mode === "validate") {
    return { ok: true, data: parsed.data, output: text };
  }

  if (mode === "minify") {
    return { ok: true, data: parsed.data, output: minifyJson(parsed.data) };
  }

  if (mode === "format") {
    return { ok: true, data: parsed.data, output: prettifyJson(parsed.data) };
  }

  return { ok: false, error: `Unsupported mode: ${mode}` };
}

