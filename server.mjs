import http from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
const root=import.meta.dirname;
const files={'/assets/research-quarter.png':'assets/research-quarter.png','/character.js':'character.js','/hub.js':'hub.js','/':'index.html','/app.js':'app.js','/style.css':'style.css','/world.js':'world.js','/navigation.js':'navigation.js','/illustrations.js':'illustrations.js','/vendor/three.module.js':'vendor/three.module.js','/vendor/three.core.js':'vendor/three.core.js'};
http.createServer(async(req,res)=>{const file=files[new URL(req.url,'http://localhost').pathname];if(!file){res.writeHead(404);return res.end('Not found');}try{const body=await readFile(path.join(root,file));res.setHeader('Content-Type',file.endsWith('.png')?'image/png':file.endsWith('.js')?'text/javascript':file.endsWith('.css')?'text/css':'text/html; charset=utf-8');res.end(body);}catch{res.writeHead(500);res.end('Server error');}}).listen(Number(process.env.PORT)||3000,'0.0.0.0',()=>console.log('BIO CASEFILES listening on port '+(process.env.PORT||3000)));
