'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = require('react');
var React__default = _interopDefault(React);
var reactIs = require('react-is');
var zent = require('zent');
var cx = _interopDefault(require('classnames'));
var ReactDOM = _interopDefault(require('react-dom'));
var EventEmitter = _interopDefault(require('wolfy87-eventemitter'));
var qs = _interopDefault(require('qs'));

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

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  }
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArray(iter) {
  if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
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

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance");
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance");
}

/**
 * A specialized version of `_.map` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the new mapped array.
 */
function arrayMap(array, iteratee) {
  var index = -1,
      length = array == null ? 0 : array.length,
      result = Array(length);

  while (++index < length) {
    result[index] = iteratee(array[index], index, array);
  }
  return result;
}

var _arrayMap = arrayMap;

/**
 * Removes all key-value entries from the list cache.
 *
 * @private
 * @name clear
 * @memberOf ListCache
 */
function listCacheClear() {
  this.__data__ = [];
  this.size = 0;
}

var _listCacheClear = listCacheClear;

/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq(value, other) {
  return value === other || (value !== value && other !== other);
}

var eq_1 = eq;

/**
 * Gets the index at which the `key` is found in `array` of key-value pairs.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} key The key to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function assocIndexOf(array, key) {
  var length = array.length;
  while (length--) {
    if (eq_1(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}

var _assocIndexOf = assocIndexOf;

/** Used for built-in method references. */
var arrayProto = Array.prototype;

/** Built-in value references. */
var splice = arrayProto.splice;

/**
 * Removes `key` and its value from the list cache.
 *
 * @private
 * @name delete
 * @memberOf ListCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function listCacheDelete(key) {
  var data = this.__data__,
      index = _assocIndexOf(data, key);

  if (index < 0) {
    return false;
  }
  var lastIndex = data.length - 1;
  if (index == lastIndex) {
    data.pop();
  } else {
    splice.call(data, index, 1);
  }
  --this.size;
  return true;
}

var _listCacheDelete = listCacheDelete;

/**
 * Gets the list cache value for `key`.
 *
 * @private
 * @name get
 * @memberOf ListCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function listCacheGet(key) {
  var data = this.__data__,
      index = _assocIndexOf(data, key);

  return index < 0 ? undefined : data[index][1];
}

var _listCacheGet = listCacheGet;

/**
 * Checks if a list cache value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf ListCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function listCacheHas(key) {
  return _assocIndexOf(this.__data__, key) > -1;
}

var _listCacheHas = listCacheHas;

/**
 * Sets the list cache `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf ListCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the list cache instance.
 */
function listCacheSet(key, value) {
  var data = this.__data__,
      index = _assocIndexOf(data, key);

  if (index < 0) {
    ++this.size;
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }
  return this;
}

var _listCacheSet = listCacheSet;

/**
 * Creates an list cache object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function ListCache(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `ListCache`.
ListCache.prototype.clear = _listCacheClear;
ListCache.prototype['delete'] = _listCacheDelete;
ListCache.prototype.get = _listCacheGet;
ListCache.prototype.has = _listCacheHas;
ListCache.prototype.set = _listCacheSet;

var _ListCache = ListCache;

/**
 * Removes all key-value entries from the stack.
 *
 * @private
 * @name clear
 * @memberOf Stack
 */
function stackClear() {
  this.__data__ = new _ListCache;
  this.size = 0;
}

var _stackClear = stackClear;

/**
 * Removes `key` and its value from the stack.
 *
 * @private
 * @name delete
 * @memberOf Stack
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function stackDelete(key) {
  var data = this.__data__,
      result = data['delete'](key);

  this.size = data.size;
  return result;
}

var _stackDelete = stackDelete;

/**
 * Gets the stack value for `key`.
 *
 * @private
 * @name get
 * @memberOf Stack
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function stackGet(key) {
  return this.__data__.get(key);
}

var _stackGet = stackGet;

/**
 * Checks if a stack value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Stack
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function stackHas(key) {
  return this.__data__.has(key);
}

var _stackHas = stackHas;

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof commonjsGlobal == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;

var _freeGlobal = freeGlobal;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = _freeGlobal || freeSelf || Function('return this')();

var _root = root;

/** Built-in value references. */
var Symbol$1 = _root.Symbol;

var _Symbol = Symbol$1;

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/** Built-in value references. */
var symToStringTag = _Symbol ? _Symbol.toStringTag : undefined;

/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */
function getRawTag(value) {
  var isOwn = hasOwnProperty.call(value, symToStringTag),
      tag = value[symToStringTag];

  try {
    value[symToStringTag] = undefined;
    var unmasked = true;
  } catch (e) {}

  var result = nativeObjectToString.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag] = tag;
    } else {
      delete value[symToStringTag];
    }
  }
  return result;
}

var _getRawTag = getRawTag;

/** Used for built-in method references. */
var objectProto$1 = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString$1 = objectProto$1.toString;

/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */
function objectToString(value) {
  return nativeObjectToString$1.call(value);
}

var _objectToString = objectToString;

/** `Object#toString` result references. */
var nullTag = '[object Null]',
    undefinedTag = '[object Undefined]';

/** Built-in value references. */
var symToStringTag$1 = _Symbol ? _Symbol.toStringTag : undefined;

/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag;
  }
  return (symToStringTag$1 && symToStringTag$1 in Object(value))
    ? _getRawTag(value)
    : _objectToString(value);
}

var _baseGetTag = baseGetTag;

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return value != null && (type == 'object' || type == 'function');
}

var isObject_1 = isObject;

/** `Object#toString` result references. */
var asyncTag = '[object AsyncFunction]',
    funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    proxyTag = '[object Proxy]';

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  if (!isObject_1(value)) {
    return false;
  }
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 9 which returns 'object' for typed arrays and other constructors.
  var tag = _baseGetTag(value);
  return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
}

var isFunction_1 = isFunction;

/** Used to detect overreaching core-js shims. */
var coreJsData = _root['__core-js_shared__'];

var _coreJsData = coreJsData;

/** Used to detect methods masquerading as native. */
var maskSrcKey = (function() {
  var uid = /[^.]+$/.exec(_coreJsData && _coreJsData.keys && _coreJsData.keys.IE_PROTO || '');
  return uid ? ('Symbol(src)_1.' + uid) : '';
}());

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked(func) {
  return !!maskSrcKey && (maskSrcKey in func);
}

var _isMasked = isMasked;

/** Used for built-in method references. */
var funcProto = Function.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to convert.
 * @returns {string} Returns the source code.
 */
function toSource(func) {
  if (func != null) {
    try {
      return funcToString.call(func);
    } catch (e) {}
    try {
      return (func + '');
    } catch (e) {}
  }
  return '';
}

var _toSource = toSource;

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Used for built-in method references. */
var funcProto$1 = Function.prototype,
    objectProto$2 = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString$1 = funcProto$1.toString;

/** Used to check objects for own properties. */
var hasOwnProperty$1 = objectProto$2.hasOwnProperty;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  funcToString$1.call(hasOwnProperty$1).replace(reRegExpChar, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative(value) {
  if (!isObject_1(value) || _isMasked(value)) {
    return false;
  }
  var pattern = isFunction_1(value) ? reIsNative : reIsHostCtor;
  return pattern.test(_toSource(value));
}

var _baseIsNative = baseIsNative;

/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue(object, key) {
  return object == null ? undefined : object[key];
}

var _getValue = getValue;

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = _getValue(object, key);
  return _baseIsNative(value) ? value : undefined;
}

var _getNative = getNative;

/* Built-in method references that are verified to be native. */
var Map$1 = _getNative(_root, 'Map');

var _Map = Map$1;

/* Built-in method references that are verified to be native. */
var nativeCreate = _getNative(Object, 'create');

var _nativeCreate = nativeCreate;

/**
 * Removes all key-value entries from the hash.
 *
 * @private
 * @name clear
 * @memberOf Hash
 */
function hashClear() {
  this.__data__ = _nativeCreate ? _nativeCreate(null) : {};
  this.size = 0;
}

var _hashClear = hashClear;

/**
 * Removes `key` and its value from the hash.
 *
 * @private
 * @name delete
 * @memberOf Hash
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function hashDelete(key) {
  var result = this.has(key) && delete this.__data__[key];
  this.size -= result ? 1 : 0;
  return result;
}

var _hashDelete = hashDelete;

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/** Used for built-in method references. */
var objectProto$3 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$2 = objectProto$3.hasOwnProperty;

/**
 * Gets the hash value for `key`.
 *
 * @private
 * @name get
 * @memberOf Hash
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function hashGet(key) {
  var data = this.__data__;
  if (_nativeCreate) {
    var result = data[key];
    return result === HASH_UNDEFINED ? undefined : result;
  }
  return hasOwnProperty$2.call(data, key) ? data[key] : undefined;
}

var _hashGet = hashGet;

/** Used for built-in method references. */
var objectProto$4 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$3 = objectProto$4.hasOwnProperty;

/**
 * Checks if a hash value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Hash
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function hashHas(key) {
  var data = this.__data__;
  return _nativeCreate ? (data[key] !== undefined) : hasOwnProperty$3.call(data, key);
}

var _hashHas = hashHas;

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED$1 = '__lodash_hash_undefined__';

/**
 * Sets the hash `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Hash
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the hash instance.
 */
function hashSet(key, value) {
  var data = this.__data__;
  this.size += this.has(key) ? 0 : 1;
  data[key] = (_nativeCreate && value === undefined) ? HASH_UNDEFINED$1 : value;
  return this;
}

var _hashSet = hashSet;

/**
 * Creates a hash object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Hash(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `Hash`.
Hash.prototype.clear = _hashClear;
Hash.prototype['delete'] = _hashDelete;
Hash.prototype.get = _hashGet;
Hash.prototype.has = _hashHas;
Hash.prototype.set = _hashSet;

var _Hash = Hash;

/**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 */
function mapCacheClear() {
  this.size = 0;
  this.__data__ = {
    'hash': new _Hash,
    'map': new (_Map || _ListCache),
    'string': new _Hash
  };
}

var _mapCacheClear = mapCacheClear;

/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */
function isKeyable(value) {
  var type = typeof value;
  return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
    ? (value !== '__proto__')
    : (value === null);
}

var _isKeyable = isKeyable;

/**
 * Gets the data for `map`.
 *
 * @private
 * @param {Object} map The map to query.
 * @param {string} key The reference key.
 * @returns {*} Returns the map data.
 */
function getMapData(map, key) {
  var data = map.__data__;
  return _isKeyable(key)
    ? data[typeof key == 'string' ? 'string' : 'hash']
    : data.map;
}

var _getMapData = getMapData;

/**
 * Removes `key` and its value from the map.
 *
 * @private
 * @name delete
 * @memberOf MapCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function mapCacheDelete(key) {
  var result = _getMapData(this, key)['delete'](key);
  this.size -= result ? 1 : 0;
  return result;
}

var _mapCacheDelete = mapCacheDelete;

/**
 * Gets the map value for `key`.
 *
 * @private
 * @name get
 * @memberOf MapCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function mapCacheGet(key) {
  return _getMapData(this, key).get(key);
}

var _mapCacheGet = mapCacheGet;

/**
 * Checks if a map value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf MapCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function mapCacheHas(key) {
  return _getMapData(this, key).has(key);
}

var _mapCacheHas = mapCacheHas;

/**
 * Sets the map `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf MapCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the map cache instance.
 */
function mapCacheSet(key, value) {
  var data = _getMapData(this, key),
      size = data.size;

  data.set(key, value);
  this.size += data.size == size ? 0 : 1;
  return this;
}

var _mapCacheSet = mapCacheSet;

/**
 * Creates a map cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function MapCache(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `MapCache`.
MapCache.prototype.clear = _mapCacheClear;
MapCache.prototype['delete'] = _mapCacheDelete;
MapCache.prototype.get = _mapCacheGet;
MapCache.prototype.has = _mapCacheHas;
MapCache.prototype.set = _mapCacheSet;

var _MapCache = MapCache;

/** Used as the size to enable large array optimizations. */
var LARGE_ARRAY_SIZE = 200;

/**
 * Sets the stack `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Stack
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the stack cache instance.
 */
function stackSet(key, value) {
  var data = this.__data__;
  if (data instanceof _ListCache) {
    var pairs = data.__data__;
    if (!_Map || (pairs.length < LARGE_ARRAY_SIZE - 1)) {
      pairs.push([key, value]);
      this.size = ++data.size;
      return this;
    }
    data = this.__data__ = new _MapCache(pairs);
  }
  data.set(key, value);
  this.size = data.size;
  return this;
}

var _stackSet = stackSet;

/**
 * Creates a stack cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Stack(entries) {
  var data = this.__data__ = new _ListCache(entries);
  this.size = data.size;
}

// Add methods to `Stack`.
Stack.prototype.clear = _stackClear;
Stack.prototype['delete'] = _stackDelete;
Stack.prototype.get = _stackGet;
Stack.prototype.has = _stackHas;
Stack.prototype.set = _stackSet;

var _Stack = Stack;

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED$2 = '__lodash_hash_undefined__';

/**
 * Adds `value` to the array cache.
 *
 * @private
 * @name add
 * @memberOf SetCache
 * @alias push
 * @param {*} value The value to cache.
 * @returns {Object} Returns the cache instance.
 */
function setCacheAdd(value) {
  this.__data__.set(value, HASH_UNDEFINED$2);
  return this;
}

var _setCacheAdd = setCacheAdd;

/**
 * Checks if `value` is in the array cache.
 *
 * @private
 * @name has
 * @memberOf SetCache
 * @param {*} value The value to search for.
 * @returns {number} Returns `true` if `value` is found, else `false`.
 */
function setCacheHas(value) {
  return this.__data__.has(value);
}

var _setCacheHas = setCacheHas;

/**
 *
 * Creates an array cache object to store unique values.
 *
 * @private
 * @constructor
 * @param {Array} [values] The values to cache.
 */
function SetCache(values) {
  var index = -1,
      length = values == null ? 0 : values.length;

  this.__data__ = new _MapCache;
  while (++index < length) {
    this.add(values[index]);
  }
}

// Add methods to `SetCache`.
SetCache.prototype.add = SetCache.prototype.push = _setCacheAdd;
SetCache.prototype.has = _setCacheHas;

var _SetCache = SetCache;

/**
 * A specialized version of `_.some` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {boolean} Returns `true` if any element passes the predicate check,
 *  else `false`.
 */
function arraySome(array, predicate) {
  var index = -1,
      length = array == null ? 0 : array.length;

  while (++index < length) {
    if (predicate(array[index], index, array)) {
      return true;
    }
  }
  return false;
}

var _arraySome = arraySome;

/**
 * Checks if a `cache` value for `key` exists.
 *
 * @private
 * @param {Object} cache The cache to query.
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function cacheHas(cache, key) {
  return cache.has(key);
}

var _cacheHas = cacheHas;

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG = 1,
    COMPARE_UNORDERED_FLAG = 2;

/**
 * A specialized version of `baseIsEqualDeep` for arrays with support for
 * partial deep comparisons.
 *
 * @private
 * @param {Array} array The array to compare.
 * @param {Array} other The other array to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `array` and `other` objects.
 * @returns {boolean} Returns `true` if the arrays are equivalent, else `false`.
 */
function equalArrays(array, other, bitmask, customizer, equalFunc, stack) {
  var isPartial = bitmask & COMPARE_PARTIAL_FLAG,
      arrLength = array.length,
      othLength = other.length;

  if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
    return false;
  }
  // Assume cyclic values are equal.
  var stacked = stack.get(array);
  if (stacked && stack.get(other)) {
    return stacked == other;
  }
  var index = -1,
      result = true,
      seen = (bitmask & COMPARE_UNORDERED_FLAG) ? new _SetCache : undefined;

  stack.set(array, other);
  stack.set(other, array);

  // Ignore non-index properties.
  while (++index < arrLength) {
    var arrValue = array[index],
        othValue = other[index];

    if (customizer) {
      var compared = isPartial
        ? customizer(othValue, arrValue, index, other, array, stack)
        : customizer(arrValue, othValue, index, array, other, stack);
    }
    if (compared !== undefined) {
      if (compared) {
        continue;
      }
      result = false;
      break;
    }
    // Recursively compare arrays (susceptible to call stack limits).
    if (seen) {
      if (!_arraySome(other, function(othValue, othIndex) {
            if (!_cacheHas(seen, othIndex) &&
                (arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) {
              return seen.push(othIndex);
            }
          })) {
        result = false;
        break;
      }
    } else if (!(
          arrValue === othValue ||
            equalFunc(arrValue, othValue, bitmask, customizer, stack)
        )) {
      result = false;
      break;
    }
  }
  stack['delete'](array);
  stack['delete'](other);
  return result;
}

var _equalArrays = equalArrays;

/** Built-in value references. */
var Uint8Array = _root.Uint8Array;

var _Uint8Array = Uint8Array;

/**
 * Converts `map` to its key-value pairs.
 *
 * @private
 * @param {Object} map The map to convert.
 * @returns {Array} Returns the key-value pairs.
 */
function mapToArray(map) {
  var index = -1,
      result = Array(map.size);

  map.forEach(function(value, key) {
    result[++index] = [key, value];
  });
  return result;
}

var _mapToArray = mapToArray;

/**
 * Converts `set` to an array of its values.
 *
 * @private
 * @param {Object} set The set to convert.
 * @returns {Array} Returns the values.
 */
function setToArray(set) {
  var index = -1,
      result = Array(set.size);

  set.forEach(function(value) {
    result[++index] = value;
  });
  return result;
}

var _setToArray = setToArray;

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG$1 = 1,
    COMPARE_UNORDERED_FLAG$1 = 2;

/** `Object#toString` result references. */
var boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    symbolTag = '[object Symbol]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]';

/** Used to convert symbols to primitives and strings. */
var symbolProto = _Symbol ? _Symbol.prototype : undefined,
    symbolValueOf = symbolProto ? symbolProto.valueOf : undefined;

/**
 * A specialized version of `baseIsEqualDeep` for comparing objects of
 * the same `toStringTag`.
 *
 * **Note:** This function only supports comparing values with tags of
 * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {string} tag The `toStringTag` of the objects to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function equalByTag(object, other, tag, bitmask, customizer, equalFunc, stack) {
  switch (tag) {
    case dataViewTag:
      if ((object.byteLength != other.byteLength) ||
          (object.byteOffset != other.byteOffset)) {
        return false;
      }
      object = object.buffer;
      other = other.buffer;

    case arrayBufferTag:
      if ((object.byteLength != other.byteLength) ||
          !equalFunc(new _Uint8Array(object), new _Uint8Array(other))) {
        return false;
      }
      return true;

    case boolTag:
    case dateTag:
    case numberTag:
      // Coerce booleans to `1` or `0` and dates to milliseconds.
      // Invalid dates are coerced to `NaN`.
      return eq_1(+object, +other);

    case errorTag:
      return object.name == other.name && object.message == other.message;

    case regexpTag:
    case stringTag:
      // Coerce regexes to strings and treat strings, primitives and objects,
      // as equal. See http://www.ecma-international.org/ecma-262/7.0/#sec-regexp.prototype.tostring
      // for more details.
      return object == (other + '');

    case mapTag:
      var convert = _mapToArray;

    case setTag:
      var isPartial = bitmask & COMPARE_PARTIAL_FLAG$1;
      convert || (convert = _setToArray);

      if (object.size != other.size && !isPartial) {
        return false;
      }
      // Assume cyclic values are equal.
      var stacked = stack.get(object);
      if (stacked) {
        return stacked == other;
      }
      bitmask |= COMPARE_UNORDERED_FLAG$1;

      // Recursively compare objects (susceptible to call stack limits).
      stack.set(object, other);
      var result = _equalArrays(convert(object), convert(other), bitmask, customizer, equalFunc, stack);
      stack['delete'](object);
      return result;

    case symbolTag:
      if (symbolValueOf) {
        return symbolValueOf.call(object) == symbolValueOf.call(other);
      }
  }
  return false;
}

var _equalByTag = equalByTag;

/**
 * Appends the elements of `values` to `array`.
 *
 * @private
 * @param {Array} array The array to modify.
 * @param {Array} values The values to append.
 * @returns {Array} Returns `array`.
 */
function arrayPush(array, values) {
  var index = -1,
      length = values.length,
      offset = array.length;

  while (++index < length) {
    array[offset + index] = values[index];
  }
  return array;
}

var _arrayPush = arrayPush;

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

var isArray_1 = isArray;

/**
 * The base implementation of `getAllKeys` and `getAllKeysIn` which uses
 * `keysFunc` and `symbolsFunc` to get the enumerable property names and
 * symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @param {Function} symbolsFunc The function to get the symbols of `object`.
 * @returns {Array} Returns the array of property names and symbols.
 */
function baseGetAllKeys(object, keysFunc, symbolsFunc) {
  var result = keysFunc(object);
  return isArray_1(object) ? result : _arrayPush(result, symbolsFunc(object));
}

var _baseGetAllKeys = baseGetAllKeys;

/**
 * A specialized version of `_.filter` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {Array} Returns the new filtered array.
 */
function arrayFilter(array, predicate) {
  var index = -1,
      length = array == null ? 0 : array.length,
      resIndex = 0,
      result = [];

  while (++index < length) {
    var value = array[index];
    if (predicate(value, index, array)) {
      result[resIndex++] = value;
    }
  }
  return result;
}

var _arrayFilter = arrayFilter;

/**
 * This method returns a new empty array.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {Array} Returns the new empty array.
 * @example
 *
 * var arrays = _.times(2, _.stubArray);
 *
 * console.log(arrays);
 * // => [[], []]
 *
 * console.log(arrays[0] === arrays[1]);
 * // => false
 */
function stubArray() {
  return [];
}

var stubArray_1 = stubArray;

/** Used for built-in method references. */
var objectProto$5 = Object.prototype;

/** Built-in value references. */
var propertyIsEnumerable = objectProto$5.propertyIsEnumerable;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeGetSymbols = Object.getOwnPropertySymbols;

/**
 * Creates an array of the own enumerable symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of symbols.
 */
var getSymbols = !nativeGetSymbols ? stubArray_1 : function(object) {
  if (object == null) {
    return [];
  }
  object = Object(object);
  return _arrayFilter(nativeGetSymbols(object), function(symbol) {
    return propertyIsEnumerable.call(object, symbol);
  });
};

var _getSymbols = getSymbols;

/**
 * The base implementation of `_.times` without support for iteratee shorthands
 * or max array length checks.
 *
 * @private
 * @param {number} n The number of times to invoke `iteratee`.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the array of results.
 */
function baseTimes(n, iteratee) {
  var index = -1,
      result = Array(n);

  while (++index < n) {
    result[index] = iteratee(index);
  }
  return result;
}

var _baseTimes = baseTimes;

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return value != null && typeof value == 'object';
}

var isObjectLike_1 = isObjectLike;

/** `Object#toString` result references. */
var argsTag = '[object Arguments]';

/**
 * The base implementation of `_.isArguments`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 */
function baseIsArguments(value) {
  return isObjectLike_1(value) && _baseGetTag(value) == argsTag;
}

var _baseIsArguments = baseIsArguments;

/** Used for built-in method references. */
var objectProto$6 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$4 = objectProto$6.hasOwnProperty;

/** Built-in value references. */
var propertyIsEnumerable$1 = objectProto$6.propertyIsEnumerable;

/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
var isArguments = _baseIsArguments(function() { return arguments; }()) ? _baseIsArguments : function(value) {
  return isObjectLike_1(value) && hasOwnProperty$4.call(value, 'callee') &&
    !propertyIsEnumerable$1.call(value, 'callee');
};

var isArguments_1 = isArguments;

/**
 * This method returns `false`.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {boolean} Returns `false`.
 * @example
 *
 * _.times(2, _.stubFalse);
 * // => [false, false]
 */
function stubFalse() {
  return false;
}

var stubFalse_1 = stubFalse;

var isBuffer_1 = createCommonjsModule(function (module, exports) {
/** Detect free variable `exports`. */
var freeExports =  exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && 'object' == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Built-in value references. */
var Buffer = moduleExports ? _root.Buffer : undefined;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined;

/**
 * Checks if `value` is a buffer.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
 * @example
 *
 * _.isBuffer(new Buffer(2));
 * // => true
 *
 * _.isBuffer(new Uint8Array(2));
 * // => false
 */
var isBuffer = nativeIsBuffer || stubFalse_1;

module.exports = isBuffer;
});

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/** Used to detect unsigned integer values. */
var reIsUint = /^(?:0|[1-9]\d*)$/;

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  var type = typeof value;
  length = length == null ? MAX_SAFE_INTEGER : length;

  return !!length &&
    (type == 'number' ||
      (type != 'symbol' && reIsUint.test(value))) &&
        (value > -1 && value % 1 == 0 && value < length);
}

var _isIndex = isIndex;

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER$1 = 9007199254740991;

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */
function isLength(value) {
  return typeof value == 'number' &&
    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER$1;
}

var isLength_1 = isLength;

/** `Object#toString` result references. */
var argsTag$1 = '[object Arguments]',
    arrayTag = '[object Array]',
    boolTag$1 = '[object Boolean]',
    dateTag$1 = '[object Date]',
    errorTag$1 = '[object Error]',
    funcTag$1 = '[object Function]',
    mapTag$1 = '[object Map]',
    numberTag$1 = '[object Number]',
    objectTag = '[object Object]',
    regexpTag$1 = '[object RegExp]',
    setTag$1 = '[object Set]',
    stringTag$1 = '[object String]',
    weakMapTag = '[object WeakMap]';

