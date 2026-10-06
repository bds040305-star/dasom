
(function(){
  const os=document.getElementById('dasom-os');
  if(!os) return;
  // Start on the workspace only. Underlying legacy home is never allowed to leak through.
  const legacy=['view-home','view-haevichi','view-lh','view-apple-tv'];
  function hideLegacy(){legacy.forEach(id=>{const e=document.getElementById(id);if(e){e.style.setProperty('display','none','important');e.style.setProperty('visibility','hidden','important')}})}
  function showWorkspace(){hideLegacy();os.style.display='block';os.style.opacity='1';os.style.pointerEvents='auto';document.body.classList.add('os-active');window.scrollTo(0,0)}
  showWorkspace();
  window.addEventListener('pageshow',()=>{if(!location.hash || location.hash==='#home') showWorkspace()});
  // Remove all old click behavior from back control by replacing it.
  const old=document.getElementById('os-back');
  if(old){const back=old.cloneNode(true);old.replaceWith(back);back.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();document.querySelectorAll('.dos-window').forEach(w=>w.classList.remove('is-open','is-minimized','is-max'));showWorkspace();back.classList.remove('show');history.replaceState(null,'',location.pathname+location.search)});}
  // Improve desktop selection behavior.
  const files=[...os.querySelectorAll('.dos-file')];
  files.forEach(f=>f.addEventListener('click',()=>{files.forEach(x=>x.classList.remove('is-selected'));f.classList.add('is-selected')}));
  os.addEventListener('click',e=>{if(!e.target.closest('.dos-file')&&!e.target.closest('.dos-window')&&!e.target.closest('.dos-dock')) files.forEach(x=>x.classList.remove('is-selected'))});
  // Add a realistic current-date fallback if the existing updater has not run.
  const d=document.getElementById('dos-date'),c=document.getElementById('os-clock');
  function tick(){const now=new Date();if(d)d.textContent=now.toLocaleDateString('ko-KR',{month:'short',day:'numeric',weekday:'short'}).replaceAll('.','');if(c)c.textContent=now.toLocaleTimeString('ko-KR',{hour:'numeric',minute:'2-digit'})}
  tick();setInterval(tick,30000);
})();
