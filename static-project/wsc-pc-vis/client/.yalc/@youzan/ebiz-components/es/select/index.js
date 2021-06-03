'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

require('@youzan/react-components/es/components/operations/style');
var _Operations = _interopDefault(require('@youzan/react-components/es/components/operations'));
var React = require('react');
var React__default = _interopDefault(React);
var cx = _interopDefault(require('classnames'));
var zent = require('zent');
require('@youzan/react-components/es/components/operations/style/index.css');

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

/**
 * The base implementation of `_.isNaN` without support for number objects.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is `NaN`, else `false`.
 */
function baseIsNaN(value) {
  return value !== value;
}

var _baseIsNaN = baseIsNaN;

/**
 * A specialized version of `_.indexOf` which performs strict equality
 * comparisons of values, i.e. `===`.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} value The value to search for.
 * @param {number} fromIndex The index to search from.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function strictIndexOf(array, value, fromIndex) {
  var index = fromIndex - 1,
      length = array.length;

  while (++index < length) {
    if (array[index] === value) {
      return index;
    }
  }
  return -1;
}

var _strictIndexOf = strictIndexOf;

/**
 * The base implementation of `_.indexOf` without `fromIndex` bounds checks.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} value The value to search for.
 * @param {number} fromIndex The index to search from.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function baseIndexOf(array, value, fromIndex) {
  return value === value
    ? _strictIndexOf(array, value, fromIndex)
    : _baseFindIndex(array, _baseIsNaN, fromIndex);
}

var _baseIndexOf = baseIndexOf;

/**
 * A specialized version of `_.includes` for arrays without support for
 * specifying an index to search from.
 *
 * @private
 * @param {Array} [array] The array to inspect.
 * @param {*} target The value to search for.
 * @returns {boolean} Returns `true` if `target` is found, else `false`.
 */
function arrayIncludes(array, value) {
  var length = array == null ? 0 : array.length;
  return !!length && _baseIndexOf(array, value, 0) > -1;
}

var _arrayIncludes = arrayIncludes;

/**
 * This function is like `arrayIncludes` except that it accepts a comparator.
 *
 * @private
 * @param {Array} [array] The array to inspect.
 * @param {*} target The value to search for.
 * @param {Function} comparator The comparator invoked per element.
 * @returns {boolean} Returns `true` if `target` is found, else `false`.
 */
function arrayIncludesWith(array, value, comparator) {
  var index = -1,
      length = array == null ? 0 : array.length;

  while (++index < length) {
    if (comparator(value, array[index])) {
      return true;
    }
  }
  return false;
}

var _arrayIncludesWith = arrayIncludesWith;

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

/** Used as the size to enable large array optimizations. */
var LARGE_ARRAY_SIZE = 200;

/**
 * The base implementation of methods like `_.difference` without support
 * for excluding multiple arrays or iteratee shorthands.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {Array} values The values to exclude.
 * @param {Function} [iteratee] The iteratee invoked per element.
 * @param {Function} [comparator] The comparator invoked per element.
 * @returns {Array} Returns the new array of filtered values.
 */
function baseDifference(array, values, iteratee, comparator) {
  var index = -1,
      includes = _arrayIncludes,
      isCommon = true,
      length = array.length,
      result = [],
      valuesLength = values.length;

  if (!length) {
    return result;
  }
  if (iteratee) {
    values = _arrayMap(values, _baseUnary(iteratee));
  }
  if (comparator) {
    includes = _arrayIncludesWith;
    isCommon = false;
  }
  else if (values.length >= LARGE_ARRAY_SIZE) {
    includes = _cacheHas;
    isCommon = false;
    values = new _SetCache(values);
  }
  outer:
  while (++index < length) {
    var value = array[index],
        computed = iteratee == null ? value : iteratee(value);

    value = (comparator || value !== 0) ? value : 0;
    if (isCommon && computed === computed) {
      var valuesIndex = valuesLength;
      while (valuesIndex--) {
        if (values[valuesIndex] === computed) {
          continue outer;
        }
      }
      result.push(value);
    }
    else if (!includes(values, computed, comparator)) {
      result.push(value);
    }
  }
  return result;
}

var _baseDifference = baseDifference;

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
var objectProto$5 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$4 = objectProto$5.hasOwnProperty;

/** Built-in value references. */
var propertyIsEnumerable = objectProto$5.propertyIsEnumerable;

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

var defineProperty = (function() {
  try {
    var func = _getNative(Object, 'defineProperty');
    func({}, '', {});
    return func;
  } catch (e) {}
}());

var _defineProperty$1 = defineProperty;

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
 * Creates an array of `array` values not included in the other given arrays
 * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons. The order and references of result values are
 * determined by the first array.
 *
 * **Note:** Unlike `_.pullAll`, this method returns a new array.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {Array} array The array to inspect.
 * @param {...Array} [values] The values to exclude.
 * @returns {Array} Returns the new array of filtered values.
 * @see _.without, _.xor
 * @example
 *
 * _.difference([2, 1], [2, 3]);
 * // => [1]
 */
var difference = _baseRest(function(array, values) {
  return isArrayLikeObject_1(array)
    ? _baseDifference(array, _baseFlatten(values, 1, isArrayLikeObject_1, true))
    : [];
});

var difference_1 = difference;

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

function getColorfulText(target) {
  return "<span class=\"colour-words\">".concat(target, "</span>");
}

