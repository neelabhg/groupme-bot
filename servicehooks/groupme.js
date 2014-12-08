var bot = require('../bot.js');

module.exports = function (registerRoute) {
  registerRoute('post', '/groupme', function (headers, requestData) {
    var request;
    try {
      request = JSON.parse(requestData);
    } catch (e) {
      console.log('Error while parsing GroupMe request data \'%s\' as JSON:', requestData, e);
      return;
    }
    bot.respond(request);
  });
};
