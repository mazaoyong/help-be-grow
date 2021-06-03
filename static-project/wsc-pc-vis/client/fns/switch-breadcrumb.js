import $ from 'zan-utils/jquery';

/**
 * 切换面包屑导航
 *
 * @param {*} text 三级导航文本
 * @param {string} [href=`${window._global.url.wsc}/paidcontent/content`] 二级导航跳转链接
 */
const switchBreadcrumb = function(text, href = `${window._global.url.wsc}/paidcontent/content`) {
  if (/http(s?):\/\//.test(href) === false) {
    href = `${window._global.url.base}/${href}`;
  }

  let $thirdSidebar = $('.js-app-third-sidebar');
  $thirdSidebar.find('.ui-nav, .zent-breadcrumb').hide();

  let $el = $thirdSidebar.find('.js-page-breadcrumb-main');
  $el.show();

  if (
    $el.hasClass('zent-breadcrumb') &&
    typeof href !== 'undefined' &&
    typeof text !== 'undefined'
  ) {
    let $second = $el.find('.second');
    $second.show();
    let $third = $el.find('.third');
    $second.attr('href', href);
    if ($third.length === 1) {
      $third.html(text);
    }
  }
};

/**
* 为了应对有赞教育特殊的面包屑需求，对原有的switchBreadcrumb做一层拦截处理
*
* @param {*} text 三级导航文本
* @param {*} href 二级导航跳转链接
* @return {*} undefined
*/
const _eduSwitchBreadcrumb = function(
  text,
  href = `${window._global.url.wsc}/paidcontent/content`
) {
  if (!_global.isYZEdu) {
    return switchBreadcrumb(text, href);
  }
  // 如果v3的内容专栏直播迁移过来，需要做特殊处理，此处全部执行替换二级title
  const target = $('#app-third-sidebar .zent-breadcrumb');
  if (!target) return;
  target.find('span').show();
  target.find('span').text(text);
};

/**
 * 替换二级面包屑文本
 *
 * @param {*} text 文本
 */
const _switchTopBreadcrumb = function(text = '知识付费') {
  const $thirdSidebar = $('.js-app-third-sidebar');
  const $el = $thirdSidebar.find('.js-page-breadcrumb-main');
  const $second = $el.find('.second');
  const $third = $el.find('.third');
  $second.hide();
  $third.html(text);
};

/**
 * 为了应对有赞教育特殊的面包屑需求，对原有的_switchTopBreadcrumb做一层拦截处理
 *
 * @param {*} text 文本信息
 * @return {*} undefined
 */
const _eduSwitchTopBreadcrumb = function(text = '知识付费') {
  return _switchTopBreadcrumb(text);
};

/**
 * 切换面包屑导航
 *
 * @param {string} action 动作
 * @param {*} param1 面包屑更新数据
 * @param {string} selector css选择器
 */
const _switchBreadcrumbV2 = function(
  action = 'add',
  { lastUrl, newText } = {},
  selector = '#app-third-sidebar .zent-breadcrumb'
) {
  if (/http(s?):\/\//.test(lastUrl) === false) {
    lastUrl = `${window._global.url.base}/${lastUrl}`;
  }
  const target = $(selector);
  switch (action) {
    case 'add': {
      let lastText = target.find('span').text();
      let newHrefNode = $(`<a href="${lastUrl}">${lastText}</a>`);
      let newTextNode = $(`<span>${newText}</span>`);
      target.find('span').remove();
      target.append(newHrefNode);
      target.append(newTextNode);
      break;
    }
    case 'del':
    case 'delete': {
      let lastHrefText = target.find('a:last').text();
      target.find('span').remove();
      target.find('a:last').remove();
      target.append($(`<span>${lastHrefText}</span>`));
      break;
    }
    case 'change':
    case 'update': {
      target.find('span').text(newText);
      target.find('a:last').attr('href', lastUrl);
      break;
    }
    default:
      break;
  }
};

/**
 * 自定义面包屑
 *
 * @param {string[]} navArray 面包屑
 * @param {string} selector css选择器
 */
export const defineBreadcrumb = function(
  navArray = [],
  selector = '#app-third-sidebar .zent-breadcrumb'
) {
  const target = $(selector);
  target.empty();
  navArray.forEach(item => {
    if (item.url && /http(s?):\/\//.test(item.url) === false) {
      item.url = `${window._global.url.base}/${item.url}`;
    }
    let navItem = item.url
      ? $(`<a href="${item.url}">${item.text}</a>`)
      : $(`<span>${item.text}</span>`);
    target.append(navItem);
  });
};

export default switchBreadcrumb;
export const switchBreadcrumbV2 = _switchBreadcrumbV2;
export const switchTopBreadcrumb = _switchTopBreadcrumb;
export const eduSwitchBreadcrumb = _eduSwitchBreadcrumb;
export const eduSwitchTopBreadcrumb = _eduSwitchTopBreadcrumb;
