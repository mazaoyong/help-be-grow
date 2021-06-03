'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = require('react');
var React__default = _interopDefault(React);
var file = require('@youzan/utils/file');
var zent = require('zent');

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArrayLimit(arr, i) {
  if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) {
    return;
  }

  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance");
}

var DownloadImage = function DownloadImage(props) {
  var url = props.url,
      _props$download = props.download,
      download = _props$download === void 0 ? "image" : _props$download;

  var _useState = React.useState(''),
      _useState2 = _slicedToArray(_useState, 2),
      blobUrl = _useState2[0],
      setBlobUrl = _useState2[1];

  React.useEffect(function () {
    file.toBase64(url).then(function (base64Url) {
      var _blobUrl = file.dataUrlToBlob(base64Url);

      if (_blobUrl) {
        setBlobUrl(URL.createObjectURL(_blobUrl));
      } else {
        zent.Notify.error('生成下载图片失败');
      }
    })["catch"](function () {
      zent.Notify.error('生成下载图片失败');
    });
  }, [url]);
  return React__default.createElement("a", {
    href: blobUrl,
    download: download,
    className: "download-anchor"
  }, props.text);
};

module.exports = DownloadImage;
