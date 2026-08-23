const fs = require('fs');
const path = require('path');
const file = path.join(process.cwd(), 'index.html');
let html = fs.readFileSync(file, 'utf8');

const scripts = [
  ['nexo-v9-assistant.js?v=9.0', '<script src="./nexo-v9-assistant.js?v=9.0"></script>'],
  ['nexo-v10-actions.js?v=10.0', '<script src="./nexo-v10-actions.js?v=10.0"></script>'],
  ['nexo-v11-voice.js?v=11.0', '<script src="./nexo-v11-voice.js?v=11.0"></script>']
];

for (const [marker, tag] of scripts) {
  if (!html.includes(marker)) {
    if (!html.includes('</body>')) throw new Error(`No se encontró </body> para integrar ${marker}`);
    html = html.replace('</body>', `${tag}</body>`);
  }
}

fs.writeFileSync(file, html);
