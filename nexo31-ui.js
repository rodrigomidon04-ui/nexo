/* NEXO 3.1.1 loader. Never touches nexo-salas. */
(function(){
  'use strict';
  if(window.__NEXO311_LOADED)return;
  window.__NEXO311_LOADED=true;
  const load=()=>{const s=document.createElement('script');s.src='./nexo311.js?v=3.1.1';s.async=false;document.head.appendChild(s)};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',load,{once:true});else load();
})();
