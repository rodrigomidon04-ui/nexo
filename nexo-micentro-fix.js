/* NEXO: Mi Centro -> 03 — Mi Centro */
(function(){
  'use strict';
  function run(){
    const navLink=document.getElementById('nexoNavMiCentro');
    const target=document.getElementById('nexo33134');
    if(!navLink||!target)return;
    navLink.addEventListener('click',function(e){
      e.preventDefault();
      target.hidden=false;
      target.style.display='';
      requestAnimationFrame(()=>target.scrollIntoView({behavior:'smooth',block:'center'}));
      if(history.replaceState)history.replaceState(null,'','#nexo33134');
    },{capture:true});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run,{once:true});
  else setTimeout(run,100);
})();