var arrayBufferTag$1 = '[object ArrayBuffer]',
    dataViewTag$1 = '[object DataView]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

/** Used to identify `toStringTag` values of typed arrays. */
var typedArrayTags = {};
typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
typedArrayTags[uint32Tag] = true;
typedArrayTags[argsTag$1] = typedArrayTags[arrayTag] =
typedArrayTags[arrayBufferTag$1] = typedArrayTags[boolTag$1] =
typedArrayTags[dataViewTag$1] = typedArrayTags[dateTag$1] =
typedArrayTags[errorTag$1] = typedArrayTags[funcTag$1] =
typedArrayTags[mapTag$1] = typedArrayTags[numberTag$1] =
typedArrayTags[objectTag] = typedArrayTags[regexpTag$1] =
typedArrayTags[setTag$1] = typedArrayTags[stringTag$1] =
typedArrayTags[weakMapTag] = false;

/**
 * The base implementation of `_.isTypedArray` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 */
function baseIsTypedArray(value) {
  return isObjectLike_1(value) &&
    isLength_1(value.length) && !!typedArrayTags[_baseGetTag(value)];
}

var _baseIsTypedArray = baseIsTypedArray;

/**
 * The base implementation of `_.unary` without support for storing metadata.
 *
 * @private
 * @param {Function} func The function to cap arguments for.
 * @returns {Function} Returns the new capped function.
 */
function baseUnary(func) {
  return function(value) {
    return func(value);
  };
}

var _baseUnary = baseUnary;

var _nodeUtil = createCommonjsModule(function (module, exports) {
/** Detect free variable `exports`. */
var freeExports =  exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && 'object' == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Detect free variable `process` from Node.js. */
var freeProcess = moduleExports && _freeGlobal.process;

/** Used to access faster Node.js helpers. */
var nodeUtil = (function() {
  try {
    // Use `util.types` for Node.js 10+.
    var types = freeModule && freeModule.require && freeModule.require('util').types;

    if (types) {
      return types;
    }

    // Legacy `process.binding('util')` for Node.js < 10.
    return freeProcess && freeProcess.binding && freeProcess.binding('util');
  } catch (e) {}
}());

module.exports = nodeUtil;
});

/* Node.js helper references. */
var nodeIsTypedArray = _nodeUtil && _nodeUtil.isTypedArray;

/**
 * Checks if `value` is classified as a typed array.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 * @example
 *
 * _.isTypedArray(new Uint8Array);
 * // => true
 *
 * _.isTypedArray([]);
 * // => false
 */
var isTypedArray = nodeIsTypedArray ? _baseUnary(nodeIsTypedArray) : _baseIsTypedArray;

var isTypedArray_1 = isTypedArray;

/** Used for built-in method references. */
var objectProto$7 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$5 = objectProto$7.hasOwnProperty;

/**
 * Creates an array of the enumerable property names of the array-like `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @param {boolean} inherited Specify returning inherited property names.
 * @returns {Array} Returns the array of property names.
 */
function arrayLikeKeys(value, inherited) {
  var isArr = isArray_1(value),
      isArg = !isArr && isArguments_1(value),
      isBuff = !isArr && !isArg && isBuffer_1(value),
      isType = !isArr && !isArg && !isBuff && isTypedArray_1(value),
      skipIndexes = isArr || isArg || isBuff || isType,
      result = skipIndexes ? _baseTimes(value.length, String) : [],
      length = result.length;

  for (var key in value) {
    if ((inherited || hasOwnProperty$5.call(value, key)) &&
        !(skipIndexes && (
           // Safari 9 has enumerable `arguments.length` in strict mode.
           key == 'length' ||
           // Node.js 0.10 has enumerable non-index properties on buffers.
           (isBuff && (key == 'offset' || key == 'parent')) ||
           // PhantomJS 2 has enumerable non-index properties on typed arrays.
           (isType && (key == 'buffer' || key == 'byteLength' || key == 'byteOffset')) ||
           // Skip index properties.
           _isIndex(key, length)
        ))) {
      result.push(key);
    }
  }
  return result;
}

var _arrayLikeKeys = arrayLikeKeys;

/** Used for built-in method references. */
var objectProto$8 = Object.prototype;

/**
 * Checks if `value` is likely a prototype object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
 */
function isPrototype(value) {
  var Ctor = value && value.constructor,
      proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto$8;

  return value === proto;
}

var _isPrototype = isPrototype;

/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */
function overArg(func, transform) {
  return function(arg) {
    return func(transform(arg));
  };
}

var _overArg = overArg;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeKeys = _overArg(Object.keys, Object);

var _nativeKeys = nativeKeys;

/** Used for built-in method references. */
var objectProto$9 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$6 = objectProto$9.hasOwnProperty;

/**
 * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeys(object) {
  if (!_isPrototype(object)) {
    return _nativeKeys(object);
  }
  var result = [];
  for (var key in Object(object)) {
    if (hasOwnProperty$6.call(object, key) && key != 'constructor') {
      result.push(key);
    }
  }
  return result;
}

var _baseKeys = baseKeys;

/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */
function isArrayLike(value) {
  return value != null && isLength_1(value.length) && !isFunction_1(value);
}

var isArrayLike_1 = isArrayLike;

/**
 * Creates an array of the own enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects. See the
 * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * for more details.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keys(new Foo);
 * // => ['a', 'b'] (iteration order is not guaranteed)
 *
 * _.keys('hi');
 * // => ['0', '1']
 */
function keys(object) {
  return isArrayLike_1(object) ? _arrayLikeKeys(object) : _baseKeys(object);
}

var keys_1 = keys;

/**
 * Creates an array of own enumerable property names and symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names and symbols.
 */
function getAllKeys(object) {
  return _baseGetAllKeys(object, keys_1, _getSymbols);
}

var _getAllKeys = getAllKeys;

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG$2 = 1;

/** Used for built-in method references. */
var objectProto$a = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$7 = objectProto$a.hasOwnProperty;

/**
 * A specialized version of `baseIsEqualDeep` for objects with support for
 * partial deep comparisons.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function equalObjects(object, other, bitmask, customizer, equalFunc, stack) {
  var isPartial = bitmask & COMPARE_PARTIAL_FLAG$2,
      objProps = _getAllKeys(object),
      objLength = objProps.length,
      othProps = _getAllKeys(other),
      othLength = othProps.length;

  if (objLength != othLength && !isPartial) {
    return false;
  }
  var index = objLength;
  while (index--) {
    var key = objProps[index];
    if (!(isPartial ? key in other : hasOwnProperty$7.call(other, key))) {
      return false;
    }
  }
  // Assume cyclic values are equal.
  var stacked = stack.get(object);
  if (stacked && stack.get(other)) {
    return stacked == other;
  }
  var result = true;
  stack.set(object, other);
  stack.set(other, object);

  var skipCtor = isPartial;
  while (++index < objLength) {
    key = objProps[index];
    var objValue = object[key],
        othValue = other[key];

    if (customizer) {
      var compared = isPartial
        ? customizer(othValue, objValue, key, other, object, stack)
        : customizer(objValue, othValue, key, object, other, stack);
    }
    // Recursively compare objects (susceptible to call stack limits).
    if (!(compared === undefined
          ? (objValue === othValue || equalFunc(objValue, othValue, bitmask, customizer, stack))
          : compared
        )) {
      result = false;
      break;
    }
    skipCtor || (skipCtor = key == 'constructor');
  }
  if (result && !skipCtor) {
    var objCtor = object.constructor,
        othCtor = other.constructor;

    // Non `Object` object instances with different constructors are not equal.
    if (objCtor != othCtor &&
        ('constructor' in object && 'constructor' in other) &&
        !(typeof objCtor == 'function' && objCtor instanceof objCtor &&
          typeof othCtor == 'function' && othCtor instanceof othCtor)) {
      result = false;
    }
  }
  stack['delete'](object);
  stack['delete'](other);
  return result;
}

var _equalObjects = equalObjects;

/* Built-in method references that are verified to be native. */
var DataView = _getNative(_root, 'DataView');

var _DataView = DataView;

/* Built-in method references that are verified to be native. */
var Promise$1 = _getNative(_root, 'Promise');

var _Promise = Promise$1;

/* Built-in method references that are verified to be native. */
var Set$1 = _getNative(_root, 'Set');

var _Set = Set$1;

/* Built-in method references that are verified to be native. */
var WeakMap = _getNative(_root, 'WeakMap');

var _WeakMap = WeakMap;

/** `Object#toString` result references. */
var mapTag$2 = '[object Map]',
    objectTag$1 = '[object Object]',
    promiseTag = '[object Promise]',
    setTag$2 = '[object Set]',
    weakMapTag$1 = '[object WeakMap]';

var dataViewTag$2 = '[object DataView]';

/** Used to detect maps, sets, and weakmaps. */
var dataViewCtorString = _toSource(_DataView),
    mapCtorString = _toSource(_Map),
    promiseCtorString = _toSource(_Promise),
    setCtorString = _toSource(_Set),
    weakMapCtorString = _toSource(_WeakMap);

/**
 * Gets the `toStringTag` of `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
var getTag = _baseGetTag;

// Fallback for data views, maps, sets, and weak maps in IE 11 and promises in Node.js < 6.
if ((_DataView && getTag(new _DataView(new ArrayBuffer(1))) != dataViewTag$2) ||
    (_Map && getTag(new _Map) != mapTag$2) ||
    (_Promise && getTag(_Promise.resolve()) != promiseTag) ||
    (_Set && getTag(new _Set) != setTag$2) ||
    (_WeakMap && getTag(new _WeakMap) != weakMapTag$1)) {
  getTag = function(value) {
    var result = _baseGetTag(value),
        Ctor = result == objectTag$1 ? value.constructor : undefined,
        ctorString = Ctor ? _toSource(Ctor) : '';

    if (ctorString) {
      switch (ctorString) {
        case dataViewCtorString: return dataViewTag$2;
        case mapCtorString: return mapTag$2;
        case promiseCtorString: return promiseTag;
        case setCtorString: return setTag$2;
        case weakMapCtorString: return weakMapTag$1;
      }
    }
    return result;
  };
}

var _getTag = getTag;

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG$3 = 1;

/** `Object#toString` result references. */
var argsTag$2 = '[object Arguments]',
    arrayTag$1 = '[object Array]',
    objectTag$2 = '[object Object]';

/** Used for built-in method references. */
var objectProto$b = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$8 = objectProto$b.hasOwnProperty;

/**
 * A specialized version of `baseIsEqual` for arrays and objects which performs
 * deep comparisons and tracks traversed objects enabling objects with circular
 * references to be compared.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} [stack] Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function baseIsEqualDeep(object, other, bitmask, customizer, equalFunc, stack) {
  var objIsArr = isArray_1(object),
      othIsArr = isArray_1(other),
      objTag = objIsArr ? arrayTag$1 : _getTag(object),
      othTag = othIsArr ? arrayTag$1 : _getTag(other);

  objTag = objTag == argsTag$2 ? objectTag$2 : objTag;
  othTag = othTag == argsTag$2 ? objectTag$2 : othTag;

  var objIsObj = objTag == objectTag$2,
      othIsObj = othTag == objectTag$2,
      isSameTag = objTag == othTag;

  if (isSameTag && isBuffer_1(object)) {
    if (!isBuffer_1(other)) {
      return false;
    }
    objIsArr = true;
    objIsObj = false;
  }
  if (isSameTag && !objIsObj) {
    stack || (stack = new _Stack);
    return (objIsArr || isTypedArray_1(object))
      ? _equalArrays(object, other, bitmask, customizer, equalFunc, stack)
      : _equalByTag(object, other, objTag, bitmask, customizer, equalFunc, stack);
  }
  if (!(bitmask & COMPARE_PARTIAL_FLAG$3)) {
    var objIsWrapped = objIsObj && hasOwnProperty$8.call(object, '__wrapped__'),
        othIsWrapped = othIsObj && hasOwnProperty$8.call(other, '__wrapped__');

    if (objIsWrapped || othIsWrapped) {
      var objUnwrapped = objIsWrapped ? object.value() : object,
          othUnwrapped = othIsWrapped ? other.value() : other;

      stack || (stack = new _Stack);
      return equalFunc(objUnwrapped, othUnwrapped, bitmask, customizer, stack);
    }
  }
  if (!isSameTag) {
    return false;
  }
  stack || (stack = new _Stack);
  return _equalObjects(object, other, bitmask, customizer, equalFunc, stack);
}

var _baseIsEqualDeep = baseIsEqualDeep;

/**
 * The base implementation of `_.isEqual` which supports partial comparisons
 * and tracks traversed objects.
 *
 * @private
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @param {boolean} bitmask The bitmask flags.
 *  1 - Unordered comparison
 *  2 - Partial comparison
 * @param {Function} [customizer] The function to customize comparisons.
 * @param {Object} [stack] Tracks traversed `value` and `other` objects.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 */
function baseIsEqual(value, other, bitmask, customizer, stack) {
  if (value === other) {
    return true;
  }
  if (value == null || other == null || (!isObjectLike_1(value) && !isObjectLike_1(other))) {
    return value !== value && other !== other;
  }
  return _baseIsEqualDeep(value, other, bitmask, customizer, baseIsEqual, stack);
}

var _baseIsEqual = baseIsEqual;

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG$4 = 1,
    COMPARE_UNORDERED_FLAG$2 = 2;

/**
 * The base implementation of `_.isMatch` without support for iteratee shorthands.
 *
 * @private
 * @param {Object} object The object to inspect.
 * @param {Object} source The object of property values to match.
 * @param {Array} matchData The property names, values, and compare flags to match.
 * @param {Function} [customizer] The function to customize comparisons.
 * @returns {boolean} Returns `true` if `object` is a match, else `false`.
 */
function baseIsMatch(object, source, matchData, customizer) {
  var index = matchData.length,
      length = index,
      noCustomizer = !customizer;

  if (object == null) {
    return !length;
  }
  object = Object(object);
  while (index--) {
    var data = matchData[index];
    if ((noCustomizer && data[2])
          ? data[1] !== object[data[0]]
          : !(data[0] in object)
        ) {
      return false;
    }
  }
  while (++index < length) {
    data = matchData[index];
    var key = data[0],
        objValue = object[key],
        srcValue = data[1];

    if (noCustomizer && data[2]) {
      if (objValue === undefined && !(key in object)) {
        return false;
      }
    } else {
      var stack = new _Stack;
      if (customizer) {
        var result = customizer(objValue, srcValue, key, object, source, stack);
      }
      if (!(result === undefined
            ? _baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG$4 | COMPARE_UNORDERED_FLAG$2, customizer, stack)
            : result
          )) {
        return false;
      }
    }
  }
  return true;
}

var _baseIsMatch = baseIsMatch;

/**
 * Checks if `value` is suitable for strict equality comparisons, i.e. `===`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` if suitable for strict
 *  equality comparisons, else `false`.
 */
function isStrictComparable(value) {
  return value === value && !isObject_1(value);
}

var _isStrictComparable = isStrictComparable;

/**
 * Gets the property names, values, and compare flags of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the match data of `object`.
 */
function getMatchData(object) {
  var result = keys_1(object),
      length = result.length;

  while (length--) {
    var key = result[length],
        value = object[key];

    result[length] = [key, value, _isStrictComparable(value)];
  }
  return result;
}

var _getMatchData = getMatchData;

/**
 * A specialized version of `matchesProperty` for source values suitable
 * for strict equality comparisons, i.e. `===`.
 *
 * @private
 * @param {string} key The key of the property to get.
 * @param {*} srcValue The value to match.
 * @returns {Function} Returns the new spec function.
 */
function matchesStrictComparable(key, srcValue) {
  return function(object) {
    if (object == null) {
      return false;
    }
    return object[key] === srcValue &&
      (srcValue !== undefined || (key in Object(object)));
  };
}

var _matchesStrictComparable = matchesStrictComparable;

/**
 * The base implementation of `_.matches` which doesn't clone `source`.
 *
 * @private
 * @param {Object} source The object of property values to match.
 * @returns {Function} Returns the new spec function.
 */
function baseMatches(source) {
  var matchData = _getMatchData(source);
  if (matchData.length == 1 && matchData[0][2]) {
    return _matchesStrictComparable(matchData[0][0], matchData[0][1]);
  }
  return function(object) {
    return object === source || _baseIsMatch(object, source, matchData);
  };
}

var _baseMatches = baseMatches;

/** `Object#toString` result references. */
var symbolTag$1 = '[object Symbol]';

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike_1(value) && _baseGetTag(value) == symbolTag$1);
}

var isSymbol_1 = isSymbol;

/** Used to match property names within property paths. */
var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
    reIsPlainProp = /^\w*$/;

/**
 * Checks if `value` is a property name and not a property path.
 *
 * @private
 * @param {*} value The value to check.
 * @param {Object} [object] The object to query keys on.
 * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
 */
function isKey(value, object) {
  if (isArray_1(value)) {
    return false;
  }
  var type = typeof value;
  if (type == 'number' || type == 'symbol' || type == 'boolean' ||
      value == null || isSymbol_1(value)) {
    return true;
  }
  return reIsPlainProp.test(value) || !reIsDeepProp.test(value) ||
    (object != null && value in Object(object));
}

var _isKey = isKey;

/** Error message constants. */
var FUNC_ERROR_TEXT = 'Expected a function';

/**
 * Creates a function that memoizes the result of `func`. If `resolver` is
 * provided, it determines the cache key for storing the result based on the
 * arguments provided to the memoized function. By default, the first argument
 * provided to the memoized function is used as the map cache key. The `func`
 * is invoked with the `this` binding of the memoized function.
 *
 * **Note:** The cache is exposed as the `cache` property on the memoized
 * function. Its creation may be customized by replacing the `_.memoize.Cache`
 * constructor with one whose instances implement the
 * [`Map`](http://ecma-international.org/ecma-262/7.0/#sec-properties-of-the-map-prototype-object)
 * method interface of `clear`, `delete`, `get`, `has`, and `set`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to have its output memoized.
 * @param {Function} [resolver] The function to resolve the cache key.
 * @returns {Function} Returns the new memoized function.
 * @example
 *
 * var object = { 'a': 1, 'b': 2 };
 * var other = { 'c': 3, 'd': 4 };
 *
 * var values = _.memoize(_.values);
 * values(object);
 * // => [1, 2]
 *
 * values(other);
 * // => [3, 4]
 *
 * object.a = 2;
 * values(object);
 * // => [1, 2]
 *
 * // Modify the result cache.
 * values.cache.set(object, ['a', 'b']);
 * values(object);
 * // => ['a', 'b']
 *
 * // Replace `_.memoize.Cache`.
 * _.memoize.Cache = WeakMap;
 */
