// http://docs.travis-ci.com/user/notifications/#Webhook-notification

var bot = require('../bot.js');

module.exports = function (registerRoute) {
  registerRoute('post', '/travisci', function (headers, requestBody) {
    var payload;
    console.log('================== Travis CI request headers:', headers);
    console.log('================== Travis CI request body:', requestBody);
    if (!(typeof requestBody === 'object' && requestBody)) {
      return;
    }
    try {
      payload = JSON.parse(requestBody.payload);
    } catch (e) {
      console.log('Travis hook error while parsing JSON:', e);
      console.log('Travis CI notification hook request body:', requestBody);
      return;
    }
    if (!payload) {
      return;
    }
    console.log(payload);
  });
};
