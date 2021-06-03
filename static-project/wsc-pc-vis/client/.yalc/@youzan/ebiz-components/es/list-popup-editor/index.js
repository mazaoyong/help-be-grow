'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = require('react');
var React__default = _interopDefault(React);
var zent = require('zent');
var samComponents = require('@youzan/sam-components');

function _typeof(obj) {
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

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

// 弹窗编辑类型：字符，数字，自定义<价格（单SKU，多SKU）等等>

(function (ListPopupEditorType) {
  ListPopupEditorType["STR"] = "STR";
  ListPopupEditorType["NUM"] = "NUM";
  ListPopupEditorType["CUSTOM"] = "CUSTOM";
})(exports.ListPopupEditorType || (exports.ListPopupEditorType = {}));

var StrPopupEditor = function StrPopupEditor(_ref) {
  var pop = _ref.pop,
      value = _ref.value,
      width = _ref.width,
      validate = _ref.validate,
      onChange = _ref.onChange,
      onSubmit = _ref.onSubmit,
      onCancel = _ref.onCancel;

  var _useState = React.useState(''),
      _useState2 = _slicedToArray(_useState, 2),
      error = _useState2[0],
      setError = _useState2[1];

  var formatAndChange = function formatAndChange(e) {
    var value = e.target.value;
    setError('');
    onChange(value);
  };

  var handleSubmit = function handleSubmit() {
    var _error = validate ? validate(value) : '';

    if (_error) {
      setError(_error);
    } else {
      onSubmit(pop.close)();
    }
  };

  return React__default.createElement("div", {
    className: error ? 'has-error' : ''
  }, React__default.createElement("div", {
    className: "list-popup-editor-num"
  }, React__default.createElement(zent.Input, {
    autoFocus: true,
    value: value,
    width: width,
    onChange: formatAndChange,
    onPressEnter: handleSubmit
  }), React__default.createElement(ButtonGroup, {
    submit: handleSubmit,
    cancel: onCancel(pop.close)
  })), error ? React__default.createElement("p", {
    className: "list-popup-editor_desc"
  }, error) : null);
}; // only support positive number

var NumPopupEditor = function NumPopupEditor(_ref2) {
  var pop = _ref2.pop,
      value = _ref2.value,
      width = _ref2.width,
      validate = _ref2.validate,
      onChange = _ref2.onChange,
      onSubmit = _ref2.onSubmit,
      onCancel = _ref2.onCancel;

  var _useState3 = React.useState(''),
      _useState4 = _slicedToArray(_useState3, 2),
      error = _useState4[0],
      setError = _useState4[1];

  var formatAndChange = function formatAndChange(e) {
    var value = e.target.value;
    setError('');
    onChange(value);
  };

  var handleSubmit = function handleSubmit() {
    var _error = validate ? validate(value) : '';

    if (_error) {
      setError(_error);
    } else {
      onSubmit(pop.close)();
    }
  };

  return React__default.createElement("div", {
    className: error ? 'has-error' : ''
  }, React__default.createElement("div", {
    className: "list-popup-editor-num"
  }, React__default.createElement(zent.Input, {
    autoFocus: true,
    type: "number",
    value: value,
    width: width,
    onChange: formatAndChange,
    onPressEnter: handleSubmit
  }), React__default.createElement(ButtonGroup, {
    submit: handleSubmit,
    cancel: onCancel(pop.close)
  })), error ? React__default.createElement("p", {
    className: "list-popup-editor_desc"
  }, error) : null);
};
var NullPopupEditor = function NullPopupEditor() {
  return null;
};

function ButtonGroup(_ref3) {
  var submit = _ref3.submit,
      cancel = _ref3.cancel;
  return React__default.createElement("div", {
    className: "list-popup-editor_btn-group"
  }, React__default.createElement("a", {
    href: "javascript: void(0)",
    onClick: submit
  }, "\u4FDD\u5B58"), React__default.createElement("a", {
    href: "javascript: void(0)",
    onClick: cancel
  }, "\u53D6\u6D88"));
}

var MyIcon = zent.Icon;

var ListPopupEditor =
/*#__PURE__*/
function (_PureComponent) {
  _inherits(ListPopupEditor, _PureComponent);

  function ListPopupEditor() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, ListPopupEditor);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(ListPopupEditor)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _defineProperty(_assertThisInitialized(_this), "content", void 0);

    _defineProperty(_assertThisInitialized(_this), "state", {
      value: _this.props.initialValue
    });

    _defineProperty(_assertThisInitialized(_this), "handleChange", function (value) {
      _this.setState({
        value: value
      });
    });

    _defineProperty(_assertThisInitialized(_this), "handleSubmit", function (close) {
      return function () {
        var res = _this.props.onSubmit(_this.state.value);

        if (res) {
          res.then(function (value) {
            _this.setState({
              value: value
            });
          });
        }

        close();
      };
    });

    _defineProperty(_assertThisInitialized(_this), "handleCancel", function (close) {
      return function () {
        _this.setState({
          value: _this.props.initialValue
        });

        close();
      };
    });

    _defineProperty(_assertThisInitialized(_this), "createCustomPopupEditor", function (Comp) {
      return function (_ref) {
        var pop = _ref.pop,
            value = _ref.value,
            onChange = _ref.onChange,
            onSubmit = _ref.onSubmit,
            onCancel = _ref.onCancel;
        return React.cloneElement(Comp, {
          value: value,
          pop: pop,
          onChange: onChange,
          onSubmit: onSubmit,
          onCancel: onCancel
        });
      };
    });

    return _this;
  }

  _createClass(ListPopupEditor, [{
    key: "componentWillMount",
    value: function componentWillMount() {
      var _this$props = this.props,
          type = _this$props.type,
          popupEl = _this$props.popupEl;
      this.content = this.createContent(type, popupEl);
    }
  }, {
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(nextProps) {
      if (nextProps.initialValue !== this.props.initialValue) {
        this.setState({
          value: nextProps.initialValue
        });
      }
    }
  }, {
    key: "render",
    value: function render() {
      var Content = this.content;

      var _this$props2 = this.props,
          children = _this$props2.children,
          validate = _this$props2.validate,
          samName = _this$props2.samName,
          width = _this$props2.width,
          restProps = _objectWithoutProperties(_this$props2, ["children", "validate", "samName", "width"]);

      if (samName && !samComponents.checkAccess(samName)) {
        return children;
      }

      var modifiedChildren = null;

      if (typeof children === 'function' || _typeof(children) === 'object') {
        modifiedChildren = React.cloneElement(children, restProps);
      } else {
        modifiedChildren = children;
      }

      return React__default.createElement(React__default.Fragment, null, modifiedChildren, React__default.createElement(zent.Pop, {
        trigger: "click",
        content: React__default.createElement(Content, {
          value: this.state.value,
          validate: validate,
          width: width,
          onChange: this.handleChange,
          onSubmit: this.handleSubmit,
          onCancel: this.handleCancel
        }),
        className: "list-popup-editor-pop"
      }, React__default.createElement("a", {
        className: "list-popup-editor_trigger"
      }, React__default.createElement(MyIcon, {
        type: "edit-o"
      }))));
    }
  }, {
    key: "createContent",
    value: function createContent(type, comp) {
      var content;

      switch (type) {
        case exports.ListPopupEditorType.STR:
          content = StrPopupEditor;
          break;

        case exports.ListPopupEditorType.NUM:
          content = NumPopupEditor;
          break;

        case exports.ListPopupEditorType.CUSTOM:
          content = comp ? this.createCustomPopupEditor(comp) : NullPopupEditor;
          break;

        default:
          content = NullPopupEditor;
          break;
      } // The interface of Pop.withPop is wrong


      return zent.Pop.withPop(content);
    }
  }]);

  return ListPopupEditor;
}(React.PureComponent);

exports.default = ListPopupEditor;
