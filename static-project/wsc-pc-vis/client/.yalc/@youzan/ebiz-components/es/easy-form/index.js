'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = _interopDefault(require('react'));
var zent = require('zent');
var cx = _interopDefault(require('classnames'));

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
var symbolTag = '[object Symbol]';

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
    (isObjectLike_1(value) && _baseGetTag(value) == symbolTag);
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

/* Built-in method references that are verified to be native. */
var Map$1 = _getNative(_root, 'Map');

var _Map = Map$1;

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

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0;

/** Used to convert symbols to primitives and strings. */
var symbolProto = _Symbol ? _Symbol.prototype : undefined,
    symbolToString = symbolProto ? symbolProto.toString : undefined;

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

/** Built-in value references. */
var Uint8Array = _root.Uint8Array;

var _Uint8Array = Uint8Array;

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

/** Built-in value references. */
var getPrototype = _overArg(Object.getPrototypeOf, Object);

var _getPrototype = getPrototype;

/** Used for built-in method references. */
var objectProto$5 = Object.prototype;

/**
 * Checks if `value` is likely a prototype object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
 */
function isPrototype(value) {
  var Ctor = value && value.constructor,
      proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto$5;

  return value === proto;
}

var _isPrototype = isPrototype;

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
var propertyIsEnumerable = objectProto$6.propertyIsEnumerable;

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
    !propertyIsEnumerable.call(value, 'callee');
};

var isArguments_1 = isArguments;

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

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
    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

var isLength_1 = isLength;

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

/** `Object#toString` result references. */
var objectTag = '[object Object]';

/** Used for built-in method references. */
var funcProto$2 = Function.prototype,
    objectProto$7 = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString$2 = funcProto$2.toString;

/** Used to check objects for own properties. */
var hasOwnProperty$5 = objectProto$7.hasOwnProperty;

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
  if (!isObjectLike_1(value) || _baseGetTag(value) != objectTag) {
    return false;
  }
  var proto = _getPrototype(value);
  if (proto === null) {
    return true;
  }
  var Ctor = hasOwnProperty$5.call(proto, 'constructor') && proto.constructor;
  return typeof Ctor == 'function' && Ctor instanceof Ctor &&
    funcToString$2.call(Ctor) == objectCtorString;
}

var isPlainObject_1 = isPlainObject;

/** `Object#toString` result references. */
var argsTag$1 = '[object Arguments]',
    arrayTag = '[object Array]',
    boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    funcTag$1 = '[object Function]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    objectTag$1 = '[object Object]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    weakMapTag = '[object WeakMap]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]',
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
typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
typedArrayTags[dataViewTag] = typedArrayTags[dateTag] =
typedArrayTags[errorTag] = typedArrayTags[funcTag$1] =
typedArrayTags[mapTag] = typedArrayTags[numberTag] =
typedArrayTags[objectTag$1] = typedArrayTags[regexpTag] =
typedArrayTags[setTag] = typedArrayTags[stringTag] =
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

/** Used for built-in method references. */
var objectProto$8 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$6 = objectProto$8.hasOwnProperty;

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
  if (!(hasOwnProperty$6.call(object, key) && eq_1(objValue, value)) ||
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

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER$1 = 9007199254740991;

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
  length = length == null ? MAX_SAFE_INTEGER$1 : length;

  return !!length &&
    (type == 'number' ||
      (type != 'symbol' && reIsUint.test(value))) &&
        (value > -1 && value % 1 == 0 && value < length);
}

var _isIndex = isIndex;

/** Used for built-in method references. */
var objectProto$9 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$7 = objectProto$9.hasOwnProperty;

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
    if ((inherited || hasOwnProperty$7.call(value, key)) &&
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
var objectProto$a = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$8 = objectProto$a.hasOwnProperty;

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
    if (!(key == 'constructor' && (isProto || !hasOwnProperty$8.call(object, key)))) {
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

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeKeys = _overArg(Object.keys, Object);

var _nativeKeys = nativeKeys;

/** Used for built-in method references. */
var objectProto$b = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$9 = objectProto$b.hasOwnProperty;

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
    if (hasOwnProperty$9.call(object, key) && key != 'constructor') {
      result.push(key);
    }
  }
  return result;
}

var _baseKeys = baseKeys;

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
var objectProto$c = Object.prototype;

/** Built-in value references. */
var propertyIsEnumerable$1 = objectProto$c.propertyIsEnumerable;

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
    return propertyIsEnumerable$1.call(object, symbol);
  });
};

var _getSymbols = getSymbols;

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

/* Built-in method references that are verified to be native. */
var DataView = _getNative(_root, 'DataView');

var _DataView = DataView;

/* Built-in method references that are verified to be native. */
var Promise$1 = _getNative(_root, 'Promise');

var _Promise = Promise$1;

/* Built-in method references that are verified to be native. */
var Set = _getNative(_root, 'Set');

var _Set = Set;

/* Built-in method references that are verified to be native. */
var WeakMap = _getNative(_root, 'WeakMap');

var _WeakMap = WeakMap;

/** `Object#toString` result references. */
var mapTag$1 = '[object Map]',
    objectTag$2 = '[object Object]',
    promiseTag = '[object Promise]',
    setTag$1 = '[object Set]',
    weakMapTag$1 = '[object WeakMap]';

var dataViewTag$1 = '[object DataView]';

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
if ((_DataView && getTag(new _DataView(new ArrayBuffer(1))) != dataViewTag$1) ||
    (_Map && getTag(new _Map) != mapTag$1) ||
    (_Promise && getTag(_Promise.resolve()) != promiseTag) ||
    (_Set && getTag(new _Set) != setTag$1) ||
    (_WeakMap && getTag(new _WeakMap) != weakMapTag$1)) {
  getTag = function(value) {
    var result = _baseGetTag(value),
        Ctor = result == objectTag$2 ? value.constructor : undefined,
        ctorString = Ctor ? _toSource(Ctor) : '';

    if (ctorString) {
      switch (ctorString) {
        case dataViewCtorString: return dataViewTag$1;
        case mapCtorString: return mapTag$1;
        case promiseCtorString: return promiseTag;
        case setCtorString: return setTag$1;
        case weakMapCtorString: return weakMapTag$1;
      }
    }
    return result;
  };
}

var _getTag = getTag;

/** Used for built-in method references. */
var objectProto$d = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$a = objectProto$d.hasOwnProperty;

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
  if (length && typeof array[0] == 'string' && hasOwnProperty$a.call(array, 'index')) {
    result.index = array.index;
    result.input = array.input;
  }
  return result;
}

var _initCloneArray = initCloneArray;

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
var symbolProto$1 = _Symbol ? _Symbol.prototype : undefined,
    symbolValueOf = symbolProto$1 ? symbolProto$1.valueOf : undefined;

/**
 * Creates a clone of the `symbol` object.
 *
 * @private
 * @param {Object} symbol The symbol object to clone.
 * @returns {Object} Returns the cloned symbol object.
 */
function cloneSymbol(symbol) {
  return symbolValueOf ? Object(symbolValueOf.call(symbol)) : {};
}

var _cloneSymbol = cloneSymbol;

/** `Object#toString` result references. */
var boolTag$1 = '[object Boolean]',
    dateTag$1 = '[object Date]',
    mapTag$2 = '[object Map]',
    numberTag$1 = '[object Number]',
    regexpTag$1 = '[object RegExp]',
    setTag$2 = '[object Set]',
    stringTag$1 = '[object String]',
    symbolTag$1 = '[object Symbol]';

var arrayBufferTag$1 = '[object ArrayBuffer]',
    dataViewTag$2 = '[object DataView]',
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
    case arrayBufferTag$1:
      return _cloneArrayBuffer(object);

    case boolTag$1:
    case dateTag$1:
      return new Ctor(+object);

    case dataViewTag$2:
      return _cloneDataView(object, isDeep);

    case float32Tag$1: case float64Tag$1:
    case int8Tag$1: case int16Tag$1: case int32Tag$1:
    case uint8Tag$1: case uint8ClampedTag$1: case uint16Tag$1: case uint32Tag$1:
      return _cloneTypedArray(object, isDeep);

    case mapTag$2:
      return new Ctor;

    case numberTag$1:
    case stringTag$1:
      return new Ctor(object);

    case regexpTag$1:
      return _cloneRegExp(object);

    case setTag$2:
      return new Ctor;

    case symbolTag$1:
      return _cloneSymbol(object);
  }
}

