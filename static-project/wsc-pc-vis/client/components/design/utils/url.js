/* eslint-disable no-underscore-dangle */

const DEFAULT_URL_MAP = (window._global && window._global.url) || {};

export default function getUrl(path, domain = 'www', urlMap = DEFAULT_URL_MAP) {
  const domainUrl = urlMap[domain];

  if (!domainUrl) {
    throw new Error(`'${domain}' not found in urlMap`);
  }

  return `${domainUrl}${path}`;
}
