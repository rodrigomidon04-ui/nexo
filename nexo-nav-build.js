const fs = require('fs');
const path = require('path');
const file = path.join(process.cwd(), 'index.html');
let html = fs.readFileSync(file, 'utf8');
const tag = '<script src="./nexo-nav.js?v=3.3-nav"></script>';
if (!html.includes('nexo-nav.js?v=3.3-nav')) {
  const marker = '</body>';
  if (!html.includes(marker)) throw new Error('No se encontró </body> en index.html');
  html = html.replace(marker, `${tag}${marker}`);
  fs.writeFileSync(file, html);
}
