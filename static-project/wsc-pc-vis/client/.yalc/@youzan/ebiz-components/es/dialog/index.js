'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = _interopDefault(require('react'));
var zent = require('zent');
var EventEmitter = _interopDefault(require('wolfy87-eventemitter'));

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

var zentOpenDialog = zent.Dialog.openDialog,
    closeDialog = zent.Dialog.closeDialog;
/**
 * 打开 dialog 弹窗
 *
 * @param Child - 要打开弹窗组件
 * @param options - 参数
 */

function openDialog(Child) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var _options$dialogId = options.dialogId,
      dialogId = _options$dialogId === void 0 ? Date.now().toString() : _options$dialogId,
      title = options.title,
      _options$data = options.data,
      data = _options$data === void 0 ? null : _options$data,
      closeBtn = options.closeBtn,
      mask = options.mask,
      maskClosable = options.maskClosable,
      parentComponent = options.parentComponent,
      className = options.className,
      prefix = options.prefix,
      style = options.style,
      _options$submitEffect = options.submitEffect,
      submitEffect = _options$submitEffect === void 0 ? function () {
    return Promise.resolve(true);
  } : _options$submitEffect;
  var event$ = new EventEmitter();
  var close$$ = new Promise(function (resolve, reject) {
    event$.once('submit', resolve);
    event$.once('close', function () {
      reject();
    });
  });

  var closeDialogAdopet = function closeDialogAdopet() {
    closeDialog(dialogId, {
      triggerOnClose: true
    });
  };

  var DialogContent = function DialogContent() {
    var _React$useState = React.useState(false),
        _React$useState2 = _slicedToArray(_React$useState, 2),
        loadingState = _React$useState2[0],
        setLoadingState = _React$useState2[1];

    var handleSubmit = React.useCallback(function (data) {
      if (submitEffect) {
        setLoadingState(true);
        submitEffect(data).then(function (allowClose) {
          return allowClose ? Promise.resolve(data) : Promise.reject();
        }).then(function (data) {
          event$.emit('submit', data);
          closeDialog(dialogId, {
            triggerOnClose: false
          });
        })["catch"](function (err) {
          return err && zent.Notify.error(err);
        })["finally"](function () {
          return setLoadingState(false);
        });
      } else event$.emit('submit', data);
    }, []);
    return React.createElement(Child, {
      data: data,
      loadingState: loadingState,
      dialogref: {
        submit: handleSubmit,
        close: closeDialogAdopet
      }
    });
  };

  zentOpenDialog({
    dialogId: dialogId,
    children: React.createElement(DialogContent, null),
    title: title,
    closeBtn: closeBtn,
    mask: mask,
    maskClosable: maskClosable,
    parentComponent: parentComponent,
    className: className,
    prefix: prefix,
    style: style,
    onClose: function onClose() {
      event$.emit('close');
    }
  });
  return {
    close: closeDialogAdopet,
    afterClosed: function afterClosed() {
      return close$$;
    }
  };
}
var DialogBody = function DialogBody(_ref) {
  var children = _ref.children;
  return React.createElement("div", {
    className: "dialog-r-body"
  }, children);
};
var DialogFooter = function DialogFooter(_ref2) {
  var children = _ref2.children;
  return React.createElement("div", {
    className: "dialog-r-footer"
  }, children);
};

var index = {
  openDialog: openDialog,
  DialogBody: DialogBody,
  DialogFooter: DialogFooter
};

module.exports = index;
