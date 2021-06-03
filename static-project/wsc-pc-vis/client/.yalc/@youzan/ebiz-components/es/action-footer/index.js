'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = require('react');
var React__default = _interopDefault(React);
var zent = require('zent');
var samComponents = require('@youzan/sam-components');
var PropTypes = _interopDefault(require('prop-types'));
var cx = _interopDefault(require('classnames'));

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

var ActionFooter =
/*#__PURE__*/
function (_Component) {
  _inherits(ActionFooter, _Component);

  function ActionFooter() {
    _classCallCheck(this, ActionFooter);

    return _possibleConstructorReturn(this, _getPrototypeOf(ActionFooter).apply(this, arguments));
  }

  _createClass(ActionFooter, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      // hack： 支持指定form class，这边尝试转换为id，然后支持submit btn写在任意位置
      try {
        var mainOptions = this.props.mainOptions;
        var selector = document.querySelector("form.".concat(mainOptions.form));

        if (mainOptions && mainOptions.form && selector) {
          selector.setAttribute('id', mainOptions.form);
        }
      } catch (e) {
        console.error(e);
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          mainText = _this$props.mainText,
          mainSamName = _this$props.mainSamName,
          subText = _this$props.subText,
          mainDisabled = _this$props.mainDisabled,
          subDisabled = _this$props.subDisabled,
          onMainClick = _this$props.onMainClick,
          onSubClick = _this$props.onSubClick,
          className = _this$props.className,
          mainOptions = _this$props.mainOptions,
          subOptions = _this$props.subOptions;
      var MainButton = mainSamName ? samComponents.Button : zent.Button;
      return React__default.createElement("div", {
        className: cx('action-footer', className)
      }, this.props.children ? this.props.children : React__default.createElement(React__default.Fragment, null, React__default.createElement(MainButton, _extends({
        type: "primary",
        name: mainSamName,
        className: "action-footer__main",
        disabled: mainDisabled,
        onClick: onMainClick
      }, mainOptions), mainText), React__default.createElement(zent.Button, _extends({
        className: "action-footer__sub",
        disabled: subDisabled,
        onClick: onSubClick
      }, subOptions), subText)));
    }
  }]);

  return ActionFooter;
}(React.Component);

_defineProperty(ActionFooter, "propTypes", {
  mainText: PropTypes.string,
  mainSamName: PropTypes.string,
  subText: PropTypes.string,
  mainDisabled: PropTypes.bool,
  subDisabled: PropTypes.bool,
  onMainClick: PropTypes.func,
  onSubClick: PropTypes.func,
  className: PropTypes.string,
  mainOptions: PropTypes.object,
  subOptions: PropTypes.object
});

_defineProperty(ActionFooter, "defaultProps", {
  mainText: '保存',
  subText: '取消',
  mainDisabled: false,
  subDisabled: false,
  onMainClick: function onMainClick() {},
  onSubClick: function onSubClick() {},
  className: '',
  mainOptions: {},
  subOptions: {}
});

module.exports = ActionFooter;
