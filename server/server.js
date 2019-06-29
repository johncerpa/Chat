const io = require('socket.io')();

const PORT = process.env.PORT || 8000;
io.listen(PORT);

console.log(`Server listening on port ${PORT}`);

io.on('connection', client => {
  console.log('A new client connected to the server');

  // Receives client's message then sends to all except the sender
  client.on('message', data => {
    client.broadcast.emit('messageReceived', {name: data.name, message: data.message });
  })

})