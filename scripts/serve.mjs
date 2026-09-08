import http from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const mime = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.svg':'image/svg+xml','.jpg':'image/jpeg'};
const allowed = new Set(['index.html','styles.css','script.js','assets/huayang-vista-logo.svg','assets/consult-qr.jpg']);
const server = http.createServer(async (req,res) => {
 try {
  let name = decodeURIComponent(new URL(req.url,'http://localhost').pathname).replace(/^\/+/, '');
  if (!name) name = 'index.html';
  if (!allowed.has(name)) {res.writeHead(404);res.end('Not found');return;}
  if (!['GET','HEAD'].includes(req.method)) {res.writeHead(405,{'Allow':'GET, HEAD'});res.end();return;}
  const body = await readFile(path.join(root,name));
  res.writeHead(200,{'Content-Type':mime[path.extname(name)] || 'application/octet-stream','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});
  res.end(req.method==='HEAD'?undefined:body);
 } catch {res.writeHead(400);res.end('Bad request');}
});
server.listen(0,'127.0.0.1',() => console.log(`Local: http://127.0.0.1:${server.address().port}/`));
