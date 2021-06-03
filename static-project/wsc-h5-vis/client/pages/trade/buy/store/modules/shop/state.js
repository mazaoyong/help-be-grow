import { get } from 'lodash';

// umpInfo 只有prepare里有
const umpInfo = get(_global, 'prepare.umpInfo', {});

export const state = {
  shop: {
    activityNames: [],
    activityType: 0,
    activityId: umpInfo.activityId,
    activityAlias: umpInfo.activityAlias,
    pointsName: _global.visPointsName || '积分',
    userPoints: _global.userPoints || 0,
  },
};

export const assignOrderData = (state, orderData) => {
  Object.assign(state.shop, {
    activityType: orderData.activityType,
    activityNames: orderData.activityNames || [],
  });
};
