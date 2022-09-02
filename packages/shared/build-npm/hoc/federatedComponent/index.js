"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _federatedComponent = require("./federatedComponent");

Object.keys(_federatedComponent).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _federatedComponent[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _federatedComponent[key];
    }
  });
});