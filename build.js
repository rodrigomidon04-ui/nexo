const fs = require('fs');
const path = require('path');
const file = path.join(process.cwd(), 'index.html');
let html = fs.readFileSync(file, 'utf8');

const scripts = [
  ['nexo32.js?v=3.2', '<script src="./nexo32.js?v=3.2"></script>'],
  ['nexo33.js?v=3.3', '<script src="./nexo33.js?v=3.3"></script>'],
  ['nexo33134.js?v=3.4', '<script src="./nexo33134.js?v=3.4"></script>'],
  ['nexo-nav.js?v=3.3-nav4', '<script src="./nexo-nav.js?v=3.3-nav4"></script>'],
  ['nexo-layout.js?v=4.7-layout', '<script src="./nexo-layout.js?v=4.7-layout"></script>'],
  ['nexo-nav-fix.js?v=3.4-navfix', '<script src="./nexo-nav-fix.js?v=3.4-navfix"></script>'],
  ['nexo-section-order.js?v=4.0-order', '<script src="./nexo-section-order.js?v=4.0-order"></script>'],
  ['nexo-final-order.js?v=4.0-final', '<script src="./nexo-final-order.js?v=4.0-final"></script>'],
  ['nexo-final-structure.js?v=4.1-final', '<script src="./nexo-final-structure.js?v=4.1-final"></script>'],
  ['nexo-strict-order.js?v=4.2-strict', '<script src="./nexo-strict-order.js?v=4.2-strict"></script>'],
  ['nexo-profile-final.js?v=4.3-profile', '<script src="./nexo-profile-final.js?v=4.3-profile"></script>'],
  ['nexo-navigation-final.js?v=4.4-navigation', '<script src="./nexo-navigation-final.js?v=4.4-navigation"></script>'],
  ['nexo-micentro-fix.js?v=4.5-micentro', '<script src="./nexo-micentro-fix.js?v=4.5-micentro"></script>'],
  ['nexo-sesiones-fix.js?v=4.6-sesiones', '<script src="./nexo-sesiones-fix.js?v=4.6-sesiones"></script>']
];

for (const [marker, tag] of scripts) {
  if (!html.includes(marker)) {
    html = html.replace('</body>', `${tag}</body>`);
    if (!html.includes(marker)) throw new Error(`No se encontró </body> para integrar ${marker}`);
  }
}

fs.writeFileSync(file, html);
