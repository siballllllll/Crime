import {createAmbience} from './ambience.js?v=1';
import {drawInvestigator} from './character.js?v=2';
export function createHub({enter,notes,lab,settings,observe}) {
 const hub=document.createElement('section');hub.id='research-hub';
 hub.innerHTML=`<header class="hub-header"><div><span>BIO CASEFILES · CASE 001</span><h1>사라진 신품종</h1><p>새봄 생명연구소 / 현장 수사</p></div><button id="hub-settings">화면 설정</button></header><div class="pixel-map detailed-map quarter-map"><canvas width="1280" height="854" tabindex="0" aria-label="연구소 복도. WASD나 방향키로 이동하고 문 앞에서 E로 조사. 바닥을 눌러 이동할 수도 있습니다."></canvas><div class="map-caption">SAEBOM INSTITUTE <span>배양 연구동 · 1F</span></div><button class="map-interact" disabled>문 앞으로 이동하세요</button></div><footer class="hub-footer"><p>WASD / 방향키로 이동 · 바닥을 눌러 이동 · 문 앞에서 E 또는 조사 버튼</p><div><button data-note="suspects">용의자 자료</button><button data-note="board">내 증거 보드</button><button data-note="report">수사 보고서</button></div><small>배양실에서는 1인칭으로 현장을 조사합니다. 수집한 기록은 장소를 옮겨도 유지됩니다.</small></footer>`;
 const canvas=hub.querySelector('canvas'),c=canvas.getContext('2d');c.imageSmoothingEnabled=false;
 const r=(x,y,w,h,color)=>{c.fillStyle=color;c.fillRect(Math.round(x),Math.round(y),w,h)};
 const background=document.createElement('canvas');background.width=1280;background.height=854;
 const bc=background.getContext('2d');bc.fillStyle='#142b37';bc.fillRect(0,0,1280,854);
 const art=new Image();art.src='./assets/research-quarter.png?v=1';
 art.onload=()=>{bc.imageSmoothingEnabled=false;bc.drawImage(art,0,0,1280,854);};
 art.onerror=()=>{hub.querySelector('.map-caption').textContent='배경을 불러오지 못했습니다. 새로고침해 주세요.';};
 const drawAmbience=createAmbience(hub.querySelector('.pixel-map'),observe);
 const player={x:320,y:280};const keys=new Set();let destination=null,last=0,near=null;
 const places=[{x:110,y:250,name:'배양실 · 현장 조사',action:enter},{x:320,y:250,name:'분석실 · 시료 검사',action:lab},{x:535,y:250,name:'수사 본부 · 용의자 자료',action:()=>notes('suspects')}];
 const active=()=>hub.isConnected&&hub.closest('#game').classList.contains('hub-mode')&&!hub.closest('#game').hidden&&!document.querySelector('#modal').open;
 let facing='down',walkPhase=0;
 function stop(){keys.clear();destination=null;}
 const button=hub.querySelector('.map-interact');button.onclick=()=>{if(near){stop();near.action();}};
 const mapKeys={KeyW:[0,-1],ArrowUp:[0,-1],KeyS:[0,1],ArrowDown:[0,1],KeyA:[-1,0],ArrowLeft:[-1,0],KeyD:[1,0],ArrowRight:[1,0]};
 window.addEventListener('keydown',e=>{if(!active()||/INPUT|TEXTAREA|SELECT/.test(e.target.tagName))return;if(mapKeys[e.code]){e.preventDefault();keys.add(e.code);destination=null;}if(e.code==='KeyE'&&!e.repeat){e.preventDefault();button.click();}});window.addEventListener('keyup',e=>keys.delete(e.code));window.addEventListener('blur',stop);
 canvas.addEventListener('pointerdown',e=>{if(!active())return;const b=canvas.getBoundingClientRect();destination={x:Math.max(40,Math.min(600,(e.clientX-b.left)/b.width*640)),y:Math.max(250,Math.min(291,(e.clientY-b.top)/b.height*427))};canvas.focus();});
 function draw(now){requestAnimationFrame(draw);const dt=Math.min(.04,(now-last)/1000||0);last=now;if(!active()){stop();return;}let dx=0,dy=0;for(const key of keys){dx+=mapKeys[key][0];dy+=mapKeys[key][1];}if(destination){dx=destination.x-player.x;dy=destination.y-player.y;if(Math.hypot(dx,dy)<2){destination=null;dx=dy=0;}}const len=Math.hypot(dx,dy);if(len){const distance=Math.min(85*dt,destination?len:Infinity);player.x=Math.max(40,Math.min(600,player.x+dx/len*distance));player.y=Math.max(250,Math.min(291,player.y+dy/len*distance));}near=places.find(p=>Math.hypot(player.x-p.x,player.y-p.y)<28);button.disabled=!near;button.textContent=near?`${near.name} · E`:'문 앞으로 이동하세요';c.drawImage(background,0,0);drawAmbience(c,now);c.save();c.scale(2,2);if(destination){r(destination.x-3,destination.y,7,1,'#b3c9b2');r(destination.x,destination.y-3,1,7,'#b3c9b2');}if(near){r(near.x-8,near.y-8,16,2,'#d6c38c');}c.restore();if(len){facing=Math.abs(dx)>Math.abs(dy)?(dx>0?'right':'left'):(dy>0?'down':'up');walkPhase+=dt*2.6;}drawInvestigator(c,player.x*2,player.y*2,now,len>0,facing,walkPhase);}
 requestAnimationFrame(draw);
 hub.querySelector('#hub-settings').onclick=settings;hub.querySelectorAll('[data-note]').forEach(b=>b.onclick=()=>{stop();notes(b.dataset.note);});return hub;
}
