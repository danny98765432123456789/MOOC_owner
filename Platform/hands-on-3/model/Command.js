var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Command = new Schema({
  dest: Number,
  type: Number,
  cmd: String,
  timestamp: Number
}, {
  versionKey: false
});

module.exports = mongoose.model('Command', Command);
