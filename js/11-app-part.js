
/* 해비치 페이지: "내가 만든 부분" → My Role 로 부드럽게 이동 (해시 라우팅과 겹치지 않게) */
(function(){
  var root = document.getElementById('view-haevichi');
  if(!root) return;
  root.addEventListener('click', function(e){
    var a = e.target.closest('[data-hv-goto]'); if(!a) return;
    e.preventDefault();
    var el = document.getElementById(a.getAttribute('data-hv-goto')); if(!el) return;
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: el.getBoundingClientRect().top + window.pageYOffset - 40, behavior: reduce ? 'auto' : 'smooth' });
  });
})();

/* 해비치 모바일 목업: 390px 로 그린 화면을 프레임에 맞춰 축소 · 스크롤바 가리기 · 클릭해야 조작 */
(function(){
  var root = document.getElementById('view-haevichi');
  if(!root) return;
  var phones = [].slice.call(root.querySelectorAll('.hv-phone'));
  if(!phones.length) return;

  /* 이 브라우저의 스크롤바 두께 (윈도우 약 15~17px, 맥 오버레이 방식은 0) */
  var probe = document.createElement('div');
  probe.style.cssText = 'position:absolute;top:-9999px;width:100px;height:100px;overflow:scroll;visibility:hidden';
  document.body.appendChild(probe);
  var sbw = probe.offsetWidth - probe.clientWidth;
  document.body.removeChild(probe);

  phones.forEach(function(ph){
    var screen = ph.querySelector('.hv-phone-screen'), body = ph.querySelector('.hv-phone-body');
    ph.style.setProperty('--sbw', sbw + 'px');
    function fit(){ var w = screen.getBoundingClientRect().width; if(w) ph.style.setProperty('--hvs', (w/390).toFixed(4)); }
    fit();
    if('ResizeObserver' in window) new ResizeObserver(fit).observe(screen);
    window.addEventListener('resize', fit);

    var guard = ph.querySelector('.hv-phone-guard');
    if(guard){
      guard.addEventListener('click', function(){ screen.classList.add('is-live'); });
      body.addEventListener('mouseleave', function(){ screen.classList.remove('is-live'); });
      document.addEventListener('pointerdown', function(e){ if(!body.contains(e.target)) screen.classList.remove('is-live'); });
    }
  });
})();
