const express = require('express');
const app = express ();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const cors = require('cors');
const path = require('path');
const morgan = require('morgan');
const compression = require('compression');
const mongoose = require('mongoose');
const Message = require('./MessageModel').default;

const dev = app.get('env') !== 'production';

if (!dev) {
  app.disable('x-powered-by');
  app.use(compression());
  app.use(morgan('common'));
  app.use(express.static(path.join(__dirname, 'build')));
}

if (dev) {
  app.use(morgan('dev'));
}

server.listen(process.env.PORT || 8000);

io.on('connection', client => {
  // Receives client's message then sends to all except the sender
  client.on('message', data => {
    client.broadcast.emit('messageReceived', {name: data.name, message: data.message });
  })
});

// Database handling
const DB_PWD = process.env.DB_PWD;
const URI = `mongodb+srv://admin:${DB_PWD}@cluster0-08xi0.mongodb.net/chat?retryWrites=true&w=majority`;
mongoose.connect(URI, {useNewUrlParser: true});
mongoose.set('useCreateIndex', true);

app.use(express.json());
app.use(cors())

app.get('/messages', (req, res) => {
  Message.find({}).exec()
  .then(messages => {
    res.status(200).json(messages);
  })
  .catch(err => console.error(err))
})

app.post('/messages', (req, res) => {
  if (req.body.name && req.body.message) {
    const message = new Message({name: req.body.name, message: req.body.message});
    message.save();
    res.status(200).json(message);
  }
})