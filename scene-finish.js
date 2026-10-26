import * as T from './vendor/three.module.js';
export function finishScene(scene){
 let seed=821;const random=()=>((seed=seed*16807%2147483647)-1)/2147483646;
 const cache=new Map();
 function worn(color){if(cache.has(color))return cache.get(color);const c=document.createElement('canvas');c.width=c.height=512;const x=c.getContext('2d');x.fillStyle=color;x.fillRect(0,0,512,512);
  for(let i=0;i<6500;i++){x.fillStyle=i%2?'#f4eadb0a':'#111d2610';x.fillRect(random()*512,random()*512,random()*3+1,random()*2+1)}
  for(let i=0;i<140;i++){const px=random()*512,py=random()*512;x.strokeStyle='#d8d0b431';x.lineWidth=.4+random();x.beginPath();x.moveTo(px,py);x.lineTo(px+random()*24,py+random()*2);x.stroke()}
  const g=x.createLinearGradient(0,0,0,512);g.addColorStop(0,'#1b252a26');g.addColorStop(.13,'#00000000');g.addColorStop(.85,'#00000000');g.addColorStop(1,'#18212855');x.fillStyle=g;x.fillRect(0,0,512,512);const map=new T.CanvasTexture(c);map.colorSpace=T.SRGBColorSpace;map.anisotropy=4;cache.set(color,map);return map;
 }
 const bevels=new Map();
 scene.traverse(m=>{const p=m.geometry?.parameters;if(!m.isMesh||m.geometry.type!=='BoxGeometry'||!p||Math.min(p.width,p.height,p.depth)<.08||Math.max(p.width,p.height,p.depth)>3)return;
  const key=[p.width,p.height,p.depth].join('/');if(!bevels.has(key)){const r=Math.min(.018,p.width/8,p.height/8,p.depth/8),g=new T.BoxGeometry(p.width,p.height,p.depth,4,4,4),v=g.attributes.position,point=new T.Vector3(),inner=new T.Vector3();for(let i=0;i<v.count;i++){point.fromBufferAttribute(v,i);inner.copy(point).clamp(new T.Vector3(-p.width/2+r,-p.height/2+r,-p.depth/2+r),new T.Vector3(p.width/2-r,p.height/2-r,p.depth/2-r));point.sub(inner).normalize().multiplyScalar(r).add(inner);v.setXYZ(i,point.x,point.y,point.z)}g.computeVertexNormals();bevels.set(key,g)}m.geometry=bevels.get(key);
 });
 const fixtures=[];scene.traverse(o=>{if(['trace-box','trace-drawer','trace-empty'].includes(o.userData.id))fixtures.push(o)});
 const hardware=new T.MeshStandardMaterial({color:'#7e8582',metalness:.8,roughness:.36}),rubber=new T.MeshStandardMaterial({color:'#202728',roughness:.92});
 function block(parent,x,y,z,w,h,d,mat){const m=new T.Mesh(new T.BoxGeometry(w,h,d),mat);m.position.set(x,y,z);m.castShadow=m.receiveShadow=true;parent.add(m);return m}
 for(const o of fixtures){o.traverse(m=>{if(!m.isMesh||!m.material.isMeshStandardMaterial)return;m.material=m.material.clone();m.material.map=worn(m.material.color.getStyle());m.material.color.set('#ffffff');m.material.roughness=.65;m.material.metalness=.18});
  if(o.userData.id==='trace-box'){
   for(const x of [-.39,.39])for(const z of [-.26,.26]){block(o,x,.13,z,.045,.22,.055,hardware);block(o,x,.005,z,.08,.055,.08,rubber)}
   for(const x of [-.25,.25]){block(o,x,.2,.29,.08,.08,.035,hardware);block(o,x,.2,.315,.025,.04,.012,rubber)}
   for(const z of [-.27,.27])for(const x of [-.28,0,.28])block(o,x,.17,z,.018,.19,.018,hardware);
   const c=document.createElement('canvas');c.width=512;c.height=192;const ctx=c.getContext('2d');ctx.fillStyle='#c7b995';ctx.fillRect(0,0,512,192);ctx.fillStyle='#303e40';ctx.font='bold 72px monospace';ctx.fillText('K-2',28,82);ctx.font='22px monospace';ctx.fillText('SPECIMEN TRANSPORT',28,133);for(let i=0;i<45;i++)ctx.fillRect(298+i*4,18,1+(i%3),73);const tex=new T.CanvasTexture(c);tex.colorSpace=T.SRGBColorSpace;const label=new T.Mesh(new T.PlaneGeometry(.3,.113),new T.MeshStandardMaterial({map:tex,roughness:.95}));label.position.set(0,.18,.294);o.add(label);
  }
 }
 // Soft contact shadows anchor furniture without screen-space postprocessing.
 const cv=document.createElement('canvas');cv.width=cv.height=128;const ctx=cv.getContext('2d');const g=ctx.createRadialGradient(64,64,10,64,64,64);g.addColorStop(0,'rgba(6,14,18,.55)');g.addColorStop(.65,'rgba(6,14,18,.24)');g.addColorStop(1,'rgba(6,14,18,0)');ctx.fillStyle=g;ctx.fillRect(0,0,128,128);const shadow=new T.MeshBasicMaterial({map:new T.CanvasTexture(cv),transparent:true,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-1});
 for(const [x,z,w,d] of [[-4.4,-4.2,6.5,2.7],[4.4,-4,4.3,2.7],[5.7,1.2,3.5,2.4],[-4.8,3,3.7,2.1],[0,0,3.2,6.1],[-2.6,0,1.3,1.3]]){const plane=new T.Mesh(new T.PlaneGeometry(w,d),shadow);plane.rotation.x=-Math.PI/2;plane.position.set(x,.008,z);scene.add(plane)}
}
