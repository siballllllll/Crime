import {test} from 'node:test';
import assert from 'node:assert/strict';
import {START,canStand,movePlayer} from './navigation.js';
test('entry position is walkable and furniture and walls block movement',()=>{assert.ok(canStand(START.x,START.z));for(const [x,z] of [[0,-1],[3.6,-3.1],[3.6,1.1],[-4.7,1.4],[0,2],[6,0],[0,-5]])assert.equal(canStand(x,z),false)});
test('diagonal walking is normalized and cannot tunnel on a delayed frame',()=>{const a={x:-2,z:3.4,yaw:0},b={...a};movePlayer(a,1,0,.03);movePlayer(b,1,1,.03);assert.ok(Math.abs(Math.hypot(a.x+2,a.z-3.4)-Math.hypot(b.x+2,b.z-3.4))<1e-9);const c={x:0,z:3.4,yaw:0};for(let i=0;i<200;i++)movePlayer(c,1,0,2);assert.ok(canStand(c.x,c.z));assert.ok(c.z>2.8)});
test('movement slides along the bench without passing through it',()=>{const p={x:0,z:.1,yaw:0};for(let i=0;i<15;i++)movePlayer(p,1,1,.05);assert.ok(canStand(p.x,p.z));assert.ok(p.x>.8);assert.ok(p.z>=-.02)});
