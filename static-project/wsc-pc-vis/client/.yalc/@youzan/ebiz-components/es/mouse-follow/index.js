'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = require('react');
var React__default = _interopDefault(React);
var reactDom = require('react-dom');

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

var Pop =
/*#__PURE__*/
function (_PureComponent) {
  _inherits(Pop, _PureComponent);

  function Pop() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, Pop);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(Pop)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _defineProperty(_assertThisInitialized(_this), "el", document.createElement('div'));

    _defineProperty(_assertThisInitialized(_this), "dom", null);

    return _this;
  }

  _createClass(Pop, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      document.body.appendChild(this.el);
      this.dom = reactDom.findDOMNode(this.refs.mousefollow_pop);
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      document.body.removeChild(this.el);
    }
  }, {
    key: "render",
    value: function render() {
      this.el.style.cssText = this.style;
      return reactDom.createPortal(React__default.createElement("div", {
        ref: "mousefollow_pop"
      }, this.props.children), this.el);
    }
  }, {
    key: "childrenStyle",
    get: function get() {
      if (this.dom && this.dom.getBoundingClientRect) {
        var rect = this.dom.getBoundingClientRect();
        var width = rect.width,
            height = rect.height;
        return {
          width: width,
          height: height
        };
      }

      return {
        width: 0,
        height: 0
      };
    }
  }, {
    key: "style",
    get: function get() {
      var _this$props = this.props,
          top = _this$props.top,
          left = _this$props.left,
          position = _this$props.position,
          _this$props$cushion = _this$props.cushion,
          cushion = _this$props$cushion === void 0 ? {} : _this$props$cushion;
      var _this$childrenStyle = this.childrenStyle,
          width = _this$childrenStyle.width,
          height = _this$childrenStyle.height;
      var topPosition = top;
      var leftPosition = left;

      switch (position) {
        case 'TopLeft':
          topPosition -= height - (cushion.top || 0);
          leftPosition -= width - (cushion.left || 0);
          break;

        case 'TopCenter':
          topPosition -= height - (cushion.top || 0);
          leftPosition -= width / 2 - (cushion.left || 0);
          break;

        case 'TopRight':
          topPosition -= height - (cushion.top || 0);
          leftPosition -= cushion.left || 0;
          break;

        case 'LeftCenter':
          topPosition -= height / 2 - (cushion.top || 0);
          leftPosition -= width - (cushion.left || 0);
          break;

        case 'RightCenter':
          topPosition -= height / 2 - (cushion.top || 0);
          leftPosition += cushion.left || 0;
          break;

        case 'BottomLeft':
          topPosition += cushion.top || 0;
          leftPosition -= width - (cushion.left || 0);
          break;

        case 'BottomCenter':
          topPosition += cushion.top || 0;
          leftPosition -= width / 2;
          break;

        case 'BottomRight':
          topPosition += cushion.top || 0;
          leftPosition += cushion.left || 0;
          break;
      }

      return "\n      position: absolute;\n      top: ".concat(topPosition, "px;\n      left: ").concat(leftPosition, "px;\n      z-index: 9999;\n    ");
    }
  }]);

  return Pop;
}(React.PureComponent);

var MouseFollow =
/*#__PURE__*/
function (_Component) {
  _inherits(MouseFollow, _Component);

  function MouseFollow() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, MouseFollow);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(MouseFollow)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _defineProperty(_assertThisInitialized(_this), "state", {
      showPop: false,
      top: 0,
      left: 0
    });

    _defineProperty(_assertThisInitialized(_this), "onMouseEnter", function () {
      _this.setState({
        showPop: true
      });
    });

    _defineProperty(_assertThisInitialized(_this), "onMouseLeave", function () {
      _this.setState({
        showPop: false
      });
    });

    _defineProperty(_assertThisInitialized(_this), "onMouseMove", function (e) {
      _this.setState({
        top: e.pageY,
        left: e.pageX
      });
    });

    return _this;
  }

  _createClass(MouseFollow, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          popContent = _this$props.popContent,
          position = _this$props.position,
          children = _this$props.children,
          cushion = _this$props.cushion;
      var _this$state = this.state,
          showPop = _this$state.showPop,
          top = _this$state.top,
          left = _this$state.left;
      return React__default.createElement("div", {
        className: "ebiz-mouse-follow",
        onMouseEnter: this.onMouseEnter,
        onMouseLeave: this.onMouseLeave,
        onMouseMove: this.onMouseMove
      }, showPop && React__default.createElement(Pop, {
        top: top,
        left: left,
        position: position,
        cushion: cushion
      }, popContent), children);
    }
  }]);

  return MouseFollow;
}(React.Component);

module.exports = MouseFollow;
