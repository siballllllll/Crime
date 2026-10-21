import * as T from './vendor/three.module.js';
import {drawInvestigator} from './character.js?v=4';
import {walkable,stepPlayer,findPath} from './spatial-navigation.js';
export function createHub({enter,notes,lab,settings,observe,investigate,inventory}){
 const hub=document.createElement('section');hub.id='research-hub';hub.className='spatial-hub';
 hub.innerHTML=`<header class="hub-header"><div><span>BIO CASEFILES / EXPLORABLE LAB</span><h1>사라진 신품종</h1><p>새봄 연구소 · 배양 연구동</p></div><button id="hub-settings">화면 설정</button></header><div class="spatial-viewport"><div class="spatial-caption">쿼터뷰 수사 <span>WASD 이동 · 바닥 클릭 이동 · E 상호작용</span></div><div class="spatial-loading">연구소를 여는 중…</div><button class="spatial-action" disabled>주변을 둘러보세요</button><button class="spatial-home">입구로 돌아가기</button><div class="spatial-pad"><button data-dir="up">↑</button><button data-dir="left">←</button><button data-dir="down">↓</button><button data-dir="right">→</button></div><p class="spatial-status" role="status"></p></div><footer class="hub-footer"><div><button data-note="suspects">용의자 자료</button><button data-note="board">내 증거 보드</button><button data-note="report">수사 보고서</button><button class="spatial-inventory">도구함</button><button class="focus-room">1인칭 정밀 조사</button></div><small>문은 가까이에서 열 수 있습니다. 실내 장비와 기록은 직접 조사하세요.</small></footer>`;
 const area=hub.querySelector('.spatial-viewport'),action=hub.querySelector('.spatial-action'),status=hub.querySelector('.spatial-status');
 const renderer=new T.WebGLRenderer({antialias:true,alpha:false});renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.15;area.prepend(renderer.domElement);renderer.domElement.tabIndex=0;renderer.domElement.setAttribute('aria-label','걸어 다닐 수 있는 쿼터뷰 연구소');
 const scene=new T.Scene();scene.background=new T.Color('#101c29');scene.fog=new T.Fog('#101c29',35,65);
 const camera=new T.OrthographicCamera(-10,10,8,-8,.1,80);const cameraOffset=new T.Vector3(12,17,15);
 scene.add(new T.HemisphereLight('#bedee4','#384039',1.35));const sun=new T.DirectionalLight('#ffe5b0',1.5);sun.position.set(-8,17,8);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-16,right:16,top:16,bottom:-16,near:1,far:45});sun.shadow.bias=-.0004;sun.shadow.normalBias=.04;scene.add(sun);
 const textureCache=new Map();
 function surface(color){if(textureCache.has(color))return textureCache.get(color);const cv=document.createElement('canvas');cv.width=cv.height=64;const cc=cv.getContext('2d');cc.fillStyle=color;cc.fillRect(0,0,64,64);let seed=134;for(let i=0;i<1100;i++){seed=(seed*16807)%2147483647;const x=seed%64;seed=(seed*16807)%2147483647;const y=seed%64;cc.fillStyle=i%2?'#ffffff0b':'#0000000c';cc.fillRect(x,y,1,1);}cc.strokeStyle='#ffffff15';cc.strokeRect(.5,.5,63,63);const tex=new T.CanvasTexture(cv);tex.colorSpace=T.SRGBColorSpace;tex.magFilter=T.NearestFilter;textureCache.set(color,tex);return tex;}
 const materials=new Map(),obstacles=[],targets=[],plants=[];let doorOpen=false,doorAngle=0;
 function mat(color,metal=0){const key=color+metal;if(!materials.has(key))materials.set(key,new T.MeshStandardMaterial({map:surface(color),roughness:.75,metalness:metal}));return materials.get(key);}
 function box(x,y,z,w,h,d,color,parent=scene){const m=new T.Mesh(new T.BoxGeometry(w,h,d),mat(color));m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
 function cylinder(x,y,z,r,h,color,parent=scene){const m=new T.Mesh(new T.CylinderGeometry(r,r*.87,h,12),mat(color));m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
 function block(x,z,w,d){obstacles.push({x,z,w,d});}
 function label(str,x,y,z,w=2){const cv=document.createElement('canvas');cv.width=512;cv.height=96;const ctx=cv.getContext('2d');ctx.fillStyle='#19353b';ctx.fillRect(0,0,512,96);ctx.strokeStyle='#a6b5a0';ctx.strokeRect(5,5,502,86);ctx.font='bold 36px sans-serif';ctx.fillStyle='#e0dcc2';ctx.textAlign='center';ctx.fillText(str,256,61);const tex=new T.CanvasTexture(cv);tex.colorSpace=T.SRGBColorSpace;const mesh=new T.Mesh(new T.PlaneGeometry(w,w*96/512),new T.MeshBasicMaterial({map:tex}));mesh.position.set(x,y,z);scene.add(mesh);return mesh;}
 function target(mesh,name,x,z,run,range=1.9){const item={mesh,name,x,z,run,range};mesh.traverse(o=>o.userData.target=item);targets.push(item);return item;}
 // Individually modelled tiles and walls: camera motion reveals real depth.
 box(0,-.28,0,20.6,.5,14.6,'#243c43');
 for(let x=-10;x<10;x++)for(let z=-7;z<7;z++){const color=z>0?((x+z)%2?'#63736c':'#6c7b72'):((x+z)%2?'#748b82':'#80948a');box(x+.5,-.015,z+.5,.985,.045,.985,color);}
 for(const x of [-9.8,9.8]){box(x,1.4,-3.5,.28,2.8,7,'#647d73');block(x,-3.5,.28,7);box(x,2.83,-3.5,.4,.13,7,'#a5b59b');}
 box(0,1.55,-6.9,20,3.1,.25,'#718c7b');block(0,-6.9,20,.25);box(0,.18,-6.69,20,.28,.12,'#3f615a');
 for(let x=-9;x<10;x+=2){box(x,1.5,-6.72,.09,2.8,.1,'#849b86');}
 // Front cutaway wall with an actual hinged door between the two sections.
 for(const [x,w] of [[-8,4],[-1,6],[6.5,7]]){box(x,.85,0,w,1.7,.3,'#4e7068');box(x,1.73,0,w+.08,.12,.4,'#b2bda0');block(x,0,w,.3);}
 const hinge=new T.Group();hinge.position.set(-6,0,0);scene.add(hinge);box(1,1,0,2,2,.13,'#385b57',hinge);box(1,1.5,-.08,1.5,.6,.03,'#73998f',hinge);box(1,.68,-.08,1.6,.55,.03,'#557368',hinge);box(1.77,1,.13,.09,.12,.14,'#d5b878',hinge);
 const doorBlock={x:-5,z:0,w:2,d:.24};
 target(hinge,'배양실 문',-5,0,()=>{if(doorOpen&&Math.abs(player.x+5)<1.4&&Math.abs(player.z)<.65){say('문에서 조금 떨어진 뒤 닫아 주세요.');return;}doorOpen=!doorOpen;route=[];say(doorOpen?'문을 열었습니다. 배양실 안으로 들어갈 수 있습니다.':'문을 닫았습니다.');},2.4);
 label('배양실 02',-5,2.9,.05,2.1);box(-6.13,1.38,0,.18,2.76,.3,'#b1b99a');box(-3.88,1.38,0,.18,2.76,.3,'#b1b99a');box(-5,2.76,0,2.4,.16,.3,'#b1b99a');
 // A second, open passage connects the analysis and office benches.
 label('분석실 / 수사 기록',2.5,2.65,.03,3.3);
 function bench(x,z,w=3,d=1.15){const g=new T.Group();g.position.set(x,0,z);scene.add(g);box(0,1.05,0,w,.16,d,'#c1c7ab',g);box(0,.5,0,w-.12,.95,d-.12,'#526f63',g);for(let a=-w/2+.42;a<w/2;a+=.72){box(a,.54,d/2,.63,.68,.05,'#779181',g);box(a,.77,d/2+.04,.25,.04,.05,'#c9c5a3',g);}block(x,z,w,d);return g;}
 const culture=bench(-6,-4.3,4);for(let i=0;i<7;i++){const x=-1.55+i*.5;cylinder(x,1.42,0,.16,.58,'#8bb9aa',culture);cylinder(x,1.74,0,.18,.07,'#d1cbb0',culture);cylinder(x,1.24,0,.14,.1,'#8f9d6f',culture);box(x,1.43,0,.025,.3,.025,'#4a713e',culture);box(x+.04,1.51,0,.14,.04,.07,'#8ca46c',culture);}
 target(culture,'배양 기록과 시료',-6,-4.3,()=>investigate('culture'),2.3);
 const notebook=bench(-7.8,-1.8,2,1);const book=box(.25,1.18,0,.6,.08,.42,'#c2b480',notebook);box(.25,1.23,0,.5,.025,.35,'#eee2b8',notebook);target(notebook,'실험 노트',-7.8,-1.8,()=>investigate('notebook'));
 const pcr=bench(-.7,-4.4,3.2);box(-.65,1.43,0,1,.66,.8,'#d0d2bc',pcr);box(-.65,1.79,-.08,.87,.1,.55,'#6b847e',pcr);box(-.65,1.45,.42,.6,.22,.02,'#153d4b',pcr);box(-.65,1.45,.44,.4,.04,.01,'#80d2c0',pcr);target(pcr,'PCR 증폭 장비',-.7,-4.4,()=>investigate('pcr'),2.2);
 const seq=bench(3.4,-4.4,3);box(0,1.43,0,1.9,.65,.85,'#a7bdb0',seq);box(.15,1.52,.44,1.2,.32,.025,'#244f5c',seq);target(seq,'염기서열 분석기',3.4,-4.4,()=>investigate('sequencer'),2.2);
 const archive=new T.Group();scene.add(archive);archive.position.set(8.4,0,-4.9);box(0,1.35,0,1.7,2.7,.9,'#536e63',archive);for(let y=.35;y<2.7;y+=.62){box(0,y,0,1.6,.08,1,'#abb79d',archive);for(let x=-.65;x<.8;x+=.18)box(x,y+.24,0,.13,.4,.6,x>0?'#9b7d5d':'#597c73',archive);}block(8.4,-4.9,1.7,.9);target(archive,'용의자 수사 자료',8.4,-4.9,()=>notes('suspects'),2);
 const sample=new T.Group();sample.position.set(-9,0,-4.8);scene.add(sample);box(0,1.35,0,1,2.7,1,'#b5c4ac',sample);box(0,1.65,.52,.8,1.5,.04,'#3f6b65',sample);box(.3,1.35,.57,.05,.45,.08,'#d8d1a9',sample);block(-9,-4.8,1,1);target(sample,'시료 보관함',-9,-4.8,()=>investigate('cabinet'));
 const kit=bench(6.6,-1.5,2);box(0,1.28,0,1,.35,.65,'#4f6865',kit);box(0,1.47,0,.45,.06,.2,'#c1b783',kit);target(kit,'수사 장비함',6.6,-1.5,()=>investigate('drawer'));
 const terminal=bench(8.2,4.5,2);box(0,1.5,0,1,.75,.15,'#304b54',terminal);box(0,1.5,.09,.83,.56,.02,'#6caaa1',terminal);target(terminal,'출입 기록 단말',8.2,4.5,()=>investigate('terminal'));
 // Windows, pipes, fittings and lamps add physical depth to the room.
 for(const x of [-6,-1,4]){box(x,2,-6.72,3.2,1.5,.1,'#284a59');for(let a=-1.4;a<=1.4;a+=.7)box(x+a,2,-6.61,.04,1.5,.05,'#adc2ad');box(x,2,-6.6,3.2,.04,.06,'#a2b8a5');}
 box(0,3,-6.5,19,.06,.08,'#a39c7e');for(const x of [-8.5,1.8,8.5])box(x,1.9,-6.5,.06,2.2,.08,'#a39c7e');
 const lamps=[];for(const x of [-6,0,6]){box(x,2.95,-3,2,.12,.35,'#bac3ac');const light=new T.PointLight('#d6edce',7,7,2);light.position.set(x,2.7,-3);scene.add(light);lamps.push(light);}
 function plant(x,z){const g=new T.Group();g.position.set(x,0,z);scene.add(g);cylinder(0,.3,0,.35,.6,'#8e8b66',g);const foliage=new T.Group();g.add(foliage);for(let i=0;i<9;i++){const a=i*2.4,leaf=new T.Mesh(new T.SphereGeometry(.23,6,4),mat(i%2?'#527e54':'#7e9e65'));leaf.scale.set(.55,1.5,.65);leaf.position.set(Math.cos(a)*.25,.85+i%3*.17,Math.sin(a)*.25);leaf.rotation.z=Math.cos(a)*.6;foliage.add(leaf);}block(x,z,.65,.65);plants.push(foliage);target(g,'연구소 화분',x,z,()=>{foliage.userData.rustle=performance.now()+1500;observe('연구소 화분','잎이 공조 바람에 흔들립니다. 복도 식물의 겉모습만으로 시료의 계통을 판정할 수는 없습니다.');});}
 plant(-8.6,4.7);plant(4.8,4.5);plant(8.8,-.5);
 // A real bench hides the lower part of the actor when walking behind it.
 const seat=new T.Group();seat.position.set(-2,0,4.7);scene.add(seat);box(0,.5,0,2.5,.18,.8,'#806e52',seat);box(0,1,.32,2.5,.8,.12,'#8c795a',seat);for(const x of [-1,1])box(x,.24,0,.13,.5,.6,'#35474b',seat);block(-2,4.7,2.5,.9);
 const lampStand=new T.Group();lampStand.position.set(2,0,4.8);scene.add(lampStand);cylinder(0,.9,0,.04,1.8,'#9e9772',lampStand);cylinder(0,.08,0,.3,.16,'#405654',lampStand);const shade=new T.Mesh(new T.ConeGeometry(.45,.6,12,1,true),mat('#d4b77b'));shade.position.y=1.9;lampStand.add(shade);const warm=new T.PointLight('#ffcc7b',9,6,2);warm.position.set(2,1.65,4.8);scene.add(warm);block(2,4.8,.6,.6);target(lampStand,'복도 조명 켜기 / 끄기',2,4.8,()=>{warm.visible=!warm.visible;say(warm.visible?'복도 조명을 켰습니다.':'복도 조명을 껐습니다.');});
 // Physical desk clutter, vent blades, instruments and a blue status display.
 for(const [x,z] of [[-7.5,-4.3],[-.1,-4.4],[4.2,-4.4],[6.6,-1.5]]){for(let j=0;j<3;j++){const paper=box(x+j*.07,1.16+j*.014,z+.25,.42,.012,.31,'#e2d5af');paper.rotation.y=j*.15;box(x+j*.07,1.18+j*.014,z+.25,.27,.005,.018,'#728779');}cylinder(x+.48,1.29,z+.2,.09,.26,'#677f75');for(let k=0;k<3;k++)box(x+.45+k*.03,1.47,z+.2,.018,.22,.018,'#b79d72');}
 for(const x of [-7.2,-5.7,-.8,3.4]){for(let j=0;j<3;j++){box(x+j*.12,1.23,-4.58,.07,.3,.07,'#8dbdaf');box(x+j*.12,1.4,-4.58,.08,.04,.08,'#d2c8a4');}box(x+.12,1.13,-4.58,.5,.06,.22,'#617c73');}
 for(const x of [-6,-1,4]){label('SAEBOM / RESEARCH',x,2.98,-6.56,1.7);}
 const fan=new T.Group();fan.position.set(7,2.5,-6.52);scene.add(fan);box(0,0,0,1.1,.8,.1,'#2b4851',fan);const rotor=new T.Group();rotor.position.z=.1;fan.add(rotor);for(let i=0;i<4;i++){const blade=box(0,.18,0,.12,.34,.04,'#8a9f95',rotor);blade.position.set(Math.sin(i*Math.PI/2)*.18,Math.cos(i*Math.PI/2)*.18,0);blade.rotation.z=-i*Math.PI/2;}cylinder(0,0,0,.08,.08,'#afbaa1',rotor);
 const displayCanvas=document.createElement('canvas');displayCanvas.width=256;displayCanvas.height=128;const dc=displayCanvas.getContext('2d');const displayTex=new T.CanvasTexture(displayCanvas);displayTex.colorSpace=T.SRGBColorSpace;const display=new T.Mesh(new T.PlaneGeometry(1.15,.4),new T.MeshBasicMaterial({map:displayTex}));display.position.set(3.55,1.52,-3.94);scene.add(display);
 const rug=box(-2,.028,4.5,3.4,.015,2.2,'#485a57');
 const player={x:-5,z:3};let route=[],keys=new Set(),near=null,last=0,phase=0,direction='down';const focus=new T.Vector3(-2,0,1);
 const actorCanvas=document.createElement('canvas');actorCanvas.width=128;actorCanvas.height=128;const actorContext=actorCanvas.getContext('2d');const actorTexture=new T.CanvasTexture(actorCanvas);actorTexture.colorSpace=T.SRGBColorSpace;actorTexture.magFilter=T.NearestFilter;const actor=new T.Mesh(new T.PlaneGeometry(1.9,1.9),new T.MeshBasicMaterial({map:actorTexture,transparent:true,alphaTest:.12,side:T.DoubleSide,depthWrite:true}));scene.add(actor);
 const shadow=new T.Mesh(new T.CircleGeometry(.33,24),new T.MeshBasicMaterial({color:'#152a31',transparent:true,opacity:.28,depthWrite:false}));shadow.rotation.x=-Math.PI/2;scene.add(shadow);
 const marker=new T.Mesh(new T.RingGeometry(.31,.35,32),new T.MeshBasicMaterial({color:'#e5ca8a',transparent:true,opacity:.7,side:T.DoubleSide,depthWrite:false}));marker.rotation.x=-Math.PI/2;marker.visible=false;scene.add(marker);
 const ray=new T.Raycaster(),mouse=new T.Vector2(),ground=new T.Plane(new T.Vector3(0,1,0),0);const active=()=>hub.isConnected&&hub.closest('#game').classList.contains('hub-mode')&&!hub.closest('#game').hidden&&!document.querySelector('#modal').open;
 const solids=()=>doorAngle<1.35?[...obstacles,doorBlock]:[...obstacles,{x:-6,z:1,w:.16,d:2}];
 function say(text){status.textContent=text;}
 function stop(){keys.clear();route=[];}
 function interact(){if(!near)return;stop();near.run();}
 action.onclick=interact;
 function go(item){const candidates=[];for(let a=0;a<Math.PI*2;a+=Math.PI/8){const p={x:item.x+Math.cos(a)*1.35,z:item.z+Math.sin(a)*1.35};if(walkable(p.x,p.z,solids(),.3))candidates.push(p);}candidates.sort((a,b)=>Math.hypot(a.x-player.x,a.z-player.z)-Math.hypot(b.x-player.x,b.z-player.z));if(candidates.length)route=findPath(player,candidates[0],solids());say('가까이 이동한 뒤 E 또는 조사 버튼을 누르세요.');}
 renderer.domElement.addEventListener('pointerdown',e=>{if(!active())return;renderer.domElement.focus();const bounds=renderer.domElement.getBoundingClientRect();mouse.set((e.clientX-bounds.left)/bounds.width*2-1,1-(e.clientY-bounds.top)/bounds.height*2);ray.setFromCamera(mouse,camera);const hit=ray.intersectObjects(scene.children,true).find(h=>h.object!==actor&&h.object!==shadow&&h.object!==marker);const item=hit?.object.userData.target;if(item){if(Math.hypot(player.x-item.x,player.z-item.z)<item.range){stop();item.run();}else go(item);return;}const p=new T.Vector3();if(ray.ray.intersectPlane(ground,p))route=findPath(player,p,solids());});
 const map={KeyW:'up',ArrowUp:'up',KeyS:'down',ArrowDown:'down',KeyA:'left',ArrowLeft:'left',KeyD:'right',ArrowRight:'right'};
 window.addEventListener('keydown',e=>{if(!active()||/INPUT|TEXTAREA|SELECT/.test(e.target.tagName))return;if(map[e.code]){e.preventDefault();keys.add(map[e.code]);route=[];}if(e.code==='KeyE'&&!e.repeat){e.preventDefault();interact();}});window.addEventListener('keyup',e=>keys.delete(map[e.code]));window.addEventListener('blur',stop);
 for(const b of hub.querySelectorAll('[data-dir]')){b.onpointerdown=e=>{e.preventDefault();keys.add(b.dataset.dir);route=[];b.setPointerCapture(e.pointerId);};for(const event of ['pointerup','pointercancel','lostpointercapture'])b.addEventListener(event,()=>keys.delete(b.dataset.dir));}
 hub.querySelector('.spatial-home').onclick=()=>{stop();player.x=-5;player.z=3;say('입구로 돌아왔습니다.');};hub.querySelector('#hub-settings').onclick=settings;hub.querySelector('.spatial-inventory').onclick=()=>{stop();inventory();};hub.querySelector('.focus-room').onclick=()=>{stop();enter();};hub.querySelectorAll('[data-note]').forEach(b=>b.onclick=()=>{stop();notes(b.dataset.note);});
 function resize(){const w=area.clientWidth,h=area.clientHeight;if(!w||!h)return;renderer.setSize(w,h);const aspect=w/h;camera.left=-8.6*aspect;camera.right=8.6*aspect;camera.top=8.6;camera.bottom=-8.6;camera.updateProjectionMatrix();}new ResizeObserver(resize).observe(area);
 const reduce=matchMedia('(prefers-reduced-motion: reduce)');let settingsAt=0;
 function frame(now){requestAnimationFrame(frame);const dt=Math.min(.05,(now-last)/1000||0);last=now;if(!active()){stop();return;}if(now-settingsAt>500){settingsAt=now;try{const prefs=JSON.parse(localStorage.getItem('bio-display-v1'));renderer.toneMappingExposure=1.15*(prefs?.brightness??100)/100;}catch{}}const desired=doorOpen?Math.PI/2:0;doorAngle+=(desired-doorAngle)*Math.min(1,dt*8);hinge.rotation.y=-doorAngle;
 let sx=Number(keys.has('right'))-Number(keys.has('left')),sy=Number(keys.has('down'))-Number(keys.has('up'));let dx=sx*.78+sy*.625,dz=-sx*.625+sy*.78;
 if(route.length){const p=route[0];dx=p.x-player.x;dz=p.z-player.z;if(Math.hypot(dx,dz)<.12){route.shift();dx=dz=0;}}
 const moving=stepPlayer(player,dx,dz,dt,solids());if(moving){phase+=dt*2.6;const screenX=dx*.78-dz*.625,screenY=dx*.625+dz*.78;direction=Math.abs(screenX)>Math.abs(screenY)?(screenX>0?'right':'left'):(screenY>0?'down':'up');}
 near=targets.filter(t=>Math.hypot(player.x-t.x,player.z-t.z)<t.range).sort((a,b)=>Math.hypot(player.x-a.x,player.z-a.z)-Math.hypot(player.x-b.x,player.z-b.z))[0];action.disabled=!near;action.textContent=near?near.name+' · E':'가까이 다가가 조사하세요';
 marker.visible=!!near;if(near)marker.position.set(near.x,.04,near.z);
 focus.lerp(new T.Vector3(player.x*.55,0,player.z*.45-1),1-Math.exp(-dt*3));camera.position.copy(focus).add(cameraOffset);camera.lookAt(focus);camera.updateMatrixWorld();
 actorContext.clearRect(0,0,128,128);drawInvestigator(actorContext,64,120,now,moving,direction,phase);actorTexture.needsUpdate=true;actor.quaternion.copy(camera.quaternion);actor.position.set(player.x,.86,player.z);shadow.position.set(player.x,.045,player.z);
 dc.fillStyle='#123141';dc.fillRect(0,0,256,128);dc.fillStyle='#89c9bb';dc.font='18px monospace';dc.fillText('SEQUENCE / READY',12,25);for(let i=0;i<24;i++){const h=15+Math.sin((reduce.matches?0:now*.001)+i*.7)*10;dc.fillRect(12+i*10,82-h,4,h);}displayTex.needsUpdate=true;
 if(!reduce.matches){rotor.rotation.z+=dt*2;plants.forEach((p,i)=>p.rotation.z=Math.sin(now*.0015+i)*(p.userData.rustle>now?.09:.015));lamps.forEach((l,i)=>l.intensity=7+Math.sin(now*.0008+i)*.15);}
 renderer.render(scene,camera);
 }
 requestAnimationFrame(frame);hub.querySelector('.spatial-loading').remove();return hub;
}
