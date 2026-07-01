import { describe, expect, it } from "vitest";
import { parseSlashRegex, normalizeFlags } from "@/src/lib/regex/parse";
import { getLineColumn } from "@/src/lib/regex/line-column";
import { inspectRegexRisk, countComplexity } from "@/src/lib/regex/risk";
import { escapeCsv, rowsToCsv, sanitizeFileName } from "@/src/lib/regex/export";
import { localizedPath, absoluteUrl } from "@/src/lib/site-config";

describe("slash regex parser", () => {
  it("parses escaped slashes and flags", () => {
    expect(parseSlashRegex(String.raw`/https?:\/\/[^/]+/gi`)).toEqual({ pattern: String.raw`https?:\/\/[^/]+`, flags: "gi", parsed: true });
  });
  it("does not treat a slash inside a class as the terminator", () => {
    const value = parseSlashRegex(String.raw`/[a/b]+/g`);
    expect(value.pattern).toBe(String.raw`[a/b]+`);
  });
  it("reports duplicate flags without deleting the input", () => {
    const value = parseSlashRegex(`/abc/gg`);
    expect(value.parsed).toBe(false);
    expect(value.pattern).toBe(`/abc/gg`);
  });
  it("normalizes flags", () => expect(normalizeFlags("mggi")).toBe("gim"));
});

describe("regex utilities", () => {
  it("calculates line and column across CRLF", () => expect(getLineColumn("a\r\nbc\n", 4)).toEqual({ line: 2, column: 2 }));
  it("detects nested quantifier risk", () => expect(inspectRegexRisk("^(a+)+$").some((item) => item.code === "nested-quantifier")).toBe(true));
  it("counts complexity", () => expect(countComplexity("(?<x>a+)|(b)").groups).toBeGreaterThanOrEqual(2));
  it("escapes CSV values", () => expect(escapeCsv('a,"b"')).toBe('"a,""b"""'));
  it("creates CRLF CSV", () => expect(rowsToCsv(["a"], [["b"], ["c"]])).toBe("a\r\nb\r\nc"));
  it("sanitizes export file names", () => expect(sanitizeFileName("../bad:name.txt")).not.toMatch(/[/:]/));
  it("builds localized trailing-slash paths", () => expect(localizedPath("fr", "tester")).toBe("/fr/tester/"));
  it("builds absolute URLs", () => expect(absoluteUrl("/en/tester/")).toBe("http://localhost:3000/en/tester/"));
});

describe("JavaScript RegExp behaviors", () => {
  it("handles named groups", () => expect(/(?<year>\d{4})/.exec("2026")?.groups?.year).toBe("2026"));
  it("supports replacement tokens", () => expect("Kim, Mina".replace(/(?<last>\w+),\s*(?<first>\w+)/, "$<first> $<last>")).toBe("Mina Kim"));
  it("distinguishes an unmatched optional group", () => expect(/(a)?b/.exec("b")?.[1]).toBeUndefined());
  it("allows safe manual advancement for zero-width global matches", () => {
    const regex = /(?=a)/g; const input = "aa"; const positions: number[] = []; let match;
    while ((match = regex.exec(input))) { positions.push(match.index); if (match[0] === "") regex.lastIndex += 1; }
    expect(positions).toEqual([0, 1]);
  });
});
