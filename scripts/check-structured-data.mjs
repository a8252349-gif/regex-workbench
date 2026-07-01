import { htmlFiles, loadHtml, pagePathFromFile, pass, fail } from "./lib.mjs";
const errors=[]; let blocks=0;
for(const file of htmlFiles()){
 const page=pagePathFromFile(file); if(page==='/404/')continue; const {$}=loadHtml(file); const scripts=$('script[type="application/ld+json"]'); if(/^\/(en|ko|ja|es|fr|de)\//.test(page)&&scripts.length===0) errors.push(`${page}: no JSON-LD`);
 scripts.each((_,el)=>{blocks++; try{const value=JSON.parse($(el).html()||''); if(!value['@context']||!value['@type'])errors.push(`${page}: incomplete JSON-LD`); if(JSON.stringify(value).match(/aggregateRating|reviewCount|ratingValue/))errors.push(`${page}: unsupported rating data`);}catch(error){errors.push(`${page}: invalid JSON-LD ${error}`);}});
}
if(errors.length) fail(`Structured data audit failed (${errors.length}):\n${errors.slice(0,40).join('\n')}`); else pass(`Validated ${blocks} JSON-LD blocks without fabricated ratings.`);
