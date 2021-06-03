'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = _interopDefault(require('react'));
var zent = require('zent');
var cx = _interopDefault(require('classnames'));

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

/**
 * Checks if `value` is `null` or `undefined`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is nullish, else `false`.
 * @example
 *
 * _.isNil(null);
 * // => true
 *
 * _.isNil(void 0);
 * // => true
 *
 * _.isNil(NaN);
 * // => false
 */
function isNil(value) {
  return value == null;
}

var isNil_1 = isNil;

function useHackEffect(_effect) {

  return function () {
    return void 0;
  };
}

function useHackCallback(_fn) {

  return function () {
    return void 0;
  };
}

var isSSR = typeof window === 'undefined';
var useLayoutEffect = isSSR ? useHackEffect : React.useLayoutEffect;
var useCallback = isSSR ? useHackCallback : React.useCallback; // 通用的ssr函数

function genericSSRWrapper(fn) {
  if (isSSR) return function () {
    return void 0;
  };
  return fn;
} // 在SSR下只会返回false

function alwaysFalsyInSSR(condition) {
  if (isSSR) return false;
  return typeof condition === 'function' ? condition() : condition;
}

var PopEllipsisText = function PopEllipsisText(props) {
  var text = props.text,
      count = props.count,
      width = props.width,
      style = props.style,
      tagName = props.tagName,
      _props$nowarp = props.nowarp,
      nowarp = _props$nowarp === void 0 ? true : _props$nowarp,
      _props$selector = props.selector,
      selector = _props$selector === void 0 ? '' : _props$selector,
      _props$defaultText = props.defaultText,
      defaultText = _props$defaultText === void 0 ? '' : _props$defaultText,
      renderVirtualNode = props.renderVirtualNode,
      _props$deferEllipsis = props.deferEllipsis,
      deferEllipsis = _props$deferEllipsis === void 0 ? false : _props$deferEllipsis,
      _props$position = props.position,
      position = _props$position === void 0 ? 'top-center' : _props$position;

  var _React$useState = React.useState(false),
      _React$useState2 = _slicedToArray(_React$useState, 2),
      isOverflow = _React$useState2[0],
      setOverflow = _React$useState2[1];

  var _React$useState3 = React.useState(false),
      _React$useState4 = _slicedToArray(_React$useState3, 2),
      genVNode = _React$useState4[0],
      setGenState = _React$useState4[1];

  var _React$useState5 = React.useState(),
      _React$useState6 = _slicedToArray(_React$useState5, 2),
      selectorWidth = _React$useState6[0],
      setSelectorWidth = _React$useState6[1];

  var idRef = React.useRef(uniqId.id);
  var innerText = React.useMemo(function () {
    return renderVirtualNode || selector ? text : "".concat(text.slice(0, count), "...");
  }, [count, renderVirtualNode, selector, text]);
  var widthLimitation = React.useMemo(function () {
    if (renderVirtualNode) {
      return width || 0;
    }

    return String(selectorWidth).replace('px', '') || 0;
  }, [renderVirtualNode, selectorWidth, width]);
  var handleSelector = useCallback(function () {
    // 如果有选择器，就向上查找父节点，找到符合条件的父节点
    var alternativeParentNode = document.querySelectorAll(selector);
    var targetNode = document.querySelector(".pop-ellipsis-wrapper[data-id=pop-text-".concat(idRef.current, "]"));

    if (alternativeParentNode.length && targetNode) {
      var foundNode;
      var targetParentNode;
      alternativeParentNode.forEach(function (node) {
        if (foundNode) return;else {
          foundNode = findTargetNode(node, targetNode);
          if (foundNode) targetParentNode = node;
        }
      });

      if (foundNode && targetParentNode) {
        setSelectorWidth(getComputedStyle(targetParentNode).width);
      }
    }
  }, [selector]);
  var handleVirtualNode = useCallback(function () {
    var TAG_NAME = tagName || 'span';
    var vNode = document.getElementById('popVNode');

    if (!vNode) {
      var newNode = document.createElement(TAG_NAME);
      newNode.id = 'popVNode';
      newNode.dataset.name = 'popVNode';
      newNode.style.position = 'fixed';
      newNode.style.display = 'inline-block';
      newNode.style.left = '-1000px';
      newNode.style.bottom = '-1000px';
      newNode.style.visibility = 'hidden';
      document.body.appendChild(newNode);
      vNode = newNode;
    }

    vNode.innerText = innerText; // 标记删除

    removeVNode.register2remove();
    setGenState(true);

    if (vNode.clientWidth >= widthLimitation) {
      setOverflow(true);
    }
  }, [innerText, tagName, widthLimitation]); // 如果需要依据虚拟dom判断

  useLayoutEffect(function () {
    if (selector) {
      if (!selectorWidth) handleSelector();
      handleVirtualNode();
    } else if (renderVirtualNode && !genVNode) {
      handleVirtualNode();
    }
  }, [genVNode, handleSelector, handleVirtualNode, renderVirtualNode, selector, selectorWidth]);
  var classnames = React.useMemo(function () {
    var showEllipsis = !deferEllipsis || selectorWidth || width;
    return cx({
      'pop-ellipsis-text': showEllipsis,
      'pop-ellipsis-nowrap': showEllipsis && nowarp,
      'pop-ellipsis-wrapper': true,
      'pop-ellipsis-fixed-height': !showEllipsis
    });
  }, [deferEllipsis, nowarp, selectorWidth, width]);
  var renderPopover = React.useMemo(function () {
    return alwaysFalsyInSSR(!isNil_1(count) && text.length > count || isOverflow);
  }, [count, isOverflow, text.length]);

  if (renderPopover) {
    return React.createElement(zent.Pop, {
      block: true,
      trigger: "hover",
      className: "pop-ellipsis-popover",
      content: text,
      position: position
    }, React.createElement(tagName || 'span', {
      className: classnames,
      style: Object.assign({}, style, {
        width: selectorWidth || width || 'auto'
      }),
      'data-id': "pop-text-".concat(idRef.current)
    }, innerText));
  }

  return React.createElement(tagName || 'span', {
    className: classnames,
    style: Object.assign({}, style, {
      width: selectorWidth || width || 'auto'
    }),
    'data-id': "pop-text-".concat(idRef.current)
  }, text || defaultText);
};

function findTargetNode(ele, targetNode) {
  var legallyNode;

  if (ele === targetNode) {
    return ele;
  }

  if (ele.childNodes.length) {
    ele.childNodes.forEach(function (child) {
      if (legallyNode) return;

      if (child === targetNode) {
        legallyNode = child;
      } else {
        legallyNode = findTargetNode(child, targetNode);
      }
    });
  }

  return legallyNode;
}

var uniqId = {
  __value: 0,

  get id() {
    var curValue = this.__value;
    this.__value += 1;
    return curValue;
  }

};
var removeVNode = {
  __timer: undefined,
  __remove: genericSSRWrapper(function () {
    var targetNode = document.getElementById('popVNode');

    if (targetNode) {
      document.body.removeChild(targetNode);
      this.__timer = undefined;
    }
  }),
  register2remove: function register2remove() {
    if (this.__timer !== undefined) {
      clearTimeout(this.__timer);
    }

    this.__timer = setTimeout(this.__remove, 0);
  }
};

module.exports = PopEllipsisText;
