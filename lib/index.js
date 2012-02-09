var async = require('async');
var _ = require("underscore")._;
var fs = require("fs");

var Mixr = {
  css: true,
  css_base_path: './assets/css/',
  css_base_file: 'app.css',
  css_url: '/css/app.css', 
  
  js: true, 
  js_base_path: './assets/js/',
  js_base_file: 'app.js',
  js_url: '/js/app.js',
  
  processors: []
};

Mixr.overide_options = function(given_options) {
  this.merge(given_options);
};

Mixr.addExpressRoutes = function(express_app) {
  // if (Mixr.css) {
  //   express_app.get(Mixr.css_url, function(req, res) {
  //     Mixr.parse_and_process_base_file(Mixr.css_base_path, Mixr.css_base_file, function(output, err) {
  //       res.end(output);
  //     });
  //   });
  // };
  // 
  // if (Mixr.js) {
  //   express_app.get(Mixr.js_url, function(req, res) {
  //     Mixr.parse_and_process_base_file(Mixr.js_base_path, Mixr.js_base_file, function(output, err) {
  //       res.end(output);
  //     });
  //   });
  // };
};

// Mixr.parse_and_process_base_file = function(base_path, base_file, callback) {
//   var base_file = base_path + base_file;
//   var files = [base_file];
//   
//   fs.readFile(base_file, function(err, data) {
//     if (err) {
//       callback(null, err);
//     }else{
    //   var headers = Mixr.parseRequireHeaders(data.toString('utf-8'));
    //   for (var i=0; i < headers.length; i++) {
    //     files.unshift( base_path + headers[i].split('require ').pop() );
    //   };
    // 
    //   Mixr.read_and_concatenate_files(files, function(output, err) {
    //     if (err) {
    //       callback(null, err);
    //     }else{
    //       callback(output, null);
    //     };
    //   });
//     };
//   });
// };

Mixr.getRequireHeaders = function(file_as_string) {
  var match_string = /(\*=|\/\/=|#=) require_?[a-z]{0,} ?.+/g;
  var matches = file_as_string.match(match_string);
  return matches || [];
};

Mixr.parseHeader = function(require_string, callback) {
  var action = require_string.match(/require|require_dir/)[0];
  var filename = require_string.match(/(\.*\/*[a-z]*\/)*[a-z]+\.+.+/)[0];
  return [action, filename];
};

Mixr.require = function(file_string, next) {
  fs.readFile(css_or_js_path(file_string), function(err, data) {
    if (err) {
      next(null, err);
    }else{
      var read_file_string = data.toString('utf-8');
      
      // Compile the file here..
      next(read_file_string);
    };
  });
};

Mixr.read_and_concatenate_files = function(files_array, callback) {
  async.map(files_array, fs.readFile, function(err, results){
    if (err) {
      callback(null, err);
    }else{
      var string = "";
      for (var i=0; i < results.length; i++) {
        string = string + results[i].toString('utf-8') + "\n";
      };
      callback(string, null);
    };
  });
};

var css_or_js_path = function(filename) {
  if (filename.indexOf('.css') > -1) {
    return Mixr.css_base_path + filename;
  }else if (filename.indexOf('.js') > -1){
    return Mixr.js_base_path + filename;
  };
};


// Warning, this changes the original object
Object.prototype.merge = function(hash) {
  for (var property in hash) {
    if (this.hasOwnProperty(property)) {
      this[property] = hash[property];
    }
  }
};

module.exports = Mixr;