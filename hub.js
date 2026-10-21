import {drawInvestigator} from './character.js?v=1';
export function createHub({enter,notes,lab,settings}) {
 const hub=document.createElement('section');hub.id='research-hub';
 hub.innerHTML=`<header class="hub-header"><div><span>BIO CASEFILES · CASE 001</span><h1>사라진 신품종</h1><p>새봄 생명연구소 / 현장 수사</p></div><button id="hub-settings">화면 설정</button></header><div class="pixel-map detailed-map"><canvas width="1280" height="720" tabindex="0" aria-label="연구소 복도. WASD나 방향키로 이동하고 문 앞에서 E로 조사. 바닥을 눌러 이동할 수도 있습니다."></canvas><div class="map-caption">SAEBOM INSTITUTE <span>배양 연구동 · 1F</span></div><button class="map-interact" disabled>문 앞으로 이동하세요</button></div><footer class="hub-footer"><p>WASD / 방향키로 이동 · 바닥을 눌러 이동 · 문 앞에서 E 또는 조사 버튼</p><div><button data-note="suspects">용의자 자료</button><button data-note="board">내 증거 보드</button><button data-note="report">수사 보고서</button></div><small>배양실에서는 1인칭으로 현장을 조사합니다. 수집한 기록은 장소를 옮겨도 유지됩니다.</small></footer>`;
 const canvas=hub.querySelector('canvas'),c=canvas.getContext('2d');c.imageSmoothingEnabled=false;c.scale(2,2);
 const r=(x,y,w,h,color)=>{c.fillStyle=color;c.fillRect(Math.round(x),Math.round(y),w,h)};
 let seed=271;function random(){seed=(seed*16807)%2147483647;return seed/2147483647;}
 const text=(str,x,y,color='#c3d6ba',size=8)=>{c.font=`${size}px monospace`;c.fillStyle=color;c.fillText(str,x,y);};
 const floor=(x,y,w,h)=>{r(x,y,w,h,'#243d42');for(let a=x;a<x+w;a+=16)for(let b=y;b<y+h;b+=16){r(a+1,b+1,15,15,['#415451','#3a504f','#3e5351'][Math.floor(random()*3)]);r(a+2,b+2,13,1,'#4b6059');if(random()<.22)r(a+4,b+8,3,1,'#586961');}};
 const lamp=(x,y)=>{r(x-3,y-2,66,8,'#182d35');r(x,y,60,3,'#c5d9ac');r(x+2,y+3,56,1,'#7ea59a');};
 const bottle=(x,y,green=false)=>{r(x,y,7,13,'#193b45');r(x+1,y+1,5,11,green?'#60866b':'#588c8c');r(x+2,y+2,1,8,'#acc5ad');r(x,y-2,7,3,'#c6c5a1');r(x+2,y+6,3,5,green?'#a2bc72':'#72b6b4');};
 const monitor=(x,y)=>{r(x+11,y+18,4,7,'#202e36');r(x+5,y+24,18,3,'#83988b');r(x,y,29,21,'#152d38');r(x+2,y+2,25,16,'#355e65');r(x+4,y+4,17,2,'#8ec4ae');for(let a=0;a<4;a++)r(x+4,y+8+a*2,5+a*3,1,'#608f83');r(x+24,y+18,2,1,'#d5b879');};
 const bench=(x,y,w)=>{r(x+4,y+12,w,20,'#182d34');r(x,y,w,25,'#536c63');r(x,y,w,5,'#a6b69b');r(x,y+5,w,2,'#263e40');for(let a=x+3;a<x+w-12;a+=23){r(a,y+9,20,14,'#3c5753');r(a+6,y+11,7,2,'#97a58b');r(a+18,y+8,1,16,'#6b8273');}r(x+2,y+25,3,6,'#20363a');r(x+w-5,y+25,3,6,'#20363a');};
 const cabinet=(x,y)=>{r(x+3,y+5,34,73,'#182b32');r(x,y,33,72,'#68857a');r(x+3,y+4,27,61,'#29474b');for(let a=0;a<3;a++){r(x+4,y+22+a*19,25,2,'#8b9c84');bottle(x+7,y+9+a*19,true);bottle(x+18,y+9+a*19);}r(x+15,y+3,2,63,'#8da490');r(x+26,y+34,2,9,'#b8b796');r(x+2,y+69,29,3,'#243d42');};
 const door=(x,label)=>{r(x-23,143,48,88,'#142934');r(x-20,146,42,82,'#879886');r(x-16,150,34,78,'#355456');r(x-13,154,28,25,'#142f3e');r(x-11,156,24,2,'#7d9f9c');r(x-8,158,1,18,'#486f76');r(x+9,190,3,7,'#d5b97d');r(x-16,225,34,3,'#adb89a');r(x-25,230,52,5,'#74877a');r(x-26,132,54,10,'#162f39');text(label,x-21,140,'#cbd8b3',7);};
 r(0,0,640,360,'#142b37');floor(12,95,616,247);
 // Tall rear walls with masonry, conduit and a raised service gallery.
 r(12,23,616,106,'#4b625c');for(let y=28;y<124;y+=12)for(let x=14;x<628;x+=24){r(x,y,22,1,'#5e7164');r(x+(y%24?10:0),y,1,11,'#354f50');}
 r(12,20,616,5,'#81917a');r(12,122,616,7,'#203b43');
 for(let x=22;x<620;x+=95){r(x,34,3,79,'#243f48');r(x+3,34,2,79,'#7c9181');r(x-2,53,9,4,'#8b9b83');r(x-2,95,9,4,'#8b9b83');}
 r(22,37,590,3,'#243b43');r(22,34,590,2,'#8c9b82');
 // Three rooms separated by thick cutaway walls.
 for(const x of [12,218,424,623]){r(x,86,5,144,'#1d353e');r(x-2,83,8,4,'#849780');}
 // Culture laboratory: shelves, greenhouse glass, seedlings and microscope.
 r(34,50,115,62,'#203e48');for(let x=37;x<146;x+=27){r(x,53,23,54,'#426a6b');r(x+2,55,3,46,'#5e8780');r(x+19,53,2,54,'#8eaa92');}r(34,78,115,3,'#8a9f89');
 bench(27,115,174);for(let x=34;x<187;x+=14)bottle(x,102,true);
 cabinet(170,46);bench(31,175,57);r(47,155,8,20,'#b7bca0');r(44,155,18,4,'#c8c8a7');r(58,156,4,12,'#718f80');r(50,171,18,3,'#172f37');r(34,163,10,8,'#c4c4a3');
 door(137,'CULTURE 02');lamp(75,27);
 // Analytical laboratory: machines, DNA display, glassware and paperwork.
 bench(236,115,172);monitor(244,87);r(292,83,41,31,'#9ba997');r(295,86,35,7,'#536f68');r(299,97,18,9,'#173f4b');for(let i=0;i<6;i++)r(301+i*2,100,1,4,'#81c5bc');r(324,100,4,4,'#d2ad77');for(let x=348;x<401;x+=13)bottle(x,101);
 r(251,52,126,25,'#213d47');text('GENOMICS / ANALYSIS',258,63,'#abc5ad');for(let x=258;x<370;x+=7)r(x,68,3,2,'#63988b');
 bench(237,178,55);monitor(245,151);cabinet(375,150);door(337,'ANALYSIS');lamp(281,27);
 // Investigation office: noticeboard, archive binders, terminals and chair.
 r(452,49,126,54,'#263a3e');r(455,52,120,48,'#81785a');for(let i=0;i<12;i++){let x=460+(i%6)*18,y=57+Math.floor(i/6)*22;r(x,y,13,17,i%3?'#bec1a0':'#92a797');r(x+2,y+4,8,1,'#718577');r(x+2,y+7,6,1,'#718577');r(x+5,y,2,2,'#b56551');}
 bench(442,116,168);monitor(455,88);r(502,106,23,8,'#ccd0ac');r(505,108,16,1,'#819582');for(let x=539;x<604;x+=7){r(x,93,5,22,['#9b9770','#537c78','#a98267'][x%3]);r(x+1,99,3,2,'#c7c7a2');}
 bench(442,178,54);r(458,153,20,19,'#34505a');r(460,155,16,12,'#678177');r(464,176,5,10,'#1c333d');door(550,'CASE OFFICE');lamp(486,27);
 // Corridor: floor seams, railings, cables, crates and plants.
 r(12,241,616,2,'#91a18b');r(12,244,616,3,'#1f3a43');for(let x=22;x<620;x+=24){r(x,248,12,2,'#c2a86f');r(x+12,248,12,2,'#253c40');}
 r(14,335,612,7,'#1a303a');r(14,333,612,2,'#819383');
 for(let x=30;x<610;x+=186){r(x,302,25,30,'#6c7460');r(x+2,304,21,2,'#a29e7a');r(x+4,309,17,17,'#4b6056');r(x+11,307,2,23,'#939579');}
 function plant(x,y){r(x-6,y,13,13,'#8c8767');r(x-7,y,15,3,'#b1aa7e');r(x-1,y-19,2,20,'#647b4f');for(let i=0;i<8;i++){const a=i%2?-1:1;r(x+a*(3+i%3),y-8-i*2,7,3,['#658c62','#819b6b','#466b58'][i%3]);}}
 plant(84,320);plant(604,315);
 // Wiring and pin lights add small-scale contrast without obscuring the path.
 for(let i=0;i<85;i++){const x=18+Math.floor(random()*600),y=255+Math.floor(random()*73);r(x,y,1,1,random()>.5?'#718173':'#283f42');}
 // Fine texture is drawn at native 1280×720 resolution, never enlarged blocks.
 c.setTransform(1,0,0,1,0,0);
 for(let i=0;i<15000;i++){const x=24+Math.floor(random()*1230),y=48+Math.floor(random()*624);r(x,y,1,1,random()>.5?'#bdc7a016':'#0c26351c');}
 // Riveted metal rails, scratches, cabling and ventilation grilles.
 for(let x=30;x<1240;x+=18){r(x,245,2,2,'#b3b99b');r(x,246,1,1,'#243e46');r(x,474,2,2,'#a9b398');}
 for(let x=45;x<1200;x+=205){r(x,83,64,27,'#1b3540');r(x+1,84,62,1,'#9ba991');for(let y=88;y<106;y+=3){r(x+4,y,55,1,'#6d8277');r(x+4,y+1,55,1,'#122c38');}r(x+2,85,2,2,'#b3b99b');r(x+59,103,2,2,'#b3b99b');}
 for(const x of [174,584,994]){for(let i=0;i<3;i++){r(x+i*4,70,2,30+i*7,'#8c9f89');r(x+i*4,99+i*7,21-i*4,2,'#69887f');}r(x+12,121,22,29,'#294751');r(x+14,123,18,24,'#708a7e');for(let j=0;j<4;j++)r(x+17,128+j*4,12,1,'#344f56');r(x+29,144,2,2,'#d0b47e');}
 // Smaller shelf equipment: test tube racks, labeled vials, cables and notebooks.
 for(const start of [62,474,884]){for(let i=0;i<6;i++){let x=start+i*11;r(x,211,5,15,'#274851');r(x+1,210,3,13,'#89bcb1');r(x+2,213,1,7,'#d0dec1');r(x,207,5,3,'#b1b9a0');r(x,217,5,4,'#c4cbb1');}r(start-3,224,72,4,'#6d8d81');r(start,228,2,3,'#b4bda2');}
 for(let x=60;x<1200;x+=96){r(x,256,23,13,'#bbbfa0');r(x+2,259,14,1,'#596f68');r(x+2,262,18,1,'#596f68');r(x+2,265,9,1,'#596f68');}
 // Micro-details on door frames and access readers.
 for(const x of [274,674,1100]){r(x+49,360,12,24,'#182f3b');r(x+51,362,8,9,'#507f80');r(x+52,364,5,2,'#b5d6b8');for(let k=0;k<6;k++)r(x+51+(k%3)*3,374+Math.floor(k/3)*3,2,2,'#98a998');for(let y=302;y<445;y+=23){r(x-39,y,2,2,'#c1c6a6');r(x+39,y,2,2,'#c1c6a6');}r(x-21,417,43,17,'#27444c');for(let y=420;y<432;y+=3)r(x-18,y,37,1,'#617c73');}
 // Plants with individually shaded leaves and branching stems.
 for(const x of [168,1208]){for(let i=0;i<35;i++){const px=x+(random()-.5)*37,py=585+random()*40;r(px,py,5,2,'#426c56');r(px+1,py-1,3,1,'#8ba773');r(px+2,py+2,1,6,'#56795e');}}
 // Secondary instruments and deeper material shading at the native pixel scale.
 function panel(x,y,w,h){r(x+3,y+4,w,h,'#162e38');r(x,y,w,h,'#778d7c');r(x+1,y+1,w-2,2,'#b9bba0');r(x+2,y+4,w-4,h-6,'#394f50');for(let j=0;j<5;j++){r(x+5,y+8+j*5,w-10,1,'#60756b');}r(x+w-6,y+h-6,2,2,'#b0d1a8');}
 function wire(x,y,w,h,color){r(x,y,w,1,color);r(x+w,y,1,h,color);r(x+w-4,y+h,5,1,color);}
 panel(105,289,52,32);panel(710,282,31,48);panel(1182,273,35,52);
 // Incubator control boxes and spooled cables.
 for(const x of [367,779]){r(x,315,22,26,'#263e48');r(x+2,317,18,9,'#a5b997');text('21.5',x+3,324,'#21424b',6);for(let a=0;a<3;a++){r(x+4+a*5,330,3,3,a===1?'#c8a77a':'#7ca9a0');}wire(x+11,341,17,23,'#243e49');wire(x+12,341,18,24,'#7b9182');}
 // Lens assembly on the microscope, sample trays and a pipette stand.
 r(92,309,18,7,'#d2d2b4');r(98,311,5,3,'#536e76');r(110,314,4,16,'#688b88');r(104,328,11,2,'#c7c8aa');r(92,331,25,3,'#253d47');r(94,334,21,1,'#a0ab95');r(89,340,31,3,'#789085');
 r(128,335,18,8,'#263e49');for(let a=0;a<6;a++)r(130+a*2,336,1,4,'#b9cdc1');
 for(const x of [343,745,1160]){r(x,201,27,3,'#bac6ac');for(let a=0;a<4;a++){r(x+2+a*6,180,3,21,'#cccfac');r(x+2+a*6,179,3,3,'#497e82');r(x+3+a*6,197,1,8,'#b5d6c1');}r(x+23,181,3,23,'#6d877e');}
 // Bioreactor: valves, glass vessel, measurement ticks and fluid.
 r(422,153,37,64,'#172f3a');r(425,156,31,57,'#486e73');r(427,158,3,50,'#8bb2a5');r(432,181,21,28,'#4d8a79');for(let y=163;y<208;y+=6)r(447,y,6,1,'#b5c5a7');r(421,151,40,6,'#a4af94');r(421,214,40,5,'#839b8a');r(437,143,7,8,'#758e84');wire(439,139,26,27,'#809b90');r(463,158,9,3,'#b7aa7a');r(466,155,3,9,'#b7aa7a');
 // Technical wall posters and safety placards, with real small text.
 r(300,99,30,56,'#b1bda0');r(302,101,26,8,'#416564');text('BIO',305,107,'#d4d9b9',6);for(let y=114;y<147;y+=5){r(304,y,21,1,'#758b7e');r(304,y+2,14,1,'#758b7e');}
 r(818,107,23,49,'#c2b18b');text('!',826,119,'#5b5a4d',10);for(let y=125;y<150;y+=4)r(821,y,17,1,'#877c64');
 // Uneven stacks of field reports, pencils, desk tools and monitor cables.
 for(const x of [1007,1067]){for(let j=0;j<5;j++){r(x+j%2,210-j*3,25,3,j%2?'#b2b99d':'#c9c8a8');r(x+3,211-j*3,15,1,'#7a8b7a');}r(x+29,199,2,14,'#caa96e');r(x+29,213,2,2,'#273d47');}
 wire(929,225,29,12,'#243b46');wire(930,225,29,13,'#7d8f80');
 // Book spines, glass reflections and plant silhouettes inside the culture window.
 for(let x=83;x<285;x+=40){r(x,201,18,8,'#807e62');r(x+8,167,2,34,'#69865b');for(let y=171;y<196;y+=7){r(x+1,y,8,3,'#5e8763');r(x+9,y+3,9,3,'#789a6a');r(x+2,y,5,1,'#9eb17d');}}
 for(let x=75;x<289;x+=54){r(x,111,1,86,'#a3c5b03b');r(x+3,111,2,86,'#a3c5b018');}
 // Warm utility lights and layered strips of reflected light.
 for(const x of [273,674,1099]){r(x-28,258,58,4,'#243d46');r(x-24,259,50,2,'#ead4a0');for(let k=0;k<12;k++){c.fillStyle=`rgba(225,193,122,${.025*(1-k/12)})`;c.fillRect(x-30-k*2,264+k*7,60+k*4,7);}r(x-25,264,53,1,'#ab9f78');}
 const background=document.createElement('canvas');background.width=1280;background.height=720;background.getContext('2d').drawImage(canvas,0,0);
 const player={x:320,y:292};const keys=new Set();let destination=null,last=0,near=null;
 const places=[{x:137,y:257,name:'배양실 · 현장 조사',action:enter},{x:337,y:257,name:'분석실 · 시료 검사',action:lab},{x:550,y:257,name:'수사 본부 · 용의자 자료',action:()=>notes('suspects')}];
 const active=()=>hub.isConnected&&hub.closest('#game').classList.contains('hub-mode')&&!hub.closest('#game').hidden&&!document.querySelector('#modal').open;
 let facing='down',walkPhase=0;
 function stop(){keys.clear();destination=null;}
 const button=hub.querySelector('.map-interact');button.onclick=()=>{if(near){stop();near.action();}};
 const mapKeys={KeyW:[0,-1],ArrowUp:[0,-1],KeyS:[0,1],ArrowDown:[0,1],KeyA:[-1,0],ArrowLeft:[-1,0],KeyD:[1,0],ArrowRight:[1,0]};
 window.addEventListener('keydown',e=>{if(!active()||/INPUT|TEXTAREA|SELECT/.test(e.target.tagName))return;if(mapKeys[e.code]){e.preventDefault();keys.add(e.code);destination=null;}if(e.code==='KeyE'&&!e.repeat){e.preventDefault();button.click();}});window.addEventListener('keyup',e=>keys.delete(e.code));window.addEventListener('blur',stop);
 canvas.addEventListener('pointerdown',e=>{if(!active())return;const b=canvas.getBoundingClientRect();destination={x:Math.max(24,Math.min(616,(e.clientX-b.left)/b.width*640)),y:Math.max(257,Math.min(293,(e.clientY-b.top)/b.height*360))};canvas.focus();});
 function draw(now){requestAnimationFrame(draw);const dt=Math.min(.04,(now-last)/1000||0);last=now;if(!active()){stop();return;}let dx=0,dy=0;for(const key of keys){dx+=mapKeys[key][0];dy+=mapKeys[key][1];}if(destination){dx=destination.x-player.x;dy=destination.y-player.y;if(Math.hypot(dx,dy)<2){destination=null;dx=dy=0;}}const len=Math.hypot(dx,dy);if(len){const distance=Math.min(85*dt,destination?len:Infinity);player.x=Math.max(24,Math.min(616,player.x+dx/len*distance));player.y=Math.max(257,Math.min(293,player.y+dy/len*distance));}near=places.find(p=>Math.hypot(player.x-p.x,player.y-p.y)<28);button.disabled=!near;button.textContent=near?`${near.name} · E`:'문 앞으로 이동하세요';c.drawImage(background,0,0);c.save();c.scale(2,2);if(destination){r(destination.x-3,destination.y,7,1,'#b3c9b2');r(destination.x,destination.y-3,1,7,'#b3c9b2');}if(near){r(near.x-8,240,16,2,'#d6c38c');}c.restore();if(len){facing=Math.abs(dx)>Math.abs(dy)?(dx>0?'right':'left'):(dy>0?'down':'up');walkPhase+=dt*2.6;}drawInvestigator(c,player.x*2,player.y*2,now,len>0,facing,walkPhase);}
 requestAnimationFrame(draw);
 hub.querySelector('#hub-settings').onclick=settings;hub.querySelectorAll('[data-note]').forEach(b=>b.onclick=()=>{stop();notes(b.dataset.note);});return hub;
}
