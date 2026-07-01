import { htmlFiles, loadHtml, pagePathFromFile, pass, fail, textWords } from "./lib.mjs";
const errors=[]; const stats={guides:0,tools:0,homes:0};
for(const file of htmlFiles()){
 const page=pagePathFromFile(file); const match=page.match(/^\/(en|ko|ja|es|fr|de)\/(.*)$/); if(!match)continue; const [,locale,rest]=match; const {$}=loadHtml(file); $('script,style,code,pre,nav,footer').remove(); const text=$('[data-audit-content]').text().replace(/\s+/g,' ').trim(); const words=textWords(text); const chars=text.replace(/\s/g,'').length;
 if(rest.startsWith('guides/')&&rest!=='guides/'){
   stats.guides++; if(['en','es','fr','de'].includes(locale)&&words<1000) errors.push(`${page}: guide words ${words}`); if(locale==='ko'&&chars<3000) errors.push(`${page}: Korean guide chars ${chars}`); if(locale==='ja'&&chars<2800) errors.push(`${page}: Japanese guide chars ${chars}`);
 } else if(rest==='' ){
   stats.homes++; if(['en','es','fr','de'].includes(locale)&&words<1200) errors.push(`${page}: home words ${words}`); if(locale==='ko'&&chars<3500) errors.push(`${page}: Korean home chars ${chars}`); if(locale==='ja'&&chars<3000) errors.push(`${page}: Japanese home chars ${chars}`);
 } else if(['tester/','replace/','extract/','file-filter/','explainer/','cheat-sheet/','resources/'].includes(rest)){
   stats.tools++; if(['en','es','fr','de'].includes(locale)&&words<700) errors.push(`${page}: tool words ${words}`); if(locale==='ko'&&chars<2000) errors.push(`${page}: Korean tool chars ${chars}`); if(locale==='ja'&&chars<1800) errors.push(`${page}: Japanese tool chars ${chars}`);
 }
}
if(errors.length) fail(`Content length audit failed (${errors.length}):\n${errors.slice(0,50).join('\n')}`); else pass(`Content length passed for ${stats.homes} homes, ${stats.tools} tool pages, and ${stats.guides} guides.`);
