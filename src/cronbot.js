// Messages sent on a regular schedule
var bot = require('./bot');

var send = function (groupLocalID, msg) {
  bot.processCommand(groupLocalID, '', msg, function (response) {
    if (response) {
      bot.postMessageWithGroupLocalID(groupLocalID, 'Today\'s random ' + response);
    }
    process.exit();
  });
};

if (Math.random() < 0.5) {
  send('1', 'excuse');
} else {
  send('1', 'excuse designer');
}
