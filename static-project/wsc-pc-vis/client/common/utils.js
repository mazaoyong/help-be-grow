import $ from 'zan-utils/jquery';
import formatMoney from 'zan-utils/money/format';
import formatLargeNumber from 'zan-utils/money/formatLargeNumber';
import isArray from 'lodash/isArray';
import { get } from 'lodash';
import qs from 'qs';

const formatPercent = value => `${value / 100}%`;

export default {
  /**
   * 通过类型格式化统计数据
   *
   * @export
   * @param {number} rawValue 统计值
   * @param {Object} formatType 类型信息
   * @return {string|number} 格式化后的值
   */
  formatByType(rawValue, formatType) {
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
  },
  /**
   * 切换三级导航
   *
   * @param  {string} selector 需要被显示的元素的选择器
   * @param  {string} text     如果显示的元素是 breadcrumb 切指定了 text 值，那么该值将作为breadcrumb最后一个span元素的内容
   */
  switchThirdSidebar(selector, text) {
    const $thirdSidebar = $('.js-app-third-sidebar');
    $thirdSidebar.find('.ui-nav, .zent-breadcrumb').hide();

    const $el = $thirdSidebar.find(selector);
    $el.show();

    if ($el.hasClass('zent-breadcrumb') && text !== void 0) {
      const $span = $el.find('span:last-child');
      if ($span.length === 1) {
        $span.html(text);
      }
    }
  },

  /* 三级导航高亮
   * activeElem 传空的话，表示清除当前导航的所有高亮
   */
  navActive(activeElem, options) {
    const $uiNav = $('.ui-nav');
    if ($uiNav.length > 0) {
      $('li.active', $uiNav).removeClass('active');
      $(activeElem).addClass('active');
      return;
    }
    const opts = $.extend(options, {
      navBlock: '.third-nav__links',
    });
    $(opts.navBlock)
      .children('li.active')
      .removeClass('active');
    if (activeElem) {
      $(activeElem).addClass('active');
    }
  },

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
  formatFileSize(size, toFixed, unit) {
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
  },

  /**
   * 将持续时间格式化成适合阅读的字符串
   *
   * @param  {number} duration 秒
   * @return {string}
   * @example
   * formatDuration(100) => '01:40'
   * formatDuration(10000) => '02:46:40'
   */
  formatDuration(duration) {
    duration = Math.max(0, (+duration || 0).toFixed(0));

    const secondPart = duration % 60;
    const minutePart = ((duration - secondPart) / 60) % 60;
    const hourPart = (duration - minutePart * 60 - secondPart) / 3600;

    // 补零
    const padding = n => (n < 10 ? `0${n}` : n);

    const result = [padding(minutePart), padding(secondPart)];

    if (hourPart > 0) {
      result.unshift(padding(hourPart));
    }

    return result.join(':');
  },

  /**
   * 计算商品规格表头
   *
   * @param  {Array} stock 规格明细
   * @param  {string} vid 规格标识符，默认值为 'vid'，可选值还有 'sid'
   */
  calcRowNumber(stock, vid) {
    if (!isArray(stock)) return;

    let row1 = 0;
    let row2 = 0;
    let s1 = 'v1_id';
    let s2 = 'v2_id';

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
  },
};

/**
 *  触发zentForm validate
 *  @param zentForm zengForm实例
 *  @callback 校验通过的回调函数
*/

export function forceValidForm(zentForm, callback = () => {}) {
  zentForm.validateForm(true, () => {
    zentForm.asyncValidateForm(callback);
  });
}

/**
 * 获取kdtId，校区总部请取数据所属的kdtId
 * @param {object} obj 参数
 * @param {object} obj.data 数据对象
 * @param {string} obj.path 获取 data 内 kdtId 的键路径
 * @param {boolean} obj.fromUrl 是否从当前页面url获取kdtId
 * @param {string} obj.urlParamKey kdtId在url中所属键名
 *
 */

export function getKdtId({ fromUrl = false, urlParamKey = 'kdtId', data, path = 'kdtId' }) {
  const currentKdtId = _global.kdtId || _global.kdt_id;
  if (fromUrl) {
    return getQueryParams(urlParamKey) || currentKdtId;
  }
  if (data && path) {
    return get(data, path, currentKdtId);
  };
  return currentKdtId;
}

/**
 * 获取url中的查询参数
 * @param {string} paramName 查询参数名称
 */

export function getQueryParams(paramName) {
  const searchStr = window.location.search.slice(1);
  const queryParams = qs.parse(searchStr);
  if (paramName) return get(queryParams, paramName, '');
  return queryParams;
}
