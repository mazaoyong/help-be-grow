import * as DesignCompat from '@youzan/feature-adaptor';
import assign from 'lodash/assign';
import isArray from 'lodash/isArray';
import indexOf from 'lodash/indexOf';
import isFunction from 'lodash/isFunction';
import has from 'lodash/has';
import isNumber from 'lodash/isNumber';

import { DEFAULT_SETTINGS } from './settings';
import { titleInitialValue, imageTextNavInitialValue } from './defaults';

// 转换adaptor map
const compatMap = {
  text: DesignCompat.text,
  text_nav: DesignCompat.text,
  showcase: DesignCompat.cube,
  link: DesignCompat.link,
  image_ad: DesignCompat.imageAd,
  coupon: DesignCompat.coupon,
  groupon: DesignCompat.groupon,
  shop_banner: DesignCompat.shopBanner,
  period_buy: DesignCompat.periodbuy,
  ump_seckill: DesignCompat.seckill,
  goods: DesignCompat.goods,
  goods_list: DesignCompat.goods,
  ump_limitdiscount: DesignCompat.timelimitDiscount,
  tags: DesignCompat.tagListTop,
  tag_list: DesignCompat.tagListLeft,
  notice: DesignCompat.notice,
  store: DesignCompat.store,
};

// 所有组件type的枚举
const designTypeSet = [
  'config',
  'rich_text',
  'goods',
  'goods_list',
  'tags',
  'tag_list',
  'tag_list_top',
  'tag_list_left',
  'image-ad',
  'showcase',
  'cube_v3',
  'cube2',
  'text',
  'text_nav',
  'nav',
  'old_nav',
  'image_text_nav',
  'top_nav',
  'image_ad',
  'link',
  'title',
  'coupon',
  'groupon',
  'period_buy',
  'ump_seckill',
  'ump_limitdiscount',
  'unicashier',
  'paid_column',
  'paid_content',
  'paid_member',
  'paid_live',
  'shop_banner',
  'shop_banner_weapp',
  'tpl_shop',
  'store',
  'search',
  'notice',
  'audio',
  'video',
  'offline_shop_info',
  'contact_us',
  'line',
  'white',
  'component',
  'default_tag_list',
  'classification',
  'pictorial_magazine',
  'tpl_new_take_away',
  'present_gift',
  'bargain',
  'goods_new',
  'shop_usercenter',
];

// 需要单独加image_fill_style属性的组件
const imageFillStyleComponents = [
  'period_buy',
  'ump_seckill',
  'groupon',
  'tag_list_left',
  'image_ad',
];

const { newPolyFill } = DesignCompat.goods;

/**
 * 格式化config数据，背景色初始化等等
 * @param {*} config
 * @param {*} designSetting 默认背景色等数据
 */
// eslint-disable-next-line
function transformConfigData(config, designSetting) {
  const { category } = config;

  if (isArray(category) && category.length > 0) {
    config.category = category.map(item => {
      return item.toString();
    });
  }

  if (!has(config, 'is_global_setting')) {
    config.is_global_setting = '1';
  }

  return config;
}

// 不需要old2new
const noOld2New = data => {
  return data;
};

// 新版图文导航转换逻辑（20180322 开放体验版先使用，所以这里需要判断体验版逻辑）
function transformNavData(item) {
  item = assign({}, imageTextNavInitialValue, item, {
    type: 'image_text_nav',
  });

  return item;
}

/**
 * 兼容老编辑器组件数据 (包括增减字段，老数据兼容)
 */
