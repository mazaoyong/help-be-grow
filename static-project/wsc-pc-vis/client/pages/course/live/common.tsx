import formatLargeNumber from '@youzan/utils/money/formatLargeNumber';

// 获取直播剩余时长对应数据
export const getVideoTimeSurplusData = (state: {
  status?: 1 | 2;
  surplusTime?: number;
} = {}) => {
  const { surplusTime = 0, status = 1 } = state;
  const isYZEdu = _global.isYZEdu;

  // 参加补贴计划
  if (status === 2) {
    return {
      value: '流量补贴中',
      tips: '流量补贴中，补贴期内可免费进行直播。',
    };
  }

  // 教育店铺打烊/试用期等
  if (isYZEdu) {
    return {
      value: formatLargeNumber(surplusTime),
      tips: '流量补贴中，订购有赞教育可免费进行直播。',
    };
  }

  return {
    value: formatLargeNumber(surplusTime),
    tips: '当学员观看直播或回放时，将消耗观看时长。普通直播的回放不消耗观看时长。',
    rechargeUrl: `${_global.url.v4}/subscribe/appmarket/appdesc?id=50190`,
  };
};
