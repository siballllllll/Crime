import http from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
const root=import.meta.dirname;
const files={'/':'index.html','/app.js':'app.js','/style.css':'style.css'};
http.createServer(async(req,res)=>{const file=files[new URL(req.url,'http://localhost').pathname];if(!file){res.writeHead(404);return res.end('Not found');}try{const body=await readFile(path.join(root,file));res.setHeader('Content-Type',file.endsWith('.js')?'text/javascript':file.endsWith('.css')?'text/css':'text/html; charset=utf-8');res.end(body);}catch{res.writeHead(500);res.end('Server error');}}).listen(Number(process.env.PORT)||3000,'0.0.0.0',()=>console.log('BIO CASEFILES listening on port '+(process.env.PORT||3000)));
