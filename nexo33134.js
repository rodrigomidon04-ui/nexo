/* NEXO 3.3.1 + 3.4. Independent realtime/social layer. Never touches nexo-salas. */
(function(){
  'use strict';
  if(window.__NEXO33134)return;
  window.__NEXO33134=true;

  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const db=()=>{try{return typeof sb!=='undefined'?sb:null}catch{return null}};
  const toast=m=>{if(typeof window.showToast==='function'){window.showToast(m);return}const t=document.getElementById('toast');if(t){t.textContent=m;t.classList.add('on');setTimeout(()=>t.classList.remove('on'),2200)}};
  const uuid=v=>typeof v==='string'&&/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(v);

  let me=null, profile=null, presenceChannel=null, privateChannel=null, roomChannel=null, currentContact=null, currentRoom=null;

  async function user(){ const d=db(); if(!d)return null; const {data,error}=await d.auth.getUser(); me=!error&&data?.user&&uuid(data.user.id)?data.user:null; return me; }
  async function getProfile(){ const d=db(),u=me||await user(); if(!d||!u)return null; const {data}=await d.from('profiles').select('id,username,display_name,avatar_url,bio,last_seen_at').eq('id',u.id).maybeSingle(); profile=data||null; return profile; }

  function css(){
    if(document.getElementById('nexo33134-css'))return;
    const s=document.createElement('style');s.id='nexo33134-css';s.textContent=`
      #nexo33134{padding:70px 0} .n331-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}.n331-box{padding:22px}.n331-list{display:grid;gap:8px;margin-top:12px;max-height:360px;overflow:auto}.n331-row{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:10px 12px;border:1px solid var(--line);border-radius:14px;background:rgba(255,255,255,.02)}.n331-person{display:flex;align-items:center;gap:9px;min-width:0}.n331-avatar{width:34px;height:34px;border-radius:11px;display:grid;place-items:center;background:#0e1821;border:1px solid rgba(77,216,255,.24);color:var(--cyan);font-weight:900;overflow:hidden}.n331-avatar img{width:100%;height:100%;object-fit:cover}.n331-meta{min-width:0}.n331-name{font-weight:800;font-size:13px}.n331-sub{font-size:11px;color:var(--muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.n331-online{color:var(--green);font-size:10px}.n331-chat{display:grid;grid-template-rows:auto 1fr auto;height:420px}.n331-messages{overflow:auto;padding:12px;display:grid;align-content:start;gap:8px;background:#080c10;border:1px solid var(--line);border-radius:16px}.n331-msg{max-width:82%;padding:9px 11px;border-radius:14px;background:#10171e}.n331-msg.me{margin-left:auto;background:rgba(77,216,255,.12);border-color:rgba(77,216,255,.18)}.n331-time{font-size:9px;color:var(--muted);margin-top:4px}.n331-typing{height:18px;font-size:11px;color:var(--muted);padding:4px 2px}.n331-private{display:grid;gap:10px}.n331-room-head{display:flex;justify-content:space-between;gap:10px;align-items:center}.n331-badge{font-size:10px;border:1px solid var(--line);padding:4px 7px;border-radius:999px;color:var(--muted)}.n331-badge.private{color:#ffd37a;border-color:rgba(255,211,122,.25)}.n331-perms{display:grid;grid-template-columns:1fr 1fr;gap:10px}.n331-empty{color:var(--muted);font-size:12px;padding:18px 2px}.n331-unread{min-width:18px;height:18px;border-radius:999px;display:inline-grid;place-items:center;background:var(--cyan);color:#001017;font-size:10px;font-weight:900}.n331-note{font-size:11px;color:var(--muted);line-height:1.5}.n331-search{display:flex;gap:8px}.n331-search .input{flex:1}@media(max-width:900px){.n331-grid{grid-template-columns:1fr}.n331-chat{height:380px}.n331-perms{grid-template-columns:1fr}}
    `;document.head.appendChild(s);
  }

  function ui(){
    if(document.getElementById('nexo33134'))return;
    css();
    const sec=document.createElement('section');sec.id='nexo33134';sec.innerHTML=`<div class="container">
      <div class="section-head"><div><div class="tag">03.3.1 / 03.4</div><h2>Conectá.<br>Conversá.<br>Controlá.</h2></div><p class="muted">Chat privado y de sala, presencia online, no leídos y control de acceso. Todo desde NEXO, sin tocar NEXO Salas.</p></div>
      <div class="n331-grid">
        <div class="card n331-box"><div class="tag">CHAT PRIVADO</div><h3 style="font-size:24px;margin:10px 0">Conversaciones</h3><div class="n331-search"><input id="n331ContactSearch" class="input" placeholder="Buscar contacto..."><button class="btn" id="n331Refresh">↻</button></div><div id="n331Contacts" class="n331-list"></div></div>
        <div class="card n331-box n331-chat"><div><div class="n331-room-head"><div><div class="tag" id="n331ChatTag">CHAT</div><h3 id="n331ChatTitle" style="margin:8px 0">Elegí un contacto</h3></div><span id="n331ChatStatus" class="n331-badge">—</span></div></div><div id="n331Messages" class="n331-messages"><div class="n331-empty">Seleccioná un contacto para abrir el chat.</div></div><div><div id="n331Typing" class="n331-typing"></div><div class="inputline"><input id="n331Message" class="input" maxlength="2000" placeholder="Escribí un mensaje…"><button class="btn primary" id="n331Send">Enviar</button></div></div></div>
        <div class="card n331-box"><div class="tag">CHAT DE SALA</div><h3 style="font-size:24px;margin:10px 0">Conversaciones grupales</h3><select id="n331RoomSelect" class="select"><option value="">Seleccioná una sala</option></select><div class="n331-note" style="margin-top:10px">Los mensajes de sala son persistentes. El acceso a la sala puede ser público o privado desde el panel de permisos.</div><div id="n331RoomMessages" class="n331-messages" style="height:250px;margin-top:12px"><div class="n331-empty">Elegí una sala.</div></div><div class="inputline"><input id="n331RoomMessage" class="input" maxlength="2000" placeholder="Mensaje para la sala…"><button class="btn primary" id="n331RoomSend">Enviar</button></div></div>
        <div class="card n331-box n331-private"><div class="tag">03.4 — SALAS PRIVADAS</div><h3 style="font-size:24px;margin:10px 0">Acceso y permisos</h3><select id="n331PermRoom" class="select"><option value="">Seleccioná una sala</option></select><div class="n331-perms"><label class="note">Visibilidad<select id="n331Visibility" class="select"><option value="public">Pública</option><option value="private">Privada</option></select></label><label class="note">Acceso<select id="n331JoinPolicy" class="select"><option value="invite">Solo invitación</option><option value="contacts">Contactos</option><option value="owner">Solo propietario</option></select></label></div><button class="btn primary" id="n331SavePerms">Guardar permisos</button><div id="n331Members" class="n331-list"></div><div class="n331-note">Nota: estas reglas controlan el acceso desde NEXO. El repositorio de videollamadas permanece separado; una clave compartida directamente puede seguir abriendo NEXO Salas hasta que autorices cambios en ese repositorio.</div></div>
      </div>
    </div>`;
    const dash=document.getElementById('dashboard'); if(dash?.parentNode)dash.parentNode.insertBefore(sec,dash.nextSibling); else document.body.appendChild(sec);
  }

  async function contacts(){
    const d=db(),u=me||await user(),out=document.getElementById('n331Contacts'); if(!d||!u||!out)return;
    const {data,error}=await d.from('contacts').select('contact_user_id,status').eq('user_id',u.id).eq('status','accepted');
    if(error){out.innerHTML='<div class="n331-empty">No se pudieron cargar los contactos.</div>';return}
    const ids=(data||[]).map(x=>x.contact_user_id).filter(uuid=>uuid);
    if(!ids.length){out.innerHTML='<div class="n331-empty">Todavía no tenés contactos.</div>';return}
    const {data:ps}=await d.from('profiles').select('id,username,display_name,avatar_url,last_seen_at').in('id',ids);
    renderPeople(ps||[],out);
  }
  function renderPeople(ps,out){
    const filter=(document.getElementById('n331ContactSearch')?.value||'').trim().toLowerCase();
    const arr=ps.filter(p=>(p.display_name||'').toLowerCase().includes(filter)||(p.username||'').toLowerCase().includes(filter));
    out.innerHTML=arr.map(p=>`<button class="n331-row" data-person="${p.id}" style="width:100%;text-align:left;background:transparent;color:inherit"><span class="n331-person">${p.avatar_url?`<span class="n331-avatar"><img src="${esc(p.avatar_url)}" alt=""></span>`:`<span class="n331-avatar">${esc((p.display_name||p.username||'U').slice(0,1).toUpperCase())}</span>`}<span class="n331-meta"><span class="n331-name">${esc(p.display_name||p.username||'Usuario')}</span><span class="n331-sub">@${esc(p.username||'usuario')}</span></span></span><span class="n331-sub">${p.last_seen_at?new Date(p.last_seen_at).toLocaleString('es-UY',{day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'}):'Sin actividad registrada'}</span></button>`).join('')||'<div class="n331-empty">No encontramos contactos.</div>';
    out.querySelectorAll('[data-person]').forEach(b=>b.onclick=()=>openPrivate(b.dataset.person,ps.find(p=>p.id===b.dataset.person)));
  }

  async function openPrivate(id,p){
    const d=db(),u=me||await user();if(!d||!u||!id)return; currentContact={...p,id};
    document.getElementById('n331ChatTitle').textContent=p?.display_name||p?.username||'Contacto';
    document.getElementById('n331ChatStatus').textContent=p?.last_seen_at?'Última conexión '+new Date(p.last_seen_at).toLocaleString('es-UY',{day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'}):'Sin actividad';
    await loadPrivate(); subscribePrivate();
  }
  async function loadPrivate(){
    const d=db(),u=me;if(!d||!u||!currentContact)return;
    const {data,error}=await d.from('messages').select('id,sender_id,recipient_id,body,created_at,read_at').or(`and(sender_id.eq.${u.id},recipient_id.eq.${currentContact.id}),and(sender_id.eq.${currentContact.id},recipient_id.eq.${u.id})`).order('created_at',{ascending:true}).limit(200);
    const box=document.getElementById('n331Messages'); if(error){box.innerHTML='<div class="n331-empty">No se pudo cargar el chat.</div>';return}
    box.innerHTML=(data||[]).map(m=>`<div class="n331-msg ${m.sender_id===u.id?'me':''}">${esc(m.body)}<div class="n331-time">${new Date(m.created_at).toLocaleString('es-UY')}</div></div>`).join('')||'<div class="n331-empty">Todavía no hay mensajes.</div>';box.scrollTop=box.scrollHeight;
    await d.from('messages').update({read_at:new Date().toISOString()}).eq('sender_id',currentContact.id).eq('recipient_id',u.id).is('read_at',null);
  }
  function subscribePrivate(){
    const d=db(),u=me;if(!d||!u||!currentContact)return;
    if(privateChannel)d.removeChannel(privateChannel);
    const key=[u.id,currentContact.id].sort().join(':');
    privateChannel=d.channel('nexo-private:'+key);
    privateChannel.on('broadcast',{event:'message'},()=>loadPrivate()).on('broadcast',{event:'typing'},({payload})=>{const t=document.getElementById('n331Typing');t.textContent=payload?.from===currentContact.id?`${currentContact.display_name||currentContact.username||'Contacto'} está escribiendo…`:''}).subscribe();
  }
  async function sendPrivate(){
    const d=db(),u=me,input=document.getElementById('n331Message');if(!d||!u||!currentContact||!input)return;const body=input.value.trim();if(!body)return;
    const {error}=await d.from('messages').insert({sender_id:u.id,recipient_id:currentContact.id,body});if(error){toast('✕ '+error.message);return}input.value='';await loadPrivate();if(privateChannel)await privateChannel.send({type:'broadcast',event:'message',payload:{from:u.id}});
  }
  function typing(){ if(!privateChannel||!me)return; privateChannel.send({type:'broadcast',event:'typing',payload:{from:me.id}}); }

  async function rooms(){
    const d=db(),u=me||await user();if(!d||!u)return;const {data}=await d.from('rooms').select('id,room_key,name,is_personal,visibility,join_policy,owner_id').or(`owner_id.eq.${u.id},id.in.(select room_id from room_members where user_id.eq.${u.id})`).order('created_at',{ascending:false});
    const arr=data||[];['n331RoomSelect','n331PermRoom'].forEach(id=>{const s=document.getElementById(id);if(!s)return;s.innerHTML='<option value="">Seleccioná una sala</option>'+arr.map(r=>`<option value="${r.id}">${esc(r.name||r.room_key)} · ${r.visibility==='private'?'Privada':'Pública'}</option>`).join('')});
  }
  async function openRoom(id){
    const d=db(),u=me;if(!d||!u||!id)return;const {data:r}=await d.from('rooms').select('id,room_key,name,visibility,join_policy,owner_id').eq('id',id).maybeSingle();if(!r)return;currentRoom=r;await loadRoomMessages();subscribeRoom();
  }
  async function loadRoomMessages(){const d=db(),u=me;if(!d||!u||!currentRoom)return;const {data,error}=await d.from('room_messages').select('id,sender_id,body,created_at').eq('room_id',currentRoom.id).order('created_at',{ascending:true}).limit(200);const box=document.getElementById('n331RoomMessages');if(error){box.innerHTML='<div class="n331-empty">No se pudo cargar el chat de sala.</div>';return}box.innerHTML=(data||[]).map(m=>`<div class="n331-msg ${m.sender_id===u.id?'me':''}">${esc(m.body)}<div class="n331-time">${new Date(m.created_at).toLocaleString('es-UY')}</div></div>`).join('')||'<div class="n331-empty">Todavía no hay mensajes.</div>';box.scrollTop=box.scrollHeight;await d.from('room_members').update({last_read_at:new Date().toISOString()}).eq('room_id',currentRoom.id).eq('user_id',u.id)}
  function subscribeRoom(){const d=db();if(!d||!currentRoom)return;if(roomChannel)d.removeChannel(roomChannel);roomChannel=d.channel('nexo-room:'+currentRoom.id);roomChannel.on('broadcast',{event:'message'},()=>loadRoomMessages()).subscribe()}
  async function sendRoom(){const d=db(),u=me,input=document.getElementById('n331RoomMessage');if(!d||!u||!currentRoom||!input)return;const body=input.value.trim();if(!body)return;const {error}=await d.from('room_messages').insert({room_id:currentRoom.id,sender_id:u.id,body});if(error){toast('✕ '+error.message);return}input.value='';await loadRoomMessages();if(roomChannel)roomChannel.send({type:'broadcast',event:'message',payload:{from:u.id}})}

  async function loadPerms(id){const d=db(),u=me;if(!d||!u||!id)return;const {data:r}=await d.from('rooms').select('id,name,visibility,join_policy,owner_id').eq('id',id).maybeSingle();if(!r)return;document.getElementById('n331Visibility').value=r.visibility;document.getElementById('n331JoinPolicy').value=r.join_policy;await members(id)}
  async function savePerms(){const d=db(),u=me,id=document.getElementById('n331PermRoom')?.value;if(!d||!u||!id)return;const {data:r}=await d.from('rooms').select('owner_id').eq('id',id).maybeSingle();if(r?.owner_id!==u.id){toast('✕ Solo el propietario puede cambiar permisos');return}const {error}=await d.from('rooms').update({visibility:document.getElementById('n331Visibility').value,join_policy:document.getElementById('n331JoinPolicy').value}).eq('id',id).eq('owner_id',u.id);if(error){toast('✕ '+error.message);return}toast('✓ Permisos actualizados');await rooms()}
  async function members(id){const d=db(),u=me,box=document.getElementById('n331Members');if(!d||!u||!id||!box)return;const {data}=await d.from('room_members').select('user_id,role,joined_at').eq('room_id',id);const ids=(data||[]).map(x=>x.user_id);const {data:ps}=ids.length?await d.from('profiles').select('id,display_name,username,avatar_url').in('id',ids):{data:[]};const map=new Map((ps||[]).map(p=>[p.id,p]));box.innerHTML='<div class="tag">MIEMBROS</div>'+((data||[]).map(m=>{const p=map.get(m.user_id)||{};return `<div class="n331-row"><span class="n331-person"><span class="n331-avatar">${esc((p.display_name||p.username||'U').slice(0,1).toUpperCase())}</span><span class="n331-meta"><span class="n331-name">${esc(p.display_name||p.username||'Usuario')}</span><span class="n331-sub">@${esc(p.username||'usuario')}</span></span></span><span class="n331-badge">${esc(m.role)}</span></div>`}).join('')||'<div class="n331-empty">Solo el propietario por ahora.</div>')}

  async function presence(){
    const d=db(),u=me;if(!d||!u)return;if(presenceChannel)d.removeChannel(presenceChannel);presenceChannel=d.channel('nexo-presence');presenceChannel.on('presence',{event:'sync'},()=>{}).subscribe(async status=>{if(status==='SUBSCRIBED')await presenceChannel.track({user_id:u.id,username:profile?.username||'',online_at:new Date().toISOString()})});await d.from('profiles').update({last_seen_at:new Date().toISOString()}).eq('id',u.id);setInterval(()=>d.from('profiles').update({last_seen_at:new Date().toISOString()}).eq('id',u.id),60000);
  }

  function bind(){
    document.getElementById('n331ContactSearch')?.addEventListener('input',contacts);
    document.getElementById('n331Refresh')?.addEventListener('click',contacts);
    document.getElementById('n331Send')?.addEventListener('click',sendPrivate);
    document.getElementById('n331Message')?.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();sendPrivate()}else typing()});
    document.getElementById('n331RoomSelect')?.addEventListener('change',e=>openRoom(e.target.value));
    document.getElementById('n331RoomSend')?.addEventListener('click',sendRoom);
    document.getElementById('n331RoomMessage')?.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();sendRoom()}});
    document.getElementById('n331PermRoom')?.addEventListener('change',e=>loadPerms(e.target.value));
    document.getElementById('n331SavePerms')?.addEventListener('click',savePerms);
  }
  async function boot(){ui();bind();await getProfile();await contacts();await rooms();await presence();}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(boot,600),{once:true});else setTimeout(boot,600);
})();