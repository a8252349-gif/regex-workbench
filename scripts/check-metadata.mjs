import { htmlFiles, loadHtml, pagePathFromFile, pass, fail, siteUrl } from "./lib.mjs";
const titleMap = new Map(); const descriptionMap = new Map(); const errors=[];
for (const file of htmlFiles()) {
  const page=pagePathFromFile(file); if(page==="/404/" || page==="/_not-found/") continue;
  const {$}=loadHtml(file); const title=$("head title").text().trim(); const desc=$('meta[name="description"]').attr("content")?.trim()||""; const canonical=$('link[rel="canonical"]').attr("href")||"";
  if(title.length<10||title.length>150) errors.push(`${page}: suspicious title length ${title.length}`);
  if(desc.length<60||desc.length>320) errors.push(`${page}: suspicious description length ${desc.length}`);
  const locale=page.split("/").filter(Boolean)[0]||"root"; const titleKey=`${locale}:${title}`; const descKey=`${locale}:${desc}`;
  if(titleMap.has(titleKey)) errors.push(`${page}: duplicate title with ${titleMap.get(titleKey)}`); else titleMap.set(titleKey,page);
  if(descriptionMap.has(descKey)) errors.push(`${page}: duplicate description with ${descriptionMap.get(descKey)}`); else descriptionMap.set(descKey,page);
  if(!canonical.startsWith(siteUrl())) errors.push(`${page}: bad canonical host`);
  if(canonical.includes("?")) errors.push(`${page}: query in canonical`);
  if(page!=="/" && !canonical.endsWith("/")) errors.push(`${page}: canonical lacks trailing slash`);
}
if(errors.length) fail(`Metadata audit failed (${errors.length}):\n${errors.slice(0,50).join("\n")}`); else pass(`Metadata titles, descriptions, and canonicals are unique and normalized.`);
