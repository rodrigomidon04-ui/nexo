/* NEXO 04: compact internal content for Mi Nexo members. */
(function(){
  'use strict';
  if(window.__NEXOMINEXOMEMBERS)return;
  window.__NEXOMINEXOMEMBERS=true;

  function show(panel, button){
    if(!panel || !button)return;
    panel.hidden=false;
    panel.style.display='block';
    button.classList.add('active');
    requestAnimationFrame(()=>panel.scrollIntoView({behavior:'smooth',block:'center',inline:'nearest'}));
  }

  function hideAll(card){
    card.querySelectorAll('.nexo-mi-nexo-content').forEach(panel=>{
      panel.hidden=true;
      panel.style.display='none';
      const button=card.querySelector(`[data-panel-target="${panel.dataset.content}"]`);
      button?.classList.remove('active');
    });
  }

  function prepare(){
    const card=document.getElementById('nexoWorkspaceCard');
    if(!card)return;

    ['contactos','invitaciones','ecosistema'].forEach(id=>{
      const sec=document.getElementById(id);
      if(!sec)return;

      let panel=document.querySelector(`.nexo-mi-nexo-content[data-content="${id}"]`);
      if(!panel){
        panel=document.createElement('div');
        panel.className='nexo-mi-nexo-content';
        panel.dataset.content=id;
      }

      if(sec.parentElement!==panel)panel.appendChild(sec);
      sec.hidden=false;
      sec.style.display='block';
      sec.style.margin='0';
      const head=sec.querySelector('.section-head');
      if(head)head.style.display='none';

      const button=card.querySelector(`[data-final-target="${id}"]`);
      if(button){
        button.dataset.panelTarget=id;
        button.after(panel);
      }else if(panel.parentElement!==card){
        card.appendChild(panel);
      }
      panel.hidden=true;
      panel.style.display='none';
    });

    if(!document.getElementById('nexo-mi-nexo-members-style')){
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

    card.querySelectorAll('[data-panel-target]').forEach(button=>{
      if(button.dataset.panelBound==='1')return;
      button.dataset.panelBound='1';
      button.addEventListener('click',e=>{
        e.preventDefault();
        const target=button.dataset.panelTarget;
        const panel=card.querySelector(`.nexo-mi-nexo-content[data-content="${target}"]`);
        if(!panel)return;
        hideAll(card);
        button.after(panel);
        show(panel,button);
      });
    });

    document.querySelectorAll('#nexoFinalMenu [data-final-menu]').forEach(menuButton=>{
      const target=menuButton.dataset.finalMenu;
      if(!['contactos','invitaciones','ecosistema'].includes(target) || menuButton.dataset.panelBound==='1')return;
      menuButton.dataset.panelBound='1';
      menuButton.addEventListener('click',e=>{
        e.preventDefault();
        const button=card.querySelector(`[data-panel-target="${target}"]`);
        const panel=card.querySelector(`.nexo-mi-nexo-content[data-content="${target}"]`);
        if(!button||!panel)return;
        hideAll(card);
        button.after(panel);
        show(panel,button);
      },true);
    });
  }

  setTimeout(prepare,2600);
})();
