import * as T from './vendor/three.module.js';
import {ISLAND,WALL_BENCH,STORAGE} from './lab-layout.js?v=1';
export function addLabDetail({scene,box,cyl,sign,steel,top,dark,glass,worktop,pcr,sequencer}){
 const white=new T.MeshStandardMaterial({color:'#d9ddd6',roughness:.48});
 const rubber=new T.MeshStandardMaterial({color:'#192327',roughness:.85});
 const amber=new T.MeshPhysicalMaterial({color:'#955c27',roughness:.18,transparent:true,opacity:.75,depthWrite:false});
 const blue=new T.MeshStandardMaterial({color:'#3c7897',roughness:.42});
 function lathe(points,x,y,z,mat){const m=new T.Mesh(new T.LatheGeometry(points.map(([r,h])=>new T.Vector2(r,h)),24),mat);m.position.set(x,y,z);m.castShadow=mat!==glass;m.receiveShadow=true;scene.add(m);return m}
 function flask(x,y,z,size=1){const profile=[[0,0],[.08,0],[.1,.02],[.1,.06],[.035,.2],[.028,.23],[.028,.29],[.034,.3]];const a=lathe(profile,x,y,z,glass);a.scale.setScalar(size);const liquid=lathe([[0,.012],[.087,.012],[.085,.06],[0,.06]],x,y,z,new T.MeshPhysicalMaterial({color:'#8ebbc0',transparent:true,opacity:.6,roughness:.2}));liquid.scale.setScalar(size)}
 function bottle(x,y,z,i){lathe([[0,0],[.055,0],[.055,.2],[.03,.23],[.025,.27]],x,y,z,i%3?amber:glass);cyl(x,y+.28,z,.032,.035,i%2?blue:white);sign('REAGENT',x,y+.12,z+.057,.075,.065,scene,'#536066','#e5e4d6')}
 function cable(points,r=.012){const curve=new T.CatmullRomCurve3(points.map(a=>new T.Vector3(...a)));const m=new T.Mesh(new T.TubeGeometry(curve,18,r,7,false),rubber);scene.add(m)}
 function footShadow(x,z,w,d){const c=document.createElement('canvas');c.width=c.height=64;const ctx=c.getContext('2d'),g=ctx.createRadialGradient(32,32,7,32,32,32);g.addColorStop(0,'#05101866');g.addColorStop(1,'#05101800');ctx.fillStyle=g;ctx.fillRect(0,0,64,64);const m=new T.Mesh(new T.PlaneGeometry(w,d),new T.MeshBasicMaterial({map:new T.CanvasTexture(c),transparent:true,depthWrite:false}));m.rotation.x=-Math.PI/2;m.position.set(x,.017,z);m.raycast=()=>{};scene.add(m)}
 // Double-sided central island, with knee bays, inset drawer faces and service spine.
 const {x,z,w,d}=ISLAND;box(x,.48,z,w-.14,.85,d-.12,white);box(x,.95,z,w+.04,.09,d+.04,worktop);box(x,.07,z,w-.24,.12,d-.24,dark);footShadow(x,z,w+1,d+1);
 for(const side of [-1,1])for(let i=0;i<5;i++){
  const pz=-2+i;for(let j=0;j<3;j++){box(side*(w/2-.025),.24+j*.23,pz,.035,.21,.9,top);box(side*(w/2+.01),.31+j*.23,pz,.035,.022,.5,steel)}
 }
 for(const pz of [-2.2,0,2.2])box(0,1.7,pz,.055,1.5,.055,steel);
 for(const y of [1.8,2.38]){box(0,y,0,.45,.045,4.55,white);for(const sx of [-.23,.23])box(sx,y+.09,0,.015,.015,4.55,steel);for(let i=0;i<14;i++){if(i%5!==2)bottle((i%2?.1:-.1),y+.025,-2.1+i*.31,i)}}
 box(0,1.15,0,.1,.23,4.5,white);for(const side of [-1,1])for(const pz of [-1.8,-.6,.6,1.8]){box(side*.065,1.15,pz,.025,.13,.17,top);for(const dz of [-.03,.03])box(side*.082,1.15,pz+dz,.005,.04,.012,dark)}
 sign('공용 실험대 / 시료 준비',0,.65,2.52,1.65,.18);box(0,2.35,2.31,.44,.035,.03,steel);
 // Full racks, conical glassware, tube holders, notebooks and an electronic balance.
 for(const side of [-1,1])for(const pz of [-1.8,.3,1.7]){const px=side*.67;box(px,1.025,pz,.32,.065,.4,blue);for(let a=0;a<3;a++)for(let b=0;b<4;b++){cyl(px-.09+a*.09,1.14,pz-.14+b*.09,.022,.23,glass);cyl(px-.09+a*.09,1.26,pz-.14+b*.09,.024,.025,a%2?white:blue)}}
 for(const [px,pz] of [[-.65,-.7],[.67,-.9],[-.62,1.1]])flask(px,1.0,pz,1.2);
 box(.65,1.08,1,.4,.17,.45,white);cyl(.65,1.18,1,.14,.025,steel);sign('0.0000 g',.65,1.08,1.23,.25,.07);
 function sheet(px,pz){const c=document.createElement('canvas');c.width=256;c.height=384;const t=c.getContext('2d');t.fillStyle='#e7e5d6';t.fillRect(0,0,256,384);t.fillStyle='#4e6471';t.font='bold 18px sans-serif';t.fillText('SAMPLE WORKSHEET',18,32);for(let y=62;y<350;y+=26){t.fillStyle=y%52?'#7b8986':'#9aa8a0';t.fillRect(18,y,170+(y%3)*20,2)}const map=new T.CanvasTexture(c);map.colorSpace=T.SRGBColorSpace;const m=new T.Mesh(new T.PlaneGeometry(.32,.46),new T.MeshStandardMaterial({map,roughness:.9}));m.rotation.x=-Math.PI/2;m.rotation.z=.12;m.position.set(px,1.005,pz);scene.add(m);}
 sheet(-.65,.9);sheet(.66,-.2);cable([[.8,1,1.3],[.96,1,1.5],[.85,1,.3],[.08,1.15,.4]]);
 // A bank of wall storage and a glass-fronted ventilated work cabinet.
 const b=WALL_BENCH;box(b.x,.48,b.z,b.w,.87,b.d,white);box(b.x,.95,b.z,b.w+.04,.08,b.d+.04,worktop);
 box(b.x+.5,1.7,-5.25,.1,1.45,2.2,white);box(b.x,2.4,-5.25,1.1,.08,2.2,white);box(b.x,1.15,-5.25,1.1,.08,2.2,steel);for(const pz of [-6.3,-4.2])box(b.x,1.75,pz,1.1,1.3,.08,white);box(b.x-.585,1.75,-5.25,.012,.66,1.75,glass);for(const pz of [-6.05,-4.45])box(b.x-.6,1.75,pz,.025,.78,.035,steel);box(b.x-.61,1.41,-5.25,.03,.03,1.6,steel);
 for(let i=0;i<7;i++)box(b.x-.57,2.22,-6+i*.23,.015,.07,.1,dark);
 for(const pz of [-5.8,-5.35,-4.9])flask(b.x-.45,1.19,pz,.9);
 const st=STORAGE;box(st.x,1.1,st.z,st.w,2.2,st.d,white);for(const y of [.6,1.65]){box(st.x,y,st.z+st.d/2+.01,st.w-.08,1,.035,top);box(st.x+.43,y,st.z+st.d/2+.055,.025,.38,.04,steel)}footShadow(st.x,st.z,1.9,2);
 // Service trunking, vent grids, conduit brackets and overhead lights along the island.
 for(const px of [-.65,.65]){box(px,3.48,0,.03,.2,4.9,steel);const m=new T.MeshStandardMaterial({color:'#eef0df',emissive:'#e5eadb',emissiveIntensity:1.2});box(px,3.37,0,.13,.025,4.9,m)}
 for(let pz=-2;pz<=2;pz+=1)box(0,3.57,pz,1.5,.025,.04,steel);
 // Instrument-specific surface detail: seams, screws, screen graphs, lid hinges and labels.
 for(const [g,width,front,cy] of [[pcr,1.1,.412,0],[sequencer,1.35,.462,0]]){
  for(const sx of [-width/2+.04,width/2-.04])for(const sy of [-.17,.17]){const screw=cyl(sx,sy,front+.005,.012,.008,steel,g);screw.rotation.x=Math.PI/2;box(sx,sy,front+.01,.012,.002,.002,dark,g)}
  box(0,.2,front+.002,width-.06,.008,.005,dark,g);
  sign('BIO SYSTEMS / CALIBRATED',0,-.18,front+.009,width*.45,.035,g,'#607275','#d9ded8');
  for(let i=0;i<4;i++)box(width/2-.12,.09-i*.05,front+.012,.025,.02,.012,i?'#758f86':'#8abc9c',g);
 }
 const hinge=cyl(0,.25,-.33,.028,.8,steel,pcr);hinge.rotation.z=Math.PI/2;
 for(let i=0;i<6;i++){const tube=cyl(-.35+i*.14,.26,-.05,.035,.05,steel,pcr);tube.material=steel;}
 // Slightly brushed stainless steel, instead of uniform flat-color metal.
 const c=document.createElement('canvas');c.width=c.height=128;const ct=c.getContext('2d');ct.fillStyle='#aeb8b9';ct.fillRect(0,0,128,128);for(let i=0;i<128;i++){ct.fillStyle=i%3?'#e7eeed12':'#273a4112';ct.fillRect(0,i,128,1)}const tex=new T.CanvasTexture(c);tex.colorSpace=T.SRGBColorSpace;steel.map=tex;steel.needsUpdate=true;
 // Epoxy worktops: subtle wear and varying roughness catch light at close range.
 let grainSeed=93;const random=()=>((grainSeed=grainSeed*16807%2147483647)-1)/2147483646;
 const surface=document.createElement('canvas');surface.width=surface.height=512;const sc=surface.getContext('2d');sc.fillStyle='#252e32';sc.fillRect(0,0,512,512);
 const rough=document.createElement('canvas');rough.width=rough.height=512;const rc=rough.getContext('2d');rc.fillStyle='#777777';rc.fillRect(0,0,512,512);
 for(let i=0;i<14000;i++){const x=random()*512,y=random()*512;sc.fillStyle=i%2?'#c7d8d509':'#07111a0a';sc.fillRect(x,y,1,1);rc.fillStyle=i%2?'#ffffff18':'#00000012';rc.fillRect(x,y,2,2)}
 for(let i=0;i<36;i++){const x=random()*512,y=random()*512,dx=8+random()*35;sc.strokeStyle='#bbc9cd0c';sc.beginPath();sc.moveTo(x,y);sc.lineTo(x+dx,y+2);sc.stroke();rc.strokeStyle='#ffffff16';rc.beginPath();rc.moveTo(x,y);rc.lineTo(x+dx,y+2);rc.stroke()}
 worktop.map=new T.CanvasTexture(surface);worktop.map.colorSpace=T.SRGBColorSpace;worktop.map.anisotropy=4;worktop.color.set('#ffffff');worktop.roughnessMap=new T.CanvasTexture(rough);worktop.roughness=.85;worktop.needsUpdate=true;
 // Bevel only worktop edges; structural/collision dimensions remain unchanged.
 scene.traverse(o=>{if(o.material!==worktop||o.geometry?.type!=='BoxGeometry')return;const {width:w,height:h,depth:d}=o.geometry.parameters;const r=Math.min(.018,h/4),shape=new T.Shape();
 shape.moveTo(-w/2+r,-h/2);shape.lineTo(w/2-r,-h/2);shape.quadraticCurveTo(w/2,-h/2,w/2,-h/2+r);shape.lineTo(w/2,h/2-r);shape.quadraticCurveTo(w/2,h/2,w/2-r,h/2);shape.lineTo(-w/2+r,h/2);shape.quadraticCurveTo(-w/2,h/2,-w/2,h/2-r);shape.lineTo(-w/2,-h/2+r);shape.quadraticCurveTo(-w/2,-h/2,-w/2+r,-h/2);
 const geo=new T.ExtrudeGeometry(shape,{depth:d-2*r,bevelEnabled:true,bevelThickness:r,bevelSize:r,bevelSegments:2,curveSegments:3,steps:1});geo.translate(0,0,-d/2+r);o.geometry=geo;
 });
 // Instrument displays are physically attached screens, distinct from the interaction HUD.
 for(const [device,width,title,subtitle] of [[pcr,.65,'THERMAL CYCLER','READY   /   24.0 C'],[sequencer,.64,'SEQUENCE ANALYZER','IDLE   /   SAMPLE --']]){
 const screen=device.children.find(o=>o.geometry?.type==='PlaneGeometry'&&Math.abs(o.geometry.parameters.width-width)<.001);if(!screen)continue;
 const cv=document.createElement('canvas');cv.width=768;cv.height=256;const dc=cv.getContext('2d');dc.fillStyle='#102c34';dc.fillRect(0,0,768,256);dc.fillStyle='#69abaf';dc.fillRect(12,12,744,40);dc.fillStyle='#102732';dc.font='bold 25px monospace';dc.fillText(title,28,41);dc.fillStyle='#d3e8d8';dc.font='30px monospace';dc.fillText(subtitle,28,102);
 dc.strokeStyle='#37636c';for(let y=132;y<240;y+=24){dc.beginPath();dc.moveTo(25,y);dc.lineTo(740,y);dc.stroke()}dc.strokeStyle='#a5d7b7';dc.lineWidth=3;dc.beginPath();dc.moveTo(25,207);dc.lineTo(160,207);dc.lineTo(165,155);dc.lineTo(300,155);dc.lineTo(305,207);dc.lineTo(450,207);dc.stroke();dc.fillStyle='#a6bdbd';dc.font='18px monospace';dc.fillText('SYSTEM ONLINE',510,225);
 const map=new T.CanvasTexture(cv);map.colorSpace=T.SRGBColorSpace;map.anisotropy=4;screen.material=new T.MeshBasicMaterial({map});
 }

}
