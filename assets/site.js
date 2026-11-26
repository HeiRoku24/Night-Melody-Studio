{
/* language: shared with the Momjjang Yongsa page through the same saved key */
const root=document.documentElement;
const setLang=l=>{root.classList.toggle('en',l==='en');root.lang=l;
  document.querySelectorAll('button.lang').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.set===l)));
  const t=root.dataset['title'+(l==='en'?'En':'Ko')];if(t)document.title=t;
  try{localStorage.setItem('mjy-lang',l);}catch(e){}};
let saved=null;try{saved=localStorage.getItem('mjy-lang');}catch(e){}
setLang(saved==='en'?'en':'ko');
document.querySelectorAll('button.lang').forEach(b=>b.addEventListener('click',()=>setLang(b.dataset.set)));

/* copy the contact address */
document.querySelectorAll('button.copy').forEach(b=>b.addEventListener('click',async()=>{
  const ko=b.querySelector('[data-l=ko]'),en=b.querySelector('[data-l=en]');
  const done=(k,e)=>{if(ko)ko.textContent=k;if(en)en.textContent=e;setTimeout(()=>{if(ko)ko.textContent='주소 복사';if(en)en.textContent='Copy address';},1800);};
  try{await navigator.clipboard.writeText(b.dataset.copy);done('복사했어요','Copied');}catch(e){done('직접 선택해 복사해 주세요','Please select and copy it');}}));

/* night sky: twinkling stars and a rare shooting star, only while on screen */
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
document.querySelectorAll('canvas.sky').forEach(cv=>{
  const c=cv.getContext('2d');let W=0,H=0,stars=[],shoot=null,vis=false,raf=0;const dpr=Math.min(2,devicePixelRatio||1);
  const size=()=>{W=cv.clientWidth;H=cv.clientHeight;cv.width=W*dpr;cv.height=H*dpr;c.setTransform(dpr,0,0,dpr,0,0);
    stars=Array.from({length:Math.min(260,Math.round(W*H/4800))},()=>({x:Math.random()*W,y:Math.random()*H,r:Math.random()*1.2+.3,p:Math.random()*6.3,s:Math.random()*1.4+.4,g:Math.random()<.12}));};
  const draw=t=>{c.clearRect(0,0,W,H);
    for(const s of stars){c.globalAlpha=RM?.7:.2+.8*Math.abs(Math.sin(s.p+t*.001*s.s));c.fillStyle=s.g?'#F6C445':'#DFF3EC';c.beginPath();c.arc(s.x,s.y,s.r,0,6.283);c.fill();}
    if(!RM){if(!shoot&&Math.random()<.005)shoot={x:W*(.4+Math.random()*.6),y:H*Math.random()*.35,l:0};
      if(shoot){shoot.l++;const x=shoot.x-shoot.l*8,y=shoot.y+shoot.l*4;const g=c.createLinearGradient(x,y,x+120,y-60);g.addColorStop(0,'rgba(255,248,221,.9)');g.addColorStop(1,'rgba(255,248,221,0)');
        c.globalAlpha=Math.max(0,Math.min(1,(55-shoot.l)/18));c.strokeStyle=g;c.lineWidth=2;c.beginPath();c.moveTo(x,y);c.lineTo(x+120,y-60);c.stroke();if(shoot.l>55)shoot=null;}}
    c.globalAlpha=1;if(vis&&!RM)raf=requestAnimationFrame(draw);};
  const ro=new ResizeObserver(()=>{size();draw(0);});ro.observe(cv);
  const io=new IntersectionObserver(es=>{vis=es[0].isIntersecting;cancelAnimationFrame(raf);if(vis&&!RM)raf=requestAnimationFrame(draw);});io.observe(cv);
});
}
