var Mixr = require('../lib/').Mixr;
var fs = require('fs');

describe("Mixr", function() {
  
  it("should parse plain CSS headers via Regex correctly", function() {
    var css = '';
    asyncSpecWait();
    fs.readFile('./test/support/assets/css/main.css', function (err, data) {
      if (err) throw err;
      css = data.toString('utf-8');
      var headers = Mixr.parseRequireHeaders(css);
      
      expect(headers.length).toBe(4);
      expect(headers[0]).toBe('*= require reset');
      asyncSpecDone();
    });
  });
  
  it("should parse sass css headers via Regex correctly", function() {
    var sass = '';
    asyncSpecWait();
    fs.readFile('./test/support/assets/css/main.sass', function (err, data) {
      if (err) throw err;
      sass = data.toString('utf-8');
      var headers = Mixr.parseRequireHeaders(sass);
      
      expect(headers.length).toBe(4);
      expect(headers[0]).toBe('//= require reset');
      asyncSpecDone();
    });
  });
  
  it("should parse plain js headers via Regex correctly", function() {
    var js = '';
    asyncSpecWait();
    fs.readFile('./test/support/assets/js/main.js', function (err, data) {
      if (err) throw err;
      js = data.toString('utf-8');
      var headers = Mixr.parseRequireHeaders(js);
      
      expect(headers.length).toBe(4);
      expect(headers[0]).toBe('//= require jquery');
      asyncSpecDone();
    });
  });
  
  it("should parse coffee js headers via Regex correctly", function() {
    var coffee = '';
    asyncSpecWait();
    fs.readFile('./test/support/assets/js/main.coffee', function (err, data) {
      if (err) throw err;
      coffee = data.toString('utf-8');
      var headers = Mixr.parseRequireHeaders(coffee);
      
      expect(headers.length).toBe(4);
      expect(headers[0]).toBe('#= require jquery');
      asyncSpecDone();
    });
  });
  
});