import {createForensicField} from './forensic-field.js?v=1';
import {requestFpsCapture} from './fps-input.js?v=1';
import {buildInvestigationRoom} from './investigation-room.js?v=5';
import {createInteractionFeedback} from './interaction-feedback.js?v=1';
import {createHub} from './spatial-hub.js?v=8';
import * as T from './vendor/three.module.js';
import {illustration} from './illustrations.js?v=2';
import {START,movePlayer} from './navigation.js?v=5';
const desktopPointer=()=>matchMedia('(pointer:fine)').matches;let fallbackPointer=null,pointerLockUnavailable=false;
let fieldMenu=false;let firstPerson=false;const player={...START};const held=new Set();let lastFrame=0,drag=null,suppressClick=false;
function releaseControls(){fallbackPointer=null;held.clear();drag=null;if(document.pointerLockElement)document.exitPointerLock();}

const $=s=>document.querySelector(s),key='bio-room-v3';document.body.appendChild($('#modal'));let s;try{s=JSON.parse(localStorage.getItem(key))}catch{}s??={items:[],done:[],selected:null};let angle=0,targetAngle=0,zoom=null;const clicks=[];
const save=()=>{localStorage.setItem(key,JSON.stringify(s));inventory();objective()};
function note(t){$('#message').textContent=t}function has(id){return s.items.includes(id)}function done(id){return s.done.includes(id)}
function evidence(found=[],solved=[]){window.dispatchEvent(new CustomEvent('world-evidence',{detail:{found,solved}}))}
function mark(id){renderer.shadowMap.needsUpdate=true;if(!done(id))s.done.push(id);save()}
function collect(id){if(!has(id))s.items.push(id);s.selected=id;save()}
const names={key:'⚿ 보관함 열쇠',card:'▣ 직원 카드',sample:'◒ 시료 튜브',amp:'◈ 증폭 DNA'};
const itemInfo={key:['보관함 열쇠','이전 버전에서 확보한 연구소 열쇠. 현재 현장은 수사 권한으로 열람할 수 있습니다.','cabinet'],card:['직원 카드','연구소 발급 기록 열람 카드. STAFF / ACCESS 표시가 있습니다.','terminal'],sample:['시료 튜브','B-12 배양병에서 확보한 DNA 추출 시료. 내용물의 정체는 검사 전입니다.','pcr'],amp:['증폭 DNA','PCR 처리 후 회수한 표적 DNA. 아직 염기 순서를 읽은 상태는 아닙니다.','sequencer']};
Object.assign(itemInfo,{
 'sampling-kit':['개별 채취 키트','위치 사진을 남기고 새 장갑·도구로 시료별 채취합니다.','trace-box'],
 'forensic-lamp':['감식 광원·필터','형광 관찰 보조 장비. 반응만으로 혈액이나 DNA를 확정하지 않습니다.','trace-box'],
 'print-kit':['지문 감식 키트','형광 분말 처리·광원 관찰·촬영·전사를 순서대로 수행합니다.','trace-drawer'],
 'hair-sample':['H-1 모근 조직','K-2 라이너 접착면에서 개별 채취한 모발. DNA 추출이 먼저 필요합니다.','drawer'],
 'cargo-sample':['P-1 식물 조직','K-2 내부 잔여물. 표면 대조 시료와 함께 확보했습니다.','drawer']
});
let activeInspect='notebook';let prefs;try{prefs=JSON.parse(localStorage.getItem('bio-display-v1'))}catch{}prefs={brightness:100,labels:true,sensitivity:100,...prefs};
function inventory(){
$('#inventory').innerHTML=Object.keys(itemInfo).filter(id=>['card','sample','amp'].includes(id)||has(id)).map(id=>`<button data-item="${id}" ${!has(id)?'disabled':''} aria-pressed="${s.selected===id}" class="inventory-slot ${has(id)?'acquired':'empty'} ${s.selected===id?'selected':''}">${has(id)?illustration(id):'<span class="slot-placeholder">＋</span>'}<span>${has(id)?itemInfo[id][0]:'미확보'}</span>${s.selected===id?'<small>선택 중</small>':''}</button>`).join('');
const info=itemInfo[s.selected];$('#item-detail').innerHTML=info?`${illustration(s.selected)}<div><b>${info[0]}</b><p>${info[1]}</p><span>선택한 도구를 현장의 장비에 사용할 수 있습니다</span></div>`:'<div><b>인벤토리</b><p>확보한 도구를 누르면 크게 확인할 수 있습니다.</p><span>① 도구 선택 → ② 방 안의 대상 물건 클릭</span></div>';
document.querySelectorAll('[data-item]').forEach(b=>b.onclick=()=>{s.selected=s.selected===b.dataset.item?null:b.dataset.item;save();note(s.selected?itemInfo[s.selected][1]:'도구 선택을 해제했습니다.')});
}
function objective(){$('#goal-counter').textContent='CASE 001 / 현장 수사';$('#goal-title').textContent='시료는 누가 바꿨을까?';$('#objective-text').textContent='정리 서랍과 K-2 상자를 직접 조사하세요. 흔적을 발견하면 장비함에서 정밀감식을 요청할 수 있습니다.';$('#goal-list').innerHTML='';$('#locate-goal').textContent='확보한 기록 모아보기 ↗';}
function modal(title,body,actions=[]){releaseControls();const utility=/현장 감식|화면 설정|수사 시작|물건을 관찰/.test(title);const artId=/찰칵|열린 서랍/.test(title)?'drawerOpen':/보관함이 열렸다/.test(title)?'cabinetOpen':/증폭이 완료/.test(title)?'amp':/재조합/.test(title)?'recomb':activeInspect;const picture=`<div class="inspect-visual">${illustration(artId)}<span>${{amp:'PCR 증폭 DNA',drawerOpen:'서랍 내부 · 열쇠와 직원 카드',cabinetOpen:'보관함 내부 · B-12 시료',notebook:'실험 노트',drawer:'현장 수사 장비함',cabinet:'시료 보관함',culture:'조직 배양병',pcr:'PCR 증폭 장비',sequencer:'염기서열 분석기',terminal:'출입 단말',recomb:'재조합 DNA'}[artId]||'조사 대상'}</span></div>`;body=body.replace(/<div class="inspect-visual">[\s\S]*?<\/div>/g,'');$('#modal-content').innerHTML=`<span class="zoom-label">${utility?'BIO CASEFILES / 현장 안내':'OBJECT INSPECTION / 확대 조사'}</span><h2>${title}</h2>${utility?'':picture}<div class="inspection-copy">${body}</div><div class="item-actions">${actions.map((a,i)=>`<button id="action-${i}" class="${i===0?'primary':''}">${a[0]}</button>`).join('')}</div>`;if(!$('#modal').open)$('#modal').showModal();lookHelp();actions.forEach((a,i)=>$('#action-'+i).onclick=a[1]);}
function openNotes(tab='suspects'){releaseControls();if(!$('#notebook').open)$('#notebook').showModal();lookHelp();window.dispatchEvent(new CustomEvent('open-notebook',{detail:tab}))}
$('#open-notes').onclick=()=>openNotes('report');$('#open-dossiers').onclick=()=>openNotes('suspects');$('#open-board').onclick=()=>openNotes('board');$('#return-room').onclick=()=>{$('#notebook').close();};$('#world-help').onclick=()=>modal('물건을 관찰하고, 도구를 사용하세요.','<p>방 안의 물건을 누르면 카메라가 가까이 이동합니다. 정리 서랍·소모품 서랍·K-2 상자와 주변 장비를 조사하세요. 좌우 화살표로 방을 다른 각도에서 볼 수 있습니다.</p><p>획득한 도구는 아래 도구함에서 선택한 뒤 대상 물건을 누르면 사용합니다. 장비함에서 정밀감식을 요청하고 채취 시료를 추출·증폭·분석할 수 있습니다. 수사 노트에는 용어 사전·용의자 진술·보고서가 있습니다.</p><p>진행은 브라우저에 저장됩니다. 교실에서의 45분 난이도는 아직 검증 전입니다.</p>');
const scene=new T.Scene();scene.background=new T.Color('#101e25');scene.fog=new T.Fog('#101e25',20,42);
const camera=new T.PerspectiveCamera(39,1,.1,70);camera.position.set(11,10,13);const renderer=new T.WebGLRenderer({antialias:true,alpha:false});renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;renderer.shadowMap.autoUpdate=false;renderer.shadowMap.needsUpdate=true;renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=prefs.brightness/100;$('#viewport').appendChild(renderer.domElement);
scene.add(new T.HemisphereLight(0x8eb5cd,0x172329,.9));const sun=new T.DirectionalLight(0xa4c8d4,1.15);sun.position.set(-3,10,6);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);Object.assign(sun.shadow.camera,{left:-10,right:10,top:10,bottom:-10});sun.shadow.bias=-.001;scene.add(sun);
const mats={};function mat(c,metal=0){const k=c+metal;return mats[k]??=new T.MeshStandardMaterial({color:c,roughness:metal?.35:.78,metalness:metal})}
function box(x,y,z,w,h,d,c,parent=scene){const m=new T.Mesh(new T.BoxGeometry(w,h,d),mat(c));m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m}
function cyl(x,y,z,r,h,c,parent=scene){const m=new T.Mesh(new T.CylinderGeometry(r,r,h,24),mat(c));m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m}
function text(label,x,y,z,w=1.8,h=.5){const c=document.createElement('canvas');c.width=512;c.height=128;const ct=c.getContext('2d');ct.fillStyle='#132c29';ct.fillRect(0,0,512,128);ct.fillStyle='#cedec3';ct.font='bold 45px sans-serif';ct.textAlign='center';ct.textBaseline='middle';ct.fillText(label,256,64);const m=new T.Mesh(new T.PlaneGeometry(w,h),new T.MeshBasicMaterial({map:new T.CanvasTexture(c)}));m.position.set(x,y,z);scene.add(m);return m}
function object(name,x,y,z,fn){const g=new T.Group();g.position.set(x,y,z);g.userData={name,fn};scene.add(g);clicks.push(g);return g}
let forensic;
const {drawer,notebook,culture,pcr,cabinet,cabinetDoor,terminal,sequencer,firstWalls,exitDoor}=buildInvestigationRoom({scene,renderer,object,leave:()=>showHub(),actions:{drawer:inspectDrawer,notebook:inspectNotebook,culture:inspectCulture,pcr:inspectPcr,cabinet:inspectCabinet,terminal:inspectTerminal,sequencer:inspectSequence}});
if(done('cabinet'))cabinetDoor.rotation.y=-1.05;
function inspectNotebook(){evidence(['log']);mark('notebook');modal('접힌 실험 노트','<div class="inspect-visual">▤</div><p>실험대 D-4의 재조합 작업 기록. 시료 취급 내역과 실험 절차를 검토할 수 있습니다.</p><p>새봄-7 재조합 기록: 제한효소로 DNA를 자르고, 연결효소로 연결했다. 플라스미드는 유전자 운반체로 사용했다. 식물체 재생은 별도 단계다.</p>',[['재조합 작업 기록 복원',()=>recombine(0)]]);}
function recombine(stage){const steps=[['제한효소로 목표 DNA 자르기','연결효소로 목표 DNA 자르기'],['제한효소로 플라스미드 자르기','PEG로 플라스미드 자르기'],['연결효소로 목표 DNA와 플라스미드 연결','셀룰레이스로 DNA 연결']];if(stage===3){mark('recomb');evidence(['log'],['recomb']);return modal('재조합 DNA 완성','<div class="inspect-visual">⊕</div><p>목표 DNA를 플라스미드에 연결했습니다. 이후 세포 도입과 선별·배양 단계가 필요합니다. 이 기록만으로 연구원을 범인으로 지목할 수 없습니다.</p>')}modal('재조합 기록 복원 · '+(stage+1)+'/3','<div class="inspect-visual">'+['〰　◯','✂　◯','〰 → ◯'][stage]+'</div><p>현재 단계에 필요한 도구와 작업을 선택하세요.</p>',steps[stage].map((t,i)=>[t,()=>i===0?recombine(stage+1):noteModal('도구의 역할을 확인하세요. 제한효소는 자르고, 연결효소는 연결합니다.')]));}
function inspectDrawer(){mark('drawer');if(!has('card'))collect('card');modal('현장 수사 장비함','<p>기록 열람 카드를 확보했습니다. 현장 물건에서 발견한 흔적을 근거로 지원을 요청할 수 있습니다.</p>',[['정밀감식 지원 요청·장비 수령',()=>forensic.support()],['채취 시료 DNA 추출대',()=>forensic.samples('extract')]]);}

