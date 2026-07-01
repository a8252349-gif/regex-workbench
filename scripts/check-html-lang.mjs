import { htmlFiles, loadHtml, pagePathFromFile, pass, fail } from "./lib.mjs";
const errors=[];
for(const file of htmlFiles()){const page=pagePathFromFile(file); if(page==='/404/' || page==='/_not-found/')continue; const locale=page.split('/').filter(Boolean)[0]||'en'; const expected=['en','ko','ja','es','fr','de'].includes(locale)?locale:'en'; const {$}=loadHtml(file); if($('html').attr('lang')!==expected) errors.push(`${page}: expected ${expected}, got ${$('html').attr('lang')}`);}
if(errors.length) fail(errors.join('\n')); else pass('Every generated HTML file has the expected initial html lang value.');
