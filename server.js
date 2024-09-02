const express = require('express');
const app = express();
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

// Chat data storage (temporary, will be replaced with a database)
const chats = [];
const messages = {};

// Handle WebSocket connections
wss.on('connection', (ws) => {
  console.log('Client connected');

  // Handle incoming messages
  ws.on('message', (message) => {
    console.log(`Received message: ${message}`);
    const messageData = JSON.parse(message);
    if (messageData.type === 'message') {
      // Broadcast message to all connected clients
      wss.clients.forEach((client) => {
        client.send(JSON.stringify(messageData));
      });
    } else if (messageData.type === 'newChat') {
      // Create a new chat
      const newChat = {
        id: chats.length + 1,
        name: messageData.chatName,
      };
      chats.push(newChat);
      // Broadcast new chat to all connected clients
      wss.clients.forEach((client) => {
        client.send(JSON.stringify({ type: 'newChat', chat: newChat }));
      });
    }
  });

  // Handle errors
  ws.on('error', (error) => {
    console.log('Error occurred');
    console.log(error);
  });

  // Handle disconnections
  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

// Handle HTTP requests
app.get('/chats', (req, res) => {
  res.json(chats);
});

app.post('/newChat', (req, res) => {
  const newChat = {
    id: chats.length + 1,
    name: req.body.chatName,
  };
  chats.push(newChat);
  res.json(newChat);
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});