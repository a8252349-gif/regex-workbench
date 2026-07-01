import fs from "node:fs";
import path from "node:path";
import { htmlFiles, loadHtml, outDir, pagePathFromFile, pass, fail, siteUrl } from "./lib.mjs";
const errors=[]; const inbound=new Map();
function targetExists(pathname){if(pathname==='/')return fs.existsSync(path.join(outDir,'index.html')); const clean=pathname.endsWith('/')?pathname:`${pathname}/`; return fs.existsSync(path.join(outDir,clean,'index.html'))||fs.existsSync(path.join(outDir,pathname.replace(/^\//,'')));}
for(const file of htmlFiles()){
 const page=pagePathFromFile(file); const {$}=loadHtml(file);
 $('a[href]').each((_,el)=>{const href=$(el).attr('href'); if(!href||href.startsWith('#')||href.startsWith('mailto:')||href.startsWith('tel:')||href.startsWith('javascript:'))return; let url; try{url=new URL(href,siteUrl()+page);}catch{return;} if(url.origin!==new URL(siteUrl()).origin)return; const pathname=decodeURIComponent(url.pathname); if(!targetExists(pathname)) errors.push(`${page} -> ${pathname}`); inbound.set(pathname,(inbound.get(pathname)||0)+1);});
}
if(errors.length) fail(`Broken internal links (${errors.length}):\n${errors.slice(0,50).join('\n')}`); else pass(`Internal link audit passed; ${inbound.size} local targets receive links.`);
