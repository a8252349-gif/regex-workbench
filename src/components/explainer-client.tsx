"use client";

import { useMemo, useState } from "react";
import type { Dictionary } from "@/src/i18n/dictionaries/en";
import { inspectRegexRisk } from "@/src/lib/regex/risk";

interface ExplainedToken {
  token: string;
  type: string;
  meaning: string;
}

function tokenize(pattern: string, dictionary: Dictionary): ExplainedToken[] {
  const tokens: ExplainedToken[] = [];
  let index = 0;
  while (index < pattern.length) {
    const rest = pattern.slice(index);
    const named = rest.match(/^\(\?<([A-Za-z][A-Za-z0-9_]*)>/);
    if (named) { tokens.push({ token: named[0], type: dictionary.explainer.group, meaning: `${dictionary.explainer.group}: ${named[1]}` }); index += named[0].length; continue; }
    const look = rest.match(/^\(\?(?:=|!|<=|<!)/);
    if (look) { tokens.push({ token: look[0], type: dictionary.explainer.assertion, meaning: dictionary.explainer.assertion }); index += look[0].length; continue; }
    const charClass = rest.match(/^\[(?:\\.|[^\]])*\]/);
    if (charClass) { tokens.push({ token: charClass[0], type: dictionary.explainer.characterClass, meaning: dictionary.explainer.characterClass }); index += charClass[0].length; continue; }
    const unicode = rest.match(/^\\p\{[^}]+\}|^\\P\{[^}]+\}/);
    if (unicode) { tokens.push({ token: unicode[0], type: dictionary.explainer.characterClass, meaning: `${dictionary.explainer.characterClass}: Unicode` }); index += unicode[0].length; continue; }
    const escape = rest.match(/^\\(?:[dDsSwWbBtrnvf0]|x[0-9A-Fa-f]{2}|u(?:[0-9A-Fa-f]{4}|\{[0-9A-Fa-f]+\})|k<[^>]+>|[1-9]\d*|.)/);
    if (escape) { tokens.push({ token: escape[0], type: escape[0].match(/^\\(?:[1-9]|k<)/) ? dictionary.explainer.backreference : dictionary.explainer.escape, meaning: escape[0].match(/^\\(?:[1-9]|k<)/) ? dictionary.explainer.backreference : dictionary.explainer.escape }); index += escape[0].length; continue; }
    const quantifier = rest.match(/^(?:[*+?](?:\?)?|\{\d+(?:,\d*)?\}(?:\?)?)/);
    if (quantifier) { tokens.push({ token: quantifier[0], type: dictionary.explainer.quantifier, meaning: dictionary.explainer.quantifier }); index += quantifier[0].length; continue; }
    const char = pattern[index];
    if (char === "^" || char === "$") tokens.push({ token: char, type: dictionary.explainer.anchor, meaning: dictionary.explainer.anchor });
    else if (char === "|") tokens.push({ token: char, type: dictionary.explainer.alternation, meaning: dictionary.explainer.alternation });
    else if (char === "(" || char === ")") tokens.push({ token: char, type: dictionary.explainer.group, meaning: dictionary.explainer.group });
    else if (char === ".") tokens.push({ token: char, type: dictionary.explainer.characterClass, meaning: dictionary.explainer.characterClass });
    else tokens.push({ token: char, type: dictionary.explainer.literal, meaning: dictionary.explainer.literal });
    index += 1;
  }
  return tokens;
}

export function ExplainerClient({ dictionary }: { dictionary: Dictionary }) {
  const [pattern, setPattern] = useState("^(?<code>[A-Z]{2})-(?<number>\\d{4})$");
  const tokens = useMemo(() => tokenize(pattern, dictionary), [pattern, dictionary]);
  const risks = useMemo(() => inspectRegexRisk(pattern), [pattern]);
  const width = Math.max(720, tokens.length * 96);
  return (
    <section className="tool-shell" aria-labelledby="explainer-heading">
      <h2 id="explainer-heading">{dictionary.explainer.title}</h2>
      <label className="field"><span>{dictionary.workbench.patternLabel}</span><input className="pattern-input" value={pattern} onChange={(event) => setPattern(event.target.value)} spellCheck={false} /></label>
      {risks.length > 0 && <div className="status status-warning"><strong>{dictionary.workbench.risk}</strong> — {dictionary.workbench.riskNote}</div>}
      <div className="table-wrap">
        <table className="data-table"><thead><tr><th>{dictionary.explainer.token}</th><th>{dictionary.explainer.type}</th><th>{dictionary.explainer.meaning}</th></tr></thead><tbody>
          {tokens.map((token, index) => <tr key={`${token.token}-${index}`}><td><code>{token.token}</code></td><td>{token.type}</td><td>{token.meaning}</td></tr>)}
        </tbody></table>
      </div>
      <h3>{dictionary.explainer.visualizer}</h3>
      <div className="table-wrap">
        <svg className="guide-visual" viewBox={`0 0 ${width} 170`} role="img" aria-labelledby="pattern-tree-title pattern-tree-desc">
          <title id="pattern-tree-title">{dictionary.explainer.visualizer}</title>
          <desc id="pattern-tree-desc">{dictionary.explainer.description}: {tokens.map((token) => `${token.token}, ${token.type}`).join("; ")}</desc>
          <line x1="40" y1="85" x2={width - 40} y2="85" stroke="currentColor" strokeWidth="2" />
          {tokens.map((token, index) => {
            const x = 55 + index * 92;
            return <g key={`${token.token}-svg-${index}`}><rect x={x} y="45" width="76" height="80" rx="8" fill="none" stroke="currentColor" /><text x={x + 38} y="76" textAnchor="middle" fontSize="14" fill="currentColor">{token.token.slice(0, 8)}</text><text x={x + 38} y="103" textAnchor="middle" fontSize="10" fill="currentColor">{token.type.slice(0, 12)}</text></g>;
          })}
        </svg>
      </div>
      <p className="callout">{dictionary.explainer.unreliable}</p>
    </section>
  );
}
