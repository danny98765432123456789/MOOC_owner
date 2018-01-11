var mqtt = require('mqtt');
var bodyParser = require('body-parser');
var express = require('express');
var mongoose = require('mongoose');
var app = express();
var client = mqtt.connect('mqtt://test.mosquitto.org');
var parseUrlencoded = bodyParser.urlencoded({ extended: false });

// var Packet = require('./model/Packet');
var Command = require('./model/Command');
var Student_log = require('./model/Student_log');
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

app.get('/Student_log', function(request, response) {
  Student_log.find(function(err, result) {
    response.send(result);
  })
});

app.post('/Student_log', parseUrlencoded, function(request, response) {
  var json = {
    Name: request.body.Name,
    Account: request.body.Account,
    Answer1: request.body.Answer1,
    Answer2: request.body.Answer2,
    Answer3: request.body.Answer3,
    Score: request.body.Score
  }
  console.log(request.body);
  // client.publish('NXG/moocs/gateway_id/student_name/cmd', JSON.stringify(jsonCMD));

  json.timestamp = +new Date();
  newjson = new Student_log(json);
  // console.log(jsonCMD);
  newjson.save(function(err) {
    if (!err) {
      response.send("Success!");
    }
    else{
      console.log(err);
    }
  });
})
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
