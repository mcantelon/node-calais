sys = require('sys')
Calais = require ('./lib/calais').Calais

calais = new Calais 'your_api_key'
calais.set 'content', 'The Federal Reserve is the enemy of Ron Paul.'
calais.fetch (result) ->
  sys.puts sys.inspect result
