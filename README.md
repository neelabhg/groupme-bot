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

2. [Find your Bot ID](https://github.com/groupme/bot-tutorial-nodejs#find-your-bot-id) and save for later. Also save the group ID and optionally the group name.

3. Copy [`config_template.js`](src/config_template.js) to `config.js`. Make sure to keep `config.js` private/hidden, as it will hold secret data and should not be publicly visible.
  If you are using Git, it is already added to the [`.gitignore`](.gitignore). DO NOT ADD CONFIGURATION DATA TO [`config_template.js`](src/config_template.js), which is meant to be in source control.
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
  * Give every bot a `groupLocalID`. This can be any identifier, which can later be used to send messages to the group.
  The advantage of this approach is that all the GroupMe specific configuration and secrets remain in the `config.js` file,
  and the source code only contains the `groupLocalID`, which is meaningless outside this application.
  * The `botName` is the name which the bot responds to. All commands to the bot in the group must start with the given `botName`.
  * You can optionally store other data along with the bot, such as the group name.

5. Add any other configuration/secret API keys to `config.js`, and access them in your scripts.
  For example, one of the commands is for the bot to tell the current weather.
  The weather is fetched from the Yahoo Weather API, and its secret App ID is stored in `config.js` as `config.yahooWeatherAppId`.

Running
-------
1. Install [node.js](https://nodejs.org/). Node's package manager ([npm](https://www.npmjs.org/)) comes bundled.
2. The file [`run_server.sh`](run_server.sh) is a simple [shell script](https://en.wikipedia.org/wiki/Shell_script) which sets up the project directory and runs the server.
  Make sure to read its contents carefully before executing it. You might also want to edit it to suit your needs. Once ready,
  execute the run script (it must be run from the project's root directory):  
```sh
$ cd <path/to/groupme-bot/>
$ ./run_server.sh
```

Adding your own commands
------------------------
Commands are automatically picked up from the [`commands/`](src/commands/) directory. To add your own command, create a JS module and place it in that directory.
The module should export a single function which accepts as its parameter a command registration callback. This callback should be called with the
command name, its description and the command function to register the command.

The command function is called when the bot receives a message with the given command name. The command function will be called with four parameters:
* the group's local ID (see item 4 in the [Configuring](#configuring) section)
* the sending user's display name (may be empty - such as when a command is triggered as a scheduled message and not from a message sent by a user)
* an array of words in the message following the command (used as command arguments)
* a callback function, which should be called with the response

A template for a command module is:
```js
module.exports = function (registerCommand) {
  registerCommand(
    'command',
    'description',
    function (groupLocalID, userDisplayName, msgTokens, callback) {
      var response = '...';
      callback(response);
    }
  );
};
```
Look at existing modules in the [`commands/`](src/commands/) directory for examples.

License
-------
MIT Licensed. See [LICENSE.md](LICENSE.md).
