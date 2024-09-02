// Get references to HTML elements
const newChatBtn = document.getElementById('new-chat-btn');
const newChatModal = document.querySelector('.new-chat-modal');
const newChatInput = document.getElementById('new-chat-input');
const createChatBtn = document.getElementById('create-chat-btn');
const chatListUl = document.getElementById('chat-list-ul');
const chatTitle = document.getElementById('chat-title');
const chatMessages = document.getElementById('chat-messages');
const messageInput = document.getElementById('message-input');
const sendBtn = document.getElementById('send-btn');

// Create a WebSocket connection to the server
const socket = new WebSocket('ws://localhost:8080');

// Function to create a new chat
function createNewChat() {
  const chatName = newChatInput.value.trim();
  if (chatName !== '') {
    socket.send(JSON.stringify({
      type: 'newChat',
      chatName: chatName,
    }));
    newChatModal.classList.add('hidden');
  }
}

// Function to send a new message
function sendMessage() {
  const messageText = messageInput.value.trim();
  if (messageText !== '') {
    socket.send(JSON.stringify({
      type: 'message',
      text: messageText,
      username: 'username', // TO DO: Get username from authentication
    }));
    messageInput.value = '';
  }
}

// Function to update the chat list
function updateChatList(chats) {
  chatListUl.innerHTML = '';
  chats.forEach((chat) => {
    const chatListItem = document.createElement('li');
    chatListItem.textContent = chat.name;
    chatListUl.appendChild(chatListItem);
  });
}

// Function to update the chat messages
function updateChatMessages(messages) {
  chatMessages.innerHTML = '';
  messages.forEach((message) => {
    const messageElement = document.createElement('div');
    messageElement.textContent = `${message.username}: ${message.text}`;
    chatMessages.appendChild(messageElement);
  });
}

// Handle WebSocket messages from the server
socket.onmessage = (event) => {
  const messageData = JSON.parse(event.data);
  if (messageData.type === 'newChat') {
    updateChatList([messageData.chat]);
  } else if (messageData.type === 'message') {
    updateChatMessages([messageData]);
  }
};

// Add event listeners
newChatBtn.addEventListener('click', () => {
  newChatModal.classList.remove('hidden');
});

createChatBtn.addEventListener('click', createNewChat);

sendBtn.addEventListener('click', sendMessage);

messageInput.addEventListener('keypress', (event) => {
  if (event.key === 'Enter') {
    sendMessage();
  }
});