
(function(){
  const ids=['view-haevichi','view-lh','view-apple-tv'];
  function activeCase(){return ids.map(id=>document.getElementById(id)).find(el=>el&&getComputedStyle(el).display!=='none'&&getComputedStyle(el).visibility!=='hidden');}
  function resetCaseScroll(){const el=activeCase(); if(el){el.scrollTop=0; requestAnimationFrame(()=>{el.scrollTop=0;});}}
  // Older routing code still handles navigation. We only normalize scroll after the route changes.
  const obs=new MutationObserver(()=>{ if(document.body.classList.contains('case-active')) resetCaseScroll(); });
  obs.observe(document.body,{attributes:true,attributeFilter:['class']});
  window.addEventListener('hashchange',()=>setTimeout(resetCaseScroll,0));
  document.addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('[data-case]'); if(b) setTimeout(resetCaseScroll,0);},false);
  // wheel fallback: if a case is active, ensure wheel always scrolls the case container.
  window.addEventListener('wheel',function(e){
    if(!document.body.classList.contains('case-active')) return;
    const el=activeCase(); if(!el) return;
    if(e.target.closest && e.target.closest('input,textarea,select,[contenteditable="true"]')) return;
    if(el.scrollHeight>el.clientHeight){ el.scrollTop += e.deltaY; e.preventDefault(); }
  },{passive:false});
  window.__dasomActiveCaseScroll=()=>{const el=activeCase();return el?{id:el.id,scrollTop:el.scrollTop,scrollHeight:el.scrollHeight,clientHeight:el.clientHeight}:null};
})();
