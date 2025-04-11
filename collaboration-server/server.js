const WebSocket = require('ws');
const http = require('http');
const { setupWSConnection } = require('y-websocket/bin/utils');

const server = http.createServer((request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/plain' });
  response.end('WebSocket server for Umo Editor collaboration');
});

const wss = new WebSocket.Server({ server });

wss.on('connection', (conn, req) => {
  setupWSConnection(conn, req, { docName: req.url.slice(1).split('?')[0] || 'default-document' });
  
  conn.on('close', () => {
    console.log('Connection closed');
  });
});

const PORT = process.env.PORT || 1234;
server.listen(PORT, () => {
  console.log(`WebSocket server is running on port ${PORT}`);
});
