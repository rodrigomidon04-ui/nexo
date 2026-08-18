/* NEXO 3.1.1 UX + profile/search guard. Never touches nexo-salas. */
(function(){
  'use strict';
  if(window.__NEXO311_PROFILE_SEARCH_GUARD)return;
  window.__NEXO311_PROFILE_SEARCH_GUARD=true;

  const validUuid=v=>typeof v==='string'&&/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(v);
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const toast=m=>{if(typeof window.showToast==='function'){window.showToast(m);return}const t=document.getElementById('toast');if(!t)return;t.textContent=m;t.classList.add('on');setTimeout(()=>t.classList.remove('on'),2400)};
  const db=()=>{try{return typeof sb!=='undefined'?sb:null}catch{return null}};

  let me=null;
  let profile=null;
  let profileReady=false;

  async function currentUser(){
    const d=db();
    if(!d)return null;
    const {data,error}=await d.auth.getUser();
    const u=data?.user;
    me=!error&&u&&validUuid(u.id)?u:null;
    return me;
  }

  async function loadProfile(){
    const d=db();
    if(!d)return null;
    const u=await currentUser();
    if(!u)return null;
    const {data,error}=await d.from('profiles').select('id,username,display_name,avatar_url,bio').eq('id',u.id).maybeSingle();
    if(error){toast('✕ Perfil: '+error.message);return null}
    profile=data||{id:u.id,username:u.user_metadata?.username||'',display_name:u.user_metadata?.display_name||u.email?.split('@')[0]||'Usuario NEXO',avatar_url:'',bio:''};
    profileReady=true;
    renderAccount();
    return profile;
  }

  const name=()=>profile?.display_name||profile?.username||me?.email?.split('@')[0]||'Usuario NEXO';
  const username=()=>profile?.username?('@'+profile.username):'';
  const initials=()=>name().trim().split(/\s+/).slice(0,2).map(x=>x[0]).join('').toUpperCase()||'N';

  function avatarMarkup(sizeClass=''){
    const url=profile?.avatar_url?.trim();
    return url
      ? `<span class="nexo-user-avatar ${sizeClass}"><img src="${esc(url)}" alt="Avatar de ${esc(name())}" loading="lazy" referrerpolicy="no-referrer"></span>`
      : `<span class="nexo-user-avatar ${sizeClass}">${esc(initials())}</span>`;
  }

  function ensureStyles(){
    if(document.getElementById('nexo311-profile-style'))return;
    const s=document.createElement('style');
    s.id='nexo311-profile-style';
    s.textContent=`
      .nexo-account-btn{display:flex;align-items:center;gap:9px;padding:7px 11px!important}
      .nexo-user-avatar{width:34px;height:34px;border-radius:11px;display:inline-grid;place-items:center;overflow:hidden;background:#0e1821;border:1px solid rgba(77,216,255,.28);color:var(--cyan);font-size:12px;font-weight:900;flex:0 0 auto}
      .nexo-user-avatar.small{width:28px;height:28px;border-radius:9px}
      .nexo-user-avatar.medium{width:58px;height:58px;border-radius:17px;font-size:18px}
      .nexo-user-avatar img{width:100%;height:100%;object-fit:cover;display:block}
      .nexo-account-copy{display:flex;flex-direction:column;align-items:flex-start;line-height:1.1}
      .nexo-account-name{font-weight:800;font-size:12px;max-width:150px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
      .nexo-account-user{font-size:10px;color:var(--muted);margin-top:3px;max-width:150px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
      .nexo-profile-panel{position:fixed;top:68px;right:18px;width:min(390px,calc(100vw - 28px));padding:18px;background:#0c1117;border:1px solid var(--line);border-radius:20px;box-shadow:0 25px 80px rgba(0,0,0,.55);z-index:140}
      .nexo-profile-head{display:flex;gap:14px;align-items:center}
      .nexo-profile-fields{display:grid;gap:10px;margin-top:16px}
      .nexo-profile-actions{display:flex;gap:8px;justify-content:flex-end;margin-top:14px;flex-wrap:wrap}
      .nexo-profile-note{font-size:11px;color:var(--muted);line-height:1.5;margin-top:8px}
      @media(max-width:600px){.nexo-account-user{display:none}.nexo-account-name{max-width:88px}}
    `;
    document.head.appendChild(s);
  }

  function ensurePanel(){
    if(document.getElementById('nexoProfilePanel'))return;
    const p=document.createElement('div');
    p.id='nexoProfilePanel';
    p.className='nexo-profile-panel hidden';
    p.innerHTML=`
      <div class="nexo-profile-head">
        <div id="nexoProfileAvatarPreview"></div>
        <div><div class="tag">MI CUENTA</div><strong id="nexoProfileTitle">Usuario NEXO</strong><div class="muted" id="nexoProfileMail">—</div></div>
      </div>
      <div class="nexo-profile-fields">
        <label class="note">Nombre visible<input id="nexoDisplayName" class="input" placeholder="Tu nombre"></label>
        <label class="note">Nombre de usuario<input id="nexoUsername" class="input" placeholder="usuario"></label>
        <label class="note">Foto / avatar (URL)<input id="nexoAvatarUrl" class="input" placeholder="https://..."></label>
      </div>
      <div class="nexo-profile-actions"><button class="btn" id="nexoProfileClose">Cerrar</button><button class="btn primary" id="nexoProfileSave">Guardar</button></div>
      <div class="nexo-profile-note">Podés usar una URL de imagen. Más adelante podemos agregar carga directa de fotos a Supabase Storage.</div>
    `;
    document.body.appendChild(p);

    p.addEventListener('click',e=>{
      if(e.target===p)p.classList.add('hidden');
    });
    document.getElementById('nexoProfileClose').onclick=()=>p.classList.add('hidden');
    document.getElementById('nexoProfileSave').onclick=saveProfile;
  }

  function renderAccount(){
    ensureStyles();ensurePanel();
    const authBtn=document.getElementById('authBtn');
    if(authBtn&&me){
      authBtn.className='btn ghost nexo-account-btn';
      authBtn.innerHTML=`${avatarMarkup('small')}<span class="nexo-account-copy"><span class="nexo-account-name">${esc(name())}</span><span class="nexo-account-user">${esc(username()||'Mi cuenta')}</span></span>`;
      authBtn.dataset.accountReady='1';
    }

    for(const id of ['sideName','welcomeText']){
      const el=document.getElementById(id);
      if(el)el.textContent=id==='welcomeText'?`Hola, ${name()} 👋`:name();
    }
    const sideMail=document.getElementById('sideMail');
    if(sideMail)sideMail.textContent=me?.email||'—';
    for(const id of ['sideAvatar','bigAvatar']){
      const el=document.getElementById(id);
      if(el){el.outerHTML=`<div class="avatar" id="${id}">${profile?.avatar_url?`<img src="${esc(profile.avatar_url)}" alt="Avatar" loading="lazy" style="width:100%;height:100%;object-fit:cover;border-radius:inherit">`:esc(initials())}</div>`}
    }
    const ap=document.getElementById('nexoProfileAvatarPreview');
    if(ap)ap.innerHTML=avatarMarkup('medium');
    const nt=document.getElementById('nexoProfileTitle');if(nt)nt.textContent=name();
    const nm=document.getElementById('nexoProfileMail');if(nm)nm.textContent=me?.email||username();
    const dn=document.getElementById('nexoDisplayName');if(dn&&!document.activeElement?.isSameNode(dn))dn.value=profile?.display_name||'';
    const un=document.getElementById('nexoUsername');if(un&&!document.activeElement?.isSameNode(un))un.value=profile?.username||'';
    const au=document.getElementById('nexoAvatarUrl');if(au&&!document.activeElement?.isSameNode(au))au.value=profile?.avatar_url||'';
  }

  async function saveProfile(){
    const d=db();if(!d||!me)return;
    const displayName=document.getElementById('nexoDisplayName')?.value.trim()||'Usuario NEXO';
    const rawUser=document.getElementById('nexoUsername')?.value.trim().replace(/^@/,'').toLowerCase()||'';
    const avatarUrl=document.getElementById('nexoAvatarUrl')?.value.trim()||null;
    if(rawUser&&!/^[a-z0-9_\.\-]{3,32}$/.test(rawUser)){toast('✕ Usuario: usá 3-32 caracteres, letras, números, _ . o -');return}
    if(avatarUrl){try{new URL(avatarUrl)}catch{toast('✕ La URL de la foto no es válida');return}}
    const {data,error}=await d.from('profiles').update({display_name:displayName,username:rawUser||null,avatar_url:avatarUrl}).eq('id',me.id).select('id,username,display_name,avatar_url,bio').single();
    if(error){toast(error.code==='23505'?'✕ Ese nombre de usuario ya está ocupado':'✕ '+error.message);return}
    profile=data;renderAccount();document.getElementById('nexoProfilePanel')?.classList.add('hidden');toast('✓ Perfil actualizado');
  }

  function openAccount(){
    ensureStyles();ensurePanel();
    const panel=document.getElementById('nexoProfilePanel');
    if(!panel)return;
    renderAccount();panel.classList.toggle('hidden');
  }

  async function safeSearch(){
    const d=db();
    const u=me||await currentUser();
    const input=document.getElementById('n311Search')||document.getElementById('n31ContactSearch');
    const out=document.getElementById('n311Results')||document.getElementById('n31SearchResults');
    if(!out)return;
    if(!d||!u){toast('✓ Ingresá para buscar personas');return}
    const q=input?.value.trim().replace(/^@/,'').replace(/[%_,]/g,' ');
    if(!q){out.innerHTML='<div class="n311-empty">Escribí un nombre o @usuario.</div>';return}
    out.innerHTML='<div class="n311-empty">Buscando…</div>';
    try{
      const escaped=q.replace(/[%_]/g,'');
      const [byUser,byName]=await Promise.all([
        d.from('profiles').select('id,username,display_name,bio,avatar_url').neq('id',u.id).ilike('username',`%${escaped}%`).limit(20),
        d.from('profiles').select('id,username,display_name,bio,avatar_url').neq('id',u.id).ilike('display_name',`%${escaped}%`).limit(20)
      ]);
      if(byUser.error)throw byUser.error;
      if(byName.error)throw byName.error;
      const map=new Map();for(const p of [...(byUser.data||[]),...(byName.data||[])])map.set(p.id,p);
      const rows=[...map.values()].slice(0,20);
      out.innerHTML=rows.map(p=>`<div class="n311-row"><div class="n311-main" style="display:flex;align-items:center;gap:10px">${p.avatar_url?`<img src="${esc(p.avatar_url)}" alt="" style="width:38px;height:38px;object-fit:cover;border-radius:12px;border:1px solid var(--line)" loading="lazy">`:`<span class="nexo-user-avatar small">${esc((p.display_name||p.username||'U').slice(0,1).toUpperCase())}</span>`}<div><div class="n311-title">${esc(p.display_name||p.username||'Usuario NEXO')}</div><div class="n311-sub">${esc(p.username?'@'+p.username:'')}${p.bio?' · '+esc(p.bio):''}</div></div></div><button class="btn primary" data-add="${p.id}">Agregar</button></div>`).join('')||'<div class="n311-empty">No encontramos personas.</div>';
      out.querySelectorAll('[data-add]').forEach(b=>b.onclick=()=>addContactSafely(b.dataset.add,b));
    }catch(e){out.innerHTML='<div class="n311-empty">No pudimos realizar la búsqueda.</div>';toast('✕ Buscar: '+(e?.message||'error'))}
  }

  async function addContactSafely(targetId,button){
    const d=db();const u=me||await currentUser();
    if(!d||!u){toast('✓ Iniciá sesión para agregar contactos');return}
    if(!validUuid(targetId)){toast('✕ Usuario inválido');return}
    if(targetId===u.id){toast('✕ No podés agregarte a vos mismo');return}
    if(button){button.disabled=true;button.dataset.originalText=button.textContent;button.textContent='Comprobando…'}
    try{
      const [outgoing,incoming]=await Promise.all([
        d.from('contacts').select('id,status').eq('user_id',u.id).eq('contact_user_id',targetId).limit(1),
        d.from('contacts').select('id,status').eq('user_id',targetId).eq('contact_user_id',u.id).limit(1)
      ]);
      if(outgoing.error||incoming.error)throw new Error('No se pudo comprobar la relación');
      const existing=[...(outgoing.data||[]),...(incoming.data||[])];
      if(existing.some(r=>r.status==='accepted'))return toast('✓ Ya son contactos');
      if(existing.some(r=>r.status==='pending'))return toast('✓ Ya existe una solicitud pendiente');
      if(existing.some(r=>r.status==='blocked'))return toast('✕ Este contacto está bloqueado');
      const {error}=await d.from('contacts').insert({user_id:u.id,contact_user_id:targetId,status:'pending'});
      if(error){if(error.code==='23505')return toast('✓ Ya existe una solicitud de contacto');throw error}
      toast('✓ Solicitud enviada');
      if(window.NEXO31?.loadContacts)await window.NEXO31.loadContacts();
    }catch(e){toast('✕ '+(e?.message||'No se pudo enviar la solicitud'))}
    finally{if(button){button.disabled=false;button.textContent=button.dataset.originalText||'Agregar'}}
  }

  function install(){
    ensureStyles();ensurePanel();
    document.addEventListener('click',async e=>{
      const account=document.getElementById('authBtn');
      if(account&&e.target.closest('#authBtn')&&account.dataset.accountReady==='1'){
        e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();openAccount();return;
      }
      if(e.target.closest('#n311SearchBtn,#n31ContactSearchBtn')){
        e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();safeSearch();return;
      }
      const add=e.target.closest?.('[data-add]');
      if(add){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();addContactSafely(add.dataset.add,add)}
    },true);
    document.addEventListener('keydown',e=>{
      if(e.key==='Enter'&&(e.target?.id==='n311Search'||e.target?.id==='n31ContactSearch')){e.preventDefault();safeSearch()}
    },true);
  }

  async function boot(){
    install();
    await loadProfile();
    const d=db();
    if(d)d.auth.onAuthStateChange(()=>setTimeout(loadProfile,200));
    profileReady=true;
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
