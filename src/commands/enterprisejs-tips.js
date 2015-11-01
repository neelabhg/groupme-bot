var getHttp = require('../utils').getHttp;
var safeEval = require('notevil');

var getRandomEnterpriseJsTip = (function () {
  var tips = [];
  
  // get the tips from https://github.com/bentruyman/enterprise-js
  // and save them in this closure
  getHttp({
    hostname: 'raw.githubusercontent.com',
    port: 443,
    path: '/bentruyman/enterprise-js/master/tips.js',
    method: 'GET'
  }, function onResult(statusCode, data) {
    var safeEvalContext = { module: {} };
    if (statusCode == 200) {
      safeEval(data, safeEvalContext);
      // the tips.js file exports an array
      tips = safeEvalContext.module.exports.map(function (tip) {
        var msg = '@' + tip.author + ' says Enterprise JavaScript is: ';
        // remove html tags from the message (taken from http://stackoverflow.com/a/5002161)
        msg += tip.message.replace(/<\/?[^>]+(>|$)/g, "");
        if (tip.example) {
          msg += '\nFor example:\n' + tip.example.join('\n');
        }
        return msg;
      });
    }
  }, function onError() {
  });

  return function (cb) {
    cb(tips[Math.floor(Math.random() * tips.length)]);
  };
})();

module.exports = function (registerCommand) {
  registerCommand(
    'enterprisejs',
    'enterprisejs: Get a random funny tip for writing "enterprise" quality JS',
    function (groupLocalID, userDisplayName, msgTokens, callback) {
      getRandomEnterpriseJsTip(function (tip) {
        if (tip) {
          callback(tip);
        } else {
          callback('error getting data');
        }
      });
    }
  );
};
