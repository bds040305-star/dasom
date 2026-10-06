
(function(){
  const os=document.getElementById('dasom-os');
  const back=document.getElementById('os-back');
  if(!os)return;
  document.body.classList.add('os-active');
  const wins={lh:document.getElementById('win-lh'),haevichi:document.getElementById('win-haevichi'),apple:document.getElementById('win-apple'),wells:document.getElementById('win-wells'),about:document.getElementById('win-about')};
  let z=100;
  function closeAll(){Object.values(wins).forEach(w=>w&&w.classList.remove('open'));}
  function openWin(key){if(key==='contact'){window.open('https://github.com/bds040305-star','_blank');return;}const w=wins[key];if(!w)return;closeAll();w.style.zIndex=++z;w.classList.add('open');}
  document.querySelectorAll('#dasom-os .os-file').forEach(el=>{let timer;el.addEventListener('click',()=>{document.querySelectorAll('.os-file').forEach(x=>x.classList.remove('selected'));el.classList.add('selected');clearTimeout(timer);timer=setTimeout(()=>el.classList.remove('selected'),1400)});el.addEventListener('dblclick',()=>openWin(el.dataset.project));});
  document.querySelectorAll('[data-open]').forEach(el=>el.addEventListener('click',()=>openWin(el.dataset.open)));
  document.querySelectorAll('[data-close]').forEach(b=>b.addEventListener('click',()=>b.closest('.os-window').classList.remove('open')));
  document.querySelectorAll('[data-min]').forEach(b=>b.addEventListener('click',()=>b.closest('.os-window').classList.remove('open')));
  document.querySelectorAll('[data-max]').forEach(b=>b.addEventListener('click',()=>b.closest('.os-window').classList.toggle('max')));
  function launchCase(key){
    const map={lh:'open-lh',haevichi:'open-haevichi',apple:'open-apple-tv',wells:'open-wells'};
    const target=document.getElementById(map[key]);
    os.style.opacity='0';os.style.pointerEvents='none';document.body.classList.remove('os-active');back.classList.add('show');
    setTimeout(()=>{os.style.display='none'; if(target) target.click(); else if(key==='wells'){document.getElementById('view-home')?.scrollIntoView();}},220);
  }
  document.querySelectorAll('[data-case]').forEach(b=>b.addEventListener('click',()=>launchCase(b.dataset.case)));
  back.addEventListener('click',()=>{location.hash='';document.querySelectorAll('#view-home,#view-haevichi,#view-lh,#view-apple-tv').forEach((v,i)=>{if(v)v.style.display=i===0?'block':'none'});os.style.display='block';requestAnimationFrame(()=>{os.style.opacity='1';os.style.pointerEvents='auto'});document.body.classList.add('os-active');back.classList.remove('show');closeAll();});
  const clock=document.getElementById('os-clock');function tick(){const d=new Date();clock.textContent=d.toLocaleTimeString('ko-KR',{hour:'2-digit',minute:'2-digit',hour12:false});}tick();setInterval(tick,30000);
  // draggable windows
  document.querySelectorAll('.os-window').forEach(w=>{const bar=w.querySelector('.window-bar');let drag=false,sx=0,sy=0,ox=0,oy=0;bar.addEventListener('mousedown',e=>{if(e.target.closest('button'))return;drag=true;w.style.transition='none';const r=w.getBoundingClientRect();sx=e.clientX;sy=e.clientY;ox=r.left;oy=r.top;w.style.left=r.left+'px';w.style.top=r.top+'px';w.style.transform='none';w.style.zIndex=++z;});window.addEventListener('mousemove',e=>{if(!drag)return;w.style.left=ox+(e.clientX-sx)+'px';w.style.top=oy+(e.clientY-sy)+'px';});window.addEventListener('mouseup',()=>{drag=false;w.style.transition='';});});
})();
