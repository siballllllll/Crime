// Deterministic, reversible motion. No timers: pausing the view pauses movement.
export function createMotion({duration=.65,apply,onSettled=()=>{}}){
 let value=0,target=0;
 return {get value(){return value},get target(){return target},toggle(){target=target?0:1},close(){target=0},reset(){value=target=0;apply(0)},update(dt){if(value===target)return false;const step=Math.min(.05,Math.max(0,dt))/duration;value=target>value?Math.min(target,value+step):Math.max(target,value-step);apply(value*value*(3-2*value));if(value===target)onSettled(target);return true}};
}
