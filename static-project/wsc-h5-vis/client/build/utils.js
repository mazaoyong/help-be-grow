const { resolve, dirname } = require('path');
const fg = require('fast-glob');

exports.getFilterPattern = function getFilterPattern(args) {
  const eIndex = args.indexOf('-e');
  if (eIndex > -1 && args[eIndex + 1]) {
    return args[eIndex + 1];
  } else {
    return '';
  }
};

exports.resolvePosterEntry = function resolvePosterEntry(filterPattern) {
  let entry = {};

  try {
    const patterns = ['pages/**/__posters__/**/index.(js|ts|vue)'];
    let entries = fg.sync(patterns);
    if (filterPattern) {
      const p = new RegExp(filterPattern);
      entries = entries.filter(entry => p.test(entry));
    }
    entry = entries.reduce((map, entry) => {
      const key = dirname(entry)
        .replace('pages/', '')
        .replace('components/', '')
        .replace('__posters__/', '');
      const path = resolve(process.cwd(), entry);
      map[key] = path;

      return map;
    }, {});
  } catch (err) {
    console.error(err);
  }

  return entry;
};

exports.resolveSkeletonEntry = function resolveSkeletonEntry(filterPattern) {
  let entry = {};

  try {
    const patterns = ['pages/**/__skeleton__/**/index.(js|ts|vue)'];
    let entries = fg.sync(patterns);
    if (filterPattern) {
      const p = new RegExp(filterPattern);
      entries = entries.filter(entry => p.test(entry));
    }
    entry = entries.reduce((map, entry) => {
      const key = dirname(entry)
        .replace('pages/', '')
        .replace('components/', '')
        .replace('/__skeleton__', '');
      const path = resolve(process.cwd(), entry);
      map[key] = path;

      return map;
    }, {});
  } catch (err) {
    console.error(err);
  }

  return entry;
};
