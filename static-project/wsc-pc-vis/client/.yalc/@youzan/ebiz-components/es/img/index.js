'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = require('react');
var React__default = _interopDefault(React);
var fullfillImage = _interopDefault(require('@youzan/utils/fullfillImage'));

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

function _objectWithoutProperties(source, excluded) {
  if (source == null) return {};

  var target = _objectWithoutPropertiesLoose(source, excluded);

  var key, i;

  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);

    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
      target[key] = source[key];
    }
  }

  return target;
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _possibleConstructorReturn(self, call) {
  if (call && (typeof call === "object" || typeof call === "function")) {
    return call;
  }

  return _assertThisInitialized(self);
}

var defaultProps = {
  width: 'auto',
  height: 'auto',
  alt: '',
  cover: false,
  prefix: 'img-wrap',
  backgroundColor: '#e2eefd',
  fullfill: '!100x100.jpg',
  watermark: '',
  disableFullfill: false,
  onClick: function onClick() {}
};

var ImgWrap =
/*#__PURE__*/
function (_PureComponent) {
  _inherits(ImgWrap, _PureComponent);

  function ImgWrap() {
    _classCallCheck(this, ImgWrap);

    return _possibleConstructorReturn(this, _getPrototypeOf(ImgWrap).apply(this, arguments));
  }

  _createClass(ImgWrap, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          prefix = _this$props.prefix,
          alt = _this$props.alt,
          onClick = _this$props.onClick,
          watermark = _this$props.watermark;
      return React__default.createElement("div", {
        className: prefix,
        style: this.wrapStyle
      }, React__default.createElement("img", {
        className: "".concat(prefix, "__blur"),
        src: this.src
      }), React__default.createElement("img", {
        className: "".concat(prefix, "__img"),
        alt: alt,
        src: this.src,
        style: this.imgStype,
        onClick: onClick
      }), React__default.createElement("span", {
        className: "".concat(prefix, "__watermark")
      }, watermark));
    }
  }, {
    key: "wrapStyle",
    // 外层 div 的样式
    get: function get() {
      var _this$props2 = this.props,
          width = _this$props2.width,
          height = _this$props2.height,
          backgroundColor = _this$props2.backgroundColor;
      return {
        width: width,
        height: height,
        backgroundColor: backgroundColor
      };
    } // img 标签的样式

  }, {
    key: "imgStype",
    get: function get() {
      var cover = this.props.cover;
      var objectFit = cover ? 'cover' : 'contain';
      return {
        objectFit: objectFit
      };
    } // 图片 src

  }, {
    key: "src",
    get: function get() {
      var _this$props3 = this.props,
          disableFullfill = _this$props3.disableFullfill,
          fullfill = _this$props3.fullfill,
          src = _this$props3.src;

      if (!disableFullfill && /yzcdn\.cn/.test(src)) {
        return fullfillImage(src, fullfill);
      }

      return src;
    }
  }]);

  return ImgWrap;
}(React.PureComponent);

_defineProperty(ImgWrap, "defaultProps", defaultProps);

function LockImage(props) {
  var isLock = props.isLock,
      src = props.src,
      restProps = _objectWithoutProperties(props, ["isLock", "src"]);

  return React__default.createElement(ImgWrap, _extends({
    src: isLock ? 'https://img.yzcdn.cn/publicPath/edu/20190416/lock.png' : src
  }, restProps));
}

var Img = {
  ImgWrap: ImgWrap,
  ImgLockWrap: LockImage
};

module.exports = Img;
