const fs = require('fs');
const path = require('path');

const file = path.join(process.cwd(), 'index.html');
let html = fs.readFileSync(file, 'utf8');

// Runtime funcional: salas, chat y módulos existentes.
// UI: un único controlador + ajustes finales de presentación.
const scripts = [
  ['nexo32.js?v=3.2', '<script src="./nexo32.js?v=3.2"></script>'],
  ['nexo33.js?v=3.3', '<script src="./nexo33.js?v=3.3"></script>'],
  ['nexo33134.js?v=3.4', '<script src="./nexo33134.js?v=3.4"></script>'],
  ['nexo-ui-controller.js?v=1.1.1', '<script src="./nexo-ui-controller.js?v=1.1.1"></script>'],
  ['nexo-ui-runtime-fix.js?v=1.0.1', '<script src="./nexo-ui-runtime-fix.js?v=1.0.1"></script>'],
  ['nexo-ui-final-adjustments.js?v=1.0.1', '<script src="./nexo-ui-final-adjustments.js?v=1.0.1"></script>']
];

for (const [marker, tag] of scripts) {
  if (!html.includes(marker)) {
    html = html.replace('</body>', `${tag}</body>`);
    if (!html.includes(marker)) {
      throw new Error(`No se encontró </body> para integrar ${marker}`);
    }
  }
}

fs.writeFileSync(file, html);
