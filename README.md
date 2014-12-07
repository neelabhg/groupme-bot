groupme-bot
===========
A bot for [GroupMe](https://groupme.com/) (https://dev.groupme.com/tutorials/bots).
Based on the [Sample GroupMe NodeJS Callback Bot](https://github.com/groupme/bot-tutorial-nodejs).

This bot can respond to commands sent on multiple groups, and can also be used to publish messages on a regular schedule.
A lot of the commands are setup for my groups, but it is easy to extend this bot and add your own commands.
Feel free to [fork](https://help.github.com/articles/fork-a-repo/) this repository.
Consider [contributing](https://guides.github.com/activities/contributing-to-open-source/#contributing) your changes/additional commands.

I recommend taking a look at [Hubot](https://hubot.github.com/) - it is written by GitHub, Inc., supports multiple
chat-backends, is very extensible, and has a huge community contributing lots of useful scripts. It does not officially support
GroupMe, but [there is an adapter available](https://github.com/AdamEdgett/hubot-groupme).

Configuring
-----------
1. [Create a GroupMe Bot](https://github.com/groupme/bot-tutorial-nodejs#next-create-a-groupme-bot).
   For every group you want to interact with, you need to register a new GroupMe bot. For the callback URL, pass the URL of the server where this application is hosted.

2. [Find your Bot ID](https://github.com/neelabhg/groupme-bot#find-your-bot-id) and save for later. Also save the group ID and optionally the group name.

3. Copy `config_template.js` to `config.js`. Make sure to keep `config.js` private/hidden, as it will hold secret data and should not be publicly visible.
   If you are using Git, it is already added to `.gitignore`. DO NOT ADD CONFIGURATION DATA TO `config_template.js`, which is meant to be in source control.
   It should only be used to create `config.js`.

4. Open `config.js` and edit the `config.bots` array. For every group you have a bot for, add the following to the array:  
  ```js
  {
    botID: 'xxxxxxxxxx',
    groupID: 'xxxxxxxx',
    groupLocalID: '1', // an identifier for this group used in this application only
    botName: 'mybot',
    groupName: 'the-group-name' // optional
  }
  ```
  * Give every bot a `groupLocalID`. This can be any identifier, which can be used to access the bot object using the `config.botsDict` dictionary.
  The advantage of this approach is that all the GroupMe specific configuration and secrets remain in the `config.js` file,
  and the source code only contains the `groupLocalID`, which is meaningless outside this application.
  * The `botName` is the name which the bot responds to. All commands to the bot in the group must start with the given `botName`.
  * You can optionally store other data along with the bot, such as the group name.

5. Add any other configuration/secret API keys to `config.js`, and access them in your scripts.
   For example, one of the commands is for the bot to tell the current weather.
   The weather is fetched from the Yahoo Weather API, and its secret App ID is stored in `config.js` as `config.yahooWeatherAppId`.

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
Commands are automatically picked up from the `commands/` directory. To add your own command, create a JS module and place it in the directory.
The module should export a single function which accepts as its parameter a command registration callback. This callback should be called with the
command name, its description and the command function to register the command. The command function is called when the bot receives a message with
the given command. The command function will be called with three parameters - the group's local ID, an array of words in the message following the
command (used as command arguments), and a callback function, which should be called with the response. A template for a command module is:
```js
module.exports = function (registerCallback) {
  registerCallback(
    'command',
    'description',
    function (groupLocalID, msgTokens, callback) {
      var response = '...';
      callback(response);
    }
  );
};

```
Look at existing modules in the `commands/` directory for examples.

Licence
-------
Currently &copy; 2014, Neelabh Gupta. An open source licence coming soon.
