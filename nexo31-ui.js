/* NEXO 3.1 UI activation. No toca nexo-salas ni consulta Supabase directamente. */
(function(){
  function go(id){document.getElementById(id)?.scrollIntoView({behavior:'smooth'});}
  function bind(){
    document.querySelectorAll('.sidebtn').forEach(btn=>{
      const t=(btn.textContent||'').toLowerCase();
      if(t.includes('contactos'))btn.onclick=()=>go('contactos');
      else if(t.includes('invitaciones'))btn.onclick=()=>go('invitaciones');
      else if(t.includes('historial'))btn.onclick=()=>go('nexo31-historial');
    });
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bind,{once:true});else bind();
})();
