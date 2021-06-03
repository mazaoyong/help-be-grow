import { Toast } from 'vant';
import { cloneDeep } from 'lodash';
import mapKeysToCamelCase from '@youzan/utils/string/mapKeysToCamelCase';
import ua from '@youzan/utils/browser/ua';
import args from '@youzan/utils/url/args';
import goodsParser from './parser/goods-parser';
import activityParser from './parser/activity-parser';

const {
  kdt_id: kdtId,
  goodsType,
  design,
  shopMetaInfo = {},
  shopConfig = {},
  shopConfigs = {},
  lifecycleStatus,
  visPointsName = '积分',
  mp_data: mpData = {},
  mpFollowed = false,
  platformInfo = {},
  miniprogram = {},
  weappVersion = '',
  isGuang = false,
  visBuyer = {},
  user = {},
  salesmanInfo = {},
  offlineData = {},
  isShopRest = false,
} = _global;

let goodsData = {};

try {
  goodsData = JSON.parse(unescape(_global.goodsData));
  // clone 一下，方便查看后端返回数据
  _global.goodsData = cloneDeep(goodsData);
} catch (error) {
  // TODO 处理异常，进入异常页面
}

let activityData = [];

try {
  activityData = JSON.parse(unescape(_global.activityData));
  // clone 一下，方便查看后端返回数据
  _global.activityData = cloneDeep(activityData);
} catch (error) {
  Toast.error('活动信息加载失败');
}

const parsedGoodsData = goodsParser(goodsType, goodsData);

const checkUA = (targets) => {
  let ua;
  if (!navigator || !(ua = navigator.userAgent) || !Array.isArray(targets)) {
    return false;
  }

  return targets.every((target) => {
    return ua.toLowerCase().includes(target);
  });
};

const state = {
  kdtId: +kdtId,

  design,

  goodsType,

  goodsData: parsedGoodsData,

  goodsCoupons: [],
  activityDataCopy: activityData,

  /** 信息采集配置 */
  onlineCourseCollectSetting: {
    alias: '',
    collectSetting: [],
    needVerifyCode: false,
  },

  shopMetaInfo,

  shopConfig: mapKeysToCamelCase({
    ...shopConfig,
    ...shopConfigs,
    pointsName: visPointsName,
  }),

  shopLifeStatus: lifecycleStatus,

  isShopRest,

  mpData: mapKeysToCamelCase(mpData),

  mpFollowed,

  env: {
    ...mapKeysToCamelCase(platformInfo),

    ...miniprogram,

    isMobile:
      platformInfo.is_mobile &&
      (!checkUA(['windowswechat']) || checkUA(['miniprogram'])),

    weappVersion,

    isAndroid: platformInfo.mobile_system === 'android',

    isGuang,

    isWeixin: ua.isWeixin(),

    isIOSWeapp: miniprogram.isWeapp && platformInfo.mobile_system === 'ios',
  },

  user: {
    ...visBuyer,
    ...mapKeysToCamelCase(user),
  },

  salesmanInfo,

  offlineData,

  // 秒杀活动信息
  umpType: args.get('ump_type'),
  umpAlias: args.get('ump_alias') || args.get('ump_alias_bak'),

  // 以下为全局组件状态管理
  /** 当前选择 sku */
  selectedSku: null,
  /** 阶梯拼团当前选择阶梯 */
  selectedGrouponLadder: null,
  /** sku 弹窗的显隐状态 */
  skuPopupVisiable: false,

  /** 专栏免费内容数量，用于 column-free-block 和 column-catalogue-block */
  columnFreeContentCount: 0,

  /** 音视频播放结尾处推荐商品，由 recommends-goods-block 设置，用于 pct-image-block 音视频播放完成后展示 */
  audioOrVideoPlayEndRecommendGoods: null,

  /** 专栏排序缓存，用于 column-catalogue-block 和 base-info-block */
  sortType: 'desc',

  /** 专栏关联内容阅读进度缓存，用于 column-catalogue-block 和 base-info-block 和 pct-image-block */
  contentProgress: null,

  /** 专栏当前阅读进度缓存，用于 column-catalogue-block 和 base-info-block */
  columnProgress: null,

  /** 视频播放速度 */
  videoPlayRate: 1,
  manualCloseTuitionPopover: false,
};

Object.assign(state, activityParser(activityData, state));

export default state;
