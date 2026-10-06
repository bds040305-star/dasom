
/* ---- Hero drawing canvas (easter egg) ---- */
(function(){
  var canvas = document.getElementById('heroCanvas');
  var hint = document.getElementById('heroDrawHint');
  if(!canvas) return;
  var hero = canvas.closest('.hero');
  function resize(){
    var r = hero.getBoundingClientRect();
    canvas.width = canvas.offsetWidth * devicePixelRatio;
    canvas.height = canvas.offsetHeight * devicePixelRatio;
  }
  resize();
  window.addEventListener('resize', resize);
  var ctx = canvas.getContext('2d');
  var drawing = false, hasDrawn = false;
  var lastX = 0, lastY = 0;
  function pos(e){
    var r = canvas.getBoundingClientRect();
    var x = (e.clientX - r.left) * devicePixelRatio;
    var y = (e.clientY - r.top) * devicePixelRatio;
    return [x,y];
  }
  var clearBtn = document.getElementById('heroDrawClear');
  canvas.addEventListener('pointerdown', function(e){
    drawing = true;
    var p = pos(e); lastX = p[0]; lastY = p[1];
    if(!hasDrawn){
      hasDrawn = true;
      if(hint) hint.classList.add('is-hidden');
      if(clearBtn) clearBtn.classList.add('is-visible');
    }
  });
  if(clearBtn){
    clearBtn.addEventListener('click', function(){
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    });
  }
  window.addEventListener('pointerup', function(){ drawing = false; });
  canvas.addEventListener('pointermove', function(e){
    if(!drawing) return;
    var p = pos(e);
    ctx.strokeStyle = 'rgba(43,74,94,0.55)';
    ctx.lineWidth = 1.6 * devicePixelRatio;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(p[0], p[1]);
    ctx.stroke();
    lastX = p[0]; lastY = p[1];
  });
})();
