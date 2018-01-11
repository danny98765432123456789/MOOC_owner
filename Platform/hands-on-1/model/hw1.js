var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var hw1 = new Schema({
  topic: String,
  message: String,
  timestamp: Number
}, {
  versionKey: false
});

module.exports = mongoose.model('hw1', hw1);
