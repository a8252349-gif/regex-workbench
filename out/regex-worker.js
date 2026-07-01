/* Regex Workbench worker: no user text leaves this worker. */
function lineColumn(text, index) {
  const before = text.slice(0, Math.max(0, index));
  const lines = before.split(/\r\n|\r|\n/);
  return { line: lines.length, column: (lines[lines.length - 1] || "").length + 1 };
}

function serializeMatch(match, text, order) {
  const position = lineColumn(text, match.index || 0);
  const groups = Array.from(match).slice(1).map((value, index) => ({
    index: index + 1,
    value: value === undefined ? null : value,
    participated: value !== undefined
  }));
  const namedGroups = Object.entries(match.groups || {}).map(([name, value]) => ({
    name,
    value: value === undefined ? null : value,
    participated: value !== undefined
  }));
  return {
    order,
    value: match[0],
    start: match.index || 0,
    end: (match.index || 0) + match[0].length,
    line: position.line,
    column: position.column,
    groups,
    namedGroups,
    indices: match.indices || null
  };
}

function executeMatches(pattern, flags, text, limit) {
  const regex = new RegExp(pattern, flags);
  const matches = [];
  const repeated = flags.includes("g") || flags.includes("y");
  let truncated = false;
  let zeroWidth = false;

  if (!repeated) {
    const match = regex.exec(text);
    if (match) matches.push(serializeMatch(match, text, 1));
    return { matches, truncated, zeroWidth };
  }

  let match;
  let order = 1;
  while ((match = regex.exec(text)) !== null) {
    matches.push(serializeMatch(match, text, order));
    order += 1;
    if (matches.length >= limit) {
      truncated = regex.lastIndex < text.length;
      break;
    }
    if (match[0] === "") {
      zeroWidth = true;
      regex.lastIndex += 1;
    }
  }
  return { matches, truncated, zeroWidth };
}

function replaceText(pattern, flags, text, replacement, replaceAll) {
  let effectiveFlags = flags;
  if (replaceAll && !effectiveFlags.includes("g")) effectiveFlags += "g";
  if (!replaceAll) effectiveFlags = effectiveFlags.replace(/g/g, "");
  const regex = new RegExp(pattern, effectiveFlags);
  return { value: text.replace(regex, replacement) };
}

function filterLines(pattern, flags, text, limit) {
  const safeFlags = flags.replace(/[gy]/g, "");
  const regex = new RegExp(pattern, safeFlags);
  const lines = text.split(/\r\n|\r|\n/);
  const matching = [];
  const nonmatching = [];
  for (let index = 0; index < lines.length; index += 1) {
    regex.lastIndex = 0;
    const match = regex.exec(lines[index]);
    const row = {
      lineNumber: index + 1,
      content: lines[index],
      groups: match ? Array.from(match).slice(1).map((value) => value === undefined ? null : value) : [],
      namedGroups: match && match.groups ? match.groups : {}
    };
    if (match) matching.push(row); else nonmatching.push(row);
    if (matching.length + nonmatching.length >= limit) break;
  }
  return { matching, nonmatching, totalLines: lines.length, truncated: matching.length + nonmatching.length < lines.length };
}

self.onmessage = (event) => {
  const message = event.data || {};
  try {
    let result;
    if (message.type === "match") {
      result = executeMatches(message.pattern || "", message.flags || "", message.text || "", message.limit || 10000);
    } else if (message.type === "replace") {
      result = replaceText(message.pattern || "", message.flags || "", message.text || "", message.replacement || "", message.replaceAll !== false);
    } else if (message.type === "filterLines") {
      result = filterLines(message.pattern || "", message.flags || "", message.text || "", message.limit || 200000);
    } else {
      throw new Error("Unknown worker operation");
    }
    self.postMessage({ id: message.id, ok: true, result });
  } catch (error) {
    self.postMessage({ id: message.id, ok: false, error: error instanceof Error ? error.message : String(error) });
  }
};
