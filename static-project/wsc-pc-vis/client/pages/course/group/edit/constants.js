import get from 'lodash/get';

export const DEFAULT_GOODS_IMAGE =
  'https://img.yzcdn.cn/public_files/2018/01/30/585dae8447d80013ef9344adc973c6ee.png';

/**
 * 微页面组件类型
 */
export const componentType = {
  TITLE_TEXT: 'title_text', // 标题文本
  GOODS_GROUP: 'goods_group', // 商品分组
  IMAGE_AD: 'image_ad', // 图文广告
  IMAGE_TEXT_NAV: 'image_text_nav', // 图文导航
  MAGIC_CUBE: 'cube_v3', // 魔方
  RICH_TEXT: 'rich_text', // 富文本
  WHITE_LINE: 'white_line', // 辅助线
  CUSTOM_MODULE: 'component', // 店铺信息
  NOTICE: 'notice', // 公告
  COUPON: 'coupon', // 优惠券
  LIMITED_DISCOUNT: 'ump_limitdiscount',
  SEC_KILL: 'ump_seckill',
  GROUPON: 'groupon',
  CHECKIN: 'checkin',
  SEARCH: 'search',
  AUDIO: 'audio',
  CONTACT_US: 'contact_us',
  SOCIAL_FANS: 'social_fans',
  PERIOD_BUY: 'period_buy',
  NOTE_CARD: 'note_card',
  ORIENTED_POSTER: 'oriented_poster',
  STORE: 'store',
  VIDEO: 'video',
  GOODS_RECOMMEND: 'goods_recommend',
  POINTS_GOODS: 'points_goods',
  BARGAIN: 'bargain',
  SHOP_INFO: 'shop_banner_weapp',
  PAID_COLUMN: 'paid_column', // 教育-专栏
  PAID_CONTENT: 'paid_content', // 教育-内容
  PAID_LIVE: 'paid_live', // 教育-直播
  PAID_MEMBER: 'paid_member', // 教育-会员权益
  PUNCH: 'punch', // 教育-打卡
  EDU_GOODS: 'knowledge-goods', // 重构课程&课程分组
  TEACHER: 'teacher',
  EDU_REGIS_FORM: 'edu-regis-form',
};

export const comsLibMap = [
  {
    id: 'base-coms',
    name: '基础组件',
    list: [
      componentType.TITLE_TEXT,
      componentType.GOODS_GROUP,
      componentType.IMAGE_AD,
      componentType.IMAGE_TEXT_NAV,
      componentType.RICH_TEXT,
      componentType.MAGIC_CUBE,
      componentType.WHITE_LINE,
      componentType.SEARCH,
      componentType.SHOP_INFO,
      componentType.STORE,
      componentType.NOTICE,
      componentType.VIDEO,
      componentType.AUDIO,
      componentType.CUSTOM_MODULE,
      componentType.SOCIAL_FANS,
      componentType.NOTE_CARD,
      componentType.ORIENTED_POSTER,
      componentType.GOODS_RECOMMEND,
      componentType.CONTACT_US,
    ],
  },
  {
    id: 'ump-coms',
    name: '营销组件',
    list: [
      componentType.COUPON,
      componentType.LIMITED_DISCOUNT,
      componentType.SEC_KILL,
      componentType.GROUPON,
      componentType.BARGAIN,
      componentType.PERIOD_BUY,
      componentType.POINTS_GOODS,
      componentType.PAID_COLUMN,
      componentType.PAID_CONTENT,
      componentType.PAID_LIVE,
      componentType.PAID_MEMBER,
      componentType.PUNCH,
    ],
  },
];

// 广点通店铺, 单独维护一份编辑器列表
export const dspComsLibMap = [
  {
    id: 'base-coms',
    name: '基础组件',
    list: [
      componentType.TITLE_TEXT,
      componentType.GOODS_GROUP,
      componentType.IMAGE_AD,
      componentType.IMAGE_TEXT_NAV,
      componentType.RICH_TEXT,
      componentType.MAGIC_CUBE,
      componentType.WHITE_LINE,
      componentType.SEARCH,
      componentType.SHOP_INFO,
      componentType.STORE,
      componentType.NOTICE,
      componentType.VIDEO,
      componentType.AUDIO,
      componentType.CUSTOM_MODULE,
      componentType.CONTACT_US,
      componentType.SOCIAL_FANS,
    ],
  },
  {
    id: 'ump-coms',
    name: '营销组件',
    list: [
      componentType.COUPON,
      componentType.LIMITED_DISCOUNT,
      componentType.SEC_KILL,
      componentType.GROUPON,
      componentType.PERIOD_BUY,
      componentType.POINTS_GOODS,
    ],
  },
];

