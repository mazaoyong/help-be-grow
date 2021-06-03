'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = require('react');
var React__default = _interopDefault(React);
var zent = require('zent');
var SortableJS = require('sortablejs');
var SortableJS__default = _interopDefault(SortableJS);

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
var Map = _getNative(_root, 'Map');

var _Map = Map;

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

var DragListBoxWithRef = function DragListBoxWithRef(props) {
  var columns = props.columns,
      children = props.children,
      className = props.className;
  return React__default.createElement("div", {
    className: className
  }, React__default.createElement("div", {
    className: "ebiz-drag-list__content-container"
  }, React__default.createElement("table", null, React__default.createElement("colgroup", null, React__default.createElement("col", {
    style: {
      width: '1rem'
    }
  }), columns.map(function (col, index) {
    var width = col.width || undefined;
    var inlineStyles = {
      width: width || 'auto',
      minWidth: width || 'auto'
    };
    return React__default.createElement("col", {
      key: "col[".concat(col.name || index, "]"),
      style: inlineStyles
    });
  })), children)));
};

var DragListHeaderWithRef = function DragListHeaderWithRef(props) {
  var columns = props.columns,
      className = props.className;
  var tableRef = React__default.useRef(null);
  return React__default.createElement("div", {
    className: className
  }, React__default.createElement("table", {
    ref: tableRef
  }, React__default.createElement("colgroup", null, React__default.createElement("col", {
    style: {
      width: '1rem'
    }
  }), columns.map(function (col, index) {
    var width = col.width || undefined;
    var inlineStyles = {
      width: width || 'auto',
      minWidth: width || 'auto'
    };
    return React__default.createElement("col", {
      key: "col[".concat(col.name || index, "]"),
      style: inlineStyles
    });
  })), React__default.createElement("thead", {
    role: "header"
  }, React__default.createElement("tr", {
    className: "ebiz-drag-list__content-line"
  }, React__default.createElement("th", {
    style: {
      width: '1rem'
    }
  }), columns.map(function (col, index) {
    var title = col.title,
        helpDesc = col.helpDesc,
        name = col.name;
    var HelpNode = null;

    if (helpDesc) {
      HelpNode = React__default.createElement(zent.Pop, {
        trigger: "hover",
        content: helpDesc
      }, React__default.createElement(zent.Icon, {
        style: {
          color: '#C8C9CC',
          fontSize: '16px'
        },
        type: "help-circle"
      }));
    }

    return React__default.createElement("th", {
      key: "header[".concat(name || index, "]"),
      className: "ebiz-drag-list__header-item",
      style: {
        textAlign: col.textAlign || 'left'
      }
    }, React__default.createElement("div", {
      className: "ebiz-drag-list__content-item ebiz-drag-content"
    }, HelpNode ? React__default.createElement("div", {
      className: "ebiz-drag-list__with-help"
    }, React__default.createElement("span", null, title), React__default.createElement("span", null, HelpNode)) : title));
  })))));
};

