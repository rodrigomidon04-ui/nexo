/* NEXO UX fix — centered workspace navigation + safe login remembering */
(function(){
  'use strict';
  if(window.__NEXOUXFIX)return; window.__NEXOUXFIX=true;

  function center(el){
    if(!el)return;
    requestAnimationFrame(()=>el.scrollIntoView({behavior:'smooth',block:'center',inline:'nearest'}));
  }

  function openPanel(panelName){
    const panel=document.querySelector(`.nexo-panel[data-panel="${panelName}"]`);
    if(!panel)return false;
    const body=panel.querySelector('.nexo-panel-body');
    const button=panel.querySelector('.nexo-panel-btn');
    if(body && !body.classList.contains('open'))body.classList.add('open');
    if(button)button.setAttribute('aria-expanded','true');

    if(panelName==='sesiones'){
      const target=[...panel.querySelectorAll('.nexo-inline-label')].find(x=>/CONTROL\s*[·•-]\s*SESIONES/i.test(x.textContent||''));
      if(target){target.id='nexo-control-sesiones';center(target);return true;}
      center(panel);return true;
    }
    center(panel);
    return true;
  }

  function bindNavigation(){
    document.addEventListener('click',e=>{
      const item=e.target.closest('.nexo-menu [data-nexo-target]');
      if(!item)return;
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      const map={sesiones:'sesiones',contactos:'contactos',invitaciones:'invitaciones',ecosistema:'ecosistema'};
      const panel=map[item.dataset.nexoTarget]||item.dataset.nexoTarget;
      const menu=document.getElementById('nexoMenu');
      const toggle=document.getElementById('nexoNavToggle');
      menu?.classList.remove('open');
      toggle?.setAttribute('aria-expanded','false');
      const run=()=>openPanel(panel);
      if(!run())setTimeout(run,120);
    },true);

    const account=document.getElementById('nexoNavAccount');
    account?.addEventListener('click',()=>setTimeout(()=>center(document.getElementById('dashboard')),80));
  }

  function setupLogin(){
    const email=document.getElementById('loginEmail');
    const password=document.getElementById('loginPassword');
    const form=document.getElementById('loginForm');
    if(!email||!password||!form)return;

    email.setAttribute('autocomplete','username');
    password.setAttribute('autocomplete','current-password');
    email.setAttribute('inputmode','email');
    email.setAttribute('spellcheck','false');

    if(!document.getElementById('rememberEmail')){
      const row=document.createElement('label');
      row.style.cssText='display:flex;align-items:center;gap:8px;font-size:12px;color:var(--muted);margin-top:-2px;cursor:pointer';
      row.innerHTML='<input id="rememberEmail" type="checkbox" style="accent-color:var(--cyan)"><span>Recordar mi email en este navegador</span>';
      const submit=form.querySelector('button[type="submit"],button:not([type])');
      submit?.parentNode?.insertBefore(row,submit);
    }

    const remember=document.getElementById('rememberEmail');
    try{
      const saved=localStorage.getItem('nexoRememberedEmail');
      if(saved){email.value=saved;remember.checked=true;}
    }catch{}

    form.addEventListener('submit',()=>{
      try{
        if(remember.checked)localStorage.setItem('nexoRememberedEmail',email.value.trim());
        else localStorage.removeItem('nexoRememberedEmail');
      }catch{}
    },true);
  }

  function boot(){
    bindNavigation();
    setupLogin();
    // Handle the workspace being built asynchronously by nexo-layout.js.
    const observer=new MutationObserver(()=>setupLogin());
    observer.observe(document.body,{childList:true,subtree:true});
    setTimeout(setupLogin,400);
    setTimeout(setupLogin,1200);
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