var Option = function Option(props) {
  var tags = props.tags,
      text = props.text,
      extra = props.extra,
      disabled = props.disabled,
      keyword = props.keyword,
      isChecked = props.isChecked,
      value = props.value,
      _props$isGroup = props.isGroup,
      isGroup = _props$isGroup === void 0 ? false : _props$isGroup,
      isKeyboardChecked = props.isKeyboardChecked,
      handleClick = props.handleClick,
      resetOptionsValues = _objectWithoutProperties(props, ["tags", "text", "extra", "disabled", "keyword", "isChecked", "value", "isGroup", "isKeyboardChecked", "handleClick"]);

  var cls = React__default.useMemo(function () {
    return cx({
      'option-item': true,
      'is-group': isGroup,
      'can-select': !disabled && !isGroup,
      'set-option-disabled': disabled || isGroup,
      'is-checked': tags === false && isChecked,
      'is-keyboard-checked': isKeyboardChecked || false
    });
  }, [disabled, isChecked, isGroup, isKeyboardChecked, tags]);
  var COLOUR_TEXT = React__default.useMemo(function () {
    if (keyword === undefined || disabled || isGroup) {
      return text;
    }

    var colourMatcher = new RegExp(keyword, 'g');
    return text.replace(colourMatcher, getColorfulText);
  }, [keyword, disabled, isGroup, text]);
  var invokePropClickHandler = React__default.useCallback(function () {
    if (!disabled && handleClick) {
      handleClick(_objectSpread2({}, resetOptionsValues, {
        text: text,
        value: value
      }));
    }
  }, [disabled, handleClick, resetOptionsValues, text, value]);
  return React__default.createElement("li", {
    title: text,
    className: cls,
    onClick: invokePropClickHandler
  }, React__default.createElement("div", {
    className: "option-item__content"
  }, React__default.createElement("span", {
    className: "option-item__main-content",
    dangerouslySetInnerHTML: {
      __html: COLOUR_TEXT
    }
  }), React__default.createElement("div", {
    className: "option-item__extra"
  }, extra)), tags && (isChecked ? React__default.createElement(zent.Icon, {
    type: "check",
    className: "icon-checked",
    color: "#155bd4"
  }) : null));
};

var SyncDropDown = React__default.forwardRef(function SyncDropDownWithRef(props, ref) {
  var keyword = props.keyword,
      _props$options = props.options,
      options = _props$options === void 0 ? [] : _props$options,
      prefixOption = props.prefixOption,
      suffixOption = props.suffixOption,
      tags = props.tags,
      width = props.width;
  var OPTION_NODES = React__default.useMemo(function () {
    if (options.length === 0) {
      return null;
    }

    return options.map(function (option, index) {
      return React__default.createElement(Option, _extends({
        tags: tags,
        keyword: keyword,
        handleClick: props.handleSelect,
        key: "option-".concat(index, "-").concat(option.value)
      }, option));
    });
  }, [options, tags, keyword, props.handleSelect]);
  return React__default.createElement("ul", {
    ref: ref,
    role: "menu",
    style: {
      width: width
    },
    className: cx('ebiz-select-dropdown option-list', props.className)
  }, prefixOption && React__default.createElement("li", {
    role: "menuitem",
    className: "option-item"
  }, prefixOption), OPTION_NODES, options.length === 0 && React__default.createElement("li", {
    role: "menuitem",
    className: "option-item"
  }, props.noData || React__default.createElement("span", {
    className: "option-placeholder"
  }, "\u6CA1\u6709\u627E\u5230\u5339\u914D\u9879")), suffixOption && React__default.createElement("li", {
    role: "menuitem",
    className: "option-item"
  }, suffixOption));
});

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
var LARGE_ARRAY_SIZE$1 = 200;

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
    if (!_Map || (pairs.length < LARGE_ARRAY_SIZE$1 - 1)) {
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
    symbolTag$1 = '[object Symbol]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]';

/** Used to convert symbols to primitives and strings. */
var symbolProto$1 = _Symbol ? _Symbol.prototype : undefined,
    symbolValueOf = symbolProto$1 ? symbolProto$1.valueOf : undefined;

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

    case symbolTag$1:
      if (symbolValueOf) {
        return symbolValueOf.call(object) == symbolValueOf.call(other);
      }
  }
  return false;
}

var _equalByTag = equalByTag;

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
var objectProto$6 = Object.prototype;

/** Built-in value references. */
var propertyIsEnumerable$1 = objectProto$6.propertyIsEnumerable;

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
var Promise = _getNative(_root, 'Promise');

var _Promise = Promise;

/* Built-in method references that are verified to be native. */
var Set = _getNative(_root, 'Set');

var _Set = Set;

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

function setSelectedFlag(options, selectedOpts, keyboardSelect) {
  if (keyboardSelect === -1 && selectedOpts === undefined) {
    return options;
  }

  return options.map(function (currentOpt, index) {
    var isChecked = false;
    var isKeyboardChecked = false; // 如果是被键盘选中的

    if (keyboardSelect !== -1 && index === keyboardSelect) isKeyboardChecked = true;

    if (Array.isArray(selectedOpts)) {
      isChecked = getEqualOptionIndex(currentOpt, selectedOpts) > -1;
    } else if (selectedOpts !== undefined) {
      isChecked = isEqual_1(currentOpt.value, selectedOpts.value);
    }

    return Object.assign({}, currentOpt, {
      isChecked: isChecked,
      isKeyboardChecked: isKeyboardChecked
    });
  });
}
function getEqualOptionIndex(currentOpt, options) {
  var currentValue = currentOpt.value;
  var equalOptionIndex = -1;

  if (options !== undefined) {
    equalOptionIndex = options.findIndex(function (opt) {
      return isEqual_1(opt.value, currentValue);
    });
  }

  return equalOptionIndex;
}
function getNewSelectedOptions(deleteOption, selectedOpts) {
  var newSelectOpts;

  if (Array.isArray(selectedOpts) && selectedOpts.length > 0) {
    newSelectOpts = selectedOpts;

    if (deleteOption !== undefined) {
      var deleteIndex = newSelectOpts.findIndex(function (opt) {
        return isEqual_1(opt.value, deleteOption.value);
      });

      if (deleteIndex > -1) {
        newSelectOpts = newSelectOpts.slice(0, deleteIndex).concat(newSelectOpts.slice(deleteIndex + 1, newSelectOpts.length));
      }
    } else {
      newSelectOpts = selectedOpts.slice(0, selectedOpts.length - 1);
    }
  } else {
    newSelectOpts = undefined;
  }

  return newSelectOpts;
}

