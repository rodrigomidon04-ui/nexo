/* NEXO navigation organizer */
(function(){
  'use strict';
  if(window.__NEXONAV)return; window.__NEXONAV=true;
  const nav=document.querySelector('.nav .navlinks');
  if(!nav)return;
  nav.innerHTML=`
    <a href="#inicio">Inicio</a>
    <a href="#salas">Salas</a>
    <a href="#explorar">Espacios</a>
    <button type="button" class="nexo-nav-account" id="nexoNavAccount" aria-expanded="false">Mi NEXO <span class="nexo-chevron">⌄</span></button>
  `;
  const style=document.createElement('style');
  style.id='nexo-nav-organizer-style';
  style.textContent=`
    .navlinks{align-items:center;position:relative}
    .nexo-nav-account{border:0;background:transparent;color:var(--muted);font:inherit;font-size:13px;padding:8px 0;cursor:pointer;display:inline-flex;gap:5px;align-items:center}
    .nexo-nav-account:hover,.nexo-nav-account[aria-expanded="true"]{color:var(--text)}
    .nexo-chevron{font-size:12px;transition:.2s}
    .nexo-nav-account[aria-expanded="true"] .nexo-chevron{transform:rotate(180deg)}
    .nexo-menu{position:absolute;top:calc(100% + 14px);right:0;width:min(620px,calc(100vw - 30px));padding:16px;display:none;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;background:rgba(13,18,24,.97);border:1px solid var(--line);border-radius:20px;box-shadow:0 30px 80px rgba(0,0,0,.5);backdrop-filter:blur(20px);z-index:70}
    .nexo-menu.open{display:grid}
    .nexo-menu-head{grid-column:1/-1;padding:6px 8px 10px;border-bottom:1px solid var(--line);display:flex;justify-content:space-between;align-items:end;gap:14px}
    .nexo-menu-title{font-weight:900;font-size:18px}
    .nexo-menu-sub{font-size:11px;color:var(--muted)}
    .nexo-menu-group{padding:4px}
    .nexo-menu-label{font-size:10px;letter-spacing:.18em;text-transform:uppercase;color:var(--cyan);font-weight:900;padding:8px 8px 6px}
    .nexo-menu-link{display:flex;gap:10px;align-items:flex-start;width:100%;padding:11px 10px;border:1px solid transparent;border-radius:13px;background:transparent;color:var(--text);text-align:left}
    .nexo-menu-link:hover{background:rgba(77,216,255,.06);border-color:rgba(77,216,255,.15)}
    .nexo-menu-icon{width:26px;height:26px;border-radius:9px;background:rgba(77,216,255,.08);color:var(--cyan);display:grid;place-items:center;font-size:12px;flex:0 0 auto}
    .nexo-menu-link strong{display:block;font-size:13px}
    .nexo-menu-link span{display:block;color:var(--muted);font-size:11px;line-height:1.4;margin-top:2px}
    @media(max-width:900px){.nexo-menu{right:-8px;grid-template-columns:1fr}.nexo-menu-head{grid-column:1}.navlinks{gap:14px}}
    @media(max-width:600px){.navlinks{gap:12px}.nexo-nav-account{font-size:12px}.nexo-menu{position:fixed;top:68px;left:12px;right:12px;width:auto;max-height:calc(100vh - 84px);overflow:auto}}
  `;
  document.head.appendChild(style);
  const menu=document.createElement('div');
  menu.className='nexo-menu'; menu.id='nexoMenu';
  menu.innerHTML=`
    <div class="nexo-menu-head"><div><div class="tag">MI NEXO</div><div class="nexo-menu-title">Tu centro de conexión.</div></div><div class="nexo-menu-sub">Todo lo personal, en un solo lugar.</div></div>
    <div class="nexo-menu-group"><div class="nexo-menu-label">Sesiones</div>
      <a class="nexo-menu-link" href="#salas" data-close-menu><span class="nexo-menu-icon">↗</span><div><strong>Conecta</strong><span>Entrá, creá y administrá tus salas.</span></div></a>
      <a class="nexo-menu-link" href="#nexo33" data-close-menu><span class="nexo-menu-icon">◌</span><div><strong>Conversa</strong><span>Chat privado y conversaciones en tiempo real.</span></div></a>
      <a class="nexo-menu-link" href="#historial" data-close-menu><span class="nexo-menu-icon">◷</span><div><strong>Controla</strong><span>Sesiones, historial y actividad.</span></div></a>
    </div>
    <div class="nexo-menu-group"><div class="nexo-menu-label">Tu red</div>
      <a class="nexo-menu-link" href="#nexo33" data-close-menu><span class="nexo-menu-icon">⌁</span><div><strong>Chats</strong><span>Mensajes y presencia online.</span></div></a>
      <a class="nexo-menu-link" href="#contactos" data-close-menu><span class="nexo-menu-icon">◎</span><div><strong>Contactos</strong><span>Personas conectadas a tu Nexo.</span></div></a>
      <a class="nexo-menu-link" href="#invitaciones" data-close-menu><span class="nexo-menu-icon">✉</span><div><strong>Invitaciones</strong><span>Salas e invitaciones pendientes.</span></div></a>
    </div>
    <div class="nexo-menu-group"><div class="nexo-menu-label">Tu ecosistema</div>
      <a class="nexo-menu-link" href="#ecosistema" data-close-menu><span class="nexo-menu-icon">✦</span><div><strong>Ecosistema</strong><span>Work, Edu, Care y nuevos espacios.</span></div></a>
      <a class="nexo-menu-link" href="#perfil" data-close-menu><span class="nexo-menu-icon">◉</span><div><strong>Perfil</strong><span>Nombre, usuario, avatar y datos personales.</span></div></a>
    </div>
    <div class="nexo-menu-group"><div class="nexo-menu-label">Acceso rápido</div>
      <a class="nexo-menu-link" href="#dashboard" data-close-menu><span class="nexo-menu-icon">⌂</span><div><strong>Resumen</strong><span>Volver a tu panel principal.</span></div></a>
    </div>`;
  nav.appendChild(menu);
  const btn=document.getElementById('nexoNavAccount');
  const close=()=>{menu.classList.remove('open');btn?.setAttribute('aria-expanded','false')};
  btn?.addEventListener('click',e=>{e.preventDefault();const open=!menu.classList.contains('open');menu.classList.toggle('open',open);btn.setAttribute('aria-expanded',String(open))});
  document.addEventListener('click',e=>{if(!nav.contains(e.target))close()});
  menu.querySelectorAll('[data-close-menu]').forEach(a=>a.addEventListener('click',close));
  document.addEventListener('keydown',e=>{if(e.key==='Escape')close()});
})();
