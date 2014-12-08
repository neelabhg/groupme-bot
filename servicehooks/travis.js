// http://docs.travis-ci.com/user/notifications/#Webhook-notification

var querystring = require('querystring');
var bot = require('../bot.js');

module.exports = function (registerRoute) {
  registerRoute('post', '/travisci', function (headers, requestData) {
    // excellent article: http://blog.frankgrimm.net/2010/11/howto-access-http-message-body-post-data-in-node-js/
    var requestBody = querystring.parse(requestData);
    var payload;
    try {
      payload = JSON.parse(requestBody.payload);
    } catch (e) {
      console.log('Travis hook error while parsing JSON: Travis CI notification data: \'%s\', Error:', requestBody, e);
      return;
    }
    if (!payload) {
      return;
    }
    console.log(payload);
    console.log(headers);
  });
};
