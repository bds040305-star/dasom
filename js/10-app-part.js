
/* ============================================================
   LH청약 페이지 인터랙션
   ============================================================ */
(function(){
  var root = document.getElementById('view-lh');
  if(!root) return;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function $(s, r){ return (r || root).querySelector(s); }
  function $$(s, r){ return [].slice.call((r || root).querySelectorAll(s)); }
  function clamp(v,a,b){ return Math.min(b, Math.max(a,v)); }

  /* ---------- 스크롤 등장 ---------- */
  if('IntersectionObserver' in window){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(en){ if(en.isIntersecting){ en.target.classList.add('is-in'); io.unobserve(en.target); } });
    }, { threshold:.12, rootMargin:'0px 0px -6% 0px' });
    $$('.lh-reveal').forEach(function(el){ io.observe(el); });
  }else{ $$('.lh-reveal').forEach(function(el){ el.classList.add('is-in'); }); }

  /* ---------- 앵커 이동 (해시 라우팅과 겹치지 않게) ---------- */
  root.addEventListener('click', function(e){
    var a = e.target.closest('[data-goto]'); if(!a) return;
    e.preventDefault();
    var el = document.getElementById(a.getAttribute('data-goto')); if(!el) return;
    window.scrollTo({ top: el.getBoundingClientRect().top + window.pageYOffset - 64, behavior: reduce ? 'auto' : 'smooth' });
  });

  /* ---------- 히어로 폰 3대: 마우스 따라 깊이감 ---------- */
  var fan = $$('.lh-fan .dev');
  var heroSec = $('.lh-hero');
  if(heroSec && !reduce && !window.matchMedia('(pointer:coarse)').matches){
    var tx = 0, ty = 0, cx = 0, cy = 0, raf = 0;
    heroSec.addEventListener('pointermove', function(e){
      var r = heroSec.getBoundingClientRect();
      tx = ((e.clientX - r.left)/r.width - .5)*2; ty = ((e.clientY - r.top)/r.height - .5)*2;
      if(!raf) raf = requestAnimationFrame(loop);
    });
    heroSec.addEventListener('pointerleave', function(){ tx = ty = 0; if(!raf) raf = requestAnimationFrame(loop); });
    var loop = function(){
      cx += (tx - cx)*.09; cy += (ty - cy)*.09;
      fan.forEach(function(d){ var k = parseFloat(d.getAttribute('data-depth')||1)*12; d.style.translate = (-cx*k).toFixed(1)+'px '+(-cy*k*.7).toFixed(1)+'px'; });
      raf = (Math.abs(tx-cx) > .002 || Math.abs(ty-cy) > .002) ? requestAnimationFrame(loop) : 0;
    };
  }

  /* ---------- 서비스 흐름 탭 ---------- */
  var flowText = ['내 조건과 관련된 공고, 오늘 해야 할 일, 관심 공고의 다음 일정을 요약합니다.',
    '지역·유형 필터로 공고를 찾고, 날짜별 현황에서 공고별 신청자 수·모집 세대수·현재 경쟁률을 함께 확인합니다.',
    '관심 공고의 접수 시작·마감, 서류 준비·제출, 결과 발표를 개인 일정으로 모읍니다.',
    '위치와 주택 결과를 함께 확인하고 지도 핀과 목록 카드를 연결합니다.',
    '입력 조건을 수정하고, 관심 공고·준비 서류·신청 상태를 이어서 관리합니다.'];
  var flowTabs = $$('[data-flow]');
  var flowTargets = $$('[data-flow-img]');

  /* ---- 사진 대신 실제 코드: 배포된 페이지를 폰 안에 띄운다 ---- */
  var FLOW_BASE = 'https://bds040305-star.github.io/LH/';
  var flowScreen = $('#lhFlowScreen');
  var flowLive = $('#lhLive'), flowLiveTxt = $('#lhLiveTxt'), flowOpen = $('#lhFlowOpen');
  var flowProbe = null;

  function fitFlow(){                               /* 390px 짜리 화면을 폰 화면 너비에 맞춰 축소 */
    if(!flowScreen) return;
    var w = flowScreen.getBoundingClientRect().width;
    if(w) flowScreen.style.setProperty('--fs', (w/390).toFixed(4));
  }
  function probeFlow(){                             /* 오프라인이면 캡처 이미지를 그대로 보여준다 */
    if(!flowProbe){
      flowProbe = (window.fetch ? fetch(FLOW_BASE + 'index.html', { mode:'no-cors', cache:'no-cache' }).then(function(){ return true; }, function(){ return false; }) : Promise.resolve(true))
        .then(function(ok){
          if(!ok){ flowLive.classList.add('is-off'); flowLiveTxt.textContent = '오프라인이라 캡처 이미지로 보여드려요'; }
          return ok;
        });
    }
    return flowProbe;
  }
  function paneOf(n){ return flowTargets.filter(function(el){ return +el.getAttribute('data-flow-img') === n; })[0]; }
  function loadPane(n){
    var pane = paneOf(n); if(!pane) return Promise.resolve();
    var fr = pane.querySelector('iframe');
    if(!fr || fr.getAttribute('data-started')) return Promise.resolve();
    fr.setAttribute('data-started', '1');
    return probeFlow().then(function(ok){
      if(!ok) return;
      fr.addEventListener('load', function(){ pane.classList.add('is-loaded'); }, { once:true });
      fr.src = FLOW_BASE + pane.getAttribute('data-page');
    });
  }
  if(flowScreen){
    fitFlow();
    if('ResizeObserver' in window) new ResizeObserver(fitFlow).observe(flowScreen);
    window.addEventListener('resize', fitFlow);
    var flowStage = $('.lh-flow-stage');
    if('IntersectionObserver' in window){
      var flowIO = new IntersectionObserver(function(en){
        if(!en[0].isIntersecting) return;
        flowIO.disconnect(); fitFlow();
        loadPane(0).then(function(){ [1,4,2,3].forEach(function(n, i){ setTimeout(function(){ loadPane(n); }, 900 + i*700); }); });
      }, { rootMargin:'500px 0px' });
      flowIO.observe(flowStage);
    }else{ loadPane(0); }
  }

  /* 클릭하면 조작 모드 · 마우스가 폰을 벗어나거나 바깥을 누르면 다시 잠금 */
  var flowGuard = $('.lh-flow-guard'), flowDev = $('.lh-flow-dev');
  if(flowGuard && flowScreen && flowDev){
    flowGuard.addEventListener('click', function(){ flowScreen.classList.add('is-live'); });
    flowDev.addEventListener('mouseleave', function(){ flowScreen.classList.remove('is-live'); });
    document.addEventListener('pointerdown', function(e){ if(!flowDev.contains(e.target)) flowScreen.classList.remove('is-live'); });
  }

  flowTabs.forEach(function(t){
    t.addEventListener('click', function(){
      var n = +t.getAttribute('data-flow');
      flowTabs.forEach(function(x){ var on = x === t; x.classList.toggle('is-active', on); x.setAttribute('aria-selected', on); });
      flowTargets.forEach(function(el){ el.classList.toggle('is-on', +el.getAttribute('data-flow-img') === n); });
      $('#lhFlowText').textContent = flowText[n];
      var pane = paneOf(n);
      if(pane && flowOpen) flowOpen.href = FLOW_BASE + pane.getAttribute('data-page');
      loadPane(n);
    });
  });

  /* ---------- 09 퍼블리싱: 실제 화면 가로 스트립 ---------- */
  var strip = $('#lhStrip');
  if(strip){
    var stripItems = $$('.lh-strip-item', strip);
    var prevBtn = $('#stripPrev'), nextBtn = $('#stripNext');
    function fitStrip(){
      var v = $('.lh-strip-view', strip); if(!v) return;
      var w = v.getBoundingClientRect().width; if(w) strip.style.setProperty('--fs', (w/390).toFixed(4));
    }
    function stepPx(){ var it = stripItems[0]; return it ? it.getBoundingClientRect().width + 32 : 260; }
    function syncNav(){
      prevBtn.disabled = strip.scrollLeft <= 4;
      nextBtn.disabled = strip.scrollLeft >= strip.scrollWidth - strip.clientWidth - 4;
    }
    prevBtn.addEventListener('click', function(){ strip.scrollBy({ left:-stepPx()*2, behavior: reduce ? 'auto' : 'smooth' }); });
    nextBtn.addEventListener('click', function(){ strip.scrollBy({ left: stepPx()*2, behavior: reduce ? 'auto' : 'smooth' }); });
    strip.addEventListener('scroll', syncNav, { passive:true });
    strip.addEventListener('keydown', function(e){
      if(e.key === 'ArrowRight'){ e.preventDefault(); nextBtn.click(); }
      if(e.key === 'ArrowLeft'){ e.preventDefault(); prevBtn.click(); }
    });
    /* 마우스로 끌어서 스크롤 (터치는 기본 스크롤 사용) */
    var dragging = false, sx = 0, sl = 0, moved = 0;
    strip.addEventListener('pointerdown', function(e){
      if(e.pointerType !== 'mouse' || e.button !== 0) return;
      dragging = true; moved = 0; sx = e.clientX; sl = strip.scrollLeft;
    });
    window.addEventListener('pointermove', function(e){
      if(!dragging) return;
      var dx = e.clientX - sx; moved = Math.max(moved, Math.abs(dx));
      if(moved > 6) strip.classList.add('is-drag');
      strip.scrollLeft = sl - dx;
    });
    window.addEventListener('pointerup', function(){
      if(!dragging) return; dragging = false;
      setTimeout(function(){ strip.classList.remove('is-drag'); }, 0);
    });
    strip.addEventListener('click', function(e){ if(moved > 6){ e.preventDefault(); e.stopPropagation(); moved = 0; } }, true);
    strip.addEventListener('dragstart', function(e){ e.preventDefault(); });

    fitStrip(); syncNav();
    if('ResizeObserver' in window) new ResizeObserver(function(){ fitStrip(); syncNav(); }).observe(strip);
    window.addEventListener('resize', function(){ fitStrip(); syncNav(); });

    /* 캡처 이미지가 먼저 보이고, 실제 페이지가 준비되면 그 위로 바뀐다 */
    function loadThumb(item){
      var fr = $('iframe', item); if(!fr || fr.getAttribute('data-started')) return;
      fr.setAttribute('data-started', '1');
      probeFlow().then(function(ok){
        if(!ok) return;
        fr.addEventListener('load', function(){ item.classList.add('is-loaded'); }, { once:true });
        fr.src = FLOW_BASE + item.getAttribute('data-page');
      });
    }
    if('IntersectionObserver' in window){
      var stripIO = new IntersectionObserver(function(en){
        if(!en[0].isIntersecting) return;
        stripIO.disconnect(); fitStrip();
        stripItems.forEach(function(it, i){ setTimeout(function(){ loadThumb(it); }, i*260); });
      }, { rootMargin:'400px 0px' });
      stripIO.observe(strip);
    }
  }

  /* ---------- 디자인 제안 탭 ---------- */
  var propTabs = $$('[data-prop]');
  var propPanels = $$('[data-prop-panel]');
  propTabs.forEach(function(t){
    t.addEventListener('click', function(){
      var n = t.getAttribute('data-prop');
      propTabs.forEach(function(x){ var on = x === t; x.classList.toggle('is-active', on); x.setAttribute('aria-selected', on); });
      propPanels.forEach(function(p){ p.classList.toggle('is-on', p.getAttribute('data-prop-panel') === n); });
    });
  });

  /* ============================================================
     가족 서명 프로토타입
     ============================================================ */
  var stage = $('#signStage');
  if(!stage) return;
  var A = $('#phoneA'), B = $('#phoneB');
  var INK = '#0B1F3A';

  var cvB = $('#cvB');
  var mirrors = [ $('#cvA'), $('#cvA2'), $('#cvB2'), $('#cvB3') ];
  var strokes = [];            /* [{ pts:[{x,y,w}] }]  — 좌표는 패드(논리 픽셀) 기준 */
  var cur = null, drawing = false;
  var MIN_INK = 90;            /* 이만큼은 그려야 '서명'으로 인정 */
  var SRC_W = 343, SRC_H = 234;

  /* ---- 캔버스 크기: CSS 배율(폰 축소)과 DPR 을 함께 반영 ---- */
  function fit(cv){
    var lw = cv.offsetWidth, lh = cv.offsetHeight;
    if(!lw || !lh) return null;
    var r = cv.getBoundingClientRect();
    var k = (r.width / lw) || 1;
    var dpr = Math.min(window.devicePixelRatio || 1, 2.5);
    var w = Math.max(2, Math.round(lw*k*dpr)), h = Math.max(2, Math.round(lh*k*dpr));
    if(cv.width !== w || cv.height !== h){ cv.width = w; cv.height = h; }
    return { lw:lw, lh:lh };
  }

  /* ---- 잉크: 빠르게 그을수록 가늘게 ---- */
  function seg(ctx, p, i){
    var a = p[i-1], b = p[i];
    var m0 = i > 1 ? { x:(p[i-2].x + a.x)/2, y:(p[i-2].y + a.y)/2 } : a;
    var m1 = { x:(a.x + b.x)/2, y:(a.y + b.y)/2 };
    ctx.beginPath(); ctx.moveTo(m0.x, m0.y); ctx.quadraticCurveTo(a.x, a.y, m1.x, m1.y);
    ctx.lineWidth = b.w; ctx.stroke();
  }
  function tail(ctx, p){
    var n = p.length; if(n < 2) return;
    var a = p[n-2], b = p[n-1];
    ctx.beginPath(); ctx.moveTo((a.x + b.x)/2, (a.y + b.y)/2); ctx.lineTo(b.x, b.y); ctx.lineWidth = b.w; ctx.stroke();
  }
  function paintAll(ctx){
    ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.strokeStyle = INK; ctx.fillStyle = INK;
    strokes.forEach(function(s){
      var p = s.pts;
      if(p.length === 1){ ctx.beginPath(); ctx.arc(p[0].x, p[0].y, p[0].w/2 + .4, 0, 6.2832); ctx.fill(); return; }
      for(var i = 1; i < p.length; i++) seg(ctx, p, i);
      tail(ctx, p);
    });
  }
  function bbox(){
    var x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
    strokes.forEach(function(s){ s.pts.forEach(function(q){ x0 = Math.min(x0,q.x); y0 = Math.min(y0,q.y); x1 = Math.max(x1,q.x); y1 = Math.max(y1,q.y); }); });
    return x0 > x1 ? null : { x0:x0, y0:y0, x1:x1, y1:y1 };
  }
  /* 미러 캔버스: 서명 전체가 보이도록 '맞춰서' 그린다 */
  function renderMirror(cv){
    var f = fit(cv); if(!f) return;
    var ctx = cv.getContext('2d'); ctx.setTransform(1,0,0,1,0,0); ctx.clearRect(0,0,cv.width,cv.height);
    var bb = bbox(); if(!bb) return;
    var pad = 12, bw = Math.max(bb.x1 - bb.x0, 40), bh = Math.max(bb.y1 - bb.y0, 24);
    var kk = cv.width / f.lw;                        /* 이 캔버스의 논리→실제 픽셀 배율 */
    var s = Math.min((cv.width - pad*kk)/bw, (cv.height - pad*kk)/bh, kk*1.7);
    var ox = (cv.width - bw*s)/2 - bb.x0*s, oy = (cv.height - bh*s)/2 - bb.y0*s;
    ctx.setTransform(s,0,0,s,ox,oy);
    paintAll(ctx);
  }
  var mirrorQueued = false;
  function renderMirrors(){
    if(mirrorQueued) return; mirrorQueued = true;
    requestAnimationFrame(function(){ mirrorQueued = false; mirrors.forEach(renderMirror); });
  }
  function renderMain(){
    var f = fit(cvB); if(!f) return;
    SRC_W = f.lw; SRC_H = f.lh;
    var ctx = cvB.getContext('2d'); ctx.setTransform(1,0,0,1,0,0); ctx.clearRect(0,0,cvB.width,cvB.height);
    ctx.setTransform(cvB.width/SRC_W, 0, 0, cvB.height/SRC_H, 0, 0);
    paintAll(ctx);
  }
  function inkLength(){
    var L = 0;
    strokes.forEach(function(s){ for(var i = 1; i < s.pts.length; i++){ L += Math.hypot(s.pts[i].x - s.pts[i-1].x, s.pts[i].y - s.pts[i-1].y); } if(s.pts.length === 1) L += 6; });
    return L;
  }

  /* ---- 포인터 입력 ---- */
  function toSrc(e){
    var r = cvB.getBoundingClientRect();
    return { x:(e.clientX - r.left)/r.width*SRC_W, y:(e.clientY - r.top)/r.height*SRC_H, t:e.timeStamp };
  }
  function addPoint(e){
    var q = toSrc(e), p = cur.pts, last = p[p.length-1];
    var d = Math.hypot(q.x - last.x, q.y - last.y);
    if(d < .9) return;
    var v = d / Math.max(1, q.t - last.t);              /* 논리 px / ms */
    var target = clamp(5.6 - v*2.6, 1.8, 5.6);
    q.w = last.w*.72 + target*.28;
    p.push(q);
    var ctx = cvB.getContext('2d');
    ctx.setTransform(cvB.width/SRC_W, 0, 0, cvB.height/SRC_H, 0, 0);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.strokeStyle = INK;
    seg(ctx, p, p.length - 1);
  }
  cvB.addEventListener('pointerdown', function(e){
    if(e.button > 0) return;
    e.preventDefault();
    try{ cvB.setPointerCapture(e.pointerId); }catch(_){}
    var q = toSrc(e); q.w = 3.4;
    cur = { pts:[q] }; strokes.push(cur); drawing = true;
    var ctx = cvB.getContext('2d');
    ctx.setTransform(cvB.width/SRC_W, 0, 0, cvB.height/SRC_H, 0, 0);
    ctx.fillStyle = INK; ctx.beginPath(); ctx.arc(q.x, q.y, q.w/2 + .4, 0, 6.2832); ctx.fill();
    $('#pad').classList.add('has-ink');
    padUI(); renderMirrors();
  });
  cvB.addEventListener('pointermove', function(e){
    if(!drawing || !cur) return;
    var list = e.getCoalescedEvents ? e.getCoalescedEvents() : [e];
    if(!list.length) list = [e];
    list.forEach(addPoint);
    renderMirrors();
  });
  function endDraw(){ if(!drawing) return; drawing = false; cur = null; padUI(); renderMirrors(); }
  cvB.addEventListener('pointerup', endDraw);
  cvB.addEventListener('pointercancel', endDraw);
  cvB.addEventListener('lostpointercapture', endDraw);

  /* ---- 패드 UI ---- */
  var undoBtn = $('#padUndo'), clearBtn = $('#padClear'), doneBtn = $('#padDone'), padMsg = $('#padMsg');
  function padUI(){
    var n = strokes.length, L = inkLength();
    undoBtn.disabled = clearBtn.disabled = !n;
    doneBtn.disabled = L < MIN_INK;
    padMsg.textContent = !n ? '서명을 그리면 버튼이 켜져요.' : (L < MIN_INK ? '조금만 더 길게 써 주세요.' : '이 서명으로 제출할 수 있어요.');
    $('#pad').classList.toggle('has-ink', n > 0);
  }
  undoBtn.addEventListener('click', function(){ strokes.pop(); renderMain(); padUI(); renderMirrors(); });
  clearBtn.addEventListener('click', function(){ strokes = []; renderMain(); padUI(); renderMirrors(); });

  /* ============================================================
     흐름 상태
     ============================================================ */
  var st = { step:0, sheet:false, sent:false, opened:false, agreed:false, signed:false, channel:'카카오톡' };
  var hints = [
    '휴대폰 화면 안의 버튼을 직접 눌러 보세요. 왼쪽은 신청자, 오른쪽은 가족의 화면입니다.',
    '오른쪽 가족 화면에서 링크를 열고, 서류 내용을 확인해 보세요.',
    '손가락(또는 마우스)으로 서명을 그려 보세요. 그리는 대로 왼쪽 신청자 화면에도 실시간으로 보입니다.',
    '서명이 신청자의 체크리스트에 바로 반영됐어요. 이미지로 저장해 볼 수도 있어요.'
  ];
  var stepBtns = $$('#signSteps button');
  var toastEl = $('#ppToast'), toastT;
  function toast(msg){ toastEl.textContent = msg; toastEl.classList.add('show'); clearTimeout(toastT); toastT = setTimeout(function(){ toastEl.classList.remove('show'); }, 2400); }

  function apply(extraHint){
    stage.setAttribute('data-step', st.step);
    A.classList.toggle('sheet-open', st.sheet);
    A.classList.toggle('s-sent', st.sent);
    A.classList.toggle('s-opened', st.opened);
    A.classList.toggle('s-signing', st.step === 2 && !st.signed);
    A.classList.toggle('s-signed', st.signed);
    var scr = st.step === 0 ? 'idle' : st.step === 1 ? (st.opened ? 'doc' : 'idle') : st.step === 2 ? 'sign' : 'done';
    B.setAttribute('data-screen', scr);
    B.classList.toggle('msg-in', st.sent);
    var chan = $('#ppChanLabel'); chan.textContent = st.channel; chan.classList.toggle('is-sms', st.channel === '문자');
    $('#ppSendLabel').textContent = (st.channel === '문자' ? '문자로' : '카카오톡으로') + ' 보내기';
    $$('#ppSeg button').forEach(function(b){ b.classList.toggle('is-on', b.getAttribute('data-ch') === st.channel); });
    var badge = $('#ppSignBadge');
    badge.textContent = st.signed ? '서명 완료' : (st.sent ? '요청함' : '가족 서명 필요');
    badge.className = 'pp-badge' + (st.signed ? ' b-green' : (st.sent ? ' b-blue' : ''));
    $('#ppSignedNote').textContent = st.signed ? '방금 도착' : (st.step === 2 ? '서명하는 중…' : '기다리는 중');
    $('#ppProg').style.width = (st.signed ? 80 : 60) + '%';
    $('#ppProgNum').textContent = st.signed ? 4 : 3;
    $('#ppToSign').disabled = !st.agreed;
    $('#ppAgree').checked = st.agreed;
    $('#signSave').disabled = !(st.signed && strokes.length);
    stepBtns.forEach(function(b){
      var n = +b.getAttribute('data-step');
      b.classList.toggle('is-active', n === st.step);
      b.classList.toggle('is-done', n < st.step);
    });
    $('#signHint').textContent = extraHint || hints[st.step];
    padUI();
    /* 화면이 바뀐 뒤에야 캔버스 크기가 잡히므로 한 프레임 뒤에 다시 그린다 */
    requestAnimationFrame(function(){ renderMain(); renderMirrors(); });
  }

  function resetAll(){
    strokes = []; st = { step:0, sheet:false, sent:false, opened:false, agreed:false, signed:false, channel:st.channel };
    $('#pad').classList.remove('has-ink');
    apply();
  }

  /* ---- 신청자 폰 ---- */
  $('#ppRequest').addEventListener('click', function(){ st.sheet = true; apply(); });
  $('#ppDim').addEventListener('click', function(){ st.sheet = false; apply(); });
  $$('#ppSeg button').forEach(function(b){ b.addEventListener('click', function(){ st.channel = b.getAttribute('data-ch'); apply(); }); });
  $('#ppSend').addEventListener('click', function(){ st.sheet = false; st.sent = true; st.step = 1; st.opened = false; apply(); });

  /* ---- 가족 폰 ---- */
  $('#ppOpenLink').addEventListener('click', function(){ st.opened = true; st.step = 1; apply(); });
  $('#ppAgree').addEventListener('change', function(e){ st.agreed = e.target.checked; apply(); });
  $('#ppToSign').addEventListener('click', function(){ if(!st.agreed) return; st.step = 2; apply(); });
  B.querySelector('[data-s="sign"] .pp-bar svg').addEventListener('click', function(){ st.step = 1; apply(); });
  doneBtn.addEventListener('click', function(){
    if(inkLength() < MIN_INK) return;
    st.signed = true; st.step = 3; apply();
    toast('서명이 도착했어요');
  });
  $('#ppAgain').addEventListener('click', resetAll);
  $('#signReset').addEventListener('click', resetAll);

  /* ---- 왼쪽 단계 버튼: 어디로든 바로 이동 ---- */
  stepBtns.forEach(function(b){
    b.addEventListener('click', function(){
      var n = +b.getAttribute('data-step');
      if(n === 0){ resetAll(); return; }
      st.sheet = false; st.sent = true; st.channel = st.channel;
      if(n === 1){ st.step = 1; st.opened = false; st.agreed = false; st.signed = false; apply(); return; }
      st.opened = true; st.agreed = true;
      if(n === 2){ st.step = 2; st.signed = false; apply(); return; }
      if(inkLength() >= MIN_INK){ st.signed = true; st.step = 3; apply(); toast('서명이 도착했어요'); }
      else{ st.step = 2; st.signed = false; apply('먼저 서명을 그려 주세요. 그린 서명이 완료 화면에 그대로 들어갑니다.'); }
    });
  });

  /* ---- 서명 이미지 저장 (투명 배경 PNG) ---- */
  $('#signSave').addEventListener('click', function(){
    var bb = bbox(); if(!bb) return;
    var pad = 14, w = bb.x1 - bb.x0 + pad*2, h = bb.y1 - bb.y0 + pad*2, s = Math.min(4, 1400/w);
    var c = document.createElement('canvas'); c.width = Math.round(w*s); c.height = Math.round(h*s);
    var ctx = c.getContext('2d'); ctx.setTransform(s,0,0,s,(pad - bb.x0)*s,(pad - bb.y0)*s);
    paintAll(ctx);
    c.toBlob(function(blob){
      var a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'my-signature.png';
      document.body.appendChild(a); a.click(); a.remove(); setTimeout(function(){ URL.revokeObjectURL(a.href); }, 2000);
    }, 'image/png');
  });

  /* ---- 크기가 바뀌면 다시 맞춘다 ---- */
  if('ResizeObserver' in window){ new ResizeObserver(function(){ renderMain(); renderMirrors(); }).observe(stage); }
  window.addEventListener('resize', function(){ renderMain(); renderMirrors(); });
  apply();
})();
