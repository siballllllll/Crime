export function createHub({enter,notes,lab,settings}) {
 const hub=document.createElement('section');hub.id='research-hub';
 hub.innerHTML=`<header class="hub-header"><div><span>BIO CASEFILES · CASE 001</span><h1>사라진 신품종</h1><p>새봄 생명연구소 / 현장 수사</p></div><button id="hub-settings">화면 설정</button></header><div class="pixel-map detailed-map"><canvas width="640" height="360" tabindex="0" aria-label="연구소 복도. WASD나 방향키로 이동하고 문 앞에서 E로 조사. 바닥을 눌러 이동할 수도 있습니다."></canvas><div class="map-caption">SAEBOM INSTITUTE <span>배양 연구동 · 1F</span></div><button class="map-interact" disabled>문 앞으로 이동하세요</button></div><footer class="hub-footer"><p>WASD / 방향키로 이동 · 바닥을 눌러 이동 · 문 앞에서 E 또는 조사 버튼</p><div><button data-note="suspects">용의자 자료</button><button data-note="board">내 증거 보드</button><button data-note="report">수사 보고서</button></div><small>배양실에서는 1인칭으로 현장을 조사합니다. 수집한 기록은 장소를 옮겨도 유지됩니다.</small></footer>`;
 const canvas=hub.querySelector('canvas'),c=canvas.getContext('2d');c.imageSmoothingEnabled=false;
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
 const background=document.createElement('canvas');background.width=640;background.height=360;background.getContext('2d').drawImage(canvas,0,0);
 const player={x:320,y:292};const keys=new Set();let destination=null,last=0,near=null;
 const places=[{x:137,y:257,name:'배양실 · 현장 조사',action:enter},{x:337,y:257,name:'분석실 · 시료 검사',action:lab},{x:550,y:257,name:'수사 본부 · 용의자 자료',action:()=>notes('suspects')}];
 const active=()=>hub.isConnected&&hub.closest('#game').classList.contains('hub-mode')&&!hub.closest('#game').hidden&&!document.querySelector('#modal').open;
 function sprite(x,y,t,moving){x=Math.round(x);y=Math.round(y);const step=moving?Math.round(Math.sin(t/110)*2):0;r(x-8,y-2,17,4,'#283c40');r(x-5,y-10,4,10+step,'#192b36');r(x+2,y-10,4,10-step,'#192b36');r(x-6,y-1+step,5,2,'#a5a994');r(x+2,y-1-step,5,2,'#a5a994');r(x-7,y-24,14,17,'#aebba5');r(x-5,y-23,4,14,'#c7cbb0');r(x-1,y-23,3,15,'#354f55');r(x-10,y-22,3,13+step,'#829b8b');r(x+7,y-22,3,13-step,'#829b8b');r(x-10,y-10+step,3,4,'#c8ac88');r(x+7,y-10-step,3,4,'#c8ac88');r(x-5,y-35,11,12,'#c6aa87');r(x-6,y-37,12,5,'#253942');r(x-6,y-33,3,5,'#30454a');r(x+1,y-30,2,2,'#33464b');r(x+5,y-30,2,2,'#33464b');r(x+4,y-27,2,1,'#8c735e');r(x+4,y-20,3,4,'#d4bd7f');}
 function stop(){keys.clear();destination=null;}
 const button=hub.querySelector('.map-interact');button.onclick=()=>{if(near){stop();near.action();}};
 const mapKeys={KeyW:[0,-1],ArrowUp:[0,-1],KeyS:[0,1],ArrowDown:[0,1],KeyA:[-1,0],ArrowLeft:[-1,0],KeyD:[1,0],ArrowRight:[1,0]};
 window.addEventListener('keydown',e=>{if(!active()||/INPUT|TEXTAREA|SELECT/.test(e.target.tagName))return;if(mapKeys[e.code]){e.preventDefault();keys.add(e.code);destination=null;}if(e.code==='KeyE'&&!e.repeat){e.preventDefault();button.click();}});window.addEventListener('keyup',e=>keys.delete(e.code));window.addEventListener('blur',stop);
 canvas.addEventListener('pointerdown',e=>{if(!active())return;const b=canvas.getBoundingClientRect();destination={x:Math.max(24,Math.min(616,(e.clientX-b.left)/b.width*640)),y:Math.max(257,Math.min(293,(e.clientY-b.top)/b.height*360))};canvas.focus();});
 function draw(now){requestAnimationFrame(draw);const dt=Math.min(.04,(now-last)/1000||0);last=now;if(!active()){stop();return;}let dx=0,dy=0;for(const key of keys){dx+=mapKeys[key][0];dy+=mapKeys[key][1];}if(destination){dx=destination.x-player.x;dy=destination.y-player.y;if(Math.hypot(dx,dy)<2){destination=null;dx=dy=0;}}const len=Math.hypot(dx,dy);if(len){const distance=Math.min(85*dt,destination?len:Infinity);player.x=Math.max(24,Math.min(616,player.x+dx/len*distance));player.y=Math.max(257,Math.min(293,player.y+dy/len*distance));}near=places.find(p=>Math.hypot(player.x-p.x,player.y-p.y)<28);button.disabled=!near;button.textContent=near?`${near.name} · E`:'문 앞으로 이동하세요';c.drawImage(background,0,0);if(destination){r(destination.x-3,destination.y,7,1,'#b3c9b2');r(destination.x,destination.y-3,1,7,'#b3c9b2');}if(near){r(near.x-8,240,16,2,'#d6c38c');}sprite(player.x,player.y,now,len>0);}
 requestAnimationFrame(draw);
 hub.querySelector('#hub-settings').onclick=settings;hub.querySelectorAll('[data-note]').forEach(b=>b.onclick=()=>{stop();notes(b.dataset.note);});return hub;
}
