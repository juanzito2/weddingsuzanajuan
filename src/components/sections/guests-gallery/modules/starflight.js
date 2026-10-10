
/**
 * Celestial Starflight — perspectiva em primeira pessoa com Canvas 2D.
 * Partículas avançam do ponto de fuga em direção ao observador.
 * Reduz movimento, respeita visibilidade e limpa recursos ao desmontar.
 */
export function startStarflight(root, canvas, reduced = false) {
  if (!canvas || !root) return () => {};
  const ctx = canvas.getContext("2d", { alpha: true });
  if (!ctx) return () => {};
  let width = 1, height = 1, raf = 0, last = 0, alive = true, visible = true;
  let scroll = 0, pointerX = 0, pointerY = 0;
  const count = reduced ? 65 : (window.innerWidth < 700 ? 100 : 175);
  const depth = 1100, focal = 450;
  const stars = [];
  const rand = (a,b) => a + Math.random()*(b-a);
  function reset(s, initial = false) {
    s.x = rand(-width*1.6, width*1.6);
    s.y = rand(-height*1.6, height*1.6);
    s.z = initial ? rand(30,depth) : depth;
    s.prevZ = s.z;
    s.size = rand(.45,1.9);
    s.tint = Math.random();
    return s;
  }
  function resize(){
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = Math.max(1, rect.width);
    height = Math.max(1, rect.height);
    canvas.width = Math.round(width*dpr);
    canvas.height = Math.round(height*dpr);
    ctx.setTransform(dpr,0,0,dpr,0,0);
    if (!stars.length) for(let i=0;i<count;i++) stars.push(reset({},true));
  }
  function color(s,alpha){
    if(s.tint<.33) return `rgba(170,123,186,${alpha})`;
    if(s.tint<.7) return `rgba(247,210,143,${alpha})`;
    return `rgba(166,117,206,${alpha})`;
  }
  function render(now){
    if(!alive || !visible) return;
    const dt = Math.min(40, now-(last||now));last=now;
    ctx.clearRect(0,0,width,height);
    const speed = reduced ? 0 : 62 + Math.min(28,Math.abs(scroll)*.06);
    const cx = width*.5+pointerX*width*.045;
    const cy = height*.48+pointerY*height*.045;
    for(const s of stars){
      const previous = s.z;
      if(!reduced) s.z -= speed*dt/1000;
      if(s.z<=6){reset(s);continue;}
      const factor = focal / s.z;
      const x = cx + s.x*factor, y = cy + s.y*factor;
      if(x < -100 || x>width+100 || y < -100 || y>height+100){reset(s);continue;}
      const alpha=Math.min(.88,.28+(1-s.z/depth)*.58);
      const radius=Math.min(3.4,s.size*(.45+factor*.65));
      if(!reduced){
        const prevFactor=focal/previous;
        const px=cx+s.x*prevFactor,py=cy+s.y*prevFactor;
        ctx.strokeStyle=color(s,alpha*.75);
        ctx.lineWidth=Math.max(.6,radius*.75);
        ctx.beginPath();ctx.moveTo(px,py);ctx.lineTo(x,y);ctx.stroke();
      }
      ctx.fillStyle=color(s,alpha);
      ctx.beginPath();ctx.arc(x,y,radius,0,Math.PI*2);ctx.fill();
      if(radius>1.4){ctx.fillStyle=color(s,alpha*.1);ctx.beginPath();ctx.arc(x,y,radius*3,0,Math.PI*2);ctx.fill();}
    }
    if(!reduced) raf=requestAnimationFrame(render);
  }
  function onPointer(e){pointerX=e.clientX/window.innerWidth*2-1;pointerY=e.clientY/window.innerHeight*2-1;}
  function onScroll(){const r=root.getBoundingClientRect();scroll=r.top;}
  function onVisibility(){
    visible=!document.hidden;
    if(visible){last=0;cancelAnimationFrame(raf);raf=requestAnimationFrame(render);}
    else cancelAnimationFrame(raf);
  }
  resize();onScroll();render(0);
  if(!reduced) raf=requestAnimationFrame(render);
  window.addEventListener("resize",resize,{passive:true});
  window.addEventListener("pointermove",onPointer,{passive:true});
  window.addEventListener("scroll",onScroll,{passive:true});
  document.addEventListener("visibilitychange",onVisibility);
  const glowTargets=root.querySelectorAll(".rm-hero,.rm-section--purple,.rm-section--white,.rm-footer--purple");
  const glowListeners=[];
  for(const element of glowTargets){
    const handler=e=>{const r=element.getBoundingClientRect();element.style.setProperty("--glow-x",`${(e.clientX-r.left)/r.width*100}%`);element.style.setProperty("--glow-y",`${(e.clientY-r.top)/r.height*100}%`);};
    element.addEventListener("pointermove",handler,{passive:true});
    glowListeners.push(()=>element.removeEventListener("pointermove",handler));
  }
  return ()=>{
    alive=false;cancelAnimationFrame(raf);
    window.removeEventListener("resize",resize);
    window.removeEventListener("pointermove",onPointer);
    window.removeEventListener("scroll",onScroll);
    document.removeEventListener("visibilitychange",onVisibility);
    glowListeners.forEach(fn=>fn());
    ctx.clearRect(0,0,width,height);
  };
}
