const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
// const hbs = require('hbs');
const Filter = require('bad-words');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;
const publicDirPath = path.join(__dirname, '../public');
// const viewsPath = path.join(__dirname, '../templates/views');

//set up handlebars engine
// app.set('view engine', 'hbs');
// app.set('views', viewsPath);

// Setup static dir to serve
app.use(express.static(publicDirPath));

io.on('connection', (socket) => {
  socket.emit('message', 'Welcome!');
  
  socket.on('sendMessage', (e, callback) => {
    const filter = new Filter();

    if(filter.isProfane(e)) {
      return callback('Profanity is not allowed!');
    }

    io.emit('message', e);
    callback();
  });

  socket.on('sendLocation', (e, callback) => {
    io.emit('locationMessage', `https://google.com/maps?q=${e.lat},${e.long}`);
    callback();
  })

  socket.io('disconnect', () => {
    io.emit('message', 'A user has left!');
  })
});

app.get('', (req, res) => {
  res.render('index');
})

server.listen(port, () => {
  console.log('Server is up')
});