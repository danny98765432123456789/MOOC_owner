var SerialPort = require('virtual-serialport');
var sp = new SerialPort('VIRTUAL_COMPORT', {
  baudrate: 57600
});

// USART Packet Simulator
var VirtualModule = require('../util/virtual_module');
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
  // Print the packet received
  console.log("Packet received: " + packet);
});
