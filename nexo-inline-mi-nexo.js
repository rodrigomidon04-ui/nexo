/* NEXO: keep Mi Nexo subsections inline under their own entries. */
(function(){
  'use strict';
  if(window.__NEXOINLINEMINEXO)return;
  window.__NEXOINLINEMINEXO=true;

  const $=id=>document.getElementById(id);
  const entryFor={contactos:'nexoContactosEntry',invitaciones:'nexoInvitacionesEntry',ecosistema:'nexoEcosistemaEntry'};

  function center(el){
    if(!el)return false;
    el.hidden=false;
    el.style.display='block';
    requestAnimationFrame(()=>el.scrollIntoView({behavior:'smooth',block:'center',inline:'nearest'}));
    return true;
  }

  function normalizeSection(sec){
    if(!sec)return;
    sec.hidden=true;
    sec.style.display='none';
    sec.style.margin='0';
    sec.style.padding='24px';
    sec.style.borderTop='1px solid var(--line)';
    sec.style.background='rgba(255,255,255,.018)';
    const head=sec.querySelector('.section-head');
    if(head)head.style.display='block';
  }

  function moveInline(workspace, key, button){
    const sec=$(key);
    if(!sec || !button || !workspace)return;
    normalizeSection(sec);
    button.insertAdjacentElement('afterend',sec);
  }

  function openSection(key){
    if(key==='sesiones'){
      const panel=$('nexoSessionsPanel'), entry=$('nexoSesionesEntry');
      if(panel&&entry){
        panel.hidden=false; panel.style.display='block'; entry.classList.add('active'); center(panel); return true;
      }
    }
    const button=$(entryFor[key]);
    const sec=$(key);
    if(!button||!sec)return false;
    const isOpen=!sec.hidden && sec.style.display!=='none';
    if(isOpen){ sec.hidden=true; sec.style.display='none'; button.classList.remove('active'); return true; }
    center(sec); button.classList.add('active'); return true;
  }

  function prepare(){
    const workspace=$('nexoWorkspace');
    if(!workspace)return;
    const card=$('nexoWorkspaceCard');
    if(!card)return;

    const buttons=Array.from(card.querySelectorAll('.nexo-final-link'));
    const get=key=>buttons.find(b=>b.dataset.finalTarget===key);
    const contactos=get('contactos');
    const invitaciones=get('invitaciones');
    const ecosistema=get('ecosistema');
    if(!contactos||!invitaciones||!ecosistema)return;

    contactos.id='nexoContactosEntry';
    invitaciones.id='nexoInvitacionesEntry';
    ecosistema.id='nexoEcosistemaEntry';

    moveInline(workspace,'contactos',contactos);
    moveInline(workspace,'invitaciones',invitaciones);
    moveInline(workspace,'ecosistema',ecosistema);

    const sessions=$('nexoSessionsPanel');
    if(sessions){
      sessions.style.borderBottom='1px solid var(--line)';
    }

    // Capture phase: override earlier navigation listeners so each menu item
    // opens its own inline content instead of jumping to a distant section.
    document.addEventListener('click',function(e){
      const menuItem=e.target.closest?.('[data-final-menu]');
      if(menuItem){
        const key=menuItem.dataset.finalMenu;
        if(['sesiones','contactos','invitaciones','ecosistema'].includes(key)){
          e.preventDefault(); e.stopPropagation();
          openSection(key);
          document.getElementById('nexoFinalMenu')?.classList.remove('open');
          document.getElementById('nexoFinalToggle')?.setAttribute('aria-expanded','false');
          return;
        }
      }
      const entry=e.target.closest?.('.nexo-final-link');
      if(entry && entry.closest('#nexoWorkspaceCard')){
        const key=entry.dataset.finalTarget;
        if(['sesiones','contactos','invitaciones','ecosistema'].includes(key)){
          // Keep Sesiones' existing inline panel, and apply the same pattern
          // to the other three sections.
          e.preventDefault(); e.stopPropagation();
          openSection(key);
        }
      }
    },true);
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(prepare,2300),{once:true});
  else setTimeout(prepare,2300);
})();
