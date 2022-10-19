"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.withLazyHooks = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactQuery = require("react-query");

var _uuid = require("uuid");

var _reactErrorBoundary = require("react-error-boundary");

var _federatedShared = require("../federatedShared");

var _excluded = ["hooks", "Component", "Fallback"];

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var errorMessage = 'Federated hook(s) failed!';

var LoadingWrapper = function LoadingWrapper(_ref) {
  var hooks = _ref.hooks,
      render = _ref.render,
      renderFallback = _ref.renderFallback,
      _ref$queryKey = _ref.queryKey,
      queryKey = _ref$queryKey === void 0 ? (0, _uuid.v4)() : _ref$queryKey,
      delayedElement = _ref.delayedElement;
  var queryOptions = {
    staleTime: Infinity,
    cacheTime: 0,
    refetchOnWindowFocus: false
  };

  var _useQuery = (0, _reactQuery.useQuery)(queryKey, function () {
    return Promise.all(Object.values(hooks));
  }, queryOptions),
      loadedHooks = _useQuery.data,
      isLoading = _useQuery.isLoading,
      isError = _useQuery.isError,
      refetch = _useQuery.refetch,
      error = _useQuery.error;

  var loader = /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, delayedElement !== null && delayedElement !== void 0 ? delayedElement : /*#__PURE__*/_react.default.createElement("div", {
    "aria-busy": "true"
  }));

  var renderWithHooks = function renderWithHooks(hooks) {
    return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, hooks ? render(hooks) : null);
  };

  if (isLoading) return loader;

  if (isError) {
    var errorObj = error !== null && error !== void 0 && error.message ? error : new Error(typeof error === 'string' ? error : 'Unknown error on federated hooks loading');
    (0, _federatedShared.errorHandler)(errorObj);
    return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, renderFallback(errorObj, refetch));
  }

  return renderWithHooks(loadedHooks);
};

var withLazyHooks = function withLazyHooks(_ref2) {
  var hooks = _ref2.hooks,
      Component = _ref2.Component,
      Fallback = _ref2.Fallback,
      rest = _objectWithoutProperties(_ref2, _excluded);

  return function (props) {
    return /*#__PURE__*/_react.default.createElement(_federatedShared.ResetWrapper, {
      render: function render(resetComponent) {
        return /*#__PURE__*/_react.default.createElement(_reactErrorBoundary.ErrorBoundary, {
          fallbackRender: function fallbackRender(errorProps) {
            return Fallback ? /*#__PURE__*/_react.default.createElement(Fallback, _extends({}, errorProps, props)) : /*#__PURE__*/_react.default.createElement(_federatedShared.DefaultFallbackComponent, _extends({}, errorProps, props, {
              resetErrorBoundary: resetComponent
            }), errorMessage);
          },
          onError: function onError() {
            return _federatedShared.errorHandler.apply(void 0, arguments);
          }
        }, /*#__PURE__*/_react.default.createElement(LoadingWrapper, _extends({
          hooks: hooks,
          render: function render(loadedHooks) {
            var hookNames = Object.keys(hooks);
            var hooksToProps = {};
            hookNames.forEach(function (name, idx) {
              return hooksToProps[name] = loadedHooks[idx].default;
            });
            return /*#__PURE__*/_react.default.createElement(Component, _extends({}, props, hooksToProps));
          },
          renderFallback: function renderFallback(error, refetch) {
            return /*#__PURE__*/_react.default.createElement(_federatedShared.DefaultFallbackComponent, {
              error: error,
              resetErrorBoundary: function resetErrorBoundary() {
                return refetch();
              }
            }, errorMessage);
          }
        }, rest)));
      }
    });
  };
};

exports.withLazyHooks = withLazyHooks;