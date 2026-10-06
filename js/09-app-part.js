
(function(){
  const home=document.getElementById('view-home');
  if(!home) return;
  const studio=home.querySelector('.ed-studio-hero');
  const stage=home.querySelector('.ed-workspace-wrap');
  const caption=home.querySelector('.ed-mode-caption');
  const modeButtons=[...home.querySelectorAll('[data-mode]')];
  const workspaces=[...home.querySelectorAll('[data-workspace]')];
  const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const captions={
    'ed-float--swatches':'FIGMA · 색과 화면의 톤을 조정합니다',
    'ed-float--vector':'FIGMA · 벡터와 레이아웃을 다듬습니다',
    'ed-float--shapes':'FIGMA · 컴포넌트의 형태를 만듭니다',
    'ed-float--cursor':'FIGMA · 사용 흐름을 살펴 설계합니다',
    'ed-float--brackets':'VS CODE · HTML 구조를 구현합니다',
    'ed-float--terminal':'VS CODE · 작업 결과를 확인합니다',
    'ed-float--css':'VS CODE · 화면 스타일을 완성합니다',
    'ed-float--nodes':'VS CODE · 상호작용을 연결합니다'
  };
  function setMode(mode,source){
    stage.dataset.currentMode=mode;
    modeButtons.forEach(button=>button.setAttribute('aria-pressed',String(button.classList.contains('ed-float')?button===source:button.dataset.mode===mode)));
    workspaces.forEach(view=>{
      const active=view.dataset.workspace===mode;
      view.classList.toggle('is-active',active);
      view.setAttribute('aria-hidden',String(!active));
      view.inert=!active;
    });
    const tool=source && source.classList.contains('ed-float')?Object.keys(captions).find(key=>source.classList.contains(key)):null;
    stage.dataset.activeTool=tool?tool.replace('ed-float--',''):'';
    caption.textContent=(tool && captions[tool]) || (mode==='figma'?'FIGMA · 화면의 구조와 흐름을 설계합니다':'VS CODE · 화면의 반응을 직접 구현합니다');
  }
  modeButtons.forEach(button=>button.addEventListener('click',()=>setMode(button.dataset.mode,button)));
  setMode('figma');

  if(!reduce && matchMedia('(pointer:fine)').matches){
    home.querySelectorAll('.ed-float').forEach(button=>{
      button.addEventListener('pointermove',e=>{
        const rect=button.getBoundingClientRect();
        button.style.setProperty('--mx',(((e.clientX-rect.left)/rect.width-.5)*8).toFixed(1)+'px');
        button.style.setProperty('--my',(((e.clientY-rect.top)/rect.height-.5)*8).toFixed(1)+'px');
      },{passive:true});
      button.addEventListener('pointerleave',()=>{button.style.setProperty('--mx','0px');button.style.setProperty('--my','0px')});
    });
  }

  const rows=[...home.querySelectorAll('.pf-projects .pf-row')];
  const veil=studio.querySelector('.hy-hero-veil');
  const liveFrames=[...home.querySelectorAll('.pf-projects .hy-live-frame')];
  const resizeFrames=()=>liveFrames.forEach(frame=>{
    const screen=frame.parentElement;
    const designWidth=Number(frame.dataset.designWidth)||390;
    const designHeight=Number(frame.dataset.designHeight)||844;
    const phone=frame.dataset.phone==='true';
    const inset=phone?Math.round(screen.clientWidth/designWidth*30):0;
    const scale=phone?Math.min(screen.clientWidth/designWidth,(screen.clientHeight-inset)/designHeight):screen.clientWidth/designWidth;
    frame.style.width=(designWidth+20)+'px';
    frame.style.height=designHeight+'px';
    frame.style.setProperty('--hy-frame-scale',String(scale));
    frame.style.setProperty('--hy-frame-top',inset+'px');
    frame.style.setProperty('--hy-frame-left',Math.max(0,(screen.clientWidth-designWidth*scale)/2)+'px');
  });
  if(window.ResizeObserver){
    const observer=new ResizeObserver(resizeFrames);
    liveFrames.forEach(frame=>observer.observe(frame.parentElement));
  }
  window.addEventListener('resize',resizeFrames,{passive:true});
  requestAnimationFrame(resizeFrames);
  if(!reduce && window.gsap && window.ScrollTrigger){
    gsap.registerPlugin(ScrollTrigger);
    
    
    rows.forEach(row=>{
      
    });
    ScrollTrigger.refresh();
  }else if(!reduce){
    let queued=false;
    const update=()=>{
      const vh=window.innerHeight;
      const heroRect=studio.getBoundingClientRect();
      const p=Math.max(0,Math.min(1,-heroRect.top/Math.max(1,heroRect.height-vh*.65)));
      stage.style.opacity=String(1-p*.8);
      stage.style.translate='0 '+(-p*95)+'px';
      veil.style.opacity=String(Math.max(0,(p-.45)/.55));
      rows.forEach(row=>{
        const r=row.getBoundingClientRect();
        const x=Math.max(0,Math.min(1,(vh*.9-r.top)/(vh*.6)));
        row.style.opacity=String(.15+.85*x);
        row.style.translate='0 '+((1-x)*75)+'px';
      });
      queued=false;
    };
    const schedule=()=>{if(!queued){queued=true;requestAnimationFrame(update)}};
    window.addEventListener('scroll',schedule,{passive:true});
    window.addEventListener('resize',schedule,{passive:true});
    schedule();
  }
  new MutationObserver(()=>{
    if(home.style.display!=='none' && window.ScrollTrigger) requestAnimationFrame(()=>ScrollTrigger.refresh());
  }).observe(home,{attributes:true,attributeFilter:['style']});
})();


