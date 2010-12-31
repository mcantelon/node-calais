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

      var client = http.createClient(80, this.options.apiHost)
      var request = client.request('POST', this.options.apiPath, params)
      request.end(this.options.content)

      request.on('response', function(response) {
        var data = []
        response.on('data', function(chunk) {
          data.push(chunk)
        })
        response.on('end', function() {

          // serialize the returned data
          var calaisData = data.join('')

          // take note of whether JSON output was requested
          var jsOutput = (calais.options.outputFormat == 'object')

          // parse to a Javascript object if outputting JSON
          var result = (jsOutput)
            ? JSON.parse(calaisData)
            : calaisData

          // ignore cleanResult preference if not outputting JSON
          result = (jsOutput && calais.options.cleanResult)
            ? calais.clean_result(result)
            : result

          return callback(result, calais.errors)
        })
      })
    }
  }
}

exports.Calais = Calais
