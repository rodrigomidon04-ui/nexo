/* NEXO UI final adjustments — only presentation/placement. Never touches nexo-salas. */
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
      // Remove the legacy 03.3.1 / 03.4 heading completely and keep the module inline below Mi Centro.
      const head=advanced.querySelector('.section-head');
      if(head){
        head.style.display='none';
        head.setAttribute('aria-hidden','true');
      }
      advanced.style.display='block';
      advanced.hidden=false;
    }

    const navLinks=document.querySelector('.nav .navlinks');
    const mi=document.querySelector('.nexo-nav-mi');
    const menu=document.getElementById('nexoUiMenu') || document.getElementById('nexoFinalMenu') || document.getElementById('nexoMenu');
    if(!navLinks || !mi || !menu) return;

    // Mi Nexo stays aligned as a normal menu item in the bar.
    mi.style.display='inline-flex';
    mi.style.position='relative';
    mi.style.alignItems='center';
    mi.style.verticalAlign='middle';
    mi.style.margin='0';
    mi.style.padding='0';
    mi.style.transform='none';

    // Dropdown opens directly below Mi Nexo, never as a side flyout.
    menu.style.position='absolute';
    menu.style.top='calc(100% + 10px)';
    menu.style.bottom='auto';
    menu.style.left='50%';
    menu.style.right='auto';
    menu.style.transform='translateX(-50%)';
    menu.style.margin='0';
    menu.style.zIndex='1000';

    // Keep it centered under the actual Mi Nexo item and bounded to viewport.
    const width=Math.min(430, Math.max(280, window.innerWidth-30));
    menu.style.width=width+'px';
    if(window.innerWidth<=600){
      menu.style.position='fixed';
      menu.style.top='68px';
      menu.style.left='50%';
      menu.style.right='auto';
      menu.style.transform='translateX(-50%)';
      menu.style.width='calc(100vw - 24px)';
      menu.style.maxHeight='calc(100vh - 84px)';
      menu.style.overflow='auto';
    }
  }

  ready(()=>{
    setTimeout(apply,450);
    setTimeout(apply,1800);
    window.addEventListener('resize',apply,{passive:true});
  });
})();
