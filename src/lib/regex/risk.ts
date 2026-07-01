export interface RiskFinding {
  code: string;
  detail: string;
}

export function inspectRegexRisk(pattern: string): RiskFinding[] {
  const findings: RiskFinding[] = [];
  if (/\([^)]*[+*][^)]*\)[+*{]/.test(pattern)) {
    findings.push({ code: "nested-quantifier", detail: "Nested quantifier structure" });
  }
  if (/\.\*[+*{]|\.\+[*+{]/.test(pattern)) {
    findings.push({ code: "repeated-wildcard", detail: "Repeated wildcard quantifier" });
  }
  if (/\((?:[^|()]+\|)+[^)]+\)[+*{]/.test(pattern)) {
    findings.push({ code: "ambiguous-alternation", detail: "Repeated alternation may share prefixes" });
  }
  if (/(?:\[[^\]]+\]|\\[dwsDWS]|\.)[+*].*(?:\[[^\]]+\]|\\[dwsDWS]|\.)[+*]/.test(pattern)) {
    findings.push({ code: "multiple-unbounded", detail: "Several unbounded regions" });
  }
  return findings;
}

export function countComplexity(pattern: string) {
  return {
    length: pattern.length,
    groups: (pattern.match(/\((?!\?[:=!<])/g) || []).length + (pattern.match(/\(\?<[^=!][^>]*>/g) || []).length,
    quantifiers: (pattern.match(/(?:[*+?]|\{\d+(?:,\d*)?\})/g) || []).length,
    alternations: (pattern.match(/\|/g) || []).length,
    lookarounds: (pattern.match(/\(\?(?:=|!|<=|<!)/g) || []).length,
    backreferences: (pattern.match(/\\(?:[1-9]\d*|k<[^>]+>)/g) || []).length,
    risks: inspectRegexRisk(pattern)
  };
}
