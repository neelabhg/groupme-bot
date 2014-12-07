var bot = require('../bot.js');

module.exports = function (registerRoute) {
  registerRoute('post', '/groupme', function (requestData) {
    var request = JSON.parse(requestData);
    bot.respond(request);
  });
};
