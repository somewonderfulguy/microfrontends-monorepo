"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.withLazyHooks = withLazyHooks;

var _react = _interopRequireDefault(require("react"));

var _reactQuery = require("react-query");

var _uuid = require("uuid");

var _excluded = ["hooks", "Component", "Fallback", "FinalFallback"];

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var LoadingWrapper = function LoadingWrapper(_ref) {
  var hooks = _ref.hooks,
      fallbackHooks = _ref.fallbackHooks,
      render = _ref.render,
      _ref$queryKey = _ref.queryKey,
      queryKey = _ref$queryKey === void 0 ? (0, _uuid.v4)() : _ref$queryKey,
      delayedElement = _ref.delayedElement;
  var queryOptions = {
    staleTime: Infinity,
    cacheTime: 0,
    refetchOnWindowFocus: false
  }; // TODO: error
  // - default error
  // - custom error

  var _useQuery = (0, _reactQuery.useQuery)(queryKey, function () {
    return Promise.all(Object.values(hooks));
  }, queryOptions),
      loadedHooks = _useQuery.data,
      isLoading = _useQuery.isLoading,
      isError = _useQuery.isError,
      refetch = _useQuery.refetch,
      error = _useQuery.error;

  var _useQuery2 = (0, _reactQuery.useQuery)(typeof queryKey === 'string' ? "fallback_".concat(queryKey) : ['fallback'].concat(queryKey), function () {
    return Promise.all(Object.values(fallbackHooks !== null && fallbackHooks !== void 0 ? fallbackHooks : {}));
  }, _objectSpread(_objectSpread({}, queryOptions), {}, {
    enabled: !isLoading && !isError && !!fallbackHooks
  })),
      loadedFallbackHooks = _useQuery2.data;

  if (isLoading) return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, delayedElement !== null && delayedElement !== void 0 ? delayedElement : /*#__PURE__*/_react.default.createElement("div", {
    "aria-busy": "true"
  }));
  if (isError) return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, "Oh, no...");
  return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, loadedHooks ? render(loadedHooks) : null);
};

function withLazyHooks(_ref2) {
  var hooks = _ref2.hooks,
      Component = _ref2.Component,
      Fallback = _ref2.Fallback,
      FinalFallback = _ref2.FinalFallback,
      rest = _objectWithoutProperties(_ref2, _excluded);

  return function (props) {
    return /*#__PURE__*/_react.default.createElement(LoadingWrapper, _extends({
      hooks: hooks,
      render: function render(loadedHooks) {
        var hookNames = Object.keys(hooks);
        var hooksToProps = {};
        hookNames.forEach(function (name, idx) {
          return hooksToProps[name] = loadedHooks[idx].default;
        });
        return /*#__PURE__*/_react.default.createElement(Component, _extends({}, props, hooksToProps));
      }
    }, rest));
  };
}