/* NEXO V10.1 — asistente visual, voz y configuracion local */
(function(){
  'use strict';
  if(window.__NEXOV9)return; window.__NEXOV9=true;

  const style=document.createElement('style');
  style.textContent=`
  .nexo9-fab{position:fixed;right:24px;bottom:24px;z-index:700;width:76px;height:76px;border-radius:24px;border:1px solid rgba(77,216,255,.45);background:rgba(8,14,20,.92);backdrop-filter:blur(18px);color:#4dd8ff;display:grid;place-items:center;box-shadow:0 18px 50px rgba(0,0,0,.45),0 0 35px rgba(77,216,255,.13);cursor:pointer;transition:.25s}.nexo9-fab:hover{transform:translateY(-3px) scale(1.03);border-color:#4dd8ff}.nexo9-face{width:52px;height:52px}.nexo9-panel{position:fixed;right:24px;bottom:112px;z-index:699;width:min(390px,calc(100vw - 30px));max-height:min(690px,calc(100vh - 135px));overflow:auto;background:rgba(10,15,21,.97);border:1px solid rgba(77,216,255,.2);border-radius:24px;box-shadow:0 30px 100px rgba(0,0,0,.6);backdrop-filter:blur(24px);display:none}.nexo9-panel.open{display:block;animation:nexo9in .25s ease}@keyframes nexo9in{from{opacity:0;transform:translateY(12px) scale(.98)}to{opacity:1;transform:none}}.nexo9-head{padding:20px 20px 14px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid rgba(255,255,255,.08)}.nexo9-title{font-size:17px;font-weight:900}.nexo9-status{font-size:10px;color:#63e6be;letter-spacing:.12em;text-transform:uppercase;margin-top:4px}.nexo9-close{width:34px;height:34px;border-radius:11px;border:1px solid rgba(255,255,255,.1);background:transparent;color:#8f99a6;cursor:pointer}.nexo9-body{padding:18px}.nexo9-orb{display:grid;place-items:center;padding:8px 0 15px}.nexo9-orb-face{width:105px;height:105px;filter:drop-shadow(0 0 28px rgba(77,216,255,.25))}.nexo9-message{padding:13px 14px;border:1px solid rgba(255,255,255,.08);background:rgba(255,255,255,.025);border-radius:15px;color:#d9e1e8;font-size:13px;line-height:1.55;margin-bottom:14px}.nexo9-row{display:flex;gap:8px}.nexo9-input{flex:1;min-width:0;background:#080c10;border:1px solid rgba(255,255,255,.1);color:#f5f7fa;border-radius:13px;padding:11px 12px;outline:none}.nexo9-input:focus{border-color:#4dd8ff}.nexo9-btn{border:1px solid rgba(255,255,255,.1);background:rgba(255,255,255,.04);color:#f5f7fa;border-radius:13px;padding:10px 12px;cursor:pointer}.nexo9-btn.primary{background:#4dd8ff;color:#001017;border-color:#4dd8ff;font-weight:800}.nexo9-btn.listen.active{background:rgba(255,93,108,.12);border-color:rgba(255,93,108,.4);color:#ff93a0}.nexo9-btn:disabled{opacity:.55;cursor:not-allowed}.nexo9-section{margin-top:18px;padding-top:16px;border-top:1px solid rgba(255,255,255,.07)}.nexo9-label{font-size:10px;color:#4dd8ff;text-transform:uppercase;letter-spacing:.18em;font-weight:900;margin-bottom:9px}.nexo9-select{width:100%;background:#080c10;border:1px solid rgba(255,255,255,.1);color:#f5f7fa;border-radius:13px;padding:11px}.nexo9-actions{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:9px}.nexo9-note{font-size:11px;color:#737e8a;line-height:1.5;margin-top:8px}.nexo9-pulse{animation:nexo9pulse 1.1s ease-in-out infinite}@keyframes nexo9pulse{50%{filter:drop-shadow(0 0 30px rgba(77,216,255,.75))}}
  `;
  document.head.appendChild(style);

  const root=document.createElement('div');
  root.innerHTML=`
    <button class="nexo9-fab" id="nexo9Fab" aria-label="Abrir asistente NEXO" title="Asistente NEXO">
      <svg class="nexo9-face" viewBox="0 0 100 100"><rect x="8" y="14" width="84" height="72" rx="22" fill="#0e1620" stroke="#4dd8ff" stroke-width="4"/><ellipse cx="35" cy="45" rx="7" ry="12" fill="#4dd8ff"><animate attributeName="ry" values="12;1;12" dur="4.2s" repeatCount="indefinite" keyTimes="0;.5;1"/></ellipse><ellipse cx="65" cy="45" rx="7" ry="12" fill="#4dd8ff"><animate attributeName="ry" values="12;1;12" dur="4.2s" repeatCount="indefinite" keyTimes="0;.5;1"/></ellipse><path d="M33 65 Q50 78 67 65" fill="none" stroke="#4dd8ff" stroke-width="6" stroke-linecap="round"/></svg>
    </button>
    <aside class="nexo9-panel" id="nexo9Panel" aria-label="Asistente NEXO">
      <div class="nexo9-head"><div><div class="nexo9-title">Asistente NEXO</div><div class="nexo9-status">V10.1 · listo</div></div><button class="nexo9-close" id="nexo9Close">×</button></div>
      <div class="nexo9-body">
        <div class="nexo9-orb"><svg id="nexo9Orb" class="nexo9-orb-face" viewBox="0 0 100 100"><rect x="8" y="14" width="84" height="72" rx="22" fill="#0e1620" stroke="#4dd8ff" stroke-width="4"/><ellipse id="nexo9Eye1" cx="35" cy="45" rx="7" ry="12" fill="#4dd8ff"><animate attributeName="ry" values="12;1;12" dur="4.2s" repeatCount="indefinite" keyTimes="0;.5;1"/></ellipse><ellipse id="nexo9Eye2" cx="65" cy="45" rx="7" ry="12" fill="#4dd8ff"><animate attributeName="ry" values="12;1;12" dur="4.2s" repeatCount="indefinite" keyTimes="0;.5;1"/></ellipse><path d="M33 65 Q50 78 67 65" fill="none" stroke="#4dd8ff" stroke-width="6" stroke-linecap="round"/></svg></div>
        <div class="nexo9-message" id="nexo9Message">Hola. Soy NEXO. Estoy listo para ayudarte.</div>
        <div class="nexo9-row"><input class="nexo9-input" id="nexo9Input" placeholder="Escribime algo…" autocomplete="off"><button class="nexo9-btn primary" id="nexo9Send">Enviar</button></div>
        <div class="nexo9-row" style="margin-top:8px"><button class="nexo9-btn listen" id="nexo9Listen" style="flex:1">🎙 Hablar</button><button class="nexo9-btn" id="nexo9Stop" style="flex:1">■ Detener voz</button></div>
        <div class="nexo9-section"><div class="nexo9-label">Voz del asistente</div><select class="nexo9-select" id="nexo9Voice"></select><div class="nexo9-actions"><button class="nexo9-btn primary" id="nexo9Preview">▶ Probar voz</button><button class="nexo9-btn" id="nexo9Save">Guardar</button></div><div class="nexo9-note" id="nexo9VoiceNote">NEXO prioriza español latino/rioplatense.</div></div>
      </div>
    </aside>`;
  document.body.appendChild(root);

  const $=id=>document.getElementById(id), panel=$('nexo9Panel'), fab=$('nexo9Fab'), input=$('nexo9Input'), msg=$('nexo9Message'), voice=$('nexo9Voice'), orb=$('nexo9Orb');
  const presets=[
    {id:'uy-natural',name:'🇺🇾 Español Uruguay · Natural',pitch:1,rate:.96},
    {id:'latino-claro',name:'🌎 Español Latino · Claro',pitch:1.02,rate:1},
    {id:'latino-calido',name:'🌎 Español Latino · Cálido',pitch:.96,rate:.94},
    {id:'latino-joven',name:'🌎 Español Latino · Joven',pitch:1.08,rate:1.03},
    {id:'latino-sereno',name:'🌎 Español Latino · Sereno',pitch:.91,rate:.9}
  ];
  let voices=[];
  let saved=JSON.parse(localStorage.getItem('nexoV9Voice')||'null')||presets[0];

  function loadVoices(){
    voices=window.speechSynthesis?.getVoices?.()||[];
    const spanish=voices.filter(v=>/^es([-_]|$)/i.test(v.lang));
    voice.innerHTML=presets.map(p=>`<option value="${p.id}">${p.name}</option>`).join('');
    voice.value=saved.id||presets[0].id;
    $('nexo9VoiceNote').textContent=spanish.length?`${spanish.length} voces en español detectadas. NEXO usa la mejor coincidencia disponible.`:'Voces del sistema todavía no disponibles; probá Probar voz nuevamente.';
  }
  function selected(){return presets.find(p=>p.id===voice.value)||presets[0]}
  function pickSystemVoice(){
    const es=voices.filter(v=>/^es([-_]|$)/i.test(v.lang));
    if(!es.length)return null;
    return es.find(v=>/UY|Uruguay/i.test(v.lang+' '+v.name))||es.find(v=>/MX|Mexico|México|AR|Argentina|CL|Chile|US/i.test(v.lang+' '+v.name))||es[0];
  }
  function speak(text){
    if(!('speechSynthesis' in window)){msg.textContent='Este navegador no tiene voz disponible.';return;}
    speechSynthesis.cancel();const p=selected(),u=new SpeechSynthesisUtterance(text);u.lang='es-UY';u.rate=p.rate;u.pitch=p.pitch;u.volume=1;const v=pickSystemVoice();if(v)u.voice=v;u.onstart=()=>orb.classList.add('nexo9-pulse');u.onend=()=>orb.classList.remove('nexo9-pulse');u.onerror=()=>orb.classList.remove('nexo9-pulse');speechSynthesis.speak(u);
  }
  function show(text){msg.textContent=text;speak(text)}
  function reply(text){const q=text.toLowerCase();if(q.includes('hola')||q.includes('buenas'))return 'Hola. Soy NEXO y estoy listo para ayudarte.';if(q.includes('sala')){document.getElementById('salas')?.scrollIntoView({behavior:'smooth'});return 'Te llevo a la sección de salas.'}if(q.includes('config')||q.includes('voz'))return 'Desde este panel podés elegir la voz de NEXO.';if(q.includes('explorar')){document.getElementById('explorar')?.scrollIntoView({behavior:'smooth'});return 'Te llevo a Explorar.'}if(q.includes('perfil')){document.getElementById('perfil')?.scrollIntoView({behavior:'smooth'});return 'Te llevo a tu perfil.'}if(q.includes('gracias'))return 'De nada. Seguimos construyendo NEXO.';return 'Te escuché. Decime si querés ir a Salas, Explorar, Inicio o Configuración.'}
  function send(){const t=input.value.trim();if(!t)return;input.value='';if(window.NEXOAssistant?.execute){const a=window.NEXOAssistant.parseCommand?.(t);if(a){window.NEXOAssistant.execute(a);return}}show(reply(t))}

  fab.addEventListener('click',()=>{panel.classList.toggle('open');if(panel.classList.contains('open'))setTimeout(()=>input.focus(),100)});
  $('nexo9Close').addEventListener('click',()=>panel.classList.remove('open'));$('nexo9Send').addEventListener('click',send);input.addEventListener('keydown',e=>{if(e.key==='Enter')send()});
  $('nexo9Preview').addEventListener('click',()=>speak('Hola, soy NEXO. Esta es la vista previa de mi voz.'));$('nexo9Stop').addEventListener('click',()=>speechSynthesis?.cancel());
  $('nexo9Save').addEventListener('click',()=>{saved=selected();localStorage.setItem('nexoV9Voice',JSON.stringify(saved));show('Voz guardada. La usaré como tu voz preferida.')});voice.addEventListener('change',()=>speak('Esta es la voz seleccionada para NEXO.'));

  let recognition=null;const SpeechRecognition=window.SpeechRecognition||window.webkitSpeechRecognition;const listen=$('nexo9Listen');
  if(SpeechRecognition){
    recognition=new SpeechRecognition();recognition.lang='es-UY';recognition.interimResults=false;recognition.continuous=false;recognition.maxAlternatives=1;
    recognition.onstart=()=>{listen.classList.add('active');listen.textContent='● Escuchando…';msg.textContent='Te escucho…';orb.classList.add('nexo9-pulse')};
    recognition.onend=()=>{listen.classList.remove('active');listen.textContent='🎙 Hablar';orb.classList.remove('nexo9-pulse')};
    recognition.onerror=e=>{listen.classList.remove('active');listen.textContent='🎙 Hablar';orb.classList.remove('nexo9-pulse');msg.textContent=e.error==='not-allowed'?'Necesito permiso para usar el micrófono.':`No pude escuchar (${e.error}).`};
    recognition.onresult=e=>{const text=e.results[0][0].transcript;input.value=text;send()};
    listen.addEventListener('click',()=>{try{if(listen.classList.contains('active'))recognition.stop();else recognition.start()}catch(e){msg.textContent='El micrófono ya está iniciándose.'}});
  }else{
    listen.disabled=true;listen.textContent='🎙 Voz no compatible';
    $('nexo9VoiceNote').textContent='La voz de salida funciona, pero este navegador no ofrece reconocimiento de voz. Para hablar con NEXO usá Chrome o Chromium y permití el micrófono.';
  }
  if('speechSynthesis' in window){loadVoices();speechSynthesis.onvoiceschanged=loadVoices}else loadVoices();
  document.addEventListener('keydown',e=>{if(e.key==='Escape')panel.classList.remove('open')});
})();