// 零售连锁店铺
export const chainStoreComsLibMap = [
  {
    id: 'base-coms',
    name: '基础组件',
    list: [
      componentType.TITLE_TEXT,
      componentType.GOODS_GROUP,
      componentType.IMAGE_AD,
      componentType.IMAGE_TEXT_NAV,
      componentType.RICH_TEXT,
      componentType.MAGIC_CUBE,
      componentType.WHITE_LINE,
      componentType.SEARCH,
      componentType.SHOP_INFO,
      componentType.STORE,
      componentType.NOTICE,
      componentType.VIDEO,
      componentType.AUDIO,
      componentType.CUSTOM_MODULE,
      componentType.CONTACT_US,
    ],
  },
  {
    id: 'ump-coms',
    name: '营销组件',
    list: [
      componentType.COUPON,
      componentType.LIMITED_DISCOUNT,
      // componentType.SEC_KILL,
      componentType.GROUPON,
      componentType.POINTS_GOODS,
    ],
  },
];

// 教育店铺
export const eduComsLibMap = [
  {
    id: 'base-coms',
    name: '基础组件',
    list: [
      componentType.TITLE_TEXT,
      componentType.GOODS_GROUP,
      componentType.IMAGE_AD,
      componentType.IMAGE_TEXT_NAV,
      componentType.RICH_TEXT,
      componentType.MAGIC_CUBE,
      componentType.WHITE_LINE,
      componentType.SEARCH,
      componentType.SHOP_INFO,
      componentType.STORE,
      componentType.NOTICE,
      componentType.VIDEO,
      componentType.AUDIO,
      componentType.CUSTOM_MODULE,
      componentType.SOCIAL_FANS,
      componentType.NOTE_CARD,
      componentType.ORIENTED_POSTER,
      componentType.GOODS_RECOMMEND,
      componentType.CONTACT_US,
    ],
  },
  {
    id: 'ump-coms',
    name: '营销组件',
    list: [
      componentType.COUPON,
      componentType.LIMITED_DISCOUNT,
      componentType.SEC_KILL,
      componentType.GROUPON,
      componentType.BARGAIN,
      componentType.PERIOD_BUY,
      componentType.POINTS_GOODS,
    ],
  },
  {
    id: 'edu-coms',
    name: '教育组件',
    list: [
      componentType.TEACHER,
      componentType.PAID_COLUMN,
      componentType.PAID_CONTENT,
      componentType.PAID_LIVE,
      componentType.PAID_MEMBER,
      componentType.PUNCH,
    ],
  },
];

// 根据店铺是否为精简版店铺，区分designComponents
const isDspShop = get(window._global, 'dsp_shop_config') === '1';
// 是否为零售连锁多网点模式的 店铺
const chainOnlineShopMode = get(_global, 'shopInfo.chainOnlineShopMode');
const onlineShopOpen = get(_global, 'shopInfo.onlineShopOpen');
const shopType = get(_global, 'shopInfo.shopType');
const shopRole = get(_global, 'shopInfo.shopRole');
let isChainStoreNew = false;
// 零售连锁店铺
if (shopType === 7 && shopRole !== 0) {
  // 零售连锁（多网店版）-总部
  const isChainStoreMainOffice = shopRole === 1 && chainOnlineShopMode === 2;
  // 零售连锁（多网店版）-开启网店的门店
  const isChainStoreBranchOffice = shopRole === 2 && onlineShopOpen;
  isChainStoreNew = isChainStoreMainOffice || isChainStoreBranchOffice;
}
// 是否是教育店铺
const isYZEdu = get(_global, 'isYZEdu');

export const getComsLibMap = () => {
  if (isDspShop) {
    return dspComsLibMap;
  } else if (isChainStoreNew) {
    return chainStoreComsLibMap;
  } else if (isYZEdu) {
    return eduComsLibMap;
  } else {
    return comsLibMap;
  }
};
