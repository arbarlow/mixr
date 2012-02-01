var http = require('http');
var Mixr = require('../lib/').Mixr;

http.createServer(function (req, res) {
  if (req.url == '/assets/main.css') {
    res.writeHead(200, {'Content-Type': 'text/css'});
    res.end( Mixr.generate('./assets/main.css') );
  }else{
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end('home');
  };
}).listen(3000, "127.0.0.1"); 