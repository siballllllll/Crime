// Relative mouse capture only: no cursor-position or edge-turning fallback.
export async function requestFpsCapture(target,{fullscreen=false,raw=false}={}){
 if(fullscreen&&!document.fullscreenElement){
  if(!document.documentElement.requestFullscreen)throw Error('이 화면에서는 전체화면을 지원하지 않습니다.');
  await document.documentElement.requestFullscreen();
 }
 if(!target.requestPointerLock)throw Error('이 브라우저는 상대 마우스 입력을 지원하지 않습니다.');
 if(document.pointerLockElement===target)return;
 target.focus({preventScroll:true});
 await new Promise((resolve,reject)=>{
  let timer,poll;
  const done=(error)=>{clearTimeout(timer);clearInterval(poll);document.removeEventListener('pointerlockchange',change);document.removeEventListener('pointerlockerror',fail);error?reject(error):resolve()};
  const change=()=>{if(document.pointerLockElement===target)done()};
  const fail=()=>done(Error('브라우저가 상대 마우스 입력 요청을 거부했습니다.'));
  document.addEventListener('pointerlockchange',change);document.addEventListener('pointerlockerror',fail);
  timer=setTimeout(()=>done(Error('브라우저의 마우스 연결 응답이 없습니다.')),4000);
  poll=setInterval(change,100);
  try{const result=raw?target.requestPointerLock({unadjustedMovement:true}):target.requestPointerLock();result?.then?.(change,done)}catch(error){done(error)}
 });
}