var OFFSET_HEIGHT = 4 * 32;
var AsyncDropDown = React__default.forwardRef(function AsyncDropDownWithRef(props, ref) {
  var tags = props.tags,
      width = props.width,
      noData = props.noData,
      loading = props.loading,
      keyword = props.keyword,
      _props$options = props.options,
      options = _props$options === void 0 ? [] : _props$options,
      handleSelect = props.handleSelect,
      prefixOption = props.prefixOption,
      suffixOption = props.suffixOption,
      onScrollBottom = props.onScrollBottom;
  var blockBottomInvoke = React__default.useRef(false);
  var OPTION_NODES = React__default.useMemo(function () {
    if (options.length === 0) {
      return null;
    }

    return options.map(function (option, index) {
      return React__default.createElement(Option, _extends({
        tags: tags,
        keyword: keyword,
        handleClick: handleSelect,
        key: "option-".concat(index, "-").concat(option.value)
      }, option));
    });
  }, [options, tags, keyword, handleSelect]);
  var handleScroll = React__default.useCallback(function (evt) {
    if (!blockBottomInvoke.current) {
      var maxHeight = options.length * 32 - 270;

      if (maxHeight > 0) {
        var scrollTop = evt.target.scrollTop;

        if (maxHeight - scrollTop < OFFSET_HEIGHT) {
          onScrollBottom(); // 暂时禁止底部触发

          blockBottomInvoke.current = true;
        }
      }
    }
  }, [onScrollBottom, options]);
  React__default.useEffect(function () {
    // 如果options长度发生改变，就重新设置底部触发状态为可触发
    if (options.length > 0) {
      blockBottomInvoke.current = false;
    }
  }, [options.length]);
  return React__default.createElement("ul", {
    ref: ref,
    role: "menu",
    style: {
      width: width
    },
    onScroll: handleScroll,
    className: cx('ebiz-select-dropdown option-list', props.className)
  }, prefixOption && React__default.createElement("li", {
    role: "menuitem",
    className: "option-item"
  }, prefixOption), OPTION_NODES, suffixOption && React__default.createElement("li", {
    role: "menuitem",
    className: "option-item"
  }, suffixOption), loading ? React__default.createElement("li", {
    role: "menuitem",
    className: "option-item option-placeholder"
  }, "\u52A0\u8F7D\u4E2D...") : options.length === 0 && React__default.createElement("li", {
    role: "menuitem",
    className: "option-item option-placeholder"
  }, noData || '暂无数据'));
});

var EbizDropDownProvider = function EbizDropDownProvider(props) {
  var mode = props.mode,
      selectedOpts = props.selectedOpts,
      _props$options = props.options,
      options = _props$options === void 0 ? [] : _props$options,
      _props$visible = props.visible,
      visible = _props$visible === void 0 ? false : _props$visible,
      noKeyboardHandle = props.noKeyboardHandle,
      enabledOrPredicate = props.filter,
      passiveProps = _objectWithoutProperties(props, ["mode", "selectedOpts", "options", "visible", "noKeyboardHandle", "filter"]);

  var _React$useState = React__default.useState(-1),
      _React$useState2 = _slicedToArray(_React$useState, 2),
      availableIndex = _React$useState2[0],
      setAvailableIndex = _React$useState2[1];

  var UListRef = React__default.useRef(null);
  var passiveClassName = React__default.useMemo(function () {
    return props.tags ? 'multi-select-dropdown' : 'single-select-dropdown';
  }, [props.tags]);
  var availableOptions = React__default.useMemo(function () {
    return options.map(function (opt, index) {
      return Object.assign({}, opt, {
        _index: index
      });
    }).filter(function (opt) {
      return !opt.disabled && !opt.isGroup;
    });
  }, [options]);
  var pressDown = React__default.useCallback(function () {
    setAvailableIndex(function (prevVal) {
      if (availableOptions.length) {
        var curVal = prevVal + 1;
        if (curVal <= availableOptions.length - 1) return curVal;
      }

      return prevVal;
    });
  }, [availableOptions]);
  var pressUp = React__default.useCallback(function () {
    setAvailableIndex(function (prevVal) {
      if (availableOptions.length) {
        var curVal = prevVal - 1;
        if (curVal >= 0) return curVal;
      }

      return prevVal;
    });
  }, [availableOptions]);
  var pressEnter = React__default.useCallback(function () {
    if (availableIndex >= 0) {
      var currentKeyboardSelectIndex = availableOptions[availableIndex]._index;
      var currentKeyboardSelectOpt = options[currentKeyboardSelectIndex];
      props.handleSelect(currentKeyboardSelectOpt);
    }
  }, [availableIndex, availableOptions, options, props]);
  var handleKeyboardEvents = React__default.useCallback(function (code) {
    switch (code) {
      case 'ArrowUp':
        pressUp();
        return true;

      case 'ArrowDown':
        pressDown();
        return true;

      case 'Enter':
        pressEnter();
        return true;

      default:
        return false;
    }
  }, [pressDown, pressEnter, pressUp]);
  React__default.useEffect(function () {
    if (!noKeyboardHandle) {
      if (!visible) {
        setAvailableIndex(-1);
        safeScrollArea = [0, 7];
      }

      return bindKeyboardEvents(visible, handleKeyboardEvents);
    }
  }, [handleKeyboardEvents, noKeyboardHandle, visible]); // 选中的值对应的选项中的序列的值是多少

  var keyboardIndex = React__default.useMemo(function () {
    return get_1(availableOptions, "[".concat(availableIndex, "]._index"), -1);
  }, [availableIndex, availableOptions]); // 根据键盘事件改变选中的选项的值改变ul的上边距

  React__default.useEffect(function () {
    return adjustUListScrollTop(UListRef, keyboardIndex);
  }, [keyboardIndex]);
  var highlightKeywords = React__default.useCallback(function (passOptions) {
    if (mode === 'sync' && passiveProps.keyword) {
      if (enabledOrPredicate) {
        var keywordMatch = new RegExp(escapeRegChars(passiveProps.keyword), 'g');

        var defaultFilterFunc = function defaultFilterFunc(optionText) {
          return keywordMatch.test(optionText);
        };

        var filterFunc = typeof enabledOrPredicate === 'function' ? enabledOrPredicate : defaultFilterFunc;
        return passOptions.filter(function (option) {
          return !option.isGroup && !option.disabled;
        }).filter(function (option) {
          return filterFunc(option.text, option);
        });
      }
    }

    return passOptions;
  }, [enabledOrPredicate, mode, passiveProps.keyword]);
  var filteredOptions = React__default.useMemo(function () {
    // 设置键盘事件
    var passOptions = setSelectedFlag(options, selectedOpts, keyboardIndex);
    passOptions = highlightKeywords(passOptions);
    return passOptions;
  }, [highlightKeywords, keyboardIndex, options, selectedOpts]);
  var nodes = React__default.useMemo(function () {
    return mode === 'sync' ? React__default.createElement(SyncDropDown, _extends({}, passiveProps, {
      ref: UListRef,
      options: filteredOptions,
      className: passiveClassName
    })) : React__default.createElement(AsyncDropDown, _extends({}, passiveProps, {
      ref: UListRef,
      options: filteredOptions,
      className: passiveClassName
    }));
  }, [filteredOptions, mode, passiveClassName, passiveProps]);
  return nodes;
};

