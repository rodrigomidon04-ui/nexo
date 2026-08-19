/* NEXO navigation fix: stable internal destinations for Mi Nexo. */
(function(){
  'use strict';
  if(window.__NEXONAVFIX)return; window.__NEXONAVFIX=true;

  function findSectionTarget(panel){
    const workspace=document.getElementById('nexoWorkspace');
    if(!workspace)return null;
    const panelEl=workspace.querySelector(`.nexo-panel[data-panel="${panel}"]`);
    if(!panelEl)return null;
    const body=panelEl.querySelector('.nexo-panel-body');
    if(body){body.classList.add('open');panelEl.querySelector('.nexo-panel-btn')?.setAttribute('aria-expanded','true');}
    if(panel==='sesiones'){
      return [...panelEl.querySelectorAll('.nexo-inline-label')].find(x=>x.textContent.trim()==='CONTROL · SESIONES') || panelEl;
    }
    return panelEl.querySelector(`#${panel}`) || panelEl;
  }

  function navigate(panel){
    const target=findSectionTarget(panel);
    if(!target)return;
    document.getElementById('nexoMenu')?.classList.remove('open');
    document.getElementById('nexoNavToggle')?.setAttribute('aria-expanded','false');
    requestAnimationFrame(()=>target.scrollIntoView({behavior:'smooth',block:'start'}));
    if(history.replaceState)history.replaceState(null,'',`#${panel}`);
  }

  document.addEventListener('click',function(e){
    const item=e.target.closest?.('#nexoMenu [data-nexo-target]');
    if(!item)return;
    const map={
      'nexo33':'sesiones',
      'nexoControlSesiones':'sesiones',
      'contactos':'contactos',
      'invitaciones':'invitaciones',
      'ecosistema':'ecosistema'
    };
    const target=map[item.dataset.nexoTarget];
    if(!target)return;
    e.preventDefault(); e.stopPropagation();
    navigate(target);
  },true);

  // Make the Mi Nexo text itself open the 04 — Mi NEXO workspace.
  document.addEventListener('click',function(e){
    const link=e.target.closest?.('.nexo-nav-account-link');
    if(!link)return;
    const workspace=document.getElementById('nexoWorkspace');
    if(!workspace)return;
    e.preventDefault(); e.stopPropagation();
    document.getElementById('nexoMenu')?.classList.remove('open');
    document.getElementById('nexoNavToggle')?.setAttribute('aria-expanded','false');
    workspace.scrollIntoView({behavior:'smooth',block:'start'});
  },true);
})();