var _initCloneByTag = initCloneByTag;

/** `Object#toString` result references. */
var mapTag$3 = '[object Map]';

/**
 * The base implementation of `_.isMap` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a map, else `false`.
 */
function baseIsMap(value) {
  return isObjectLike_1(value) && _getTag(value) == mapTag$3;
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
var setTag$3 = '[object Set]';

/**
 * The base implementation of `_.isSet` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a set, else `false`.
 */
function baseIsSet(value) {
  return isObjectLike_1(value) && _getTag(value) == setTag$3;
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
var argsTag$2 = '[object Arguments]',
    arrayTag$1 = '[object Array]',
    boolTag$2 = '[object Boolean]',
    dateTag$2 = '[object Date]',
    errorTag$1 = '[object Error]',
    funcTag$2 = '[object Function]',
    genTag$1 = '[object GeneratorFunction]',
    mapTag$4 = '[object Map]',
    numberTag$2 = '[object Number]',
    objectTag$3 = '[object Object]',
    regexpTag$2 = '[object RegExp]',
    setTag$4 = '[object Set]',
    stringTag$2 = '[object String]',
    symbolTag$2 = '[object Symbol]',
    weakMapTag$2 = '[object WeakMap]';

var arrayBufferTag$2 = '[object ArrayBuffer]',
    dataViewTag$3 = '[object DataView]',
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
cloneableTags[argsTag$2] = cloneableTags[arrayTag$1] =
cloneableTags[arrayBufferTag$2] = cloneableTags[dataViewTag$3] =
cloneableTags[boolTag$2] = cloneableTags[dateTag$2] =
cloneableTags[float32Tag$2] = cloneableTags[float64Tag$2] =
cloneableTags[int8Tag$2] = cloneableTags[int16Tag$2] =
cloneableTags[int32Tag$2] = cloneableTags[mapTag$4] =
cloneableTags[numberTag$2] = cloneableTags[objectTag$3] =
cloneableTags[regexpTag$2] = cloneableTags[setTag$4] =
cloneableTags[stringTag$2] = cloneableTags[symbolTag$2] =
cloneableTags[uint8Tag$2] = cloneableTags[uint8ClampedTag$2] =
cloneableTags[uint16Tag$2] = cloneableTags[uint32Tag$2] = true;
cloneableTags[errorTag$1] = cloneableTags[funcTag$2] =
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
    if (tag == objectTag$3 || tag == argsTag$2 || (isFunc && !object)) {
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

/**
 * ANNOUNCEMENT
 *
 * CAUSE THE ORIGINAL METHOD CAN'T DISPLAY COLORIZE-JSON IN BROWSER,
 * SO I DUPLICATED FROM [json-colorizer](https://github.com/joeattardi/json-colorizer/blob/master/src/lib/lexer.js)
 * AND MODIFIED IT IN ORDER TO CONVERT JSON TO TOKENS, AND DISPLAY THEM IN BROWSER FINALLY.
 *
 * 声明
 *
 * 以为原始的方法不能将染色后的json字符串展示在浏览器中，所以将原方法
 * [json-colorizer](https://github.com/joeattardi/json-colorizer/blob/master/src/lib/lexer.js)
 * 拷贝并加以修改，最终得到json-token让其能够在浏览器中展示
 *
 * @see json-colorizer https://github.com/joeattardi/json-colorizer/blob/master/src/lib/lexer.js
 * @author Joe Attardi
 */
var JsonTypeEmus;

(function (JsonTypeEmus) {
  JsonTypeEmus[JsonTypeEmus["WHITESPACE"] = 0] = "WHITESPACE";
  JsonTypeEmus[JsonTypeEmus["NEXT_LINE"] = 1] = "NEXT_LINE";
  JsonTypeEmus[JsonTypeEmus["BRACE"] = 2] = "BRACE";
  JsonTypeEmus[JsonTypeEmus["BRACKET"] = 3] = "BRACKET";
  JsonTypeEmus[JsonTypeEmus["COLON"] = 4] = "COLON";
  JsonTypeEmus[JsonTypeEmus["COMMA"] = 5] = "COMMA";
  JsonTypeEmus[JsonTypeEmus["NUMBER_LITERAL"] = 6] = "NUMBER_LITERAL";
  JsonTypeEmus[JsonTypeEmus["STRING_KEY"] = 7] = "STRING_KEY";
  JsonTypeEmus[JsonTypeEmus["STRING_LITERAL"] = 8] = "STRING_LITERAL";
  JsonTypeEmus[JsonTypeEmus["BOOLEAN_LITERAL"] = 9] = "BOOLEAN_LITERAL";
  JsonTypeEmus[JsonTypeEmus["NULL_LITERAL"] = 10] = "NULL_LITERAL";
})(JsonTypeEmus || (JsonTypeEmus = {}));

var tokenTypes = [{
  regex: /^\s+/,
  tokenType: JsonTypeEmus.WHITESPACE
}, {
  regex: /^[{}]/,
  tokenType: JsonTypeEmus.BRACE
}, {
  regex: /^[[\]]/,
  tokenType: JsonTypeEmus.BRACKET
}, {
  regex: /^:/,
  tokenType: JsonTypeEmus.COLON
}, {
  regex: /^,/,
  tokenType: JsonTypeEmus.COMMA
}, {
  regex: /^-?\d+(?:\.\d+)?(?:e[+-]?\d+)?/i,
  tokenType: JsonTypeEmus.NUMBER_LITERAL
}, {
  regex: /^"(?:\\.|[^"\\])*"(?=\s*:)/,
  tokenType: JsonTypeEmus.STRING_KEY
}, {
  regex: /^"(?:\\.|[^"\\])*"/,
  tokenType: JsonTypeEmus.STRING_LITERAL
}, {
  regex: /^true|^false/,
  tokenType: JsonTypeEmus.BOOLEAN_LITERAL
}, {
  regex: /^null/,
  tokenType: JsonTypeEmus.NULL_LITERAL
}];
function getTokens(json) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var input;

  if (options.pretty) {
    var inputObj = typeof json === 'string' ? JSON.parse(json) : json;
    input = JSON.stringify(inputObj, null, 4);
  } else {
    input = typeof json === 'string' ? json : JSON.stringify(json);
  }

  var tokens = [];
  var foundToken;

  do {
    foundToken = false;

    for (var i = 0; i < tokenTypes.length; i++) {
      var match = tokenTypes[i].regex.exec(input);

      if (match) {
        var type = tokenTypes[i].tokenType;
        var value = match[0];

        if (type === JsonTypeEmus.WHITESPACE) {
          var newLineSymbol = value.match(/^[\r\n]/);

          if (newLineSymbol) {
            // 如果匹配到换行符，不管几个，都添加一个换行标记
            tokens.push({
              type: JsonTypeEmus.NEXT_LINE,
              value: '<br/>'
            });
          }

          value = value.replace(/[\r\n]/g, '').replace(/\s/g, '&nbsp;');
        }

        tokens.push({
          type: type,
          value: value
        });
        input = input.substring(match[0].length);
        foundToken = true;
        break;
      }
    }
  } while (_allTokensAnalyzed(input, foundToken));

  return tokens;
}
/**
 * @author Willian Magalhães Gonçalves
 * @description Are all tokens analyzed?
 * @private
 */

function _allTokensAnalyzed(input, foundToken) {
  var safeInput = input || {};
  var inputLength = safeInput.length;
  return inputLength > 0 && foundToken;
}

