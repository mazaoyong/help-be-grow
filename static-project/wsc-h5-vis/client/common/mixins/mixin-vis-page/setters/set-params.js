import Args from 'zan-utils/url/args';

function getParamFromRoute(vm, key) {
  return vm.$route && (vm.$route.params[key] || vm.$route.query[key]);
}

function getParamFromUrl(key) {
  return Args.get(key);
}

function getParam(vm, key) {
  return getParamFromRoute(vm, key) || getParamFromUrl(key);
}

export default function setParams(vm, pageConfig) {
  if (!pageConfig.params) return;

  const { params } = pageConfig;
  const paramKeys = Object.keys(params);
  vm.$params = new Proxy(pageConfig.params, {
    get(obj, prop) {
      if (paramKeys.indexOf(prop) < 0) return '';
      return getParam(vm, prop);
    },
  });
}