function memoize(func, resolver) {
  if (typeof func != 'function' || (resolver != null && typeof resolver != 'function')) {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  var memoized = function() {
    var args = arguments,
        key = resolver ? resolver.apply(this, args) : args[0],
        cache = memoized.cache;

    if (cache.has(key)) {
      return cache.get(key);
    }
    var result = func.apply(this, args);
    memoized.cache = cache.set(key, result) || cache;
    return result;
  };
  memoized.cache = new (memoize.Cache || _MapCache);
  return memoized;
}

// Expose `MapCache`.
memoize.Cache = _MapCache;

var memoize_1 = memoize;

/** Used as the maximum memoize cache size. */
var MAX_MEMOIZE_SIZE = 500;

/**
 * A specialized version of `_.memoize` which clears the memoized function's
 * cache when it exceeds `MAX_MEMOIZE_SIZE`.
 *
 * @private
 * @param {Function} func The function to have its output memoized.
 * @returns {Function} Returns the new memoized function.
 */
function memoizeCapped(func) {
  var result = memoize_1(func, function(key) {
    if (cache.size === MAX_MEMOIZE_SIZE) {
      cache.clear();
    }
    return key;
  });

  var cache = result.cache;
  return result;
}

var _memoizeCapped = memoizeCapped;

/** Used to match property names within property paths. */
var rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;

/** Used to match backslashes in property paths. */
var reEscapeChar = /\\(\\)?/g;

/**
 * Converts `string` to a property path array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the property path array.
 */
var stringToPath = _memoizeCapped(function(string) {
  var result = [];
  if (string.charCodeAt(0) === 46 /* . */) {
    result.push('');
  }
  string.replace(rePropName, function(match, number, quote, subString) {
    result.push(quote ? subString.replace(reEscapeChar, '$1') : (number || match));
  });
  return result;
});

var _stringToPath = stringToPath;

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0;

/** Used to convert symbols to primitives and strings. */
var symbolProto$1 = _Symbol ? _Symbol.prototype : undefined,
    symbolToString = symbolProto$1 ? symbolProto$1.toString : undefined;

/**
 * The base implementation of `_.toString` which doesn't convert nullish
 * values to empty strings.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 */
function baseToString(value) {
  // Exit early for strings to avoid a performance hit in some environments.
  if (typeof value == 'string') {
    return value;
  }
  if (isArray_1(value)) {
    // Recursively convert values (susceptible to call stack limits).
    return _arrayMap(value, baseToString) + '';
  }
  if (isSymbol_1(value)) {
    return symbolToString ? symbolToString.call(value) : '';
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}

var _baseToString = baseToString;

/**
 * Converts `value` to a string. An empty string is returned for `null`
 * and `undefined` values. The sign of `-0` is preserved.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 * @example
 *
 * _.toString(null);
 * // => ''
 *
 * _.toString(-0);
 * // => '-0'
 *
 * _.toString([1, 2, 3]);
 * // => '1,2,3'
 */
function toString(value) {
  return value == null ? '' : _baseToString(value);
}

var toString_1 = toString;

/**
 * Casts `value` to a path array if it's not one.
 *
 * @private
 * @param {*} value The value to inspect.
 * @param {Object} [object] The object to query keys on.
 * @returns {Array} Returns the cast property path array.
 */
function castPath(value, object) {
  if (isArray_1(value)) {
    return value;
  }
  return _isKey(value, object) ? [value] : _stringToPath(toString_1(value));
}

var _castPath = castPath;

/** Used as references for various `Number` constants. */
var INFINITY$1 = 1 / 0;

/**
 * Converts `value` to a string key if it's not a string or symbol.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {string|symbol} Returns the key.
 */
function toKey(value) {
  if (typeof value == 'string' || isSymbol_1(value)) {
    return value;
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY$1) ? '-0' : result;
}

var _toKey = toKey;

/**
 * The base implementation of `_.get` without support for default values.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to get.
 * @returns {*} Returns the resolved value.
 */
function baseGet(object, path) {
  path = _castPath(path, object);

  var index = 0,
      length = path.length;

  while (object != null && index < length) {
    object = object[_toKey(path[index++])];
  }
  return (index && index == length) ? object : undefined;
}

var _baseGet = baseGet;

/**
 * Gets the value at `path` of `object`. If the resolved value is
 * `undefined`, the `defaultValue` is returned in its place.
 *
 * @static
 * @memberOf _
 * @since 3.7.0
 * @category Object
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to get.
 * @param {*} [defaultValue] The value returned for `undefined` resolved values.
 * @returns {*} Returns the resolved value.
 * @example
 *
 * var object = { 'a': [{ 'b': { 'c': 3 } }] };
 *
 * _.get(object, 'a[0].b.c');
 * // => 3
 *
 * _.get(object, ['a', '0', 'b', 'c']);
 * // => 3
 *
 * _.get(object, 'a.b.c', 'default');
 * // => 'default'
 */
function get(object, path, defaultValue) {
  var result = object == null ? undefined : _baseGet(object, path);
  return result === undefined ? defaultValue : result;
}

var get_1 = get;

/**
 * The base implementation of `_.hasIn` without support for deep paths.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {Array|string} key The key to check.
 * @returns {boolean} Returns `true` if `key` exists, else `false`.
 */
function baseHasIn(object, key) {
  return object != null && key in Object(object);
}

var _baseHasIn = baseHasIn;

/**
 * Checks if `path` exists on `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array|string} path The path to check.
 * @param {Function} hasFunc The function to check properties.
 * @returns {boolean} Returns `true` if `path` exists, else `false`.
 */
function hasPath(object, path, hasFunc) {
  path = _castPath(path, object);

  var index = -1,
      length = path.length,
      result = false;

  while (++index < length) {
    var key = _toKey(path[index]);
    if (!(result = object != null && hasFunc(object, key))) {
      break;
    }
    object = object[key];
  }
  if (result || ++index != length) {
    return result;
  }
  length = object == null ? 0 : object.length;
  return !!length && isLength_1(length) && _isIndex(key, length) &&
    (isArray_1(object) || isArguments_1(object));
}

var _hasPath = hasPath;

/**
 * Checks if `path` is a direct or inherited property of `object`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Object
 * @param {Object} object The object to query.
 * @param {Array|string} path The path to check.
 * @returns {boolean} Returns `true` if `path` exists, else `false`.
 * @example
 *
 * var object = _.create({ 'a': _.create({ 'b': 2 }) });
 *
 * _.hasIn(object, 'a');
 * // => true
 *
 * _.hasIn(object, 'a.b');
 * // => true
 *
 * _.hasIn(object, ['a', 'b']);
 * // => true
 *
 * _.hasIn(object, 'b');
 * // => false
 */
function hasIn(object, path) {
  return object != null && _hasPath(object, path, _baseHasIn);
}

var hasIn_1 = hasIn;

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG$5 = 1,
    COMPARE_UNORDERED_FLAG$3 = 2;

/**
 * The base implementation of `_.matchesProperty` which doesn't clone `srcValue`.
 *
 * @private
 * @param {string} path The path of the property to get.
 * @param {*} srcValue The value to match.
 * @returns {Function} Returns the new spec function.
 */
function baseMatchesProperty(path, srcValue) {
  if (_isKey(path) && _isStrictComparable(srcValue)) {
    return _matchesStrictComparable(_toKey(path), srcValue);
  }
  return function(object) {
    var objValue = get_1(object, path);
    return (objValue === undefined && objValue === srcValue)
      ? hasIn_1(object, path)
      : _baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG$5 | COMPARE_UNORDERED_FLAG$3);
  };
}

var _baseMatchesProperty = baseMatchesProperty;

/**
 * This method returns the first argument it receives.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Util
 * @param {*} value Any value.
 * @returns {*} Returns `value`.
 * @example
 *
 * var object = { 'a': 1 };
 *
 * console.log(_.identity(object) === object);
 * // => true
 */
function identity(value) {
  return value;
}

var identity_1 = identity;

/**
 * The base implementation of `_.property` without support for deep paths.
 *
 * @private
 * @param {string} key The key of the property to get.
 * @returns {Function} Returns the new accessor function.
 */
function baseProperty(key) {
  return function(object) {
    return object == null ? undefined : object[key];
  };
}

var _baseProperty = baseProperty;

/**
 * A specialized version of `baseProperty` which supports deep paths.
 *
 * @private
 * @param {Array|string} path The path of the property to get.
 * @returns {Function} Returns the new accessor function.
 */
function basePropertyDeep(path) {
  return function(object) {
    return _baseGet(object, path);
  };
}

var _basePropertyDeep = basePropertyDeep;

/**
 * Creates a function that returns the value at `path` of a given object.
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Util
 * @param {Array|string} path The path of the property to get.
 * @returns {Function} Returns the new accessor function.
 * @example
 *
 * var objects = [
 *   { 'a': { 'b': 2 } },
 *   { 'a': { 'b': 1 } }
 * ];
 *
 * _.map(objects, _.property('a.b'));
 * // => [2, 1]
 *
 * _.map(_.sortBy(objects, _.property(['a', 'b'])), 'a.b');
 * // => [1, 2]
 */
function property(path) {
  return _isKey(path) ? _baseProperty(_toKey(path)) : _basePropertyDeep(path);
}

var property_1 = property;

/**
 * The base implementation of `_.iteratee`.
 *
 * @private
 * @param {*} [value=_.identity] The value to convert to an iteratee.
 * @returns {Function} Returns the iteratee.
 */
function baseIteratee(value) {
  // Don't store the `typeof` result in a variable to avoid a JIT bug in Safari 9.
  // See https://bugs.webkit.org/show_bug.cgi?id=156034 for more details.
  if (typeof value == 'function') {
    return value;
  }
  if (value == null) {
    return identity_1;
  }
  if (typeof value == 'object') {
    return isArray_1(value)
      ? _baseMatchesProperty(value[0], value[1])
      : _baseMatches(value);
  }
  return property_1(value);
}

var _baseIteratee = baseIteratee;

/**
 * Creates a base function for methods like `_.forIn` and `_.forOwn`.
 *
 * @private
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {Function} Returns the new base function.
 */
function createBaseFor(fromRight) {
  return function(object, iteratee, keysFunc) {
    var index = -1,
        iterable = Object(object),
        props = keysFunc(object),
        length = props.length;

    while (length--) {
      var key = props[fromRight ? length : ++index];
      if (iteratee(iterable[key], key, iterable) === false) {
        break;
      }
    }
    return object;
  };
}

var _createBaseFor = createBaseFor;

/**
 * The base implementation of `baseForOwn` which iterates over `object`
 * properties returned by `keysFunc` and invokes `iteratee` for each property.
 * Iteratee functions may exit iteration early by explicitly returning `false`.
 *
 * @private
 * @param {Object} object The object to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @returns {Object} Returns `object`.
 */
var baseFor = _createBaseFor();

var _baseFor = baseFor;

/**
 * The base implementation of `_.forOwn` without support for iteratee shorthands.
 *
 * @private
 * @param {Object} object The object to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Object} Returns `object`.
 */
function baseForOwn(object, iteratee) {
  return object && _baseFor(object, iteratee, keys_1);
}

var _baseForOwn = baseForOwn;

/**
 * Creates a `baseEach` or `baseEachRight` function.
 *
 * @private
 * @param {Function} eachFunc The function to iterate over a collection.
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {Function} Returns the new base function.
 */
function createBaseEach(eachFunc, fromRight) {
  return function(collection, iteratee) {
    if (collection == null) {
      return collection;
    }
    if (!isArrayLike_1(collection)) {
      return eachFunc(collection, iteratee);
    }
    var length = collection.length,
        index = fromRight ? length : -1,
        iterable = Object(collection);

    while ((fromRight ? index-- : ++index < length)) {
      if (iteratee(iterable[index], index, iterable) === false) {
        break;
      }
    }
    return collection;
  };
}

var _createBaseEach = createBaseEach;

/**
 * The base implementation of `_.forEach` without support for iteratee shorthands.
 *
 * @private
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array|Object} Returns `collection`.
 */
var baseEach = _createBaseEach(_baseForOwn);

var _baseEach = baseEach;

/**
 * The base implementation of `_.map` without support for iteratee shorthands.
 *
 * @private
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the new mapped array.
 */
function baseMap(collection, iteratee) {
  var index = -1,
      result = isArrayLike_1(collection) ? Array(collection.length) : [];

  _baseEach(collection, function(value, key, collection) {
    result[++index] = iteratee(value, key, collection);
  });
  return result;
}

var _baseMap = baseMap;

/**
 * Creates an array of values by running each element in `collection` thru
 * `iteratee`. The iteratee is invoked with three arguments:
 * (value, index|key, collection).
 *
 * Many lodash methods are guarded to work as iteratees for methods like
 * `_.every`, `_.filter`, `_.map`, `_.mapValues`, `_.reject`, and `_.some`.
 *
 * The guarded methods are:
 * `ary`, `chunk`, `curry`, `curryRight`, `drop`, `dropRight`, `every`,
 * `fill`, `invert`, `parseInt`, `random`, `range`, `rangeRight`, `repeat`,
 * `sampleSize`, `slice`, `some`, `sortBy`, `split`, `take`, `takeRight`,
 * `template`, `trim`, `trimEnd`, `trimStart`, and `words`
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Collection
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} [iteratee=_.identity] The function invoked per iteration.
 * @returns {Array} Returns the new mapped array.
 * @example
 *
 * function square(n) {
 *   return n * n;
 * }
 *
 * _.map([4, 8], square);
 * // => [16, 64]
 *
 * _.map({ 'a': 4, 'b': 8 }, square);
 * // => [16, 64] (iteration order is not guaranteed)
 *
 * var users = [
 *   { 'user': 'barney' },
 *   { 'user': 'fred' }
 * ];
 *
 * // The `_.property` iteratee shorthand.
 * _.map(users, 'user');
 * // => ['barney', 'fred']
 */
function map(collection, iteratee) {
  var func = isArray_1(collection) ? _arrayMap : _baseMap;
  return func(collection, _baseIteratee(iteratee));
}

var map_1 = map;

/** Built-in value references. */
var spreadableSymbol = _Symbol ? _Symbol.isConcatSpreadable : undefined;

/**
 * Checks if `value` is a flattenable `arguments` object or array.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is flattenable, else `false`.
 */
function isFlattenable(value) {
  return isArray_1(value) || isArguments_1(value) ||
    !!(spreadableSymbol && value && value[spreadableSymbol]);
}

var _isFlattenable = isFlattenable;

/**
 * The base implementation of `_.flatten` with support for restricting flattening.
 *
 * @private
 * @param {Array} array The array to flatten.
 * @param {number} depth The maximum recursion depth.
 * @param {boolean} [predicate=isFlattenable] The function invoked per iteration.
 * @param {boolean} [isStrict] Restrict to values that pass `predicate` checks.
 * @param {Array} [result=[]] The initial result value.
 * @returns {Array} Returns the new flattened array.
 */
function baseFlatten(array, depth, predicate, isStrict, result) {
  var index = -1,
      length = array.length;

  predicate || (predicate = _isFlattenable);
  result || (result = []);

  while (++index < length) {
    var value = array[index];
    if (depth > 0 && predicate(value)) {
      if (depth > 1) {
        // Recursively flatten arrays (susceptible to call stack limits).
        baseFlatten(value, depth - 1, predicate, isStrict, result);
      } else {
        _arrayPush(result, value);
      }
    } else if (!isStrict) {
      result[result.length] = value;
    }
  }
  return result;
}

var _baseFlatten = baseFlatten;

/**
 * Copies the values of `source` to `array`.
 *
 * @private
 * @param {Array} source The array to copy values from.
 * @param {Array} [array=[]] The array to copy values to.
 * @returns {Array} Returns `array`.
 */
function copyArray(source, array) {
  var index = -1,
      length = source.length;

  array || (array = Array(length));
  while (++index < length) {
    array[index] = source[index];
  }
  return array;
}

var _copyArray = copyArray;

/**
 * Creates a new array concatenating `array` with any additional arrays
 * and/or values.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Array
 * @param {Array} array The array to concatenate.
 * @param {...*} [values] The values to concatenate.
 * @returns {Array} Returns the new concatenated array.
 * @example
 *
 * var array = [1];
 * var other = _.concat(array, 2, [3], [[4]]);
 *
 * console.log(other);
 * // => [1, 2, 3, [4]]
 *
 * console.log(array);
 * // => [1]
 */
function concat() {
  var length = arguments.length;
  if (!length) {
    return [];
  }
  var args = Array(length - 1),
      array = arguments[0],
      index = length;

  while (index--) {
    args[index - 1] = arguments[index];
  }
  return _arrayPush(isArray_1(array) ? _copyArray(array) : [array], _baseFlatten(args, 1));
}

var concat_1 = concat;

var Actions = function Actions(_ref) {
  var filter = _ref.filter,
      _ref$isLink = _ref.isLink,
      isLink = _ref$isLink === void 0 ? false : _ref$isLink,
      beforeReset = _ref.beforeReset,
      afterReset = _ref.afterReset;
  var submit = filter.submit,
      reset = filter.reset;
  var RESET_BUTTON_PROPS = React__default.useMemo(function () {
    return isLink ? {
      bordered: false,
      outline: true
    } : {
      bordered: false,
      outline: true
    };
  }, [isLink]);
  var lambdaRenderNode = React__default.useCallback(function (alternativeNode) {
    if (!alternativeNode) return null;
    /* istanbul ignore next */

    var Node = typeof alternativeNode === 'function' ? alternativeNode(filter) : alternativeNode;
    return React__default.createElement("div", {
      className: "custom-btn"
    }, Node);
  }, [filter]);
  return React__default.createElement("div", {
    "data-testid": "easy-filter-actions",
    className: "easy-filter__actions action-container"
  }, React__default.createElement("div", {
    className: "easy-filter__actions btn-group"
  }, React__default.createElement("div", {
    className: "preset-btn"
  }, React__default.createElement(zent.Button, {
    role: "submit",
    loading: filter.getLoading(),
    type: "primary",
    onClick: submit
  }, "\u7B5B\u9009"))), React__default.createElement("div", {
    className: "easy-filter__actions link-group"
  }, lambdaRenderNode(beforeReset), React__default.createElement("div", {
    className: "preset-btn"
  }, React__default.createElement(zent.Button, _extends({}, RESET_BUTTON_PROPS, {
    role: "reset",
    className: "link-btn",
    type: "primary",
    onClick: reset
  }), "\u91CD\u7F6E\u7B5B\u9009\u6761\u4EF6")), lambdaRenderNode(afterReset)));
};

var formatTemp = 'YYYY-MM-DD'; // 预设

var presetDays = [{
  text: '今',
  value: 0
}, {
  text: '昨',
  value: 1
}, {
  text: '近7天',
  value: 7
}, {
  text: '近30天',
  value: 30
}];

var DateRangeQuickPickerType = function DateRangeQuickPickerType(props) {
  var onChange = props.onChange,
      currentValue = props.value,
      passiveProps = _objectWithoutProperties(props, ["onChange", "value"]); // 快速选择时间的value需要做处理


  var convertValues = React__default.useMemo(function () {
    if (Array.isArray(currentValue)) {
      var tempChooseDay;

      var _currentValue = _slicedToArray(currentValue, 2),
          timeArr = _currentValue[0],
          chooseDay = _currentValue[1];

      if (!Array.isArray(timeArr)) {
        return [currentValue, tempChooseDay];
      } // 如果数组第一项为数组，那么第二项作为preset


      tempChooseDay = isNaN(Number(chooseDay)) ?
      /* istanbul ignore next */
      chooseDay : Number(chooseDay);
      return [timeArr, tempChooseDay];
    }
    /* istanbul ignore next */


    return [[], ''];
  }, [currentValue]);
  var handleChange = React__default.useCallback(function (timeArr, chooseDays) {
    onChange && onChange([timeArr, chooseDays]);
  }, [onChange]);
  return React__default.createElement(zent.DateRangeQuickPicker, _extends({
    format: formatTemp,
    preset: presetDays
  }, passiveProps, {
    chooseDays: convertValues[1],
    value: convertValues[0],
    onChange: handleChange
  }));
};

var FilterInput = function FilterInput(props) {
  var value = props.value,
      onChange = props.onChange,
      passiveProps = _objectWithoutProperties(props, ["value", "onChange"]);

  var handleChange = React__default.useCallback(function (evt) {
    var value = evt.target.value;
    onChange && onChange(value);
  }, [onChange]);
  return React__default.createElement(zent.Input, _extends({}, passiveProps, {
    value: value,
    type: "text",
    onChange: handleChange
  }));
};

var CheckboxGroup = zent.Checkbox.Group;

var CheckboxType = function CheckboxType(props) {
  var value = props.value,
      onChange = props.onChange,
      options = props.options,
      passiveProps = _objectWithoutProperties(props, ["value", "onChange", "options"]);

  var handleChange = React__default.useCallback(function (values) {
    onChange && onChange(values);
  }, [onChange]);
  /* istanbul ignore next */

  if (!options || !options.length) {
    return null;
  }

  return React__default.createElement(CheckboxGroup, _extends({}, passiveProps, {
    value: value,
    onChange: handleChange
  }), options.map(function (opt) {
    return React__default.createElement(zent.Checkbox, {
      key: opt.value,
      value: opt.value,
      disabled: opt.disabled || false
    }, opt.text);
  }));
};

var RadioGroup = zent.Radio.Group;

var RadioType = function RadioType(props) {
  var value = props.value,
      onChange = props.onChange,
      options = props.options,
      className = props.className,
      parentDisabledType = props.disabled,
      parentReadOnlyType = props.readOnly,
      passiveProps = _objectWithoutProperties(props, ["value", "onChange", "options", "className", "disabled", "readOnly"]);

  var isMultiLineRadio = React__default.useMemo(function () {
    return options.some(function (opt) {
      return (opt.desc || opt.description) !== undefined;
    });
  }, [options]);
  var handleChange = React__default.useCallback(function (evt) {
    if (onChange) {
      onChange(evt.target.value);
    }
  }, [onChange]);

  if (!options || !options.length) {
    return null;
  }

  return React__default.createElement(RadioGroup, _extends({}, passiveProps, {
    value: value,
    onChange: handleChange,
    disabled: parentDisabledType,
    readOnly: parentReadOnlyType,
    className: cx('easy-filter__field radio-group', className, {
      'multi-line': isMultiLineRadio
    })
  }), options.map(function (opt) {
    var description = opt.desc || opt.description;
    return React__default.createElement("div", {
      key: opt.value,
      className: "radio-item__container"
    }, React__default.createElement(zent.Radio, {
      value: opt.value,
      readOnly: parentReadOnlyType || opt.readOnly || false,
      disabled: parentDisabledType || opt.disabled || false
    }, opt.text), description ? React__default.createElement("p", {
      className: "radio-item__description"
    }, description) : null);
  }));
};

var SelectType = function SelectType(props) {
  var value = props.value,
      onChange = props.onChange,
      options = props.options,
      passiveProps = _objectWithoutProperties(props, ["value", "onChange", "options"]);

  var _React$useState = React__default.useState([]),
      _React$useState2 = _slicedToArray(_React$useState, 2),
      internalOpts = _React$useState2[0],
      setOpts = _React$useState2[1];

  var handleChange = React__default.useCallback(function (evt) {
    onChange && onChange(evt.target.value);
  }, [onChange]);
  React__default.useEffect(function () {
    if (Array.isArray(options)) {
      setOpts(options);
      return;
    } else if (typeof options === 'function') {
      var res = options();

      if (res instanceof Promise) {
        res.then(function (opts) {
          setOpts(!Array.isArray(opts) ? [] : opts);
        });
        return;
      }
    }

    throw new Error('type of options should be array-type or should return a Promise-like, please check config where you use "Select" configuration');
  }, [options]);
  return React__default.createElement(zent.Select, _extends({}, passiveProps, {
    data: internalOpts,
    value: value,
    onChange: handleChange
  }));
};

/**
 * A specialized version of `_.forEach` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns `array`.
 */
function arrayEach(array, iteratee) {
  var index = -1,
      length = array == null ? 0 : array.length;

  while (++index < length) {
    if (iteratee(array[index], index, array) === false) {
      break;
    }
  }
  return array;
}

var _arrayEach = arrayEach;

var defineProperty = (function() {
  try {
    var func = _getNative(Object, 'defineProperty');
    func({}, '', {});
    return func;
  } catch (e) {}
}());

var _defineProperty$1 = defineProperty;

/**
 * The base implementation of `assignValue` and `assignMergeValue` without
 * value checks.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function baseAssignValue(object, key, value) {
  if (key == '__proto__' && _defineProperty$1) {
    _defineProperty$1(object, key, {
      'configurable': true,
      'enumerable': true,
      'value': value,
      'writable': true
    });
  } else {
    object[key] = value;
  }
}

var _baseAssignValue = baseAssignValue;

/** Used for built-in method references. */
var objectProto$c = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$9 = objectProto$c.hasOwnProperty;

/**
 * Assigns `value` to `key` of `object` if the existing value is not equivalent
 * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function assignValue(object, key, value) {
  var objValue = object[key];
  if (!(hasOwnProperty$9.call(object, key) && eq_1(objValue, value)) ||
      (value === undefined && !(key in object))) {
    _baseAssignValue(object, key, value);
  }
}

var _assignValue = assignValue;

/**
 * Copies properties of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy properties from.
 * @param {Array} props The property identifiers to copy.
 * @param {Object} [object={}] The object to copy properties to.
 * @param {Function} [customizer] The function to customize copied values.
 * @returns {Object} Returns `object`.
 */
function copyObject(source, props, object, customizer) {
  var isNew = !object;
  object || (object = {});

  var index = -1,
      length = props.length;

  while (++index < length) {
    var key = props[index];

    var newValue = customizer
      ? customizer(object[key], source[key], key, object, source)
      : undefined;

    if (newValue === undefined) {
      newValue = source[key];
    }
    if (isNew) {
      _baseAssignValue(object, key, newValue);
    } else {
      _assignValue(object, key, newValue);
    }
  }
  return object;
}

var _copyObject = copyObject;

/**
 * The base implementation of `_.assign` without support for multiple sources
 * or `customizer` functions.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @returns {Object} Returns `object`.
 */
function baseAssign(object, source) {
  return object && _copyObject(source, keys_1(source), object);
}

var _baseAssign = baseAssign;

/**
 * This function is like
 * [`Object.keys`](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * except that it includes inherited enumerable properties.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function nativeKeysIn(object) {
  var result = [];
  if (object != null) {
    for (var key in Object(object)) {
      result.push(key);
    }
  }
  return result;
}

var _nativeKeysIn = nativeKeysIn;

/** Used for built-in method references. */
var objectProto$d = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$a = objectProto$d.hasOwnProperty;

/**
 * The base implementation of `_.keysIn` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeysIn(object) {
  if (!isObject_1(object)) {
    return _nativeKeysIn(object);
  }
  var isProto = _isPrototype(object),
      result = [];

  for (var key in object) {
    if (!(key == 'constructor' && (isProto || !hasOwnProperty$a.call(object, key)))) {
      result.push(key);
    }
  }
  return result;
}

var _baseKeysIn = baseKeysIn;

/**
 * Creates an array of the own and inherited enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keysIn(new Foo);
 * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
 */
function keysIn$1(object) {
  return isArrayLike_1(object) ? _arrayLikeKeys(object, true) : _baseKeysIn(object);
}

var keysIn_1 = keysIn$1;

/**
 * The base implementation of `_.assignIn` without support for multiple sources
 * or `customizer` functions.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @returns {Object} Returns `object`.
 */
function baseAssignIn(object, source) {
  return object && _copyObject(source, keysIn_1(source), object);
}

var _baseAssignIn = baseAssignIn;

var _cloneBuffer = createCommonjsModule(function (module, exports) {
/** Detect free variable `exports`. */
var freeExports =  exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && 'object' == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Built-in value references. */
var Buffer = moduleExports ? _root.Buffer : undefined,
    allocUnsafe = Buffer ? Buffer.allocUnsafe : undefined;

/**
 * Creates a clone of  `buffer`.
 *
 * @private
 * @param {Buffer} buffer The buffer to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Buffer} Returns the cloned buffer.
 */
function cloneBuffer(buffer, isDeep) {
  if (isDeep) {
    return buffer.slice();
  }
  var length = buffer.length,
      result = allocUnsafe ? allocUnsafe(length) : new buffer.constructor(length);

  buffer.copy(result);
  return result;
}

module.exports = cloneBuffer;
});

/**
 * Copies own symbols of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy symbols from.
 * @param {Object} [object={}] The object to copy symbols to.
 * @returns {Object} Returns `object`.
 */
function copySymbols(source, object) {
  return _copyObject(source, _getSymbols(source), object);
}

var _copySymbols = copySymbols;

/** Built-in value references. */
var getPrototype = _overArg(Object.getPrototypeOf, Object);

var _getPrototype = getPrototype;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeGetSymbols$1 = Object.getOwnPropertySymbols;

/**
 * Creates an array of the own and inherited enumerable symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of symbols.
 */
var getSymbolsIn = !nativeGetSymbols$1 ? stubArray_1 : function(object) {
  var result = [];
  while (object) {
    _arrayPush(result, _getSymbols(object));
    object = _getPrototype(object);
  }
  return result;
};

var _getSymbolsIn = getSymbolsIn;

/**
 * Copies own and inherited symbols of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy symbols from.
 * @param {Object} [object={}] The object to copy symbols to.
 * @returns {Object} Returns `object`.
 */
function copySymbolsIn(source, object) {
  return _copyObject(source, _getSymbolsIn(source), object);
}

var _copySymbolsIn = copySymbolsIn;

/**
 * Creates an array of own and inherited enumerable property names and
 * symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names and symbols.
 */
function getAllKeysIn(object) {
  return _baseGetAllKeys(object, keysIn_1, _getSymbolsIn);
}

var _getAllKeysIn = getAllKeysIn;

/** Used for built-in method references. */
var objectProto$e = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$b = objectProto$e.hasOwnProperty;

/**
 * Initializes an array clone.
 *
 * @private
 * @param {Array} array The array to clone.
 * @returns {Array} Returns the initialized clone.
 */
function initCloneArray(array) {
  var length = array.length,
      result = new array.constructor(length);

  // Add properties assigned by `RegExp#exec`.
  if (length && typeof array[0] == 'string' && hasOwnProperty$b.call(array, 'index')) {
    result.index = array.index;
    result.input = array.input;
  }
  return result;
}

var _initCloneArray = initCloneArray;

/**
 * Creates a clone of `arrayBuffer`.
 *
 * @private
 * @param {ArrayBuffer} arrayBuffer The array buffer to clone.
 * @returns {ArrayBuffer} Returns the cloned array buffer.
 */
function cloneArrayBuffer(arrayBuffer) {
  var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
  new _Uint8Array(result).set(new _Uint8Array(arrayBuffer));
  return result;
}

var _cloneArrayBuffer = cloneArrayBuffer;

/**
 * Creates a clone of `dataView`.
 *
 * @private
 * @param {Object} dataView The data view to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned data view.
 */
function cloneDataView(dataView, isDeep) {
  var buffer = isDeep ? _cloneArrayBuffer(dataView.buffer) : dataView.buffer;
  return new dataView.constructor(buffer, dataView.byteOffset, dataView.byteLength);
}

var _cloneDataView = cloneDataView;

/** Used to match `RegExp` flags from their coerced string values. */
var reFlags = /\w*$/;

/**
 * Creates a clone of `regexp`.
 *
 * @private
 * @param {Object} regexp The regexp to clone.
 * @returns {Object} Returns the cloned regexp.
 */
function cloneRegExp(regexp) {
  var result = new regexp.constructor(regexp.source, reFlags.exec(regexp));
  result.lastIndex = regexp.lastIndex;
  return result;
}

var _cloneRegExp = cloneRegExp;

/** Used to convert symbols to primitives and strings. */
var symbolProto$2 = _Symbol ? _Symbol.prototype : undefined,
    symbolValueOf$1 = symbolProto$2 ? symbolProto$2.valueOf : undefined;

/**
 * Creates a clone of the `symbol` object.
 *
 * @private
 * @param {Object} symbol The symbol object to clone.
 * @returns {Object} Returns the cloned symbol object.
 */
function cloneSymbol(symbol) {
  return symbolValueOf$1 ? Object(symbolValueOf$1.call(symbol)) : {};
}

var _cloneSymbol = cloneSymbol;

/**
 * Creates a clone of `typedArray`.
 *
 * @private
 * @param {Object} typedArray The typed array to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned typed array.
 */
function cloneTypedArray(typedArray, isDeep) {
  var buffer = isDeep ? _cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
  return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
}

var _cloneTypedArray = cloneTypedArray;

/** `Object#toString` result references. */
var boolTag$2 = '[object Boolean]',
    dateTag$2 = '[object Date]',
    mapTag$3 = '[object Map]',
    numberTag$2 = '[object Number]',
    regexpTag$2 = '[object RegExp]',
    setTag$3 = '[object Set]',
    stringTag$2 = '[object String]',
    symbolTag$2 = '[object Symbol]';

var arrayBufferTag$2 = '[object ArrayBuffer]',
    dataViewTag$3 = '[object DataView]',
    float32Tag$1 = '[object Float32Array]',
    float64Tag$1 = '[object Float64Array]',
    int8Tag$1 = '[object Int8Array]',
    int16Tag$1 = '[object Int16Array]',
    int32Tag$1 = '[object Int32Array]',
    uint8Tag$1 = '[object Uint8Array]',
    uint8ClampedTag$1 = '[object Uint8ClampedArray]',
    uint16Tag$1 = '[object Uint16Array]',
    uint32Tag$1 = '[object Uint32Array]';

/**
 * Initializes an object clone based on its `toStringTag`.
 *
 * **Note:** This function only supports cloning values with tags of
 * `Boolean`, `Date`, `Error`, `Map`, `Number`, `RegExp`, `Set`, or `String`.
 *
 * @private
 * @param {Object} object The object to clone.
 * @param {string} tag The `toStringTag` of the object to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the initialized clone.
 */
function initCloneByTag(object, tag, isDeep) {
  var Ctor = object.constructor;
  switch (tag) {
    case arrayBufferTag$2:
      return _cloneArrayBuffer(object);

    case boolTag$2:
    case dateTag$2:
      return new Ctor(+object);

    case dataViewTag$3:
      return _cloneDataView(object, isDeep);

    case float32Tag$1: case float64Tag$1:
    case int8Tag$1: case int16Tag$1: case int32Tag$1:
    case uint8Tag$1: case uint8ClampedTag$1: case uint16Tag$1: case uint32Tag$1:
      return _cloneTypedArray(object, isDeep);

    case mapTag$3:
      return new Ctor;

    case numberTag$2:
    case stringTag$2:
      return new Ctor(object);

    case regexpTag$2:
      return _cloneRegExp(object);

    case setTag$3:
      return new Ctor;

    case symbolTag$2:
      return _cloneSymbol(object);
  }
}

var _initCloneByTag = initCloneByTag;

/** Built-in value references. */
var objectCreate = Object.create;

/**
 * The base implementation of `_.create` without support for assigning
 * properties to the created object.
 *
 * @private
 * @param {Object} proto The object to inherit from.
 * @returns {Object} Returns the new object.
 */
var baseCreate = (function() {
  function object() {}
  return function(proto) {
    if (!isObject_1(proto)) {
      return {};
    }
    if (objectCreate) {
      return objectCreate(proto);
    }
    object.prototype = proto;
    var result = new object;
    object.prototype = undefined;
    return result;
  };
}());

var _baseCreate = baseCreate;

/**
 * Initializes an object clone.
 *
 * @private
 * @param {Object} object The object to clone.
 * @returns {Object} Returns the initialized clone.
 */
function initCloneObject(object) {
  return (typeof object.constructor == 'function' && !_isPrototype(object))
    ? _baseCreate(_getPrototype(object))
    : {};
}

var _initCloneObject = initCloneObject;

/** `Object#toString` result references. */
var mapTag$4 = '[object Map]';

/**
 * The base implementation of `_.isMap` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a map, else `false`.
 */
function baseIsMap(value) {
  return isObjectLike_1(value) && _getTag(value) == mapTag$4;
}

var _baseIsMap = baseIsMap;

/* Node.js helper references. */
var nodeIsMap = _nodeUtil && _nodeUtil.isMap;

/**
 * Checks if `value` is classified as a `Map` object.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a map, else `false`.
 * @example
 *
 * _.isMap(new Map);
 * // => true
 *
 * _.isMap(new WeakMap);
 * // => false
 */
var isMap = nodeIsMap ? _baseUnary(nodeIsMap) : _baseIsMap;

var isMap_1 = isMap;

/** `Object#toString` result references. */
var setTag$4 = '[object Set]';

/**
 * The base implementation of `_.isSet` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a set, else `false`.
 */
function baseIsSet(value) {
  return isObjectLike_1(value) && _getTag(value) == setTag$4;
}

var _baseIsSet = baseIsSet;

/* Node.js helper references. */
var nodeIsSet = _nodeUtil && _nodeUtil.isSet;

/**
 * Checks if `value` is classified as a `Set` object.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a set, else `false`.
 * @example
 *
 * _.isSet(new Set);
 * // => true
 *
 * _.isSet(new WeakSet);
 * // => false
 */
var isSet = nodeIsSet ? _baseUnary(nodeIsSet) : _baseIsSet;

var isSet_1 = isSet;

/** Used to compose bitmasks for cloning. */
var CLONE_DEEP_FLAG = 1,
    CLONE_FLAT_FLAG = 2,
    CLONE_SYMBOLS_FLAG = 4;

/** `Object#toString` result references. */
var argsTag$3 = '[object Arguments]',
    arrayTag$2 = '[object Array]',
    boolTag$3 = '[object Boolean]',
    dateTag$3 = '[object Date]',
    errorTag$2 = '[object Error]',
    funcTag$2 = '[object Function]',
    genTag$1 = '[object GeneratorFunction]',
    mapTag$5 = '[object Map]',
    numberTag$3 = '[object Number]',
    objectTag$3 = '[object Object]',
    regexpTag$3 = '[object RegExp]',
    setTag$5 = '[object Set]',
    stringTag$3 = '[object String]',
    symbolTag$3 = '[object Symbol]',
    weakMapTag$2 = '[object WeakMap]';

var arrayBufferTag$3 = '[object ArrayBuffer]',
    dataViewTag$4 = '[object DataView]',
    float32Tag$2 = '[object Float32Array]',
    float64Tag$2 = '[object Float64Array]',
    int8Tag$2 = '[object Int8Array]',
    int16Tag$2 = '[object Int16Array]',
    int32Tag$2 = '[object Int32Array]',
    uint8Tag$2 = '[object Uint8Array]',
    uint8ClampedTag$2 = '[object Uint8ClampedArray]',
    uint16Tag$2 = '[object Uint16Array]',
    uint32Tag$2 = '[object Uint32Array]';

/** Used to identify `toStringTag` values supported by `_.clone`. */
var cloneableTags = {};
cloneableTags[argsTag$3] = cloneableTags[arrayTag$2] =
cloneableTags[arrayBufferTag$3] = cloneableTags[dataViewTag$4] =
cloneableTags[boolTag$3] = cloneableTags[dateTag$3] =
cloneableTags[float32Tag$2] = cloneableTags[float64Tag$2] =
cloneableTags[int8Tag$2] = cloneableTags[int16Tag$2] =
cloneableTags[int32Tag$2] = cloneableTags[mapTag$5] =
cloneableTags[numberTag$3] = cloneableTags[objectTag$3] =
cloneableTags[regexpTag$3] = cloneableTags[setTag$5] =
cloneableTags[stringTag$3] = cloneableTags[symbolTag$3] =
cloneableTags[uint8Tag$2] = cloneableTags[uint8ClampedTag$2] =
cloneableTags[uint16Tag$2] = cloneableTags[uint32Tag$2] = true;
cloneableTags[errorTag$2] = cloneableTags[funcTag$2] =
cloneableTags[weakMapTag$2] = false;

/**
 * The base implementation of `_.clone` and `_.cloneDeep` which tracks
 * traversed objects.
 *
 * @private
 * @param {*} value The value to clone.
 * @param {boolean} bitmask The bitmask flags.
 *  1 - Deep clone
 *  2 - Flatten inherited properties
 *  4 - Clone symbols
 * @param {Function} [customizer] The function to customize cloning.
 * @param {string} [key] The key of `value`.
 * @param {Object} [object] The parent object of `value`.
 * @param {Object} [stack] Tracks traversed objects and their clone counterparts.
 * @returns {*} Returns the cloned value.
 */
function baseClone(value, bitmask, customizer, key, object, stack) {
  var result,
      isDeep = bitmask & CLONE_DEEP_FLAG,
      isFlat = bitmask & CLONE_FLAT_FLAG,
      isFull = bitmask & CLONE_SYMBOLS_FLAG;

  if (customizer) {
    result = object ? customizer(value, key, object, stack) : customizer(value);
  }
  if (result !== undefined) {
    return result;
  }
  if (!isObject_1(value)) {
    return value;
  }
  var isArr = isArray_1(value);
  if (isArr) {
    result = _initCloneArray(value);
    if (!isDeep) {
      return _copyArray(value, result);
    }
  } else {
    var tag = _getTag(value),
        isFunc = tag == funcTag$2 || tag == genTag$1;

    if (isBuffer_1(value)) {
      return _cloneBuffer(value, isDeep);
    }
    if (tag == objectTag$3 || tag == argsTag$3 || (isFunc && !object)) {
      result = (isFlat || isFunc) ? {} : _initCloneObject(value);
      if (!isDeep) {
        return isFlat
          ? _copySymbolsIn(value, _baseAssignIn(result, value))
          : _copySymbols(value, _baseAssign(result, value));
      }
    } else {
      if (!cloneableTags[tag]) {
        return object ? value : {};
      }
      result = _initCloneByTag(value, tag, isDeep);
    }
  }
  // Check for circular references and return its corresponding clone.
  stack || (stack = new _Stack);
  var stacked = stack.get(value);
  if (stacked) {
    return stacked;
  }
  stack.set(value, result);

  if (isSet_1(value)) {
    value.forEach(function(subValue) {
      result.add(baseClone(subValue, bitmask, customizer, subValue, value, stack));
    });
  } else if (isMap_1(value)) {
    value.forEach(function(subValue, key) {
      result.set(key, baseClone(subValue, bitmask, customizer, key, value, stack));
    });
  }

  var keysFunc = isFull
    ? (isFlat ? _getAllKeysIn : _getAllKeys)
    : (isFlat ? keysIn : keys_1);

  var props = isArr ? undefined : keysFunc(value);
  _arrayEach(props || value, function(subValue, key) {
    if (props) {
      key = subValue;
      subValue = value[key];
    }
    // Recursively populate clone (susceptible to call stack limits).
    _assignValue(result, key, baseClone(subValue, bitmask, customizer, key, value, stack));
  });
  return result;
}

var _baseClone = baseClone;

/**
 * Gets the last element of `array`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {Array} array The array to query.
 * @returns {*} Returns the last element of `array`.
 * @example
 *
 * _.last([1, 2, 3]);
 * // => 3
 */
function last(array) {
  var length = array == null ? 0 : array.length;
  return length ? array[length - 1] : undefined;
}

var last_1 = last;

/**
 * The base implementation of `_.slice` without an iteratee call guard.
 *
 * @private
 * @param {Array} array The array to slice.
 * @param {number} [start=0] The start position.
 * @param {number} [end=array.length] The end position.
 * @returns {Array} Returns the slice of `array`.
 */
function baseSlice(array, start, end) {
  var index = -1,
      length = array.length;

  if (start < 0) {
    start = -start > length ? 0 : (length + start);
  }
  end = end > length ? length : end;
  if (end < 0) {
    end += length;
  }
  length = start > end ? 0 : ((end - start) >>> 0);
  start >>>= 0;

  var result = Array(length);
  while (++index < length) {
    result[index] = array[index + start];
  }
  return result;
}

var _baseSlice = baseSlice;

/**
 * Gets the parent value at `path` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array} path The path to get the parent value of.
 * @returns {*} Returns the parent value.
 */
function parent(object, path) {
  return path.length < 2 ? object : _baseGet(object, _baseSlice(path, 0, -1));
}

var _parent = parent;

/**
 * The base implementation of `_.unset`.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {Array|string} path The property path to unset.
 * @returns {boolean} Returns `true` if the property is deleted, else `false`.
 */
function baseUnset(object, path) {
  path = _castPath(path, object);
  object = _parent(object, path);
  return object == null || delete object[_toKey(last_1(path))];
}

var _baseUnset = baseUnset;

/** `Object#toString` result references. */
var objectTag$4 = '[object Object]';

/** Used for built-in method references. */
var funcProto$2 = Function.prototype,
    objectProto$f = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString$2 = funcProto$2.toString;

/** Used to check objects for own properties. */
var hasOwnProperty$c = objectProto$f.hasOwnProperty;

/** Used to infer the `Object` constructor. */
var objectCtorString = funcToString$2.call(Object);

/**
 * Checks if `value` is a plain object, that is, an object created by the
 * `Object` constructor or one with a `[[Prototype]]` of `null`.
 *
 * @static
 * @memberOf _
 * @since 0.8.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 * }
 *
 * _.isPlainObject(new Foo);
 * // => false
 *
 * _.isPlainObject([1, 2, 3]);
 * // => false
 *
 * _.isPlainObject({ 'x': 0, 'y': 0 });
 * // => true
 *
 * _.isPlainObject(Object.create(null));
 * // => true
 */
function isPlainObject(value) {
  if (!isObjectLike_1(value) || _baseGetTag(value) != objectTag$4) {
    return false;
  }
  var proto = _getPrototype(value);
  if (proto === null) {
    return true;
  }
  var Ctor = hasOwnProperty$c.call(proto, 'constructor') && proto.constructor;
  return typeof Ctor == 'function' && Ctor instanceof Ctor &&
    funcToString$2.call(Ctor) == objectCtorString;
}

var isPlainObject_1 = isPlainObject;

/**
 * Used by `_.omit` to customize its `_.cloneDeep` use to only clone plain
 * objects.
 *
 * @private
 * @param {*} value The value to inspect.
 * @param {string} key The key of the property to inspect.
 * @returns {*} Returns the uncloned value or `undefined` to defer cloning to `_.cloneDeep`.
 */
function customOmitClone(value) {
  return isPlainObject_1(value) ? undefined : value;
}

var _customOmitClone = customOmitClone;

/**
 * Flattens `array` a single level deep.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {Array} array The array to flatten.
 * @returns {Array} Returns the new flattened array.
 * @example
 *
 * _.flatten([1, [2, [3, [4]], 5]]);
 * // => [1, 2, [3, [4]], 5]
 */
function flatten(array) {
  var length = array == null ? 0 : array.length;
  return length ? _baseFlatten(array, 1) : [];
}

var flatten_1 = flatten;

/**
 * A faster alternative to `Function#apply`, this function invokes `func`
 * with the `this` binding of `thisArg` and the arguments of `args`.
 *
 * @private
 * @param {Function} func The function to invoke.
 * @param {*} thisArg The `this` binding of `func`.
 * @param {Array} args The arguments to invoke `func` with.
 * @returns {*} Returns the result of `func`.
 */
function apply(func, thisArg, args) {
  switch (args.length) {
    case 0: return func.call(thisArg);
    case 1: return func.call(thisArg, args[0]);
    case 2: return func.call(thisArg, args[0], args[1]);
    case 3: return func.call(thisArg, args[0], args[1], args[2]);
  }
  return func.apply(thisArg, args);
}

var _apply = apply;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max;

/**
 * A specialized version of `baseRest` which transforms the rest array.
 *
 * @private
 * @param {Function} func The function to apply a rest parameter to.
 * @param {number} [start=func.length-1] The start position of the rest parameter.
 * @param {Function} transform The rest array transform.
 * @returns {Function} Returns the new function.
 */
function overRest(func, start, transform) {
  start = nativeMax(start === undefined ? (func.length - 1) : start, 0);
  return function() {
    var args = arguments,
        index = -1,
        length = nativeMax(args.length - start, 0),
        array = Array(length);

    while (++index < length) {
      array[index] = args[start + index];
    }
    index = -1;
    var otherArgs = Array(start + 1);
    while (++index < start) {
      otherArgs[index] = args[index];
    }
    otherArgs[start] = transform(array);
    return _apply(func, this, otherArgs);
  };
}

var _overRest = overRest;

/**
 * Creates a function that returns `value`.
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Util
 * @param {*} value The value to return from the new function.
 * @returns {Function} Returns the new constant function.
 * @example
 *
 * var objects = _.times(2, _.constant({ 'a': 1 }));
 *
 * console.log(objects);
 * // => [{ 'a': 1 }, { 'a': 1 }]
 *
 * console.log(objects[0] === objects[1]);
 * // => true
 */
function constant(value) {
  return function() {
    return value;
  };
}

var constant_1 = constant;

/**
 * The base implementation of `setToString` without support for hot loop shorting.
 *
 * @private
 * @param {Function} func The function to modify.
 * @param {Function} string The `toString` result.
 * @returns {Function} Returns `func`.
 */
var baseSetToString = !_defineProperty$1 ? identity_1 : function(func, string) {
  return _defineProperty$1(func, 'toString', {
    'configurable': true,
    'enumerable': false,
    'value': constant_1(string),
    'writable': true
  });
};

var _baseSetToString = baseSetToString;

/** Used to detect hot functions by number of calls within a span of milliseconds. */
var HOT_COUNT = 800,
    HOT_SPAN = 16;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeNow = Date.now;

/**
 * Creates a function that'll short out and invoke `identity` instead
 * of `func` when it's called `HOT_COUNT` or more times in `HOT_SPAN`
 * milliseconds.
 *
 * @private
 * @param {Function} func The function to restrict.
 * @returns {Function} Returns the new shortable function.
 */
function shortOut(func) {
  var count = 0,
      lastCalled = 0;

  return function() {
    var stamp = nativeNow(),
        remaining = HOT_SPAN - (stamp - lastCalled);

    lastCalled = stamp;
    if (remaining > 0) {
      if (++count >= HOT_COUNT) {
        return arguments[0];
      }
    } else {
      count = 0;
    }
    return func.apply(undefined, arguments);
  };
}

var _shortOut = shortOut;

/**
 * Sets the `toString` method of `func` to return `string`.
 *
 * @private
 * @param {Function} func The function to modify.
 * @param {Function} string The `toString` result.
 * @returns {Function} Returns `func`.
 */
var setToString = _shortOut(_baseSetToString);

var _setToString = setToString;

/**
 * A specialized version of `baseRest` which flattens the rest array.
 *
 * @private
 * @param {Function} func The function to apply a rest parameter to.
 * @returns {Function} Returns the new function.
 */
function flatRest(func) {
  return _setToString(_overRest(func, undefined, flatten_1), func + '');
}

var _flatRest = flatRest;

/** Used to compose bitmasks for cloning. */
var CLONE_DEEP_FLAG$1 = 1,
    CLONE_FLAT_FLAG$1 = 2,
    CLONE_SYMBOLS_FLAG$1 = 4;

/**
 * The opposite of `_.pick`; this method creates an object composed of the
 * own and inherited enumerable property paths of `object` that are not omitted.
 *
 * **Note:** This method is considerably slower than `_.pick`.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The source object.
 * @param {...(string|string[])} [paths] The property paths to omit.
 * @returns {Object} Returns the new object.
 * @example
 *
 * var object = { 'a': 1, 'b': '2', 'c': 3 };
 *
 * _.omit(object, ['a', 'c']);
 * // => { 'b': '2' }
 */
var omit = _flatRest(function(object, paths) {
  var result = {};
  if (object == null) {
    return result;
  }
  var isDeep = false;
  paths = _arrayMap(paths, function(path) {
    path = _castPath(path, object);
    isDeep || (isDeep = path.length > 1);
    return path;
  });
  _copyObject(object, _getAllKeysIn(object), result);
  if (isDeep) {
    result = _baseClone(result, CLONE_DEEP_FLAG$1 | CLONE_FLAT_FLAG$1 | CLONE_SYMBOLS_FLAG$1, _customOmitClone);
  }
  var length = paths.length;
  while (length--) {
    _baseUnset(result, paths[length]);
  }
  return result;
});

var omit_1 = omit;

function needOptions(conf) {
  var reflectMap = {
    Radio: true,
    Select: true,
    Checkbox: true
  };
  return reflectMap[conf.type] || false;
}
var ERROR_HINTS = {
  NOT_CUSTOM_TYPE: 'Custom field required ComponentType',
  NOT_VALID_ELEMENT: 'is not a valid react-element'
};
var adaptorConstructor = function adaptorConstructor(props) {
  var providerHandleSubmit = get_1(props, 'list.action.setFilter');
  var afterSubmit;
  var afterReset;

  if (providerHandleSubmit) {
    afterSubmit = providerHandleSubmit;
    afterReset = providerHandleSubmit;
  }

  var queries = function queries(props) {
    return get_1(props, 'list.state.filter');
  };

  var loading = function loading(props) {
    return get_1(props, 'list.state.loading');
  };

  return {
    afterSubmit: afterSubmit,
    afterReset: afterReset,
    initValuePath: 'list.state.filter',
    queries: queries,
    loading: loading
  };
};

var FieldValue = zent.Form.FieldValue;
var OMIT_PROPS_LIST = ['value', 'defaultValue', 'disabled', 'visible'];

var FilterField = function FilterField(props) {
  var form = props.form,
      conf = props.conf,
      WrappedComp = props.WrappedComp,
      onValueChange = props.onValueChange;
  var name = conf.name,
      label = conf.label,
      nativeChangeHandler = conf.onChange;
  var currentModel = React__default.useMemo(function () {
    return form.model.get(name);
  }, [form, name]); // 触发副作用函数

  var handleFiledChange = React__default.useCallback(function (value) {
    // 新版zent form使用rxjs，直接赋值
    var curFormValue = currentModel.value;
    currentModel.value = _objectSpread2({}, curFormValue, {
      fieldValue: value
    });
    if (onValueChange) onValueChange(value, name);
    if (nativeChangeHandler) nativeChangeHandler(value);
  }, [currentModel, name, nativeChangeHandler, onValueChange]);
  var getPassiveProps = React__default.useCallback(function (conf, curProps, curStatus) {
    var partInheritProps = omit_1(conf.inheritProps || {}, OMIT_PROPS_LIST);
    var mergedProps = curProps ? _objectSpread2({}, curProps, {}, partInheritProps, {}, omit_1(curStatus, 'visible')) : partInheritProps;

    if (!mergedProps.options && needOptions(conf)) {
      /* istanbul ignore next */
      if (!conf.options) {
        throw new Error("type ".concat(conf.type, " required property options"));
      }

      mergedProps.options = conf.options;
    }

    return mergedProps;
  }, []);

  if (currentModel) {
    return React__default.createElement(FieldValue, {
      model: currentModel
    }, function (formValue) {
      return get_1(formValue, 'status.visible', true) ? React__default.createElement(zent.FormControl, {
        label: label,
        withoutLabel: !label,
        className: "easy-filter__zent-control"
      }, React__default.createElement("span", {
        "data-testid": name
      }, React__default.createElement(WrappedComp, _extends({
        width: "185px"
      }, getPassiveProps(conf, formValue.props, formValue.status), {
        key: name,
        value: formValue.fieldValue,
        onChange: handleFiledChange
      })))) : null;
    });
  }
  /* istanbul ignore next */


  return null;
};

var DEFAULT_LABELS = ['收起', '展开'];
var CollapseButton = React__default.forwardRef(function CollapseButtonInner(props, ref) {
  var _props$labels = props.labels,
      labels = _props$labels === void 0 ? DEFAULT_LABELS : _props$labels,
      defaultValue = props.defaultValue,
      onChange = props.onChange;

  var _labels = _slicedToArray(labels, 2),
      expandLabel = _labels[0],
      collapseLabel = _labels[1];

  var _React$useState = React__default.useState(defaultValue),
      _React$useState2 = _slicedToArray(_React$useState, 2),
      value = _React$useState2[0],
      setValue = _React$useState2[1];

  var handleChangeState = React__default.useCallback(function () {
    setValue(function (prev) {
      return !prev;
    });
  }, []);
  React__default.useImperativeHandle(ref, function () {
    return {
      toggleState: function toggleState(state) {
        setValue(state === 'expand');
      }
    };
  });
  /**
   * 需要将onChange的回调的调用放在这里，否则会产生一个warning
   * github issue链接：
   * @see https://github.com/facebook/react/issues/18178#issuecomment-592662192
   * 为什么react禁止在渲染过程中被其他组件更新state:
   * @see https://reactjs.org/blog/2020/02/26/react-v16.13.0.html#warnings-for-some-updates-during-render
   */

  React__default.useEffect(function () {
    onChange(value);
  }, [onChange, value]);
  return React__default.createElement(zent.Button, {
    outline: true,
    bordered: false,
    className: "collapse-trigger",
    onClick: handleChangeState,
    type: "primary"
  }, value ? expandLabel : collapseLabel, React__default.createElement(zent.Icon, {
    style: {
      margin: '0 4px'
    },
    type: value ? 'up' : 'down'
  }));
});

var useDefaultQueries = function useDefaultQueries(props, adaptor) {
  var passiveValue = React__default.useMemo(function () {
    return props.value || {};
  }, [props.value]);
  var defaultQueries = React__default.useMemo(function () {
    return get_1(props, adaptor.initValuePath, passiveValue);
  }, [adaptor.initValuePath, passiveValue, props]);
  var formattedQueries = React__default.useMemo(function () {
    if (props.formatQueries) {
      return props.formatQueries(defaultQueries);
    }

    return defaultQueries;
  }, [defaultQueries, props]);
  return formattedQueries;
};

var form = zent.Form.form,
    field = zent.Form.field;
var valueType = {
  DateRangeQuickPicker: [] // [[startTime, endTime], string],

};
function getModelFromConf(conf) {
  var formBuilder = {}; // 支持group分组的方式渲染model

  conf.forEach(function (c) {
    if (!Array.isArray(c)) {
      var _mapFieldValue = mapFieldValue(c),
          name = _mapFieldValue.name,
          model = _mapFieldValue.model;

      formBuilder[name] = model;
    } else {
      var configGroup = c;
      configGroup.forEach(function (ci) {
        var _mapFieldValue2 = mapFieldValue(ci),
            name = _mapFieldValue2.name,
            model = _mapFieldValue2.model;

        formBuilder[name] = model;
      });
    }
  });
  return form(formBuilder);
}

function mapFieldValue(conf) {
  var name = conf.name,
      type = conf.type,
      inheritProps = conf.inheritProps; // 初始值的使用熟顺序
  // Filter组件props的value -> config.defaultValue -> 规定的默认类型

  var typeDefaultValue = get_1(valueType, type, '');
  var union = {
    fieldValue: get_1(conf, 'defaultValue', typeDefaultValue),
    status: {
      disabled: conf.disabled || get_1(inheritProps, 'disabled', false),
      visible: get_1(conf, 'visible', true)
    },
    props: inheritProps || {}
  };
  return {
    name: name,
    model: field(union)
  };
}

var DEFAULT_STATUS = {
  visible: true,
  disabled: false
};
var DEFAULT_PROPS = {};
function splitValuesFromModel(models, updateStatus) {
  var keys = Object.keys(models);
  var res = {
    values: {},
    status: {},
    props: {}
  };

  if (keys.length) {
    keys.forEach(function (key) {
      var curModel = models[key];
      var curUpdateStatus = get_1(updateStatus, key, {
        status: DEFAULT_STATUS,
        props: DEFAULT_PROPS
      });

      if (curModel) {
        var fieldValue = curModel.fieldValue,
            status = curModel.status,
            props = curModel.props;
        res.values[key] = fieldValue;
        res.status[key] = _objectSpread2({}, curUpdateStatus.status, {}, status);
        res.props[key] = _objectSpread2({}, curUpdateStatus.props, {}, props);
      }
    });
  }

  return res;
}

// 从config中获取watch函数
// 需要对依赖关系进行分类
function getWatchesFromConf(configs) {
  var WATCHES = {};
  configs.forEach(function (config) {
    if (Array.isArray(config)) {
      var configGroup = config;
      configGroup.forEach(function (configItem) {
        return mapFiledWatchFuncs(configItem, WATCHES);
      });
    } else {
      mapFiledWatchFuncs(config, WATCHES);
    }
  });
  return WATCHES;
}

function mapFiledWatchFuncs(conf, watchStack) {
  var boundName = conf.name,
      unGroupedWatches = conf.watch;

  if (unGroupedWatches) {
    if (Array.isArray(unGroupedWatches)) {
      var watchList = unGroupedWatches;
      watchList.forEach(function (watcher) {
        var _watcher = _slicedToArray(watcher, 2),
            effectFunc = _watcher[0],
            dependenceList = _watcher[1];

        if (Array.isArray(dependenceList)) {
          dependenceList.forEach(function (dependence) {
            addWatchFuncs(watchStack, effectFunc, boundName, dependence);
          });
        } else {
          /* istanbul ignore next */
          throw new Error('dependence list should be array-type, please checkup config-' + boundName);
        }
      });
    } else {
      var watchFields = Object.keys(unGroupedWatches);
      /* istanbul ignore next */

      if (watchFields.length === 0) {
        return;
      }

      watchFields.forEach(function (field) {
        var effectFunc = unGroupedWatches[field];
        addWatchFuncs(watchStack, effectFunc, boundName, field);
      });
    }
  }
}

function addWatchFuncs(watchStack, effectFunc, boundName, field) {
  if (field === boundName) {
    throw new Error("can not subscribe self, please checkup field ".concat(boundName));
  }

  if (!watchStack[field]) {
    watchStack[field] = [[effectFunc, boundName]];
  } else {
    watchStack[field].push([effectFunc, boundName]);
  }
}

var useFormModelAndWatches = function useFormModelAndWatches(config) {
  var configChangeCount = React__default.useRef(0);

  var _React$useState = React__default.useState(config),
      _React$useState2 = _slicedToArray(_React$useState, 1),
      dumpConfig = _React$useState2[0];

  var models = React__default.useMemo(function () {
    return getModelFromConf(dumpConfig);
  }, [dumpConfig]);
  var watches = React__default.useMemo(function () {
    return getWatchesFromConf(dumpConfig);
  }, [dumpConfig]);
  React__default.useEffect(function () {
    /* istanbul ignore next */
    if (configChangeCount.current > 1) {
      console.warn('[EasyList] config在EasyList运行时发生了改变，这是不被允许的！');
    }
  }, [config]);
  return {
    models: models,
    watches: watches
  };
};

var YZ_NODE_ENV = get_1(window._global, 'nodeEnv', 'prod');
var EBIZ_NODE_ENV = get_1(process, 'env.NODE_ENV', 'production');

var useWatchCallback = function useWatchCallback(form, watches, formChangeCallback) {
  var blockUpdating = React__default.useRef(false);
  var prevFormValues = React__default.useRef({});
  var updateFields = React__default.useRef(new Set([]));
  var updateValuesMap = React__default.useRef(new Map());
  var changeTimerRef = React__default.useRef(null);
  var handleChangeCallback = React__default.useCallback(function () {
    if (changeTimerRef.current) {
      clearTimeout(changeTimerRef.current);
    }

    changeTimerRef.current = setTimeout(function () {
      blockUpdating.current = true;
      updateValuesMap.current.forEach(function (updateValue, updateField) {
        var updateModel = form.model.get(updateField);

        if (updateModel) {
          updateModel.value = updateValue;
        }
      });
      formChangeCallback(Array.from(updateFields.current));
      changeTimerRef.current = null;
      updateFields.current.clear();
      blockUpdating.current = false; // 记录下这一次的form表单的值

      var _splitValuesFromModel = splitValuesFromModel(form.getValue()),
          formValues = _splitValuesFromModel.values;

      prevFormValues.current = formValues;
    }, 20);
  }, [form, formChangeCallback]);
  var handleChangeModel = React__default.useCallback(function (modifyFieldName) {
    return function (payload) {
      // 被更新了，就添加一个
      updateFields.current.add(modifyFieldName);
      var modifyModel = form.model.get(modifyFieldName);
      var _modifyModel$value = modifyModel.value,
          prevValue = _modifyModel$value.fieldValue,
          prevStatus = _modifyModel$value.status,
          prevProps = _modifyModel$value.props;

      var _ref = payload || {},
          value = _ref.value,
          _ref$visible = _ref.visible,
          visible = _ref$visible === void 0 ? prevStatus.visible : _ref$visible,
          _ref$disabled = _ref.disabled,
          disabled = _ref$disabled === void 0 ? prevStatus.disabled : _ref$disabled,
          curProps = _objectWithoutProperties(_ref, ["value", "visible", "disabled"]); // 不断重写，延迟更新


      updateValuesMap.current.set(modifyFieldName, {
        fieldValue: value || prevValue,
        status: {
          visible: visible,
          disabled: disabled
        },
        props: _objectSpread2({}, prevProps, {}, curProps)
      });
    };
  }, [form.model]);
  React__default.useEffect(function () {
    prevFormValues.current = splitValuesFromModel(form.getValue()).values;
  }, [form]); // 为model添加订阅

  React__default.useEffect(function () {
    if (Object.keys(watches).length) {
      Object.entries(watches).forEach(function (_ref2) {
        var _ref3 = _slicedToArray(_ref2, 2),
            watchModelName = _ref3[0],
            handlers = _ref3[1];

        var watchModel = form.model.get(watchModelName);

        if (watchModel) {
          watchModel.value$.subscribe(function (curFiledUnion) {
            var hasChanged = curFiledUnion.fieldValue !== prevFormValues.current[watchModelName];

            if (hasChanged && !blockUpdating.current) {
              // 如果走到这里，说明观察的对象一定在变化
              updateFields.current.add(watchModelName);
              updateValuesMap.current.set(watchModelName, curFiledUnion);
              var fieldValue = curFiledUnion.fieldValue;

              var _splitValuesFromModel2 = splitValuesFromModel(form.getValue()),
                  formValues = _splitValuesFromModel2.values;

              handlers.forEach(function (_ref4) {
                var _ref5 = _slicedToArray(_ref4, 2),
                    handler = _ref5[0],
                    modifyModelName = _ref5[1];

                return handler(fieldValue, {
                  set: handleChangeModel(modifyModelName)
                }, formValues);
              });
              handleChangeCallback();
            }
          }); // 只有订阅了的watch参数才需要取消订阅

          /* istanbul ignore next */

          return function () {
            if (EBIZ_NODE_ENV !== 'test') {
              var unsubscribeKeys = [];
              Object.entries(watches).forEach(function (_ref6) {
                var _ref7 = _slicedToArray(_ref6, 1),
                    targetModelName = _ref7[0];

                if (!unsubscribeKeys.includes(targetModelName)) {
                  var targetModel = form.model.get(targetModelName);

                  try {
                    targetModel && targetModel.value$.unsubscribe();
                    unsubscribeKeys.push(targetModelName);
                  } catch (e) {
                    /** do nothing */
                  }
                }
              });
            }
          };
        }
      });
    }
  }, [form, handleChangeCallback, handleChangeModel, watches]);
};

var ReservedCompReflect = {
  Input: FilterInput,
  Radio: RadioType,
  Select: SelectType,
  Checkbox: CheckboxType,
  DatePicker: zent.DatePicker,
  QuarterPicker: zent.QuarterPicker,
  MonthPicker: zent.MonthPicker,
  WeekPicker: zent.WeekPicker,
  DateRangePicker: zent.DateRangePicker,
  TimePicker: zent.TimePicker,
  TimeRangePicker: zent.TimeRangePicker,
  DateRangeQuickPicker: DateRangeQuickPickerType
};
var useForm = zent.Form.useForm;
var FilterWithRef = React__default.forwardRef(function Filter(props, ref) {
  var actionsOption = props.actionsOption,
      _props$autoFilter = props.autoFilter,
      autoFilter = _props$autoFilter === void 0 ? false : _props$autoFilter,
      _props$backgroundColo = props.backgroundColor,
      backgroundColor = _props$backgroundColo === void 0 ? '#f7f8fa' : _props$backgroundColo,
      _props$collapseConfig = props.collapseConfig,
      collapseConfig = _props$collapseConfig === void 0 ? [] : _props$collapseConfig,
      collapseSwitcherLabel = props.collapseSwitcherLabel,
      config = props.config,
      defaultCollapseState = props.defaultCollapseState,
      formatFields = props.formatFields,
      layout = props.layout,
      onChange = props.onChange,
      onReset = props.onReset,
      onSubmit = props.onSubmit,
      renderActions = props.renderActions; // ref and list listAdaptor

  var collapseButtonRef = React__default.useRef(null);
  var meldConfigs = React__default.useMemo(function () {
    return concat_1(config, collapseConfig);
  }, [collapseConfig, config]);

  var _useFormModelAndWatch = useFormModelAndWatches(meldConfigs),
      models = _useFormModelAndWatch.models,
      watches = _useFormModelAndWatch.watches;

  var form = useForm(models);
  var listAdaptor = React__default.useMemo(function () {
    return adaptorConstructor(props);
  }, [props]);
  var filter = React__default.useMemo(function () {
    return {
      submit: function submit() {
        var formValues = form.getValue();

        var _splitValuesFromModel = splitValuesFromModel(formValues),
            values = _splitValuesFromModel.values,
            status = _splitValuesFromModel.status;

        var formattedValues = formatFields ? formatFields(values, status) : values;
        onSubmit && onSubmit(formattedValues, status);
        if (listAdaptor.afterSubmit) listAdaptor.afterSubmit(values);
      },
      reset: function reset() {
        form.resetValue();
        onReset && onReset();
        var formValues = form.getValue();

        var _splitValuesFromModel2 = splitValuesFromModel(formValues),
            values = _splitValuesFromModel2.values;

        if (listAdaptor.afterReset) listAdaptor.afterReset(values);
      },
      getQueries: function getQueries() {
        return listAdaptor.queries(props);
      },
      getCurrentValues: function getCurrentValues() {
        var formValues = form.getValue();

        var _splitValuesFromModel3 = splitValuesFromModel(formValues),
            values = _splitValuesFromModel3.values;

        return values;
      },
      getLoading: function getLoading() {
        return listAdaptor.loading(props);
      },
      toggleState: function toggleState(nextState) {
        collapseButtonRef.current && collapseButtonRef.current.toggleState(nextState);
      }
    };
  }, [form, formatFields, listAdaptor, onReset, onSubmit, props]);
  React__default.useImperativeHandle(ref, function () {
    return filter;
  });
  var handleAutoFilter = React__default.useCallback(function () {
    if (autoFilter) filter.submit();
  }, [autoFilter, filter]);
  var handleChange = React__default.useCallback(function (updateFieldNames) {
    var newFormValues = form.getValue();

    var _splitValuesFromModel4 = splitValuesFromModel(newFormValues),
        values = _splitValuesFromModel4.values,
        status = _splitValuesFromModel4.status;

    var updateFields = [];

    if (updateFieldNames.length) {
      updateFieldNames.forEach(function (fieldName) {
        return updateFields.push({
          name: fieldName,
          value: newFormValues[fieldName].fieldValue
        });
      });
      if (onChange) onChange(updateFields, values, status);
      handleAutoFilter();
    }
  }, [form, handleAutoFilter, onChange]); // 添加监听

  useWatchCallback(form, watches, handleChange);

  var _React$useState = React__default.useState(false),
      _React$useState2 = _slicedToArray(_React$useState, 2),
      init = _React$useState2[0],
      setInit = _React$useState2[1];

  var defaultQueries = useDefaultQueries(props, listAdaptor);
  React__default.useEffect(function () {
    if (!init && Object.keys(defaultQueries).length) {
      setInit(true);
      var formValues = form.getValue();
      var initValues = {};
      var notEmptyKeys = [];
      Object.entries(defaultQueries).forEach(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 2),
            fieldName = _ref2[0],
            value = _ref2[1];

        if (value !== undefined) {
          notEmptyKeys.push([fieldName, value]);
        }

        initValues[fieldName] = _objectSpread2({}, formValues[fieldName], {
          fieldValue: value
        });
      });
      form.patchValue(initValues);
      filter.submit();
    }
  }, [listAdaptor, defaultQueries, filter, form, init]);
  var renderFunction = React__default.useCallback(function (config) {
    var name = config.name;
    var Comp;

    if (typeof config.type === 'string') {
      // 根据配置渲染提供Filter提供的组件还是用户自己控制渲染
      if (config.type === 'Custom') {
        if (checkReactType(config.renderField, ERROR_HINTS.NOT_CUSTOM_TYPE)) {
          Comp = config.renderField;
        }
      } else Comp = ReservedCompReflect[config.type];
    }

    if (Comp) {
      return React__default.createElement(FilterField, {
        key: name,
        form: form,
        conf: config,
        WrappedComp: Comp,
        onValueChange: function onValueChange() {
          return handleChange([name]);
        }
      });
    }
    /* istanbul ignore next */


    return null;
  }, [form, handleChange]);
  var RENDER_FILTER_ITEMS = React__default.useCallback(function (renderConfig) {
    return React__default.createElement("div", {
      className: "easy-filter__panel-container"
    }, map_1(renderConfig, function (configItem, index) {
      var NODES = null;

      if (Array.isArray(configItem)) {
        var configGroup = configItem;
        NODES = map_1(configGroup, renderFunction);
      } else {
        NODES = renderFunction(configItem);
      }

      if (Array.isArray(NODES)) {
        return React__default.createElement("div", {
          key: "filter-group".concat(index),
          className: "easy-filter__panel"
        }, NODES);
      }

      return NODES;
    }));
  }, [renderFunction]);
  var RENDER_BASE_FILTER_ITEMS = React__default.useMemo(function () {
    return React__default.createElement("div", {
      "data-testid": "filter-fields",
      className: "easy-filter__panel-wrapper"
    }, RENDER_FILTER_ITEMS(config));
  }, [RENDER_FILTER_ITEMS, config]);

  var _React$useState3 = React__default.useState(defaultCollapseState === 'expand'),
      _React$useState4 = _slicedToArray(_React$useState3, 2),
      expand = _React$useState4[0],
      setExpand = _React$useState4[1];

  var showCollapseConfig = React__default.useMemo(function () {
    return collapseConfig && collapseConfig.length > 0;
  }, [collapseConfig]);
  var RENDER_COLLAPSE_FILTER_ITEMS = React__default.useMemo(function () {
    if (showCollapseConfig) {
      return React__default.createElement("div", {
        "data-testid": "filter-collapse-fields",
        className: "easy-filter__panel-wrapper easy-filter__panel_".concat(expand ? 'expand' : 'collapse')
      }, RENDER_FILTER_ITEMS(collapseConfig));
    }

    return null;
  }, [RENDER_FILTER_ITEMS, collapseConfig, expand, showCollapseConfig]);
  var RENDER_ACTIONS = React__default.useMemo(function () {
    if (autoFilter) return null;
    var ActionInner = null;

    if (renderActions && checkReactType(renderActions, ERROR_HINTS.NOT_VALID_ELEMENT)) {
      var UserRenderActions = renderActions;
      ActionInner = React__default.createElement(UserRenderActions, {
        filter: filter
      });
    } else {
      ActionInner = React__default.createElement(Actions, _extends({
        filter: filter
      }, actionsOption));
    }

    return React__default.createElement("div", {
      className: "easy-filter__panel"
    }, React__default.createElement(zent.FormControl, {
      className: "easy-filter__zent-control"
    }, React__default.createElement("div", {
      className: "easy-filter__actions-outer"
    }, ActionInner, showCollapseConfig && React__default.createElement(CollapseButton, {
      ref: collapseButtonRef,
      defaultValue: expand,
      onChange: setExpand,
      labels: collapseSwitcherLabel
    }))));
  }, [actionsOption, autoFilter, collapseSwitcherLabel, expand, filter, renderActions, showCollapseConfig]);
  return React__default.createElement(zent.Form, {
    layout: layout || 'horizontal',
    form: form,
    className: "easy-filter",
    style: {
      backgroundColor: backgroundColor
    }
  }, RENDER_BASE_FILTER_ITEMS, RENDER_COLLAPSE_FILTER_ITEMS, RENDER_ACTIONS);
});

