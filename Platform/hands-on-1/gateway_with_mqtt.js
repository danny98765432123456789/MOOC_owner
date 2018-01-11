var mqtt = require('mqtt');
var md5 = require('md5');
var SerialPort = require('virtual-serialport');
var VirtualModule = require('../util/virtual_module');
var client = mqtt.connect('mqtt://test.mosquitto.org');
var sp = new SerialPort('VIRTUAL_COMPORT', {
  baudrate: 57600
});
// USART Packet Simulator
VirtualModule.start(sp);
// Your code:
// ----------------------------------------------------------

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
  client.publish('NXG/moocs/student_name/' + md5(object_msg.src), json_msg, {
    retain: true
  });
});
