import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { load } from "cheerio";

export const root = path.resolve(import.meta.dirname, "..");
export const outDir = path.join(root, "out");

export function readEnvFile(fileName) {
  const file = path.join(root, fileName);
  if (!fs.existsSync(file)) return {};
  const values = {};
  for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) continue;
    const [key, ...rest] = trimmed.split("=");
    values[key.trim()] = rest.join("=").trim().replace(/^['"]|['"]$/g, "");
  }
  return values;
}

let loadedEnvironment;
function fileEnvironment() {
  if (loadedEnvironment) return loadedEnvironment;
  const mode = process.env.NODE_ENV || "production";
  const candidates = [`.env.${mode}.local`, ".env.local", `.env.${mode}`, ".env"];
  const merged = {};
  for (const fileName of candidates) {
    const values = readEnvFile(fileName);
    for (const [key, value] of Object.entries(values)) if (!(key in merged)) merged[key] = value;
  }
  loadedEnvironment = merged;
  return merged;
}

export function env(name, fallback = "") {
  return process.env[name] ?? fileEnvironment()[name] ?? fallback;
}

export function siteUrl() {
  return env("NEXT_PUBLIC_SITE_URL").trim().replace(/\/+$/, "");
}

export function getRegistry() {
  return JSON.parse(fs.readFileSync(path.join(root, "src/content/registry.json"), "utf8"));
}

export function getGuides() {
  return JSON.parse(fs.readFileSync(path.join(root, "src/content/guides.generated.json"), "utf8"));
}

export function htmlFiles() {
  if (!fs.existsSync(outDir)) throw new Error(`Missing output directory: ${outDir}`);
  const files = [];
  const walk = (directory) => {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const full = path.join(directory, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.name.endsWith(".html")) files.push(full);
    }
  };
  walk(outDir);
  return files;
}

export function pagePathFromFile(file) {
  const relative = path.relative(outDir, file).replaceAll(path.sep, "/");
  if (relative === "index.html") return "/";
  if (relative === "404.html") return "/404/";
  return `/${relative.replace(/index\.html$/, "").replace(/\.html$/, "/")}`.replace(/\/+/g, "/");
}

export function loadHtml(file) {
  const source = fs.readFileSync(file, "utf8");
  return { source, $: load(source) };
}

export function fail(message) {
  console.error(`✖ ${message}`);
  process.exitCode = 1;
}

export function pass(message) {
  console.log(`✓ ${message}`);
}

export function assert(condition, message) {
  if (!condition) throw new Error(message);
}

export function textWords(text) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}
