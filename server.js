const express = require('express');
const WebSocket = require('ws');
const cors = require('cors');

const PORT = process.env.PORT || 3000;

const app = express();
app.use(cors()); // Enable CORS for all routes

const server = app.listen(PORT, () => {
  console.log('Server started on port 3000');
});

const wss = new WebSocket.Server({ server });
const connections = new Map();

wss.on('connection', (ws, req) => {
  const ip = req.connection.remoteAddress;
  connections.set(ws, ip);
  console.log(`New WebSocket connection from ${ip}. Online users: ${connections.size}`);

  ws.on('message', (message) => {
    console.log(`Received message from ${ip}: ${message}`);
  });

  ws.on('close', () => {
    connections.delete(ws);
    console.log(`WebSocket connection closed from ${ip}. Online users: ${connections.size}`);
  });
});

app.get('/onlineUsers', (req, res) => {
  res.json({ onlineUsers: connections.size });
});
