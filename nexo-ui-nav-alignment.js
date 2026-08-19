/* NEXO UI: align Mi Nexo exactly with the other primary nav items and anchor its dropdown to the item. */
(function(){
  'use strict';
  if (window.__NEXO_UI_NAV_ALIGNMENT__) return;
  window.__NEXO_UI_NAV_ALIGNMENT__ = true;

  function apply(){
    const mi = document.querySelector('.nav .nexo-nav-mi');
    const menu = document.getElementById('nexoUiMenu') || document.getElementById('nexoFinalMenu') || document.getElementById('nexoMenu');

    if (!mi || !menu) return;

    // The dropdown must be anchored to Mi Nexo itself, not to the whole nav bar.
    if (menu.parentElement !== mi) mi.appendChild(menu);

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
        .nav .nexo-nav-mi{
          height:40px;
          line-height:1;
          position:relative;
          margin:0;
          padding:0;
          transform:none;
        }
        .nav .nexo-nav-mi > a{
          height:40px;
          padding-top:0;
          padding-bottom:0;
          line-height:1;
        }
        .nav .nexo-nav-toggle{
          height:40px;
          padding-top:0;
          padding-bottom:0;
          line-height:1;
          margin:0;
        }
        .nav .nexo-nav-mi > .nexo-menu{
          position:absolute !important;
          top:calc(100% + 10px) !important;
          left:50% !important;
          right:auto !important;
          bottom:auto !important;
          transform:translateX(-50%) !important;
          margin:0 !important;
          z-index:1000 !important;
        }
        @media(max-width:600px){
          .nav .nexo-nav-mi > .nexo-menu{
            position:fixed !important;
            top:68px !important;
            left:50% !important;
            right:auto !important;
            transform:translateX(-50%) !important;
            width:calc(100vw - 24px) !important;
            max-height:calc(100vh - 84px);
            overflow:auto;
          }
        }
      `;
      document.head.appendChild(style);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', apply, {once:true});
  } else {
    apply();
  }
  setTimeout(apply, 300);
  setTimeout(apply, 900);
  setTimeout(apply, 1800);
})();
