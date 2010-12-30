var http = require('http'),
    sys = require('sys')

var Calais = function(api_key) {
  this.initialize(api_key)
  return this
}

Calais.prototype = {

  initialize:function(api_key) {
    this.api_key = api_key
    this.errors = []
  },

  set:function(key, value) {
    this[key] = value
  },

  error:function(message) {
    this.errors.push(message)
  },

  validate_params:function() {
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

  get:function(callback) {

    var calais = this

    if (this.validate_params()) {

      var scope = this

      var params = {
        'Host': 'api.opencalais.com',
        'x-calais-licenseID': this.api_key,
        'Content-Type': 'text/raw',
        'Accept': 'application/json',
        'Content-Length': this.content.length
      }

      var client = http.createClient(80, 'api.opencalais.com')
      var request = client.request('POST', '/tag/rs/enrich', params)
      request.end(this.content)

      request.on('response', function(response) {
        var data = []
        response.on('data', function(chunk) {
          data.push(chunk)
        })
        response.on('end', function() {

          var urldata = scope._parseChunks(data)
          var result = false

          try {
            var result = JSON.parse(urldata)

            if (1) {
              result = calais.clean_result(result)
            }
          } catch(error) {
            calais.error(error.message)
          }

          return callback(result, calais.errors)
        })
      })
    }
  }
}

exports.Calais = Calais
