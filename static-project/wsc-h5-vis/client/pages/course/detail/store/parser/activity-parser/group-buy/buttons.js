import format from '@youzan/utils/money/format';
import { GOODS_TYPE } from '@/constants/course/goods-type';
import { ACTIVITY_TYPE } from '@/constants/ump/activity-type';
import { ACTIVITY_STATUS } from '@/constants/ump/activity-status';
import { createGroup as createGroupUtil, originBuy as originBuyUtil } from '../default/buttons/utils';

export default function(activityData, state) {
  const { goodsData, goodsType, kdtId } = state;
  let skuButtons = [{
    text: '下一步',
    action: createGroup,
  }];

  function createGroup(payload) {
    createGroupUtil({ payload, kdtId });
  }

  function originBuy() {
    originBuyUtil(kdtId);
  }

  if (activityData.status === ACTIVITY_STATUS.UNSTART) {
    return {
      buttons: [{
        text: '直接报名',
        action: originBuy,
      }],
    };
  }

  if (activityData.status === ACTIVITY_STATUS.GOING) {
    let buttons = [{
      text: [`￥ ${+format(goodsData.sku.minPrice, true, false)}`, '直接报名'],
      action: originBuy,
    }];

    if (activityData.isJoined &&
      !activityData.joinedGroup.isGrouponSuccess &&
      !activityData.joinedGroup.isGrouponFailed) {
      const toGroupBtn = {
        text: '查看我的团',
        url: `/wscvis/ump/groupon/groupon-detail?alias=${goodsData.alias}&group_alias=${activityData.joinedGroup.alias}&activity_type=${ACTIVITY_TYPE.GROUP_BUY}&kdt_id=${kdtId}`,
      };
      if (goodsType === GOODS_TYPE.COURSE) {
        buttons.push(toGroupBtn);
      } else {
        buttons = [toGroupBtn];
      }
    } else {
      buttons.push({
        text: [`￥ ${+format(activityData.sku.minPrice, true, false)}`, '一键开团'],
        action: createGroup,
      });
    }

    return {
      buttons,
      skuButtons,
    };
  }
}
