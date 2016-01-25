/**
 * Base for all errors
 */
export class ApiError extends Error {
    /**
     * @param {String} message
     */
    constructor(message) {
        super();
        this.message = message;
    }
}

/**
 * Thrown when a user exceeds the maximum number of records that can be generated
 * in a 24 hour period given their plan.  See usage limits here: http://mockaroo.com/api/docs
 */
export class UsageLimitExceededError extends ApiError {
    /**
     * @param {String} message
     */
    constructor(message) {
        super(message);
    }
}
 
/**
 * Thrown when an invalid api key is used.
 */
export class InvalidApiKeyError extends ApiError {
    /**
     * @param {String} message
     */
    constructor(message) {
        super(message);
    }
}
