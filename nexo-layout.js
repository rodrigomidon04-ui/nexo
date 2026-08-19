/* NEXO body organizer: Mi Nexo contains only Contacts, Invites and Ecosystem. */
(function(){
  'use strict';
  if(window.__NEXOLAYOUT)return; window.__NEXOLAYOUT=true;
  const qs=id=>document.getElementById(id);
  const wait=fn=>document.readyState==='loading'?document.addEventListener('DOMContentLoaded',fn,{once:true}):fn();

  function ensureStyle(){
    if(qs('nexo-layout-style')) return;
    const s=document.createElement('style'); s.id='nexo-layout-style';
    s.textContent=`
      #nexoWorkspace{padding:72px 0 96px}
      .nexo-workspace-head{display:flex;justify-content:space-between;align-items:end;gap:20px;margin-bottom:24px}
      .nexo-workspace-head h2{font-size:clamp(38px,5vw,64px);line-height:.95;letter-spacing:-.045em;margin:8px 0}
      .nexo-workspace-head p{max-width:520px}
      .nexo-workspace-card{background:linear-gradient(145deg,rgba(255,255,255,.05),rgba(255,255,255,.018));border:1px solid var(--line);border-radius:22px;overflow:hidden;box-shadow:var(--shadow)}
      .nexo-panel{border-bottom:1px solid var(--line)} .nexo-panel:last-child{border-bottom:0}
      .nexo-panel-btn{width:100%;border:0;background:transparent;color:var(--text);padding:20px 22px;display:flex;align-items:center;gap:14px;text-align:left}
      .nexo-panel-btn:hover{background:rgba(77,216,255,.035)}
      .nexo-panel-btn[aria-expanded=true]{background:rgba(77,216,255,.055)}
      .nexo-panel-icon{width:40px;height:40px;border-radius:13px;background:rgba(77,216,255,.08);color:var(--cyan);display:grid;place-items:center;flex:0 0 auto;font-size:16px}
      .nexo-panel-copy{flex:1;min-width:0}.nexo-panel-copy strong{display:block;font-size:16px}.nexo-panel-copy span{display:block;color:var(--muted);font-size:12px;line-height:1.5;margin-top:3px}
      .nexo-panel-arrow{color:var(--muted);font-size:16px;transition:.2s}.nexo-panel-btn[aria-expanded=true] .nexo-panel-arrow{transform:rotate(90deg);color:var(--cyan)}
      .nexo-panel-body{display:none;padding:0 22px 24px}.nexo-panel-body.open{display:block}
      .nexo-panel-body>section{padding:0!important;margin:0!important}
      .nexo-panel-body>section .section-head{margin-bottom:18px}.nexo-panel-body>section .section-head h2{font-size:30px}
      #contactos .section-head,#invitaciones .section-head,#ecosistema .section-head{display:none}
      #contactos,#invitaciones,#ecosistema{padding:0!important}
      .nexo-inline-label{font-size:10px;letter-spacing:.18em;text-transform:uppercase;color:var(--cyan);font-weight:900;margin:4px 0 10px}
      @media(max-width:900px){.nexo-workspace-head{align-items:start;flex-direction:column}}
      @media(max-width:600px){#nexoWorkspace{padding:54px 0 76px}.nexo-panel-btn{padding:16px}.nexo-panel-body{padding:0 16px 18px}}
    `;
    document.head.appendChild(s);
  }
  function getSection(id){const el=qs(id);return el&&el.tagName==='SECTION'?el:null;}
  function createPanel(key,icon,title,desc,open){
    const wrap=document.createElement('div'); wrap.className='nexo-panel'; wrap.dataset.panel=key;
    wrap.innerHTML=`<button type="button" class="nexo-panel-btn" aria-expanded="${open}"><span class="nexo-panel-icon">${icon}</span><span class="nexo-panel-copy"><strong>${title}</strong><span>${desc}</span></span><span class="nexo-panel-arrow">›</span></button><div class="nexo-panel-body${open?' open':''}"></div>`;
    const btn=wrap.querySelector('.nexo-panel-btn'), body=wrap.querySelector('.nexo-panel-body');
    btn.addEventListener('click',()=>{const next=!body.classList.contains('open');body.classList.toggle('open',next);btn.setAttribute('aria-expanded',String(next));});
    return {wrap,body};
  }
  wait(()=>{
    ensureStyle();
    const dashboard=qs('dashboard');
    if(!dashboard||qs('nexoWorkspace'))return;
    const mount=document.createElement('section'); mount.id='nexoWorkspace';
    mount.innerHTML=`<div class="container"><div class="nexo-workspace-head"><div><div class="tag">04 — Mi NEXO</div><h2>Conectividad</h2></div><p class="muted">Contactos, invitaciones y ecosistema, organizados en un solo lugar.</p></div><div class="nexo-workspace-card" id="nexoWorkspaceCard"></div></div>`;
    const card=mount.querySelector('#nexoWorkspaceCard');
    const contactos=createPanel('contactos','◎','Contactos','Tu red de personas y solicitudes.',false);
    const invitaciones=createPanel('invitaciones','✉','Invitaciones','Invitaciones recibidas y salas compartidas.',false);
    const ecosistema=createPanel('ecosistema','✦','Ecosistema','Work, Edu, Care y los espacios que iremos sumando.',false);
    [contactos,invitaciones,ecosistema].forEach(p=>card.appendChild(p.wrap));
    const contactosSec=getSection('contactos'); if(contactosSec){const label=document.createElement('div');label.className='nexo-inline-label';label.textContent='CONTACTOS';contactos.body.appendChild(label);contactos.body.appendChild(contactosSec);}
    const invSec=getSection('invitaciones'); if(invSec){const label=document.createElement('div');label.className='nexo-inline-label';label.textContent='INVITACIONES';invitaciones.body.appendChild(label);invitaciones.body.appendChild(invSec);}
    const ecoSec=getSection('ecosistema'); if(ecoSec){const label=document.createElement('div');label.className='nexo-inline-label';label.textContent='ECOSISTEMA';ecosistema.body.appendChild(label);ecosistema.body.appendChild(ecoSec);}
    dashboard.parentNode.insertBefore(mount,dashboard.nextSibling);
    document.querySelectorAll('a[href="#contactos"],a[href="#invitaciones"],a[href="#ecosistema"]').forEach(a=>{
      if(a.dataset.nexoWorkspaceBound)return; a.dataset.nexoWorkspaceBound='1';
      a.addEventListener('click',e=>{e.preventDefault();const href=a.getAttribute('href')||'';const panel=href==='#contactos'?'contactos':href==='#invitaciones'?'invitaciones':'ecosistema';const p=card.querySelector(`.nexo-panel[data-panel="${panel}"]`);if(!p)return;const b=p.querySelector('.nexo-panel-btn'),body=p.querySelector('.nexo-panel-body');body.classList.add('open');b.setAttribute('aria-expanded','true');mount.scrollIntoView({behavior:'smooth',block:'center'});});
    });
  });
})();
