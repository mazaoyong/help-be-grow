/* eslint-disable no-underscore-dangle */

// const DEFAULT_URL_MAP = (window._global && window._global.url) || {};
const DEFAULT_URL_MAP = {
  base: '//www.youzan.com',
  domain: 'www.youzan.com',
  www: '//www.youzan.com/v2',
  wsc: '//www.youzan.com/v3',
  v4: '//www.youzan.com/v4',
  scrm: '//www.youzan.com/scrm',
  store: '//store.youzan.com',
  materials: '//materials.youzan.com',
  login: '//login.youzan.com',
  uic: '//uic.youzan.com',
  h5: 'https://h5.youzan.com',
  wap: 'https://h5.youzan.com/v2',
  static: 'https://static.youzan.com',
  cdnStatic: 'https://b.yzcdn.cn',
  imgqn: 'https://img.yzcdn.cn',
  bbs: '//bbs.youzan.com',
  help: '//help.youzan.com',
  im: 'https://b-im.youzan.com',
  fuwu: '//fuwu.youzan.com',
  account: 'https://account.youzan.com',
  fenxiao: '//fx.youzan.com',
};

export default function getUrl(path, domain = 'www', urlMap = DEFAULT_URL_MAP) {
  const domainUrl = urlMap[domain];

  if (!domainUrl) {
    throw new Error(`'${domain}' not found in urlMap`);
  }

  return `${domainUrl}${path}`;
}