var _defaultColors;
var defaultColors = (_defaultColors = {}, _defineProperty(_defaultColors, JsonTypeEmus.BRACE, 'gray'), _defineProperty(_defaultColors, JsonTypeEmus.BRACKET, 'gray'), _defineProperty(_defaultColors, JsonTypeEmus.COLON, 'gray'), _defineProperty(_defaultColors, JsonTypeEmus.COMMA, 'gray'), _defineProperty(_defaultColors, JsonTypeEmus.STRING_KEY, '#8ce10b'), _defineProperty(_defaultColors, JsonTypeEmus.STRING_LITERAL, '#ffb900'), _defineProperty(_defaultColors, JsonTypeEmus.NUMBER_LITERAL, '#008df8'), _defineProperty(_defaultColors, JsonTypeEmus.BOOLEAN_LITERAL, '#6d43a6'), _defineProperty(_defaultColors, JsonTypeEmus.NULL_LITERAL, 'white'), _defaultColors);
function colorize(tokens) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var colors = options.colors || {};
  return tokens.map(function (token) {
    var colorKey = colors[token.type] || defaultColors[token.type];
    return _objectSpread2({
      color: colorKey
    }, token);
  });
}

function propWalker(predicate) {
  return function walker(key, value) {
    var dep = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
    if (dep > 10) return undefined;
    if (predicate(value)) return [key];else if (isObjectLike_1(value)) {
      dep += 1;
      var subPaths = [];
      Object.entries(value).forEach(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 2),
            subKey = _ref2[0],
            subValue = _ref2[1];

        var subPath = walker(subKey, subValue, dep);
        if (subPath) subPaths.push("".concat(key, ".").concat(subPath));
      });
      if (subPaths.length) return subPaths;
      return undefined;
    }
    return undefined;
  };
}

var EasyFormPreview = function EasyFormPreview(_ref) {
  var form = _ref.form,
      statusForm = _ref.statusForm;
  var previewUpdateRef = React.useRef(null);

  var _React$useState = React.useState({}),
      _React$useState2 = _slicedToArray(_React$useState, 2),
      formValues = _React$useState2[0],
      setFormValues = _React$useState2[1];

  var jsonTokens = React.useMemo(function () {
    return getTokens(formValues, {
      pretty: true
    });
  }, [formValues]);
  var colorizeTokens = React.useMemo(function () {
    return colorize(jsonTokens, {});
  }, [jsonTokens]);
  React.useEffect(function () {
    function updateFormValues() {
      var formValues = form.getValue();
      var statusValues = statusForm.getValue();
      var invisibleKeys = omitInvisibleValues(statusValues);
      setFormValues(omit_1(formValues, invisibleKeys));
      if (previewUpdateRef.current) cancelAnimationFrame(previewUpdateRef.current);
      previewUpdateRef.current = requestAnimationFrame(updateFormValues);
    }

    updateFormValues();
    return function () {
      if (previewUpdateRef.current) cancelAnimationFrame(previewUpdateRef.current);
    };
  }, [form, statusForm]);
  return React.createElement("div", {
    className: "easy-form preview",
    dangerouslySetInnerHTML: {
      __html: colorizeTokens.reduce(jsonDisplayReducer, '')
    }
  });
};

function jsonDisplayReducer(prevHtmlString, curToken) {
  if (curToken.type === JsonTypeEmus.NEXT_LINE) return prevHtmlString += curToken.value;
  return prevHtmlString + "<span class=\"easy-form preview-token token-".concat(curToken.type, "\" style=\"color: ").concat(curToken.color, "\">").concat(curToken.value, "</span>");
}

function omitInvisibleValues(statusValues) {
  var invisiblePaths = [];
  var walker = propWalker(function (value) {
    return value.visible === false;
  });
  Object.entries(statusValues).forEach(function (_ref2) {
    var _ref3 = _slicedToArray(_ref2, 2),
        topKey = _ref3[0],
        topValue = _ref3[1];

    var path = walker(topKey, topValue);

    if (path) {
      invisiblePaths.push(path);
    }
  });
  return invisiblePaths.reduce(function (prePaths, curPath) {
    return prePaths.concat(curPath);
  }, []);
}

var YZ_NODE_ENV = get_1(window._global, 'nodeEnv', 'prod');
var EBIZ_NODE_ENV = get_1(process, 'env.NODE_ENV', 'production');

function invariant(condition, errorMsg, _assertVariable) {
  try {
    var res = condition();

    if (YZ_NODE_ENV !== 'prod') {
      try {
        if (!res) throw new Error(errorMsg);
        return res;
      } catch (err) {
        throw new Error(err);
      }
    }

    return res;
  } catch (err) {
    if (YZ_NODE_ENV === 'prod') return true;
    throw err;
  }
}

var form = zent.Form.form,
    field = zent.Form.field,
    set = zent.Form.set,
    array = zent.Form.array;
/**
 * 根据config构建form所需的form model
 */

var getFormBuilder = function getFormBuilder(config, _fieldConfig) {
  var formRawBuilder = {
    value: {},
    status: {}
  };

  if (config.length) {
    config.forEach(function (fieldConfig) {
      checkRequiredProps(fieldConfig);

      var _getModelBuilder = getModelBuilder(fieldConfig),
          name = _getModelBuilder.name,
          model = _getModelBuilder.model,
          status = _getModelBuilder.status;

      formRawBuilder.value[name] = model;
      formRawBuilder.status[name] = status;
    });
  }

  return {
    value: form(formRawBuilder.value),
    status: form(formRawBuilder.status)
  };
};

function getModelBuilder(fieldConfig) {
  if (fieldConfig.type === '__internal_group__' || fieldConfig.type === '__internal_list__') {
    // 如果是需要渲染成数组或者是set
    if (fieldConfig.type === '__internal_group__') {
      invariant(function () {
        return fieldConfig.config.length > 0;
      }, '使用set方法构造form字段集合必须声明config属性并且config不能为空');
      var innerGroupModelBuilder = fieldConfig.config.map(getModelBuilder);
      var fieldStatusModel = {};
      var fieldModels = {};
      innerGroupModelBuilder.forEach(function (model) {
        fieldModels[model.name] = model.model;
        fieldStatusModel[model.name] = model.status;
      });
      return {
        type: 'group',
        name: fieldConfig.groupName,
        model: set(fieldModels),
        status: set(_objectSpread2({
          self: field(initModelStatus(fieldConfig))
        }, fieldStatusModel))
      };
    } else {
      var listInnerModelBuilder = getModelBuilder(fieldConfig.repeatConfig);
      invariant(function () {
        return listInnerModelBuilder.type !== 'list';
      }, 'EasyForm中两个list构造函数不能互相嵌套，如果执意如此，请使用Custom自行构造Field');
      var repeatConfig = fieldConfig.repeatConfig;
      invariant(function () {
        return !isNil_1(repeatConfig);
      }, 'list的repeatConfig属性不能为空');
      return {
        type: 'list',
        name: fieldConfig.listName,
        model: array(listInnerModelBuilder.model).defaultValue([initModelValue(repeatConfig)]),
        status: field(initModelStatus(repeatConfig))
      };
    }
  } else {
    return {
      type: 'normal',
      name: fieldConfig.name,
      model: field(initModelValue(fieldConfig)),
      status: field(initModelStatus(fieldConfig))
    };
  }
}

function initModelValue(config) {
  return config.defaultValue || '';
}

function initModelStatus(config) {
  return _objectSpread2({
    visible: get_1(config, 'visible', true),
    disabled: get_1(config, 'disabled', false)
  }, get_1(config, 'inheritProps', {}));
}

function wrapValidator(validator, statusModel) {
  return function (value, ctx) {
    if (statusModel && !statusModel.getRawValue().visible) return null;
    return validator(value, ctx);
  };
}
/** 需要包裹一下，防止invisible的model被校验 */


function initValidators(validators, statusModel) {
  return (validators || []).map(function (validator) {
    return wrapValidator(validator, statusModel);
  });
}

