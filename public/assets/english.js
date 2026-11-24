/* Existing analytics destination only; never put inquiry field values in events. */
(function(w,d){
  if(w.location.hostname!=='reumlab.com'&&w.location.hostname!=='www.reumlab.com')return;
  w.dataLayer=w.dataLayer||[];
  w.dataLayer.push({event:'english_page_view',page_language:'en',page_path:w.location.pathname});
  var script=d.querySelector('script[data-gtm]');var id=script&&script.getAttribute('data-gtm');
  var loaded=false;function load(){if(loaded||!/^GTM-[A-Z0-9]+$/.test(id||''))return;loaded=true;w.dataLayer.push({'gtm.start':Date.now(),event:'gtm.js'});var tag=d.createElement('script');tag.async=true;tag.src='https://www.googletagmanager.com/gtm.js?id='+encodeURIComponent(id);d.head.appendChild(tag);}
  ['pointerdown','keydown','touchstart'].forEach(function(event){w.addEventListener(event,load,{once:true,passive:true});});
  w.addEventListener('load',function(){w.setTimeout(load,8000);},{once:true});
  d.addEventListener('click',function(event){var target=event.target.closest('[data-english-event]');if(target)w.dataLayer.push({event:'english_'+target.getAttribute('data-english-event'),page_language:'en',page_path:w.location.pathname});});
  d.addEventListener('submit',function(event){if(event.target.matches('form[data-english-inquiry]'))w.dataLayer.push({event:'english_inquiry_submit',page_language:'en',form_name:'en-project-inquiry'});});
})(window,document);
