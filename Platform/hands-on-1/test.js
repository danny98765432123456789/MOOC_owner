var plotly = require('plotly')("YOUR_ACCOUNT", "YOUR_KEY");

function draw() {
  var trace = {
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
  var data = [trace];
  var graphOptions = {
    filename: "basic-line",
    fileopt: "overwrite"
  };
  plotly.plot(data, graphOptions, function(err, msg) {
    console.log(msg);
  });
};
