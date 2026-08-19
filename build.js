const fs = require('fs');
const path = require('path');
const file = path.join(process.cwd(), 'index.html');
let html = fs.readFileSync(file, 'utf8');

const scripts = [
  ['nexo32.js?v=3.2', '<script src="./nexo32.js?v=3.2"></script>'],
  ['nexo33.js?v=3.3', '<script src="./nexo33.js?v=3.3"></script>'],
  ['nexo33134.js?v=3.4', '<script src="./nexo33134.js?v=3.4"></script>'],
  ['nexo-nav.js?v=3.3-nav4', '<script src="./nexo-nav.js?v=3.3-nav4"></script>'],
  ['nexo-layout.js?v=3.4-layout', '<script src="./nexo-layout.js?v=3.4-layout"></script>'],
  ['nexo-nav-fix.js?v=3.4-navfix', '<script src="./nexo-nav-fix.js?v=3.4-navfix"></script>'],
  ['nexo-ux-fix.js?v=3.4-ux2', '<script src="./nexo-ux-fix.js?v=3.4-ux2"></script>']
];

for (const [marker, tag] of scripts) {
  if (!html.includes(marker)) {
    html = html.replace('</body>', `${tag}</body>`);
    if (!html.includes(marker)) throw new Error(`No se encontró </body> para integrar ${marker}`);
  }
}

fs.writeFileSync(file, html);
