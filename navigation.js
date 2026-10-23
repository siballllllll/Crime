// 18 × 14 m room. Walkway and benches use the same coordinates as investigation-room.js.
export const START={x:0,z:5.5,yaw:0,pitch:-.05};
export const SOLIDS=[[-1.95,-1.05,-2.75,-1.85],[6.85,7.75,2.35,3.25],[-7.25,-1.55,-4.95,-3.45],[2.85,5.95,-4.8,-3.2],[4.35,7.05,.4,2],[-6.25,-3.35,2.35,3.65],[-8.45,-7.15,-5.9,-4.8],[-7.95,-7.05,2.7,3.3],[-7.9,-7.1,-.2,.6]];
export function canStand(x,z){const r=.23;return x>=-8.8+r&&x<=8.8-r&&z>=-6.8+r&&z<=6.8-r&&!SOLIDS.some(([x0,x1,z0,z1])=>x>x0-r&&x<x1+r&&z>z0-r&&z<z1+r)}
export function movePlayer(player,forward,strafe,dt){const n=Math.hypot(forward,strafe)||1,step=Math.min(.05,Math.max(0,dt))*2.7;const dx=(-Math.sin(player.yaw)*forward+Math.cos(player.yaw)*strafe)/n*step,dz=(-Math.cos(player.yaw)*forward-Math.sin(player.yaw)*strafe)/n*step;if(canStand(player.x+dx,player.z))player.x+=dx;if(canStand(player.x,player.z+dz))player.z+=dz;return player}
