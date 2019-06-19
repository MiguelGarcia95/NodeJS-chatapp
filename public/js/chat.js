const socket = io();

// Elements 
const messageForm = document.getElementById('message-form');
const messageFormInput = messageForm.querySelector('input');
const messageFormButton = messageForm.querySelector('button');
const locationButton = document.getElementById('send-location');
const messages = document.getElementById('messages');

// Templates
const messageTemplate = document.getElementById('message-template').innerHTML;
const locationMessageTemplate = document.getElementById('location-message-template').innerHTML;

// Options 
const {username, room} = Qs.parse(location.search, {ignoreQueryPrefix: true});

socket.on('message', (message) => {
  console.log(message); 
  const html = Mustache.render(messageTemplate, {
    message: message.text,
    createdAt: moment(message.createdAt).format('h:mm a'),
    username:message.username
  });
  messages.insertAdjacentHTML('beforeend', html);
})

socket.on('locationMessage', (url) => {
  console.log(url); 
  const html = Mustache.render(locationMessageTemplate, {
    url: url.text,
    createdAt: moment(url.createdAt).format('h:mm a'),
    username:url.username
  });
  messages.insertAdjacentHTML('beforeend', html);
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

  locationButton.setAttribute('disabled', 'disabled');
  navigator.geolocation.getCurrentPosition(position => {
    // console.log(`Location: ${position.coords.longitude} ${position.coords.latitude}`)
    socket.emit('sendLocation', {
      lat: position.coords.latitude,
      long: position.coords.longitude
    }, () => {
      console.log('Location shared');
      locationButton.removeAttribute('disabled');
    });
  });
});
 
socket.emit('join', {username, room}, (error) => {
  if (error) {
    alert(error);
    location.href = '/';
  }
});