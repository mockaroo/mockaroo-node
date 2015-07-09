var nock = require('nock');
var Mockaroo = require('../lib/mockaroo');
require('chai').should();

describe('Client', function() {
    describe('constructor', function() {
        it('should require an api key', function() {
            (function() {
                new Mockaroo.Client({});
            }).should.throw('apiKey is required');
        });
    });

    describe('convertError', function() {
        var client = new Mockaroo.Client({
            apiKey: 'xxx'
        });

        it('should convert Invalid API Key to InvalidApiKeyError', function() {
            client.convertError({ data: { error: 'Invalid API Key' }}).should.be.a.instanceOf(Mockaroo.errors.InvalidApiKeyError)
        });

        it('should convert errors containing "limited" to UsageLimitExceededError', function() {
            client.convertError({ data: { error: 'Silver plans are limited to 1,000,000 records per day.' }}).should.be.a.instanceOf(Mockaroo.errors.UsageLimitExceededError)
        });
    });

    describe('getUrl', function() {
        it('should default to https://mockaroo.com', function() {
            var client = new Mockaroo.Client({
                apiKey: 'xxx'
            });

            client.getUrl().should.equal('https://mockaroo.com/api/generate.json?client=node&key=xxx&count=1')
        });

        it('should allow you to change the port', function() {
            var client = new Mockaroo.Client({
                apiKey: 'xxx',
                secure: false,
                port: 3000
            });

            client.getUrl().should.equal('http://mockaroo.com:3000/api/generate.json?client=node&key=xxx&count=1');
        });

        it('should use http when secure:false', function() {
            var client = new Mockaroo.Client({
                apiKey: 'xxx',
                secure: false
            });

            client.getUrl().should.equal('http://mockaroo.com/api/generate.json?client=node&key=xxx&count=1');
        });

        it('should allow you to set a count > 1', function() {
            var client = new Mockaroo.Client({
                apiKey: 'xxx',
            });

            client.getUrl({count: 10}).should.equal('https://mockaroo.com/api/generate.json?client=node&key=xxx&count=10');
        });

        it('should allow you to customize the host', function() {
            var client = new Mockaroo.Client({
                apiKey: 'xxx',
                host: 'foo'
            });

            client.getUrl().should.equal('https://foo/api/generate.json?client=node&key=xxx&count=1');
        });

        it('should include schema', function() {
            var client = new Mockaroo.Client({
                apiKey: 'xxx'
            });

            client.getUrl({schema: 'MySchema'}).should.equal('https://mockaroo.com/api/generate.json?client=node&key=xxx&count=1&schema=MySchema');
        });

        it('should allow you to generate csv', function() {
            var client = new Mockaroo.Client({
                apiKey: 'xxx'
            });

            client.getUrl({format: 'csv'}).should.equal('https://mockaroo.com/api/generate.csv?client=node&key=xxx&count=1');
        });

        it('should allow you to remove the header from csv', function() {
            var client = new Mockaroo.Client({
                apiKey: 'xxx'
            });

            client.getUrl({format: 'csv', header: false}).should.equal('https://mockaroo.com/api/generate.csv?client=node&key=xxx&count=1&header=false');
        })
    });

    describe('generate', function() {
        var client = new Mockaroo.Client({
            secure: false,
            apiKey: 'xxx'
        });

        it('should require fields or schema', function() {
            (function() {
                client.generate()
            }).should.throw('Either fields or schema option must be specified');
        });

        describe('when successful', function() {
            var api = nock('http://mockaroo.com')
                .post('/api/generate.json?client=node&key=xxx&count=1')
                .reply(200, JSON.stringify([{ foo: 'bar' }]))

            it('should resolve', function() {
                return client.generate({
                    fields: [{
                        name: 'foo',
                        type: 'Custom List',
                        values: ['bar']
                    }]
                }).then(function(records) {
                    records.should.deep.equal([{ foo: 'bar' }]);
                })
            });
        })

        describe('when unsuccessful', function() {
            var api = nock('http://mockaroo.com')
                .post('/api/generate.json?client=node&key=xxx&count=1')
                .reply(500, JSON.stringify({ error: 'Invalid API Key' }))

            it('should handle errors', function() {
                return client.generate({
                    fields: []
                }).catch(function(error) {
                    error.should.be.instanceOf(Mockaroo.errors.InvalidApiKeyError)
                })
            });
        });

        it('should required fields to be an array', function() {
            (function() {
                client.generate({ fields: 'foo' })
            }).should.throw('fields must be an array');
        });

        it('should required a name for each field', function() {
            (function() {
                client.generate({ fields: [{ type: 'Row Number' }] })
            }).should.throw('each field must have a name');
        });

        it('should required a type for each field', function() {
            (function() {
                client.generate({ fields: [{ name: 'ID' }] })
            }).should.throw('each field must have a type');
        });
    });
});
