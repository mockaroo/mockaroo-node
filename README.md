# mockaroo-node

Generate data using the [Mockaroo Generate API](https://www.mockaroo.com/docs#generate) in Node.

# Installation

```
npm install mockaroo
```

# Documentation

http://docs.mockaroo.com/api/node

# API Overview

The mockaroo client's generate method returns a promise that resolves to an array of records.

You can either generate data using a schema that you've built and saved on [www.mockaroo.com](https://www.mockaroo.com):

```js
const Mockaroo = require("mockaroo");

const client = new Mockaroo.Client({
  apiKey: "(your api key)", // see http://mockaroo.com/api/docs to get your api key
});

const records = await client.generate({
  count: 10,
  schema: "My Saved Schema",
});
```

Or you can specify fields using the API:

```js
const records = await client.generate({
  count: 10,
  fields: [
    {
      name: "id",
      type: "Row Number",
    },
    {
      name: "transactionType",
      type: "Custom List",
      values: ["credit", "debit"],
    },
  ],
});
```

Field types and parameters are documented [here](http://mockaroo.com/api/docs#types)

You can also download data in csv format:

```js
const records = await client.generate({
  count: 10,
  format: 'csv',
  header: true, // this is the default, set to false to remove the header row
  fields: [...]
})
```

# Handling Responses

The Promise returned by client.generate resolves to an array of records when count > 1 and a single object when count == 1.
The keys are the names of the fields in your schema. For example:

```js
const records = await client.generate({
  count: 10,
  fields: [
    {
      name: "id",
      type: "Row Number",
    },
    {
      name: "transactionType",
      type: "Custom List",
      values: ["credit", "debit"],
    },
  ],
});

records.forEach((record, i) => {
  console.log(
    `[${i}] id: ${record.id}, transactionType: ${record.transactionType}`
  );
});
```

# Errors

This module contains Error classes to help you handle specific error conditions.

```js
try {
  const records = await client.generate({
    count: 10,
    schema: "My Saved Schema",
  });
} catch (error) {
  if (error instanceof Mockaroo.errors.InvalidApiKeyError) {
    console.log("invalid api key");
  } else if (error instanceof Mockaroo.errors.UsageLimitExceededError) {
    console.log("usage limit exceeded");
  } else if (error instanceof Mockaroo.errors.ApiError) {
    console.log("api error: " + error.message);
  } else {
    console.log("unknown error: " + error);
  }
}
```

# Tests

This module uses mocha and chai for testing. To run tests:

```
yarn test
```
