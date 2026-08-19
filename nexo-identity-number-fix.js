/* NEXO: only change the Identity section number. */
(function(){
  'use strict';
  function apply(){
    const perfil=document.getElementById('perfil');
    if(!perfil)return;
    const tag=perfil.querySelector('.section-head .tag');
    if(tag)tag.textContent='00 — Identidad';
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(apply,1900),{once:true});
  else setTimeout(apply,1900);
})();
