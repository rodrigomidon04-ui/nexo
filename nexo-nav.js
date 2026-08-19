/* NEXO navigation organizer — destinos reales + perfil modal */
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
    <span class="nexo-nav-mi">
      <a class="nexo-nav-account-link" href="#dashboard">Mi Nexo</a>
      <button type="button" class="nexo-nav-toggle" id="nexoNavToggle" aria-expanded="false" aria-label="Abrir menú Mi Nexo">⌄</button>
    </span>
  `;

  const style=document.createElement('style');
  style.id='nexo-nav-organizer-style';
  style.textContent=`
    .navlinks{align-items:center;position:relative}
    .nexo-nav-mi{display:inline-flex;align-items:center;gap:2px}
    .nexo-nav-account-link{color:var(--muted);font:inherit;font-size:13px;text-decoration:none;padding:8px 0}
    .nexo-nav-account-link:hover{color:var(--text)}
    .nexo-nav-toggle{border:0;background:transparent;color:var(--muted);font:inherit;font-size:12px;padding:8px 4px;cursor:pointer;display:inline-grid;place-items:center;transition:.2s}
    .nexo-nav-toggle:hover,.nexo-nav-toggle[aria-expanded="true"]{color:var(--text)}
    .nexo-nav-toggle[aria-expanded="true"]{transform:rotate(180deg)}
    .nexo-menu{position:absolute;top:calc(100% + 14px);right:0;width:min(430px,calc(100vw - 30px));padding:12px;background:rgba(13,18,24,.98);border:1px solid var(--line);border-radius:22px;box-shadow:0 30px 80px rgba(0,0,0,.5);backdrop-filter:blur(20px);z-index:70;display:none}
    .nexo-menu.open{display:block}
    .nexo-menu-head{padding:6px 10px 12px;border-bottom:1px solid var(--line);display:flex;justify-content:space-between;align-items:end;gap:12px}
    .nexo-menu-title{font-weight:900;font-size:20px}
    .nexo-menu-sub{font-size:11px;color:var(--muted)}
    .nexo-step{width:100%;border:0;border-bottom:1px solid var(--line);background:transparent;color:var(--text);padding:15px 10px;display:flex;align-items:center;gap:12px;text-align:left;cursor:pointer}
    .nexo-step:last-child{border-bottom:0}
    .nexo-step:hover{background:rgba(77,216,255,.045)}
    .nexo-step-icon{width:34px;height:34px;border-radius:11px;background:rgba(77,216,255,.08);color:var(--cyan);display:grid;place-items:center;font-size:14px;flex:0 0 auto}
    .nexo-step-main{min-width:0;flex:1}
    .nexo-step-main strong{display:block;font-size:14px}
    .nexo-step-main span{display:block;color:var(--muted);font-size:11px;line-height:1.4;margin-top:3px}
    .nexo-step-arrow{color:var(--muted);font-size:16px}
    .nexo-profile{display:inline-flex;align-items:center;gap:8px;border:1px solid var(--line);background:rgba(255,255,255,.035);padding:6px 10px 6px 6px;border-radius:999px;color:var(--text);text-decoration:none;cursor:pointer}
    .nexo-profile:hover{border-color:rgba(77,216,255,.35);background:rgba(77,216,255,.06)}
    .nexo-profile-avatar{width:28px;height:28px;border-radius:50%;display:grid;place-items:center;overflow:hidden;background:#0e1821;border:1px solid rgba(77,216,255,.25);color:var(--cyan);font-weight:900;font-size:11px;flex:0 0 auto}
    .nexo-profile-avatar img{width:100%;height:100%;object-fit:cover;display:block}
    .nexo-profile-name{font-size:12px;font-weight:800;max-width:110px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    .nexo-profile-modal{position:fixed;inset:0;background:rgba(0,0,0,.58);backdrop-filter:blur(8px);display:none;align-items:flex-start;justify-content:flex-end;padding:78px 24px 24px;z-index:130}
    .nexo-profile-modal.open{display:flex}
    .nexo-profile-card{width:min(360px,calc(100vw - 32px));background:rgba(13,18,24,.98);border:1px solid var(--line);border-radius:22px;box-shadow:0 30px 90px rgba(0,0,0,.55);padding:18px;color:var(--text)}
    .nexo-profile-top{display:flex;align-items:center;gap:12px;padding-bottom:14px;border-bottom:1px solid var(--line)}
    .nexo-profile-big-avatar{width:54px;height:54px;border-radius:50%;overflow:hidden;background:#0e1821;border:1px solid rgba(77,216,255,.3);display:grid;place-items:center;color:var(--cyan);font-weight:900;font-size:18px;flex:0 0 auto}
    .nexo-profile-big-avatar img{width:100%;height:100%;object-fit:cover}
    .nexo-profile-realname{font-weight:900;font-size:16px}
    .nexo-profile-username{font-size:12px;color:var(--muted);margin-top:3px}
    .nexo-profile-status{font-size:11px;color:var(--cyan);margin-top:5px}
    .nexo-profile-body{padding:14px 0;color:var(--muted);font-size:12px;line-height:1.5}
    .nexo-profile-actions{display:flex;gap:8px;flex-wrap:wrap}
    .nexo-profile-actions button{border:1px solid var(--line);background:rgba(255,255,255,.03);color:var(--text);padding:9px 12px;border-radius:11px;cursor:pointer;font:inherit;font-size:12px}
    .nexo-profile-actions .primary{background:rgba(77,216,255,.10);border-color:rgba(77,216,255,.28)}
    /* Legacy perfil section stays available to app logic but is hidden from main flow. */
    #perfil{display:none!important}
    @media(max-width:900px){.navlinks{gap:14px}.nexo-menu{right:-8px}}
    @media(max-width:600px){.navlinks{gap:12px}.nexo-nav-account-link{font-size:12px}.nexo-menu{position:fixed;top:68px;left:12px;right:12px;width:auto;max-height:calc(100vh - 84px);overflow:auto}.nexo-profile-name{display:none}.nexo-profile{padding:5px}.nexo-profile-modal{padding:68px 12px 12px;justify-content:center}.nexo-profile-card{width:min(380px,100%)}}
  `;
  document.head.appendChild(style);

  const menu=document.createElement('div');
  menu.className='nexo-menu';
  menu.id='nexoMenu';
  menu.innerHTML=`
    <div class="nexo-menu-head">
      <div><div class="tag">MI NEXO</div><div class="nexo-menu-title">Tu centro de conexión.</div></div>
      <div class="nexo-menu-sub">Sesiones, contactos, invitaciones y ecosistema.</div>
    </div>
    <button type="button" class="nexo-step" data-nexo-target="nexo33"><span class="nexo-step-icon">◌</span><span class="nexo-step-main"><strong>Sesiones</strong><span>Chats, conversaciones, actividad e historial.</span></span><span class="nexo-step-arrow">›</span></button>
    <button type="button" class="nexo-step" data-nexo-target="contactos"><span class="nexo-step-icon">◎</span><span class="nexo-step-main"><strong>Contactos</strong><span>Tu red de personas conectadas.</span></span><span class="nexo-step-arrow">›</span></button>
    <button type="button" class="nexo-step" data-nexo-target="invitaciones"><span class="nexo-step-icon">✉</span><span class="nexo-step-main"><strong>Invitaciones</strong><span>Salas e invitaciones pendientes.</span></span><span class="nexo-step-arrow">›</span></button>
    <button type="button" class="nexo-step" data-nexo-target="ecosistema"><span class="nexo-step-icon">✦</span><span class="nexo-step-main"><strong>Ecosistema</strong><span>Work, Edu, Care y futuros espacios NEXO.</span></span><span class="nexo-step-arrow">›</span></button>
  `;
  nav.appendChild(menu);

  const profileModal=document.createElement('div');
  profileModal.className='nexo-profile-modal';
  profileModal.id='nexoProfileModal';
  profileModal.innerHTML=`
    <div class="nexo-profile-card" role="dialog" aria-modal="true" aria-label="Perfil NEXO">
      <div class="nexo-profile-top">
        <div class="nexo-profile-big-avatar" id="nexoProfileBigAvatar">N</div>
        <div><div class="nexo-profile-realname" id="nexoProfileName">Usuario NEXO</div><div class="nexo-profile-username" id="nexoProfileUsername">@usuario</div><div class="nexo-profile-status">● En línea</div></div>
      </div>
      <div class="nexo-profile-body" id="nexoProfileBio">Tu identidad NEXO. Tu perfil se guarda en Supabase.</div>
      <div class="nexo-profile-actions"><button type="button" class="primary" id="nexoProfileEdit">Editar perfil</button><button type="button" id="nexoProfileClose">Cerrar</button></div>
    </div>
  `;
  document.body.appendChild(profileModal);

  const toggle=document.getElementById('nexoNavToggle');
  const accountLink=nav.querySelector('.nexo-nav-account-link');
  const closeMenu=()=>{menu.classList.remove('open');toggle?.setAttribute('aria-expanded','false')};
  toggle?.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();const open=!menu.classList.contains('open');menu.classList.toggle('open',open);toggle.setAttribute('aria-expanded',String(open));});
  accountLink?.addEventListener('click',()=>closeMenu());
  document.addEventListener('click',e=>{if(!nav.contains(e.target))closeMenu()});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeMenu();profileModal.classList.remove('open')}});

  function go(target){
    const el=document.getElementById(target);
    if(!el)return;
    closeMenu();
    el.hidden=false;
    el.style.display='';
    el.scrollIntoView({behavior:'smooth',block:'start'});
    if(history.replaceState)history.replaceState(null,'','#'+target);
  }
  menu.querySelectorAll('[data-nexo-target]').forEach(item=>item.addEventListener('click',e=>{e.preventDefault();go(item.dataset.nexoTarget)}));

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
    const logged=!!name && name!=='Usuario';
    if(!logged){auth.classList.remove('nexo-profile');auth.innerHTML='Ingresar';return;}
    auth.classList.add('nexo-profile');
    auth.innerHTML=`${profileImageMarkup()}<span class="nexo-profile-name">${name.replace(/</g,'&lt;').replace(/>/g,'&gt;')}</span>`;
    const profileName=document.getElementById('nexoProfileName');
    const profileUser=document.getElementById('nexoProfileUsername');
    const big=document.getElementById('nexoProfileBigAvatar');
    if(profileName)profileName.textContent=name;
    const source=document.getElementById('sideUsername');
    const username=(source?.textContent||'').trim();
    if(profileUser)profileUser.textContent=username.startsWith('@')?username:(username?`@${username}`:'@usuario');
    const avatar=document.getElementById('sideAvatar'); const img=avatar?.querySelector('img');
    if(big)big.innerHTML=img?.src?`<img src="${img.src.replace(/"/g,'&quot;')}" alt="">`:name.slice(0,1).toUpperCase();
  }

  auth?.addEventListener('click',e=>{
    if(!auth.classList.contains('nexo-profile'))return;
    e.preventDefault(); e.stopImmediatePropagation(); closeMenu(); refreshProfileBar(); profileModal.classList.add('open');
  });
  document.getElementById('nexoProfileClose')?.addEventListener('click',()=>profileModal.classList.remove('open'));
  profileModal.addEventListener('click',e=>{if(e.target===profileModal)profileModal.classList.remove('open')});
  document.getElementById('nexoProfileEdit')?.addEventListener('click',()=>{
    profileModal.classList.remove('open');
    const edit=[...document.querySelectorAll('button,a')].find(el=>/editar perfil/i.test(el.textContent||''));
    if(edit) edit.click();
  });

  ['sideName','sideAvatar','sideUsername'].forEach(id=>{
    const node=document.getElementById(id);
    if(node)new MutationObserver(refreshProfileBar).observe(node,{childList:true,subtree:true,characterData:true,attributes:true});
  });
  setTimeout(refreshProfileBar,500); setTimeout(refreshProfileBar,1500);
})();
