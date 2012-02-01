var Mixr = require('../lib/').Mixr;
var fs = require('fs');

describe("Mixr", function() {
  
  it("should return a default base folder", function() {
    expect(Mixr.baseFolder).toBe('./assets');
  });
  
  // it("", function() {
  //   
  // });
  
});