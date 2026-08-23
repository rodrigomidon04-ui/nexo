(function(){
'use strict';
if(window.__NEXOFloating)return; window.__NEXOFloating=true;
const style=document.createElement('style');
style.textContent='\n#nexoFloatBtn{position:fixed;right:20px;bottom:20px;width:66px;height:66px;border:0;border-radius:50%;z-index:2147483000;cursor:pointer;background:#081b25;box-shadow:0 8px 28px rgba(0,0,0,.28),0 0 0 2px #18d5d0;display:flex;align-items:center;justify-content:center;padding:0;transition:transform .2s,box-shadow .2s}\n#nexoFloatBtn:hover{transform:scale(1.06)}#nexoFloatBtn:active{transform:scale(.96)}\n#nexoFloatFace{position:relative;width:50px;height:50px;border-radius:50%;background:linear-gradient(145deg,#071b25,#0a3442);border:2px solid #18d5d0;box-shadow:0 0 14px rgba(24,213,208,.45);display:flex;align-items:center;justify-content:center;overflow:hidden}\n#nexoFloatFace .nexoEye{width:8px;height:15px;border-radius:8px;background:#20e0dc;box-shadow:0 0 8px #20e0dc;margin:0 5px}\n#nexoFloatFace .nexoMouth{position:absolute;left:50%;top:31px;transform:translateX(-50%);width:18px;height:5px;border-bottom:2px solid #20e0dc;border-radius:0 0 12px 12px}\n#nexoFloatLabel{position:absolute;right:76px;bottom:17px;white-space:nowrap;background:#111;color:#fff;padding:8px 11px;border-radius:10px;font:600 13px system-ui;opacity:0;pointer-events:none;transform:translateX(5px);transition:.2s}\n#nexoFloatBtn:hover #nexoFloatLabel{opacity:1;transform:none}\n@media(max-width:600px){#nexoFloatBtn{right:16px;bottom:16px;width:60px;height:60px}#nexoFloatFace{width:46px;height:46px}#nexoFloatLabel{display:none}}\n#nexoFloatBtn.listening{animation:nexoPulse 1.1s infinite}\n@keyframes nexoPulse{50%{box-shadow:0 0 0 10px rgba(24,213,208,.12),0 8px 28px rgba(0,0,0,.28),0 0 0 2px #18d5d0}}\n';
document.head.appendChild(style);
function openAssistant(){
 const selectors=['#nexo9Assistant','#nexoAssistant','.nexo-assistant','#nexo9Panel','#nexo9Widget','#nexo9Open'];
 for(const selector of selectors){const el=document.querySelector(selector);if(el){if(el.tagName==='BUTTON'||el.tagName==='A'){el.click()}else{el.hidden=false;el.style.display='block';el.classList.add('open')}return true}}
 if(window.NEXOAssistant&&typeof window.NEXOAssistant.open==='function'){window.NEXOAssistant.open();return true}
 window.dispatchEvent(new CustomEvent('nexo:open'));
 return false;
}
const b=document.createElement('button');b.id='nexoFloatBtn';b.type='button';b.title='Abrir asistente NEXO';b.setAttribute('aria-label','Abrir asistente NEXO');
const face=document.createElement('span');face.id='nexoFloatFace';
const e1=document.createElement('span'),e2=document.createElement('span'),mouth=document.createElement('span');e1.className=e2.className='nexoEye';mouth.className='nexoMouth';face.append(e1,e2,mouth);
const label=document.createElement('span');label.id='nexoFloatLabel';label.textContent='Hablar con NEXO';b.append(face,label);document.body.appendChild(b);
b.addEventListener('click',openAssistant);
window.NEXOFloating={open:openAssistant,version:'11.6'};
})();
