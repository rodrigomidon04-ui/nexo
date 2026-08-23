(function(){
'use strict';
if(window.__NEXOFloating)return; window.__NEXOFloating=true;
const css=`
#nexoFloatBtn{position:fixed;right:20px;bottom:20px;width:64px;height:64px;border:0;border-radius:50%;z-index:99999;cursor:pointer;background:rgba(255,255,255,.96);box-shadow:0 8px 28px rgba(0,0,0,.22);display:flex;align-items:center;justify-content:center;transition:.2s}
#nexoFloatBtn:hover{transform:scale(1.06)}#nexoFloatBtn:active{transform:scale(.96)}
#nexoFloatFace{width:48px;height:48px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:linear-gradient(145deg,#071b25,#0a3442);border:2px solid #18d5d0;box-shadow:0 0 14px rgba(24,213,208,.45);overflow:hidden}
#nexoFloatFace .eye{width:8px;height:15px;border-radius:8px;background:#20e0dc;box-shadow:0 0 8px #20e0dc;margin:0 5px}.nexoMouth{position:absolute;margin-top:25px;width:18px;height:5px;border-radius:0 0 12px 12px;border-bottom:2px solid #20e0dc}
#nexoFloatLabel{position:absolute;right:74px;white-space:nowrap;background:#111;color:#fff;padding:8px 11px;border-radius:10px;font:600 13px system-ui;opacity:0;pointer-events:none;transform:translateX(5px);transition:.2s}#nexoFloatBtn:hover #nexoFloatLabel{opacity:1;transform:none}
@media(max-width:600px){#nexoFloatBtn{right:16px;bottom:16px;width:58px;height:58px}#nexoFloatFace{width:44px;height:44px}#nexoFloatLabel{display:none}}
#nexoFloatBtn.listening{animation:nexoPulse 1.1s infinite}@keyframes nexoPulse{50%{box-shadow:0 0 0 10px rgba(24,213,208,.12),0 8px 28px rgba(0,0,0,.22)}}`;
const st=document.createElement('style');st.textContent=css;document.head.appendChild(st);
const b=document.createElement('button');b.id='nexoFloatBtn';b.type='button';b.setAttribute('aria-label','Abrir asistente NEXO');b.innerHTML='<span id="nexoFloatFace"><span class="eye"></span><span class="eye"></span><span class="nexoMouth"></span></span><span id="nexoFloatLabel">Hablar con NEXO</span>';
document.body.appendChild(b);
function openExisting(){
 const candidates=['#nexoAssistant','#nexo9Assistant','.nexo-assistant','#nexo9Panel','#nexo9Widget'];
 for(const s of candidates){const el=document.querySelector(s);if(el){el.style.display=el.style.display==='none'?'':'block';el.classList.toggle('open');return true}}
 const trigger=document.querySelector('#nexo9Open,[data-nexo-open],.nexo-open,.nexo-assistant-open');if(trigger){trigger.click();return true}return false;
}
b.addEventListener('click',function(){if(!openExisting()){if(window.NEXOAssistant&&typeof window.NEXOAssistant.open==='function')window.NEXOAssistant.open();else window.dispatchEvent(new CustomEvent('nexo:open'))}});
window.NEXOFloating={open:openExisting,version:'11.5'};
})();
