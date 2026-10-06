
(function(){
  const os=document.getElementById('dasom-os'); if(!os) return;
  document.body.classList.add('os-active');
  const back=document.getElementById('os-back');
  const activeApp=document.getElementById('dos-active-app');
  const wins=[...os.querySelectorAll('.dos-window')]; let z=1000;
  const toast=document.getElementById('os-toast'); let toastTimer;
  function flash(msg){toast.textContent=msg;toast.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove('show'),1100)}
  function closeAll(){wins.forEach(w=>w.classList.remove('is-open','is-minimized','is-max'));activeApp.textContent='Finder'}
  function focusWin(w){z+=2;w.style.zIndex=z;activeApp.textContent=w.dataset.app||'Finder'}
  function openWin(key){
    const id=key==='finder'?'win-finder':'win-'+key; const w=document.getElementById(id); if(!w) return;
    w.classList.remove('is-minimized');w.classList.add('is-open');focusWin(w);
  }
  window.__dasomOpenWin=openWin;
  os.querySelectorAll('.dos-file').forEach(file=>{
    let t=null;
    file.addEventListener('click',e=>{os.querySelectorAll('.dos-file').forEach(x=>x.classList.remove('is-selected'));file.classList.add('is-selected');clearTimeout(t);t=setTimeout(()=>flash('더블클릭해서 열기'),180)});
    file.addEventListener('dblclick',e=>{clearTimeout(t);openWin(file.dataset.project)});
  });
  os.querySelectorAll('[data-open]').forEach(b=>b.addEventListener('click',()=>openWin(b.dataset.open)));
  os.querySelectorAll('.finder-file').forEach(b=>b.addEventListener('dblclick',()=>openWin(b.dataset.project)));
  os.querySelectorAll('.dos-window').forEach(w=>{
    w.addEventListener('pointerdown',()=>focusWin(w));
    w.querySelectorAll('[data-close]').forEach(b=>b.addEventListener('click',()=>{w.classList.remove('is-open','is-max','is-minimized');activeApp.textContent='Finder'}));
    w.querySelectorAll('[data-min]').forEach(b=>b.addEventListener('click',()=>w.classList.add('is-minimized')));
    w.querySelectorAll('[data-max]').forEach(b=>b.addEventListener('click',()=>w.classList.toggle('is-max')));
    const bar=w.querySelector('.dos-window-bar'); if(!bar) return; let drag=false,sx=0,sy=0,sl=0,st=0;
    bar.addEventListener('pointerdown',e=>{if(e.target.closest('button'))return;drag=true;w.classList.remove('is-max');const r=w.getBoundingClientRect();sx=e.clientX;sy=e.clientY;sl=r.left;st=r.top;w.style.transform='none';w.style.left=sl+'px';w.style.top=st+'px';bar.setPointerCapture?.(e.pointerId)});
    bar.addEventListener('pointermove',e=>{if(!drag)return;w.style.left=(sl+e.clientX-sx)+'px';w.style.top=(st+e.clientY-sy)+'px'});
    bar.addEventListener('pointerup',()=>drag=false);
  });
  function showOS(){
    ['view-home','view-haevichi','view-lh','view-apple-tv'].forEach(id=>{const el=document.getElementById(id);if(el)el.style.display='none'});
    os.style.display='block';os.style.opacity='1';os.style.pointerEvents='auto';document.body.classList.add('os-active');back.classList.remove('show');closeAll();window.scrollTo(0,0);
    try{history.replaceState({v:'desktop'},'',location.pathname+location.search+'#desktop')}catch(_){ }
  }
  function launchCase(key){
    if(key==='wells'){openWin('wells');flash('Wells 상세는 프로토타입 창에서 확인해 주세요');return}
    const name=key==='apple'?'apple-tv':key;
    os.style.opacity='0';os.style.pointerEvents='none';document.body.classList.remove('os-active');back.classList.add('show');
    setTimeout(()=>{
      os.style.display='none';
      if(name==='apple-tv'){
        ['view-home','view-haevichi','view-lh'].forEach(id=>{const el=document.getElementById(id);if(el)el.style.display='none'});
        const apple=document.getElementById('view-apple-tv'); if(apple){apple.style.display='block';apple.style.opacity='1';window.scrollTo(0,0)}
      }else if(typeof window.goView==='function'){ window.goView(name); }
      else {const v=document.getElementById('view-'+name);if(v){v.style.display='block';window.scrollTo(0,0)}}
    },220);
  }
  os.querySelectorAll('[data-case]').forEach(b=>b.addEventListener('click',()=>launchCase(b.dataset.case)));
  back.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();showOS()},{capture:true});
  document.addEventListener('click',e=>{
    const a=e.target.closest && e.target.closest('#back-home,#back-home-lh,#footer-home,#footer-home-lh,#back-home-apple,#footer-home-apple');
    if(!a)return;e.preventDefault();e.stopImmediatePropagation();showOS();
  },true);
  // Never let the deprecated tomato home become visible.
  const oldHome=document.getElementById('view-home');if(oldHome)oldHome.style.setProperty('display','none','important');
  const date=document.getElementById('dos-date'),clock=document.getElementById('os-clock');
  function tick(){const d=new Date();if(date)date.textContent=d.toLocaleDateString('ko-KR',{month:'numeric',day:'numeric',weekday:'short'});if(clock)clock.textContent=d.toLocaleTimeString('ko-KR',{hour:'2-digit',minute:'2-digit',hour12:false})}tick();setInterval(tick,30000);
  // Dock magnification based on cursor distance, closer to macOS than a simple hover.
  const dock=document.getElementById('dos-dock');if(dock){dock.addEventListener('mousemove',e=>{[...dock.querySelectorAll('.dos-dock-icon')].forEach(icon=>{const r=icon.getBoundingClientRect(),cx=r.left+r.width/2,dist=Math.abs(e.clientX-cx),s=1+Math.max(0,1-dist/110)*.34;icon.style.transform=`translateY(${-Math.max(0,1-dist/110)*10}px) scale(${s})`;icon.style.margin=`0 ${Math.max(0,1-dist/110)*5}px`})});dock.addEventListener('mouseleave',()=>dock.querySelectorAll('.dos-dock-icon').forEach(i=>{i.style.transform='';i.style.margin=''}))}
  showOS();
})();
