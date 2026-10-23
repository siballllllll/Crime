import {test} from 'node:test';
import assert from 'node:assert/strict';
import {START,canStand,movePlayer} from './navigation.js';
test('expanded room keeps entry and aisles around the central island open, furniture and walls solid',()=>{assert.ok(canStand(START.x,START.z));for(const z of [-6,-3,0,3,6])assert.ok(canStand(2,z));for(const [x,z] of [[-4.4,-4.2],[4.4,-4],[5.7,1.2],[-4.8,3],[-7.8,-5.35],[-2.6,0],[0,0],[7.9,-4.65],[-7.9,5.45],[7.3,2.8],[9,0],[0,7]])assert.equal(canStand(x,z),false)});
test('diagonal speed is normalized and delayed frames cannot tunnel into a bench',()=>{const a={x:0,z:4,yaw:0},b={...a};movePlayer(a,1,0,.03);movePlayer(b,1,1,.03);assert.ok(Math.abs(Math.hypot(a.x,a.z-4)-Math.hypot(b.x,b.z-4))<1e-9);const c={x:4.4,z:-1,yaw:0};for(let i=0;i<100;i++)movePlayer(c,1,0,2);assert.ok(canStand(c.x,c.z));assert.ok(c.z> -2.98)});
test('every investigation station and exit has a reachable approach from entry',()=>{
 const goals=[[-5.5,-3],[-3.25,-3],[4.5,-2.75],[5.75,2.75],[-7.75,-4.25],[-4.75,4.25],[2,5.5],[0,6]];
 const queue=[[0,5.5]],seen=new Set(['0,5.5']);
 for(let i=0;i<queue.length;i++){const [x,z]=queue[i];for(const [dx,dz] of [[.25,0],[-.25,0],[0,.25],[0,-.25]]){const nx=x+dx,nz=z+dz,key=nx+','+nz;if(!seen.has(key)&&canStand(nx,nz)){seen.add(key);queue.push([nx,nz])}}}
 for(const goal of goals)assert.ok(seen.has(goal.join(',')),'unreachable station approach: '+goal);
});
