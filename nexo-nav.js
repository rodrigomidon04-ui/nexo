/* NEXO navigation organizer — Mi Nexo + profile */
(function(){
  'use strict';
  if(window.__NEXONAV)return; window.__NEXONAV=true;
  const nav=document.querySelector('.nav .navlinks');
  const auth=document.getElementById('authBtn');
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
    .nexo-menu{position:absolute;top:calc(100% + 14px);right:0;width:min(430px,calc(100vw - 30px));padding:12px;background:rgba(13,18,24,.98);border:1px solid var(--line);border-radius:22px;box-shadow:0 30px 80px rgba(0,0,0,.5);backdrop-filter:blur(20px);z-index:70;display:none}
    .nexo-menu.open{display:block}
    .nexo-menu-head{padding:6px 10px 12px;border-bottom:1px solid var(--line);display:flex;justify-content:space-between;align-items:end;gap:12px}
    .nexo-menu-title{font-weight:900;font-size:20px}
    .nexo-menu-sub{font-size:11px;color:var(--muted)}
    .nexo-step{border-bottom:1px solid var(--line)}
    .nexo-step:last-child{border-bottom:0}
    .nexo-step-btn{width:100%;border:0;background:transparent;color:var(--text);padding:15px 10px;display:flex;align-items:center;gap:12px;text-align:left}
    .nexo-step-btn:hover{background:rgba(77,216,255,.045)}
    .nexo-step-icon{width:34px;height:34px;border-radius:11px;background:rgba(77,216,255,.08);color:var(--cyan);display:grid;place-items:center;font-size:14px;flex:0 0 auto}
    .nexo-step-main{min-width:0;flex:1}
    .nexo-step-main strong{display:block;font-size:14px}
    .nexo-step-main span{display:block;color:var(--muted);font-size:11px;line-height:1.4;margin-top:3px}
    .nexo-step-arrow{color:var(--muted);font-size:16px}
    .nexo-profile{display:inline-flex;align-items:center;gap:8px;border:1px solid var(--line);background:rgba(255,255,255,.035);padding:6px 10px 6px 6px;border-radius:999px;color:var(--text);text-decoration:none}
    .nexo-profile:hover{border-color:rgba(77,216,255,.35);background:rgba(77,216,255,.06)}
    .nexo-profile-avatar{width:28px;height:28px;border-radius:50%;display:grid;place-items:center;overflow:hidden;background:#0e1821;border:1px solid rgba(77,216,255,.25);color:var(--cyan);font-weight:900;font-size:11px;flex:0 0 auto}
    .nexo-profile-avatar img{width:100%;height:100%;object-fit:cover;display:block}
    .nexo-profile-name{font-size:12px;font-weight:800;max-width:110px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    @media(max-width:900px){.navlinks{gap:14px}.nexo-menu{right:-8px}}
    @media(max-width:600px){.navlinks{gap:12px}.nexo-nav-account{font-size:12px}.nexo-menu{position:fixed;top:68px;left:12px;right:12px;width:auto;max-height:calc(100vh - 84px);overflow:auto}.nexo-profile-name{display:none}.nexo-profile{padding:5px}}
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

    <button type="button" class="nexo-step-btn nexo-step" data-nexo-target="nexo33">
      <span class="nexo-step-icon">◌</span><span class="nexo-step-main"><strong>Sesiones</strong><span>Chats, conversaciones, actividad e historial.</span></span><span class="nexo-step-arrow">›</span>
    </button>

    <button type="button" class="nexo-step-btn nexo-step" data-nexo-target="contactos">
      <span class="nexo-step-icon">◎</span><span class="nexo-step-main"><strong>Contactos</strong><span>Tu red de personas conectadas.</span></span><span class="nexo-step-arrow">›</span>
    </button>

    <button type="button" class="nexo-step-btn nexo-step" data-nexo-target="invitaciones">
      <span class="nexo-step-icon">✉</span><span class="nexo-step-main"><strong>Invitaciones</strong><span>Salas e invitaciones pendientes.</span></span><span class="nexo-step-arrow">›</span>
    </button>

    <button type="button" class="nexo-step-btn nexo-step" data-nexo-target="ecosistema">
      <span class="nexo-step-icon">✦</span><span class="nexo-step-main"><strong>Ecosistema</strong><span>Work, Edu, Care y futuros espacios NEXO.</span></span><span class="nexo-step-arrow">›</span>
    </button>
  `;
  nav.appendChild(menu);

  const btn=document.getElementById('nexoNavAccount');
  const close=()=>{menu.classList.remove('open');btn?.setAttribute('aria-expanded','false')};
  btn?.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();const open=!menu.classList.contains('open');menu.classList.toggle('open',open);btn.setAttribute('aria-expanded',String(open))});
  document.addEventListener('click',e=>{if(!nav.contains(e.target))close()});
  document.addEventListener('keydown',e=>{if(e.key==='Escape')close()});

  menu.querySelectorAll('[data-nexo-target]').forEach(item=>item.addEventListener('click',e=>{
    e.preventDefault();
    const target=item.dataset.nexoTarget;
    close();
    if(typeof window.openNexoSection==='function'){
      window.openNexoSection(target);
      return;
    }
    const el=document.getElementById(target);
    if(el)el.scrollIntoView({behavior:'smooth',block:'start'});
  }));

  function profileImageMarkup(){
    const avatar=document.getElementById('sideAvatar');
    if(!avatar)return '';
    const img=avatar.querySelector('img');
    if(img?.src)return `<span class="nexo-profile-avatar"><img src="${img.src.replace(/"/g,'&quot;')}" alt=""></span>`;
    const txt=(avatar.textContent||'N').trim().slice(0,1).toUpperCase()||'N';
    return `<span class="nexo-profile-avatar">${txt}</span>`;
  }

  function refreshProfileBar(){
    if(!auth)return;
    const sideName=document.getElementById('sideName');
    const name=(sideName?.textContent||'').trim();
    const logged=name && name!=='Usuario';
    if(!logged){
      auth.classList.remove('nexo-profile');
      auth.innerHTML='Ingresar';
      auth.onclick=null;
      return;
    }
    const markup=profileImageMarkup();
    auth.classList.add('nexo-profile');
    auth.innerHTML=`${markup}<span class="nexo-profile-name">${name.replace(/</g,'&lt;').replace(/>/g,'&gt;')}</span>`;
    auth.onclick=e=>{e.preventDefault();e.stopImmediatePropagation();if(typeof window.openNexoSection==='function')window.openNexoSection('perfil');else document.getElementById('perfil')?.scrollIntoView({behavior:'smooth',block:'start'});};
  }

  const observeNode=document.getElementById('sideName');
  if(observeNode)new MutationObserver(refreshProfileBar).observe(observeNode,{childList:true,subtree:true,characterData:true});
  const observeAvatar=document.getElementById('sideAvatar');
  if(observeAvatar)new MutationObserver(refreshProfileBar).observe(observeAvatar,{childList:true,subtree:true,attributes:true});
  setTimeout(refreshProfileBar,500);
  setTimeout(refreshProfileBar,1500);
})();
