export function createHub({enter,notes,lab,settings}) {
 const hub=document.createElement('section');hub.id='research-hub';
 hub.innerHTML=`<header class="hub-header"><div><span> BIO CASEFILES · CASE 001</span><h1>사라진 신품종</h1><p>새봄 생명연구소 / 수사 본부</p></div><button id="hub-settings">화면 설정</button></header><div class="pixel-map"><canvas width="480" height="270" aria-label="배양실, 분석실, 수사 본부가 연결된 연구소 지도"></canvas><button class="map-place culture-place"><small>현장 조사 · 1인칭</small><b>배양실 02</b><span>현장에 들어가기 →</span></button><button class="map-place lab-place"><small>시료 검사</small><b>분석실</b><span>PCR · 염기서열 분석 →</span></button><button class="map-place office-place"><small>기록 검토</small><b>수사 본부</b><span>용의자 자료 →</span></button><div class="hub-location">당신은 연구소 중앙 복도에 있습니다</div></div><footer class="hub-footer"><p>장소를 선택해 이동하세요. 확보한 시료와 기록을 비교해 사건을 해결하세요.</p><div><button data-note="suspects">용의자 자료</button><button data-note="board">내 증거 보드</button><button data-note="report">수사 보고서</button></div><small>현장에서는 WASD 이동 · E 조사 · I 인벤토리 · Esc 메뉴</small></footer>`;
 const c=hub.querySelector('canvas').getContext('2d');c.imageSmoothingEnabled=false;
 const rect=(x,y,w,h,color)=>{c.fillStyle=color;c.fillRect(x,y,w,h)};
 rect(0,0,480,270,'#101c29');
 for(let y=10;y<260;y+=10)for(let x=10;x<470;x+=10)rect(x,y,9,9,(x+y)%20?'#263c48':'#2a414c');
 function room(x,y,w,h){rect(x-4,y-4,w+8,h+8,'#0a131c');rect(x,y,w,h,'#52706b');rect(x+4,y+9,w-8,h-13,'#233b40');rect(x+4,y+4,w-8,4,'#89a89a');for(let a=x+8;a<x+w-8;a+=12)for(let b=y+14;b<y+h-5;b+=12)rect(a,b,11,11,'#2c4748');}
 room(22,24,196,132);room(268,24,190,132);room(22,194,196,65);
 // Culture benches, jars, cabinets and overhead lamps.
 rect(35,43,165,24,'#142b31');rect(35,40,165,7,'#9cba9d');
 for(let x=45;x<196;x+=25){rect(x,29,9,13,'#5e9c93');rect(x,27,9,3,'#c4d7a1');rect(x+4,31,2,9,'#97c56c');}
 rect(35,81,24,50,'#496b66');rect(38,84,18,19,'#91aca0');rect(38,108,18,18,'#91aca0');
 rect(181,78,20,58,'#7b9890');rect(185,82,12,49,'#29484c');
 rect(290,42,145,25,'#899e92');for(let x=302;x<430;x+=47){rect(x,29,28,23,'#c2cbb2');rect(x+4,34,19,10,'#254b56');rect(x+6,36,10,3,'#8cddcf');}
 rect(291,85,30,43,'#4b6b6a');rect(295,88,22,17,'#adc6b5');rect(330,85,100,8,'#78968a');
 rect(37,213,62,27,'#829487');rect(51,203,23,15,'#172d39');rect(54,205,17,9,'#86b7ab');
 rect(158,210,43,35,'#4f6967');for(let x=161;x<197;x+=8)rect(x,212,5,24,'#9eab8e');
 // Open doors and investigation tape.
 for(const x of [112,356]){rect(x,145,24,13,'#152a33');rect(x-4,143,32,3,'#d4b56b');}
 rect(112,192,24,12,'#192e38');
 for(let x=28;x<215;x+=14)rect(x,158,8,3,'#d6bb77');
 // Investigator sprite in the corridor.
 rect(237,170,9,4,'#102029');rect(236,174,11,9,'#e2b798');rect(234,183,15,13,'#b9c7ad');rect(239,183,4,14,'#425b60');rect(235,196,5,8,'#172633');rect(244,196,5,8,'#172633');
 hub.querySelector('.culture-place').onclick=enter;hub.querySelector('.lab-place').onclick=lab;hub.querySelector('.office-place').onclick=()=>notes('suspects');hub.querySelector('#hub-settings').onclick=settings;hub.querySelectorAll('[data-note]').forEach(b=>b.onclick=()=>notes(b.dataset.note));
 return hub;
}
