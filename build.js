const fs = require('fs');
const path = require('path');
const file = path.join(process.cwd(), 'index.html');
let html = fs.readFileSync(file, 'utf8');
const marker = 'nexo32.js?v=3.2';
if (!html.includes(marker)) {
  const tag = '<script src="./nexo32.js?v=3.2"></script>';
  html = html.replace('</body>', `${tag}</body>`);
  if (!html.includes(marker)) throw new Error('No se encontró </body> para integrar NEXO 3.2');
  fs.writeFileSync(file, html);
}
