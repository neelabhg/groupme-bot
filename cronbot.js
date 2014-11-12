// Messages sent on a regular schedule
var config = require('./config');
var services = require('./services');
var bot = require('./bot');

var send = function (msg) {
  if (msg) {
    bot.postMessage(config.botsDict['1'].botID, msg);
    //bot.postMessage(config.botsDict['2'].botID, msg);
  }
  process.exit();
};

var sendRandomDesignerExcuse = function () {
  services.getRandomDesignerExcuse(function (excuse) {
    send('Designer excuse: ' + excuse);
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
