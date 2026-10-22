import * as T from './vendor/three.module.js';
// Decorative details remain inside furniture bounds; evidence logic is unchanged.
export function dressCrimeScene({scene,renderer,box,cyl,culture,pcr,sequencer,notebook,firstWalls}){
 let seed=781;const rand=()=>((seed=seed*16807%2147483647)-1)/2147483646;
 function surface(base,floor=false){
  const c=document.createElement('canvas');c.width=c.height=512;const x=c.getContext('2d');x.fillStyle=base;x.fillRect(0,0,512,512);
  for(let i=0;i<19000;i++){x.fillStyle=i%2?'#ffffff08':'#04151d09';x.fillRect(rand()*512,rand()*512,rand()*3+1,rand()*2+1)}
  for(let i=0;i<45;i++){x.strokeStyle='#12252b18';x.beginPath();const a=rand()*512,b=rand()*512;x.moveTo(a,b);x.lineTo(a+rand()*70,b+rand()*4);x.stroke()}
  if(floor){x.strokeStyle='#142127';x.lineWidth=5;x.strokeRect(0,0,512,512);x.strokeStyle='#b9c2b44a';x.lineWidth=2;x.strokeRect(5,5,502,502)}
  const t=new T.CanvasTexture(c);t.colorSpace=T.SRGBColorSpace;t.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());return t;
 }
 const materials=new Map();
 scene.traverse(o=>{
  if(!o.isMesh||o.material.map||o.geometry.type!=='BoxGeometry')return;
  const p=o.geometry.parameters,floor=p.height<.04&&p.width>.9&&p.depth>.9;
  const key=o.material.color.getHexString()+floor;
  if(!materials.has(key)){
   const m=o.material.clone();m.map=surface('#'+o.material.color.getHexString(),floor);m.color.set('#ffffff');m.bumpMap=m.map;m.bumpScale=floor?.006:.0015;m.roughness=floor?.57:.72;materials.set(key,m);
  }o.material=materials.get(key);
 });
 // Soft edges on instrument housings produce readable highlights at eye level.
 for(const root of [pcr,sequencer])root.traverse(o=>{
  if(o.geometry?.type!=='BoxGeometry')return;
  const {width:w,height:h,depth:d}=o.geometry.parameters;
  if(w<.5||h<.3||d<.3)return;
  const r=.025,s=new T.Shape();
  s.moveTo(-w/2+r,-h/2);s.lineTo(w/2-r,-h/2);s.quadraticCurveTo(w/2,-h/2,w/2,-h/2+r);
  s.lineTo(w/2,h/2-r);s.quadraticCurveTo(w/2,h/2,w/2-r,h/2);
  s.lineTo(-w/2+r,h/2);s.quadraticCurveTo(-w/2,h/2,-w/2,h/2-r);
  s.lineTo(-w/2,-h/2+r);s.quadraticCurveTo(-w/2,-h/2,-w/2+r,-h/2);
  const g=new T.ExtrudeGeometry(s,{depth:d-2*r,bevelEnabled:true,bevelThickness:r,bevelSize:r,bevelSegments:2,curveSegments:3,steps:1});g.translate(0,0,-d/2+r);o.geometry=g;
 });
 const glass=new T.MeshPhysicalMaterial({color:'#b8e5dc',transparent:true,opacity:.22,roughness:.1,metalness:.05,depthWrite:false,side:T.DoubleSide});
 culture.traverse(o=>{if(o.geometry?.type==='CylinderGeometry'&&o.geometry.parameters.height>.4){o.material=glass;o.castShadow=false}});
 function label(parent,words,x,y,z,w,h,bg='#e4d8b8',fg='#233238'){
  const c=document.createElement('canvas');c.width=768;c.height=256;const ctx=c.getContext('2d');ctx.fillStyle=bg;ctx.fillRect(0,0,768,256);ctx.strokeStyle=fg;ctx.lineWidth=8;ctx.strokeRect(15,15,738,226);ctx.fillStyle=fg;ctx.font='bold 62px sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(words,384,132,710);
  const t=new T.CanvasTexture(c);t.colorSpace=T.SRGBColorSpace;
  const mesh=new T.Mesh(new T.PlaneGeometry(w,h),new T.MeshBasicMaterial({map:t}));mesh.position.set(x,y,z);parent.add(mesh);return mesh;
 }
 // Ceiling luminaires and wall services: believable sources for the light.
 for(const x of [-3,1.8]){
  box(x,4.28,-.7,1.7,.12,.55,'#28363e',firstWalls);
  const panel=box(x,4.2,-.7,1.45,.035,.4,'#d5e7e3',firstWalls);
  panel.material=new T.MeshStandardMaterial({color:'#d5e7e3',emissive:'#c9e5e4',emissiveIntensity:2});
 }
 for(let x=-4.6;x<5;x+=1.2){box(x,1.2,-4.3,.018,2.3,.015,'#4a5f60');box(x,.14,-4.22,1.18,.22,.09,'#364b4e')}
 box(0,3.95,-4.26,10.5,.08,.09,'#5c6a6c');
 for(const x of [-4.7,.4,4.8]){box(x,2.8,-4.24,.05,2.2,.06,'#667679');box(x,1.85,-4.18,.19,.24,.1,'#c9cdc2')}
 // Window has mullions, fine rain trails and external darkness, not a flat colored block.
 for(let x=-3.7;x<-.2;x+=.16)box(x,2.85,-4.11,.012,1.55,.008,'#49626c');
 label(scene,'CULTURE LAB 02',2.1,3.55,-4.1,2.7,.4,'#20343e','#d5e0d9');
 label(scene,'출입 통제 · 현장 보존',.1,2.35,4.24,1.45,.35,'#d6b359','#241e18').rotation.y=Math.PI;
 // Individual instrument vents, controls, model plates and tubing.
 for(const [g,w,z,y] of [[pcr,.9,.53,0],[sequencer,1.2,.43,1.4]]){
  for(let i=0;i<9;i++)box(-w/2+i*.045,y-.13,z,.018,.09,.012,'#243a40',g);
  for(let i=0;i<3;i++){const b=cyl(w/2-.1+i*.07,y+.06,z+.03,.022,.025,i?'#a3b6b0':'#d7a360',g);b.rotation.x=Math.PI/2}
  label(g,'BIO / '+(g===pcr?'PCR-240':'SEQ-08'),0,y-.22,z+.015,w*.7,.08);
 }
 for(let i=0;i<3;i++){label(culture,'S-'+(i+1),(i-1)*.48,.08,.183,.19,.085)}
 // Open pages and written notes sit on the existing notebook.
 const page=label(notebook,'실험 기록 / D-4',.02,.052,.03,.52,.72);page.rotation.x=-Math.PI/2;
 for(let i=0;i<7;i++)box(-2.6,2.365,-1.32+i*.07,.36,.002,.008,'#7d8174');
 // Evidence tents explicitly identify locations rather than implying guilt.
 for(const [n,x,z] of [['01',-1.9,.1],['02',2.7,-1.9],['03',3.5,2.35]]){
  const g=new T.Group();g.position.set(x,.03,z);scene.add(g);
  const front=box(0,.18,0,.32,.34,.018,'#e1b953',g);front.rotation.x=-.3;
  const back=box(0,.18,-.1,.32,.34,.018,'#a78637',g);back.rotation.x=.3;
  const l=label(g,n,0,.19,.07,.22,.2,'#e1b953','#242b2e');l.rotation.x=-.3;
 }
 // Evidence bags and gloves on the worktop; no extra collectible clues.
 for(let i=0;i<2;i++){
  const bag=box(-3.75+i*.43,2.27,-1.35,.32,.012,.46,'#a3b6b7');bag.material=glass;
  box(-3.75+i*.43,2.28,-1.52,.32,.008,.018,'#a85648');
  const tag=label(scene,'시료 봉투',-3.75+i*.43,2.285,-1.28,.24,.16);tag.rotation.x=-Math.PI/2;
 }
 const glove=new T.Group();glove.position.set(-3.55,2.28,-.75);scene.add(glove);
 box(0,0,0,.16,.025,.17,'#689cb0',glove);for(let i=0;i<4;i++)box(-.06+i*.04,0,-.13,.032,.022,.15-i*.012,'#689cb0',glove);
 // Low-cost environmental reflections bring out glass and instrument surfaces.
 const env=new T.Scene();env.background=new T.Color('#52636d');
 const panel=new T.Mesh(new T.PlaneGeometry(18,8),new T.MeshBasicMaterial({color:'#d1e1e1'}));panel.position.set(0,6,-8);env.add(panel);
 const pmrem=new T.PMREMGenerator(renderer);scene.environment=pmrem.fromScene(env,.08).texture;scene.environmentIntensity=.35;pmrem.dispose();
 const task=new T.SpotLight('#dbeaf2',32,12,.9,.65,1.5);task.position.set(-2,4.1,.5);task.target.position.set(-1,1.4,-1.4);task.castShadow=true;task.shadow.mapSize.set(1024,1024);task.shadow.bias=-.001;scene.add(task,task.target);
 renderer.shadowMap.needsUpdate=true;
}
