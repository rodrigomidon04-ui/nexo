/* NEXO UI: final small presentation adjustments. */
(function(){
  'use strict';
  if(window.__NEXO_UI_FINAL_ADJUSTMENTS__) return;
  window.__NEXO_UI_FINAL_ADJUSTMENTS__=true;

  function apply(){
    const perfil=document.getElementById('perfil');
    const tag=perfil?.querySelector?.('.section-head .tag');
    if(tag) tag.textContent='00 — Identidad';

    const centro=document.getElementById('dashboard');
    const advanced=document.getElementById('nexo33134');
    if(centro && advanced && advanced.parentElement===centro){
      const head=advanced.querySelector('.section-head');
      if(head){
        head.style.display='none';
        head.setAttribute('aria-hidden','true');
      }
      advanced.style.display='block';
      advanced.hidden=false;
    }
  }

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',apply,{once:true});
  }else{
    apply();
  }
  setTimeout(apply,900);
})();
