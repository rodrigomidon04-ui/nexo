/* NEXO strict visual order: exact requested structure, preserve real modules. */
(function(){
  'use strict';
  if(window.__NEXOSTRICTORDER)return; window.__NEXOSTRICTORDER=true;

  const $=id=>document.getElementById(id);
  const wait=fn=>document.readyState==='loading'?document.addEventListener('DOMContentLoaded',fn,{once:true}):fn();
  const showCenter=el=>{if(!el)return;el.style.display='';el.hidden=false;el.scrollIntoView({behavior:'smooth',block:'center'});if(history.replaceState)history.replaceState(null,'','#'+el.id)};
  const setTag=(el,v)=>{const x=el?.querySelector('.section-head .tag');if(x)x.textContent=v};
  const setTitle=(el,v)=>{const x=el?.querySelector('.section-head h2');if(x)x.innerHTML=v};

  wait(()=>{
    const salas=$('salas'), espacios=$('explorar'), centro=$('nexo33134'), chats=$('nexo33'), identidad=$('perfil'), historial=$('historial'), dashboard=$('dashboard');

    // Exact requested visibility/order.
    if(historial) historial.style.display='none';
    if(dashboard) dashboard.style.display='none';
    if(salas) setTag(salas,'01 — Salas');
    if(espacios) setTag(espacios,'02 — Espacios');
    if(centro){setTag(centro,'03 — Mi Centro');setTitle(centro,'Tu centro<br>de conexión.')}
    if(chats){setTag(chats,'05 — Chats');setTitle(chats,'Conectá en<br>tiempo real.')}
    if(identidad){setTag(identidad,'06 — Identidad');setTitle(identidad,'Tu perfil, tu NEXO.')}

    // Existing sections created by the previous layout are preserved and regrouped inside 04.
    const contactos=$('contactos'), invitaciones=$('invitaciones'), ecosistema=$('ecosistema');
    const ws=$('nexoWorkspace');
    if(!ws||!centro)return;

    const headTag=ws.querySelector('.nexo-workspace-head .tag'); if(headTag)headTag.textContent='04 — Mi Nexo';
    const headTitle=ws.querySelector('.nexo-workspace-head h2'); if(headTitle)headTitle.textContent='Conectividad';
    const headP=ws.querySelector('.nexo-workspace-head p'); if(headP)headP.textContent='Sesiones, contactos, invitaciones y ecosistema.';

    const container=ws.querySelector('.container');
    const card=ws.querySelector('#nexoWorkspaceCard');
    if(!container||!card)return;

    // Remove only the obsolete nested navigation panels; preserve the real sections by detaching them first.
    const realSections=[contactos,invitaciones,ecosistema].filter(Boolean);
    realSections.forEach(s=>s.remove());
    card.innerHTML='';

    const links=document.createElement('div'); links.className='nexo-strict-links';
    links.innerHTML=`
      <button type="button" class="nexo-strict-link" data-target="nexo33134"><b>◌ Sesiones</b><span>Conversaciones y actividad.</span><i>›</i></button>
      <button type="button" class="nexo-strict-link" data-target="contactos"><b>◎ Contactos</b><span>Tu red de personas.</span><i>›</i></button>
      <button type="button" class="nexo-strict-link" data-target="invitaciones"><b>✉ Invitaciones</b><span>Salas e invitaciones pendientes.</span><i>›</i></button>
      <button type="button" class="nexo-strict-link" data-target="ecosistema"><b>✦ Ecosistema</b><span>Work, Edu, Care y futuros espacios NEXO.</span><i>›</i></button>`;
    card.appendChild(links);

    let content=ws.querySelector('#nexoStrictContent');
    if(!content){content=document.createElement('div');content.id='nexoStrictContent';content.style.marginTop='18px';container.appendChild(content)}
    content.innerHTML='';

    // Contactos / Invitaciones / Ecosistema remain part of 04 and are opened from its four entries.
    realSections.forEach(s=>{
      const h=s.querySelector('.section-head'); if(h)h.style.display='none';
      s.style.padding='0'; s.style.margin='0 0 18px';
      s.style.display='none';
      content.appendChild(s);
    });

    if(!document.getElementById('nexo-strict-style')){
      const style=document.createElement('style');style.id='nexo-strict-style';style.textContent=`
        #nexoWorkspace .nexo-workspace-head h2{font-size:clamp(38px,5vw,64px);line-height:.95;margin:8px 0}
        #nexoWorkspace .nexo-strict-link{width:100%;border:0;border-bottom:1px solid var(--line);background:transparent;color:var(--text);padding:18px 20px;display:flex;gap:14px;align-items:center;text-align:left;cursor:pointer}
        #nexoWorkspace .nexo-strict-link:hover{background:rgba(77,216,255,.045)}
        #nexoWorkspace .nexo-strict-link b{width:150px;flex:0 0 150px}
        #nexoWorkspace .nexo-strict-link span{color:var(--muted);font-size:12px;flex:1}
        #nexoWorkspace .nexo-strict-link i{font-style:normal;color:var(--muted);font-size:18px}
        #nexoStrictContent>section{display:none}
        @media(max-width:600px){#nexoWorkspace .nexo-strict-link{padding:16px}.nexo-strict-link b{width:115px!important;flex-basis:115px!important;font-size:13px}}
      `;document.head.appendChild(style);
    }

    links.querySelectorAll('[data-target]').forEach(btn=>btn.addEventListener('click',()=>{
      const target=$(btn.dataset.target);
      if(btn.dataset.target==='nexo33134'){
        showCenter(centro);
        return;
      }
      if(target){target.style.display='';target.hidden=false;target.scrollIntoView({behavior:'smooth',block:'center'});if(history.replaceState)history.replaceState(null,'','#'+target.id)}
    }));

    // Keep exact top-level order: 01, 02, 03, 04, 05, 06.
    const parent=salas?.parentNode;
    if(parent){
      parent.appendChild(salas);
      parent.appendChild(espacios);
      parent.appendChild(centro);
      parent.appendChild(ws);
      parent.appendChild(chats);
      parent.appendChild(identidad);
      const footer=document.querySelector('footer');if(footer)parent.appendChild(footer);
    }
  });
})();
