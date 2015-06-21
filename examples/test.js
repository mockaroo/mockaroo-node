var Mockaroo = require('../lib/mockaroo');

var client = new Mockaroo.Client({
    // host: 'localhost',
    // port: 3000,
    // secure: false,
    // apiKey: 'e93db400'
    apiKey: '9a9987b0'
});

client.generate({
    count: 10,
    fields: [{
        name: 'id',
        type: 'Row Number'
    }, {
        name: 'list',
        type: 'Custom List',
        values: ['one', 'two', 'three']
    }]
}).then(function(data) {
    console.log(data);
}).catch(function(error) {
    if (error instanceof Mockaroo.errors.InvalidApiKeyError) {
      console.log('invalid api key');
    } else if (error instanceof Mockaroo.errors.UsageLimitExceededError) {
      console.log('usage limit exceeded');
    } else {
      console.log('unknown error', error);
    }
});
