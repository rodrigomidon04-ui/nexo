const fs = require('fs');
const path = require('path');
const file = path.join(process.cwd(), 'index.html');
let html = fs.readFileSync(file, 'utf8');

const scripts = [
  ['nexo32.js?v=3.2', '<script src="./nexo32.js?v=3.2"></script>'],
  ['nexo33.js?v=3.3', '<script src="./nexo33.js?v=3.3"></script>']
];

for (const [marker, tag] of scripts) {
  if (!html.includes(marker)) {
    html = html.replace('</body>', `${tag}</body>`);
    if (!html.includes(marker)) throw new Error(`No se encontró </body> para integrar ${marker}`);
  }
}

fs.writeFileSync(file, html);
