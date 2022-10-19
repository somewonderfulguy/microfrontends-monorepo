"use strict";

var _reactHooks = require("@testing-library/react-hooks");

var _ = require("..");

test('should return previous value if value updates (null is inital value)', function () {
  var _renderHook = (0, _reactHooks.renderHook)(function (_ref) {
    var initialValue = _ref.initialValue;
    return (0, _.usePrevious)(initialValue);
  }, {
    initialProps: {
      initialValue: 'Initial'
    }
  }),
      result = _renderHook.result,
      rerender = _renderHook.rerender;

  expect(result.current).toBeNull();
  rerender({
    initialValue: 'non-initial'
  });
  expect(result.current).toBe('Initial');
  rerender({
    initialValue: 'Absolutely New!'
  });
  expect(result.current).toBe('non-initial');
});