const socket = io();

socket.on('message', (message) => {
  console.log(message);
})

// socket.on('clientMessage', (clientMessage) => {
//   console.log(clientMessage);
// })

document.getElementById('message-form').addEventListener('submit', e => {
  e.preventDefault();

  const messageInput = document.getElementById('message').value;

  socket.emit('sendMessage', messageInput);
})