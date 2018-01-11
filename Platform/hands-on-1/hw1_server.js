var mqtt = require('mqtt');
var mongoose = require('mongoose');

var client = mqtt.connect('mqtt://test.mosquitto.org');
var hw1 = require('./model/hw1');
mongoose.connect('mongodb://localhost/iotplatform');

// When the connection is established
client.on('connect', function() {
  // Subscribe from MQTT topics
  client.subscribe('NXG/+/+/homework');
})

// client.on('message', function(topic, message) {
//   console.log("Topic: " + topic.toString());
//   console.log("Message: " + message.toString() + "\n");
// })

// When we received messages from MQTT brokers
client.on('message', function(topic, message) {

  var content = {
    message: message.toString(),
    topic: topic.toString(),
    timestamp: +new Date()
  }

  json_packet = JSON.stringify(content);
  newDocument = new hw1(content);
  newDocument.save(function(err, result) {
    console.log(result);
  });
  // console.log("Topic: " + topic.toString());
  // console.log("Message: " + message.toString() + "\n");

  client.publish('NXG/hw1', json_packet, {
    retain: true
  });
})
