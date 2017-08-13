var mqtt = require('mqtt');
var client = mqtt.connect('mqtt://test.mosquitto.org');


// When the connection is established
client.on('connect', function() {
  // Subscribe from MQTT topics
  client.subscribe('NXG/moocs/student_name/#');
})

// When we received messages from MQTT brokers
client.on('message', function(topic, message) {
  console.log("Topic: " + topic.toString());
  console.log("Message: " + message.toString() + "\n");
})
