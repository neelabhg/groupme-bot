module.exports = function (registerCallback) {
  registerCallback('time', 'time: Get the current time', function (groupLocalID, msgTokens, callback) {
    callback('The current time is ' + (new Date()).toString());
  });
};
