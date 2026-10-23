import * as T from './vendor/three.module.js';
// Reference-inspired laboratory fittings. Bench objects remain inside existing footprints.
export function addLabFittings({scene,box,cyl,sign,steel,top,dark,glass,worktop}){
 const amber=new T.MeshStandardMaterial({color:'#6d381b',roughness:.26,metalness:.08});
 const blue=new T.MeshStandardMaterial({color:'#206ba0',roughness:.45});
 const plastic=new T.MeshStandardMaterial({color:'#edf0e8',roughness:.6});
 const rubber=new T.MeshStandardMaterial({color:'#182125',roughness:.9});
 function bottle(x,y,z,i){const r=i%3===0?.055:.043,h=i%3===0?.23:.17;
  cyl(x,y+h/2,z,r,h,i%4===0?glass:amber);cyl(x,y+h+.016,z,r*.75,.032,i%2?blue:plastic);
  box(x,y+h*.53,z+r+.003,r*1.4,h*.43,.004,plastic);box(x,y+h*.6,z+r+.007,r,.007,.003,'#6d7b7f');
 }
 function shelf(x,z,w){for(const dx of [-w/2+.07,w/2-.07]){box(x+dx,1.9,z,.055,1.9,.06,steel);for(let y=1.15;y<2.8;y+=.16)box(x+dx,y,z+.034,.018,.028,.008,dark)}
  for(const [row,y] of [[0,1.92],[1,2.57]]){box(x,y,z,w,.055,.34,top);box(x,y+.12,z-.155,w,.025,.025,steel);box(x,y+.1,z+.16,w,.018,.018,steel);
   const strip=box(x,y-.035,z+.08,w-.2,.018,.12,'#e1e5d8');strip.material=new T.MeshStandardMaterial({color:'#e1e5d8',emissive:'#c7dacb',emissiveIntensity:.7});
   const n=Math.floor(w/.27);for(let i=0;i<n;i++){if(i%7===5)continue;bottle(x-w/2+.18+i*.27,y+.03,z,i+row)}
  }
  box(x,1.28,z,w,.22,.08,plastic);
  for(let dx=-w/2+.3;dx<w/2;dx+=.9){box(x+dx,1.28,z+.05,.16,.14,.014,top);for(const d of [-.035,.035])cyl(x+dx+d,1.28,z+.065,.012,.008,dark).rotation.x=Math.PI/2;}
 }
 shelf(-4.4,-4.72,5.5);shelf(4.4,-4.62,2.85);
 // Cabinets sit against the east wall, facing the room, with a mounting rail.
 const storage=new T.Group();storage.position.set(8.65,2.65,1.2);storage.rotation.y=-Math.PI/2;scene.add(storage);
 box(0,0,-.19,2.85,.08,.06,steel,storage);
 for(const x of [-.72,.72]){
  box(x,0,0,1.35,.7,.4,plastic,storage);
  for(const dx of [-.335,.335])box(x+dx,0,.215,.655,.65,.035,plastic,storage);
  for(const dx of [-.09,.09])box(x+dx,-.05,.26,.022,.2,.035,steel,storage);
 }
 function pipettes(x,z){cyl(x,1.02,z,.17,.04,plastic);cyl(x,1.3,z,.018,.54,steel);cyl(x,1.56,z,.19,.035,plastic);
  for(let i=0;i<5;i++){const a=i/5*Math.PI*2,px=x+Math.cos(a)*.13,pz=z+Math.sin(a)*.13;cyl(px,1.36,pz,.025,.28,plastic);cyl(px,1.18,pz,.009,.12,steel);cyl(px,1.52,pz,.022,.04,i%2?blue:dark)}
 }
 pipettes(-2,-4.05);pipettes(3.35,-3.95);
 for(const [x,z] of [[-6.5,-4.05],[6.55,1.3]]){box(x,1.04,z,.32,.09,.25,blue);box(x,1.11,z,.33,.04,.26,glass);for(let i=0;i<5;i++)for(let j=0;j<3;j++)cyl(x-.12+i*.06,1.13,z-.08+j*.08,.012,.04,plastic)}
 // Benchtop centrifuge, balance and microscope, smaller than the investigation devices.
 cyl(5.45,1.13,-3.95,.22,.25,plastic);cyl(5.45,1.27,-3.95,.215,.035,dark);box(5.45,1.12,-3.72,.2,.075,.018,blue);
 box(-6.6,1.04,-4.4,.38,.1,.32,plastic);cyl(-6.6,1.1,-4.4,.12,.015,steel);sign('0.000 g',-6.6,1.04,-4.23,.17,.045);
 const microscope=new T.Group();microscope.position.set(-6.7,.99,-3.9);scene.add(microscope);
 box(0,.025,0,.27,.05,.32,plastic,microscope);const arm=box(0,.25,-.08,.065,.43,.07,steel,microscope);arm.rotation.x=-.25;box(0,.25,.025,.22,.025,.2,dark,microscope);cyl(0,.4,0,.045,.17,plastic,microscope);cyl(0,.52,0,.03,.09,dark,microscope);
 function tube(points,r,mat){const curve=new T.CatmullRomCurve3(points.map(p=>new T.Vector3(...p)));const mesh=new T.Mesh(new T.TubeGeometry(curve,16,r,7,false),mat);scene.add(mesh);return mesh}
 // Sink fitted to the small utility pedestal along the left wall.
 box(-7.5,.66,.2,.66,.055,.65,steel);box(-7.5,.692,.2,.46,.009,.4,dark);cyl(-7.5,.698,.2,.04,.008,steel);tube([[-7.5,.65,-.04],[-7.5,1.02,-.04],[-7.5,1.09,.12],[-7.5,.97,.2]],.025,steel);
 // Utility cables and ventilation routed behind equipment, away from the aisle.
 tube([[4.8,1.05,-4.15],[5.1,1,-4.4],[5.1,1.27,-4.57]],.012,rubber);
 for(const x of [-6.9,5.8]){const duct=cyl(x,3.45,-5.1,.12,2.8,steel);duct.rotation.x=Math.PI/2;for(const z of [-6.2,-5.1,-4]){const band=cyl(x,3.45,z,.135,.035,dark);band.rotation.x=Math.PI/2}}
 function stool(x,z){cyl(x,.62,z,.29,.1,rubber);cyl(x,.34,z,.035,.5,steel);const foot=new T.Mesh(new T.TorusGeometry(.22,.018,8,24),steel);foot.rotation.x=Math.PI/2;foot.position.set(x,.26,z);scene.add(foot);
  for(let i=0;i<5;i++){const a=i/5*Math.PI*2;const leg=box(x+Math.cos(a)*.18,.1,z+Math.sin(a)*.18,.38,.035,.045,steel);leg.rotation.y=-a;const wheel=cyl(x+Math.cos(a)*.34,.06,z+Math.sin(a)*.34,.045,.04,rubber);wheel.rotation.z=Math.PI/2}
  box(x,.84,z-.22,.035,.4,.035,steel);const back=box(x,1.03,z-.25,.48,.27,.07,rubber);back.rotation.x=-.1;
 }
 stool(-2.6,0);stool(7.3,2.8);
}
