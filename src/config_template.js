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

module.exports = config;
