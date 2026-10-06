
(function(){
  const os=document.getElementById('dasom-os');
  const back=document.getElementById('os-back');
  if(!os||!back)return;
  const detailIds=['view-haevichi','view-lh','view-apple-tv'];
  function hideAllDetails(){detailIds.forEach(id=>{const el=document.getElementById(id);if(el){el.style.setProperty('display','none','important');el.style.setProperty('visibility','hidden','important');}});}
  function toDesktop(){
    hideAllDetails();
    const old=document.getElementById('view-home');if(old){old.style.setProperty('display','none','important');old.style.setProperty('visibility','hidden','important');}
    document.body.classList.remove('case-active');document.body.classList.add('os-active');
    os.style.display='block';os.style.opacity='1';os.style.pointerEvents='auto';
    back.classList.remove('show');window.scrollTo(0,0);
    try{history.replaceState({v:'desktop'},'',location.pathname+location.search+'#desktop')}catch(_){ }
  }
  function enterCase(key){
    const map={haevichi:'view-haevichi',lh:'view-lh',apple:'view-apple-tv'};
    const id=map[key];if(!id)return;
    hideAllDetails();
    os.style.display='none';os.style.opacity='0';os.style.pointerEvents='none';
    document.body.classList.remove('os-active');document.body.classList.add('case-active');
    const el=document.getElementById(id);if(el){el.style.setProperty('display','block','important');el.style.setProperty('visibility','visible','important');el.style.opacity='1';}
    back.classList.add('show');window.scrollTo(0,0);
    try{history.replaceState({v:key},'',location.pathname+location.search+'#'+key)}catch(_){ }
  }
  // Capture project-case buttons before legacy handlers can fire.
  document.addEventListener('click',function(e){
    const b=e.target.closest&&e.target.closest('[data-case]');if(!b)return;
    const key=b.dataset.case;if(!['haevichi','lh','apple'].includes(key))return;
    e.preventDefault();e.stopImmediatePropagation();enterCase(key);
  },true);
  // Make all existing case-study back links return to Dasom OS instead of the deprecated home.
  document.addEventListener('click',function(e){
    const a=e.target.closest&&e.target.closest('#os-back,#back-home,#footer-home,#back-home-lh,#footer-home-lh,#back-home-apple,#footer-home-apple');
    if(!a)return;e.preventDefault();e.stopImmediatePropagation();toDesktop();
  },true);
  // Archive/window controls added in v5.
  document.querySelectorAll('#win-archive [data-open]').forEach(btn=>btn.addEventListener('click',()=>window.__dasomOpenWin&&window.__dasomOpenWin(btn.dataset.open)));
  // Add a convenient Github menu item into the OS menubar click target (link itself already exists).
  hideAllDetails();
  if(location.hash==='#lh')enterCase('lh');else if(location.hash==='#haevichi')enterCase('haevichi');else if(location.hash==='#apple')enterCase('apple');else toDesktop();
})();
