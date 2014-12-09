// http://docs.travis-ci.com/user/notifications/#Webhook-notification

var bot = require('../bot');
var config = require('../config');
var crypto = require('crypto');
var util = require('util');

var isAuthorizedRequest = function (headers) {
  var digest = crypto.createHash('sha256').update(headers['travis-repo-slug'] + config.travisUserToken).digest('hex');
  return digest === headers['authorization'];
};

var getChatMessageText = function (payload) {
  var commit_details;
  if (payload.type === 'pull_request') {
    commit_details = util.format('pull-request #%d by %s', payload.pull_request_number, payload.author_name);
  } else {
    commit_details = util.format('commit to %s by %s', payload.branch, payload.author_name);
  }
  return util.format('Travis CI - %s - build #%d (%s): %s.\nBuild url: %s',
    payload.repository.name, payload.number, commit_details, payload.status_message, payload.build_url);
};

module.exports = function (registerRoute) {
  registerRoute('post', '/travisci', function (headers, requestBody) {
    var payload;
    if (!(typeof headers === 'object' && headers && typeof requestBody === 'object' && requestBody)) {
      console.log('Invalid POST request for route /travisci');
      return;
    }

    if (!isAuthorizedRequest(headers)) {
      console.log('Travis CI hook: unauthorized payload request for repository', headers['travis-repo-slug']);
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

    bot.postMessageWithGroupLocalID('2', getChatMessageText(payload));
  });
};
