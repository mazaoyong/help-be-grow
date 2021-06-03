export default (obj, key, defaultVal = true) => {
  if (obj.hasOwnProperty(key)) {
    if (!obj[key]) return false;
    if (typeof obj[key] === 'function' && !obj[key]()) return false;
    if (typeof obj[key] === 'boolean' && !obj[key]) return false;
  }
  return defaultVal;
};
