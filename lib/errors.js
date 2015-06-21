/**
 * Thrown when a user exceeds the maximum number of records that can be generated
 * in a 24 hour period given their plan.  See usage limits here: http://mockaroo.com/api/docs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var UsageLimitExceededError = (function (_Error) {
  function UsageLimitExceededError() {
    _classCallCheck(this, UsageLimitExceededError);

    _get(Object.getPrototypeOf(UsageLimitExceededError.prototype), "constructor", this).apply(this, arguments);
  }

  _inherits(UsageLimitExceededError, _Error);

  return UsageLimitExceededError;
})(Error);

exports.UsageLimitExceededError = UsageLimitExceededError;

/**
 * Thrown when an invalid api key is used.
 */

var InvalidApiKeyError = (function (_Error2) {
  function InvalidApiKeyError() {
    _classCallCheck(this, InvalidApiKeyError);

    _get(Object.getPrototypeOf(InvalidApiKeyError.prototype), "constructor", this).apply(this, arguments);
  }

  _inherits(InvalidApiKeyError, _Error2);

  return InvalidApiKeyError;
})(Error);

exports.InvalidApiKeyError = InvalidApiKeyError;