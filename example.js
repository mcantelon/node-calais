var util = require('util'),
  Calais = require('./lib/calais').Calais

var calais = new Calais('your_api_key')
calais.set('content', 'The Federal Reserve is the enemy of Ron Paul.')
calais.fetch(function (result) {
  util.puts(util.inspect(result))
})
