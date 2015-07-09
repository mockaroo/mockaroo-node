# mockaroo-node

A nodejs client for generating data using the rest api from http://mockaroo.com

# Installation

    npm install mockaroo

# Documentation

http://mockaroo.com/api/node/index.html

# API Overview

The mockaroo client's generate method returns a promise that resolves to an array of records.

You can either generate data using a schema that you've built and saved on mockaroo.com:

```js
var Mockaroo = require('mockaroo');

var client = new Mockaroo.Client({
    apiKey: 'e93db400' // see http://mockaroo.com/api/docs to get your api key
})

client.generate({
    count: 10,
    schema: 'My Saved Schema'
}).then(function(records) {
    ...
});
```

Or you can specify fields using the API:

```js
client.generate({
    count: 10,
    fields: [{
        name: 'id',
        type: 'Row Number'
    }, {
        name: 'transactionType',
        type: 'Custom List',
        values: ['credit', 'debit']
    }]
}).then(function(records) {
    // handle response
});
```

Field types and parameters are documented [here](http://mockaroo.com/api/docs#types)

You can also download data in csv format:

```js
client.generate({
    count: 10,
    format: 'csv',
    header: true, // this is the default, set to false to remove the header row
    fields: [...]
}).then(function(records) {
    // handle response
});
```

# Handling Responses

The Promise returned by client.generate resolves to an array of records when count > 1 and a single object when count == 1.
The keys are the names of the fields in your schema.  For example:

```js
client.generate({
    count: 10,
    fields: [{
        name: 'id',
        type: 'Row Number'
    }, {
        name: 'transactionType',
        type: 'Custom List',
        values: ['credit', 'debit']
    }]
}).then(function(records) {
    for (var i=0; i<records.length; i++) {
        var record = records[i];
        console.log('record ' + i, 'id:' + record.id + ', transactionType:' + record.transactionType);
    }
});
```

# Errors

This module contains Error classes to help you handle specific error conditions.

```js
client.generate({
    count: 10,
    schema: 'My Saved Schema'
}).then(function(records) {
    // handle successful response here
}).catch(function(error) {
    if (error instanceof Mockaroo.errors.InvalidApiKeyError) {
      console.log('invalid api key');
    } else if (error instanceof Mockaroo.errors.UsageLimitExceededError) {
      console.log('usage limit exceeded');
    } else {
      console.log('unknown error', error);
    }
});
```

# Gulp Tasks

To generate documentation and compile the es6 code to js, use the default gulp task:

    gulp

# Tests

This module uses mocha and chai for testing. To run tests:

    npm test
