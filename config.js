var config = {};

config.bots = [
  {
    botID: '***REMOVED***',
    groupID: '***REMOVED***',
    groupLocalID: '1',
    botName: 'bot',
    groupName: '***REMOVED***'
  },
  {
    botID: '***REMOVED***',
    groupID: '***REMOVED***',
    groupLocalID: '2',
    botName: 'bot',
    groupName: '***REMOVED***'
  },
  {
    botID: '***REMOVED***',
    groupID: '***REMOVED***',
    groupLocalID: '3',
    botName: 'bot',
    groupName: '***REMOVED***'
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