function checkReactType(Comp, hint) {
  var res = reactIs.isValidElementType(Comp);

  if (!res) {
    throw new Error(hint);
  }

  return Comp;
}

/**
 * Performs a deep comparison between two values to determine if they are
 * equivalent.
 *
 * **Note:** This method supports comparing arrays, array buffers, booleans,
 * date objects, error objects, maps, numbers, `Object` objects, regexes,
 * sets, strings, symbols, and typed arrays. `Object` objects are compared
 * by their own, not inherited, enumerable properties. Functions and DOM
 * nodes are compared by strict equality, i.e. `===`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.isEqual(object, other);
 * // => true
 *
 * object === other;
 * // => false
 */
function isEqual(value, other) {
  return _baseIsEqual(value, other);
}

var isEqual_1 = isEqual;

var INITIAL_OPTION = {
  useOnce: true,
  flattenParams: true
};
/**
 *
 * @param watchValue 需要监听的value
 * @param callback 回调函数
 * @param options 选项配置
 * @param options.useOnce 是否只执行一次会回调
 * @param options.flattenParams 是否平展参数
 * @param options.predicate 断言函数
 */

var useValueCallback = function useValueCallback(watchValue, callback, options) {
  var response = React.useRef();
  var tempValues = React.useRef();

  var _Object$assign = Object.assign({}, INITIAL_OPTION, options),
      useOnce = _Object$assign.useOnce,
      flattenParams = _Object$assign.flattenParams,
      predicate = _Object$assign.predicate;

  var _useState = React.useState(false),
      _useState2 = _slicedToArray(_useState, 2),
      invoke = _useState2[0],
      setInvokeState = _useState2[1];

  var valueIsNotEmpty = React.useMemo(function () {
    if (isEqual_1(tempValues.current, watchValue)) return false;
    return predicate ? predicate(watchValue) : isNullable(watchValue);
  }, [predicate, watchValue]);
  React.useEffect(function () {
    if (!invoke || !useOnce) {
      if (valueIsNotEmpty) {
        if (flattenParams) {
          // @ts-ignore
          var paramsList = Array.isArray(watchValue) ? watchValue : [watchValue];
          response.current = callback.apply(void 0, _toConsumableArray(paramsList));
        } else {
          response.current = callback(watchValue);
        }

        setInvokeState(true);
      }
    }

    tempValues.current = watchValue; // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [valueIsNotEmpty, watchValue]);
  return response.current;
};

function isNullable(value) {
  if (Array.isArray(value)) {
    if (!value.length) return false;
    return value.every(isNullable);
  }

  return value !== undefined && value !== null;
}

var Search = function Search(props) {
  var _props$position = props.position,
      position = _props$position === void 0 ? 'right' : _props$position,
      _props$placeholder = props.placeholder,
      placeholder = _props$placeholder === void 0 ? '请输入' : _props$placeholder,
      onChange = props.onChange,
      name = props.name,
      children = props.children,
      afterPressEnter = props.afterPressEnter;

  var _React$useState = React__default.useState(''),
      _React$useState2 = _slicedToArray(_React$useState, 2),
      keyword = _React$useState2[0],
      setKeyword = _React$useState2[1]; // 用于暂存输入值，然后降低触发提交的频率


  var _React$useState3 = React__default.useState(''),
      _React$useState4 = _slicedToArray(_React$useState3, 2),
      prevValue = _React$useState4[0],
      setPrevValue = _React$useState4[1]; // 初始化adaptor提交easy-list


  var adaptor = React__default.useMemo(function () {
    return adaptorConstructor(props);
  }, [props]);
  var initValue = React__default.useMemo(function () {
    return get_1(props, "".concat(adaptor.initValuePath, ".").concat(name), '');
  }, [adaptor.initValuePath, name, props]);
  useValueCallback(initValue, setKeyword, {
    /** 不确定useValueCallback的影响，这里单独接管设置keyword的判断 */
    predicate: function predicate(value) {
      return value !== undefined && value !== '';
    }
  });
  var handleValueChange = React__default.useCallback(function (evt) {
    var value = evt.target.value;
    if (onChange) onChange(value);
    setKeyword(value);
  }, [onChange]);
  var handleSubmit = React__default.useCallback(function () {
    if (prevValue === keyword) return;
    setPrevValue(keyword);

    if (adaptor.afterSubmit) {
      adaptor.afterSubmit(_defineProperty({}, name, keyword));
    }
  }, [prevValue, keyword, adaptor, name]);
  var handlePressEnter = React__default.useCallback(function () {
    handleSubmit();
    if (afterPressEnter) afterPressEnter();
  }, [afterPressEnter, handleSubmit]);
  var ChildNode = React__default.useMemo(function () {
    if (children && reactIs.isElement(children)) return children;
    return null;
  }, [children]);
  return React__default.createElement("div", {
    "data-testid": "easy-filter-search",
    className: "easy-filter__search"
  }, position === 'right' && React__default.createElement("div", {
    style: {
      flex: 1
    }
  }, ChildNode), React__default.createElement("div", {
    className: "easy-filter__search-box"
  }, React__default.createElement(zent.Input, {
    icon: "search",
    className: "position-".concat(position),
    placeholder: placeholder,
    value: keyword,
    onChange: handleValueChange,
    onPressEnter: handlePressEnter,
    onBlur: handleSubmit
  })), position === 'left' && React__default.createElement("div", {
    style: {
      flex: 1
    }
  }, ChildNode));
};

/**
 * Creates a `_.find` or `_.findLast` function.
 *
 * @private
 * @param {Function} findIndexFunc The function to find the collection index.
 * @returns {Function} Returns the new find function.
 */
function createFind(findIndexFunc) {
  return function(collection, predicate, fromIndex) {
    var iterable = Object(collection);
    if (!isArrayLike_1(collection)) {
      var iteratee = _baseIteratee(predicate);
      collection = keys_1(collection);
      predicate = function(key) { return iteratee(iterable[key], key, iterable); };
    }
    var index = findIndexFunc(collection, predicate, fromIndex);
    return index > -1 ? iterable[iteratee ? collection[index] : index] : undefined;
  };
}

var _createFind = createFind;

/**
 * The base implementation of `_.findIndex` and `_.findLastIndex` without
 * support for iteratee shorthands.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {Function} predicate The function invoked per iteration.
 * @param {number} fromIndex The index to search from.
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function baseFindIndex(array, predicate, fromIndex, fromRight) {
  var length = array.length,
      index = fromIndex + (fromRight ? 1 : -1);

  while ((fromRight ? index-- : ++index < length)) {
    if (predicate(array[index], index, array)) {
      return index;
    }
  }
  return -1;
}

var _baseFindIndex = baseFindIndex;

/** Used as references for various `Number` constants. */
var NAN = 0 / 0;

/** Used to match leading and trailing whitespace. */
var reTrim = /^\s+|\s+$/g;

/** Used to detect bad signed hexadecimal string values. */
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

/** Used to detect binary string values. */
var reIsBinary = /^0b[01]+$/i;

/** Used to detect octal string values. */
var reIsOctal = /^0o[0-7]+$/i;

/** Built-in method references without a dependency on `root`. */
var freeParseInt = parseInt;

/**
 * Converts `value` to a number.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {number} Returns the number.
 * @example
 *
 * _.toNumber(3.2);
 * // => 3.2
 *
 * _.toNumber(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toNumber(Infinity);
 * // => Infinity
 *
 * _.toNumber('3.2');
 * // => 3.2
 */
function toNumber(value) {
  if (typeof value == 'number') {
    return value;
  }
  if (isSymbol_1(value)) {
    return NAN;
  }
  if (isObject_1(value)) {
    var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
    value = isObject_1(other) ? (other + '') : other;
  }
  if (typeof value != 'string') {
    return value === 0 ? value : +value;
  }
  value = value.replace(reTrim, '');
  var isBinary = reIsBinary.test(value);
  return (isBinary || reIsOctal.test(value))
    ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
    : (reIsBadHex.test(value) ? NAN : +value);
}

var toNumber_1 = toNumber;

/** Used as references for various `Number` constants. */
var INFINITY$2 = 1 / 0,
    MAX_INTEGER = 1.7976931348623157e+308;

/**
 * Converts `value` to a finite number.
 *
 * @static
 * @memberOf _
 * @since 4.12.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {number} Returns the converted number.
 * @example
 *
 * _.toFinite(3.2);
 * // => 3.2
 *
 * _.toFinite(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toFinite(Infinity);
 * // => 1.7976931348623157e+308
 *
 * _.toFinite('3.2');
 * // => 3.2
 */
function toFinite(value) {
  if (!value) {
    return value === 0 ? value : 0;
  }
  value = toNumber_1(value);
  if (value === INFINITY$2 || value === -INFINITY$2) {
    var sign = (value < 0 ? -1 : 1);
    return sign * MAX_INTEGER;
  }
  return value === value ? value : 0;
}

var toFinite_1 = toFinite;

/**
 * Converts `value` to an integer.
 *
 * **Note:** This method is loosely based on
 * [`ToInteger`](http://www.ecma-international.org/ecma-262/7.0/#sec-tointeger).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {number} Returns the converted integer.
 * @example
 *
 * _.toInteger(3.2);
 * // => 3
 *
 * _.toInteger(Number.MIN_VALUE);
 * // => 0
 *
 * _.toInteger(Infinity);
 * // => 1.7976931348623157e+308
 *
 * _.toInteger('3.2');
 * // => 3
 */
function toInteger(value) {
  var result = toFinite_1(value),
      remainder = result % 1;

  return result === result ? (remainder ? result - remainder : result) : 0;
}

var toInteger_1 = toInteger;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax$1 = Math.max;

/**
 * This method is like `_.find` except that it returns the index of the first
 * element `predicate` returns truthy for instead of the element itself.
 *
 * @static
 * @memberOf _
 * @since 1.1.0
 * @category Array
 * @param {Array} array The array to inspect.
 * @param {Function} [predicate=_.identity] The function invoked per iteration.
 * @param {number} [fromIndex=0] The index to search from.
 * @returns {number} Returns the index of the found element, else `-1`.
 * @example
 *
 * var users = [
 *   { 'user': 'barney',  'active': false },
 *   { 'user': 'fred',    'active': false },
 *   { 'user': 'pebbles', 'active': true }
 * ];
 *
 * _.findIndex(users, function(o) { return o.user == 'barney'; });
 * // => 0
 *
 * // The `_.matches` iteratee shorthand.
 * _.findIndex(users, { 'user': 'fred', 'active': false });
 * // => 1
 *
 * // The `_.matchesProperty` iteratee shorthand.
 * _.findIndex(users, ['active', false]);
 * // => 0
 *
 * // The `_.property` iteratee shorthand.
 * _.findIndex(users, 'active');
 * // => 2
 */
function findIndex(array, predicate, fromIndex) {
  var length = array == null ? 0 : array.length;
  if (!length) {
    return -1;
  }
  var index = fromIndex == null ? 0 : toInteger_1(fromIndex);
  if (index < 0) {
    index = nativeMax$1(length + index, 0);
  }
  return _baseFindIndex(array, _baseIteratee(predicate), index);
}

var findIndex_1 = findIndex;

/**
 * Iterates over elements of `collection`, returning the first element
 * `predicate` returns truthy for. The predicate is invoked with three
 * arguments: (value, index|key, collection).
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Collection
 * @param {Array|Object} collection The collection to inspect.
 * @param {Function} [predicate=_.identity] The function invoked per iteration.
 * @param {number} [fromIndex=0] The index to search from.
 * @returns {*} Returns the matched element, else `undefined`.
 * @example
 *
 * var users = [
 *   { 'user': 'barney',  'age': 36, 'active': true },
 *   { 'user': 'fred',    'age': 40, 'active': false },
 *   { 'user': 'pebbles', 'age': 1,  'active': true }
 * ];
 *
 * _.find(users, function(o) { return o.age < 40; });
 * // => object for 'barney'
 *
 * // The `_.matches` iteratee shorthand.
 * _.find(users, { 'age': 1, 'active': true });
 * // => object for 'pebbles'
 *
 * // The `_.matchesProperty` iteratee shorthand.
 * _.find(users, ['active', false]);
 * // => object for 'fred'
 *
 * // The `_.property` iteratee shorthand.
 * _.find(users, 'active');
 * // => object for 'barney'
 */
var find = _createFind(findIndex_1);

var find_1 = find;

var Tabs = React__default.forwardRef(function TabsWithRef(props, ref) {
  var _props$type = props.type,
      type = _props$type === void 0 ? 'card' : _props$type,
      tabs = props.tabs,
      name = props.name,
      defaultValue = props.defaultValue,
      onChange = props.onChange;

  var _React$useState = React__default.useState(false),
      _React$useState2 = _slicedToArray(_React$useState, 2),
      init = _React$useState2[0],
      setInit = _React$useState2[1]; // 初始化adaptor提交easy-list


  var adaptor = React__default.useMemo(function () {
    return adaptorConstructor(props);
  }, [props]);
  var orderTabs = React__default.useMemo(function () {
    return tabs.map(function (tab, index) {
      return Object.assign({}, tab, {
        id: index
      });
    });
  }, [tabs]);

  var _React$useState3 = React__default.useState(function () {
    return getDefaultActiveId(orderTabs, defaultValue);
  }),
      _React$useState4 = _slicedToArray(_React$useState3, 2),
      activeId = _React$useState4[0],
      setActiveId = _React$useState4[1];

  var handleTabChange = React__default.useCallback(function (curId) {
    setActiveId(curId);
    var target = find_1(orderTabs, function (tab) {
      return tab.id === curId;
    });

    if (target) {
      var value = target.value;
      onChange && onChange(value);

      if (adaptor.afterSubmit) {
        adaptor.afterSubmit(_defineProperty({}, name, value));
      }
    }
  }, [adaptor, name, onChange, orderTabs]);
  React__default.useEffect(function () {
    var initialValue = get_1(props, "".concat(adaptor.initValuePath, ".").concat(name));

    if (!init && initialValue) {
      var _activeId = getDefaultActiveId(orderTabs, initialValue);

      setInit(true);
      setActiveId(_activeId);
    }
  }, [name, props, init, orderTabs, adaptor.initValuePath]);
  var zentTabs = React__default.useMemo(function () {
    return orderTabs.map(function (tab) {
      var panelId = tab.id,
          label = tab.label,
          _tab$disabled = tab.disabled,
          disabled = _tab$disabled === void 0 ? false : _tab$disabled;
      return {
        key: panelId,
        title: label,
        disabled: disabled
      };
    });
  }, [orderTabs]);
  return React__default.createElement("div", {
    className: "easy-filter__tabs-box",
    "data-testid": "easy-filter-tabs"
  }, React__default.createElement(zent.Tabs, {
    ref: ref,
    activeId: activeId,
    type: type,
    onChange: handleTabChange,
    tabs: zentTabs
  }));
});

function getDefaultActiveId(tabs, defaultValue) {
  var target = find_1(tabs, function (tab) {
    return tab.value === defaultValue;
  });

  if (target) {
    return target.id;
  }

  return -1;
}

/**
 * This function is like `assignValue` except that it doesn't assign
 * `undefined` values.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function assignMergeValue(object, key, value) {
  if ((value !== undefined && !eq_1(object[key], value)) ||
      (value === undefined && !(key in object))) {
    _baseAssignValue(object, key, value);
  }
}

var _assignMergeValue = assignMergeValue;

/**
 * This method is like `_.isArrayLike` except that it also checks if `value`
 * is an object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array-like object,
 *  else `false`.
 * @example
 *
 * _.isArrayLikeObject([1, 2, 3]);
 * // => true
 *
 * _.isArrayLikeObject(document.body.children);
 * // => true
 *
 * _.isArrayLikeObject('abc');
 * // => false
 *
 * _.isArrayLikeObject(_.noop);
 * // => false
 */
function isArrayLikeObject(value) {
  return isObjectLike_1(value) && isArrayLike_1(value);
}

var isArrayLikeObject_1 = isArrayLikeObject;

/**
 * Gets the value at `key`, unless `key` is "__proto__" or "constructor".
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function safeGet(object, key) {
  if (key === 'constructor' && typeof object[key] === 'function') {
    return;
  }

  if (key == '__proto__') {
    return;
  }

  return object[key];
}

var _safeGet = safeGet;

/**
 * Converts `value` to a plain object flattening inherited enumerable string
 * keyed properties of `value` to own properties of the plain object.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {Object} Returns the converted plain object.
 * @example
 *
 * function Foo() {
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.assign({ 'a': 1 }, new Foo);
 * // => { 'a': 1, 'b': 2 }
 *
 * _.assign({ 'a': 1 }, _.toPlainObject(new Foo));
 * // => { 'a': 1, 'b': 2, 'c': 3 }
 */
function toPlainObject(value) {
  return _copyObject(value, keysIn_1(value));
}

var toPlainObject_1 = toPlainObject;

/**
 * A specialized version of `baseMerge` for arrays and objects which performs
 * deep merges and tracks traversed objects enabling objects with circular
 * references to be merged.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @param {string} key The key of the value to merge.
 * @param {number} srcIndex The index of `source`.
 * @param {Function} mergeFunc The function to merge values.
 * @param {Function} [customizer] The function to customize assigned values.
 * @param {Object} [stack] Tracks traversed source values and their merged
 *  counterparts.
 */
function baseMergeDeep(object, source, key, srcIndex, mergeFunc, customizer, stack) {
  var objValue = _safeGet(object, key),
      srcValue = _safeGet(source, key),
      stacked = stack.get(srcValue);

  if (stacked) {
    _assignMergeValue(object, key, stacked);
    return;
  }
  var newValue = customizer
    ? customizer(objValue, srcValue, (key + ''), object, source, stack)
    : undefined;

  var isCommon = newValue === undefined;

  if (isCommon) {
    var isArr = isArray_1(srcValue),
        isBuff = !isArr && isBuffer_1(srcValue),
        isTyped = !isArr && !isBuff && isTypedArray_1(srcValue);

    newValue = srcValue;
    if (isArr || isBuff || isTyped) {
      if (isArray_1(objValue)) {
        newValue = objValue;
      }
      else if (isArrayLikeObject_1(objValue)) {
        newValue = _copyArray(objValue);
      }
      else if (isBuff) {
        isCommon = false;
        newValue = _cloneBuffer(srcValue, true);
      }
      else if (isTyped) {
        isCommon = false;
        newValue = _cloneTypedArray(srcValue, true);
      }
      else {
        newValue = [];
      }
    }
    else if (isPlainObject_1(srcValue) || isArguments_1(srcValue)) {
      newValue = objValue;
      if (isArguments_1(objValue)) {
        newValue = toPlainObject_1(objValue);
      }
      else if (!isObject_1(objValue) || isFunction_1(objValue)) {
        newValue = _initCloneObject(srcValue);
      }
    }
    else {
      isCommon = false;
    }
  }
  if (isCommon) {
    // Recursively merge objects and arrays (susceptible to call stack limits).
    stack.set(srcValue, newValue);
    mergeFunc(newValue, srcValue, srcIndex, customizer, stack);
    stack['delete'](srcValue);
  }
  _assignMergeValue(object, key, newValue);
}

var _baseMergeDeep = baseMergeDeep;

/**
 * The base implementation of `_.merge` without support for multiple sources.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @param {number} srcIndex The index of `source`.
 * @param {Function} [customizer] The function to customize merged values.
 * @param {Object} [stack] Tracks traversed source values and their merged
 *  counterparts.
 */
function baseMerge(object, source, srcIndex, customizer, stack) {
  if (object === source) {
    return;
  }
  _baseFor(source, function(srcValue, key) {
    stack || (stack = new _Stack);
    if (isObject_1(srcValue)) {
      _baseMergeDeep(object, source, key, srcIndex, baseMerge, customizer, stack);
    }
    else {
      var newValue = customizer
        ? customizer(_safeGet(object, key), srcValue, (key + ''), object, source, stack)
        : undefined;

      if (newValue === undefined) {
        newValue = srcValue;
      }
      _assignMergeValue(object, key, newValue);
    }
  }, keysIn_1);
}

var _baseMerge = baseMerge;

/**
 * The base implementation of `_.rest` which doesn't validate or coerce arguments.
 *
 * @private
 * @param {Function} func The function to apply a rest parameter to.
 * @param {number} [start=func.length-1] The start position of the rest parameter.
 * @returns {Function} Returns the new function.
 */
function baseRest(func, start) {
  return _setToString(_overRest(func, start, identity_1), func + '');
}

var _baseRest = baseRest;

/**
 * Checks if the given arguments are from an iteratee call.
 *
 * @private
 * @param {*} value The potential iteratee value argument.
 * @param {*} index The potential iteratee index or key argument.
 * @param {*} object The potential iteratee object argument.
 * @returns {boolean} Returns `true` if the arguments are from an iteratee call,
 *  else `false`.
 */
function isIterateeCall(value, index, object) {
  if (!isObject_1(object)) {
    return false;
  }
  var type = typeof index;
  if (type == 'number'
        ? (isArrayLike_1(object) && _isIndex(index, object.length))
        : (type == 'string' && index in object)
      ) {
    return eq_1(object[index], value);
  }
  return false;
}

var _isIterateeCall = isIterateeCall;

/**
 * Creates a function like `_.assign`.
 *
 * @private
 * @param {Function} assigner The function to assign values.
 * @returns {Function} Returns the new assigner function.
 */
function createAssigner(assigner) {
  return _baseRest(function(object, sources) {
    var index = -1,
        length = sources.length,
        customizer = length > 1 ? sources[length - 1] : undefined,
        guard = length > 2 ? sources[2] : undefined;

    customizer = (assigner.length > 3 && typeof customizer == 'function')
      ? (length--, customizer)
      : undefined;

    if (guard && _isIterateeCall(sources[0], sources[1], guard)) {
      customizer = length < 3 ? undefined : customizer;
      length = 1;
    }
    object = Object(object);
    while (++index < length) {
      var source = sources[index];
      if (source) {
        assigner(object, source, index, customizer);
      }
    }
    return object;
  });
}

var _createAssigner = createAssigner;

/**
 * This method is like `_.assign` except that it recursively merges own and
 * inherited enumerable string keyed properties of source objects into the
 * destination object. Source properties that resolve to `undefined` are
 * skipped if a destination value exists. Array and plain object properties
 * are merged recursively. Other objects and value types are overridden by
 * assignment. Source objects are applied from left to right. Subsequent
 * sources overwrite property assignments of previous sources.
 *
 * **Note:** This method mutates `object`.
 *
 * @static
 * @memberOf _
 * @since 0.5.0
 * @category Object
 * @param {Object} object The destination object.
 * @param {...Object} [sources] The source objects.
 * @returns {Object} Returns `object`.
 * @example
 *
 * var object = {
 *   'a': [{ 'b': 2 }, { 'd': 4 }]
 * };
 *
 * var other = {
 *   'a': [{ 'c': 3 }, { 'e': 5 }]
 * };
 *
 * _.merge(object, other);
 * // => { 'a': [{ 'b': 2, 'c': 3 }, { 'd': 4, 'e': 5 }] }
 */
var merge = _createAssigner(function(object, source, srcIndex) {
  _baseMerge(object, source, srcIndex);
});

var merge_1 = merge;

/* istanbul ignore next */
var defaultFunc = function defaultFunc() {
  return void 0;
};

var defaultGridAdaptorRes = {
  queries: {
    datasets: [],
    pageNumber: 1,
    pageSize: 20,
    total: 0,
    loading: false,
    sortBy: undefined,
    sortType: '',
    selectedRowKeys: []
  },
  setPage: defaultFunc,
  setFilter: defaultFunc
};
var adaptorConstructor$1 = function adaptorConstructor(props) {
  var listState = get_1(props, 'list.state', {});
  var listGState = get_1(props, 'list.globalState', {});
  var listActions = get_1(props, 'list.action', {});
  var pageNumber = listState.page,
      loading = listState.loading,
      total = listState.total,
      dataset = listState.dataset,
      filter = listState.filter;

  var _ref = filter || {},
      pageSize = _ref.pageSize,
      sortBy = _ref.sortBy,
      sortType = _ref.sortType;

  var queries = merge_1({}, defaultGridAdaptorRes.queries, {
    pageNumber: pageNumber,
    pageSize: pageSize,
    loading: loading,
    total: total,
    datasets: dataset,
    selectedRowKeys: listGState.selectedRowKeys || [],
    sortType: sortType,
    sortBy: sortBy
  });
  return {
    queries: queries,
    setPage: listActions.setPage || defaultGridAdaptorRes.setPage,
    setFilter: listActions.setFilter || defaultGridAdaptorRes.setFilter
  };
};
var CUSTOM_COLUMNS_KEY = '$$EASY_GRID_CUSTOM_COLUMNS';
var CUSTOM_COLUMNS_DIALOG_ID = 'easyGridCustomColumns';

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
    var _React$useState = React__default.useState(false),
        _React$useState2 = _slicedToArray(_React$useState, 2),
        loadingState = _React$useState2[0],
        setLoadingState = _React$useState2[1];

    var handleSubmit = React__default.useCallback(function (data) {
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
    return React__default.createElement(Child, {
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
    children: React__default.createElement(DialogContent, null),
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
  return React__default.createElement("div", {
    className: "dialog-r-body"
  }, children);
};
var DialogFooter = function DialogFooter(_ref2) {
  var children = _ref2.children;
  return React__default.createElement("div", {
    className: "dialog-r-footer"
  }, children);
};

var Dialog = {
  openDialog: openDialog,
  DialogBody: DialogBody,
  DialogFooter: DialogFooter
};

var openDialog$1 = Dialog.openDialog,
    DialogBody$1 = Dialog.DialogBody,
    DialogFooter$1 = Dialog.DialogFooter;
var CheckboxGroup$1 = zent.Checkbox.Group;

var ModifyDisplayColumns = function ModifyDisplayColumns(props) {
  var _props$data = props.data,
      alternativeColumnNames = _props$data.alternativeColumnNames,
      displayColumnIdxList = _props$data.displayColumnIdxList;

  var _React$useState = React__default.useState(alternativeColumnNames.map(function (_, idx) {
    return idx;
  })),
      _React$useState2 = _slicedToArray(_React$useState, 1),
      fullDisplayList = _React$useState2[0];

  var _React$useState3 = React__default.useState(displayColumnIdxList),
      _React$useState4 = _slicedToArray(_React$useState3, 2),
      checkedList = _React$useState4[0],
      setCheckedList = _React$useState4[1];

  var handleClick = React__default.useCallback(function () {
    props.dialogref.submit(checkedList);
  }, [checkedList, props.dialogref]);
  var handleSelectAll = React__default.useCallback(function (e) {
    if (e.target.checked) {
      setCheckedList(fullDisplayList);
    } else {
      setCheckedList([]);
    }
  }, [fullDisplayList]);

  var _React$useMemo = React__default.useMemo(function () {
    return [checkedList.length === alternativeColumnNames.length, checkedList.length > 0 && checkedList.length < alternativeColumnNames.length];
  }, [alternativeColumnNames.length, checkedList.length]),
      _React$useMemo2 = _slicedToArray(_React$useMemo, 2),
      isCheckedAll = _React$useMemo2[0],
      isIndeterminate = _React$useMemo2[1];

  return React__default.createElement("div", {
    "data-testid": "custom-columns-dialog",
    className: "custom-columns__container"
  }, React__default.createElement(DialogBody$1, null, React__default.createElement("section", null, React__default.createElement(zent.Checkbox, {
    checked: isCheckedAll,
    indeterminate: isIndeterminate,
    onChange: handleSelectAll
  }, "\u5168\u9009")), React__default.createElement("section", {
    className: "custom-columns__item-box"
  }, React__default.createElement(CheckboxGroup$1, {
    value: checkedList,
    onChange: setCheckedList
  }, alternativeColumnNames.map(function (label, idx) {
    return React__default.createElement("div", {
      className: "custom-columns__item",
      key: idx
    }, React__default.createElement(zent.Checkbox, {
      value: idx
    }, label));
  })))), React__default.createElement(DialogFooter$1, null, React__default.createElement(zent.Button, {
    onClick: props.dialogref.close
  }, "\u53D6\u6D88"), React__default.createElement(zent.Button, {
    type: "primary",
    onClick: handleClick
  }, "\u786E\u5B9A")));
};

var openModifyDisplayColumns = function openModifyDisplayColumns(data) {
  return openDialog$1(ModifyDisplayColumns, {
    title: data.title,
    data: data
  });
};

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
var useLayoutEffect = isSSR ? useHackEffect : React__default.useLayoutEffect;
var useCallback = isSSR ? useHackCallback : React__default.useCallback; // 通用的ssr函数

var supportStorage = localStorage !== undefined;
var useCustomColumns = function useCustomColumns(params) {
  var columns = params.columns,
      customColumns = params.customColumns,
      customColumnsCacheKey = params.customColumnsCacheKey,
      _params$customColumns = params.customColumnsTriggerText,
      customColumnsTriggerText = _params$customColumns === void 0 ? '配置表头' : _params$customColumns,
      _params$customColumns2 = params.customColumnsDialogTitle,
      customColumnsDialogTitle = _params$customColumns2 === void 0 ? '自定义表头' : _params$customColumns2,
      ref = params.ref;

  var _React$useState = React__default.useState(false),
      _React$useState2 = _slicedToArray(_React$useState, 2),
      renderReady = _React$useState2[0],
      setRenderReady = _React$useState2[1];

  var _React$useState3 = React__default.useState(getDisplayIdxListFromStorage(customColumnsCacheKey)),
      _React$useState4 = _slicedToArray(_React$useState3, 2),
      displayIdxList = _React$useState4[0],
      setDisplayIdxList = _React$useState4[1];

  var filterColumns = React__default.useMemo(function () {
    var tempIdx = 0;
    return supportStorage ? columns.filter(function (column) {
      var _column$forbidCustom = column.forbidCustom,
          forbidCustom = _column$forbidCustom === void 0 ? false : _column$forbidCustom;
      if (forbidCustom) return true;
      if (!customColumns || !hasCustom(customColumnsCacheKey)) return true;
      return displayIdxList.includes(tempIdx++);
    }) : columns;
  }, [columns, customColumns, customColumnsCacheKey, displayIdxList]);
  var handleClickTrigger = React__default.useCallback(function () {
    var altColumnNames = columns.filter(function (column) {
      return !column.forbidCustom && (column.title !== undefined || column.altTitle !== undefined);
    }).map(function (column) {
      return column.altTitle || column.title;
    });
    openModifyDisplayColumns({
      title: customColumnsDialogTitle,
      alternativeColumnNames: altColumnNames,
      displayColumnIdxList: !hasCustom(customColumnsCacheKey) ? altColumnNames.map(function (_, idx) {
        return idx;
      }) : displayIdxList
    }).afterClosed().then(function (displayList) {
      overrideDisplayIdxList(displayList, customColumnsCacheKey);
      setDisplayIdxList(displayList);
    })["catch"](function () {
      /** do nothing */
    });
  }, [columns, customColumnsCacheKey, customColumnsDialogTitle, displayIdxList]);
  var CustomColumnsTrigger = React__default.useMemo(function () {
    if (renderReady) {
      if (customColumns && ref) {
        var hasBatchHeader = ref.querySelector('.zent-grid-batch') !== null;
        var injectNode = ref.querySelector("#".concat(CUSTOM_COLUMNS_DIALOG_ID));

        if (!hasBatchHeader) {
          injectNode.classList.add('no-batch-header');
        }

        return ReactDOM.createPortal(React__default.createElement("div", {
          className: "easy-grid__custom-columns"
        }, React__default.createElement("a", {
          "data-testid": "custom-columns",
          className: "easy-grid__custom-columns_trigger",
          onClick: handleClickTrigger
        }, customColumnsTriggerText)), injectNode);
      }
    }

    return null;
  }, [customColumns, customColumnsTriggerText, handleClickTrigger, ref, renderReady]);
  useLayoutEffect(function () {
    setRenderReady(true);
  }, []);
  return {
    displayColumns: filterColumns,
    CustomColumnsTrigger: CustomColumnsTrigger
  };
};

function getCurrentStorageKey(cacheKey) {
  if (cacheKey) {
    return CUSTOM_COLUMNS_KEY + '$' + cacheKey;
  } // 不可能没有页面没有url吧


  var PAGE_NAME = location.href.match(/\/([\w_-]+)/g).pop().replace(/^\//, '');
  return CUSTOM_COLUMNS_KEY + '$' + PAGE_NAME;
}

function hasCustom(cacheKey) {
  return localStorage.getItem(getCurrentStorageKey(cacheKey)) !== null;
}

function getDisplayIdxListFromStorage(cacheKey) {
  var idxListString = localStorage.getItem(getCurrentStorageKey(cacheKey));

  if (idxListString) {
    return idxListString.split('::').map(Number);
  }

  return [];
}

function overrideDisplayIdxList(idxList, cacheKey) {
  localStorage.setItem(getCurrentStorageKey(cacheKey), idxList.join('::'));
}

var useAdaptionScrollWidth = function useAdaptionScrollWidth(params) {
  var gridRef = params.gridRef,
      enableScroll = params.enableScroll,
      passiveScroll = params.passiveScroll,
      _params$columnWidthLi = params.columnWidthList,
      columnWidthList = _params$columnWidthLi === void 0 ? [] : _params$columnWidthLi,
      columnSize = params.columnSize;

  var _React$useState = React__default.useState(0),
      _React$useState2 = _slicedToArray(_React$useState, 2),
      minWidth = _React$useState2[0],
      setMinWidth = _React$useState2[1];

  var maxWidth = React__default.useMemo(function () {
    return get_1(passiveScroll, 'x', 0);
  }, [passiveScroll]);
  var curScrollWidth = React__default.useMemo(function () {
    var columnWidthSize = columnWidthList.length;

    if (columnWidthSize && columnSize === columnWidthSize) {
      /* istanbul ignore next */
      var _curScrollWidth = columnWidthList.reduce(function (prevV, width) {
        return prevV + width;
      }, 0);

      if (YZ_NODE_ENV !== 'prod' && _curScrollWidth > maxWidth) {
        console.warn("\u8BF7\u6CE8\u610F\uFF0C\u4F60\u8BBE\u7F6E\u7684scroll\u7684\u503C\u5C0F\u4E8E\u5B9E\u9645\u8868\u683C\u53EF\u80FD\u5C55\u793A\u7684\u5BBD\u5EA6\uFF0C\u53EF\u80FD\u4F1A\u5BFC\u81F4\u5185\u5BB9\u5C55\u793A\u4E0D\u8DB3\n  \u8BBE\u7F6E\u7684\u503C\u4E3A\uFF1A".concat(maxWidth, "\n  \u5F53\u524D\u7684\u503C\u4E3A\uFF1A").concat(_curScrollWidth));
      }

      return _curScrollWidth;
    }

    return maxWidth;
  }, [columnSize, columnWidthList, maxWidth]);
  useLayoutEffect(function () {
    if (enableScroll && gridRef.current) {
      setMinWidth(gridRef.current.offsetWidth);
    } // eslint-disable-next-line react-hooks/exhaustive-deps

  }, []);
  var memoScrollX = React__default.useMemo(function () {
    return Math.max(curScrollWidth, minWidth);
  }, [curScrollWidth, minWidth]);
  if (!enableScroll) return {};
  return {
    scroll: {
      x: memoScrollX,
      y: passiveScroll.y
    }
  };
};

var defaultSelectConfig = {
  selectType: 'multiple'
};

function getInitSelectConfig(selection) {
  if (typeof selection === 'boolean' && selection === true) return defaultSelectConfig;else if (typeof selection === 'string') {
    return {
      selectType: selection || 'multiple'
    };
  } else if (_typeof(selection) === 'object') {
    return _objectSpread2({
      selectType: 'multiple'
    }, selection);
  }
  return null;
}

var useSelectConfig = function useSelectConfig(params) {
  var selectConfig = React__default.useMemo(function () {
    return getInitSelectConfig(params);
  }, [params]);
  return selectConfig;
};

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

var RadioContext = React__default.createContext({
  selected: undefined,
  setSelect: function setSelect() {},
  getRadioProps: function getRadioProps() {
    return {};
  }
});
RadioContext.displayName = 'EasyGridRadioContext';
var RadioContextProvider = function RadioContextProvider(props) {
  var selectedRowKey = props.selectedRowKey,
      handleSelect = props.handleSelect,
      getRadioProps = props.getRadioProps;

  var _React$useState = React__default.useState(selectedRowKey),
      _React$useState2 = _slicedToArray(_React$useState, 2),
      selected = _React$useState2[0],
      setSelected = _React$useState2[1];

  var setSelect = React__default.useCallback(function (rowKey, row) {
    // 处理onSelect返回布尔值的情况
    var handleSelectSideEffectRes = handleSelect && handleSelect([rowKey], [row], row);
    if (!isNil_1(handleSelectSideEffectRes) && !handleSelectSideEffectRes) return;
    setSelected(rowKey);
  }, [handleSelect]);
  return React__default.createElement(RadioContext.Provider, {
    value: {
      selected: selected,
      setSelect: setSelect,
      getRadioProps: getRadioProps
    }
  }, props.children);
};

var EasyGridRadio = function EasyGridRadio(props) {
  var rowKey = props.rowKey,
      row = props.row;
  var radioCtx = React__default.useContext(RadioContext);
  var identityId = React__default.useMemo(function () {
    return get_1(row, rowKey ||
    /* istanbul ignore next */
    'id');
  }, [row, rowKey]);
  var isChecked = React__default.useMemo(function () {
    return identityId === radioCtx.selected;
  }, [identityId, radioCtx.selected]);
  var isDisabled = React__default.useMemo(function () {
    return get_1(radioCtx.getRadioProps(row), 'disabled', false);
  }, [radioCtx, row]);
  var handleChange = React__default.useCallback(function () {
    radioCtx.setSelect(identityId, row);
  }, [radioCtx, identityId, row]);
  return React__default.createElement("label", {
    className: "easy-grid__radio",
    "data-testid": row[rowKey]
  }, React__default.createElement(zent.Radio, {
    checked: isChecked,
    disabled: isDisabled,
    onChange: handleChange
  }));
};
var getRadioConfig = function getRadioConfig(params) {
  var isFixed = params.isFixed,
      rowKey = params.rowKey;
  var fixedProps = isFixed ? {
    fixed: 'left'
  } :
  /* istanbul ignore next */
  {};
  return _objectSpread2({
    name: '__internal_grid_radio__',
    title: React__default.createElement("div", {
      className: "easy-grid__radio-title"
    }),
    width: '44px',
    bodyRender: function bodyRender(rowData) {
      return React__default.createElement(EasyGridRadio, {
        row: rowData,
        rowKey: rowKey
      });
    }
  }, fixedProps);
};

var HeaderHelp = function HeaderHelp(props) {
  var title = props.title,
      headerHelp = props.headerHelp,
      className = props.className,
      _props$position = props.position,
      position = _props$position === void 0 ? 'top-center' : _props$position,
      _props$iconType = props.iconType,
      iconType = _props$iconType === void 0 ? 'help-circle' : _props$iconType;
  return React__default.createElement("div", {
    className: cx('header-help', className)
  }, React__default.createElement("span", {
    className: "header-help-title"
  }, title), React__default.createElement(zent.Pop, {
    trigger: "hover",
    position: position,
    content: headerHelp
  }, React__default.createElement(zent.Icon, {
    className: "header-help-icon",
    type: iconType
  })));
};

function defaultFormatter(data) {
  return data;
}

var getDecoratedColumns = function getDecoratedColumns(originColumns) {
  var temp = [];
  var hasLeftFixedCol = false;
  originColumns.forEach(function (column) {
    var bodyRender = column.bodyRender,
        fixed = column.fixed,
        _column$formatter = column.formatter,
        formatter = _column$formatter === void 0 ? defaultFormatter : _column$formatter,
        headerHelp = column.headerHelp,
        helpPopPosition = column.helpPopPosition,
        name = column.name,
        title = column.title,
        _column$visible = column.visible,
        visible = _column$visible === void 0 ? true : _column$visible;
    if (!hasLeftFixedCol && fixed === 'left') hasLeftFixedCol = true;

    if (visible) {
      var Comp = headerHelp ? React__default.createElement(HeaderHelp, {
        title: title,
        headerHelp: headerHelp,
        position: helpPopPosition
      }) : title;
      var wrappedBodyRender = bodyRender ? {
        bodyRender: bodyRender
      } : {};

      if (!bodyRender) {
        wrappedBodyRender = {
          bodyRender: function bodyRender(data) {
            var originData = name ? get_1(data, name, '-') : data;

            if (originData !== '-') {
              return formatter(originData);
            }

            return originData;
          }
        };
      }

      temp.push(_objectSpread2({}, column, {
        title: Comp
      }, wrappedBodyRender));
    }
  });
  return {
    columns: temp,
    params: {
      hasLeftFixedCol: hasLeftFixedCol
    }
  };
};

var EasyGridWithRef = React__default.forwardRef(function EasyGrid(props, ref) {
  var columns = props.columns,
      easySelection = props.easySelection,
      passiveDatasets = props.datasets,
      passiveSelection = props.selection,
      passivePageNumber = props.pageNumber,
      passivePageSize = props.pageSize,
      pageSizeOptions = props.pageSizeOptions,
      passiveTotal = props.total,
      passiveSortBy = props.sortBy,
      passiveSortType = props.sortType,
      emptyLabel = props.emptyLabel,
      emptyCreateLabel = props.emptyCreateLabel,
      _props$customColumns = props.customColumns,
      customColumns = _props$customColumns === void 0 ? false : _props$customColumns,
      customColumnsCacheKey = props.customColumnsCacheKey,
      customColumnsTriggerText = props.customColumnsTriggerText,
      customColumnsDialogTitle = props.customColumnsDialogTitle,
      scroll = props.scroll,
      _props$rowKey = props.rowKey,
      rowKey = _props$rowKey === void 0 ? 'id' : _props$rowKey,
      onChange = props.onChange,
      restGridProps = _objectWithoutProperties(props, ["columns", "easySelection", "datasets", "selection", "pageNumber", "pageSize", "pageSizeOptions", "total", "sortBy", "sortType", "emptyLabel", "emptyCreateLabel", "customColumns", "customColumnsCacheKey", "customColumnsTriggerText", "customColumnsDialogTitle", "scroll", "rowKey", "onChange"]);

  var gridRef = React__default.useRef(null);

  var _React$useMemo = React__default.useMemo(function () {
    return adaptorConstructor$1(props);
  }, [props]),
      adaptorQueries = _React$useMemo.queries,
      setFilter = _React$useMemo.setFilter; // 需要响应一下GState中的selectedRowKeys的变化


  var listCtxSelectedKeys = React__default.useMemo(function () {
    return adaptorQueries.selectedRowKeys;
  }, [adaptorQueries.selectedRowKeys]);
  var selectConfig = useSelectConfig(passiveSelection || easySelection); // 修改成只在初始化的时候向URL获取一次已选项

  var _React$useState = React__default.useState(function () {
    return get_1(selectConfig, 'selectedRowKeys');
  }),
      _React$useState2 = _slicedToArray(_React$useState, 2),
      selectedRowKeys = _React$useState2[0],
      setSelectedRowKeys = _React$useState2[1];

  React__default.useImperativeHandle(ref, function () {
    return {
      setSelectedRowKeys: setSelectedRowKeys
    };
  }); // 不管有没有开启自定义表头的开关，都走一遍过滤

  var _useCustomColumns = useCustomColumns({
    columns: columns,
    customColumns: customColumns,
    customColumnsCacheKey: customColumnsCacheKey,
    customColumnsTriggerText: customColumnsTriggerText,
    customColumnsDialogTitle: customColumnsDialogTitle,
    ref: gridRef.current
  }),
      displayColumns = _useCustomColumns.displayColumns,
      CustomColumnsTrigger = _useCustomColumns.CustomColumnsTrigger;

  var wrappedColumns = React__default.useMemo(function () {
    var _getDecoratedColumns = getDecoratedColumns(displayColumns),
        decoratedCols = _getDecoratedColumns.columns,
        params = _getDecoratedColumns.params;

    var hasLeftFixedCol = params.hasLeftFixedCol;

    if (selectConfig && selectConfig.selectType === 'single') {
      // 渲染单选框
      decoratedCols.unshift(getRadioConfig({
        rowKey: rowKey,
        isFixed: hasLeftFixedCol
      }));
    }

    return decoratedCols;
  }, [displayColumns, rowKey, selectConfig]);
  var columnWidthList = React__default.useMemo(function () {
    return wrappedColumns.map(function (column) {
      var matchRes = String(column.width).match(/^(\d+)/);
      return Number(get_1(matchRes, '[1]', 0));
    });
  }, [wrappedColumns]);
  var scrollProps = useAdaptionScrollWidth({
    gridRef: gridRef,
    enableScroll: scroll !== undefined,
    passiveScroll: scroll,
    columnSize: columnWidthList.filter(function (size) {
      return size > 0;
    }).length,
    columnWidthList: columnWidthList
  });
  var handleSelect = React__default.useCallback(function (newSelectedRowKeys, selectedRows, changedRow) {
    if (selectConfig) {
      var passiveSelectHandler = selectConfig.onSelect;
      var canSelect = passiveSelectHandler ? passiveSelectHandler(newSelectedRowKeys, selectedRows, changedRow) : true;

      if (canSelect) {
        // 这里没有用，zent/Grid的selectedRowKeys是非受控的模式运行，垃圾玩意
        setSelectedRowKeys(newSelectedRowKeys);
      } else {
        /* istanbul ignore next */
        if (selectConfig.selectType === 'multiple') {
          // 如果是多选模式，强制刷新一下备选项
          setSelectedRowKeys(function (prev) {
            return _toConsumableArray(prev || []);
          });
        }
      }
    }

    return true;
  }, [selectConfig]);
  var handleGetCheckboxProps = React__default.useCallback(function (data) {
    if (selectConfig) {
      var passiveCheckboxHandler = selectConfig.getCheckboxProps;

      if (passiveCheckboxHandler) {
        return passiveCheckboxHandler(data);
      }
    }

    return {};
  }, [selectConfig]);
  var handleChange = React__default.useCallback(function (next) {
    onChange && onChange(next);
    var nextPageNumber = next.current,
        nextPageSize = next.pageSize,
        nextSortBy = next.sortBy,
        nextSortType = next.sortType;
    var nextFilter = {
      page: nextPageNumber,
      pageSize: nextPageSize,
      sortType: nextSortType,
      sortBy: nextSortBy
    };
    setFilter(nextFilter);
  }, [onChange, setFilter]);
  var pageInfo = React__default.useMemo(function () {
    var pageNumber = adaptorQueries.pageNumber,
        pageSize = adaptorQueries.pageSize,
        total = adaptorQueries.total;
    return {
      current: passivePageNumber || pageNumber,
      pageSize: passivePageSize || pageSize,
      total: passiveTotal || total,
      pageSizeOptions: pageSizeOptions
    };
  }, [adaptorQueries, pageSizeOptions, passivePageNumber, passivePageSize, passiveTotal]);
  var EmptyLabel = React__default.useMemo(function () {
    if (reactIs.isElement(emptyLabel)) return emptyLabel;
    return React__default.createElement("div", {
      className: "easy-list__empty-label"
    }, React__default.createElement("span", null, "\u6CA1\u6709\u66F4\u591A\u6570\u636E\u4E86"), reactIs.isElement(emptyCreateLabel) && emptyCreateLabel);
  }, [emptyCreateLabel, emptyLabel]);
  var datasets = React__default.useMemo(function () {
    return passiveDatasets || adaptorQueries.datasets;
  }, [adaptorQueries.datasets, passiveDatasets]);
  var selectSettings = React__default.useMemo(function () {
    if (selectConfig && selectConfig.selectType === 'multiple') {
      return {
        selection: {
          selectedRowKeys: selectedRowKeys || listCtxSelectedKeys,
          onSelect: handleSelect,
          getCheckboxProps: handleGetCheckboxProps
        }
      };
    }

    return {};
  }, [handleGetCheckboxProps, handleSelect, listCtxSelectedKeys, selectConfig, selectedRowKeys]);
  var selectConfigAdaptor = React__default.useMemo(function () {
    switch (selectConfig && selectConfig.selectType) {
      case 'single':
        return {
          selectedRowKey: get_1(selectConfig, 'selectedRowKeys[0]'),
          handleSelect: get_1(selectConfig, 'onSelect')
        };

      case 'multiple':
      default:
        return {
          selectedRowKey: get_1(selectSettings, 'selection.selectedRowKeys[0]'),
          handleSelect: get_1(selectSettings, 'selection.onSelect')
        };
    }
  }, [selectConfig, selectSettings]);
  return React__default.createElement("div", {
    "data-testid": "easy-grid",
    ref: gridRef,
    className: "easy-grid-container"
  }, React__default.createElement("div", {
    id: CUSTOM_COLUMNS_DIALOG_ID
  }, CustomColumnsTrigger), React__default.createElement(RadioContextProvider, _extends({}, selectConfigAdaptor, {
    getRadioProps: handleGetCheckboxProps
  }), React__default.createElement(zent.Grid, _extends({}, restGridProps, scrollProps, selectSettings, {
    rowKey: rowKey,
    columns: wrappedColumns,
    datasets: datasets,
    emptyLabel: EmptyLabel,
    onChange: handleChange,
    pageInfo: pageInfo,
    sortBy: passiveSortBy || adaptorQueries.sortBy,
    sortType: passiveSortType || adaptorQueries.sortType,
    loading: restGridProps.loading || adaptorQueries.loading
  }))));
});
EasyGridWithRef.defaultProps = {
  pageable: true
};

var getImageSize = function getImageSize(size) {
  return size ? "".concat(size, "px") : '60px';
};

var getClampedTitle = function getClampedTitle(text) {
  return React__default.createElement(zent.ClampLines, {
    lines: 2,
    popWidth: 240,
    text: text
  });
};

var DEFAULT_IMG = '//img.yzcdn.cn/public_files/2017/08/30/63a8d28bce4ca2e5d081e1e69926288e.jpg';

var GoodsBriefCard = function GoodsBriefCard(_ref) {
  var title = _ref.title,
      price = _ref.price,
      _ref$image = _ref.image,
      image = _ref$image === void 0 ? DEFAULT_IMG : _ref$image,
      imageSize = _ref.imageSize,
      image2x = _ref.image2x,
      url = _ref.url,
      label = _ref.label,
      labelTagTheme = _ref.labelTagTheme,
      labelOutline = _ref.labelOutline,
      labelProps = _ref.labelProps,
      className = _ref.className;
  var imgStyle = {
    width: getImageSize(imageSize),
    height: getImageSize(imageSize)
  };
  return React__default.createElement("div", {
    "data-testid": "easy-grid-goodsCard",
    className: cx('esg-goods-wrapper', className)
  }, React__default.createElement("img", {
    className: "esg-goods__img",
    src: image,
    srcSet: image2x,
    style: imgStyle
  }), React__default.createElement("div", {
    className: "esg-goods__inner"
  }, React__default.createElement("div", {
    className: "brief-title"
  }, url ? React__default.createElement("a", {
    target: "_blank",
    rel: "noopener noreferrer",
    href: url
  }, getClampedTitle(title)) : getClampedTitle(title)), React__default.createElement("div", {
    className: "goods-info-wrap"
  }, label && React__default.createElement(zent.Tag, _extends({}, labelProps, {
    theme: labelTagTheme,
    outline: labelOutline
  }), label), React__default.createElement("span", {
    className: "brief-price"
  }, price))));
};

var QuickEditInput = function QuickEditInput(props) {
  var type = props.type,
      error = props.error,
      onCancel = props.onCancel,
      onConfirm = props.onConfirm,
      formatter = props.formatter,
      pressEnter = props.pressEnter,
      cancelText = props.cancelText,
      confirmText = props.confirmText,
      placeholder = props.placeholder,
      onValueChange = props.onValueChange,
      confirmLoading = props.confirmLoading,
      _props$inputProps = props.inputProps,
      inputProps = _props$inputProps === void 0 ? {} : _props$inputProps,
      _props$defaultValue = props.defaultValue,
      defaultValue = _props$defaultValue === void 0 ? '' : _props$defaultValue;

  var _React$useState = React__default.useState(defaultValue),
      _React$useState2 = _slicedToArray(_React$useState, 2),
      text = _React$useState2[0],
      setText = _React$useState2[1];

  var handleConfirm = React__default.useCallback(function () {
    var TEXT = formatter ? formatter(text) : text;
    onConfirm(TEXT);
  }, [text, onConfirm, formatter]);
  var handlePressEnter = React__default.useCallback(function () {
    return pressEnter ? handleConfirm : function () {
      return void 0;
    };
  }, [pressEnter, handleConfirm]);
  var handleValueChange = React__default.useCallback(function (evt) {
    var value = evt.target.value;
    setText(value);
    onValueChange(value);
  }, [onValueChange]);
  return React__default.createElement("div", {
    "data-testid": "easy-grid-quickEdit",
    className: cx('easy-grid__quickEdit-input', {
      'has-error': Boolean(error)
    })
  }, React__default.createElement("div", {
    className: "line"
  }, React__default.createElement(zent.Input, _extends({}, inputProps, {
    autoFocus: true,
    type: type,
    value: text,
    placeholder: placeholder,
    onPressEnter: handlePressEnter,
    onChange: handleValueChange
  })), React__default.createElement("div", {
    className: "easy-grid__quickEdit-actions"
  }, React__default.createElement(zent.Button, {
    outline: true,
    onClick: handleConfirm,
    loading: confirmLoading,
    "data-testid": "easy-grid-quickEdit-confirm",
    className: "easy-grid__quickEdit-action"
  }, confirmText), React__default.createElement("span", {
    className: "easy-grid__quickEdit-actions-split"
  }, "|"), React__default.createElement(zent.Button, {
    outline: true,
    bordered: false,
    onClick: onCancel,
    disabled: confirmLoading,
    "data-testid": "easy-grid-quickEdit-cancel",
    className: "easy-grid__quickEdit-action"
  }, cancelText))), Boolean(error) && React__default.createElement("div", {
    className: "error-message"
  }, error));
};

var QuickEdit = function QuickEdit(props) {
  var pos = props.pos,
      data = props.data,
      name = props.name,
      onCancel = props.onCancel,
      required = props.required,
      onConfirm = props.onConfirm,
      NodeRender = props.NodeRender,
      validators = props.validators,
      defaultValue = props.defaultValue,
      _props$icon = props.icon,
      icon = _props$icon === void 0 ? 'edit-o' : _props$icon;

  var _React$useState3 = React__default.useState(false),
      _React$useState4 = _slicedToArray(_React$useState3, 2),
      popVisible = _React$useState4[0],
      setStatus = _React$useState4[1];

  var _React$useState5 = React__default.useState(),
      _React$useState6 = _slicedToArray(_React$useState5, 2),
      error = _React$useState6[0],
      setError = _React$useState6[1];

  var _React$useState7 = React__default.useState(false),
      _React$useState8 = _slicedToArray(_React$useState7, 2),
      confirmLoading = _React$useState8[0],
      setConfirmLoading = _React$useState8[1];

  var popRef = React__default.useRef();
  var cls = React__default.useMemo(function () {
    if (popVisible) {
      return 'easy-grid__quickEdit-icon visible';
    }

    return 'easy-grid__quickEdit-icon';
  }, [popVisible]);
  var Node = React__default.useMemo(function () {
    if (typeof NodeRender === 'string') {
      return get_1(data, NodeRender);
    }

    return NodeRender(data, pos, name);
  }, [NodeRender, data, name, pos]);
  var INIT_VALUE = React__default.useMemo(function () {
    if (defaultValue) {
      /* istanbul ignore next */
      if (typeof defaultValue === 'function') {
        return defaultValue(data, name);
      }

      return defaultValue;
    }

    return get_1(data, name);
  }, [data, name, defaultValue]);
  var handleVisibleChange = React__default.useCallback(function (nextState) {
    setError('');
    setStatus(function (prevStatus) {
      return nextState !== undefined ? nextState : !prevStatus;
    });
  }, []);
  var handleConfirm = React__default.useCallback(function (value) {
    var _validators = validators || [];

    if (required) {
      _validators.unshift(zent.Validators.required(typeof required === 'string' ? required : '输入不能为空'));
    }

    if (_validators.length) {
      var isInvalidate = _validators.some(function (validator) {
        var validateResult = validator(value, {});

        if (validateResult) {
          setError(validateResult.message);
          return true;
        }

        return false;
      });

      if (isInvalidate) return;
    }

    new Promise(function (resolve) {
      if (onConfirm) {
        setConfirmLoading(true);
        var promiseCB = onConfirm(value, data);

        if (promiseCB && promiseCB instanceof Promise) {
          promiseCB.then(resolve);
          return;
        }
      }

      resolve(true);
    }).then(function (res) {
      if (res) {
        handleVisibleChange(false);
      }
    })["finally"](function () {
      setConfirmLoading(false);
    });
  }, [data, handleVisibleChange, onConfirm, required, validators]);
  var passiveProps = React__default.useMemo(function () {
    return _objectSpread2({}, props, {
      pressEnter: props.pressEnter || false,
      cancelText: props.cancelText || '取消',
      confirmText: props.confirmText || '确定',
      defaultValue: INIT_VALUE,
      onConfirm: handleConfirm,
      onCancel: function (_onCancel) {
        function onCancel() {
          return _onCancel.apply(this, arguments);
        }

        onCancel.toString = function () {
          return _onCancel.toString();
        };

        return onCancel;
      }(function () {
        handleVisibleChange();
        onCancel && onCancel();
      })
    });
  }, [INIT_VALUE, handleConfirm, handleVisibleChange, onCancel, props]);
  var handleValueChange = React__default.useCallback(function () {
    return setError('');
  }, []);
  var CONTENT = React__default.useMemo(function () {
    return React__default.createElement(QuickEditInput, _extends({}, passiveProps, {
      error: error,
      confirmLoading: confirmLoading,
      onValueChange: handleValueChange
    }));
  }, [passiveProps, confirmLoading, error, handleValueChange]); // 设置error之后重新设置pop的位置

  useLayoutEffect(function () {
    popRef.current && popRef.current.adjustPosition();
  }, [error]);
  return React__default.createElement("span", {
    className: "easy-grid__quickEdit-container"
  }, Node, React__default.createElement(zent.Pop, {
    trigger: "click",
    visible: popVisible,
    ref: function ref(pop) {
      return popRef.current = pop;
    },
    onVisibleChange: handleVisibleChange,
    content: CONTENT
  }, React__default.createElement(zent.Icon, {
    type: icon,
    className: cls,
    onClick: function onClick() {
      return setStatus(true);
    }
  })));
};

function quickEdit(NodeRender, quickEditOpts) {
  return function QuickEditRender(data, pos, name) {
    var _name = name || '';

    if (typeof NodeRender === 'string') {
      _name = NodeRender;
    }

    return React__default.createElement(QuickEdit, _extends({}, quickEditOpts, {
      name: _name,
      data: data,
      pos: pos,
      NodeRender: NodeRender
    }));
  };
}

/**
 * The base implementation of `_.set`.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {Array|string} path The path of the property to set.
 * @param {*} value The value to set.
 * @param {Function} [customizer] The function to customize path creation.
 * @returns {Object} Returns `object`.
 */
function baseSet(object, path, value, customizer) {
  if (!isObject_1(object)) {
    return object;
  }
  path = _castPath(path, object);

  var index = -1,
      length = path.length,
      lastIndex = length - 1,
      nested = object;

  while (nested != null && ++index < length) {
    var key = _toKey(path[index]),
        newValue = value;

    if (index != lastIndex) {
      var objValue = nested[key];
      newValue = customizer ? customizer(objValue, key, nested) : undefined;
      if (newValue === undefined) {
        newValue = isObject_1(objValue)
          ? objValue
          : (_isIndex(path[index + 1]) ? [] : {});
      }
    }
    _assignValue(nested, key, newValue);
    nested = nested[key];
  }
  return object;
}

var _baseSet = baseSet;

/**
 * The base implementation of  `_.pickBy` without support for iteratee shorthands.
 *
 * @private
 * @param {Object} object The source object.
 * @param {string[]} paths The property paths to pick.
 * @param {Function} predicate The function invoked per property.
 * @returns {Object} Returns the new object.
 */
function basePickBy(object, paths, predicate) {
  var index = -1,
      length = paths.length,
      result = {};

  while (++index < length) {
    var path = paths[index],
        value = _baseGet(object, path);

    if (predicate(value, path)) {
      _baseSet(result, _castPath(path, object), value);
    }
  }
  return result;
}

var _basePickBy = basePickBy;

/**
 * The base implementation of `_.pick` without support for individual
 * property identifiers.
 *
 * @private
 * @param {Object} object The source object.
 * @param {string[]} paths The property paths to pick.
 * @returns {Object} Returns the new object.
 */
function basePick(object, paths) {
  return _basePickBy(object, paths, function(value, path) {
    return hasIn_1(object, path);
  });
}

var _basePick = basePick;

/**
 * Creates an object composed of the picked `object` properties.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The source object.
 * @param {...(string|string[])} [paths] The property paths to pick.
 * @returns {Object} Returns the new object.
 * @example
 *
 * var object = { 'a': 1, 'b': '2', 'c': 3 };
 *
 * _.pick(object, ['a', 'c']);
 * // => { 'a': 1, 'c': 3 }
 */
var pick = _flatRest(function(object, paths) {
  return object == null ? {} : _basePick(object, paths);
});

var pick_1 = pick;

var NODE_ENV = get_1(window._global, 'nodeEnv', 'prod');
var useUpdateTimes = function useUpdateTimes(enabled, name) {
  var updateTimes = React__default.useRef(0);
  React__default.useEffect(function () {
    if (NODE_ENV !== 'prod' && enabled) {
      console.log("[LOG] render ".concat(name, " ").concat(++updateTimes.current, " times"));
    }
  });
};

var Dispatcher = function Dispatcher() {
  var _this = this;

  _classCallCheck(this, Dispatcher);

  _defineProperty(this, "id$", 0);

  _defineProperty(this, "effect$", new Map());

  _defineProperty(this, "subscribe", function (effect) {
    var curId = _this.id$++;

    _this.effect$.set(curId, effect);

    return function () {
      _this.effect$["delete"](curId);
    };
  });

  _defineProperty(this, "next", function () {
    _this.effect$ && _this.effect$.forEach(function (effect) {
      return effect();
    });
  });
};

var FilterManager = function FilterManager(queryManager) {
  var _this = this;

  _classCallCheck(this, FilterManager);

  _defineProperty(this, "queryManger", void 0);

  _defineProperty(this, "dispatcher", void 0);

  _defineProperty(this, "pageInfo", void 0);

  _defineProperty(this, "state", void 0);

  _defineProperty(this, "globalState", void 0);

  _defineProperty(this, "subscribe", function (effect) {
    return _this.dispatcher.subscribe(effect);
  });

  _defineProperty(this, "next", function () {
    return _this.dispatcher.next();
  });

  _defineProperty(this, "updateState", function (nextState) {
    var isUpdate = _this.queryManger.updateQueryAndUrl(nextState);

    if (isUpdate) {
      var nextQuery = _this.queryManger.queries;
      _this.state = convertQuery2state(nextQuery, _this.pageInfo.total);
      _this.pageInfo = merge_1({}, _this.pageInfo, pickPageAndSize(nextQuery));

      _this.dispatcher.next();
    }
  });

  _defineProperty(this, "setFilter", this.updateState);

  _defineProperty(this, "setPageInfo", function (nextPageInfo) {
    var updatePageInfo = merge_1({}, _this.pageInfo, nextPageInfo);
    var isUpdate = !isEqual_1(updatePageInfo, _this.pageInfo);

    if (isUpdate) {
      _this.pageInfo = updatePageInfo;
      _this.state.total = updatePageInfo.total;

      _this.updateState(pickPageAndSize(updatePageInfo));
    }
  });

  _defineProperty(this, "setPage", function (page) {
    _this.setPageInfo({
      page: page
    });
  });

  _defineProperty(this, "setGlobalState", function (nextGlobalState) {
    var updateGlobalState = _objectSpread2({}, _this.globalState, {}, nextGlobalState);

    if (!isEqual_1(_this.globalState, updateGlobalState)) {
      _this.globalState = updateGlobalState; // global state不会触发下一次更新，比如grid会用来记录selectedRowKeys?
      // this.dispatcher.next();
    }
  });

  this.queryManger = queryManager;
  this.dispatcher = new Dispatcher();
  this.globalState = {};
  this.pageInfo = _objectSpread2({}, pickPageAndSize(queryManager.queries), {
    total: 0
  });
  this.state = convertQuery2state(queryManager.queries, this.pageInfo.total);
};

function convertQuery2state(query, total) {
  var page = query.page,
      pageSize = query.pageSize,
      restQuery = _objectWithoutProperties(query, ["page", "pageSize"]);

  var filter = _objectSpread2({}, restQuery, {
    pageSize: pageSize
  });

  return {
    page: page,
    filter: filter,
    total: total
  };
}

function pickPageAndSize(data) {
  return pick_1(data, ['page', 'pageSize']);
}

/**
 * Casts `value` to `identity` if it's not a function.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {Function} Returns cast function.
 */
function castFunction(value) {
  return typeof value == 'function' ? value : identity_1;
}

var _castFunction = castFunction;

/**
 * Iterates over elements of `collection` and invokes `iteratee` for each element.
 * The iteratee is invoked with three arguments: (value, index|key, collection).
 * Iteratee functions may exit iteration early by explicitly returning `false`.
 *
 * **Note:** As with other "Collections" methods, objects with a "length"
 * property are iterated like arrays. To avoid this behavior use `_.forIn`
 * or `_.forOwn` for object iteration.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @alias each
 * @category Collection
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} [iteratee=_.identity] The function invoked per iteration.
 * @returns {Array|Object} Returns `collection`.
 * @see _.forEachRight
 * @example
 *
 * _.forEach([1, 2], function(value) {
 *   console.log(value);
 * });
 * // => Logs `1` then `2`.
 *
 * _.forEach({ 'a': 1, 'b': 2 }, function(value, key) {
 *   console.log(key);
 * });
 * // => Logs 'a' then 'b' (iteration order is not guaranteed).
 */
function forEach(collection, iteratee) {
  var func = isArray_1(collection) ? _arrayEach : _baseEach;
  return func(collection, _castFunction(iteratee));
}

var forEach_1 = forEach;

var getUrlCollection = {
  hash: function hash() {
    // 如果是hash模式，获取参数的方式是从hash获取
    var hash = window.location.hash;
    var matched = hash.match(/#\/.*\?(.*)$/);

    if (matched) {
      return matched[1];
    }
    /* istanbul ignore next */


    return '';
  },
  browser: function browser() {
    return window.location.search.slice(1);
  },
  none: function none() {
    return '';
  }
};

function getUrlPrefix(mode) {
  var _window$location = window.location,
      pathname = _window$location.pathname,
      search = _window$location.search,
      hash = _window$location.hash;
  var hashWithoutQuery = '#/';

  if (hash) {
    var queryStart = hash.indexOf('?');
    hashWithoutQuery = queryStart === -1 ? hash : hash.substring(0, queryStart);
  }

  if (mode === 'browser') {
    return pathname;
  }

  return "".concat(pathname).concat(search).concat(hashWithoutQuery);
}

var getPresetQuery = function getPresetQuery() {
  return {
    page: 1,
    pageSize: 20
  };
};

var QueryManager =
/*#__PURE__*/
function () {
  function QueryManager() {
    var _this = this;

    var mode = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'browser';
    var defaultFilter = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var normalizer = arguments.length > 2 ? arguments[2] : undefined;

    _classCallCheck(this, QueryManager);

    _defineProperty(this, "mode", void 0);

    _defineProperty(this, "filterNormalizer", null);

    _defineProperty(this, "queries", {});

    _defineProperty(this, "updateQuery", function (query) {
      var brandNewQueries = merge_1({}, _this.queries, query);
      var updateQueries = _this.filterNormalizer ? _this.filterNormalizer(brandNewQueries) : brandNewQueries;
      var isUpdate = !isEqual_1(_this.queries, updateQueries);
      if (isUpdate) _this.queries = updateQueries;
      return isUpdate;
    });

    _defineProperty(this, "updateQueryAndUrl", function (query) {
      var isUpdate = _this.updateQuery(query);

      if (_this.mode !== 'none') {
        var queryString = qs.stringify(_this.queries);
        var urlPrefix = getUrlPrefix(_this.mode);
        history.replaceState(null, '', "".concat(urlPrefix, "?").concat(queryString));
      }

      return isUpdate;
    });

    this.mode = mode;

    if (normalizer) {
      this.filterNormalizer = normalizer;
    }

    var search = getUrlCollection[mode]();
    var urlQueries = qs.parse(search);
    var initialQueries = merge_1(getPresetQuery(), defaultFilter, numberingPageInfo(urlQueries));
    this.updateQueryAndUrl(initialQueries);
  }

  _createClass(QueryManager, [{
    key: "setFilterNormalizer",
    value: function setFilterNormalizer(normalizer) {
      this.filterNormalizer = normalizer;
    }
  }]);

  return QueryManager;
}();

function numberingPageInfo(urlQueries) {
  forEach_1(['page', 'pageSize'], function (key) {
    var newValue = numberingValue(urlQueries[key]);
    if (newValue !== null) urlQueries[key] = newValue;
  });
  return urlQueries;
}

function numberingValue(maybeNumber) {
  if (maybeNumber === undefined) return null;
  var value = Number(maybeNumber);
  return isNaN(value) ? maybeNumber : value;
}

var defaultInternalState = {
  loading: false,
  dataset: []
};
var useList = function useList(params) {
  useUpdateTimes(true, 'easy-list');
  var defaultFilter = params.defaultFilter,
      delay = params.delay,
      _params$fetchInInit = params.fetchInInit,
      fetchInInit = _params$fetchInInit === void 0 ? true : _params$fetchInInit,
      filterNormalizer = params.filterNormalizer,
      mode = params.mode,
      onError = params.onError,
      onSubmit = params.onSubmit;

  var _React$useState = React__default.useState(defaultFilter),
      _React$useState2 = _slicedToArray(_React$useState, 1),
      dumpFilter = _React$useState2[0];

  var _React$useState3 = React__default.useState(defaultInternalState),
      _React$useState4 = _slicedToArray(_React$useState3, 2),
      internalState = _React$useState4[0],
      updateInternalState = _React$useState4[1];

  var internalStateUpdateProxy = React__default.useCallback(function (nextState) {
    return updateInternalState(function (prev) {
      return _objectSpread2({}, prev, {}, nextState);
    });
  }, []);
  var errorHandler = React__default.useCallback(function (err) {
    return errorWrapper(err, onError);
  }, [onError]);
  var queryManager = React__default.useMemo(function () {
    return new QueryManager(mode, dumpFilter, filterNormalizer);
  }, [mode, dumpFilter, filterNormalizer]);
  var filterManager = React__default.useMemo(function () {
    return new FilterManager(queryManager);
  }, [queryManager]);
  var delayRef = React__default.useRef(null);
  var fetchData = React__default.useCallback(function () {
    var currentState = filterManager.state;
    var currentGlobalState = filterManager.globalState;

    try {
      onSubmit(_objectSpread2({}, currentState.filter, {
        page: currentState.page
      }), currentGlobalState).then(function (res) {
        var dataset = res.dataset,
            pageInfo = res.pageInfo;
        filterManager.setPageInfo(pageInfo);
        internalStateUpdateProxy({
          dataset: dataset,
          loading: false
        });
      })["catch"](function (err) {
        errorHandler(err);
        internalStateUpdateProxy({
          loading: false
        });
      });
    } catch (err) {
      errorHandler(err);
      internalStateUpdateProxy({
        loading: false
      });
    }
  }, [errorHandler, filterManager, internalStateUpdateProxy, onSubmit]);
  var fetchDataWrapper = React__default.useCallback(function () {
    internalStateUpdateProxy({
      loading: true
    });

    if (delay && delay > 0) {
      if (delayRef.current) {
        clearTimeout(delayRef.current);
      }

      delayRef.current = setTimeout(fetchData, delay);
      return;
    }

    fetchData();
  }, [delay, fetchData, internalStateUpdateProxy]);
  var updateLoading = React__default.useCallback(function (nextState) {
    return function () {
      return internalStateUpdateProxy({
        loading: nextState
      });
    };
  }, [internalStateUpdateProxy]);
  var updateDataset = React__default.useCallback(function (nextDataset) {
    return internalStateUpdateProxy({
      dataset: nextDataset
    });
  }, [internalStateUpdateProxy]);
  React__default.useEffect(function () {
    filterNormalizer && queryManager.setFilterNormalizer(filterNormalizer);
  }, [filterNormalizer, queryManager]);
  React__default.useEffect(function () {
    return filterManager.subscribe(fetchDataWrapper);
  }, [fetchDataWrapper, filterManager]); // 初次获取需要主动触发一下

  React__default.useEffect(function () {
    if (fetchInInit) {
      filterManager.next();
    }
  }, [fetchInInit, filterManager]);
  var memoActs = React__default.useMemo(function () {
    return {
      setPage: filterManager.setPage,
      setFilter: filterManager.setFilter,
      setGlobalState: filterManager.setGlobalState,
      setLoading: updateLoading(true),
      stopLoading: updateLoading(false),
      setDataset: updateDataset,
      refresh: fetchDataWrapper
    };
  }, [fetchDataWrapper, filterManager.setFilter, filterManager.setGlobalState, filterManager.setPage, updateDataset, updateLoading]);
  return {
    action: memoActs,
    state: _objectSpread2({}, filterManager.state, {}, internalState),
    globalState: filterManager.globalState
  };
};

function errorWrapper(err, customErrorHandler) {
  var errObj = err instanceof Error ? err :
  /* istanbul ignore next */
  new Error(err);
  if (customErrorHandler !== undefined) customErrorHandler(errObj);
  /* istanbul ignore next */
  else zent.Notify.error(errObj.message);
}

function connect(Component) {
  return React__default.forwardRef(function EasyListConsumer(props, ref) {
    var context = React__default.useContext(ListContext); // listContext内部更新机制很差，在这个版本中没有应用重构版本，所以需要手动缓存

    var nextState = React__default.useMemo(function () {
      return context.state;
    }, [context.state]);
    var nextGState = React__default.useMemo(function () {
      return context.globalState;
    }, [context.globalState]);
    var nextActions = React__default.useMemo(function () {
      return context.action;
    }, [context.action]);
    return React__default.createElement(Component, _extends({
      ref: ref,
      list: {
        action: nextActions,
        state: nextState,
        globalState: nextGState
      }
    }, props));
  });
}

var ListContext = React__default.createContext({});
var List = React__default.forwardRef(function EasyListProvider(props, ref) {
  var children = props.children,
      restProps = _objectWithoutProperties(props, ["children"]);

  var listContext = useList(restProps);
  React__default.useImperativeHandle(ref, function () {
    return listContext;
  });
  return React__default.createElement(ListContext.Provider, {
    value: listContext
  }, children);
});

var withPop = zent.Pop.withPop;
var popPassiveProps = ['trigger', 'centerArrow', 'cushion', 'position', 'type', 'className', 'onConfirm', 'onCancel', 'confirmText', 'cancelText'];
var sweetAlertPassiveProps = ['contnet', 'type', 'title', 'onConfirm', 'confirmText', 'confirmType', 'closeBtn', 'maskCloseable', 'className', 'cancelText', 'onCancel'];
var GridPop = function GridPop(props) {
  var disabled = props.disabled,
      text = props.text,
      children = props.children,
      data = props.data,
      content = props.content,
      _props$preventDefault = props.preventDefault,
      preventDefault = _props$preventDefault === void 0 ? false : _props$preventDefault,
      _props$adjustPosition = props.adjustPositionOnShow,
      adjustPositionOnShow = _props$adjustPosition === void 0 ? false : _props$adjustPosition,
      otherProps = _objectWithoutProperties(props, ["disabled", "text", "children", "data", "content", "preventDefault", "adjustPositionOnShow"]);

  var popRef = React__default.useRef(null);
  var list = React__default.useContext(ListContext);
  var passiveProps = React__default.useMemo(function () {
    return pick_1(otherProps, popPassiveProps);
  }, [otherProps]);
  var popContent = React__default.useMemo(function () {
    if (content) return content;

    if (typeof children === 'function') {
      var Component = withPop(function (popProps) {
        var pop = popProps.pop;
        var childrenProps = {
          pop: pop,
          list: list,
          data: data
        };
        return children(childrenProps);
      });
      return React__default.createElement(Component, null);
    }

    return children;
  }, [children, content, data, list]);
  var disabledClassName = React__default.useMemo(function () {
    return disabled ? 'operations-item__disabled' : '';
  }, [disabled]);
  var handleAdjustPos = React__default.useCallback(function () {
    if (adjustPositionOnShow && popRef.current) popRef.current.adjustPosition();
  }, [adjustPositionOnShow]);
  var handlePreventDefault = React__default.useCallback(function (evt) {
    if (preventDefault) {
      evt.stopPropagation();
      evt.preventDefault();
    }
  }, [preventDefault]);
  var PopChild = React__default.useMemo(function () {
    if (typeof text === 'string' || reactIs.isElement(text)) {
      return text;
    }

    return null;
  }, [text]);

  if (!PopChild) {
    return null;
  }

  return React__default.createElement(zent.Pop, _extends({}, passiveProps, {
    ref: popRef,
    onShow: handleAdjustPos,
    content: React__default.createElement("div", {
      className: "pop-content"
    }, popContent),
    position: passiveProps.position || 'auto-top-left',
    className: cx(passiveProps.className, 'easy-grid__grid-pop')
  }), React__default.createElement("a", {
    "data-testid": "easy-grid-gridPop",
    className: disabledClassName,
    onClick: handlePreventDefault
  }, PopChild));
};
var GridSweetAlert = function GridSweetAlert(props) {
  var text = props.text,
      data = props.data,
      sweetType = props.sweetType,
      children = props.children,
      content = props.content,
      otherProps = _objectWithoutProperties(props, ["text", "data", "sweetType", "children", "content"]);

  var list = React__default.useContext(ListContext);
  var passiveProps = React__default.useMemo(function () {
    return pick_1(otherProps, sweetAlertPassiveProps);
  }, [otherProps]);
  var dialogContent = React__default.useMemo(function () {
    if (content) return content;
    /* istanbul ignore next */

    if (typeof children === 'function') {
      return children({
        list: list,
        data: data
      });
    }

    return children;
  }, [children, content, data, list]);
  var onClick = React__default.useCallback(function () {
    var openType = sweetType || 'confirm';
    zent.Sweetalert[openType](_objectSpread2({
      content: dialogContent
    }, passiveProps));
  }, [dialogContent, passiveProps, sweetType]);
  return React__default.createElement("a", {
    "data-testid": "easy-grid-sweetAlert",
    onClick: onClick,
    href: "#"
  }, text);
};

var InlineWrapper = function InlineWrapper(props) {
  var left = props.left,
      right = props.right;
  var LEFT_NODES = React__default.useMemo(function () {
    return React__default.Children.map(left, function (child, index) {
      return React__default.createElement("div", {
        key: "wrapperItem".concat(index),
        className: "easy-list__inline-wrapper-item"
      }, child);
    });
  }, [left]);
  var RIGHT_NODES = React__default.useMemo(function () {
    return React__default.Children.map(right, function (child, index) {
      return React__default.createElement("div", {
        key: "wrapperItem".concat(index),
        className: "easy-list__inline-wrapper-item"
      }, child);
    });
  }, [right]);
  return React__default.createElement("div", {
    "data-testid": "easy-filter-inline",
    className: "easy-list__inline-wrapper"
  }, React__default.createElement("div", {
    className: "easy-list__inline-wrapper__left"
  }, LEFT_NODES), React__default.createElement("div", {
    className: "easy-list__inline-wrapper__right"
  }, RIGHT_NODES));
};

// 在监听副作用函数中的上问下对象中应该具备的东西

(function (DatePickerTypes) {
  DatePickerTypes["DatePicker"] = "DatePicker";
  DatePickerTypes["QuarterPicker"] = "QuarterPicker";
  DatePickerTypes["MonthPicker"] = "MonthPicker";
  DatePickerTypes["WeekPicker"] = "WeekPicker";
  DatePickerTypes["DateRangePicker"] = "DateRangePicker";
  DatePickerTypes["TimePicker"] = "TimePicker";
  DatePickerTypes["TimeRangePicker"] = "DatePicker";
  DatePickerTypes["DateRangeQuickPicker"] = "DateRangeQuickPicker";
})(exports.DatePickerTypes || (exports.DatePickerTypes = {}));

(function (Reason) {
  Reason[Reason["Init"] = 0] = "Init";
  Reason[Reason["Filter"] = 1] = "Filter";
  Reason[Reason["Page"] = 2] = "Page";
  Reason[Reason["Other"] = 3] = "Other";
})(exports.Reason || (exports.Reason = {}));

var Filter = connect(FilterWithRef);
var Tabs$1 = connect(Tabs);
var Search$1 = connect(Search);
var EasyGrid = connect(EasyGridWithRef);
var EasyList = {
  Actions: Actions,
  Search: Search$1,
  Tabs: Tabs$1,
  List: List,
  Filter: Filter,
  EasyGrid: EasyGrid,
  DatePickerTypes: exports.DatePickerTypes,
  HeaderHelp: HeaderHelp,
  GoodsBriefCard: GoodsBriefCard,
  quickEditRender: quickEdit,
  GridPop: GridPop,
  GridSweetAlert: GridSweetAlert,
  connect: connect,
  InlineFilter: InlineWrapper,
  // pure components
  PureFilter: FilterWithRef,
  PureSearch: Search,
  PureTabs: Tabs,
  PureGrid: EasyGridWithRef,
  // hooks
  useList: useList
};

exports.default = EasyList;
