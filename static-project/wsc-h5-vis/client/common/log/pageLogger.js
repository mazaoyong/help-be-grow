import $ from 'zepto';
import MakeUrlLog from './makeUrlLog';
import * as SafeLink from '@youzan/safe-link';

/**
 * 点击统计
 */
$(document).on('click', 'a', (e) => {
  const $this = $(e.currentTarget);
  // 当为没有链接的a 标签
  if (!$this.attr('href')) return;
  const urlArr = $this.attr('href').split('#');
  const url = urlArr[0];
  const toHashUrl = urlArr[1];
  const trimedUrl = $.trim(url);
  if (trimedUrl === '' || trimedUrl.indexOf('javascript') === 0 ||
    trimedUrl.indexOf('tel') === 0 || $this.hasClass('js-no-follow')) {
    return;
  }

  /**
   * 站内地址添加spm参数
   * 兼容老的beacon
   */
  let targetURL = url;

  if (url.match(/^https?:\/\/\S*\.?(koudaitong\.com|kdt\.im|youzan\.com)/)) {
    // MakeUrlLog封装了所有需要透传或者添加的参数
    targetURL = MakeUrlLog(url);
  }
  SafeLink.redirect({
    url: toHashUrl ? targetURL + '#' + toHashUrl : targetURL,
    kdtId: window._global.kdt_id,
  });
  return false;
});
