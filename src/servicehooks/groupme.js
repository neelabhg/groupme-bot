var bot = require('../bot');

module.exports = function (registerRoute) {
  registerRoute('post', '/groupme', function (headers, requestBody) {
    bot.respond(requestBody);
  });
};
