/* NEXO navigation organizer — Mi Nexo compact accordion */
(function(){
  'use strict';
  if(window.__NEXONAV)return; window.__NEXONAV=true;
  const nav=document.querySelector('.nav .navlinks');
  if(!nav)return;

  nav.innerHTML=`
    <a href="#inicio">Inicio</a>
    <a href="#salas">Salas</a>
    <a href="#explorar">Espacios</a>
    <button type="button" class="nexo-nav-account" id="nexoNavAccount" aria-expanded="false">Mi Nexo <span class="nexo-chevron">⌄</span></button>
  `;

  const style=document.createElement('style');
  style.id='nexo-nav-organizer-style';
  style.textContent=`
    .navlinks{align-items:center;position:relative}
    .nexo-nav-account{border:0;background:transparent;color:var(--muted);font:inherit;font-size:13px;padding:8px 0;cursor:pointer;display:inline-flex;gap:5px;align-items:center}
    .nexo-nav-account:hover,.nexo-nav-account[aria-expanded="true"]{color:var(--text)}
    .nexo-chevron{font-size:12px;transition:.2s}
    .nexo-nav-account[aria-expanded="true"] .nexo-chevron{transform:rotate(180deg)}
    .nexo-menu{position:absolute;top:calc(100% + 14px);right:0;width:min(590px,calc(100vw - 30px));padding:14px;background:rgba(13,18,24,.98);border:1px solid var(--line);border-radius:22px;box-shadow:0 30px 80px rgba(0,0,0,.5);backdrop-filter:blur(20px);z-index:70;display:none}
    .nexo-menu.open{display:block}
    .nexo-menu-head{padding:5px 8px 12px;border-bottom:1px solid var(--line);display:flex;justify-content:space-between;align-items:end;gap:14px}
    .nexo-menu-title{font-weight:900;font-size:20px}
    .nexo-menu-sub{font-size:11px;color:var(--muted)}
    .nexo-step{border-bottom:1px solid var(--line)}
    .nexo-step:last-child{border-bottom:0}
    .nexo-step-btn{width:100%;border:0;background:transparent;color:var(--text);padding:14px 8px;display:flex;align-items:center;gap:12px;text-align:left}
    .nexo-step-btn:hover{background:rgba(77,216,255,.04)}
    .nexo-step-btn[aria-expanded="true"]{background:rgba(77,216,255,.055)}
    .nexo-step-icon{width:34px;height:34px;border-radius:11px;background:rgba(77,216,255,.08);color:var(--cyan);display:grid;place-items:center;font-size:14px;flex:0 0 auto}
    .nexo-step-main{min-width:0;flex:1}
    .nexo-step-main strong{display:block;font-size:14px}
    .nexo-step-main span{display:block;color:var(--muted);font-size:11px;line-height:1.4;margin-top:3px}
    .nexo-step-arrow{color:var(--muted);font-size:13px;transition:.2s}
    .nexo-step-btn[aria-expanded="true"] .nexo-step-arrow{transform:rotate(90deg);color:var(--cyan)}
    .nexo-step-panel{display:none;padding:0 8px 14px 54px}
    .nexo-step-panel.open{display:block}
    .nexo-subgrid{display:flex;gap:8px;flex-wrap:wrap}
    .nexo-sub{border:1px solid var(--line);background:rgba(255,255,255,.025);color:var(--text);padding:8px 10px;border-radius:11px;font-size:11px}
    .nexo-sub:hover{border-color:rgba(77,216,255,.3);background:rgba(77,216,255,.05)}
    .nexo-note{font-size:11px;color:var(--muted);line-height:1.5;margin:0 0 10px}
    @media(max-width:600px){.navlinks{gap:12px}.nexo-nav-account{font-size:12px}.nexo-menu{position:fixed;top:68px;left:12px;right:12px;width:auto;max-height:calc(100vh - 84px);overflow:auto}}
  `;
  document.head.appendChild(style);

  const menu=document.createElement('div');
  menu.className='nexo-menu';
  menu.id='nexoMenu';
  menu.innerHTML=`
    <div class="nexo-menu-head">
      <div><div class="tag">MI NEXO</div><div class="nexo-menu-title">Tu centro de conexión.</div></div>
      <div class="nexo-menu-sub">Todo lo personal, ordenado.</div>
    </div>

    <div class="nexo-step">
      <button type="button" class="nexo-step-btn" data-step="sesiones" aria-expanded="true">
        <span class="nexo-step-icon">◌</span><span class="nexo-step-main"><strong>Sesiones</strong><span>Chats, conversaciones y control de actividad.</span></span><span class="nexo-step-arrow">›</span>
      </button>
      <div class="nexo-step-panel open" data-panel="sesiones">
        <p class="nexo-note">Aquí se concentra lo relacionado con tus sesiones: conversación privada, actividad e historial. “Salas” queda fuera porque ya tiene su propia entrada principal.</p>
        <div class="nexo-subgrid">
          <a class="nexo-sub" href="#nexo33">Chats</a>
          <a class="nexo-sub" href="#historial">Historial</a>
          <a class="nexo-sub" href="#nexo33134">Actividad</a>
        </div>
      </div>
    </div>

    <div class="nexo-step">
      <button type="button" class="nexo-step-btn" data-step="contactos" aria-expanded="false">
        <span class="nexo-step-icon">◎</span><span class="nexo-step-main"><strong>Contactos</strong><span>Personas conectadas a tu Nexo.</span></span><span class="nexo-step-arrow">›</span>
      </button>
      <div class="nexo-step-panel" data-panel="contactos">
        <p class="nexo-note">Buscá personas, revisá tus conexiones y gestioná tu red sin salir del contexto de Mi Nexo.</p>
        <div class="nexo-subgrid"><a class="nexo-sub" href="#contactos">Abrir contactos</a><a class="nexo-sub" href="#nexo33">Ver presencia</a></div>
      </div>
    </div>

    <div class="nexo-step">
      <button type="button" class="nexo-step-btn" data-step="invitaciones" aria-expanded="false">
        <span class="nexo-step-icon">✉</span><span class="nexo-step-main"><strong>Invitaciones</strong><span>Invitaciones a salas y conexiones pendientes.</span></span><span class="nexo-step-arrow">›</span>
      </button>
      <div class="nexo-step-panel" data-panel="invitaciones">
        <p class="nexo-note">Administrá invitaciones recibidas y compartí tus salas con tus contactos.</p>
        <div class="nexo-subgrid"><a class="nexo-sub" href="#invitaciones">Abrir invitaciones</a><a class="nexo-sub" href="#salas">Ir a salas</a></div>
      </div>
    </div>

    <div class="nexo-step">
      <button type="button" class="nexo-step-btn" data-step="ecosistema" aria-expanded="false">
        <span class="nexo-step-icon">✦</span><span class="nexo-step-main"><strong>Ecosistema</strong><span>Work, Edu, Care y futuros espacios NEXO.</span></span><span class="nexo-step-arrow">›</span>
      </button>
      <div class="nexo-step-panel" data-panel="ecosistema">
        <p class="nexo-note">Explorá los distintos usos de NEXO y los módulos que iremos incorporando.</p>
        <div class="nexo-subgrid"><a class="nexo-sub" href="#ecosistema">Ver ecosistema</a><a class="nexo-sub" href="#perfil">Mi perfil</a></div>
      </div>
    </div>
  `;
  nav.appendChild(menu);

  const btn=document.getElementById('nexoNavAccount');
  const close=()=>{menu.classList.remove('open');btn?.setAttribute('aria-expanded','false')};
  btn?.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();const open=!menu.classList.contains('open');menu.classList.toggle('open',open);btn.setAttribute('aria-expanded',String(open))});
  document.addEventListener('click',e=>{if(!nav.contains(e.target))close()});
  document.addEventListener('keydown',e=>{if(e.key==='Escape')close()});

  menu.querySelectorAll('.nexo-step-btn').forEach(step=>step.addEventListener('click',e=>{
    e.preventDefault();
    const key=step.dataset.step;
    const panel=menu.querySelector(`[data-panel="${key}"]`);
    const open=panel.classList.toggle('open');
    step.setAttribute('aria-expanded',String(open));
  }));
})();
