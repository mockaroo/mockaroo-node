'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

require('core-js/shim');

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _errors = require('./errors');

var errors = _interopRequireWildcard(_errors);

/**
 * A client for generating data using mockaroo.
 */

var Client = (function () {

    /**
     * Creates a new instance
     * @param {Object} options
     * @param {string} options.apiKey Your mockaroo api key. See http://mockaroo.com/api/docs under "Gaining Access".
     * @param {string} [options.host='mockaroo.com'] The hostname of the mockaroo server.
     * @param {int} [options.port=80] The port to use.
     * @param {boolean} [options.secure=true] Set to false to use http instead of https
     */

    function Client(options) {
        _classCallCheck(this, Client);

        var defaults = {
            host: 'mockaroo.com',
            secure: true
        };

        Object.assign(this, defaults, options);

        this.validate();
    }

    _createClass(Client, [{
        key: 'generate',

        /**
         * Generates data based on the specified options. You can use either a saved schema using the "schema" option:
         *
         * @example
         *
         *  // generate data from a saved schema
         *  client.generate({
         *    schema: 'My Saved Schema'
         *  }).then(function(data) {
         *     // keys are the names of the columns in your saved schema.
         *  })
         *
         * @example
         *
         *  //specify fields using the api
         *  client.generate({
         *    count: 10,
         *    fields: [{
         *      name: 'id'
         *      type: 'Row Number',
         *    }, {
         *      name: 'transactionType'
         *      type: 'Custom List',
         *      values: ['debit', 'credit']
         *    }, {
         *      name: 'amount',
         *      type: 'Number'
         *      min: 1
         *      max: 10000,
         *      decimals: 2
         *    }]
         *  }).then(function(data) {
         *    for (var i=0; i<data.length; i++) {
         *      var record = data[i];
         *      console.log('id', record.id, 'transactionType', record.transactionType, 'amount', record.amount);
         *    }
         *  })
         *
         * @param {Object} options
         * @param {int} [options.count=1] The number of records to generate. See usage limits here: http://mockaroo.com/api/docs
         * @param {string} options.schema The name of the saved schema. Use this to generate data based on schema you've built using the website.  Use the fields array to generate data using an ad-doc schema.
         * @param {string} [options.format='json'] 'json' by default, set to 'csv' to generate csv data.
         * @param {boolean} [options.header=true] when using format: 'csv', set to false to remove the header row
         * @param {boolean} [options.array=false] set to true to always return an array of objects, even if count == 1
         * @param {Object[]} options.fields An array of fields
         * @param {string} options.fields.type The type of field. Many field types such as "Number" and "Custom List" take additional parameters, which are documented here: http://mockaroo.com/api/docs#types.
         * @param {string} options.field.name The value will be returned under this key in the resulting data objects.
         * @return {Promise<Object[]>} The promise resolves to an object if count == 1 or array of objects if count > 1.  Each object represents a record. Keys are the field names.
         */
        value: function generate(options) {
            var _this = this;

            if (!options || !options.schema && !options.fields) throw new Error('Either fields or schema option must be specified');

            this.validateFields(options.fields);

            var url = this.getUrl(options);

            return new Promise(function (resolve, reject) {
                _axios2['default'].post(url, options.fields).then(function (resp) {
                    return resolve(resp.data);
                })['catch'](function (resp) {
                    return reject(_this.convertError(resp));
                });
            });
        }
    }, {
        key: 'validateFields',

        /**
         * @private
         * @param {Object[]} fields
         */
        value: function validateFields(fields) {
            if (!fields) return;

            if (fields instanceof Array) {
                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = fields[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var field = _step.value;

                        if (!field.name) throw new Error('each field must have a name');
                        if (!field.type) throw new Error('each field must have a type');
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion && _iterator['return']) {
                            _iterator['return']();
                        }
                    } finally {
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }
            } else {
                throw new Error('fields must be an array');
            }
        }
    }, {
        key: 'getUrl',

        /**
         * Generates the rest api url
         * @private
         * @return {String}
         */
        value: function getUrl(options) {
            options = Object.assign({ count: 1, format: 'json' }, options);
            var protocol = this.secure ? 'https' : 'http';
            var port = this.port ? ':' + this.port : '';
            var schema = options.schema ? '&schema=' + options.schema : '';
            var header = options.header !== undefined ? '&header=' + options.header : '';
            var array = options.array !== undefined ? '&array=' + options.array : '';
            if (options.format !== 'json' && options.format !== 'csv') throw new Error('format must be json or csv');
            return protocol + '://' + this.host + port + '/api/generate.' + options.format + '?client=node&key=' + encodeURIComponent(this.apiKey) + '&count=' + options.count + array + schema + header;
        }
    }, {
        key: 'convertError',

        /**
         * Converts error messages from the mockaroo server to error classes
         * @private
         */
        value: function convertError(response) {
            var error = response.data.error;

            if (error == 'Invalid API Key') {
                return new errors.InvalidApiKeyError(response.error);
            } else if (error.match(/limited/)) {
                return new errors.UsageLimitExceededError(response.error);
            } else {
                return new errors.ApiError(error);
            }
        }
    }, {
        key: 'validate',

        /**
         * Validates that all required options have be specified.
         * @private
         */
        value: function validate() {
            if (!this.apiKey) throw new Error('apiKey is required');
        }
    }]);

    return Client;
})();

exports['default'] = Client;
module.exports = exports['default'];