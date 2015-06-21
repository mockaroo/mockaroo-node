/**
 * Thrown when a user exceeds the maximum number of records that can be generated
 * in a 24 hour period given their plan.  See usage limits here: http://mockaroo.com/api/docs
 */
export class UsageLimitExceededError extends Error { }
 
/**
 * Thrown when an invalid api key is used.
 */
export class InvalidApiKeyError extends Error { }
