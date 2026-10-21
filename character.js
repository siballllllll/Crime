// Directional SD detective atlas. Equal source scale keeps walking frames consistent.
const atlas=new Image();
const rows={down:0,right:1,up:2,left:3};
let frames=null,scale=1;
atlas.onload=()=>{
 const scratch=document.createElement('canvas');scratch.width=atlas.naturalWidth;scratch.height=atlas.naturalHeight;
 const context=scratch.getContext('2d',{willReadFrequently:true});context.drawImage(atlas,0,0);
 const cw=Math.floor(atlas.naturalWidth/4),ch=Math.floor(atlas.naturalHeight/4);
 frames=[];let tallest=0;
 for(let row=0;row<4;row++)for(let col=0;col<4;col++){
  const pixels=context.getImageData(col*cw,row*ch,cw,ch).data;
  let left=cw,top=ch,right=-1,bottom=-1;
  for(let y=0;y<ch;y++)for(let x=0;x<cw;x++)if(pixels[(y*cw+x)*4+3]>60){left=Math.min(left,x);right=Math.max(right,x);top=Math.min(top,y);bottom=Math.max(bottom,y);}
  if(right<left){frames=null;return;}
  const width=right-left+1,height=bottom-top+1;
  frames.push({x:col*cw+left,y:row*ch+top,width,height});tallest=Math.max(tallest,height);
 }
 scale=96/tallest;
};
atlas.src='./assets/detective-sprites.png?v=1';
export function drawInvestigator(ctx,x,y,time,moving,direction,phase){
 if(!frames){drawFallback(ctx,x,y,time,moving,direction,phase);return;}
 const row=rows[direction]??0;
 const walk=[1,2,3,2];const col=moving?walk[Math.floor(phase*4)%4]:0;
 const frame=frames[row*4+col];
 const width=Math.round(frame.width*scale),height=Math.round(frame.height*scale);
 const breath=moving?0:Math.round(Math.sin(time/650));
 ctx.save();ctx.imageSmoothingEnabled=false;
 ctx.fillStyle='#08192255';ctx.beginPath();ctx.ellipse(Math.round(x),Math.round(y),18,4,0,0,Math.PI*2);ctx.fill();
 ctx.drawImage(atlas,frame.x,frame.y,frame.width,frame.height,Math.round(x-width/2),Math.round(y-height-breath),width,height);
 ctx.restore();
}

