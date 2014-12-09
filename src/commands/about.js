module.exports = function (registerCommand) {
  registerCommand('about', 'about: About me!', function (groupLocalID, userDisplayName, msgTokens, callback) {
    callback('I\'m a bot. https://github.com/neelabhg/groupme-bot');
  });
};
