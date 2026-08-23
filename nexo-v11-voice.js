/* NEXO V11 — voz multiplataforma
 * Mantiene SpeechRecognition para Chrome/Chromium y agrega captura MediaRecorder
 * como fallback para Firefox. El backend de transcripcion se configura sin
 * romper el sistema nativo si no existe.
 */
(function(){
  'use strict';
  if(window.__NEXOV11)return; window.__NEXOV11=true;
  const listen=document.getElementById('nexo9Listen');
  const input=document.getElementById('nexo9Input');
  const msg=document.getElementById('nexo9Message');
  if(!listen||!input)return;

  const Native=window.SpeechRecognition||window.webkitSpeechRecognition;
  let native=null, recorder=null, chunks=[], stream=null, recording=false;
  const CONFIG={endpoint:window.NEXO_VOICE_ENDPOINT||''};

  function status(text){if(msg)msg.textContent=text}
  function setButton(text,active){listen.textContent=text;listen.classList.toggle('active',!!active)}

  // Chrome/Chromium: conservar el reconocimiento nativo existente.
  if(Native){
    native=new Native();
    native.lang='es-UY';
    native.interimResults=false;
    native.continuous=false;
    native.onstart=function(){setButton('● Escuchando…',true);status('Te escucho…')};
    native.onend=function(){setButton('🎙 Hablar',false)};
    native.onerror=function(e){setButton('🎙 Hablar',false);status(e.error==='not-allowed'?'Necesito permiso para usar el micrófono.':'No pude reconocer la voz. Intentá nuevamente.')};
    native.onresult=function(e){
      const text=e.results[0][0].transcript.trim();
      if(text){input.value=text;const send=document.getElementById('nexo9Send');if(send)send.click()}
    };
    listen.onclick=function(){try{if(listen.classList.contains('active'))native.stop();else native.start()}catch(e){}}
    return;
  }

  // Firefox/otros navegadores: captura local con MediaRecorder.
  // Si existe endpoint, envía el audio para transcripción; si no, informa
  // claramente que falta conectar el servicio, sin romper la interfaz.
  async function startFallback(){
    if(recording){stopFallback();return}
    if(!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia){status('Este navegador no permite acceder al micrófono desde esta página.');return}
    try{
      stream=await navigator.mediaDevices.getUserMedia({audio:true});
      chunks=[];
      const mime=MediaRecorder.isTypeSupported('audio/webm;codecs=opus')?'audio/webm;codecs=opus':'audio/webm';
      recorder=new MediaRecorder(stream,{mimeType:mime});
      recorder.ondataavailable=e=>{if(e.data&&e.data.size)chunks.push(e.data)};
      recorder.onstop=async function(){
        stream.getTracks().forEach(t=>t.stop());stream=null;recording=false;setButton('🎙 Hablar',false);
        if(!chunks.length){status('No se capturó audio.');return}
        if(!CONFIG.endpoint){status('Micrófono activo. Para transcribir voz en Firefox falta conectar el servicio de reconocimiento de NEXO.');return}
        status('Procesando voz…');
        try{
          const blob=new Blob(chunks,{type:mime});
          const fd=new FormData();fd.append('audio',blob,'nexo-voice.webm');fd.append('lang','es-UY');
          const r=await fetch(CONFIG.endpoint,{method:'POST',body:fd});
          if(!r.ok)throw new Error('HTTP '+r.status);
          const data=await r.json();
          const text=(data.text||data.transcript||'').trim();
          if(text){input.value=text;const send=document.getElementById('nexo9Send');if(send)send.click()}else status('No pude entender el audio.');
        }catch(e){status('No pude procesar el audio. Revisá la conexión del servicio de voz.');}
      };
      recorder.start();recording=true;setButton('■ Detener',true);status('Te escucho… hablá y luego detené la grabación.');
    }catch(e){status(e.name==='NotAllowedError'?'Firefox bloqueó el micrófono. Permitilo desde el icono de permisos de la barra de direcciones.':'No pude acceder al micrófono.')}
  }
  function stopFallback(){if(recorder&&recording)recorder.stop()}
  listen.onclick=startFallback;
  window.NEXOVoice={version:'11.0',mode:'firefox-fallback',start:startFallback,stop:stopFallback,endpoint:CONFIG.endpoint||null};
})();
