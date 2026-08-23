/* NEXO V11.1 — voz multiplataforma */
(function(){
  'use strict';
  if(window.__NEXOV11)return; window.__NEXOV11=true;
  const listen=document.getElementById('nexo9Listen'),input=document.getElementById('nexo9Input'),msg=document.getElementById('nexo9Message');
  if(!listen||!input)return;
  const Native=window.SpeechRecognition||window.webkitSpeechRecognition;
  let native=null,recorder=null,chunks=[],stream=null,recording=false;
  const SUPABASE_URL='https://bqrudacynjwlragoiero.supabase.co';
  const SUPABASE_ANON='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJxcnVkYWN5bmp3bHJhZ29pZXJvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcwMzM1ODMsImV4cCI6MjEwMjYwOTU4M30.C43c09GJxv_467gLRzMFOEk3DM84R2LjefmAMg_S1k8';
  const ENDPOINT=SUPABASE_URL+'/functions/v1/nexo-voice-transcribe';
  function status(t){if(msg)msg.textContent=t}
  function button(t,a){listen.textContent=t;listen.classList.toggle('active',!!a)}

  if(Native){
    native=new Native();native.lang='es-UY';native.interimResults=false;native.continuous=false;
    native.onstart=()=>{button('● Escuchando…',true);status('Te escucho…')};
    native.onend=()=>button('🎙 Hablar',false);
    native.onerror=e=>{button('🎙 Hablar',false);status(e.error==='not-allowed'?'Necesito permiso para usar el micrófono.':'No pude reconocer la voz. Intentá nuevamente.')};
    native.onresult=e=>{const t=e.results[0][0].transcript.trim();if(t){input.value=t;document.getElementById('nexo9Send')?.click()}};
    listen.onclick=()=>{try{listen.classList.contains('active')?native.stop():native.start()}catch(e){}};
    window.NEXOVoice={version:'11.1',mode:'native'};return;
  }

  async function start(){
    if(recording){stop();return}
    if(!navigator.mediaDevices?.getUserMedia||!window.MediaRecorder){status('Este navegador no permite capturar audio.');return}
    try{
      stream=await navigator.mediaDevices.getUserMedia({audio:true});chunks=[];
      const mime=MediaRecorder.isTypeSupported('audio/webm;codecs=opus')?'audio/webm;codecs=opus':'audio/webm';
      recorder=new MediaRecorder(stream,{mimeType:mime});
      recorder.ondataavailable=e=>{if(e.data?.size)chunks.push(e.data)};
      recorder.onstop=async()=>{
        stream?.getTracks().forEach(t=>t.stop());stream=null;recording=false;button('🎙 Hablar',false);
        if(!chunks.length){status('No se capturó audio.');return}
        status('Procesando voz…');
        try{
          const fd=new FormData();fd.append('audio',new Blob(chunks,{type:mime}),'nexo-voice.webm');fd.append('lang','es-UY');
          const r=await fetch(ENDPOINT,{method:'POST',headers:{Authorization:'Bearer '+SUPABASE_ANON,apikey:SUPABASE_ANON},body:fd});
          const data=await r.json();if(!r.ok)throw new Error(data.error||('HTTP '+r.status));
          const text=(data.text||data.transcript||'').trim();
          if(text){input.value=text;document.getElementById('nexo9Send')?.click()}else status('No pude entender el audio.');
        }catch(e){status('No pude transcribir la voz: '+(e.message||'error de conexión'));}
      };
      recorder.start();recording=true;button('■ Detener',true);status('Te escucho… hablá y luego detené la grabación.');
    }catch(e){status(e.name==='NotAllowedError'?'Firefox bloqueó el micrófono. Permitilo desde el icono de permisos.':'No pude acceder al micrófono.')}
  }
  function stop(){if(recorder&&recording)recorder.stop()}
  listen.onclick=start;
  window.NEXOVoice={version:'11.1',mode:'firefox-fallback',start,stop,endpoint:ENDPOINT};
})();
