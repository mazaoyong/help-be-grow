'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = _interopDefault(require('react'));
var zent = require('zent');

function IOSBuyAlert() {
  return React.createElement(zent.Alert, {
    type: "warning",
    style: {
      marginBottom: 10
    }
  }, "iOS\u7CFB\u7EDF\u5FAE\u4FE1\u5C0F\u7A0B\u5E8F\u5185\u5C06\u65E0\u6CD5\u8D2D\u4E70\u548C\u652F\u4ED8\u77E5\u8BC6\u4ED8\u8D39\u5546\u54C1\u3002", React.createElement("a", {
    href: "//bbs.youzan.com/forum.php?mod=viewthread&tid=678623",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "\u67E5\u770B\u4EA7\u54C1\u4F18\u5316\u8C03\u6574\u8BE6\u60C5"));
}
function PunchAlert() {
  return React.createElement(zent.Alert, {
    type: "warning",
    style: {
      marginBottom: 10
    }
  }, "\u7FA4\u6253\u5361\u73B0\u5DF2\u652F\u6301\u5728H5\u5546\u57CE\u4E2D\u8BBF\u95EE\uFF0C\u5EFA\u8BAE\u901A\u8FC7H5\u5546\u57CE\u8FDB\u884C\u7FA4\u6253\u5361\u6D3B\u52A8\u3002\u65B0\u7248\u5C0F\u7A0B\u5E8F\uFF082.45\u53CA\u4EE5\u4E0A\uFF09\u6682\u4E0D\u652F\u6301\u4F7F\u7528\u7FA4\u6253\u5361\u3002");
}
var index = {
  IOSBuyAlert: IOSBuyAlert,
  PunchAlert: PunchAlert
};

exports.IOSBuyAlert = IOSBuyAlert;
exports.PunchAlert = PunchAlert;
exports.default = index;
