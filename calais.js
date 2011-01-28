#!/usr/bin/env node

/*!
* calais
* Copyright(c) 2011 Mike Cantelon
* MIT Licensed
*/

var fs = require('fs')
  , path = require('path')
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

    if (!api_key) {

      var help = ''
      help += "Please specify an OpenCalais API key using the -k option.\n"
      help += "A default key may be specified by setting 'api_key' in an ini\n"
      help += "file at $HOME/.calais."

      console.log(help)
      process.exit(1)
    }

    var file = argv['_'][0]

    path.exists(file, function(exists) {

      if (exists) {

        var content = fs.readFileSync(file)

        var calais = new Calais(api_key, {
          'cleanResult': true
        })
        calais.set('content', content)

        calais.fetch(function(result) {
          console.log(result)
        })
      }
      else {

        console.log("Error: file doesn't exist.")
        process.exit(1)
      }
    })
  }
  else {

    console.log('Usage: calais <filename>')
    process.exit(1)
 }
})
