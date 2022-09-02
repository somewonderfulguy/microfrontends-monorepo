"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _formLike = require("./formLike");

Object.keys(_formLike).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _formLike[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _formLike[key];
    }
  });
});