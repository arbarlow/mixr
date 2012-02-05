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
        '*= require reset.css', 
        '*= require bootstrap.min.css', 
        '*= require defaults.css.less', 
        '*= require forms.css',
        '*= require_dir other' ])
      done();
    });
  });
  
  it("Should parse CSS headers correctly", function() {
    var output = Mixr.parseHeader("*= require defaults.css.less");
    expect(output).toEqual(['require', 'defaults.css.less'])
  });
  
  it("Should output one whole file if given an array of files", function(done) {
    var files = ['./test/assets/concat_test/1', './test/assets/concat_test/2', './test/assets/concat_test/3'];
    Mixr.read_and_concatenate_files(files, function(output, err) {
      expect(err).toBe(null);
      expect(output).toBe('1\n2\n3\n');
      done();
    })
  });
  
});