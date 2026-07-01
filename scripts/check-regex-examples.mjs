import { getGuides, getRegistry, pass, fail } from "./lib.mjs";

const guides = getGuides();
const slugs = getRegistry().guides;
const errors = [];
let compiled = 0;

const flagsBySlug = {
  "greedy-vs-lazy": "gu",
  "multiline-dotall-anchors": "mu"
};

function decodeSample(value) {
  return value.replaceAll("\\r\\n", "\r\n").replaceAll("\\n", "\n").replaceAll("\\t", "\t");
}

for (const slug of slugs) {
  const guide = guides.en[slug];
  try {
    const flags = flagsBySlug[slug] || "u";
    const regex = new RegExp(guide.pattern, flags);
    compiled += 1;
    const shouldMatch = slug !== "regex-backtracking-redos";
    const result = regex.test(decodeSample(guide.input));
    if (shouldMatch && !result) errors.push(`${slug}: success input did not match with flags ${flags}`);
    if (!shouldMatch && result) errors.push(`${slug}: designated adversarial input unexpectedly matched`);
  } catch (error) {
    errors.push(`${slug}: ${error}`);
  }
}

if (errors.length) fail(`Regex example audit failed:\n${errors.join("\n")}`);
else pass(`Compiled ${compiled} guide patterns and verified designated success or rejection examples with their required flags.`);
