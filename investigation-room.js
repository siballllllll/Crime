import {addLabDetail} from './lab-detail.js?v=1';
import {addLabFittings} from './lab-fittings.js?v=2';
import * as T from './vendor/three.module.js';
// Full-size first-person room; decorative props stay inside collision footprints.
export function buildInvestigationRoom({scene,renderer,object,actions,leave}){
 let seed=17;const random=()=>((seed=seed*16807%2147483647)-1)/2147483646;
 function texture(color,tile=false){const c=document.createElement('canvas');c.width=c.height=256;const x=c.getContext('2d');x.fillStyle=color;x.fillRect(0,0,256,256);for(let i=0;i<3000;i++){x.fillStyle=i%2?'#ffffff09':'#00131909';x.fillRect(random()*256,random()*256,1,1)}if(tile){x.strokeStyle='#293b4080';x.lineWidth=2;x.strokeRect(0,0,256,256)}const t=new T.CanvasTexture(c);t.colorSpace=T.SRGBColorSpace;t.anisotropy=4;return t}
 const wall=new T.MeshStandardMaterial({map:texture('#d4d7d0'),roughness:.9});const floor=new T.MeshStandardMaterial({map:texture('#bab9ad',true),roughness:.52});floor.map.wrapS=floor.map.wrapT=T.RepeatWrapping;floor.map.repeat.set(9,7);
 const steel=new T.MeshStandardMaterial({color:'#a7b4b5',metalness:.65,roughness:.32}),dark=new T.MeshStandardMaterial({color:'#263c46',roughness:.6}),top=new T.MeshStandardMaterial({color:'#e0e3db',roughness:.36}),wood=new T.MeshStandardMaterial({map:texture('#e1e3da'),roughness:.5}),worktop=new T.MeshStandardMaterial({color:'#20282c',roughness:.32,metalness:.12});
 const glass=new T.MeshPhysicalMaterial({color:'#bce4df',transparent:true,opacity:.2,roughness:.08,metalness:.08,depthWrite:false,side:T.DoubleSide});
 const signTextures=new Map();
 const cache=new Map();const material=c=>typeof c==='string'?(cache.get(c)||cache.set(c,new T.MeshStandardMaterial({color:c,roughness:.65})).get(c)):c;
 function box(x,y,z,w,h,d,m,parent=scene){const a=new T.Mesh(new T.BoxGeometry(w,h,d),material(m));a.position.set(x,y,z);a.castShadow=a.receiveShadow=true;parent.add(a);return a}
 function cyl(x,y,z,r,h,m,parent=scene){const a=new T.Mesh(new T.CylinderGeometry(r,r,h,24),material(m));a.position.set(x,y,z);a.castShadow=a.receiveShadow=true;parent.add(a);return a}
 function sign(words,x,y,z,w=2.6,h=.5,parent=scene,color='#d8e4df',bg='#20343e'){
  const key=words+'|'+color+'|'+bg;let tex=signTextures.get(key);if(!tex){const c=document.createElement('canvas');c.width=1024;c.height=256;const t=c.getContext('2d');t.fillStyle=bg;t.fillRect(0,0,1024,256);t.fillStyle=color;t.fillRect(0,0,12,256);t.font='600 64px sans-serif';t.textBaseline='middle';t.textAlign='center';t.fillText(words,512,128,970);tex=new T.CanvasTexture(c);tex.colorSpace=T.SRGBColorSpace;tex.anisotropy=4;signTextures.set(key,tex)}const mesh=new T.Mesh(new T.PlaneGeometry(w,h),new T.MeshBasicMaterial({map:tex}));mesh.position.set(x,y,z);parent.add(mesh);return mesh;
 }
 function table(x,z,w=2.4,d=1.3){
  box(x,.48,z,w,.87,d,wood);box(x,.95,z,w+.1,.08,d+.08,worktop);
  const n=Math.floor(w/.75),cell=w/n;
  for(let i=0;i<n;i++){const px=x-w/2+cell*(i+.5);for(let j=0;j<3;j++){box(px,.26+j*.23,z+d/2+.012,cell-.035,.21,.035,top);box(px,.32+j*.23,z+d/2+.055,cell*.55,.022,.035,steel)}}
  box(x,.08,z,w,.12,d*.85,dark);
 }
 function light(x,z,color){box(x,3.62,z,2.1,.1,.65,dark);const m=new T.MeshStandardMaterial({color,emissive:color,emissiveIntensity:1.6});box(x,3.55,z,1.9,.025,.47,m);const p=new T.PointLight(color,14,11,2);p.position.set(x,3.2,z);scene.add(p)}
 function tent(n,x,z,parent=scene){const g=new T.Group();g.position.set(x,1.02,z);parent.add(g);const a=box(0,.1,0,.18,.2,.01,'#d5b05b',g);a.rotation.x=-.2;sign(n,0,.11,.025,.15,.15,g,'#292b25','#d5b05b')}
 box(0,-.1,0,18,.2,14,floor);box(0,1.9,-7,18,3.8,.18,wall);box(-9,1.9,0,.18,3.8,14,wall);
 const firstWalls=new T.Group();scene.add(firstWalls);box(9,1.9,0,.18,3.8,14,wall,firstWalls);box(0,1.9,7,18,3.8,.18,wall,firstWalls);box(0,3.85,0,18,.12,14,'#c5cac6',firstWalls);
 for(const z of [-6.85,6.85])box(0,.12,z,17.8,.24,.08,dark,z>0?firstWalls:scene);
 for(const x of [-8.86,8.86])box(x,.12,0,.08,.24,13.8,dark,x>0?firstWalls:scene);
 for(let x=-8;x<9;x+=2){box(x,1.85,-6.88,.025,3.5,.02,'#637a7c');box(x,3.25,-6.84,1.85,.05,.08,steel)}
 // Separate lighting and floor strips identify working areas without giving solutions.
 for(const [x,z,c] of [[-4,-3.6,'#f1efdf'],[4.6,-3.5,'#e3edf2'],[5.3,1.8,'#e3edf2'],[-4,3,'#eeeade'],[0,2,'#e9eee9']])light(x,z,c);
 for(const [x,z,w,d,c] of [[-4.6,-3.9,6.2,2.7,'#b09b70'],[4.8,-3.6,3.8,2.9,'#6f9da9'],[5.7,1.3,3.4,2.9,'#6f9da9'],[-4.8,3,3.4,2.5,'#8d9b7a']]){
  box(x,.012,z+d/2,w,.012,.045,c);box(x-w/2,.012,z,.045,.012,d,c);box(x+w/2,.012,z,.045,.012,d,c);
 }
 // Window, lower wall panels and service lines give depth to the room shell.
 // Broad daylight windows with an exterior facade texture and metal mullions.
 const cv=document.createElement('canvas');cv.width=1024;cv.height=512;const cx=cv.getContext('2d');const sky=cx.createLinearGradient(0,0,0,512);sky.addColorStop(0,'#b8dae9');sky.addColorStop(1,'#d6e2dd');cx.fillStyle=sky;cx.fillRect(0,0,1024,512);
 for(let x=0;x<1024;x+=96){cx.fillStyle=x%192?'#83a9bc':'#91b5c4';cx.fillRect(x,20,83,492);for(let y=38;y<512;y+=76){cx.fillStyle='#c1dbe2';cx.fillRect(x,y,83,6);cx.fillStyle='#d7e7e8';cx.fillRect(x+36,y,5,76)}}
 const view=new T.CanvasTexture(cv);view.colorSpace=T.SRGBColorSpace;
 box(0,2.12,-6.78,16.4,2.8,.06,new T.MeshBasicMaterial({map:view}));
 for(let x=-8.2;x<=8.21;x+=1.64)box(x,2.12,-6.69,.075,2.9,.1,top);for(const y of [.7,1.5,3.55])box(0,y,-6.67,16.6,.065,.12,top);box(0,.65,-6.55,16.7,.1,.4,top);
 const daylight=new T.DirectionalLight('#d2e6f2',.65);daylight.position.set(0,3,-6);daylight.target.position.set(0,0,2);scene.add(daylight,daylight.target);
 sign('01  현장 증거 조사',-4.3,3.35,-6.6,3.3,.32,scene,'#e8e4ce');sign('02  DNA 증폭 · 분석',4.6,3.35,-6.6,3.3,.32,scene,'#d8e8ec');
 table(-4.4,-4.2,5.6,1.4);table(4.4,-4,3,1.5);table(5.7,1.2,2.6,1.5);table(-4.8,3,2.8,1.2);
 sign('수사 장비 · 기록 열람',-4.8,.7,3.66,2.0,.2);sign('PCR  /  DNA 증폭',4.4,.7,-3.19,1.8,.2);sign('SEQUENCING / 염기서열 분석',5.7,.7,2.01,2.1,.2);
 // Object creation order matches the saved evidence IDs in world.js.
 const drawer=object('수사 장비함',-4.8,1.12,3,actions.drawer);box(0,0,0,1.05,.22,.55,dark,drawer);box(0,.12,0,1.08,.035,.57,steel,drawer);for(const x of [-.35,.35])box(x,.01,.29,.08,.1,.035,'#d1bd8c',drawer);sign('수사 도구',0,.02,.31,.65,.12,drawer);
 const notebook=object('실험 노트',-5.6,1.06,-4.05,actions.notebook);box(0,0,0,.58,.055,.72,'#645243',notebook);const page=sign('D-4  실험 기록',0,.032,0,.53,.65,notebook,'#35434a','#e0d8bd');page.rotation.x=-Math.PI/2;
 const culture=object('배양병 · 조직 배양 기록',-3.35,1.22,-4.15,actions.culture);
 for(let i=0;i<3;i++){const x=(i-1)*.45;cyl(x,.03,0,.15,.08,'#b5ad7a',culture);const jar=cyl(x,.17,0,.17,.4,glass,culture);jar.castShadow=false;cyl(x,.39,0,.18,.045,steel,culture);box(x,.17,0,.02,.25,.02,'#3c6b45',culture);for(let j=0;j<3;j++){const leaf=new T.Mesh(new T.SphereGeometry(.08,10,6),material('#73915c'));leaf.scale.set(1,.18,.5);leaf.position.set(x+(j%2?.06:-.06),.13+j*.07,0);leaf.rotation.z=j%2?.4:-.4;culture.add(leaf)}sign('B-'+(10+i),x,.05,.171,.14,.09,culture)}
 const pcr=object('PCR 증폭 장비',4.4,1.22,-3.9,actions.pcr);box(0,0,0,1.1,.45,.8,top,pcr);box(0,.25,-.13,.95,.08,.46,dark,pcr);sign('PCR / STANDBY',0,.03,.411,.65,.18,pcr,'#9edbcb','#10282e');for(let i=0;i<8;i++)box(-.46+i*.045,-.12,.412,.018,.08,.01,dark,pcr);cyl(.4,.02,.42,.045,.035,'#b5cdbf',pcr).rotation.x=Math.PI/2;
 const cabinet=object('시료 보관함',-7.8,1.1,-5.35,actions.cabinet);box(0,0,0,1.25,2.2,1.05,top,cabinet);const cabinetDoor=new T.Group();cabinetDoor.position.set(-.56,0,.54);cabinet.add(cabinetDoor);box(.56,0,0,1.12,1.95,.06,dark,cabinetDoor);box(.98,0,.06,.04,.48,.05,steel,cabinetDoor);sign('B-12  시료 보관',.56,.7,.04,.92,.22,cabinetDoor);sign('시료 보관 구역',-7.75,2.7,-6.7,2,.35);
 const terminal=object('출입 기록 단말',-7.5,1.3,3,actions.terminal);box(0,-.7,0,.45,1.2,.4,dark,terminal);box(0,0,0,.8,.58,.25,steel,terminal);sign('ACCESS / 카드 인증',0,.03,.135,.69,.38,terminal,'#b6dce1','#162e39');box(0,-.36,.1,.4,.07,.12,dark,terminal);
 const sequencer=object('염기서열 분석기',5.7,1.27,1.2,actions.sequencer);box(0,0,0,1.35,.55,.9,top,sequencer);box(-.4,.05,.46,.4,.3,.02,dark,sequencer);sign('SEQUENCE',.22,.05,.465,.64,.22,sequencer,'#b4d8da','#183442');for(let i=0;i<9;i++)box(-.4+i*.1,-.2,.46,.025,.06,.01,dark,sequencer);
 tent('01',-6,-3.65);tent('02',-2.5,-3.65);
 // Small props stay on worktops, leaving a wide central circulation space.
 for(const [x,z] of [[-4.6,-4.2],[3.5,-4.2],[6.5,1.3]]){box(x,1.02,z,.5,.045,.35,dark);for(let i=0;i<5;i++){cyl(x-.18+i*.09,1.12,z,.025,.17,glass);cyl(x-.18+i*.09,1.21,z,.028,.02,'#809caa')}}
 for(const x of [-5.1,-4.7]){const paper=sign('현장 / EVIDENCE',x,1.003,3.3,.3,.4,scene,'#536063','#d7d8bf');paper.rotation.x=-Math.PI/2}
 box(-7.5,.3,.2,.7,.6,.7,steel);box(-7.5,.62,.2,.73,.05,.73,dark);
 // Ceiling services and a warm task lamp establish believable local lighting.
 box(0,3.5,-6.75,17.5,.06,.08,steel);for(const x of [-7.5,1.8,7.8])box(x,2.4,-6.75,.04,2.2,.06,steel);
 const lamp=new T.SpotLight('#ffe0b4',18,9,.7,.6,1.5);lamp.position.set(-4.4,3.3,-3);lamp.target.position.set(-4.4,.9,-4.2);lamp.castShadow=true;lamp.shadow.mapSize.set(1024,1024);lamp.shadow.bias=-.001;scene.add(lamp,lamp.target);
 const exitDoor=new T.Group();exitDoor.userData={name:'출입문 · 연결 복도로 나가기',id:'exit',fn:leave};firstWalls.add(exitDoor);box(0,1.45,6.8,1.7,2.9,.12,dark,exitDoor);for(const x of [-.92,.92])box(x,1.5,6.73,.12,3,.2,steel,exitDoor);box(0,3,6.73,1.96,.12,.2,steel,exitDoor);box(.65,1.2,6.69,.06,.34,.07,steel,exitDoor);sign('EXIT / 연결 복도',0,2.55,6.7,1.4,.3,exitDoor,'#deeddf','#355e52').rotation.y=Math.PI;
 addLabFittings({scene,box,cyl,sign,steel,top,dark,glass,worktop});
 addLabDetail({scene,box,cyl,sign,steel,top,dark,glass,worktop,pcr,sequencer});
 // Rounded equipment shells and supported workstation signs retain real-world proportions.
 for(const root of [pcr,sequencer,drawer])root.traverse(o=>{
  if(o.geometry?.type!=='BoxGeometry')return;const {width:w,height:h,depth:d}=o.geometry.parameters;if(w<.5||h<.15||d<.3)return;
  const r=.02,shape=new T.Shape();shape.moveTo(-w/2+r,-h/2);shape.lineTo(w/2-r,-h/2);shape.quadraticCurveTo(w/2,-h/2,w/2,-h/2+r);shape.lineTo(w/2,h/2-r);shape.quadraticCurveTo(w/2,h/2,w/2-r,h/2);shape.lineTo(-w/2+r,h/2);shape.quadraticCurveTo(-w/2,h/2,-w/2,h/2-r);shape.lineTo(-w/2,-h/2+r);shape.quadraticCurveTo(-w/2,-h/2,-w/2+r,-h/2);
  const geometry=new T.ExtrudeGeometry(shape,{depth:d-2*r,bevelEnabled:true,bevelThickness:r,bevelSize:r,bevelSegments:3,curveSegments:4,steps:1});geometry.translate(0,0,-d/2+r);o.geometry=geometry;
 });
 // Mild environment reflections, not mirror-like plastic.
 const env=new T.Scene();env.background=new T.Color('#667782');const ep=new T.Mesh(new T.PlaneGeometry(20,10),new T.MeshBasicMaterial({color:'#dfe6df'}));ep.position.set(0,8,-10);env.add(ep);const pmrem=new T.PMREMGenerator(renderer);scene.environment=pmrem.fromScene(env,.08).texture;scene.environmentIntensity=.25;pmrem.dispose();
 firstWalls.visible=false;
 return {drawer,notebook,culture,pcr,cabinet,cabinetDoor,terminal,sequencer,firstWalls,exitDoor};
}
