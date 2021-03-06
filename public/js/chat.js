const socket = io();

// Elements 
const messageForm = document.getElementById('message-form');
const messageFormInput = messageForm.querySelector('input');
const messageFormButton = messageForm.querySelector('button');
const locationButton = document.getElementById('send-location');
const messages = document.getElementById('messages');
const sidebar = document.getElementById('sidebar');

// Templates
const messageTemplate = document.getElementById('message-template').innerHTML;
const locationMessageTemplate = document.getElementById('location-message-template').innerHTML;
const sidebarTemplate = document.getElementById('sidebar-template').innerHTML;

// Options 
const {username, room} = Qs.parse(location.search, {ignoreQueryPrefix: true});

const autoScroll = () => {
  // new message elemnt
  const newMessage = messages.lastElementChild;

  // Height of the new message
  const newMessagesStyles = getComputedStyle(newMessage);
  const newMessageMargin = parseInt(newMessagesStyles.marginBottom);
  const newMessageHeight = newMessage.offsetHeight + newMessageMargin;

  // Visible Height
  const visibleHeight = messages.offsetHeight;

  // Height of messages container
  const containerHeight = messages.scrollHeight;

  //How far has been scrolled
  const scrollOffset = messages.scrollTop + visibleHeight;

  if (containerHeight - newMessageHeight < scrollOffset) {
    messages.scrollTop = messages.scrollHeight
  }
}

socket.on('message', (message) => {
  console.log(message); 
  const html = Mustache.render(messageTemplate, {
    message: message.text,
    createdAt: moment(message.createdAt).format('h:mm a'),
    username:message.username
  });
  messages.insertAdjacentHTML('beforeend', html);
  autoScroll();
})

socket.on('locationMessage', (url) => {
  console.log(url); 
  const html = Mustache.render(locationMessageTemplate, {
    url: url.text,
    createdAt: moment(url.createdAt).format('h:mm a'),
    username:url.username
  });
  messages.insertAdjacentHTML('beforeend', html);
  autoScroll();
})

socket.on('roomData', ({room, users}) => {
  const html = Mustache.render(sidebarTemplate, {
    room,
    users
  });
  sidebar.innerHTML = html
  // Or
  // sidebar.insertAdjacentHTML('beforeend', html);

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