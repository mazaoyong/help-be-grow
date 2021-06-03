'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = require('react');
var React__default = _interopDefault(React);
var zent = require('zent');
var crypto = _interopDefault(require('crypto'));

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

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
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

// Unique ID creation requires a high quality random # generator.  In node.js
// this is pretty straight-forward - we use the crypto API.



var rng = function nodeRNG() {
  return crypto.randomBytes(16);
};

/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */
var byteToHex = [];
for (var i = 0; i < 256; ++i) {
  byteToHex[i] = (i + 0x100).toString(16).substr(1);
}

function bytesToUuid(buf, offset) {
  var i = offset || 0;
  var bth = byteToHex;
  // join used to fix memory issue caused by concatenation: https://bugs.chromium.org/p/v8/issues/detail?id=3175#c4
  return ([
    bth[buf[i++]], bth[buf[i++]],
    bth[buf[i++]], bth[buf[i++]], '-',
    bth[buf[i++]], bth[buf[i++]], '-',
    bth[buf[i++]], bth[buf[i++]], '-',
    bth[buf[i++]], bth[buf[i++]], '-',
    bth[buf[i++]], bth[buf[i++]],
    bth[buf[i++]], bth[buf[i++]],
    bth[buf[i++]], bth[buf[i++]]
  ]).join('');
}

var bytesToUuid_1 = bytesToUuid;

// **`v1()` - Generate time-based UUID**
//
// Inspired by https://github.com/LiosK/UUID.js
// and http://docs.python.org/library/uuid.html

var _nodeId;
var _clockseq;

// Previous uuid creation time
var _lastMSecs = 0;
var _lastNSecs = 0;

// See https://github.com/uuidjs/uuid for API details
function v1(options, buf, offset) {
  var i = buf && offset || 0;
  var b = buf || [];

  options = options || {};
  var node = options.node || _nodeId;
  var clockseq = options.clockseq !== undefined ? options.clockseq : _clockseq;

  // node and clockseq need to be initialized to random values if they're not
  // specified.  We do this lazily to minimize issues related to insufficient
  // system entropy.  See #189
  if (node == null || clockseq == null) {
    var seedBytes = rng();
    if (node == null) {
      // Per 4.5, create and 48-bit node id, (47 random bits + multicast bit = 1)
      node = _nodeId = [
        seedBytes[0] | 0x01,
        seedBytes[1], seedBytes[2], seedBytes[3], seedBytes[4], seedBytes[5]
      ];
    }
    if (clockseq == null) {
      // Per 4.2.2, randomize (14 bit) clockseq
      clockseq = _clockseq = (seedBytes[6] << 8 | seedBytes[7]) & 0x3fff;
    }
  }

  // UUID timestamps are 100 nano-second units since the Gregorian epoch,
  // (1582-10-15 00:00).  JSNumbers aren't precise enough for this, so
  // time is handled internally as 'msecs' (integer milliseconds) and 'nsecs'
  // (100-nanoseconds offset from msecs) since unix epoch, 1970-01-01 00:00.
  var msecs = options.msecs !== undefined ? options.msecs : new Date().getTime();

  // Per 4.2.1.2, use count of uuid's generated during the current clock
  // cycle to simulate higher resolution clock
  var nsecs = options.nsecs !== undefined ? options.nsecs : _lastNSecs + 1;

  // Time since last uuid creation (in msecs)
  var dt = (msecs - _lastMSecs) + (nsecs - _lastNSecs)/10000;

  // Per 4.2.1.2, Bump clockseq on clock regression
  if (dt < 0 && options.clockseq === undefined) {
    clockseq = clockseq + 1 & 0x3fff;
  }

  // Reset nsecs if clock regresses (new clockseq) or we've moved onto a new
  // time interval
  if ((dt < 0 || msecs > _lastMSecs) && options.nsecs === undefined) {
    nsecs = 0;
  }

  // Per 4.2.1.2 Throw error if too many uuids are requested
  if (nsecs >= 10000) {
    throw new Error('uuid.v1(): Can\'t create more than 10M uuids/sec');
  }

  _lastMSecs = msecs;
  _lastNSecs = nsecs;
  _clockseq = clockseq;

  // Per 4.1.4 - Convert from unix epoch to Gregorian epoch
  msecs += 12219292800000;

  // `time_low`
  var tl = ((msecs & 0xfffffff) * 10000 + nsecs) % 0x100000000;
  b[i++] = tl >>> 24 & 0xff;
  b[i++] = tl >>> 16 & 0xff;
  b[i++] = tl >>> 8 & 0xff;
  b[i++] = tl & 0xff;

  // `time_mid`
  var tmh = (msecs / 0x100000000 * 10000) & 0xfffffff;
  b[i++] = tmh >>> 8 & 0xff;
  b[i++] = tmh & 0xff;

  // `time_high_and_version`
  b[i++] = tmh >>> 24 & 0xf | 0x10; // include version
  b[i++] = tmh >>> 16 & 0xff;

  // `clock_seq_hi_and_reserved` (Per 4.2.2 - include variant)
  b[i++] = clockseq >>> 8 | 0x80;

  // `clock_seq_low`
  b[i++] = clockseq & 0xff;

  // `node`
  for (var n = 0; n < 6; ++n) {
    b[i + n] = node[n];
  }

  return buf ? buf : bytesToUuid_1(b);
}

