/* NEXO FINAL STRUCTURE: exact 01-06 organization. */
(function(){
  'use strict';
  if(window.__NEXOSTRUCTUREFINAL)return; window.__NEXOSTRUCTUREFINAL=true;

  const $=id=>document.getElementById(id);

  function center(el){
    if(!el)return false;
    el.hidden=false; el.style.display='';
    requestAnimationFrame(()=>el.scrollIntoView({behavior:'smooth',block:'center',inline:'nearest'}));
    return true;
  }

  function prepare(){
    const salas=$('salas'), espacios=$('explorar'), miCentro=$('dashboard');
    const advanced=$('nexo33134'), chats=$('nexo33'), perfil=$('perfil'), historial=$('historial');
    if(!salas||!espacios||!miCentro)return;

    document.querySelectorAll('#nexoWorkspace').forEach(el=>el.remove());
    [advanced,chats,perfil,historial,$('contactos'),$('invitaciones'),$('ecosistema')].forEach(el=>{
      if(el && el.parentElement && el.parentElement!==document.body)document.body.appendChild(el);
    });

    const salasTag=salas.querySelector('.section-head .tag'); if(salasTag)salasTag.textContent='01 — Salas';
    const espaciosTag=espacios.querySelector('.section-head .tag'); if(espaciosTag)espaciosTag.textContent='02 — Espacios';

    const centroTag=miCentro.querySelector('.section-head .tag'); if(centroTag)centroTag.textContent='03 — Mi Centro';
    const centroTitle=miCentro.querySelector('.section-head h2'); if(centroTitle)centroTitle.innerHTML='Tu centro<br>de conexión.';
    if(advanced){
      advanced.hidden=false; advanced.style.display='block';
      const h=advanced.querySelector('.section-head'); if(h)h.style.display='none';
      miCentro.appendChild(advanced);
    }

    const workspace=document.createElement('section'); workspace.id='nexoWorkspace';
    workspace.innerHTML=`<div class="container"><div class="nexo-workspace-head"><div><div class="tag">04 — Mi Nexo</div><h2>Conectividad</h2></div><p class="muted">Sesiones, contactos, invitaciones y ecosistema.</p></div><div class="nexo-workspace-card" id="nexoWorkspaceCard"><button type="button" class="nexo-final-link" id="nexoSesionesEntry" data-final-target="sesiones"><span>◌</span><span class="nexo-final-copy"><strong>Sesiones</strong><em>Conversaciones, actividad e historial.</em></span><i>›</i></button><button type="button" class="nexo-final-link" data-final-target="contactos"><span>◎</span><span class="nexo-final-copy"><strong>Contactos</strong><em>Tu red de personas conectadas.</em></span><i>›</i></button><button type="button" class="nexo-final-link" data-final-target="invitaciones"><span>✉</span><span class="nexo-final-copy"><strong>Invitaciones</strong><em>Salas e invitaciones pendientes.</em></span><i>›</i></button><button type="button" class="nexo-final-link" data-final-target="ecosistema"><span>✦</span><span class="nexo-final-copy"><strong>Ecosistema</strong><em>Work, Edu, Care y futuros espacios NEXO.</em></span><i>›</i></button></div></div>`;

    if(chats){
      chats.hidden=false; chats.style.display='block';
      const tag=chats.querySelector('.section-head .tag'); if(tag)tag.textContent='05 — Chats';
      const h=chats.querySelector('.section-head h2'); if(h)h.innerHTML='Conectá en<br>tiempo real.';
    }
    if(perfil){
      perfil.hidden=false; perfil.style.display='block';
      const tag=perfil.querySelector('.section-head .tag'); if(tag)tag.textContent='06 — Identidad';
      const h=perfil.querySelector('.section-head h2'); if(h)h.innerHTML='Tu perfil, tu NEXO.';
    }
    if(historial){historial.hidden=true; historial.style.display='none';}
    ['contactos','invitaciones','ecosistema'].forEach(id=>{const sec=$(id);if(sec){sec.hidden=true;sec.style.display='none';}});

    const footer=document.querySelector('footer');
    [salas,espacios,miCentro,workspace,chats,perfil].forEach(sec=>{if(sec)document.body.insertBefore(sec,footer||null);});
    if(footer)document.body.appendChild(footer);

    if(!$('nexo-structure-final-style')){
      const s=document.createElement('style');s.id='nexo-structure-final-style';s.textContent=`#nexoWorkspace{padding:72px 0 96px}.nexo-workspace-head{display:flex;justify-content:space-between;align-items:end;gap:20px;margin-bottom:24px}.nexo-workspace-head h2{font-size:clamp(38px,5vw,64px);line-height:.95;letter-spacing:-.045em;margin:8px 0}.nexo-workspace-head p{max-width:520px}.nexo-workspace-card{background:linear-gradient(145deg,rgba(255,255,255,.05),rgba(255,255,255,.018));border:1px solid var(--line);border-radius:22px;overflow:hidden;box-shadow:var(--shadow)}.nexo-final-link{width:100%;border:0;border-bottom:1px solid var(--line);background:transparent;color:var(--text);padding:20px 22px;display:flex;align-items:center;gap:14px;text-align:left;cursor:pointer}.nexo-final-link:last-child{border-bottom:0}.nexo-final-link:hover{background:rgba(77,216,255,.045)}.nexo-final-link>span:first-child{width:40px;height:40px;border-radius:13px;background:rgba(77,216,255,.08);color:var(--cyan);display:grid;place-items:center;flex:0 0 auto}.nexo-final-copy{display:block;flex:1;min-width:0}.nexo-final-link strong{display:block;font-size:16px}.nexo-final-link em{display:block;font-style:normal;color:var(--muted);font-size:12px;line-height:1.5;margin-top:3px}.nexo-final-link i{font-style:normal;color:var(--muted);font-size:18px}.nexo-final-link.active{background:rgba(77,216,255,.055)}@media(max-width:900px){.nexo-workspace-head{align-items:start;flex-direction:column}}`;
      document.head.appendChild(s);
    }

    const sesionesEntry=$('nexoSesionesEntry');
    if(sesionesEntry){
      sesionesEntry.addEventListener('click',e=>{
        e.preventDefault();
        sesionesEntry.classList.add('active');
        center(miCentro);
      });
    }

    const nav=document.querySelector('.nav .navlinks');
    if(nav){
      nav.innerHTML=`<a href="#inicio" data-final-nav="inicio">Inicio</a><a href="#salas" data-final-nav="salas">Salas</a><a href="#explorar" data-final-nav="espacios">Espacios</a><a href="#dashboard" data-final-nav="micentro">Mi Centro</a><span class="nexo-nav-mi"><a href="#nexoWorkspace" data-final-nav="minexo">Mi Nexo</a><button type="button" class="nexo-nav-toggle" id="nexoFinalToggle" aria-expanded="false" aria-label="Abrir menú Mi Nexo">⌄</button></span>`;
      const menu=document.createElement('div'); menu.className='nexo-menu'; menu.id='nexoFinalMenu';
      menu.innerHTML=`<div class="nexo-menu-head"><div><div class="tag">MI NEXO</div><div class="nexo-menu-title">Conectividad</div></div><div class="nexo-menu-sub">Sesiones, contactos, invitaciones y ecosistema.</div></div><button type="button" class="nexo-step" data-final-menu="sesiones"><span class="nexo-step-icon">◌</span><span class="nexo-step-main"><strong>Sesiones</strong><span>Conversaciones, actividad e historial.</span></span><span class="nexo-step-arrow">›</span></button><button type="button" class="nexo-step" data-final-menu="contactos"><span class="nexo-step-icon">◎</span><span class="nexo-step-main"><strong>Contactos</strong><span>Tu red de personas conectadas.</span></span><span class="nexo-step-arrow">›</span></button><button type="button" class="nexo-step" data-final-menu="invitaciones"><span class="nexo-step-icon">✉</span><span class="nexo-step-main"><strong>Invitaciones</strong><span>Salas e invitaciones pendientes.</span></span><span class="nexo-step-arrow">›</span></button><button type="button" class="nexo-step" data-final-menu="ecosistema"><span class="nexo-step-icon">✦</span><span class="nexo-step-main"><strong>Ecosistema</strong><span>Work, Edu, Care y futuros espacios NEXO.</span></span><span class="nexo-step-arrow">›</span></button>`;
      nav.appendChild(menu);
      const toggle=$('nexoFinalToggle');
      const close=()=>{menu.classList.remove('open');toggle?.setAttribute('aria-expanded','false')};
      toggle?.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();const open=!menu.classList.contains('open');menu.classList.toggle('open',open);toggle.setAttribute('aria-expanded',String(open));});
      document.addEventListener('click',e=>{if(!nav.contains(e.target))close()});
      nav.querySelectorAll('[data-final-nav]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();close();const map={inicio:'inicio',salas:'salas',espacios:'explorar',micentro:'dashboard',minexo:'nexoWorkspace'};const el=$(map[a.dataset.finalNav]);if(el)center(el);}));
      menu.querySelectorAll('[data-final-menu]').forEach(b=>b.addEventListener('click',e=>{
        e.preventDefault();
        close();
        const key=b.dataset.finalMenu;
        if(key==='sesiones'){center(sesionesEntry);sesionesEntry?.classList.add('active');return;}
        const sec=$(key);
        if(sec){sec.hidden=false;sec.style.display='';center(sec);}
      }));
    }
  }

  const boot=()=>setTimeout(prepare,1800);
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
