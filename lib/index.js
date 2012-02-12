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
  
  processors: {
    'css'    : null,
    'js'     : null,
    'min'    : null
  }
};

Mixr.overide_options = function(given_options) {
  this.merge(given_options);
};

Mixr.addExpressRoutes = function(express_app) {
  if (Mixr.css) {
    express_app.get(Mixr.css_url, function(req, res) {
      Mixr.parse_and_process_base_file(Mixr.css_base_file, function(output, err) {
        res.end(output);
      });
    });
  };
  
  if (Mixr.js) {
    express_app.get(Mixr.js_url, function(req, res) {
      Mixr.parse_and_process_base_file(Mixr.js_base_file, function(output, err) {
        res.end(output);
      });
    });
  };
};

Mixr.addHelpers = function(express_app) {
  express_app.dynamicHelpers({
    css_path: function(){
      return Mixr.css_url;
    },
    js_path: function(){
      return Mixr.js_url;
    }
  })
}

Mixr.parse_and_process_base_file = function(file_path, callback) {
  var full_path = css_or_js_path(file_path);
  
  fs.readFile(full_path, function(err, data) {
    if (err) {
      callback(null, err);
    }else{
      var headers = Mixr.getRequireHeaders(data.toString('utf-8'));
      async.map(headers, Mixr.parseAndAction, function(err, results){
        callback(results.join("\n"), null);
      });
    };
  });
};

Mixr.parseAndAction = function(header_string, cb) {
  var action_and_file = Mixr.parseHeader(header_string);
  Mixr[action_and_file[0]](action_and_file[1], cb);
}

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
      next(err, null);
    }else{
      var read_file_string = data.toString('utf-8');
      var compilers = parse_compile_types(file_string);
      var output = read_file_string;
      
      async.reduce(compilers, output, function(output, compiler, callback){
        Mixr.compile(output, compiler, function(err, result){
          callback(err, result);
        })
      }, function(err, result){
        next(null, result);
      });
    };
  });
};

Mixr.compile = function(string, compiler, cb) {
  var processor = Mixr.processors[compiler];
  
  if (processor == null) {
    cb(null, string);
  }else{
    processor(string, cb);
  };
};

var parse_compile_types = function(file_string) {
  var normal_file_name = remove_pre_slash(file_string);
  var array = normal_file_name.split('.');
  array.shift();
  return array.reverse();
};

var css_or_js_path = function(filename) {
  if (filename.indexOf('.css') > -1) {
    return Mixr.css_base_path + remove_pre_slash(filename);
  }else if (filename.indexOf('.js') > -1){
    return Mixr.js_base_path + remove_pre_slash(filename);
  };
};

var remove_pre_slash = function(string) {
  if (string.indexOf('./') == 0) {
    return string.substring(2);
  }else{
    return string;
  };
};

// Some default compilers
var less_compiler = null;
Mixr.processors.less = function(string, cb) {
  if (less_compiler==undefined) {
    less_compiler = require('less');
  };
  
  new(less_compiler.Parser)({}).parse(string, function(err, tree) {
    cb(err, tree.toCSS());
  });
};

// Some default compilers
var coffeescript_compiler = null;
Mixr.processors.coffee = function(string, cb) {
  if (coffeescript_compiler==undefined) {
    coffeescript_compiler = require('coffee-script');
  };
  
  var output = coffeescript_compiler.compile(string)
  cb(null, output);
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