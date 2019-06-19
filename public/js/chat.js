const socket = io();

socket.on('message', (message) => {
  console.log(message);
})

document.getElementById('message-form').addEventListener('submit', e => {
  e.preventDefault();
  const messageInput = e.target.elements.message.value;
  socket.emit('sendMessage', messageInput);
})