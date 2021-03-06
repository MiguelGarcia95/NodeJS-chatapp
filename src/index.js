const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const Filter = require('bad-words');
const {generateMessage} = require('./utils/messages');
const {addUser, removeUser, getUser, getUsersInRoom} = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;
const publicDirPath = path.join(__dirname, '../public');

// Setup static dir to serve
app.use(express.static(publicDirPath));

io.on('connection', (socket) => {

  socket.on('join', (options, callback) => {
    const {error, user} = addUser({id: socket.id, ...options});

    if (error) {
      return callback(error);
    }

    socket.join(user.room);

    socket.emit('message',  generateMessage('Welcome!', 'Admin'));
    socket.broadcast.to(user.room).emit('message', generateMessage(`${user.username} has joined!`, 'Admin'));
    io.to(user.room).emit('roomData', {
      room: user.room,
      users: getUsersInRoom(user.room)
    });

    callback();
  })
  
  socket.on('sendMessage', (message, callback) => {
    const filter = new Filter();
    const user = getUser(socket.id);

    if(filter.isProfane(message)) {
      return callback('Profanity is not allowed!');
    }

    io.to(user.room).emit('message', generateMessage(message, user.username));
    callback();
  });

  socket.on('sendLocation', (e, callback) => {
    const user = getUser(socket.id);

    io.to(user.room).emit('locationMessage', generateMessage(`https://google.com/maps?q=${e.lat},${e.long}`, user.username));
    callback();
  })

  socket.on('disconnect', () => {
    const user = removeUser(socket.id);

    if (user) {
      io.to(user.room).emit('message', generateMessage(`${user.username} has left!`, 'Admin'));
      io.to(user.room).emit('roomData', {
        room: user.room,
        users: getUsersInRoom(user.room)
      });
    }
  })
});

app.get('', (req, res) => {
  res.render('index');
})

server.listen(port, () => {
  console.log('Server is up')
});