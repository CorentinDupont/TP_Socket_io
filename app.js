const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

let users = {}

io.on('connection', socket => {
  console.log('user connected : ', socket.id);

  io.clients( (err, clients) => {
    if(err){
      console.error(err);
    }else{
      clients.forEach(socketId => {
        if(!users[socketId]){
          users[socketId] = {socketId, name:`Anonyme ${Object.keys(users).length}`}
        }
      });
      io.emit('clients', {clients, users});
    }
  });

  // On client loaded
  socket.on('loaded', (data) => {
    console.log('data from client : ', data);
  })

  // On receive message
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