function noteModal(t){let p=$('#world-notice');if(!p){p=document.createElement('p');p.id='world-notice';p.className='world-notice';$('#modal-content').appendChild(p)}p.textContent=t}
function inspectCabinet(){mark('cabinet');cabinetDoor.rotation.y=-1.05;if(!has('sample')){collect('sample');evidence(['culture']);}modal('시료 보관함 · B-12','<p>현장 보존 처리된 보관함입니다. 남겨진 배양병 B-12에서 사전 채취한 DNA 추출 시료를 확보했습니다. 표지에는 새봄-7이라고 적혀 있습니다.</p>');}
let order=[];function inspectCulture(){evidence(['culture']);modal('배양병 B-12 관찰','<p>새봄-7 표지가 붙은 병 안에 작은 식물체가 있다. 외형과 표지만으로 계통을 확인할 수 없다. 보관함에 준비된 B-12 추출 시료를 검사할 수 있다.</p><p>이 연구소는 캘러스를 거치는 조직 배양으로 식물체를 재생한다. 제작 과정은 수첩의 학습 참고에서도 확인할 수 있다.</p>',[['배양 과정 복원 연습 · 선택',()=>{order=[];culturePanel()}]]);}

function culturePanel(){const choices=['식물체 재생','생장점 채취','체세포 분열·캘러스 형성','무균 배지 배양'];modal('배양 기록의 순서를 복원하세요','<div class="inspect-visual">❧</div><p>공정 기록이 뒤섞였습니다. 카드를 실제 과정 순서대로 누르세요.</p><div class="sequence-slots">'+choices.map((c,i)=>`<button id="step-${i}" ${order.includes(i)?'disabled':''}>${order.includes(i)?(order.indexOf(i)+1)+' / ':''}${c}</button>`).join('')+'</div>',[['순서 다시 놓기',()=>{order=[];culturePanel()}]]);choices.forEach((_,i)=>$('#step-'+i).onclick=()=>{order.push(i);if(order.length===4){if(order.join()==='1,3,2,0'){mark('culture');evidence(['culture'],['culture']);modal('배양 공정이 복원됐다','<div class="inspect-visual">❧</div><p>체세포 분열을 이용해 식물을 증식합니다. 생장점 배양은 바이러스 감염이 적은 조직을 이용하지만 무감염을 보장하지 않으므로 검사가 필요합니다.</p>')}else{order=[];culturePanel();noteModal('순서가 맞지 않습니다. 조직을 채취한 다음 어디에 놓아야 할까요?')}}else culturePanel()})}
function inspectPcr(){modal('PCR 장비 · 시료 선택','<p>추출한 DNA에서 표적 구간을 증폭합니다. 이 장비는 염기 순서를 읽지 않습니다.</p>',[['현장에서 채취한 H-1 / P-1',()=>forensic.samples('pcr')],['남은 배양병 B-12',legacyPcr]]);}
function legacyPcr(){
 if(done('pcr'))return modal('B-12 증폭 완료','<p>도구함에서 증폭 DNA를 선택한 뒤 별도 염기서열 분석기에 넣으세요.</p>');
 if(s.selected!=='sample')return modal('PCR 장비 · 시료 확인','<p>B-12 DNA 추출 시료를 도구함에서 선택하세요. 프라이머·효소·음성 대조는 분석실에서 준비했습니다.</p>');
 modal('B-12 · PCR 준비','<p>선택한 시료: B-12 추출 DNA. 식물 계통 비교용 표적을 증폭합니다.</p><div class="data">가닥 분리 → 프라이머 결합 → 새 가닥 합성\n사이클 반복 → 증폭 산물 회수</div><p>실제 실험 시간을 압축한 교육용 절차입니다. 증폭 후에도 염기 순서는 아직 알 수 없습니다.</p>',[['표준 프로토콜로 증폭·산물 회수',()=>{mark('pcr');collect('amp');modal('B-12 증폭 산물 회수','<p>증폭 DNA를 개별 튜브로 회수했습니다. 도구함에서 선택하고 별도의 염기서열 분석기로 이동하세요.</p>')}]]);
}

