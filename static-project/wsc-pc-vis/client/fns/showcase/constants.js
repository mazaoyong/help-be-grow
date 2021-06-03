import get from 'lodash/get';
import { isSepShopMode } from '@youzan/retail-utils-shop';

export const initGoodsListData = {
  // 列表样式（0: 大图, 1: 小图, 2: 一大两小, 3: 详细列表)
  size: '0',

  // (0: 卡片式, 1: 瀑布流, 2: 极简样式, 3: 促销样式)
  size_type: '0',

  // 显示购买按钮（0: 不显示, 1: 显示）
  buy_btn: '1',

  // 购买按钮样式
  buy_btn_type: '1',

  // 显示商品名（0: 不显示, 1: 显示）
  title: '1',

  // 显示商品描述
  show_sub_title: '0',

  // 显示价格（0: 不显示, 1: 显示）
  price: '1',

  // 是否显示角标 (0: 不显示, 1: 显示)
  show_corner_mark: '0',

  // 角标样式（0: 新品, 1: 热卖, 2: NEW, 3: HOT）
  corner_mark_type: '0',

  // 编辑时的默认占位图片，一般通过各个微页面模板指定
  default_image_url: '',
};

const DEFAULT_BACKGROUND = '#f9f9f9';

export const initConfigData = {
  type: 'config',

  // 标题
  title: '微页面标题',

  //  背景颜色
  color: DEFAULT_BACKGROUND,

  // 1全局配置、0自定义配置
  is_global_setting: '1',

  // 分类
  category: [],

  // 页面描述
  description: '',
};

// 保存请求需要的配置
export const saveConfig = {
  is_display: 1,
  isSave: true,
  isDraft: false,
  isPreview: false,
};

// 仅在当前页面保存
export const saveOnlyConfig = {
  is_display: 1,
  isSaveOnly: true,
  isSave: false,
  isDraft: false,
  isPreview: false,
};

// 保存草稿
export const draftConfig = {
  is_display: 0,
  isSave: false,
  isDraft: true,
  isPreview: false,
};

// 预览按钮
export const previewConfig = {
  is_display: 1,
  isSave: false,
  isDraft: false,
  isPreview: true,
};

// 精简版的保存并推广
export const simplificationConfig = {
  is_display: 1,
  isSave: false,
  isDraft: false,
  isPreview: false,
  isSimplification: true,
};

// 二合一要求最低小程序版本
export const NEW_WEAPP_VERSION = '1.19.1';

// 默认chooseMenu下拉列表
// 小程序内测链接类型(20180328 全量开放)
const menuItems = [
  'FeatureAndCategory',
  'GoodsAndTag',
  'Coupon',
  'SecKill',
  'Apps',
  'Survey',
  'History',
  'HomePage',
  'UserCenter',
  'OfflineList',
  'OfflinePage',
  'Cart',
  'AllGoods',
  'Chat',
  'PointsStore',
  'CourseGoods',
  'CourseGroup',
  'CourseCategory',
  'MyPaidContent',
  'Link',
  'CalendarCheckIn',
];

const menuItemsConfig = {
  Shopnote: {
    show: !isSepShopMode,
  },
  ShopnoteDetail: {
    show: !isSepShopMode,
  },
  EduCourse: {
    show: _global.isYZEdu,
  },
  AllCourse: {
    show: _global.isYZEdu,
  },
};

// 根据白名单返回下拉菜单列表
const getMenuItems = items => {
  const additionalItems = Object.keys(menuItemsConfig).filter(item => {
    const { show = true, whiteList } = menuItemsConfig[item];
    return show && (!whiteList || get(_global, whiteList, false));
  });

  return items.concat(additionalItems);
};

export const linkMenuItems = getMenuItems(menuItems);
// 2合1chooseMenu下拉列表
export const newLinkMenuItems = [].concat(linkMenuItems, 'WeappLink');
// 连锁门店支持网店下拉列表处理
export const newLinkMenuItemsSpec = [
  'Feature',
  'GoodsAndTag',
  'Coupon',
  'SecKill',
  // 'Survey',
  'HomePage',
  'UserCenter',
  'Cart',
  'AllGoods',
  'Chat',
  'PointsStore',
  'Link',
  'WeappLink',
];

// 判断精简版店铺
export const isDspShop = get(window._global, 'dsp_shop_config') === '1';

// 零售 3.0
export const isRetailV3 = !!get(window._global, 'shopInfo.saasSolution', false);

// 提示的店铺类型
export const noticeShopType = isRetailV3 ? '网店' : '门店';
