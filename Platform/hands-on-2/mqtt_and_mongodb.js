var mqtt = require('mqtt');
var mongoose = require('mongoose');

var client = mqtt.connect('mqtt://test.mosquitto.org');
var Packet = require('./model/Packet');
mongoose.connect('mongodb://localhost/iotplatform');

// When the connection is established
client.on('connect', function() {
  // Subscribe from MQTT topics
  client.subscribe('NXG/moocs/student_name/#');
})

// When we received messages from MQTT brokers
client.on('message', function(topic, message) {
  json_packet = JSON.parse(message.toString());
  newDocument = new Packet(json_packet);
  newDocument.save(function(err, result) {
    console.log(result);
  });
})