function checkRequiredProps(config) {
  invariant(function () {
    return !isNil_1(config.name);
  }, 'EasyForm.config[x].name不能为空');
  invariant(function () {
    return !isNil_1(config.type);
  }, 'EasyForm.config[x].type不能为空');
  invariant(function () {
    return !(config.type === 'Custom' && isNil_1(config.renderField));
  }, '自定义类型必须要声明renderField属性');
}

var useFormConfigs = function useFormConfigs(params) {
  var config = params.config,
      overrideConfigs = params.overrideConfigs;
  /** 转存config，确保config只被调用一次 */

  var _React$useState = React.useState(config),
      _React$useState2 = _slicedToArray(_React$useState, 1),
      dumpConfig = _React$useState2[0];

  var _React$useState3 = React.useState(overrideConfigs),
      _React$useState4 = _slicedToArray(_React$useState3, 1),
      dumpOverrideCfg = _React$useState4[0];

  var decoratedConfigs = React.useMemo(function () {
    return dumpConfig.map(function (fieldConfig) {
      if (fieldConfig.type === 'Plain') return fieldConfig;
      var tempOverrideConfig = get_1(dumpOverrideCfg, fieldConfig.name, {});

      if (fieldConfig.type === '__internal_group__') {
        checkInternalType(fieldConfig);
        return formatGroupConfig(fieldConfig, tempOverrideConfig);
      } else if (fieldConfig.type === '__internal_list__') {
        checkInternalType(fieldConfig);
        return formatListConfig(fieldConfig, tempOverrideConfig);
      }

      return formatFieldConfig({
        overrideConfig: tempOverrideConfig
      })(fieldConfig);
    });
  }, [dumpConfig, dumpOverrideCfg]); // 真正参与渲染的config不包含type=Plain的

  var formConfigs = React.useMemo(function () {
    return decoratedConfigs.filter(function (config) {
      return config.type !== 'Plain';
    });
  }, [decoratedConfigs]);

  var _React$useMemo = React.useMemo(function () {
    return getFormBuilder(formConfigs);
  }, [formConfigs]),
      valueBuilder = _React$useMemo.value,
      statusBuilder = _React$useMemo.status;

  return {
    valueBuilder: valueBuilder,
    statusBuilder: statusBuilder,
    decoratedConfigs: decoratedConfigs,
    formConfigs: formConfigs
  };
};

function checkInternalType(internalConfig) {
  invariant(function () {
    if (!Object.getOwnPropertySymbols) return true;
    var internalSymbol = Symbol["for"]('internal');
    return Object.getOwnPropertySymbols(internalConfig).includes(internalSymbol);
  }, "\u8BF7\u4F7F\u7528list\u6216\u8005group\u51FD\u6570\u5305\u88F9\uFF0C\u4E0D\u8981\u76F4\u63A5\u4F7F\u7528\u5E26\u6709__internal\u524D\u7F00\u7684\u7C7B\u578B\n[ERROR CONFIG]\n".concat(JSON.stringify(internalConfig, null, 4)));
}

function formatGroupConfig(groupConfig, overrideConfig) {
  var overrideInnerConfigs = overrideConfig.config,
      otherConfig = _objectWithoutProperties(overrideConfig, ["config"]);

  var newGroupConfig = _objectSpread2({}, groupConfig, {}, otherConfig, {
    groupName: groupConfig.groupName,
    name: groupConfig.name
  });

  var keyIdxMap = {};

  if (Array.isArray(overrideInnerConfigs) && overrideInnerConfigs.length) {
    overrideInnerConfigs.forEach(function (config, index) {
      return keyIdxMap[config.name] = index;
    });
  } // 如果是group类型，需要改写一下config属性


  newGroupConfig.config = newGroupConfig.config.map(function (fieldConfig) {
    var curIndex = keyIdxMap[fieldConfig.name];
    var overrideFieldConfig = curIndex !== undefined ? get_1(overrideInnerConfigs, "[".concat(curIndex, "]"), {}) : {};
    return formatFieldConfig({
      overrideConfig: overrideFieldConfig
    })(fieldConfig);
  });
  return newGroupConfig;
}

function formatListConfig(listConfig, overrideConfig) {
  var overrideRepeatConfig = overrideConfig.repeatConfig,
      otherConfig = _objectWithoutProperties(overrideConfig, ["repeatConfig"]);

  var newListConfig = _objectSpread2({}, listConfig, {}, otherConfig, {
    listName: listConfig.listName,
    name: listConfig.name
  });

  if (overrideRepeatConfig) {
    newListConfig.repeatConfig = formatFieldConfig({
      overrideConfig: overrideRepeatConfig
    })(listConfig.repeatConfig);
  }

  return newListConfig;
}

function formatFieldConfig(params) {
  var overrideConfig = params.overrideConfig;
  return function (fieldConfig) {
    var narrowMeldConfig = _objectSpread2({
      /** default values */
      fieldProps: {}
    }, fieldConfig, {}, overrideConfig);

    return narrowMeldConfig;
  };
}

function getDecoratedLabel(label, params) {
  var _params$addColon = params.addColon,
      addColon = _params$addColon === void 0 ? false : _params$addColon,
      fieldName = params.fieldName,
      _params$filedIndex = params.filedIndex,
      filedIndex = _params$filedIndex === void 0 ? 0 : _params$filedIndex; // @ts-ignore

  var _label = label;

  if (fieldName && typeof label === 'function') {
    _label = label(fieldName, filedIndex);
  }

  if (!_label) return undefined;
  if (!addColon) return _label;
  var hasColon = /[:：]$/.test(_label);
  return !hasColon ? _label + '：' : _label;
}

var NODE_ENV = get_1(window._global, 'nodeEnv', 'prod');
var useUpdateTimes = function useUpdateTimes(enabled, name) {
  var updateTimes = React.useRef(0);
  React.useEffect(function () {
    if (NODE_ENV !== 'prod' && enabled) {
      console.log("[LOG] render ".concat(name, " ").concat(++updateTimes.current, " times"));
    }
  });
};

/**
 * 如果想要将一些字段按组进行归类，可以通过使用`group`方法，同时指定`groupName`来
 * 合并一些字段，同时，还能通过`groupTitle`渲染出一个通过设置`collapse: true`来
 * 渲染一个支持折叠的表单域组。
 *
 * **BTW: 如果要覆盖这个配置，请使用`overrideGroupConfig`函数包裹需要重写的配置
 * 然后添加到`overrideConfigs`属性中**
 */

var group = function group(groupConfig) {
  reportInvalidProperties(groupConfig);
  var internalGeneratorSymbol = Symbol["for"]('internal');
  return _objectSpread2({
    collapse: false
  }, groupConfig, _defineProperty({
    name: groupConfig.groupName,
    type: '__internal_group__'
  }, internalGeneratorSymbol, true));
};

function reportInvalidProperties(config) {
  // 校验List中的config是否合规
  invariant(function () {
    return !isNil_1(config.groupName);
  }, '缺少groupName属性');
  invariant(function () {
    return !isNil_1(config.config);
  }, '缺少config属性'); // @ts-ignore

  invariant(function () {
    return isNil_1(config.label);
  }, '不存在label属性，你可能是想要试试groupTitle属性');
}

/**
 * 调用这个构造函数，能够方便地让EasyForm渲染一个列表形式的form表单，比如渲染一个sku表单
 * **一般情况下不会出现key不唯一的错误提示，如果出现了，请使用getRepeatKey方法来渲染唯一的key**
 *
 * 请务必指定`repeatTrigger`，这个方法要求返回一个组件，并且组件需要预留位置给children，以
 * 便组件通过children加载list，同时，这个方法还有一些很实用的方法来帮助控制渲染列表。
 *
 * **BTW: 如果要覆盖这个配置，请使用`overrideGroupConfig`函数包裹需要重写的配置
 * 然后添加到`overrideConfigs`属性中**
 */

var list = function list(listConfig) {
  reportInvalidProperties$1(listConfig);
  var internalGeneratorSymbol = Symbol["for"]('internal');
  return _objectSpread2({}, listConfig, _defineProperty({
    name: listConfig.listName,
    type: '__internal_list__'
  }, internalGeneratorSymbol, true));
};

