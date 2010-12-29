var sys = require('sys'),
    Calais = require('./lib/calais').Calais

var calais = new Calais('your_api_key')
calais.set('content', 'The Federal Reserve is the enemy of Ron Paul.')
calais.get(function(result) {
  sys.puts(sys.inspect(result))
})
