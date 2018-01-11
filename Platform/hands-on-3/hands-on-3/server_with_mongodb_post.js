var mongoose = require('mongoose');
var mqtt = require('mqtt');
var bodyParser = require('body-parser');
var express = require('express');

var app = express();
var client = mqtt.connect('mqtt://test.mosquitto.org');
var parseUrlencoded = bodyParser.urlencoded({ extended: false });

var Packet = require('./model/Packet');
var Command = require('./model/Command');
mongoose.connect('mongodb://localhost/iotplatform');


// app.all('*', function(req, res, next) {
//    res.header('Access-Control-Allow-Origin', '*');
//    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
//    res.header('Access-Control-Allow-Headers', 'Content-Type');
//    next();
//  });

app.use(express.static('./front_end'));


app.get('/', function(request, response) {
  response.send("Hello World!");
});

app.get('/packets', function(request, response) {
  Packet.find(function(err, result) {
    response.send(result);
  })
});

app.get('/packets/:src', function(request, response) {
  Packet.find({
    src: request.params.src
  }, function(err, result) {
    response.send(result);
  })
});

app.get('/rssis', function(request, response) {
  var myQuery = {};
  if (request.query.src) {
    myQuery.src = request.query.src;
  }
  if (request.query.dest) {
    myQuery.dest = request.query.dest;
  }

  Packet.find(myQuery, function(err, result) {
    var rssiList = result.map(function(packet) {
      // return packet.rssi;
      return [packet.rssi, new Date(packet.timestamp)];
    });
    response.send(rssiList);
  })
});

app.get('/cmd', function(request, response) {
  Command.find({

  }, function(err, result) {
    response.send(result);
  })
});

app.post('/cmd/:device', parseUrlencoded, function(request, response) {
  var jsonCMD = {
    dest: request.params.device,
    type: 2,
    cmd: request.body.command
  }
  console.log(request.body);
  client.publish('NXG/moocs/gateway_id/student_name/cmd', JSON.stringify(jsonCMD));

  jsonCMD.timestamp = +new Date();
  newCMD = new Command(jsonCMD);
  // console.log(jsonCMD);
  newCMD.save(function(err) {
    if (!err) {
      response.send("Success!");
    }
    else{
      console.log(err);
    }
  });
})


app.listen(3000, function(request, response) {
  console.log('Listening on port 3000!');
});
