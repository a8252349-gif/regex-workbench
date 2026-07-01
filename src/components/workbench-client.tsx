"use client";

import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import type { Dictionary } from "@/src/i18n/dictionaries/en";
import type { Locale } from "@/src/i18n/locales";
import type { MatchWorkerResult, RegexMatchResult } from "@/src/types/regex";
import { useRegexWorker } from "./use-regex-worker";
import { inspectRegexRisk } from "@/src/lib/regex/risk";
import { downloadBlob, rowsToCsv } from "@/src/lib/regex/export";
import { normalizeFlags, parseSlashRegex, supportsFlag } from "@/src/lib/regex/parse";

export type WorkbenchMode = "tester" | "replace" | "extract";

type TestCase = {
  id: string;
  text: string;
  shouldMatch: boolean;
  note: string;
  enabled: boolean;
  actual?: boolean;
};

const flagDefinitions = ["g", "i", "m", "s", "u", "y", "d", "v"] as const;

const flagMeanings: Record<Locale, Record<(typeof flagDefinitions)[number], string>> = {
  en: { g: "global search", i: "ignore letter case", m: "multiline anchors", s: "dot matches line breaks", u: "Unicode mode", y: "sticky search", d: "match indices", v: "Unicode sets" },
  ko: { g: "전체 검색", i: "대소문자 무시", m: "여러 줄 앵커", s: "점이 줄바꿈 포함", u: "유니코드 모드", y: "고정 검색", d: "일치 인덱스", v: "유니코드 집합" },
  ja: { g: "全体検索", i: "大文字と小文字を無視", m: "複数行アンカー", s: "ドットが改行にも一致", u: "Unicode モード", y: "スティッキー検索", d: "一致インデックス", v: "Unicode セット" },
  es: { g: "búsqueda global", i: "ignorar mayúsculas", m: "anclas multilínea", s: "el punto incluye saltos", u: "modo Unicode", y: "búsqueda adhesiva", d: "índices de coincidencia", v: "conjuntos Unicode" },
  fr: { g: "recherche globale", i: "ignorer la casse", m: "ancres multilignes", s: "le point inclut les retours", u: "mode Unicode", y: "recherche adhésive", d: "indices des correspondances", v: "ensembles Unicode" },
  de: { g: "globale Suche", i: "Groß-/Kleinschreibung ignorieren", m: "mehrzeilige Anker", s: "Punkt umfasst Zeilenumbrüche", u: "Unicode-Modus", y: "haftende Suche", d: "Trefferindizes", v: "Unicode-Mengen" }
};

function formatTemplate(value: string, count: number) {
  return value.replace("{count}", String(count));
}

function highlightedNodes(text: string, matches: RegexMatchResult[], matchLabel: string) {
  const nodes: React.ReactNode[] = [];
  let cursor = 0;
  matches.forEach((match) => {
    if (match.start > cursor) nodes.push(<Fragment key={`t-${cursor}`}>{text.slice(cursor, match.start)}</Fragment>);
    if (match.start === match.end) {
      nodes.push(<mark key={`m-${match.order}`} title={`${matchLabel} ${match.order}`}>⟂</mark>);
    } else if (match.start >= cursor) {
      nodes.push(<mark key={`m-${match.order}`} title={`${matchLabel} ${match.order}`}>{text.slice(match.start, match.end)}</mark>);
      cursor = match.end;
    }
  });
  if (cursor < text.length) nodes.push(<Fragment key={`t-${cursor}`}>{text.slice(cursor)}</Fragment>);
  return nodes;
}

