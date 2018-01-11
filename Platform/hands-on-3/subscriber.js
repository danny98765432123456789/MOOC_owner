// 223954713b
// 1m3ck9
var mqtt = require('mqtt');
// var mongoose = require('mongoose');

var client = mqtt.connect('mqtt://test.mosquitto.org');
// var Packet = require('./model/Packet');
// mongoose.connect('mongodb://localhost/iotplatform');

// When the connection is established
client.on('connect', function() {
  // Subscribe from MQTT topics
  client.subscribe('NXG/moocs/gateway_id/student_name/cmd');
})

// client.on('message', function(topic, message) {
//   console.log("Topic: " + topic.toString());
//   console.log("Message: " + message.toString() + "\n");
// })

// When we received messages from MQTT brokers
client.on('message', function(topic, message) {


  // console.log("Topic: " + topic.toString());
  console.log("Message: " + message.toString() + "\n");
})
