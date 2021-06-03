import { cloneDeep } from 'lodash';
import mapKeysToCamelCase from '@youzan/utils/string/mapKeysToCamelCase';
import ua from '@youzan/utils/browser/ua';
import goodsParser from './parser/goods-parser';
import { DetailGlobal } from '../types/global';

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
} = _global as DetailGlobal;

let goodsData = {};

try {
  goodsData = JSON.parse(unescape((_global as DetailGlobal).goodsData));
  // clone 一下，方便查看后端返回数据
  (_global as DetailGlobal).goodsData = cloneDeep(goodsData);
} catch (error) {
  // TODO 处理异常，进入异常页面
}

const parsedGoodsData = goodsParser(goodsType, goodsData);

const state = {
  kdtId: +kdtId,

  design,

  goodsType,

  goodsData: parsedGoodsData,

  shopMetaInfo,

  shopConfig: mapKeysToCamelCase({
    ...shopConfig,
    ...shopConfigs,
    pointsName: visPointsName,
  }),

  shopLifeStatus: lifecycleStatus,

  mpData: mapKeysToCamelCase(mpData),

  mpFollowed,

  env: {
    ...mapKeysToCamelCase(platformInfo),

    ...miniprogram,

    isMobile: platformInfo.is_mobile && !navigator.userAgent.toLowerCase().includes('windowswechat'),

    weappVersion,

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
};

export default state;
