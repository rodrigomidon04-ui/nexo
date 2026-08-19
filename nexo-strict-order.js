/* NEXO strict visual order: only requested sections, no new content. */
(function(){
  'use strict';
  if(window.__NEXOSTRICTORDER)return; window.__NEXOSTRICTORDER=true;

  const $=id=>document.getElementById(id);
  const wait=fn=>document.readyState==='loading'?document.addEventListener('DOMContentLoaded',fn,{once:true}):fn();

  function tag(sec,t){const e=sec?.querySelector('.section-head .tag');if(e)e.textContent=t;}
  function title(sec,t){const e=sec?.querySelector('.section-head h2');if(e)e.innerHTML=t;}
  function hide(sec){if(sec)sec.style.display='none';}
  function move(sec,parent){if(sec&&parent)parent.appendChild(sec);}

  wait(()=>{
    const salas=$('salas'), espacios=$('explorar'), centro=$('nexo33134'), chats=$('nexo33'), identidad=$('perfil');
    const oldHist=$('historial');

    // Remove the old visible history block completely.
    hide(oldHist);

    if(salas) tag(salas,'01 — Salas');
    if(espacios) tag(espacios,'02 — Espacios');

    // 03 — Mi Centro: the existing 03.3.1 / 03.4 module, unchanged in content.
    if(centro){
      tag(centro,'03 — Mi Centro');
      title(centro,'Tu centro<br>de conexión.');
    }

    // 05 — Chats: the existing NEXO 3.3 module, unchanged in content.
    if(chats){
      tag(chats,'05 — Chats');
      title(chats,'Conectá en<br>tiempo real.');
    }

    // 06 — Identidad: the existing profile module, moved to the end.
    if(identidad){
      tag(identidad,'06 — Identidad');
      title(identidad,'Tu perfil, tu NEXO.');
    }

    // Rebuild ONLY the requested 04 — Mi Nexo panel from existing sections.
    let ws=$('nexoWorkspace');
    if(ws){
      const head=ws.querySelector('.nexo-workspace-head .tag');
      if(head)head.textContent='04 — Mi Nexo';
      const p=ws.querySelector('.nexo-workspace-head p');
      if(p)p.textContent='Conectividad';
      const card=ws.querySelector('#nexoWorkspaceCard');
      if(card){
        // Hide previous session/chats/history material from Mi Nexo; only requested four entries remain.
        card.querySelectorAll('.nexo-panel').forEach(panel=>{
          const k=panel.dataset.panel;
          if(k==='sesiones') panel.style.display='none';
        });
      }
    } else {
      // If workspace does not exist yet, create a minimal 04 panel.
      const anchor=centro||espacios||salas;
      if(anchor?.parentNode){
        ws=document.createElement('section');ws.id='nexoWorkspace';
        ws.innerHTML='<div class="container"><div class="section-head nexo-workspace-head"><div><div class="tag">04 — Mi Nexo</div><h2>Conectividad</h2></div></div><div class="nexo-workspace-card" id="nexoWorkspaceCard"></div></div>';
        anchor.parentNode.insertBefore(ws,anchor.nextSibling);
      }
    }

    // Ensure 04 has the requested four entries only.
    const card=$('nexoWorkspaceCard');
    if(card && !card.dataset.strictBuilt){
      card.dataset.strictBuilt='1';
      card.innerHTML=`
        <button type="button" class="nexo-strict-link" data-target="nexo33134"><b>◌ Sesiones</b><span>Conversaciones y actividad.</span><i>›</i></button>
        <button type="button" class="nexo-strict-link" data-target="contactos"><b>◎ Contactos</b><span>Tu red de personas.</span><i>›</i></button>
        <button type="button" class="nexo-strict-link" data-target="invitaciones"><b>✉ Invitaciones</b><span>Salas e invitaciones pendientes.</span><i>›</i></button>
        <button type="button" class="nexo-strict-link" data-target="ecosistema"><b>✦ Ecosistema</b><span>Work, Edu, Care y futuros espacios NEXO.</span><i>›</i></button>`;
    }

    if(card&&!document.getElementById('nexo-strict-style')){
      const s=document.createElement('style');s.id='nexo-strict-style';s.textContent=`
        #nexoWorkspace .nexo-workspace-head h2{font-size:clamp(38px,5vw,64px)}
        #nexoWorkspace .nexo-strict-link{width:100%;border:0;border-bottom:1px solid var(--line);background:transparent;color:var(--text);padding:18px 20px;display:flex;gap:14px;align-items:center;text-align:left;cursor:pointer}
        #nexoWorkspace .nexo-strict-link:last-child{border-bottom:0}
        #nexoWorkspace .nexo-strict-link:hover{background:rgba(77,216,255,.045)}
        #nexoWorkspace .nexo-strict-link b{width:140px;flex:0 0 140px}
        #nexoWorkspace .nexo-strict-link span{color:var(--muted);font-size:12px;flex:1}
        #nexoWorkspace .nexo-strict-link i{font-style:normal;color:var(--muted);font-size:18px}
        @media(max-width:600px){#nexoWorkspace .nexo-strict-link{padding:16px}.nexo-strict-link b{width:110px!important;flex-basis:110px!important;font-size:13px}}
      `;document.head.appendChild(s);
      card.querySelectorAll('[data-target]').forEach(b=>b.addEventListener('click',()=>{
        const t=$(b.dataset.target); if(!t)return; t.style.display=''; t.scrollIntoView({behavior:'smooth',block:'center'}); if(history.replaceState)history.replaceState(null,'','#'+t.id);
      }));
    }

    // Hide legacy profile section from any earlier layout copies; strict order uses the actual profile block only at the end.
    hide(identidad===null?null:$('perfilLegacyCopy'));

    // Final DOM order: after main 01/02, 03 center, 04 workspace, 05 chats, 06 identity.
    const root=salas?.parentNode;
    if(root){
      if(espacios)root.appendChild(espacios);
      if(centro)root.appendChild(centro);
      if(ws)root.appendChild(ws);
      if(chats)root.appendChild(chats);
      if(identidad)root.appendChild(identidad);
      const footer=document.querySelector('footer'); if(footer)root.appendChild(footer);
    }
  });
})();
