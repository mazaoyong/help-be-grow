import { get } from 'lodash';
import format from '@youzan/utils/money/format';
import { GOODS_TYPE } from '@/constants/course/goods-type';
import { ACTIVITY_TYPE } from '@/constants/ump/activity-type';
import { ACTIVITY_STATUS } from '@/constants/ump/activity-status';
import pay from '@/pages/course/detail/store/pay';
import selectLadder from './select-ladder';

export default function(activityData, state) {
  const { goodsData, goodsType, kdtId } = state;
  let skuButtons = [{
    text: '下一步',
    action: createGroup,
  }];

  function createGroup(payload) {
    // 参团时不用选择阶梯，直接调用 pay 方法，有 sku 会自动打开 sku，sku 中已经处理了在有 groupAlias 时不选择拼团类型
    // 或有 sku 时，无论是否参团，都需要选择 sku
    if (payload || goodsData.sku.hasSku) {
      pay(ACTIVITY_TYPE.LADDER_GROUPON, payload, 'ladder-groupon-create');
      return;
    }
    // 无 sku 且不是参团时，需要选择拼团类型
    selectLadder(get(goodsData, 'pictures[0].url', ''), activityData.ladder).then(ladder => {
      state.selectedGrouponLadder = ladder;
      pay(ACTIVITY_TYPE.LADDER_GROUPON, null, 'ladder-groupon-create');
    });
  }

  function originBuy() {
    pay(ACTIVITY_TYPE.NO_ACTIVITY, null, 'ladder-groupon-origin');
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
        url: `/wscvis/ump/groupon/groupon-detail?alias=${goodsData.alias}&group_alias=${activityData.joinedGroup.alias}&activity_type=${ACTIVITY_TYPE.LADDER_GROUPON}&kdt_id=${kdtId}`,
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
