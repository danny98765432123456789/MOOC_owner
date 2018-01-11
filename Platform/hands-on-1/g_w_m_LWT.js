var SerialPort = require('virtual-serialport');
var VirtualModule = require('../util/virtual_module');
var mqtt = require('mqtt');
var md5 = require('md5');
// var client = mqtt.connect('mqtt://test.mosquitto.org');
var client = mqtt.connect('mqtt://test.mosquitto.org', {
  // cmd: 'connect',
  // protocolId: 'MQTT'
  protocolVersion: 4,
  clientId: "123",
  keepalive: 3000,
  // reconnectPeriod: 60000,
  connectTimeout: 30 * 1000,
  will: {
    topic: 'NXG/your_name/your_account/homework',
    payload: 'The gateway is no longer on-line.'
  }
})
var sp = new SerialPort('VIRTUAL_COMPORT', {
  baudrate: 57600
});
// USART Packet Simulator
VirtualModule.start(sp);

// mqtt.connect('mqtts://test.mosquitto.org'})

// Your code:
// ----------------------------------------------------------
// client.options.reconnectPeriod = 20000;
// When the connection is established (Hands-on 3)
// client.on('connect', function() {
// Subscribe from MQTT topics
// client.subscribe('NXG/moocs/student_name/#');
// client.subscribe('123/123');

// console.log("Ready to subscribe NXG/moocs/student_name/#");
// client.subscribe('NXG/moocs/gateway_id/student_name/cmd');
// console.log("Ready to subscribe NXG/moocs/gateway_id/student_name/cmd");
// var options = {
//                 timeout: 30,                       //seconds
//                 keepAliveInterval: 60,
//                 onSuccess: this.onConnect,
//                 onFailure: this.onFail
//         };
// this.client.connect(options);
// })

// When we received messages from MQTT brokers
// client.on('message', function(topic, message) {
//   console.log("Topic: " + topic.toString());
//   console.log("Message: " + message.toString() + "\n");
// })

// When we received data from the serial-port
sp.on("data", function(data) {

  // Transform the packet from String to ASCII-code
  var packet = [];
  for (var i = 0; i < data.length; i++) {
    packet.push(data.charCodeAt(i));
  }

  // Transform the packet to a JavaScript Object
  var object_msg = {
    src: packet[0] * 256 + packet[1],
    dest: packet[2] * 256 + packet[3],
    type: packet[4],
    rssi: packet[5],
    timestamp: +new Date()
  };
  var json_msg = JSON.stringify(object_msg);

  console.log(json_msg);

  // Publish to MQTT topics

  client.publish('NXG/moocs/student_name/' + md5(object_msg.src));

  // client.publish('NXG/moocs/student_name/' + md5(json_msg.src), JSON.stringify(json_msg));
});
