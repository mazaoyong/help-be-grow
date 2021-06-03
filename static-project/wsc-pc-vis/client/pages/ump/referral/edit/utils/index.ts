import { isHqStore } from '@youzan/utils-shop';
import { getTime } from 'date-fns';
import formatDate from 'zan-utils/date/formatDate';
import { RewardTypeEnum } from 'definitions/api/owl/pc/CommonActivityPCFacade/getRewardByPage';
import accMul from '@youzan/utils/number/accMul';
import fen2yuan from 'fns/fen2yuan';
import { getSelectedPresentLength } from 'components/field/present-select';
import {
  BgTypeEnum,
  DistributorAddOnEnum,
  ICreateActivityParams,
  IFormParams,
  IPhasedRewardItem,
  RewardSettingEnum,
} from '../../types';
import { DateFormat, DEFAULT_POSTER_BG_URL, MAX_PRESENT_SELECT } from '../../constants';
import { getUuid } from '../../utils';

/**
 * 从路由路径获取进入页面类型
 * @param routePath 当前匹配路由，route.path
 * @return 页面类型
 */

export function getEventEditType(routePath?: string) {
  if (routePath === 'edit/:id/:status') return 'edit';
  if (routePath === 'detail/:id/:status') return 'detail';
  if (routePath === 'copy/:id/:status') return 'copy';
  return 'add';
}

/**
 * Easyform数据结构转化为实际提交数据结构
 */

export function formData2submitData(data?: IFormParams) {
  if (!data) return;

  const {
    name,
    time,
    courseSelect,
    posterSelect: { backgroundType, backgroundUrl },
    refereeType,
    referrerType,
    rewardSettings,
    commissionRate,
    discountRate,
    distributorAddOn,
    phasedRewardDetails: rewardList,
    shopInfo,
    commissionRewardType,
    discountValue,
    commissionValue,
  } = data;
  const phasedRewardDetails: IPhasedRewardItem[] = [];

  // 重组阶梯任务奖励
  if (rewardList && rewardList.length) {
    rewardList.forEach((v, i) => {
      const checked = v.checked || [];
      const listItem: IPhasedRewardItem = {
        bonusPoint: checked.includes(RewardTypeEnum.POINT) ? v.bonusPoint : 0,
        couponList: checked.includes(RewardTypeEnum.COUPON) ? v.couponList : [],
        helpCount: v.helpCount,
        presentList: checked.includes(RewardTypeEnum.PRESENT) ? v.presentList : [],
        rewardName: v.rewardName,
        phaseNo: i + 1,
      };

      phasedRewardDetails.push(listItem);
    });
  }

  const params: ICreateActivityParams = {
    name,
    startAt: getTime(time[0]),
    endAt: getTime(time[1]),
    goodsId: courseSelect.id,
    bgType: backgroundType,
    bgUrl: backgroundUrl || DEFAULT_POSTER_BG_URL,
    referrerType,
    refereeType,
    commissionRewardType,
    discountValue: discountValue && accMul(Number(discountValue), 100),
    commissionValue: commissionValue && accMul(Number(commissionValue), 100),
    commissionRate: Math.round(Number(commissionRate || 0)),
    discountRate: Math.round(Number(discountRate || 0)),
    phasedRewardDetails,
    shopInfo,
    /** 是否有分佣奖励 */
    hasCommissionReward: rewardSettings.includes(RewardSettingEnum.COMMISSION_REWARD),
    /** 是否为阶梯奖励 */
    hasPhasedReward: rewardSettings.includes(RewardSettingEnum.PHASED_REWARD),
    /** 是否和销售员叠加 */
    hasDistributorAddOn: distributorAddOn.includes(DistributorAddOnEnum.ON),
  };

  if (isHqStore && shopInfo) {
    params.designateType = shopInfo.applicableCampusType === 0 ? 2 : 1;
    params.designatedKdtIds = shopInfo.applicableCampusList.map(({ kdtId }) => kdtId);
  }

  return params;
}

/**
 * 表单提交数据结构转化为Easyform数据结构
 */

export function submitData2formData(data) {
  if (!data) return;
  const {
    name,
    startAt,
    endAt,
    goods,
    bgType,
    bgUrl,
    refereeType,
    referrerType,
    commissionRewardType,
    decreasePrice: discountValue,
    commissionPrice: commissionValue,
    commissionRate,
    discountRate,
    hasCommissionReward,
    hasPhasedReward,
    hasDistributorAddOn,
    phasedRewardDetails: rewardList,
    shopInfo,
  } = data;
  const phasedRewardDetails: IPhasedRewardItem[] = [];
  const rewardSettings: RewardSettingEnum[] = [];

  // 兼容老数据
  if (hasCommissionReward || (commissionRate && discountRate)) {
    rewardSettings.push(RewardSettingEnum.COMMISSION_REWARD);
  }

  if (hasPhasedReward) {
    rewardSettings.push(RewardSettingEnum.PHASED_REWARD);
  }

  if (rewardList && rewardList.length) {
    rewardList.forEach((v) => {
      const checked: RewardTypeEnum[] = [];
      if (v.bonusPoint) {
        checked.push(RewardTypeEnum.POINT);
      }
      if (v.couponList && v.couponList.length) {
        checked.push(RewardTypeEnum.COUPON);
      }
      if (v.presentList && v.presentList.length) {
        checked.push(RewardTypeEnum.PRESENT);
      }
      const listItem: IPhasedRewardItem = {
        ...v,
        checked,
        uuid: getUuid(),
      };

      phasedRewardDetails.push(listItem);
    });
  }

  const params = {
    name,
    time: [formatDate(startAt, DateFormat), formatDate(endAt, DateFormat)],
    courseSelect: goods,
    posterSelect: {
      backgroundType: bgType,
      backgroundUrl: bgType === BgTypeEnum.CUSTOMIZE ? bgUrl : '',
    },
    refereeType,
    referrerType,
    rewardSettings,
    commissionRewardType,
    discountValue: discountValue && fen2yuan(discountValue),
    commissionValue: commissionValue && fen2yuan(commissionValue),
    commissionRate,
    discountRate,
    distributorAddOn: hasDistributorAddOn ? [DistributorAddOnEnum.ON] : [],
    phasedRewardDetails,
    shopInfo,
  };

  return params;
}

export function checkRewardContentIsValid(value: IPhasedRewardItem[]) {
  return value.every((v, i) => {
    const checked = v.checked || [];
    const presentList = v.presentList || [];
    return (
      v.helpCount &&
      !!checked.length &&
      (i < 1 || Number(value[i].helpCount || 0) > Number(value[i - 1].helpCount || 0)) &&
      (!checked.includes(RewardTypeEnum.POINT) || !!v.bonusPoint) &&
      (!checked.includes(RewardTypeEnum.COUPON) || !!(v.couponList || []).length) &&
      (!checked.includes(RewardTypeEnum.PRESENT) ||
        getSelectedPresentLength(presentList) <= MAX_PRESENT_SELECT)
    );
  });
}

export function checkGoodsPriceEqualsZero(data: {
  rewardSettings: RewardSettingEnum[];
  courseSelect: { price: number };
}) {
  const { rewardSettings, courseSelect } = data;
  return (
    (courseSelect || {}).price === 0 &&
    (rewardSettings || []).includes(RewardSettingEnum.COMMISSION_REWARD)
  );
}
