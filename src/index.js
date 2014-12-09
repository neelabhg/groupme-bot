var http, director, path, router, server, port;

// http://stackoverflow.com/a/15303236/2193410 (Node.js - check if module is installed without actually requiring it)
try {
  require.resolve('./config');
} catch (e) {
  console.error('Configuration file config.js not found.');
  process.exit(e.code);
}

http        = require('http');
director    = require('director');
path        = require('path');

router = new director.http.Router({
  '/' : {
    get: function () {
      this.res.writeHead(200);
      this.res.end('<p>I\'m a bot. <a href="https://github.com/neelabhg/groupme-bot">https://github.com/neelabhg/groupme-bot</a></p>');
    }
  }
});

var registerRoute = function (httpVerb, route, handler) {
  if (['get', 'post'].indexOf(httpVerb) === -1) {
    console.log('registerRoute: Incorrect router method \'%s\' for route \'%s\'', httpVerb, route);
    return;
  }
  router[httpVerb](route, function () {
    this.res.writeHead(200);
    handler(this.req.headers, this.req.body || this.req.chunks.join(''));
    this.res.end();
  });
};

// http://stackoverflow.com/a/5365577 (node.js require all files in a folder?)
// And http://stackoverflow.com/questions/5364928/node-js-require-all-files-in-a-folder#comment25520686_5365577
var normalizedPath = path.join(__dirname, "servicehooks");
require("fs").readdirSync(normalizedPath).forEach(function (file) {
  if (path.extname(file) === '.js') {
    require("./servicehooks/" + file)(registerRoute);
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
