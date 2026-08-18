/* NEXO 3.1 UI activation layer. Does not touch nexo-salas. */
(function(){
  const $=id=>document.getElementById(id);
  const go=id=>document.getElementById(id)?.scrollIntoView({behavior:'smooth'});
  const toast=m=>{if(window.showToast)window.showToast(m);else if($('toast')){ $('toast').textContent=m; $('toast').classList.add('on'); setTimeout(()=>$('toast').classList.remove('on'),2200); }};
  function me(){try{return typeof user!=='undefined'?user:null}catch{return null}}
  function activateSideButtons(){
    document.querySelectorAll('.sidebtn').forEach(btn=>{
      const text=(btn.textContent||'').toLowerCase();
      if(text.includes('contactos')){btn.onclick=()=>go('contactos');}
      else if(text.includes('invitaciones')){btn.onclick=()=>go('invitaciones');}
      else if(text.includes('historial')){btn.onclick=()=>go('nexo31-historial'); loadHistory();}
    });
  }
  function ensureHistory(){
    if($('nexo31-historial'))return;
    const anchor=$('nexo31-social')||$('perfil')||document.querySelector('footer');
    if(!anchor)return;
    const sec=document.createElement('section');
    sec.id='nexo31-historial';
    sec.innerHTML=`<div class="container"><div class="section-head"><div><div class="tag">07 — Historial</div><h2>Tus llamadas<br>recientes.</h2></div><p class="muted">NEXO registra las entradas a videollamadas desde tu cuenta. La videollamada en sí continúa en NEXO Salas, que permanece sin modificaciones.</p></div><div class="card n31-card"><div class="n31-subhead"><strong>Actividad</strong><button class="btn" id="n31HistoryRefresh">↻ Actualizar</button></div><div id="n31HistoryList" class="n31-list"></div></div></div>`;
    anchor.parentNode.insertBefore(sec,anchor.nextSibling);
    $('n31HistoryRefresh').onclick=loadHistory;
  }
  function ensureStyle(){
    if($('nexo31-ui-style'))return;
    const s=document.createElement('style');s.id='nexo31-ui-style';s.textContent='.n31-history-meta{font-size:12px;color:var(--muted);margin-top:5px}.n31-history-empty{padding:14px 0;color:var(--muted);font-size:13px}';document.head.appendChild(s);
  }
  async function loadHistory(){
    const u=me(); const box=$('n31HistoryList'); if(!box)return;
    if(!u){box.innerHTML='<div class="n31-history-empty">Iniciá sesión para ver tu historial.</div>';return;}
    if(typeof sb==='undefined'){box.innerHTML='<div class="n31-history-empty">Supabase no está disponible.</div>';return;}
    const {data,error}=await sb.from('call_history').select('room_key,joined_at,duration_seconds,direction').eq('user_id',u.id).order('joined_at',{ascending:false}).limit(25);
    if(error){box.innerHTML='<div class="n31-history-empty">No se pudo cargar el historial.</div>';toast('✕ '+error.message);return;}
    if(!data?.length){box.innerHTML='<div class="n31-history-empty">Todavía no hay llamadas registradas.</div>';return;}
    box.innerHTML=data.map(row=>{const d=new Date(row.joined_at);const when=isNaN(d)?row.joined_at:d.toLocaleString('es-UY',{dateStyle:'short',timeStyle:'short'});const dur=row.duration_seconds?`${Math.round(row.duration_seconds/60)} min`:'Entrada registrada';return `<div class="n31-row"><div class="n31-main"><div class="n31-title">${row.room_key||'Sala NEXO'}</div><div class="n31-history-meta">${when} · ${dur}</div></div><span class="n31-status">${row.direction==='join'?'Entrada':'Actividad'}</span></div>`}).join('');
  }
  function install(){
    ensureHistory();ensureStyle();activateSideButtons();
    if(window.NEXO31)window.NEXO31.loadAll?.();
    const u=me(); if(u)loadHistory();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(install,400),{once:true});else setTimeout(install,400);
  if(typeof sb!=='undefined')sb.auth.onAuthStateChange((event)=>{if(event==='SIGNED_IN')setTimeout(()=>{activateSideButtons();loadHistory()},250);if(event==='SIGNED_OUT')setTimeout(()=>{activateSideButtons();loadHistory()},100)});
})();
