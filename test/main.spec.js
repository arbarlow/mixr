var Mixr = require('../lib/index');
var fs = require('fs');

describe("Mixr", function() {
  
  it("Should be able to have over-ridden options", function() {
    Mixr.overide_options({
      css_base_path: './test/assets/css/',
      js_base_path: './test/assets/js/'
    });
    
    expect(Mixr.css_base_path).toEqual('./test/assets/css/');
    expect(Mixr.js_base_path).toEqual('./test/assets/js/');
  });
  
  it("Should parse CSS headers correctly", function(done) {
    fs.readFile('./test/assets/css/app.css', function(err, file){
      var result = Mixr.getRequireHeaders(file.toString('utf-8'));
      expect(result).toEqual([ 
        '*= require bootstrap.min.css', 
        '*= require main.css',
        '*= require main.css.less' ])
      done();
    });
  });
  
  it("Should parse CSS headers correctly", function() {
    var output = Mixr.parseHeader("*= require defaults.css.less");
    expect(output).toEqual(['require', 'defaults.css.less'])
  });
  
  it("Should parse CSS headers correctly with a file path", function() {
    var output = Mixr.parseHeader("*= require ./someplace/defaults.css.less");
    expect(output).toEqual(['require', './someplace/defaults.css.less'])
  });
  
  it("Should parse CSS headers correctly with a non local file path", function() {
    var output = Mixr.parseHeader("*= require someplace/defaults.css.less");
    expect(output).toEqual(['require', 'someplace/defaults.css.less'])
  });
  
  it("Should be able to require a normal file", function(done) {
    Mixr.require("main.css", function(err, output) {
      expect(output).toBe("body{background-color: #000;}");
      done(err);
    });
  });
  
  it("Should be able to require a normal file with a local ./", function(done) {
    Mixr.require("./main.css", function(err, output) {
      expect(output).toBe("body{background-color: #000;}");
      done(err);
    });
  });
  
  it("Should be able to require and compile a less file", function(done) {
    Mixr.require("./main.css.less", function(err, output) {
      expect(output).toBe("#header {\n  color: #4d926f;\n}\n");
      done(err);
    });
  });
  
  it("Should be able to require and compile a coffeescript file", function(done) {
    Mixr.require("./main.js.coffee", function(err, output) {
      expect(output).toBe("(function() {\n  var number, opposite;\n\n  number = 42;\n\n  opposite = true;\n\n  if (opposite) number = -42;\n\n}).call(this);\n");
      done(err);
    });
  });
  
});