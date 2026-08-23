/* NEXO V10 — capa de acciones sobre el asistente V9 */
(function(){
  'use strict';
  if(window.__NEXOV10)return; window.__NEXOV10=true;
  const panel=document.getElementById('nexo9Panel');
  const input=document.getElementById('nexo9Input');
  const msg=document.getElementById('nexo9Message');
  const orb=document.getElementById('nexo9Orb');
  if(!panel||!input||!msg)return;

  const style=document.createElement('style');
  style.textContent='.nexo10-thinking{animation:nexo10think .65s ease-in-out infinite alternate}@keyframes nexo10think{to{filter:drop-shadow(0 0 38px rgba(77,216,255,.9))}}.nexo10-actions{margin-top:18px;padding-top:16px;border-top:1px solid rgba(255,255,255,.07)}.nexo10-actions-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}.nexo10-action{border:1px solid rgba(255,255,255,.1);background:rgba(255,255,255,.04);color:#f5f7fa;border-radius:13px;padding:10px;cursor:pointer}.nexo10-action:hover{border-color:#4dd8ff;color:#4dd8ff}';
  document.head.appendChild(style);

  const headStatus=panel.querySelector('.nexo9-status');
  if(headStatus)headStatus.textContent='V10 · listo';

  const actions=document.createElement('div');
  actions.className='nexo10-actions';
  actions.innerHTML='<div class="nexo9-label">Acciones rápidas</div><div class="nexo10-actions-grid"><button class="nexo10-action" data-n10="salas">📹 Salas</button><button class="nexo10-action" data-n10="explorar">🔎 Explorar</button><button class="nexo10-action" data-n10="inicio">⌂ Inicio</button><button class="nexo10-action" data-n10="config">⚙ Configuración</button></div>';
  panel.querySelector('.nexo9-body').appendChild(actions);

  function go(id,text){
    const el=document.getElementById(id);
    if(el){el.scrollIntoView({behavior:'smooth',block:'start'});msg.textContent=text;return true;}
    msg.textContent='No encontré esa sección en esta versión.';return false;
  }
  function config(){
    if(typeof window.openSettings==='function'){window.openSettings();msg.textContent='Abriendo configuración.';return true;}
    const b=document.querySelector('[onclick*="openSettings"]');
    if(b){b.click();msg.textContent='Abriendo configuración.';return true;}
    msg.textContent='La configuración no está disponible en esta pantalla.';return false;
  }
  function execute(action){
    if(action==='salas')return go('salas','Te llevo a Salas.');
    if(action==='explorar')return go('explorar','Te llevo a Explorar.');
    if(action==='inicio')return go('inicio','Volviendo al inicio.');
    if(action==='config')return config();
    return false;
  }
  function parse(text){
    const q=text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
    if(/\b(salas?|videollamada|videollamadas|room|rooms)\b/.test(q))return 'salas';
    if(/\b(explorar|descubrir|buscar salas)\b/.test(q))return 'explorar';
    if(/\b(inicio|principal|home|volver al inicio)\b/.test(q))return 'inicio';
    if(/\b(configuracion|ajustes|preferencias|opciones)\b/.test(q))return 'config';
    return null;
  }
  function speak(text){
    if(!window.speechSynthesis)return;
    const u=new SpeechSynthesisUtterance(text);u.lang='es-UY';u.rate=.96;window.speechSynthesis.cancel();window.speechSynthesis.speak(u);
  }
  function respond(text){
    const action=parse(text);
    if(orb)orb.classList.add('nexo10-thinking');
    if(headStatus)headStatus.textContent='V10 · ejecutando';
    setTimeout(function(){
      let answer;
      if(action){execute(action);answer=action==='salas'?'Te llevo a Salas.':action==='explorar'?'Te llevo a Explorar.':action==='inicio'?'Volviendo al inicio.':'Abriendo configuración.';}
      else answer='Puedo abrir Salas, Explorar, Inicio o Configuración. Decime qué querés hacer.';
      msg.textContent=answer;speak(answer);
      if(orb)orb.classList.remove('nexo10-thinking');
      if(headStatus)headStatus.textContent='V10 · listo';
    },220);
  }

  const send=document.getElementById('nexo9Send');
  if(send){
    const replacement=send.cloneNode(true);send.replaceWith(replacement);
    replacement.addEventListener('click',function(){const t=input.value.trim();if(t){input.value='';respond(t);}});
  }
  input.addEventListener('keydown',function(e){if(e.key==='Enter'){e.preventDefault();const t=input.value.trim();if(t){input.value='';respond(t);}}});
  actions.querySelectorAll('[data-n10]').forEach(function(b){b.addEventListener('click',function(){respond(b.dataset.n10);});});
  document.addEventListener('keydown',function(e){if(e.altKey&&e.key.toLowerCase()==='n'){e.preventDefault();panel.classList.add('open');input.focus();}});

  window.NEXOAssistant={version:'10.0',execute:execute,parseCommand:parse,open:function(){panel.classList.add('open')},close:function(){panel.classList.remove('open')},say:speak};
})();
