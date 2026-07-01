import { env, htmlFiles, loadHtml, pagePathFromFile, pass, fail } from "./lib.mjs";
const client=env('NEXT_PUBLIC_ADSENSE_CLIENT','ca-pub-9328837907414732'); const errors=[]; let checked=0;
for(const file of htmlFiles()){const page=pagePathFromFile(file); if(page==='/404/' || page==='/_not-found/')continue; const {$}=loadHtml(file); const values=$('meta[name="google-adsense-account"]').map((_,el)=>$(el).attr('content')).get(); if(values.length!==1||values[0]!==client)errors.push(`${page}: ${values.length} account tags`); checked++;}
if(errors.length) fail(errors.slice(0,40).join('\n')); else pass(`AdSense ownership meta is present once on ${checked} indexable pages.`);
