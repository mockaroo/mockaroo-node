/**
 * Base for all errors
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var ApiError = (function (_Error) {
  /**
   * @param {String} message
   */

  function ApiError(message) {
    _classCallCheck(this, ApiError);

    _get(Object.getPrototypeOf(ApiError.prototype), "constructor", this).call(this);
    this.message = message;
  }

  _inherits(ApiError, _Error);

  return ApiError;
})(Error);

exports.ApiError = ApiError;

/**
 * Thrown when a user exceeds the maximum number of records that can be generated
 * in a 24 hour period given their plan.  See usage limits here: http://mockaroo.com/api/docs
 */

var UsageLimitExceededError = (function (_ApiError) {
  /**
   * @param {String} message
   */

  function UsageLimitExceededError(message) {
    _classCallCheck(this, UsageLimitExceededError);

    _get(Object.getPrototypeOf(UsageLimitExceededError.prototype), "constructor", this).call(this, message);
  }

  _inherits(UsageLimitExceededError, _ApiError);

  return UsageLimitExceededError;
})(ApiError);

exports.UsageLimitExceededError = UsageLimitExceededError;

/**
 * Thrown when an invalid api key is used.
 */

var InvalidApiKeyError = (function (_ApiError2) {
  /**
   * @param {String} message
   */

  function InvalidApiKeyError(message) {
    _classCallCheck(this, InvalidApiKeyError);

    _get(Object.getPrototypeOf(InvalidApiKeyError.prototype), "constructor", this).call(this, message);
  }

  _inherits(InvalidApiKeyError, _ApiError2);

  return InvalidApiKeyError;
})(ApiError);

exports.InvalidApiKeyError = InvalidApiKeyError;