var v1_1 = v1;

function v4(options, buf, offset) {
  var i = buf && offset || 0;

  if (typeof(options) == 'string') {
    buf = options === 'binary' ? new Array(16) : null;
    options = null;
  }
  options = options || {};

  var rnds = options.random || (options.rng || rng)();

  // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`
  rnds[6] = (rnds[6] & 0x0f) | 0x40;
  rnds[8] = (rnds[8] & 0x3f) | 0x80;

  // Copy bytes to buffer, if provided
  if (buf) {
    for (var ii = 0; ii < 16; ++ii) {
      buf[i + ii] = rnds[ii];
    }
  }

  return buf || bytesToUuid_1(rnds);
}

var v4_1 = v4;

var uuid = v4_1;
uuid.v1 = v1_1;
uuid.v4 = v4_1;

var uuid_1 = uuid;

function renderHeader(headerOptions, props) {
  var children = headerOptions.children,
      component = headerOptions.component;
  var _custom = null;
  var _menu = null;

  if (component) {
    _custom = React.cloneElement(component, props);
  }

  if (children) {
    var left = [];
    var right = [];
    children.forEach(function (child, index) {
      var el = transferHeaderChild(child, props, index);

      if (child.textAlign === 'right') {
        right.push(el);
      } else {
        left.push(el);
      }
    });
    _menu = React__default.createElement("div", {
      className: "edu-dialog-header"
    }, React__default.createElement("div", {
      className: "edu-dialog-header-section"
    }, left), React__default.createElement("div", {
      className: "edu-dialog-header-section"
    }, right));
  }

  return React__default.createElement(React__default.Fragment, null, _custom, _menu);
}

function transferHeaderChild(child, props, index) {
  child.key = index;

  if (child.type === 'Custom') {
    var _component = child.component;
    return React__default.cloneElement(_component, props);
  }

  switch (child.type) {
    case 'Button':
      return getHeaderButton();

    case 'Checkbox':
      return getHeaderCheckbox(child, props);

    case 'Search':
      return getHeaderSearch(child, props);

    case 'Select':
      return getHeaderSelect(child, props);
  }

  return null;
}

function getHeaderButton()
/* child: IHeaderChild, props: IDialogProps */
{
  return React__default.createElement(zent.Button, null, "\u5C1A\u672A\u5B9E\u73B0");
}

function getHeaderCheckbox(child, props) {
  var name = child.name,
      text = child.text,
      restProps = _objectWithoutProperties(child, ["name", "text"]);

  var header = props.header,
      change = props.change;
  return React__default.createElement(zent.Checkbox, _extends({
    checked: header[name],
    onChange: function onChange(e) {
      return change(_defineProperty({}, name, e.target.checked));
    }
  }, restProps), text);
}

function getHeaderSearch(child, props) {
  var name = child.name,
      restProps = _objectWithoutProperties(child, ["name"]);

  var header = props.header,
      change = props.change,
      fetch = props.fetch;
  return React__default.createElement(zent.Input, _extends({
    icon: "search",
    value: header[name],
    onChange: function onChange(e) {
      return change(_defineProperty({}, name, e.target.value));
    },
    onPressEnter: function onPressEnter() {
      return fetch({
        reset: true
      });
    }
  }, restProps));
}

function getHeaderSelect(child, props) {
  var name = child.name,
      data = child.data,
      restProps = _objectWithoutProperties(child, ["name", "data"]);

  var header = props.header,
      change = props.change,
      fetch = props.fetch;

  if (!data) {
    throw new Error('Data lacked in the props of Select');
  }

  return React__default.createElement(zent.Select, _extends({
    data: data,
    value: header[name],
    onChange: function onChange(_d, selected) {
      change(_defineProperty({}, name, selected.value)).then(function () {
        fetch({
          reset: true
        });
      });
    }
  }, restProps));
}

