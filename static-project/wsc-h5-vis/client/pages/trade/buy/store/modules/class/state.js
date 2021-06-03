import { get, uniqBy } from 'lodash';
import YZSessionStorage from '@youzan/utils/browser/session_storage';
import { ACTIVITY_TYPE } from '@/constants/ump/activity-type';
import { NeedVerifyCodeEnum, ShowCollectInfoEnum } from '@/constants/course/collect-info-type';

const showCollectInfo = get(
  _global,
  'prepare.showCollectInfo',
  ShowCollectInfoEnum.SHOW,
);

export const state = {
  // 学员信息
  student: {
    chosenId: undefined,
    list: [],
    isNeedRefresh: false,
  },

  // 信息采集
  infoCollect: {
    data: {},
    settings: [],
    needVerifyCode: false,
  },

  // 下单页是否需要信息采集
  showCollectInfo: showCollectInfo === ShowCollectInfoEnum.SHOW,

  // 预约信息
  appointment: {
    time: [],
  },

  // 上课地点信息
  classAddress: {
    chosenId: undefined,
    list: [],
    // 地点信息是否降级
    down: false,
  },

  // 上课时间信息
  classTime: {
    chosenTime: undefined,
  },
};

// 从session里取填的数据
const cacheTime = YZSessionStorage.getItem('selectedDate');
if (cacheTime) {
  state.classTime.chosenTime = new Date(cacheTime);
}

let cacheAddress = sessionStorage.getItem('selectedAddressItem') || '{}';
cacheAddress = JSON.parse(cacheAddress);
if (cacheAddress.id) {
  state.classAddress.chosenId = cacheAddress.id;
}

export const assignOrderData = (state, orderData) => {
  // 拼接信息采集字段
  assignCollectInfo(state, orderData);
};

function assignCollectInfo(state, orderData) {
  const isPackageBuy = orderData.activityType === ACTIVITY_TYPE.PACKAGE_BUY;
  const orderItems = orderData.orderItems || [];
  const goodsList = isPackageBuy ? orderItems : orderItems.slice(0, 1);
  const needVerifyCode = goodsList.some(
    goods =>
      get(
        goods,
        'collectInfoSetting.needVerifyCode',
        NeedVerifyCodeEnum.UNNEED,
      ) === NeedVerifyCodeEnum.NEED,
  );

  let settings = goodsList
    .filter(
      goods => get(goods, 'collectInfoSetting.customizeItems', []).length > 0
    )
    .reduce(
      (settings, goods) =>
        settings.concat(goods.collectInfoSetting.customizeItems),
      []
    );
  settings = uniqBy(settings, 'attributeId');

  Object.assign(state.infoCollect, {
    settings,
    needVerifyCode,
  });
}
