var HTTPS = require('https');
var config = require('./config');

var bots = {};
config.bots.forEach(function (bot) {
  bots[bot.groupID] = bot;
});

function respond(request) {
  var bot = bots[request.group_id],
      msg = request.text,
      response;
  if (!bot) {
    console.log('New message received, but no bot for Group ID ' + request.group_id);
  } else {
    console.log('New message from %s in group %s: %s', request.name, bot.groupName, msg);
    if (typeof msg === 'string' && msg.substring(0, 4) === 'bot ') {
      msg = msg.substring(4);
      response = processCommand(msg);
      if (response) {
        postMessage(bot.botID, response);
      }
    }
  }
}

function processCommand(message) {
  var tokens = message.split(' '),
      command = tokens.shift();
  console.log('command: %s, tokens: %s', command, tokens);
  switch (command) {
    case 'help':
      return '';
    default:
      return 'Command %s not supported. Type \'bot help\' for available commands.';
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
