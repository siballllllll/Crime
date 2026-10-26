import {test} from 'node:test';
import assert from 'node:assert/strict';
import * as T from './vendor/three.module.js';
import {createForensicField} from './forensic-field.js';
function setup(){
 const scene=new T.Scene(),done=new Set(),items=new Set(),evidence=new Set();let screen;
 const object=(name,x,y,z,fn)=>{const o=new T.Group();o.position.set(x,y,z);o.userData={name,fn};scene.add(o);return o};
 const box=(x,y,z,w,h,d,color,parent=scene)=>{const m=new T.Mesh(new T.BoxGeometry(w,h,d),new T.MeshStandardMaterial({color}));m.position.set(x,y,z);parent.add(m);return m};
 const api=createForensicField({scene,object,box,modal:(title,body,actions)=>screen={title,body,actions},mark:id=>done.add(id),done:id=>done.has(id),collect:id=>items.add(id),has:id=>items.has(id),evidence:ids=>ids.forEach(id=>evidence.add(id)),redraw:()=>{}});
 const click=text=>{const action=screen.actions.find(([label])=>label.includes(text));assert.ok(action,'missing action '+text);action[1]()};
 return {api,scene,done,items,evidence,click,screen:()=>screen};
}
test('support needs both physical observations and sampling needs the delivered kit',()=>{
 const t=setup();t.api.support();assert.equal(t.items.size,0);t.api.inspect('trace-box');t.click('접착면 확대');t.click('사진 기록');assert.equal(t.items.size,0);t.api.support();assert.equal(t.done.has('support'),false);
 t.api.inspect('trace-drawer');t.api.support();t.click('관찰 사실');assert(t.done.has('support'));assert.equal(t.items.size,0);t.click('장비 수령');assert(t.items.has('sampling-kit'));t.api.inspect('trace-box');t.click('접착면 확대');t.click('사진 기록');assert(t.items.has('hair-sample'));assert(t.evidence.has('hair'));
});
test('each collected sample needs its own extraction and PCR before sequencing',()=>{
 const t=setup();t.items.add('hair-sample');t.items.add('cargo-sample');
 t.api.samples('sequence');t.click('H-1');assert(!t.evidence.has('hair-result'));
 t.api.samples('extract');t.click('H-1');t.api.samples('sequence');t.click('H-1');assert(!t.evidence.has('hair-result'));
 t.api.samples('pcr');t.click('H-1');t.api.samples('sequence');t.click('H-1');assert(t.evidence.has('hair-result'));
 t.api.samples('sequence');t.click('P-1');assert(!t.evidence.has('cargo-result'));assert(!t.done.has('cargo-dna'));
 for(const stage of ['extract','pcr','sequence']){t.api.samples(stage);t.click('P-1')}assert(t.evidence.has('cargo-result'));
});
test('powder processing alone does not add a fingerprint comparison result',()=>{
 const t=setup();t.items.add('print-kit');t.api.inspect('trace-drawer');t.click('손잡이 지문');assert(t.done.has('print-developed'));assert(!t.evidence.has('print'));t.click('감식 광원');assert(t.done.has('print-lit'));assert(!t.evidence.has('print'));t.click('촬영·전사');assert(t.evidence.has('print'));
});

test('opening a physical drawer reveals a separate document without opening a modal',()=>{const t=setup();let drawer,document;t.scene.traverse(o=>{if(o.userData.id==='trace-drawer')drawer=o;if(o.userData.id==='trace-document')document=o});drawer.userData.fn();assert.equal(t.screen(),undefined);assert.equal(document.visible,false);t.api.update(.05);assert(drawer.position.z>-3.39&&drawer.position.z<-2.87);for(let i=0;i<20;i++)t.api.update(.05);assert(document.visible);assert.equal(t.screen(),undefined);document.userData.fn();assert(t.evidence.has('cleaning'));drawer.userData.fn();for(let i=0;i<20;i++)t.api.update(.05);assert.equal(document.visible,false);assert.equal(drawer.position.z,-3.39)});