function renderTable(tableOptions, props, datasets) {
  var select = props.select,
      table = props.table,
      ext = props.ext,
      loading = props.loading;

  var rowKey = tableOptions.rowKey,
      columns = tableOptions.columns,
      restTableOptions = _objectWithoutProperties(tableOptions, ["rowKey", "columns"]);

  var current = table.current,
      pageSize = table.pageSize,
      totalItem = table.totalItem,
      selectedRows = table.selectedRows;
  var _pageInfo = {
    current: current || 1,
    pageSize: pageSize || 20,
    totalItem: totalItem || 0
  };

  var _selection = Object.assign({}, tableOptions.selection, {
    onSelect: select,
    selectedRowKeys: selectedRows.map(function (selectedRow) {
      return selectedRow[rowKey];
    })
  });

  var _columns = columns.map(function (_ref) {
    var _bodyRender = _ref.bodyRender,
        restColumn = _objectWithoutProperties(_ref, ["bodyRender"]);

    if (_bodyRender) {
      return _objectSpread2({
        bodyRender: function bodyRender(data) {
          return _bodyRender(data, {
            ext: ext,
            onExtChange: function onExtChange(ext, cb) {
              if (typeof ext === 'function') {
                props.setExt(ext(props.ext), cb);
              } else {
                props.setExt(ext, cb);
              }
            },
            onRowSelect: function onRowSelect() {
              // only support one data selected currently
              var notSelected = selectedRows.findIndex(function (selectedRow) {
                return selectedRow[rowKey] === data[rowKey];
              }) === -1;

              if (notSelected) {
                var _selectedRows = selectedRows.concat([data]);

                select(_selectedRows.map(function (selectedRow) {
                  return selectedRow[rowKey];
                }), _selectedRows, data);
              }
            }
          });
        }
      }, restColumn);
    }

    return _objectSpread2({}, restColumn);
  });

  return React__default.createElement(zent.Table, _extends({}, restTableOptions, {
    loading: loading,
    rowKey: rowKey,
    columns: _columns,
    datasets: datasets,
    pageInfo: _pageInfo,
    selection: _selection,
    onChange: function onChange(params) {
      props.change(params).then(props.fetch);
    }
  }));
}

function renderFooter(tableOptions, props) {
  return React.cloneElement(tableOptions.component, props);
}

var openDialog = zent.Dialog.openDialog,
    closeDialog = zent.Dialog.closeDialog;
