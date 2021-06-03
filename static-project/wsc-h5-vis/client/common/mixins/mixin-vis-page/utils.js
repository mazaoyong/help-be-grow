let defaultConfig = {};
let pageConfig = () => {};

export function getDefaultConfig() {
  return defaultConfig;
};

export function setDefaultConfig(config) {
  defaultConfig = config;
};

export function getPageConfig(fn) {
  return pageConfig;
};

export function setPageConfig(fn) {
  pageConfig = fn;
};
