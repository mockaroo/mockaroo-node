import 'core-js/shim';
import axios from 'axios';
import * as errors from './errors'

/**
 * A client for generating data using mockaroo.
 */
export default class Client {

    /**
     * Creates a new instance
     * @param {Object} options
     * @param {string} options.apiKey Your mockaroo api key. See http://mockaroo.com/api/docs under "Gaining Access".
     * @param {string} [options.host='mockaroo.com'] The hostname of the mockaroo server.
     * @param {int} [options.port=80] The port to use.
     * @param {boolean} [options.secure=true] Set to false to use http instead of https
     */
    constructor(options) {
        var defaults = {
            host: 'mockaroo.com',
            secure: true
        };

        Object.assign(this, defaults, options);

        this.validate();
    }

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
    generate(options) {
        if (!options || (!options.schema && !options.fields)) throw new Error('Either fields or schema option must be specified');

        this.validateFields(options.fields);

        var url = this.getUrl(options);

        return new Promise((resolve, reject) => {
            axios.post(url, options.fields)
                .then(resp => resolve(resp.data))
                .catch(resp => reject(this.convertError(resp)))
        });
    }

    /**
     * @private
     * @param {Object[]} fields
     */
    validateFields(fields) {
        if (!fields) return;

        if (fields instanceof Array) {
            for (var field of fields) {
                if (!field.name) throw new Error('each field must have a name');
                if (!field.type) throw new Error('each field must have a type');
            }
        } else {
            throw new Error('fields must be an array');
        }
    }

    /**
     * Generates the rest api url
     * @private
     * @return {String}
     */
    getUrl(options) {
        options = Object.assign({ count: 1, format: 'json' }, options);
        var protocol = this.secure ? 'https' : 'http';
        var port = this.port ? `:${this.port}` : '';
        var schema = options.schema ? `&schema=${options.schema}` : '';
        var header = options.header !== undefined ? `&header=${options.header}` : '';
        var array = options.array !== undefined ? `&array=${options.array}` : '';
        if (options.format !== 'json' && options.format !== 'csv') throw new Error('format must be json or csv');
        return `${protocol}://${this.host}${port}/api/generate.${options.format}?client=node&key=${encodeURIComponent(this.apiKey)}&count=${options.count}${array}${schema}${header}`;
    }

    /**
     * Converts error messages from the mockaroo server to error classes
     * @private
     */
    convertError(response) {
        var error = response.data.error;

        if (error == 'Invalid API Key') {
            return new errors.InvalidApiKeyError(response.error);
        } else if (error.match(/limited/)) {
            return new errors.UsageLimitExceededError(response.error);
        } else {
            return new errors.ApiError(error);
        }
    }

    /**
     * Validates that all required options have be specified.
     * @private
     */
    validate() {
        if (!this.apiKey) throw new Error('apiKey is required');
    }
}
