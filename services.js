var config = require('./config');
var weather = require('weather');
var services = {};

services.getWeatherForCity = function (city, callback) {
  weather.error = function (msg) {
    console.log('Error getting weather for city %s: %s', city, msg);
    callback({
      status: 'error',
      errorMsg: msg
    });
  };
  weather({location: city, appid: config.yahooWeatherAppId, logging: true}, function(data) {
    data['status'] = 'success';
    callback(data);
  });
};

services.getCurrentDateTimeString = function () {
  return (new Date()).toString();
};

module.exports = services;
