/* 름랩 Landing — interactions (vanilla, no deps) */
(function(){
  'use strict';

  /* ---- Nav: scrolled state ---- */
  var nav = document.querySelector('.nav');
  function onScroll(){
    if(!nav) return;
    if(window.scrollY > 60) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  }
  window.addEventListener('scroll', onScroll, {passive:true});
  onScroll();

  /* ---- Mobile menu ---- */
  var burger = document.querySelector('.nav-burger');
  var mmenu  = document.querySelector('.mmenu');
  var mclose = document.querySelector('.mmenu-close');
  function openMenu(){ if(mmenu){ mmenu.classList.add('open'); document.body.style.overflow='hidden'; } }
  function closeMenu(){ if(mmenu){ mmenu.classList.remove('open'); document.body.style.overflow=''; } }
  if(burger) burger.addEventListener('click', openMenu);
  if(mclose) mclose.addEventListener('click', closeMenu);
  if(mmenu) mmenu.querySelectorAll('a').forEach(function(a){ a.addEventListener('click', closeMenu); });

  /* ---- FAQ accordion ---- */
  document.querySelectorAll('.faq-item').forEach(function(item){
    var q = item.querySelector('.faq-q');
    var a = item.querySelector('.faq-a');
    if(!q || !a) return;
    q.addEventListener('click', function(){
      var isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(function(o){
        if(o!==item){ o.classList.remove('open'); var oa=o.querySelector('.faq-a'); if(oa) oa.style.maxHeight=null; }
      });
      if(isOpen){ item.classList.remove('open'); a.style.maxHeight=null; }
      else{ item.classList.add('open'); a.style.maxHeight = a.scrollHeight + 'px'; }
    });
  });

  /* ---- Floating contact ---- */
  var floatWrap = document.querySelector('.float');
  var floatToggle = document.querySelector('.float-toggle');
  var floatMenu = document.querySelector('.float-menu');
  var floatLabel = document.querySelector('.float-toggle .ftxt');
  if(floatToggle && floatMenu){
    floatToggle.addEventListener('click', function(){
      var open = floatMenu.classList.toggle('open');
      floatWrap.classList.toggle('is-open', open);
      if(floatLabel) floatLabel.textContent = open ? '닫기' : '빠른 상담';
    });
    document.addEventListener('click', function(e){
      if(floatWrap && !floatWrap.contains(e.target) && floatMenu.classList.contains('open')){
        floatMenu.classList.remove('open');
        floatWrap.classList.remove('is-open');
        if(floatLabel) floatLabel.textContent='빠른 상담';
      }
    });
  }

  /* ---- Reveal on scroll (rect-based; transition-pause safe) ---- */
  var revealEls = [].slice.call(document.querySelectorAll('[data-reveal]'));
  function reveal(el){
    el.classList.add('in');
    // After the entrance plays, hard-snap to the resting style with
    // transition disabled — guarantees visibility even where time-based
    // CSS is frozen (offscreen iframes, print, PDF capture).
    setTimeout(function(){ settle(el); }, 820);
  }
  function settle(el){
    el.style.transition = 'none';
    el.style.opacity = '1';
    el.style.transform = 'none';
    el.removeAttribute('data-reveal');
  }
  function revealPass(){
    var vh = window.innerHeight || document.documentElement.clientHeight;
    for(var i=revealEls.length-1;i>=0;i--){
      var el = revealEls[i];
      var r = el.getBoundingClientRect();
      if(r.top < vh*0.92 && r.bottom > 0){ reveal(el); revealEls.splice(i,1); }
    }
  }
  revealPass();
  window.addEventListener('scroll', revealPass, {passive:true});
  window.addEventListener('resize', revealPass);
  window.addEventListener('load', revealPass);
  // final safety: never leave anything hidden
  setTimeout(function(){
    document.querySelectorAll('[data-reveal]').forEach(settle);
  }, 2400);

  /* ---- Analytics stub (mirrors production data-analytics → dataLayer) ---- */
  document.addEventListener('click', function(e){
    var t = e.target.closest('[data-analytics]');
    if(!t) return;
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({event:'reum_click', label:t.getAttribute('data-analytics')});
  });
})();
