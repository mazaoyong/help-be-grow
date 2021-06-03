const toString = Object.prototype.toString;

function isObject(val) {
  return toString.call(val) === '[object Object]';
}

export default function assignDeep(target, source) {
  Object.keys(source).forEach(key => {
    if (isObject(target[key]) && isObject(source[key])) {
      assignDeep(target[key], source[key]);
      return;
    }
    if (source[key]) {
      target[key] = source[key];
    }
  });
}