function inspectSequence(){modal('염기서열 분석기 · 시료 선택','<p>PCR 증폭과 별도의 분석 단계입니다.</p>',[['현장 시료 H-1 / P-1 분석',()=>forensic.samples('sequence')],['남은 배양병 B-12 분석',legacySequence]]);}
function legacySequence(){if(done('sequence'))return sequenceResult();if(s.selected!=='amp')return modal('염기서열 분석기','<div class="inspect-visual">≋</div><p>PCR로 증폭한 DNA가 필요합니다. 증폭 DNA를 도구함에서 선택한 뒤 다시 누르세요.</p>');modal('염기서열 분석 준비','<div class="inspect-visual">≋</div><p>별도의 분석으로 표적 구간의 염기 순서를 읽습니다. 시퀀싱 반응 등 실제 준비 과정은 수업용으로 생략합니다.</p>',[['분석 실행',()=>{mark('sequence');evidence(['analysis']);sequenceResult()}]]);}
function sequenceResult(){modal('B-12 염기서열 결과','<div class="data">새봄-7 기준   ACGTACGA\n남은 병 B-12  ACGTTCGA\n대조 계통     ACGTTCGA</div><p>검사 원문을 수첩에 저장했습니다. K-2에서 채취한 식물 조직의 결과와 대조하세요. 이 결과만으로 사람을 식별할 수는 없습니다.</p>',[['흔적 연결도 열기',()=>{$('#modal').close();openNotes('board')}]]);}

