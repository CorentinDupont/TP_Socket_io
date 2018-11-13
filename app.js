const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

io.on('connection', socket => {
  console.log('user connected : ', socket.id);
  socket.on('loaded', (data) => {
    console.log('data from client : ', data);
  })
  socket.on('message', message => {
    console.log('message received : ', message);
    socket.emit('message', {isMe: true, message, socketId:socket.id});
    socket.broadcast.emit('message', {isMe: false, message, socketId:socket.id});
  })
})

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
})

http.listen(3000, () => {
  console.log("Server is listening on http://localhost:3000");
})