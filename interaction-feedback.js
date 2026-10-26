import * as T from './vendor/three.module.js';
export function createInteractionFeedback({scene,objects,container}){
 const layer=document.createElement('div');layer.className='nearby-interactions';container.appendChild(layer);
 const ray=new T.Raycaster(),direction=new T.Vector3();
 const entries=objects.map(o=>{
  const materials=[];o.traverse(m=>{if(!m.isMesh||!m.material.emissive)return;m.material=m.material.clone();materials.push({material:m.material,color:m.material.emissive.clone(),intensity:m.material.emissiveIntensity})});
  const label=document.createElement('div');label.className='nearby-object';label.textContent=o.userData.name;label.hidden=true;layer.appendChild(label);
  return {o,materials,label,level:0};
 });
 function hide(){layer.hidden=true;for(const e of entries){for(const m of e.materials){m.material.emissive.copy(m.color);m.material.emissiveIntensity=m.intensity}e.level=0}}
 let lastUpdate=0,lastFocused=null,lastEnabled=false;
 function update(camera,focused,enabled,labels=true){const now=performance.now();if(now-lastUpdate<80&&focused===lastFocused&&enabled===lastEnabled)return false;lastUpdate=now;lastFocused=focused;lastEnabled=enabled;layer.hidden=!enabled;let changed=false;const candidates=[];
  for(const e of entries){const bounds=new T.Box3().setFromObject(e.o),point=bounds.getCenter(new T.Vector3()),distance=camera.position.distanceTo(bounds.clampPoint(camera.position,new T.Vector3()));
   e.label.textContent=e.o.userData.name;const level=!e.o.visible||!enabled||distance>4.5?0:e.o===focused?2:1;if(level!==e.level){changed=true;e.level=level;for(const m of e.materials){m.material.emissive.copy(level?new T.Color('#d8c59b'):m.color);m.material.emissiveIntensity=level===2?.09:level===1?.025:m.intensity}}
   e.label.hidden=true;if(!enabled||!labels||!level||e.o===focused)continue;
   direction.copy(point).sub(camera.position).normalize();ray.set(camera.position,direction);const first=ray.intersectObjects(scene.children,true)[0];let parent=first?.object;while(parent&&parent!==e.o)parent=parent.parent;if(!parent)continue;
   point.y=bounds.max.y+.16;point.project(camera);if(point.z< -1||point.z>1||Math.abs(point.x)>.9||Math.abs(point.y)>.85)continue;
   candidates.push({e,distance,x:(point.x+1)*container.clientWidth/2,y:(1-point.y)*container.clientHeight/2});
  }
  const occupied=[];
  for(const {e,x,y} of candidates.sort((a,b)=>a.distance-b.distance).slice(0,3)){
   if(occupied.some(p=>Math.abs(p.x-x)<190&&Math.abs(p.y-y)<50))continue;occupied.push({x,y});e.label.hidden=false;e.label.style.left=x+'px';e.label.style.top=y+'px';
  }
  return changed;
 }
 return {update,hide};
}
