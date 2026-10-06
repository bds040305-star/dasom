
(function(){
  var root=document.querySelector('#facility-demo'); if(!root) return;
  var data={
    spa:{title:'Spa & Fitness',copy:'수영장과 피트니스, 휴식을 위한 시설을 한눈에 확인합니다.',label:'SPA & FITNESS',image:'after-facility'},
    convenience:{title:'Convenience',copy:'투숙 중 필요한 편의시설과 서비스를 빠르게 찾습니다.',label:'CONVENIENCE',image:'after-hero-2'},
    kids:{title:'Kids',copy:'아이와 함께 머무는 시간을 위한 공간을 모아 보여줍니다.',label:'KIDS',image:'after-hero-3'},
    gallery:{title:'Gallery',copy:'해비치의 공간과 풍경을 이미지 중심으로 탐색합니다.',label:'GALLERY',image:'after-hero-4'}
  };
  var tabs=root.querySelectorAll('[data-facility-tab]'), image=root.querySelector('[data-facility-image]'), title=root.querySelector('[data-facility-title]'), copy=root.querySelector('[data-facility-copy]'), overline=root.querySelector('.facility-overline');
  var sourceMap={}; document.querySelectorAll('img[data-img]').forEach(function(img){sourceMap[img.getAttribute('data-img')]=img.src;});
  tabs.forEach(function(tab){tab.addEventListener('click',function(){var item=data[tab.dataset.facilityTab];tabs.forEach(function(t){t.classList.remove('is-active');t.setAttribute('aria-selected','false');});tab.classList.add('is-active');tab.setAttribute('aria-selected','true');title.textContent=item.title;copy.textContent=item.copy;overline.textContent=item.label;if(sourceMap[item.image]) image.src=sourceMap[item.image];image.alt=item.title+' 시설 미리보기';});});
})();
