import accMul from '@youzan/utils/number/accMul';
import { IBoostDetail } from '../components/boost-setting-field/types';

/**
 * 从路由路径获取进入页面类型
 * @param routePath 当前匹配路由，route.path
 * @return 页面类型
 */

export function getEventEditType(routePath?: string) {
  if (routePath === 'edit/:id') return 'edit';
  if (routePath === 'detail/:id') return 'detail';
  if (routePath === 'add/:id') return 'copy';
  return 'add';
};

// /**
//  * 编辑活动 - 根据开始时间和结束时间来判断活动状态
//  * @param startTime (type: number) 开始时间（时间戳）
//  * @param endTime (type: number) 结束时间（时间戳）
//  */

// export function getEditPageEventStatus(startTime: number, endTime: number) {
//   if (!startTime || !endTime) {
//     return undefined;
//   }
//   const now = new Date().getTime();
//   if (startTime > now) {
//     return EventStatus.notStarted;
//   }
//   if (endTime < now) {
//     return EventStatus.ended;
//   }
//   if (startTime <= now && endTime > now) {
//     return EventStatus.ongoing;
//   }
// }

/**
 * Easyform数据结构转化为实际提交数据结构
 */

export function formData2submitData(data) {
  const {
    name,
    time: [startTime, endTime],
    courseSelect: {
      eventCourseType,
      courseList,
    },
    boostSetting: {
      enableNoBoost,
      boostDetail,
    },
    needInfoCollect,
    collectInfo,
    posterSelect: {
      backgroundType,
      backgroundUrl,
    },
  } = data || {};

  const {
    infoCollect,
    needVerifyCode,
  } = collectInfo || {};

  const params = {
    rangeType: eventCourseType,
    goodsIds: courseList && courseList.map(course => course.goodsId),
    bgUrl: backgroundUrl,
    bgType: backgroundType,
    baseInfo: {
      endAt: endTime,
      name,
      startAt: startTime,
    },
    needCollectInfo: needInfoCollect,
    collectInfo: needInfoCollect ? {
      attributeIds: infoCollect.customizeItems,
      needVerifyCode,
    } : null,
    firstPhaseNeedHelp: enableNoBoost,
    helpPhases: boostDetail.map((phase: IBoostDetail) => ({
      ...phase,
      helpCnt: Number(phase.helpCnt),
      amount: accMul(Number(phase.amount), 100),
    })),
  };

  return params;
};

/**
 * 表单提交数据结构转化为Easyform数据结构
 */

export function submitData2formData(data) {
  if (!data) {
    return {};
  }
  const {
    rangeType: eventCourseType,
    goodsIds: courseList,
    bgUrl: backgroundUrl,
    bgType: backgroundType,
    baseInfo: {
      endAt: endTime,
      name,
      startAt: startTime,
    },
    needCollectInfo: needInfoCollect,
    attributeIds,
    needVerifyCode,
    firstPhaseNeedHelp,
    helpPhases,
  } = data || {};

  const params = {
    name,
    time: [startTime, endTime],
    courseSelect: {
      eventCourseType,
      courseList,
    },
    boostSetting: {
      enableNoBoost: firstPhaseNeedHelp,
      boostDetail: helpPhases.map(phase => ({
        ...phase,
        amount: String(phase.amount / 100),
      })),
    },
    needInfoCollect,
    collectInfo: {
      infoCollect: { customizeItems: attributeIds },
      needVerifyCode,
    },
    posterSelect: {
      backgroundType,
      backgroundUrl,
    },
  };

  return params;
};

/**
 * 解析sku价格
 */
export const parsePriceRange = (priceList: string[] | number[]) => {
  if (!Array.isArray(priceList) || priceList.length === 0) {
    return '-';
  }
  if (priceList[0] === priceList[priceList.length - 1]) { // 最高价
    return (Number(priceList[0]) / 100.0).toFixed(2);
  }
  return `${(Number(priceList[0]) / 100.0).toFixed(2)} - ${(Number(priceList[priceList.length - 1]) / 100.0).toFixed(2)}`;
};
