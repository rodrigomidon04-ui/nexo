/* NEXO section order 01-06: labels/order only, preserve existing IDs and listeners. */
(function(){
  'use strict';
  if(window.__NEXOSECTIONORDER)return; window.__NEXOSECTIONORDER=true;

  function text(el){ return el ? (el.textContent||'') : ''; }
  function setTag(section, value){
    const tag=section?.querySelector('.tag');
    if(tag) tag.textContent=value;
  }
  function setTitle(section, value){
    const h2=section?.querySelector('.section-head h2');
    if(h2) h2.innerHTML=value;
  }
  function run(){
    const salas=document.getElementById('salas');
    const explorar=document.getElementById('explorar');
    const ecosistema=document.getElementById('ecosistema');
    const dashboard=document.getElementById('dashboard');
    const chats=document.getElementById('nexo33134') || document.getElementById('nexo33');
    const perfil=document.getElementById('perfil');

    // 01 — Salas: unchanged.
    if(salas) setTag(salas,'01 — Salas');

    // 02 — Espacios: rename only, keep title/content exactly as current section.
    if(explorar) setTag(explorar,'02 — Espacios');

    // 03 — Mi Centro: use current Mi NEXO heading/subtitle as the center block.
    if(dashboard){
      setTag(dashboard,'03 — Mi Centro');
      const h2=dashboard.querySelector('.section-head h2');
      if(h2) h2.innerHTML='Tu centro<br>de conexión.';
    }

    // 04 — Mi Nexo: the unified connectivity area that already contains contacts/invitations/ecosystem.
    // nexo-layout creates #nexoWorkspace after #dashboard; rename its heading/tag after mount.
    const workspace=document.getElementById('nexoWorkspace');
    if(workspace){
      const tag=workspace.querySelector('.nexo-workspace-head .tag');
      if(tag) tag.textContent='04 — Mi Nexo';
      const p=workspace.querySelector('.nexo-workspace-head p');
      if(p) p.textContent='Conectividad';
    }

    // 05 — Chats: the existing real-time chat/session section.
    if(chats){
      const tag=chats.querySelector('.section-head .tag');
      if(tag) tag.textContent='05 — Chats';
      const h2=chats.querySelector('.section-head h2');
      if(h2) h2.innerHTML='Conectá en tiempo real.';
    }

    // 06 — Identidad: existing profile block, moved logically after Chats; keep it available to app logic.
    if(perfil){
      const tag=perfil.querySelector('.section-head .tag');
      if(tag) tag.textContent='06 — Identidad';
      const h2=perfil.querySelector('.section-head h2');
      if(h2) h2.innerHTML='Tu identidad<br>en NEXO.';
    }
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',()=>setTimeout(run,50),{once:true});
  else setTimeout(run,50);
})();
