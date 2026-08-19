/* NEXO 04: keep Contacts, Invitations and Ecosystem inside Mi Nexo. */
(function(){
  'use strict';
  if(window.__NEXOMINEXOMEMBERS)return;
  window.__NEXOMINEXOMEMBERS=true;

  const $=id=>document.getElementById(id);

  function center(el){
    if(!el)return false;
    el.hidden=false;
    el.style.display='block';
    requestAnimationFrame(()=>el.scrollIntoView({behavior:'smooth',block:'center',inline:'nearest'}));
    return true;
  }

  function prepare(){
    const workspace=$('nexoWorkspace');
    const card=$('nexoWorkspaceCard');
    if(!workspace||!card)return;

    ['contactos','invitaciones','ecosistema'].forEach((id)=>{
      const sec=$(id);
      if(!sec)return;

      let wrap=document.querySelector(`.nexo-mi-nexo-content[data-content="${id}"]`);
      if(!wrap){
        wrap=document.createElement('div');
        wrap.className='nexo-mi-nexo-content';
        wrap.dataset.content=id;
        wrap.hidden=true;
        wrap.style.display='none';
        card.appendChild(wrap);
      }

      if(sec.parentElement!==wrap)wrap.appendChild(sec);
      sec.hidden=false;
      sec.style.display='block';
      sec.style.margin='0';
      sec.querySelector('.section-head')?.setAttribute('style','display:none');
      wrap.hidden=true;
      wrap.style.display='none';
    });

    if(!$('nexo-mi-nexo-members-style')){
      const s=document.createElement('style');
      s.id='nexo-mi-nexo-members-style';
      s.textContent=`
        .nexo-mi-nexo-content{border-top:1px solid var(--line);padding:24px;background:rgba(255,255,255,.018)}
        .nexo-mi-nexo-content > section{padding:0!important}
        .nexo-mi-nexo-content .container{padding:0!important;max-width:none!important}
        .nexo-mi-nexo-content .section-head{display:none!important}
        .nexo-mi-nexo-content .card{box-shadow:none}
      `;
      document.head.appendChild(s);
    }

    card.querySelectorAll('[data-final-target]').forEach(button=>{
      if(button.dataset.membersFixBound==='1')return;
      const target=button.dataset.finalTarget;
      if(!['contactos','invitaciones','ecosistema'].includes(target))return;
      button.dataset.membersFixBound='1';
      button.addEventListener('click',(e)=>{
        e.preventDefault();
        const wrap=document.querySelector(`.nexo-mi-nexo-content[data-content="${target}"]`);
        if(!wrap)return;
        card.querySelectorAll('.nexo-mi-nexo-content').forEach(w=>{w.hidden=true;w.style.display='none'});
        wrap.hidden=false;
        wrap.style.display='block';
        center(wrap);
      });
    });

    document.querySelectorAll('#nexoFinalMenu [data-final-menu]').forEach(button=>{
      const target=button.dataset.finalMenu;
      if(!['contactos','invitaciones','ecosistema'].includes(target))return;
      if(button.dataset.membersFixBound==='1')return;
      button.dataset.membersFixBound='1';
      button.addEventListener('click',(e)=>{
        e.preventDefault();
        const wrap=document.querySelector(`.nexo-mi-nexo-content[data-content="${target}"]`);
        if(!wrap)return;
        card.querySelectorAll('.nexo-mi-nexo-content').forEach(w=>{w.hidden=true;w.style.display='none'});
        wrap.hidden=false;
        wrap.style.display='block';
        center(wrap);
      },true);
    });
  }

  const boot=()=>setTimeout(prepare,2300);
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});
  else boot();
})();