function chooseDialog(options) {
  var header = options.header,
      table = options.table,
      footer = options.footer,
      ext = options.ext,
      onFetch = options.onFetch,
      onSubmit = options.onSubmit,
      afterFetch = options.afterFetch,
      dialogOptions = _objectWithoutProperties(options, ["header", "table", "footer", "ext", "onFetch", "onSubmit", "afterFetch"]);

  var dialogId = uuid_1.v4();
  var selectedRows = table.selectedRows;

  var DialogComponent =
  /*#__PURE__*/
  function (_PureComponent) {
    _inherits(DialogComponent, _PureComponent);

    function DialogComponent() {
      var _getPrototypeOf2;

      var _this;

      _classCallCheck(this, DialogComponent);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(DialogComponent)).call.apply(_getPrototypeOf2, [this].concat(args)));

      _defineProperty(_assertThisInitialized(_this), "state", {
        header: {},
        table: {
          rowKey: table.rowKey || 'id',
          totalItem: 0,
          pageSize: 20,
          current: 1,
          selectedRows: selectedRows || []
        },
        footer: {},
        ext: ext,
        loading: false,
        datasets: []
      });

      _defineProperty(_assertThisInitialized(_this), "wrapFetch", function (data, params) {
        _this.setState({
          loading: true
        });

        onFetch(data, params).then(_this.afterFetch)["catch"](function (err) {
          zent.Notify.error(err);
        })["finally"](function () {
          _this.setState({
            loading: false
          });
        });
      });

      _defineProperty(_assertThisInitialized(_this), "getPropsByType", function (type) {
        var _assertThisInitialize = _assertThisInitialized(_this),
            _assertThisInitialize2 = _assertThisInitialize.state,
            header = _assertThisInitialize2.header,
            table = _assertThisInitialize2.table,
            footer = _assertThisInitialize2.footer,
            datasets = _assertThisInitialize2.datasets,
            ext = _assertThisInitialize2.ext,
            loading = _assertThisInitialize2.loading,
            fetch = _assertThisInitialize.fetch,
            select = _assertThisInitialize.select,
            setExt = _assertThisInitialize.setExt,
            submit = _assertThisInitialize.submit,
            cancel = _assertThisInitialize.cancel;

        return {
          header: header,
          table: table,
          footer: footer,
          datasets: datasets,
          ext: ext,
          loading: loading,
          fetch: fetch,
          select: select,
          setExt: setExt,
          submit: submit,
          cancel: cancel,
          change: function change(value) {
            return new Promise(function (resolve) {
              _this.setState(_defineProperty({}, type, Object.assign({}, _this.state[type], value)), resolve);
            });
          }
        };
      });

      _defineProperty(_assertThisInitialized(_this), "setExt", function (ext, cb) {
        _this.setState({
          ext: Object.assign({}, _this.state.ext, ext)
        }, cb);
      });

      _defineProperty(_assertThisInitialized(_this), "fetch", function (params) {
        var _ref = _this.state,
            header = _ref.header,
            table = _ref.table,
            footer = _ref.footer;
        return _this.wrapFetch({
          header: header,
          table: table,
          footer: footer
        }, params);
      });

      _defineProperty(_assertThisInitialized(_this), "afterFetch", function (_ref2) {
        var datasets = _ref2.datasets,
            totalItem = _ref2.totalItem,
            current = _ref2.current,
            pageSize = _ref2.pageSize;

        var _table = Object.assign({}, _this.state.table);

        var rowKey = _table.rowKey;
        var newSelectedRows = [];
        var oldSelectedRows = _table.selectedRows || [];
        oldSelectedRows.forEach(function (row) {
          var newRow = (datasets || []).find(function (v) {
            return v[rowKey] === row[rowKey];
          });
          newSelectedRows.push(newRow || row);
        });
        _table.totalItem = totalItem;
        _table.current = current;
        _table.selectedRows = newSelectedRows;

        if (pageSize) {
          _table.pageSize = pageSize;
        }

        _this.setState({
          datasets: datasets,
          table: _table
        }, function () {
          if (afterFetch) {
            afterFetch(_this.getPropsByType('table'));
          }
        });

        return Promise.resolve();
      });

      _defineProperty(_assertThisInitialized(_this), "submit", function () {
        var _this$state = _this.state,
            table = _this$state.table,
            ext = _this$state.ext;
        var selectedRows = table && table.selectedRows || [];
        return onSubmit(selectedRows, ext).then(function () {
          _this.close();
        })["catch"](function (e) {
          var message = '';

          if (e && e.message) {
            message = e.message;
          } else {
            message = e;
          }

          zent.Notify.error(message);
        });
      });

      _defineProperty(_assertThisInitialized(_this), "cancel", function () {
        closeDialog(dialogId, {
          triggerOnClose: true
        });
      });

      _defineProperty(_assertThisInitialized(_this), "close", function () {
        closeDialog(dialogId, {
          triggerOnClose: false
        });
      });

      _defineProperty(_assertThisInitialized(_this), "select", function (selectedRowKeys, selectedRows, _currentRow) {
        var rowKey = _this.state.table && _this.state.table.rowKey || 'id';
        var preSelectedRows = _this.state.table && _this.state.table.selectedRows || [];
        var curSelectedRows = selectedRowKeys.map(function (selectedRowKey) {
          return selectedRows.find(function (selectedRow) {
            return selectedRow[rowKey] === selectedRowKey;
          }) || preSelectedRows.find(function (selectedRow) {
            return selectedRow[rowKey] === selectedRowKey;
          });
        });
        var table = Object.assign({}, _this.state.table);

        if (options.onSelect) {
          var _ext = _this.state.ext;
          var res = options.onSelect(curSelectedRows, _this.state.ext, function (valueOrFunc) {
            if (typeof valueOrFunc === 'function') {
              _this.setExt(valueOrFunc(_ext));
            } else {
              _this.setExt(valueOrFunc);
            }
          });

          if (res instanceof Promise) {
            res.then(function (_selectedRows) {
              table.selectedRows = _selectedRows;

              _this.setState({
                table: table
              });
            });
            return;
          }
        }

        table.selectedRows = curSelectedRows;

        _this.setState({
          table: table
        });
      });

      return _this;
    }

    _createClass(DialogComponent, [{
      key: "componentDidMount",
      value: function componentDidMount() {
        this.wrapFetch({
          header: this.state.header,
          table: this.state.table,
          footer: this.state.footer
        });
      }
    }, {
      key: "render",
      value: function render() {
        return React__default.createElement("div", {
          className: "edu-dialog"
        }, renderHeader(header, this.getPropsByType('header')), renderTable(table, this.getPropsByType('table'), this.state.datasets), renderFooter(footer, this.getPropsByType('footer')));
      }
    }]);

    return DialogComponent;
  }(React.PureComponent);

  var children = React.createElement(DialogComponent);
  openDialog(_objectSpread2({
    dialogId: dialogId,
    children: children
  }, dialogOptions));
}

module.exports = chooseDialog;
