const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  name: {type: String, required: true},
  message: {type: String, required: true}
})

exports.default = mongoose.model('Message', messageSchema);