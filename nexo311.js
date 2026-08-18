/* NEXO 3.1.1 enhancements. NEVER touches nexo-salas. */
(function(){
  'use strict';
  const $=id=>document.getElementById(id);
  const esc=v=>String(v??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  const toast=m=>{if(typeof window.showToast==='function')window.showToast(m);else if($('toast')){$('toast').textContent=m;$('toast').classList.add('on');setTimeout(()=>$('toast').classList.remove('on'),2200)}};
  const db=()=>{try{return typeof sb!=='undefined'?sb:null}catch{return null}};
  const go=id=>document.getElementById(id)?.scrollIntoView({behavior:'smooth'});
  const validUuid=v=>typeof v==='string'&&/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(v);
  async function authUser(){const d=db();if(!d)return null;const r=await d.auth.getUser();const u=r?.data?.user;return validUuid(u?.id)?u:null}

  function ensureStyles(){
    if($('nexo311-style'))return;
    const s=document.createElement('style');s.id='nexo311-style';s.textContent=`
      .n311-bell{position:relative;min-width:42px;padding:10px 12px}.n311-count{position:absolute;top:-4px;right:-2px;background:#4dd8ff;color:#001017;border-radius:999px;font-size:10px;min-width:18px;height:18px;display:grid;place-items:center;font-weight:900}.n311-panel{position:fixed;top:68px;right:24px;width:min(390px,calc(100vw - 32px));max-height:70vh;overflow:auto;background:#0c1117;border:1px solid rgba(255,255,255,.10);border-radius:18px;box-shadow:0 25px 80px rgba(0,0,0,.5);padding:16px;z-index:120}.n311-item{padding:12px;border-bottom:1px solid rgba(255,255,255,.07)}.n311-item:last-child{border-bottom:0}.n311-item.unread{background:rgba(77,216,255,.05);border-radius:12px}.n311-muted{font-size:12px;color:#93a0ad;margin-top:4px}.n311-room-tools{display:flex;gap:8px;flex-wrap:wrap;margin-top:10px}.n311-fav{border:1px solid rgba(255,255,255,.10);background:rgba(255,255,255,.04);color:#f5f7fa;border-radius:999px;padding:9px 12px}.n311-fav.on{border-color:#4dd8ff;color:#4dd8ff}.n311-section{margin-top:12px}.n311-history-tools{display:flex;gap:8px}.n311-profile-actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:12px}
    `;document.head.appendChild(s);
  }

  function ensureBell(){
    const nav=document.querySelector('.nav-inner');if(!nav||$('nexo311Bell'))return;
    const b=document.createElement('button');b.id='nexo311Bell';b.className='btn ghost n311-bell';b.innerHTML='🔔<span class="n311-count hidden" id="nexo311Count">0</span>';b.title='Notificaciones';
    const panel=document.createElement('div');panel.id='nexo311Panel';panel.className='n311-panel hidden';panel.innerHTML='<div class="section-head" style="margin-bottom:12px"><div><div class="tag">NEXO</div><h3 style="margin:6px 0 0">Notificaciones</h3></div><button class="btn" id="nexo311MarkAll">Marcar todo</button></div><div id="nexo311List"></div>';
    nav.insertBefore(b,nav.querySelector('#authBtn'));document.body.appendChild(panel);
    b.onclick=()=>panel.classList.toggle('hidden');
    $('nexo311MarkAll').onclick=markAllRead;
    document.addEventListener('click',e=>{if(!panel.contains(e.target)&&e.target!==b)panel.classList.add('hidden')});
  }

  async function loadNotifications(){
    const d=db(),u=await authUser();const list=$('nexo311List'),count=$('nexo311Count');if(!d||!u||!list||!count)return;
    const r=await d.from('notifications').select('id,type,title,body,read_at,created_at').eq('user_id',u.id).order('created_at',{ascending:false}).limit(30);
    if(r.error){toast('✕ Notificaciones: '+r.error.message);return}
    const rows=r.data||[];const unread=rows.filter(x=>!x.read_at).length;
    count.textContent=String(unread);count.classList.toggle('hidden',unread===0);
    list.innerHTML=rows.length?rows.map(x=>`<div class="n311-item ${x.read_at?'':'unread'}" data-notification="${esc(x.id)}"><strong>${esc(x.title)}</strong><div class="n311-muted">${esc(x.body||'')}</div><div class="n311-muted">${esc(new Date(x.created_at).toLocaleString('es-UY'))}</div></div>`).join(''):'<div class="n311-muted">No tenés notificaciones.</div>';
    list.querySelectorAll('[data-notification]').forEach(el=>el.onclick=async()=>{await readOne(el.dataset.notification);loadNotifications()});
  }
  async function readOne(id){const d=db(),u=await authUser();if(!d||!u||!validUuid(id))return;await d.from('notifications').update({read_at:new Date().toISOString()}).eq('id',id).eq('user_id',u.id)}
  async function markAllRead(){const d=db(),u=await authUser();if(!d||!u)return;await d.from('notifications').update({read_at:new Date().toISOString()}).eq('user_id',u.id).is('read_at',null);loadNotifications()}

  async function loadFavorites(){
    const d=db(),u=await authUser();if(!d||!u)return new Set();
    const r=await d.from('favorites').select('room_id').eq('user_id',u.id);if(r.error){toast('✕ Favoritos: '+r.error.message);return new Set()};return new Set((r.data||[]).map(x=>x.room_id));
  }
  async function toggleFavorite(roomId,button){
    const d=db(),u=await authUser();if(!d||!u||!validUuid(roomId))return;
    const favs=await loadFavorites();
    if(favs.has(roomId)){const r=await d.from('favorites').delete().eq('user_id',u.id).eq('room_id',roomId);if(r.error){toast('✕ '+r.error.message);return}button.classList.remove('on');button.textContent='☆ Favorito';toast('✓ Quitado de favoritos')}
    else{const r=await d.from('favorites').insert({user_id:u.id,room_id:roomId});if(r.error){toast('✕ '+r.error.message);return}button.classList.add('on');button.textContent='★ Favorito';toast('✓ Agregado a favoritos')}
  }

  async function decorateRooms(){
    const box=$('n31RoomsList');if(!box)return;const d=db(),u=await authUser();if(!d||!u)return;
    const favs=await loadFavorites();
    box.querySelectorAll('[data-nexo-room-enter]').forEach(btn=>{
      const roomCard=btn.closest('.n31-room');if(!roomCard||roomCard.querySelector('.n311-fav'))return;
      const roomKey=btn.dataset.nexoRoomEnter;const roomName=roomCard.querySelector('h4')?.textContent||'';
      let roomId=null;
      const rooms=window.NEXO311_ROOMS||[];const found=rooms.find(x=>x.room_key===roomKey);if(found)roomId=found.id;
      if(!roomId)return;
      const f=document.createElement('button');f.className='n311-fav '+(favs.has(roomId)?'on':'');f.textContent=favs.has(roomId)?'★ Favorito':'☆ Favorito';f.onclick=()=>toggleFavorite(roomId,f);
      const tools=roomCard.querySelector('.n31-actions');tools?.appendChild(f);
    });
  }

  async function renderHistoryTools(){
    const box=$('n31HistoryList');if(!box||$('nexo311HistoryTools'))return;
    const holder=box.parentElement;const tools=document.createElement('div');tools.id='nexo311HistoryTools';tools.className='n311-history-tools';tools.style.marginBottom='12px';tools.innerHTML='<button class="btn" id="nexo311HistoryClear">Limpiar vista</button><span class="n311-muted">El historial real permanece en Supabase.</span>';holder.insertBefore(tools,box);
    $('nexo311HistoryClear').onclick=()=>{box.innerHTML='<div class="n311-muted">Vista limpiada. Recargá para volver a verla.</div>'};
  }

  function wireExistingButtons(){
    $('n31ContactSearchBtn')?.addEventListener('click',()=>window.NEXO31?.searchPeople?.());
    $('n31ContactSearch')?.addEventListener('keydown',e=>{if(e.key==='Enter')window.NEXO31?.searchPeople?.()});
    $('n31RefreshContacts')?.addEventListener('click',()=>window.NEXO31?.loadContacts?.());
    $('n31RefreshInvites')?.addEventListener('click',()=>window.NEXO31?.loadInvitations?.());
    $('n31SendInvite')?.addEventListener('click',()=>window.NEXO31?.sendInvite?.());
    $('n31CreateRoom')?.addEventListener('click',()=>window.NEXO31?.createRoom?.());
  }

  async function boot(){
    ensureStyles();ensureBell();wireExistingButtons();
    const u=await authUser();if(!u){return}
    await loadNotifications();
    await renderHistoryTools();
    const d=db();if(d){d.auth.onAuthStateChange(()=>setTimeout(()=>{loadNotifications();renderHistoryTools();},250))}
    const observer=new MutationObserver(()=>{decorateRooms();});
    const target=$('n31RoomsList');if(target)observer.observe(target,{childList:true,subtree:true});
    decorateRooms();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(boot,700),{once:true});else setTimeout(boot,700);
})();
