var Calais = require('../lib/calais').Calais,
    assert = require('assert'),
    should = require('should')

module.exports = {
  'test api key setting': function() {
    var calais = new Calais('some_api_key')
    calais.api_key.should.equal('some_api_key')
  },

  'test option setting': function() {
    var calais = new Calais('some_api_key', {'cleanResult': false})
    calais.options.cleanResult.should.equal(false)
  },
}
