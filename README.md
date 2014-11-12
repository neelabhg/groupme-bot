groupme-bot
===========
A bot for [GroupMe](https://groupme.com/) (https://dev.groupme.com/tutorials/bots).
Based on the [Sample GroupMe NodeJS Callback Bot](https://github.com/groupme/bot-tutorial-nodejs).

This bot can respond to commands sent on multiple groups, and can also be used to publish messages on a regular schedule. A lot of the commands are setup for my groups, but it is easy to extend this bot and add your own commands. Feel free to [fork](https://help.github.com/articles/fork-a-repo/) this repository. Consider [contributing](https://guides.github.com/activities/contributing-to-open-source/#contributing) your changes/additional commands.

Configuring
-----------
1. [Create a GroupMe Bot](https://github.com/groupme/bot-tutorial-nodejs#next-create-a-groupme-bot). For every group you want to interact with, you need to register a new GroupMe bot. For the callback URL, pass the URL of the server where this application is hosted.

2. [Find your Bot ID](https://github.com/neelabhg/groupme-bot#find-your-bot-id) and save for later. Also save the group name and group ID.

3. If you are using a version control system to manage this source code, make sure to ignore changes to `config.js`, which holds secret configuration and should not be publicly visible. If you are using Git, use the following command:  
```sh
$ git update-index --assume-unchanged config.js
```

4. Open `config.js` and edit the `config.bots` array. For every group you have a bot for, add the following to the array:
```js
{
  botID: 'xxxxxxxxxxx',
  groupID: 'xxxxxxxx',
  groupName: 'the-group-name',
  groupLocalID: '1' // an identifier for this group used in this application only
}
```
Give every bot a `groupLocalID`. This can be any identifier, which can be used to access the bot object using the `config.botsDict` dictionary. The advantage of this approach is that all the GroupMe specific configuration and secrects remain in the `config.js` file, and the source code only contains the `groupLocalID`, which is meaningless outside this application.

5. Add any other configuration/secret API keys to `config.js`, and access them in your scripts. For example, one of the commands is for the bot to tell the current weather. The weather is fetched from the Yahoo Weather API, and its secret App ID is stored in `config.js` as `config.yahooWeatherAppId`.

Running
-------
1. Install [node.js](http://nodejs.org/). Node's package manager ([npm](https://www.npmjs.org/)) comes bundled.
2. Install dependencies and set up the project.  
```sh
$ npm install
```
3. Run the server. The default port used is 5000. If you want to use another port, set the `PORT` environment variable to the desired port number.
```sh
$ node index.js
```

Adding your own commands
------------------------
TODO

Licence
-------
Currently &copy; 2014, Neelabh Gupta. An open source licence coming soon.
