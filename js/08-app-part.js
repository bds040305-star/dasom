
(function(){
  if(window.matchMedia('(pointer:coarse)').matches) return;
  var ring=document.createElement('div');
  ring.className='cursor-ring';
  document.body.appendChild(ring);
  window.addEventListener('pointermove',function(e){ring.style.left=e.clientX+'px';ring.style.top=e.clientY+'px';},{passive:true});
  document.addEventListener('pointerover',function(e){ring.classList.toggle('is-hover',!!e.target.closest('a,button,[role="button"]'));});
  window.addEventListener('pointerdown',function(){ring.classList.add('is-click');});
  window.addEventListener('pointerup',function(){ring.classList.remove('is-click');});
})();
