import Args from 'zan-utils/url/args';
import { ajax } from '@youzan/vis-ui';
// TODO 内容专栏接口有data adapter，此处越级引用，@小瑞 重构后清除
import * as adapter from '../../../pages/paid-content/api/adapter';

const prefetchApis = {
  getContent: adapter.getContent(function(data) {
    return ajax({
      url: '/wscvis/course/getDetail.json',
      data,
      loading: false,
    });
  }),

  // 活动全部迁移到新的接口
  getActivities(data) {
    return ajax({
      url: '/wscvis/knowledge/newActivityInfos.json',
      data,
      toCamelCase: true,
      loading: false,
    });
  },

  getColumn: adapter.getColumn(function(data) {
    return ajax({
      url: '/wscvis/course/getDetail.json',
      data,
      toCamelCase: true,
      loading: false,
    });
  }),
};

const alias = getArgFromHash('alias') || Args.get('alias');
const prefetchConfig = {
  '/wscvis/knowledge/index?p=contentshow#/contentshow'() {
    return [
      prefetchApis.getContent({
        alias,
      }),
      prefetchApis.getActivities({
        alias,
        productType: 31,
      }),
    ];
  },
  '/wscvis/knowledge/index?p=columnshow#/columnshow'(params) {
    return [
      prefetchApis.getColumn({
        alias,
      }),
      prefetchApis.getActivities({
        alias,
        productType: 31,
      }),
    ];
  },
};

function getArgFromHash(key) {
  let hash = window.location.hash;
  if (hash) {
    const search = hash.match(/\?.+$/) && hash.match(/\?.+$/)[0];

    if (search) {
      let params = null;
      try {
        params = new URLSearchParams(search);
      } catch (err) {
        return '';
      }
      return params && params.get(key);
    }
  }
  return '';
}

// 如果有hash值则hash值必须匹配
// 没有则只匹配路径和查询参数
const match = () => {
  const url = new URL(window.location.href);
  const pathname = url.pathname;
  const params = url.searchParams;
  const hash = url.hash;

  let matchedConfig = {};
  Object.keys(prefetchConfig)
    .forEach(path => {
      const matchUrl = new URL(`${_global.url.h5}${path}`);
      const matchPathname = matchUrl.pathname;
      const matchParams = matchUrl.searchParams;
      const matchHash = matchUrl.hash;

      // 匹配子路径和查询参数
      let pathMatched = false;
      if (pathname.indexOf(matchPathname) > -1) {
        pathMatched = true;
        matchParams.forEach((value, key) => {
          if (params.get(key) !== value) {
            pathMatched = false;
          }
        });
      }
      // 匹配hash值，暂不支持匹配hash查询参数
      let hashMatched = true;
      if (hash && matchHash) {
        hashMatched = hash.indexOf(matchHash) > -1;
      }

      if (pathMatched && hashMatched) {
        let prefetchPromises = prefetchConfig[path]();
        matchedConfig[path] = prefetchPromises;
        // done 之后销毁实例
        if (Array.isArray(prefetchPromises)) {
          prefetchPromises.forEach((promise, index) => {
            promise.finally(() => { prefetchPromises[index] = null; });
          });
        }
      }
    });
  return matchedConfig;
};

let matched = {};
try {
  matched = match();
} catch (error) {
  console.warn(error);
};

window.__prefetchPromises = matched;
