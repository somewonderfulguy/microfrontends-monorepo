"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.federatedComponent = federatedComponent;

var _react = _interopRequireWildcard(require("react"));

var _reactErrorBoundary = require("react-error-boundary");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

/* eslint-disable @typescript-eslint/no-explicit-any */

/* eslint-disable no-console */

/**
 * HOC that wraps federated module that takes lazy loaded component wraps it into Suspence & ErrorBoundary
 */
var errorStyle = {
  display: 'inline-block',
  background: 'rgba(255, 0, 0, 0.226)',
  padding: '5px 15px'
};

var DefaultFallbackComponent = function DefaultFallbackComponent(_ref) {
  var error = _ref.error;
  return /*#__PURE__*/_react.default.createElement("div", {
    role: "alert",
    style: errorStyle
  }, /*#__PURE__*/_react.default.createElement("p", null, "Federated module failed!"), /*#__PURE__*/_react.default.createElement("pre", null, error.message));
};

function errorHandler(error, info) {
  var logStyle = function logStyle() {
    var size = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 18;
    return "color: white; background: red; font-size: ".concat(size, "px");
  };

  console.log("%cFederated module failed!", logStyle(24));
  console.dir(error);
  console.dir(info.componentStack);
}

function federatedComponent(Component, delayedElement, Fallback) {
  return function (props) {
    return /*#__PURE__*/_react.default.createElement(_reactErrorBoundary.ErrorBoundary, {
      fallbackRender: function fallbackRender(props) {
        return Fallback ? /*#__PURE__*/_react.default.createElement(Fallback, props) : /*#__PURE__*/_react.default.createElement(DefaultFallbackComponent, props);
      },
      onError: function onError() {
        return errorHandler.apply(void 0, arguments);
      }
    }, /*#__PURE__*/_react.default.createElement(_react.Suspense, {
      fallback: delayedElement !== null && delayedElement !== void 0 ? delayedElement : /*#__PURE__*/_react.default.createElement("div", null)
    }, /*#__PURE__*/_react.default.createElement(Component, props)));
  };
}