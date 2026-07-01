"use client";

import { useMemo, useState } from "react";
import type { Dictionary } from "@/src/i18n/dictionaries/en";
import type { FileFilterWorkerResult, FileLineResult } from "@/src/types/regex";
import { useRegexWorker } from "./use-regex-worker";
import { downloadBlob, rowsToCsv, sanitizeFileName } from "@/src/lib/regex/export";
import { normalizeFlags } from "@/src/lib/regex/parse";

interface ProcessedFile {
  name: string;
  size: number;
  status: "processed" | "failed" | "cancelled";
  error?: string;
  result?: FileFilterWorkerResult;
}

const allowedExtensions = new Set(["txt", "log", "csv", "tsv", "jsonl", "ndjson"]);

export function FileFilterClient({ dictionary }: { dictionary: Dictionary }) {
  const { run, cancelAll } = useRegexWorker();
  const [pattern, setPattern] = useState("ERROR|WARN");
  const [flags, setFlags] = useState("i");
  const [advanced, setAdvanced] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [results, setResults] = useState<ProcessedFile[]>([]);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [view, setView] = useState<"matching" | "nonmatching">("matching");

  const sizeLimit = advanced ? 100 * 1024 * 1024 : 25 * 1024 * 1024;

  function validateFiles(nextFiles: File[]) {
    const valid: File[] = [];
    const errors: string[] = [];
    nextFiles.forEach((file) => {
      const extension = file.name.split(".").pop()?.toLowerCase() || "";
      if (!allowedExtensions.has(extension)) errors.push(`${file.name}: ${dictionary.file.unsupported}`);
      else if (file.size > sizeLimit) errors.push(`${file.name}: ${dictionary.file.tooLarge}`);
      else valid.push(file);
    });
    setFiles(valid);
    setError(errors.join(" "));
  }

  async function processFiles(targetFiles = files) {
    if (!pattern || targetFiles.length === 0) return;
    setProcessing(true);
    setProgress(0);
    setError("");
    const output: ProcessedFile[] = [];
    for (let index = 0; index < targetFiles.length; index += 1) {
      const file = targetFiles[index];
      try {
        const text = await file.text();
        const result = await run<FileFilterWorkerResult>({ type: "filterLines", pattern, flags: flags.replace(/[gy]/g, ""), text, limit: 200000 }, advanced ? 15000 : 7000);
        output.push({ name: file.name, size: file.size, status: "processed", result });
      } catch (caught) {
        const message = caught instanceof Error ? caught.message : String(caught);
        output.push({ name: file.name, size: file.size, status: message === "REGEX_TIMEOUT" ? "cancelled" : "failed", error: message === "REGEX_TIMEOUT" ? dictionary.workbench.timeout : message });
      }
      setProgress(Math.round(((index + 1) / targetFiles.length) * 100));
      setResults([...output]);
    }
    setProcessing(false);
  }

  function cancel() {
    cancelAll();
    setProcessing(false);
    setError(dictionary.file.cancelled);
  }

  const allRows = useMemo(() => {
    return results.flatMap((file) => {
      const selected = view === "matching" ? file.result?.matching || [] : file.result?.nonmatching || [];
      return selected.map((row) => ({ ...row, fileName: file.name }));
    });
  }, [results, view]);

  function rowsAsText(rows: (FileLineResult & { fileName: string })[]) {
    return rows.map((row) => row.content).join("\n");
  }

  function downloadCsv() {
    const csv = rowsToCsv([dictionary.file.fileName, dictionary.file.lineNumber, dictionary.file.content], allRows.map((row) => [row.fileName, row.lineNumber, row.content]));
    downloadBlob(csv, "regex-file-filter.csv", "text/csv;charset=utf-8");
  }

  async function downloadZip() {
    const { default: JSZip } = await import("jszip");
    const zip = new JSZip();
    results.forEach((file) => {
      if (!file.result) return;
      const rows = view === "matching" ? file.result.matching : file.result.nonmatching;
      zip.file(`${sanitizeFileName(file.name)}-${view}.txt`, rows.map((row) => row.content).join("\n"));
      zip.file(`${sanitizeFileName(file.name)}-${view}.csv`, rowsToCsv([dictionary.file.lineNumber, dictionary.file.content], rows.map((row) => [row.lineNumber, row.content])));
    });
    const blob = await zip.generateAsync({ type: "blob" });
    downloadBlob(blob, "regex-file-filter.zip", "application/zip");
  }

  return (
    <section className="tool-shell" aria-labelledby="file-filter-heading">
      <h2 id="file-filter-heading">{dictionary.file.title}</h2>
      <p>{dictionary.file.noUpload}</p>
      <div className="tool-grid">
        <div>
          <label className="field"><span>{dictionary.workbench.patternLabel}</span><input className="pattern-input" value={pattern} onChange={(event) => setPattern(event.target.value)} /></label>
          <label className="field"><span>{dictionary.workbench.flagsLabel}</span><input className="pattern-input" value={flags} onChange={(event) => setFlags(normalizeFlags(event.target.value.replace(/[^dgimsuvy]/g, "")))} /></label>
          <label className="flag-toggle"><input type="checkbox" checked={advanced} onChange={(event) => setAdvanced(event.target.checked)} /> {dictionary.file.advanced}</label>
          {advanced && <p className="status status-warning">{dictionary.file.advancedWarning}</p>}
          <p>{dictionary.file.maxSize}: {advanced ? "100 MB" : "25 MB"}</p>
        </div>
        <div
          className="drop-zone"
          data-dragging={dragging}
          onDragEnter={(event) => { event.preventDefault(); setDragging(true); }}
          onDragOver={(event) => event.preventDefault()}
          onDragLeave={() => setDragging(false)}
          onDrop={(event) => { event.preventDefault(); setDragging(false); validateFiles(Array.from(event.dataTransfer.files)); }}
        >
          <p>{dictionary.file.drop}</p>
          <label className="button button-primary">{dictionary.file.choose}<input className="sr-only" type="file" multiple accept=".txt,.log,.csv,.tsv,.jsonl,.ndjson,text/plain,text/csv" onChange={(event) => validateFiles(Array.from(event.target.files || []))} /></label>
          {files.length > 0 && <ul>{files.map((file) => <li key={`${file.name}-${file.size}`}>{file.name} — {(file.size / 1024 / 1024).toFixed(2)} MB</li>)}</ul>}
        </div>
      </div>
      <div className="button-row">
        <button type="button" className="button button-primary" onClick={() => void processFiles()} disabled={processing || files.length === 0}>{dictionary.workbench.runManual}</button>
        {processing && <button type="button" className="button button-danger" onClick={cancel}>{dictionary.common.cancel}</button>}
        <button type="button" className="button" onClick={() => { setFiles([]); setResults([]); setProgress(0); }}>{dictionary.common.clear}</button>
      </div>
      <div aria-live="polite" className={`status ${error ? "status-error" : ""}`}>{processing ? `${dictionary.file.processing}: ${progress}%` : error || `${dictionary.file.processed}: ${results.filter((item) => item.status === "processed").length}`}</div>
      {processing && <progress className="progress" max={100} value={progress}>{progress}%</progress>}

      {results.length > 0 && (
        <section className="file-result">
          <div className="tabs" role="tablist">
            <button className="tab" role="tab" aria-selected={view === "matching"} onClick={() => setView("matching")}>{dictionary.file.matchingLines}</button>
            <button className="tab" role="tab" aria-selected={view === "nonmatching"} onClick={() => setView("nonmatching")}>{dictionary.file.nonmatchingLines}</button>
          </div>
          <div className="button-row">
            <button className="button" onClick={() => downloadBlob(rowsAsText(allRows), `regex-${view}.txt`)}>{dictionary.file.downloadTxt}</button>
            <button className="button" onClick={downloadCsv}>{dictionary.file.downloadCsv}</button>
            <button className="button" onClick={() => void downloadZip()}>{dictionary.file.downloadZip}</button>
          </div>
          <div className="table-wrap">
            <table className="data-table">
              <thead><tr><th>{dictionary.file.fileName}</th><th>{dictionary.file.lineNumber}</th><th>{dictionary.file.content}</th></tr></thead>
              <tbody>{allRows.slice(0, 1000).map((row, index) => <tr key={`${row.fileName}-${row.lineNumber}-${index}`}><td>{row.fileName}</td><td>{row.lineNumber}</td><td className="mono">{row.content}</td></tr>)}</tbody>
            </table>
          </div>
        </section>
      )}
    </section>
  );
}
