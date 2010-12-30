var http = require('http')

var Calais = function(api_key, options) {
  this.initialize(api_key, options)
}

Calais.prototype = {

  initialize:function(api_key, options) {

    this.api_key = api_key

    this.defaults = {
      'apiHost':      'api.opencalais.com',
      'apiPath':      '/tag/rs/enrich',
      'contentType':  'text/raw',
      'outputFormat': 'application/json',
      'cleanResult':  true
    }

    this._set_default_options(options)
  },

  _set_default_options:function(options) {

    options = options || {}
    this.options = {}

    for (var index in this.defaults) {
      this.options[index] = (this._undefined_or_null(options[index]))
        ? this.defaults[index]
        : this.options[index] = this.options[index]
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

  _parseChunks: function(chunks) {
    return chunks.join('');
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

      var scope = this

      var params = {
        'Host': this.options.apiHost,
        'x-calais-licenseID': this.api_key,
        'Content-Type': this.options.contentType,
        'Accept': this.options.outputFormat,
        'Content-Length': this.options.content.length
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

          var urldata = scope._parseChunks(data)
          var result = JSON.parse(urldata)

          result = (calais.options.cleanResult)
            ? calais.clean_result(result)
            : result

          return callback(result, calais.errors)
        })
      })
    }
  }
}

exports.Calais = Calais
