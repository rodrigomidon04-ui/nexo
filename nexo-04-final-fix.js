/* NEXO 04 final fix: restore Mi Nexo as a stable navigation block. */
(function(){
  'use strict';
  if(window.__NEXO04FINAL)return; window.__NEXO04FINAL=true;
  const $=id=>document.getElementById(id);
  function center(el){if(!el)return false;el.hidden=false;el.style.display='';requestAnimationFrame(()=>el.scrollIntoView({behavior:'smooth',block:'center',inline:'nearest'}));return true;}
  function run(){
    const ref=$('nexo33134')||$('dashboard')||$('explorar');
    if(!ref)return;
    let ws=$('nexoWorkspace');
    if(!ws){
      ws=document.createElement('section');ws.id='nexoWorkspace';
      ref.parentNode.insertBefore(ws,ref.nextSibling);
    }
    ws.style.display='';ws.hidden=false;ws.className='nexo-workspace-final';
    ws.innerHTML=`<div class="container"><div class="section-head"><div><div class="tag">04 — Mi Nexo</div><h2>Conectividad</h2><p class="muted">Sesiones, contactos, invitaciones y ecosistema.</p></div></div><div class="nexo-workspace-final-card"><button type="button" data-nexo04="sesiones"><b>◌ Sesiones</b><span>Conversaciones, actividad e historial.</span><i>›</i></button><button type="button" data-nexo04="contactos"><b>◎ Contactos</b><span>Tu red de personas conectadas.</span><i>›</i></button><button type="button" data-nexo04="invitaciones"><b>✉ Invitaciones</b><span>Salas e invitaciones pendientes.</span><i>›</i></button><button type="button" data-nexo04="ecosistema"><b>✦ Ecosistema</b><span>Work, Edu, Care y futuros espacios NEXO.</span><i>›</i></button></div></div>`;
    if(!$('nexo-04-final-style')){const s=document.createElement('style');s.id='nexo-04-final-style';s.textContent=`#nexoWorkspace.nexo-workspace-final{display:block!important;padding:72px 0 90px}#nexoWorkspace .nexo-workspace-final-card{border:1px solid var(--line);border-radius:22px;overflow:hidden;background:rgba(255,255,255,.025)}#nexoWorkspace .nexo-workspace-final-card button{width:100%;border:0;border-bottom:1px solid var(--line);background:transparent;color:var(--text);padding:18px 20px;display:flex;align-items:center;gap:14px;text-align:left;cursor:pointer}#nexoWorkspace .nexo-workspace-final-card button:last-child{border-bottom:0}#nexoWorkspace .nexo-workspace-final-card button:hover{background:rgba(77,216,255,.045)}#nexoWorkspace .nexo-workspace-final-card b{min-width:140px}.nexo-workspace-final-card span{color:var(--muted);font-size:12px;flex:1}.nexo-workspace-final-card i{font-style:normal;color:var(--muted);font-size:18px}@media(max-width:600px){#nexoWorkspace .nexo-workspace-final-card b{min-width:110px;font-size:13px}}`;document.head.appendChild(s);}
    ws.querySelectorAll('[data-nexo04]').forEach(btn=>btn.addEventListener('click',()=>{
      const map={sesiones:'nexo33134',contactos:'contactos',invitaciones:'invitaciones',ecosistema:'ecosistema'};
      const target=$(map[btn.dataset.nexo04]); if(target)center(target);
      if(target&&history.replaceState)history.replaceState(null,'','#'+target.id);
    }));
    const nav=document.querySelector('.nav .navlinks');
    const miCentro=nav?.querySelector('[data-nav-final="mi-centro"]');
    if(miCentro&&!miCentro.dataset.center04Bound){miCentro.dataset.center04Bound='1';}
    const menu=nav?.querySelector('.nexo-menu');
    if(menu){
      let sessions=menu.querySelector('[data-final-section="sesiones"]');
      if(!sessions){sessions=document.createElement('button');sessions.type='button';sessions.className='nexo-step';sessions.dataset.finalSection='sesiones';sessions.innerHTML='<span class="nexo-step-icon">◌</span><span class="nexo-step-main"><strong>Sesiones</strong><span>Conversaciones, actividad e historial.</span></span><span class="nexo-step-arrow">›</span>';menu.insertBefore(sessions,menu.firstElementChild?.nextSibling||menu.firstChild);}
      sessions.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();menu.classList.remove('open');center($('nexo33134'));},true);
    }
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(run,400),{once:true});else setTimeout(run,400);
})();
