// Messages sent on a regular schedule
var config = require('./config');
var services = require('./services');
var bot = require('./bot');

var bots = {};
config.bots.forEach(function (bot) {
  bots[bot.groupLocalID] = bot;
});

var send = function (msg) {
  bot.postMessage(bots['1'].botID, msg);
  //bot.postMessage(bots['2'].botID, msg);
};

var sendRandomDesignerExcuse = function () {
  services.getRandomDesignerExcuse(function (excuse) {
    if (excuse) {
      send('Designer excuse: ' + excuse);
    }
  });
};

if (Math.random() < 0.5) {
  services.getRandomDeveloperExcuse(function (excuse) {
    if (excuse) {
      send('Developer excuse: ' + excuse);
    } else {
      // designer excuse does not depend on external request, so it always succeeds
      sendRandomDesignerExcuse();
    }
  });
} else {
  sendRandomDesignerExcuse();
}
