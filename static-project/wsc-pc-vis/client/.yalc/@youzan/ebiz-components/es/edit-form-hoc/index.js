'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = require('react');
var React__default = _interopDefault(React);
var zent = require('zent');
var reactRouter = require('react-router');

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

var openDialog = zent.Dialog.openDialog,
    closeDialog = zent.Dialog.closeDialog;

var handleWindowClose = function handleWindowClose(e) {
  e.returnValue = true;
}; // popstate可监听浏览器的回退/前进事件，此外popstate事件当进入页面或通过a链接跳转时均会触发，故此处使用e.state使popstate可控


var handleGoBack = function handleGoBack(e) {
  if (e.state) {
    openGoBackDialog();
  }
};

var handleRedirect = function handleRedirect(url, type) {
  if (type === 'history') {
    location.href = url;
  } else {
    openGoBackDialog(url);
  }
};

var removeListener = function removeListener() {
  window.removeEventListener('beforeunload', handleWindowClose);
  window.removeEventListener('popstate', handleGoBack);
};

var openGoBackDialog = function openGoBackDialog(url) {
  var dialogId = 'closeDoubleConfirm';
  openDialog({
    dialogId: dialogId,
    children: React__default.createElement("div", null, React__default.createElement("p", null, "\u6B64\u65F6\u79BB\u5F00\u5C06\u4E22\u5931\u5DF2\u7F16\u8F91\u7684\u5185\u5BB9\uFF0C\u662F\u5426\u79BB\u5F00\uFF1F")),
    footer: React__default.createElement(React__default.Fragment, null, React__default.createElement(zent.Button, {
      onClick: function onClick() {
        closeDialog(dialogId);
        window.history.back();
      }
    }, "\u53D6\u6D88"), React__default.createElement(zent.Button, {
      onClick: function onClick() {
        closeDialog(dialogId);
        removeListener();

        if (url) {
          reactRouter.hashHistory.push(url);
        } else {
          if (window.history.state) {
            // 为了中和useEffect进入页面的pushState
            reactRouter.hashHistory.goBack();
          }

          reactRouter.hashHistory.goBack();
        }
      },
      type: "primary"
    }, "\u786E\u5B9A"))
  });
};

var goBackWithoutConfirm = function goBackWithoutConfirm() {
  removeListener(); // 为了中和useEffect进入页面的pushState

  if (window.history.state) {
    reactRouter.hashHistory.go(-2);
  } // 兼容页面没有加载完成时的回退


  reactRouter.hashHistory.goBack();
};

var redirectWithoutConfirm = function redirectWithoutConfirm(url) {
  var hashRouter = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  removeListener();

  if (window.history.state) {
    reactRouter.hashHistory.go(-2);
  } // 防止先执行浏览器跳转，之后执行回退。（如果不使用异步，难以控制回退和浏览器popState顺序）


  setTimeout(function () {
    if (hashRouter) {
      reactRouter.hashHistory.push(url);
    } else {
      window.location.href = url;
    }
  }, 100);
};

var EditFormHOC = function EditFormHOC(WrappedComponent) {
  var ExitForm = function ExitForm(props) {
    React.useEffect(function () {
      // 点击浏览器回退事件会先触发popstate，随后触发popstate监听事件，写两个的作用是保证history.state不为空
      window.history.pushState({
        name: 'browserBack'
      }, 'on browser back click', window.location.href);
      window.history.pushState({
        name: 'initState'
      }, '', '');
      window.addEventListener('beforeunload', handleWindowClose);
      window.addEventListener('popstate', handleGoBack);
      return function () {
        window.removeEventListener('beforeunload', handleWindowClose);
        window.removeEventListener('popstate', handleGoBack);
      };
    }, []);
    return React__default.createElement(WrappedComponent, props);
  };

  return ExitForm;
};

var EditFormHOCRef = function EditFormHOCRef(WrappedComponent) {
  var ExitForm = function ExitForm(props, ref) {
    React.useEffect(function () {
      // 点击浏览器回退事件会先触发popstate，随后触发popstate监听事件，写两个的作用是保证history.state不为空
      window.history.pushState({
        name: 'browserBack'
      }, 'on browser back click', window.location.href);
      window.history.pushState({
        name: 'initState'
      }, '', '');
      window.addEventListener('beforeunload', handleWindowClose);
      window.addEventListener('popstate', handleGoBack);
      return function () {
        window.removeEventListener('beforeunload', handleWindowClose);
        window.removeEventListener('popstate', handleGoBack);
      };
    }, []);
    return React__default.createElement(WrappedComponent, _extends({}, props, {
      ref: ref
    }));
  };

  return React__default.forwardRef(ExitForm);
};

var index = {
  EditFormHOC: EditFormHOC,
  EditFormHOCRef: EditFormHOCRef,
  redirectWithoutConfirm: redirectWithoutConfirm,
  goBackWithoutConfirm: goBackWithoutConfirm,
  handleGoBack: handleGoBack,
  removeListener: removeListener,
  handleRedirect: handleRedirect
};

module.exports = index;
