// Decorative effects never add evidence or alter the case solution.
export function createAmbience(container,observe){
 let warm=true,rustleUntil=0;const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const layer=document.createElement('div');layer.className='environment-controls';
 const items=[
 {x:335,y:390,name:'벽 조명 · 밝기 전환',icon:'☀',run:()=>{warm=!warm;return warm?'벽 조명을 밝게 켰습니다.':'벽 조명의 밝기를 낮췄습니다.';}},
 {x:446,y:461,name:'복도 화분 관찰',icon:'❧',run:()=>{rustleUntil=performance.now()+1600;observe('복도 화분','잎과 흙을 살펴보았습니다. 복도 장식용 식물입니다. 이 관찰만으로 배양실 시료와 같은 계통이라고 판단할 수는 없습니다.');return '잎이 가볍게 흔들립니다. 환경 관찰은 수사 증거에 추가되지 않습니다.';}},
 {x:598,y:128,name:'분석실 모니터 관찰',icon:'⌁',run:()=>{observe('분석실 모니터','장비의 대기 화면입니다. 움직이는 DNA 표시는 검사 결과가 아닙니다. 실제 검사는 분석실에 들어가 확보한 시료로 진행하세요.');return '분석 장비는 대기 중입니다.';}}
 ];
 const status=document.createElement('p');status.className='environment-status';status.setAttribute('role','status');container.appendChild(status);let until=0;
 for(const item of items){const b=document.createElement('button');b.style.left=(item.x/1280*100)+'%';b.style.top=(item.y/854*100)+'%';b.textContent=item.icon;b.title=item.name;b.setAttribute('aria-label',item.name);b.onclick=()=>{status.textContent=item.run();until=performance.now()+5000;};layer.appendChild(b);}container.appendChild(layer);
 function glow(c,x,y,r,strength,color){const g=c.createRadialGradient(x,y,1,x,y,r);g.addColorStop(0,`rgba(${color},${strength})`);g.addColorStop(1,`rgba(${color},0)`);c.fillStyle=g;c.fillRect(x-r,y-r,r*2,r*2);}
 return function draw(c,now){if(until&&now>until){status.textContent='';until=0;}const t=reduced.matches?0:now/1000;
 c.save();c.globalCompositeOperation='screen';
 for(const [x,y] of [[94,390],[335,390],[483,390],[806,390],[941,390],[1186,390],[1085,142]])glow(c,x,y,48,(warm?.14:.025)+(reduced.matches?0:Math.sin(t*2.1+x)*.018),'255,195,102');
 glow(c,596,129,60,.055+Math.sin(t*.9)*.015,'80,160,220');c.restore();
 if(!reduced.matches){
 // Slowly drifting lit dust and tiny monitor activity.
 c.save();for(let i=0;i<22;i++){const x=65+(i*139.13+t*(1+i%3))%1150,y=360+(i*51.37-t*(2+i%2))%190;const a=(Math.sin(t+i)+1)*.08;c.fillStyle=`rgba(230,219,171,${a})`;c.fillRect(Math.round(x),Math.round(y),1,1);}
 c.fillStyle='#8dc9d144';const scan=110+(t*9)%29;c.fillRect(569,Math.round(scan),41,1);
 // A few leaf tips respond to ventilation; inspecting the plant amplifies movement.
 const amplitude=now<rustleUntil?2:0.55;
 for(let i=0;i<9;i++){const x=437+i%3*7,y=419+Math.floor(i/3)*6;c.fillStyle=i%2?'#7b906c88':'#506a4788';c.fillRect(Math.round(x+Math.sin(t*1.4+i)*amplitude),y,3,1);}
 c.restore();}
 };
}
