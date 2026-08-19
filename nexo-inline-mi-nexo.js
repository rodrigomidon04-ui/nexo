/* NEXO: keep Mi Nexo subsections inline under their own entries. */
(function(){
  'use strict';
  if(window.__NEXOINLINEMINEXO)return;
  window.__NEXOINLINEMINEXO=true;

  const $=id=>document.getElementById(id);

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

  function moveInline(button,key){
    const sec=$(key);
    if(!sec||!button)return;
    normalizeSection(sec);
    button.insertAdjacentElement('afterend',sec);
  }

  function openSection(key){
    if(key==='sesiones'){
      const panel=$('nexoSessionsPanel'),entry=$('nexoSesionesEntry');
      if(panel&&entry){
        panel.hidden=false;panel.style.display='block';entry.classList.add('active');center(panel);return true;
      }
      return false;
    }
    const button=document.querySelector(`#nexoWorkspaceCard .nexo-final-link[data-final-target="${key}"]`);
    const sec=$(key);
    if(!button||!sec)return false;
    const isOpen=!sec.hidden&&sec.style.display!=='none';
    if(isOpen){sec.hidden=true;sec.style.display='none';button.classList.remove('active');return true;}
    // The real section keeps its original ID and is placed immediately below its own entry.
    button.insertAdjacentElement('afterend',sec);
    center(sec);button.classList.add('active');return true;
  }

  function prepare(){
    const workspace=$('nexoWorkspace'),card=$('nexoWorkspaceCard');
    if(!workspace||!card)return;

    // Preserve the original IDs of the real modules. Only reposition their existing nodes.
    ['contactos','invitaciones','ecosistema'].forEach(key=>{
      const button=card.querySelector(`.nexo-final-link[data-final-target="${key}"]`);
      const sec=$(key);
      if(button&&sec)moveInline(button,key);
    });

    if(!$('nexo-mi-nexo-inline-style')){
      const s=document.createElement('style');s.id='nexo-mi-nexo-inline-style';s.textContent=`
        #nexoWorkspaceCard > section[id="contactos"],#nexoWorkspaceCard > section[id="invitaciones"],#nexoWorkspaceCard > section[id="ecosistema"]{width:100%;box-sizing:border-box;margin:0!important;padding:24px!important;border-top:1px solid var(--line);background:rgba(255,255,255,.018)}
        #nexoWorkspaceCard > section[id="contactos"] .section-head,#nexoWorkspaceCard > section[id="invitaciones"] .section-head,#nexoWorkspaceCard > section[id="ecosistema"] .section-head{display:block!important}
      `;document.head.appendChild(s);
    }

    document.addEventListener('click',e=>{
      const menuItem=e.target.closest?.('#nexoFinalMenu [data-final-menu]');
      if(menuItem){
        const key=menuItem.dataset.finalMenu;
        if(['sesiones','contactos','invitaciones','ecosistema'].includes(key)){
          e.preventDefault();e.stopPropagation();openSection(key);$('nexoFinalMenu')?.classList.remove('open');$('nexoFinalToggle')?.setAttribute('aria-expanded','false');return;
        }
      }
      const entry=e.target.closest?.('#nexoWorkspaceCard .nexo-final-link');
      if(entry){
        const key=entry.dataset.finalTarget;
        if(['sesiones','contactos','invitaciones','ecosistema'].includes(key)){
          e.preventDefault();e.stopPropagation();openSection(key);
        }
      }
    },true);
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(prepare,2500),{once:true});else setTimeout(prepare,2500);
})();
