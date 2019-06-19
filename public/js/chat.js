const socket = io();

// Elements 
const messageForm = document.getElementById('message-form');
const messageFormInput = messageForm.querySelector('input');
const messageFormButton = messageForm.querySelector('button');
const locationButton = document.getElementById('send-location');

socket.on('message', (message) => {
  console.log(message); 
})

messageForm.addEventListener('submit', e => {
  e.preventDefault();
  //disable
  messageFormButton.setAttribute('disabled', 'disabled')

  const messageInput = e.target.elements.message.value;
  
  socket.emit('sendMessage', messageInput, error => {
    //enable
    messageFormButton.removeAttribute('disabled');
    messageFormInput.value = '';
    messageFormInput.focus();
    if (error) {
      return console.log(error);
    } 

    console.log('message was delivered');
  });
});

locationButton.addEventListener('click', () => {
  if (!navigator.geolocation) {
    return alert('Geolation is not supported by your browser.');
  }

  navigator.geolocation.getCurrentPosition(position => {
    // console.log(`Location: ${position.coords.longitude} ${position.coords.latitude}`)
    socket.emit('sendLocation', {
      lat: position.coords.latitude,
      long: position.coords.longitude
    }, () => {
      console.log('Location shared');
    });
  });
});
