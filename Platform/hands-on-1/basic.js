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
  console.log(data);
});




var contents = fs.readFileSync('/filename');
console.log(contents);
console.log('Do something else');

fs.readFile('/filename',function(err, contents){
  console.log(contents);
});
console.log('Do something else');
