// http://docs.travis-ci.com/user/notifications/#Webhook-notification

var bot = require('../bot');
var config = require('../config');
var crypto = require('crypto');

var isValidRequest = function (headers) {
  var digest = crypto.createHash('sha256').update(headers['travis-repo-slug'] + config.travisUserToken).digest('hex');
  return digest === headers['authorization'];
};

module.exports = function (registerRoute) {
  registerRoute('post', '/travisci', function (headers, requestBody) {
    var payload;
    if (!(typeof headers === 'object' && headers && typeof requestBody === 'object' && requestBody)) {
      return;
    }

    if (!isValidRequest(headers)) {
      console.log('Invalid payload request for repository', headers['travis-repo-slug']);
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
