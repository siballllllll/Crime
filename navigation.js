// Room coordinates are world units. Camera height is fixed; movement slides along solids.
export const START={x:0,z:3.4,yaw:0,pitch:-.13};
export const SOLIDS=[[-4.55,1.8,-2.35,-.25],[2.5,4.7,-4.05,-2.15],[2.35,4.85,.15,2.2],[-5.2,-4.1,1,1.9],[-.66,.66,1.34,2.66]];
export function canStand(x,z){const r=.23;return x>=-5.1+r&&x<=5.1-r&&z>=-4.1+r&&z<=4.1-r&&!SOLIDS.some(([x0,x1,z0,z1])=>x>x0-r&&x<x1+r&&z>z0-r&&z<z1+r)}
export function movePlayer(player,forward,strafe,dt){const n=Math.hypot(forward,strafe)||1,step=Math.min(.05,Math.max(0,dt))*2.2;const dx=(-Math.sin(player.yaw)*forward+Math.cos(player.yaw)*strafe)/n*step,dz=(-Math.cos(player.yaw)*forward-Math.sin(player.yaw)*strafe)/n*step;if(canStand(player.x+dx,player.z))player.x+=dx;if(canStand(player.x,player.z+dz))player.z+=dz;return player}
