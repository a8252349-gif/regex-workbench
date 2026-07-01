"use client";

import { useMemo, useState } from "react";
import type { Dictionary } from "@/src/i18n/dictionaries/en";
import type { Locale } from "@/src/i18n/locales";
import { countComplexity } from "@/src/lib/regex/risk";
import { localizedPath } from "@/src/lib/site-config";

const patterns = [
  { pattern: "^\\d{4}-\\d{2}-\\d{2}$", good: "2026-07-01", bad: "01/07/2026" },
  { pattern: "^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$", good: "123e4567-e89b-12d3-a456-426614174000", bad: "uuid-123" },
  { pattern: "^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$", good: "#3156d9", bad: "3156d9" },
  { pattern: "^[a-z0-9]+(?:-[a-z0-9]+)*$", good: "regex-workbench", bad: "Regex Workbench" },
  { pattern: "\\s+", good: "two   spaces", bad: "compact" },
  { pattern: "\\b(?:INFO|WARN|ERROR)\\b", good: "WARN Disk low", bad: "DEBUG trace" },
  { pattern: "-?\\d+(?:\\.\\d+)?", good: "total=-19.5", bad: "none" }
];

const patternNames: Record<Locale, string[]> = {
  en: ["ISO-like date", "UUID", "Hex color", "Basic slug", "Repeated whitespace", "Log level", "Number extraction"],
  ko: ["ISO 형식 날짜", "UUID", "16진수 색상", "기본 슬러그", "반복 공백", "로그 수준", "숫자 추출"],
  ja: ["ISO 形式の日付", "UUID", "16進カラー", "基本スラッグ", "連続空白", "ログレベル", "数値抽出"],
  es: ["Fecha tipo ISO", "UUID", "Color hexadecimal", "Slug básico", "Espacios repetidos", "Nivel de registro", "Extracción numérica"],
  fr: ["Date de type ISO", "UUID", "Couleur hexadécimale", "Slug simple", "Espaces répétés", "Niveau de journal", "Extraction de nombres"],
  de: ["ISO-ähnliches Datum", "UUID", "Hex-Farbe", "Einfacher Slug", "Wiederholter Leerraum", "Log-Stufe", "Zahlenextraktion"]
};

const resultLabels: Record<Locale, { noMatch: string; unsupported: string }> = {
  en: { noMatch: "No match", unsupported: "Unsupported" },
  ko: { noMatch: "일치 없음", unsupported: "지원되지 않음" },
  ja: { noMatch: "一致なし", unsupported: "未対応" },
  es: { noMatch: "Sin coincidencia", unsupported: "No compatible" },
  fr: { noMatch: "Aucune correspondance", unsupported: "Non pris en charge" },
  de: { noMatch: "Kein Treffer", unsupported: "Nicht unterstützt" }
};

function regexEscape(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function ResourcesClient({ locale, dictionary }: { locale: Locale; dictionary: Dictionary }) {
  const [tab, setTab] = useState<"escape" | "flags" | "complexity" | "library">("escape");
  const [literal, setLiteral] = useState("price: $19.99 (sale)");
  const [pattern, setPattern] = useState("^(a+)+$");
  const [flagText, setFlagText] = useState("Line ONE\nline two");
  const complexity = useMemo(() => countComplexity(pattern), [pattern]);
  const escaped = regexEscape(literal);
  const jsStringEscaped = escaped.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
  const flagResults = ["", "i", "m", "s", "im", "ims"].map((flags) => {
    try { return { flags: flags || "—", result: new RegExp("^line.+$", flags).exec(flagText)?.[0] || resultLabels[locale].noMatch }; }
    catch { return { flags: flags || "—", result: resultLabels[locale].unsupported }; }
  });
  return (
    <section className="tool-shell" aria-label={dictionary.nav.resources}>
      <div className="tabs" role="tablist">
        <button className="tab" role="tab" aria-selected={tab === "escape"} onClick={() => setTab("escape")}>{dictionary.resources.escapeTool}</button>
        <button className="tab" role="tab" aria-selected={tab === "flags"} onClick={() => setTab("flags")}>{dictionary.resources.flagsExplorer}</button>
        <button className="tab" role="tab" aria-selected={tab === "complexity"} onClick={() => setTab("complexity")}>{dictionary.resources.complexity}</button>
        <button className="tab" role="tab" aria-selected={tab === "library"} onClick={() => setTab("library")}>{dictionary.resources.library}</button>
      </div>
      {tab === "escape" && <div className="tool-grid"><label className="field"><span>{dictionary.resources.literalInput}</span><textarea value={literal} onChange={(event) => setLiteral(event.target.value)} /></label><div><h3>{dictionary.resources.regexEscaped}</h3><div className="result-output mono">{escaped}</div><h3>{dictionary.resources.stringEscaped}</h3><div className="result-output mono">{jsStringEscaped}</div></div></div>}
      {tab === "flags" && <div><label className="field"><span>{dictionary.workbench.testTextLabel}</span><textarea value={flagText} onChange={(event) => setFlagText(event.target.value)} /></label><table className="data-table"><thead><tr><th>{dictionary.workbench.flagsLabel}</th><th>{dictionary.workbench.matches}</th></tr></thead><tbody>{flagResults.map((row) => <tr key={row.flags}><td><code>{row.flags}</code></td><td className="mono">{row.result}</td></tr>)}</tbody></table></div>}
      {tab === "complexity" && <div><label className="field"><span>{dictionary.workbench.patternLabel}</span><input className="pattern-input" value={pattern} onChange={(event) => setPattern(event.target.value)} /></label><div className="content-grid"><article className="card"><strong>{dictionary.resources.patternLength}</strong><div>{complexity.length}</div></article><article className="card"><strong>{dictionary.resources.groupCount}</strong><div>{complexity.groups}</div></article><article className="card"><strong>{dictionary.resources.quantifierCount}</strong><div>{complexity.quantifiers}</div></article><article className="card"><strong>{dictionary.resources.alternationCount}</strong><div>{complexity.alternations}</div></article><article className="card"><strong>{dictionary.resources.lookaroundCount}</strong><div>{complexity.lookarounds}</div></article><article className="card"><strong>{dictionary.resources.backreferenceCount}</strong><div>{complexity.backreferences}</div></article></div>{complexity.risks.length > 0 && <p className="status status-warning">{dictionary.workbench.risk}: {dictionary.workbench.riskNote}</p>}<p>{dictionary.resources.staticOnly}</p></div>}
      {tab === "library" && <div className="content-grid">{patterns.map((item, index) => <article className="card" key={item.pattern}><h3>{patternNames[locale][index]}</h3><code>{item.pattern}</code><p>✓ <code>{item.good}</code></p><p>✕ <code>{item.bad}</code></p><a className="button" href={`${localizedPath(locale, "tester")}?pattern=${encodeURIComponent(item.pattern)}&text=${encodeURIComponent(`${item.good}\n${item.bad}`)}`}>{dictionary.resources.tryPattern}</a></article>)}</div>}
    </section>
  );
}
