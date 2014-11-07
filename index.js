var http, director, bot, router, server, port;

http        = require('http');
director    = require('director');
bot         = require('./bot.js');

router = new director.http.Router({
  '/' : {
    get: function () {
      this.res.writeHead(200);
      this.res.end("I'm a bot. https://github.com/neelabhg/groupme-bot");
    },
    post: function () {
      var request = JSON.parse(this.req.chunks[0]);
      this.res.writeHead(200);
      bot.respond(request);
      this.res.end();
    }
  }
});

server = http.createServer(function (req, res) {
  req.chunks = [];
  req.on('data', function (chunk) {
    req.chunks.push(chunk.toString());
  });

  router.dispatch(req, res, function(err) {
    res.writeHead(err.status, {"Content-Type": "text/plain"});
    res.end(err.message);
  });
});

port = Number(process.env.PORT || 5000);
server.listen(port);
