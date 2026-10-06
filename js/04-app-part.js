
(function(){
  var stack=document.querySelector('#view-haevichi .hero-stack-cards');
  if(!stack) return;
  var cards=[].slice.call(stack.querySelectorAll('.hero-stack-card'));
  var timer;
  function shuffle(){
    var first=cards.shift();
    cards.push(first);
    cards.forEach(function(card,i){
      card.style.zIndex=i+1;
      var poses=[['translate(0,0) rotate(-5deg)'],['translate(20px,13px) rotate(3deg)'],['translate(39px,26px) rotate(-2deg)'],['translate(58px,39px) rotate(5deg)']];
      card.style.transform=poses[i][0];
      card.style.opacity='1';
    });
  }
  stack.addEventListener('mouseenter',function(){
    shuffle();
    timer=setInterval(shuffle,1050);
  });
  stack.addEventListener('mouseleave',function(){
    clearInterval(timer);
    cards.forEach(function(card,i){card.style.zIndex=i+1;card.style.transform='';card.style.opacity='';});
  });
})();
