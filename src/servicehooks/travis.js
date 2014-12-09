// http://docs.travis-ci.com/user/notifications/#Webhook-notification

var bot = require('../bot');
var config = require('../config');
var crypto = require('crypto');
var util = require('util');

var isValidRequest = function (headers) {
  var digest = crypto.createHash('sha256').update(headers['travis-repo-slug'] + config.travisUserToken).digest('hex');
  return digest === headers['authorization'];
};

var getChatMessageText = function (payload) {
  var commit_details;
  if (payload.type === 'pull_request') {
    commit_details = util.format('pull-request #%d : %s', payload.pull_request_number, payload.author_name);
  } else {
    commit_details = util.format('%s - %s : %s', payload.branch, payload.commit, payload.author_name);
  }
  return util.format('Travis CI - %s - build #%d (%s): %s.\nBuild url: %s',
    payload.repository.name, payload.number, commit_details, payload.status_message, payload.build_url);
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

    bot.postMessageWithGroupLocalID('1', getChatMessageText(payload));
  });
};
