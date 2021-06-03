import { ACTIVITY_TYPE } from '@/constants/ump/activity-type';
import { checkCapitalLossForGroupBuy } from '@/common/log/biz-log';

import store from '../index';

export default function(params, payload) {
  const { activityData } = store.state;
  params.umpInfo.promotionType = ACTIVITY_TYPE.GROUP_BUY;
  params.umpInfo.promotionId = activityData.activityId;
  if (payload && payload.groupAlias) {
    params.umpInfo.groupAlias = payload.groupAlias;
  }
  if (payload && payload.config) {
    Object.assign(params, {
      config: payload.config,
    });
  }

  // 对发起拼团做资损的校验
  checkCapitalLossForGroupBuy({ promotionId: activityData.activityId });
}
