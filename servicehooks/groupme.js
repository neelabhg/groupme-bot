var bot = require('../bot.js');

module.exports = function (registerRoute) {
  registerRoute('post', '/groupme', function (headers, requestBody) {
    bot.respond(requestBody);
  });
};
