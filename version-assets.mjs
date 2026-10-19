import {readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const root=import.meta.dirname;
let html=await readFile(`${root}/index.html`,'utf8');
for(const file of ['app.js','world.js','style.css']){
 const hash=createHash('sha256').update(await readFile(`${root}/${file}`)).digest('hex').slice(0,12);
 const pattern=new RegExp(`(\\./${file.replace('.','\\.')})(?:\\?v=[a-zA-Z0-9-]+)?(?=")`,'g');
 html=html.replace(pattern,`$1?v=${hash}`);
}
await writeFile(`${root}/index.html`,html);
