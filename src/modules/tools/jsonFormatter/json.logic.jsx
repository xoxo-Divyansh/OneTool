export const jsonFormatterDefaults = {
  input: '{\n  "hello": "world"\n}',
};

function getLineColumnFromPosition(text, position) {
  if (position < 0 || position > text.length) {
    return { line: null, column: null };
  }

  const upto = text.slice(0, position);
  const lines = upto.split("\n");
  const line = lines.length;
  const column = lines[lines.length - 1].length + 1;

  return { line, column };
}

export function parseJson(text) {
  try {
    const parsed = JSON.parse(text);
    return { ok: true, data: parsed };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid JSON";
    const match = message.match(/position\s+(\d+)/i);

    if (!match) {
      return { ok: false, error: message, line: null, column: null };
    }

    const position = Number(match[1]);
    const { line, column } = getLineColumnFromPosition(text, position);

    return { ok: false, error: message, line, column };
  }
}

export function prettifyJson(data) {
  return JSON.stringify(data, null, 2);
}

export function minifyJson(data) {
  return JSON.stringify(data);
}

export function getOffsetFromLineColumn(text, line, column) {
  if (!Number.isInteger(line) || !Number.isInteger(column)) {
    return null;
  }

  if (line < 1 || column < 1) {
    return null;
  }

  const lines = text.split("\n");

  if (line > lines.length) {
    return null;
  }

  let offset = 0;

  for (let index = 0; index < line - 1; index += 1) {
    offset += lines[index].length + 1;
  }

  const currentLine = lines[line - 1];
  const safeColumn = Math.min(column - 1, currentLine.length);

  return offset + safeColumn;
}