!function (a) {
  var t,
      _o,
      l,
      h,
      i,
      _e,
      v = '<svg><symbol id="icon-remove" viewBox="0 0 1024 1024"><path d="M896 256v85.333h-85.333V896A42.667 42.667 0 0 1 768 938.667H256A42.667 42.667 0 0 1 213.333 896V341.333H128V256h768z m-170.667 85.333H298.667v512h426.666v-512z m-256 128v256H384v-256h85.333z m170.667 0v256h-85.333v-256H640zM725.333 128v85.333H298.667V128h426.666z"  ></path></symbol><symbol id="icon-move-up" viewBox="0 0 1024 1024"><path d="M512 170.667a341.333 341.333 0 1 0 0 682.666 341.333 341.333 0 0 0 0-682.666z m0 768C276.352 938.667 85.333 747.648 85.333 512S276.352 85.333 512 85.333 938.667 276.352 938.667 512 747.648 938.667 512 938.667zM469.333 768h85.334V431.061L695.38 571.733l60.331-60.33-243.499-243.499-243.498 243.499 60.33 60.33 140.288-140.245V768z"  ></path></symbol><symbol id="icon-move-down" viewBox="0 0 1024 1024"><path d="M512 853.333a341.333 341.333 0 1 0 0-682.666 341.333 341.333 0 0 0 0 682.666z m0-768c235.648 0 426.667 191.019 426.667 426.667S747.648 938.667 512 938.667 85.333 747.648 85.333 512 276.352 85.333 512 85.333zM554.667 256h-85.334v336.939L328.62 452.267l-60.331 60.33 243.499 243.499 243.498-243.499-60.33-60.33-140.288 140.245V256z"  ></path></symbol><symbol id="icon-classhour-hand" viewBox="0 0 1024 1024"><path d="M320 106.688V192c0 23.552 19.072 42.688 42.688 42.688H704A42.688 42.688 0 0 0 746.688 192V106.688H832c23.552 0 42.688 19.072 42.688 42.624v725.376a42.688 42.688 0 0 1-42.688 42.624H234.688A42.688 42.688 0 0 1 192 874.688V149.312c0-23.552 19.072-42.624 42.688-42.624H320z m256 426.624H362.688v85.376H576V533.312z m128-170.624H362.688V448H704V362.688zM666.688 64c20.608 0 37.312 16.704 37.312 37.312v61.888a37.312 37.312 0 0 1-37.312 37.312H400a37.312 37.312 0 0 1-37.312-37.312v-61.888c0-20.608 16.64-37.312 37.312-37.312h266.688z"  ></path></symbol><symbol id="icon-classhour" viewBox="0 0 1024 1024"><path d="M384 128l-0.064 85.312H640V128h85.312v85.312h133.376c20.608 0 37.312 16.768 37.312 37.376v650.624a37.312 37.312 0 0 1-37.312 37.376H165.312A37.312 37.312 0 0 1 128 901.312V250.688c0-20.608 16.704-37.376 37.312-37.376h133.312V128H384z m380.416 252.544a27.52 27.52 0 0 0-35.392-1.536L452.928 596.16c-1.6 1.28-6.08 1.472-7.808 0.384L340.672 528.96a26.752 26.752 0 0 0-34.816 5.504l-12.096 14.72a25.856 25.856 0 0 0 2.56 35.2l129.152 125.056a35.2 35.2 0 0 0 48.64 0.64l296.384-286.784a24.832 24.832 0 0 0 0.704-36.16z"  ></path></symbol><symbol id="icon-consumption-hand" viewBox="0 0 1024 1024"><path d="M837.312 64c20.608 0 37.376 16.704 37.376 37.312v582.016a37.312 37.312 0 0 1-17.6 31.616l-304 190.08a37.312 37.312 0 0 1-39.552 0l-304-190.08A37.312 37.312 0 0 1 192 683.328V101.312C192 80.704 208.704 64 229.312 64h608z m-387.84 170.048L389.12 294.4l68.224 68.224H384V448h106.624v42.624H384V576h106.624v85.312H576L575.936 576 682.688 576V490.688H575.936v-42.752L682.688 448V362.688H609.856l68.096-68.096-60.288-60.352-84.096 83.968-84.096-84.16z"  ></path></symbol><symbol id="icon-consumption" viewBox="0 0 1024 1024"><path d="M490.688 64a426.688 426.688 0 1 1 0 853.312A426.688 426.688 0 0 1 490.688 64zM406.784 276.736l-60.352 60.352L414.72 405.312H341.312v85.376L448 490.624v42.688H341.312v85.376L448 618.624 448 704h85.312V618.624H640V533.376H533.312v-42.688H640V405.376H567.168L635.328 337.28l-60.352-60.352L490.88 360.896 406.784 276.736z"  ></path></symbol><symbol id="icon-drag" viewBox="0 0 1024 1024"><path d="M469.333333 256a85.333333 85.333333 0 1 1-85.333333-85.333333 85.333333 85.333333 0 0 1 85.333333 85.333333z m-85.333333 170.666667a85.333333 85.333333 0 1 0 85.333333 85.333333 85.333333 85.333333 0 0 0-85.333333-85.333333z m0 256a85.333333 85.333333 0 1 0 85.333333 85.333333 85.333333 85.333333 0 0 0-85.333333-85.333333z m256-341.333334a85.333333 85.333333 0 1 0-85.333333-85.333333 85.333333 85.333333 0 0 0 85.333333 85.333333z m0 85.333334a85.333333 85.333333 0 1 0 85.333333 85.333333 85.333333 85.333333 0 0 0-85.333333-85.333333z m0 256a85.333333 85.333333 0 1 0 85.333333 85.333333 85.333333 85.333333 0 0 0-85.333333-85.333333z"  ></path></symbol><symbol id="icon-doc" viewBox="0 0 1024 1024"><path d="M619.308558 32.956322h-439.142988C127.353064 32.956322 92.254581 69.867402 92.254581 125.234023v738.221609c0 46.138851 35.098483 92.277701 87.828598 92.277701H795.048144c52.730115 0 87.828598-36.91108 87.828598-92.277701V309.789425H707.137156c-52.730115 0-87.828598-36.91108-87.828598-92.277701V32.956322z"  ></path><path d="M690.906167 41.195402l175.657196 184.555403H690.906167z"  ></path></symbol><symbol id="icon-zantinganniu" viewBox="0 0 1024 1024"><path d="M512 512m-512 0a512 512 0 1 0 1024 0 512 512 0 1 0-1024 0Z" fill="#155BD4" ></path><path d="M597.333333 298.666667m42.666667 0l0 0q42.666667 0 42.666667 42.666666l0 341.333334q0 42.666667-42.666667 42.666666l0 0q-42.666667 0-42.666667-42.666666l0-341.333334q0-42.666667 42.666667-42.666666Z" fill="#F2F3F5" ></path><path d="M384 298.666667m42.666667 0l0 0q42.666667 0 42.666666 42.666666l0 341.333334q0 42.666667-42.666666 42.666666l0 0q-42.666667 0-42.666667-42.666666l0-341.333334q0-42.666667 42.666667-42.666666Z" fill="#F2F3F5" ></path></symbol><symbol id="icon-bofanganniu" viewBox="0 0 1024 1024"><path d="M512 512m-512 0a512 512 0 1 0 1024 0 512 512 0 1 0-1024 0Z" fill="#155BD4" ></path><path d="M695.637333 541.482667l-239.445333 139.690666a34.133333 34.133333 0 0 1-51.328-29.482666V372.309333a34.133333 34.133333 0 0 1 51.328-29.44l239.445333 139.648a34.133333 34.133333 0 0 1 0 58.965334z" fill="#F2F3F5" ></path></symbol><symbol id="icon-wechat" viewBox="0 0 1024 1024"><path d="M810.88 128a85.333333 85.333333 0 0 1 85.333333 85.333333v597.333334a85.333333 85.333333 0 0 1-85.333333 85.333333h-597.333333a85.333333 85.333333 0 0 1-85.333334-85.333333V213.333333a85.333333 85.333333 0 0 1 85.333334-85.333333h597.333333z m-167.168 292.437333c-110.634667 0-198.016 75.946667-198.016 169.045334 0 93.568 87.381333 169.088 198.016 169.088 19.413333 0 38.826667-4.266667 58.197333-9.002667l11.648-2.858667 63.658667 35.114667-17.578667-57.941333c46.549333-34.688 81.237333-81.237333 81.706667-134.4 0-93.056-93.098667-169.045333-197.632-169.045334zM416.298667 246.613333c-127.786667 0-232.746667 87.381333-232.746667 198.016 0 60.330667 31.146667 110.805333 84.053333 150.656l9.045334 6.570667-23.296 69.802667 81.237333-40.832c29.44 5.717333 52.693333 11.861333 81.664 11.861333 7.466667 0 14.506667-0.426667 21.546667-1.322667a176.682667 176.682667 0 0 1-7.04-48.768c0-101.418667 87.381333-183.978667 198.058666-183.978666 7.466667 0 14.933333 0.426667 22.357334 1.322666-20.181333-93.525333-120.32-163.328-234.922667-163.328z m166.4 266.069334a25.472 25.472 0 1 1 0 50.986666 25.472 25.472 0 0 1 0-50.986666z m126.890666 0a25.472 25.472 0 1 1 0 50.986666 25.472 25.472 0 0 1 0-50.986666zM337.664 338.346667a32.426667 32.426667 0 0 1 32.512 32.469333 32.426667 32.426667 0 0 1-32.512 32.512 32.426667 32.426667 0 0 1-32.469333-32.512 32.426667 32.426667 0 0 1 32.469333-32.469333z m165.12 0a32.426667 32.426667 0 0 1 32.469333 32.469333 32.426667 32.426667 0 0 1-32.469333 32.512 32.426667 32.426667 0 0 1-32.512-32.512 32.426667 32.426667 0 0 1 32.512-32.469333z"  ></path></symbol><symbol id="icon-lookup" viewBox="0 0 1024 1024"><path d="M724.821333 512c0 45.44-14.250667 87.466667-38.485333 122.026667l206.805333 206.805333-52.309333 52.309333-206.805333-206.805333A212.864 212.864 0 1 1 724.778667 512z m-114.645333 98.176A138.112 138.112 0 0 0 650.794667 512c0-37.12-14.421333-71.978667-40.618667-98.176A138.112 138.112 0 0 0 512 373.205333c-37.12 0-71.978667 14.421333-98.176 40.618667A138.112 138.112 0 0 0 373.205333 512c0 37.12 14.421333 71.978667 40.618667 98.176a138.112 138.112 0 0 0 98.176 40.618667c37.12 0 71.978667-14.421333 98.176-40.618667z m21.930667 211.797333V896H202.026667A74.24 74.24 0 0 1 128 821.973333V202.026667C128 161.28 161.28 128 202.026667 128h619.946666C862.72 128 896 161.28 896 202.026667v430.634666h-74.026667V202.197333l-0.085333-0.085333H202.197333l-0.085333 0.085333v619.690667l0.085333 0.085333h429.909334z"  ></path></symbol><symbol id="icon-girl" viewBox="0 0 1092 1024"><path d="M546.133333 1024A512 512 0 1 1 546.133333 0a512 512 0 0 1 0 1024z" fill="#FFFFFF" ></path><path d="M546.133333 955.733333A443.733333 443.733333 0 1 0 546.133333 68.266667a443.733333 443.733333 0 0 0 0 887.466666z" fill="#F4779A" ></path><path d="M595.3536 674.474667a202.205867 202.205867 0 0 0 202.001067-201.9328 202.205867 202.205867 0 0 0-202.069334-202.069334 202.1376 202.1376 0 0 0-201.9328 202.069334c0 39.7312 11.741867 76.731733 31.675734 108.1344l-32.085334 32.085333-50.517333-50.517333-42.734933 42.5984 50.517333 50.5856-55.296 55.296 42.734933 42.734933 55.296-55.296 47.786667 47.650133 42.666667-42.5984-47.7184-47.786666 29.0816-29.0816a201.1136 201.1136 0 0 0 130.594133 48.128z" fill="#FFFFFF" ></path><path d="M595.3536 330.888533a141.789867 141.789867 0 0 1 141.585067 141.653334 141.789867 141.789867 0 0 1-141.585067 141.5168 141.7216 141.7216 0 0 1-141.585067-141.5168c0-78.2336 63.419733-141.585067 141.585067-141.653334z" fill="#F4779A" ></path></symbol><symbol id="icon-boy" viewBox="0 0 1024 1024"><path d="M512 998.4a486.4 486.4 0 1 1 0-972.8 486.4 486.4 0 0 1 0 972.8z" fill="#FFFFFF" ></path><path d="M512 947.2a435.2 435.2 0 1 0 0-870.4 435.2 435.2 0 0 0 0 870.4z" fill="#57A9FA" ></path><path d="M576.8704 768c-105.472 0-191.232-84.6848-191.232-188.8256 0-41.6256 13.7728-79.9744 36.864-111.104L368.64 414.72v68.864H307.2V307.2h179.2v60.672H408.1664l58.112 57.4464a191.488 191.488 0 0 1 110.592-35.072c105.3696 0 191.1296 84.7872 191.1296 188.928S682.24 768 576.8704 768z" fill="#FFFFFF" ></path><path d="M576.8192 451.072c-71.5264 0-129.792 57.4464-129.792 128.1024 0 70.656 58.2656 128.2048 129.792 128.2048 71.5264 0 129.7408-57.4976 129.7408-128.2048 0-70.656-58.2144-128.1536-129.7408-128.1536z" fill="#57A9FA" ></path></symbol><symbol id="icon-picture-o" viewBox="0 0 1024 1024"><path d="M669.582222 335.530667a56.661333 56.661333 0 0 0-86.869333 0.625777L341.333333 625.777778 267.832889 552.220444a56.718222 56.718222 0 0 0-80.497778 0L113.777778 625.777778V227.555556h796.444444v388.721777l-240.64-280.746666zM910.222222 796.444444H113.777778v-90.225777l113.777778-113.777778 73.557333 73.557333a56.888889 56.888889 0 0 0 83.968-3.868444l241.208889-289.621334h0.113778L910.222222 703.715556V796.444444z m0-625.777777H113.777778a56.888889 56.888889 0 0 0-56.888889 56.888889v568.888888a56.888889 56.888889 0 0 0 56.888889 56.888889h796.444444a56.888889 56.888889 0 0 0 56.888889-56.888889V227.555556a56.888889 56.888889 0 0 0-56.888889-56.888889zM312.888889 398.222222a28.444444 28.444444 0 1 1 0.113778-57.002666A28.444444 28.444444 0 0 1 312.888889 398.222222m0-113.777778a85.333333 85.333333 0 1 0 0 170.666667 85.333333 85.333333 0 0 0 0-170.666667"  ></path></symbol><symbol id="icon-followup-o" viewBox="0 0 1024 1024"><path d="M853.333333 452.437333V284.444444a56.888889 56.888889 0 0 0-56.888889-56.888888H170.666667a56.888889 56.888889 0 0 0-56.888889 56.888888v512a56.888889 56.888889 0 0 0 56.888889 56.888889h340.536889v-56.888889H170.666667V284.444444h625.777777v167.992889h56.888889zM853.333333 284.444444a56.888889 56.888889 0 0 0-56.888889-56.888888H170.666667a56.888889 56.888889 0 0 0-56.888889 56.888888v512a56.888889 56.888889 0 0 0 56.888889 56.888889h340.536889v-56.888889H170.666667V284.444444h625.777777v167.992889h56.888889V284.444444z m-56.888889 654.222223a199.111111 199.111111 0 1 1 0-398.222223 199.111111 199.111111 0 0 1 0 398.222223z m0-56.888889a142.222222 142.222222 0 1 0 0-284.444445 142.222222 142.222222 0 0 0 0 284.444445z m86.584889-170.666667v56.888889H768v-113.777778h56.888889v56.888889h58.140444zM341.333333 170.666667v56.888889h284.444445V170.666667H341.333333z m0-56.888889h284.444445a56.888889 56.888889 0 0 1 56.888889 56.888889v56.888889a56.888889 56.888889 0 0 1-56.888889 56.888888H341.333333a56.888889 56.888889 0 0 1-56.888889-56.888888V170.666667a56.888889 56.888889 0 0 1 56.888889-56.888889zM113.777778 483.555556v-56.888889h740.295111v56.888889H113.777778z"  ></path></symbol><symbol id="icon-list-o" viewBox="0 0 1024 1024"><path d="M256 170.666667v682.666666h512V170.666667H256zM213.333333 85.333333h597.333334a42.666667 42.666667 0 0 1 42.666666 42.666667v768a42.666667 42.666667 0 0 1-42.666666 42.666667H213.333333a42.666667 42.666667 0 0 1-42.666666-42.666667V128a42.666667 42.666667 0 0 1 42.666666-42.666667z m128 213.333334h341.333334v85.333333H341.333333V298.666667z m0 170.666666h341.333334v85.333334H341.333333v-85.333334z m0 170.666667h256v85.333333H341.333333v-85.333333z"  ></path></symbol><symbol id="icon-list" viewBox="0 0 1024 1024"><path d="M213.333333 85.333333h597.333334a42.666667 42.666667 0 0 1 42.666666 42.666667v768a42.666667 42.666667 0 0 1-42.666666 42.666667H213.333333a42.666667 42.666667 0 0 1-42.666666-42.666667V128a42.666667 42.666667 0 0 1 42.666666-42.666667z m128 213.333334v85.333333h341.333334V298.666667H341.333333z m0 170.666666v85.333334h341.333334v-85.333334H341.333333z m0 170.666667v85.333333h256v-85.333333H341.333333z"  ></path></symbol><symbol id="icon-calendar-o" viewBox="0 0 1024 1024"><path d="M853.333333 469.333333H170.666667V384h682.666666V256h-85.333333v42.666667h-85.333333V256H341.333333v42.666667H256V256H170.666667v554.666667h682.666666v-341.333334zM256 170.666667V85.333333h85.333333v85.333334h341.333334V85.333333h85.333333v85.333334h128a42.666667 42.666667 0 0 1 42.666667 42.666666v640a42.666667 42.666667 0 0 1-42.666667 42.666667H128a42.666667 42.666667 0 0 1-42.666667-42.666667V213.333333a42.666667 42.666667 0 0 1 42.666667-42.666666h128z m0 384h170.666667v85.333333H256v-85.333333z"  ></path></symbol><symbol id="icon-calendar" viewBox="0 0 1024 1024"><path d="M853.333333 469.333333H170.666667V256h85.333333-85.333333v554.666667h682.666666v-341.333334zM256 170.666667V85.333333h85.333333v85.333334h341.333334V85.333333h85.333333v85.333334h128a42.666667 42.666667 0 0 1 42.666667 42.666666v640a42.666667 42.666667 0 0 1-42.666667 42.666667H128a42.666667 42.666667 0 0 1-42.666667-42.666667V213.333333a42.666667 42.666667 0 0 1 42.666667-42.666666h128z m0 384h170.666667v85.333333H256v-85.333333z"  ></path></symbol></svg>',
      m = (m = document.getElementsByTagName("script"))[m.length - 1].getAttribute("data-injectcss");

  if (m && !a.__iconfont__svg__cssinject__) {
    a.__iconfont__svg__cssinject__ = !0;

    try {
      document.write("<style>.svgfont {display: inline-block;width: 1em;height: 1em;fill: currentColor;vertical-align: -0.1em;font-size:16px;}</style>");
    } catch (a) {
      console && console.log(a);
    }
  }

  function n() {
    i || (i = !0, l());
  }

  t = function t() {
    var a, t, o, l;
    (l = document.createElement("div")).innerHTML = v, v = null, (o = l.getElementsByTagName("svg")[0]) && (o.setAttribute("aria-hidden", "true"), o.style.position = "absolute", o.style.width = 0, o.style.height = 0, o.style.overflow = "hidden", a = o, (t = document.body).firstChild ? (l = a, (o = t.firstChild).parentNode.insertBefore(l, o)) : t.appendChild(a));
  }, document.addEventListener ? ~["complete", "loaded", "interactive"].indexOf(document.readyState) ? setTimeout(t, 0) : (_o = function o() {
    document.removeEventListener("DOMContentLoaded", _o, !1), t();
  }, document.addEventListener("DOMContentLoaded", _o, !1)) : document.attachEvent && (l = t, h = a.document, i = !1, (_e = function e() {
    try {
      h.documentElement.doScroll("left");
    } catch (a) {
      return void setTimeout(_e, 50);
    }

    n();
  })(), h.onreadystatechange = function () {
    "complete" == h.readyState && (h.onreadystatechange = null, n());
  });
}(window);

