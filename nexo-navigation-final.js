/* NEXO final navigation: real destinations + centered scrolling. */
(function(){
  'use strict';
  if(window.__NEXOFINALNAV)return; window.__NEXOFINALNAV=true;

  const $=id=>document.getElementById(id);
  const wait=fn=>document.readyState==='loading'?document.addEventListener('DOMContentLoaded',()=>setTimeout(fn,150),{once:true}):setTimeout(fn,150);

  function center(el){
    if(!el)return false;
    el.hidden=false;
    el.style.display='';
    requestAnimationFrame(()=>el.scrollIntoView({behavior:'smooth',block:'center',inline:'nearest'}));
    return true;
  }

  function openPanel(key){
    const panel=document.querySelector(`.nexo-panel[data-panel="${key}"]`);
    if(!panel)return null;
    const body=panel.querySelector('.nexo-panel-body');
    const btn=panel.querySelector('.nexo-panel-btn');
    if(body){body.classList.add('open');btn?.setAttribute('aria-expanded','true');}
    center(panel);
    return panel;
  }

  function build(){
    const nav=document.querySelector('.nav .navlinks');
    if(!nav)return;

    nav.innerHTML=`
      <a href="#inicio" data-nav-final="inicio">Inicio</a>
      <a href="#salas" data-nav-final="salas">Salas</a>
      <a href="#explorar" data-nav-final="explorar">Espacios</a>
      <a href="#dashboard" data-nav-final="mi-centro">Mi Centro</a>
      <span class="nexo-nav-mi">
        <a class="nexo-nav-account-link" href="#nexoWorkspace" data-nav-final="mi-nexo">Mi Nexo</a>
        <button type="button" class="nexo-nav-toggle" id="nexoNavToggleFinal" aria-expanded="false" aria-label="Abrir menú Mi Nexo">⌄</button>
      </span>
    `;

    const menu=document.createElement('div');
    menu.id='nexoMenuFinal';
    menu.className='nexo-menu';
    menu.innerHTML=`
      <div class="nexo-menu-head">
        <div><div class="tag">MI NEXO</div><div class="nexo-menu-title">Conectividad</div></div>
        <div class="nexo-menu-sub">Sesiones, contactos, invitaciones y ecosistema.</div>
      </div>
      <button type="button" class="nexo-step" data-final-section="sesiones"><span class="nexo-step-icon">◌</span><span class="nexo-step-main"><strong>Sesiones</strong><span>Conversaciones, actividad e historial.</span></span><span class="nexo-step-arrow">›</span></button>
      <button type="button" class="nexo-step" data-final-section="contactos"><span class="nexo-step-icon">◎</span><span class="nexo-step-main"><strong>Contactos</strong><span>Tu red de personas conectadas.</span></span><span class="nexo-step-arrow">›</span></button>
      <button type="button" class="nexo-step" data-final-section="invitaciones"><span class="nexo-step-icon">✉</span><span class="nexo-step-main"><strong>Invitaciones</strong><span>Salas e invitaciones pendientes.</span></span><span class="nexo-step-arrow">›</span></button>
      <button type="button" class="nexo-step" data-final-section="ecosistema"><span class="nexo-step-icon">✦</span><span class="nexo-step-main"><strong>Ecosistema</strong><span>Work, Edu, Care y futuros espacios NEXO.</span></span><span class="nexo-step-arrow">›</span></button>
    `;
    nav.appendChild(menu);

    const style=document.createElement('style');
    style.id='nexo-final-nav-style';
    style.textContent=`
      .nexo-menu{position:absolute;top:calc(100% + 14px);right:0;width:min(430px,calc(100vw - 30px));padding:12px;background:rgba(13,18,24,.98);border:1px solid var(--line);border-radius:22px;box-shadow:0 30px 80px rgba(0,0,0,.5);z-index:200;display:none}
      .nexo-menu.open{display:block}
      .nexo-menu-head{padding:6px 10px 12px;border-bottom:1px solid var(--line);display:flex;justify-content:space-between;align-items:end;gap:12px}
      .nexo-menu-title{font-weight:900;font-size:20px}.nexo-menu-sub{font-size:11px;color:var(--muted)}
      .nexo-step{width:100%;border:0;border-bottom:1px solid var(--line);background:transparent;color:var(--text);padding:15px 10px;display:flex;align-items:center;gap:12px;text-align:left;cursor:pointer}
      .nexo-step:last-child{border-bottom:0}.nexo-step:hover{background:rgba(77,216,255,.045)}
      .nexo-step-icon{width:34px;height:34px;border-radius:11px;background:rgba(77,216,255,.08);color:var(--cyan);display:grid;place-items:center;flex:0 0 auto}
      .nexo-step-main{flex:1}.nexo-step-main strong{display:block;font-size:14px}.nexo-step-main span{display:block;color:var(--muted);font-size:11px;line-height:1.4;margin-top:3px}.nexo-step-arrow{color:var(--muted);font-size:16px}
      .nexo-nav-mi{display:inline-flex;align-items:center;gap:2px}.nexo-nav-account-link{color:var(--muted);font-size:13px;text-decoration:none;padding:8px 0}.nexo-nav-toggle{border:0;background:transparent;color:var(--muted);font:inherit;font-size:12px;padding:8px 4px;cursor:pointer}
      @media(max-width:600px){.nexo-menu{position:fixed;top:68px;left:12px;right:12px;width:auto;max-height:calc(100vh - 84px);overflow:auto}}
    `;
    if(!$('nexo-final-nav-style'))document.head.appendChild(style);

    const toggle=$('nexoNavToggleFinal');
    const close=()=>{menu.classList.remove('open');toggle?.setAttribute('aria-expanded','false')};
    toggle?.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();const open=!menu.classList.contains('open');menu.classList.toggle('open',open);toggle.setAttribute('aria-expanded',String(open));});
    document.addEventListener('click',e=>{if(!nav.contains(e.target))close()});
    document.addEventListener('keydown',e=>{if(e.key==='Escape')close()});

    nav.querySelectorAll('[data-nav-final]').forEach(a=>a.addEventListener('click',e=>{
      e.preventDefault();
      const dest=a.dataset.navFinal;
      close();
      const map={inicio:'inicio',salas:'salas',explorar:'explorar','mi-centro':'dashboard'};
      const el=$(map[dest]||'');
      center(el);
      if(el&&history.replaceState)history.replaceState(null,'','#'+el.id);
    }));

    menu.querySelectorAll('[data-final-section]').forEach(btn=>btn.addEventListener('click',e=>{
      e.preventDefault();
      const key=btn.dataset.finalSection;
      close();
      if(key==='sesiones'){
        // Sessions is the access point to the existing Mi Centro module (03).
        const centro=$('nexo33134')||$('dashboard');
        center(centro);
        if(centro&&history.replaceState)history.replaceState(null,'','#'+centro.id);
        return;
      }
      const panel=openPanel(key);
      if(panel&&history.replaceState)history.replaceState(null,'','#'+panel.dataset.panel);
    }));
  }

  wait(build);
})();
