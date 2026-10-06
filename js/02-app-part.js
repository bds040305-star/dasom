

const IMAGES = {"lh-home": "assets/images/035-js-image-02-9e8bb635233f.png", "lh-condition": "assets/images/036-js-image-02-e43bce88e63a.png", "lh-list": "assets/images/037-js-image-02-cdcdac3827c9.png", "before-facility-twinpool": "assets/images/038-js-image-02-185cfd2af708.jpg", "after-facility-twinpool": "assets/images/039-js-image-02-4f0fa863f6b2.jpg", "after-full-page": "assets/images/040-js-image-02-7ba4aeeb9f47.jpg", "before-live-site": "assets/images/041-js-image-02-2ac03642022f.jpg", "ia-map": "assets/images/042-js-image-02-fa37f9ff939e.jpg", "before-rooms": "assets/images/043-js-image-02-a66ec6a74fad.jpg", "after-rooms": "assets/images/044-js-image-02-0a9758b2a0c2.jpg", "before-moments": "assets/images/045-js-image-02-c782f7d5f8dd.jpg", "before-hashtag": "assets/images/046-js-image-02-b82ccced61f4.jpg", "before-home": "assets/images/047-js-image-02-c2e667ebff39.jpg", "thumb-hero-2": "assets/images/048-js-image-02-1eeec9a7e9e0.jpg", "ds-colors": "assets/images/049-js-image-02-69017c8e4c9a.jpg", "ds-typography": "assets/images/050-js-image-02-7f949dfbb2bc.jpg", "ds-buttons": "assets/images/051-js-image-02-47d77018c6fd.jpg", "thumb-hero-3": "assets/images/052-js-image-02-b025fa74659a.jpg", "before-offer": "assets/images/053-js-image-02-379b581b1bef.jpg", "after-hero-1": "assets/images/054-js-image-02-6ad028d25d62.jpg", "after-hero-2": "assets/images/055-js-image-02-d69017ec367d.jpg", "ds-navigation": "assets/images/056-js-image-02-e45634df5e02.jpg", "after-hero-main": "assets/images/057-js-image-02-4f28bad7feff.jpg", "ds-spacing": "assets/images/058-js-image-02-8143df9ad3c9.jpg", "wireframe": "assets/images/059-js-image-02-63ccae90273f.jpg", "after-concierge-membership": "assets/images/060-js-image-02-d5c622485cd7.jpg", "after-facility": "assets/images/061-js-image-02-4e8c77f6ffec.jpg", "ux-test-renewal": "assets/images/062-js-image-02-30902b5ae7b1.jpg", "after-hero-3": "assets/images/063-js-image-02-02275920398b.jpg", "thumb-hero-4": "assets/images/064-js-image-02-a98d08f35abc.jpg", "after-hero-4": "assets/images/065-js-image-02-ee4a82e180b9.jpg", "ds-bookingbar": "assets/images/066-js-image-02-46446d67ba3b.jpg", "callout-facility-all": "assets/images/067-js-image-02-cf46a1340dcd.jpg", "resv-compare": "assets/images/068-js-image-02-a8e560fa0100.jpg", "login-guest": "assets/images/069-js-image-02-35fd3f65e7e7.jpg", "fac-convenience1": "assets/images/070-js-image-02-0258b31df461.jpg", "fac-convenience2": "assets/images/071-js-image-02-0814a2f8100d.jpg", "fac-convenience3": "assets/images/072-js-image-02-f9a4e8d728b9.jpg", "fac-fitness1": "assets/images/073-js-image-02-a1936a248ece.jpg", "fac-fitness2": "assets/images/074-js-image-02-93ee0426ba84.jpg", "fac-fitness3": "assets/images/075-js-image-02-6f68f747d356.jpg", "fac-fitness4": "assets/images/076-js-image-02-c495a8dfd309.jpg", "fac-gallery1": "assets/images/077-js-image-02-d38161886422.jpg", "fac-kids1": "assets/images/078-js-image-02-a34a05051f50.jpg", "fac-kids2": "assets/images/079-js-image-02-d541779c1a4c.jpg", "after-offer": "assets/images/080-js-image-02-d5f3ebb518d4.jpg", "ux-test-current": "assets/images/081-js-image-02-b4d0186fba51.jpg", "ux-questions": "assets/images/082-js-image-02-9c2ccb8feab3.jpg", "before-event": "assets/images/083-js-image-02-9c9f2798089d.jpg", "after-dining": "assets/images/084-js-image-02-fa21dbbb6257.jpg", "thumb-hero-1": "assets/images/085-js-image-02-0aa3bcc78876.jpg"};
document.querySelectorAll('img[data-img]').forEach(function(img){
  var key = img.getAttribute('data-img');
  if(IMAGES[key]) img.src = IMAGES[key];
});

