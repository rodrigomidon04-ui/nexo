/* NEXO 3.1 functional UI layer. Never touches nexo-salas. */
(function(){
  'use strict';
  const $=id=>document.getElementById(id);
  const sleep=ms=>new Promise(r=>setTimeout(r,ms));
  const esc=v=>String(v??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  const toast=m=>{if(window.showToast)window.showToast(m);else if($('toast')){$('toast').textContent=m;$('toast').classList.add('on');setTimeout(()=>$('toast').classList.remove('on'),2200)}};
  const getUser=()=>{try{return typeof user!=='undefined'?user:null}catch{return null}};
  const getSupabase=()=>{try{return typeof sb!=='undefined'?sb:null}catch{return null}};
  const go=id=>document.getElementById(id)?.scrollIntoView({behavior:'smooth'});
  const state={contacts:[],incoming:[],outgoing:[],rooms:[],invites:[],history:[]};

  function ensureHistory(){
    if($('nexo31-historial'))return;
    const anchor=$('nexo31-social')||$('perfil')||document.querySelector('footer');
    if(!anchor?.parentNode)return;
    const sec=document.createElement('section');
    sec.id='nexo31-historial';
    sec.innerHTML='<div class="container"><div class="section-head"><div><div class="tag">07 — Historial</div><h2>Tus llamadas<br>recientes.</h2></div><p class="muted">Registro de entradas generado por NEXO. La videollamada continúa en NEXO Salas, que permanece sin modificaciones.</p></div><div class="card n31-card"><div class="n31-subhead"><strong>Actividad</strong><button class="btn" id="n31HistoryRefresh">↻ Actualizar</button></div><div id="n31HistoryList" class="n31-list"></div></div></div>';
    anchor.parentNode.insertBefore(sec,anchor.nextSibling);
  }

  function ensureSocial(){
    if($('nexo31-social'))return;
    const anchor=$('perfil')||document.querySelector('footer');
    if(!anchor?.parentNode)return;
    const wrap=document.createElement('section');
    wrap.id='nexo31-social';
    wrap.innerHTML=`<div class="container"><div class="section-head"><div><div class="tag">06 — Tu red</div><h2>Contactos e<br>invitaciones.</h2></div><p class="muted">Conectá personas, administrá invitaciones y mantené tus salas reales sincronizadas con NEXO.</p></div><div class="n31-grid"><article class="card n31-card" id="contactos"><div class="tag">CONTACTOS</div><h3>Encontrá personas</h3><div class="n31-search"><input id="n31ContactSearch" class="input" placeholder="Buscar por @usuario…"><button class="btn primary" id="n31ContactSearchBtn">Buscar</button></div><div id="n31SearchResults" class="n31-list"></div><div class="n31-divider"></div><div class="n31-subhead"><strong>Mis contactos</strong><button class="btn" id="n31RefreshContacts">↻ Actualizar</button></div><div id="n31ContactsList" class="n31-list"></div></article><article class="card n31-card" id="invitaciones"><div class="tag">INVITACIONES</div><h3>Entrá y compartí salas</h3><div id="n31InvitationsList" class="n31-list"></div><div class="n31-divider"></div><div class="n31-subhead"><strong>Nueva invitación</strong></div><select id="n31InviteContact" class="input"><option value="">Elegí un contacto…</option></select><div class="n31-actions"><button class="btn primary" id="n31SendInvite">Invitar a mi sala</button><button class="btn" id="n31RefreshInvites">↻ Actualizar</button></div><div class="n31-note">Las invitaciones se guardan en Supabase. Los invitados pueden entrar sin cuenta.</div></article></div><div class="n31-divider"></div><article class="card n31-card" id="n31MyRooms"><div class="section-head n31-small-head"><div><div class="tag">SALAS REALES</div><h3>Mis salas</h3></div><button class="btn primary" id="n31CreateRoom">＋ Crear sala</button></div><div id="n31RoomsList" class="n31-rooms"></div></article></div>`;
    anchor.parentNode.insertBefore(wrap,anchor);
  }

  function ensureCss(){
    if($('nexo31-functional-style'))return;
    const s=document.createElement('style');s.id='nexo31-functional-style';s.textContent=`.n31-grid{display:grid;grid-template-columns:1fr 1fr;gap:18px}.n31-card{padding:24px}.n31-card h3{font-size:28px;margin:10px 0 16px}.n31-search{display:flex;gap:8px}.n31-list{display:grid;gap:10px;margin-top:14px}.n31-row{display:flex;justify-content:space-between;align-items:center;gap:12px;padding:13px;border:1px solid rgba(255,255,255,.08);border-radius:14px;background:rgba(255,255,255,.025)}.n31-main{min-width:0}.n31-title{font-weight:800}.n31-sub{font-size:12px;color:var(--muted);margin-top:4px}.n31-actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:12px}.n31-divider{height:1px;background:rgba(255,255,255,.08);margin:22px 0}.n31-subhead{display:flex;justify-content:space-between;align-items:center;gap:10px;margin-bottom:9px}.n31-note,.n31-empty{margin-top:12px;color:var(--muted);font-size:12px;line-height:1.6}.n31-status{font-size:11px;padding:5px 8px;border-radius:999px;background:rgba(77,216,255,.08);color:var(--cyan);white-space:nowrap}.n31-rooms{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}.n31-room{padding:18px;border:1px solid rgba(255,255,255,.08);border-radius:16px;background:rgba(255,255,255,.025)}.n31-room-key{font:700 15px ui-monospace,SFMono-Regular,Menlo,monospace;color:var(--cyan);margin:8px 0;word-break:break-all}.n31-small-head{margin-bottom:18px!important;align-items:center!important}.n31-history-meta{font-size:12px;color:var(--muted);margin-top:5px}@media(max-width:900px){.n31-grid{grid-template-columns:1fr}.n31-rooms{grid-template-columns:1fr 1fr}}@media(max-width:600px){.n31-search{flex-direction:column}.n31-rooms{grid-template-columns:1fr}.n31-row{align-items:flex-start;flex-direction:column}}`;
    document.head.appendChild(s);
  }

  function nameOf(p){return p?.display_name||p?.username||'Usuario NEXO'}
  function handleOf(p){return p?.username?('@'+p.username):''}

  async function loadContacts(){
    const u=getUser(),db=getSupabase(); if(!u||!db)return;
    const r=await db.from('contacts').select('id,user_id,contact_user_id,status,created_at').or(`user_id.eq.${u.id},contact_user_id.eq.${u.id}`).order('created_at',{ascending:false});
    if(r.error){toast('✕ Contactos: '+r.error.message);return}
    const rows=r.data||[];const ids=[...new Set(rows.flatMap(x=>[x.user_id,x.contact_user_id]).filter(x=>x!==u.id))];
    let profiles=[]; if(ids.length){const q=await db.from('profiles').select('id,username,display_name,avatar_url,bio').in('id',ids);if(q.error){toast('✕ Perfiles: '+q.error.message);return}profiles=q.data||[]}
    const map=new Map(profiles.map(x=>[x.id,x]));
    state.contacts=rows.filter(x=>x.status==='accepted').map(x=>({...x,profile:map.get(x.user_id===u.id?x.contact_user_id:x.user_id)}));
    state.incoming=rows.filter(x=>x.status==='pending'&&x.contact_user_id===u.id).map(x=>({...x,profile:map.get(x.user_id)}));
    state.outgoing=rows.filter(x=>x.status==='pending'&&x.user_id===u.id).map(x=>({...x,profile:map.get(x.contact_user_id)}));
    renderContacts();fillInviteContacts();
  }

  function renderContacts(){
    const box=$('n31ContactsList');if(!box)return;const blocks=[];
    for(const x of state.incoming)blocks.push(`<div class="n31-row"><div class="n31-main"><div class="n31-title">${esc(nameOf(x.profile))}</div><div class="n31-sub">${esc(handleOf(x.profile))} · solicitud recibida</div></div><div class="n31-actions"><button class="btn primary" data-nexo-accept="${x.id}">Aceptar</button><button class="btn" data-nexo-reject="${x.id}">Rechazar</button></div></div>`);
    for(const x of state.outgoing)blocks.push(`<div class="n31-row"><div class="n31-main"><div class="n31-title">${esc(nameOf(x.profile))}</div><div class="n31-sub">${esc(handleOf(x.profile))}</div></div><span class="n31-status">Pendiente</span></div>`);
    for(const x of state.contacts)blocks.push(`<div class="n31-row"><div class="n31-main"><div class="n31-title">${esc(nameOf(x.profile))}</div><div class="n31-sub">${esc(handleOf(x.profile))}</div></div><button class="btn" data-nexo-invite-contact="${x.profile?.id||''}">Invitar</button></div>`);
    box.innerHTML=blocks.join('')||'<div class="n31-empty">Todavía no tenés contactos.</div>';
    box.querySelectorAll('[data-nexo-accept]').forEach(b=>b.onclick=()=>acceptContact(b.dataset.nexoAccept));
    box.querySelectorAll('[data-nexo-reject]').forEach(b=>b.onclick=()=>rejectContact(b.dataset.nexoReject));
    box.querySelectorAll('[data-nexo-invite-contact]').forEach(b=>b.onclick=()=>{fillInviteContacts().then(()=>{if($('n31InviteContact'))$('n31InviteContact').value=b.dataset.nexoInviteContact;go('invitaciones')})});
  }

  function fillInviteContacts(){
    const s=$('n31InviteContact');if(!s)return Promise.resolve();
    s.innerHTML='<option value="">Elegí un contacto…</option>'+state.contacts.filter(x=>x.profile?.id).map(x=>`<option value="${x.profile.id}">${esc(nameOf(x.profile))} ${esc(handleOf(x.profile))}</option>`).join('');
    return Promise.resolve();
  }

  async function searchPeople(){
    const u=getUser(),db=getSupabase();const q=$('n31ContactSearch')?.value.trim().replace(/^@/,'');const out=$('n31SearchResults');
    if(!u){toast('✓ Ingresá para buscar personas');return}
    if(!q){if(out)out.innerHTML='<div class="n31-empty">Escribí un nombre o @usuario.</div>';return}
    if(!db)return;
    const r=await db.from('profiles').select('id,username,display_name,bio').neq('id',u.id).or(`username.ilike.%${q}%,display_name.ilike.%${q}%`).limit(20);
    if(r.error){toast('✕ Buscar: '+r.error.message);return}
    const rows=r.data||[];if(!out)return;out.innerHTML=rows.length?rows.map(p=>`<div class="n31-row"><div class="n31-main"><div class="n31-title">${esc(nameOf(p))}</div><div class="n31-sub">${esc(handleOf(p))}${p.bio?' · '+esc(p.bio):''}</div></div><button class="btn primary" data-nexo-add="${p.id}">Agregar</button></div>`).join(''):'<div class="n31-empty">No encontramos personas.</div>';
    out.querySelectorAll('[data-nexo-add]').forEach(b=>b.onclick=()=>sendContact(b.dataset.nexoAdd));
  }

  async function sendContact(id){
    const u=getUser(),db=getSupabase();if(!u||!db)return;
    if(id===u.id)return;
    const r=await db.from('contacts').insert({user_id:u.id,contact_user_id:id,status:'pending'});
    if(r.error){toast(r.error.code==='23505'?'✕ Ya existe una solicitud':'✕ '+r.error.message);return}
    toast('✓ Solicitud enviada');await loadContacts();
  }
  async function acceptContact(id){const u=getUser(),db=getSupabase();if(!u||!db)return;const r=await db.from('contacts').update({status:'accepted'}).eq('id',id).eq('contact_user_id',u.id);if(r.error){toast('✕ '+r.error.message);return}toast('✓ Contacto aceptado');await loadContacts()}
  async function rejectContact(id){const u=getUser(),db=getSupabase();if(!u||!db)return;const r=await db.from('contacts').delete().eq('id',id).eq('contact_user_id',u.id);if(r.error){toast('✕ '+r.error.message);return}toast('✓ Solicitud rechazada');await loadContacts()}

  async function loadRooms(){
    const u=getUser(),db=getSupabase();const box=$('n31RoomsList');if(!u||!db||!box)return;
    const r=await db.from('rooms').select('id,owner_id,room_key,name,is_personal,created_at').eq('owner_id',u.id).order('created_at',{ascending:false});
    if(r.error){toast('✕ Salas: '+r.error.message);return}state.rooms=r.data||[];
    box.innerHTML=state.rooms.length?state.rooms.map(x=>`<div class="n31-room"><div class="tag">${x.is_personal?'PERSONAL':'SALA'}</div><h4 style="margin:8px 0">${esc(x.name)}</h4><div class="n31-room-key">${esc(x.room_key)}</div><div class="n31-actions"><button class="btn primary" data-nexo-room-enter="${esc(x.room_key)}">Entrar</button><button class="btn" data-nexo-room-copy="${esc(x.room_key)}">Copiar</button></div></div>`).join(''):'<div class="n31-empty">No hay salas todavía.</div>';
    box.querySelectorAll('[data-nexo-room-enter]').forEach(b=>b.onclick=()=>{if(window.enterVideo)window.enterVideo(b.dataset.nexoRoomEnter);else toast('Abrí la sección Salas para entrar.')});
    box.querySelectorAll('[data-nexo-room-copy]').forEach(b=>b.onclick=()=>navigator.clipboard?.writeText(b.dataset.nexoRoomCopy).then(()=>toast('✓ Clave copiada')));
  }

  async function createRoom(){
    const u=getUser(),db=getSupabase();if(!u){if(window.openAuth)window.openAuth('register');else toast('✓ Registrate para crear una sala');return}
    if(!db)return;const base=(u.name||u.email?.split('@')[0]||'usuario').toLowerCase().replace(/[^a-z0-9]+/g,'-').slice(0,18)||'usuario';
    const key=`nexo-${base}-${Math.random().toString(36).slice(2,7).toUpperCase()}`;const r=await db.from('rooms').insert({owner_id:u.id,room_key:key,name:'Nueva sala NEXO',is_personal:false}).select().single();
    if(r.error){toast('✕ Crear sala: '+r.error.message);return}
    if(window.setCurrentRoom)window.setCurrentRoom(key);else localStorage.setItem('nexoRoom',key);toast('✓ Nueva sala creada');await loadRooms();
  }

  async function loadInvites(){
    const u=getUser(),db=getSupabase(),box=$('n31InvitationsList');if(!u||!db||!box)return;
    const r=await db.from('invitations').select('id,room_id,inviter_id,invitee_user_id,token,status,expires_at,created_at').or(`inviter_id.eq.${u.id},invitee_user_id.eq.${u.id}`).order('created_at',{ascending:false}).limit(50);
    if(r.error){toast('✕ Invitaciones: '+r.error.message);return}
    const rows=r.data||[];state.invites=rows;const ids=[...new Set(rows.flatMap(x=>[x.inviter_id,x.invitee_user_id]).filter(x=>x&&x!==u.id))];let profiles=[];if(ids.length){const p=await db.from('profiles').select('id,username,display_name').in('id',ids);profiles=p.data||[]};const pm=new Map(profiles.map(x=>[x.id,x]));const roomIds=[...new Set(rows.map(x=>x.room_id).filter(Boolean))];let rooms=[];if(roomIds.length){const q=await db.from('rooms').select('id,room_key,name').in('id',roomIds);rooms=q.data||[]};const rm=new Map(rooms.map(x=>[x.id,x]));
    const html=rows.map(x=>{const incoming=x.invitee_user_id===u.id;const other=pm.get(incoming?x.inviter_id:x.invitee_user_id);const rr=rm.get(x.room_id);if(x.status!=='pending')return `<div class="n31-row"><div class="n31-main"><div class="n31-title">${esc(rr?.name||'Sala NEXO')}</div><div class="n31-sub">${incoming?'De '+esc(nameOf(other)):'Para '+esc(nameOf(other))} · ${esc(x.status)}</div></div><span class="n31-status">${esc(x.status)}</span></div>`;return incoming?`<div class="n31-row"><div class="n31-main"><div class="n31-title">${esc(nameOf(other))} te invitó</div><div class="n31-sub">${esc(rr?.name||'Sala NEXO')} · ${esc(rr?.room_key||'')}</div></div><div class="n31-actions"><button class="btn primary" data-nexo-invite-accept="${x.id}" data-room-key="${esc(rr?.room_key||'')}">Aceptar</button><button class="btn" data-nexo-invite-reject="${x.id}">Rechazar</button></div></div>`:`<div class="n31-row"><div class="n31-main"><div class="n31-title">Invitación enviada</div><div class="n31-sub">Para ${esc(nameOf(other))} · ${esc(rr?.name||'Sala NEXO')}</div></div><span class="n31-status">Pendiente</span></div>`}).join('');box.innerHTML=html||'<div class="n31-empty">No tenés invitaciones pendientes.</div>';
    box.querySelectorAll('[data-nexo-invite-accept]').forEach(b=>b.onclick=()=>updateInvite(b.dataset.nexoInviteAccept,'accepted',b.dataset.roomKey));
    box.querySelectorAll('[data-nexo-invite-reject]').forEach(b=>b.onclick=()=>updateInvite(b.dataset.nexoInviteReject,'revoked',''));
  }

  async function sendInvite(){
    const u=getUser(),db=getSupabase();if(!u||!db){toast('✓ Ingresá para invitar');return}
    const contact=$('n31InviteContact')?.value;if(!contact){toast('✕ Elegí un contacto');return}
    const room=state.rooms.find(x=>x.is_personal)||state.rooms[0];if(!room){toast('✕ No tenés una sala propia');return}
    const r=await db.from('invitations').insert({room_id:room.id,inviter_id:u.id,invitee_user_id:contact,status:'pending'});
    if(r.error){toast(r.error.code==='23505'?'✕ Ya existe una invitación':'✕ '+r.error.message);return}
    toast('✓ Invitación enviada');await loadInvites();
  }
  async function updateInvite(id,status,key){
    const u=getUser(),db=getSupabase();if(!u||!db)return;const r=await db.from('invitations').update({status}).eq('id',id).eq('invitee_user_id',u.id);if(r.error){toast('✕ '+r.error.message);return}toast(status==='accepted'?'✓ Invitación aceptada':'✓ Invitación rechazada');if(status==='accepted'&&key){if(window.setCurrentRoom)window.setCurrentRoom(key);else localStorage.setItem('nexoRoom',key)}await loadInvites();
  }

  async function loadHistory(){
    const u=getUser(),db=getSupabase(),box=$('n31HistoryList');if(!box)return;if(!u){box.innerHTML='<div class="n31-empty">Iniciá sesión para ver tu historial.</div>';return}if(!db){box.innerHTML='<div class="n31-empty">Supabase no está disponible.</div>';return}
    const r=await db.from('call_history').select('room_key,joined_at,duration_seconds,direction').eq('user_id',u.id).order('joined_at',{ascending:false}).limit(30);if(r.error){box.innerHTML='<div class="n31-empty">No se pudo cargar el historial.</div>';toast('✕ '+r.error.message);return}
    box.innerHTML=(r.data||[]).map(x=>`<div class="n31-row"><div class="n31-main"><div class="n31-title">${esc(x.room_key||'Sala NEXO')}</div><div class="n31-history-meta">${new Date(x.joined_at).toLocaleString('es-UY')} · ${x.duration_seconds?Math.round(x.duration_seconds/60)+' min':'Entrada registrada'}</div></div><span class="n31-status">${x.direction==='join'?'Entrada':'Actividad'}</span></div>`).join('')||'<div class="n31-empty">Todavía no hay llamadas registradas.</div>';
  }

  async function loadAll(){
    if(!getUser())return;
    await Promise.all([loadContacts(),loadRooms(),loadInvites(),loadHistory()]);
  }

  function bind(){
    const searchBtn=$('n31ContactSearchBtn');if(searchBtn)searchBtn.onclick=searchPeople;
    const searchInput=$('n31ContactSearch');if(searchInput)searchInput.onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();searchPeople()}};
    $('n31RefreshContacts')?.addEventListener('click',loadContacts);
    $('n31SendInvite')?.addEventListener('click',sendInvite);
    $('n31RefreshInvites')?.addEventListener('click',loadInvites);
    $('n31CreateRoom')?.addEventListener('click',createRoom);
    $('n31HistoryRefresh')?.addEventListener('click',loadHistory);
    document.querySelectorAll('.sidebtn').forEach(b=>{const t=b.textContent.toLowerCase();if(t.includes('contactos'))b.onclick=()=>go('contactos');else if(t.includes('invitaciones'))b.onclick=()=>go('invitaciones');else if(t.includes('historial'))b.onclick=()=>go('nexo31-historial')});
  }

  async function init(){ensureSocial();ensureHistory();ensureCss();bind();await sleep(250);bind();await loadAll();loadHistory();}
  function ready(){if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init()}
  ready();
  setTimeout(bind,700);
  const db=getSupabase();if(db)db.auth.onAuthStateChange(()=>setTimeout(()=>{bind();loadAll();loadHistory()},350));
  window.NEXO31={loadAll,loadContacts,loadRooms,loadInvitations:loadInvites,createRoom,loadHistory};
})();