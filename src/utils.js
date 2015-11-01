var http = require('http');
var https = require('https');

var utils = {};

// http://stackoverflow.com/a/9577651 (HTTP GET Request in Node.js Express)
utils.getHttp = function(options, onResult, onError) {
  var protocol = options.port == 443 ? https : http;
  var req = protocol.request(options, function(res) {
    var output = '';
    //console.log(options.host + ':' + res.statusCode);
    res.setEncoding('utf8');

    res.on('data', function (chunk) {
      output += chunk;
    });

    res.on('end', function() {
      //var obj = JSON.parse(output);
      onResult(res.statusCode, output);
    });
  });

  req.on('error', function(err) {
    onError(err.message);
  });

  req.end();
};

module.exports = utils;
