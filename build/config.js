"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _dotenv = _interopRequireDefault(require("dotenv"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var config = _dotenv["default"].config;
config();
var settings = {
  yandexToken: process.env.YANDEX_TOKEN || '',
  username: process.env.YANDEX_USER || '',
  password: process.env.YANDEX_PASSWORD || '',
  client_id: process.env.CLIENT_ID || '',
  client_secret: process.env.CLIENT_SECRET || ''
};
var _default = settings;
exports["default"] = _default;