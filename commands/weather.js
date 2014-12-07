var weather = require('weather');
var yahooWeatherAppId = require('../config').yahooWeatherAppId;

var getWeatherForCity = function (city, callback) {
  weather.error = function (msg) {
    console.log('Error getting weather for city %s: %s', city, msg);
    callback({
      status: 'error',
      errorMsg: msg
    });
  };
  weather({location: city, appid: yahooWeatherAppId, logging: true}, function(data) {
    data['status'] = 'success';
    callback(data);
  });
};

module.exports = function (registerCommand) {
  registerCommand(
    'weather',
    'weather <city>: Get the current weather for city',
    function (groupLocalID, userDisplayName, msgTokens, callback) {
      var city = msgTokens[0];
      if (city) {
        getWeatherForCity(city, function (data) {
          if (data.status == 'success') {
            callback('The current temperature in ' + city + ' is ' + data.temp);
          } else {
            callback('Cannot get weather at this time');
          }
        });
      } else {
        callback('Please provide a city for weather.');
      }
    }
  );
};
