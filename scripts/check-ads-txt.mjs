import fs from "node:fs";
import path from "node:path";
import { outDir, pass, fail } from "./lib.mjs";
const file=path.join(outDir,'ads.txt'); const expected='google.com, pub-9328837907414732, DIRECT, f08c47fec0942fa0\n';
if(!fs.existsSync(file))fail('out/ads.txt is missing'); else if(fs.readFileSync(file,'utf8')!==expected)fail('ads.txt content is not exact'); else pass('ads.txt exists with the expected UTF-8 publisher record.');
