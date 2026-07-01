export function getLineColumn(text: string, index: number): { line: number; column: number } {
  const before = text.slice(0, Math.max(0, index));
  const lines = before.split(/\r\n|\r|\n/);
  return { line: lines.length, column: (lines.at(-1)?.length || 0) + 1 };
}
