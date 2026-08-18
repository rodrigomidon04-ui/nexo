/* NEXO 3.1 — social layer and real rooms
   This file only touches the NEXO repository. It NEVER imports or modifies nexo-salas. */
(function(){
  const $ = (id)=>document.getElementById(id);
  const escapeHtml = (value)=>String(value??'').replace(/[&<>'"]/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  const wait = (ms)=>new Promise(r=>setTimeout(r,ms));

  function toast(message){
    if(typeof window.showToast==='function') window.showToast(message);
    else if(typeof window.showToast==='undefined' && $('toast')){
      $('toast').textContent=message;
      $('toast').classList.add('on');
      setTimeout(()=>$('toast').classList.remove('on'),2200);
    }
  }

  function go(id){
    if(typeof window.scrollToId==='function') return window.scrollToId(id);
    document.getElementById(id)?.scrollIntoView({behavior:'smooth'});
  }

  function currentUser(){
    try{return typeof user!=='undefined'?user:null}catch{return null}
  }

  const state={
    contacts:[],
    incoming:[],
    outgoing:[],
    rooms:[],
    invitations:[],
    selectedInviteContact:null,
    initialized:false
  };

  function addNavLinks(){
    const nav=document.querySelector('.navlinks');
    if(!nav || nav.dataset.nexo31==='1') return;
    nav.dataset.nexo31='1';
    const make=(href,label)=>{const a=document.createElement('a');a.href=href;a.textContent=label;return a;};
    nav.appendChild(make('#contactos','Contactos'));
    nav.appendChild(make('#invitaciones','Invitaciones'));
  }

  function ensureSections(){
    if(document.getElementById('nexo31-social')) return;
    const anchor=document.getElementById('perfil') || document.querySelector('footer');
    const wrap=document.createElement('section');
    wrap.id='nexo31-social';
    wrap.innerHTML=`
      <div class="container">
        <div class="section-head">
          <div><div class="tag">06 — Tu red</div><h2>Contactos e<br>invitaciones.</h2></div>
          <p class="muted">Conectá personas, administrá invitaciones y mantené tus salas reales sincronizadas con NEXO.</p>
        </div>
        <div class="n31-grid">
          <article class="card n31-card" id="contactos">
            <div class="tag">CONTACTOS</div>
            <h3>Encontrá personas</h3>
            <div class="n31-search"><input id="n31ContactSearch" class="input" placeholder="Buscar por @usuario…"><button class="btn primary" id="n31ContactSearchBtn">Buscar</button></div>
            <div id="n31SearchResults" class="n31-list"></div>
            <div class="n31-divider"></div>
            <div class="n31-subhead"><strong>Mis contactos</strong><button class="btn" id="n31RefreshContacts">↻ Actualizar</button></div>
            <div id="n31ContactsList" class="n31-list"></div>
          </article>
          <article class="card n31-card" id="invitaciones">
            <div class="tag">INVITACIONES</div>
            <h3>Entrá y compartí salas</h3>
            <div id="n31InvitationsList" class="n31-list"></div>
            <div class="n31-divider"></div>
            <div class="n31-subhead"><strong>Nueva invitación</strong></div>
            <select id="n31InviteContact" class="input"><option value="">Elegí un contacto…</option></select>
            <div class="n31-actions"><button class="btn primary" id="n31SendInvite">Invitar a mi sala</button><button class="btn" id="n31RefreshInvites">↻ Actualizar</button></div>
            <div class="n31-note">Las invitaciones de esta versión se guardan en Supabase. El acceso de invitados a una sala sigue funcionando sin cuenta.</div>
          </article>
        </div>
        <div class="n31-divider"></div>
        <article class="card n31-card" id="n31MyRooms">
          <div class="section-head n31-small-head"><div><div class="tag">SALAS REALES</div><h3>Mis salas</h3></div><button class="btn primary" id="n31CreateRoom">＋ Crear sala</button></div>
          <div id="n31RoomsList" class="n31-rooms"></div>
        </article>
      </div>`;
    anchor?.parentNode?.insertBefore(wrap,anchor);
  }

  function ensureStyles(){
    if(document.getElementById('nexo31-style')) return;
    const s=document.createElement('style');
    s.id='nexo31-style';
    s.textContent=`
      .n31-grid{display:grid;grid-template-columns:1fr 1fr;gap:18px}
      .n31-card{padding:24px}
      .n31-card h3{font-size:28px;margin:10px 0 16px}
      .n31-search{display:flex;gap:8px}
      .n31-list{display:grid;gap:10px;margin-top:14px}
      .n31-row{display:flex;justify-content:space-between;align-items:center;gap:12px;padding:13px;border:1px solid rgba(255,255,255,.08);border-radius:14px;background:rgba(255,255,255,.025)}
      .n31-main{min-width:0}.n31-title{font-weight:800}.n31-sub{font-size:12px;color:var(--muted);margin-top:4px;overflow:hidden;text-overflow:ellipsis}
      .n31-actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:12px}
      .n31-divider{height:1px;background:rgba(255,255,255,.08);margin:22px 0}
      .n31-subhead{display:flex;justify-content:space-between;align-items:center;gap:10px;margin-bottom:9px}
      .n31-note{margin-top:14px;color:var(--muted);font-size:12px;line-height:1.6}
      .n31-status{font-size:11px;padding:5px 8px;border-radius:999px;background:rgba(77,216,255,.08);color:var(--cyan);white-space:nowrap}
      .n31-rooms{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}
      .n31-room{padding:18px;border:1px solid rgba(255,255,255,.08);border-radius:16px;background:rgba(255,255,255,.025)}
      .n31-room-key{font:700 15px ui-monospace,SFMono-Regular,Menlo,monospace;color:var(--cyan);margin:8px 0;word-break:break-all}
      .n31-small-head{margin-bottom:18px!important;align-items:center!important}
      @media(max-width:900px){.n31-grid{grid-template-columns:1fr}.n31-rooms{grid-template-columns:1fr 1fr}}
      @media(max-width:600px){.n31-search{flex-direction:column}.n31-rooms{grid-template-columns:1fr}.n31-row{align-items:flex-start;flex-direction:column}}
    `;
    document.head.appendChild(s);
  }

  async function loadContacts(){
    const me=currentUser();
    if(!me) return;
    const {data,error}=await sb.from('contacts').select('id,user_id,contact_user_id,status,created_at').or(`user_id.eq.${me.id},contact_user_id.eq.${me.id}`).order('created_at',{ascending:false});
    if(error){toast('✕ '+error.message);return}
    const rows=data||[];
    const ids=[...new Set(rows.flatMap(r=>[r.user_id,r.contact_user_id]).filter(id=>id!==me.id))];
    let profiles=[];
    if(ids.length){const p=await sb.from('profiles').select('id,username,display_name,avatar_url,bio').in('id',ids);profiles=p.data||[]}
    const map=new Map(profiles.map(p=>[p.id,p]));
    state.contacts=rows.filter(r=>r.status==='accepted').map(r=>({...r,profile:map.get(r.user_id===me.id?r.contact_user_id:r.user_id)}));
    state.incoming=rows.filter(r=>r.status==='pending' && r.contact_user_id===me.id).map(r=>({...r,profile:map.get(r.user_id)}));
    state.outgoing=rows.filter(r=>r.status==='pending' && r.user_id===me.id).map(r=>({...r,profile:map.get(r.contact_user_id)}));
    renderContacts();
    fillInviteContacts();
  }

  function profileName(p){return p?.display_name||p?.username||'Usuario NEXO'}
  function profileHandle(p){return p?.username?('@'+p.username):''}

  function renderContacts(){
    const list=$('n31ContactsList');
    if(!list) return;
    const blocks=[];
    for(const r of state.incoming){blocks.push(`<div class="n31-row"><div class="n31-main"><div class="n31-title">${escapeHtml(profileName(r.profile))}</div><div class="n31-sub">${escapeHtml(profileHandle(r.profile))} quiere agregarte</div></div><div class="n31-actions"><button class="btn primary" data-accept-contact="${r.id}">Aceptar</button><button class="btn" data-reject-contact="${r.id}">Rechazar</button></div></div>`) }
    for(const r of state.outgoing){blocks.push(`<div class="n31-row"><div class="n31-main"><div class="n31-title">${escapeHtml(profileName(r.profile))}</div><div class="n31-sub">${escapeHtml(profileHandle(r.profile))} · solicitud pendiente</div></div><span class="n31-status">Pendiente</span></div>`) }
    for(const r of state.contacts){blocks.push(`<div class="n31-row"><div class="n31-main"><div class="n31-title">${escapeHtml(profileName(r.profile))}</div><div class="n31-sub">${escapeHtml(profileHandle(r.profile))}</div></div><div class="n31-actions"><button class="btn" data-start-contact="${r.profile?.id||''}">Invitar</button><button class="btn" data-remove-contact="${r.id}">Eliminar</button></div></div>`) }
    list.innerHTML=blocks.length?blocks.join(''):'<div class="n31-note">Todavía no tenés contactos.</div>';
    list.querySelectorAll('[data-accept-contact]').forEach(b=>b.onclick=()=>acceptContact(b.dataset.acceptContact));
    list.querySelectorAll('[data-reject-contact]').forEach(b=>b.onclick=()=>rejectContact(b.dataset.rejectContact));
    list.querySelectorAll('[data-remove-contact]').forEach(b=>b.onclick=()=>removeContact(b.dataset.removeContact));
    list.querySelectorAll('[data-start-contact]').forEach(b=>b.onclick=()=>{ $('n31InviteContact').value=b.dataset.startContact;go('invitaciones') });
  }

  async function acceptContact(id){
    const me=currentUser(); if(!me)return;
    const {data,error}=await sb.from('contacts').update({status:'accepted'}).eq('id',id).eq('contact_user_id',me.id).select().single();
    if(error){toast('✕ '+error.message);return}
    if(data){await sb.from('contacts').insert({user_id:me.id,contact_user_id:data.user_id,status:'accepted'}).select().maybeSingle()}
    toast('✓ Contacto aceptado');await loadContacts();
  }
  async function rejectContact(id){
    const me=currentUser(); if(!me)return;
    const {error}=await sb.from('contacts').delete().eq('id',id).eq('contact_user_id',me.id);
    if(error){toast('✕ '+error.message);return}
    toast('✓ Solicitud rechazada');await loadContacts();
  }
  async function removeContact(id){
    const me=currentUser(); if(!me)return;
    const row=state.contacts.find(r=>r.id===id); if(!row)return;
    const other=row.profile?.id;
    const {error}=await sb.from('contacts').delete().eq('id',id);
    if(error){toast('✕ '+error.message);return}
    if(other) await sb.from('contacts').delete().eq('user_id',other).eq('contact_user_id',me.id);
    toast('✓ Contacto eliminado');await loadContacts();
  }

  async function searchProfiles(){
    const me=currentUser();
    if(!me){toast('✓ Ingresá para buscar contactos');return}
    const q=$('n31ContactSearch').value.trim().replace(/^@/,'');
    if(!q){toast('✕ Escribí un usuario');return}
    const {data,error}=await sb.from('profiles').select('id,username,display_name,avatar_url,bio').neq('id',me.id).or(`username.ilike.%${q}%,display_name.ilike.%${q}%`).limit(12);
    const list=$('n31SearchResults');
    if(error){toast('✕ '+error.message);return}
    if(!data?.length){list.innerHTML='<div class="n31-note">No encontramos usuarios.</div>';return}
    list.innerHTML=data.map(p=>`<div class="n31-row"><div class="n31-main"><div class="n31-title">${escapeHtml(profileName(p))}</div><div class="n31-sub">${escapeHtml(profileHandle(p))}${p.bio?' · '+escapeHtml(p.bio):''}</div></div><button class="btn primary" data-add-contact="${p.id}">Agregar</button></div>`).join('');
    list.querySelectorAll('[data-add-contact]').forEach(b=>b.onclick=()=>sendContactRequest(b.dataset.addContact));
  }

  async function sendContactRequest(contactUserId){
    const me=currentUser();if(!me)return;
    if(contactUserId===me.id)return;
    const {error}=await sb.from('contacts').insert({user_id:me.id,contact_user_id:contactUserId,status:'pending'});
    if(error){toast(error.code==='23505'?'✕ La solicitud ya existe':'✕ '+error.message);return}
    toast('✓ Solicitud enviada');await loadContacts();
  }

  async function loadRooms(){
    const me=currentUser();if(!me)return;
    const {data,error}=await sb.from('rooms').select('id,owner_id,room_key,name,is_personal,created_at,updated_at').eq('owner_id',me.id).order('created_at',{ascending:false});
    if(error){toast('✕ '+error.message);return}
    state.rooms=data||[];renderRooms();
  }

  function renderRooms(){
    const box=$('n31RoomsList');if(!box)return;
    if(!state.rooms.length){box.innerHTML='<div class="n31-note">No hay salas todavía.</div>';return}
    box.innerHTML=state.rooms.map(r=>`<div class="n31-room"><div class="tag">${r.is_personal?'PERSONAL':'SALA'}</div><h4 style="margin:8px 0">${escapeHtml(r.name)}</h4><div class="n31-room-key">${escapeHtml(r.room_key)}</div><div class="n31-actions"><button class="btn primary" data-room-enter="${escapeHtml(r.room_key)}">Entrar</button><button class="btn" data-room-copy="${escapeHtml(r.room_key)}">Copiar</button></div></div>`).join('');
    box.querySelectorAll('[data-room-enter]').forEach(b=>b.onclick=()=>{ if(typeof window.enterVideo==='function') window.enterVideo(b.dataset.roomEnter); });
    box.querySelectorAll('[data-room-copy]').forEach(b=>b.onclick=()=>navigator.clipboard?.writeText(b.dataset.roomCopy).then(()=>toast('✓ Clave copiada')));
  }

  async function refreshRoomsAfterCreate(){await wait(250);await loadRooms()}

  async function loadInvitations(){
    const me=currentUser();if(!me)return;
    const {data,error}=await sb.from('invitations').select('id,room_id,inviter_id,invitee_user_id,token,status,expires_at,created_at').or(`inviter_id.eq.${me.id},invitee_user_id.eq.${me.id}`).order('created_at',{ascending:false}).limit(50);
    if(error){toast('✕ '+error.message);return}
    const rows=data||[];
    const ids=[...new Set(rows.flatMap(r=>[r.inviter_id,r.invitee_user_id]).filter(Boolean).filter(id=>id!==me.id))];
    let profiles=[];if(ids.length){const p=await sb.from('profiles').select('id,username,display_name').in('id',ids);profiles=p.data||[]}
    const pmap=new Map(profiles.map(p=>[p.id,p]));
    const roomIds=[...new Set(rows.map(r=>r.room_id).filter(Boolean))];
    let rooms=[];if(roomIds.length){const r=await sb.from('rooms').select('id,owner_id,room_key,name').in('id',roomIds);rooms=r.data||[]}
    const rmap=new Map(rooms.map(r=>[r.id,r]));
    state.invitations=rows.map(x=>({...x,other:pmap.get(x.inviter_id===me.id?x.invitee_user_id:x.inviter_id),room:rmap.get(x.room_id)}));
    renderInvitations();
  }

  function renderInvitations(){
    const box=$('n31InvitationsList');if(!box)return;
    const me=currentUser();
    const incoming=state.invitations.filter(i=>i.invitee_user_id===me?.id && i.status==='pending');
    const outgoing=state.invitations.filter(i=>i.inviter_id===me?.id && i.status==='pending');
    const rows=[];
    incoming.forEach(i=>rows.push(`<div class="n31-row"><div class="n31-main"><div class="n31-title">${escapeHtml(profileName(i.other))} te invitó</div><div class="n31-sub">${escapeHtml(i.room?.name||'Sala NEXO')} · ${escapeHtml(i.room?.room_key||'')}</div></div><div class="n31-actions"><button class="btn primary" data-accept-invite="${i.id}">Aceptar</button><button class="btn" data-reject-invite="${i.id}">Rechazar</button></div></div>`));
    outgoing.forEach(i=>rows.push(`<div class="n31-row"><div class="n31-main"><div class="n31-title">Invitación enviada</div><div class="n31-sub">${escapeHtml(profileName(i.other))} · ${escapeHtml(i.room?.name||'Sala NEXO')}</div></div><span class="n31-status">Pendiente</span></div>`));
    box.innerHTML=rows.length?rows.join(''):'<div class="n31-note">No tenés invitaciones pendientes.</div>';
    box.querySelectorAll('[data-accept-invite]').forEach(b=>b.onclick=()=>acceptInvite(b.dataset.acceptInvite));
    box.querySelectorAll('[data-reject-invite]').forEach(b=>b.onclick=()=>rejectInvite(b.dataset.rejectInvite));
  }

  function fillInviteContacts(){
    const sel=$('n31InviteContact');if(!sel)return;
    sel.innerHTML='<option value="">Elegí un contacto…</option>'+state.contacts.filter(c=>c.profile?.id).map(c=>`<option value="${c.profile.id}">${escapeHtml(profileName(c.profile))} ${escapeHtml(profileHandle(c.profile))}</option>`).join('');
  }

  async function sendInvite(){
    const me=currentUser();if(!me){toast('✓ Ingresá para invitar');return}
    const contactId=$('n31InviteContact').value;if(!contactId){toast('✕ Elegí un contacto');return}
    const currentRoomKey=(typeof room!=='undefined'?room:'');
    if(!currentRoomKey){toast('✕ No hay sala activa');return}
    const {data:roomRow,error:roomError}=await sb.from('rooms').select('id,name,room_key').eq('owner_id',me.id).eq('room_key',currentRoomKey).single();
    if(roomError||!roomRow){toast('✕ La sala actual no pertenece a tu cuenta');return}
    const {error}=await sb.from('invitations').insert({room_id:roomRow.id,inviter_id:me.id,invitee_user_id:contactId,status:'pending'});
    if(error){toast(error.code==='23505'?'✕ Ya existe una invitación':'✕ '+error.message);return}
    toast('✓ Invitación enviada');await loadInvitations();
  }

  async function updateInvite(id,status){
    const me=currentUser();if(!me)return;
    const {data,error}=await sb.from('invitations').update({status}).eq('id',id).eq('invitee_user_id',me.id).select('room_id').single();
    if(error){toast('✕ '+error.message);return}
    if(status==='accepted'&&data?.room_id){
      const {data:r}=await sb.from('rooms').select('room_key').eq('id',data.room_id).single();
      if(r?.room_key){localStorage.setItem('nexoRoom',r.room_key);if(typeof room!=='undefined'){room=r.room_key;}toast('✓ Invitación aceptada');await loadInvitations();await loadRooms();return;}
    }
    toast(status==='accepted'?'✓ Invitación aceptada':'✓ Invitación rechazada');await loadInvitations();
  }
  const acceptInvite=(id)=>updateInvite(id,'accepted');
  const rejectInvite=(id)=>updateInvite(id,'revoked');

  async function logCallStart(roomKey){
    const me=currentUser();if(!me)return;
    const {data:r}=await sb.from('rooms').select('id').eq('room_key',roomKey).maybeSingle();
    await sb.from('call_history').insert({room_id:r?.id||null,user_id:me.id,room_key:roomKey,direction:'join'});
  }

  function installCallHistoryHook(){
    if(typeof window.enterVideo!=='function' || window.enterVideo.__nexo31)return;
    const original=window.enterVideo;
    const wrapped=function(key){
      const roomKey=String(key||'').trim();
      if(roomKey && currentUser()) logCallStart(roomKey);
      return original(key);
    };
    wrapped.__nexo31=true;
    window.enterVideo=wrapped;
  }

  function hookCreateRoom(){
    if(typeof window.__nexo31CreateHook==='boolean')return;
    window.__nexo31CreateHook=true;
    const btn=$('newBtn');
    btn?.addEventListener('click',refreshRoomsAfterCreate);
  }

  function bind(){
    addNavLinks();ensureStyles();ensureSections();
    $('n31ContactSearchBtn')?.addEventListener('click',searchProfiles);
    $('n31ContactSearch')?.addEventListener('keydown',e=>{if(e.key==='Enter')searchProfiles()});
    $('n31RefreshContacts')?.addEventListener('click',loadContacts);
    $('n31RefreshInvites')?.addEventListener('click',loadInvitations);
    $('n31SendInvite')?.addEventListener('click',sendInvite);
    $('n31CreateRoom')?.addEventListener('click',async()=>{if(!currentUser()){openAuth?.('register');return;}$('newBtn')?.click();await refreshRoomsAfterCreate()});
    $('dashLogin')?.addEventListener('click',()=>setTimeout(()=>openAuth?.('login'),50));
    hookCreateRoom();installCallHistoryHook();
  }

  async function loadAll(){
    if(!currentUser())return;
    await Promise.all([loadContacts(),loadRooms(),loadInvitations()]);
    fillInviteContacts();
    bind();
  }

  async function init(){
    bind();
    for(let i=0;i<24;i++){
      if(currentUser()){await loadAll();break;}
      await wait(250);
    }
    if(typeof sb!=='undefined'){
      sb.auth.onAuthStateChange(async(event)=>{
        if(event==='SIGNED_IN'){await loadAll()}
        if(event==='SIGNED_OUT'){renderContacts();renderInvitations();renderRooms()}
      });
    }
    state.initialized=true;
  }

  window.NEXO31={loadAll,loadContacts,loadRooms,loadInvitations,sendContactRequest,sendInvite};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
