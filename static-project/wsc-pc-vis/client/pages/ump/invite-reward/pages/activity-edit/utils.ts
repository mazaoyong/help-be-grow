import { POINTS_NAME } from '@ability-center/common';
import {
  RewardTypeEnum,
  IRewardItem,
} from 'definitions/api/owl/pc/CommonActivityPCFacade/getRewardByPage';
import { AwardValue } from './components/reward-item';
import {
  NodeType,
  NodeLabel,
  AwardsValue,
  NodeTypeNumber,
} from './components/old-student-reward-field';
import { StudentAwardSetting, NewStudentRewardDisplaySettingType } from '../../types';

/**
 * 从路由路径获取进入页面类型
 * @param routePath 当前匹配路由，route.path
 * @return 页面类型
 */

export function getEditType(routePath: string) {
  if (routePath === 'edit/:id') return 'edit';
  if (routePath === 'detail/:id') return 'detail';
  if (routePath === 'add/:id') return 'copy';
  return 'add';
}

export function getAwardTip({ pointCount, couponList = [], presentList = [] }: AwardValue) {
  let tip: string[] = [];
  if (couponList.length > 0) {
    let couponListText = couponList.map(item => {
      return `${item.quantity}张${item.title}`;
    });
    tip.push(couponListText.join('、'));
  }
  if (pointCount) {
    tip.push(`${pointCount}${POINTS_NAME}`);
  }
  if (presentList.length > 0) {
    const presentListText = presentList.map(item => {
      return `${item.quantity}个${item.title}`;
    });
    tip.push(presentListText.join('、'));
  }
  return tip.length > 0 ? tip.join('、') : '';
}

export function getRule(awards) {
  let rule = '';
  let orderNo = 0;
  if (awards[NodeType.SHARE]) {
    const { couponList, presentList, pointCount } = awards[NodeType.SHARE];
    orderNo += 1;
    rule += `${orderNo}、老学员分享转介绍活动后，即可获得${getAwardTip({
      pointCount,
      couponList,
      presentList,
    })};\n`;
  }
  if (awards[NodeType.RECEIVE]) {
    const { couponList, presentList, pointCount } = awards[NodeType.RECEIVE];
    orderNo += 1;
    rule += `${orderNo}、被介绍的新学员领取新学员奖励后，介绍人老学员即可获得${getAwardTip({
      pointCount,
      couponList,
      presentList,
    })}；\n`;
  }
  if (awards[NodeType.EXPREIENCE]) {
    const { couponList, presentList, pointCount } = awards[NodeType.EXPREIENCE];
    orderNo += 1;
    rule += `${orderNo}、被介绍的新学员有课程顾问跟进中，介绍人老学员即可获得${getAwardTip({
      pointCount,
      couponList,
      presentList,
    })}；\n`;
  }
  if (awards[NodeType.BUY]) {
    const { couponList, presentList, pointCount } = awards[NodeType.BUY];
    orderNo += 1;
    rule += `${orderNo}、被介绍的新学员报名正式课程后，介绍人老学员即可获得${getAwardTip({
      pointCount,
      couponList,
      presentList,
    })}；\n`;
  }
  return rule;
}

export const validAwardItem = ({
  couponList = [],
  presentList = [],
  pointCount = 0,
  checked = [],
}: AwardValue) => {
  if (checked.length === 0) return false;
  if (
    (checked.includes(RewardTypeEnum.COUPON) && couponList.length === 0) ||
    (checked.includes(RewardTypeEnum.PRESENT) && presentList.length === 0) ||
    (checked.includes(RewardTypeEnum.POINT) && pointCount === 0)
  ) {
    return false;
  }
  return true;
};

export const validAwards = awards => {
  if (awards[NodeType.SHARE]) {
    if (!validAwardItem(awards[NodeType.SHARE])) {
      return false;
    }
  }
  if (awards[NodeType.RECEIVE]) {
    if (!validAwardItem(awards[NodeType.RECEIVE])) {
      return false;
    }
  }
  if (awards[NodeType.EXPREIENCE]) {
    if (!validAwardItem(awards[NodeType.EXPREIENCE])) {
      return false;
    }
  }
  if (awards[NodeType.BUY]) {
    if (!validAwardItem(awards[NodeType.BUY])) {
      return false;
    }
  }
  return true;
};

export const getAwardNodeLabel = type => {
  return NodeLabel[type] || '';
};

export const transAwards = awards => {
  const couponList: IRewardItem[] = [];
  const presentList: IRewardItem[] = [];
  let pointCount = 0;
  awards.map(item => {
    if (item.type === RewardTypeEnum.COUPON) {
      couponList.push({
        id: item.awardBizId,
        name: item.name,
        quantity: item.awardAmount,
      });
    }
    if (item.type === RewardTypeEnum.PRESENT) {
      presentList.push({
        id: item.awardBizId,
        name: item.name,
        quantity: item.awardAmount,
      });
    }
    if (item.type === RewardTypeEnum.POINT) {
      pointCount = item.awardAmount;
    }
  });
  return {
    pointCount,
    couponList,
    presentList,
  };
};

export const transAwardItemToPost = (list, type: RewardTypeEnum) => {
  return list.map(item => {
    return {
      awardBizId: '' + item.id,
      awardAmount: item.quantity,
      type,
    };
  });
};

export const transOldStuAwardsToPost = (awards: AwardsValue) => {
  const postAwards: StudentAwardSetting[] = [];
  Object.keys(awards).map(item => {
    let awardItem = awards[item];
    postAwards.push({
      awards: [
        ...transAwardItemToPost(awardItem.couponList, RewardTypeEnum.COUPON),
        ...transAwardItemToPost(awardItem.presentList, RewardTypeEnum.PRESENT),
        ...transAwardItemToPost(
          awardItem.pointCount
            ? [
              {
                id: '',
                quantity: awardItem.pointCount,
              },
            ]
            : [],
          RewardTypeEnum.POINT,
        ),
      ],
      awardDesc: {
        awardValueDesc: '',
        awardTotalValue: 0,
        descriptionMode: 1,
        freestyleDesc: awardItem.name,
      },
      awardNode: NodeTypeNumber[item],
    });
  });
  return postAwards;
};

export const transOldStuAwardsFromGet = (awards: StudentAwardSetting[]) => {
  const oldStudentAwards = {};
  awards.map(item => {
    const { awards, awardNode, awardDesc } = item;
    const { pointCount, couponList, presentList } = transAwards(awards);
    oldStudentAwards[NodeTypeNumber[awardNode]] = {
      pointCount,
      couponList,
      presentList,
      name: awardDesc.freestyleDesc,
    };
  });
  return oldStudentAwards;
};

export const getNewStuRewardTip = ({ newStudentRewardDisplaySetting, newStudentRewardSetting }) => {
  const { title = '', type = 0, price = 0, priceLabel } = newStudentRewardDisplaySetting;
  const { couponList, presentList } = newStudentRewardSetting;
  let newStudentAwardDesc = getAwardTip({
    couponList,
    presentList,
  });
  switch (type) {
    case NewStudentRewardDisplaySettingType.priceAndTitle:
      return `价值 ${price} 元 ${priceLabel}`;
    case NewStudentRewardDisplaySettingType.onlyTitle:
      return title;
    case NewStudentRewardDisplaySettingType.rewardDesc:
      return newStudentAwardDesc;
    default:
      break;
  }
  return '';
};