function bindKeyboardEvents(visible, fn) {
  var initEvent = function initEvent(evt) {
    // 如果被劫持了按键行为，就阻止事件默认行为
    var isHijacked = fn(evt.code);
    if (isHijacked) evt.preventDefault();
  };

  var init = function init() {
    return window.addEventListener('keydown', initEvent, true);
  };

  var remove = function remove() {
    return window.removeEventListener('keydown', initEvent, true);
  };

  if (visible) init();else remove();
  return remove;
}
/**
 * 调整位置算法：
 * 下拉框，一次最多展示8条数据，所有在0-7（安全区）范围内的上下移动，都不需要调整
 * 指针位置；但是当指针的位置超过上限之后，就将范围上、下限+1，并添加偏移量让选择
 * 的内容展示在范围内；当指针继续运动，如果超过选项的最大高度，即指针变为0（或者最
 * 上面的一个可选值的索引）的时候，应该重置安全区为0-7；
 * 如果指针超过下限，偏移量应该为当前指针与下限的差值的整数倍的偏移量，并且上下限
 * 应该同时-1
 */


var safeScrollArea = [0, 7]; // 安全滚动区域，在这里的不需要重设scrollTop值

function adjustUListScrollTop(UListRef, keyboardIndex) {
  if (keyboardIndex >= 0 && UListRef.current) {
    var _safeScrollArea = safeScrollArea,
        _safeScrollArea2 = _slicedToArray(_safeScrollArea, 2),
        minimum = _safeScrollArea2[0],
        maximum = _safeScrollArea2[1];

    var stepOffset = 0;

    if (keyboardIndex < minimum) {
      stepOffset = keyboardIndex - minimum;
    } else if (keyboardIndex > maximum) {
      stepOffset = keyboardIndex - maximum;
    }

    if (stepOffset) {
      safeScrollArea = [minimum + stepOffset, maximum + stepOffset];
      var prevScrollTop = Number(UListRef.current.getAttribute('pre-scrollTop') || 0);
      UListRef.current.scrollTop = prevScrollTop + 32 * stepOffset;
      UListRef.current.setAttribute('pre-scrollTop', String(UListRef.current.scrollTop));
    }
  }
}
/**
 * 需要对正则表达字符串的字符进行转译，要不会出现bug
 */