/* ============================================================
   HOME 인터랙션 (nav · reveal · parallax · tilt · toast) + 라우팅
   ============================================================ */
(function(){
  var home = document.getElementById('view-home');
  if(!home) return;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var NAV_H = 76;
  function isHomeVisible(){ return home.style.display !== 'none'; }

  /* ---------- toast ---------- */
  var toast = document.getElementById('pfToast'), toastTimer;
  function showToast(msg){
    if(!toast) return;
    toast.textContent = msg; toast.classList.add('is-show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function(){ toast.classList.remove('is-show'); }, 2200);
  }
  /* ---------- 배너 크게 보기 (라이트박스) ---------- */
  var lb = document.getElementById('pfLightbox'), lbFrom = null;
  function openLightbox(card){
    var img = card.querySelector('.pf-thumb-img'); if(!lb || !img) return;
    var li = lb.querySelector('img'); li.src = img.currentSrc || img.src; li.alt = img.alt;
    lb.querySelector('figcaption').textContent = img.alt;
    lbFrom = card; lb.classList.add('is-open'); lb.setAttribute('aria-hidden','false');
    document.body.style.overflow = 'hidden';
    lb.querySelector('.pf-lb-close').focus({ preventScroll:true });
  }
  function closeLightbox(){
    if(!lb || !lb.classList.contains('is-open')) return;
    lb.classList.remove('is-open'); lb.setAttribute('aria-hidden','true');
    document.body.style.overflow = '';
    if(lbFrom){ lbFrom.focus({ preventScroll:true }); lbFrom = null; }
  }
  if(lb){
    lb.addEventListener('click', function(e){ if(e.target === lb || e.target.closest('.pf-lb-close')) closeLightbox(); });
    document.addEventListener('keydown', function(e){ if(e.key === 'Escape') closeLightbox(); });
  }

  home.addEventListener('click', function(e){
    var lbCard = e.target.closest('[data-lightbox]');
    if(lbCard){ e.preventDefault(); openLightbox(lbCard); return; }
    var soon = e.target.closest('[data-soon]');
    if(soon){ e.preventDefault(); showToast(soon.getAttribute('data-soon')); return; }
    var a = e.target.closest('a[href="#"]');       /* 아직 연결 전인 링크가 맨 위로 튀지 않게 */
    if(a) e.preventDefault();
  });

  /* ---------- nav: 부드러운 이동 · 현재 위치 · 스크롤 그림자 ---------- */
  var nav = home.querySelector('.pf-nav');
  var links = [].slice.call(home.querySelectorAll('.pf-links a'));
  function scrollToId(id){
    var t = document.getElementById(id);
    var y = id === 'top' ? 0 : t.getBoundingClientRect().top + window.pageYOffset - NAV_H + 1;
    window.scrollTo({ top:y, behavior: reduce ? 'auto' : 'smooth' });
  }
  home.querySelectorAll('.pf-nav a[href^="#"]').forEach(function(a){
    a.addEventListener('click', function(e){
      var id = a.getAttribute('href').slice(1);
      if(id !== 'top' && !document.getElementById(id)) return;
      e.preventDefault(); scrollToId(id);
    });
  });
  var spyIds = ['branding','ai','contact'];
  var spyHref = { branding:'#branding', ai:'#ai', contact:'#contact' };
  function updateSpy(){
    var line = window.innerHeight*.42, cur = null;
    spyIds.forEach(function(id){
      var el = document.getElementById(id); if(!el) return;
      var r = el.getBoundingClientRect();
      if(r.top <= line && r.bottom > line) cur = id;
    });
    links.forEach(function(l){ l.classList.toggle('is-active', !!cur && l.getAttribute('href') === spyHref[cur]); });
  }
  if('IntersectionObserver' in window){
    /* ---------- reveal ---------- */
    var revealIO = new IntersectionObserver(function(entries){
      entries.forEach(function(en){
        if(en.isIntersecting){ en.target.classList.add('is-in'); revealIO.unobserve(en.target); }
      });
    }, { threshold:.14, rootMargin:'0px 0px -6% 0px' });
    home.querySelectorAll('.pf-reveal').forEach(function(el){ revealIO.observe(el); });
  }else{
    home.querySelectorAll('.pf-reveal').forEach(function(el){ el.classList.add('is-in'); });
  }

  /* ---------- scroll: nav 그림자 + 이미지 패럴랙스 ---------- */
  var para = [].slice.call(home.querySelectorAll('.pf-parallax'));
  var ticking = false;
  function onScroll(){
    if(ticking) return; ticking = true;
    requestAnimationFrame(function(){
      ticking = false;
      if(!isHomeVisible()) return;
      nav.classList.toggle('is-scrolled', window.pageYOffset > 8);
      updateSpy();
      if(reduce) return;
      var vh = window.innerHeight;
      para.forEach(function(el){
        var r = el.parentNode.getBoundingClientRect();
        if(r.bottom < -200 || r.top > vh + 200) return;
        var d = (r.top + r.height/2 - vh/2) * parseFloat(el.getAttribute('data-speed') || 0);
        el.style.transform = 'translate3d(0,' + (-d).toFixed(1) + 'px,0)';
      });
    });
  }
  window.addEventListener('scroll', onScroll, { passive:true });
  window.addEventListener('resize', onScroll);
  onScroll();

  /* ============================================================
     라우팅: 프로젝트 클릭 → 상세 페이지, 브라우저 뒤로가기 → 홈(스크롤 위치 복원)
     기존 goView() 를 감싸서 history 만 얹는다.
     ============================================================ */
  if(typeof window.goView !== 'function') return;
  var rawGo = window.goView;
  var current = 'home', homeY = 0, fromPop = false;

  function normalize(n){ return (n === 'haevichi' || n === 'lh') ? n : 'home'; }
  function urlFor(n){ return n === 'home' ? (location.pathname + location.search) : ('#' + n); }

  window.goView = function(name){
    name = normalize(name);
    if(name === current){ rawGo(name); return; }
    if(current === 'home') homeY = window.pageYOffset;
    var leavingTo = name;
    rawGo(name);
    if(!fromPop){ try{ history.pushState({ v:name }, '', urlFor(name)); }catch(_){} }
    current = name;
    if(leavingTo === 'home' && homeY > 0){                 /* 홈으로 돌아오면 보던 자리로 */
      setTimeout(function(){ window.scrollTo(0, homeY); onScroll(); }, 280);
    }
  };

  window.addEventListener('popstate', function(e){
    var name = normalize((e.state && e.state.v) || location.hash.slice(1));
    fromPop = true; window.goView(name); fromPop = false;
  });

  /* 딥링크: …#haevichi / …#lh 로 바로 들어온 경우 */
  var first = normalize(location.hash.slice(1));
  if(first !== 'home'){
    try{ history.replaceState({ v:'home' }, '', location.pathname + location.search); }catch(_){}
    window.goView(first);
  }else{
    try{ history.replaceState({ v:'home' }, ''); }catch(_){}
  }
})();