var Icon =
/*#__PURE__*/
function (_Component) {
  _inherits(Icon, _Component);

  function Icon() {
    _classCallCheck(this, Icon);

    return _possibleConstructorReturn(this, _getPrototypeOf(Icon).apply(this, arguments));
  }

  _createClass(Icon, [{
    key: "render",
    value: function render() {
      return React__default.createElement("svg", {
        className: this.className,
        style: this.style,
        "aria-hidden": "true"
      }, React__default.createElement("use", {
        xlinkHref: this.xlinkHref
      }));
    }
  }, {
    key: "xlinkHref",
    get: function get() {
      return "#icon-".concat(this.props.type);
    }
  }, {
    key: "className",
    get: function get() {
      if (this.props.className) {
        return 'ebiz-icon ' + this.props.className;
      }

      return 'ebiz-icon';
    }
  }, {
    key: "style",
    get: function get() {
      var _this$props = this.props,
          size = _this$props.size,
          color = _this$props.color;
      return {
        fontSize: size,
        color: color
      };
    }
  }]);

  return Icon;
}(React.Component);

_defineProperty(Icon, "defaultProps", {
  size: 'inherit',
  color: 'inherit'
});

var DragListItem = function DragListItem(props) {
  var icon = props.icon,
      columns = props.columns,
      orderId = props.orderId,
      iconSize = props.iconSize,
      iconColor = props.iconColor,
      _props$datasets = props.datasets,
      datasets = _props$datasets === void 0 ? {} : _props$datasets,
      disabledAnchor = props.disabledAnchor,
      _props$noAnchor = props.noAnchor,
      noAnchor = _props$noAnchor === void 0 ? false : _props$noAnchor;
  var Anchor = React__default.useMemo(function () {
    return React__default.createElement(Icon, {
      type: icon,
      color: iconColor,
      size: iconSize
    });
  }, [icon, iconColor, iconSize]);
  var DisabledAnchor = React__default.useMemo(function () {
    return disabledAnchor ? disabledAnchor : null;
  }, [disabledAnchor]);
  return React__default.createElement("tr", {
    "data-sortable-id": orderId,
    className: "ebiz-drag-list__content-line"
  }, noAnchor ? React__default.createElement("td", null, DisabledAnchor) : React__default.createElement("td", {
    className: "ebiz-drag-list__content-dragAnchor"
  }, Anchor), columns.map(function (col, index) {
    var NODE = null;
    var bodyRender = col.bodyRender,
        name = col.name,
        _col$defaultText = col.defaultText,
        defaultText = _col$defaultText === void 0 ? '-' : _col$defaultText;

    if (bodyRender) {
      NODE = bodyRender(datasets);
    } else {
      if (name) {
        if (/[.[]]/.test(name)) {
          NODE = get_1(datasets, name);
        } else {
          NODE = datasets[name];
        }
      } else {
        throw new Error('columns需要指定name或者bodyRender');
      }
    }

    return React__default.createElement("td", {
      key: "content[".concat(index, "]"),
      className: "ebiz-drag-list__content-item",
      style: {
        textAlign: col.textAlign || 'left'
      }
    }, React__default.createElement("div", {
      className: "ebiz-drag-list__content-item ebiz-drag-content"
    }, NODE || defaultText));
  }));
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

var DragListContainer = function DragListContainer(props) {
  var filter = props.filter,
      noData = props.noData,
      rowKey = props.rowKey,
      columns = props.columns,
      updateSignal = props.updateSignal,
      onOrderChange = props.onOrderChange,
      fetchDatasets = props.fetchDatasets,
      _props$icon = props.icon,
      icon = _props$icon === void 0 ? 'drag' : _props$icon,
      disabledAnchor = props.disabledAnchor,
      _props$iconSize = props.iconSize,
      iconSize = _props$iconSize === void 0 ? '1rem' : _props$iconSize,
      _props$iconColor = props.iconColor,
      iconColor = _props$iconColor === void 0 ? '#999' : _props$iconColor,
      _props$swap = props.swap,
      swap = _props$swap === void 0 ? false : _props$swap,
      _props$swapClass = props.swapClass,
      swapClass = _props$swapClass === void 0 ? 'swap-standard-style' : _props$swapClass,
      ghostClass = props.ghostClass,
      dragClass = props.dragClass,
      chosenClass = props.chosenClass;

  var _React$useState = React__default.useState(0),
      _React$useState2 = _slicedToArray(_React$useState, 2),
      keyFlag = _React$useState2[0],
      setKeyFlag = _React$useState2[1];

  var _React$useState3 = React__default.useState([]),
      _React$useState4 = _slicedToArray(_React$useState3, 2),
      dragDatasets = _React$useState4[0],
      setDragDatasets = _React$useState4[1];

  var _React$useState5 = React__default.useState([]),
      _React$useState6 = _slicedToArray(_React$useState5, 2),
      frozenDatasets = _React$useState6[0],
      setFrozenDatasets = _React$useState6[1];

  var _React$useState7 = React__default.useState([]),
      _React$useState8 = _slicedToArray(_React$useState7, 2),
      prevOrderDatasets = _React$useState8[0],
      setPrevOrderDatasets = _React$useState8[1];

  var _React$useState9 = React__default.useState(false),
      _React$useState10 = _slicedToArray(_React$useState9, 2),
      loading = _React$useState10[0],
      setLoading = _React$useState10[1];

  var sortableRef = React__default.useRef(null);
  var dragRef = React__default.useRef(null);
  var getGroupedDatasets = React__default.useCallback(function (datasets) {
    var drag = [];
    var frozen = [];

    if (datasets.length) {
      if (filter) {
        datasets.forEach(function (rowData, index) {
          rowData.currentId = index;

          if (filter(rowData)) {
            drag.push(rowData);
          } else {
            frozen.push(rowData);
          }
        });
      } else return [datasets, []];
    }

    return [drag, frozen];
  }, [filter]);
  var fetchDatasetMethod = React__default.useCallback(function () {
    setLoading(true);
    fetchDatasets().then(function (datasets) {
      var _getGroupedDatasets = getGroupedDatasets(datasets),
          _getGroupedDatasets2 = _slicedToArray(_getGroupedDatasets, 2),
          drag = _getGroupedDatasets2[0],
          frozen = _getGroupedDatasets2[1];

      setDragDatasets(drag);
      setFrozenDatasets(frozen);
      setPrevOrderDatasets(drag);
      setKeyFlag(function (prevKeyFlag) {
        return prevKeyFlag + 1;
      });
    })["catch"](zent.Notify.error)["finally"](function () {
      return setLoading(false);
    });
  }, [fetchDatasets, getGroupedDatasets]);
  var baseDragItemProps = React__default.useMemo(function () {
    return {
      icon: icon,
      columns: columns,
      iconSize: iconSize,
      iconColor: iconColor
    };
  }, [columns, icon, iconColor, iconSize]);
  var handleOrderChanged = React__default.useCallback(function (evt) {
    var children = evt.to.children;
    var orders = [];

    for (var index = 0; index < children.length; index += 1) {
      var curChild = children[index];
      var orderNumber = Number(curChild.dataset.sortableId);
      if (!isNaN(orderNumber)) orders.push(orderNumber);
    }

    var sortableDatasets = [];
    orders.forEach(function (order) {
      return sortableDatasets.push(dragDatasets[order] || {});
    });

    if (onOrderChange) {
      onOrderChange(sortableDatasets, prevOrderDatasets);
      setPrevOrderDatasets(sortableDatasets);
    }
  }, [dragDatasets, onOrderChange, prevOrderDatasets]);
  React__default.useEffect(fetchDatasetMethod, []);
  React__default.useEffect(function () {
    if (updateSignal !== undefined) fetchDatasetMethod();
  }, [fetchDatasetMethod, updateSignal]); // mounted sortableJS

  useLayoutEffect(function () {
    if (!sortableRef.current && dragRef.current) {
      var baseOptions = {
        // sortable anchor
        handle: '.ebiz-drag-list__content-dragAnchor',
        // delay to darg
        delay: 10,
        // sortable target
        dataIdAttr: 'data-sortable-id',
        // animation
        animation: 150,
        // auto scroll
        scroll: true,
        // classes
        ghostClass: ghostClass || 'ebiz-drag-list__content-placeholder',
        dragClass: dragClass || 'ebiz-drag-list__content-move',
        chosenClass: chosenClass || 'ebiz-drag-list__content-chosen'
      };
      var addonOption = {};

      if (swap) {
        SortableJS__default.mount(new SortableJS.Swap());
        addonOption.swap = true;
        addonOption.swapClass = swapClass; // 如果是交换模式，需要将修改ghost节点为显示状态

        addonOption.ghostClass = ghostClass;
        addonOption.chosenClass = chosenClass;
      }

      sortableRef.current = SortableJS__default.create(dragRef.current, Object.assign({}, baseOptions, addonOption));
    }

    return function () {
      if (sortableRef.current) {
        sortableRef.current.destroy();
        sortableRef.current = null;
      }
    };
  }, [chosenClass, dragClass, ghostClass, swap, swapClass]);
  React__default.useEffect(function () {
    if (sortableRef.current) {
      // hooks
      sortableRef.current.option('onEnd', handleOrderChanged);
    }
  }, [handleOrderChanged]);
  return React__default.createElement(zent.BlockLoading, {
    className: "ebiz-drag-list__loading-container",
    loading: loading
  }, React__default.createElement("div", {
    className: "ebiz-drag-list__container"
  }, React__default.createElement(DragListHeaderWithRef, {
    columns: columns,
    className: "ebiz-drag-list__header"
  }), React__default.createElement(DragListBoxWithRef, {
    columns: columns,
    className: "ebiz-drag-list__content"
  }, React__default.createElement("tbody", {
    ref: dragRef
  }, dragDatasets.length + frozenDatasets.length === 0 ? React__default.createElement("tr", {
    className: "no-data"
  }, React__default.createElement("td", {
    colSpan: 99
  }, noData || '没有更多数据了')) : dragDatasets.map(function (dataset) {
    return React__default.createElement(DragListItem, _extends({
      datasets: dataset,
      orderId: dataset.currentId // 添加一个更新标志，用于在排序失败之后重新设置节点位置
      ,
      key: get_1(dataset, rowKey, dataset.currentId) + '_' + keyFlag
    }, baseDragItemProps));
  })), React__default.createElement("tbody", {
    role: "disabled-content"
  }, frozenDatasets.length ? frozenDatasets.map(function (dataset) {
    return React__default.createElement(DragListItem, _extends({
      noAnchor: true,
      datasets: dataset,
      orderId: dataset.currentId,
      disabledAnchor: disabledAnchor,
      key: get_1(dataset, rowKey, dataset.currentId) + '_' + keyFlag
    }, baseDragItemProps));
  }) : null))));
};

module.exports = DragListContainer;
