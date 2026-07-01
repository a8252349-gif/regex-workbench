export interface ParsedSlashRegex {
  pattern: string;
  flags: string;
  parsed: boolean;
  error?: string;
}

const validFlags = new Set(["g", "i", "m", "s", "u", "y", "d", "v"]);

export function parseSlashRegex(input: string): ParsedSlashRegex {
  if (!input.startsWith("/")) return { pattern: input, flags: "", parsed: false };

  let escaped = false;
  let inClass = false;
  let closingIndex = -1;

  for (let index = 1; index < input.length; index += 1) {
    const character = input[index];
    if (escaped) {
      escaped = false;
      continue;
    }
    if (character === "\\") {
      escaped = true;
      continue;
    }
    if (character === "[") inClass = true;
    if (character === "]") inClass = false;
    if (character === "/" && !inClass) closingIndex = index;
  }

  if (closingIndex <= 0) {
    return { pattern: input, flags: "", parsed: false, error: "Missing closing slash." };
  }

  const pattern = input.slice(1, closingIndex);
  const flags = input.slice(closingIndex + 1);
  const seen = new Set<string>();
  for (const flag of flags) {
    if (!validFlags.has(flag)) return { pattern: input, flags: "", parsed: false, error: `Unsupported flag: ${flag}` };
    if (seen.has(flag)) return { pattern: input, flags: "", parsed: false, error: `Duplicate flag: ${flag}` };
    seen.add(flag);
  }
  return { pattern, flags, parsed: true };
}

export function normalizeFlags(flags: string): string {
  const order = "dgimsuvy";
  return [...new Set(flags)].sort((a, b) => order.indexOf(a) - order.indexOf(b)).join("");
}

export function supportsFlag(flag: string): boolean {
  try {
    new RegExp("", flag);
    return true;
  } catch {
    return false;
  }
}
