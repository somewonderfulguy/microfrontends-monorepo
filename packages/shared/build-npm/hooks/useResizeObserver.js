"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = require("react");

var _utils = require("../utils");

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var useResizeObserver = function useResizeObserver() {
  var delay = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
  var initialBounds = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
    left: 0,
    top: 0,
    width: 0,
    height: 0
  };
  var elemRef = (0, _react.useRef)(null);

  var _useState = (0, _react.useState)(initialBounds),
      _useState2 = _slicedToArray(_useState, 2),
      bounds = _useState2[0],
      setBounds = _useState2[1];

  var observer = (0, _utils.throttle)(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 1),
        entry = _ref2[0];

    return setBounds(Array.isArray(entry) ? entry[0].contentRect : entry.contentRect);
  }, delay);

  var _useState3 = (0, _react.useState)(function () {
    return new ResizeObserver(observer);
  }),
      _useState4 = _slicedToArray(_useState3, 1),
      resizeObserver = _useState4[0];

  var disconnect = (0, _react.useCallback)(function () {
    return resizeObserver.disconnect();
  }, [resizeObserver]);
  (0, _react.useEffect)(function () {
    if (elemRef.current) {
      resizeObserver.observe(elemRef.current);
    }

    return disconnect;
  }, [resizeObserver, disconnect]);
  return [elemRef, bounds !== null && bounds !== void 0 ? bounds : initialBounds];
};

var _default = useResizeObserver;
exports.default = _default;