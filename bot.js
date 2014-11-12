var HTTPS = require('https');
var config = require('./config');

var groupIdToBotMap = {};
config.bots.forEach(function (bot) {
  groupIdToBotMap[bot.groupID] = bot;
});

var commands = [];
var registerCommand = function (command, description, func) {
  commands[command] = [description, func];
};

var normalizedPath = path.join(__dirname, "commands");
require("fs").readdirSync(normalizedPath).forEach(function (file) {
  if (path.extname(file) === '.js') {
    require("./commands/" + file)(registerCommand)
  }
});

function respond(request) {
  var bot = groupIdToBotMap[request.group_id],
      msg = request.text;
  if (!bot) {
    console.log('New message received, but no bot configured for Group ID ' + request.group_id);
  } else {
    console.log('New message from %s in group \'%s\': %s', request.name, bot.groupLocalID, msg);
    if (typeof msg === 'string' && msg.substring(0, 4) === 'bot ') {
      msg = msg.substring(4);
      processCommand(bot.groupLocalID, msg, function (response) {
        if (response !== null) {
          postMessage(bot.botID, response);
        }
      });
    }
  }
}

function processCommand(groupLocalID, message, cb) {
  var tokens = message.split(' '),
      commandString = tokens.shift();

  if (groupLocalID === '3') {
    // do not send anything to the group I assigned local id 3
    cb(null);
    return;
  }

  if (!commandString) {
    cb(null);
    return;
  }

  if (commandString === 'help') {
    var helpText = 'Usage: bot <command> <arguments> [optional arguments]\n' +
      'Available commands:\nhelp: Display this text\n';
    for (var key in commands) {
      if (commands.hasOwnProperty(key)) {
        helpText += commands[key][0] + '\n';
      }
    }
    cb(helpText);
    return;
  }

  var command = commands[commandString];
  if (!command) {
    cb('Command \'' + commandString + '\' not supported. Type \'bot help\' for available commands.');
    return;
  }

  command[1](groupLocalID, tokens, cb);
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
exports.processCommand = processCommand;
exports.postMessage = postMessage;
