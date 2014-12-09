var HTTPS = require('https');
var path = require('path');
var config = require('./config');
var bot = {};

var groupIdToBotMap = {}, groupLocalIdToBotMap = {};
config.bots.forEach(function (bot) {
  groupIdToBotMap[bot.groupID] = bot;
  groupLocalIdToBotMap[bot.groupLocalID] = bot;
});

var commands = [];
var registerCommand = function (command, description, func) {
  commands[command] = [description, func];
};

// http://stackoverflow.com/a/5365577 (node.js require all files in a folder?)
// And http://stackoverflow.com/questions/5364928/node-js-require-all-files-in-a-folder#comment25520686_5365577
var normalizedPath = path.join(__dirname, "commands");
require("fs").readdirSync(normalizedPath).forEach(function (file) {
  if (path.extname(file) === '.js') {
    require("./commands/" + file)(registerCommand);
  }
});

bot.respond = function (request) {
  var botConfig, msg, botName, groupID;
  if (!(typeof request === 'object' && request)) {
    console.log('Invalid bot request:', request);
    return;
  }

  groupID = request.group_id;
  if (!(typeof groupID === 'string' && groupID)) {
    console.log('Invalid bot request:', request);
    return;
  }

  botConfig = groupIdToBotMap[groupID];
  if (!(typeof botConfig === 'object' && botConfig)) {
    console.log('New message received, but no bot configured for Group ID ' + groupID);
    return;
  }

  botName = botConfig.botName.toLowerCase();
  msg = request.text;
  console.log('New message from %s in group \'%s\': %s', request.name, botConfig.groupLocalID, msg);

  if (typeof msg === 'string') {
    msg = msg.toLowerCase();
    if (msg === botName) {
      msg = botName + ' help';
    }
    if (msg.substring(0, botName.length + 1) === botName + ' ') {
      msg = msg.substring(botName.length + 1);
      this.processCommand(botConfig.groupLocalID, request.name, msg, function (response) {
        if (response !== null) {
          this.postMessageWithBotID(botConfig.botID, response);
        }
      }.bind(this));
    }
  }
};

bot.processCommand = function (groupLocalID, userDisplayName, message, cb) {
  var tokens = message.split(' '),
      commandString = tokens.shift();

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

  command[1](groupLocalID, userDisplayName, tokens, cb);
};

bot.postMessageWithGroupLocalID = function (groupLocalID, text) {
  var botID = (groupLocalIdToBotMap[groupLocalID] || {}).botID;
  this.postMessageWithBotID(botID, text);
};

bot.postMessageWithBotID = function (botID, text) {
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

  botReq = HTTPS.request(options, function (res) {
    if (res.statusCode === 202) {
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
};

module.exports = bot;
