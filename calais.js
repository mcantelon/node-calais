#!/usr/bin/env node

/*!
* calais
* Copyright(c) 2011 Mike Cantelon
* MIT Licensed
*/

var fs = require('fs')
  , Calais = require('./lib/calais').Calais
  , argv = require('optimist').argv
  , iniparser = require('iniparser')

var home = process.env.HOME

// if HOME not set, die
if (home === undefined) {
  console.log('Error: HOME environmental variable not defined.')
  process.exit(1)
}

iniparser.parse(home + '/.calais', function(err, data) {

  var config = (err) ? false : data

  // deal with command line input
  if (argv['_'].length == 1) {

    var api_key = (argv['k'] && (argv['k'] != true))
      ? argv['k']
      : config.api_key

    if (api_key) {

      console.log('K:' + api_key)
    }
    else {

      console.log('Please specify an OpenCalais API key using the -k option.')
    }

    var contents = fs.readFileSync(argv['_'][0])

    var calais = new Calais(api_key, {
      'cleanResult': true
    })
    calais.set('content', content)
    calais.fetch(function(result) {
      console.log(result)
    })
  }
  else {

    console.log('Usage: calais <filename>')
    process.exit(1)
 }
})
