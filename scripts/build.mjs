import {createHash} from 'node:crypto';
import './check.mjs';
import {mkdir,copyFile,writeFile,readFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const files=['index.html','styles.css','script.js','assets/huayang-vista-logo.svg','assets/consult-qr.jpg'];
await mkdir(path.join(root,'dist/assets'),{recursive:true});
for(const file of files) await copyFile(path.join(root,file),path.join(root,'dist',file));
// Content-based URLs prevent a new page from reusing an older stylesheet or script.
let html=await readFile(path.join(root,'index.html'),'utf8');
for(const asset of ['styles.css','script.js']) {
 const hash=createHash('sha256').update(await readFile(path.join(root,asset))).digest('hex').slice(0,12);
 const pattern=new RegExp('\\./'+asset.replace('.', '\\.')+'(?:\\?[^"<>]*)?"','g');
 html=html.replace(pattern,'./'+asset+'?v='+hash+'"');
}
await writeFile(path.join(root,'dist/index.html'),html);
await writeFile(path.join(root,'dist/.nojekyll'),'');
console.log('Build complete: dist/ (static site, no runtime dependencies).');
