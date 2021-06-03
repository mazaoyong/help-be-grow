import $ from 'zan-utils/jquery';
import formatMoney from 'zan-utils/money/format';
import formatLargeNumber from 'zan-utils/money/formatLargeNumber';
import isArray from 'lodash/isArray';

const formatPercent = value => `${value / 100}%`;

/**
 * 通过类型格式化统计数据
 *
 * @export
 * @param {number} rawValue 统计值
 * @param {Object} formatType 类型信息
 * @return {string|number} 格式化后的值
 */
export function formatByType(rawValue, formatType) {
  if (rawValue === null || rawValue === undefined) {
    return formatType === 'BASE' ? 0 : '-';
  }

  switch (formatType) {
    case 'INTEGER':
      return formatLargeNumber(rawValue);
    case 'FLOAT':
      return rawValue.toFixed(2);
    case 'PERCENT':
      return formatPercent(rawValue);
    case 'MONEY':
      return formatMoney(rawValue);
    default:
      return rawValue;
  }
}
/**
 * 切换三级导航
 *
 * @param  {string} selector 需要被显示的元素的选择器
 * @param  {string} text     如果显示的元素是 breadcrumb 切指定了 text 值，那么该值将作为breadcrumb最后一个span元素的内容
 */
export function switchThirdSidebar(selector, text) {
  let $thirdSidebar = $('.js-app-third-sidebar');
  $thirdSidebar.find('.ui-nav, .zent-breadcrumb').hide();

  let $el = $thirdSidebar.find(selector);
  $el.show();

  if ($el.hasClass('zent-breadcrumb') && text !== void 0) {
    let $span = $el.find('span:last-child');
    if ($span.length === 1) {
      $span.html(text);
    }
  }
}

/* 三级导航高亮
   * activeElem 传空的话，表示清除当前导航的所有高亮
   */
export function navActive(activeElem, options) {
  let $uiNav = $('.ui-nav');
  if ($uiNav.length > 0) {
    $('li.active', $uiNav).removeClass('active');
    $(activeElem).addClass('active');
    return;
  }
  let opts = $.extend(options, {
    navBlock: '.third-nav__links',
  });
  $(opts.navBlock)
    .children('li.active')
    .removeClass('active');
  if (activeElem) {
    $(activeElem).addClass('active');
  }
}

/**
 * 将文件的Byte转换为可读性更好的GB\MB\KB\B
 *
 * @param  {number} size    大小，单位Byte
 * @param  {number} toFixed 保留几位小数，默认值为1
 * @param  {number} unit 视频单位
 * @return {string}         格式化后的字符串
 * @example
 * formatFileSize(1024) => '1 MB'
 */
export function formatFileSize(size, toFixed, unit) {
  size = +size || 0;

  if (toFixed === void 0) {
    toFixed = 1;
  }

  if (unit === 'GB' || size >= 1024 * 1024 * 1024) {
    return `${(size / (1024 * 1024 * 1024)).toFixed(toFixed)} GB`;
  } else if (unit === 'MB' || size >= 1024 * 1024) {
    return `${(size / (1024 * 1024)).toFixed(toFixed)} MB`;
  } else if (unit === 'KB' || size >= 1024) {
    return `${(size / 1024).toFixed(toFixed)} KB`;
  }
  return `${size.toFixed(toFixed)} B`;
}

/**
 * 将持续时间格式化成适合阅读的字符串
 *
 * @param  {number} duration 秒
 * @return {string}
 * @example
 * formatDuration(100) => '01:40'
 * formatDuration(10000) => '02:46:40'
 */
export function formatDuration(duration) {
  duration = Math.max(0, (+duration || 0).toFixed(0));

  let secondPart = duration % 60;
  let minutePart = ((duration - secondPart) / 60) % 60;
  let hourPart = (duration - minutePart * 60 - secondPart) / 3600;

  // 补零
  let padding = n => (n < 10 ? `0${n}` : n);

  let result = [padding(minutePart), padding(secondPart)];

  if (hourPart > 0) {
    result.unshift(padding(hourPart));
  }

  return result.join(':');
}

/**
 * 计算商品规格表头
 *
 * @param  {Array} stock 规格明细
 * @param  {string} vid 规格标识符，默认值为 'vid'，可选值还有 'sid'
 */
export function calcRowNumber(stock, vid) {
  if (!isArray(stock)) return;

  let row1 = 0;
  let row2 = 0;
  let s1 = 'v1Id';
  let s2 = 'v2Id';

  if (vid === 'sid') {
    s1 = 's1';
    s2 = 's2';
  }

  stock.forEach((item, index) => {
    if (item[s1] === stock[row1][s1]) {
      if (row1 !== index) {
        stock[row1].row_1_num++;
        item.row_1_num = 0;
      } else {
        item.row_1_num = 1;
      }
    } else {
      item.row_1_num = 1;
      row1 = index;
      item.is_new_row = 1;
    }

    if (row1 !== index && item[s2] === stock[row2][s2]) {
      if (row2 !== index) {
        stock[row2].row_2_num++;
        item.row_2_num = 0;
      } else {
        item.row_2_num = 1;
      }
    } else {
      item.row_2_num = 1;
      row2 = index;

      if (stock[0].row_2_num > 1) {
        item.is_new_row = 1;
      }
    }

    item.row_3_num = 1;
  });

  return stock;
};

// 将后端传来的自定义按钮配置array转化为object
export const getbuttonCustomDescMap = (customDescList) => {
  const buttonCustomDescMap = {};
  customDescList.forEach(item => {
    if (item.coursePriceType === 'ZERO') {
      buttonCustomDescMap['ZERO'] = item.desc;
    } else if (item.coursePriceType === 'NON_ZERO') {
      buttonCustomDescMap['NON_ZERO'] = item.desc;
    };
  });
  return buttonCustomDescMap;
};
