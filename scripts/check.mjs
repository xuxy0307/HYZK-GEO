import {readFile, access} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import vm from 'node:vm';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const html=await readFile(path.join(root,'index.html'),'utf8');
const js=await readFile(path.join(root,'script.js'),'utf8');
const assert=(condition,message)=>{if(!condition) throw new Error(message);};
new vm.Script(js);
const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
assert(new Set(ids).size===ids.length,'Duplicate HTML IDs');
assert((html.match(/<h1[ >]/g)||[]).length===1,'Expected one H1');
for(const [,url] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
 if(url.startsWith('#')) assert(ids.includes(url.slice(1)),`Missing anchor ${url}`);
 else if(url.startsWith('./')) await access(path.join(root,url));
 else assert(/^(https:|mailto:)/.test(url),`Unexpected resource ${url}`);
}
assert(!/innerHTML|document.write/.test(js),'Unexpected HTML string injection');
assert(html.includes('2.0 进阶版'),'Missing 2.0 positioning');
assert(html.includes('assets/huayang-vista-logo.svg'),'Missing company logo');
assert(!/<script[^>]+src="https?:/.test(html),'Unexpected external script dependency');
console.log('PASS: JavaScript syntax, internal links, local resources, version and logo.');
