
(function(){
  const os=document.getElementById('dasom-os');
  const back=document.getElementById('os-back');
  if(!os||!back)return;
  const html=document.documentElement;
  const details={haevichi:'view-haevichi',lh:'view-lh',apple:'view-apple-tv'};
  function setDesktopScroll(){
    html.classList.remove('case-active-html');
    html.style.setProperty('overflow','hidden','important');
    document.body.classList.remove('case-active');
    document.body.classList.add('os-active');
    document.body.style.setProperty('overflow','hidden','important');
  }
  function setCaseScroll(){
    html.classList.add('case-active-html');
    html.style.setProperty('overflow-x','hidden','important');
    html.style.setProperty('overflow-y','auto','important');
    html.style.setProperty('height','auto','important');
    document.body.classList.remove('os-active');
    document.body.classList.add('case-active');
    document.body.style.setProperty('overflow-x','hidden','important');
    document.body.style.setProperty('overflow-y','auto','important');
    document.body.style.setProperty('height','auto','important');
  }
  function hideDetails(){
    Object.values(details).forEach(id=>{const el=document.getElementById(id);if(el){el.style.setProperty('display','none','important');el.style.setProperty('visibility','hidden','important');}});
  }
  function desktop(){
    hideDetails();
    const legacy=document.getElementById('view-home');if(legacy){legacy.style.setProperty('display','none','important');legacy.style.setProperty('visibility','hidden','important');}
    setDesktopScroll();
    os.style.setProperty('display','block','important');os.style.opacity='1';os.style.pointerEvents='auto';
    back.classList.remove('show');
    window.scrollTo(0,0);
    history.replaceState({v:'desktop'},'',location.pathname+location.search+'#desktop');
  }
  function openCase(key){
    const id=details[key];if(!id)return;
    hideDetails();
    os.style.setProperty('display','none','important');os.style.opacity='0';os.style.pointerEvents='none';
    setCaseScroll();
    const el=document.getElementById(id);
    if(el){el.style.setProperty('display','block','important');el.style.setProperty('visibility','visible','important');el.style.setProperty('opacity','1','important');}
    back.textContent='Dasom OS · 메인으로';back.classList.add('show');
    window.scrollTo({top:0,left:0,behavior:'auto'});
    requestAnimationFrame(()=>window.scrollTo(0,0));
    history.replaceState({v:key},'',location.pathname+location.search+'#'+key);
  }
  // project launch buttons: use our routing only
  document.addEventListener('click',function(e){
    const b=e.target.closest&&e.target.closest('[data-case]');
    if(b&&details[b.dataset.case]){e.preventDefault();e.stopImmediatePropagation();openCase(b.dataset.case);return;}
    const home=e.target.closest&&e.target.closest('#os-back,#back-home,#footer-home,#back-home-lh,#footer-home-lh,#back-home-apple,#footer-home-apple');
    if(home){e.preventDefault();e.stopImmediatePropagation();desktop();}
  },true);
  // browser back/forward
  window.addEventListener('popstate',()=>{
    const h=location.hash.replace('#','');
    if(details[h])openCase(h);else desktop();
  });
  // start state
  const h=location.hash.replace('#','');
  if(details[h])openCase(h);else desktop();
  window.__dasomDesktop=desktop;
  window.__dasomOpenCase=openCase;
})();
