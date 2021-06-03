import queryString from 'zan-utils/url/queryString';
import * as SafeLink from '@youzan/safe-link';

export function redirectToLock(title) {
  const searchObj = queryString.parse(window.location.search);
  searchObj.title = title;
  const searchStr = queryString.stringify(searchObj);
  SafeLink.redirect({
    url: `${window.location.pathname}?${searchStr}#/lock`,
    kdtId: window._global.kdt_id,
    redirectType: 'replace',
  });
}