function compatData(data, designSetting, options) {
  let item = data;
  const type = data.type;
  const old2newFunc = compatMap[type] ? compatMap[type].old2new : noOld2New;

  // config 微页面配置
  if (type === 'config') {
    item = (isFunction(options.transformConfig) ? options.transformConfig : transformConfigData)(
      item,
      designSetting
    );
  } else if (type === 'tag_list_top') {
    item = newPolyFill(
      assign(
        {
          image_fill_style: '2', // 填充方式
          sticky: '0', // 顶部不固定
        },
        item
      )
    );
  } else if (type === 'tags') {
    item = old2newFunc(
      assign({}, item, {
        type: 'tag_list_top',
        sticky: '0',
      })
    );
  } else if (type === 'goods') {
    item = newPolyFill(
      old2newFunc(
        assign(
          {
            corner_mark_image: '',
            buy_btn_express: '0',
            image_fill_style: designSetting.fillStyle,
          },
          item
        )
      )
    );
  } else if (type === 'tag_list') {
    item = old2newFunc(
      assign(
        {
          buy_btn_express: '0',
        },
        item,
        {
          type: 'tag_list_left',
        }
      )
    );
  } else if (type === 'tag_list_left') {
    item = assign(
      {
        buy_btn_express: '0',
      },
      item
    );
  } else if (indexOf(imageFillStyleComponents, type) !== -1) {
    item = old2newFunc(
      assign(
        {
          image_fill_style: designSetting.fillStyle, // 填充方式
        },
        item
      )
    );
  } else if (type === 'ump_limitdiscount') {
    item = old2newFunc(
      assign(
        {
          show_count_down: '0', // 显示倒计时,
          show_time_limit: '0', // 显示抢购进度条,
          show_stock_num: '0', // 显示剩余库存
          image_fill_style: designSetting.fillStyle, // 填充方式
        },
        item
      )
    );
  } else if (type === 'tpl_shop') {
    // 店铺信息组件替换
    item = {
      type: 'shop_banner_weapp',
      store_info_style: '1',
      background_image: item.backgroundImage || '',
    };
  } else if (type === 'shop_banner') {
    // 店铺信息组件替换
    item = {
      type: 'shop_banner_weapp',
      store_info_style: '4',
      background_image: item.background_image || '',
    };
  } else if (type === 'title') {
    if (isNumber(item.show_method)) {
      item.show_method = `${item.show_method}`;
    }

    // 标题默认数据merge
    item = assign({}, titleInitialValue, item);
  } else if (type === 'rich_text') {
    item = {
      ...item,
    };
    // 新创建的店铺有个默认微页面，那个微页面里的富文本组件数据有问题
    if (!has(item, 'color')) {
      item.color = DEFAULT_SETTINGS.backgroundColor;
    }
  } else if (type === 'nav' || type === 'old_nav') {
    item = transformNavData(item);
  } else {
    item = old2newFunc(item);
  }

  return item;
}

/**
 * 给 sentry 发信息，记录微页面组件type不对的信息
 * @param {*} type 不合法的微页面组件type
 */
/* eslint-disable */
function sendSentryWarning(item = {}) {
  const module = (global._global || {}).module || 'global';
  typeof Raven === 'object' &&
    Raven.captureMessage &&
    Raven.captureMessage(`Design type error: ${item.type} is not valid.`, {
      level: 'warning',
      extra: {
        item
      },
      tags: {
        Type: 'DesignTypeError'
      }
    });
}
/* eslint-enable */

/**
 * 过滤掉type不正确的组件
 * @param {*} data
 */
function filterDesignData(data, extraType = []) {
  let filteredData;
  const customDesignTypeSet = designTypeSet.concat(extraType);
  if (data && Array.isArray(data) && data.length > 0) {
    filteredData = data.filter(item => {
      if (indexOf(customDesignTypeSet, item.type) !== -1) {
        return true;
      }
      sendSentryWarning(item);
      return false;
    });
  } else {
    filteredData = [];
  }
  return filteredData;
}

/**
 * 微页面数据兼容(包括增减字段，老数据兼容)
 * @param {*} data 后端请求的微页面数据
 */
export function handleTransformData(data, designSetting = DEFAULT_SETTINGS, options = {}) {
  // 先扫一遍组件data，不识别的type丢掉
  const correctData = filterDesignData(data, options.extraType);
  let compatedData;
  if (correctData && Array.isArray(correctData) && correctData.length > 0) {
    compatedData = correctData.reduce((components, item) => {
      const compatedItem = compatData(item, designSetting, options);
      if (Array.isArray(compatedItem)) {
        components = components.concat(compatedItem);
      } else {
        components.push(compatedItem);
      }
      return components;
    }, []);
  } else {
    compatedData = [];
  }

  return compatedData;
}
