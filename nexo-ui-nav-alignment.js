/* NEXO UI: align Mi Nexo exactly with the other primary nav items. */
(function(){
  'use strict';
  if (window.__NEXO_UI_NAV_ALIGNMENT__) return;
  window.__NEXO_UI_NAV_ALIGNMENT__ = true;

  function apply(){
    if (!document.getElementById('nexo-ui-nav-alignment-style')) {
      const style = document.createElement('style');
      style.id = 'nexo-ui-nav-alignment-style';
      style.textContent = `
        .nav .nav-inner{align-items:center}
        .nav .navlinks{align-items:center;height:40px}
        .nav .navlinks > a,
        .nav .nexo-nav-mi,
        .nav .nexo-nav-mi > a,
        .nav .nexo-nav-toggle{
          display:inline-flex;
          align-items:center;
          align-self:center;
          vertical-align:middle;
          box-sizing:border-box;
        }
        .nav .nexo-nav-mi{height:40px;line-height:1}
        .nav .nexo-nav-mi > a{height:40px;padding-top:0;padding-bottom:0;line-height:1}
        .nav .nexo-nav-toggle{height:40px;padding-top:0;padding-bottom:0;line-height:1;margin:0}
      `;
      document.head.appendChild(style);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', apply, {once:true});
  } else {
    apply();
  }
  setTimeout(apply, 900);
})();
