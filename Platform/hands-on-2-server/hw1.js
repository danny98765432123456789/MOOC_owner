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

// client.on('message', function(topic, message) {
//   console.log("Topic: " + topic.toString());
//   console.log("Message: " + message.toString() + "\n");
// })

// When we received messages from MQTT brokers
client.on('message', function(topic, message) {
  // console.log("Topic: " + topic.toString());
  // console.log("Message: " + message.toString() + "\n");
  json_packet = JSON.parse(message.toString());
  newDocument = new Packet(json_packet);
  newDocument.save(function(err, result) {
    console.log(result);
  });

  var object_msg = {
    topic: topic.toString(),
    message: message.toString()
    timestamp: +new Date()
  };
  var json_msg = JSON.stringify(object_msg);

  console.log(json_msg);

  // Publish to MQTT topics

  client.publish('NXG/moocs/student_name/' + md5(object_msg.src), json_msg, {
    retain: true
  });
})
