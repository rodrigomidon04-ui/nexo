/* NEXO — cara original sincronizada con el robot principal */
(function(){
  'use strict';
  function apply(){
    const fab=document.getElementById('nexo9Fab');
    const orb=document.getElementById('nexo9Orb');
    if(fab){fab.innerHTML='<svg class="nexo9-face" viewBox="0 0 100 100" aria-hidden="true"><rect x="8" y="14" width="84" height="72" rx="22" fill="#0e1620" stroke="#4dd8ff" stroke-width="4"/><ellipse cx="35" cy="45" rx="7" ry="12" fill="#4dd8ff"><animate attributeName="ry" values="12;1;12" dur="4.2s" repeatCount="indefinite" keyTimes="0;.5;1"/></ellipse><ellipse cx="65" cy="45" rx="7" ry="12" fill="#4dd8ff"><animate attributeName="ry" values="12;1;12" dur="4.2s" repeatCount="indefinite" keyTimes="0;.5;1" begin=".15s"/></ellipse><path d="M33 65 Q50 80 67 65" fill="none" stroke="#4dd8ff" stroke-width="5" stroke-linecap="round"/></svg>'}
    if(orb){orb.outerHTML='<svg id="nexo9Orb" class="nexo9-orb-face" viewBox="0 0 100 100" aria-hidden="true"><rect x="8" y="14" width="84" height="72" rx="22" fill="#0e1620" stroke="#4dd8ff" stroke-width="4"/><ellipse cx="35" cy="45" rx="7" ry="12" fill="#4dd8ff"><animate attributeName="ry" values="12;1;12" dur="4.2s" repeatCount="indefinite" keyTimes="0;.5;1"/></ellipse><ellipse cx="65" cy="45" rx="7" ry="12" fill="#4dd8ff"><animate attributeName="ry" values="12;1;12" dur="4.2s" repeatCount="indefinite" keyTimes="0;.5;1" begin=".15s"/></ellipse><path d="M33 65 Q50 80 67 65" fill="none" stroke="#4dd8ff" stroke-width="5" stroke-linecap="round"/></svg>'}
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply,{once:true});else apply();
  setTimeout(apply,300);
})();
