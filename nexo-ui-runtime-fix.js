/* NEXO UI runtime guard — final DOM normalization. */
(function(){
  'use strict';
  if (window.__NEXO_UI_RUNTIME_FIX__) return;
  window.__NEXO_UI_RUNTIME_FIX__ = true;

  const $ = id => document.getElementById(id);

  function normalize(){
    const matches = document.querySelectorAll('#nexoSessionsPanel');
    if (matches.length > 1) {
      const host = matches[0];
      const inner = matches[1];
      host.id = 'nexoSessionsPanel';
      inner.id = 'nexoSessionsPanelInner';
      inner.style.display = 'block';
    }

    const social = $('nexo312-social');
    if (social) {
      social.hidden = true;
      social.style.display = 'none';
      social.setAttribute('aria-hidden','true');
    }

    const history = $('historial');
    if (history) {
      history.hidden = true;
      history.style.display = 'none';
      history.setAttribute('aria-hidden','true');
    }
  }

  const timer = setInterval(() => {
    normalize();
    const ready = $('nexoWorkspaceCard') && $('nexoSessionsPanel');
    if (ready) clearInterval(timer);
  }, 250);
  setTimeout(() => clearInterval(timer), 12000);
})();
