/* NEXO UI controller — single source of truth for layout/navigation.
   Keeps business logic in the existing Supabase/chat/rooms scripts.
   Never touches nexo-salas. */
(function(){
  'use strict';
  if (window.__NEXO_UI_CONTROLLER__) return;
  window.__NEXO_UI_CONTROLLER__ = true;

  const $ = id => document.getElementById(id);
  const HIDDEN = 'nexo-ui-hidden';
  let initialized = false;

  function styleOnce(){
    if ($('nexo-ui-controller-style')) return;
    const s = document.createElement('style');
    s.id = 'nexo-ui-controller-style';
    s.textContent = `
      .${HIDDEN}{display:none!important}
      #nexoWorkspace{padding:72px 0 96px}
      #nexoWorkspace .nexo-workspace-head{display:flex;justify-content:space-between;align-items:end;gap:20px;margin-bottom:24px}
      #nexoWorkspace .nexo-workspace-head h2{font-size:clamp(34px,4.5vw,52px);line-height:.96;letter-spacing:-.04em;margin:8px 0}
      #nexoWorkspace .nexo-workspace-head p{max-width:520px}
      .nexo-workspace-card{border:1px solid var(--line);border-radius:22px;overflow:hidden;background:linear-gradient(145deg,rgba(255,255,255,.05),rgba(255,255,255,.018));box-shadow:var(--shadow)}
      .nexo-final-link{width:100%;border:0;border-bottom:1px solid var(--line);background:transparent;color:var(--text);padding:18px 20px;display:flex;align-items:center;gap:14px;text-align:left;cursor:pointer}
      .nexo-final-link:last-child{border-bottom:0}
      .nexo-final-link:hover,.nexo-final-link.active{background:rgba(77,216,255,.045)}
      .nexo-final-link>span:first-child{width:38px;height:38px;border-radius:12px;background:rgba(77,216,255,.08);color:var(--cyan);display:grid;place-items:center;flex:0 0 auto}
      .nexo-final-copy{display:block;flex:1;min-width:0}.nexo-final-copy strong{display:block;font-size:15px}.nexo-final-copy em{display:block;font-style:normal;color:var(--muted);font-size:11px;line-height:1.4;margin-top:3px}.nexo-final-link i{font-style:normal;color:var(--muted);font-size:18px}
      .nexo-inline-panel{display:none;border-bottom:1px solid var(--line);padding:22px;background:rgba(255,255,255,.018)}
      .nexo-inline-panel.open{display:block}
      .nexo-inline-panel > section{margin:0!important;padding:0!important;display:block!important}
      .nexo-inline-panel > section > .section-head{display:none!important}
      .nexo-inline-panel > section .container{padding:0!important;max-width:none!important}
      .nexo-inline-panel > #nexo312RoomsHost{display:block}
      #nexoSessionsPanel{display:none;border-bottom:1px solid var(--line);padding:22px;background:rgba(255,255,255,.018)}
      #nexoSessionsPanel.open{display:block}
      .nexo-sessions-head{display:flex;justify-content:space-between;align-items:center;gap:16px;margin-bottom:18px}
      .nexo-sessions-head h3{margin:7px 0 0;font-size:26px;letter-spacing:-.03em}
      .nexo-sessions-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px}
      .nexo-session-card{padding:20px}.nexo-session-card h4{margin:8px 0;font-size:18px}.nexo-session-card p{font-size:12px;line-height:1.5;min-height:42px}
      .nexo-session-status{display:flex;align-items:center;gap:8px;margin-top:14px}.nexo-status-dot{width:8px;height:8px;border-radius:50%;background:var(--green)}
      .nexo-session-empty{margin-top:14px;padding:12px;border:1px dashed var(--line);border-radius:12px;color:var(--muted);font-size:11px}
      .nexo-menu{position:absolute;top:calc(100% + 14px);right:0;width:min(430px,calc(100vw - 30px));padding:12px;background:rgba(13,18,24,.98);border:1px solid var(--line);border-radius:22px;box-shadow:0 30px 80px rgba(0,0,0,.5);backdrop-filter:blur(20px);z-index:70;display:none}
      .nexo-menu.open{display:block}
      .nexo-menu-head{padding:6px 10px 12px;border-bottom:1px solid var(--line);display:flex;justify-content:space-between;align-items:end;gap:12px}
      .nexo-menu-title{font-weight:900;font-size:20px}.nexo-menu-sub{font-size:11px;color:var(--muted)}
      .nexo-step{width:100%;border:0;border-bottom:1px solid var(--line);background:transparent;color:var(--text);padding:15px 10px;display:flex;align-items:center;gap:12px;text-align:left;cursor:pointer}
      .nexo-step:last-child{border-bottom:0}.nexo-step:hover{background:rgba(77,216,255,.045)}
      .nexo-step-icon{width:34px;height:34px;border-radius:11px;background:rgba(77,216,255,.08);color:var(--cyan);display:grid;place-items:center;font-size:14px;flex:0 0 auto}
      .nexo-step-main{min-width:0;flex:1}.nexo-step-main strong{display:block;font-size:14px}.nexo-step-main span{display:block;color:var(--muted);font-size:11px;line-height:1.4;margin-top:3px}.nexo-step-arrow{color:var(--muted);font-size:16px}
      .nexo-nav-mi{display:inline-flex;align-items:center;gap:2px}.nexo-nav-account-link{padding:8px 0}.nexo-nav-toggle{border:0;background:transparent;color:var(--muted);padding:8px 4px;font:inherit;cursor:pointer}.nexo-nav-toggle[aria-expanded="true"]{transform:rotate(180deg)}
      @media(max-width:900px){#nexoWorkspace .nexo-workspace-head{align-items:start;flex-direction:column}.nexo-sessions-grid{grid-template-columns:1fr}.nexo-menu{position:fixed;top:68px;left:12px;right:12px;width:auto;max-height:calc(100vh - 84px);overflow:auto}.navlinks{gap:12px}}
    `;
    document.head.appendChild(s);
  }

  function center(el){
    if (!el) return false;
    el.hidden = false;
    el.classList.remove(HIDDEN);
    requestAnimationFrame(() => el.scrollIntoView({behavior:'smooth', block:'center', inline:'nearest'}));
    return true;
  }

  function setTag(section, text){
    const tag = section?.querySelector?.('.section-head .tag');
    if (tag) tag.textContent = text;
  }

  function setHeading(section, html){
    const h = section?.querySelector?.('.section-head h2');
    if (h) h.innerHTML = html;
  }

  function hideLegacySection(section){
    if (!section) return;
    section.classList.add(HIDDEN);
    section.hidden = true;
    section.setAttribute('aria-hidden','true');
  }

  function makeSessionsPanel(){
    const panel = document.createElement('div');
    panel.id = 'nexoSessionsPanel';
    panel.innerHTML = `
      <div class="nexo-sessions-head">
        <div><div class="tag">SESIONES</div><h3>Conversaciones y actividad.</h3></div>
        <button type="button" class="btn" id="nexoSessionsClose">Cerrar</button>
      </div>
      <div class="nexo-sessions-grid">
        <div class="card nexo-session-card">
          <div class="tag">CONVERSACIONES</div><h4>Chats</h4>
          <p class="muted">Tus conversaciones privadas y de sala viven en NEXO.</p>
          <button type="button" class="btn primary" id="nexoSessionsChats">Abrir Chats</button>
        </div>
        <div class="card nexo-session-card">
          <div class="tag">ACTIVIDAD</div><h4>Estado y presencia</h4>
          <p class="muted">Consultá tu actividad reciente y tu estado dentro de NEXO.</p>
          <div class="nexo-session-status"><span class="nexo-status-dot"></span><strong>Activo</strong></div>
        </div>
        <div class="card nexo-session-card">
          <div class="tag">HISTORIAL</div><h4>Sesiones recientes</h4>
          <p class="muted">Tus llamadas y sesiones recientes se muestran aquí.</p>
          <div class="nexo-session-empty">Las llamadas permanecen gestionadas por NEXO Salas.</div>
        </div>
      </div>`;
    return panel;
  }

  function buildWorkspace(elements){
    const {salas, espacios, centro, advanced, chats, perfil, contactos, invitaciones, ecosistema, historial} = elements;
    document.querySelectorAll('#nexoWorkspace').forEach(x=>x.remove());

    setTag(salas,'01 — Salas');
    setTag(espacios,'02 — Espacios');
    setTag(centro,'03 — Mi Centro');
    setHeading(centro,'Tu centro<br>de conexión.');
    setTag(chats,'05 — Chats');
    setTag(perfil,'00 — Identidad');
    setHeading(perfil,'Tu perfil, tu NEXO.');

    if (advanced && advanced.parentElement !== centro){
      advanced.classList.remove(HIDDEN); advanced.hidden=false; advanced.style.display='block';
      advanced.querySelector('.section-head')?.classList.add(HIDDEN);
      centro.appendChild(advanced);
    }

    const workspace = document.createElement('section');
    workspace.id='nexoWorkspace';
    workspace.innerHTML = `
      <div class="container">
        <div class="nexo-workspace-head">
          <div><div class="tag">04 — Mi Nexo</div><h2>Conectividad</h2></div>
          <p class="muted">Sesiones, contactos, invitaciones y ecosistema.</p>
        </div>
        <div class="nexo-workspace-card" id="nexoWorkspaceCard">
          <button type="button" class="nexo-final-link" data-ui-target="sesiones"><span>◌</span><span class="nexo-final-copy"><strong>Sesiones</strong><em>Conversaciones, actividad e historial.</em></span><i>›</i></button>
          <div class="nexo-inline-panel" id="nexoSessionsHost"></div>
          <button type="button" class="nexo-final-link" data-ui-target="contactos"><span>◎</span><span class="nexo-final-copy"><strong>Contactos</strong><em>Tu red de personas.</em></span><i>›</i></button>
          <div class="nexo-inline-panel" data-panel-for="contactos"></div>
          <button type="button" class="nexo-final-link" data-ui-target="invitaciones"><span>✉</span><span class="nexo-final-copy"><strong>Invitaciones</strong><em>Salas e invitaciones pendientes.</em></span><i>›</i></button>
          <div class="nexo-inline-panel" data-panel-for="invitaciones"></div>
          <button type="button" class="nexo-final-link" data-ui-target="ecosistema"><span>✦</span><span class="nexo-final-copy"><strong>Ecosistema</strong><em>Work, Edu, Care y futuros espacios NEXO.</em></span><i>›</i></button>
          <div class="nexo-inline-panel" data-panel-for="ecosistema"></div>
        </div>
      </div>`;

    const sessionsPanel=makeSessionsPanel();
    const sessionsHost=workspace.querySelector('#nexoSessionsHost');
    sessionsHost.appendChild(sessionsPanel);
    sessionsHost.id='nexoSessionsPanel';

    const map={contactos,invitaciones,ecosistema};
    Object.entries(map).forEach(([id,sec])=>{
      const host=workspace.querySelector(`[data-panel-for="${id}"]`);
      if(!host || !sec) return;
      sec.classList.remove(HIDDEN); sec.hidden=false; sec.removeAttribute('aria-hidden'); sec.style.display='block'; sec.style.margin='0'; sec.style.padding='0';
      sec.querySelector('.section-head')?.classList.add(HIDDEN);
      host.appendChild(sec);
    });

    // Keep the existing "Mis salas" card with invitations when the social module created it.
    const roomsNode=document.getElementById('n312Rooms');
    const roomsArticle=roomsNode?.closest('article');
    if(roomsArticle && roomsArticle.parentElement && !roomsArticle.closest('[data-panel-for="invitaciones"]')){
      const inviteHost=workspace.querySelector('[data-panel-for="invitaciones"]');
      if(inviteHost){roomsArticle.querySelector('.section-head')?.classList.add(HIDDEN);inviteHost.appendChild(roomsArticle);}
    }

    [historial].forEach(hideLegacySection);
    hideLegacySection(perfil);

    const footer=document.querySelector('footer');
    [salas,espacios,centro,workspace,chats].forEach(sec=>{if(sec)document.body.insertBefore(sec,footer||null)});
    if (footer) document.body.appendChild(footer);
    return workspace;
  }

  function wireWorkspace(workspace, elements){
    const card=$('nexoWorkspaceCard');
    if(!card) return;
    const panels={
      sesiones:$('nexoSessionsPanel'),
      contactos:card.querySelector('[data-panel-for="contactos"]'),
      invitaciones:card.querySelector('[data-panel-for="invitaciones"]'),
      ecosistema:card.querySelector('[data-panel-for="ecosistema"]')
    };
    const buttons=[...card.querySelectorAll('[data-ui-target]')];

    const closePanels=()=>{Object.values(panels).forEach(p=>p?.classList.remove('open'));buttons.forEach(b=>b.classList.remove('active'));};
    const open=key=>{const panel=panels[key];const button=buttons.find(b=>b.dataset.uiTarget===key);if(!panel||!button)return;closePanels();button.classList.add('active');panel.classList.add('open');center(panel);};

    buttons.forEach(b=>b.addEventListener('click',e=>{e.preventDefault();open(b.dataset.uiTarget)}));
    $('nexoSessionsClose')?.addEventListener('click',e=>{e.preventDefault();closePanels()});
    $('nexoSessionsChats')?.addEventListener('click',()=>center(elements.chats));

    const nav=document.querySelector('.nav .navlinks');
    if(!nav)return;
    nav.innerHTML=`<a href="#inicio" data-ui-nav="inicio">Inicio</a><a href="#salas" data-ui-nav="salas">Salas</a><a href="#explorar" data-ui-nav="espacios">Espacios</a><a href="#dashboard" data-ui-nav="micentro">Mi Centro</a><span class="nexo-nav-mi"><a class="nexo-nav-account-link" href="#nexoWorkspace" data-ui-nav="minexo">Mi Nexo</a><button type="button" class="nexo-nav-toggle" id="nexoUiToggle" aria-expanded="false" aria-label="Abrir menú Mi Nexo">⌄</button></span>`;
    const menu=document.createElement('div');menu.id='nexoUiMenu';menu.className='nexo-menu';menu.innerHTML=`<div class="nexo-menu-head"><div><div class="tag">MI NEXO</div><div class="nexo-menu-title">Conectividad</div></div><div class="nexo-menu-sub">Sesiones, contactos, invitaciones y ecosistema.</div></div>${['sesiones','contactos','invitaciones','ecosistema'].map((k,i)=>{const icon=['◌','◎','✉','✦'][i];const copy=['Conversaciones, actividad e historial.','Tu red de personas.','Salas e invitaciones pendientes.','Work, Edu, Care y futuros espacios NEXO.'][i];return `<button type="button" class="nexo-step" data-ui-menu="${k}"><span class="nexo-step-icon">${icon}</span><span class="nexo-step-main"><strong>${k.charAt(0).toUpperCase()+k.slice(1)}</strong><span>${copy}</span></span><span class="nexo-step-arrow">›</span></button>`}).join('')}`;
    nav.appendChild(menu);

    const toggle=$('nexoUiToggle');
    const closeMenu=()=>{menu.classList.remove('open');toggle?.setAttribute('aria-expanded','false')};
    toggle?.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();const isOpen=!menu.classList.contains('open');menu.classList.toggle('open',isOpen);toggle.setAttribute('aria-expanded',String(isOpen));});
    document.addEventListener('click',e=>{if(!nav.contains(e.target))closeMenu()});
    nav.querySelectorAll('[data-ui-nav]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();closeMenu();const id={inicio:'inicio',salas:'salas',espacios:'explorar',micentro:'dashboard',minexo:'nexoWorkspace'}[a.dataset.uiNav];if(id)center($(id));}));
    menu.querySelectorAll('[data-ui-menu]').forEach(b=>b.addEventListener('click',e=>{e.preventDefault();closeMenu();open(b.dataset.uiMenu);}));
  }

  function init(){
    if(initialized)return;
    const elements={salas:$('salas'),espacios:$('explorar'),centro:$('dashboard'),advanced:$('nexo33134'),chats:$('nexo33'),perfil:$('perfil'),contactos:$('contactos'),invitaciones:$('invitaciones'),ecosistema:$('ecosistema'),historial:$('historial')};
    if(!elements.salas||!elements.espacios||!elements.centro||!elements.chats)return false;
    initialized=true;
    styleOnce();
    const workspace=buildWorkspace(elements);
    wireWorkspace(workspace,elements);
    return true;
  }

  let attempts=0;
  const timer=setInterval(()=>{attempts++;if(init()||attempts>=40)clearInterval(timer)},250);
})();
