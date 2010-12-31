# node-calais #

node-calais allows semantic analysis of text using the Calais web service.

## Install ##

Install using npm:
    $ npm install calais

## Usage ##

    var calais = new Calais('<YOUR API KEY>')
    calais.set('content', 'The Federal Reserve is the enemy of Ron Paul.')
    calais.fetch(function(result) {
      // do something with result
    })

## Example ##

Run quick example:
    $ node example.js

## Options ##

In addition to using the "set" method, a hash of option settings can be passed
as the second argument during intialization. For example:

    var calais = new Calais('<YOUR API KEY>', {'cleanResult': false})

By default, node-calais will return fetched results as a Javascript object.
Alternatively, the Calais standard "outputFormat" input parameter can be set to
standard output formats (see Calais documentation).

Any standard Calais input parameter can be specified as an option, as well as
the 'cleanResult' parameter which will return a simplified Javascript object if
"outputFormat" hasn't been set to something other than the default ('object').

## Test ##

Run tests:
    $ expresso test/calais.test.js

Tested with node.js v0.3.0

(c) 2010 Mike Cantelon, MIT license