export function WorkbenchClient({ locale, dictionary, mode }: { locale: Locale; dictionary: Dictionary; mode: WorkbenchMode }) {
  const { run, cancelAll } = useRegexWorker();
  const [pattern, setPattern] = useState("(?<level>INFO|WARN|ERROR)\\s+(?<message>.+)");
  const [flags, setFlags] = useState("g");
  const [text, setText] = useState("INFO Service started\nWARN Disk space is low\nERROR Connection failed");
  const [replacement, setReplacement] = useState("[$<level>] $<message>");
  const [matches, setMatches] = useState<RegexMatchResult[]>([]);
  const [replaceResult, setReplaceResult] = useState("");
  const [replaceAll, setReplaceAll] = useState(true);
  const [extractKind, setExtractKind] = useState("full");
  const [extractGroup, setExtractGroup] = useState("1");
  const [unique, setUnique] = useState(false);
  const [removeEmpty, setRemoveEmpty] = useState(true);
  const [sortValues, setSortValues] = useState(false);
  const [format, setFormat] = useState<"text" | "csv" | "json" | "jsonl">("text");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [truncated, setTruncated] = useState(false);
  const [zeroWidth, setZeroWidth] = useState(false);
  const [running, setRunning] = useState(false);
  const [autoSave, setAutoSave] = useState(true);
  const [testCases, setTestCases] = useState<TestCase[]>([
    { id: "case-1", text: "WARN Cache nearly full", shouldMatch: true, note: "", enabled: true },
    { id: "case-2", text: "DEBUG Hidden trace", shouldMatch: false, note: "", enabled: true }
  ]);
  const initialized = useRef(false);

  const riskFindings = useMemo(() => inspectRegexRisk(pattern), [pattern]);
  const supportedFlags = useMemo(() => Object.fromEntries(flagDefinitions.map((flag) => [flag, supportsFlag(flag)])), []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const params = new URLSearchParams(window.location.search);
      const urlPattern = params.get("pattern");
      const urlFlags = params.get("flags");
      const urlText = params.get("text");
      if (urlPattern !== null) setPattern(urlPattern);
      if (urlFlags !== null) setFlags(normalizeFlags(urlFlags));
      if (urlText !== null && urlText.length <= 1200) setText(urlText);

      const stored = localStorage.getItem("regex-workbench-state");
      if (!urlPattern && stored) {
        try {
          const value = JSON.parse(stored) as { pattern?: string; flags?: string; text?: string; replacement?: string; cases?: TestCase[]; autoSave?: boolean };
          if (value.pattern) setPattern(value.pattern);
          if (typeof value.flags === "string") setFlags(value.flags);
          if (value.text) setText(value.text);
          if (value.replacement) setReplacement(value.replacement);
          if (Array.isArray(value.cases)) setTestCases(value.cases);
          if (typeof value.autoSave === "boolean") setAutoSave(value.autoSave);
        } catch {
          localStorage.removeItem("regex-workbench-state");
        }
      }
      initialized.current = true;
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!initialized.current || !autoSave) return;
    localStorage.setItem("regex-workbench-state", JSON.stringify({ pattern, flags, text: text.slice(0, 5000), replacement, cases: testCases, autoSave }));
  }, [pattern, flags, text, replacement, testCases, autoSave]);

  useEffect(() => {
    const timer = window.setTimeout(() => void execute(false), 250);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pattern, flags, text, replacement, replaceAll]);

  async function execute(manual: boolean) {
    cancelAll();
    setNotice("");
    setError("");
    setRunning(true);
    if (!pattern) {
      setMatches([]);
      setReplaceResult(text);
      setRunning(false);
      return;
    }
    try {
      const result = await run<MatchWorkerResult>({ type: "match", pattern, flags, text, limit: 10000 }, manual ? 1000 : 300);
      setMatches(result.matches);
      setTruncated(result.truncated);
      setZeroWidth(result.zeroWidth);
      if (mode === "replace") {
        const replaced = await run<{ value: string }>({ type: "replace", pattern, flags, text, replacement, replaceAll }, manual ? 1000 : 300);
        setReplaceResult(replaced.value);
      }
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : "REGEX_ERROR";
      setMatches([]);
      setReplaceResult(text);
      setError(message === "REGEX_TIMEOUT" ? dictionary.workbench.timeout : `${dictionary.workbench.invalidPattern} ${message}`);
    } finally {
      setRunning(false);
    }
  }

  function handlePatternBlur() {
    if (!pattern.startsWith("/")) return;
    const parsed = parseSlashRegex(pattern);
    if (parsed.parsed) {
      setPattern(parsed.pattern);
      setFlags(normalizeFlags(parsed.flags));
      setNotice(dictionary.workbench.slashParsed);
    } else if (parsed.error) setError(`${dictionary.workbench.invalidPattern} ${parsed.error}`);
  }

  function toggleFlag(flag: string) {
    if (!supportedFlags[flag]) return;
    setFlags((current) => normalizeFlags(current.includes(flag) ? current.replace(flag, "") : current + flag));
  }

  const extractedValues = useMemo(() => {
    let values: string[] = [];
    if (extractKind === "lines") {
      const lineSet = new Set(matches.map((match) => match.line));
      values = text.split(/\r\n|\r|\n/).filter((_, index) => lineSet.has(index + 1));
    } else if (extractKind === "nonmatching") {
      const lineSet = new Set(matches.map((match) => match.line));
      values = text.split(/\r\n|\r|\n/).filter((_, index) => !lineSet.has(index + 1));
    } else if (extractKind === "group") {
      if (/^\d+$/.test(extractGroup)) {
        const groupIndex = Number(extractGroup);
        values = matches.map((match) => match.groups.find((group) => group.index === groupIndex)?.value ?? "");
      } else {
        values = matches.map((match) => match.namedGroups.find((group) => group.name === extractGroup)?.value ?? "");
      }
    } else values = matches.map((match) => match.value);
    if (removeEmpty) values = values.filter((value) => value !== "");
    if (unique) values = [...new Set(values)];
    if (sortValues) values = [...values].sort((a, b) => a.localeCompare(b, locale));
    return values;
  }, [extractGroup, extractKind, locale, matches, removeEmpty, sortValues, text, unique]);

  const formattedExtract = useMemo(() => {
    if (format === "json") return JSON.stringify(extractedValues, null, 2);
    if (format === "jsonl") return extractedValues.map((value) => JSON.stringify({ value })).join("\n");
    if (format === "csv") return rowsToCsv(["value"], extractedValues.map((value) => [value]));
    return extractedValues.join("\n");
  }, [extractedValues, format]);

  async function copyText(value: string) {
    await navigator.clipboard.writeText(value);
    setNotice(dictionary.common.copied);
  }

  function createShareLink() {
    const url = new URL(window.location.href);
    url.search = "";
    url.searchParams.set("pattern", pattern);
    if (flags) url.searchParams.set("flags", flags);
    if (text.length <= 1000) url.searchParams.set("text", text);
    else setNotice(dictionary.workbench.shareTooLong);
    void navigator.clipboard.writeText(url.toString());
    setNotice(dictionary.workbench.shareWarning);
  }

  async function runCases() {
    const updated: TestCase[] = [];
    for (const testCase of testCases) {
      if (!testCase.enabled) { updated.push(testCase); continue; }
      try {
        const result = await run<MatchWorkerResult>({ type: "match", pattern, flags: flags.replace(/[gy]/g, ""), text: testCase.text, limit: 1 }, 1000);
        updated.push({ ...testCase, actual: result.matches.length > 0 });
      } catch {
        updated.push({ ...testCase, actual: false });
      }
    }
    setTestCases(updated);
  }

  function addCase() {
    setTestCases((current) => [...current, { id: crypto.randomUUID(), text: "", shouldMatch: true, note: "", enabled: true }]);
  }

  function updateCase(id: string, patch: Partial<TestCase>) {
    setTestCases((current) => current.map((item) => item.id === id ? { ...item, ...patch } : item));
  }

  function exportCases() {
    downloadBlob(JSON.stringify(testCases, null, 2), "regex-test-cases.json", "application/json;charset=utf-8");
  }

  function importCases(file: File | undefined) {
    if (!file) return;
    void file.text().then((value) => {
      const parsed = JSON.parse(value) as TestCase[];
      if (!Array.isArray(parsed)) throw new Error("Invalid test case file");
      setTestCases(parsed.map((item) => ({ ...item, id: item.id || crypto.randomUUID() })));
    }).catch((caught) => setError(String(caught)));
  }

  function deleteLocalData() {
    localStorage.removeItem("regex-workbench-state");
    setNotice(dictionary.workbench.localDataDeleted);
  }

  return (
    <section className="tool-shell" aria-label={dictionary.nav[mode === "tester" ? "tester" : mode]}>
      <div className="field">
        <label htmlFor={`pattern-${mode}`}>{dictionary.workbench.patternLabel}</label>
        <input id={`pattern-${mode}`} className="pattern-input" value={pattern} onChange={(event) => setPattern(event.target.value)} onBlur={handlePatternBlur} placeholder={dictionary.workbench.patternPlaceholder} spellCheck={false} autoCapitalize="off" autoCorrect="off" />
      </div>
      <fieldset className="field">
        <legend>{dictionary.workbench.flagsLabel}</legend>
        <div className="flag-row">
          {flagDefinitions.map((flag) => {
            const meaning = flagMeanings[locale][flag];
            return (
            <button key={flag} type="button" className="flag-toggle" data-active={flags.includes(flag)} aria-pressed={flags.includes(flag)} disabled={!supportedFlags[flag]} title={!supportedFlags[flag] ? dictionary.workbench.flagUnsupported : meaning} onClick={() => toggleFlag(flag)}>
              <span className="mono">{flag}</span>
              <span className="sr-only">{meaning}</span>
            </button>
            );
          })}
        </div>
      </fieldset>
      {mode === "replace" && (
        <div className="field">
          <label htmlFor="replacement">{dictionary.workbench.replacementLabel}</label>
          <input id="replacement" className="pattern-input" value={replacement} onChange={(event) => setReplacement(event.target.value)} placeholder={dictionary.workbench.replacementPlaceholder} />
          <label className="flag-toggle"><input type="checkbox" checked={replaceAll} onChange={(event) => setReplaceAll(event.target.checked)} /> {replaceAll ? dictionary.workbench.replaceAll : dictionary.workbench.replaceFirst}</label>
        </div>
      )}
      <div className="button-row">
        <button className="button button-primary" type="button" onClick={() => void execute(true)} disabled={running}>{dictionary.workbench.runManual}</button>
        <button className="button button-secondary" type="button" onClick={createShareLink}>{dictionary.workbench.share}</button>
        <label className="flag-toggle"><input type="checkbox" checked={autoSave} onChange={(event) => setAutoSave(event.target.checked)} /> {dictionary.workbench.autosave}</label>
      </div>
      <div aria-live="polite" className={`status ${error ? "status-error" : ""}`}>{running ? dictionary.common.loading : error || notice || dictionary.common.engine}</div>
      {riskFindings.length > 0 && <div className="status status-warning" role="status"><strong>{dictionary.workbench.risk}</strong> — {dictionary.workbench.riskNote}</div>}
      {zeroWidth && <div className="status status-warning">{dictionary.workbench.zeroWidth}</div>}
      {truncated && <div className="status status-warning">{formatTemplate(dictionary.workbench.resultLimit, 10000)}</div>}

      <div className="tool-grid">
        <div>
          <div className="field">
            <label htmlFor={`text-${mode}`}>{dictionary.workbench.testTextLabel}</label>
            <textarea id={`text-${mode}`} value={text} onChange={(event) => setText(event.target.value)} placeholder={dictionary.workbench.testTextPlaceholder} spellCheck={false} />
          </div>
          <h3>{dictionary.workbench.highlightPreview}</h3>
          <div className="preview" aria-label={dictionary.workbench.highlightPreview}>{highlightedNodes(text, matches, dictionary.workbench.matchNumber)}</div>
        </div>
        <div>
          {mode === "replace" ? (
            <>
              <h3>{dictionary.workbench.replaceResult}</h3>
              <div className="result-output" data-testid="replace-result">{replaceResult}</div>
              <div className="button-row">
                <button className="button" type="button" onClick={() => void copyText(replaceResult)}>{dictionary.common.copy}</button>
                <button className="button" type="button" onClick={() => downloadBlob(replaceResult, "regex-replaced.txt")}>{dictionary.common.download}</button>
              </div>
            </>
          ) : mode === "extract" ? (
            <>
              <div className="field">
                <label htmlFor="extract-mode">{dictionary.workbench.extractMode}</label>
                <select id="extract-mode" value={extractKind} onChange={(event) => setExtractKind(event.target.value)}>
                  <option value="full">{dictionary.workbench.extractAll}</option>
                  <option value="group">{dictionary.workbench.extractGroup}</option>
                  <option value="lines">{dictionary.workbench.extractLines}</option>
                  <option value="nonmatching">{dictionary.workbench.extractNonmatching}</option>
                </select>
              </div>
              {extractKind === "group" && <div className="field"><label htmlFor="group-id">{dictionary.workbench.extractGroup}</label><input id="group-id" value={extractGroup} onChange={(event) => setExtractGroup(event.target.value)} /></div>}
              <div className="flag-row">
                <label className="flag-toggle"><input type="checkbox" checked={unique} onChange={(event) => setUnique(event.target.checked)} /> {dictionary.workbench.unique}</label>
                <label className="flag-toggle"><input type="checkbox" checked={removeEmpty} onChange={(event) => setRemoveEmpty(event.target.checked)} /> {dictionary.workbench.removeEmpty}</label>
                <label className="flag-toggle"><input type="checkbox" checked={sortValues} onChange={(event) => setSortValues(event.target.checked)} /> {dictionary.workbench.sort}</label>
              </div>
              <div className="field"><label htmlFor="format">{dictionary.workbench.format}</label><select id="format" value={format} onChange={(event) => setFormat(event.target.value as typeof format)}><option value="text">{dictionary.workbench.plainText}</option><option value="csv">{dictionary.workbench.csv}</option><option value="json">{dictionary.workbench.json}</option><option value="jsonl">{dictionary.workbench.jsonLines}</option></select></div>
              <div className="result-output" data-testid="extract-result">{formattedExtract}</div>
              <div className="button-row"><button className="button" type="button" onClick={() => void copyText(formattedExtract)}>{dictionary.common.copy}</button><button className="button" type="button" onClick={() => downloadBlob(formattedExtract, `regex-extract.${format === "text" ? "txt" : format}`)}>{dictionary.common.download}</button></div>
            </>
          ) : (
            <>
              <h3>{dictionary.workbench.matches}: {matches.length}</h3>
              {matches.length === 0 ? <p>{dictionary.workbench.noMatches}</p> : (
                <div className="match-list" data-testid="match-list">
                  {matches.slice(0, 250).map((match) => (
                    <article className="match-card" key={`${match.start}-${match.order}`}>
                      <strong>{dictionary.workbench.matchNumber} {match.order}</strong>
                      <div className="mono">{match.value === "" ? dictionary.workbench.emptyValue : match.value}</div>
                      <p className="match-meta">{dictionary.workbench.start}: {match.start} · {dictionary.workbench.end}: {match.end} · {dictionary.workbench.line}: {match.line} · {dictionary.workbench.column}: {match.column}</p>
                      {(match.groups.length > 0 || match.namedGroups.length > 0) && (
                        <table className="group-table"><thead><tr><th>{dictionary.workbench.groups}</th><th>{dictionary.workbench.fullMatch}</th></tr></thead><tbody>
                          {match.groups.map((group) => <tr key={`g-${group.index}`}><th scope="row">${group.index}</th><td>{group.participated ? (group.value === "" ? dictionary.workbench.emptyValue : group.value) : dictionary.workbench.optionalMissing}</td></tr>)}
                          {match.namedGroups.map((group) => <tr key={`n-${group.name}`}><th scope="row">{group.name}</th><td>{group.participated ? (group.value === "" ? dictionary.workbench.emptyValue : group.value) : dictionary.workbench.optionalMissing}</td></tr>)}
                        </tbody></table>
                      )}
                    </article>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {mode === "tester" && (
        <section aria-labelledby="test-cases-heading">
          <h3 id="test-cases-heading">{dictionary.workbench.testCases}</h3>
          <div className="button-row">
            <button className="button" type="button" onClick={addCase}>{dictionary.workbench.addCase}</button>
            <button className="button" type="button" onClick={() => void runCases()}>{dictionary.workbench.run}</button>
            <button className="button" type="button" onClick={exportCases}>{dictionary.workbench.exportCases}</button>
            <label className="button">{dictionary.workbench.importCases}<input className="sr-only" type="file" accept="application/json,.json" onChange={(event) => importCases(event.target.files?.[0])} /></label>
          </div>
          {testCases.map((testCase) => {
            const passed = testCase.actual === undefined ? undefined : testCase.actual === testCase.shouldMatch;
            return <div className="test-case" key={testCase.id}>
              <div>
                <label className="field"><span>{dictionary.workbench.caseText}</span><input value={testCase.text} onChange={(event) => updateCase(testCase.id, { text: event.target.value })} /></label>
                <label className="flag-toggle"><input type="checkbox" checked={testCase.shouldMatch} onChange={(event) => updateCase(testCase.id, { shouldMatch: event.target.checked })} /> {testCase.shouldMatch ? dictionary.workbench.shouldMatch : dictionary.workbench.shouldNotMatch}</label>
                <label className="field"><span>{dictionary.workbench.note}</span><input value={testCase.note} onChange={(event) => updateCase(testCase.id, { note: event.target.value })} /></label>
              </div>
              <div>
                {passed !== undefined && <span className={`badge ${passed ? "badge-pass" : "badge-fail"}`}>{passed ? dictionary.workbench.pass : dictionary.workbench.fail}</span>}
                <div className="button-row"><button className="button" type="button" onClick={() => setTestCases((current) => [...current, { ...testCase, id: crypto.randomUUID() }])}>{dictionary.workbench.duplicate}</button><button className="button button-danger" type="button" onClick={() => setTestCases((current) => current.filter((item) => item.id !== testCase.id))}>{dictionary.workbench.delete}</button></div>
              </div>
            </div>;
          })}
        </section>
      )}

      <div className="button-row">
        <button className="button button-danger" type="button" onClick={deleteLocalData}>{dictionary.workbench.deleteLocalData}</button>
        <button className="button" type="button" onClick={() => { setPattern(""); setText(""); setMatches([]); }}>{dictionary.common.clear}</button>
      </div>
    </section>
  );
}
