/*!
 * calais
 * Copyright(c) 2011 Mike Cantelon
 * Modified 2013 Harry Guillermo (github: hguillermo)
 * MIT Licensed
 */

var request = require('request');

var Calais = function (apiKey, options) {
  this.initialize(apiKey, options);
};

Calais.prototype = {

  initialize: function (apiKey, options) {

    this.apiKey = apiKey;

    this.defaults = {
      'apiHost'                : 'api.opencalais.com',
      'apiPath'                : '/tag/rs/enrich',
      'contentType'            : 'text/raw',
      'outputFormat'           : 'object',
      'reltagBaseURL'          : '',
      'calculateRelevanceScore': true,
      'enableMetadataType'     : 'GenericRelations,SocialTags',
      'docRDFaccessible'       : false,
      'allowDistribution'      : false,
      'allowSearch'            : false,
      'cleanResult'            : true,
      'proxy'                  : ''
    };

    this._setDefaultOptions(options);
  },

  _setDefaultOptions: function (options) {

    options = options || {};
    this.options = {};

    var keys = Object.keys(this.defaults);
    for (var i = 0, l = keys.length; i < l; i++) {
      var index = keys[i];
      this.options[index] = (this._undefinedOrNull(options[index])) ?
        this.defaults[index]
        : options[index];
    }
  },

  _undefinedOrNull: function (value) {
    return value === undefined || value === null;
  },

  set: function (key, value) {
    this.options[key] = value;
  },

  validateOptions: function () {
    return true;
  },

  cleanResult: function (result) {
    var cleanResult = [];
    for (var i in result) {
      if (i !== 'doc') {
        cleanResult.push(result[i]);
      }
    }
    return cleanResult;
  },

  fetch: function (callback) {

    var calais = this;

    if (this.validateOptions()) {

      var outputFormat = (calais.options.outputFormat === 'object') ? 'application/json'
        : this.options.outputFormat;

      var params = {
        'Host'                   : this.options.apiHost,
        'x-calais-licenseID'     : this.apiKey,
        'Content-Type'           : this.options.contentType,
        'Accept'                 : outputFormat,
        'Content-Length'         : this.options.content.length,
        'calculateRelevanceScore': this.options.calculateRelevanceScore,
        'enableMetadataType'     : this.options.enableMetadataType,
        'docRDFaccessible'       : this.options.docRDFaccessible,
        'allowDistribution'      : this.options.allowDistribution,
        'allowSearch'            : this.options.allowSearch
      };

      if (!this._undefinedOrNull(this.options['externalID'])) {
        params.externalID = this.options['externalID'];
      }

      if (!this._undefinedOrNull(this.options['submitter'])) {
        params.submitter = this.options['submitter'];
      }

      var options = {
        uri    : 'http://' + this.options.apiHost + this.options.apiPath,
        method : 'POST',
        body   : this.options.content,
        headers: params
      };

      //ensure the proxy is set
      if (this.options.proxy) {
        options.proxy = this.options.proxy;
      }

      request(options, function (error, response, calaisData) {
        if (error) {
          callback(error);
        }
        if (response === undefined) {
          return callback(new Error('Open Calais http response is undefined'));
        } else if (response.statusCode === 200) {
          // take note of whether Javascript object output was requested
          var jsOutput = (calais.options.outputFormat === 'object');
          // parse to a Javascript object if requested
          var result = (jsOutput) ? JSON.parse(calaisData)
            : calaisData;

          // ignore cleanResult preference if not requesting an object
          result = (jsOutput && calais.options.cleanResult) ? calais.cleanResult(result)
            : result;
          return callback(null, result, calais.errors);
        } else {
          return callback(new Error('Open Calais http response error ' + response.statusCode));
        }
      });
    }
  }
};

exports.Calais = Calais;
