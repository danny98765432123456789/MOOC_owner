var mqtt = require('mqtt');
var md5 = require('md5');
var SerialPort = require('virtual-serialport');
var VirtualModule = require('../util/virtual_module');
var plotly = require('plotly')("danny98765432123456789", "Ede5PF6OJWVgqxHfu0jJ");
var sleep = require('sleep');


var client = mqtt.connect('mqtt://test.mosquitto.org')
var sp = new SerialPort('VIRTUAL_COMPORT', {
  baudrate: 57600
});

var A2_rssi_array = [];
var A3_rssi_array = [];
var A5_rssi_array = [];
var A2_rssi;
var A3_rssi;
var A5_rssi;
var A2_dist;
var A3_dist;
var A5_dist;
var A2_x = 5;
var A2_y = 0;
var A3_x = 0;
var A3_y = 10;
var A5_x = 10;
var A5_y = 10;
var D1_x, D1_y;
var D1_x_array = [],
  D1_y_array = [];

// USART Packet Simulator
VirtualModule.start(sp);

// Your code:
// ----------------------------------------------------------

// When the connection is established (Hands-on 3)
client.on('connect', function() {
  // Subscribe from MQTT topics
  client.subscribe('NXG/moocs/student_name/#');
  // client.subscribe('NXG/moocs/gateway_id/student_name/cmd');
})

// When we received messages from MQTT brokers
client.on('message', function(topic, message) {
  // console.log("Topic: " + topic.toString());
  // console.log("Message: " + message.toString() + "\n");
  if (JSON.parse(message.toString()).src == 1) {
    if (JSON.parse(message.toString()).dest == 2) {
      if (A2_rssi_array.length <= 40) {
        A2_rssi_array.push(JSON.parse(message.toString()).rssi);
      }
    } else if (JSON.parse(message.toString()).dest == 3) {
      if (A3_rssi_array.length <= 40) {
        A3_rssi_array.push(JSON.parse(message.toString()).rssi);
      }
    } else if (JSON.parse(message.toString()).dest == 5) {
      if (A5_rssi_array.length <= 40) {
        A5_rssi_array.push(JSON.parse(message.toString()).rssi);
      }
    }
  }
  // console.log(JSON.parse(message.toString()));
})
Array.prototype.sum = Array.prototype.sum || function() {
  return this.reduce(function(p, c) {
    return p + c
  }, 0);
};
Array.prototype.avg = Array.prototype.avg || function() {
  return this.sum() / this.length;
};
setTimeout(function() {

  A2_rssi = A2_rssi_array.avg();
  A3_rssi = A3_rssi_array.avg();
  A5_rssi = A5_rssi_array.avg();
  A2_dist = Math.pow(10, ((205 - A2_rssi) / 40));
  A3_dist = Math.pow(10, ((205 - A3_rssi) / 40));
  A5_dist = Math.pow(10, ((205 - A5_rssi) / 40));
  console.log("The distance between Device 1 and Anchor 2 is : " + A2_dist);
  console.log("The distance between Device 1 and Anchor 3 is : " + A3_dist);
  console.log("The distance between Device 1 and Anchor 5 is : " + A5_dist);
  var temptop_y = ((A2_dist * A2_dist - A3_dist * A3_dist) - (A2_x * A2_x - A3_x * A3_x) - (A2_y * A2_y - A3_y * A3_y)) + ((A5_x * A5_x - A3_x * A3_x) + (A5_y * A5_y - A3_y * A3_y) - (A5_dist * A5_dist - A3_dist * A3_dist)) * (((A3_x - A2_x) / (A3_x - A5_x)));
  var tempdown_y = ((A3_y - A2_y) * 2) - ((A3_y - A5_y) * 2) * ((A3_x - A2_x) / (A3_x - A5_x));
  D1_y = temptop_y / tempdown_y;
  D1_x = ((A5_dist * A5_dist - A3_dist * A3_dist) - (A5_x * A5_x - A3_x * A3_x) - (A5_y * A5_y - A3_y * A3_y) - (2 * D1_y) * (A3_y - A5_y)) / (2 * A3_x - 2 * A5_x);
  console.log("Device 1 is on : ( " + D1_x + " , " + D1_y + " )");

  D1_y_array.push(D1_y);
  console.log(D1_y_array);
  D1_x_array.push(D1_x);
  console.log(D1_x_array);

  draw(D1_x_array, D1_y_array);

}, 60000);

function draw(D1_x_array, D1_y_array) {

  var trace = {
    x: D1_x_array,
    y: D1_y_array,
    mode: "markers",
    type: "scatter"
  };
  var data = [trace];
  var graphOptions = {
    filename: "basic-line",
    fileopt: "overwrite"
  };
  plotly.plot(data, graphOptions, function(err, msg) {
    console.log(msg);
  });
  sleep.sleep(20);
};

// When we received data from the serial-port
sp.on("data", function(data) {
  // Transform the packet from String to ASCII-code
  var packet = [];
  for (var i = 0; i < data.length; i++) {
    packet.push(data.charCodeAt(i));
  }

  // Transform the packet to a JavaScript Object
  var json_msg = {
    src: packet[0] * 256 + packet[1],
    dest: packet[2] * 256 + packet[3],
    type: packet[4],
    rssi: packet[5],
    timestamp: +new Date()
  };

  // if(json_msg.src == 6 ){
  // Publish to MQTT topics
  client.publish('NXG/moocs/student_name/' + md5(json_msg.src), JSON.stringify(json_msg));
  // }
});
