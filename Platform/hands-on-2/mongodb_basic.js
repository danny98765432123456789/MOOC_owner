var mongoose = require('mongoose');
var Packet = require('./model/Packet');
mongoose.connect('mongodb://localhost/iotplatform');

// Find({  src: 4,  dest: 2});
// Remove({ src: 4, dest: 2} );
// Find({  src: 4,  dest: 2});
// Updata([{ src: 4 }, { dest: 100 }]);
Find({ dest: 100 });

//  Find
function Find(target) {
  Packet.find(target, function(err, result) {
    if (result) {
      console.log(result);
      console.log("Document numbers: " + result.length);
      mongoose.disconnect();
    } else {
      console.log("No matched document");
      mongoose.disconnect();
    }
  })
};


// Remove
function Remove(target) {
  Packet.findOne(target, function(err, result) {
    if (result) {
      result.remove(function() {
        console.log("Removed one document");
        mongoose.disconnect();
      });
    } else {
      console.log("No matched document");
      mongoose.disconnect();
    }
  })
};


// Update
function Updata(target) {
  Packet.findOne(target[0], function(err, result) {
    var key = Object.keys(target[1]).toString();
    var value = Object.values(target[1]);
    result[key] = value[0];
    result.save(function() {
      console.log("Done");
      mongoose.disconnect();
    });
  })
};
