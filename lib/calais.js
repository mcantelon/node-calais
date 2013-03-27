/*!
* calais
* Copyright(c) 2011 Mike Cantelon
* Modified 2013 Harry Guillermo (github: hguillermo)
* MIT Licensed
*/

var http = require('http')

var Calais = function(api_key, options) {
  this.initialize(api_key, options)
}

Calais.prototype = {

  initialize:function(api_key, options) {

    this.api_key = api_key

    this.defaults = {
      'apiHost':                 'api.opencalais.com',
      'apiPath':                 '/tag/rs/enrich',
      'contentType':             'text/raw',
      'outputFormat':            'object',
      'reltagBaseURL':           '',
      'calculateRelevanceScore': true,
      'enableMetadataType':      'GenericRelations,SocialTags',
      'docRDFaccessible':        false,
      'allowDistribution':       false,
      'allowSearch':             false,
      'cleanResult':             true
    }

    this._set_default_options(options)
  },

  _set_default_options:function(options) {

    options = options || {}
    this.options = {}

    for (var index in this.defaults) {
      this.options[index] = (this._undefined_or_null(options[index]))
        ? this.defaults[index]
        : options[index]
    }
  },

  _undefined_or_null:function(value) {
    return value == undefined || value == null
  },

  set:function(key, value) {
    this.options[key] = value
  },

  validate_options:function() {
    return true
  },

  clean_result:function(result) {
    var clean_result = []
    for(var i in result) {
      if (i != 'doc') {
        clean_result.push(result[i])
      }
    }
    return clean_result
  },

  fetch:function(callback) {

    var calais = this

    if (this.validate_options()) {

      var outputFormat = (calais.options.outputFormat == 'object')
        ? 'application/json'
        : this.options.outputFormat

      var params = {
        'Host':                    this.options.apiHost,
        'x-calais-licenseID':      this.api_key,
        'Content-Type':            this.options.contentType,
        'Accept':                  outputFormat,
        'Content-Length':          this.options.content.length,
        'calculateRelevanceScore': this.options.calculateRelevanceScore,
        'enableMetadataType':      this.options.enableMetadataType,
        'docRDFaccessible':        this.options.docRDFaccessible,
        'allowDistribution':       this.options.allowDistribution,
        'allowSearch':             this.options.allowSearch
      }

      if (!this._undefined_or_null(this.options['externalID'])) {
        params.externalID = this.options['externalID']
      }

      if (!this._undefined_or_null(this.options['submitter'])) {
        params.submitter = his.options['submitter']
      }

      var options = {
        hostname: this.options.apiHost,
        port: 80,
        path: this.options.apiPath,
        method: 'POST',
        headers: params
      };
      var data = [];
      var req = http.request(options, function(response) {
        response.on('data', function (chunk) {
          data.push(chunk);
        });
        response.on('end', function(){

          // serialize the returned data
          var calaisData = data.join('');

          if(response.statusCode == 200) {
            // take note of whether Javascript object output was requested
            var jsOutput = (calais.options.outputFormat == 'object');

            // parse to a Javascript object if requested
            var result = (jsOutput)
              ? JSON.parse(calaisData)
              : calaisData;

            // ignore cleanResult preference if not requesting an object
            result = (jsOutput && calais.options.cleanResult)
              ? calais.clean_result(result)
              : result;

            return callback(result, calais.errors);

          } else {
            return callback('Open Calais Web Service Error (' + calaisData + ')');
          }
        });
      }).on('error', function(e) {
        console.log('Problem with the Open Calais Request (' + e.message + ')');
      });
      req.end(this.options.content);

    }
  }
}

exports.Calais = Calais
