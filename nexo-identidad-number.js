/* NEXO — only changes the visible identity section label 08 -> 00. */
(function(){
  'use strict';
  if (window.__NEXO_IDENTIDAD_NUMBER_FIX__) return;
  window.__NEXO_IDENTIDAD_NUMBER_FIX__ = true;

  function replaceIdentityLabel(root=document){
    const walker=document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes=[];
    let n;
    while((n=walker.nextNode())){
      if(n.nodeValue && n.nodeValue.includes('08 — Identidad')) nodes.push(n);
    }
    nodes.forEach(node=>{
      node.nodeValue=node.nodeValue.replaceAll('08 — Identidad','00 — Identidad');
    });
  }

  function init(){
    replaceIdentityLabel();
    const observer=new MutationObserver(mutations=>{
      for(const mutation of mutations){
        for(const node of mutation.addedNodes){
          if(node.nodeType===Node.TEXT_NODE){
            if(node.nodeValue?.includes('08 — Identidad')){
              node.nodeValue=node.nodeValue.replaceAll('08 — Identidad','00 — Identidad');
            }
          }else if(node.nodeType===Node.ELEMENT_NODE){
            replaceIdentityLabel(node);
          }
        }
      }
    });
    observer.observe(document.body,{childList:true,subtree:true});
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();
