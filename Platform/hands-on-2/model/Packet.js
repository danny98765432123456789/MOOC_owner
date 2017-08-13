var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Packet = new Schema({
  src: Number,
  dest: Number,
  type: Number,
  rssi: Number,
  timestamp: Number
}, {
  versionKey: false
});

module.exports = mongoose.model('Packet', Packet);
