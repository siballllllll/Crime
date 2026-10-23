import * as T from './vendor/three.module.js';
import {forensicClues} from './forensic-case.js?v=1';
// One state machine serves scene actions, inventory, lab stages and saved progress.
export function createForensicField({scene,object,box,cyl,modal,save,mark,done,collect,has,selected,evidence,redraw}){
 const record=id=>forensicClues.find(c=>c[0]===id);
 function show(title,body,actions=[]){modal('현장 감식 · '+title,body,actions)}
 function read(id){const c=record(id);evidence([id]);show(c[2],`<p style="white-space:pre-line">${c[3]}</p>`)}
 function grant(id){mark(id);evidence([id])}
 const fixtures=[];
 function fixture(id,name,x,y,z){const o=object(name,x,y,z,()=>inspect(id));o.userData.id=id;fixtures.push(o);return o}
 const drawers=fixture('trace-drawer','정리 서랍 · 열어 조사',-2.15,.52,-3.39);
 box(0,0,0,.72,.26,.08,'#ced3cb',drawers);box(0,.03,.065,.38,.025,.04,'#526976',drawers);
 const tray=box(0,-.08,-.14,.65,.04,.45,'#41535b',drawers);
 const paper=box(0,-.05,-.1,.3,.006,.22,'#e8dfc2',drawers);
 const empty=fixture('trace-empty','소모품 서랍',3.2,.48,-3.15);box(0,0,0,.62,.24,.06,'#ced3cb',empty);box(0,0,.055,.25,.025,.035,'#526976',empty);
 const cargo=fixture('trace-box','운반 상자 K-2',-5.8,1.01,3);
 box(0,.025,0,.8,.05,.55,'#424b48',cargo);
 for(const x of [-.39,.39])box(x,.19,0,.035,.34,.55,'#777c66',cargo);
 for(const z of [-.26,.26])box(0,.19,z,.8,.34,.035,'#777c66',cargo);
 box(0,.07,0,.7,.018,.44,'#d2c7a5',cargo);
 const lid=box(0,.4,-.19,.8,.045,.55,'#626e64',cargo);lid.rotation.x=-.25;
 const hair=new T.Mesh(new T.TubeGeometry(new T.CatmullRomCurve3([new T.Vector3(-.15,.09,0),new T.Vector3(-.06,.095,.06),new T.Vector3(.02,.1,.04)]),16,.004,5,false),new T.MeshStandardMaterial({color:'#2e2016'}));cargo.add(hair);
 const residue=box(.2,.09,-.12,.08,.012,.055,'#536d35',cargo);residue.visible=false;
 const prints=new T.Group();drawers.add(prints);prints.position.set(.15,.03,.09);for(let i=0;i<6;i++){const ring=new T.Mesh(new T.TorusGeometry(.014+i*.005,.0014,4,24,Math.PI*1.6),new T.MeshBasicMaterial({color:'#b9e875'}));ring.scale.y=1.4;prints.add(ring)}prints.visible=false;
 const lamp=new T.PointLight('#527cff',0,3,2);lamp.position.set(-5.8,1.5,3);scene.add(lamp);
 function restore(){lamp.position.set(-5.8,1.5,3);empty.position.z=done('empty-open')?-2.94:-3.15;drawers.position.z=done('cleaning')?-3.12:-3.39;lid.rotation.x=done('box-open')?-1.6:-.25;hair.visible=!has('hair-sample');residue.visible=done('lamp-scan');prints.visible=done('print-lit');lamp.intensity=done('lamp-scan')?4:0;redraw()}
 function inspect(id){
  if(id==='trace-empty'){mark('empty-open');restore();return show('소모품 서랍','<p>서랍을 열었다. 밀봉된 피펫 팁과 빈 장갑 포장이 있다. 훼손이나 채취할 흔적은 보이지 않는다. 모든 물건이 결정적 증거인 것은 아니다.</p>')}
  if(id==='trace-drawer'){
   grant('cleaning');restore();return show('서랍 안의 확인서',`<p>${record('cleaning')[3]}</p><p>손잡이의 접촉 흔적은 맨눈으로 구분되지 않는다.</p>`,[[done('print')?'지문 결과 다시 보기':'손잡이 지문 감식',()=>{if(!has('print-kit'))return show('지문 감식 장비 필요','<p>정밀감식 지원을 요청한 뒤 장비함에서 키트를 수령하세요.</p>');if(!done('print-developed')){mark('print-developed');restore();return show('형광 분말 처리 완료','<p>수업용 감식 절차입니다. 분말이 잠재 지문에 부착됐다. 감식 광원과 관찰 필터를 사용해 융선을 확인하세요. 실제 처리는 훈련받은 감식요원이 수행합니다.</p>',[['감식 광원 켜기',()=>{mark('print-lit');restore();lamp.position.copy(drawers.position);lamp.position.y=1;lamp.intensity=4;redraw();show('지문이 드러났다','<p>융선이 보인다. 지문을 촬영하고 전사해 대조 검사를 요청할 수 있다.</p>',[['촬영·전사 후 대조 의뢰',()=>{grant('print');read('print')}]]);}]]);}if(!done('print'))return show('지문 관찰·기록', '<p>처리한 손잡이에 광원과 필터를 적용해 관찰한 뒤 촬영·전사하세요.</p>',[['광원 관찰 후 촬영·전사',()=>{mark('print-lit');grant('print');restore();read('print')}]]);read('print')}]]);
  }
  if(id==='trace-box'){
   mark('box-open');restore();return show('K-2 내부 라이너','<p>뚜껑 아래 라이너가 찢어져 있다. 접착면에 가느다란 털 같은 물체가 끼어 있다. 상자 틈의 얼룩은 맨눈으로 정체를 알 수 없다.</p>',[
    ['접착면 확대 관찰',()=>{mark('hair-seen');show('찢어진 접착면의 머리카락','<div class="trace-macro"><svg viewBox="0 0 500 150" role="img" aria-label="라이너 접착면에 끼인 모발과 끝의 조직"><path d="M0 110L100 98L135 128L220 97L280 125L360 90L500 115V150H0" fill="#c8b78c"/><path d="M90 115Q180 20 270 75T420 40" fill="none" stroke="#4a3022" stroke-width="5"/><ellipse cx="91" cy="114" rx="12" ry="7" fill="#a37658"/></svg></div><p>모발 끝에 조직이 붙어 있는지 확대 기록한다. 이 교육용 시료는 분석 가능한 모근 조직이 붙어 있다. 머리카락 모두에서 같은 검사가 가능한 것은 아니다.</p>',[[has('hair-sample')?'H-1 채취 기록 보기':'사진 기록·개별 채취',()=>{if(!has('sampling-kit'))return show('채취 도구 필요','<p>발견 위치를 보존하세요. 장비함에서 정밀감식 지원을 요청할 수 있습니다.</p>');collect('hair-sample');grant('hair');restore();read('hair')}]]);} ],
    ['대체광원으로 틈 조사',()=>{if(!has('forensic-lamp'))return show('감식 광원 필요','<p>장비함에서 정밀감식 지원을 요청하세요. 아무 흔적이나 파란빛에 나타나는 것은 아닙니다.</p>');mark('lamp-scan');restore();show('광원 조사 · 반응한 얼룩','<div class="trace-light">대체광원 ON · 관찰 필터 적용</div><p>얼룩 여러 곳이 반응한다. 세제 잔여물도 반응할 수 있어 빛만으로 혈액이나 DNA를 판정하지 않는다. 한 틈에서 식물 조각이 보인다.</p>',[[has('cargo-sample')?'P-1 채취 기록 보기':'대조 시료와 식물 조직 개별 채취',()=>{collect('cargo-sample');grant('cargo');read('cargo')}]]);}]
   ]);
  }
 }
 function support(){
  if(done('support')){for(const id of ['sampling-kit','forensic-lamp','print-kit'])if(!has(id))collect(id);return show('정밀감식 장비 수령','<p>채취 키트·감식 광원과 필터·형광 지문 키트를 도구함에 넣었다. K-2 내부와 서랍 손잡이를 다시 조사하세요. 검사에는 시료를 개별 채취해야 합니다.</p>')}
  if(!done('cleaning')||!done('hair-seen'))return show('정밀감식 요청 준비','<p>지원 요청에는 관찰 근거가 필요합니다. 실험대의 정리 서랍에서 세척·봉인 확인서를 찾고, 운반 상자의 내부를 확대 관찰하세요.</p>');
  show('정밀감식 지원 요청','<p>보고할 사실: 새 라이너가 찢어져 있고 그 접착면에 모발이 끼어 있다. 기존 상태 사진과 달라 추가 감식이 필요하다. 범인이나 물질의 정체는 아직 모른다.</p>',[['관찰 사실 보고·지원 요청',()=>{grant('support');show('감식팀 도착','<p>교육용으로 대기 시간을 생략했습니다. 현장 보존 후 장비를 전달받습니다.</p>',[['장비 수령',support]])}]]);
 }
 function samples(stage){
  const ids=['hair-sample','cargo-sample'].filter(has);
  show(stage==='extract'?'DNA 추출대':stage==='pcr'?'PCR 시료 선택':'염기서열 분석 시료 선택','<p>시료별 진행 상태를 확인하세요. 모발·식물 조직을 PCR 장비에 바로 넣지 않고 먼저 DNA를 추출합니다. 단계는 가상의 실험 시간을 압축합니다.</p>',ids.map(id=>{const code=id==='hair-sample'?'H-1 모근 조직':'P-1 식물 조직',prefix=id==='hair-sample'?'hair':'cargo',result=prefix+'-result';return [code+' · '+(done(result)?'분석 완료':done(prefix+'-amp')?'증폭 완료':done(prefix+'-dna')?'추출 완료':'미추출'),()=>{
   if(stage==='extract'){mark(prefix+'-dna');return show(code+' 추출 완료','<p>시료와 음성 대조를 분리해 준비했다. 추출한 DNA를 PCR 장비에서 증폭하세요. 추출은 염기 순서를 읽는 과정이 아닙니다.</p>')}
   if(!done(prefix+'-dna'))return show('DNA 추출이 먼저 필요합니다','<p>수사 장비함의 DNA 추출대에서 시료를 처리하세요.</p>');
   if(stage==='pcr'){mark(prefix+'-amp');return show(code+' 증폭 완료','<p>가닥 분리 → 프라이머 결합 → 새 가닥 합성 사이클을 반복했습니다. 사람 비교용 표적과 식물 계통 비교용 표적은 별도로 준비됐습니다. 별도 염기서열 분석기로 이동하세요.</p>')}
   if(!done(prefix+'-amp'))return show('PCR 증폭이 필요합니다','<p>추출 DNA를 PCR 장비에서 처리한 뒤 돌아오세요.</p>');grant(result);read(result);
  }]}));
  if(!ids.length)show('채취된 시료 없음','<p>현장 물건을 조사해 시료를 개별 채취하세요.</p>');
 }
 function restoreEvidence(){for(const [id]of forensicClues)if(done(id))evidence([id]);restore()}
 return {support,samples,restore:restoreEvidence,inspect};
}
