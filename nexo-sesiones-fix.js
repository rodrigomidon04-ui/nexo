/* NEXO fix: Sesiones inside 04 Mi Nexo -> 03 Mi Centro, centered. */
(function(){
  'use strict';
  if(window.__NEXOSESIONESFIX)return; window.__NEXOSESIONESFIX=true;
  const $=id=>document.getElementById(id);
  const center=el=>{if(!el)return false;el.hidden=false;el.style.display='';requestAnimationFrame(()=>el.scrollIntoView({behavior:'smooth',block:'center',inline:'nearest'}));return true};
  function run(){
    const nav=document.querySelector('.nav .navlinks');
    if(!nav)return;
    const mi=nav.querySelector('.nexo-nav-mi');
    if(!mi)return;
    let menu=mi.querySelector('.nexo-menu');
    if(!menu){
      menu=document.createElement('div');
      menu.className='nexo-menu';
      menu.innerHTML='<div class="nexo-menu-head"><div><div class="tag">MI NEXO</div><div class="nexo-menu-title">Conectividad</div></div><div class="nexo-menu-sub">Sesiones, contactos, invitaciones y ecosistema.</div></div>';
      mi.appendChild(menu);
    }
    const ensure=(key,icon,label,desc)=>{
      let b=menu.querySelector('[data-sesiones-fix="'+key+'"]');
      if(b)return b;
      b=document.createElement('button');b.type='button';b.className='nexo-step';b.dataset.sesionesFix=key;b.innerHTML='<span class="nexo-step-icon">'+icon+'</span><span class="nexo-step-main"><strong>'+label+'</strong><span>'+desc+'</span></span><span class="nexo-step-arrow">›</span>';menu.appendChild(b);return b;
    };
    const sesiones=ensure('sesiones','◌','Sesiones','Conversaciones, actividad e historial.');
    ensure('contactos','◎','Contactos','Tu red de personas conectadas.');
    ensure('invitaciones','✉','Invitaciones','Salas e invitaciones pendientes.');
    ensure('ecosistema','✦','Ecosistema','Work, Edu, Care y futuros espacios NEXO.');
    const targetMap={sesiones:'nexo33134',contactos:'contactos',invitaciones:'invitaciones',ecosistema:'ecosistema'};
    menu.querySelectorAll('[data-sesiones-fix]').forEach(btn=>{
      btn.addEventListener('click',e=>{
        e.preventDefault();e.stopPropagation();
        menu.classList.remove('open');
        const target=$(targetMap[btn.dataset.sesionesFix]);
        if(target)center(target);
        if(target&&history.replaceState)history.replaceState(null,'','#'+target.id);
      },true);
    });
    sesiones.setAttribute('aria-label','Abrir Sesiones en Mi Centro');
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(run,250),{once:true});else setTimeout(run,250);
})();
