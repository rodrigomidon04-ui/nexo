const WebSocket = require('ws');
const http = require('http');

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Servidor de señalización NEXO funcionando correctamente.');
});

const wss = new WebSocket.Server({ server });

let clientes = [];

wss.on('connection', (socket) => {
  console.log('Nueva conexión establecida. Total conectados:', clientes.length + 1);

  clientes.push(socket);

  if (clientes.length === 2) {
    clientes.forEach((cliente, indice) => {
      cliente.send(JSON.stringify({
        tipo: 'listo-para-conectar',
        soyIniciador: indice === 1
      }));
    });
  }

  socket.on('message', (mensaje) => {
    clientes.forEach((cliente) => {
      if (cliente !== socket && cliente.readyState === WebSocket.OPEN) {
        cliente.send(mensaje.toString());
      }
    });
  });

  socket.on('close', () => {
    clientes = clientes.filter((cliente) => cliente !== socket);
    console.log('Conexión cerrada. Total conectados:', clientes.length);

    clientes.forEach((cliente) => {
      cliente.send(JSON.stringify({ tipo: 'compañero-desconectado' }));
    });
  });
});

server.listen(PORT, () => {
  console.log(`Servidor de señalización escuchando en el puerto ${PORT}`);
});

