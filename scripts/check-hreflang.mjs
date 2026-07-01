import path from "node:path";
import fs from "node:fs";
import { htmlFiles, loadHtml, pagePathFromFile, outDir, pass, fail, siteUrl } from "./lib.mjs";
const required=["en","ko","ja","es","fr","de","x-default"]; const errors=[];
function existsForUrl(href){const url=new URL(href); let p=decodeURIComponent(url.pathname); if(p==="/") return fs.existsSync(path.join(outDir,"index.html")); const candidate=path.join(outDir,p,"index.html"); return fs.existsSync(candidate);}
for(const file of htmlFiles()){
 const page=pagePathFromFile(file); if(page==="/404/" || page==="/_not-found/")continue; const {$}=loadHtml(file); const map=new Map(); $('link[rel="alternate"][hreflang]').each((_,el)=>map.set($(el).attr('hreflang'),$(el).attr('href')));
 for(const code of required){const href=map.get(code); if(!href) errors.push(`${page}: missing ${code}`); else {if(!href.startsWith(siteUrl())) errors.push(`${page}: ${code} not absolute`); if(!existsForUrl(href)) errors.push(`${page}: ${code} target missing ${href}`);}}
 const locale=page.split('/').filter(Boolean)[0]; if(required.includes(locale)&&map.get(locale)!==$('link[rel="canonical"]').attr('href')) errors.push(`${page}: self hreflang differs from canonical`);
}
if(errors.length) fail(`Hreflang audit failed (${errors.length}):\n${errors.slice(0,40).join('\n')}`); else pass('All pages contain reciprocal, existing 6-locale hreflang targets plus x-default.');
