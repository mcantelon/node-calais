var Calais = require('../lib/calais').Calais;
var assert = require('assert');

module.exports = {
  'test api key setting': function () {
    var calais = new Calais('some_api_key');
    assert(calais.apiKey, 'some_api_key');
  },

  'test option setting': function () {
    var calais = new Calais('some_api_key', {'cleanResult': false});
    assert(calais.options.cleanResult, false);
  }
};
