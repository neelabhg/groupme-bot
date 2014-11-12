var config = {};

config.bots = [
  {
    botID: '',
    groupID: '',
    groupName: '',
    groupLocalID: '' // an identifier for this group used in this application only
  }
];

// Generate a dictionary of groupLocalID's and their corresponding bots
var botsDict = {};
config.bots.forEach(function (bot) {
  botsDict[bot.groupLocalID] = bot;
});
config.botsDict = botsDict;

config.yahooWeatherAppId = '';

module.exports = config;
