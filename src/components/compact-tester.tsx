"use client";

import { useMemo, useState } from "react";
import type { Dictionary } from "@/src/i18n/dictionaries/en";

export function CompactTester({ dictionary }: { dictionary: Dictionary }) {
  const [pattern, setPattern] = useState("[A-Z]{2}\\d{4}");
  const [text, setText] = useState("Order AB2048 is ready; XY9999 is pending.");
  const result = useMemo(() => {
    try { return Array.from(text.matchAll(new RegExp(pattern, "g"))).map((match) => match[0]); }
    catch { return []; }
  }, [pattern, text]);
  return <section className="tool-shell"><div className="tool-grid"><div><label className="field"><span>{dictionary.workbench.patternLabel}</span><input className="pattern-input" value={pattern} onChange={(event) => setPattern(event.target.value)} /></label><label className="field"><span>{dictionary.workbench.testTextLabel}</span><textarea value={text} onChange={(event) => setText(event.target.value)} /></label></div><div><h3>{dictionary.workbench.matches}: {result.length}</h3><div className="result-output mono">{result.join("\n") || dictionary.workbench.noMatches}</div></div></div></section>;
}
