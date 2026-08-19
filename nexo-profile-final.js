/* NEXO: profile is modal-only. No visible identity block in page flow. */
(function(){
  'use strict';
  if(window.__NEXOPROFILEFINAL)return; window.__NEXOPROFILEFINAL=true;
  const wait=fn=>document.readyState==='loading'?document.addEventListener('DOMContentLoaded',fn,{once:true}):fn();
  wait(()=>{
    const hide=()=>{
      const p=document.getElementById('perfil');
      if(p){p.hidden=true;p.style.display='none';p.setAttribute('aria-hidden','true');}
      document.querySelectorAll('#perfil + *').forEach(()=>{});
    };
    hide();
    const style=document.createElement('style');style.id='nexo-profile-final-style';style.textContent='#perfil{display:none!important}';document.head.appendChild(style);
    new MutationObserver(hide).observe(document.body,{childList:true,subtree:true});
  });
})();
