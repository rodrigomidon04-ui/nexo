/* NEXO UI final adjustments — Mi Centro only. Never touches nexo-salas. */
(function(){
  'use strict';
  if(window.__NEXO_UI_FINAL_ADJUSTMENTS__) return;
  window.__NEXO_UI_FINAL_ADJUSTMENTS__=true;

  function ready(fn){
    if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',fn,{once:true});
    else fn();
  }

  function apply(){
    const centro=document.getElementById('dashboard');
    const advanced=document.getElementById('nexo33134');
    if(centro && advanced && advanced.parentElement===centro){
      // 03 — Mi Centro: the module is part of the same section.
      // Remove only the legacy 03.3.1 / 03.4 heading; preserve all content and functionality below it.
      const head=advanced.querySelector('.section-head');
      if(head){
        head.style.display='none';
        head.setAttribute('aria-hidden','true');
      }
      advanced.style.display='block';
      advanced.hidden=false;
    }
  }

  ready(()=>{
    setTimeout(apply,450);
    setTimeout(apply,1800);
  });
})();