function goView(name){
  var showHaevichi = (name === 'haevichi');
  var showLh = (name === 'lh');
  var showApple = (name === 'apple-tv');
  var showHome = !showHaevichi && !showLh && !showApple;
  var appleEl = document.getElementById('view-apple-tv');
  var homeEl = document.getElementById('view-home');
  var haeEl = document.getElementById('view-haevichi');
  var lhEl = document.getElementById('view-lh');

  function applyDisplay(){
    homeEl.style.display = showHome ? 'block' : 'none';
    haeEl.style.display = showHaevichi ? 'block' : 'none';
    lhEl.style.display = showLh ? 'block' : 'none';
    appleEl.style.display = showApple ? 'block' : 'none';
    window.scrollTo(0,0);
    if(showHaevichi){ heroEntrance('view-haevichi'); initSectionReveal('view-haevichi'); }
    if(showLh){ heroEntrance('view-lh'); initSectionReveal('view-lh'); }
    if(showHome){ heroEntrance('view-home'); }
  }

  if(!goView._ran){
    goView._ran = true;
    applyDisplay();
    return;
  }

  var outgoing = [homeEl, haeEl, lhEl, appleEl].find(function(el){ return el.style.display !== 'none'; });
  if(outgoing) outgoing.classList.add('view-fading');

  setTimeout(function(){
    applyDisplay();
    if(outgoing) outgoing.classList.remove('view-fading');
    var incoming = showApple ? appleEl : (showHaevichi ? haeEl : (showLh ? lhEl : homeEl));
    incoming.classList.add('view-entering');
    requestAnimationFrame(function(){
      requestAnimationFrame(function(){ incoming.classList.remove('view-entering'); });
    });
  }, 200);
}

/* ---- Hero entrance ---- */
function heroEntrance(scopeId){
  if(typeof gsap === 'undefined') return;
  var scope = scopeId ? '#' + scopeId + ' ' : '';
  gsap.fromTo(scope + '.hero-anim', {opacity:0, y:30},
    {opacity:1, y:0, duration:0.9, ease:'power2.out', stagger:0.08});
  gsap.fromTo(scope + '.hero-anim-2', {opacity:0, y:24},
    {opacity:1, y:0, duration:0.9, ease:'power2.out', delay:0.25, stagger:0.1});
}

/* ---- Section reveal on scroll ---- */
var sectionRevealInitMap = {};
function initSectionReveal(scopeId){
  if(typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);
  if(sectionRevealInitMap[scopeId]){ ScrollTrigger.refresh(); return; }
  sectionRevealInitMap[scopeId] = true;
  document.querySelectorAll('#' + scopeId + ' .section .wrap').forEach(function(wrap){
    gsap.from(wrap.children, {
      opacity:0, y:36, duration:0.7, ease:'power2.out', stagger:0.1,
      scrollTrigger:{ trigger: wrap, start:'top 82%' }
    });
  });
}

/* ---- Scroll progress + sticky header shadow ---- */
(function(){
  var views = [
    { id:'view-haevichi', bar:'scrollProgress' },
    { id:'view-lh', bar:'scrollProgressLh' }
  ];
  window.addEventListener('scroll', function(){
    var active = views.find(function(v){
      return document.getElementById(v.id).style.display === 'block';
    });
    if(!active) return;
    var bar = document.getElementById(active.bar);
    var header = document.querySelector('#' + active.id + ' header');
    var h = document.documentElement;
    var scrolled = h.scrollTop;
    var max = h.scrollHeight - h.clientHeight;
    var pct = max > 0 ? (scrolled / max) * 100 : 0;
    if(bar) bar.style.width = pct + '%';
    if(header) header.classList.toggle('is-scrolled', scrolled > 10);
  }, { passive:true });
})();

/* ---- Before/After drag comparison (multiple instances) ---- */
document.querySelectorAll('.ba-media').forEach(function(media){
  var afterWrap = media.querySelector('.ba-after-wrap');
  var handle = media.querySelector('.ba-handle');
  var dragging = false;

  function setPercent(pct){
    pct = Math.max(0, Math.min(100, pct));
    afterWrap.style.clipPath = 'inset(0 0 0 ' + pct + '%)';
    handle.style.left = pct + '%';
  }
  function fromEvent(e){
    var rect = media.getBoundingClientRect();
    var x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
    setPercent((x / rect.width) * 100);
  }
  media.addEventListener('pointerdown', function(e){ dragging = true; fromEvent(e); });
  window.addEventListener('pointermove', function(e){ if(dragging) fromEvent(e); });
  window.addEventListener('pointerup', function(){ dragging = false; });
  media.addEventListener('touchstart', function(e){ dragging = true; fromEvent(e); }, {passive:true});
  window.addEventListener('touchmove', function(e){ if(dragging) fromEvent(e); }, {passive:true});
  window.addEventListener('touchend', function(){ dragging = false; });

  setPercent(50);
});

/* ---- Interaction section: smooth scroll demo links ---- */
document.querySelectorAll('.ix-link').forEach(function(link){
  link.addEventListener('click', function(e){
    e.preventDefault();
    var target = document.querySelector(link.getAttribute('href'));
    if(target) target.scrollIntoView({behavior:'smooth', block:'center'});
  });
});
document.getElementById('open-haevichi').addEventListener('click', function(e){
  e.preventDefault();
  goView('haevichi');
});
document.getElementById('open-lh').addEventListener('click', function(e){
  e.preventDefault();
  goView('lh');
});
['back-home', 'back-home-lh', 'footer-home', 'footer-home-lh', 'back-home-apple', 'footer-home-apple'].forEach(function(id){
  var el = document.getElementById(id);
  if(el) el.addEventListener('click', function(e){
    e.preventDefault();
    history.replaceState(null,'','#home');
    goView('home');
  });
});

goView(location.hash === '#apple-tv' ? 'apple-tv' : 'home');
document.getElementById('open-apple-tv').addEventListener('click', function(e){e.preventDefault();if(location.hash==='#apple-tv')goView('apple-tv');else location.hash='apple-tv';});
window.addEventListener('hashchange',function(){if(location.hash==='#apple-tv')goView('apple-tv');else if(document.getElementById('view-apple-tv').style.display==='block' && !location.hash.startsWith('#at-'))goView('home');});
