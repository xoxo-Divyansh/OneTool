function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function formatPrimitive(value) {
  if (typeof value === "string") {
    return `"${value}"`;
  }

  return String(value);
}

function getNodeMeta(value) {
  if (Array.isArray(value)) {
    return {
      kind: "array",
      preview: `[${value.length} items]`,
      expandable: value.length > 0,
    };
  }

  if (isPlainObject(value)) {
    const keys = Object.keys(value);
    return {
      kind: "object",
      preview: `{${keys.length} keys}`,
      expandable: keys.length > 0,
    };
  }

  return {
    kind: "primitive",
    preview: formatPrimitive(value),
    expandable: false,
  };
}

function childPath(parentPath, key, parentKind) {
  if (parentKind === "array") {
    return `${parentPath}[${key}]`;
  }

  if (/^[A-Za-z_$][A-Za-z0-9_$]*$/.test(key)) {
    return `${parentPath}.${key}`;
  }

  const escaped = key.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
  return `${parentPath}["${escaped}"]`;
}

function buildNode(value, keyLabel, path) {
  const meta = getNodeMeta(value);
  const baseNode = {
    id: path,
    path,
    keyLabel,
    kind: meta.kind,
    preview: meta.preview,
    expandable: meta.expandable,
    children: [],
  };

  if (!meta.expandable) {
    return baseNode;
  }

  if (meta.kind === "array") {
    baseNode.children = value.map((item, index) =>
      buildNode(item, `[${index}]`, childPath(path, index, "array"))
    );
    return baseNode;
  }

  baseNode.children = Object.entries(value).map(([key, item]) =>
    buildNode(item, key, childPath(path, key, "object"))
  );
  return baseNode;
}

export function buildJsonTreeModel(value) {
  return buildNode(value, "$", "$");
}

function readQuotedKey(path, startIndex) {
  const quote = path[startIndex];
  let current = startIndex + 1;
  let key = "";

  while (current < path.length) {
    const char = path[current];

    if (char === "\\") {
      if (current + 1 >= path.length) {
        return { ok: false, error: "Invalid escape sequence in path key" };
      }
      key += path[current + 1];
      current += 2;
      continue;
    }

    if (char === quote) {
      return { ok: true, key, nextIndex: current + 1 };
    }

    key += char;
    current += 1;
  }

  return { ok: false, error: "Unterminated quoted key in path" };
}

export function parseJsonPath(path) {
  if (typeof path !== "string" || path.trim().length === 0) {
    return { ok: false, error: "Path is required" };
  }

  const input = path.trim();

  if (!input.startsWith("$")) {
    return { ok: false, error: "Path must start with $" };
  }

  if (input === "$") {
    return { ok: true, tokens: [] };
  }

  const tokens = [];
  let index = 1;

  while (index < input.length) {
    const char = input[index];

    if (char === ".") {
      index += 1;
      const match = input.slice(index).match(/^[A-Za-z_$][A-Za-z0-9_$]*/);

      if (!match) {
        return { ok: false, error: `Invalid key after dot at index ${index}` };
      }

      tokens.push({ type: "key", value: match[0] });
      index += match[0].length;
      continue;
    }

    if (char === "[") {
      index += 1;

      if (index >= input.length) {
        return { ok: false, error: "Unclosed bracket in path" };
      }

      if (input[index] === "'" || input[index] === '"') {
        const quoted = readQuotedKey(input, index);
        if (!quoted.ok) return quoted;

        index = quoted.nextIndex;
        if (input[index] !== "]") {
          return { ok: false, error: "Missing ] after quoted key" };
        }

        tokens.push({ type: "key", value: quoted.key });
        index += 1;
        continue;
      }

      const match = input.slice(index).match(/^\d+/);
      if (!match) {
        return { ok: false, error: `Invalid array index at index ${index}` };
      }

      index += match[0].length;
      if (input[index] !== "]") {
        return { ok: false, error: "Missing ] after array index" };
      }

      tokens.push({ type: "index", value: Number(match[0]) });
      index += 1;
      continue;
    }

    return { ok: false, error: `Unexpected token "${char}" at index ${index}` };
  }

  return { ok: true, tokens };
}

export function extractByJsonPath(root, path) {
  const parsedPath = parseJsonPath(path);
  if (!parsedPath.ok) {
    return { ok: false, error: parsedPath.error };
  }

  let current = root;

  for (const token of parsedPath.tokens) {
    if (token.type === "key") {
      if (!isPlainObject(current) && !Array.isArray(current)) {
        return { ok: false, error: `Cannot read key "${token.value}" on non-object value` };
      }

      if (!(token.value in current)) {
        return { ok: false, error: `Key "${token.value}" not found` };
      }

      current = current[token.value];
      continue;
    }

    if (!Array.isArray(current)) {
      return { ok: false, error: `Cannot read index [${token.value}] on non-array value` };
    }

    if (token.value < 0 || token.value >= current.length) {
      return { ok: false, error: `Index [${token.value}] is out of range` };
    }

    current = current[token.value];
  }

  return { ok: true, value: current };
}

export function printJson(value) {
  const output = JSON.stringify(value, null, 2);
  return output === undefined ? String(value) : output;
}
