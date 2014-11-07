var HTTPS = require('https');
var config = require('./config');
var services = require('./services');

var bots = {};
config.bots.forEach(function (bot) {
  bots[bot.groupID] = bot;
});

function respond(request) {
  var bot = bots[request.group_id],
      msg = request.text;
  if (!bot) {
    console.log('New message received, but no bot configured for Group ID ' + request.group_id);
  } else {
    console.log('New message from %s in group \'%s\': %s', request.name, bot.groupName, msg);
    if (typeof msg === 'string' && msg.substring(0, 4) === 'bot ') {
      msg = msg.substring(4);
      if (bot.groupLocalID !== '3') { // do not send anything to the group I assigned local id 3
        processCommand(msg, function (response) {
          if (response) {
            postMessage(bot.botID, response);
          }
        });
      }
    }
  }
}

function processCommand(message, cb) {
  var tokens = message.split(' '),
      command = tokens.shift();
  switch (command) {
    case '':
      cb('');
      break;
    case 'help':
      cb('Usage: bot <command> <arguments> [optional arguments]\n' +
        'Available commands:\n' +
        'help: Display this text\n' +
        'time: Get the current time\n' +
        'weather <city>: Get the current weather for city\n' +
        'excuse [designer]: Get a random developer or designer excuse\n');
      break;
    case 'time':
      cb('The current time is ' + services.getCurrentDateTimeString());
      break;
    case 'weather':
      var city = tokens[0];
      if (city) {
        services.getWeatherForCity(city, function (data) {
          if (data.status == 'success') {
            cb('The current temperature in ' + city + ' is ' + data.temp);
          } else {
            cb('Cannot get weather at this time');
          }
        });
      } else {
        cb('Please provide a city for weather.');
      }
      break;
    case 'excuse':
      if (tokens[0] === 'designer') {
        services.getRandomDesignerExcuse(function (excuse) {
          if (excuse) {
            cb('Designer excuse: ' + excuse);
          }
        });
      } else {
        services.getRandomDeveloperExcuse(function (excuse) {
          if (excuse) {
            cb('Developer excuse: ' + excuse);
          }
        });
      }
      break;
    default:
      cb('Command \'' + command + '\' not supported. Type \'bot help\' for available commands.');
  }
}

function postMessage(botID, text) {
  var options, body, botReq;

  options = {
    hostname: 'api.groupme.com',
    path: '/v3/bots/post',
    method: 'POST'
  };

  body = {
    "bot_id" : botID,
    "text" : text
  };

  console.log('sending ' + text + ' to ' + botID);

  botReq = HTTPS.request(options, function(res) {
      if(res.statusCode == 202) {
        //neat
      } else {
        console.log('rejecting bad status code ' + res.statusCode);
      }
  });

  botReq.on('error', function(err) {
    console.log('error posting message '  + JSON.stringify(err));
  });
  botReq.on('timeout', function(err) {
    console.log('timeout posting message '  + JSON.stringify(err));
  });
  botReq.end(JSON.stringify(body));
}

exports.respond = respond;
exports.postMessage = postMessage;