// Native-resolution character: articulated limbs, directional face and coat layers.
function drawFallback(ctx,x,y,time,moving,direction,phase) {
 const side=direction==='left'||direction==='right',back=direction==='up';
 const cycle=phase*Math.PI*2, stride=moving?Math.sin(cycle):0;
 const bob=moving?Math.abs(Math.sin(cycle))*1.4:Math.sin(time/650)*.55;
 ctx.save();ctx.translate(Math.round(x),Math.round(y));
 ctx.fillStyle='#0b1e2c66';ctx.beginPath();ctx.ellipse(0,-1,18,4,0,0,Math.PI*2);ctx.fill();
 ctx.translate(0,-bob);if(direction==='left')ctx.scale(-1,1);
 const rect=(a,b,w,h,col)=>{ctx.fillStyle=col;ctx.fillRect(Math.round(a),Math.round(b),w,h)};
 const poly=(points,col)=>{ctx.fillStyle=col;ctx.beginPath();points.forEach(([a,b],i)=>i?ctx.lineTo(Math.round(a),Math.round(b)):ctx.moveTo(Math.round(a),Math.round(b)));ctx.closePath();ctx.fill();};
 function leg(a,s){const swing=moving?s*stride*4:0;poly([[a-4,-25],[a+4,-25],[a+4+swing,-12],[a+3+swing*.7,-3],[a-3+swing*.7,-3],[a-5+swing,-13]],'#142536');rect(a-2+swing,-22,3,10,'#3d5266');rect(a-2+swing*.7,-10,3,6,'#58717a');rect(a-4+swing*.7,-5,9,4,'#182737');rect(a-4+swing*.7,-2,10,2,'#9ba9a1');rect(a+2+swing*.7,-5,4,2,'#bfc7b0');}
 leg(side?-1:-6,1);leg(side?3:6,-1);
 function arm(a,s,behind=false){const swing=moving?s*stride*3:Math.sin(time/850)*.4;poly([[a-3,-49],[a+3,-47],[a+4+swing,-30],[a+swing,-25],[a-4+swing,-29]],behind?'#637e80':'#a8beb3');rect(a-2+swing,-39,3,10,'#d4d8bc');rect(a-2+swing,-29,5,5,'#a87d66');rect(a-1+swing,-29,3,3,'#e5b992');rect(a-3+swing,-32,6,3,'#4e6b72');}
 arm(side?-7:-14,-1,true);
 poly([[-10,-50],[8,-50],[13,-44],[11,-29],[14+stride,-20],[-13+stride,-20],[-11,-36]],'#1f3544');
 poly([[-9,-49],[-2,-47],[-2,-23],[-12+stride,-22],[-9,-34]],'#b4c6b5');
 poly([[2,-47],[8,-49],[11,-43],[9,-32],[12+stride,-22],[2,-23]],'#849e9b');
 rect(-1,-47,4,23,'#2c5861');rect(0,-44,2,10,'#b2c4a9');
 poly([[-9,-49],[-4,-52],[-1,-47],[-5,-42]],'#e0dfbf');poly([[3,-47],[6,-52],[10,-49],[7,-42]],'#c9d5bb');
 rect(-9,-35,6,1,'#718e88');rect(-8,-34,4,5,'#c1d0b7');rect(6,-36,4,6,'#d6c297');rect(6,-35,4,2,'#6c9f9c');rect(7,-32,2,1,'#485f65');
 rect(-2,-30,2,2,'#d2d3b2');rect(-2,-25,2,2,'#d2d3b2');
 // Shoulder strap and compact sample satchel.
 poly([[-8,-49],[-5,-49],[11,-25],[8,-24]],'#514e42');rect(7,-29,9,10,'#3f5b61');rect(8,-28,7,3,'#8a9c89');rect(11,-27,2,2,'#c6b87e');
 arm(side?8:14,1);
 // Neck, ears and face are drawn at single-pixel resolution.
 rect(-4,-55,8,7,'#ba8c70');rect(-3,-54,5,4,'#e2b58d');
 poly([[-12,-71],[-9,-78],[5,-80],[12,-73],[12,-60],[7,-54],[-5,-54],[-11,-60]],'#273946');
 poly([[-10,-70],[-6,-75],[7,-75],[10,-68],[9,-59],[4,-56],[-5,-57],[-9,-62]],back?'#3f4951':'#dca780');
 if(!back){rect(-7,-68,13,9,'#edbd91');rect(-8,-64,3,5,'#d19b7a');rect(5,-63,4,5,'#c79576');rect(side?7:-5,-64,side?3:4,2,'#f0dbc0');rect(side?8:-4,-65,2,3,'#304b60');if(!side){rect(4,-64,4,2,'#f0dbc0');rect(5,-65,2,3,'#304b60');}rect(side?10:1,-62,2,3,'#b88165');rect(side?6:-2,-58,5,1,'#9f6659');if(time%4800>4620){rect(side?7:-5,-65,4,2,'#ba896e');if(!side)rect(4,-65,4,2,'#ba896e');}}
 // Layered hair silhouette, highlights, ear piece and goggles.
 poly([[-13,-70],[-12,-77],[-8,-80],[-2,-82],[6,-81],[10,-77],[14,-71],[10,-64],[7,-68],[5,-74],[1,-70],[-2,-74],[-6,-70],[-8,-64],[-12,-65]],'#273945');
 poly([[-10,-76],[-5,-79],[4,-79],[9,-75],[6,-74],[0,-76],[-5,-73]],'#53616a');rect(-7,-78,5,1,'#809087');rect(1,-77,4,1,'#6a7c7c');rect(-12,-68,3,5,'#728c8c');rect(-11,-67,2,3,'#aec4b2');
 rect(-10,-74,20,2,'#6c786c');rect(-8,-76,7,5,'#172e3e');rect(2,-76,7,5,'#172e3e');rect(-7,-75,5,2,'#719da0');rect(3,-75,5,2,'#719da0');rect(-6,-75,2,1,'#c1d8bd');rect(4,-75,2,1,'#c1d8bd');
 if(back){rect(-6,-67,12,9,'#344550');rect(-4,-64,8,4,'#46555d');}
 ctx.restore();
}
