const express = require('express');
const WebSocket = require('ws');
const cors = require('cors');

const app = express();
app.use(cors()); // Enable CORS for all routes

const server = app.listen(3000, () => {
  console.log('Server started on port 3000');
});

const wss = new WebSocket.Server({ server });
let onlineUsers = 0;
const connections = new Set();

wss.on('connection', (ws, req) => {
  // Store the IP address to prevent duplicate connections
  const ip = req.connection.remoteAddress;

  if (connections.has(ip)) {
    ws.terminate(); // Close the WebSocket connection if already connected
    return;
  }

  connections.add(ip);
  onlineUsers++;
  console.log(`New WebSocket connection from ${ip}. Online users: ${onlineUsers}`);

  ws.on('close', () => {
    connections.delete(ip);
    onlineUsers--;
    console.log(`WebSocket connection closed from ${ip}. Online users: ${onlineUsers}`);
  });
});

app.get('/onlineUsers', (req, res) => {
  res.json({ onlineUsers });
});
