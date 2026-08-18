/* NEXO 3.1.1 contact guard. Never touches nexo-salas. */
(function(){
  'use strict';
  if(window.__NEXO311_CONTACT_GUARD)return;
  window.__NEXO311_CONTACT_GUARD=true;
  const toast=(m)=>{if(typeof window.showToast==='function'){window.showToast(m);return}const t=document.getElementById('toast');if(!t)return;t.textContent=m;t.classList.add('on');setTimeout(()=>t.classList.remove('on'),2200)};
  const validUuid=v=>typeof v==='string'&&/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(v);
  async function currentUser(){if(typeof sb==='undefined')return null;const {data,error}=await sb.auth.getUser();const u=data?.user;return !error&&u&&validUuid(u.id)?u:null}
  async function addContactSafely(targetId,button){
    const u=await currentUser();
    if(!u){toast('✓ Iniciá sesión para agregar contactos');return}
    if(!validUuid(targetId)){toast('✕ Usuario inválido');return}
    if(targetId===u.id){toast('✕ No podés agregarte a vos mismo');return}
    if(button){button.disabled=true;button.dataset.originalText=button.textContent;button.textContent='Comprobando…'}
    try{
      const [outgoing,incoming]=await Promise.all([
        sb.from('contacts').select('id,status').eq('user_id',u.id).eq('contact_user_id',targetId).limit(1),
        sb.from('contacts').select('id,status').eq('user_id',targetId).eq('contact_user_id',u.id).limit(1)
      ]);
      if(outgoing.error||incoming.error)throw new Error('No se pudo comprobar la relación de contacto');
      const existing=[...(outgoing.data||[]),...(incoming.data||[])];
      if(existing.some(r=>r.status==='accepted')){toast('✓ Ya son contactos');return}
      if(existing.some(r=>r.status==='pending')){toast('✓ Ya existe una solicitud pendiente');return}
      if(existing.some(r=>r.status==='blocked')){toast('✕ Este contacto está bloqueado');return}
      const {error}=await sb.from('contacts').insert({user_id:u.id,contact_user_id:targetId,status:'pending'});
      if(error){if(error.code==='23505'){toast('✓ Ya existe una solicitud de contacto');return}throw error}
      toast('✓ Solicitud enviada');
      if(window.NEXO31?.loadContacts)await window.NEXO31.loadContacts();
    }catch(e){toast('✕ '+(e?.message||'No se pudo enviar la solicitud'))}
    finally{if(button){button.disabled=false;button.textContent=button.dataset.originalText||'Agregar'}}
  }
  function install(){document.addEventListener('click',async e=>{const btn=e.target.closest?.('[data-add]');if(!btn)return;e.preventDefault();e.stopPropagation();if(e.stopImmediatePropagation)e.stopImmediatePropagation();await addContactSafely(btn.dataset.add,btn)},true)}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else install();
})();