function inspectTerminal(){if(s.selected!=='card'&&!done('terminal'))return modal('출입 단말 · 인증 필요','<p>직원 카드를 선택한 뒤 단말을 조사하세요.</p>');mark('terminal');evidence(['access','receipt']);modal('출입·운반 업무 기록','<p>08:30 세척 후 네 사람 모두 정상 업무로 출입했습니다. 시간표만으로 시료를 반출한 사람을 정할 수 없습니다.</p><div class="data">강서윤 08:40 입실 / 08:48 퇴실\n민도현 08:45 입실 / 08:54 퇴실\n윤하린 08:50 입실 / 08:57 퇴실\n백지우 08:55 입실 / 09:02 퇴실</div><p>K-2는 민도현에게 배정된 공용 운반 상자입니다. 08:30 빈 내부가 촬영됐고 08:35 정상 시료가 확인됐습니다. 연구원들은 상자 주변에 업무상 접근할 수 있었습니다. 사용 배정만으로 범행을 입증할 수 없습니다.</p>',[['수첩에서 현장 흔적과 비교',()=>{$('#modal').close();openNotes('board')}]]);}

const ray=new T.Raycaster(),pointer=new T.Vector2();let hovered=null;function hit(e){camera.updateMatrixWorld(true);const r=renderer.domElement.getBoundingClientRect();pointer.set((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1);ray.setFromCamera(pointer,camera);const hits=ray.intersectObjects(firstPerson?scene.children:clicks,true);if(firstPerson&&hits[0]?.distance>3.2)return null;if(!hits.length)return null;let o=hits[0].object;while(o&&!o.userData.fn)o=o.parent;return o}
function inspectObject(o){if(fieldMenu||!o||$('#modal').open||$('#notebook').open||$('#game').hidden)return;activeInspect=o.userData.id;if(!firstPerson)zoom={at:o.position.clone()};$('#cross-label').style.display='none';o.userData.fn()}
function centerObject(){const r=renderer.domElement.getBoundingClientRect();return hit({clientX:r.left+r.width/2,clientY:r.top+r.height/2})}
function lookBy(dx,dy){player.yaw-=dx*.002*(prefs.sensitivity/100);player.pitch=Math.max(-1.15,Math.min(1.15,player.pitch-dy*.002*(prefs.sensitivity/100)));forceRender=true;}
function canLook(){return firstPerson&&!fieldMenu&&!$('#modal').open&&!$('#notebook').open&&!$('#game').hidden;}
let lockPending=false,lockFailure='';
function hasFpsCapture(){return document.pointerLockElement===renderer.domElement||document.pointerLockElement===document.body}
async function startFpsLook(mode=prefs.captureMode||'standard'){
 const status=message=>{const node=$('#fps-click-status');if(node)node.textContent=message};
 if(hasFpsCapture()){status('마우스가 연결되었습니다. 조사 화면으로 돌아갑니다.');lookHelp();return}
 if(!canLook()){status('다른 조사 화면이 열려 있어 시작할 수 없습니다. 해당 화면을 닫고 다시 시도해 주세요.');return}
 if(!desktopPointer()){status('마우스가 감지되지 않았습니다.');return}
 if(lockPending){status('마우스 연결 응답을 기다리고 있습니다.');return}
 lockPending=true;pointerLockUnavailable=false;lockFailure='';
 let cleanup=()=>{};
 try{
  status('마우스 고정을 요청하는 중입니다…');lookHelp();
  const target=mode==='standard'?renderer.domElement:document.body;target.tabIndex=-1;
  await requestFpsCapture(target,{fullscreen:mode==='fullscreen',raw:mode==='raw'});
  prefs.captureMode=mode;localStorage.setItem('bio-display-v1',JSON.stringify(prefs));
 }catch(error){pointerLockUnavailable=true;lockFailure=error.name==='SecurityError'?'이 화면의 보안 설정이 마우스 고정을 차단했습니다.':error.name==='NotAllowedError'?'브라우저가 마우스 고정을 허용하지 않았습니다.':error.message||'마우스 고정을 시작하지 못했습니다.'}
 finally{cleanup();lockPending=false;status(pointerLockUnavailable?lockFailure:'마우스가 연결되었습니다.');lookHelp()}
}
function lookHelp(){
 const locked=hasFpsCapture();
 const gate=$('#fps-lock-gate');
 $('#game').classList.toggle('fps-locked',firstPerson&&locked);
 if(gate){
  gate.hidden=!firstPerson||!desktopPointer()||locked||fieldMenu||$('#modal').open||$('#notebook').open;
  if(gate.showPopover&&gate.hasAttribute('popover')){
   try{if(gate.hidden){if(gate.matches(':popover-open'))gate.hidePopover()}else if(!gate.matches(':popover-open'))gate.showPopover()}
   catch{gate.removeAttribute('popover')}
  }
  $('#fps-start').disabled=lockPending;$('#fps-start').textContent=lockPending?'마우스 연결 중…':pointerLockUnavailable?'마우스 고정 다시 시도':'FPS 시선 시작';
  $('#fps-lock-title').textContent=pointerLockUnavailable?'이 화면에서 FPS 마우스 고정을 사용할 수 없습니다':'FPS 시선 조작';
  $('#fps-lock-description').textContent=pointerLockUnavailable?lockFailure+' 아래의 다른 연결 방식이나 독립 FPS 화면에서 다시 시도할 수 있습니다. 모두 실패하면 이 실행 환경에서 상대 마우스 입력을 제공하지 못하는 상태입니다.':'시작하면 커서가 사라지고 마우스 이동량에 따라 시선이 회전합니다. Esc를 누르면 해제됩니다.';
  $('#fps-external').hidden=!pointerLockUnavailable;$('#fps-address').hidden=!pointerLockUnavailable;$('#fps-back').hidden=!pointerLockUnavailable;
 }
 $('.fp-instructions').textContent=!desktopPointer()?'방향 버튼: 이동 · 화면 드래그: 시선 · 조사 버튼':locked?'마우스: 시선 · WASD: 이동 · E/클릭: 조사 · N: 수첩 · I: 메뉴 · Esc: 해제':'FPS 시선 일시 정지 · 시작 버튼으로 재개';
 renderer.domElement.style.cursor=locked?'none':'default';
}
renderer.domElement.addEventListener('pointermove',e=>{
 if(firstPerson){
  if(canLook()&&drag&&drag.id===e.pointerId&&!hasFpsCapture()){
   const dx=e.clientX-drag.x,dy=e.clientY-drag.y;drag.total+=Math.abs(dx)+Math.abs(dy);lookBy(dx,dy);drag.x=e.clientX;drag.y=e.clientY;
  }return;
 }
 hovered=hit(e);renderer.domElement.style.cursor=hovered?'pointer':'grab';
 const label=$('#cross-label');label.style.display=hovered?'block':'none';
 if(hovered){label.textContent=hovered.userData.name;label.style.left=Math.min(e.clientX+15,innerWidth-220)+'px';label.style.top=(e.clientY-40)+'px'}
});
document.addEventListener('mousemove',e=>{if(canLook()&&hasFpsCapture())lookBy(e.movementX,e.movementY)});
renderer.domElement.addEventListener('pointerdown',e=>{
 if(canLook()&&!hasFpsCapture()&&!desktopPointer()){
  drag={id:e.pointerId,x:e.clientX,y:e.clientY,total:0};renderer.domElement.setPointerCapture(e.pointerId);
 }
});
renderer.domElement.addEventListener('pointerup',e=>{if(drag?.id===e.pointerId){suppressClick=drag.total>6;drag=null}});
renderer.domElement.addEventListener('pointercancel',releaseControls);
renderer.domElement.addEventListener('click',async e=>{
 if(fieldMenu)return;if(suppressClick){suppressClick=false;return}
 if(firstPerson&&desktopPointer()&&!hasFpsCapture()){
  await startFpsLook();
  return;
 }
 inspectObject(firstPerson?centerObject():hit(e));
});
$('#turn-left').onclick=()=>{if(firstPerson){player.yaw+=.35;forceRender=true;return}targetAngle=Math.max(-.55,targetAngle-.35);zoom=null};$('#turn-right').onclick=()=>{if(firstPerson){player.yaw-=.35;forceRender=true;return}targetAngle=Math.min(.55,targetAngle+.35);zoom=null};$('#close').addEventListener('click',()=>zoom=null);$('#modal').addEventListener('close',()=>zoom=null);
forensic=createForensicField({scene,object,box,cyl,modal,save,mark,done,collect,has,selected:()=>s.selected,evidence,redraw:()=>{renderer.shadowMap.needsUpdate=true;forceRender=true}});
const objectIds=['drawer','notebook','culture','pcr','cabinet','terminal','sequencer'];
clicks.forEach((o,i)=>{o.userData.id??=objectIds[i];const bounds=new T.Box3().setFromObject(o);o.userData.anchor=bounds.getCenter(new T.Vector3());o.userData.anchor.y=bounds.max.y+.1});
const markerLayer=document.createElement('div');markerLayer.id='object-markers';$('#viewport').appendChild(markerLayer);const leaderLayer=document.createElementNS('http://www.w3.org/2000/svg','svg');leaderLayer.id='marker-leaders';$('#viewport').appendChild(leaderLayer);
const markerNames={amp:'PCR 증폭 DNA',drawerOpen:'서랍 내부 · 열쇠와 직원 카드',cabinetOpen:'보관함 내부 · B-12 시료',notebook:'실험 노트',drawer:'수사 장비함',culture:'배양병',pcr:'PCR 장비',cabinet:'시료 보관함',terminal:'출입 단말',sequencer:'서열 분석기'};
clicks.forEach(o=>{const b=document.createElement('button');b.className='object-marker';b.dataset.object=o.userData.id;b.innerHTML=`<span class="marker-dot">＋</span><span>${markerNames[o.userData.id]||o.userData.name}</span>`;b.onclick=()=>inspectObject(o);markerLayer.appendChild(b);o.userData.marker=b;const line=document.createElementNS('http://www.w3.org/2000/svg','line');leaderLayer.appendChild(line);o.userData.line=line});
let forceRender=true,flashUntil=0;
$('#locate-goal').onclick=()=>openNotes('board');
$('#settings-button').onclick=()=>{modal('화면 설정','<p>어두운 현장에서도 소품과 글자를 구분할 수 있도록 조절하세요. 밝기는 방의 조명에만 적용됩니다.</p><label for="brightness">현장 밝기 <output id="brightness-value">'+prefs.brightness+'%</output></label><input id="brightness" type="range" min="60" max="180" step="5" value="'+prefs.brightness+'"><div class="brightness-samples"><span>어둡게</span><span>기본 100%</span><span>밝게</span></div><label class="toggle-label"><input id="show-labels" type="checkbox" '+(prefs.labels?'checked':'')+'> 오브젝트 이름 표시</label><p class="world-notice">이 기기에서 설정이 자동 저장됩니다. 이름표를 꺼도 물건을 직접 눌러 조사할 수 있습니다.</p>',[['기본 밝기로 복원',()=>{prefs.brightness=100;$('#brightness').value=100;applySettings();$('#brightness-value').textContent='100%'}]]);$('#brightness').oninput=e=>{prefs.brightness=Number(e.target.value);$('#brightness-value').textContent=prefs.brightness+'%';applySettings()};$('#show-labels').onchange=e=>{prefs.labels=e.target.checked;applySettings()};};
function applySettings(){localStorage.setItem('bio-display-v1',JSON.stringify(prefs));renderer.toneMappingExposure=prefs.brightness/100;forceRender=true}
function positionMarkers(){const w=$('#viewport').clientWidth,h=$('#viewport').clientHeight;const visible=!$('#modal').open&&!$('#notebook').open&&!firstPerson;markerLayer.style.visibility=leaderLayer.style.visibility=visible?'visible':'hidden';if(!visible)return;const current=null;const toolTarget=null;const positioned=clicks.map(o=>{const v=o.userData.anchor.clone().project(camera);return{o,x:(v.x+1)*w/2,y:(1-v.y)*h/2}}).sort((a,b)=>a.y-b.y);let occupied=[];for(const p of positioned){const {o}=p,b=o.userData.marker,isCurrent=o.userData.id===current;b.hidden=!prefs.labels&&!isCurrent&&o.userData.id!==toolTarget;o.userData.line.style.display=b.hidden?'none':'';b.classList.toggle('recommended',isCurrent);b.classList.toggle('tool-target',o.userData.id===toolTarget);b.classList.toggle('locate-pulse',isCurrent&&performance.now()<flashUntil);const width=b.offsetWidth||115,height=32;let x=Math.max(6,Math.min(w-width-6,p.x-width/2)),y=Math.max(8,Math.min(h-height-8,p.y-40));for(let pass=0;pass<8;pass++){const clash=occupied.find(r=>x<r.x+r.w+6&&x+width+6>r.x&&y<r.y+r.h+6&&y+height+6>r.y);if(!clash)break;y=clash.y+clash.h+9;if(y>h-height-8){y=Math.max(8,clash.y-height-9);x=Math.min(w-width-6,x+width/2)}}occupied.push({x,y,w:width,h:height});b.style.left=x+'px';b.style.top=y+'px';const l=o.userData.line;l.setAttribute('x1',x+width/2);l.setAttribute('y1',y+height);l.setAttribute('x2',p.x);l.setAttribute('y2',p.y);l.setAttribute('class',isCurrent?'active':'');}}
function resize(){const w=$('#viewport').clientWidth,h=$('#viewport').clientHeight;if(!w||!h)return;renderer.setSize(w,h);renderer.shadowMap.needsUpdate=true;forceRender=true;camera.aspect=w/h;camera.updateProjectionMatrix()}window.addEventListener('resize',resize);resize();
const torch=new T.PointLight('#c1d8cf',0,6);scene.add(torch);
const fpHud=document.createElement('div');fpHud.id='fp-hud';fpHud.hidden=true;fpHud.innerHTML='<div class="fp-reticle" aria-hidden="true">＋</div><div id="fp-target" role="status"></div><div class="fp-controls"><div class="fp-move"><button data-move="forward" aria-label="앞으로 이동">↑</button><button data-move="left" aria-label="왼쪽으로 이동">←</button><button data-move="back" aria-label="뒤로 이동">↓</button><button data-move="right" aria-label="오른쪽으로 이동">→</button></div><button id="fp-interact" disabled>대상 없음</button><button id="fp-reset">입구로 돌아가기</button></div><div id="field-zone">배양실 · 중앙 통로</div><p class="fp-instructions">WASD / 방향키 이동 · 화면 안에서 마우스로 시선 · E / 클릭 조사</p>';$('#viewport').appendChild(fpHud);
function togglePerspective(){releaseControls();firstPerson=!firstPerson;zoom=null;suppressClick=false;if(firstPerson){player.yaw=START.yaw;player.pitch=START.pitch;syncFirstPersonCamera();}firstWalls.visible=firstPerson;renderer.shadowMap.needsUpdate=true;torch.intensity=firstPerson?3:0;camera.fov=firstPerson?67:39;camera.updateProjectionMatrix();fpHud.hidden=!firstPerson;$('.fp-instructions').textContent=desktopPointer()?'화면 클릭: 마우스 고정 · 마우스: 시선 · WASD: 이동 · E/클릭: 조사 · Esc: 해제':'방향 버튼 이동 · 화면 드래그로 시선 · 조사 버튼';$('#game').classList.toggle('first-person',firstPerson);$('#perspective-toggle').textContent=firstPerson?'전체 보기':'1인칭으로 보기';$('#view-name').textContent=firstPerson?'1인칭 수사':'배양실';$('#cross-label').style.display='none';if(firstPerson)lookHelp();forceRender=true;note(firstPerson&&desktopPointer()?'FPS 마우스 고정을 요청했습니다. 마우스로 시선을 조작하고 Esc로 해제하세요.':firstPerson?'화면을 드래그해 둘러보세요.':'전체 보기로 전환했습니다.');}
$('#perspective-toggle').onclick=()=>{togglePerspective();if(firstPerson)startFpsLook()};
$('#fp-reset').onclick=()=>{releaseControls();Object.assign(player,START);forceRender=true};
$('#fp-interact').onclick=()=>inspectObject(centerObject());
for(const b of document.querySelectorAll('[data-move]')){b.onpointerdown=e=>{e.preventDefault();held.add(b.dataset.move);b.setPointerCapture(e.pointerId)};for(const type of ['pointerup','pointercancel','lostpointercapture'])b.addEventListener(type,()=>held.delete(b.dataset.move));}
const keyMap={KeyW:'forward',ArrowUp:'forward',KeyS:'back',ArrowDown:'back',KeyA:'left',ArrowLeft:'left',KeyD:'right',ArrowRight:'right'};
window.addEventListener('keydown',e=>{if(!firstPerson||$('#game').hidden||$('#modal').open||$('#notebook').open||/INPUT|TEXTAREA|SELECT/.test(e.target.tagName)&&e.target!==document.body)return;if(e.code==='Escape'){releaseControls();return}if(fieldMenu)return;if(keyMap[e.code]&&(!desktopPointer()||hasFpsCapture())){e.preventDefault();held.add(keyMap[e.code])}if(e.code==='KeyE'&&!e.repeat&&(!desktopPointer()||hasFpsCapture())){e.preventDefault();inspectObject(centerObject())}});
document.addEventListener('pointerlockchange',()=>{releaseDrag();if(firstPerson)lookHelp()});
function releaseDrag(){fallbackPointer=null;drag=null;held.clear();}
document.addEventListener('pointerlockerror',()=>{pointerLockUnavailable=true;releaseDrag();if(firstPerson)lookHelp()});
document.addEventListener('fullscreenchange',()=>{releaseDrag();resize()});
new ResizeObserver(()=>{releaseDrag();resize()}).observe($('#viewport'));
window.addEventListener('keyup',e=>{if(keyMap[e.code])held.delete(keyMap[e.code])});window.addEventListener('blur',releaseControls);document.addEventListener('visibilitychange',()=>{if(document.hidden)releaseControls()});
function syncFirstPersonCamera(){camera.position.set(player.x,1.7,player.z);camera.rotation.order='YXZ';camera.rotation.set(player.pitch,player.yaw,0);camera.updateMatrixWorld(true);torch.position.copy(camera.position);}
const feedback=createInteractionFeedback({scene,objects:[...clicks,exitDoor],container:$('#viewport')});
const target=new T.Vector3(0,1,0);function frame(now=0){requestAnimationFrame(frame);const dt=Math.min(.05,Math.max(0,(now-lastFrame)/1000));lastFrame=now;if($('#game').hidden)return;if(firstPerson){if(!$('#modal').open&&!$('#notebook').open&&!fieldMenu&&(!desktopPointer()||hasFpsCapture())){const oldX=player.x,oldZ=player.z;movePlayer(player,Number(held.has('forward'))-Number(held.has('back')),Number(held.has('right'))-Number(held.has('left')),dt);if(player.x!==oldX||player.z!==oldZ)forceRender=true}syncFirstPersonCamera();$('#field-zone').textContent=player.z>4.5?'출입구 · 출입 기록':player.x<-2?(player.z>1?'수사 장비':'현장 증거 · 시료 보관'):player.x>2?'DNA 증폭 · 염기서열 분석':'배양실 · 중앙 통로';const interactionEnabled=!$('#modal').open&&!$('#notebook').open&&!fieldMenu;const o=interactionEnabled?centerObject():null;forceRender=feedback.update(camera,o,interactionEnabled,prefs.labels)||forceRender;$('.fp-reticle').classList.toggle('can-interact',!!o);$('#fp-target').textContent=o?o.userData.name+' · E '+(o===exitDoor?'나가기':'조사하기'):'';$('#fp-interact').textContent=o?.userData.id==='exit'?'복도로 나가기 · E':o?'조사하기 · E':'가까이 다가가세요';$('#fp-interact').disabled=!o;positionMarkers();if(forceRender||renderer.shadowMap.needsUpdate){renderer.render(scene,camera);forceRender=false}return;}angle+=(targetAngle-angle)*.045;const radius=Math.max(17,18/Math.max(.4,camera.aspect));let desired=new T.Vector3(Math.sin(.65+angle)*radius,radius*.66,Math.cos(.65+angle)*radius);let look=new T.Vector3(0,.8,0);if(zoom){look=zoom.at.clone();desired=look.clone().add(new T.Vector3(5,4,7))}camera.position.lerp(desired,.045);target.lerp(look,.055);camera.lookAt(target);positionMarkers();if(forceRender||camera.position.distanceTo(desired)>.002||target.distanceTo(look)>.002||renderer.shadowMap.needsUpdate){renderer.render(scene,camera);forceRender=false}}frame();save();$('#world-loading').remove();
// Restore evidence to the notebook when revisiting the room.
forensic.restore();
if(done('notebook'))evidence(['log']);if(done('recomb'))evidence([],['recomb']);if(has('sample'))evidence(['culture']);if(done('culture'))evidence([],['culture']);if(done('sequence'))evidence(['analysis']);if(done('interpret'))evidence([],['dna']);if(done('terminal'))evidence(['access','receipt']);

window.addEventListener('reset-world',()=>{s={items:[],done:[],selected:null};forensic.restore();drawer.position.z=3;cabinetDoor.rotation.y=0;renderer.shadowMap.needsUpdate=true;save();Object.assign(player,START);releaseControls();forceRender=true;note('새 수사를 시작합니다.')});


// The map is the entry point; the investigation fills the page only on entry.
function closeFieldMenu(){fieldMenu=false;$('#game').classList.remove('field-menu');}
function showHub(){feedback.hide();releaseControls();closeFieldMenu();if(firstPerson)togglePerspective();$('#game').classList.add('hub-mode');window.dispatchEvent(new Event('leave-crime-scene'));lookHelp();resize();}
function enterField(){Object.assign(player,START);closeFieldMenu();$('#game').classList.remove('hub-mode');if(!firstPerson)togglePerspective();resize();forceRender=true;startFpsLook();}
function toggleFieldMenu(){releaseControls();fieldMenu=!fieldMenu;$('#game').classList.toggle('field-menu',fieldMenu);lookHelp();if(!fieldMenu)startFpsLook();}
const fieldBar=document.createElement('div');fieldBar.className='field-bar';fieldBar.innerHTML='<span class="field-exit-hint">나가기: 뒤쪽 출입문 · E</span><span>배양실 02 · 현장 조사</span><button id="field-notes">수첩 [N]</button><button id="field-menu">도구·자료 [I]</button>';$('#game').appendChild(fieldBar);
$('#field-notes').onclick=()=>openNotes('board');$('#field-menu').onclick=toggleFieldMenu;
function labMenu(){modal('분석실 · 검사 장비','<p>현장에서 확보한 시료를 검사합니다. 시료 튜브와 증폭 DNA는 아래 버튼에서 장비에 넣을 수 있습니다.</p>',[['시료를 PCR 장비에 넣기',()=>{s.selected=has('sample')?'sample':null;save();inspectPcr()}],['증폭 DNA를 서열 분석기에 넣기',()=>{s.selected=has('amp')?'amp':null;save();inspectSequence()}],['확보한 검사 기록',()=>{$('#modal').close();openNotes('board')}]]);}
$('#game').appendChild(createHub({enter:enterField,notes:openNotes,lab:labMenu,settings:()=>$('#settings-button').click(),observe:(title,body)=>modal('물건을 관찰 · '+title,'<p>'+body+'</p>'),inventory:()=>modal('물건을 관찰 · 도구함','<p>도구를 선택한 다음 현장 장비를 조사하세요.</p>',Object.keys(itemInfo).filter(has).map(id=>[itemInfo[id][0],()=>{s.selected=id;save();$('#modal').close();}])),investigate:id=>({culture:inspectCulture,notebook:inspectNotebook,pcr:inspectPcr,sequencer:inspectSequence,cabinet:inspectCabinet,drawer:inspectDrawer,terminal:inspectTerminal}[id]?.())}));
window.addEventListener('keydown',e=>{if(!firstPerson||$('#game').hidden||$('#modal').open||$('#notebook').open||/INPUT|TEXTAREA|SELECT/.test(e.target.tagName)||e.repeat)return;if(e.code==='KeyI'){e.preventDefault();toggleFieldMenu();}else if(e.code==='Escape'&&fieldMenu){e.preventDefault();closeFieldMenu();}});
showHub();

// A native dialog keeps focus inside the notebook and the scene visible behind it.
$('#notebook').addEventListener('close',lookHelp);
$('#return-room').addEventListener('click',()=>startFpsLook());
$('#close').addEventListener('click',()=>startFpsLook());
$('#modal').addEventListener('close',lookHelp);
window.addEventListener('keydown',e=>{
 if(e.code!=='KeyN'||e.repeat||$('#modal').open||/INPUT|TEXTAREA|SELECT/.test(e.target.tagName)||e.target.isContentEditable)return;
 e.preventDefault();
 if($('#notebook').open){$('#notebook').close();startFpsLook()}else openNotes('board');
});

const lockGate=document.createElement('div');lockGate.id='fps-lock-gate';lockGate.hidden=true;lockGate.setAttribute('popover','manual');
lockGate.innerHTML='<div class="fps-lock-card"><small class="fps-control-version">시선 제어 v11</small><h2 id="fps-lock-title">FPS 시선 조작</h2><p id="fps-click-status" role="status" aria-live="polite"></p><p id="fps-lock-description"></p><button id="fps-start" class="primary">FPS 시선 시작</button><div class="fps-alternatives"><button id="fps-body">화면 전체에 마우스 연결</button><button id="fps-fullscreen">전체화면으로 시작</button><button id="fps-raw">원시 마우스 입력으로 시작</button><a href="./fps-check.html" target="_blank" rel="noopener">독립 FPS 화면 실행 ↗</a></div><a id="fps-external" href="https://siballllllll.github.io/Crime/" target="_blank" rel="noopener" hidden>게임 주소 열기 ↗</a><input id="fps-address" aria-label="외부 브라우저에서 열 게임 주소" readonly value="https://siballllllll.github.io/Crime/?v=fps-retry-8" hidden><label for="fps-sensitivity">마우스 감도 <output id="fps-sensitivity-value"></output></label><input id="fps-sensitivity" type="range" min="25" max="200" step="5"><button id="fps-back">연구소 지도로 돌아가기</button></div>';
document.body.appendChild(lockGate);
$('#fps-start').onclick=()=>{
 $('#fps-click-status').textContent='시작 버튼 입력을 받았습니다.';
 if(!firstPerson){$('#fps-click-status').textContent='현장 입장이 해제되었습니다. 복도로 돌아가 다시 입장해 주세요.';return}
 if(!desktopPointer()){$('#fps-click-status').textContent='이 브라우저는 마우스 대신 터치 기기로 인식되고 있습니다.';return}
 if($('#modal').open||$('#notebook').open){$('#fps-click-status').textContent='열려 있는 조사 창을 먼저 닫아 주세요.';return}
 if(fieldMenu)closeFieldMenu();
 if(lockPending){$('#fps-click-status').textContent='마우스 연결 응답을 기다리고 있습니다.';return}
 startFpsLook().catch(error=>{$('#fps-click-status').textContent='시선 시작 중 오류가 발생했습니다: '+error.message;lockPending=false;$('#fps-start').disabled=false});
};$('#fps-back').onclick=showHub;
$('#fps-sensitivity').value=prefs.sensitivity;$('#fps-sensitivity-value').textContent=prefs.sensitivity+'%';
$('#fps-sensitivity').oninput=e=>{prefs.sensitivity=Number(e.target.value);$('#fps-sensitivity-value').textContent=prefs.sensitivity+'%';localStorage.setItem('bio-display-v1',JSON.stringify(prefs))};

for(const [id,mode] of [['fps-body','body'],['fps-fullscreen','fullscreen'],['fps-raw','raw']])$('#'+id).onclick=()=>startFpsLook(mode);
