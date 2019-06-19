const socket = io();

socket.on('message', (message) => {
  console.log(message);
})

document.getElementById('message-form').addEventListener('submit', e => {
  e.preventDefault();

  const messageInput = e.target.elements.message.value;
  
  socket.emit('sendMessage', messageInput, (message) => {
    console.log('message was delivered');
  });
});

document.getElementById('send-location').addEventListener('click', () => {
  if (!navigator.geolocation) {
    return alert('Geolation is not supported by your browser.');
  }

  navigator.geolocation.getCurrentPosition(position => {
    // console.log(`Location: ${position.coords.longitude} ${position.coords.latitude}`)
    socket.emit('sendLocation', {
      lat: position.coords.latitude,
      long: position.coords.longitude
    });
  });
});
