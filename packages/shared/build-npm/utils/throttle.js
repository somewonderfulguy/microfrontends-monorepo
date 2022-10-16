"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.throttle = void 0;

var throttle = function throttle(func) {
  var delay = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  var isThrottled = false;
  var savedArgs;

  var wrapper = function wrapper() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    if (isThrottled) {
      savedArgs = args;
      return;
    }

    func.apply(void 0, args);
    isThrottled = true;
    setTimeout(function () {
      isThrottled = false;

      if (savedArgs) {
        wrapper(savedArgs);
        savedArgs = null;
      }
    }, delay);
  };

  return wrapper;
};

exports.throttle = throttle;