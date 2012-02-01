var http  = require('http');
var async = require('async');
var _     = require('underscore')._;
var fs    = require('fs');

var base_dir = './css';

function renderCss(base_dir, next){
  fs.readdir(base_dir, function(err, files) {
    readFiles(base_dir, files, next);
  });
};

function readFiles(base_dir, file_array, next) {
  var files = _.map(file_array, function(file){ return base_dir + "/" + file; });
  async.map(files, fs.readFile, function(err, results){
    var strings = _.map(results, function(file){ return file.toString('utf-8'); });
    var output = "";
    _.each(strings, function(file_string){ return output = output + file_string + "\n" ; });
    next(output);
  });
};

server = http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/css'});
  renderCss(base_dir, function(css) {
    res.end(css);
  });
})

server.listen(process.env.port || 3000, "127.0.0.1");
console.log('Server running at http://127.0.0.1:3000/');
