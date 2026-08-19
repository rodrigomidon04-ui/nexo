/* NEXO UI final adjustments — Mi Centro only. Never touches nexo-salas. */
(function(){
  'use strict';
  if(window.__NEXO_UI_FINAL_ADJUSTMENTS__) return;
  window.__NEXO_UI_FINAL_ADJUSTMENTS__=true;

  function ready(fn){
    if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',fn,{once:true});
    else fn();
  }

  function removeLegacyHeader(){
    const advanced=document.getElementById('nexo33134');
    if(!advanced) return;

    // Remove ONLY the old 03.3.1 / 03.4 heading and its subtitle.
    const head=advanced.querySelector(':scope > .container > .section-head, :scope > .section-head');
    if(head){
      head.remove();
    }

    // Keep the existing module content exactly as-is.
    advanced.hidden=false;
    advanced.style.display='block';
  }

  function apply(){
    const centro=document.getElementById('dashboard');
    const advanced=document.getElementById('nexo33134');
    if(centro && advanced && advanced.parentElement===centro){
      removeLegacyHeader();
    }
  }

  ready(()=>{
    apply();
    setTimeout(apply,450);
    setTimeout(apply,1200);
    setTimeout(apply,2200);

    const observer=new MutationObserver(()=>{
      const advanced=document.getElementById('nexo33134');
      if(!advanced) return;
      const head=advanced.querySelector(':scope > .container > .section-head, :scope > .section-head');
      if(head) head.remove();
    });
    observer.observe(document.body,{childList:true,subtree:true});
    setTimeout(()=>observer.disconnect(),15000);
  });
})();
