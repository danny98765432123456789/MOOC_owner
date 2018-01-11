var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Student_log = new Schema({
  Name: String,
  Account: String,
  Answer1: String,
  Answer2: String,
  Answer3: String,
  Score: Number,
  timestamp: Number
}, {
  versionKey: false
});

module.exports = mongoose.model('student_log', Student_log);
