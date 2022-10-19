"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.federatedComponent = void 0;

var _react = _interopRequireWildcard(require("react"));

var _reactErrorBoundary = require("react-error-boundary");

var _federatedShared = require("../federatedShared");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var federatedComponent = function federatedComponent(_ref) {
  var Component = _ref.Component,
      delayedElement = _ref.delayedElement,
      Fallback = _ref.Fallback;

  var SuspenseWrapper = function SuspenseWrapper(_ref2) {
    var children = _ref2.children;
    return /*#__PURE__*/_react.default.createElement(_react.Suspense, {
      fallback: delayedElement !== null && delayedElement !== void 0 ? delayedElement : /*#__PURE__*/_react.default.createElement("div", {
        "aria-busy": "true"
      })
    }, children);
  };

  return function (props) {
    return /*#__PURE__*/_react.default.createElement(_federatedShared.ResetWrapper, {
      render: function render(resetComponent) {
        return /*#__PURE__*/_react.default.createElement(_reactErrorBoundary.ErrorBoundary, {
          fallbackRender: function fallbackRender(errorProps) {
            return Fallback ? /*#__PURE__*/_react.default.createElement(Fallback, _extends({}, errorProps, props)) : /*#__PURE__*/_react.default.createElement(_federatedShared.DefaultFallbackComponent, _extends({}, errorProps, props, {
              resetErrorBoundary: resetComponent
            }), "Federated module failed!");
          },
          onError: function onError() {
            return _federatedShared.errorHandler.apply(void 0, arguments);
          }
        }, /*#__PURE__*/_react.default.createElement(SuspenseWrapper, null, /*#__PURE__*/_react.default.createElement(Component, props)));
      }
    });
  };
};

exports.federatedComponent = federatedComponent;