function escapeRegChars(matchStr) {
  return matchStr.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function isAsyncMode(props) {
  return props.mode === 'async';
}
function isAsyncTrigger(props) {
  return props.mode === 'async';
}

var EbizTagList = function EbizTagList(props) {
  var _props$options = props.options,
      options = _props$options === void 0 ? [] : _props$options,
      displayNum = props.displayNum,
      className = props.className,
      handleClose = props.handleClose,
      disabled = props.disabled;
  var sliceNum = React__default.useMemo(function () {
    return displayNum > 0 ? displayNum : options.length;
  }, [displayNum, options.length]);
  var tagsCls = React__default.useMemo(function () {
    return cx({
      'multi-select-tag': true,
      'multi-select-tag__disabled': disabled
    });
  }, [disabled]);
  var displayTags = React__default.useMemo(function () {
    return options.slice(0, sliceNum);
  }, [options, sliceNum]);
  var collapseTags = React__default.useMemo(function () {
    return options.slice(sliceNum);
  }, [options, sliceNum]);
  var renderTags = React__default.useCallback(function (options) {
    if (options.length) {
      return options.map(function (opt, index) {
        return React__default.createElement(zent.Tag, {
          outline: true,
          key: index,
          theme: "grey",
          className: tagsCls,
          closable: !disabled && !opt.disabled,
          onClose: function onClose(evt) {
            evt.stopPropagation();
            handleClose(opt);
          }
        }, opt.text);
      });
    }

    return null;
  }, [disabled, handleClose, tagsCls]);
  var DisplayTags = React__default.useMemo(function () {
    return renderTags(displayTags);
  }, [displayTags, renderTags]);
  var CollapseTags = React__default.useMemo(function () {
    if (collapseTags.length) {
      return React__default.createElement(zent.Pop, {
        cushion: 14,
        trigger: "hover",
        wrapperClassName: "multi-select-tag__pop",
        content: collapseTags.map(function (tag) {
          return tag.text;
        }).join('、')
      }, React__default.createElement("span", {
        className: "multi-select-tag multi-select-tag__collapse"
      }, "+", collapseTags.length));
    }

    return null;
  }, [collapseTags]);
  return React__default.createElement("div", {
    className: cx('ebiz-tag-list', className)
  }, DisplayTags, CollapseTags);
};

/**
 * reference [react-use/useDebounce](https://github.com/streamich/react-use/blob/master/src/useTimeoutFn.ts)
 */
function useTimeoutFn(fn) {
  var ms = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  var ready = React__default.useRef(false);
  var timeout = React__default.useRef();
  var callback = React__default.useRef(fn);
  var isReady = React__default.useCallback(function () {
    return ready.current;
  }, []);
  var set = React__default.useCallback(function () {
    ready.current = false;
    timeout.current && clearTimeout(timeout.current);
    timeout.current = setTimeout(function () {
      ready.current = true;
      callback.current();
    }, ms);
  }, [ms]);
  var clear = React__default.useCallback(function () {
    ready.current = null;
    timeout.current && clearTimeout(timeout.current);
  }, []); // update ref when function changes

  React__default.useEffect(function () {
    callback.current = fn;
  }, [fn]); // set on mount, clear on unmount

  React__default.useEffect(function () {
    set();
    return clear; // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ms]);
  return [isReady, clear, set];
}

function useDebounce(fn) {
  var ms = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  var deps = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

  var _useTimeoutFn = useTimeoutFn(fn, ms),
      _useTimeoutFn2 = _slicedToArray(_useTimeoutFn, 3),
      isReady = _useTimeoutFn2[0],
      cancel = _useTimeoutFn2[1],
      reset = _useTimeoutFn2[2];

  React__default.useEffect(reset, deps);
  return [isReady, cancel];
}

var EbizSelectTrigger = function EbizSelectTrigger(props) {
  var tags = props.tags,
      width = props.width,
      value = props.value,
      filter = props.filter,
      visible = props.visible,
      keyword = props.keyword,
      disabled = props.disabled,
      clearable = props.clearable,
      displayNum = props.displayNum,
      placeholder = props.placeholder,
      selectedOpts = props.selectedOpts,
      handleDeleteOption = props.handleDeleteOption,
      handleKeywordChange = props.handleKeywordChange;
  var filterRef = React__default.useRef(null);
  var mirrorRef = React__default.useRef(null);
  var compositionState = React__default.useRef(false);
  var setComposition = React__default.useCallback(function (state) {
    return compositionState.current = state;
  }, []);
  var notHasSelectOpts = React__default.useMemo(function () {
    return !value || !value.length;
  }, [value]);
  var showDeleteIcon = React__default.useMemo(function () {
    return !disabled && clearable && !notHasSelectOpts;
  }, [clearable, disabled, notHasSelectOpts]);
  var cls = React__default.useMemo(function () {
    return cx({
      'ebiz-select-trigger': true,
      'is-tags': tags,
      wrapper: true,
      'has-focus': visible,
      'set-disabled': disabled,
      'show-delete': showDeleteIcon
    });
  }, [tags, visible, disabled, showDeleteIcon]);
  var triggerText = React__default.useMemo(function () {
    return tags ? keyword : get_1(selectedOpts, '[0].text', keyword);
  }, [keyword, tags, selectedOpts]);
  var handleFocusInput = React__default.useCallback(function () {
    notHasSelectOpts && filterRef.current && filterRef.current.focus();
    !disabled && !visible && props.handleFocus(true);
  }, [notHasSelectOpts, disabled, visible, props]);
  var handleCompositionEnd = React__default.useCallback(function (input) {
    handleKeywordChange(input);
    if (compositionState.current) return;
  }, [handleKeywordChange]);
  var inputTrigger = React__default.useMemo(function () {
    var InputEle = null;
    var CalcMirrorEle = null; // 用于计算的镜像DOM

    var PlaceholderEle = null;

    if (filter) {
      InputEle = React__default.createElement("input", {
        type: "text",
        ref: filterRef,
        disabled: disabled,
        onChange: function onChange(evt) {
          return handleCompositionEnd(evt.target.value);
        },
        onCompositionStart: function onCompositionStart() {
          return setComposition(true);
        },
        onCompositionEnd: function onCompositionEnd(evt) {
          setComposition(false);
          handleCompositionEnd(evt.data);
        },
        value: visible ? keyword : triggerText,
        placeholder: triggerText || placeholder || '请输入',
        className: "ebiz-select-trigger__input auto-width"
      });
      CalcMirrorEle = React__default.createElement("span", {
        ref: mirrorRef,
        className: "ebiz-select-trigger__mirror"
      }, keyword || triggerText || placeholder || '请输入');
    } else {
      if (!tags) {
        InputEle = React__default.createElement("input", {
          readOnly: true,
          disabled: disabled,
          value: triggerText,
          placeholder: placeholder || '请选择',
          className: "ebiz-select-trigger__input readonly"
        });
      } else {
        PlaceholderEle = React__default.createElement("div", {
          className: "ebiz-select-trigger__input placeholder"
        }, placeholder || '请选择');
      }
    }

    return React__default.createElement("div", {
      className: "ebiz-select-trigger__input-container"
    }, InputEle, CalcMirrorEle, !value && PlaceholderEle);
  }, // prettier-ignore
  [disabled, filter, tags, keyword, placeholder, visible, handleCompositionEnd, setComposition, triggerText, value]);
  useDebounce(function () {
    if (keyword !== undefined && isAsyncTrigger(props)) {
      props.fetchNow && props.fetchNow(true, keyword);
    }
  }, 200, [keyword]);
  return React__default.createElement("div", {
    className: cls,
    style: {
      width: width
    },
    onClick: handleFocusInput,
    "data-testid": "select-trigger"
  }, tags && React__default.createElement(EbizTagList, {
    disabled: disabled || false,
    options: selectedOpts,
    displayNum: displayNum,
    handleClose: handleDeleteOption,
    className: "ebiz-select-trigger__tags"
  }), inputTrigger, showDeleteIcon && React__default.createElement(zent.Icon, {
    type: "close-circle",
    className: "ebiz-select-trigger__reset",
    onClickCapture: function onClickCapture(evt) {
      evt.stopPropagation();
      handleDeleteOption(undefined, true);
    },
    "data-testid": "select-clearBtn"
  }));
};

/**
 * @description 因为select有两种工作模式，并且在两种工作模式下都有自己特有的属性，所以需要一
 * 个hooks来分发这些属性，确保类型完整
 */

var useModeProps = function useModeProps(props) {
  var isRunAsyncMode = React__default.useMemo(function () {
    return isAsyncMode(props);
  }, [props]);
  var syncModeProps = React__default.useMemo(function () {
    return isRunAsyncMode ? {} : props;
  }, [isRunAsyncMode, props]);
  var asyncModeProps = React__default.useMemo(function () {
    var defaultAsyncProps = {
      mode: 'async',
      fetchOnOpened: false,
      fetchOnMounted: false,
      showAdd: false,
      showRefresh: false
    };
    return isRunAsyncMode ? _objectSpread2({}, defaultAsyncProps, {}, props) : {};
  }, [isRunAsyncMode, props]);
  return {
    syncModeProps: syncModeProps,
    asyncModeProps: asyncModeProps,
    isRunAsyncMode: isRunAsyncMode
  };
};

/** `Object#toString` result references. */
var numberTag$2 = '[object Number]';

/**
 * Checks if `value` is classified as a `Number` primitive or object.
 *
 * **Note:** To exclude `Infinity`, `-Infinity`, and `NaN`, which are
 * classified as numbers, use the `_.isFinite` method.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a number, else `false`.
 * @example
 *
 * _.isNumber(3);
 * // => true
 *
 * _.isNumber(Number.MIN_VALUE);
 * // => true
 *
 * _.isNumber(Infinity);
 * // => true
 *
 * _.isNumber('3');
 * // => false
 */
function isNumber(value) {
  return typeof value == 'number' ||
    (isObjectLike_1(value) && _baseGetTag(value) == numberTag$2);
}

var isNumber_1 = isNumber;

var DEFAULT_PAGE_REQUEST = {
  current: 1,
  pageSize: 20,
  total: 0
};
var ERRORS;

(function (ERRORS) {
  ERRORS["NO_OPTION"] = "[illegal response]response should have options property";
  ERRORS["NO_TOTAL"] = "[illegal response]response should have total in pageInfo property";
})(ERRORS || (ERRORS = {}));

var useRemoteOptions = function useRemoteOptions(params) {
  var fetchOptions = params.fetchOptions,
      _params$useFilterCach = params.useFilterCache,
      useFilterCache = _params$useFilterCach === void 0 ? false : _params$useFilterCach;

  var _React$useState = React__default.useState(false),
      _React$useState2 = _slicedToArray(_React$useState, 2),
      loading = _React$useState2[0],
      setLoading = _React$useState2[1];

  var _React$useState3 = React__default.useState([]),
      _React$useState4 = _slicedToArray(_React$useState3, 2),
      passiveOptions = _React$useState4[0],
      setOptions = _React$useState4[1];

  var _React$useState5 = React__default.useState(DEFAULT_PAGE_REQUEST),
      _React$useState6 = _slicedToArray(_React$useState5, 2),
      pageRequest = _React$useState6[0],
      setPageRequest = _React$useState6[1]; // cached


  var cachedData = React__default.useRef(null);
  var requestOptions = React__default.useCallback(function (keyword, state) {
    var curOptions = state.options,
        curPageRequest = state.pageRequest;
    setLoading(true);
    fetchOptions(keyword || '', curPageRequest).then(function (data) {
      var options = data.options,
          pageInfo = data.pageInfo;
      if (!options) throw new Error(ERRORS.NO_OPTION);
      var total = pageInfo.total,
          current = pageInfo.current;
      if (!isNumber_1(total)) throw new Error(ERRORS.NO_TOTAL);
      var currentOption = current === 1 ? options : curOptions.concat(options);
      setOptions(currentOption);
      pageInfo.current += 1;
      setPageRequest(_objectSpread2({}, curPageRequest, {}, pageInfo));
    })["catch"](function (err) {
      return zent.Notify.error(err && err.message);
    })["finally"](function () {
      setLoading(false);
    });
  }, [fetchOptions]);
  var fetchNow = React__default.useCallback(function () {
    var reset = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
    var keyword = arguments.length > 1 ? arguments[1] : undefined;

    if (loading) {
      return null;
    }

    if (reset) {
      requestOptions(keyword, {
        options: [],
        pageRequest: DEFAULT_PAGE_REQUEST
      });
      return;
    }

    var isInitFetch = !loading && pageRequest.total === 0;
    var isStillHaveOptions = passiveOptions.length < pageRequest.total;

    if (!(isInitFetch || isStillHaveOptions)) {
      return;
    }

    requestOptions(keyword, {
      options: passiveOptions,
      pageRequest: pageRequest
    });
  }, [loading, pageRequest, passiveOptions, requestOptions]);
  var setOptionCache = React__default.useCallback(function (cleanPrevCache) {
    if (useFilterCache) {
      if (!cleanPrevCache) {
        cachedData.current = {
          options: passiveOptions,
          pageInfo: pageRequest
        };
      } else {
        if (cachedData.current) {
          setOptions(cachedData.current.options);
          setPageRequest(cachedData.current.pageInfo);
        }

        cachedData.current = null;
      }
    }
  }, [pageRequest, passiveOptions, useFilterCache]);
  return {
    loading: loading,
    fetchNow: fetchNow,
    setOptionCache: setOptionCache,
    remoteOptions: passiveOptions
  };
};

function getMultiSelectValues(selectedOpts, option) {
  var currentSelectedOpts;
  var selectedList = selectedOpts;

  if (selectedList !== undefined) {
    currentSelectedOpts = selectedList;
    var equalOptionIndex = getEqualOptionIndex(option, currentSelectedOpts);

    if (equalOptionIndex === -1) {
      currentSelectedOpts = currentSelectedOpts.concat(option);
    } else {
      currentSelectedOpts = currentSelectedOpts.filter(function (_opt, selectIndex) {
        return selectIndex !== equalOptionIndex;
      });
    }
  } else {
    /* istanbul ignore next */
    currentSelectedOpts = [option];
  }

  return currentSelectedOpts;
}

function convertWidthToString(width) {
  var stringTypeWidth = '185px';

  if (typeof width === 'string') {
    var isValid = /\d+(px|rem|%|em|vw)/.test(width);
    /* istanbul ignore next */

    if (!isValid) {
      throw new Error('value of property-width is illegal');
    }

    stringTypeWidth = width;
  } else {
    stringTypeWidth = width + 'px';
  }

  return stringTypeWidth;
}

function getOptionsByValues(values, options) {
  var selectedOptions = [];

  if (values && options && options.length > 0) {
    values.forEach(function (currentValue) {
      var indexedOption = options.find(function (currentOption) {
        return isEqual_1(currentOption.value, currentValue);
      });
      indexedOption && selectedOptions.push(indexedOption);
    });
  }

  return selectedOptions;
}

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

var EbizSelectWithRef = React__default.forwardRef(function EbizSelect(props, ref) {
  var value = props.value,
      defaultValue = props.defaultValue,
      _props$defaultOptions = props.defaultOptions,
      defaultOptions = _props$defaultOptions === void 0 ? [] : _props$defaultOptions,
      maxSize = props.maxSize,
      className = props.className,
      _props$offset = props.offset,
      offset = _props$offset === void 0 ? 4 : _props$offset,
      _props$width = props.width,
      width = _props$width === void 0 ? 185 : _props$width,
      _props$tags = props.tags,
      tags = _props$tags === void 0 ? false : _props$tags,
      _props$mode = props.mode,
      mode = _props$mode === void 0 ? 'sync' : _props$mode,
      _props$filter = props.filter,
      filter = _props$filter === void 0 ? false : _props$filter,
      _props$displayNum = props.displayNum,
      displayNum = _props$displayNum === void 0 ? 0 : _props$displayNum,
      _props$placeholder = props.placeholder,
      placeholder = _props$placeholder === void 0 ? '' : _props$placeholder,
      _props$multiple = props.multiple,
      multiple = _props$multiple === void 0 ? false : _props$multiple,
      _props$disabled = props.disabled,
      disabled = _props$disabled === void 0 ? false : _props$disabled,
      _props$clearable = props.clearable,
      clearable = _props$clearable === void 0 ? false : _props$clearable,
      dropdownClassName = props.dropdownClassName,
      _props$closeOnSelect = props.closeOnSelect,
      closeOnSelect = _props$closeOnSelect === void 0 ? false : _props$closeOnSelect,
      _props$noKeyboardHand = props.noKeyboardHandle,
      noKeyboardHandle = _props$noKeyboardHand === void 0 ? false : _props$noKeyboardHand,
      onOpen = props.onOpen,
      onClose = props.onClose,
      onChange = props.onChange,
      onSelect = props.onSelect,
      onKeywordChange = props.onKeywordChange;
  var PopoverRef = React__default.useRef(null);
  React__default.useImperativeHandle(ref, function () {
    return PopoverRef;
  });

  var _React$useState = React__default.useState(undefined),
      _React$useState2 = _slicedToArray(_React$useState, 2),
      keyword = _React$useState2[0],
      setKeyword = _React$useState2[1];

  var _React$useState3 = React__default.useState(false),
      _React$useState4 = _slicedToArray(_React$useState3, 2),
      visible = _React$useState4[0],
      setVisible = _React$useState4[1];

  var _React$useState5 = React__default.useState(getConvertedValue(value || defaultValue)),
      _React$useState6 = _slicedToArray(_React$useState5, 2),
      values = _React$useState6[0],
      setValues = _React$useState6[1];

  var _React$useState7 = React__default.useState(undefined),
      _React$useState8 = _slicedToArray(_React$useState7, 2),
      selectedOpts = _React$useState8[0],
      setSelectedOptions = _React$useState8[1];

  var isMultiSelect = React__default.useMemo(function () {
    return multiple || tags;
  }, [multiple, tags]);
  var isControlMode = React__default.useMemo(function () {
    var _isControlMode = onChange !== undefined && value !== undefined;

    if (value !== undefined && onChange === undefined) {
      var illegalControlModeWarning = "It seems that you want to change the value of Select component which running under controlled mode, but you are missing property 'onChange'.";
      console.error(illegalControlModeWarning);
    }

    return _isControlMode;
  }, [onChange, value]);

  var _useModeProps = useModeProps(props),
      syncModeProps = _useModeProps.syncModeProps,
      asyncModeProps = _useModeProps.asyncModeProps,
      isRunAsyncMode = _useModeProps.isRunAsyncMode;

  var _useRemoteOptions = useRemoteOptions({
    fetchOptions: asyncModeProps.fetchOptions,
    useFilterCache: !asyncModeProps.fetchOnOpened
  }),
      remoteOptions = _useRemoteOptions.remoteOptions,
      loading = _useRemoteOptions.loading,
      fetchNow = _useRemoteOptions.fetchNow,
      setOptionCache = _useRemoteOptions.setOptionCache;

  var invokeFetchNow = React__default.useCallback(function (flag, reset, fetchKeyword) {
    if (isRunAsyncMode) {
      var canInvoke = typeof flag === 'boolean' ? flag : asyncModeProps[flag];
      if (canInvoke) fetchNow && fetchNow(reset, fetchKeyword);
    }
  }, [asyncModeProps, fetchNow, isRunAsyncMode]);
  var handleKeywordChange = React__default.useCallback(function (input) {
    setVisible(true);
    setKeyword(input);
    setOptionCache(!input);
    onKeywordChange && onKeywordChange(input);
  }, [onKeywordChange, setOptionCache]);
  var setValuesAndOptions = React__default.useCallback(function (newValues, newSelectOpts) {
    if (newSelectOpts !== undefined) {
      invokeChangeHandler(onChange, newSelectOpts);
    } // 非受控模式


    setSelectedOptions(newSelectOpts);
    setValues(newValues);
  }, [onChange]);
  var handleDeleteOption = React__default.useCallback(function (deleteOption, reset) {
    setVisible(false);
    var newSelectOpts;
    var newValues;

    if (reset) {
      newSelectOpts = [];
      newValues = [];
    } else {
      newSelectOpts = getNewSelectedOptions(deleteOption, selectedOpts);
      newValues = newSelectOpts && newSelectOpts.map(function (opt) {
        return opt.value;
      });
    }

    setValuesAndOptions(newValues, newSelectOpts);
  }, [selectedOpts, setValuesAndOptions]);
  var handleSelect = React__default.useCallback(function (option) {
    setKeyword('');
    setOptionCache(true);
    var currentSelectedOpts = selectedOpts;
    var currentValues;

    if (isMultiSelect) {
      currentSelectedOpts = getMultiSelectValues(selectedOpts, option);
      currentValues = currentSelectedOpts.map(function (opt) {
        return opt.value;
      });
      closeOnSelect && setVisible(false);
      if (maxSize && currentSelectedOpts.length > maxSize) return;
    } else {
      setVisible(false);
      currentSelectedOpts = [option];
      currentValues = option.value;
    }

    onSelect && onSelect(option.value, currentSelectedOpts);
    setValuesAndOptions(currentValues, currentSelectedOpts);
  }, [setOptionCache, selectedOpts, isMultiSelect, onSelect, setValuesAndOptions, closeOnSelect, maxSize]);
  var passiveOptions = React__default.useMemo(function () {
    return isRunAsyncMode ? remoteOptions : syncModeProps.options;
  }, [isRunAsyncMode, remoteOptions, syncModeProps.options]); // 受控模式的更新，但是defaultOptions/defaultValue也会利用它进行初始化（forceUpdate）

  var setValuesByControlMode = React__default.useCallback(function (passiveValues, forceUpdate) {
    if (!forceUpdate) {
      if (!isControlMode) return;
    } // 如果没有值，就直接重置组件，不做后续的比较


    var isNullable = passiveValues === undefined || passiveValues === null;
    var hasSize = Array.isArray(passiveValues) && passiveValues.length > 0;

    if (isNullable || !hasSize) {
      setSelectedOptions([]);
      return;
    }

    var defaultSelectOptions = getOptionsByValues(passiveValues, defaultOptions);
    var notFoundValues = difference_1(passiveValues, defaultSelectOptions.map(function (opt) {
      return opt.value;
    }));
    var passiveSelectOptions = getOptionsByValues(notFoundValues, passiveOptions);
    var tempSelectedOptions = defaultSelectOptions.concat(passiveSelectOptions).concat(selectedOpts || []);
    var removeDuplicateOptions = getOptionsByValues(passiveValues, tempSelectedOptions);
    setSelectedOptions(removeDuplicateOptions);
  }, [defaultOptions, isControlMode, passiveOptions, selectedOpts]);
  var restoreKeyboardScrollPosition = React__default.useCallback(function () {
    if (!noKeyboardHandle) {
      var listDOMs = document.querySelectorAll('.ebiz-select-dropdown[role=menu]');
      listDOMs.forEach(function (dom) {
        dom.removeAttribute('pre-scrollTop');
        dom.scrollTop = 0;
      });
    }
  }, [noKeyboardHandle]);
  var handleVisibleChange = React__default.useCallback(function (_visible) {
    setVisible(_visible);

    if (!_visible) {
      setKeyword('');
      setOptionCache(true);
      restoreKeyboardScrollPosition();
      onClose && onClose();
    }
  }, [onClose, restoreKeyboardScrollPosition, setOptionCache]);
  var stringifyWidth = React__default.useMemo(function () {
    return convertWidthToString(width);
  }, [width]);
  var operationItems = React__default.useMemo(function () {
    var items = [];

    var handleClick = function handleClick(cb) {
      return cb && cb();
    };

    if (isRunAsyncMode) {
      var showAdd = asyncModeProps.showAdd,
          onAdd = asyncModeProps.onAdd,
          showRefresh = asyncModeProps.showRefresh,
          onRefresh = asyncModeProps.onRefresh;
      if (showAdd) items.push(React__default.createElement("div", {
        onClick: handleClick.bind(null, onAdd)
      }, "\u65B0\u589E"));

      if (showRefresh) {
        var wrapperRefresh = function wrapperRefresh() {
          invokeFetchNow(true, true);
          onRefresh && onRefresh();
        };

        items.push(React__default.createElement("div", {
          onClick: wrapperRefresh
        }, "\u5237\u65B0"));
      }
    }

    return items;
  }, [asyncModeProps, invokeFetchNow, isRunAsyncMode]);
  React__default.useEffect(function () {
    setValuesByControlMode(getConvertedValue(value)); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]); // 监听键盘事件，Esc关闭dropdown

  React__default.useEffect(function () {
    if (!noKeyboardHandle) {
      var handleCloseDropdown = function handleCloseDropdown(evt) {
        if (evt.code === 'Escape') setVisible(false);
      };

      window.addEventListener('keydown', handleCloseDropdown);
      return function () {
        return window.removeEventListener('keydown', handleCloseDropdown);
      };
    }
  }, [noKeyboardHandle]);
  useValueCallback(['fetchOnMounted'], invokeFetchNow);
  useValueCallback(['fetchOnOpened', visible], invokeFetchNow, {
    predicate: function predicate(valueList) {
      return valueList.every(Boolean);
    },
    useOnce: false
  }); // 第一次打开的时候获取选项

  useValueCallback(['fetchOnFirstOpen', visible], function (_, _vis) {
    if (!asyncModeProps.fetchOnOpened && !asyncModeProps.fetchOnMounted) {
      invokeFetchNow(true);
    }
  }); // prettier-ignore

  useValueCallback(defaultOptions, function () {
    return setValuesByControlMode(getConvertedValue(value || defaultValue), true);
  }); // prettier-ignore

  useValueCallback(passiveOptions, function () {
    return setValuesByControlMode(getConvertedValue(value || defaultValue), true);
  }); // default value只用一次

  useValueCallback([getConvertedValue(defaultValue), true], setValuesByControlMode); // 当选中的值发生改变或者keyword改变

  React__default.useEffect(function () {
    if (PopoverRef.current) {
      PopoverRef.current.adjustPosition();
    } // 自动调整位置


    var timer = setTimeout(function () {
      if (PopoverRef.current) {
        PopoverRef.current.adjustPosition();
        clearTimeout(timer);
      }
    }, 50);
  }, [keyword, visible, passiveOptions]);
  var passiveValue = React__default.useMemo(function () {
    return getConvertedValue(isControlMode ? value : values);
  }, [isControlMode, value, values]);
  var handleFocus = React__default.useCallback(function () {
    setKeyword('');
    setOptionCache(true);
    onOpen && onOpen();
    var hasFilter = filter !== false;
    setVisible(function (_state) {
      return !hasFilter ? !_state : true;
    });
  }, [filter, onOpen, setOptionCache]);
  var baseProps = {
    filter: filter,
    visible: visible,
    keyword: keyword,
    disabled: disabled,
    clearable: clearable,
    displayNum: displayNum,
    placeholder: placeholder,
    handleDeleteOption: handleDeleteOption,
    handleKeywordChange: handleKeywordChange,
    tags: isMultiSelect,
    width: stringifyWidth,
    selectedOpts: selectedOpts
  };
  return React__default.createElement("div", {
    className: "ebiz-select__container"
  }, React__default.createElement("div", {
    "data-testid": "select-container",
    className: cx(visible ? 'has-focus' : '', className)
  }, React__default.createElement(zent.Popover, {
    ref: PopoverRef,
    cushion: offset,
    visible: visible,
    prefix: "ebiz-select",
    className: cx('ebiz-select-dropdown-provider', dropdownClassName),
    onVisibleChange: handleVisibleChange,
    position: zent.Popover.Position.AutoBottomLeft
  }, React__default.createElement(zent.Popover.Trigger.Click, null, isRunAsyncMode ? React__default.createElement(EbizSelectTrigger, _extends({}, baseProps, {
    value: passiveValue,
    handleFocus: handleFocus // async mode props
    ,
    mode: "async",
    fetchNow: fetchNow,
    debounceConf: asyncModeProps.debounceConf
  })) : React__default.createElement(EbizSelectTrigger, _extends({}, baseProps, {
    handleFocus: handleFocus,
    value: passiveValue,
    mode: "sync"
  }))), React__default.createElement(zent.Popover.Content, null, React__default.createElement(EbizDropDownProvider, {
    mode: mode,
    filter: filter,
    visible: visible,
    loading: loading,
    keyword: keyword,
    tags: isMultiSelect,
    noData: props.noData,
    width: stringifyWidth,
    options: passiveOptions,
    selectedOpts: selectedOpts,
    handleSelect: handleSelect,
    prefixOption: props.prefixOption,
    suffixOption: props.suffixOption,
    noKeyboardHandle: noKeyboardHandle,
    onScrollBottom: function onScrollBottom() {
      return invokeFetchNow(true);
    }
  })))), operationItems.length > 0 && React__default.createElement(_Operations, {
    "data-testid": "select-ops",
    className: "ebiz-select-trigger__operations",
    items: operationItems
  }));
});

function invokeChangeHandler(onChange, selectedOpts) {
  if (onChange) {
    var selectedOptList = selectedOpts || [];

    if (Array.isArray(selectedOpts)) {
      var values = selectedOptList.map(function (opt) {
        return opt.value || '';
      });
      onChange(values, selectedOptList);
    }
  }
}

function getConvertedValue(value) {
  if (Array.isArray(value)) {
    if (value.length) return value;
  } else if (value) return [value];

  return undefined;
}

module.exports = EbizSelectWithRef;
