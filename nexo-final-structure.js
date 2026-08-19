/* NEXO final structure pass: 03 Mi Centro, 04 Mi Nexo, 05 Chats, 06 Identidad. */
(function(){
  'use strict';
  if(window.__NEXOFINAL)return; window.__NEXOFINAL=true;
  const $=id=>document.getElementById(id);
  const wait=fn=>document.readyState==='loading'?document.addEventListener('DOMContentLoaded',fn,{once:true}):fn();

  function style(){
    if($('nexo-final-style'))return;
    const s=document.createElement('style');s.id='nexo-final-style';s.textContent=`
      #nexo33134.nexo-mi-centro-module{padding:70px 0}
      #perfil.nexo-identidad-section{display:block!important;padding:86px 0}
      #perfil.nexo-identidad-section .section-head{display:flex!important}
      #nexo33.nexo-chats-section{padding:70px 0}
      #nexoWorkspace.nexo-mi-nexo-workspace{padding-top:70px}
      #nexoWorkspace .nexo-workspace-head h2{margin:8px 0}
      .nexo-final-panel-link{cursor:pointer}
    `;document.head.appendChild(s);
  }

  function setText(id,tag,title){
    const sec=$(id); if(!sec)return;
    const t=sec.querySelector('.section-head .tag'); if(t&&tag)t.textContent=tag;
    const h=sec.querySelector('.section-head h2'); if(h&&title)h.innerHTML=title;
  }

  function center(el){ if(!el)return; requestAnimationFrame(()=>el.scrollIntoView({behavior:'smooth',block:'center'})); }

  function ensureAnchor(body,id){
    if(!body)return body;
    let a=$(id); if(!a){a=document.createElement('div');a.id=id;a.style.height='1px';a.style.margin='0';body.prepend(a);}return a;
  }

  function run(){
    style();
    const dashboard=$('dashboard'), workspace=$('nexoWorkspace'), centro=$('nexo33134'), chats=$('nexo33'), perfil=$('perfil');
    if(!dashboard)return;

    // 01 and 02 labels only.
    setText('salas','01 — Salas',null);
    if($('explorar')){const t=$('explorar').querySelector('.section-head .tag');if(t)t.textContent='02 — Espacios';}

    // 03 — Mi Centro: existing dashboard + the existing 03.3.1/03.4 module.
    setText('dashboard','03 — Mi Centro','Tu centro<br>de conexión.');
    if(centro){
      centro.classList.add('nexo-mi-centro-module');
      centro.querySelector('.section-head .tag')?.replaceChildren(document.createTextNode('03 — Mi Centro'));
      const h=centro.querySelector('.section-head h2'); if(h)h.innerHTML='Tu centro<br>de conexión.';
      // Place the existing 03.3.1/03.4 module directly after the dashboard content.
      dashboard.parentNode.insertBefore(centro,dashboard.nextSibling);
    }

    // 04 — Mi Nexo workspace: Sessions + Contacts + Invitations + Ecosystem.
    if(workspace){
      workspace.classList.add('nexo-mi-nexo-workspace');
      const tag=workspace.querySelector('.nexo-workspace-head .tag'); if(tag)tag.textContent='04 — Mi Nexo';
      const h=workspace.querySelector('.nexo-workspace-head h2'); if(h)h.innerHTML='Conectividad';
      const p=workspace.querySelector('.nexo-workspace-head p'); if(p)p.textContent='Sesiones, contactos, invitaciones y ecosistema.';

      const card=workspace.querySelector('#nexoWorkspaceCard');
      const oldSession=card?.querySelector('.nexo-panel[data-panel="sesiones"]');
      const oldContacts=card?.querySelector('.nexo-panel[data-panel="contactos"]');
      const oldInvites=card?.querySelector('.nexo-panel[data-panel="invitaciones"]');
      const oldEco=card?.querySelector('.nexo-panel[data-panel="ecosistema"]');
      if(card){
        // Clean Sessions and keep only the real historial/activity block.
        if(oldSession){
          const body=oldSession.querySelector('.nexo-panel-body');
          if(body){
            const allSections=[...body.querySelectorAll(':scope > section')];
            allSections.forEach(sec=>{
              if(sec.id!=='historial'){
                // Move the module back to Mi Centro.
                if(sec.id==='nexo33134' && dashboard.parentNode) dashboard.parentNode.insertBefore(sec,workspace);
                else sec.remove();
              }
            });
            const label=[...body.querySelectorAll('.nexo-inline-label')].find(x=>/CONTROL/i.test(x.textContent||''));
            if(label) label.textContent='CONTROL · SESIONES';
          }
        }
        ensureAnchor(oldSession?.querySelector('.nexo-panel-body'),'nexoSessionAnchor');
        oldContacts&&ensureAnchor(oldContacts.querySelector('.nexo-panel-body'),'nexoContactsAnchor');
        oldInvites&&ensureAnchor(oldInvites.querySelector('.nexo-panel-body'),'nexoInvitesAnchor');
        oldEco&&ensureAnchor(oldEco.querySelector('.nexo-panel-body'),'nexoEcoAnchor');
      }
    }

    // 05 — Chats: exact existing NEXO 3.3 module, no additions.
    if(chats){
      chats.classList.add('nexo-chats-section');
      setText('nexo33','05 — Chats','Conectá en<br>tiempo real.');
      if(chats.parentNode) chats.parentNode.appendChild(chats);
    }

    // 06 — Identidad: exact existing profile block, moved to the very end.
    if(perfil){
      perfil.classList.add('nexo-identidad-section');
      setText('perfil','06 — Identidad','Tu identidad<br>en NEXO.');
      if(perfil.parentNode) perfil.parentNode.appendChild(perfil);
    }

    // Remove identity/profile from the 04 workspace if an older layout put it there.
    const ecoBody=workspace?.querySelector('.nexo-panel[data-panel="ecosistema"] .nexo-panel-body');
    if(ecoBody && perfil && ecoBody.contains(perfil)) document.body.appendChild(perfil);

    buildNav();
  }

  function go(id, panel){
    const el=$(id); if(!el)return;
    if(panel){
      const btn=panel.querySelector('.nexo-panel-btn'),body=panel.querySelector('.nexo-panel-body');
      if(body){body.classList.add('open');btn?.setAttribute('aria-expanded','true');}
    }
    center(el);
    if(history.replaceState)history.replaceState(null,'','#'+id);
  }

  function buildNav(){
    const nav=document.querySelector('.nav .navlinks'); if(!nav)return;
    nav.innerHTML=`
      <a href="#inicio">Inicio</a>
      <a href="#salas">Salas</a>
      <a href="#explorar">Espacios</a>
      <a href="#dashboard" id="nexoNavMiCentro">Mi Centro</a>
      <span class="nexo-nav-mi"><a class="nexo-nav-account-link" href="#nexoWorkspace">Mi Nexo</a><button type="button" class="nexo-nav-toggle" id="nexoNavToggle" aria-expanded="false" aria-label="Abrir menú Mi Nexo">⌄</button></span>
    `;

    const menu=document.getElementById('nexoMenu')||document.createElement('div');
    menu.className='nexo-menu';menu.id='nexoMenu';
    menu.innerHTML=`
      <div class="nexo-menu-head"><div><div class="tag">MI NEXO</div><div class="nexo-menu-title">Conectividad</div></div><div class="nexo-menu-sub">Sesiones, contactos, invitaciones y ecosistema.</div></div>
      <button type="button" class="nexo-step" data-target-panel="sesiones"><span class="nexo-step-icon">◌</span><span class="nexo-step-main"><strong>Sesiones</strong><span>Actividad e historial de llamadas.</span></span><span class="nexo-step-arrow">›</span></button>
      <button type="button" class="nexo-step" data-target-panel="contactos"><span class="nexo-step-icon">◎</span><span class="nexo-step-main"><strong>Contactos</strong><span>Tu red de personas conectadas.</span></span><span class="nexo-step-arrow">›</span></button>
      <button type="button" class="nexo-step" data-target-panel="invitaciones"><span class="nexo-step-icon">✉</span><span class="nexo-step-main"><strong>Invitaciones</strong><span>Salas e invitaciones pendientes.</span></span><span class="nexo-step-arrow">›</span></button>
      <button type="button" class="nexo-step" data-target-panel="ecosistema"><span class="nexo-step-icon">✦</span><span class="nexo-step-main"><strong>Ecosistema</strong><span>Work, Edu, Care y futuros espacios NEXO.</span></span><span class="nexo-step-arrow">›</span></button>
    `;
    nav.appendChild(menu);

    const toggle=$('nexoNavToggle'); const account=nav.querySelector('.nexo-nav-account-link');
    const close=()=>{menu.classList.remove('open');toggle?.setAttribute('aria-expanded','false')};
    toggle?.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();const open=!menu.classList.contains('open');menu.classList.toggle('open',open);toggle.setAttribute('aria-expanded',String(open));});
    account?.addEventListener('click',e=>{e.preventDefault();close();center($('nexoWorkspace'));});
    $('nexoNavMiCentro')?.addEventListener('click',e=>{e.preventDefault();close();center($('dashboard'));});
    menu.querySelectorAll('[data-target-panel]').forEach(btn=>btn.addEventListener('click',e=>{
      e.preventDefault();close();
      const p=$(`.nexo-panel[data-panel="${btn.dataset.targetPanel}"]`);
      const body=p?.querySelector('.nexo-panel-body');
      if(body){body.classList.add('open');p.querySelector('.nexo-panel-btn')?.setAttribute('aria-expanded','true');}
      center(p||$(`nexo${btn.dataset.targetPanel}`));
    }));
  }

  wait(()=>setTimeout(run,120));
})();
