
(function(){
  document.querySelectorAll('.ix-tabs').forEach(function(root){
    var tabs=root.querySelectorAll('.ix-tab');
    tabs.forEach(function(tab){
      tab.addEventListener('click', function(){
        tabs.forEach(function(t){t.classList.remove('is-active'); t.setAttribute('aria-selected','false');});
        root.querySelectorAll('.ix-panel').forEach(function(p){p.classList.remove('is-active');});
        tab.classList.add('is-active');
        tab.setAttribute('aria-selected','true');
        var panel=document.getElementById(tab.dataset.panel);
        if(panel) panel.classList.add('is-active');
      });
    });
  });
})();
