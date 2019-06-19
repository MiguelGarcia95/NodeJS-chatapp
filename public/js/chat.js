const socket = io();

socket.on('message', (message) => {
  console.log(message);
})

socket.on('clientMessage', (clientMessage) => {
  console.log(clientMessage);
})

const messageInput = document.getElementById('message');
const submit = document.getElementById('send');

submit.addEventListener('click', () => {
  socket.emit('sendMessage', messageInput.value);
});