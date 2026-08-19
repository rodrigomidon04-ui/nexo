/* NEXO: inline panels for Mi Nexo without changing real module IDs. */
(function(){
  'use strict';
  if(window.__NEXOINLINEMINEXO)return;
  window.__NEXOINLINEMINEXO=true;

  const $=id=>document.getElementById(id);
  const keys=['contactos','invitaciones','ecosistema'];

  function center(el){
    if(!el)return false;
    el.hidden=false;
    el.style.display='block';
    requestAnimationFrame(()=>el.scrollIntoView({behavior:'smooth',block:'center',inline:'nearest'}));
    return true;
  }

  function hidePanels(card){
    card.querySelectorAll('section[data-nexo-inline="1"]').forEach(sec=>{
      sec.hidden=true;
      sec.style.display='none';
      const b=card.querySelector(`.nexo-final-link[data-final-target="${sec.id}"]`);
      b?.classList.remove('active');
    });
  }

  function placeSection(button,sec){
    if(!button||!sec)return;
    sec.dataset.nexoInline='1';
    sec.hidden=true;
    sec.style.display='none';
    sec.style.width='100%';
    sec.style.boxSizing='border-box';
    sec.style.margin='0';
    sec.style.padding='24px';
    sec.style.borderTop='1px solid var(--line)';
    sec.style.background='rgba(255,255,255,.018)';
    button.after(sec);
  }

  function openSection(key){
    const card=$('nexoWorkspaceCard');
    if(!card)return false;
    if(key==='sesiones'){
      const panel=$('nexoSessionsPanel'), entry=$('nexoSesionesEntry');
      if(panel&&entry){
        hidePanels(card);
        panel.hidden=false;
        panel.style.display='block';
        entry.classList.add('active');
        requestAnimationFrame(()=>panel.scrollIntoView({behavior:'smooth',block:'center',inline:'nearest'}));
        return true;
      }
      return false;
    }
    const button=card.querySelector(`.nexo-final-link[data-final-target="${key}"]`);
    const sec=$(key);
    if(!button||!sec)return false;
    hidePanels(card);
    placeSection(button,sec);
    sec.hidden=false;
    sec.style.display='block';
    button.classList.add('active');
    center(sec);
    return true;
  }

  function prepare(){
    const card=$('nexoWorkspaceCard');
    if(!card)return;

    // Preserve the real module IDs and place each module directly after its entry.
    keys.forEach(key=>{
      const button=card.querySelector(`.nexo-final-link[data-final-target="${key}"]`);
      const sec=$(key);
      if(button&&sec)placeSection(button,sec);
    });

    if(!$('nexo-mi-nexo-inline-style')){
      const s=document.createElement('style');
      s.id='nexo-mi-nexo-inline-style';
      s.textContent=`
        #nexoWorkspaceCard > section[data-nexo-inline="1"]{width:100%!important;box-sizing:border-box;margin:0!important;padding:24px!important;border-top:1px solid var(--line);background:rgba(255,255,255,.018)}
        #nexoWorkspaceCard > section[data-nexo-inline="1"] .section-head{display:block!important}
      `;
      document.head.appendChild(s);
    }

    // One final capture handler controls the four Mi Nexo entries.
    document.addEventListener('click',e=>{
      const menuItem=e.target.closest?.('#nexoFinalMenu [data-final-menu]');
      if(menuItem){
        const key=menuItem.dataset.finalMenu;
        if(['sesiones','contactos','invitaciones','ecosistema'].includes(key)){
          e.preventDefault();
          e.stopImmediatePropagation();
          openSection(key);
          $('nexoFinalMenu')?.classList.remove('open');
          $('nexoFinalToggle')?.setAttribute('aria-expanded','false');
          return;
        }
      }
      const entry=e.target.closest?.('#nexoWorkspaceCard .nexo-final-link');
      if(entry){
        const key=entry.dataset.finalTarget;
        if(['sesiones','contactos','invitaciones','ecosistema'].includes(key)){
          e.preventDefault();
          e.stopImmediatePropagation();
          openSection(key);
        }
      }
    },true);
  }

  const boot=()=>setTimeout(prepare,3200);
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});
  else boot();
})();
