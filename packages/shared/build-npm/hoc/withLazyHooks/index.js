"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _withLazyHooks = require("./withLazyHooks");

Object.keys(_withLazyHooks).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _withLazyHooks[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _withLazyHooks[key];
    }
  });
});