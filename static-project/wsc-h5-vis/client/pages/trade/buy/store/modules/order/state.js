import Args from '@youzan/utils/url/args';
import { get } from 'lodash';

const eduTypeMap = {
  LIVE_ROOM: 'live_marketing',
};
const NO_RESULT = { fromId: undefined, fromType: undefined };
const originType = analyzeEdu();
export const state = {
  // 订单相关
  order: {
    orderNo: undefined,
    bookKey: Args.get('book_key') || undefined,
    channelType: Args.get('channel_type') || undefined,
    // 来源相关
    fromId: Args.get('from_id') || originType.fromId || undefined,
    fromType: Args.get('from_type') || originType.fromType || undefined,

    items: get(_global, 'prepare.orderCreation.items', []),

    // 订单是否包含赠品
    hasPresentGoods: false,
  },
};

export const assignOrderData = (state, orderData) => {
  Object.assign(state.order, {
    hasPresentGoods: orderData.hasPresentGoods || false,
  });
};

/**
 * @description 解析URl中的edu参数，格式为edu=type::key
 * @return {{fromId: string; fromType: string}}
 */
function analyzeEdu() {
  const originStr = Args.get('edu');
  if (originStr) {
    const [type, id] = originStr.split('::');
    const res = {
      fromId: id,
      fromType: eduTypeMap[type] || type,
    };
    if (res.fromType !== undefined) return res;
  }
  return NO_RESULT;
}
