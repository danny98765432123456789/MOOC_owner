var mqtt = require('mqtt');
var md5 = require('md5');
var SerialPort = require('virtual-serialport');
var VirtualModule = require('../util/virtual_module');
// var Math = require("Math");
var sleep = require('sleep');
var plotly = require('plotly')("danny98765432123456789", "Ede5PF6OJWVgqxHfu0jJ");
var schedule = require('node-schedule');

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
var D6_x, D6_y;
var D6_x_array = [],
  D6_y_array = [];
var length = 3000;
var timeout = 120000;


// USART Packet Simulator
VirtualModule.start(sp);
client.on('connect', function() {
  // Subscribe from MQTT topics
  // console.log("test");
  console.log("Start to subscribe NXG/moocs/student_name/#");
  client.subscribe('NXG/moocs/student_name/#');
  // client.subscribe('NXG/moocs/gateway_id/student_name/cmd');
})

// Your code:
// ----------------------------------------------------------

// When the connection is established (Hands-on 3)


// When we received messages from MQTT brokers
// setInterval(function() {

// var rule = new schedule.RecurrenceRule();
// rule.second = [0, 10, 20, 30, 40, 50];

// var j = schedule.scheduleJob(rule, function() {


client.on('message', function(topic, message) {
  // console.log("Topic: " + topic.toString());
  // console.log("Message: " + message.toString() + "\n");
  // console.log("Fetching the data");
  fetch_data(message);
})
console.log("Wait for "+timeout/1000+" seconds ");
setTimeout(function() {
  console.log("Start to calculate the coordinate");
  calculation();
}, timeout);

function draw(D6_x_array, D6_y_array) {

  var trace1 = {
    x: D6_x_array,
    y: D6_y_array,
    mode: "markers",
    type: "scatter"
  };
  var trace2 = {
    x: [5, 0, 10],
    y: [0, 10, 10],
    mode: "markers",
    type: "scatter",
    marker: {
      color: "rgb(164, 194, 244)",
      size: 12,
      line: {
        color: "white",
        width: 0.5
      }
    }
  };
  var data = [trace1, trace2];
  var graphOptions = {
    filename: "basic-line",
    fileopt: "overwrite"
  };
  plotly.plot(data, graphOptions, function(err, msg) {
    console.log(msg);
  });
  // sleep.sleep(20);
};

function calculation() {
  // console.log(A2_rssi_array.avg());
  // console.log(A3_rssi_array.avg());
  // console.log(A5_rssi_array.avg());
  // A2_rssi = A2_rssi_array.avg();
  // A3_rssi = A3_rssi_array.avg();
  // A5_rssi = A5_rssi_array.avg();
  // console.log(A2_rssi_array);
  for (i = 0; i <= length; i++) {
    A2_dist = Math.pow(10, ((205 - A2_rssi_array[i]) / 40));
    A3_dist = Math.pow(10, ((205 - A3_rssi_array[i]) / 40));
    A5_dist = Math.pow(10, ((205 - A5_rssi_array[i]) / 40));

    var temptop_y = ((A2_dist * A2_dist - A3_dist * A3_dist) - (A2_x * A2_x - A3_x * A3_x) - (A2_y * A2_y - A3_y * A3_y)) + ((A5_x * A5_x - A3_x * A3_x) + (A5_y * A5_y - A3_y * A3_y) - (A5_dist * A5_dist - A3_dist * A3_dist)) * (((A3_x - A2_x) / (A3_x - A5_x)));
    var tempdown_y = ((A3_y - A2_y) * 2) - ((A3_y - A5_y) * 2) * ((A3_x - A2_x) / (A3_x - A5_x));

    D6_y = temptop_y / tempdown_y;
    D6_x = ((A5_dist * A5_dist - A3_dist * A3_dist) - (A5_x * A5_x - A3_x * A3_x) - (A5_y * A5_y - A3_y * A3_y) - (2 * D6_y) * (A3_y - A5_y)) / (2 * A3_x - 2 * A5_x);
    // console.log("Device 6 is on : ( " + D6_x + " , " + D6_y + " )");

    D6_y_array.push(D6_y);
    D6_x_array.push(D6_x);
    // console.log(D6_x_array);
  }
  draw(D6_x_array, D6_y_array);
};

function fetch_data(message) {
  if (JSON.parse(message.toString()).src == 6) {

    // console.log(JSON.parse(message.toString()));
    if (JSON.parse(message.toString()).dest == 2) {
      if (A2_rssi_array.length <= length) {
        A2_rssi_array.push(JSON.parse(message.toString()).rssi);
        // console.log("2: " + A2_rssi_array);
      }
    } else if (JSON.parse(message.toString()).dest == 3) {
      if (A3_rssi_array.length <= length) {
        A3_rssi_array.push(JSON.parse(message.toString()).rssi);
        // console.log("3: " + A3_rssi_array);
      }
      return message;
    } else if (JSON.parse(message.toString()).dest == 5) {
      if (A5_rssi_array.length <= length) {
        A5_rssi_array.push(JSON.parse(message.toString()).rssi);
      }
      return message;
    }
  }
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
