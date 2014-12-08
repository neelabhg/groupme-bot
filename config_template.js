var config = {};

config.bots = [
  {
    botID: 'xxxxxxxxxx',
    groupID: 'xxxxxxxx',
    groupLocalID: '1', // an identifier for this group used in this application only
    botName: 'mybot',
    groupName: 'the-group-name' // optional
  }
];

config.yahooWeatherAppId = '';

// Travis CI user token
config.travisUserToken = 'xxxxxxxxxxxxxx';

// DO NOT MODIFY ANYTHING BELOW THIS LINE
// Generate a dictionary of groupLocalID's and their corresponding bots
var botsDict = {};
config.bots.forEach(function (bot) {
  botsDict[bot.groupLocalID] = bot;
});
config.botsDict = botsDict;

module.exports = config;
