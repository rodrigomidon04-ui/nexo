/* NEXO FINAL BODY ORDER
   Exact structure requested:
   01 Salas
   02 Espacios
   03 Mi Centro = dashboard + existing 03.3.1/03.4 module
   04 Mi Nexo = workspace with Sesiones, Contactos, Invitaciones, Ecosistema
   05 Chats = existing NEXO 3.3 module
   06 Identidad = existing Perfil module
*/
(function(){
  'use strict';
  if(window.__NEXOFINALORDER)return; window.__NEXOFINALORDER=true;

  const byId=id=>document.getElementById(id);
  const wait=ms=>new Promise(r=>setTimeout(r,ms));

  function tag(section,value){
    const el=section?.querySelector?.('.tag');
    if(el) el.textContent=value;
  }
  function headTitle(section,html){
    const el=section?.querySelector?.('.section-head h2');
    if(el) el.innerHTML=html;
  }
  function moveAfter(node,anchor){
    if(node&&anchor&&anchor.parentNode) anchor.parentNode.insertBefore(node,anchor.nextSibling);
  }
  function removeFromWorkspace(node){
    if(!node)return;
    const workspace=byId('nexoWorkspace');
    if(workspace && workspace.contains(node) && workspace.parentNode){
      // detached below by caller
    }
  }

  function apply(){
    const salas=byId('salas');
    const espacios=byId('explorar');
    const centro=byId('dashboard');
    const workspace=byId('nexoWorkspace');
    const advanced=byId('nexo33134');
    const chats=byId('nexo33');
    const identidad=byId('perfil');

    // 01 — unchanged.
    if(salas) tag(salas,'01 — Salas');

    // 02 — rename only; keep existing title/content.
    if(espacios) tag(espacios,'02 — Espacios');

    // 03 — Mi Centro: dashboard heading + the existing 03.3.1 / 03.4 module.
    if(centro){
      tag(centro,'03 — Mi Centro');
      headTitle(centro,'Tu centro<br>de conexión.');
    }
    if(advanced && centro){
      // Remove the advanced module from whichever workspace/panel currently contains it.
      const label=advanced.querySelector('.section-head .tag');
      if(label) label.textContent='CONTROL · SESIONES';
      const oldHead=advanced.querySelector('.section-head');
      if(oldHead) oldHead.style.display='none';
      centro.appendChild(advanced);
    }

    // 04 — Mi Nexo: ONLY the connectivity workspace.
    if(workspace){
      const wtag=workspace.querySelector('.nexo-workspace-head .tag');
      const p=workspace.querySelector('.nexo-workspace-head p');
      if(wtag) wtag.textContent='04 — Mi Nexo';
      const title=workspace.querySelector('.nexo-workspace-head h2');
      if(title) title.innerHTML='Conectividad';
      if(p) p.textContent='Sesiones, contactos, invitaciones y ecosistema.';
    }

    // 05 — Chats: existing NEXO 3.3 module, moved after Mi Nexo.
    if(chats){
      tag(chats,'05 — Chats');
      headTitle(chats,'Conectá en<br>tiempo real.');
      if(workspace) moveAfter(chats,workspace);
      else if(centro) moveAfter(chats,centro);
    }

    // 06 — Identidad: existing Profile module, moved to the very end.
    if(identidad){
      tag(identidad,'06 — Identidad');
      headTitle(identidad,'Tu identidad<br>en NEXO.');
      identidad.style.display='block';
      identidad.hidden=false;
      if(chats) moveAfter(identidad,chats);
      else if(workspace) moveAfter(identidad,workspace);
      else if(centro) moveAfter(identidad,centro);
    }

    // Keep the final block order explicit in the main document.
    const footer=document.querySelector('footer');
    const ordered=[salas,espacios,centro,workspace,chats,identidad].filter(Boolean);
    if(footer){
      // Only reposition sections that are direct children of body; nested legacy content stays where it is.
      let prev=null;
      ordered.forEach(sec=>{
        if(!sec || !sec.parentNode || sec===footer)return;
        if(sec.parentNode!==document.body)return;
        document.body.insertBefore(sec,footer);
        if(prev && prev.nextSibling!==sec) document.body.insertBefore(sec,prev.nextSibling);
        prev=sec;
      });
    }

    // Hide any stale legacy standalone versions without deleting logic.
    document.querySelectorAll('[data-nexo-legacy-order]').forEach(el=>el.removeAttribute('data-nexo-legacy-order'));

    // Cache bust this final organizer through a stable marker.
    document.documentElement.dataset.nexoOrder='final-06';
  }

  async function boot(){
    await wait(120);
    apply();
    await wait(500);
    apply();
    await wait(1200);
    apply();
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot,{once:true});
  else boot();
})();