function reportInvalidProperties$1(config) {
  invariant(function () {
    return !isNil_1(config.listName);
  }, '缺少listName属性');
  invariant(function () {
    return !isNil_1(config.repeatConfig);
  }, '缺少repeatTrigger属性'); // 校验List中的config是否合规

  invariant(function () {
    return isNil_1(config.repeatConfig.watch);
  }, 'list包裹的配置中，不能使用watch，因为在list数组中，这么做可能会导致form value出错');
}

var presetKey = 'value';
var supportPrimitiveType = ['number', 'string', 'boolean'];
function changeValueAdaptor(input, specificKey) {
  // 如果输入是基本类型，就直接返回
  if (supportPrimitiveType.some(function (type) {
    return _typeof(input) === type;
  })) return input;
  if (Array.isArray(input)) return input;
  var changeValue = get_1(input, specificKey || presetKey);

  if (!changeValue) {
    if (input instanceof Event || Object.keys(input).includes('target')) {
      // 如果是合成事件或者是eventTarget
      var target = input.target;
      if (target) return get_1(target, specificKey || presetKey);
    }
  }

  return changeValue || input;
}

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


  var convertValues = React.useMemo(function () {
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
  var handleChange = React.useCallback(function (timeArr, chooseDays) {
    onChange && onChange([timeArr, chooseDays]);
  }, [onChange]);
  return React.createElement(zent.DateRangeQuickPicker, _extends({
    format: formatTemp,
    preset: presetDays
  }, passiveProps, {
    chooseDays: convertValues[1],
    value: convertValues[0],
    onChange: handleChange
  }));
};

var CheckboxGroup = zent.Checkbox.Group;

var CheckboxType = function CheckboxType(props) {
  var value = props.value,
      onChange = props.onChange,
      options = props.options,
      passiveProps = _objectWithoutProperties(props, ["value", "onChange", "options"]);

  var handleChange = React.useCallback(function (values) {
    onChange && onChange(values);
  }, [onChange]);
  /* istanbul ignore next */

  if (!options || !options.length) {
    return null;
  }

  return React.createElement(CheckboxGroup, _extends({}, passiveProps, {
    value: value,
    onChange: handleChange
  }), options.map(function (opt) {
    return React.createElement(zent.Checkbox, {
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

  var isMultiLineRadio = React.useMemo(function () {
    return options.some(function (opt) {
      return (opt.desc || opt.description) !== undefined;
    });
  }, [options]);
  var handleChange = React.useCallback(function (evt) {
    if (onChange) {
      onChange(evt.target.value);
    }
  }, [onChange]);

  if (!options || !options.length) {
    return null;
  }

  return React.createElement(RadioGroup, _extends({}, passiveProps, {
    value: value,
    onChange: handleChange,
    disabled: parentDisabledType,
    readOnly: parentReadOnlyType,
    className: cx('easy-filter__field radio-group', className, {
      'multi-line': isMultiLineRadio
    })
  }), options.map(function (opt) {
    var description = opt.desc || opt.description;
    return React.createElement("div", {
      key: opt.value,
      className: "radio-item__container"
    }, React.createElement(zent.Radio, {
      value: opt.value,
      readOnly: parentReadOnlyType || opt.readOnly || false,
      disabled: parentDisabledType || opt.disabled || false
    }, opt.text), description ? React.createElement("p", {
      className: "radio-item__description"
    }, description) : null);
  }));
};

var SelectType = function SelectType(props) {
  var value = props.value,
      onChange = props.onChange,
      options = props.options,
      passiveProps = _objectWithoutProperties(props, ["value", "onChange", "options"]);

  var _React$useState = React.useState([]),
      _React$useState2 = _slicedToArray(_React$useState, 2),
      internalOpts = _React$useState2[0],
      setOpts = _React$useState2[1];

  var handleChange = React.useCallback(function (evt) {
    onChange && onChange(evt.target.value);
  }, [onChange]);
  React.useEffect(function () {
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
  return React.createElement(zent.Select, _extends({}, passiveProps, {
    data: internalOpts,
    value: value,
    onChange: handleChange
  }));
};

var FieldValue = zent.Form.FieldValue;

var ColorBoard = zent.ColorPicker.ColorBoard;
var EasyFormColorPicker = function EasyFormColorPicker(props) {
  var value = props.value,
      onChange = props.onChange,
      _props$displayType = props.displayType,
      displayType = _props$displayType === void 0 ? 'simple' : _props$displayType,
      restProps = _objectWithoutProperties(props, ["value", "onChange", "displayType"]);

  var inheritProps = React.useMemo(function () {
    return _objectSpread2({
      value: value,
      onChange: onChange
    }, restProps);
  }, [onChange, restProps, value]);
  if (displayType === 'board') return React.createElement(ColorBoard, inheritProps);
  return React.createElement(zent.ColorPicker, inheritProps);
};

var EasyFormSwitch = function EasyFormSwitch(props) {
  var value = props.value,
      restProps = _objectWithoutProperties(props, ["value"]);

  return React.createElement(zent.Switch, _extends({}, restProps, {
    checked: value
  }));
};

function isOptionsRequiredType(config) {
  var res = ['Select', 'Checkbox', 'Radio'].includes(config.type);

  if (res) {
    invariant(function () {
      return !isNil_1(config.options);
    }, "\u7C7B\u578B".concat(config.type, "\u7684options\u5C5E\u6027\u4E0D\u80FD\u4E3A\u7A7A"));
  }

  return res;
}

var useField = zent.Form.useField;
var UseDirectlyComponentMap = {
  Checkbox: CheckboxType,
  ColorPicker: EasyFormColorPicker,
  DatePicker: zent.DatePicker,
  DateRangePicker: zent.DateRangePicker,
  DateRangeQuickPicker: DateRangeQuickPickerType,
  Input: zent.Input,
  MonthPicker: zent.MonthPicker,
  NumberInput: zent.NumberInput,
  QuarterPicker: zent.QuarterPicker,
  Radio: RadioType,
  Select: SelectType,
  Switch: EasyFormSwitch,
  TimePicker: zent.TimePicker,
  TimeRangePicker: zent.TimeRangePicker,
  WeekPicker: zent.WeekPicker
};

var FormDescription = function FormDescription(props) {
  if (props.description !== undefined) return React.createElement("p", {
    className: "easy-form description-content"
  }, props.description);
  return null;
};

var EasyFormNormalFieldRender = function EasyFormNormalFieldRender(props) {
  var addColon = props.addColon,
      valueRef = props.model,
      statusRef = props.statusModel,
      fieldConfig = props.config,
      formChangeCallback = props.onChange,
      _props$disabled = props.disabled,
      forceDisabled = _props$disabled === void 0 ? false : _props$disabled;

  var validateOccasion = fieldConfig.validateOccasion,
      validators = fieldConfig.validators,
      restFieldConfig = _objectWithoutProperties(fieldConfig, ["validateOccasion", "validators"]);

  var valueModel = useField(valueRef);
  var statusModel = useField(statusRef); // 使用包裹函数包裹一下然后初始化validators

  if (valueModel.validators.length === 0) {
    valueModel.validators = initValidators(validators, statusModel);
  }

  var normalFieldCls = React.useMemo(function () {
    return cx('easy-form normal-field', {
      'field-error': valueModel.error !== null
    });
  }, [valueModel.error]);
  /** props和status与value的更新频率不尽相同，所以这里隔离开来缓存，减少更新频次 */

  var _React$useMemo = React.useMemo(function () {
    return statusModel.value;
  }, [statusModel.value]),
      disabled = _React$useMemo.disabled,
      visible = _React$useMemo.visible,
      curProps = _objectWithoutProperties(_React$useMemo, ["disabled", "visible"]);

  var setFieldChangeState = React.useCallback(function (execValidators) {
    valueModel.isTouched = true; // 重新校验

    var needValidate =
    /** 是否需要重新校验 */
    execValidators ||
    /** 或是已经校验过并且报错*/
    valueModel.error !== null;
    needValidate && valueModel.validate();
  }, [valueModel]);
  var handleValueChange = React.useCallback(function (input) {
    var nextFieldValue = changeValueAdaptor(input);
    var prevValue = valueModel.getRawValue();

    if (prevValue !== nextFieldValue) {
      valueModel.value = nextFieldValue;
      setFieldChangeState(validateOccasion === zent.ValidateOccasion.Change); // 通知上层，触发watch函数

      formChangeCallback(restFieldConfig.name, nextFieldValue);
      restFieldConfig.onChange && restFieldConfig.onChange(nextFieldValue);
    }
  }, [valueModel, setFieldChangeState, validateOccasion, formChangeCallback, restFieldConfig]);
  var handleFieldBlur = React.useCallback(function () {
    setFieldChangeState(validateOccasion === zent.ValidateOccasion.Blur);
  }, [setFieldChangeState, validateOccasion]);
  /**
   * 需要额外添加的属性
   */

  var addonProps = React.useMemo(function () {
    var _addonProps = {};

    if (isOptionsRequiredType(restFieldConfig)) {
      _addonProps.options = restFieldConfig.options;
    }

    return _addonProps;
  }, [restFieldConfig]);
  var FieldContentComponent = React.useMemo(function () {
    if (restFieldConfig.type === 'Custom') {
      invariant(function () {
        return restFieldConfig.renderField !== undefined;
      }, "config.name\u4E3A".concat(restFieldConfig.name, "\u7684renderField\u4E0D\u80FD\u4E3A\u7A7A"));
      return restFieldConfig.renderField;
    } else {
      // @ts-ignore
      return UseDirectlyComponentMap[restFieldConfig.type] || null;
    }
  }, [restFieldConfig]);
  /** 如果不存在目标组件，就不展示这个内容 */

  if (!FieldContentComponent) {
    console.warn("\u4E0D\u5B58\u5728\u5B57\u6BB5\u4E3A".concat(restFieldConfig.name, "\uFF0C\u7C7B\u578B\u4E3A").concat(restFieldConfig.type, "\u7684\u7EC4\u4EF6\uFF0C\u5982\u679C\u4E3A\"Custom\"\u7C7B\u578B\uFF0C\u8BF7\u786E\u8BA4\u58F0\u660E\u4E86\"renderField\"\u65B9\u6CD5"));
    return null;
  }

  return React.createElement("div", {
    "data-testid": "easy-form-field-".concat(fieldConfig.name),
    className: normalFieldCls
  }, visible ? React.createElement(zent.FormControl, _extends({}, restFieldConfig.fieldProps || {}, {
    required: restFieldConfig.required
    /** label不能被覆盖 */
    ,
    label: getDecoratedLabel(restFieldConfig.label, {
      addColon: addColon
    }),
    invalid: !!valueModel.error
  }), React.createElement("div", {
    className: "easy-form normal-field__content"
  }, fieldConfig.prefix || null, React.createElement(FieldContentComponent, _extends({}, addonProps, curProps, {
    value: valueModel.value,
    disabled: forceDisabled || disabled,
    onChange: handleValueChange,
    onBlur: handleFieldBlur
  })), fieldConfig.suffix || null), React.createElement(FormDescription, {
    description: restFieldConfig.helpDesc
  }), valueModel.error && React.createElement(zent.FormError, {
    className: "easy-form error-content"
  }, valueModel.error.message)) : null);
};

var EasyFormGroupFieldRender = function EasyFormGroupFieldRender(props) {
  var addColon = props.addColon,
      valueRef = props.model,
      statusRef = props.statusModel,
      groupConfig = props.config,
      formChangeCallback = props.onChange;

  var _React$useState = React.useState(groupConfig.collapse ? 'expand' : 'disabled'),
      _React$useState2 = _slicedToArray(_React$useState, 2),
      collapseState = _React$useState2[0],
      setCollapseState = _React$useState2[1];

  var groupStatus = React.useMemo(function () {
    var selfStatusModel = statusRef.get('self');
    if (!selfStatusModel) return {};
    return selfStatusModel.getRawValue();
  }, [statusRef]);
  /**
   * group类型中，通知key改变应该再做一层包裹，用于命中对应的订阅器，比如：
   * groupName: foo, (改变的)name: boo，则正确的key为foo.boo，则触发
   * watch函数为foo.boo的函数，修改则是model.get(foo).get(boo).value
   */

  var handleGroupChange = React.useCallback(function (key, value) {
    var updateKey = "".concat(groupConfig.groupName, ".").concat(key);
    formChangeCallback(updateKey, value);
    var newGroupValues = valueRef.getRawValue();
    formChangeCallback(groupConfig.groupName, newGroupValues);
    groupConfig.onChange && groupConfig.onChange(newGroupValues);
  }, [groupConfig, formChangeCallback, valueRef]);
  var configChildren = React.useMemo(function () {
    return groupConfig.config;
  }, [groupConfig.config]);
  var collapseCls = React.useMemo(function () {
    if (['expand', 'collapse'].includes(collapseState)) {
      return "group-".concat(collapseState);
    }

    return undefined;
  }, [collapseState]);
  var toggleCollapseState = React.useCallback(function () {
    return setCollapseState(function (prevState) {
      if (prevState === 'collapse') return 'expand';else return 'collapse';
    });
  }, []);
  /** 如果不存在model，就返回null */

  if (!valueRef) return null;
  return React.createElement("div", {
    "data-testid": "easy-form-group-field",
    className: "easy-form group-field"
  }, !groupConfig.hideGroupHeader && React.createElement("div", {
    className: "easy-form group-field__header"
  }, React.createElement("div", {
    className: "easy-form group-field__group-title"
  }, groupConfig.groupTitle), collapseState !== 'disabled' && React.createElement("div", {
    className: "easy-form group-field__collapse-trigger",
    onClick: toggleCollapseState
  }, React.createElement("span", {
    className: "easy-form group-field__collapse-text"
  }, collapseState === 'expand' ? '收起' : '展开'), React.createElement(zent.Icon, {
    className: "easy-form group-field__collapse-icon",
    type: collapseState === 'expand' ? 'up' : 'down'
  }))), React.createElement("div", {
    className: cx('easy-form group-field__body', collapseCls)
  }, configChildren && configChildren.length ? configChildren.map(function (childConfig) {
    var curValueModel = valueRef.get(childConfig.name);
    var curStatusModel = statusRef.get(childConfig.name);
    if (!curValueModel) return null;
    return React.createElement(EasyFormNormalFieldRender, _extends({}, groupStatus, {
      addColon: addColon,
      config: childConfig,
      key: childConfig.name,
      model: curValueModel,
      onChange: handleGroupChange,
      statusModel: curStatusModel
    }));
  }) : null));
};

var useFieldArray = zent.Form.useFieldArray;
var EasyFormListFieldRender = function EasyFormListFieldRender(props) {
  var addColon = props.addColon,
      valueRef = props.model,
      statusRef = props.statusModel,
      listConfig = props.config,
      formChangeCallback = props.onChange;
  var listModels = useFieldArray(valueRef);
  var listStatus = React.useMemo(function () {
    return statusRef.getRawValue();
  }, [statusRef]);
  var RepeatTriggerNode = React.useMemo(function () {
    return listConfig.repeatTrigger;
  }, [listConfig.repeatTrigger]);
  var getListItemKey = React.useCallback(function (index) {
    if (listConfig.getRepeatKey) return listConfig.getRepeatKey(listConfig.listName, index);
    return listConfig.listName + index;
  }, [listConfig]);
  var handleListChange = React.useCallback(function (modifyIdx) {
    return function (_, value) {
      if (modifyIdx !== undefined) {
        var modifiedKey = "".concat(listConfig.listName, "[").concat(modifyIdx, "]");
        formChangeCallback(modifiedKey, value);
      }

      var newListValues = listModels.getRawValue();
      formChangeCallback(listConfig.listName, newListValues);
      listConfig.onChange && listConfig.onChange(newListValues);
    };
  }, [formChangeCallback, listConfig, listModels]);
  var addListItems = React.useCallback(function (addCount, presetValue) {
    var itemConfigTpl = listConfig.repeatConfig;
    if (presetValue) itemConfigTpl.defaultValue = presetValue;
    var addonItems = new Array(addCount || 1).fill(initModelValue(itemConfigTpl));
    listModels.push.apply(listModels, _toConsumableArray(addonItems));
    handleListChange()();
  }, [handleListChange, listConfig.repeatConfig, listModels]);
  var deleteItems = React.useCallback(function (deleteCount, startIndex) {
    if (deleteCount === undefined && startIndex === undefined) listModels.pop();else listModels.splice(startIndex || 0, deleteCount || 1);
    handleListChange()();
  }, [handleListChange, listModels]);
  return React.createElement("div", {
    "data-testid": "easy-form-list-field",
    className: "easy-form list-field"
  }, React.createElement(RepeatTriggerNode, _extends({}, listConfig.fieldProps, listStatus, {
    label: getDecoratedLabel(listConfig.label, {
      addColon: addColon
    }),
    methods: {
      add: addListItems,
      "delete": deleteItems
    }
  }), listModels.children.map(function (listChildModel, index) {
    var listChildConfig = listConfig.repeatConfig || {};

    var config = _objectSpread2({}, listChildConfig, {
      label: getDecoratedLabel(listChildConfig.label, {
        addColon: addColon,
        fieldName: listConfig.listName,
        filedIndex: index
      })
    });

    return React.createElement(EasyFormNormalFieldRender, _extends({}, listStatus, {
      addColon: addColon,
      config: config,
      key: getListItemKey(index),
      model: listChildModel,
      onChange: handleListChange(index),
      statusModel: statusRef
    }));
  })));
};

var RenderField = function RenderField(props) {
  var addColon = props.addColon,
      config = props.config,
      valueForm = props.valueForm,
      statusForm = props.statusForm,
      onChange = props.onChange;
  var valueModel = valueForm.model.get(config.name);
  var statusModel = statusForm.model.get(config.name);

  var _React$useMemo = React.useMemo(function () {
    return {
      isNormalConfig: !['__internal_list__', '__internal_group__'].includes(config.type),
      isListConfig: config.type === '__internal_list__',
      isGroupConfig: config.type === '__internal_group__'
    };
  }, [config.type]),
      isNormalConfig = _React$useMemo.isNormalConfig,
      isGroupConfig = _React$useMemo.isGroupConfig,
      isListConfig = _React$useMemo.isListConfig;

  if (!valueModel) return null;
  return React.createElement("div", {
    "data-testid": "easy-form-field-render",
    className: "easy-form form-field"
  }, isNormalConfig && React.createElement(EasyFormNormalFieldRender, {
    config: config,
    onChange: onChange,
    addColon: addColon,
    model: valueModel,
    statusModel: statusModel
  }), isListConfig && React.createElement(EasyFormListFieldRender, {
    addColon: addColon,
    onChange: onChange,
    config: config,
    model: valueModel,
    statusModel: statusModel
  }), isGroupConfig && React.createElement(EasyFormGroupFieldRender, {
    addColon: addColon,
    onChange: onChange,
    config: config,
    model: valueModel,
    statusModel: statusModel
  }));
};

function executeModelValidators(model) {
  if (model.validators.length) {
    model.isTouched = true;
    model.validate();
  }
}

function updateModel(valueModel, statusModel, payload, notice) {
  var prevValue = valueModel.getRawValue();
  var prevStatus = statusModel.getRawValue();
  notice(prevValue, payload);
  var value = payload.value,
      status = payload.status,
      props = payload.props;
  if (!isNil_1(value) && prevValue !== value) valueModel.patchValue(value);

  if (!isNil_1(status) || !isNil_1(props)) {
    var dumpStatus = status || {};
    var dumpProps = props || {};
    statusModel.patchValue(_objectSpread2({}, prevStatus, {}, dumpStatus, {}, dumpProps));
  }

  executeModelValidators(valueModel);
}

var useFormWatches = function useFormWatches(params) {
  var formConfigs = params.config,
      formInstance = params.formInstance,
      formStatusInstance = params.formStatusInstance;
  var keyWatchListCacheMap = React.useRef(new Map());
  var getCurrentModel = React.useCallback(function (pattern) {
    var type = pattern.type;

    if (type === 'normal') {
      var definitelyPath = pattern.path[0];
      return {
        value: formInstance.model.get(definitelyPath),
        status: formStatusInstance.model.get(definitelyPath)
      };
    } else if (type === 'group') {
      var _ref = pattern.path,
          _ref2 = _slicedToArray(_ref, 2),
          outerPath = _ref2[0],
          innerPath = _ref2[1];

      var valueSetModel = formInstance.model.get(outerPath);
      var statusSetModel = formStatusInstance.model.get(outerPath);
      return {
        value: valueSetModel.get(innerPath),
        status: statusSetModel.get(innerPath)
      };
    }

    return null;
  }, [formInstance.model, formStatusInstance.model]); // 获取相关监听的watches

  var getRelatedWatches = React.useCallback(function (key) {
    var watchList = [];
    formConfigs.forEach(function (config) {
      if (config.type === '__internal_group__') {
        var _config$config = config.config,
            groupInnerConfig = _config$config === void 0 ? [] : _config$config;
        groupInnerConfig.forEach(function (innerConfig) {
          var res = getCurrentWatchFromConfig(key, innerConfig);

          if (res !== null) {
            var _res = _slicedToArray(res, 2),
                watcher = _res[0],
                innerKey = _res[1];

            watchList.push([watcher, "".concat(config.name, ".").concat(innerKey)]);
          }
        });
      } else {
        var res = getCurrentWatchFromConfig(key, config);
        if (res !== null) watchList.push(res);
      }
    });
    return watchList;
  }, [formConfigs]);
  var ctxSetMethod = React.useCallback(function (valueModel, statusModel, notice) {
    return function (payload) {
      updateModel(valueModel, statusModel, payload, notice);
    };
  }, []);
  var handleValueChange = React.useCallback(function (key, value) {
    var watchList = keyWatchListCacheMap.current.get(key);

    if (!watchList) {
      watchList = getRelatedWatches(key);
      keyWatchListCacheMap.current.set(key, watchList);
    }

    var pathPattern = modelPathGetter(key);
    invariant(function () {
      return pathPattern.type !== 'invalid';
    }, "".concat(key, "\u4E0D\u662F\u5408\u6CD5\u7684\u76D1\u542C\u5BF9\u8C61\uFF0C\u8BF7\u6CE8\u610F\u683C\u5F0F\u53EA\u80FD\u4E3A\u4E00\u4E0B\u4E09\u79CD\u4E2D\u7684\u4E00\u79CD\uFF1A\n1. foo\n2. foo.boo\n3. foo[index]"));

    if (watchList.length) {
      watchList.forEach(function (_ref3) {
        var _ref4 = _slicedToArray(_ref3, 2),
            watchFunc = _ref4[0],
            targetKey = _ref4[1];

        var targetPathPattern = modelPathGetter(targetKey);
        var curModel = getCurrentModel(targetPathPattern);

        if (invariant(function () {
          return !isNil_1(curModel);
        }, "\u627E\u4E0D\u5230\u8981\u76D1\u542C\u7684\u5BF9\u8C61".concat(targetKey))) {
          var curValue;
          var nextPayload = {};

          var notice = function notice(prevValue, input) {
            curValue = prevValue;
            nextPayload = input || {};
          };

          var valueModel = curModel.value,
              statusModel = curModel.status;
          watchFunc(value, {
            set: ctxSetMethod(valueModel, statusModel, notice)
          }, formInstance);
          logModelChange({
            from: key,
            target: targetKey,
            watchValue: value,
            curValue: curValue,
            nextPayload: nextPayload
          });
        }
      });
    }
  }, [ctxSetMethod, formInstance, getCurrentModel, getRelatedWatches]);
  return {
    handleValueChange: handleValueChange
  };
};

function getCurrentWatchFromConfig(key, config) {
  var watch = config.watch,
      normalName = config.name;
  if (!watch) return null;
  var ownWatchKeys = Object.keys(watch);

  if (ownWatchKeys.includes(key)) {
    return [watch[key], normalName];
  }

  return null;
} // 需要支持foo.boo和foo[1]这样的运算


var defaultPattern = {
  type: 'invalid',
  path: null
};

function modelPathGetter(key) {
  var pathPattern = _objectSpread2({}, defaultPattern);

  var groupMatch = key.match(/^([^\s]+)\.([^\s]+)/);
  var listMatch = key.match(/^([^\s]+)\[(\d+)\]/);

  if (groupMatch) {
    // 是对象匹配
    pathPattern.type = 'group';
    pathPattern.path = [groupMatch[1], groupMatch[2]];
  } else if (listMatch) {
    var numberedRes = Number(listMatch[2]); // 第二个参数必须得是数字

    if (Number.isNaN(numberedRes)) return defaultPattern; // 匹配数组

    pathPattern.type = 'list';
    pathPattern.path = [listMatch[1], numberedRes];
  } else {
    pathPattern.type = 'normal';
    pathPattern.path = [key];
  }

  var res = invariant(function () {
    return pathPattern.path !== null && pathPattern.path.length <= 2;
  }, 'watch最多支持监听数据的嵌套层数为2层');
  if (!res) return defaultPattern;
  return pathPattern;
}

function logModelChange(params) {
  if (YZ_NODE_ENV !== 'prod') {
    var from = params.from,
        target = params.target,
        watchValue = params.watchValue,
        curValue = params.curValue,
        nextPayload = params.nextPayload;
    console.group("[FIRE WATCH] ".concat(target, " <-- ").concat(from));
    console.log('%c watch value', 'font-weight: bolder; color: grey', watchValue);
    console.log('%c current value', 'font-weight: bolder; color: green', curValue);
    console.log('%c next payload', 'font-weight: bolder; color: lightblue', nextPayload);
    console.groupEnd();
  }
}

var useForm = zent.Form.useForm,
    ValidateOption = zent.Form.ValidateOption;
var EasyFormRenderer = React.forwardRef(function EasyFormRendererWithRef(props, easyFormRef) {
  useUpdateTimes(true, 'EasyForm');

  var _props$addColon = props.addColon,
      addColon = _props$addColon === void 0 ? true : _props$addColon,
      children = props.children,
      config = props.config,
      _props$overrideConfig = props.overrideConfigs,
      overrideConfigs = _props$overrideConfig === void 0 ? {} : _props$overrideConfig,
      _props$preview = props.preview,
      preview = _props$preview === void 0 ? false : _props$preview,
      _props$renderSubmit = props.renderSubmit,
      renderSubmit = _props$renderSubmit === void 0 ? true : _props$renderSubmit,
      _props$scrollToError = props.scrollToError,
      scrollToError = _props$scrollToError === void 0 ? true : _props$scrollToError,
      _props$splitVM = props.splitVM,
      splitVM = _props$splitVM === void 0 ? false : _props$splitVM,
      onError = props.onError,
      propsSubmitHandler = props.onSubmit,
      restFormProps = _objectWithoutProperties(props, ["addColon", "children", "config", "overrideConfigs", "preview", "renderSubmit", "scrollToError", "splitVM", "onError", "onSubmit"]);

  if (isNil_1(config)) {
    throw new Error('EasyForm.config不能为空');
  }

  var _useFormConfigs = useFormConfigs({
    config: config,
    overrideConfigs: overrideConfigs
  }),
      valueBuilder = _useFormConfigs.valueBuilder,
      statusBuilder = _useFormConfigs.statusBuilder,
      decoratedConfigs = _useFormConfigs.decoratedConfigs,
      formConfigs = _useFormConfigs.formConfigs;

  var formStatusInstance = useForm(statusBuilder);
  var formInstance = useForm(valueBuilder);

  var _useFormWatches = useFormWatches({
    config: formConfigs,
    formInstance: formInstance,
    formStatusInstance: formStatusInstance
  }),
      handleValueChange = _useFormWatches.handleValueChange; // 重写patchValue方法，添加触发watch的时机


  var easyFormPatchValues = React.useCallback(function (newValues) {
    var invokeWatch = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
    var updatedValues = newValues;
    var valueKeys = Object.keys(newValues);

    if (invokeWatch && valueKeys.length) {
      var walker = propWalker(function (v) {
        return !isObjectLike_1(v);
      });
      var modifiedKeys = [];
      valueKeys.forEach(function (key) {
        var modifiedKey = walker(key, newValues[key]);
        modifiedKey && modifiedKeys.push(modifiedKey);
      });
      modifiedKeys.forEach(function (modifiedKey) {
        var newValue = get_1(newValues, modifiedKey[0]);
        handleValueChange(modifiedKey[0], newValue);
      });
      updatedValues = merge_1(formInstance.getValue(), newValues);
    }

    formInstance.patchValue(updatedValues);
  }, [formInstance, handleValueChange]);
  var formRef = React.useMemo(function () {
    return {
      zentForm: formInstance,
      easyForm: {
        patchValue: easyFormPatchValues
      }
    };
  }, [easyFormPatchValues, formInstance]);
  React.useImperativeHandle(easyFormRef, function () {
    return formRef;
  }); // 包裹submit fail组件，添加scroll2error 兼容

  var handleScrollToError = React.useCallback(function () {
    if (scrollToError) {
      var firstErrorEle = document.querySelector('.field-error');

      if (firstErrorEle) {
        firstErrorEle.scrollIntoView(true);
      }
    }
  }, [scrollToError]);
  var handleSubmit = React.useCallback(function () {
    formInstance.validate(ValidateOption.IncludeUntouched).then(function (maybeError) {
      var thereHasError = hasError(maybeError);

      if (thereHasError) {
        onError && onError(maybeError);
        handleScrollToError();
      } else propsSubmitHandler(formRef);
    });
  }, [formInstance, formRef, handleScrollToError, onError, propsSubmitHandler]); // 如果是视图数据完全分离的模式

  React.useEffect(function () {
    invariant(function () {
      return !(splitVM && children);
    }, 'splitVM模式下，EasyForm.children不能为空');
  }, [children, splitVM]);
  return React.createElement("div", {
    "data-testid": "easy-form-container",
    className: "easy-form form-container"
  }, React.createElement(zent.Form, _extends({
    layout: "horizontal"
  }, restFormProps, {
    form: formInstance,
    scrollToError: scrollToError
  }), splitVM ? children : decoratedConfigs.map(function (fieldConfig, index) {
    if (fieldConfig.type === 'Plain') {
      return React.createElement("div", {
        key: "plain-".concat(index),
        className: "easy-form form-field__plain"
      }, fieldConfig.node);
    }

    return React.createElement(RenderField, {
      addColon: addColon,
      config: fieldConfig,
      key: fieldConfig.name,
      onChange: handleValueChange,
      statusForm: formStatusInstance,
      valueForm: formInstance
    });
  }), !!renderSubmit && React.createElement("div", {
    className: "easy-form form-submit-box"
  }, typeof renderSubmit === 'function' ? renderSubmit(handleSubmit, formRef) : React.createElement(zent.Button, {
    type: "primary",
    onClick: handleSubmit
  }, "\u63D0\u4EA4"))), React.createElement("div", {
    className: "easy-form form-previewer"
  }, preview && React.createElement(EasyFormPreview, {
    form: formInstance,
    statusForm: formStatusInstance
  })));
});

function hasError(maybeError) {
  // 如果不是数组，就直接判断是否有错
  if (!Array.isArray(maybeError)) return !isNil_1(maybeError);
  return maybeError.some(function (curMaybeError) {
    if (Array.isArray(curMaybeError)) {
      return hasError(curMaybeError);
    }

    return !isNil_1(curMaybeError);
  });
}

var EasyForm = {
  EasyFormRenderer: EasyFormRenderer,
  list: list,
  group: group
};

module.exports = EasyForm;
